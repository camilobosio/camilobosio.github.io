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
  cats.forEach(c => c.addEventListener('click', () => { cats.forEach(x => x.setAttribute('aria-pressed', x === c)); tiles.forEach(t => t.hidden = c.dataset.f !== 'all' && t.dataset.cat !== c.dataset.f); }));
  const vids = document.querySelectorAll('.tile video');
  if('IntersectionObserver' in window && !reduce){ const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause()), { threshold:.4 }); vids.forEach(v => io.observe(v)); }
  const lb = document.getElementById('lb'), stage = document.getElementById('lbStage'), txt = document.getElementById('lbTxt'); let cur = 0;
  if(lb){
  const shown = () => tiles.filter(t => !t.hidden);
  function show(t){ const m = t.querySelector('img, video'); const n = m.cloneNode(); if(n.tagName === 'VIDEO'){ n.controls = true; n.loop = true; n.playsInline = true; n.muted = false; n.play().catch(() => { n.muted = true; n.play().catch(() => {}); }); } else { n.loading = 'eager'; } stage.replaceChildren(n); const c = t.querySelector('.cap'); txt.innerHTML = '<b>' + c.querySelector('b').textContent + '</b> ' + c.lastChild.textContent; cur = shown().indexOf(t); }
  function step(d){ const l = shown(); show(l[(cur + d + l.length) % l.length]); }
  tiles.forEach(t => t.addEventListener('click', () => { show(t); if(lb.showModal) lb.showModal(); }));
  document.getElementById('lbX').onclick = () => lb.close();
  document.getElementById('lbPrev').onclick = () => step(-1);
  document.getElementById('lbNext').onclick = () => step(1);
  lb.addEventListener('click', e => { if(e.target === lb || e.target === stage) lb.close(); });
  lb.addEventListener('close', () => stage.replaceChildren());
  addEventListener('keydown', e => { if(!lb.open) return; if(e.key === 'ArrowLeft') step(-1); if(e.key === 'ArrowRight') step(1); });
  }
  // barra superior con borde al bajar
  const top = document.getElementById('top'); addEventListener('scroll', () => top.classList.toggle('scrolled', scrollY > 10), { passive:true });
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
    { bg:'#5b3cf5', a:'#ff9d4d', b:'#ff5fa2', ink:'#ffffff', lt:'#f4f1ea' },
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
    { const [c, x] = cv(800, 800); x.fillStyle = seed % 2 ? '#5b3cf5' : p1.bg; x.fillRect(0, 0, 800, 800); shadowed(x, () => contain(x, im, 140, 140, 520, 520)); out.push([c, 'Sobre color']); }
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
  b360.addEventListener('click', () => turning ? stopTurn() : startTurn());

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
    if (e.key === 'Enter' && e.target === st) { e.preventDefault(); turning ? stopTurn() : startTurn(); }
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
      <linearGradient id="${p}bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7b61ff"/><stop offset="1" stop-color="#3a1fd1"/></linearGradient>
      <linearGradient id="${p}pv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9d4d"/><stop offset="1" stop-color="#ff5fa2"/></linearGradient>
      <linearGradient id="${p}st" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a2a"/><stop offset="1" stop-color="#ff9d4d"/></linearGradient>
      <filter id="${p}wet" x="-10%" y="-10%" width="120%" height="130%"><feTurbulence type="fractalNoise" baseFrequency=".35" numOctaves="1" seed="7"/><feDisplacementMap in="SourceGraphic" scale="1.2"/></filter>
      <filter id="${p}sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#3b1fd1" flood-opacity=".4"/></filter>
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

  // BALDE: entra desde arriba al costado, se inclina, vuelca y la pintura baja cubriendo el logo
  function balde(el){
    const { sv, p, clips, dots } = base(el, 'mask');
    const front = sv.querySelector('.front');
    const stream = mk('path', { fill: `url(#${p}st)`, d: '' }, sv);
    const splash = mk('g', { fill: '#ff8f3f' }, sv);
    const bucket = mk('image', { href: 'images/balde/balde.webp', width: 21, height: 25.6, x: -10.5, y: -12.8 }, sv);
    let sd = 11; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    const SP = Array.from({length:16}, () => ({ t0: 1.15 + rnd(), x: 10 + rnd()*44, vx: (rnd()-.5)*26, vy: -8 - rnd()*14, r: .35 + rnd()*.75 }));
    const spEls = SP.map(q => { const c = mk('circle', { r: q.r }, splash); c.style.opacity = 0; return c; });
    const ORDER = [1,0,2,3,5,4,6,7];
    function pose(t){
      if (t < .7){ const u = ease(seg(t,0,.7)); return [lerp(92,58,u), lerp(-44,-15,u), lerp(10,-25,u)]; }
      if (t < 1.1){ const u = ease(seg(t,.7,1.1)); return [58, -15, lerp(-25,-122,u)]; }
      if (t < 2.3) return [58 + Math.sin(t*9)*.25, -15, -122 + Math.sin(t*7)*2];
      if (t < 2.7){ const u = ease(seg(t,2.3,2.7)); return [58, -15, lerp(-122,-30,u)]; }
      const u = ease(seg(t,2.7,3.3)); return [lerp(58,94,u), lerp(-15,-46,u), lerp(-30,12,u)];
    }
    function render(t){
      const [bx, by, a] = pose(t), r = a*Math.PI/180, co = Math.cos(r), si = Math.sin(r);
      bucket.setAttribute('transform', `translate(${bx} ${by}) rotate(${a})`);
      bucket.style.opacity = seg(t, 0, .25) * (1 - seg(t, 3.05, 3.4));
      const px = bx + co*-9.9 - si*-9.5, py = by + si*-9.9 + co*-9.5, IMP = 54.7;
      const F = t < 1.05 ? -3 : lerp(2, 92, ease(seg(t,1.05,2.3)));
      let d = 'M0 -3 H64 ';
      for (let x = 64; x >= 0; x -= 2){ const y = F - Math.abs(x - IMP)*.45 + Math.sin(x*.7 + t*9)*.9*(F < 80 ? 1 : 0); d += `L${x} ${Math.max(-3, y).toFixed(2)} `; }
      front.setAttribute('d', d + 'Z');
      const w = 3.6 * seg(t,1.0,1.2) * (1 - seg(t,2.05,2.4));
      if (w > .05){
        const bot = Math.max(py, Math.min(F, 14)), top = py + (t > 2.05 ? (bot - py) * ease(seg(t,2.05,2.4)) : 0);
        let L = '', R = '';
        for (let y = top; y <= bot; y += 2){ const k = Math.sin(y*.55 + t*14)*.35; L += `L${(px - w/2 + k).toFixed(2)} ${y.toFixed(2)} `; R = `L${(px + w/2 + k*.6).toFixed(2)} ${y.toFixed(2)} ` + R; }
        stream.setAttribute('d', `M${px - w/2} ${top} ` + L + `L${px} ${bot + 1.2} ` + R + 'Z');
      } else stream.setAttribute('d', '');
      SP.forEach((q, i) => { const u = t - q.t0, e = spEls[i];
        if (u < 0 || u > .6){ e.style.opacity = 0; return; }
        const x0 = IMP + (q.x - IMP)*.6, y0 = cl(F - Math.abs(x0 - IMP)*.45, 6, 58);
        e.setAttribute('cx', x0 + q.vx*u); e.setAttribute('cy', y0 + q.vy*u + 45*u*u); e.style.opacity = 1 - u/.6; });
      ORDER.forEach((k, i) => { const d = D[k], u = ease(seg(t, 1.9 + i*.12, 2.8 + i*.12)); clips[k].setAttribute('height', (d[3] - d[2] + 1.5)*u); });
      dots.forEach((c, i) => { c.style.opacity = seg(t, 2.9 + i*.12, 3.05 + i*.12); });
    }
    return { render, end: 3.8 };
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
      new IntersectionObserver((es, io) => { if (es[0].isIntersecting){ io.disconnect(); setTimeout(a.play, 350); } }, { threshold:.5 }).observe(el);
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
