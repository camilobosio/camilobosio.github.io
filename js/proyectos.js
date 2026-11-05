// ETAPA 2 del inicio: "Lo que tengo en producción" (sección fija con zoom en 2 pasos y proyectos uno por uno)
// y "Webs que hice" (lista con la captura que sigue al mouse).
// PARA SUMAR: agregar un objeto a PROYECTOS o a WEBS. Nada más.
(function(){
  const PROYECTOS = [
    { estado:'En producción', nombre:'M Perfumerie', desc:'Tienda online de perfumes árabes: catálogo, carrito que manda el pedido por WhatsApp y panel propio para cargar productos.',
      datos:[['Rubro','Perfumería'], ['Tipo','Tienda online'], ['Estado','En uso']],
      media:'portfolio/interacciones/portada-pc.mp4', poster:'portfolio/interacciones/portada-pc.jpg',
      web:'https://mperfumerie.com.ar', caso:'portfolio.html#web' },
    { estado:'En desarrollo', nombre:'Overesthetic', desc:'Página interactiva con intro animada, títulos con brillo y reflejos que reaccionan al bajar.',
      datos:[['Tipo','Página interactiva'], ['Animaciones','Intro + scroll'], ['Estado','Próximamente online']],
      media:'portfolio/overesthetic/portada-pc.mp4', poster:'portfolio/overesthetic/portada-pc.jpg',
      web:'', caso:'portfolio.html#web' },
    { estado:'Contenido con IA', nombre:'Videos con IA', desc:'Escenas con personas reales hechas con IA a partir de un par de fotos, con la voz real de la persona.',
      datos:[['Tipo','Video con IA'], ['Base','2 fotos'], ['Estado','Terminado']],
      media:'portfolio/videos-ia/tesla-volador.mp4', poster:'portfolio/videos-ia/tesla-volador.jpg',
      web:'', caso:'portfolio.html#ia' },
  ];
  const WEBS = [
    { nombre:'M Perfumerie', rubro:'Perfumería · Tienda online', url:'https://mperfumerie.com.ar', img:'portfolio/interacciones/portada-pc.jpg' },
    { nombre:'Overesthetic', rubro:'Página interactiva', url:'', img:'portfolio/overesthetic/portada-pc.jpg' },
  ];

  const pj = document.getElementById('proyectos'), wb = document.getElementById('webs');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const n2 = i => String(i + 1).padStart(2, '0');

  // ---------- proyectos ----------
  if(pj){
    pj.innerHTML = `
      <div class="pj-pin">
        <header class="pj-intro wrap">
          <h2>Lo que tengo en <span class="mk">producción</span></h2>
          <p class="pj-hint">Bajá para recorrerlos <span aria-hidden="true">↓</span></p>
          <div class="pj-dots" aria-hidden="true">${PROYECTOS.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>
        </header>
        <div class="pj-body wrap">
          <div class="pj-info">
            ${PROYECTOS.map((p, i) => `
            <article class="pj-item${i ? '' : ' on'}">
              <div class="pj-media-m"><video src="${p.media}" poster="${p.poster}" muted loop playsinline preload="metadata" aria-hidden="true"></video></div>
              <span class="pj-num">${n2(i)} — ${p.estado}</span>
              <h3>${p.nombre}</h3>
              <p>${p.desc}</p>
              <dl>${p.datos.map(d => `<div><dt>${d[0]}</dt><dd>${d[1]}</dd></div>`).join('')}</dl>
              <div class="pj-btns">
                ${p.web ? `<a class="btn btn-dark" href="${p.web}" target="_blank" rel="noopener">Ver web ↗</a>` : ''}
                <a class="btn btn-line" href="${p.caso}">Ver el caso →</a>
              </div>
            </article>`).join('')}
          </div>
          <div class="pj-stage" aria-hidden="true">
            <div class="pj-frame">${PROYECTOS.map((p, i) => `<video class="${i ? '' : 'on'}" src="${p.media}" poster="${p.poster}" muted loop playsinline preload="metadata"></video>`).join('')}</div>
          </div>
        </div>
        <div class="pj-bars" aria-hidden="true"><i><b></b></i><i><b></b></i><i><b></b></i></div>
      </div>`;

    const desk = matchMedia('(min-width:761px)').matches && !reduce && window.gsap && window.ScrollTrigger;
    const items = [...pj.querySelectorAll('.pj-item')], vids = [...pj.querySelectorAll('.pj-frame video')];
    let cur = -1;
    function show(i){
      if(i === cur) return; cur = i;
      items.forEach((el, k) => el.classList.toggle('on', k === i));
      vids.forEach((v, k) => { v.classList.toggle('on', k === i); if(k === i) v.play().catch(() => {}); else v.pause(); });
    }

    if(desk){
      pj.classList.add('pj-desk');
      gsap.registerPlugin(ScrollTrigger);
      const frame = pj.querySelector('.pj-frame'), intro = pj.querySelector('.pj-intro'), info = pj.querySelector('.pj-info');
      const bars = [...pj.querySelectorAll('.pj-bars b')];
      gsap.set(frame, { scale:.42, xPercent:-20, yPercent:12 });
      gsap.set(info, { autoAlpha:0, x:-30 });
      const N = PROYECTOS.length, tl = gsap.timeline({ defaults:{ ease:'none' },
        scrollTrigger:{ trigger:pj, start:'top top', end:() => '+=' + innerHeight * (2 + N) * .9, pin:pj.querySelector('.pj-pin'), scrub:.8,
          onUpdate:st => { const t = st.progress * (2 + N); show(Math.max(0, Math.min(N - 1, Math.floor(t - 2 + .5)))); } } });
      // paso 1: se agranda una vez
      tl.to(frame, { scale:.7, xPercent:-8, yPercent:5, duration:1 }, 0).to(bars[0], { scaleY:1, duration:1 }, 0);
      // paso 2: se agranda otra vez; se va el título y entra el texto del primer proyecto
      tl.to(frame, { scale:1, xPercent:0, yPercent:0, duration:1 }, 1).to(bars[1], { scaleY:1, duration:1 }, 1)
        .to(intro, { autoAlpha:0, y:-40, duration:.6 }, 1.2).to(info, { autoAlpha:1, x:0, duration:.6 }, 1.5);
      // después: pasan los proyectos (la 3ª rayita se llena mientras tanto)
      tl.to(bars[2], { scaleY:1, duration:N }, 2);
      show(0);
    } else {
      // celular / movimiento reducido: apilados (imagen arriba, texto abajo) y aparecen al bajar
      pj.classList.add('pj-stack');
      const dots = [...pj.querySelectorAll('.pj-dots i')];
      const mv = [...pj.querySelectorAll('.pj-media-m video')];
      items.forEach(el => el.classList.add('on'));
      let act = -1;
      function check(){
        const h = innerHeight; let best = -1, bd = 1e9;
        items.forEach((el, i) => { const r = el.getBoundingClientRect(), vis = r.top < h * .88 && r.bottom > h * .1;
          if(vis) el.classList.add('in');
          if(vis){ const d = Math.abs(r.top + r.height / 2 - h / 2); if(d < bd){ bd = d; best = i; } }
          if(!vis && !mv[i].paused) mv[i].pause(); });
        if(best !== act){ act = best; dots.forEach((d, k) => d.classList.toggle('on', k === Math.max(0, best)));
          mv.forEach((v, k) => { if(k === best && !reduce) v.play().catch(() => {}); else v.pause(); }); }
      }
      check(); addEventListener('scroll', check, { passive:true }); addEventListener('resize', check);
    }
  }

  // ---------- webs que hice ----------
  if(wb){
    wb.innerHTML = `
      <div class="wrap">
        <h2 class="wb-h">Webs que <span class="mk">hice</span></h2>
        <ol class="wb-list">
          ${WEBS.map((w, i) => `
          <li class="wb-row" data-img="${w.img}">
            <span class="wb-n">${n2(i)}</span>
            <span class="wb-name">${w.nombre}</span>
            <span class="wb-rubro">${w.rubro}</span>
            ${w.url ? `<a class="wb-go" href="${w.url}" target="_blank" rel="noopener">Ver la web ↗</a>` : `<span class="wb-go off">Próximamente</span>`}
            <img class="wb-thumb" src="${w.img}" alt="" loading="lazy">
          </li>`).join('')}
        </ol>
      </div>
      <div class="wb-float" aria-hidden="true"><img alt=""></div>`;
    const fl = wb.querySelector('.wb-float'), fi = fl.querySelector('img'), list = wb.querySelector('.wb-list');
    if(matchMedia('(hover:hover) and (min-width:761px)').matches){
      let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
      const tick = () => { x += (tx - x) * (reduce ? 1 : .14); y += (ty - y) * (reduce ? 1 : .14);
        fl.style.transform = `translate(${x}px, ${y}px)`; raf = Math.abs(tx - x) + Math.abs(ty - y) > .5 ? requestAnimationFrame(tick) : 0; };
      list.addEventListener('pointermove', e => { tx = e.clientX + 24; ty = e.clientY - 90; if(!raf) raf = requestAnimationFrame(tick); });
      list.querySelectorAll('.wb-row').forEach(r => {
        r.addEventListener('pointerenter', e => { fi.src = r.dataset.img; if(!fl.classList.contains('on')){ x = tx = e.clientX + 24; y = ty = e.clientY - 90; } fl.classList.add('on'); });
      });
      list.addEventListener('pointerleave', () => fl.classList.remove('on'));
    }
  }
})();
