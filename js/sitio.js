(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // frases que cambian en la portada
  const words = [...document.querySelectorAll('#words span')]; let w = 0;
  if(!reduce && words.length) setInterval(() => { const a = words[w]; a.classList.remove('on'); a.classList.add('out'); setTimeout(() => a.classList.remove('out'), 600); w = (w + 1) % words.length; words[w].classList.add('on'); }, 2600);
  // anillo de trabajos detrás del celular: gira despacio, los de atrás más chicos y transparentes
  (function(){
    const box = document.getElementById('orbit'); if(!box) return;
    const cards = [...box.children], n = cards.length, host = box.parentElement;
    let a0 = 0, last = 0, on = true, raf = 0;
    function place(){
      const R = innerWidth <= 860 ? Math.min(185, innerWidth * .47) : 330;
      cards.forEach((c, i) => {
        const t = a0 + i / n * Math.PI * 2, x = Math.sin(t) * R, z = Math.cos(t), k = (z + 1) / 2;     // k: 0 atrás, 1 adelante
        c.style.transform = `translate3d(${x.toFixed(1)}px, ${(-z * R * .2).toFixed(1)}px, 0) perspective(700px) rotateY(${(Math.sin(t) * -38).toFixed(1)}deg) scale(${(.55 + .45 * k).toFixed(3)})`;
        c.style.opacity = (.28 + .72 * k).toFixed(2); c.style.zIndex = Math.round(k * 100);
      });
    }
    function tick(ts){ if(last) a0 += (ts - last) / 1000 * (Math.PI * 2 / 48); last = ts; place(); raf = on ? requestAnimationFrame(tick) : 0; }
    place();
    if(reduce) return;
    new IntersectionObserver(es => { on = es[0].isIntersecting; if(on && !raf){ last = 0; raf = requestAnimationFrame(tick); } }).observe(host);
    addEventListener('resize', place);
  })();
  // tarjetas del probador en el anillo: van cambiando de campera con un barrido de arriba hacia abajo
  document.querySelectorAll('.ocyc').forEach((box, k) => {
    const imgs = [...box.children]; let i = 0, z = 1; if (reduce || imgs.length < 2) return;
    setTimeout(() => setInterval(() => {
      const nx = imgs[(i + 1) % imgs.length]; nx.style.transition = 'none'; nx.classList.remove('on'); void nx.offsetWidth;
      nx.style.transition = ''; nx.style.zIndex = ++z; nx.classList.add('on'); i = (i + 1) % imgs.length;
    }, 2600), k * 1300);
  });
  // capturas que se van alternando
  function cycle(id, ms){ const imgs = [...document.querySelectorAll('#' + id + ' img')]; let i = 0; if(reduce || imgs.length < 2) return; return setInterval(() => { imgs[i].classList.remove('on'); i = (i + 1) % imgs.length; imgs[i].classList.add('on'); }, ms); }
  cycle('heroScreen', 3200);
  let caseTimer = cycle('casePhone', 3600);
  // selector de captura del caso
  const btns = document.querySelectorAll('.switch button'); const desk = [...document.querySelectorAll('#deskView > *')];
  btns.forEach(b => b.addEventListener('click', () => { btns.forEach(x => x.setAttribute('aria-pressed', x === b)); desk.forEach((im, k) => im.classList.toggle('on', k === +b.dataset.v)); }));
  // experiencia interactiva: los videos se reproducen solo cuando están a la vista
  const ixVids = document.querySelectorAll('.ix-card video');
  if('IntersectionObserver' in window){ const ixo = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause()), { threshold:.3 }); ixVids.forEach(v => ixo.observe(v)); }
  else ixVids.forEach(v => v.play().catch(() => {}));

  // producto interactivo: la campera NUNCA gira sola. Al cargar se sacan cuadros de los videos (giro y apertura) y se
  // dibujan en un canvas según la posición del mouse: el giro sigue a la mano 1 a 1, sin demora. De frente, al acercarte
  // al cierre se ilumina; lo agarrás y al bajarlo se abre a la par de tu mano.
  (function(){
    const st = document.getElementById('p3'); if(!st) return;
    const cv = document.getElementById('p3c'), ctx = cv.getContext('2d'), zip = document.getElementById('p3zip');
    // Los cuadros ya vienen sacados de los videos de Kling, en tiras (6 columnas de 450×800): 4 tramos de giro
    // de 36 cuadros (144 = 2,5° cada uno) y 37 del cierre. Carga mucho más rápido que sacarlos del video en el navegador.
    const DIR = 'portfolio/ropa/campera-360/', SPIN = ['giro-1', 'giro-2', 'giro-3', 'giro-4'], OPEN = 'apertura', FW = 450, FH = 800, COLS = 6;
    const spinF = [], openF = [];
    let ready = false, angle = 0, vel = 0, open = 0, openGoal = 0, mode = null, lastX = 0, lastT = 0, raf = 0, drawn = '';
    const pic = name => new Promise((ok, bad) => { const i = new Image(); i.onload = () => ok(i); i.onerror = bad; i.src = DIR + name + '.webp'; });
    const cut = (img, out) => { const n = (img.width / FW) * (img.height / FH);
      for(let k = 0; k < n; k++){ const c = document.createElement('canvas'); c.width = FW; c.height = FH; c.getContext('2d').drawImage(img, (k % COLS) * FW, Math.floor(k / COLS) * FH, FW, FH, 0, 0, FW, FH); out.push(c); } };
    async function load(){
      const imgs = await Promise.all([...SPIN, OPEN].map(pic));
      imgs.slice(0, 4).forEach(i => cut(i, spinF)); cut(imgs[4], openF);
      spinF.length = 144; openF.length = 37;                    // las tiras tienen celdas vacías al final
      ready = true; st.classList.add('ready'); draw(true);
    }
    new IntersectionObserver((es, io) => { if(es[0].isIntersecting){ io.disconnect(); load(); } }, { rootMargin:'300px' }).observe(st);
    function size(){ const r = st.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1); cv.width = r.width * dpr; cv.height = r.height * dpr; drawn = ''; draw(true); }
    addEventListener('resize', size); size();
    const N = () => spinF.length;
    const frameIdx = () => { const n = N(); return ((Math.round(angle / 360 * n) % n) + n) % n; };
    function draw(force){
      if(!ready) return;
      const img = open > .002 ? openF[Math.min(openF.length - 1, Math.round(open * (openF.length - 1)))] : spinF[frameIdx()];
      const key = img === undefined ? '' : (open > .002 ? 'o' + Math.round(open * 100) : 's' + frameIdx());
      if(!force && key === drawn) return; drawn = key;
      ctx.drawImage(img, 0, 0, cv.width, cv.height);
      zip.style.setProperty('--zp', open.toFixed(3));
      const f = frameIdx(), n = N(); st.classList.toggle('front', open < .98 && (f <= 5 || f >= n - 5) && Math.abs(vel) <= 4);
    }
    function tick(ts){
      const dt = lastT ? Math.min(.05, (ts - lastT) / 1000) : 0; lastT = ts; let busy = false;
      if(mode !== 'spin' && Math.abs(vel) > 4){ angle += vel * dt; vel *= Math.pow(.02, dt); busy = true; }   // inercia corta al soltar
      if(mode !== 'zip' && open !== openGoal){ open += (openGoal - open) * Math.min(1, dt * 12); if(Math.abs(openGoal - open) < .01) open = openGoal; busy = true; }
      if(!mode && !busy){                                                             // imán suave: si quedó casi de frente, se acomoda de frente
        const off = ((angle % 360) + 540) % 360 - 180;
        if(Math.abs(off) > .3 && Math.abs(off) < 14){ angle -= off * Math.min(1, dt * 10); busy = true; }
      }
      if(!busy) vel = 0;
      draw(); raf = busy ? requestAnimationFrame(tick) : 0; if(!busy) lastT = 0;
    }
    const kick = () => { if(!raf) raf = requestAnimationFrame(tick); };
    // zona del cierre (en % del cuadro): una franja angosta en el centro, del cuello al ruedo
    function nearZip(e){
      if(!ready || Math.abs(vel) > 4) return false; const n = N(), f = frameIdx(); if(!(f <= 5 || f >= n - 5)) return false;   // de frente o casi
      const r = st.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      const zt = parseFloat(getComputedStyle(st).getPropertyValue('--zt')) / 100 || .308, zh = parseFloat(getComputedStyle(st).getPropertyValue('--zh')) / 100 || .427;
      if(open > .98) return false;
      const py = zt + open * zh;                                                       // donde está el tirador ahora
      return Math.abs(x - .5) < .1 && y > py - .07 && y < py + .09;
    }
    st.addEventListener('pointermove', e => {
      if(mode === 'spin'){
        if(wasOpen){ if(Math.abs(e.clientX - downX) < 6) return; wasOpen = false; openGoal = 0; open = 0; }   // abierta: arrastrar la cierra y gira
        const dx = e.clientX - lastX; lastX = e.clientX; const k = 360 / (st.clientWidth * 1.25);
        angle += dx * k; const now = performance.now(); vel = vel * .5 + (dx * k) / Math.max(.008, (now - lastMove) / 1000) * .5; lastMove = now; draw();
      } else if(mode === 'zip'){
        lastY = e.clientY; const r = zip.getBoundingClientRect(); open = Math.max(open, Math.min(1, zipStart + (e.clientY - zipY) / r.height)); openGoal = open; draw();   // solo baja, nunca sube
      } else st.classList.toggle('near', nearZip(e));
    });
    let lastY = 0, lastMove = 0, zipY = 0, zipStart = 0, downX = 0, wasOpen = false;
    st.addEventListener('pointerdown', e => {
      if(!ready) return; st.classList.add('used'); st.setPointerCapture(e.pointerId); vel = 0;
      if(nearZip(e)){ mode = 'zip'; zipY = lastY = e.clientY; zipStart = open; angle = Math.round(angle / 360) * 360; st.classList.add('zipping'); }
      else { mode = 'spin'; lastX = e.clientX; downX = e.clientX; lastMove = performance.now(); wasOpen = openGoal > 0 || open > 0; st.classList.add('dragging'); }
    });
    function up(){
      if(mode === 'zip'){ openGoal = (open > .15 || Math.abs(lastY - zipY) < 6) ? 1 : 0; st.classList.remove('zipping'); kick(); }
      if(mode === 'spin'){ st.classList.remove('dragging'); if(wasOpen){ openGoal = 0; wasOpen = false; } if(performance.now() - lastMove > 60) vel = 0; kick(); }   // clic con la campera abierta: se cierra
      mode = null;
    }
    st.addEventListener('touchstart', e => { const t = e.touches[0]; if(t && nearZip(t)) e.preventDefault(); }, { passive:false });
    st.addEventListener('touchmove', e => { if(mode === 'zip') e.preventDefault(); }, { passive:false });
    st.addEventListener('pointerup', up); st.addEventListener('pointercancel', up);
    st.addEventListener('pointerleave', () => { if(!mode) st.classList.remove('near'); });
    st.addEventListener('keydown', e => {
      if(!ready) return; st.classList.add('used');
      if(e.key === 'ArrowLeft' || e.key === 'ArrowRight'){ openGoal = 0; open = 0; angle += (e.key === 'ArrowRight' ? 1 : -1) * 360 / N() * 2; draw(); }
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); angle = Math.round(angle / 360) * 360; openGoal = openGoal ? 0 : 1; kick(); }
    });
  })();

  // galería de contenido con IA: filtros, videos que se reproducen al verse y visor
  const tiles = [...document.querySelectorAll('.tile')];
  const cats = document.querySelectorAll('.cats button');
  // el mosaico se arma en columnas a mano (no con CSS columns): en iPhone las columnas dejaban un hueco gris al filtrar
  const gal = document.getElementById('gallery');
  function layout(){ if (!gal) return;
    const W = gal.clientWidth, small = matchMedia('(max-width:760px)').matches, gap = small ? 10 : 14, n = small ? 2 : Math.max(1, Math.min(4, Math.floor((W + gap) / (240 + gap))));
    const cols = Array.from({ length:n }, () => { const c = document.createElement('div'); c.className = 'gcol'; return c; }), h = new Array(n).fill(0);
    tiles.forEach(t => { const m = t.querySelector('img, video'), r = (+m.getAttribute('height') || 1) / (+m.getAttribute('width') || 1);
      if (t.hidden){ cols[0].appendChild(t); return; } let k = 0; for (let i = 1; i < n; i++) if (h[i] < h[k] - .01) k = i; cols[k].appendChild(t); h[k] += r + .05; });
    gal.classList.add('js'); gal.replaceChildren(...cols); }
  layout(); let lw = gal ? gal.clientWidth : 0; addEventListener('resize', () => { if (gal && gal.clientWidth !== lw){ lw = gal.clientWidth; layout(); } });
  cats.forEach(c => c.addEventListener('click', () => { cats.forEach(x => x.setAttribute('aria-pressed', x === c)); tiles.forEach(t => t.hidden = c.dataset.f !== 'all' && t.dataset.cat !== c.dataset.f); layout(); }));
  const vids = document.querySelectorAll('.tile video');
  // los videos con data-t arrancan en otro momento, así los ángulos de una misma escena no se ven iguales
  vids.forEach(v => { if (v.dataset.t) v.addEventListener('loadedmetadata', () => { v.currentTime = +v.dataset.t; }, { once:true }); });
  if('IntersectionObserver' in window && !reduce){ const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause()), { threshold:.4 }); vids.forEach(v => io.observe(v)); }
  const lb = document.getElementById('lb'), stage = document.getElementById('lbStage'), txt = document.getElementById('lbTxt'); let cur = 0;
  if(lb){
  const shown = () => tiles.filter(t => !t.hidden);
  function show(t){ const m = t.querySelector('img, video'); const n = m.cloneNode(); if(n.tagName === 'VIDEO'){ n.controls = true; n.loop = true; n.playsInline = true; n.muted = false; n.play().catch(() => { n.muted = true; n.play().catch(() => {}); }); } else { n.loading = 'eager'; } stage.replaceChildren(n); const c = t.querySelector('.cap'); txt.innerHTML = '<b>' + c.querySelector('b').textContent + '</b> ' + c.lastChild.textContent; cur = shown().indexOf(t); }
  // en celular, las interacciones de M Perfumerie (.ix-card) también se abren en grande en este visor
  const ixCards = [...document.querySelectorAll('.ix-card')], small = matchMedia('(max-width:760px)'); let inIx = false;
  function showIx(c){ const v = c.querySelector('video').cloneNode(); v.loop = true; v.muted = true; v.playsInline = true; v.controls = true; v.play().catch(() => {});
    stage.replaceChildren(v); txt.innerHTML = '<b>' + c.querySelector('h4').textContent + '</b> ' + c.querySelector('p').textContent; cur = ixCards.indexOf(c); inIx = true; }
  ixCards.forEach(c => c.addEventListener('click', () => { if (!small.matches) return; showIx(c); if(lb.showModal) lb.showModal(); }));
  function step(d){ if (inIx) { showIx(ixCards[(cur + d + ixCards.length) % ixCards.length]); return; } const l = shown(); show(l[(cur + d + l.length) % l.length]); }
  tiles.forEach(t => t.addEventListener('click', () => { inIx = false; show(t); if(lb.showModal) lb.showModal(); }));
  document.getElementById('lbX').onclick = () => lb.close();
  document.getElementById('lbPrev').onclick = () => step(-1);
  document.getElementById('lbNext').onclick = () => step(1);
  lb.addEventListener('click', e => { if(e.target === lb || e.target === stage) lb.close(); });
  lb.addEventListener('close', () => stage.replaceChildren());
  addEventListener('keydown', e => { if(!lb.open) return; if(e.key === 'ArrowLeft') step(-1); if(e.key === 'ArrowRight') step(1); });
  }
  // barra superior con borde al bajar
  const top = document.getElementById('top'); addEventListener('scroll', () => top.classList.toggle('scrolled', scrollY > 10), { passive:true });
  // la franja naranja del menú baja recién cuando se va el salpicón de la carga;
  // en el inicio espera a que el balde empiece a volcar la pintura sobre el logo
  (function(){
    const s = document.getElementById('splashLoad'), pour = document.querySelector('.hero-balde') ? 1150 : 150;
    let done = false;
    const drop = () => { if (done) return; done = true; top.classList.add('drop'); requestAnimationFrame(() => top.classList.remove('pre'));
      setTimeout(() => top.classList.remove('drop'), 1700); };
    if (!s) return drop();
    s.addEventListener('animationend', e => { if (e.animationName === 'slOut') setTimeout(drop, pour); });
    setTimeout(drop, 1900 + pour);
  })();
  // copiar email
  const copy = document.getElementById('copyMail');
  if(copy) copy.addEventListener('click', e => {
    const t = document.getElementById('mail').textContent, b = e.currentTarget;
    const ok = () => { b.textContent = 'Copiado'; setTimeout(() => b.textContent = 'Copiar', 1600); };
    try{ navigator.clipboard.writeText(t).then(ok).catch(sel); }catch(err){ sel(); }
    function sel(){ const r = document.createRange(); r.selectNodeContents(document.getElementById('mail')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
  });
})();

