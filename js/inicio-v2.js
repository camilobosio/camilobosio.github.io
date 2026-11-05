// INICIO v2: bolas de pintura tipo lámpara de lava (WebGL, metaballs) en la portada negra,
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

  const small = innerWidth <= 760, NB = small ? 5 : 7, MAXB = 8;
  // paleta de pintura de la página: naranja del logo, rosa, azul, amarillo, violeta, coral
  const COLS = [[1,.54,.23],[1,.37,.64],[.17,.31,.85],[1,.79,.24],[.55,.35,1],[1,.48,.24],[.95,.3,.42]];
  const VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
  const FS = [
'#extension GL_OES_standard_derivatives : enable',
'precision highp float;',
'uniform vec2 uRes; uniform float uDpr; uniform float uT;',
'uniform vec4 uB[' + MAXB + '];',   // x, y, radio, estiramiento
'uniform vec2 uS[' + MAXB + '];',   // dirección del estiramiento
'uniform vec3 uC[' + MAXB + '];',
'uniform int uN;',
'float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }',
// bola estirada: elipse aproximada, larga en la dirección del movimiento y un poco más angosta de costado
'float sdB(vec2 p, vec4 b, vec2 s){ vec2 q = p - b.xy; float a = dot(q, s); float c = dot(q, vec2(-s.y, s.x));',
'  return length(vec2(a / (1. + b.w), c * (1. + b.w * .45))) - b.z; }',
'float field(vec2 p, out vec3 col){',
'  float d = 1e5; vec3 acc = vec3(0.); float ws = 0.;',
'  for(int i = 0; i < ' + MAXB + '; i++){',
'    if(i >= uN) break;',
'    float di = sdB(p, uB[i], uS[i]);',
'    float h = clamp(.5 + .5 * (di - d) / 70., 0., 1.);',
'    d = mix(di, d, h) - 70. * h * (1. - h);',          // smooth-min: se funden al acercarse
'    float w = exp(-max(di, -40.) / 34.); acc += uC[i] * w; ws += w;',
'  }',
'  col = acc / max(ws, 1e-4); return d; }',
'void main(){',
'  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;',
'  vec3 col; float d = field(p, col);',
'  float px = 1. / uDpr;',
// sombra leve abajo: la misma forma corrida hacia abajo y difuminada
'  vec3 tc; float ds = field(p - vec2(-6., 18.), tc);',
'  float sh = (1. - smoothstep(-24., 30., ds)) * .42;',
// volumen: un domo según cuánto se mete adentro de la pintura
'  float dep = clamp(-d / 60., 0., 1.);',
'  float hg = sqrt(1. - (1. - dep) * (1. - dep));',
'  vec2 g = vec2(dFdx(hg), dFdy(hg)) * uDpr * 30.;',
'  vec3 n = normalize(vec3(-g.x, -g.y, 1.));',
'  vec3 L = normalize(vec3(-.4, .7, .6));',
'  float dif = clamp(dot(n, L), 0., 1.);',
'  float spec = pow(clamp(dot(reflect(-L, n), vec3(0., 0., 1.)), 0., 1.), 22.) * .6;',   // brillo arriba
'  float ao = (1. - dep) * .25;',
'  vec3 c = col * (.6 + .5 * dif) - ao * col + spec * vec3(1., .97, .93);',
'  c += (hash(floor(p * uDpr) + floor(uT * 12.)) - .5) * .06;',   // grano sutil
'  float a = 1. - smoothstep(-px * 1.1, px * 1.1, d);',            // borde nítido y suave, al pixel real
'  gl_FragColor = vec4(c * a, max(a, sh * (1. - a)));',
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
  const uRes = U('uRes'), uDpr = U('uDpr'), uT = U('uT'), uB = U('uB'), uS = U('uS'), uC = U('uC'), uN = U('uN');

  let W = 0, H = 0, dpr = 1;
  function size(){
    const r = st.getBoundingClientRect(); W = r.width; H = r.height; dpr = Math.min(2, devicePixelRatio || 1);   // densidad real, tope 2
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); gl.viewport(0, 0, cv.width, cv.height);
  }
  size();

  // cada bola: va a su lugar con resorte e inercia, sube y baja lento, y se estira según cómo se mueve
  const blobs = [];
  for(let i = 0; i < NB; i++){
    const R = (small ? .2 : .1) * Math.min(W, H * 1.5) * (.8 + Math.random() * .45);
    const hx = ((i + .5) / NB) * W, hy = H * (.25 + Math.random() * .5);
    blobs.push({ x:hx, y:hy, vx:0, vy:0, hx, R, ph:Math.random() * 6.28, sp:.05 + Math.random() * .05, sx:1, sy:0, k:0 });
  }
  const colArr = new Float32Array(MAXB * 3); for(let i = 0; i < NB; i++) colArr.set(COLS[i % COLS.length], i * 3);
  gl.uniform3fv(uC, colArr);
  const bArr = new Float32Array(MAXB * 4), sArr = new Float32Array(MAXB * 2);

  const mouse = { x:-9999, y:-9999, on:false };
  const setM = (cx, cy) => { const r = st.getBoundingClientRect(); mouse.x = cx - r.left; mouse.y = cy - r.top; mouse.on = true; };
  st.addEventListener('pointermove', e => setM(e.clientX, e.clientY));
  st.addEventListener('pointerleave', () => { mouse.on = false; });
  st.addEventListener('touchstart', e => setM(e.touches[0].clientX, e.touches[0].clientY), { passive:true });
  st.addEventListener('touchmove', e => setM(e.touches[0].clientX, e.touches[0].clientY), { passive:true });
  st.addEventListener('touchend', () => { mouse.on = false; }, { passive:true });

  let last = 0;
  function step(t){
    const dt = Math.min(2.5, last ? (t - last) / 16.67 : 1); last = t;
    for(const b of blobs){
      // lugar al que va: sube y baja como en la lámpara, con un vaivén leve de costado
      const tx = b.hx + Math.sin(t * .00021 + b.ph * 1.7) * W * .06;
      const ty = H * (.5 + .34 * Math.sin(t * .001 * b.sp + b.ph));
      let ax = (tx - b.x) * .0009, ay = (ty - b.y) * .0012;   // resorte blando
      let px = 0, py = 0;
      if(mouse.on){   // empuje suave que baja con la distancia (sin rebotes)
        const dx = b.x - mouse.x, dy = b.y - mouse.y, d = Math.hypot(dx, dy) || 1, s = b.R * 1.6;
        const f = Math.exp(-(d * d) / (2 * s * s)) * .55;
        px = dx / d * f; py = dy / d * f; ax += px; ay += py;
      }
      const damp = Math.pow(.95, dt);
      b.vx = (b.vx + ax * dt) * damp; b.vy = (b.vy + ay * dt) * damp;
      b.x += b.vx * dt; b.y += b.vy * dt;
      // se estira hacia donde se mueve o la empujan; un resorte la devuelve redonda
      const vx = b.vx + px * 18, vy = b.vy + py * 18, sp = Math.hypot(vx, vy);
      b.k += (Math.min(.55, sp * .09) - b.k) * .08 * dt;
      if(sp > .02){ b.sx += (vx / sp - b.sx) * .1 * dt; b.sy += (vy / sp - b.sy) * .1 * dt;
        const l = Math.hypot(b.sx, b.sy) || 1; b.sx /= l; b.sy /= l; }
    }
  }
  function draw(t){
    blobs.forEach((b, i) => { bArr.set([b.x, b.y, b.R * (1 - b.k * .18), b.k], i * 4); sArr.set([b.sx, b.sy], i * 2); });
    gl.uniform2f(uRes, cv.width, cv.height); gl.uniform1f(uDpr, dpr); gl.uniform1f(uT, t * .001);
    gl.uniform4fv(uB, bArr); gl.uniform2fv(uS, sArr); gl.uniform1i(uN, NB);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  let vis = true, raf = 0;
  const loop = t => { step(t); draw(t); raf = vis ? requestAnimationFrame(loop) : 0; };
  if(reduce){ draw(0); return; }
  new IntersectionObserver(es => { vis = es[0].isIntersecting; if(vis && !raf){ last = 0; raf = requestAnimationFrame(loop); } }).observe(st);
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { size(); if(!raf) draw(performance.now()); }, 150); });
  cv.addEventListener('webglcontextlost', e => { e.preventDefault(); cancelAnimationFrame(raf); raf = 0; fallback(); });
  raf = requestAnimationFrame(loop);
})();
