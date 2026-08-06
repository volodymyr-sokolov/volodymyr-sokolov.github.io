/* =========================================================================
   pattern3d.js — 3-D radiation-pattern viewer for the Antenna Atlas.

   Extends window.AntennaLab (AL) with:
     AL.panel3dHTML(id)      → markup for one antenna's 3-D panel
     AL.draw3d(id, opts)     → (re)build + draw it
     AL.pattern3dMetrics(..) → the numeric model behind it (headless-safe)

   Follows horn_antenna_pattern.html: the full 3-D lobe is reconstructed from
   the two principal-plane cuts,
       F²(θ,φ) = F_H²(θ)·cos²φ + F_E²(θ)·sin²φ,
   drawn as a dB-radial surface (0 dB → r = 1, −40 dB → r = 0, the same scale
   as the 2-D polar plots) with three labelled direction arrows —
       X = H-plane (amber) · Y = E-plane (teal) · Z = boresight (grey)
   — and the two cutting planes that the 2-D charts are slices of.

   Differences from the horn page, per the brief:
     • no Three.js / no CDN — a self-contained painter's-algorithm renderer on
       a 2-D canvas, so every page still runs offline from file://;
     • a wider parameter strip: λ, G, D₀, A_e in λ², beam solid angle, both
       HPBWs and the antenna's own size;
     • everything that can be is expressed **in wavelengths** — A_e in λ² and
       the antenna's principal dimension in λ. (The drawn-to-scale λ ruler
       lives on the antenna SCHEMATIC, where a length scale is meaningful;
       the lobe's radius here is a pattern scale, not a distance.)

   Geometry: θ is measured from boresight (the Z axis, the pattern maximum for
   broadside antennas), φ from the X (H-plane) axis. fnE/fnH take DEGREES, the
   same convention as fnBeam everywhere else in the atlas.
   ========================================================================= */