/* ¿Qué vamos a crear? — genera una base simple en el navegador (logos, variaciones de una foto, flyers) */
(() => {
  const form = document.getElementById('gbox'); if (!form) return;
  const ta = document.getElementById('gtxt'), fileIn = document.getElementById('gfile'), thumb = document.getElementById('gthumb');
  const out = document.getElementById('gout'), grid = document.getElementById('ggrid'), st = document.getElementById('gst'), wa = document.getElementById('gwa');
  const modeBtns = [...form.querySelectorAll('.gmode button')];
  let img = null, imgName = '', mode = 'crear', seed = 1, busy = false;

  const D = "'Bricolage Grotesque', 'Arial Narrow', sans-serif", B = "'Instrument Sans', system-ui, sans-serif", M = "'JetBrains Mono', monospace", S = "'DM Serif Display', Georgia, serif";
  const PAL = [
    { bg:'#2b50d8', a:'#ff9d4d', b:'#ff5fa2', ink:'#ffffff', lt:'#f4f1ea' },
    { bg:'#111113', a:'#ff9d4d', b:'#ff5fa2', ink:'#f4f4f1', lt:'#f4f1ea' },
    { bg:'#0f3d2e', a:'#e9c46a', b:'#f4a261', ink:'#f4f1ea', lt:'#f3eee2' },
    { bg:'#1d2a5b', a:'#7dd3fc', b:'#a78bfa', ink:'#ffffff', lt:'#eef2ff' },
    { bg:'#3b1d14', a:'#ffb38a', b:'#ff7a3d', ink:'#fff4ec', lt:'#fbf1e8' },
    { bg:'#101820', a:'#fee715', b:'#ffb400', ink:'#ffffff', lt:'#fbf8e6' }
  ];
  const rnd = (n) => { let t = n + 0x6D2B79F5; return () => { t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };

  /* ---------- barra ---------- */
  const tips = ['¿Qué vamos a crear?', 'Creá un logo con una M…', 'Hacé variaciones de mi logo…', 'Un logo para “Luna Café”…', 'Un flyer para mi producto…'];
  let ti = 0; setInterval(() => { if (!ta.value && document.activeElement !== ta) { ti = (ti + 1) % tips.length; ta.placeholder = tips[ti]; } }, 2600);
  const setMode = (m) => { mode = m; modeBtns.forEach(b => b.setAttribute('aria-pressed', b.dataset.m === m)); };
  modeBtns.forEach(b => b.addEventListener('click', () => setMode(b.dataset.m)));
  ta.addEventListener('input', () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 200) + 'px'; });
  ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
  document.getElementById('gadd').addEventListener('click', () => fileIn.click());
  fileIn.addEventListener('change', () => { if (fileIn.files[0]) useFile(fileIn.files[0]); fileIn.value = ''; });
  thumb.querySelector('button').addEventListener('click', () => { img = null; thumb.classList.remove('on'); if (mode === 'variar') setMode('crear'); });
  ['dragenter', 'dragover'].forEach(ev => form.addEventListener(ev, e => { e.preventDefault(); form.classList.add('drag'); }));
  ['dragleave', 'drop'].forEach(ev => form.addEventListener(ev, e => { e.preventDefault(); form.classList.remove('drag'); }));
  form.addEventListener('drop', e => { const f = [...(e.dataTransfer?.files || [])].find(f => f.type.startsWith('image/')); if (f) useFile(f); });
  ta.addEventListener('paste', e => { const it = [...(e.clipboardData?.items || [])].find(i => i.type.startsWith('image/')); if (it) { e.preventDefault(); useFile(it.getAsFile()); } });

  let pendingPick = null;
  function useFile(f) { const r = new FileReader(); r.onload = () => loadImg(r.result, f.name || 'foto'); r.readAsDataURL(f); }
  function loadImg(src, name) {
    const i = new Image();
    i.onload = () => {
      img = i; imgName = name;
      thumb.querySelector('img').src = src; thumb.querySelector('span').textContent = name; thumb.classList.add('on');
      if (pendingPick) { const go = pendingPick; pendingPick = null; go(); }
      else if (!ta.value.trim()) { setMode('variar'); ta.value = 'Variaciones de mi logo'; }
    };
    i.src = src;
  }
  document.getElementById('gchips').addEventListener('click', e => {
    const c = e.target.closest('button'); if (!c) return;
    ta.value = c.dataset.t; setMode(c.dataset.m);
    if (c.dataset.sample) { pendingPick = () => form.requestSubmit(); loadImg('images/logo.svg', 'logo de ejemplo'); }
    else if (c.dataset.pick && !img) { pendingPick = () => form.requestSubmit(); fileIn.click(); ta.focus(); }
    else form.requestSubmit();
  });
  document.getElementById('gagain').addEventListener('click', () => { seed++; run(false); });
  form.addEventListener('submit', e => { e.preventDefault(); seed = (Date.now() % 997) + 1; run(true); });

  /* ---------- entender el pedido ---------- */
  function parse(t) {
    const s = t.trim();
    let name = '', letters = '';
    const q = s.match(/["“'«]([^"”'»]{1,28})["”'»]/);
    if (q) name = q[1].trim();
    const lm = s.match(/letras?\s+([A-Za-zÑñ]{1,3})\b/i) || s.match(/con\s+(?:una|un|la|el|las|los)\s+([A-Za-zÑñ]{1,3})\b/i) || s.match(/\b([A-ZÑ]{1,3})\b(?!.*\b[A-ZÑ]{1,3}\b)/);
    if (lm && lm[1].length <= 3) letters = lm[1].toUpperCase();
    if (!name) { const caps = s.split(/\s+/).slice(1).filter(w => /^[A-ZÁÉÍÓÚÑ][\wáéíóúñ&'-]+/.test(w)); if (caps.length) name = caps.slice(0, 3).join(' ').replace(/[.,:;!?]+$/, ''); }
    if (!letters) letters = name ? name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'M';
    const flyer = /flyer|post\b|publicidad|historia|promo|oferta|banner|2x1|descuento|%/i.test(s);
    let head = s.replace(/^(cre[aá](r|me)?|hac[eé](r|me)?|quiero|necesito|dise[nñ][aá](r|me)?|arm[aá](r|me)?)\s+/i, '').replace(/^(un|una)\s+/i, '')
      .replace(/^(flyer|post|publicidad|historia|banner|promo)\s*[:\-–]?\s*/i, '').replace(/^(de|para|con|que diga)\s+/i, '').replace(/^(mi|el|la)\s+producto\s*/i, '').trim();
    if (head.length < 3) head = 'Nuevo en la tienda';
    return { name, letters, flyer, head: head.charAt(0).toUpperCase() + head.slice(1) };
  }

  /* ---------- colores de la foto ---------- */
  function colorsOf(im) {
    const [c, x] = cv(48, 48); contain(x, im, 0, 0, 48, 48);
    const d = x.getImageData(0, 0, 48, 48).data, bins = {};
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 128) continue;
      const r = d[i], g = d[i + 1], b = d[i + 2], mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      const k = (r >> 5) + ',' + (g >> 5) + ',' + (b >> 5); (bins[k] ||= { n: 0, r: 0, g: 0, b: 0, s: 0, l: 0 });
      const o = bins[k]; o.n++; o.r += r; o.g += g; o.b += b; o.s = mx - mn; o.l = (mx + mn) / 2;
    }
    const L = Object.values(bins).map(o => ({ n: o.n, s: o.s, l: o.l, hex: '#' + [o.r, o.g, o.b].map(v => Math.round(v / o.n).toString(16).padStart(2, '0')).join('') }));
    if (!L.length) return null;
    const vivid = L.filter(o => o.s > 60).sort((a, b) => b.n * b.s - a.n * a.s), dark = L.slice().sort((a, b) => a.l - b.l)[0];
    if (!vivid.length) return null;
    const lift = h => { const c = hex(h), l = c[0] * .3 + c[1] * .59 + c[2] * .11; if (l > 120) return h; const k = Math.min(.6, (120 - l) / 160 + .25); return '#' + c.map(v => Math.round(v + (255 - v) * k).toString(16).padStart(2, '0')).join(''); };
    const a = lift(vivid[0].hex), b = lift((vivid[1] || vivid[0]).hex);
    return { bg: dark.l < 70 ? dark.hex : '#111113', a, b, ink: '#ffffff', lt: '#f4f1ea' };
  }

  /* ---------- ayudas de dibujo ---------- */
  function cv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
  function dims(im) { return [im.naturalWidth || im.width || 512, im.naturalHeight || im.height || 512]; }
  function contain(x, im, X, Y, W, H) { const [w, h] = dims(im), k = Math.min(W / w, H / h); x.drawImage(im, X + (W - w * k) / 2, Y + (H - h * k) / 2, w * k, h * k); }
  function cover(x, im, X, Y, W, H) { const [w, h] = dims(im), k = Math.max(W / w, H / h); x.drawImage(im, X + (W - w * k) / 2, Y + (H - h * k) / 2, w * k, h * k); }
  function lin(x, x0, y0, x1, y1, a, b) { const g = x.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, a); g.addColorStop(1, b); return g; }
  function fit(x, t, f, max, start) { let z = start; for (; z > 12; z -= 4) { x.font = f(z); if (x.measureText(t).width <= max) break; } return z; }
  function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, W, H, r); }
  function wrap(x, t, f, max, lines, start) {
    for (let z = start; z > 14; z -= 4) {
      x.font = f(z); const out = []; let cur = '';
      for (const w of t.split(/\s+/)) { const tt = cur ? cur + ' ' + w : w; if (x.measureText(tt).width > max && cur) { out.push(cur); cur = w; } else cur = tt; }
      out.push(cur); if (out.length <= lines && out.every(l => x.measureText(l).width <= max)) return { z, out };
    }
    return { z: 14, out: [t] };
  }
  function spaced(x, t, X, Y, sp) { x.letterSpacing = sp + 'px'; x.fillText(t, X, Y); x.letterSpacing = '0px'; }

  /* ---------- logos ---------- */
  function logos(P, r) {
    const L = P.letters, N = P.name, pick = () => PAL[Math.floor(r() * PAL.length)];
    const base = P.pal;
    const out = [];
    { // pintura que chorrea
      const p = base || pick(), [c, x] = cv(800, 800);
      x.fillStyle = p.bg; x.fillRect(0, 0, 800, 800);
      const z = fit(x, L, s => `800 ${s}px ${D}`, 560, 440); x.textAlign = 'center'; x.textBaseline = 'alphabetic';
      const w = x.measureText(L).width, y = N ? 470 : 520, g = lin(x, 400 - w / 2, 0, 400 + w / 2, 0, p.a, p.b);
      x.fillStyle = g; x.fillText(L, 400, y);
      let got = 0; for (let i = 0; i < 40 && got < 5; i++) { const dx = 400 - w / 2 + 20 + r() * (w - 40), dw = 14 + r() * 12, dh = 40 + r() * 110; const px = x.getImageData(dx + dw / 2, y - 14, 1, 1).data; if (hex(p.bg).every((v, k) => Math.abs(v - px[k]) < 30)) continue; got++; x.fillRect(dx, y - 30, dw, dh); x.beginPath(); x.arc(dx + dw / 2, y - 30 + dh, dw / 2 + 2, 0, 7); x.fill(); }
      if (N) { x.fillStyle = p.ink; x.font = `600 ${fit(x, N.toUpperCase(), s => `600 ${s}px ${B}`, 560, 50)}px ${B}`; spaced(x, N.toUpperCase(), 400, 660, 6); }
      out.push([c, 'Pintura']);
    }
    { // monograma clásico
      const p = base || pick(), [c, x] = cv(800, 800);
      x.fillStyle = p.lt; x.fillRect(0, 0, 800, 800);
      x.strokeStyle = p.bg; x.lineWidth = 10; x.beginPath(); x.arc(400, 360, 230, 0, 7); x.stroke();
      x.lineWidth = 2; x.beginPath(); x.arc(400, 360, 205, 0, 7); x.stroke();
      x.fillStyle = p.bg; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = `${fit(x, L, s => `${s}px ${S}`, 300, 260)}px ${S}`; x.fillText(L, 400, 372);
      x.fillStyle = p.b; [[400, 130], [400, 590]].forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 8, 0, 7); x.fill(); });
      x.fillStyle = p.bg; const t = (N || 'Estudio').toUpperCase(); x.font = `500 ${fit(x, t, s => `500 ${s}px ${M}`, 520, 34)}px ${M}`; spaced(x, t, 400, 690, 8);
      out.push([c, 'Monograma']);
    }
    { // ícono de app
      const p = base || pick(), [c, x] = cv(800, 800);
      x.fillStyle = p.lt; x.fillRect(0, 0, 800, 800);
      x.save(); x.shadowColor = 'rgba(0,0,0,.25)'; x.shadowBlur = 50; x.shadowOffsetY = 24;
      x.fillStyle = lin(x, 170, 110, 630, 570, p.a, p.b); rr(x, 170, 110, 460, 460, 110); x.fill(); x.restore();
      x.fillStyle = p.bg; x.globalAlpha = .9; x.beginPath(); x.arc(560, 180, 26, 0, 7); x.fill(); x.globalAlpha = 1;
      x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = `800 ${fit(x, L, s => `800 ${s}px ${D}`, 340, 300)}px ${D}`; x.fillText(L, 400, 350);
      if (N) { x.fillStyle = '#111113'; x.font = `800 ${fit(x, N, s => `800 ${s}px ${D}`, 600, 64)}px ${D}`; x.fillText(N, 400, 680); }
      out.push([c, 'Ícono']);
    }
    { // retro con sombra
      const p = base || pick(), [c, x] = cv(800, 800);
      x.fillStyle = p.a; x.fillRect(0, 0, 800, 800);
      x.textAlign = 'center'; x.textBaseline = 'alphabetic';
      const z = fit(x, L, s => `800 italic ${s}px ${D}`, 560, 400), y = N ? 480 : 540;
      for (let k = 22; k > 0; k -= 2) { x.fillStyle = p.bg; x.fillText(L, 400 + k, y + k); }
      x.fillStyle = p.lt; x.fillText(L, 400, y); x.lineWidth = 6; x.strokeStyle = p.bg; x.strokeText(L, 400, y);
      if (N) { x.fillStyle = p.bg; rr(x, 150, 590, 500, 86, 43); x.fill(); x.fillStyle = p.lt; x.font = `700 ${fit(x, N.toUpperCase(), s => `700 ${s}px ${B}`, 420, 44)}px ${B}`; x.textBaseline = 'middle'; spaced(x, N.toUpperCase(), 400, 634, 3); }
      out.push([c, 'Retro']);
    }
    return out;
  }

  /* ---------- variaciones de una foto ---------- */
  function variations(im, P, r) {
    const N = P.name, out = [], p1 = PAL[Math.floor(r() * PAL.length)], p2 = PAL[Math.floor(r() * PAL.length)];
    const shadowed = (x, f) => { x.save(); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 40; x.shadowOffsetY = 20; f(); x.restore(); };
    { const [c, x] = cv(800, 800); x.fillStyle = seed % 2 ? '#2b50d8' : p1.bg; x.fillRect(0, 0, 800, 800); shadowed(x, () => contain(x, im, 140, 140, 520, 520)); out.push([c, 'Sobre color']); }
    { const [c, x] = cv(800, 800); x.fillStyle = lin(x, 0, 0, 800, 800, p2.a, p2.b); x.fillRect(0, 0, 800, 800); shadowed(x, () => contain(x, im, 140, 140, 520, 520)); out.push([c, 'Degradé']); }
    { const [c, x] = cv(800, 800); x.fillStyle = '#111113'; x.fillRect(0, 0, 800, 800); x.filter = 'grayscale(1) contrast(1.2) brightness(1.1)'; contain(x, im, 140, 140, 520, 520); x.filter = 'none'; out.push([c, 'Blanco y negro']); }
    { // duotono
      const [c, x] = cv(800, 800), p = PAL[(seed + 2) % PAL.length], dk = hex(p.bg), lt = hex(p.a);
      x.fillStyle = p.bg; x.fillRect(0, 0, 800, 800); contain(x, im, 120, 120, 560, 560);
      try { const id = x.getImageData(0, 0, 800, 800), d = id.data;
        for (let i = 0; i < d.length; i += 4) { const l = (d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11) / 255; for (let k = 0; k < 3; k++) d[i + k] = dk[k] + (lt[k] - dk[k]) * l; }
        x.putImageData(id, 0, 0); } catch (e) {}
      out.push([c, 'Duotono']);
    }
    { // insignia
      const [c, x] = cv(800, 800), p = PAL[(seed + 3) % PAL.length];
      x.fillStyle = p.lt; x.fillRect(0, 0, 800, 800);
      x.fillStyle = p.bg; x.beginPath(); x.arc(400, 400, 300, 0, 7); x.fill();
      x.fillStyle = '#fff'; x.beginPath(); x.arc(400, 400, 190, 0, 7); x.fill();
      x.save(); x.beginPath(); x.arc(400, 400, 182, 0, 7); x.clip(); contain(x, im, 238, 238, 324, 324); x.restore();
      const t = ((N || 'Hecho con IA') + ' • ').toUpperCase().repeat(3).slice(0, 44); x.fillStyle = p.a; x.font = `700 30px ${B}`; x.textAlign = 'center'; x.textBaseline = 'middle';
      for (let i = 0; i < t.length; i++) { const ang = -Math.PI / 2 + i * (Math.PI * 2 / t.length); x.save(); x.translate(400 + Math.cos(ang) * 245, 400 + Math.sin(ang) * 245); x.rotate(ang + Math.PI / 2); x.fillText(t[i], 0, 0); x.restore(); }
      out.push([c, 'Insignia']);
    }
    { // tarjeta
      const [c, x] = cv(800, 800);
      x.fillStyle = lin(x, 0, 0, 800, 800, '#2a2a2e', '#111113'); x.fillRect(0, 0, 800, 800);
      x.save(); x.translate(400, 400); x.rotate(-.14);
      x.shadowColor = 'rgba(0,0,0,.55)'; x.shadowBlur = 60; x.shadowOffsetY = 34; x.fillStyle = '#fbfaf7'; rr(x, -280, -165, 560, 330, 18); x.fill(); x.shadowColor = 'transparent';
      contain(x, im, -250, -130, 230, 260);
      x.fillStyle = '#111113'; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
      const n = N || 'Tu marca'; x.font = `800 ${fit(x, n, s => `800 ${s}px ${D}`, 240, 46)}px ${D}`; x.fillText(n, 10, -10);
      x.fillStyle = '#67666d'; const mail = n === 'Camilo Bosio' ? 'camilobosio96@gmail.com' : 'hola@tumarca.com'; x.font = `400 ${fit(x, mail, z => `400 ${z}px ${M}`, 250, 20)}px ${M}`; x.fillText(mail, 10, 34); x.font = `400 20px ${M}`; x.fillText('Rosario · AR', 10, 64);
      x.fillStyle = lin(x, 10, 0, 250, 0, '#ff9d4d', '#ff5fa2'); x.fillRect(10, 96, 120, 8);
      x.restore(); out.push([c, 'Tarjeta']);
    }
    return out;
  }
  function hex(h) { return [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); }

  /* ---------- flyers ---------- */
  function flyers(im, P, r) {
    const H = P.head, N = P.name || 'Tu marca', out = [], p = PAL[Math.floor(r() * PAL.length)];
    const pill = (x, t, X, Y, bg, fg) => { x.font = `700 28px ${B}`; const w = x.measureText(t).width + 60; x.fillStyle = bg; rr(x, X - w / 2, Y - 32, w, 64, 32); x.fill(); x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(t, X, Y + 1); };
    { const [c, x] = cv(800, 1000); x.fillStyle = '#111113'; x.fillRect(0, 0, 800, 1000);
      x.save(); rr(x, 40, 40, 720, 560, 28); x.clip(); x.fillStyle = '#1e1e22'; x.fillRect(40, 40, 720, 560); contain(x, im, 60, 60, 680, 520); x.restore();
      x.fillStyle = '#fff'; x.textAlign = 'left'; x.textBaseline = 'alphabetic'; const w = wrap(x, H, s => `800 ${s}px ${D}`, 700, 2, 96);
      w.out.forEach((l, i) => x.fillText(l, 50, 700 + i * w.z * .98)); pill(x, 'Pedí por WhatsApp', 230, 915, lin(x, 60, 0, 400, 0, '#ff9d4d', '#ff5fa2'), '#111113');
      x.fillStyle = '#a3a2aa'; x.font = `500 22px ${M}`; x.textAlign = 'right'; x.fillText(N.toUpperCase(), 750, 922); out.push([c, 'Flyer oscuro']); }
    { const [c, x] = cv(800, 1000); x.fillStyle = lin(x, 0, 0, 800, 1000, p.a, p.b); x.fillRect(0, 0, 800, 1000);
      x.fillStyle = p.bg; x.textAlign = 'center'; x.textBaseline = 'alphabetic'; const w = wrap(x, H.toUpperCase(), s => `800 ${s}px ${D}`, 700, 2, 90);
      w.out.forEach((l, i) => x.fillText(l, 400, 70 + w.z + i * w.z * .95));
      x.save(); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 50; x.shadowOffsetY = 26; contain(x, im, 130, 300, 540, 520); x.restore();
      pill(x, N, 400, 910, p.bg, p.ink); out.push([c, 'Flyer color']); }
    { const [c, x] = cv(800, 1000); x.fillStyle = '#f4f1ea'; x.fillRect(0, 0, 800, 1000);
      x.save(); x.beginPath(); x.moveTo(170, 640); x.lineTo(170, 330); x.arc(400, 330, 230, Math.PI, 0); x.lineTo(630, 640); x.closePath(); x.clip(); x.fillStyle = p.bg; x.fillRect(0, 0, 800, 1000); cover(x, im, 170, 100, 460, 540); x.restore();
      x.fillStyle = '#111113'; x.textAlign = 'center'; x.textBaseline = 'alphabetic'; const w = wrap(x, H, s => `${s}px ${S}`, 660, 2, 76);
      w.out.forEach((l, i) => x.fillText(l, 400, 730 + i * w.z * 1.02)); x.font = `500 22px ${M}`; x.fillStyle = '#67666d'; spaced(x, N.toUpperCase(), 400, 930, 6); out.push([c, 'Flyer elegante']); }
    return out;
  }

  /* ---------- correr ---------- */
  let last = null;
  async function run(fresh) {
    if (busy) return;
    const text = ta.value.trim();
    if (!text && !img) { ta.focus(); ta.placeholder = 'Escribí una idea o subí una foto con el +'; return; }
    const P = parse(text || 'Variaciones de mi logo');
    let kind;
    if (mode === 'variar') { if (!img) { pendingPick = () => form.requestSubmit(); fileIn.click(); return; } kind = 'var'; }
    else if (P.flyer) { if (!img) { pendingPick = () => form.requestSubmit(); fileIn.click(); st.textContent = 'Subí la foto del producto'; return; } kind = 'fly'; }
    else kind = 'logo';
    if (kind === 'logo' && img) P.pal = colorsOf(img);
    busy = true; document.getElementById('gsend').disabled = true;
    const n = kind === 'var' ? 6 : kind === 'fly' ? 3 : 4, ar = kind === 'fly' ? '4/5' : '1';
    out.classList.add('on'); grid.classList.toggle('four', n === 4); grid.innerHTML = Array.from({ length: n }, () => `<div class="gskel" style="--ar:${ar}"></div>`).join('');
    if (fresh) out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    const steps = kind === 'var' ? ['Mirando tu foto…', 'Probando fondos y colores…', 'Armando variaciones…'] : kind === 'fly' ? ['Leyendo tu idea…', 'Acomodando la foto…', 'Diseñando el flyer…'] : ['Leyendo tu idea…', img ? 'Sacando colores de tu foto…' : 'Probando colores…', 'Dibujando logos…'];
    for (const s of steps) { st.textContent = s; await new Promise(r => setTimeout(r, 480)); }
    try { await Promise.all([`800 40px ${D}`, `800 italic 40px ${D}`, `600 40px ${B}`, `700 40px ${B}`, `40px ${S}`, `500 40px ${M}`].map(f => document.fonts.load(f))); } catch (e) {}
    const r = rnd(seed * 97 + text.length), mine = !!img && imgName === 'logo de ejemplo';
    if (mine && !P.name) P.name = 'Camilo Bosio';
    const items = kind === 'var' ? variations(img, P, r) : kind === 'fly' ? flyers(img, P, r) : logos(P, r);
    grid.innerHTML = '';
    items.forEach(([c, label], i) => {
      const card = document.createElement('div'); card.className = 'gcard'; card.style.animationDelay = i * 70 + 'ms';
      if (mine) { const x = c.getContext('2d'); x.font = `600 22px ${B}`; x.textAlign = 'right'; x.textBaseline = 'bottom'; x.fillStyle = 'rgba(255,255,255,.75)'; x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 6; x.fillText('© Camilo Bosio', c.width - 22, c.height - 18); c.addEventListener('contextmenu', e => e.preventDefault()); }
      const cap = document.createElement('div'); cap.className = 'cap'; cap.innerHTML = mine ? `<span>${label}</span><span class="own">Logo de Camilo</span>` : `<span>${label}</span><button type="button" class="dl" aria-label="Descargar ${label}" title="Descargar"><svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`;
      if (!mine) cap.querySelector('.dl').addEventListener('click', () => { try { c.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `camilo-bosio-${label.toLowerCase().replace(/\s+/g, '-')}.png`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }); } catch (e) {} });
      card.append(c, cap); grid.append(card);
    });
    st.textContent = `${items.length} propuestas base · ${kind === 'var' ? 'variaciones de tu foto' : kind === 'fly' ? 'flyers' : 'logos'}`;
    wa.href = 'https://wa.me/5493468437518?text=' + encodeURIComponent(`Hola Camilo! Probé el generador de tu página con: "${text || 'variaciones de mi logo'}". Me gustaría pulirlo con vos.`);
    busy = false; document.getElementById('gsend').disabled = false;
  }
})();

