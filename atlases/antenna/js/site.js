/* =========================================================================
   site.js — shared project chrome for the Antenna Atlas: the common header,
   the EN/UK language switch, the light/dark theme toggle, the bilingual
   antenna search, and the i18n engine.
   Include AFTER catalog.js. Add <div id="site-header"></div> and set
   <body data-page="home|wire|aperture|…"> on each page.

   The difficulty badge (I / II / III) is repurposed for this atlas as the
   ANALYSIS-METHOD complexity of an antenna:
     I  (green)  = analytical / closed-form   (traveling-wave, Biot–Savart,
                    image theory, cavity model, transmission-line)
     II (yellow) = semi-analytical             (array factor, aperture Fourier,
                    physical optics, GTD/UTD, geometric optics)
     III(orange) = full-wave numerical         (MoM/NEC, FEM, FDTD)
   ========================================================================= */
(function(){
  const LS_KEY='antatlas-lang';
  let LANG = localStorage.getItem(LS_KEY) || 'en';
  if(LANG!=='en' && LANG!=='uk') LANG='en';

  /* ---- theme (dark default) — applied to <html> before the header draws */
  const THEME_KEY='antatlas-theme';
  let THEME = localStorage.getItem(THEME_KEY) || 'dark';
  if(THEME!=='dark' && THEME!=='light') THEME='dark';
  document.documentElement.setAttribute('data-theme', THEME);
  const THEME_ICON = { dark:'☀', light:'☾' };
  const themeTitle = () => THEME==='dark' ? t('themeToLight') : t('themeToDark');

  const ROMAN = ['','I','II','III'];

  /* every page of the project — used for the header nav */
  const NAVPAGES = [
    {p:'home',          href:'index.html',          en:'Catalogue',      uk:'Каталог'},
    {p:'wire',          href:'wire.html',           en:'Wire',           uk:'Дротові'},
    {p:'aperture',      href:'aperture.html',       en:'Aperture',       uk:'Апертурні'},
    {p:'reflector',     href:'reflector.html',      en:'Reflector',      uk:'Рефлекторні'},
    {p:'array',         href:'array.html',          en:'Arrays',         uk:'Решітки'},
    {p:'printed',       href:'printed.html',        en:'Printed',        uk:'Друковані'},
    {p:'travelingwave', href:'travelingwave.html',  en:'Traveling-Wave', uk:'Біжуча хвиля'},
    {p:'lens',          href:'lens.html',           en:'Lens',           uk:'Лінзові'},
    {p:'sector',        href:'sector.html',         en:'Sector & Panel', uk:'Секторні'},
    {p:'rfid',          href:'rfid.html',           en:'RFID & NFC',     uk:'RFID/NFC'}
  ];

  /* flat searchable index of every antenna (matches EN, UK, aliases, tags) */
  const INDEX = [];
  CATALOG.forEach(sec=>{
    sec.antennas.forEach(a=>{
      const tagHay = [].concat(a.std||[], a.mod||[], a.mth||[]).join(' ');
      INDEX.push({
        id:a.id, lvl:a.lvl,
        href:a.href || ((typeof HREFS!=='undefined') && HREFS[a.id]) || null,
        en:a.en, uk:a.uk, alias:a.alias||'',
        secEn:sec.en, secUk:sec.uk, secId:sec.id,
        hay:(a.en+' '+a.uk+' '+(a.alias||'')+' '+sec.en+' '+sec.uk+' '+tagHay).toLowerCase()
      });
    });
  });

  function t(key){ return (I18N[LANG]&&I18N[LANG][key])!==undefined ? I18N[LANG][key] : key; }

  /* ---- badge helper (used by every page) ------------------------------ */
  function badge(lvl, big){
    return '<span class="badge l'+lvl+(big?' lg':'')+'" title="'+t('methodLvl'+lvl)+'">'+ROMAN[lvl]+'</span>';
  }

  /* ---- swap all [data-en]/[data-uk] text nodes ------------------------ */
  function applyI18n(root){
    (root||document).querySelectorAll('[data-en]').forEach(el=>{
      const v = el.getAttribute('data-'+LANG);
      if(v!==null) el.innerHTML=v;   // attribute values may contain <b>/<br>
    });
    (root||document).querySelectorAll('[data-ph-en]').forEach(el=>{
      const v = el.getAttribute('data-ph-'+LANG);
      if(v!==null) el.setAttribute('placeholder', v);
    });
    document.documentElement.lang = LANG;
  }

  /* ---- build the shared header ---------------------------------------- */
  function buildHeader(){
    const holder = document.getElementById('site-header');
    if(!holder) return;
    const page = document.body.getAttribute('data-page')||'';
    const nav = NAVPAGES.map(n=>`<a href="${n.href}" class="${page===n.p?'active':''}" data-en="${n.en}" data-uk="${n.uk}">${LANG==='uk'?n.uk:n.en}</a>`).join('');

    holder.innerHTML = `
      <div class="site-header">
        <div class="bar">
          <a class="brand" href="index.html">${LANG==='uk'?'Атлас<span>·</span>антен':'Antenna<span>·</span>Atlas'}</a>
          <div class="spacer"></div>
          <div class="hsearch">
            <input id="algoSearch" type="text" autocomplete="off" spellcheck="false"
              placeholder="${t('searchPlaceholder')}"
              data-ph-en="${I18N.en.searchPlaceholder}" data-ph-uk="${I18N.uk.searchPlaceholder}">
            <div class="results" id="searchResults"></div>
          </div>
          <button type="button" class="theme-toggle" id="themeToggle"
            title="${themeTitle()}" aria-label="${themeTitle()}">${THEME_ICON[THEME]}</button>
          <div class="lang-switch">
            <a href="#" data-lang="en" class="${LANG==='en'?'active':''}">EN</a>
            <a href="#" data-lang="uk" class="${LANG==='uk'?'active':''}">UK</a>
          </div>
        </div>
        <div class="navrow"><nav>${nav}</nav></div>
      </div>`;

    holder.querySelectorAll('.lang-switch a').forEach(a=>{
      a.addEventListener('click', e=>{ e.preventDefault(); setLang(a.getAttribute('data-lang')); });
    });
    const tt = holder.querySelector('#themeToggle');
    if(tt) tt.addEventListener('click', toggleTheme);
    wireSearch();
  }

  /* ---- live bilingual search ------------------------------------------ */
  function wireSearch(){
    const input = document.getElementById('algoSearch');
    const box   = document.getElementById('searchResults');
    if(!input||!box) return;
    let sel=-1, current=[];

    function render(list){
      current=list; sel=-1;
      if(!list.length){ box.innerHTML=`<div class="none">${t('noResults')}</div>`; box.classList.add('open'); return; }
      box.innerHTML = list.map((r,i)=>{
        const name = LANG==='uk'?r.uk:r.en;
        const sec  = LANG==='uk'?r.secUk:r.secEn;
        return `<div class="r" data-i="${i}">
            <span class="badge l${r.lvl}" title="method">${ROMAN[r.lvl]}</span>
            <div><div class="rt">${name}${r.href?' <span style="color:var(--teal)">→</span>':''}</div>
            <div class="rs">${r.secId}. ${sec}</div></div>
          </div>`;
      }).join('');
      box.classList.add('open');
      box.querySelectorAll('.r').forEach(el=>{
        el.addEventListener('click', ()=>go(current[+el.getAttribute('data-i')]));
      });
    }
    function go(r){
      if(!r) return;
      if(r.href){ location.href=r.href; }
      else { location.href='index.html#ant-'+r.id; }
    }
    function search(q){
      q=q.trim().toLowerCase();
      if(!q){ box.classList.remove('open'); return; }
      const terms=q.split(/\s+/);
      const list=INDEX.filter(r=>terms.every(term=>r.hay.includes(term))).slice(0,40);
      render(list);
    }
    input.addEventListener('input', ()=>search(input.value));
    input.addEventListener('focus', ()=>{ if(input.value) search(input.value); });
    input.addEventListener('keydown', e=>{
      const rows=box.querySelectorAll('.r');
      if(e.key==='ArrowDown'){ e.preventDefault(); sel=Math.min(sel+1,rows.length-1); }
      else if(e.key==='ArrowUp'){ e.preventDefault(); sel=Math.max(sel-1,0); }
      else if(e.key==='Enter'){ if(sel>=0&&current[sel]) go(current[sel]); else if(current.length) go(current[0]); return; }
      else if(e.key==='Escape'){ box.classList.remove('open'); input.blur(); return; }
      else return;
      rows.forEach((r,i)=>r.classList.toggle('sel',i===sel));
      if(rows[sel]) rows[sel].scrollIntoView({block:'nearest'});
    });
    document.addEventListener('click', e=>{
      if(!e.target.closest('.hsearch')) box.classList.remove('open');
    });
  }

  /* ---- theme switch --------------------------------------------------- */
  function toggleTheme(){
    THEME = THEME==='dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, THEME);
    document.documentElement.setAttribute('data-theme', THEME);
    const tt = document.getElementById('themeToggle');
    if(tt){
      tt.textContent = THEME_ICON[THEME];
      tt.title = themeTitle();
      tt.setAttribute('aria-label', themeTitle());
    }
    if(typeof window.onThemeChange==='function') window.onThemeChange(THEME);
  }

  /* ---- language switch ------------------------------------------------ */
  function setLang(lang){
    if(lang!=='en'&&lang!=='uk') return;
    LANG=lang; localStorage.setItem(LS_KEY,lang);
    window.LANG=LANG;
    buildHeader();
    applyI18n();
    if(typeof window.onLangChange==='function') window.onLangChange(LANG);
  }

  /* ---- shared helpers for content pages ------------------------------- */
  /* external link with ↗ icon, opens in a new window */
  function atlasExt(href,label){
    return '<a class="ext" href="'+href+'" target="_blank" rel="noopener">'+label+'</a>';
  }
  /* locale-aware reference chips: [{tag, en:{href,label}, uk?:{href,label}}]
     — if a Ukrainian source is missing, the English one is used. */
  function atlasRefs(list){
    return '<div class="refs">'+list.map(r=>{
      const loc=(LANG==='uk'&&r.uk)?r.uk:r.en;
      const tag=r.tag?'<span class="ref-tag">'+r.tag+'</span>':'';
      return '<a class="ext" href="'+loc.href+'" target="_blank" rel="noopener">'+tag+loc.label+'</a>';
    }).join('')+'</div>';
  }
  /* tag chips: kind = 'std'|'mod'|'mth'; list of strings */
  function atlasTags(std, mod, mth){
    const L = I18N[LANG];
    const chip=(cls,k,v)=>`<span class="tag ${cls}"><span class="tk">${k}</span>${v}</span>`;
    let s='';
    (std||[]).forEach(v=>s+=chip('std',L.tagStd,v));
    (mod||[]).forEach(v=>s+=chip('mod',L.tagMod,v));
    (mth||[]).forEach(v=>s+=chip('mth',L.tagMth,v));
    return '<div class="tags">'+s+'</div>';
  }

  window.atlasExt=atlasExt;
  window.atlasRefs=atlasRefs;
  window.atlasTags=atlasTags;

  /* ---- expose + boot -------------------------------------------------- */
  window.LANG=LANG;
  window.t=t;
  window.atlasBadge=badge;
  window.atlasRoman=ROMAN;
  window.setAtlasLang=setLang;
  window.applyI18n=applyI18n;

  document.addEventListener('DOMContentLoaded', ()=>{
    buildHeader();
    applyI18n();
    if(typeof window.onLangChange==='function') window.onLangChange(LANG);
    // deep-link highlight
    if(location.hash.startsWith('#ant-')){
      const el=document.getElementById(location.hash.slice(1));
      if(el){ el.scrollIntoView({block:'center'}); el.classList.add('flash'); }
    }
  });
})();