(function(){
  var AL = window.AntennaLab;
  if(!AL){ return; }

  var FLOOR_DB = -40;              // radial scale bottom, matches the 2-D plots
  var N_THETA  = 40, N_PHI = 72;   // display mesh (interactive)
  var N_TH_INT = 180, N_PH_INT = 180; // integration mesh (metrics only)

  function tr(en,uk){ return AL.tr(en,uk); }

  /* ---------------------------------------------------------------- colour */
  // Resolve a CSS custom property so the canvas follows the light/dark theme.
  function cssVar(name, fallback){
    try{
      if(typeof getComputedStyle!=='function') return fallback;
      var v=getComputedStyle(document.documentElement).getPropertyValue(name);
      v=v?v.trim():'';
      return v||fallback;
    }catch(e){ return fallback; }
  }
  function hsl(h,s,l,a){ return 'hsla('+(h*360).toFixed(0)+','+(s*100).toFixed(0)+'%,'+(l*100).toFixed(0)+'%,'+a+')'; }
  // dB → surface colour: deep blue-green at the floor, bright green at the peak
  // (the same ramp the horn page uses, expressed in HSL).
  function dbColour(db){
    var t=(db-FLOOR_DB)/(0-FLOOR_DB); t=t<0?0:(t>1?1:t);
    return hsl(0.42-0.30*(1-t), 0.62, 0.20+0.40*t, 0.95);
  }

  /* ------------------------------------------------------- pattern sampling */
  /* Signed principal-plane lookup. On the −φ half of a plane a 'full' pattern
     is read at (360−θ) — fnBeam is 360-periodic there, so steered/asymmetric
     beams stay asymmetric — while a 'half' pattern is mirrored, which is
     exactly what polarTraceHalf does for the 2-D semicircular charts. */
  function cutter(fn, plot){
    var mirror = (plot==='half');
    return function(thDeg, positiveSide){
      var d = (positiveSide||mirror) ? thDeg : (360-thDeg);
      var v = fn(d);
      return Math.abs(isFinite(v)?v:0);
    };
  }

  /* Where a cut falls through `thr`, by bisection. degIn is inside the lobe
     (above thr), degOut outside it; both are signed cut angles. */
  function bisectCross(cutFn, degIn, degOut, thr){
    var lo=degIn, hi=degOut;
    for(var it=0; it<40; it++){
      var mid=(lo+hi)/2;
      if(cutFn(Math.abs(mid), mid>=0) > thr) lo=mid; else hi=mid;
    }
    return (lo+hi)/2;
  }

  /* Full-width analysis of one principal-plane cut across BOTH sides of
     boresight. AL.analyzePattern only scans 0..maxDeg, which halves the
     beamwidth of a beam sitting on the axis — so the two-sided scan lives
     here. Returns {hpbw, sll, peakDeg} with peakDeg signed. */
  function analyzeCut(cutFn, maxDeg){
    var step=0.2, n=Math.round(2*maxDeg/step)+1;
    var a=new Float64Array(n), peak=0, pk=0, i;
    for(i=0;i<n;i++){
      var sDeg=-maxDeg+i*step;
      a[i]=cutFn(Math.abs(sDeg), sDeg>=0);
      if(a[i]>peak){ peak=a[i]; pk=i; }
    }
    if(peak<=1e-12) return {hpbw:NaN, sll:null, peakDeg:0};
    // A dipole-like cut peaks at BOTH 0° and ±180°; take the maximum nearest
    // boresight so the main lobe is bracketed instead of the edge of the scan.
    var bestOff=Infinity;
    for(i=0;i<n;i++){
      if(a[i] >= peak*(1-1e-9)){
        var off=Math.abs(-maxDeg+i*step);
        if(off<bestOff){ bestOff=off; pk=i; }
      }
    }
    var thr=peak*Math.pow(10,-3/20);
    var l=pk; while(l>0 && a[l]>thr) l--;
    var r=pk; while(r<n-1 && a[r]>thr) r++;
    // A scan that runs off either end without crossing −3 dB has no beamwidth
    // to report (an omnidirectional cut, or a lobe wider than the swept range).
    var hpbw;
    if(a[l]>thr || a[r]>thr){
      hpbw=NaN;
    } else {
      // Bisect each crossing on the continuous cut rather than interpolating on
      // the grid: a 120 λ dish has a 0.5° beam, narrower than the 0.2° scan
      // step, so grid interpolation alone would quantise it badly.
      var deg=function(k){ return -maxDeg + k*step; };
      var lo=bisectCross(cutFn, deg(pk), deg(l),   thr);
      var hi=bisectCross(cutFn, deg(pk), deg(r),   thr);
      hpbw=hi-lo;
    }
    var slv=0;
    for(i=1;i<n-1;i++){
      if(i>=l && i<=r) continue;
      if(a[i]>=a[i-1] && a[i]>=a[i+1] && a[i]>slv) slv=a[i];
    }
    return {hpbw:hpbw, sll:(slv>0?20*Math.log10(slv/peak):null),
            peakDeg:-maxDeg+pk*step};
  }

  /* Sample |F(θ,φ)| onto a (nTheta+1)×(nPhi+1) grid.

     Two reconstructions, picked by the antenna's H-plane rule:

     sym='blend' (a beam on boresight — horns, dishes, arrays, patches). Both
       principal cuts pass through boresight, so the horn page's combination
         F²(θ,φ) = F_H²(θ)·cos²φ + F_E²(θ)·sin²φ
       applies. With F_H = F_E this degenerates to a body of revolution about
       the boresight, which is what 'same' antennas want.

     sym='omni' (dipoles, monopoles, loops, discones, collinears …). Here the
       azimuth cut is a CIRCLE, not a cut through boresight, so the blend above
       would be wrong — it would read the omni circle as a boresight cut and
       flatten the lobe. The real pattern is a body of revolution about the
       antenna's own axis, which sits 90° away from the beam maximum in the
       E-plane cut; we take the Y axis to be that direction. A direction (θ,φ)
       is at angle γ from Y with cosγ = sinθ·sinφ, so
         F(θ,φ) = F_E(a_peak + 90° − γ).
       The peak offset matters: most pages put the beam at 0° in the E cut, but
       some (the discone) measure the cut from the zenith and peak near 95°.

     plot:'half' → only the forward hemisphere is modelled (no back radiation),
     exactly as the 2-D semicircular plots present it. */
  /* θ sample positions for the DISPLAY mesh. A pencil beam only a fraction of
     a degree wide would vanish between uniformly spaced samples, so when the
     beam is narrow the grid is warped (θ ∝ tᵖ) to crowd samples into the lobe
     while still reaching θ_max. Broad patterns keep a uniform grid. */
  function thetaGrid(thetaMax, n, hpbw){
    var g=new Float64Array(n+1), i;
    var p=1;
    if(isFinite(hpbw) && hpbw>0 && hpbw < thetaMax/6){
      // put the first sample at about a sixth of the half-power beamwidth
      p = Math.log((hpbw/6)/thetaMax)/Math.log(1/n);
      p = AL.clamp(p, 1, 6);
    }
    for(i=0;i<=n;i++) g[i]=thetaMax*Math.pow(i/n, p);
    return g;
  }

  function sampleMesh(fnE, fnH, plot, nTheta, nPhi, sym){
    var thetaMax = (plot==='half') ? 90 : 180;
    var cE=cutter(fnE,plot), cH=cutter(fnH,plot);
    var anE=analyzeCut(cE,thetaMax), anH=analyzeCut(cH,thetaMax);
    var hpMin=Math.min(isFinite(anE.hpbw)?anE.hpbw:thetaMax,
                       isFinite(anH.hpbw)?anH.hpbw:thetaMax);
    var TH=thetaGrid(thetaMax, nTheta, hpMin);
    var mag = new Float64Array((nTheta+1)*(nPhi+1)), peak=0;
    var i,j,th,m;

    if(sym==='omni'){
      var aPeak = anE.peakDeg;                             // where the E cut maxes
      for(i=0;i<=nTheta;i++){
        th = TH[i];
        var st0=Math.sin(th*Math.PI/180);
        for(j=0;j<=nPhi;j++){
          var ph = 2*Math.PI*j/nPhi;
          var cosG = AL.clamp(st0*Math.sin(ph), -1, 1);      // angle from the Y axis
          var aDeg = aPeak + 90 - Math.acos(cosG)*180/Math.PI;
          m = cE(Math.abs(aDeg), aDeg>=0);
          if(!isFinite(m)) m=0;
          mag[i*(nPhi+1)+j]=m;
          if(m>peak) peak=m;
        }
      }
      return {mag:mag, peak:(peak>1e-12?peak:1e-12), nTheta:nTheta, nPhi:nPhi,
              thetaMax:thetaMax, TH:TH};
    }

    var eP=new Float64Array(nTheta+1), eM=new Float64Array(nTheta+1),
        hP=new Float64Array(nTheta+1), hM=new Float64Array(nTheta+1);
    for(i=0;i<=nTheta;i++){
      th = TH[i];
      eP[i]=cE(th,true); eM[i]=cE(th,false);
      hP[i]=cH(th,true); hM[i]=cH(th,false);
    }
    for(i=0;i<=nTheta;i++){
      for(j=0;j<=nPhi;j++){
        var phi = 2*Math.PI*j/nPhi, cp=Math.cos(phi), sp=Math.sin(phi);
        var fh = (cp>=0?hP[i]:hM[i]), fe = (sp>=0?eP[i]:eM[i]);
        m = Math.sqrt(fh*fh*cp*cp + fe*fe*sp*sp);
        if(!isFinite(m)) m=0;
        mag[i*(nPhi+1)+j]=m;
        if(m>peak) peak=m;
      }
    }
    return {mag:mag, peak:(peak>1e-12?peak:1e-12), nTheta:nTheta, nPhi:nPhi,
            thetaMax:thetaMax, TH:TH};
  }

  /* ------------------------------------------------------------- the model */
  /* Numeric metrics from the reconstructed 3-D pattern. This is the part that
     is verified headless — it never touches a canvas.
       D₀ = 4π·U_max / ∫∫ U(θ,φ) sinθ dθ dφ   (Simpson in θ, trapezoid in φ)
       Ω_A = 4π/D₀ ;  A_e = D₀·λ²/4π  (reported in λ², i.e. D₀/4π)          */
  function pattern3dMetrics(fnE, fnH, plot, sym){
    var thetaMax = (plot==='half') ? 90 : 180;
    var cE=cutter(fnE,plot), cH=cutter(fnH,plot);
    var anE=analyzeCut(cE, thetaMax), anH=analyzeCut(cH, thetaMax);

    /* Resolution matters more than it looks: a 120 λ Cassegrain has a 0.5°
       beam, and a fixed 0.5°-step mesh steps straight over it — the integral
       then misses the main lobe and D₀ comes out ~7 dB too high (with an
       effective aperture larger than the physical dish, which is impossible).
       So the step is driven by the narrower of the two beamwidths. */
    var hpE=isFinite(anE.hpbw)?anE.hpbw:thetaMax, hpH=isFinite(anH.hpbw)?anH.hpbw:thetaMax;
    var hp=Math.min(hpE,hpH);
    var N=Math.ceil(24*thetaMax/Math.max(hp,0.02));
    N=Math.max(360, Math.min(N, 24000)); if(N%2) N++;

    var integral=0, Umax=0, i, w, u;

    if(sym==='omni'){
      /* A body of revolution about Y: the whole solid-angle integral collapses
         to one dimension in the angle γ from that axis.
             ∫∫U dΩ = 2π ∫₀^π F_E(a_peak + 90° − γ)² sinγ dγ                */
      var aPeak=anE.peakDeg, h=Math.PI/N;
      for(i=0;i<=N;i++){
        var g=h*i, aDeg=aPeak+90-g*180/Math.PI;
        if(plot==='half') aDeg=AL.clamp(aDeg,-thetaMax,thetaMax);
        var f=cE(Math.abs(aDeg), aDeg>=0);
        u=f*f; if(u>Umax) Umax=u;
        w=(i===0||i===N)?1:(i%2?4:2);
        integral += w*u*Math.sin(g);
      }
      integral *= (h/3)*2*Math.PI;
    } else {
      /* Blend mode. The φ integral of F² = F_H²cos²φ + F_E²sin²φ is exact:
         over each quadrant ∫cos²φ = ∫sin²φ = π/4, so
             ∫₀^2π F² dφ = (π/2)·(h₊² + h₋² + e₊² + e₋²)
         which leaves a single θ quadrature — cheap enough to run at whatever
         resolution the beam actually needs. */
      var hR=(thetaMax*Math.PI/180)/N;
      for(i=0;i<=N;i++){
        var th=thetaMax*i/N;
        var eP=cE(th,true), eM=cE(th,false), hP=cH(th,true), hM=cH(th,false);
        var mx=Math.max(eP*eP, eM*eM, hP*hP, hM*hM); if(mx>Umax) Umax=mx;
        var ring=(Math.PI/2)*(hP*hP + hM*hM + eP*eP + eM*eM);
        w=(i===0||i===N)?1:(i%2?4:2);
        integral += w*ring*Math.sin(hR*i);
      }
      integral *= hR/3;
    }

    var D = (integral>1e-15 && Umax>0) ? 4*Math.PI*Umax/integral : 1;
    // front/back over the full sphere (only meaningful for plot:'full')
    var fb=null;
    if(plot!=='half'){
      var back=Math.max(cE(180,true), cH(180,true)), front=Math.sqrt(Umax);
      if(back>1e-9 && front>1e-9) fb=20*Math.log10(front/back);
    }
    return {
      D:D, DdBi:10*Math.log10(D),
      omegaA:4*Math.PI/D,
      aeLam2:D/(4*Math.PI),            // A_e/λ² — dimensionless, "in wavelengths"
      hpbwE:anE.hpbw, hpbwH:anH.hpbw,
      sllE:anE.sll, sllH:anH.sll,
      fbDb:fb, peakDeg:anE.peakDeg
    };
  }

  /* ================================================================ markup */
  function panel3dHTML(id){
    var items = [
      ['lam','λ'],
      ['g','G, <span class="no-caps">dBi</span>'],
      ['d','D₀, <span class="no-caps">dBi</span>'],
      ['ae','A_e / λ²'],
      ['oa','Ω_A, <span class="no-caps">sr</span>'],
      ['hpe','HPBW_E'],
      ['hph','HPBW_H'],
      ['size',tr('size','розмір')]
    ].map(function(it){
      return '<div class="item"><div class="k">'+it[1]+'</div><div class="v sm" id="'+id+'_3d_'+it[0]+'">-</div></div>';
    }).join('');
    return ''+
    '<div class="plane-panel p3d-panel" style="flex:1 1 100%; min-width:300px;">'+
      '<div class="plane-title"><span class="dot" style="background:var(--dim)"></span>'+
        '<span data-en="3D radiation pattern" data-uk="3D діаграма напрямленості">3D radiation pattern</span></div>'+
      '<div class="sub-panel">'+
        '<div class="p3d-formula">F²(θ,φ) = F_H²(θ)·cos²φ + F_E²(θ)·sin²φ '+
          '<span class="p3d-note" data-en="— reconstructed from the two principal cuts; exact on both of them, conservative in between for strongly elliptical beams"'+
          ' data-uk="— відновлено з двох головних перерізів; точно в них самих, занижено між ними для сильно еліптичних променів">'+
          '— reconstructed from the two principal cuts</span></div>'+
        '<div class="p3d-stage" id="'+id+'_3d"></div>'+
        '<div class="p3d-hint" data-en="drag to rotate · shift-drag (or right-drag) to move it around · wheel to zoom · double-click to reset · radius = dB, 0 dB at the outer sphere"'+
          ' data-uk="тягніть — обертання · Shift+тягнення (або права кнопка) — переміщення · колесо — масштаб · подвійний клік — скидання · радіус = дБ, 0 дБ на зовнішній сфері">'+
          'drag to rotate · shift-drag to move it around · wheel to zoom · double-click to reset</div>'+
        '<div class="p3d-legend">'+
          '<span class="leg"><i class="sw" style="background:var(--amber)"></i>'+
            '<span data-en="X — H-plane (azimuth cut)" data-uk="X — площина H (азимут)">X — H-plane (azimuth cut)</span></span>'+
          '<span class="leg"><i class="sw" style="background:var(--teal)"></i>'+
            '<span data-en="Y — E-plane (elevation cut)" data-uk="Y — площина E (кут місця)">Y — E-plane (elevation cut)</span></span>'+
          '<span class="leg"><i class="sw" style="background:var(--dim)"></i>'+
            '<span data-en="Z — boresight, 0°" data-uk="Z — вісь максимуму, 0°">Z — boresight, 0°</span></span>'+
        '</div>'+
        '<div class="plane-readout p3d-readout">'+items+'</div>'+
      '</div>'+
    '</div>';
  }

  /* --------------------------------------------------- rotation helpers ---
     Row-major 3×3 stored flat. rotX/rotY act on SCREEN axes and are
     pre-multiplied, which is what makes the drag feel like a trackball
     rather than a turntable. */
  function matMul(a,b){
    var m=new Array(9);
    for(var r=0;r<3;r++) for(var c=0;c<3;c++)
      m[r*3+c]=a[r*3]*b[c]+a[r*3+1]*b[3+c]+a[r*3+2]*b[6+c];
    return m;
  }
  function rotX(t){ var c=Math.cos(t), s=Math.sin(t);
    return [1,0,0, 0,c,-s, 0,s,c]; }
  function rotY(t){ var c=Math.cos(t), s=Math.sin(t);
    return [c,0,s, 0,1,0, -s,0,c]; }
  // default three-quarter view, boresight up and tilted toward the viewer
  function startRotation(){ return matMul(rotX(0.36), rotY(0.62)); }

  /* ============================================================== renderer */
  // One live viewer per antenna id: canvas, current rotation/zoom, last mesh.
  var VIEWS = {};

  function makeView(id, stage){
    var cv;
    try{ cv = document.createElement('canvas'); }catch(e){ return null; }
    if(!cv || typeof cv.getContext!=='function') return null;   // headless shim
    var ctx = cv.getContext('2d');
    if(!ctx) return null;
    cv.className='p3d-canvas';
    stage.appendChild(cv);

    var view = {id:id, cv:cv, ctx:ctx, stage:stage,
                R:startRotation(), zoom:1, panX:0, panY:0,
                mesh:null, meta:null, w:0, h:0};

    /* --- drag: free tumble, or pan with shift / the right button ----------
       A turntable camera (yaw about world-up + pitch) is useless here: for
       most antennas the lobe is a body of revolution about the boresight,
       which IS world-up, so dragging left-right visibly did nothing. This
       accumulates rotations about the CURRENT SCREEN axes instead, so a
       horizontal drag always tumbles the object. */
    var dragging=false, panning=false, lx=0, ly=0;
    function down(x,y,pan){
      dragging=true; panning=!!pan; lx=x; ly=y;
      stage.className='p3d-stage '+(pan?'panning':'dragging');
    }
    function move(x,y){
      if(!dragging) return;
      var dx=x-lx, dy=y-ly;
      if(panning){
        view.panX += dx; view.panY += dy;
      } else {
        // rotate about the screen-vertical axis for dx, screen-horizontal for dy
        view.R = matMul(rotY(dx*0.010), view.R);
        view.R = matMul(rotX(dy*0.010), view.R);
      }
      lx=x; ly=y; draw(view);
    }
    function up(){ dragging=false; panning=false; stage.className='p3d-stage'; }
    cv.addEventListener('mousedown', function(e){
      e.preventDefault();
      down(e.clientX, e.clientY, e.shiftKey || e.button===1 || e.button===2);
    });
    cv.addEventListener('contextmenu', function(e){ e.preventDefault(); });
    window.addEventListener('mousemove', function(e){ move(e.clientX,e.clientY); });
    window.addEventListener('mouseup', up);
    // double-click restores the default view
    cv.addEventListener('dblclick', function(e){
      e.preventDefault();
      view.R=startRotation(); view.zoom=1; view.panX=0; view.panY=0; draw(view);
    });
    // touch: one finger rotates, two fingers pan
    cv.addEventListener('touchstart', function(e){
      var t=e.touches[0]; down(t.clientX,t.clientY, e.touches.length>1);
    }, {passive:true});
    cv.addEventListener('touchmove',  function(e){
      var t=e.touches[0]; panning=(e.touches.length>1); move(t.clientX,t.clientY);
    }, {passive:true});
    cv.addEventListener('touchend', up);
    cv.addEventListener('wheel', function(e){
      e.preventDefault();
      view.zoom = AL.clamp(view.zoom*(1 - e.deltaY*0.0012), 0.45, 3.2);
      draw(view);
    }, {passive:false});

    window.addEventListener('resize', function(){ draw(view); });
    return view;
  }

  /* Model → screen. Model axes: X = H-plane, Y = E-plane, Z = boresight.
     They are re-based so boresight points UP on screen at rest (matching the
     2-D polar charts, where 0° is up), then yawed and pitched by the drag. */
  function projector(view){
    var R=view.R;
    var cx=view.w/2 + view.panX, cyc=view.h/2 + view.panY;
    // The stage is full width, so size the scene off the height and only let
    // the width bind on a narrow screen.
    var s=Math.min(view.h*0.40, view.w*0.42)*view.zoom;
    var dist=5.0;
    return function(x,y,z){
      // re-base: boresight (model Z) → world up; model Y → world depth
      var wx=x, wy=z, wz=y;
      var ax = R[0]*wx + R[1]*wy + R[2]*wz;
      var ay = R[3]*wx + R[4]*wy + R[5]*wz;
      var bz = R[6]*wx + R[7]*wy + R[8]*wz;
      var persp = dist/(dist-bz*0.55);
      return [cx + ax*s*persp, cyc - ay*s*persp, bz];
    };
  }

  /* Build the display mesh vertices in model space (r = dB-mapped radius). */
  function buildSurface(fnE, fnH, plot, sym, scale){
    scale = scale || (AL.DEFAULT_SCALE);
    var m = sampleMesh(fnE, fnH, plot, N_THETA, N_PHI, sym);
    var nT=m.nTheta, nP=m.nPhi;
    var vx=new Float64Array((nT+1)*(nP+1)), vy=new Float64Array((nT+1)*(nP+1)),
        vz=new Float64Array((nT+1)*(nP+1)), vd=new Float64Array((nT+1)*(nP+1));
    for(var i=0;i<=nT;i++){
      var th=m.TH[i]*Math.PI/180, st=Math.sin(th), ct=Math.cos(th);
      for(var j=0;j<=nP;j++){
        var phi=2*Math.PI*j/nP, k=i*(nP+1)+j;
        // radius comes from the SAME scale object the 2-D cuts use, so the
        // 3-D lobe and the polar charts always agree; colour stays keyed to
        // dB regardless of which scale is showing.
        var mag=m.mag[k]/m.peak;
        var db=Math.max(20*Math.log10(Math.max(mag,1e-6)), FLOOR_DB);
        var r=scale.rOf(mag);
        if(!(r>0)) r=0;
        vx[k]=r*st*Math.cos(phi); vy[k]=r*st*Math.sin(phi); vz[k]=r*ct; vd[k]=db;
      }
    }
    return {vx:vx, vy:vy, vz:vz, vd:vd, nT:nT, nP:nP};
  }

  /* --------------------------------------------------------- primitives --- */
  function quad(list, P, p0,p1,p2,p3, fill, stroke, lw){
    var a=P(p0[0],p0[1],p0[2]), b=P(p1[0],p1[1],p1[2]),
        c=P(p2[0],p2[1],p2[2]), d=P(p3[0],p3[1],p3[2]);
    list.push({z:(a[2]+b[2]+c[2]+d[2])/4, pts:[a,b,c,d], fill:fill, stroke:stroke, lw:lw||0});
  }
  function seg(list, P, p0,p1, stroke, lw){
    var a=P(p0[0],p0[1],p0[2]), b=P(p1[0],p1[1],p1[2]);
    list.push({z:(a[2]+b[2])/2, pts:[a,b], fill:null, stroke:stroke, lw:lw||1.4});
  }
  // A 3-D arrow (shaft split into depth-sortable segments + a solid head).
  function arrow(list, P, dir, len, colour){
    var NS=18, i, prev=[0,0,0];
    for(i=1;i<=NS;i++){
      var t=len*0.88*i/NS, p=[dir[0]*t, dir[1]*t, dir[2]*t];
      seg(list, P, prev, p, colour, 1.6);
      prev=p;
    }
    // head: a small triangle fan around the axis, drawn as two crossed blades
    var tip=[dir[0]*len, dir[1]*len, dir[2]*len];
    var base=[dir[0]*len*0.86, dir[1]*len*0.86, dir[2]*len*0.86];
    // two perpendicular vectors to dir
    var up = Math.abs(dir[2])>0.9 ? [1,0,0] : [0,0,1];
    var u = cross(dir, up), v = cross(dir, u);
    u=norm(u); v=norm(v);
    var w=len*0.035;
    [u,v].forEach(function(e){
      var a=[base[0]+e[0]*w, base[1]+e[1]*w, base[2]+e[2]*w];
      var b=[base[0]-e[0]*w, base[1]-e[1]*w, base[2]-e[2]*w];
      var pa=P(a[0],a[1],a[2]), pb=P(b[0],b[1],b[2]), pt=P(tip[0],tip[1],tip[2]);
      list.push({z:(pa[2]+pb[2]+pt[2])/3, pts:[pa,pb,pt], fill:colour, stroke:colour, lw:0.8});
    });
  }
  function cross(a,b){ return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]; }
  function norm(a){ var n=Math.hypot(a[0],a[1],a[2])||1; return [a[0]/n,a[1]/n,a[2]/n]; }

  // A translucent cutting plane, subdivided so it interleaves with the lobe.
  function cuttingPlane(list, P, axisU, axisV, half, fill, edge){
    var N=5, i, j;
    for(i=0;i<N;i++) for(j=0;j<N;j++){
      var u0=-half+2*half*i/N, u1=-half+2*half*(i+1)/N;
      var v0=-half+2*half*j/N, v1=-half+2*half*(j+1)/N;
      var p=function(u,v){ return [axisU[0]*u+axisV[0]*v, axisU[1]*u+axisV[1]*v, axisU[2]*u+axisV[2]*v]; };
      quad(list, P, p(u0,v0), p(u1,v0), p(u1,v1), p(u0,v1), fill, edge, 0.4);
    }
  }

  /* ------------------------------------------------------------- painting */
  function draw(view){
    if(!view||!view.mesh) return;
    var stage=view.stage;
    var w=stage.clientWidth||600, h=stage.clientHeight||340;
    var dpr=Math.min(window.devicePixelRatio||1, 2);
    if(view.w!==w||view.h!==h){
      view.w=w; view.h=h;
      view.cv.width=Math.round(w*dpr); view.cv.height=Math.round(h*dpr);
      view.cv.style.width=w+'px'; view.cv.style.height=h+'px';
    }
    var ctx=view.ctx;
    // Clear in DEVICE pixels, not CSS pixels. round(w*dpr) is not exactly w*dpr,
    // so clearing 0..w under the dpr transform leaves the last column or two of
    // the backing store untouched — which showed up as a 1 px vertical line
    // stuck to the right edge after a zoom.
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,view.cv.width,view.cv.height);
    ctx.setTransform(dpr,0,0,dpr,0,0);

    var P=projector(view), list=[];
    var amber=cssVar('--amber','#F2A65A'), teal=cssVar('--teal','#7FDBCA'),
        dim=cssVar('--dim','#8B97B4'), grid=cssVar('--grid','#233150');

    // cutting planes: H = X-Z (contains the azimuth cut), E = Y-Z (elevation)
    cuttingPlane(list, P, [1,0,0],[0,0,1], 1.25, rgba(amber,0.045), rgba(amber,0.16));
    cuttingPlane(list, P, [0,1,0],[0,0,1], 1.25, rgba(teal ,0.045), rgba(teal ,0.16));

    // 0 dB reference sphere, drawn as a wire equator + two meridians
    ring(list, P, 'xy', 1.0, rgba(grid,0.85));
    ring(list, P, 'xz', 1.0, rgba(grid,0.45));
    ring(list, P, 'yz', 1.0, rgba(grid,0.45));

    // the lobe
    var m=view.mesh, nP=m.nP;
    for(var i=0;i<m.nT;i++){
      for(var j=0;j<nP;j++){
        var k0=i*(nP+1)+j, k1=k0+1, k2=k0+nP+1, k3=k2+1;
        var db=(m.vd[k0]+m.vd[k1]+m.vd[k2]+m.vd[k3])/4;
        if(m.vx[k0]===0&&m.vy[k0]===0&&m.vz[k0]===0&&
           m.vx[k3]===0&&m.vy[k3]===0&&m.vz[k3]===0) continue;
        quad(list, P,
          [m.vx[k0],m.vy[k0],m.vz[k0]], [m.vx[k1],m.vy[k1],m.vz[k1]],
          [m.vx[k3],m.vy[k3],m.vz[k3]], [m.vx[k2],m.vy[k2],m.vz[k2]],
          dbColour(db), 'rgba(0,0,0,0.10)', 0.35);
      }
    }

    // direction arrows
    arrow(list, P, [1,0,0], 1.42, amber);   // H-plane
    arrow(list, P, [0,1,0], 1.42, teal);    // E-plane
    arrow(list, P, [0,0,1], 1.42, dim);     // boresight

    // painter's algorithm: far first
    list.sort(function(a,b){ return a.z-b.z; });
    for(var q=0;q<list.length;q++){
      var it=list[q], pts=it.pts;
      ctx.beginPath();
      ctx.moveTo(pts[0][0],pts[0][1]);
      for(var p=1;p<pts.length;p++) ctx.lineTo(pts[p][0],pts[p][1]);
      if(it.fill){ ctx.closePath(); ctx.fillStyle=it.fill; ctx.fill(); }
      if(it.stroke && it.lw>0){ ctx.strokeStyle=it.stroke; ctx.lineWidth=it.lw; ctx.stroke(); }
    }

    // labels last, always legible
    ctx.font='11px "JetBrains Mono", monospace';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    label(ctx,P,[1.52,0,0],'H',amber);
    label(ctx,P,[0,1.52,0],'E',teal);
    label(ctx,P,[0,0,1.52],'0°',dim);
    // (the λ scale lives on the antenna schematic, where a length scale means
    //  something — the lobe's radius here is a dB scale, not a distance)
  }

  function label(ctx,P,p,text,colour){
    var s=P(p[0],p[1],p[2]);
    ctx.fillStyle=colour; ctx.fillText(text, s[0], s[1]);
  }
  function ring(list, P, plane, r, colour){
    var N=64, prev=null;
    for(var i=0;i<=N;i++){
      var a=2*Math.PI*i/N, c=Math.cos(a)*r, s=Math.sin(a)*r;
      var p = plane==='xy'?[c,s,0] : (plane==='xz'?[c,0,s] : [0,c,s]);
      if(prev) seg(list,P,prev,p,colour,1.0);
      prev=p;
    }
  }
  // '#rrggbb' → 'rgba(r,g,b,a)'; passes through anything already functional.
  function rgba(col, a){
    col=(col||'').trim();
    if(col.charAt(0)!=='#') return col;
    var h=col.slice(1);
    if(h.length===3) h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
    var n=parseInt(h,16);
    return 'rgba('+((n>>16)&255)+','+((n>>8)&255)+','+(n&255)+','+a+')';
  }

  /* ================================================================= API */
  /* opts = { fnE, fnH, plot:'full'|'half', meta:{lamCm, sizeLam, sizeLabel,
             gainDbi, effAp} }  — meta is optional; everything it does not
     supply is either derived from the pattern or shown as “—”. */
  function draw3d(id, opts){
    var fnE=opts.fnE, fnH=opts.fnH||function(){return 1;}, plot=opts.plot||'full';
    var meta=opts.meta||{};
    // 'omni' only means a body of revolution when the azimuth cut really is a
    // circle; an antenna that supplies its own fnH gets the blend.
    var sym=(opts.sym==='omni' && !opts.hasFnH) ? 'omni' : 'blend';

    // ---- the model (always runs, canvas or not) ----
    var M;
    try{ M = pattern3dMetrics(fnE, fnH, plot, sym); }
    catch(e){ return null; }

    var lamCm = meta.lamCm;
    var gainDbi = (meta.gainDbi!==undefined && meta.gainDbi!==null && isFinite(meta.gainDbi))
                    ? meta.gainDbi : M.DdBi;
    function set(key, txt){
      var n=document.getElementById(id+'_3d_'+key);
      if(n) n.textContent=txt;
    }
    set('lam', (lamCm>0 && isFinite(lamCm))
        ? (lamCm<1 ? (lamCm*10).toFixed(1)+' '+AL.unit('mm')
                   : (lamCm>=100 ? (lamCm/100).toFixed(2)+' '+AL.unit('m')
                                 : lamCm.toFixed(2)+' '+AL.unit('cm')))
        : '—');
    set('g',  gainDbi.toFixed(1));
    set('d',  M.DdBi.toFixed(1));
    set('ae', M.aeLam2.toFixed(2)+' λ²');
    set('oa', M.omegaA.toFixed(3));
    set('hpe', isFinite(M.hpbwE)? M.hpbwE.toFixed(1)+'°' : '—');
    set('hph', isFinite(M.hpbwH)? M.hpbwH.toFixed(1)+'°' : '—');
    set('size', meta.sizeLabel || (meta.sizeLam>0 ? meta.sizeLam.toFixed(2)+' λ' : '—'));

    // ---- the picture (browser only) ----
    var stage=document.getElementById(id+'_3d');
    if(!stage || typeof stage.appendChild!=='function') return M;
    var view=VIEWS[id];
    if(!view){
      view=makeView(id, stage);
      if(!view){ VIEWS[id]='none'; return M; }   // headless / no canvas
      VIEWS[id]=view;
    } else if(view==='none'){ return M; }

    view.mesh = buildSurface(fnE, fnH, plot, sym, opts.scale);
    view.meta = {sizeLam:meta.sizeLam, sizeLabel:meta.sizeLabel};
    draw(view);
    return M;
  }

  // Redraw every live viewer (theme switch: the CSS variables changed).
  function redrawAll3d(){
    for(var id in VIEWS){ if(VIEWS[id] && VIEWS[id]!=='none') draw(VIEWS[id]); }
  }
  var prevTheme=window.onThemeChange;
  window.onThemeChange=function(t){ redrawAll3d(); if(typeof prevTheme==='function') prevTheme(t); };

  AL.panel3dHTML      = panel3dHTML;
  AL.draw3d           = draw3d;
  AL.pattern3dMetrics = pattern3dMetrics;
  AL.redrawAll3d      = redrawAll3d;
  /* Two-sided cut analysis, for pages whose beam can sit anywhere in ±180°.
     AL.analyzePattern only scans 0..maxDeg (it halves an on-axis beamwidth and
     misses a beam steered to negative angles); this scans both sides.
     fnDeg(angleDeg) with the same 360-periodic convention as fnBeam. */
  AL.analyzeCut = function(fnDeg, maxDeg){
    return analyzeCut(cutter(fnDeg,'full'), maxDeg||180);
  };
})();