/* Probador (portfolio): las 5 camperas de adidas sobre el mismo modelo, en la misma pose, así se cambian sin que se
   mueva nada. Deslizar = la nueva aparece "pasando" como un escáner. 360°: tira de 60 cuadros (una vuelta, 6° cada uno),
   arrastrás y gira a la par de tu mano, con inercia corta e imán al frente. Nunca gira sola. */
(() => {
  const st = document.getElementById('pv'); if (!st) return;
  const TOPS = [
    { id:'audi-f1-blanca',  name:'Audi F1 Team' },
    { id:'teamgeist-gris',  name:'Teamgeist con capucha' },
    { id:'blocked-negra',   name:'Blocked negra' },
    { id:'workwear-marron', name:'Workwear marrón' },
    { id:'sst-jean',        name:'SST de jean' }
  ];
  const $ = id => document.getElementById(id);
  const cur = $('pvCur'), inc = $('pvIn'), scan = $('pvScan'), spin = $('pvSpin'), sctx = spin.getContext('2d'), b360 = $('pv360');
  const src = t => 'probador/prendas/' + t.id + '.webp';
  let ti = 0, anim = 0;
  new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { io.disconnect(); TOPS.forEach(t => { const i = new Image(); i.src = src(t); }); } }, { rootMargin:'400px' }).observe(st);
  cur.src = src(TOPS[0]);
  function info() { $('pvName').textContent = TOPS[ti].name; $('pvNum').textContent = (ti + 1) + ' / ' + TOPS.length; }
  function reveal(p, dir) {
    const pct = (p * 100).toFixed(2);
    inc.style.clipPath = dir > 0 ? 'inset(0 0 0 ' + (100 - pct) + '%)' : 'inset(0 ' + (100 - pct) + '% 0 0)';
    scan.style.left = (dir > 0 ? 100 - pct : pct) + '%';
  }
  function go(k, dir, from) {
    stopTurn(); k = (k + TOPS.length) % TOPS.length; if (k === ti && from === undefined) return;
    cancelAnimationFrame(anim); inc.src = src(TOPS[k]); st.classList.add('swiping');
    const t0 = performance.now(), p0 = from || 0, dur = 520 * (1 - p0) + 120;
    const step = now => {
      const t = Math.min(1, (now - t0) / dur), p = p0 + (1 - p0) * (1 - Math.pow(1 - t, 3)); reveal(p, dir);
      if (t < 1) anim = requestAnimationFrame(step); else { cur.src = inc.src; ti = k; st.classList.remove('swiping'); inc.style.clipPath = ''; info(); }
    };
    anim = requestAnimationFrame(step);
  }
  function back(p, dir) {
    const t0 = performance.now();
    const step = now => { const t = Math.min(1, (now - t0) / 260); reveal(p * (1 - t) * (1 - t), dir); if (t < 1) anim = requestAnimationFrame(step); else { st.classList.remove('swiping'); inc.style.clipPath = ''; } };
    anim = requestAnimationFrame(step);
  }

  // 360°
  const SN = 60, SC = 10, SW = 540, SH = 670, sheets = {};
  let turning = false, angle = 0, vel = 0, sd = null, sraf = 0, lastT = 0, img360 = null;
  const sheet = id => sheets[id] || (sheets[id] = new Promise((ok, bad) => { const i = new Image(); i.onload = () => ok(i); i.onerror = bad; i.src = 'probador/giros/' + id + '.webp'; }));
  function drawSpin() { if (!img360) return; const k = ((Math.round(angle / 360 * SN) % SN) + SN) % SN; sctx.drawImage(img360, (k % SC) * SW, Math.floor(k / SC) * SH, SW, SH, 0, 0, spin.width, spin.height); }
  function sizeSpin() { const r = st.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); spin.width = Math.round(r.width * d); spin.height = Math.round(r.height * d); drawSpin(); }
  addEventListener('resize', sizeSpin);
  async function startTurn() {
    const t = TOPS[ti]; b360.classList.add('loading'); st.classList.remove('turned');
    try { img360 = await sheet(t.id); } catch (e) { b360.classList.remove('loading'); return; }
    b360.classList.remove('loading'); if (TOPS[ti] !== t) return;
    angle = 0; vel = 0; sizeSpin(); turning = true; st.classList.add('turning', 'used');
    b360.setAttribute('aria-pressed', 'true'); b360.textContent = '✓ Listo';
  }
  function stopTurn() {
    if (!turning) return; turning = false; cancelAnimationFrame(sraf); sraf = 0; st.classList.remove('turning');
    b360.setAttribute('aria-pressed', 'false'); b360.textContent = '↻ 360°';
  }
  function kick() { if (!sraf) { lastT = 0; sraf = requestAnimationFrame(tick); } }
  function tick(ts) {
    const dt = lastT ? Math.min(.05, (ts - lastT) / 1000) : 0; lastT = ts; let busy = false;
    if (Math.abs(vel) > 4) { angle += vel * dt; vel *= Math.pow(.03, dt); busy = true; }
    else { vel = 0; const off = ((angle % 360) + 540) % 360 - 180; if (Math.abs(off) > .3 && Math.abs(off) < 16) { angle -= off * Math.min(1, dt * 10); busy = true; } }
    drawSpin(); sraf = busy ? requestAnimationFrame(tick) : 0;
  }
  if (b360) b360.addEventListener('click', () => turning ? stopTurn() : startTurn()); // el giro 360 está en "Producto 360"; acá solo se cambia de campera

  // arrastre
  let drag = null;
  st.addEventListener('pointerdown', e => {
    if (e.target.closest('button')) return;
    st.setPointerCapture(e.pointerId); st.classList.add('drag', 'used');
    if (turning) { sd = { x:e.clientX, t:performance.now() }; vel = 0; st.classList.add('turned'); return; }
    drag = { x:e.clientX, w:st.getBoundingClientRect().width, dir:0, p:0, moved:false };
  });
  st.addEventListener('pointermove', e => {
    if (turning) {
      if (!sd) return; const now = performance.now(), dx = e.clientX - sd.x, k = 360 / (st.clientWidth * 1.3);
      angle -= dx * k; vel = vel * .5 + (-dx * k) / Math.max(.008, (now - sd.t) / 1000) * .5; sd.x = e.clientX; sd.t = now; drawSpin(); return;
    }
    if (!drag) return; const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) < 8) return; drag.moved = true;
    const dir = dx < 0 ? 1 : -1;
    if (dir !== drag.dir) { drag.dir = dir; cancelAnimationFrame(anim); inc.src = src(TOPS[(ti + dir + TOPS.length) % TOPS.length]); st.classList.add('swiping'); }
    drag.p = Math.min(1, Math.abs(dx) / (drag.w * .8)); reveal(drag.p, dir);
  });
  function up(e) {
    st.classList.remove('drag');
    if (turning) { if (sd) { if (performance.now() - sd.t > 60) vel = 0; sd = null; kick(); } return; }
    if (!drag) return; const d = drag; drag = null; if (!d.moved) return;
    const dx = (e.clientX ?? d.x) - d.x;
    if (d.p > .22 || Math.abs(dx) > 70) go(ti + d.dir, d.dir, d.p); else back(d.p, d.dir);
  }
  st.addEventListener('pointerup', up); st.addEventListener('pointercancel', up);
  $('pvPrev').addEventListener('click', () => { st.classList.add('used'); go(ti - 1, -1); });
  $('pvNext').addEventListener('click', () => { st.classList.add('used'); go(ti + 1, 1); });
  st.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const d = e.key === 'ArrowRight' ? 1 : -1; if (turning) { angle += d * 12; drawSpin(); } else go(ti + d, d); }
    if (b360 && e.key === 'Enter' && e.target === st) { e.preventDefault(); turning ? stopTurn() : startTurn(); }
  });
  info();
})();

