/* =========================================================================
   antenna.js — shared calculation + plotting + schematic + UI engine for the
   Antenna Atlas. Every per-antenna calculator is built on these primitives so
   the physics is written (and verified) once, and every page looks the same.

   Exposes window.AntennaLab (alias window.AL). No external dependencies; runs
   from file://. Colours are passed as CSS custom-property strings
   (e.g. 'var(--teal)') so light/dark theme switches need no re-render.

   Sign / geometry conventions
   ---------------------------
   • θ is the polar angle. For broadside antennas θ is measured from boresight
     (0° = main beam). For linear wire antennas θ is measured from the wire
     AXIS (0° = along the wire); the engine notes which each function expects.
   • All pattern functions return a real magnitude |F(θ)| ≥ 0 (field, linear).
     Convert to dB with toDb(). Patterns are normalised to 1 at their max
     unless stated (the caller may re-normalise).
   ========================================================================= */
(function(){
  const c = 299792458;            // speed of light, m/s
  const ETA0 = 376.730313668;     // free-space wave impedance, Ω

  /* ---------------------------------------------------------------- units */
  const UNITS = {
    en:{GHz:'GHz',MHz:'MHz',kHz:'kHz',cm:'cm',mm:'mm',m:'m',dB:'dB',dBi:'dBi',
        dBd:'dBd',deg:'°',ohm:'Ω',none:'',lam:'λ'},
    uk:{GHz:'ГГц',MHz:'МГц',kHz:'кГц',
        cm:'см',mm:'мм',m:'м',dB:'дБ',
        dBi:'дБі',dBd:'дБд',deg:'°',
        ohm:'Ом',none:'',lam:'λ'}
  };
  function lang(){ return (window.LANG==='uk')?'uk':'en'; }
  function unit(key){ return UNITS[lang()][key]!==undefined?UNITS[lang()][key]:''; }
  function tr(en,uk){ return lang()==='uk'?uk:en; }

  /* --------------------------------------------------------------- maths */
  const D2R = Math.PI/180, R2D = 180/Math.PI;
  function lambdaOf(fHz){ return c/fHz; }
  function kOf(lambda){ return 2*Math.PI/lambda; }
  function toDb(f, floor){ floor = (floor===undefined)?-40:floor;
    return Math.max(20*Math.log10(Math.max(Math.abs(f),1e-6)), floor); }
  function powDb(p, floor){ floor = (floor===undefined)?-40:floor;
    return Math.max(10*Math.log10(Math.max(p,1e-9)), floor); }
  function clamp(x,a,b){ return Math.max(a,Math.min(b,x)); }

  /* ------------------------------------------------------ pattern library */
  // sinc = sin(x)/x with the removable singularity handled.
  function sinc(x){ return Math.abs(x)<1e-8 ? 1 : Math.sin(x)/x; }

  // Bessel J0, J1 (Abramowitz & Stegun polynomial approximations; good to ~1e-7).
  function besselJ0(x){
    const ax=Math.abs(x);
    if(ax<8){
      const y=x*x;
      const p1=-2957821389.0+y*(7062834065.0+y*(-512359803.6+y*(10879881.29+y*(-86327.92757+y*228.4622733))));
      const p2= 40076544269.0+y*(745249964.8+y*(7189466.438+y*(47447.26470+y*(226.1030244+y))));
      return p1/p2;
    }
    const z=8/ax, y=z*z, xx=ax-0.785398164;
    const p1=1+y*(-0.1098628627e-2+y*(0.2734510407e-4+y*(-0.2073370639e-5+y*0.2093887211e-6)));
    const p2=-0.1562499995e-1+y*(0.1430488765e-3+y*(-0.6911147651e-5+y*(0.7621095161e-6+y*(-0.934935152e-7))));
    return Math.sqrt(0.636619772/ax)*(Math.cos(xx)*p1-z*Math.sin(xx)*p2);
  }
  function besselJ1(x){
    const ax=Math.abs(x); let r;
    if(ax<8){
      const y=x*x;
      const p1=x*(72362614232.0+y*(-7895059235.0+y*(242396853.1+y*(-2972611.439+y*(15704.48260+y*(-30.16036606))))));
      const p2=144725228442.0+y*(2300535178.0+y*(18583304.74+y*(99447.43394+y*(376.9991397+y))));
      r=p1/p2;
    } else {
      const z=8/ax, y=z*z, xx=ax-2.356194491;
      const p1=1+y*(0.183105e-2+y*(-0.3516396496e-4+y*(0.2457520174e-5+y*(-0.240337019e-6))));
      const p2=0.04687499995+y*(-0.2002690873e-3+y*(0.8449199096e-5+y*(-0.88228987e-6+y*0.105787412e-6)));
      r=Math.sqrt(0.636619772/ax)*(Math.cos(xx)*p1-z*Math.sin(xx)*p2);
      if(x<0) r=-r;
    }
    return r;
  }

  // Thin linear dipole/monopole current-pattern. θ measured from the wire AXIS.
  // F(θ) = [cos(β·L/2·cosθ) − cos(β·L/2)] / sinθ,  β·L/2 = π·(L/λ).
  // Llam = total length in wavelengths. Returns normalised magnitude.
  function dipolePattern(thetaAxis, Llam){
    const s=Math.sin(thetaAxis);
    const u=Math.PI*Llam;
    if(Math.abs(s)<1e-6) return 0;
    const f=(Math.cos(u*Math.cos(thetaAxis))-Math.cos(u))/s;
    // normalise by the boresight (θ=90°) value 1−cos(u)
    const f0=(1-Math.cos(u));
    return f0>1e-9 ? Math.abs(f/f0) : Math.abs(f);
  }

  // Uniform line-source / uniform aperture cut. θ from broadside (0°=peak).
  // F = sinc((π·L/λ)·sinθ).  Llam in wavelengths.
  function apertureUniform(theta, Llam){ return Math.abs(sinc(Math.PI*Llam*Math.sin(theta))); }

  // Cosine (TE10 / H-plane horn) aperture cut. θ from broadside.
  // F = cos(X)/(1−(2X/π)²), X=(π·L/λ)·sinθ.
  function apertureCosine(theta, Llam){
    const X=Math.PI*Llam*Math.sin(theta);
    const d=1-Math.pow(2*X/Math.PI,2);
    if(Math.abs(d)<1e-4) return Math.PI/4;
    return Math.abs(Math.cos(X)/d);
  }

  // Uniform circular aperture (Airy). θ from broadside. Dlam = diameter/λ.
  // F = 2·J1(u)/u, u = π·D/λ·sinθ.
  function apertureCircular(theta, Dlam){
    const u=Math.PI*Dlam*Math.sin(theta);
    if(Math.abs(u)<1e-6) return 1;
    return Math.abs(2*besselJ1(u)/u);
  }

  // Small magnetic loop: pattern ∝ sinθ (θ from loop axis). Normalised.
  function smallLoopPattern(thetaAxis){ return Math.abs(Math.sin(thetaAxis)); }

  // Uniform linear array factor. ψ = k·d·cosγ + β. γ from array AXIS.
  // N elements, dLam spacing in λ, betaRad progressive phase. Normalised.
  function arrayFactor(gammaAxis, N, dLam, betaRad){
    const psi=2*Math.PI*dLam*Math.cos(gammaAxis)+betaRad;
    const den=Math.sin(psi/2);
    if(Math.abs(den)<1e-9) return 1;
    return Math.abs(Math.sin(N*psi/2)/(N*den));
  }
  // Array factor with arbitrary real amplitude weights w[] (length N).
  function arrayFactorWeighted(gammaAxis, dLam, betaRad, w){
    const psi=2*Math.PI*dLam*Math.cos(gammaAxis)+betaRad;
    let re=0,im=0,sw=0;
    for(let n=0;n<w.length;n++){ re+=w[n]*Math.cos(n*psi); im+=w[n]*Math.sin(n*psi); sw+=w[n]; }
    return sw>1e-9 ? Math.hypot(re,im)/sw : 0;
  }

  // Fresnel integrals C(t)=∫cos(πu²/2), S(t)=∫sin(πu²/2) — composite Simpson.
  function fresnelIntegral(t){
    if(t<0){ const r=fresnelIntegral(-t); return {C:-r.C,S:-r.S}; }
    if(t<1e-4) return {C:t, S:Math.PI*t*t*t/6};
    let N=Math.min(4000,Math.max(60,Math.ceil(6*t*t))); if(N%2) N++;
    const h=t/N;
    let sC=1+Math.cos(Math.PI/2*t*t), sS=Math.sin(Math.PI/2*t*t);
    for(let i=1;i<N;i++){ const x=i*h, ph=Math.PI/2*x*x, w=(i%2===0)?2:4;
      sC+=w*Math.cos(ph); sS+=w*Math.sin(ph); }
    return {C:(h/3)*sC, S:(h/3)*sS};
  }

  // Sine / cosine integrals via composite Simpson.  Si(x)=∫₀ˣ sin t/t dt ;
  // Ci(x)=γ+ln x+∫₀ˣ (cos t−1)/t dt ;  Cin(x)=γ+ln x−Ci(x).  Accurate for the
  // 0…~6π range that thin-wire antenna impedance formulas need.
  const EULER_GAMMA=0.5772156649015329;
  function Si(x){
    if(x<0) return -Si(-x);
    if(x<1e-9) return x;
    let N=Math.max(50,Math.ceil(24*x/Math.PI)); if(N%2) N++;
    const h=x/N; let s=0; // integrand at 0 is 1
    for(let i=0;i<=N;i++){ const t=i*h; const f=(t<1e-12)?1:Math.sin(t)/t;
      const w=(i===0||i===N)?1:(i%2?4:2); s+=w*f; }
    return s*h/3;
  }
  function Cin(x){
    if(x<1e-9) return 0;
    let N=Math.max(50,Math.ceil(24*x/Math.PI)); if(N%2) N++;
    const h=x/N; let s=0; // integrand (1−cos t)/t at 0 is 0
    for(let i=0;i<=N;i++){ const t=i*h; const f=(t<1e-12)?0:(1-Math.cos(t))/t;
      const w=(i===0||i===N)?1:(i%2?4:2); s+=w*f; }
    return s*h/3;
  }
  function Ci(x){ return EULER_GAMMA+Math.log(x)-Cin(x); }

  // Thin linear dipole input impedance referred to the feed, via the
  // induced-EMF method (Balanis 4-70/4-79). Llam = length/λ, aLam = radius/λ.
  // Returns {Rr, Rin, Xin} in ohms (Rr = radiation resistance at current max).
  function dipoleZ(Llam, aLam){
    const kL=2*Math.PI*Llam;
    const C=EULER_GAMMA;
    // Radiation resistance referred to the current maximum
    const Rr=(ETA0/(2*Math.PI))*(C+Math.log(kL)-Ci(kL)
      +0.5*Math.sin(kL)*(Si(2*kL)-2*Si(kL))
      +0.5*Math.cos(kL)*(C+Math.log(kL/2)+Ci(2*kL)-2*Ci(kL)));
    // Reactance referred to the current maximum (needs the wire radius)
    const a=Math.max(aLam,1e-5);
    const Xm=(ETA0/(4*Math.PI))*(2*Si(kL)
      +Math.cos(kL)*(2*Si(kL)-Si(2*kL))
      -Math.sin(kL)*(2*Ci(kL)-Ci(2*kL)-Ci(2*kL*a*a/Llam)));
    // Refer to the input terminals: divide by sin²(kL/2)
    const s2=Math.pow(Math.sin(kL/2),2);
    const denom=Math.max(s2,1e-4);
    return {Rr:Math.max(Rr,0), Rin:Math.max(Rr,0)/denom, Xin:Xm/denom};
  }

  /* ------------------------------------------------- sampling + analysis */
  // IMPORTANT: sampleHalf / findHPBW take the pattern function in DEGREES —
  // fnDeg(angleDeg) → magnitude, with the main beam at angle 0. This matches
  // polarTraceFull (also degrees) so one fnBeam feeds the plot AND the metrics.
  // (directivityAxial is the exception: it integrates the low-level physics
  //  axis pattern in RADIANS — see below.)
  function sampleHalf(fnDeg, stepDeg, maxDeg){
    stepDeg=stepDeg||0.25; maxDeg=maxDeg||90;
    const n=Math.round(maxDeg/stepDeg)+1, a=new Float64Array(n);
    for(let i=0;i<n;i++) a[i]=Math.abs(fnDeg(i*stepDeg));
    return {arr:a, stepDeg, maxDeg, n};
  }
  // Half-power beamwidth (deg, full width). Bracket on grid then bisect fnDeg.
  function findHPBW(s, fnDeg){
    const {arr,stepDeg,n}=s; const peak=arr[0]||1e-9;
    const thr=peak*Math.pow(10,-3/20);
    let i=1; while(i<n && arr[i]>thr) i++;
    if(i>=n) return null;
    let lo=(i-1)*stepDeg, hi=i*stepDeg;
    for(let it=0;it<16;it++){ const m=(lo+hi)/2;
      if(Math.abs(fnDeg(m))>thr) lo=m; else hi=m; }
    return lo+hi;   // 2 × half-angle (assumes symmetric main beam about 0)
  }
  // First sidelobe on a magnitude array: descend main lobe to a null, climb to
  // the next local max. Returns {level(dB, rel peak), angle(deg), nullDeg}.
  function findFirstSidelobe(s){
    const {arr,stepDeg,n}=s; const EPS=1e-9, peak=arr[0]||1e-9;
    const NONE={level:null,angle:null,nullDeg:null};
    let i=1; while(i<n && arr[i]<=arr[i-1]+EPS) i++;
    if(i>=n) return NONE;
    const nullIdx=i-1;
    while(i<n && arr[i]>=arr[i-1]-EPS) i++;
    if(i>=n) return NONE;
    const peakIdx=i-1;
    const nullVal=arr[nullIdx], pk=arr[peakIdx];
    if(nullVal>0.5*peak || 20*Math.log10(pk/Math.max(nullVal,1e-12))<0.05) return NONE;
    let angle=peakIdx*stepDeg, level=pk;
    if(peakIdx>0 && peakIdx<n-1){
      const y0=arr[peakIdx-1],y1=arr[peakIdx],y2=arr[peakIdx+1], den=y0-2*y1+y2;
      if(Math.abs(den)>1e-15){ const dx=0.5*(y0-y2)/den;
        if(Math.abs(dx)<=1){ angle=(peakIdx+dx)*stepDeg; level=y1-0.25*(y0-y2)*dx; } }
    }
    return {level:20*Math.log10(Math.max(level/peak,1e-6)), angle, nullDeg:nullIdx*stepDeg};
  }
  // General analysis for patterns whose main lobe is NOT at 0° (traveling-wave
  // long wires, frequency-scanned leaky-wave, etc.). Scans fnDeg over
  // 0..maxDeg, finds the true peak, its full HPBW, and the highest sidelobe
  // outside the main lobe. Returns {peakDeg, hpbw, sll(dB rel peak), peak}.
  function analyzePattern(fnDeg, maxDeg, stepDeg){
    stepDeg=stepDeg||0.25; maxDeg=maxDeg||180;
    const n=Math.round(maxDeg/stepDeg)+1, a=new Float64Array(n);
    let peak=0, pk=0;
    for(let i=0;i<n;i++){ a[i]=Math.abs(fnDeg(i*stepDeg)); if(a[i]>peak){peak=a[i];pk=i;} }
    const peakDeg=pk*stepDeg, thr=peak*Math.pow(10,-3/20);
    let l=pk; while(l>0 && a[l]>thr) l--;
    let r=pk; while(r<n-1 && a[r]>thr) r++;
    const hpbw=(r-l)*stepDeg;
    let slv=0, sli=-1;
    for(let i=1;i<n-1;i++){ if(i>=l&&i<=r) continue;
      if(a[i]>=a[i-1] && a[i]>=a[i+1] && a[i]>slv){ slv=a[i]; sli=i; } }
    return {peakDeg, hpbw, sll:(sli<0?null:20*Math.log10(slv/peak)), peak};
  }

  // Numeric directivity for an AXIALLY-SYMMETRIC pattern (depends only on the
  // polar angle from a symmetry axis): D = 2 / ∫₀^π |F(θ)|² sinθ dθ.
  // fnAxis(θ) must take θ measured from that axis, over 0..π.
  function directivityAxial(fnAxis){
    const N=1800, h=Math.PI/N; let sum=0, fmax=0;
    const F=new Float64Array(N+1);
    for(let i=0;i<=N;i++){ const th=i*h; const f=Math.abs(fnAxis(th)); F[i]=f; if(f>fmax) fmax=f; }
    const inv=fmax>1e-12?1/fmax:1;
    for(let i=0;i<=N;i++){ const th=i*h, w=(i===0||i===N)?1:(i%2?4:2);
      const fn=F[i]*inv; sum+=w*fn*fn*Math.sin(th); }
    sum*=h/3;
    const D = sum>1e-12 ? 2/sum : 1;
    return {lin:D, dBi:10*Math.log10(D)};
  }

  /* ------------------------------------------------------- format helpers */
  function fmtDeg(v){ return v===null?tr('none in ±90°','немає в ±90°'):v.toFixed(1)+'°'; }
  function fmtDb(v){ return v===null?tr('not present','не виражений'):v.toFixed(1)+' '+unit('dB'); }
  function fmtAng(v){ return v===null?tr('none in ±90°','немає в ±90°'):'±'+v.toFixed(1)+'°'; }
  function fmt(v,d){ d=(d===undefined)?1:d; return (v).toFixed(d); }

  /* ================================================ RADIATION-PATTERN SCALES */
  /* How a normalised field magnitude m = |F|/|F|max ∈ [0,1] becomes a plot
     radius r ∈ [0,1]. Every plot in the atlas — both 2-D cuts and the 3-D
     surface — goes through one of these, so switching the scale changes them
     all together.

       lin   linear (field/voltage)  r = m            — the textbook/GOST form:
             a dipole looks like a doughnut, a cardioid like a cardioid, and
             the half-power point sits at r = 0.707. Sidelobes below −20 dB
             are essentially invisible.
       linp  linear (power)          r = m²           — same curve, visually
             narrower; the −3 dB point lands at exactly half the radius.
       log   logarithmic (dB)        r = 1 + dB/S     — S = 20…60 dB span.
       arrl  modified log (ARRL)     r = (1/0.89)^(dB/2) ≡ m^0.5061
             The ARRL Antenna Book grid: expands the main lobe and compresses
             deep sidelobes toward (never quite to) the centre. Ring ticks at
             0, −3, −6, −10, −20, −30 dB, as ARRL plots them.                */
  const ARRL_K = -10*Math.log10(0.89);        // 0.50610 — exponent on m
  const SCALE_IDS = ['lin','linp','log','arrl'];
  const SCALE_LABEL = {
    lin :{en:'Linear (field)',       uk:'Лінійна (поле)'},
    linp:{en:'Linear (power)',       uk:'Лінійна (потужність)'},
    log :{en:'Logarithmic (dB)',     uk:'Логарифмічна (дБ)'},
    arrl:{en:'Modified log (ARRL)',  uk:'Модиф. логарифм. (ARRL)'}
  };
  const SPAN_CHOICES = [20,30,40,50,60];

  function ringsFromDb(list, rOf){
    return list.map(db=>({r:rOf(Math.pow(10,db/20)), label:String(db)}));
  }
  function makeScale(mode, spanDb){
    if(SCALE_IDS.indexOf(mode)<0) mode='log';
    spanDb = SPAN_CHOICES.indexOf(spanDb)>=0 ? spanDb : 40;
    let rOf, rings, axis;
    if(mode==='lin'){
      rOf = m=>clamp(m,0,1);
      rings=[1,0.707,0.5,0.25].map(v=>({r:v,label:v===0.707?'0.707':String(v)}));
      axis=tr('|E|/|E|max','|E|/|E|max');
    } else if(mode==='linp'){
      rOf = m=>clamp(m*m,0,1);
      rings=[1,0.5,0.25,0.1].map(v=>({r:v,label:String(v)}));
      axis=tr('P/Pmax','P/Pmax');
    } else if(mode==='arrl'){
      rOf = m=>(m<=1e-9?0:clamp(Math.pow(m,ARRL_K),0,1));
      rings=ringsFromDb([0,-3,-6,-10,-20,-30], rOf);
      axis=tr('dB (ARRL)','дБ (ARRL)');
    } else {
      rOf = m=>{ const db=Math.max(20*Math.log10(Math.max(m,1e-9)),-spanDb);
                 return clamp(1+db/spanDb,0,1); };
      const step=spanDb/4, ticks=[0,-step,-2*step,-3*step];
      rings=ringsFromDb(ticks, rOf);
      axis=tr('dB','дБ');
    }
    return {mode, spanDb, rOf, rings, axis,
            label:()=>tr(SCALE_LABEL[mode].en, SCALE_LABEL[mode].uk)};
  }
  const DEFAULT_SCALE = makeScale('log',40);

  /* =========================================== LOG FREQUENCY CONTROL ===== */
  /* A logarithmic frequency slider with a manual numeric entry beside it,
     as in horn_antenna_pattern.html: one decade per equal slider travel, an
     MHz box that clamps out-of-range entries and says so. Declared on an
     antenna as {id:'f', kind:'freq', fmin, fmax} with the limits in MHz;
     ctx.state.f comes back in GHz, which is what every compute() expects.
     Default span 1 MHz … 10 GHz; a millimetre-wave antenna raises fmax. */
  const FREQ_SLIDER_MAX = 1000;
  const FREQ_DEF_MIN_MHZ = 1, FREQ_DEF_MAX_MHZ = 10000;
  function freqSliderToMHz(v, lo, hi){
    const t = clamp(v/FREQ_SLIDER_MAX, 0, 1);
    return Math.pow(10, Math.log10(lo) + t*(Math.log10(hi)-Math.log10(lo)));
  }
  function freqMHzToSlider(mhz, lo, hi){
    const t = (Math.log10(mhz)-Math.log10(lo))/(Math.log10(hi)-Math.log10(lo));
    return Math.round(clamp(t,0,1)*FREQ_SLIDER_MAX);
  }
  function fmtFreqMHz(mhz){
    if(mhz < 1)     return (mhz*1000).toFixed(0)+' '+unit('kHz');
    if(mhz < 1000)  return (mhz<10?mhz.toFixed(2):mhz.toFixed(1))+' '+unit('MHz');
    return (mhz/1000).toFixed(mhz<10000?2:1)+' '+unit('GHz');
  }
  function fmtRangeMHz(lo, hi){ return fmtFreqMHz(lo)+' … '+fmtFreqMHz(hi); }

  /* ==================================================== GROUND REFLECTION */
  /* Image theory over a flat perfectly-conducting ground a height h below the
     antenna. In the atlas the E-plane panel is the VERTICAL cut and the
     H-plane panel is the horizontal (azimuth) one, so 0° in the E cut lies in
     the horizontal plane and the plot angle IS the elevation ψ above ground.

         horizontal polarisation (Γ = −1):  AF = 2·|sin(k·h·sinψ)|
         vertical   polarisation (Γ = +1):  AF = 2·|cos(k·h·sinψ)|

     and nothing radiates below the horizon (sinψ < 0), which the ground now
     blocks. Only the vertical cut is affected — in the horizontal plane the
     factor is constant with azimuth and normalises straight back out.

     Note h is in metres while the lobing period is set by h/λ: past a few
     hundred wavelengths the interference fringes get finer than the plot can
     resolve, which is physically true rather than a drawing artefact.        */
  const GND_POL = {   // antennas whose radiator is vertical over the ground
    monopole:'v', discone:'v', 'rubber-duck':'v', ifa:'v', biconical:'v',
    collinear:'v', 'sector-panel':'v', helical:'v', 'nfc-loop':'v',
    meander:'v', chip:'v', 'uhf-rfid':'v'
  };
  function groundPolOf(id){ return GND_POL[id]||'h'; }

  // h metres, lambda metres, pol 'h'|'v' → factor(angleDeg) on the vertical cut
  function groundFactor(hM, lamM, pol){
    if(!(hM>0) || !isFinite(hM) || !(lamM>0)) return null;   // free space
    const kh = 2*Math.PI*hM/lamM;
    const vert = (pol==='v');
    return function(deg){
      const s = Math.sin(deg*D2R);
      if(s < 0) return 0;                        // below the horizon: blocked
      const x = kh*s;
      return 2*Math.abs(vert ? Math.cos(x) : Math.sin(x));
    };
  }
  /* Log slider: positions 0..1000 map 1 m … 100 km, and the last stop past
     that is FREE SPACE (no ground at all), which is where it starts.
     Defaulting the ground ON would quietly wreck most of the atlas: at 60 GHz
     a lens 10 m up is 400 λ high, and the interference comb that produces is
     physically correct but finer than any plot can show. Engaging the ground
     is therefore a deliberate move of the slider. */
  const GND_MIN_M = 1, GND_MAX_M = 100000, GND_SLIDER_MAX = 1000;
  const GND_FREE = GND_SLIDER_MAX + 10;         // slider position meaning ∞
  function gndSliderToM(v){
    if(v > GND_SLIDER_MAX) return Infinity;      // free space
    const t = clamp(v/GND_SLIDER_MAX, 0, 1);
    return Math.pow(10, Math.log10(GND_MIN_M) + t*(Math.log10(GND_MAX_M)-Math.log10(GND_MIN_M)));
  }
  function gndMToSlider(m){
    if(!isFinite(m)) return GND_FREE;
    const t = (Math.log10(m)-Math.log10(GND_MIN_M))/(Math.log10(GND_MAX_M)-Math.log10(GND_MIN_M));
    return Math.round(clamp(t,0,1)*GND_SLIDER_MAX);
  }
  function fmtGnd(m){
    if(!isFinite(m)) return tr('free space','вільний простір');
    if(m<1000) return m.toFixed(m<10?2:0)+' '+unit('m');
    return (m/1000).toFixed(m<10000?2:0)+' '+tr('km','км');
  }
  // how many wavelengths up — the number that actually governs the lobing
  function gndLam(m, lamM){ return (isFinite(m)&&lamM>0) ? m/lamM : null; }

  /* ============================================================ PLOTTING */
  // Semicircle polar grid, boresight UP, angular range ±90°, radial dB 0..-40.
  function polarGridHalf(cx,cy,R,sc){
    sc = sc||DEFAULT_SCALE;
    let s='';
    sc.rings.forEach(g=>{
      const r=R*g.r;
      if(r<0.01) return;
      s+=`<path class="ring" d="M ${cx-r},${cy} A ${r},${r} 0 0 1 ${cx+r},${cy}" />`;
      s+=`<text class="ring-label" x="${cx+r+5}" y="${cy-3}">${g.label}</text>`;
    });
    s+=`<text class="ring-label" x="${cx+R+5}" y="${cy+12}">${sc.axis}</text>`;
    for(let deg=-90;deg<=90;deg+=15){
      const rad=deg*D2R, x=cx+R*Math.sin(rad), y=cy-R*Math.cos(rad);
      s+=`<line class="spoke" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" />`;
      s+=`<text class="spoke-label" x="${x+12*Math.sin(rad)}" y="${y-12*Math.cos(rad)+3}" text-anchor="middle">${deg}°</text>`;
    }
    return s;
  }
  // Trace from a sampled half-pattern, mirrored across boresight. dB scale.
  function polarTraceHalf(s, cx,cy,R, stroke, fill, sc){
    sc = sc||DEFAULT_SCALE;
    const {arr,stepDeg,maxDeg,n}=s; const pts=[];
    let peak=0; for(let i=0;i<n;i++) if(arr[i]>peak) peak=arr[i];
    peak=peak||1e-9;
    for(let deg=-90;deg<=90;deg+=0.5){
      const a=Math.min(maxDeg, Math.abs(deg));
      const idx=Math.min(n-1, Math.round(a/stepDeg));
      const r=R*sc.rOf(arr[idx]/peak);
      pts.push(`${(cx+r*Math.sin(deg*D2R)).toFixed(1)},${(cy-r*Math.cos(deg*D2R)).toFixed(1)}`);
    }
    return `<path d="M ${cx},${cy} L ${pts.join(' L ')} L ${cx},${cy} Z" style="stroke:${stroke}; fill:${fill}; stroke-width:2;" />`;
  }
  // Full-circle polar grid, 0° UP, full 360°, radial dB 0..-40.
  function polarGridFull(cx,cy,R,sc){
    sc = sc||DEFAULT_SCALE;
    let s='';
    sc.rings.forEach(g=>{
      const r=R*g.r;
      if(r<0.01) return;
      s+=`<circle class="ring" cx="${cx}" cy="${cy}" r="${r}" />`;
      s+=`<text class="ring-label" x="${cx+3}" y="${cy-r-2}">${g.label}</text>`;
    });
    for(let deg=0;deg<360;deg+=30){
      const rad=deg*D2R, x=cx+R*Math.sin(rad), y=cy-R*Math.cos(rad);
      s+=`<line class="spoke" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" />`;
      s+=`<text class="spoke-label" x="${cx+(R+12)*Math.sin(rad)}" y="${cy-(R+12)*Math.cos(rad)+3}" text-anchor="middle">${deg}°</text>`;
    }
    return s;
  }
  // Full 360° trace. fnFull(angleDeg) → magnitude (angle measured from 0°=up).
  function polarTraceFull(fnFull, cx,cy,R, stroke, fill, peakOverride, sc){
    sc = sc||DEFAULT_SCALE;
    let peak=peakOverride||0;
    if(!peak){ for(let d=0;d<360;d+=0.5){ const v=Math.abs(fnFull(d)); if(v>peak) peak=v; } peak=peak||1e-9; }
    const pts=[];
    for(let deg=0;deg<=360;deg+=0.5){
      const r=R*sc.rOf(Math.abs(fnFull(deg))/peak);
      pts.push(`${(cx+r*Math.sin(deg*D2R)).toFixed(1)},${(cy-r*Math.cos(deg*D2R)).toFixed(1)}`);
    }
    return `<path d="M ${pts.join(' L ')} Z" style="stroke:${stroke}; fill:${fill}; stroke-width:2;" />`;
  }
  // Cartesian dB-vs-angle plot. fn(angleDeg)→mag. Range [ang0,ang1], floor dB.
  function cartesianPlot(fn, x0,y0,w,h, ang0,ang1, floorDb, stroke, fill, peakOverride){
    floorDb=floorDb||-40; let s='';
    let peak=peakOverride||0;
    if(!peak){ for(let a=ang0;a<=ang1;a+=0.5){ const v=Math.abs(fn(a)); if(v>peak) peak=v; } peak=peak||1e-9; }
    // grid
    for(let db=0;db>=floorDb;db-=10){ const y=y0+(-db/-floorDb)*h;
      s+=`<line class="axis-line" x1="${x0}" y1="${y.toFixed(1)}" x2="${x0+w}" y2="${y.toFixed(1)}" />`;
      s+=`<text class="axis-label" x="${x0-4}" y="${y+3}" text-anchor="end">${db}</text>`; }
    const nA=6;
    for(let i=0;i<=nA;i++){ const a=ang0+(ang1-ang0)*i/nA, x=x0+w*i/nA;
      s+=`<line class="axis-line" x1="${x.toFixed(1)}" y1="${y0}" x2="${x.toFixed(1)}" y2="${y0+h}" />`;
      s+=`<text class="axis-label" x="${x.toFixed(1)}" y="${y0+h+12}" text-anchor="middle">${a.toFixed(0)}°</text>`; }
    const pts=[];
    for(let a=ang0;a<=ang1;a+=0.5){
      const db=Math.max(toDb(Math.abs(fn(a))/peak),floorDb);
      const x=x0+w*(a-ang0)/(ang1-ang0), y=y0+(-db/-floorDb)*h;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    s+=`<polyline points="${pts.join(' ')}" style="stroke:${stroke}; fill:none; stroke-width:2;" />`;
    return s;
  }

  /* ========================================================== SCHEMATICS */
  // λ scale ruler: picks a nice multiple of λ that lands in a readable pixel
  // range, draws a segment with end + quarter ticks + label.
  const RULER_MULTS=[16,8,4,2,1,0.5,0.25,0.125,0.0625];
  function pickRulerMult(lamCm,pxPerCm){
    const target=110,lo=52,hi=170; let best=null,be=Infinity;
    for(const m of RULER_MULTS){ const px=m*lamCm*pxPerCm; if(px<lo||px>hi) continue;
      const e=Math.abs(px-target); if(e<be){be=e;best=m;} }
    if(best!==null) return best;
    for(const m of RULER_MULTS){ const e=Math.abs(m*lamCm*pxPerCm-target); if(e<be){be=e;best=m;} }
    return best;
  }
  function rulerLabel(m){ if(m===1) return 'λ'; if(m>=1) return m+'λ'; return 'λ/'+Math.round(1/m); }
  function rulerSVG(x0,y,lamCm,pxPerCm){
    const m=pickRulerMult(lamCm,pxPerCm), px=m*lamCm*pxPerCm, x1=x0+px;
    let s=`<line class="ruler-line" x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" />`;
    [x0,x1].forEach(x=>{ s+=`<line class="ruler-tick" x1="${x}" y1="${y-7}" x2="${x}" y2="${y+7}" />`; });
    for(let q=1;q<=3;q++){ const x=x0+px*q/4, hh=(q===2)?5:3.5;
      s+=`<line class="ruler-tick minor" x1="${x}" y1="${y-hh}" x2="${x}" y2="${y+hh}" />`; }
    s+=`<text class="ruler-label" x="${x0}" y="${y-11}" text-anchor="middle">0</text>`;
    s+=`<text class="ruler-label" x="${x1}" y="${y-11}" text-anchor="middle">${rulerLabel(m)}</text>`;
    s+=`<text class="ruler-label" x="${x1+9}" y="${y+4}" text-anchor="start">λ = ${lamCm.toFixed(2)} ${unit('cm')}</text>`;
    s+=`<text class="ruler-sub" x="${x0}" y="${y+19}" text-anchor="start">${tr('drawing scale','масштаб')}</text>`;
    return s;
  }
  // Horizontal dimension line with end ticks + label under it.
  function dimLineH(x0,x1,y,label){
    let s=`<line class="schem-dim" x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" />`;
    s+=`<line class="schem-dim" x1="${x0}" y1="${y-4}" x2="${x0}" y2="${y+4}" />`;
    s+=`<line class="schem-dim" x1="${x1}" y1="${y-4}" x2="${x1}" y2="${y+4}" />`;
    s+=`<text class="schem-dim-label" x="${(x0+x1)/2}" y="${y+14}" text-anchor="middle">${label}</text>`;
    return s;
  }
  // Vertical dimension line with end ticks + label to the right.
  function dimLineV(x,y0,y1,label){
    let s=`<line class="schem-dim" x1="${x}" y1="${y0}" x2="${x}" y2="${y1}" />`;
    s+=`<line class="schem-dim" x1="${x-4}" y1="${y0}" x2="${x+4}" y2="${y0}" />`;
    s+=`<line class="schem-dim" x1="${x-4}" y1="${y1}" x2="${x+4}" y2="${y1}" />`;
    s+=`<text class="schem-dim-label" x="${x+7}" y="${(y0+y1)/2+3}" text-anchor="start">${label}</text>`;
    return s;
  }
  /* ------------------------------------------------ two-view schematics ---
     The two panels are different PROJECTIONS of the same antenna, not the
     same drawing twice:

       E panel — side ELEVATION, the vertical plane, ground at the bottom.
       H panel — PLAN view looking straight down, the horizontal (azimuth)
                 plane.

     compute() returns {schemE, schemH}. A body of revolution about a
     horizontal boresight (a dish, a lens) genuinely looks the same both ways;
     those set schemSame:true so the caption says so rather than leaving the
     reader wondering whether the drawing is broken.                        */
  function viewCap(en, uk, x, y){
    x=(x===undefined)?8:x; y=(y===undefined)?244:y;
    return `<text class="schem-view" x="${x}" y="${y}" data-en="${en}" data-uk="${uk}">${tr(en,uk)}</text>`;
  }
  const CAP_E = ()=>viewCap('side elevation (vertical plane)','вигляд збоку (вертикальна площина)');
  const CAP_H = ()=>viewCap('plan view from above (horizontal plane)','вигляд згори (горизонтальна площина)');
  const CAP_SAME = ()=>viewCap('body of revolution — both views identical','тіло обертання — вигляди однакові');

  // Ground plane with hatching, for a side elevation.
  function groundHatch(x0,x1,y){
    let s=`<line class="schem-ground" x1="${x0}" y1="${y}" x2="${x1}" y2="${y}"/>`;
    for(let x=x0;x<x1;x+=9) s+=`<line class="schem-ground-h" x1="${x}" y1="${y}" x2="${x-6}" y2="${y+7}"/>`;
    return s;
  }
  // A conductor running perpendicular to the page: ⊙ (toward) / ⊗ (away).
  function conductorEndOn(x,y,r,away){
    r=r||5;
    let s=`<circle class="schem-endon" cx="${x}" cy="${y}" r="${r}"/>`;
    if(away){ const d=r*0.7;
      s+=`<line class="schem-endon-m" x1="${x-d}" y1="${y-d}" x2="${x+d}" y2="${y+d}"/>`;
      s+=`<line class="schem-endon-m" x1="${x-d}" y1="${y+d}" x2="${x+d}" y2="${y-d}"/>`;
    } else { s+=`<circle class="schem-endon-c" cx="${x}" cy="${y}" r="${Math.max(r*0.28,1.3)}"/>`; }
    return s;
  }
  // Dashed reference circle marking an omnidirectional azimuth, in plan view.
  function azimuthCircle(cx,cy,r,color){
    return `<circle class="schem-azim" style="stroke:${color||'var(--dim)'}" cx="${cx}" cy="${cy}" r="${r}"/>`;
  }
  // Vertical rod (side elevation of a vertical radiator), feed gap at centre.
  function rodVert(cx,cy,Lpx,cls){
    const gap=5, y0=cy-Lpx/2, y1=cy+Lpx/2;
    return `<line class="${cls}" x1="${cx}" y1="${y0}" x2="${cx}" y2="${cy-gap}"/>`+
           `<line class="${cls}" x1="${cx}" y1="${cy+gap}" x2="${cx}" y2="${y1}"/>`+
           `<circle class="schem-node" cx="${cx}" cy="${cy-gap}" r="2"/>`+
           `<circle class="schem-node" cx="${cx}" cy="${cy+gap}" r="2"/>`;
  }

  // Boresight arrow at (x,y) pointing right, coloured, with a 0° label.
  function boresightArrow(x,y,len,color,idSuffix){
    const x1=x+len;
    let s=`<defs><marker id="ar-${idSuffix}" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" style="fill:${color}"/></marker></defs>`;
    s+=`<line class="schem-boresight" style="stroke:${color}" x1="${x}" y1="${y}" x2="${x1}" y2="${y}" marker-end="url(#ar-${idSuffix})"/>`;
    s+=`<text class="schem-boresight-label" style="fill:${color}" x="${x1+6}" y="${y+3}">0°</text>`;
    return s;
  }

  /* ================================================= UI: mount() engine */
  // Registry so a single window.onLangChange re-renders every explorer.
  const EXPLORERS=[];
  // Live values of the universal trailing controls, keyed by explorer prefix
  // (== antenna id on every page), read back by renderPlanes().
  const EXTRAS={};
  // control descriptors per explorer prefix, for the optimum markers
  const CTRLS={};

  /* Build one interactive explorer inside a container element.
     spec = {
       root:  DOM element (or use rootId)
       rootId: element id to mount into
       methods: [{id, en, uk}]  (optional; renders the method switch)
       controls:[{id, kind:'range'|'select', en, uk, min,max,step,value,
                  unit, fmt(v)->str, options:[{value,en,uk}], hint:{en,uk}}]
       groupsHTML: string  (raw HTML appended to the controls column — the
                   parameter-readout .group blocks; author owns the ids)
       planesHTML: string  (raw HTML for the planes column — svgs + readouts)
       render: function(ctx)  ctx = {state, methodId, lang, el(id), root,
                   setVal(cid,str), enable(cid,bool), setMethodBody() }
     }
     Element ids created by controls are namespaced "<prefix>_<control.id>".
     ctx.state maps control.id → number|string (current live values). */
  function mount(prefix, spec){
    const root = spec.root || document.getElementById(spec.rootId||('exp-'+prefix));
    if(!root){ console.warn('AntennaLab.mount: no root for',prefix); return null; }
    let methodId = spec.methods && spec.methods.length ? spec.methods[0].id : null;

    // ---- build markup ----
    let ctrlHTML='';
    if(spec.methods && spec.methods.length){
      ctrlHTML+='<div class="method-switch">'+spec.methods.map((m,i)=>
        `<button type="button" class="method-btn${i===0?' active':''}" data-method="${m.id}" data-en="${m.en}" data-uk="${m.uk}">${m.en}</button>`).join('')+'</div>';
    }
    (spec.controls||[]).forEach(cc=>{
      const cid=prefix+'_'+cc.id;
      const hint=cc.hint?`<div class="ctl-hint" data-en="${cc.hint.en}" data-uk="${cc.hint.uk}">${cc.hint.en}</div>`:'';
      if(cc.kind==='freq'){
        const lo=cc.fmin||FREQ_DEF_MIN_MHZ, hi=cc.fmax||FREQ_DEF_MAX_MHZ;
        const startMHz=(cc.value!==undefined?cc.value:1)*1000;   // value is GHz
        ctrlHTML+=
          `<div class="ctl ctl-freq" id="${cid}_ctl" data-fmin="${lo}" data-fmax="${hi}">`+
            `<label><span class="lbl-text" data-en="${cc.en}" data-uk="${cc.uk}">${cc.en}</span>`+
            ` <span class="val" id="${cid}_val"></span></label>`+
            `<div class="slider-track"><span class="slider-mark" id="${cid}_mark"></span><span class="slider-mark" id="${cid}_mark2"></span><input type="range" id="${cid}" min="0" max="${FREQ_SLIDER_MAX}" step="1" value="${freqMHzToSlider(startMHz,lo,hi)}"></div>`+
            `<div class="manual-input">`+
              `<span class="range-hint">${lo} – ${hi}</span>`+
              `<span class="value-group"><input type="number" id="${cid}_num" min="${lo}" max="${hi}" step="any" value="${startMHz.toFixed(3)}">`+
              `<span class="unit">${unit('MHz')}</span></span>`+
            `</div>`+
            `<div class="input-error" id="${cid}_err"></div>`+
          `</div>`;
      } else if(cc.kind==='select'){
        const opts=(cc.options||[]).map(o=>`<option value="${o.value}"${String(o.value)===String(cc.value)?' selected':''} data-en="${o.en||o.value}" data-uk="${o.uk||o.en||o.value}">${o.en||o.value}</option>`).join('');
        ctrlHTML+=`<div class="ctl" id="${cid}_ctl"><label><span class="lbl-text" data-en="${cc.en}" data-uk="${cc.uk}">${cc.en}</span></label><select id="${cid}">${opts}</select>${hint}</div>`;
      } else {
        ctrlHTML+=`<div class="ctl" id="${cid}_ctl"><label><span class="lbl-text" data-en="${cc.en}" data-uk="${cc.uk}">${cc.en}</span> <span class="val" id="${cid}_val"></span></label>`+
          `<div class="slider-track"><span class="slider-mark" id="${cid}_mark"></span><span class="slider-mark" id="${cid}_mark2"></span><input type="range" id="${cid}" min="${cc.min}" max="${cc.max}" step="${cc.step}" value="${cc.value}"></div>${hint}</div>`;
      }
    });
    // where compute() reports optimum-parameter values, they are listed here
    ctrlHTML+=`<div class="opt-readout" id="${prefix}_optreadout" style="display:none"></div>`;

    /* ---- universal trailing controls -------------------------------------
       Every explorer gets the same two at the end, injected here so all 41
       antennas pick them up without touching a page: the distance to ground
       (second to last) and the radiation-pattern scale (last, with its dB
       span as a sub-control that only applies to the logarithmic mode). */
    if(spec.extras!==false){
      const gid=prefix+'___gnd', sid=prefix+'___scale', pid=prefix+'___span';
      ctrlHTML+=
        `<div class="ctl" id="${gid}_ctl">`+
          `<label><span class="lbl-text" data-en="Distance to ground" data-uk="Відстань до землі">Distance to ground</span>`+
          ` <span class="val" id="${gid}_val"></span></label>`+
          `<div class="slider-track"><input type="range" id="${gid}" min="0" max="${GND_FREE}" step="1" value="${GND_FREE}"></div>`+
          `<div class="ctl-hint" data-en="Perfect-ground image theory on the vertical cut. Log scale 1 m … 100 km; the top of the slider is free space (no ground). What matters is the height in wavelengths."`+
          ` data-uk="Теорія зображень над ідеальною землею у вертикальному перерізі. Лог. шкала 1 м … 100 км; верх повзунка — вільний простір (без землі). Визначальна величина — висота в довжинах хвиль.">`+
          `Perfect-ground image theory on the vertical cut. Log scale 1 m … 100 km; the top of the slider is free space (no ground).</div>`+
        `</div>`+
        `<div class="ctl ctl-scale" id="${sid}_ctl">`+
          `<label><span class="lbl-text" data-en="Pattern scale" data-uk="Шкала діаграми">Pattern scale</span></label>`+
          `<select id="${sid}">`+
            SCALE_IDS.map(m=>`<option value="${m}"${m==='log'?' selected':''} data-en="${SCALE_LABEL[m].en}" data-uk="${SCALE_LABEL[m].uk}">${SCALE_LABEL[m].en}</option>`).join('')+
          `</select>`+
          `<div class="span-row" id="${pid}_row">`+
            `<span class="span-lbl" data-en="dB range" data-uk="Діапазон дБ">dB range</span>`+
            `<select id="${pid}">`+
              SPAN_CHOICES.map(v=>`<option value="${v}"${v===40?' selected':''}>${v} dB</option>`).join('')+
            `</select>`+
          `</div>`+
        `</div>`;
    }
    ctrlHTML+=(spec.groupsHTML||'');

    root.classList.add('explorer');
    root.innerHTML =
      `<div class="controls-col">${ctrlHTML}</div>`+
      `<div class="planes-col">${spec.planesHTML||''}</div>`;

    // ---- state + ctx ----
    function readState(){
      const st={};
      (spec.controls||[]).forEach(cc=>{
        const e=document.getElementById(prefix+'_'+cc.id);
        if(!e) return;
        if(cc.kind==='freq'){
          const lo=cc.fmin||FREQ_DEF_MIN_MHZ, hi=cc.fmax||FREQ_DEF_MAX_MHZ;
          st[cc.id]=freqSliderToMHz(parseFloat(e.value),lo,hi)/1000;   // GHz
        } else {
          st[cc.id]= cc.kind==='select' ? e.value : parseFloat(e.value);
        }
      });
      return st;
    }
    const ctx={
      lang: ()=>lang(),
      get methodId(){ return methodId; },
      get state(){ return readState(); },
      el:(id)=>document.getElementById(prefix+'_'+id),
      root,
      byId:(id)=>document.getElementById(id),
      setVal:(cid,str)=>{ const e=document.getElementById(prefix+'_'+cid+'_val'); if(e) e.innerHTML=str; },
      enable:(cid,on)=>{ const e=document.getElementById(prefix+'_'+cid), ct=document.getElementById(prefix+'_'+cid+'_ctl');
        if(e) e.disabled=!on; if(ct) ct.classList.toggle('disabled',!on); }
    };

    function doRender(){
      // publish the universal extras before compute() runs, so renderPlanes()
      // can pick up the live ground height and pattern scale for this antenna
      if(spec.extras!==false){
        const g=document.getElementById(prefix+'___gnd'),
              s=document.getElementById(prefix+'___scale'),
              p=document.getElementById(prefix+'___span'),
              row=document.getElementById(prefix+'___span_row');
        const gm=gndSliderToM(g?parseFloat(g.value):GND_FREE);
        const mode=s?s.value:'log', span=p?parseInt(p.value,10):40;
        const gv=document.getElementById(prefix+'___gnd_val');
        if(gv) gv.innerHTML=fmtGnd(gm);
        if(row) row.style.display=(mode==='log')?'flex':'none';
        EXTRAS[prefix]={gndM:gm, scale:makeScale(mode,span)};
      }
      // auto-fill range value readouts
      (spec.controls||[]).forEach(cc=>{
        if(cc.kind==='select') return;
        const e=document.getElementById(prefix+'_'+cc.id); if(!e) return;
        if(cc.kind==='freq'){
          const lo=cc.fmin||FREQ_DEF_MIN_MHZ, hi=cc.fmax||FREQ_DEF_MAX_MHZ;
          const mhz=freqSliderToMHz(parseFloat(e.value),lo,hi);
          ctx.setVal(cc.id, fmtFreqMHz(mhz));
          const n=document.getElementById(prefix+'_'+cc.id+'_num');
          if(n && document.activeElement!==n) n.value=(mhz<10?mhz.toFixed(3):mhz.toFixed(1));
          return;
        }
        const v=parseFloat(e.value);
        const str=cc.fmt?cc.fmt(v):(v+(cc.unit?(' '+unit(cc.unit)):''));
        ctx.setVal(cc.id,str);
      });
      // method switch active state + description-body show/hide. Bodies may
      // live outside the explorer root (in a .method-desc block), so search
      // the enclosing <section>.
      if(spec.methods){
        root.querySelectorAll('.method-btn').forEach(b=>b.classList.toggle('active',b.getAttribute('data-method')===methodId));
        const scope=root.closest('section')||document;
        scope.querySelectorAll('.method-body[data-method]').forEach(b=>{
          b.classList.toggle('hidden', b.getAttribute('data-method')!==methodId);
        });
      }
      if(spec.render) spec.render(ctx);
    }

    // ---- wire inputs ----
    (spec.controls||[]).forEach(cc=>{
      const e=document.getElementById(prefix+'_'+cc.id);
      if(e) e.addEventListener('input', doRender);
      if(cc.kind!=='freq') return;
      const lo=cc.fmin||FREQ_DEF_MIN_MHZ, hi=cc.fmax||FREQ_DEF_MAX_MHZ;
      const num=document.getElementById(prefix+'_'+cc.id+'_num');
      const err=document.getElementById(prefix+'_'+cc.id+'_err');
      if(!num) return;
      num.addEventListener('change', ()=>{
        const raw=parseFloat(num.value);
        if(!isFinite(raw)){
          if(err) err.textContent=tr(`Enter a number between ${lo} and ${hi} MHz`,
                                     `Введіть число від ${lo} до ${hi} МГц`);
          doRender(); return;
        }
        const cl=clamp(raw,lo,hi);
        if(err) err.textContent=(cl!==raw)
          ? tr(`Clamped to ${lo}–${hi} MHz`, `Обмежено діапазоном ${lo}–${hi} МГц`) : '';
        e.value=freqMHzToSlider(cl,lo,hi);
        num.value=(cl<10?cl.toFixed(3):cl.toFixed(1));
        doRender();
      });
      e.addEventListener('input', ()=>{ if(err) err.textContent=''; });
    });
    if(spec.extras!==false){
      ['___gnd','___scale','___span'].forEach(sfx=>{
        const e=document.getElementById(prefix+sfx);
        if(e){ e.addEventListener('input', doRender); e.addEventListener('change', doRender); }
      });
    }
    if(spec.methods){
      root.querySelectorAll('.method-btn').forEach(b=>{
        b.addEventListener('click', ()=>{ methodId=b.getAttribute('data-method'); doRender(); if(spec.onMethod) spec.onMethod(methodId); });
      });
    }

    CTRLS[prefix]=(spec.controls||[]).map(cc=>({id:cc.id, kind:cc.kind,
                     fmin:cc.fmin||FREQ_DEF_MIN_MHZ, fmax:cc.fmax||FREQ_DEF_MAX_MHZ}));
    const api={prefix, render:doRender, ctx, get methodId(){return methodId;},
      setMethod:(id)=>{ methodId=id; doRender(); }};
    EXPLORERS.push(api);
    doRender();
    return api;
  }

  // Re-render every mounted explorer (called on language change).
  function renderAll(){ EXPLORERS.forEach(e=>{ try{ e.render(); }catch(err){ console.warn(err); } }); }

  /* ------------------------------------------------- optimum finding ---- */
  // First sign change of fn on [lo,hi], refined by bisection. null if none.
  // Used for "where does the reactance cross zero" — i.e. resonance.
  function findRoot(fn, lo, hi, steps){
    steps=steps||80;
    let pv=fn(lo), pl=lo;
    for(let i=1;i<=steps;i++){
      const x=lo+(hi-lo)*i/steps, v=fn(x);
      if(isFinite(pv) && isFinite(v) && (pv<0)!==(v<0)){
        let a=pl, b=x;
        for(let k=0;k<40;k++){ const m=(a+b)/2;
          if((fn(a)<0)!==(fn(m)<0)) b=m; else a=m; }
        return (a+b)/2;
      }
      pv=v; pl=x;
    }
    return null;
  }
  // Argmax of fn on [lo,hi]: coarse scan then a golden-section refine.
  function argMax(fn, lo, hi, steps){
    steps=steps||40;
    let bx=lo, bv=-Infinity;
    for(let i=0;i<=steps;i++){ const x=lo+(hi-lo)*i/steps, v=fn(x);
      if(isFinite(v) && v>bv){ bv=v; bx=x; } }
    const h=(hi-lo)/steps;
    let a=Math.max(lo,bx-h), b=Math.min(hi,bx+h), gr=0.6180339887;
    let c=b-gr*(b-a), d=a+gr*(b-a);
    for(let k=0;k<30;k++){
      if(fn(c)>fn(d)){ b=d; } else { a=c; }
      c=b-gr*(b-a); d=a+gr*(b-a);
    }
    return (a+b)/2;
  }

  /* ============================================= OPTIMUM SLIDER MARKS ==== */
  /* horn_antenna_pattern.html puts a little triangle on a slider at the value
     that optimises the design, and lists those values underneath. Same idea
     here, but driven by the antenna: compute() returns

       optima:[{id:'<control id>', value:<in that control's units>,
                label:'a ≈ 6.1 cm for S_H = 0.375', tag:'h'|'e'}]

     and the engine places the marks. A value off the end of the slider is
     drawn faded at the end it ran off, and flagged in the readout — knowing
     the optimum is out of reach is itself useful. */
  function positionMark(markEl, inputEl, value){
    const min=parseFloat(inputEl.min), max=parseFloat(inputEl.max);
    const frac=(value-min)/(max-min);
    markEl.style.left=`calc(7px + (100% - 14px) * ${clamp(frac,0,1)})`;
    markEl.style.display='block';
    markEl.classList.toggle('out-of-range', frac<0 || frac>1);
  }

  function applyOptima(prefix, optima){
    const list=CTRLS[prefix]||[];
    list.forEach(cc=>{ ['_mark','_mark2'].forEach(sfx=>{
      const m=document.getElementById(prefix+'_'+cc.id+sfx);
      if(m){ m.style.display='none'; m.className='slider-mark'; } }); });
    const box=document.getElementById(prefix+'_optreadout');
    if(!optima || !optima.length){ if(box){ box.style.display='none'; box.innerHTML=''; } return; }

    const rows=[], used={};
    optima.forEach(o=>{
      const cc=list.find(c=>c.id===o.id);
      const inp=document.getElementById(prefix+'_'+o.id);
      // a control may carry two optima (the horn's length has one for each
      // plane) — the second goes in the spare mark slot
      const sfx = used[o.id] ? '_mark2' : '_mark';
      used[o.id]=true;
      const mk=document.getElementById(prefix+'_'+o.id+sfx);
      if(!inp||!mk||!cc) return;
      // a freq control's slider is a log position, not the value itself
      const pos = (cc.kind==='freq')
        ? freqMHzToSlider(o.value*1000, cc.fmin, cc.fmax)
        : o.value;
      mk.className='slider-mark'+(o.tag==='e'?' mark-e':'');
      positionMark(mk, inp, pos);
      const min=parseFloat(inp.min), max=parseFloat(inp.max);
      const off=(pos<min||pos>max) ? ' '+tr('(beyond the slider)','(поза шкалою)') : '';
      const tag=o.tag ? `<span class="tag-${o.tag}">${o.tag.toUpperCase()}</span> ` : '';
      rows.push(`▲ ${tag}${o.label}${off}`);
    });
    if(box){
      box.innerHTML=rows.join('<br>');
      box.style.display=rows.length?'block':'none';
    }
  }

  /* =============================================== two-plane layout ===== */
  // Horn-style layout for the generic single-pattern calculators: a schematic
  // above each polar plot, the Horizontal (H, azimuth) plane and the Vertical
  // (E, elevation) plane side by side. The compute() of an antenna returns a
  // single fnBeam = its VERTICAL (E-plane) cut; the H-plane is derived from a
  // per-antenna rule unless compute supplies fnH explicitly:
  //   'omni' → horizontal plane is omnidirectional (a full circle)
  //   'same' → horizontal plane equals the vertical cut (rotationally
  //            symmetric beam: endfire / pencil-beam antennas)
  // compute may override with out.hplane ('omni'|'same') or out.fnH (function).
  const HPLANE = {
    dipole:'omni','folded-dipole':'omni',monopole:'omni',ifa:'omni',pifa:'same',
    loop:'omni',helical:'same','rubber-duck':'omni',yagi:'same',lpda:'same',
    discone:'omni',rhombic:'same',beverage:'same',tfan:'omni',
    slot:'omni',waveguide:'same',biconical:'omni',
    parabolic:'same',cassegrain:'same','offset-dish':'same',corner:'same','grid-dish':'same',
    // A linear array of isotropic elements is a body of revolution about its
    // own axis: the plane perpendicular to the array really is omnidirectional.
    // ('same' would duplicate the array-axis cut into the perpendicular plane
    //  and turn a fan beam into a pencil beam — ~9 dB of directivity that
    //  isn't there, and it contradicts the directivityAxial() figure these
    //  pages already print.) Planar arrays (massive-mimo) do get a pencil beam.
    'phased-array':'omni','massive-mimo':'same',mimo:'omni',butler:'omni','stacked-yagi':'same',
    patch:'same',meander:'omni',chip:'omni',fractal:'omni',vivaldi:'same',
    'leaky-wave':'same','dielectric-lens':'same',luneburg:'same','metal-plate':'same',
    'sector-panel':'same',collinear:'omni','uhf-rfid':'omni','nfc-loop':'omni'
  };
  function hplaneOf(id){ return HPLANE[id]; }

  // planesHTML for a two-plane generic explorer.
  function planesTwo(id){
    const panel=(p,dot,en,uk,foot)=>`
      <div class="plane-panel">
        <div class="plane-title"><span class="dot" style="background:${dot}"></span><span data-en="${en}" data-uk="${uk}">${en}</span></div>
        <div class="sub-panel"><svg id="${id}_schem${p}" viewBox="0 0 400 250"></svg></div>
        <div class="sub-panel"><svg id="${id}_plot${p}" viewBox="0 0 400 360"></svg>
          <div class="plane-readout">${foot}</div>
        </div>
      </div>`;
    const hFoot=`<div class="item" style="grid-column:1 / -1"><div class="k" data-en="azimuth cut" data-uk="азимутальний переріз">azimuth cut</div><div class="v" id="${id}_hcap">-</div></div>`;
    const eFoot=[0,1,2,3].map(i=>`<div class="item"><div class="k" id="${id}_k${i}"></div><div class="v" id="${id}_v${i}">-</div></div>`).join('');
    // pattern3d.js, when loaded, appends the 3-D viewer below the two 2-D cuts
    const p3d = (window.AntennaLab && window.AntennaLab.panel3dHTML) ? window.AntennaLab.panel3dHTML(id) : '';
    return panel('H','var(--amber)','Horizontal plane (H)','Горизонтальна площина (H)',hFoot)
         + panel('E','var(--teal)','Vertical plane (E)','Вертикальна площина (E)',eFoot)
         + p3d;
  }

  function drawPolar(elId, fnDeg, plotMode, stroke, fill, sc){
    const el=document.getElementById(elId); if(!el) return;
    if(plotMode==='half'){ const CX=200,CY=320,R=185; const s=sampleHalf(fnDeg,0.1,90);
      el.innerHTML=polarGridHalf(CX,CY,R,sc)+polarTraceHalf(s,CX,CY,R,stroke,fill,sc);
    } else { const CX=200,CY=185,R=150;
      el.innerHTML=polarGridFull(CX,CY,R,sc)+polarTraceFull(fnDeg,CX,CY,R,stroke,fill,0,sc); }
  }

  // Draw both planes + schematic + readouts from a compute() output.
  function renderPlanes(id, out, a){
    const V='var(--teal)', A='var(--amber)';
    const ex=EXTRAS[id]||{};
    const sc=ex.scale||DEFAULT_SCALE;
    let fnE=out.fnE||out.fnBeam;
    const hp=out.hplane||HPLANE[id]||'same';
    let fnH=out.fnH||(hp==='omni'?function(){return 1;}:fnE);

    /* Ground reflection folds into the VERTICAL cut only (in the horizontal
       plane the factor is constant and normalises out). λ comes from the
       antenna's own meta3d, so an antenna that does not know its wavelength
       is simply left in free space. */
    const lamM=(out.meta3d&&out.meta3d.lamCm>0)?out.meta3d.lamCm/100:0;
    const gf=groundFactor(ex.gndM, lamM, groundPolOf(id));
    if(gf){
      const rawE=fnE;
      fnE=(deg)=>Math.abs(rawE(deg))*gf(deg);
      if(fnH===rawE) fnH=fnE;      // 'same' antennas keep the two cuts in step
    }
    const schem=out.schem||'';
    // uniquify marker ids in the duplicated (E) schematic so <marker> refs don't clash
    const schemE=out.schemE||schem.replace(/id="ar-/g,'id="arE-').replace(/url\(#ar-/g,'url(#arE-');
    const sH=document.getElementById(id+'_schemH'); if(sH) sH.innerHTML=out.schemH||schem;
    const sE=document.getElementById(id+'_schemE'); if(sE) sE.innerHTML=schemE;
    drawPolar(id+'_plotH', fnH, a.plot, A, 'rgba(242,166,90,0.12)', sc);
    drawPolar(id+'_plotE', fnE, a.plot, V, 'rgba(127,219,202,0.12)', sc);
    (out.readouts||[]).forEach((r,i)=>{ const k=document.getElementById(id+'_k'+i), v=document.getElementById(id+'_v'+i);
      if(k) k.textContent=r.k; if(v) v.innerHTML=r.v; });
    const hc=document.getElementById(id+'_hcap');
    if(hc){
      if(hp==='omni' && !out.fnH){ hc.textContent=tr('omni · 360°','всенапр. · 360°'); }
      else { const an=analyzePattern(fnH,180,0.3); hc.textContent='HPBW '+an.hpbw.toFixed(0)+'°'; }
    }
    // 3-D viewer (present only when pattern3d.js is loaded). compute() supplies
    // meta3d = {lamCm, sizeLam, sizeLabel, gainDbi}; anything missing is either
    // derived from the pattern itself or shown as “—”.
    applyOptima(id, out.optima);
    const P3=window.AntennaLab&&window.AntennaLab.draw3d;
    if(P3) P3(id,{fnE, fnH, plot:a.plot, sym:hp, hasFnH:!!out.fnH,
                  meta:out.meta3d||{}, scale:sc, gndM:(gf?ex.gndM:null)});
  }

  // Install a default onLangChange that re-renders explorers, then defers to a
  // page hook window.onLangChangePage if present.
  const prevLang=window.onLangChange;
  window.onLangChange=function(l){ renderAll(); if(typeof prevLang==='function') prevLang(l);
    if(typeof window.onLangChangePage==='function') window.onLangChangePage(l); };

  /* ------------------------------------------------------------- export */
  const AL={
    c, ETA0, D2R, R2D, lambdaOf, kOf, toDb, powDb, clamp,
    sinc, besselJ0, besselJ1, dipolePattern, apertureUniform, apertureCosine,
    apertureCircular, smallLoopPattern, arrayFactor, arrayFactorWeighted, fresnelIntegral,
    Si, Ci, Cin, dipoleZ,
    sampleHalf, findHPBW, findFirstSidelobe, analyzePattern, directivityAxial,
    fmtDeg, fmtDb, fmtAng, fmt, unit, tr, lang,
    polarGridHalf, polarTraceHalf, polarGridFull, polarTraceFull, cartesianPlot,
    rulerSVG, pickRulerMult, dimLineH, dimLineV, boresightArrow,
    viewCap, CAP_E, CAP_H, CAP_SAME, groundHatch, conductorEndOn,
    azimuthCircle, rodVert,
    mount, renderAll, planesTwo, renderPlanes, hplaneOf,
    makeScale, DEFAULT_SCALE, SCALE_IDS, SPAN_CHOICES,
    positionMark, applyOptima, findRoot, argMax,
    groundFactor, groundPolOf, gndSliderToM, gndMToSlider, fmtGnd,
    freqSliderToMHz, freqMHzToSlider, fmtFreqMHz, fmtRangeMHz
  };
  window.AntennaLab=AL; window.AL=AL;
})();
