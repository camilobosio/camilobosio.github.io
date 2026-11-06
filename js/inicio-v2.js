// INICIO v2: bolas de pintura tipo lámpara de lava (WebGL, metaballs) en la portada negra,
// nombre que se achica y baja al scrollear (portada fija) y barra blanca que aparece al bajar.
(function(){
  const st = document.getElementById('studio'), pin = document.getElementById('stPin'), top = document.getElementById('top');
  if(!st || !pin) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- barra ----------
  const bar = () => { if(!top) return; top.classList.toggle('v2-show', scrollY > 15);
    const pb = pin.getBoundingClientRect().bottom; top.classList.toggle('v2-pill', pb < 70); top.classList.toggle('v2-glass', pb < -260); };   // pasada la portada: cápsula en el medio
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

  // al final del scroll "Studio" va al centro, abajo de BOSIO, un poco encimado; y se pegan como las bolas (filtro "goo")
  const bos = st.querySelector('.st-bosio'), stu = st.querySelector('.st-studio');
  function place(){
    if(!bos || !stu) return;
    const dx = (bos.offsetLeft + bos.offsetWidth / 2) - (stu.offsetLeft + stu.offsetWidth / 2);
    const dy = (bos.offsetTop + bos.offsetHeight * .9 - stu.offsetHeight * .3) - stu.offsetTop;
    st.style.setProperty('--sdx', dx.toFixed(1) + 'px'); st.style.setProperty('--sdy', dy.toFixed(1) + 'px');
  }
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { place(); setTimeout(place, 1500); }); addEventListener('resize', place);
  document.body.insertAdjacentHTML('beforeend', '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="stGoo" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b"/><feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="g"/><feComposite in="SourceGraphic" in2="g" operator="atop"/></filter></svg>');

  // con la lava moviéndose el navegador deja de redibujar "Studio" (texto con máscara SVG):
  // cuando termina de escribirse se le saca la máscara (queda igual, pero ya no depende de ella)
  const stx = st.querySelector('.st-draw text');
  if(stx) (window.__studioDone || Promise.resolve()).then(() => setTimeout(() => stx.removeAttribute('mask'), 300));

  // ---------- lámpara de lava: WebGL + fragment shader de metaballs (smooth-min) ----------
  const cv = document.createElement('canvas'); cv.className = 'st-lava'; cv.setAttribute('aria-hidden', 'true');
  st.insertBefore(cv, st.firstChild);
  const fallback = () => { cv.remove(); st.classList.add('lava-static'); };   // sin WebGL: fondo quieto (css)
  const gl = cv.getContext('webgl', { premultipliedAlpha:true, antialias:false, alpha:true });
  if(!gl || !gl.getExtension('OES_standard_derivatives')) return fallback();

  const small = innerWidth <= 760, NB = small ? 6 : 8, MAXB = 8;
  // paleta de pintura de la página: naranja del logo, rosa, azul, amarillo, violeta, coral
  const ORANGE = [1,.5,.13], BLUE = [.2,.36,.95];   // solo los colores del logo
  const VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
  const FS = [
'#extension GL_OES_standard_derivatives : enable',
'precision highp float;',
'uniform vec2 uRes; uniform float uDpr; uniform float uT;',
'uniform vec4 uB[' + MAXB + '];',   // x, y, radio, (sin uso)
'uniform vec3 uC[' + MAXB + '];',
'uniform vec3 uM;',                 // mouse: x, y, radio del hundido (0 = afuera)
'uniform int uN; uniform float uHs;',
'float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }',
'float smin(float a, float b, float k){ float h = clamp(.5 + .5 * (b - a) / k, 0., 1.); return mix(b, a, h) - k * h * (1. - h); }',
'float smax(float a, float b, float k){ return -smin(-a, -b, k); }',
// distancia a la pintura: bolas redondas que se funden (smooth-min) y el mouse que la hunde (resta suave)
'float dist(vec2 p){',
'  float d = 1e5;',
'  for(int i = 0; i < ' + MAXB + '; i++){ if(i >= uN) break; d = smin(d, length(p - uB[i].xy) - uB[i].z, 34.); }',
'  if(uM.z > .5) d = smax(d, -(length(p - uM.xy) - uM.z), 40.);',
'  return d; }',
'vec4 tint(vec2 p){',
'  vec3 acc = vec3(0.); float ws = 0.; float rs = 0.;',
'  for(int i = 0; i < ' + MAXB + '; i++){ if(i >= uN) break; float di = length(p - uB[i].xy) - uB[i].z;',
'    float w = exp(-max(di, -60.) / 14.); acc += uC[i] * w; rs += uB[i].z * w; ws += w; }',
'  return vec4(acc / max(ws, 1e-4), rs / max(ws, 1e-4)); }',
// altura de la pintura: un domo que sube rápido desde el borde
'float hgt(float d, float R){ float u = clamp(-d, 0., R); return sqrt(max(0., u * (2. * R - u))); }',
'void main(){',
'  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;',
'  float d = dist(p);',
'  float px = 1. / uDpr;',
'  float sd = dist(p - vec2(-8., 22.));',
'  float sh = (1. - smoothstep(-30., 40., sd)) * .5;',                      // sombra blanda abajo
'  if(d > 2.){ gl_FragColor = vec4(0., 0., 0., sh); return; }',
'  vec4 tr = tint(p); vec3 col = tr.rgb; float R = max(tr.a, -d + 1.);',
// normal real de la superficie (diferencias finitas, sin escalones)
'  float e = 1.5;',
'  float hx = hgt(dist(p + vec2(e, 0.)), R) - hgt(dist(p - vec2(e, 0.)), R);',
'  float hy = hgt(dist(p + vec2(0., e)), R) - hgt(dist(p - vec2(0., e)), R);',
'  vec3 n = normalize(vec3(-hx / (2. * e), -hy / (2. * e), 1.));',
'  vec3 V = vec3(0., 0., 1.);',
'  vec3 L = normalize(vec3(-.45, -.75, .55));',                              // luz arriba a la izquierda (y hacia abajo en pantalla)
'  float dif = clamp(dot(n, L), 0., 1.);',
'  vec3 H = normalize(L + V);',
'  float nh = clamp(dot(n, H), 0., 1.);',
'  float spec = pow(nh, 90.) * 1.1 + pow(nh, 14.) * .22;',                  // brillo nítido + brillo suave
'  float fres = pow(1. - clamp(n.z, 0., 1.), 3.);',
'  float dep = clamp(-d / R, 0., 1.);',
'  vec3 base = col * (.5 + .62 * dif);',
'  base += col * col * .35 * (1. - dep);',                                    // color más saturado en los bordes (pintura espesa)
'  base = mix(base, base * .55, fres * .6);',                                 // borde oscurecido = volumen
'  vec3 env = mix(vec3(.08, .07, .1), vec3(1., .95, .9), clamp(-n.y * .5 + .5, 0., 1.));',
'  base += env * fres * .28;',                                                // reflejo del ambiente en el borde
'  base += vec3(1., .97, .92) * spec;',
'  float gr = hash(floor(p * uDpr) + floor(uT * 10.)) - .5;',
'  base += gr * .045;',                                                       // grano sutil
'  float a = 1. - smoothstep(-px, px, d);',                                   // borde nítido al pixel real
'  gl_FragColor = vec4(base * a, a + sh * (1. - a));',
'}'].join('\n');
  function mk(t, src){ const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s);
    if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)){ console.warn(gl.getShaderInfoLog(s)); return null; } return s; }
  const vs = mk(gl.VERTEX_SHADER, VS), fs = mk(gl.FRAGMENT_SHADER, FS);
  if(!vs || !fs) return fallback();
  const pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
  if(!gl.getProgramParameter(pr, gl.LINK_STATUS)) return fallback();
  gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  const aLoc = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(aLoc); gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(pr, n);
  const uRes = U('uRes'), uDpr = U('uDpr'), uT = U('uT'), uB = U('uB'), uM = U('uM'), uC = U('uC'), uN = U('uN'), uHs = U('uHs');

  let W = 0, H = 0, dpr = 1, q = 1; const MAXPX = 1.1e6;
  function size(){
    const r = st.getBoundingClientRect(); W = r.width; H = r.height; dpr = Math.min(2, devicePixelRatio || 1, Math.sqrt(MAXPX / Math.max(1, W * H))) * q;   // densidad real, con tope de pixeles (placas de video justas) y calidad que baja sola si se traba
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); gl.viewport(0, 0, cv.width, cv.height);
  }
  size();

  // cada bola: va a su lugar con resorte e inercia, sube y baja lento, y se estira según cómo se mueve
  const blobs = [];
  // una bola NARANJA bien grande (la protagonista) y varias chicas, azules y naranjas, que se juntan y se pegan
  const m = Math.min(W, H * 1.4);
  blobs.push({ x:W * (small ? .5 : .66), y:H * .55, vx:0, vy:0, hx:W * (small ? .5 : .66), R:m * (small ? .2 : .15), ph:1, sp:.03, amp:.3, big:true, c:ORANGE });
  for(let i = 1; i < NB; i++){
    const R = m * (small ? .15 : .1) * (i === NB - 1 ? .55 : .8 + Math.random() * .35);   // la última, más chiquita
    const hx = ((i - .5) / (NB - 1)) * W;
    blobs.push({ x:hx, y:H * (.2 + Math.random() * .6), vx:0, vy:0, hx, R, ph:Math.random() * 6.28, sp:.03 + Math.random() * .035, amp:.34, c:i % 2 === 0 ? ORANGE : BLUE });
  }
  const colArr = new Float32Array(MAXB * 3); blobs.forEach((b, i) => colArr.set(b.c, i * 3));
  gl.uniform3fv(uC, colArr);
  const hs = blobs.reduce((a, b) => a + b.R, 0) / NB;   // altura del domo = radio promedio (sin aro adentro)
  const bArr = new Float32Array(MAXB * 4); let mr = 0;   // radio del hundido del mouse (aparece y se va suave)

  const mouse = { x:-9999, y:-9999, on:false, px:0, py:0, spd:0 }, dent = { x:-9999, y:-9999 };
  const setM = (cx, cy) => { const r = st.getBoundingClientRect(); mouse.x = cx - r.left; mouse.y = cy - r.top; mouse.on = true; };
  st.addEventListener('pointermove', e => setM(e.clientX, e.clientY));
  st.addEventListener('pointerleave', () => { mouse.on = false; });
  st.addEventListener('touchstart', e => setM(e.touches[0].clientX, e.touches[0].clientY), { passive:true });
  st.addEventListener('touchmove', e => setM(e.touches[0].clientX, e.touches[0].clientY), { passive:true });
  st.addEventListener('touchend', () => { mouse.on = false; }, { passive:true });

  let last = 0; const nameEl = st.querySelector('.st-name');
  function step(t){
    const dt = Math.min(2.5, last ? (t - last) / 16.67 : 1); last = t;
    // velocidad del mouse (suavizada): rápido = apenas la roza, lento = la empuja
    const mv = Math.hypot(mouse.x - mouse.px, mouse.y - mouse.py) / dt; mouse.px = mouse.x; mouse.py = mouse.y;
    mouse.spd += ((mouse.on ? Math.min(mv, 80) : 0) - mouse.spd) * .25;
    const slow = 1 / (1 + mouse.spd / 5);
    // al bajar, el nombre (que baja y se achica) corre las bolas: siempre queda limpio, sin bolas atrás
    const pv = Math.min(1, scrollY / 120);
    let nr = null; if(pv > 0 && nameEl){ const a = nameEl.getBoundingClientRect(), o = st.getBoundingClientRect(); nr = { l:a.left - o.left, r:a.right - o.left, t:a.top - o.top, b:a.bottom - o.top }; }
    for(const b of blobs){
      if(nr){ const cx = Math.max(nr.l, Math.min(b.x, nr.r)), cy = Math.max(nr.t, Math.min(b.y, nr.b)); let dx = b.x - cx, dy = b.y - cy, d = Math.hypot(dx, dy);
        if(d < 1){ dx = b.x - (nr.l + nr.r) / 2; dy = b.y - (nr.t + nr.b) / 2; d = Math.hypot(dx, dy) || 1; const k = 1.6 * pv * dt; b.vx += dx / d * k; b.vy += dy / d * k; }
        else if(d < b.R + 60){ const k = (b.R + 60 - d) * .05 * pv * dt; b.vx += dx / d * k; b.vy += dy / d * k; } }
      // lugar al que va: sube y baja como en la lámpara, con un vaivén leve de costado
      const tx = b.hx + Math.sin(t * .00021 + b.ph * 1.7) * W * .06;
      const ty = H * (.5 + b.amp * Math.sin(t * .001 * b.sp + b.ph));
      let ax = (tx - b.x) * .00045, ay = (ty - b.y) * .0006;   // resorte muy blando: flotan
      let px = 0, py = 0;
      if(mouse.on){   // el mouse hunde la pintura y la corre despacio (empuje que baja con la distancia, sin rebotes)
        const dx = b.x - mouse.x, dy = b.y - mouse.y, d = Math.hypot(dx, dy) || 1;
        const f = Math.max(0, 1 - (d - b.R) / 140) * (b.big ? .06 : .075);   // como antes, un poco más lento
        ax += dx / d * f; ay += dy / d * f;
        const lim = b.R * .92 + mr;
        if(d < lim){ const k = (lim - d) * .032 * dt; b.vx += dx / d * k; b.vy += dy / d * k; }
      }
      const damp = Math.pow(.96, dt);
      b.vx = (b.vx + ax * dt) * damp; b.vy = (b.vy + ay * dt) * damp;
      b.x += b.vx * dt; b.y += b.vy * dt;
    }
    // se pegan por el borde pero no se meten una adentro de otra (empujón suave entre bolas)
    for(let i = 0; i < blobs.length; i++) for(let j = i + 1; j < blobs.length; j++){
      const A = blobs[i], B = blobs[j], dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy) || 1, lim = (A.R + B.R) * .86;
      if(d < lim){ const k = (lim - d) * .004 * dt, ma = B.R / (A.R + B.R), mb = A.R / (A.R + B.R);
        A.vx -= dx / d * k * ma; A.vy -= dy / d * k * ma; B.vx += dx / d * k * mb; B.vy += dy / d * k * mb; }
    }
    mr += ((mouse.on ? (small ? 52 : 64) : 0) - mr) * .08 * dt;   // hundido chico; rápido = casi nada
    // el hundido nunca entra más que un poquito en la bola (así nunca hace agujero)
    dent.x = mouse.x; dent.y = mouse.y;
    for(const b of blobs){ const dx = dent.x - b.x, dy = dent.y - b.y, d = Math.hypot(dx, dy) || 1, m = b.R * .9 + mr;
      if(d < m){ dent.x = b.x + dx / d * m; dent.y = b.y + dy / d * m; } }
  }
  function draw(t){
    blobs.forEach((b, i) => bArr.set([b.x, b.y, b.R, 0], i * 4));
    gl.uniform2f(uRes, cv.width, cv.height); gl.uniform1f(uDpr, dpr); gl.uniform1f(uT, t * .001);
    gl.uniform3f(uM, dent.x, dent.y, mr);
    gl.uniform4fv(uB, bArr); gl.uniform1i(uN, NB); gl.uniform1f(uHs, hs);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  // antes de mostrar, se acomodan solas un rato (así ninguna arranca metida adentro de otra)
  for(let i = 1; i <= 400; i++) step(performance.now() - (400 - i) * 16.67); last = 0;
  let vis = true, raf = 0;
  // si la compu no llega a dibujar fluido, bajamos la resolución del dibujo (hasta 3 veces)
  let slow = 0, lastF = 0;
  const perf = t => { if(lastF){ const ms = t - lastF; slow = ms > 34 ? slow + 1 : Math.max(0, slow - 1);
      if(slow > 20 && q > .4){ q *= .7; slow = 0; size(); } } lastF = t; };
  const loop = t => { perf(t); step(t); draw(t); raf = vis ? requestAnimationFrame(loop) : 0; };
  if(reduce){ draw(0); return; }
  new IntersectionObserver(es => { vis = es[0].isIntersecting; if(vis && !raf){ last = 0; raf = requestAnimationFrame(loop); } }).observe(st);
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { size(); if(!raf) draw(performance.now()); }, 150); });
  cv.addEventListener('webglcontextlost', e => { e.preventDefault(); cancelAnimationFrame(raf); raf = 0; fallback(); });
  raf = requestAnimationFrame(loop);
})();