/* logo animado: "balde" (le vuelcan un balde de pintura) y "pincel" (un pincel real lo pinta trazo por trazo).
   Se arma en cada .logo-balde / .logo-pincel; arranca al verse y tocarlo lo repite. */
(function(){
  const els = [...document.querySelectorAll('.logo-balde, .logo-pincel')];
  if (!els.length) return;
  const NS = 'http://www.w3.org/2000/svg';
  const C1 = 'M27 14 H17 L12 19 V45 L17 50 H46 L51 45 V37 L46 32 H33', C2 = 'M33 50 V14 H44 L49 19 V27 L44 32 H33';
  // chorreado del logo (mismas formas que images/logo.svg): [path, x, arriba, abajo, ancho]
  const D = [
    ['M12.4 50 Q13.6 51.2 13.6 52.5 V57 a1.4 1.4 0 0 0 2.8 0 V52.5 Q16.4 51.2 17.6 50 Z',15,50,58.4,4.2],
    ['M9.7 40 Q10.9 41.2 10.9 42.5 V44 a1.1 1.1 0 0 0 2.2 0 V42.5 Q13.1 41.2 14.3 40 Z',12,40,45.1,3],
    ['M20.2 50 Q21.4 51.2 21.4 52.5 V61 a1.6 1.6 0 0 0 3.2 0 V52.5 Q24.6 51.2 25.8 50 Z',23,50,62.6,4.2],
    ['M26.7 50 Q27.9 51.2 27.9 52.5 V54 a1.1 1.1 0 0 0 2.2 0 V52.5 Q30.1 51.2 31.3 50 Z',29,50,55.1,3.2],
    ['M37.7 32 Q38.9 33.2 38.9 34.5 V37 a1.1 1.1 0 0 0 2.2 0 V34.5 Q41.1 33.2 42.3 32 Z',40,32,38.1,3],
    ['M42.9 14 Q44.1 15.2 44.1 16.5 V17.5 a0.9 0.9 0 0 0 1.8 0 V16.5 Q45.9 15.2 47.1 14 Z',45,14,18.4,2.6],
    ['M37.5 50 Q38.7 51.2 38.7 52.5 V58 a1.3 1.3 0 0 0 2.6 0 V52.5 Q41.3 51.2 42.5 50 Z',40,50,59.3,4],
    ['M44.7 49 Q45.9 50.2 45.9 51.5 V54 a1.1 1.1 0 0 0 2.2 0 V51.5 Q48.1 50.2 49.3 49 Z',47,49,55.1,3.2]
  ];
  const DOTS = [[15,59.5,.9],[24.6,62.5,1.3],[40,61,1]];
  const cl = (v,a,b) => Math.max(a, Math.min(b, v)), seg = (t,a,b) => cl((t-a)/(b-a),0,1);
  const ease = t => t < .5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2, lerp = (a,b,t) => a + (b-a)*t;
  const mk = (tag, at, parent) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (parent) parent.appendChild(e); return e; };
  let uid = 0;

  // lo común: fondo violeta, logo limpio en blanco, trazos pintados y chorreado (cada gota con su recorte)
  function base(el, painted){
    const p = 'lg' + (++uid) + '-';
    el.innerHTML = `<svg viewBox="-6 -30 82 96" aria-hidden="true"><defs>
      <linearGradient id="${p}bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4d7cff"/><stop offset="1" stop-color="#1d3fc4"/></linearGradient>
      <linearGradient id="${p}pv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9d4d"/><stop offset="1" stop-color="#ff5fa2"/></linearGradient>
      <linearGradient id="${p}st" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a2a"/><stop offset="1" stop-color="#ff9d4d"/></linearGradient>
      <filter id="${p}wet" x="-10%" y="-10%" width="120%" height="130%"><feTurbulence type="fractalNoise" baseFrequency=".35" numOctaves="1" seed="7"/><feDisplacementMap in="SourceGraphic" scale="1.2"/></filter>
      <filter id="${p}sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#1c3cc0" flood-opacity=".4"/></filter>
      <filter id="${p}bs" x="-50%" y="-50%" width="200%" height="200%"><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/><feGaussianBlur stdDeviation=".8"/></filter>
      <clipPath id="${p}cl"><rect width="64" height="64" rx="15"/></clipPath>
      <mask id="${p}fl"><path class="front" fill="#fff" d="M0 -3H64V-3H0Z"/></mask>
    </defs>
    <rect width="64" height="64" rx="15" fill="url(#${p}bg)" filter="url(#${p}sh)"/>
    <g clip-path="url(#${p}cl)">
      <g fill="none" stroke="#fff" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" opacity=".92"><path d="${C1}"/><path d="${C2}"/></g>
      <g filter="url(#${p}wet)">
        <g class="strokes" ${painted === 'mask' ? `mask="url(#${p}fl)"` : ''} fill="none" stroke="url(#${p}pv)" stroke-width="4.2" stroke-linejoin="round" stroke-linecap="round"><path d="${C1}"/><path d="${C2}"/></g>
        <g class="drips" fill="url(#${p}pv)"></g>
      </g>
    </g></svg>`;
    const sv = el.firstChild, defs = sv.querySelector('defs'), dg = sv.querySelector('.drips');
    const clips = D.map((d, i) => { const cp = mk('clipPath', { id: p + 'd' + i }, defs); const r = mk('rect', { x: 0, width: 64, y: d[2] - 1, height: 0 }, cp);
      mk('path', { d: d[0], 'clip-path': `url(#${p}d${i})` }, dg); return r; });
    const dots = DOTS.map(([x,y,r]) => { const c = mk('circle', { cx: x, cy: y, r }, dg); c.style.opacity = 0; return c; });
    return { sv, p, clips, dots };
  }

  // BALDE: sale de atrás de la "o" de Camilo, vuelca un chorro grueso de pintura sobre el logo y vuelve a esconderse
  function balde(el){
    const { sv, p, clips, dots } = base(el, 'mask');
    const front = sv.querySelector('.front'), defs = sv.querySelector('defs');
    defs.insertAdjacentHTML('beforeend', `<linearGradient id="${p}ch" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#e8641c"/><stop offset=".35" stop-color="#ff9a45"/><stop offset=".5" stop-color="#ffc58f"/><stop offset=".65" stop-color="#ff9a45"/><stop offset="1" stop-color="#d9551a"/></linearGradient>
      <radialGradient id="${p}pl" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#ffb36b"/><stop offset=".6" stop-color="#ff8a3a"/><stop offset="1" stop-color="#f06a2a"/></radialGradient>`);
    const sheetG = mk('g', { 'clip-path': `url(#${p}cl)` }, sv);            // ola de pintura que baja sobre el logo
    const sheet = mk('path', { fill: `url(#${p}pl)`, d: '' }, sheetG);
    const pool = mk('path', { fill: `url(#${p}pl)`, d: '' }, sv);         // charco donde pega el chorro
    const stream = mk('path', { fill: `url(#${p}ch)`, d: '' }, sv);        // chorro con brillo en el medio
    const shine = mk('path', { fill: 'none', stroke: 'rgba(255,240,220,.75)', 'stroke-width': .5, 'stroke-linecap': 'round', d: '' }, sv);
    const splash = mk('g', { fill: '#ff8a3a' }, sv);
    // el balde se recorta con la caja de la "o": así parece que sale de atrás de la letra y no se ve en el hueco
    const hide = mk('clipPath', { id: p + 'o', 'clip-rule': 'evenodd' }, defs), hideP = mk('path', { 'clip-rule': 'evenodd', d: '' }, hide);
    const bucket = mk('image', { href: 'images/balde/balde.webp', width: 21, height: 25.6, x: -10.5, y: -12.8, 'clip-path': `url(#${p}o)` }, sv);
    const wrap = mk('g', { 'clip-path': `url(#${p}o)` }, sv); wrap.appendChild(bucket); bucket.removeAttribute('clip-path');
    let sd = 11; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    const SP = Array.from({length:9}, () => ({ t0: 1.45 + rnd()*.35, a: Math.PI*(1.1 + rnd()*.8), v: 6 + rnd()*9, r: .35 + rnd()*.55 }));
    const spEls = SP.map(q => { const c = mk('ellipse', { rx: q.r, ry: q.r }, splash); c.style.opacity = 0; return c; });
    const ORDER = [1,0,2,3,5,4,6,7], POUR = [34.4, -40], IMP = 33, HIT = 14;   // cae sobre la línea larga de la B
    // centro de la "o" de Camilo (en las coordenadas del dibujo); si no hay portada, entra desde arriba a la derecha
    const oSpan = el.closest('h1') && el.closest('h1').querySelector('.ln span');
    function origin(){
      if (!oSpan || !oSpan.firstChild) return null;
      const r = document.createRange(), s = oSpan.firstChild, n = s.textContent.length; r.setStart(s, n - 1); r.setEnd(s, n);
      const b = r.getBoundingClientRect(), m = sv.getScreenCTM(); if (!m || !b.width) return null;
      const inv = m.inverse(), P = (x, y) => { const pt = sv.createSVGPoint(); pt.x = x; pt.y = y; return pt.matrixTransform(inv); };
      // caja de la tinta de la "o" (no la de la línea): de la altura x a la línea de base
      const base = b.bottom - b.height*.2, xh = b.height*.5, a = P(b.left + b.width*.06, base - xh), z = P(b.right - b.width*.06, base + b.height*.02), c = P(b.left + b.width*.5, base - xh*.5);
      return { x: c.x, y: c.y, box: [a.x, a.y, z.x, z.y] };
    }
    function pose(t, O){
      const o = O ? [O.x, O.y, 0, .62] : [92, -44, 10, 1];
      if (t < .75){ const u = ease(seg(t,0,.75)); return [lerp(o[0],POUR[0],u), lerp(o[1],POUR[1],u), lerp(o[2],-25,u), lerp(o[3],1,u)]; }
      if (t < 1.1){ const u = ease(seg(t,.75,1.1)); return [POUR[0], POUR[1], lerp(-25,-128,u), 1]; }
      if (t < 2.0) return [POUR[0] + Math.sin(t*9)*.2, POUR[1], -128 + Math.sin(t*7)*1.5, 1];
      if (t < 2.85){ const u = ease(seg(t,2.0,2.4)); return [POUR[0], POUR[1], lerp(-128,-20,u), 1]; }
      const u = ease(seg(t,2.85,3.55)); return [lerp(POUR[0],o[0],u), lerp(POUR[1],o[1],u), lerp(-20,o[2],u), lerp(1,o[3],u)];
    }
    function render(t){
      const O = origin(), [bx, by, a, sc] = pose(t, O), r = a*Math.PI/180, co = Math.cos(r), si = Math.sin(r);
      bucket.setAttribute('transform', `translate(${bx} ${by}) rotate(${a}) scale(${sc})`);
      hideP.setAttribute('d', O ? `M-200 -300 H300 V300 H-200 Z M${O.box[0]} ${O.box[1]} V${O.box[3]} H${O.box[2]} V${O.box[1]} Z` : 'M-200 -300 H300 V300 H-200 Z');
      bucket.style.opacity = O ? (t >= 3.55 ? 0 : 1) : seg(t, 0, .25) * (1 - seg(t, 3.2, 3.5));
      const px = bx + (co*-9.9 - si*-9.5)*sc, py = by + (si*-9.9 + co*-9.5)*sc;   // borde por donde sale la pintura
      // la pintura baja desde donde pega y se abre hacia los costados
      const F = t < 1.35 ? -3 : lerp(HIT - 1, 110, ease(seg(t,1.35,2.7)));
      let d = 'M0 -3 H64 ';
      for (let x = 64; x >= 0; x -= 2){ const y = F - Math.abs(x - IMP)*1.25 + Math.sin(x*.7 + t*9)*.8*(F < 95 ? 1 : 0); d += `L${x} ${Math.max(-3, y).toFixed(2)} `; }
      front.setAttribute('d', d + 'Z');
      // la ola: una franja de pintura justo arriba del frente, que se desvanece cuando termina de bajar
      const so = 0; // sin franja: la pintura se ve sólo sobre las letras
      if (so > .01){ let tp = '', bt = '';
        for (let x = 0; x <= 64; x += 2){ const y = F - Math.abs(x - IMP)*1.25 + Math.sin(x*.7 + t*9)*.8, th = 4 + Math.sin(x*.4 + t*5)*1.2;
          bt += `L${x} ${y.toFixed(2)} `; tp = `L${x} ${(y - th).toFixed(2)} ` + tp; }
        sheet.setAttribute('d', 'M' + bt.slice(1) + tp + 'Z'); sheet.style.opacity = .8*so; } else sheet.setAttribute('d', '');
      // chorro: sale grueso del borde, se ensancha al caer y ondula; al final se corta y cae
      const w = 3.8 * seg(t,1.05,1.2) * (1 - seg(t,1.95,2.05)), hit = HIT;
      if (t > 1.05 && t < 2.45){
        const head = Math.min(hit, py + 60*Math.pow(Math.max(0, t - 1.05), 2)*1.6);             // la punta cae acelerando
        const top = t > 1.95 ? Math.min(hit, py + 60*Math.pow(t - 1.95, 2)*1.6) : py;          // al final la cola también cae
        const ww = Math.max(w, 2.2*(1 - seg(t,2.2,2.45))), steps = 12;
        if (head - top > .3){ let Lp = [], Rp = [], Sp = [];
          for (let i = 0; i <= steps; i++){ const y = lerp(top, head, i/steps), k = (y - py)/(hit - py || 1), wd = ww*(.8 + .35*k)*(i === steps ? 1.25 : 1), wob = Math.sin(y*.45 + t*11)*.35 + (IMP - px)*k;
            Lp.push(`${(px + wob - wd/2).toFixed(2)} ${y.toFixed(2)}`); Rp.unshift(`${(px + wob + wd/2).toFixed(2)} ${y.toFixed(2)}`); Sp.push(`${(px + wob - wd*.12).toFixed(2)} ${y.toFixed(2)}`); }
          stream.setAttribute('d', `M${Lp.join(' L')} L${Rp.join(' L')} Z`); shine.setAttribute('d', `M${Sp.join(' L')}`);
        } else { stream.setAttribute('d', ''); shine.setAttribute('d', ''); }
      } else { stream.setAttribute('d', ''); shine.setAttribute('d', ''); }
      // charco que se abre donde pega y se escurre
      const pr = 4.2 * ease(seg(t,1.4,1.8)) * (1 - ease(seg(t,2.2,2.7)));
      if (pr > .2){ let q = ''; for (let i = 0; i <= 16; i++){ const an = i/16*Math.PI*2, rr = pr*(1 + .18*Math.sin(an*5 + t*6)); q += (i ? 'L' : 'M') + (IMP + Math.cos(an)*rr*1.2).toFixed(2) + ' ' + (hit + .5 + Math.sin(an)*rr*.6).toFixed(2) + ' '; }
        pool.setAttribute('d', q + 'Z'); } else pool.setAttribute('d', '');
      // salpicaduras: gotas que saltan del charco y caen
      SP.forEach((q, i) => { const u = t - q.t0, e = spEls[i];
        if (u < 0 || u > .45){ e.style.opacity = 0; return; }
        const vx = Math.cos(q.a)*q.v, vy = Math.sin(q.a)*q.v, sp = Math.hypot(vx, vy - 40*u);
        e.setAttribute('cx', IMP + vx*u); e.setAttribute('cy', hit + vy*u + 40*u*u);
        e.setAttribute('rx', q.r*(1 + sp*.012)); e.setAttribute('ry', q.r*.85); e.style.opacity = 1 - u/.45; });
      ORDER.forEach((k, i) => { const d = D[k], u = ease(seg(t, 2.25 + i*.12, 3.15 + i*.12)); clips[k].setAttribute('height', (d[3] - d[2] + 1.5)*u); });
      dots.forEach((c, i) => { c.style.opacity = seg(t, 3.25 + i*.12, 3.4 + i*.12); });
    }
    return { render, end: 4.1 };
  }

  // PINCEL: un pincel real (foto recortada) sigue el trazo exacto de la C y la B, y después pinta cada gota
  function pincel(el){
    const { sv, clips, dots } = base(el, 'dash');
    const st = [...sv.querySelectorAll('.strokes path')], L = st.map(s => s.getTotalLength());
    st.forEach((s, i) => { s.style.strokeDasharray = L[i] + ' ' + L[i]; s.style.strokeDashoffset = L[i]; });
    // foto del pincel: la punta mide 79.25 px en una imagen de 87×639; se escala para que mida 4.2 (el ancho del trazo)
    const k = 4.2 / 79.25, img = `<image href="images/balde/pincel.webp" x="${-43.6*k}" y="${-638.75*k}" width="${87*k}" height="${639*k}"/>`;
    const shadow = mk('g', { opacity: .3 }, sv); shadow.innerHTML = img; shadow.firstChild.setAttribute('filter', `url(#${sv.querySelector('filter[id$="bs"]').id})`);
    const brush = mk('g', {}, sv); brush.innerHTML = img;
    const OUT = [74, -24], T = { in:[0,.7], s1:[.7,4.3], hop:[4.3,4.75], s2:[4.75,6.6], out:[6.6,7.1], back:[7.35,7.8], dr:[7.8,10.6], dots:[10.6,11.2], out2:[11.3,11.8] };
    const pt = (i, u) => { const q = st[i].getPointAtLength(L[i]*u); return [q.x, q.y]; };
    function place(x, y, lift, w){ const s = w/4.2, up = lift*1.6;
      brush.setAttribute('transform', `translate(${x + up*.35} ${y - up}) rotate(28) scale(${s*(1 + lift*.06)})`);
      shadow.setAttribute('transform', `translate(${x + 1.2 + up*1.4} ${y + 1.4 + up*.4}) rotate(28) scale(${s})`); }
    function render(t){
      const a = seg(t,...T.s1), b = seg(t,...T.s2), n = D.length, span = (T.dr[1]-T.dr[0])/n;
      st[0].style.strokeDashoffset = L[0]*(1-a); st[1].style.strokeDashoffset = L[1]*(1-b);
      // en el iPhone (Safari) un trazo de largo 0 igual dibuja la punta redonda: se oculta hasta que el pincel arranca
      st[0].style.visibility = a > 0 ? '' : 'hidden'; st[1].style.visibility = b > 0 ? '' : 'hidden';
      D.forEach((d, i) => { const t0 = T.dr[0] + i*span, u = seg(t, t0 + span*.3, t0 + span); clips[i].setAttribute('height', (d[3] - d[2] + 1)*u); });
      DOTS.forEach((d, i) => { dots[i].style.opacity = seg(t, T.dots[0] + i*.2 + .08, T.dots[0] + i*.2 + .18); });
      let x = OUT[0], y = OUT[1], lift = 1, w = 4.2;
      if (t < T.in[1]){ const u = ease(seg(t,...T.in)), [x1,y1] = pt(0,0); x = lerp(OUT[0],x1,u); y = lerp(OUT[1],y1,u); lift = 1 - seg(t, T.in[1]-.2, T.in[1]); }
      else if (t < T.s1[1]){ [x,y] = pt(0,a); lift = 0; }
      else if (t < T.hop[1]){ const u = ease(seg(t,...T.hop)), [x0,y0] = pt(0,1), [x1,y1] = pt(1,0); x = lerp(x0,x1,u); y = lerp(y0,y1,u); lift = Math.sin(u*Math.PI); }
      else if (t < T.s2[1]){ [x,y] = pt(1,b); lift = 0; }
      else if (t < T.back[0]){ const u = ease(seg(t,...T.out)), [x0,y0] = pt(1,1); x = lerp(x0,OUT[0],u); y = lerp(y0,OUT[1],u); lift = seg(t, T.out[0], T.out[0] + .15); }
      else if (t < T.dr[0]){ const d = D[0], u = ease(seg(t,...T.back)); x = lerp(OUT[0],d[1],u); y = lerp(OUT[1],d[2],u); lift = 1 - seg(t, T.back[1]-.15, T.back[1]); w = d[4]; }
      else if (t < T.dr[1]){ const i = Math.min(n-1, Math.floor((t - T.dr[0])/span)), d = D[i], pr = i ? D[i-1] : D[0], t0 = T.dr[0] + i*span, mv = seg(t, t0, t0 + span*.3), u = seg(t, t0 + span*.3, t0 + span);
        if (mv < 1 && i > 0){ const e = ease(mv); x = lerp(pr[1],d[1],e); y = lerp(pr[3]-.5,d[2],e); lift = Math.sin(e*Math.PI); w = lerp(pr[4],d[4],e); }
        else { x = d[1]; y = lerp(d[2], d[3]-.4, u); lift = 0; w = lerp(d[4], Math.max(1.9, d[4]*.55), u); } }
      else if (t < T.dots[1] + .05){ const i = Math.min(2, Math.floor((t - T.dots[0])/.2)), d = DOTS[i], t0 = T.dots[0] + i*.2, pr = i ? DOTS[i-1] : [D[n-1][1], D[n-1][3]], e = ease(seg(t, t0, t0 + .1));
        x = lerp(pr[0],d[0],e); y = lerp(pr[1],d[1],e); lift = 1 - seg(t, t0 + .06, t0 + .12); w = d[2]*2.2; }
      else { const u = ease(seg(t,...T.out2)); x = lerp(DOTS[2][0],OUT[0],u); y = lerp(DOTS[2][1],OUT[1],u); lift = seg(t, T.out2[0], T.out2[0] + .12); w = 2.2; }
      place(x, y, lift, w);
      const vis = seg(t, 0, .25) * (1 - seg(t, 11.55, 11.85)); brush.style.opacity = vis; shadow.style.opacity = .3*vis;
    }
    return { render, end: 12.2 };
  }

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // la animación del logo arranca recién cuando se va el salpicón de pintura de la carga, así se ve entera
  const splashDone = new Promise(r => { const s = document.getElementById('splashLoad'); if (!s) return r();
    s.addEventListener('animationend', e => { if (e.animationName === 'slOut') r(); }); setTimeout(r, 1900); });
  const anims = els.map(el => {
    const a = (el.classList.contains('logo-pincel') ? pincel : balde)(el);
    let raf = 0;
    a.play = () => { cancelAnimationFrame(raf); const t0 = performance.now();
      const step = now => { const t = (now - t0)/1000; a.render(Math.min(t, a.end)); if (t < a.end) raf = requestAnimationFrame(step); };
      raf = requestAnimationFrame(step); };
    a.render(reduce ? a.end : 0);
    el.addEventListener('click', a.play);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); a.play(); } });
    if (!reduce && 'IntersectionObserver' in window)
      new IntersectionObserver((es, io) => { if (es[0].isIntersecting){ io.disconnect(); splashDone.then(() => setTimeout(a.play, 150)); } }, { threshold:.5 }).observe(el);
    return a;
  });
  window.__logos = (t) => anims.forEach(a => a.render(Math.min(t, a.end))); // para probar cuadros
})();

