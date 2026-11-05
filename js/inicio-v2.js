// INICIO v2: bolas de pintura tipo lámpara de lava (metaballs) en la portada negra,
// nombre que se achica y baja al scrollear (portada fija) y barra blanca que aparece al bajar.
(function(){
  const st = document.getElementById('studio'), pin = document.getElementById('stPin'), top = document.getElementById('top');
  if(!st || !pin) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- barra ----------
  const bar = () => top && top.classList.toggle('v2-show', scrollY > 60);
  bar(); addEventListener('scroll', bar, { passive:true });

  // ---------- nombre que baja ----------
  setTimeout(() => st.classList.add('intro-done'), reduce ? 0 : 1900);
  let pv = -1; const hl = document.querySelector('.hero-logo');
  function prog(){
    if(reduce) return;
    const run = pin.offsetHeight - st.offsetHeight, p = run > 0 ? Math.min(1, Math.max(0, -pin.getBoundingClientRect().top / run)) : 0;
    if(Math.abs(p - pv) > .001){ pv = p; st.style.setProperty('--p', p.toFixed(4)); }
    if(hl) hl.classList.toggle('wait', pin.getBoundingClientRect().bottom > st.offsetHeight + 2);
  }
  prog(); addEventListener('scroll', prog, { passive:true }); addEventListener('resize', prog);

  // ---------- lámpara de lava ----------
  const cv = document.createElement('canvas'); cv.className = 'st-lava'; cv.setAttribute('aria-hidden', 'true');
  st.insertBefore(cv, st.firstChild);
  const ctx = cv.getContext('2d'), small = innerWidth <= 760;
  const SC = small ? 4 : 5;                                   // 1 pixel calculado = SC pixeles en pantalla (se ve blando)
  const COLS = [[255,138,58],[255,95,162],[43,80,216],[255,201,60],[255,122,61],[140,90,255]];
  const NB = small ? 4 : 7;
  let W = 0, H = 0, w = 0, h = 0, img, grain;
  const blobs = [];
  function size(){
    const r = st.getBoundingClientRect(); W = r.width; H = r.height;
    w = Math.ceil(W / SC); h = Math.ceil(H / SC); cv.width = w; cv.height = h; img = ctx.createImageData(w, h);
    grain = new Float32Array(w * h); for(let i = 0; i < grain.length; i++) grain[i] = (Math.random() - .5) * 26;   // textura de pintura
  }
  size();
  // cada bola son 3 gotas unidas con resortes: el dedo/mouse empuja la más cercana y la bola se estira como líquido
  for(let i = 0; i < NB; i++){
    const R = (small ? .085 : .062) * Math.min(W, H * 1.4) * (.75 + Math.random() * .5);
    const x = (i + .5) / NB * W + (Math.random() - .5) * 60, y = H * (.2 + Math.random() * .6);
    const nodes = [0, 1, 2].map(k => ({ x:x + (k - 1) * R * .35, y:y + (Math.random() - .5) * R * .3, vx:0, vy:0, r:R * (k === 1 ? 1 : .68) }));
    blobs.push({ nodes, c:COLS[i % COLS.length], ph:Math.random() * 6.28, sp:.18 + Math.random() * .18, R });
  }
  const mouse = { x:-9999, y:-9999, on:false };
  const setM = (cx, cy) => { const r = st.getBoundingClientRect(); mouse.x = cx - r.left; mouse.y = cy - r.top; mouse.on = true; };
  st.addEventListener('pointermove', e => setM(e.clientX, e.clientY));
  st.addEventListener('pointerleave', () => { mouse.on = false; });
  st.addEventListener('touchstart', e => setM(e.touches[0].clientX, e.touches[0].clientY), { passive:true });
  st.addEventListener('touchmove', e => setM(e.touches[0].clientX, e.touches[0].clientY), { passive:true });
  st.addEventListener('touchend', () => { mouse.on = false; }, { passive:true });

  function step(t){
    for(const b of blobs){
      const n = b.nodes, cx = (n[0].x + n[1].x + n[2].x) / 3;
      // sube y baja lento, como la lámpara: cada bola tiene su ciclo
      const ty = H * (.5 + .36 * Math.sin(t * b.sp * .001 + b.ph)), tx = cx + Math.sin(t * .0003 + b.ph * 2) * .3;
      for(let k = 0; k < 3; k++){
        const p = n[k];
        p.vy += (ty + (k - 1) * b.R * .15 - p.y) * .00012 * 60 / 60;
        p.vx += (tx + (k - 1) * b.R * .38 - p.x) * .00005;
        // resortes con el centro (forma de la bola)
        if(k !== 1){ const c = n[1], dx = c.x - p.x, dy = c.y - p.y, d = Math.hypot(dx, dy) || 1, rest = b.R * .38, f = (d - rest) * .004;
          p.vx += dx / d * f; p.vy += dy / d * f; c.vx -= dx / d * f * .5; c.vy -= dy / d * f * .5; }
        // el mouse / dedo empuja suave (se estira, no rebota)
        if(mouse.on){ const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy), rr = p.r * 1.6 + 60;
          if(d < rr && d > 0){ const f = (1 - d / rr) * .9; p.vx += dx / d * f; p.vy += dy / d * f; } }
        // bordes blandos
        if(p.x < 0) p.vx += .05; if(p.x > W) p.vx -= .05; if(p.y < -p.r * .3) p.vy += .05; if(p.y > H + p.r * .3) p.vy -= .05;
        p.vx *= .955; p.vy *= .955; p.x += p.vx; p.y += p.vy;
      }
    }
  }
  function draw(){
    const d = img.data, list = [];
    for(const b of blobs) for(const p of b.nodes) list.push(p.x / SC, p.y / SC, (p.r / SC) ** 2, b.c);
    const L = list.length;
    for(let y = 0, i = 0, g = 0; y < h; y++){
      for(let x = 0; x < w; x++, i += 4, g++){
        let f = 0, r = 0, gg = 0, bb = 0;
        for(let k = 0; k < L; k += 4){
          const dx = x - list[k], dy = y - list[k + 1], v = list[k + 2] / (dx * dx + dy * dy + 1);
          f += v; const c = list[k + 3]; r += c[0] * v; gg += c[1] * v; bb += c[2] * v;
        }
        if(f < 1){ d[i + 3] = 0; continue; }
        const a = Math.min(1, (f - 1) / .12);                     // borde blando
        const sh = .9 + Math.min(.28, (f - 1) * .09) + grain[g] / 255; // más claro adentro, con grano
        d[i] = r / f * sh; d[i + 1] = gg / f * sh; d[i + 2] = bb / f * sh; d[i + 3] = a * 235;
      }
    }
    ctx.putImageData(img, 0, 0);
  }
  // con la lava moviéndose el navegador deja de redibujar "Studio" (texto con máscara SVG):
  // cuando termina de escribirse se le saca la máscara (queda igual, pero ya no depende de ella)
  const stx = st.querySelector('.st-draw text');
  if(stx) (window.__studioDone || Promise.resolve()).then(() => setTimeout(() => stx.removeAttribute('mask'), 300));
  let vis = true, raf = 0;
  const loop = t => { step(t); draw(); raf = vis ? requestAnimationFrame(loop) : 0; };
  if(reduce){ draw(); return; }
  new IntersectionObserver(es => { vis = es[0].isIntersecting; if(vis && !raf) raf = requestAnimationFrame(loop); }).observe(st);
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(size, 150); });
  raf = requestAnimationFrame(loop);
})();
