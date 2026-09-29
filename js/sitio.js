/* Zoom compartido por los visores de producto: doble clic/doble toque, pellizco (o pellizco del trackpad) y botones
   + / − dentro del cuadro. Con zoom, arrastrar mueve la vista; al volver a 1× todo sigue como antes.
   `layer` es lo que se agranda (con CSS transform); `onZoom` avisa para redibujar en más resolución. */
function zoomer(stage, layer, onZoom){
  const MAX = 3, pts = new Map();
  let z = 1, tx = 0, ty = 0, pan = null, pinch = null, lastTap = 0;
  const ctl = document.createElement('div'); ctl.className = 'zoomctl';
  ctl.innerHTML = '<button type="button" data-z="1" aria-label="Acercar">+</button><button type="button" data-z="-1" aria-label="Alejar" disabled>−</button>';
  stage.appendChild(ctl);
  const [bIn, bOut] = ctl.querySelectorAll('button');
  const api = { get z(){ return z; }, onStart:null };
  function clamp(){ const w = stage.clientWidth, h = stage.clientHeight; tx = Math.min(0, Math.max(w - w * z, tx)); ty = Math.min(0, Math.max(h - h * z, ty)); }
  function apply(){ clamp(); layer.style.transformOrigin = '0 0'; layer.style.transform = z > 1.001 ? `translate(${tx}px, ${ty}px) scale(${z})` : ''; stage.classList.toggle('zoomed', z > 1.02); bOut.disabled = z <= 1.001; bIn.disabled = z >= MAX - .001; }
  function set(nz, px, py){                                         // px, py: punto del cuadro que queda quieto
    const was = z; nz = Math.max(1, Math.min(MAX, nz)); if(Math.abs(nz - was) < .001) return;
    if(was <= 1.02 && nz > 1.02 && api.onStart) api.onStart();
    const r = stage.getBoundingClientRect(); px = px ?? r.width / 2; py = py ?? r.height / 2;
    tx = px - (px - tx) * nz / was; ty = py - (py - ty) * nz / was; z = nz; if(z <= 1.001){ z = 1; tx = ty = 0; }
    apply(); onZoom();
  }
  api.set = set;
  const local = e => { const r = stage.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  ctl.addEventListener('click', e => { const b = e.target.closest('button'); if(!b) return; stage.classList.add('used'); set(b.dataset.z > 0 ? (z < 1.5 ? 2 : z + 1) : (z > 2.2 ? z - 1 : 1)); });
  ctl.addEventListener('pointerdown', e => e.stopPropagation());
  stage.addEventListener('dblclick', e => { if(e.target.closest('.zoomctl, button')) return; e.preventDefault(); const [x, y] = local(e); set(z > 1.02 ? 1 : 2.4, x, y); });
  stage.addEventListener('wheel', e => { if(!e.ctrlKey) return; e.preventDefault(); const [x, y] = local(e); set(z * Math.exp(-e.deltaY * .01), x, y); }, { passive:false });   // pellizco del trackpad
  // devuelve true si este toque lo maneja el zoom (mover la vista o pellizcar)
  api.down = e => {
    pts.set(e.pointerId, local(e));
    if(e.pointerType === 'touch'){ const now = performance.now(); if(now - lastTap < 280 && pts.size === 1){ const [x, y] = local(e); set(z > 1.02 ? 1 : 2.4, x, y); lastTap = 0; return true; } lastTap = now; }
    if(pts.size === 2){ const [a, b] = [...pts.values()]; pinch = { d:Math.hypot(a[0] - b[0], a[1] - b[1]), z }; pan = null; return true; }
    if(z > 1.02){ stage.setPointerCapture(e.pointerId); pan = { x:e.clientX, y:e.clientY, tx, ty }; stage.classList.add('panning'); return true; }
    return false;
  };
  api.busy = e => {
    if(!pts.has(e.pointerId)) return false;
    pts.set(e.pointerId, local(e));
    if(pinch && pts.size === 2){ const [a, b] = [...pts.values()]; set(pinch.z * Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch.d, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); return true; }
    if(pan){ tx = pan.tx + e.clientX - pan.x; ty = pan.ty + e.clientY - pan.y; apply(); return true; }
    return false;
  };
  api.up = e => { if(e && e.pointerId !== undefined) pts.delete(e.pointerId); if(pts.size < 2) pinch = null; if(!pts.size){ pan = null; stage.classList.remove('panning'); } };
  api.reset = () => set(1);
  addEventListener('resize', () => { if(z > 1.001) apply(); });
  return api;
}

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

  // producto interactivo: la campera NUNCA gira sola. Los cuadros (sacados de los videos de Kling, mejorados a 2K)
  // se dibujan en un canvas según la mano: el giro sigue al mouse 1 a 1 y entre un cuadro y el siguiente se funden,
  // así la vuelta se ve continua. De frente, al acercarte al cierre se ilumina; lo agarrás y al bajarlo se abre.
  // Zoom (doble clic, pellizco o los botones): se carga la foto HD de ese ángulo y arrastrar mueve la vista.
  (function(){
    const st = document.getElementById('p3'); if(!st) return;
    const cv = document.getElementById('p3c'), ctx = cv.getContext('2d'), zip = document.getElementById('p3zip');
    // Tiras de 6 columnas de 450×800: 4 tramos de giro de 36 cuadros (144 = 2,5° cada uno) y 37 del cierre.
    // HD (900×1600): un cuadro de giro cada 5° (hd/g-000…071) y uno del cierre cada 3 (hd/a-00…12).
    const DIR = 'portfolio/ropa/campera-360/', SPIN = ['giro-1', 'giro-2', 'giro-3', 'giro-4'], OPEN = 'apertura', FW = 450, FH = 800, COLS = 6, PER = 36, SN = 144, ON = 37;
    let sheets = null, ready = false, angle = 0, vel = 0, open = 0, openGoal = 0, mode = null, lastX = 0, lastT = 0, raf = 0, drawn = '';
    const pic = src => new Promise((ok, bad) => { const i = new Image(); i.onload = () => ok(i); i.onerror = bad; i.src = src; });
    async function load(){
      sheets = await Promise.all([...SPIN, OPEN].map(n => pic(DIR + n + '.webp')));
      await Promise.all(sheets.map(i => i.decode ? i.decode().catch(() => {}) : 0));
      ready = true; st.classList.add('ready'); draw(true);
    }
    new IntersectionObserver((es, io) => { if(es[0].isIntersecting){ io.disconnect(); load(); } }, { rootMargin:'300px' }).observe(st);
    const zm = zoomer(st, cv, () => { drawn = ''; size(); });
    function size(){ const r = st.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1), z = Math.min(zm.z, 4096 / (r.height * dpr)); cv.width = Math.round(r.width * dpr * z); cv.height = Math.round(r.height * dpr * z); drawn = ''; draw(true); }
    addEventListener('resize', size); size();
    const spinPos = () => ((angle / 360 * SN) % SN + SN) % SN;                   // posición con decimales (0…144)
    const frameIdx = () => Math.round(spinPos()) % SN;
    const cell = (sheet, k) => [sheets[sheet], (k % COLS) * FW, Math.floor(k / COLS) * FH];
    const spinCell = i => cell(Math.floor(i / PER), i % PER);
    const hd = {}; const hdPic = name => hd[name] || (hd[name] = pic(DIR + 'hd/' + name + '.webp').then(i => (hd[name] = i, drawn = '', draw(true), i)).catch(() => {}));
    function blit(c, alpha){ ctx.globalAlpha = alpha; ctx.drawImage(c[0], c[1], c[2], FW, FH, 0, 0, cv.width, cv.height); }
    function draw(force){
      if(!ready) return;
      let key, hdName = null;
      if(open > .002){ const k = Math.min(ON - 1, Math.round(open * (ON - 1))); key = 'o' + k; if(zm.z > 1.05) hdName = 'a-' + String(Math.round(k / 3)).padStart(2, '0'); }
      else { const p = spinPos(); key = 's' + Math.round(p * 8); if(zm.z > 1.05 && !mode) hdName = 'g-' + String(Math.round(p / 2) % 72).padStart(3, '0'); }
      if(hdName){ const h = hd[hdName]; if(h instanceof Image){ key = 'hd' + hdName; if(!force && key === drawn) return; drawn = key; ctx.globalAlpha = 1; ctx.drawImage(h, 0, 0, cv.width, cv.height); return; } hdPic(hdName); }
      if(!force && key === drawn) return; drawn = key;
      if(open > .002){ blit(cell(4, Math.min(ON - 1, Math.round(open * (ON - 1)))), 1); }
      else { const p = spinPos(), a = Math.floor(p) % SN, t = p - Math.floor(p); blit(spinCell(a), 1); if(t > .04) blit(spinCell((a + 1) % SN), t); }   // fundido entre cuadros
      ctx.globalAlpha = 1;
      zip.style.setProperty('--zp', open.toFixed(3));
      const f = frameIdx(); st.classList.toggle('front', zm.z <= 1.02 && open < .98 && (f <= 5 || f >= SN - 5) && Math.abs(vel) <= 4);
    }
    function tick(ts){
      const dt = lastT ? Math.min(.05, (ts - lastT) / 1000) : 0; lastT = ts; let busy = false;
      if(mode !== 'spin' && Math.abs(vel) > 4){ angle += vel * dt; vel *= Math.pow(.05, dt); busy = true; }   // al soltar sigue un poco y frena suave
      if(mode !== 'zip' && open !== openGoal){ open += (openGoal - open) * Math.min(1, dt * 12); if(Math.abs(openGoal - open) < .01) open = openGoal; busy = true; }
      if(!mode && !busy){                                                             // imán suave: si quedó casi de frente, se acomoda de frente
        const off = ((angle % 360) + 540) % 360 - 180;
        if(Math.abs(off) > .3 && Math.abs(off) < 14){ angle -= off * Math.min(1, dt * 10); busy = true; }
      }
      if(!busy) vel = 0;
      draw(); raf = busy ? requestAnimationFrame(tick) : 0; if(!busy){ lastT = 0; draw(true); }
    }
    const kick = () => { if(!raf) raf = requestAnimationFrame(tick); };
    // zona del cierre (en % del cuadro): una franja angosta en el centro, del cuello al ruedo
    function nearZip(e){
      if(!ready || zm.z > 1.02 || Math.abs(vel) > 4) return false; const f = frameIdx(); if(!(f <= 5 || f >= SN - 5)) return false;   // de frente o casi
      const r = st.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      const zt = parseFloat(getComputedStyle(st).getPropertyValue('--zt')) / 100 || .308, zh = parseFloat(getComputedStyle(st).getPropertyValue('--zh')) / 100 || .427;
      if(open > .98) return false;
      const py = zt + open * zh;                                                       // donde está el tirador ahora
      return Math.abs(x - .5) < .1 && y > py - .07 && y < py + .09;
    }
    st.addEventListener('pointermove', e => {
      if(zm.busy(e)) return;
      if(mode === 'spin'){
        if(wasOpen){ if(Math.abs(e.clientX - downX) < 6) return; wasOpen = false; openGoal = 0; open = 0; }   // abierta: arrastrar la cierra y gira
        const dx = e.clientX - lastX; lastX = e.clientX; const k = 360 / (st.clientWidth * 1.7);              // una vuelta = 1,7 anchos: más control
        angle += dx * k; const now = performance.now(); vel = vel * .6 + Math.max(-540, Math.min(540, (dx * k) / Math.max(.008, (now - lastMove) / 1000))) * .4; lastMove = now; draw();
      } else if(mode === 'zip'){
        lastY = e.clientY; const r = zip.getBoundingClientRect(); open = Math.max(open, Math.min(1, zipStart + (e.clientY - zipY) / r.height)); openGoal = open; draw();   // solo baja, nunca sube
      } else st.classList.toggle('near', nearZip(e));
    });
    let lastY = 0, lastMove = 0, zipY = 0, zipStart = 0, downX = 0, wasOpen = false;
    st.addEventListener('pointerdown', e => {
      if(!ready || e.target.closest('.zoomctl')) return; st.classList.add('used');
      if(zm.down(e)){ mode = null; st.classList.remove('dragging', 'zipping'); return; }                  // con zoom: arrastrar mueve la vista
      st.setPointerCapture(e.pointerId); vel = 0;
      if(nearZip(e)){ mode = 'zip'; zipY = lastY = e.clientY; zipStart = open; angle = Math.round(angle / 360) * 360; st.classList.add('zipping'); }
      else { mode = 'spin'; lastX = e.clientX; downX = e.clientX; lastMove = performance.now(); wasOpen = openGoal > 0 || open > 0; st.classList.add('dragging'); }
    });
    function up(e){
      zm.up(e);
      if(mode === 'zip'){ openGoal = (open > .15 || Math.abs(lastY - zipY) < 6) ? 1 : 0; st.classList.remove('zipping'); kick(); }
      if(mode === 'spin'){ st.classList.remove('dragging'); if(wasOpen){ openGoal = 0; wasOpen = false; } if(performance.now() - lastMove > 60) vel = 0; kick(); }   // clic con la campera abierta: se cierra
      mode = null;
    }
    zm.onStart = () => { if(mode === 'spin' || mode === 'zip') up({}); vel = 0; if(!open) angle = Math.round(spinPos() / 2) * 2 / SN * 360; };   // con zoom se para en un ángulo con foto HD
    st.addEventListener('touchstart', e => { const t = e.touches[0]; if(t && e.touches.length === 1 && nearZip(t)) e.preventDefault(); }, { passive:false });
    st.addEventListener('touchmove', e => { if(mode === 'zip' || zm.z > 1.02 || e.touches.length > 1) e.preventDefault(); }, { passive:false });
    st.addEventListener('pointerup', up); st.addEventListener('pointercancel', up);
    st.addEventListener('pointerleave', () => { if(!mode) st.classList.remove('near'); });
    st.addEventListener('keydown', e => {
      if(!ready) return; st.classList.add('used');
      if(zm.z > 1.02 && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ')) return;
      if(e.key === 'ArrowLeft' || e.key === 'ArrowRight'){ openGoal = 0; open = 0; angle += (e.key === 'ArrowRight' ? 1 : -1) * 360 / SN * 2; draw(); }
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
    stopTurn(); zm.reset(); k = (k + TOPS.length) % TOPS.length; if (k === ti && from === undefined) return;
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
  // HD para el zoom girando: probador/hd/<id>/00…29.webp (un cuadro cada 12°, 960×1191)
  const SN = 60, SC = 10, SW = 540, SH = 670, sheets = {}, hd = {};
  let turning = false, angle = 0, vel = 0, sd = null, sraf = 0, lastT = 0, img360 = null;
  const sheet = id => sheets[id] || (sheets[id] = new Promise((ok, bad) => { const i = new Image(); i.onload = () => ok(i); i.onerror = bad; i.src = 'probador/giros/' + id + '.webp'; }));
  const zm = zoomer(st, $('pvZoom'), () => sizeSpin());
  const pos = () => ((angle / 360 * SN) % SN + SN) % SN;
  function drawSpin() {
    if (!img360) return;
    const p = pos();
    if (zm.z > 1.05) {                                            // con zoom: foto HD del ángulo (si ya llegó)
      const name = TOPS[ti].id + '/' + String(Math.round(p / 2) % 30).padStart(2, '0');
      const h = hd[name];
      if (h instanceof Image) { sctx.globalAlpha = 1; sctx.drawImage(h, 0, 0, spin.width, spin.height); return; }
      if (!h) hd[name] = new Promise(ok => { const i = new Image(); i.onload = () => { hd[name] = i; drawSpin(); ok(); }; i.onerror = ok; i.src = 'probador/hd/' + name + '.webp'; });
    }
    const a = Math.floor(p) % SN, t = p - Math.floor(p), cellAt = k => [(k % SC) * SW, Math.floor(k / SC) * SH];
    let [x, y] = cellAt(a); sctx.globalAlpha = 1; sctx.drawImage(img360, x, y, SW, SH, 0, 0, spin.width, spin.height);
    if (t > .04) { [x, y] = cellAt((a + 1) % SN); sctx.globalAlpha = t; sctx.drawImage(img360, x, y, SW, SH, 0, 0, spin.width, spin.height); sctx.globalAlpha = 1; }   // fundido entre cuadros
  }
  function sizeSpin() { const r = st.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1), z = Math.min(zm.z, 4096 / (r.height * d)); spin.width = Math.round(r.width * d * z); spin.height = Math.round(r.height * d * z); drawSpin(); }
  zm.onStart = () => { if (turning) { vel = 0; angle = Math.round(pos() / 2) * 2 / SN * 360; } };
  addEventListener('resize', sizeSpin);
  async function startTurn() {
    const t = TOPS[ti]; b360.classList.add('loading'); st.classList.remove('turned');
    try { img360 = await sheet(t.id); } catch (e) { b360.classList.remove('loading'); return; }
    b360.classList.remove('loading'); if (TOPS[ti] !== t) return;
    angle = 0; vel = 0; sizeSpin(); turning = true; st.classList.add('turning', 'used');
    b360.setAttribute('aria-pressed', 'true'); b360.textContent = '✓ Listo';
  }
  function stopTurn() {
    if (!turning) return; turning = false; zm.reset(); cancelAnimationFrame(sraf); sraf = 0; st.classList.remove('turning');
    b360.setAttribute('aria-pressed', 'false'); b360.textContent = '↻ 360°';
  }
  function kick() { if (!sraf) { lastT = 0; sraf = requestAnimationFrame(tick); } }
  function tick(ts) {
    const dt = lastT ? Math.min(.05, (ts - lastT) / 1000) : 0; lastT = ts; let busy = false;
    if (Math.abs(vel) > 4) { angle += vel * dt; vel *= Math.pow(.05, dt); busy = true; }
    else { vel = 0; const off = ((angle % 360) + 540) % 360 - 180; if (Math.abs(off) > .3 && Math.abs(off) < 16) { angle -= off * Math.min(1, dt * 10); busy = true; } }
    drawSpin(); sraf = busy ? requestAnimationFrame(tick) : 0;
  }
  b360.addEventListener('click', () => turning ? stopTurn() : startTurn());

  // arrastre
  let drag = null;
  st.addEventListener('pointerdown', e => {
    if (e.target.closest('button, .zoomctl')) return;
    st.classList.add('used');
    if (zm.down(e)) { drag = null; sd = null; return; }             // con zoom: arrastrar mueve la vista
    st.setPointerCapture(e.pointerId); st.classList.add('drag');
    if (turning) { sd = { x:e.clientX, t:performance.now() }; vel = 0; st.classList.add('turned'); return; }
    drag = { x:e.clientX, w:st.getBoundingClientRect().width, dir:0, p:0, moved:false };
  });
  st.addEventListener('pointermove', e => {
    if (zm.busy(e)) return;
    if (turning) {
      if (!sd) return; const now = performance.now(), dx = e.clientX - sd.x, k = 360 / (st.clientWidth * 1.7);   // una vuelta = 1,7 anchos
      angle -= dx * k; vel = vel * .6 + Math.max(-540, Math.min(540, (-dx * k) / Math.max(.008, (now - sd.t) / 1000))) * .4; sd.x = e.clientX; sd.t = now; drawSpin(); return;
    }
    if (!drag) return; const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) < 8) return; drag.moved = true;
    const dir = dx < 0 ? 1 : -1;
    if (dir !== drag.dir) { drag.dir = dir; cancelAnimationFrame(anim); inc.src = src(TOPS[(ti + dir + TOPS.length) % TOPS.length]); st.classList.add('swiping'); }
    drag.p = Math.min(1, Math.abs(dx) / (drag.w * .8)); reveal(drag.p, dir);
  });
  function up(e) {
    zm.up(e); st.classList.remove('drag');
    if (turning) { if (sd) { if (performance.now() - sd.t > 60) vel = 0; sd = null; kick(); } return; }
    if (!drag) return; const d = drag; drag = null; if (!d.moved) return;
    const dx = (e.clientX ?? d.x) - d.x;
    if (d.p > .22 || Math.abs(dx) > 70) go(ti + d.dir, d.dir, d.p); else back(d.p, d.dir);
  }
  st.addEventListener('pointerup', up); st.addEventListener('pointercancel', up);
  $('pvPrev').addEventListener('click', () => { st.classList.add('used'); go(ti - 1, -1); });
  $('pvNext').addEventListener('click', () => { st.classList.add('used'); go(ti + 1, 1); });
  st.addEventListener('keydown', e => {
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && zm.z > 1.02) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const d = e.key === 'ArrowRight' ? 1 : -1; if (turning) { angle += d * 12; drawSpin(); } else go(ti + d, d); }
    if (e.key === 'Enter' && e.target === st) { e.preventDefault(); turning ? stopTurn() : startTurn(); }
  });
  info();
})();