/* mockup de la campera: se reproduce solo cuando se ve */
(function(){
  const v = document.querySelector('.p3-mock video');
  if (!v || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  new IntersectionObserver(es => es[0].isIntersecting ? v.play().catch(() => {}) : v.pause(), { threshold:.35 }).observe(v);
})();


/* "¿Arrancamos tu proyecto?": el recuadro azul se derrite por abajo (forma copiada de una referencia de Camilo) */
(function(){
  const card = document.querySelector('.contact'); if (!card) return;
  // pintura en el borde de abajo del recuadro, con la forma de la referencia de Camilo
  // (borde ondulado con lomos redondos y pocas gotas cortas). PROF = perfil medido de la referencia (x 0..1, y en px de la foto).
  function paintDrip(card, opt){
    opt = opt || {};
    const PROF = [[0.0,85.4],[0.0035,87.6],[0.007,91.0],[0.0106,95.0],[0.0141,99.1],[0.0176,104.4],[0.0211,111.9],[0.0246,130.1],[0.0281,147.1],[0.0317,150.6],[0.0352,151.7],[0.0387,151.9],[0.0422,151.0],[0.0457,149.3],[0.0493,146.3],[0.0528,141.3],[0.0563,135.1],[0.0598,129.0],[0.0633,123.7],[0.0668,119.6],[0.0704,116.4],[0.0739,114.0],[0.0774,112.1],[0.0809,111.1],[0.0844,111.0],[0.088,111.1],[0.0915,112.0],[0.095,113.3],[0.0985,115.1],[0.102,117.7],[0.1055,120.4],[0.1091,124.0],[0.1126,127.4],[0.1161,131.3],[0.1196,135.7],[0.1231,140.9],[0.1266,148.0],[0.1302,157.0],[0.1337,167.4],[0.1372,182.6],[0.1407,224.7],[0.1442,268.7],[0.1478,276.1],[0.1513,278.4],[0.1548,279.3],[0.1583,278.9],[0.1618,277.1],[0.1653,273.6],[0.1689,266.1],[0.1724,242.6],[0.1759,204.7],[0.1794,179.0],[0.1829,164.4],[0.1865,158.0],[0.19,153.6],[0.1935,150.0],[0.197,146.4],[0.2005,143.7],[0.204,141.4],[0.2076,139.6],[0.2111,138.0],[0.2146,136.7],[0.2181,135.7],[0.2216,135.1],[0.2252,134.9],[0.2287,134.9],[0.2322,135.1],[0.2357,135.7],[0.2392,136.6],[0.2427,138.1],[0.2463,140.3],[0.2498,142.6],[0.2533,145.4],[0.2568,149.1],[0.2603,154.1],[0.2639,160.1],[0.2674,166.1],[0.2709,170.7],[0.2744,173.4],[0.2779,174.7],[0.2814,175.0],[0.285,175.0],[0.2885,174.0],[0.292,171.7],[0.2955,168.6],[0.299,163.6],[0.3026,156.3],[0.3061,146.6],[0.3096,135.3],[0.3131,123.7],[0.3166,114.3],[0.3201,108.1],[0.3237,104.1],[0.3272,100.9],[0.3307,98.3],[0.3342,96.3],[0.3377,94.4],[0.3412,92.4],[0.3448,90.7],[0.3483,89.6],[0.3518,88.4],[0.3553,88.0],[0.3588,88.0],[0.3624,88.6],[0.3659,90.0],[0.3694,92.0],[0.3729,94.9],[0.3764,97.4],[0.3799,99.7],[0.3835,101.6],[0.387,103.1],[0.3905,104.3],[0.394,104.9],[0.3975,105.0],[0.4011,105.0],[0.4046,104.7],[0.4081,104.1],[0.4116,104.0],[0.4151,104.6],[0.4186,106.6],[0.4222,110.6],[0.4257,117.9],[0.4292,154.3],[0.4327,197.4],[0.4362,202.9],[0.4398,206.4],[0.4433,208.6],[0.4468,209.7],[0.4503,209.9],[0.4538,208.7],[0.4573,206.4],[0.4609,202.4],[0.4644,193.4],[0.4679,164.3],[0.4714,123.0],[0.4749,100.0],[0.4785,89.7],[0.482,83.4],[0.4855,78.9],[0.489,74.9],[0.4925,71.6],[0.496,69.0],[0.4996,66.9],[0.5031,65.1],[0.5066,64.0],[0.5101,63.3],[0.5136,62.9],[0.5172,63.1],[0.5207,64.1],[0.5242,65.4],[0.5277,67.7],[0.5312,70.6],[0.5347,74.3],[0.5383,79.1],[0.5418,85.0],[0.5453,92.3],[0.5488,100.7],[0.5523,108.9],[0.5558,115.7],[0.5594,120.7],[0.5629,123.7],[0.5664,125.3],[0.5699,126.0],[0.5734,125.6],[0.577,123.6],[0.5805,120.3],[0.584,115.3],[0.5875,107.3],[0.591,98.7],[0.5945,93.9],[0.5981,92.4],[0.6016,92.4],[0.6051,93.6],[0.6086,95.3],[0.6121,97.9],[0.6157,101.1],[0.6192,104.4],[0.6227,108.4],[0.6262,113.0],[0.6297,117.3],[0.6332,122.0],[0.6368,126.7],[0.6403,131.3],[0.6438,136.1],[0.6473,142.3],[0.6508,153.4],[0.6544,169.0],[0.6579,181.0],[0.6614,188.3],[0.6649,192.7],[0.6684,195.1],[0.6719,196.0],[0.6755,196.0],[0.679,196.0],[0.6825,195.7],[0.686,194.6],[0.6895,192.7],[0.6931,189.7],[0.6966,184.7],[0.7001,177.0],[0.7036,159.9],[0.7071,141.6],[0.7106,133.7],[0.7142,128.1],[0.7177,124.1],[0.7212,121.0],[0.7247,118.3],[0.7282,116.1],[0.7318,114.3],[0.7353,112.7],[0.7388,111.4],[0.7423,110.6],[0.7458,110.0],[0.7493,110.0],[0.7529,110.0],[0.7564,110.0],[0.7599,110.6],[0.7634,111.6],[0.7669,113.0],[0.7704,114.6],[0.774,116.3],[0.7775,118.6],[0.781,120.7],[0.7845,122.7],[0.788,124.4],[0.7916,126.0],[0.7951,126.9],[0.7986,127.0],[0.8021,127.0],[0.8056,126.1],[0.8091,124.4],[0.8127,121.9],[0.8162,118.7],[0.8197,114.7],[0.8232,109.4],[0.8267,102.9],[0.8303,92.9],[0.8338,82.1],[0.8373,76.0],[0.8408,74.1],[0.8443,74.1],[0.8478,75.0],[0.8514,76.4],[0.8549,78.3],[0.8584,80.7],[0.8619,84.3],[0.8654,88.9],[0.869,92.3],[0.8725,93.7],[0.876,94.0],[0.8795,93.4],[0.883,91.9],[0.8865,89.4],[0.8901,85.7],[0.8936,81.3],[0.8971,79.1],[0.9006,79.1],[0.9041,80.0],[0.9077,82.1],[0.9112,85.7],[0.9147,91.1],[0.9182,129.7],[0.9217,179.1],[0.9252,199.7],[0.9288,209.1],[0.9323,213.4],[0.9358,216.1],[0.9393,218.4],[0.9428,220.0],[0.9464,220.9],[0.9499,220.3],[0.9534,218.6],[0.9569,215.7],[0.9604,211.7],[0.9639,206.6],[0.9675,198.9],[0.971,184.4],[0.9745,165.4],[0.978,150.4],[0.9815,138.0],[0.985,126.6],[0.9886,116.0],[0.9921,106.0],[0.9956,97.4],[0.9991,91.6],[1,91.57142857142857]], MID = 63;
    const old = card.querySelector('.drip-svg'); if (old) old.remove();
    const W = card.offsetWidth, H = card.offsetHeight, R = parseFloat(getComputedStyle(card).borderBottomLeftRadius) || 28;
    const ky = W < 500 ? .5 : .5, band = W < 500 ? 14 : 18, B = H, top = H - band;
    const span = W < 500 ? .56 : .87;   // en celular se usa un tramo de la referencia (3 gotas)
    const fade = x => Math.max(0, Math.min(1, (Math.min(x, W - x) - R*.6) / 50));   // en las puntas sigue la curva del recuadro
    // profundidad por pixel, interpolando el perfil medido
    const src = PROF.filter(p => p[0] <= span + .01).map(([u, y]) => [u/span*W, Math.max(0, y - MID)*ky]);
    const dep = new Float32Array(W + 1);
    for (let x = 0, j = 0; x <= W; x++){ while (j < src.length - 2 && src[j+1][0] < x) j++; const [x0,y0] = src[j], [x1,y1] = src[j+1]; dep[x] = y0 + (y1 - y0) * Math.max(0, Math.min(1, (x - x0)/((x1 - x0) || 1))); }
    // afinar las gotas: se "comen" los costados (erosión), así lo que chorrea queda más finito
    const er = W < 500 ? 2 : 8, thin = new Float32Array(W + 1);
    for (let x = 0; x <= W; x++){ let m = Infinity; for (let t = -er; t <= er; t++){ const v = dep[Math.max(0, Math.min(W, x + t))]; if (v < m) m = v; } thin[x] = m; }
    // suavizar después de afinar, así la punta de cada gota queda redonda (no en pico)
    const sm = new Float32Array(W + 1), rs = W < 500 ? 3 : 5;
    for (let x = 0; x <= W; x++){ let a = 0, n = 0; for (let t = -rs; t <= rs; t++){ a += thin[Math.max(0, Math.min(W, x + t))]; n++; } sm[x] = a / n; }
    // borde ondulado de base (como el menú de arriba); al bajar, la pintura se estira hasta formar las gotas
  const base = x => 5 + 3*Math.sin(x/70) + 2*Math.sin(x/27 + 1);
  const Dmax = Math.max(...sm);
  function pathFor(p){
    let d = `M0,${top} `;
    for (let x = 0; x <= W; x += 16) d += `L${x},${(top + 2.5*Math.sin(x/90) + 1.5*Math.sin(x/33+1)).toFixed(1)} `;
    d += `L${W},${B} `;
    // toda la forma se estira de a poco (nunca se corta en recto); las gotas más largas bajan un poco después
    const ease = t => t < 0 ? 0 : t > 1 ? 1 : t*t*(3 - 2*t);
    for (let x = W; x >= 0; x -= 2){ const full = sm[x]*fade(x), b0 = Math.min(base(x)*fade(x), full), rel = (full - b0) / (Dmax || 1);
      d += `L${x},${(B - 2 + b0 + (full - b0) * ease(p*1.35 - rel*.35)).toFixed(1)} `; }
    return d + 'Z';
  }
  const d = pathFor(opt.progress == null ? 1 : opt.progress);
  const fill = opt.color === 'azul' ? ['#3d64e6','#2b50d8','#1f3fb8'] : ['#ff9a45','#ff812c','#e8640f'];
    const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg'), id = 'dp' + Math.random().toString(36).slice(2,7);
    svg.setAttribute('class', 'drip-svg'); svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;left:0;top:0;overflow:visible;pointer-events:none;z-index:0';
    const gloss = opt.gloss;
    // recorte: dentro del recuadro respeta las esquinas redondeadas; debajo del recuadro deja caer las gotas
    svg.innerHTML = `<defs><clipPath id="${id}c"><rect x="0" y="0" width="${W}" height="${H}" rx="${R}"/><rect x="0" y="${B-2}" width="${W}" height="400"/></clipPath>
      <linearGradient id="${id}g" gradientUnits="userSpaceOnUse" x1="0" y1="${top}" x2="0" y2="${B+110*ky}"><stop offset="0" stop-color="${fill[0]}"/><stop offset=".45" stop-color="${fill[1]}"/><stop offset="1" stop-color="${fill[2]}"/></linearGradient>
      ${gloss ? `<filter id="${id}f" x="-5%" y="-30%" width="110%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="3.5" result="b"/>
        <feSpecularLighting in="b" surfaceScale="4" specularConstant=".85" specularExponent="26" lighting-color="#fff" result="s"><fePointLight x="${W*.3}" y="${top-220}" z="260"/></feSpecularLighting>
        <feComposite in="s" in2="SourceAlpha" operator="in" result="sc"/><feComposite in="SourceGraphic" in2="sc" operator="arithmetic" k2="1" k3=".5"/></filter>` : ''}</defs>
      <g clip-path="url(#${id}c)"><path d="${d}" fill="url(#${id}g)" ${gloss ? `filter="url(#${id}f)"` : ''}/></g>`;
    card.appendChild(svg);
    const path = svg.querySelector('path');
    return p => path.setAttribute('d', pathFor(p));
  };
  // la pintura chorrea a medida que el recuadro sube en la pantalla (ligado al scroll)
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let update = null, raf = 0, full = false;
  // una vez que chorreó entero queda así aunque subas; recién se reinicia si volvés arriba de todo
  const progress = () => { if (reduce) return 1; if (scrollY < 80) full = false; if (full) return 1;
    const r = card.getBoundingClientRect(), vh = innerHeight;
    if (scrollY + vh >= document.documentElement.scrollHeight - 4) return (full = true, 1);   // llegaste al final: chorreado entero
    const u = (vh - r.bottom + 20) / (vh * .42); if (u >= 1) full = true; return Math.max(0, Math.min(1, u)); };   // arranca cuando se ve el borde de abajo
  const tick = () => { raf = 0; if (update) update(progress()); };
  const draw = () => { update = paintDrip(card, { gloss:true, color:'azul', progress:progress() }); };
  draw(); let t = 0; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(draw, 150); });
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(tick); }, { passive:true });
  if (document.fonts) document.fonts.ready.then(draw);
})();

/* planes resumidos en el inicio: se ven los primeros puntos y "Ver más" muestra el detalle completo */
document.querySelectorAll('.plan').forEach(plan => {
  const ul = plan.querySelector('ul'); if (!ul || ul.children.length <= 3) return;
  plan.classList.add('short');
  const b = document.createElement('button'); b.type = 'button'; b.className = 'more-btn';
  const n = ul.children.length - 3, label = () => plan.classList.contains('open') ? 'Ver menos' : `Ver más (${n} más) ↓`;
  b.textContent = label(); b.setAttribute('aria-expanded', 'false');
  b.addEventListener('click', () => { plan.classList.toggle('open'); b.textContent = label(); b.setAttribute('aria-expanded', plan.classList.contains('open')); });
  ul.after(b);
});
