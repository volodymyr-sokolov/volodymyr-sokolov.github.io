/* =========================================================================
   site.js — shared project chrome: the common header, the EN/UK language
   switch, the bilingual algorithm search, and the i18n engine.
   Include AFTER catalog.js. Add <div id="site-header"></div> and set
   <body data-page="home|asym|edwards"> on each page.
   ========================================================================= */
(function(){
  const LS_KEY='atlas-lang';
  let LANG = localStorage.getItem(LS_KEY) || 'en';
  if(LANG!=='en' && LANG!=='uk') LANG='en';

  const ROMAN = ['','I','II','III'];

  /* every page of the project — used for the header nav */
  const NAVPAGES = [
    {p:'home',       href:'index.html',        en:'Catalogue',    uk:'Каталог'},
    {p:'symmetric',  href:'symmetric.html',    en:'Symmetric',    uk:'Симетричні'},
    {p:'stream',     href:'stream.html',       en:'Stream',       uk:'Потокові'},
    {p:'modes',      href:'modes.html',        en:'Modes',        uk:'Режими'},
    {p:'prng',       href:'prng.html',         en:'Randomness',   uk:'Випадковість'},
    {p:'prngtest',   href:'prngtest.html',     en:'RNG tests',    uk:'Тести ГВЧ'},
    {p:'hash',       href:'hash.html',         en:'Hash & MAC',   uk:'Хеші та MAC'},
    {p:'asym',       href:'asymmetric.html',   en:'Asymmetric',   uk:'Асиметричні'},
    {p:'signatures', href:'signatures.html',   en:'Signatures',   uk:'Підписи'},
    {p:'hashsig',    href:'hashsig.html',      en:'Hash-sig',     uk:'Геш-підписи'},
    {p:'kex',        href:'keyexchange.html',  en:'Key exchange', uk:'Обмін ключами'},
    {p:'kdf',        href:'kdf.html',          en:'KDF',          uk:'KDF'},
    {p:'authproto',  href:'authprotocols.html',en:'Auth',         uk:'Автентифікація'},
    {p:'protocols',  href:'protocols.html',    en:'Protocols',    uk:'Протоколи'},
    {p:'analysis',   href:'cryptanalysis.html',en:'Cryptanalysis',uk:'Криптоаналіз'},
    {p:'symanalysis',href:'symcrypt.html',     en:'Sym-analysis', uk:'Аналіз шифрів'},
    {p:'sidechannels',href:'implattacks.html', en:'Side channels',uk:'Побічні канали'},
    {p:'cellular',   href:'cellular.html',     en:'Cellular',     uk:'Стільникові'},
    {p:'numtheory',  href:'numbertheory.html', en:'Number theory',uk:'Теорія чисел'},
    {p:'advanced',   href:'advanced.html',     en:'Advanced',     uk:'Поглиблене'},
    {p:'mpc',        href:'mpc.html',          en:'MPC',          uk:'Обчислення'},
    {p:'pairings',   href:'pairings.html',     en:'Pairings',     uk:'Спарювання'},
    {p:'standards',  href:'standards.html',    en:'Standards',    uk:'Стандарти'},
    {p:'worldciphers',href:'worldciphers.html',en:'World std',    uk:'Світові'},
    {p:'arithmetic', href:'arithmetic.html',   en:'Arithmetic',   uk:'Арифметика'},
    {p:'fieldeng',   href:'fieldeng.html',     en:'Field eng.',   uk:'Інж. полів'},
    {p:'privacy',    href:'privacy.html',      en:'Privacy',      uk:'Приватність'},
    {p:'quantum',    href:'quantum.html',      en:'Quantum',      uk:'Квантові'},
    {p:'lightweight',href:'lightweight.html',  en:'Lightweight',  uk:'Легковагові'},
    {p:'edwards',    href:'edwards.html',      en:'Edwards',      uk:'Едвардса'}
  ];

  /* flat searchable index of every algorithm */
  const INDEX = [];
  CATALOG.forEach(sec=>{
    sec.algos.forEach(a=>{
      INDEX.push({
        id:a.id, lvl:a.lvl,
        href:a.href || ((typeof HREFS!=='undefined') && HREFS[a.id]) || null,
        en:a.en, uk:a.uk, alias:a.alias||'',
        secEn:sec.en, secUk:sec.uk, secId:sec.id,
        hay:(a.en+' '+a.uk+' '+(a.alias||'')+' '+sec.en+' '+sec.uk).toLowerCase()
      });
    });
  });

  function t(key){ return (I18N[LANG]&&I18N[LANG][key])!==undefined ? I18N[LANG][key] : key; }

  /* ---- badge helper (used by every page) ------------------------------ */
  function badge(lvl, big){
    return '<span class="badge l'+lvl+(big?' lg':'')+'" title="Level '+ROMAN[lvl]+'">'+ROMAN[lvl]+'</span>';
  }

  /* ---- swap all [data-en]/[data-uk] text nodes ------------------------ */
  function applyI18n(root){
    (root||document).querySelectorAll('[data-en]').forEach(el=>{
      const v = el.getAttribute('data-'+LANG);
      // Attribute values in this project may contain inline markup (<b>, <br>),
      // so always swap via innerHTML rather than textContent.
      if(v!==null) el.innerHTML=v;
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
          <a class="brand" href="index.html">Crypto<span>·</span>Atlas</a>
          <nav>${nav}</nav>
          <div class="spacer"></div>
          <div class="hsearch">
            <input id="algoSearch" type="text" autocomplete="off" spellcheck="false"
              placeholder="${t('searchPlaceholder')}"
              data-ph-en="${I18N.en.searchPlaceholder}" data-ph-uk="${I18N.uk.searchPlaceholder}">
            <div class="results" id="searchResults"></div>
          </div>
          <div class="lang-switch">
            <a href="#" data-lang="en" class="${LANG==='en'?'active':''}">EN</a>
            <a href="#" data-lang="uk" class="${LANG==='uk'?'active':''}">UK</a>
          </div>
        </div>
      </div>`;

    holder.querySelectorAll('.lang-switch a').forEach(a=>{
      a.addEventListener('click', e=>{ e.preventDefault(); setLang(a.getAttribute('data-lang')); });
    });
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
            <span class="badge l${r.lvl}" title="Level">${ROMAN[r.lvl]}</span>
            <div><div class="rt">${name}${cxChip(r.id)}${r.href?' <span style="color:var(--teal)">→</span>':''}</div>
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
      else { location.href='index.html#algo-'+r.id; }
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
  function cxChip(id){
    const c=(typeof CX!=='undefined')&&CX[id];
    return c?' <span class="cx c'+c[1]+'" title="complexity">'+c[0]+'</span>':'';
  }
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
  window.atlasCx=cxChip;
  window.atlasExt=atlasExt;
  window.atlasRefs=atlasRefs;

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
    if(location.hash.startsWith('#algo-')){
      const el=document.getElementById(location.hash.slice(1));
      if(el){ el.scrollIntoView({block:'center'}); el.classList.add('flash'); }
    }
  });
})();