/* Prenda interactiva (portfolio): la campera sola, sin modelo. Todo son cuadros de videos de Kling 3.0 (4K) que
   empiezan y terminan en fotos fijas alineadas, así los movimientos se encadenan:
     A cerrada ─zip─ B abierta ─flap─ C costado corrido
     A ─hood─ D capucha puesta          B ─off─ E sin campera (la remera sola)
   Arrastrás los puntos (cierre, capucha, borde, hombros) y el video avanza a la par de tu mano; al soltar termina
   el movimiento o vuelve. De frente y cerrada, arrastrar el resto gira 360° (nunca sola). Botones = atajos. */
(() => {
  const st = document.getElementById('pr'); if (!st) return;
  const DIR = 'portfolio/ropa/prenda/', FW = 480, FH = 597, COLS = 8;
  const CLIPS = {                                   // n = cuadros en la tira; from/to = estados
    spin: { n:72, from:'A', to:'A' },
    zip:  { n:48, from:'A', to:'B' },
    flap: { n:48, from:'B', to:'C' },
    hood: { n:48, from:'A', to:'D' },
    off:  { n:48, from:'B', to:'E' }
  };
  // puntos para agarrar (en % del cuadro) al principio (t=0) y al final (t=1) de cada movimiento, y hacia dónde se arrastra
  // el tirador del cierre casi no se mueve en el primer tercio del video y baja entre el 33% y el 70% (medido en los
  // cuadros): esta curva hace que el punto vaya pegado al tirador real. Pares [avance de la mano, tiempo del video].
  const ZIPC = [[0, 0], [.04, .33], [.96, .70], [1, 1]], FLAPC = [[0, 0], [.04, .45], [.96, .85], [1, 1]];
  const pw = (c, x, i, o) => { for (let k = 1; k < c.length; k++) if (x <= c[k][i]) { const a = c[k - 1], b = c[k], f = (x - a[i]) / ((b[i] - a[i]) || 1); return a[o] + (b[o] - a[o]) * f; } return c[c.length - 1][o]; };
  const tOf = (h, p) => h.curve ? pw(h.curve, p, 0, 1) : p;      // avance de la mano → tiempo del video
  const pOf = (h, t) => h.curve ? pw(h.curve, t, 1, 0) : t;      // tiempo del video → dónde va el punto
  const HANDLES = {
    zipDown:  { clip:'zip',  dir: 1, label:'Bajá el cierre',     x0:51, y0:30, x1:52, y1:80, curve:ZIPC },
    zipUp:    { clip:'zip',  dir:-1, label:'Subí el cierre',     x0:51, y0:30, x1:52, y1:80, curve:ZIPC },
    hoodUp:   { clip:'hood', dir: 1, label:'Subí la capucha',    x0:50, y0:16, x1:50, y1:6 },
    hoodDown: { clip:'hood', dir:-1, label:'Bajá la capucha',    x0:50, y0:16, x1:50, y1:6 },
    flapOut:  { clip:'flap', dir: 1, label:'Corré el costado',   x0:55, y0:50, x1:72, y1:48, curve:FLAPC },
    flapIn:   { clip:'flap', dir:-1, label:'Volvé el costado',   x0:55, y0:50, x1:72, y1:48, curve:FLAPC },
    offUp:    { clip:'off',  dir: 1, label:'Tirá para sacarla', x0:33, y0:25, x1:33, y1:62 },
    offDown:  { clip:'off',  dir:-1, label:'Subila para ponerla', x0:33, y0:25, x1:33, y1:62 }
  };
  const EDGES = [['A', 'B', 'zip'], ['B', 'C', 'flap'], ['A', 'D', 'hood'], ['B', 'E', 'off']];
  const cv = document.getElementById('prc'), ctx = cv.getContext('2d');
  const sheets = {}, still = {};
  const pic = src => new Promise((ok, bad) => { const i = new Image(); i.onload = () => ok(i); i.onerror = bad; i.src = src; });
  const loading = {};
  const sheet = c => loading[c] || (loading[c] = pic(DIR + c + '.webp').then(i => (sheets[c] = i)));
  let ready = false, clip = 'zip', t = 0, angle = 0, vel = 0, drag = null, anim = null, raf = 0, lastT = 0;
  const state = () => angle % 360 ? 'A' : (t <= .001 ? CLIPS[clip].from : t >= .999 ? CLIPS[clip].to : null);
  const zm = zoomer(st, cv, () => size());

  async function load() {
    await Promise.all(['spin', 'zip'].map(sheet)); ready = true; st.classList.add('ready'); size(); ui();
    ['flap', 'hood', 'off'].forEach(c => sheet(c).then(() => {}, () => {}));
  }
  new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { io.disconnect(); load(); } }, { rootMargin:'400px' }).observe(st);
  function size() { const r = st.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1), z = Math.min(zm.z, 4096 / (r.height * d)); cv.width = Math.round(r.width * d * z); cv.height = Math.round(r.height * d * z); draw(); }
  addEventListener('resize', size);

  function blit(c, k, a) { const img = sheets[c]; if (!(img instanceof Image)) return false; ctx.globalAlpha = a; ctx.drawImage(img, (k % COLS) * FW, Math.floor(k / COLS) * FH, FW, FH, 0, 0, cv.width, cv.height); ctx.globalAlpha = 1; return true; }
  function frames(c, p) { const n = CLIPS[c].n, x = p * (n - 1), a = Math.floor(x), f = x - a; if (!blit(c, a, 1)) return false; if (f > .04 && a + 1 < n) blit(c, a + 1, f); return true; }
  function draw() {
    if (!ready) return;
    const s = state();
    if (zm.z > 1.05 && s && !(angle % 360)) {                       // con zoom y quieta: foto HD del estado
      const h = still[s]; if (h instanceof Image) { ctx.drawImage(h, 0, 0, cv.width, cv.height); return; }
      if (!h) still[s] = pic(DIR + 'hd/' + s + '.webp').then(i => { still[s] = i; draw(); }, () => {});
    }
    if (angle % 360) { const n = CLIPS.spin.n - 1, x = ((angle / 360 * n) % n + n) % n, a = Math.floor(x), f = x - a; blit('spin', a, 1); if (f > .04) blit('spin', (a + 1) % n, f); return; }
    if (!frames(clip, t) && !frames('spin', 0)) return;
  }

  // ---------- puntos para agarrar ----------
  const layer = document.getElementById('prHandles');
  const hEls = {};
  Object.entries(HANDLES).forEach(([k, h]) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'pr-hand'; b.dataset.k = k;
    b.innerHTML = '<span class="dot"></span><em>' + h.label + '</em>'; b.setAttribute('aria-label', h.label);
    layer.appendChild(b); hEls[k] = b;
  });
  const lerp = (a, b, x) => a + (b - a) * x;
  function ui() {
    const s = state(), front = !(angle % 360) && Math.abs(vel) < 4;
    Object.entries(HANDLES).forEach(([k, h]) => {
      const el = hEls[k], active = drag && drag.k === k;
      const on = active || (front && !anim && s && (h.clip === clip || s === CLIPS[h.clip].from || s === CLIPS[h.clip].to) && ((h.dir > 0 && s === CLIPS[h.clip].from) || (h.dir < 0 && s === CLIPS[h.clip].to)));
      el.classList.toggle('on', !!on && zm.z <= 1.02); el.tabIndex = on ? 0 : -1;
      const p = h.clip === clip ? pOf(h, t) : (h.dir > 0 ? 0 : 1);
      el.style.left = lerp(h.x0, h.x1, p) + '%'; el.style.top = lerp(h.y0, h.y1, p) + '%';
    });
    st.classList.toggle('front', front && state() === 'A');
    document.querySelectorAll('#prActs button').forEach(b => { const g = b.dataset.go; b.setAttribute('aria-pressed', state() === g); });
    const sl = document.getElementById('prState'); if (sl) sl.textContent = { A:'Cerrada', B:'Cierre abierto', C:'Costado corrido', D:'Capucha puesta', E:'Sin la campera' }[s] || '';
  }

  // ---------- animación ----------
  function tick(ts) {
    const dt = lastT ? Math.min(.05, (ts - lastT) / 1000) : 0; lastT = ts; let busy = false;
    if (anim) {
      anim.p = Math.min(1, anim.p + dt / anim.dur); const e = anim.p < .5 ? 2 * anim.p * anim.p : 1 - Math.pow(-2 * anim.p + 2, 2) / 2;
      if (anim.kind === 'spin') angle = lerp(anim.a0, anim.a1, e); else t = lerp(anim.t0, anim.t1, e);
      if (anim.p >= 1) { if (anim.kind === 'spin') angle = anim.a1 % 360 === 0 ? 0 : anim.a1; const nx = anim.next; anim = null; if (nx) nx(); }
      busy = true;
    } else if (!drag) {
      if (Math.abs(vel) > 4) { angle += vel * dt; vel *= Math.pow(.05, dt); busy = true; }
      else { vel = 0; const off = ((angle % 360) + 540) % 360 - 180; if (angle % 360 && Math.abs(off) < 16) { angle -= off * Math.min(1, dt * 10); if (Math.abs(off) < .3) angle = 0; busy = true; } }
    }
    draw(); ui(); raf = busy ? requestAnimationFrame(tick) : 0; if (!busy) lastT = 0;
  }
  const kick = () => { if (!raf) { lastT = 0; raf = requestAnimationFrame(tick); } };
  function play(c, t1, next, dur) { clip = c; anim = { kind:'clip', t0:t, t1, p:0, dur:(dur || 1.3) * Math.max(.25, Math.abs(t1 - t)), next }; kick(); }
  function toFront(next) { const a = ((angle % 360) + 360) % 360; if (!a) { angle = 0; return next(); } anim = { kind:'spin', a0:a, a1:a > 180 ? 360 : 0, p:0, dur:.6, next }; kick(); }
  // camino más corto entre estados (A-B, B-C, A-D, B-E) y se reproduce paso a paso
  function goTo(target) {
    const s = state(); if (!s || s === target || anim) return;
    const prev = { [s]:null }, q = [s];
    while (q.length) { const u = q.shift(); for (const [a, b, c] of EDGES) for (const [x, y, fw] of [[a, b, 1], [b, a, 0]]) if (x === u && !(y in prev)) { prev[y] = [u, c, fw]; q.push(y); } }
    const steps = []; for (let v = target; prev[v]; v = prev[v][0]) steps.unshift(prev[v]);
    const run = i => { if (i >= steps.length) return; const [, c, fw] = steps[i]; sheet(c).then(() => play(c, fw ? 1 : 0, () => run(i + 1))); };
    zm.reset(); toFront(() => run(0));
  }
  document.querySelectorAll('#prActs button').forEach(b => b.addEventListener('click', () => {
    st.classList.add('used');
    if (b.dataset.go === 'spin') { if (state() !== 'A' || anim) return goTo('A'); zm.reset(); anim = { kind:'spin', a0:0, a1:360, p:0, dur:2.4 }; kick(); return; }
    goTo(state() === b.dataset.go ? CLIPS[{ B:'zip', C:'flap', D:'hood', E:'off' }[b.dataset.go]].from : b.dataset.go);
  }));

  // ---------- arrastre ----------
  st.addEventListener('pointerdown', e => {
    if (!ready || anim || e.target.closest('.zoomctl, #prActs')) return;
    st.classList.add('used');
    if (zm.down(e)) return;
    const hb = e.target.closest('.pr-hand.on');
    st.setPointerCapture(e.pointerId);
    if (hb) {
      const h = HANDLES[hb.dataset.k]; const r = st.getBoundingClientRect();
      if (h.clip !== clip) { clip = h.clip; t = h.dir > 0 ? 0 : 1; }
      sheet(h.clip);
      const len = Math.hypot((h.x1 - h.x0) / 100 * r.width, (h.y1 - h.y0) / 100 * r.height);
      drag = { k:hb.dataset.k, h, x:e.clientX, y:e.clientY, t0:t, p0:pOf(h, t), len, ux:(h.x1 - h.x0) / 100 * r.width / len, uy:(h.y1 - h.y0) / 100 * r.height / len };
      st.classList.add('grabbing'); ui(); return;
    }
    if (state() === 'A' || angle % 360) { drag = { k:'spin', x:e.clientX, lx:e.clientX, lt:performance.now() }; vel = 0; clip = 'zip'; t = 0; st.classList.add('dragging'); }
  });
  st.addEventListener('pointermove', e => {
    if (zm.busy(e) || !drag) return;
    if (drag.k === 'spin') {
      const now = performance.now(), dx = e.clientX - drag.lx, k = 360 / (st.clientWidth * 1.7);
      angle += dx * k; vel = vel * .6 + Math.max(-540, Math.min(540, dx * k / Math.max(.008, (now - drag.lt) / 1000))) * .4; drag.lx = e.clientX; drag.lt = now;
      draw(); ui(); return;
    }
    const d = (e.clientX - drag.x) * drag.ux + (e.clientY - drag.y) * drag.uy;       // cuánto se movió en la dirección del gesto
    t = tOf(drag.h, Math.max(0, Math.min(1, drag.p0 + d / drag.len))); draw(); ui();
  });
  function up(e) {
    zm.up(e); if (!drag) return; const d = drag; drag = null; st.classList.remove('grabbing', 'dragging');
    if (d.k === 'spin') { if (performance.now() - d.lt > 60) vel = 0; kick(); return; }
    const moved = Math.abs(t - d.t0) > .02;
    play(clip, moved ? (Math.abs(t - d.t0) > .2 ? (d.h.dir > 0 ? 1 : 0) : d.t0) : (d.h.dir > 0 ? 1 : 0), null, 1);   // un toque sin arrastrar hace el movimiento entero
  }
  st.addEventListener('pointerup', up); st.addEventListener('pointercancel', up);
  st.addEventListener('touchmove', e => { if (drag || zm.z > 1.02 || e.touches.length > 1) e.preventDefault(); }, { passive:false });
  st.addEventListener('keydown', e => {
    if (!ready || anim) return;
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && state() === 'A' && zm.z <= 1.02) { e.preventDefault(); angle += (e.key === 'ArrowRight' ? 10 : -10); if (Math.abs(angle % 360) < 1) angle = 0; draw(); ui(); }
    const hb = e.target.closest && e.target.closest('.pr-hand.on');
    if (hb && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); const h = HANDLES[hb.dataset.k]; clip = h.clip; t = h.dir > 0 ? 0 : 1; sheet(h.clip).then(() => play(h.clip, h.dir > 0 ? 1 : 0)); }
  });
})();

/* logo del inicio: entra un balde de pintura, lo vuelca y el logo queda pintado y chorreado.
   Se reproduce una vez al verse; tocarlo (o Enter) lo repite. */
(function(){
  const box = document.querySelector('.marca-vid');
  const sv = box && box.querySelector('.balde-svg');
  if (!sv) return;
  const NS = 'http://www.w3.org/2000/svg';
  const q = s => sv.querySelector(s);
  const front = q('.bz-front'), stream = q('.bz-stream'), bucket = q('.bz-bucket'), splash = q('.bz-splash'), dg = q('.bz-drips');
  // chorreado del logo (mismas formas que images/logo.svg): [path, arriba, abajo]
  const D = [
    ['M9.7 40 Q10.9 41.2 10.9 42.5 V44 a1.1 1.1 0 0 0 2.2 0 V42.5 Q13.1 41.2 14.3 40 Z',40,45.1],
    ['M12.4 50 Q13.6 51.2 13.6 52.5 V57 a1.4 1.4 0 0 0 2.8 0 V52.5 Q16.4 51.2 17.6 50 Z',50,58.4],
    ['M20.2 50 Q21.4 51.2 21.4 52.5 V61 a1.6 1.6 0 0 0 3.2 0 V52.5 Q24.6 51.2 25.8 50 Z',50,62.6],
    ['M26.7 50 Q27.9 51.2 27.9 52.5 V54 a1.1 1.1 0 0 0 2.2 0 V52.5 Q30.1 51.2 31.3 50 Z',50,55.1],
    ['M42.9 14 Q44.1 15.2 44.1 16.5 V17.5 a0.9 0.9 0 0 0 1.8 0 V16.5 Q45.9 15.2 47.1 14 Z',14,18.4],
    ['M37.7 32 Q38.9 33.2 38.9 34.5 V37 a1.1 1.1 0 0 0 2.2 0 V34.5 Q41.1 33.2 42.3 32 Z',32,38.1],
    ['M37.5 50 Q38.7 51.2 38.7 52.5 V58 a1.3 1.3 0 0 0 2.6 0 V52.5 Q41.3 51.2 42.5 50 Z',50,59.3],
    ['M44.7 49 Q45.9 50.2 45.9 51.5 V54 a1.1 1.1 0 0 0 2.2 0 V51.5 Q48.1 50.2 49.3 49 Z',49,55.1]
  ];
  const DOTS = [[15,59.5,.9],[24.6,62.5,1.3],[40,61,1]];
  const defs = sv.querySelector('defs');
  const clips = D.map((d, i) => {
    const cp = document.createElementNS(NS,'clipPath'); cp.id = 'bz-d' + i;
    const r = document.createElementNS(NS,'rect'); r.setAttribute('x',0); r.setAttribute('width',64); r.setAttribute('y',d[1]-1); r.setAttribute('height',0);
    cp.appendChild(r); defs.appendChild(cp);
    const p = document.createElementNS(NS,'path'); p.setAttribute('d', d[0]); p.setAttribute('clip-path', 'url(#bz-d' + i + ')'); dg.appendChild(p);
    return r;
  });
  const dots = DOTS.map(([x,y,r]) => { const c = document.createElementNS(NS,'circle'); c.setAttribute('cx',x); c.setAttribute('cy',y); c.setAttribute('r',r); c.style.opacity = 0; dg.appendChild(c); return c; });
  // gotas que salpican (siempre las mismas)
  let sd = 11; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  const SP = Array.from({length:16}, () => ({ t0: 1.15 + rnd()*1.0, x: 10 + rnd()*44, vx: (rnd()-.5)*26, vy: -8 - rnd()*14, r: .35 + rnd()*.75 }));
  const spEls = SP.map(p => { const c = document.createElementNS(NS,'circle'); c.setAttribute('r', p.r); c.style.opacity = 0; splash.appendChild(c); return c; });

  const cl = (v,a,b) => Math.max(a, Math.min(b, v)), seg = (t,a,b) => cl((t-a)/(b-a),0,1);
  const ease = t => t < .5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2, lerp = (a,b,t) => a + (b-a)*t;
  const END = 3.8;
  function bucketAt(t){ // posición y giro del balde
    if (t < .7){ const u = ease(seg(t,0,.7)); return [lerp(92,58,u), lerp(-44,-15,u), lerp(10,-25,u)]; }
    if (t < 1.1){ const u = ease(seg(t,.7,1.1)); return [58, -15, lerp(-25,-122,u)]; }
    if (t < 2.3) return [58 + Math.sin(t*9)*.25, -15, -122 + Math.sin(t*7)*2];
    if (t < 2.7){ const u = ease(seg(t,2.3,2.7)); return [58, -15, lerp(-122,-30,u)]; }
    const u = ease(seg(t,2.7,3.3)); return [lerp(58,94,u), lerp(-15,-46,u), lerp(-30,12,u)];
  }
  function render(t){
    const [bx, by, a] = bucketAt(t), r = a*Math.PI/180, co = Math.cos(r), si = Math.sin(r);
    bucket.setAttribute('transform', `translate(${bx} ${by}) rotate(${a})`);
    const lx = -9.9, ly = -9.5, px = bx + co*lx - si*ly, py = by + si*lx + co*ly; // borde por donde cae la pintura
    // la pintura baja desde donde cae y se abre hacia los costados
    const IMP = 54.7, F = t < 1.05 ? -3 : lerp(2, 92, ease(seg(t,1.05,2.3)));
    let d = 'M0 -3 H64 ';
    for (let x = 64; x >= 0; x -= 2){ const y = F - Math.abs(x - IMP)*.45 + Math.sin(x*.7 + t*9)*.9*(F < 80 ? 1 : 0); d += `L${x} ${Math.max(-3, y).toFixed(2)} `; }
    front.setAttribute('d', d + 'Z');
    // chorro
    const w = 3.6 * seg(t,1.0,1.2) * (1 - seg(t,2.05,2.4));
    if (w > .05){
      const bot = Math.max(py, Math.min(F, 14)), top = py + (t > 2.05 ? (bot - py) * ease(seg(t,2.05,2.4)) : 0);
      let L = '', Rr = '';
      for (let y = top; y <= bot; y += 2){ const k = Math.sin(y*.55 + t*14)*.35; L += `L${(px - w/2 + k).toFixed(2)} ${y.toFixed(2)} `; Rr = `L${(px + w/2 + k*.6).toFixed(2)} ${y.toFixed(2)} ` + Rr; }
      stream.setAttribute('d', `M${px - w/2} ${top} ` + L + `L${px} ${bot + 1.2} ` + Rr + 'Z');
    } else stream.setAttribute('d', '');
    // salpicaduras
    SP.forEach((p, i) => { const u = t - p.t0; const e = spEls[i];
      if (u < 0 || u > .6){ e.style.opacity = 0; return; }
      const x0 = IMP + (p.x - IMP)*.6, y0 = cl(F - Math.abs(x0 - IMP)*.45, 6, 58);
      e.setAttribute('cx', x0 + p.vx*u); e.setAttribute('cy', y0 + p.vy*u + 45*u*u); e.style.opacity = 1 - u/.6; });
    // chorreado: cada gota crece cuando la pintura ya pasó por su altura
    D.forEach((dd, i) => { const t0 = 1.9 + i*.12; const u = ease(seg(t, t0, t0 + .9)); clips[i].setAttribute('height', (dd[2] - dd[1] + 1.5)*u); });
    dots.forEach((c, i) => { c.style.opacity = seg(t, 2.9 + i*.12, 3.05 + i*.12); });
  }
  let raf = 0, start = 0;
  function play(){ cancelAnimationFrame(raf); start = performance.now();
    const step = now => { const t = (now - start)/1000; render(Math.min(t, END)); if (t < END) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); }
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.__balde = render; // para grabar/probar cuadros
  render(0);
  box.addEventListener('click', play);
  box.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); play(); } });
  if (reduce || !('IntersectionObserver' in window)){ render(END); return; }
  new IntersectionObserver((es, io) => { if (es[0].isIntersecting){ io.disconnect(); setTimeout(play, 350); } }, { threshold:.5 }).observe(box);
})();

/* mockup de la campera: se reproduce solo cuando se ve */
(function(){
  const v = document.querySelector('.p3-mock video');
  if (!v || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  new IntersectionObserver(es => es[0].isIntersecting ? v.play().catch(() => {}) : v.pause(), { threshold:.35 }).observe(v);
})();
