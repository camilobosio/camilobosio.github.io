// INICIO: "Lo que tengo en producción." (como meglioalan.com: fijo al bajar, el fondo cambia de color con cada proyecto,
// texto grande a la izquierda y a la derecha una columna de capturas que se agranda y va subiendo)
// y "Portfolio." (grilla con algunas piezas + "Ver todo el portfolio").
// PARA SUMAR: agregar un objeto a PROYECTOS o a PORTFOLIO. Nada más.
(function(){
  const PROYECTOS = [
    { estado:'En producción', nombre:'M Perfumerie', bg:'#d4561f', claro:false,
      desc:'Tienda online de perfumes árabes: catálogo, carrito que manda el pedido por WhatsApp y panel propio para cargar productos.',
      datos:[['Rubro','Perfumería'], ['Tipo','Tienda online'], ['Estado','En uso']],
      media:'portfolio/interacciones/portada-pc.mp4', poster:'portfolio/interacciones/portada-pc.jpg',
      links:[['Ver mperfumerie.com.ar ↗','https://mperfumerie.com.ar', true], ['Ver el caso →','portfolio.html#web']] },
    { estado:'En desarrollo', nombre:'Overesthetic', bg:'#4a74f0', claro:false,
      desc:'Página interactiva con intro animada, títulos con brillo y reflejos que reaccionan al bajar.',
      datos:[['Tipo','Página interactiva'], ['Animaciones','Intro + scroll'], ['Estado','Próximamente online']],
      media:'portfolio/overesthetic/portada-pc.mp4', poster:'portfolio/overesthetic/portada-pc.jpg',
      links:[['Ver el caso →','portfolio.html#web']] },
    { estado:'Contenido con IA', nombre:'Videos con IA', bg:'#f1efe9', claro:true,
      desc:'Escenas con personas reales hechas con IA a partir de un par de fotos, con la voz real de la persona.',
      datos:[['Tipo','Video con IA'], ['Base','2 fotos'], ['Estado','Terminado']],
      media:'portfolio/videos-ia/tesla-volador.mp4', poster:'portfolio/videos-ia/tesla-volador.jpg',
      links:[['Ver el caso →','portfolio.html#ia']] },
    { estado:'Campaña con IA', nombre:'Campañas publicitarias', bg:'#0a0a0b', claro:false,
      desc:'Campaña de Halloween para M Perfumerie: un personaje y una escena para cada perfume, con su frase. Todo hecho con IA.',
      datos:[['Marca','M Perfumerie'], ['Piezas','19 historias'], ['Estado','Publicada']],
      media:'', poster:'portfolio/campanas/halloween/portada-calabaza.webp?v=2',
      collage:['linterdit-elixir', 'portada-calabaza', 'spicebomb-infrared'].map(n => `portfolio/campanas/halloween/${n}.webp?v=2`),
      links:[['Ver la campaña →','portfolio.html#ia']] },
  ];
  const PORTFOLIO = [
    { nombre:'M Perfumerie', rubro:'Página web · Tienda online', img:'portfolio/interacciones/portada-pc.jpg', url:'https://mperfumerie.com.ar', link:'mperfumerie.com.ar ↗', ext:true },
    { nombre:'Overesthetic', rubro:'Página web · Interactiva', img:'portfolio/overesthetic/portada-pc.jpg', url:'portfolio.html#web', link:'Ver el caso →' },
    { nombre:'Publicidades con IA', rubro:'Contenido con IA · Perfumes', img:'portfolio/perfumes/perfumes-cintas-horizontal.webp', url:'portfolio.html#ia', link:'Ver las piezas →' },
    { nombre:'Videos con personas', rubro:'Contenido con IA · Video', img:'portfolio/videos-ia/lentes-inicio.jpg', url:'portfolio.html#ia', link:'Ver los videos →' },
    { nombre:'Producto 360', rubro:'Contenido interactivo', img:'portfolio/ropa/campera-360/poster.webp', url:'portfolio.html#producto-360', link:'Probarlo →' },
    { nombre:'Oficina virtual', rubro:'Para empresas · Prototipo', img:'portfolio/prototipos/oficina.webp', url:'portfolio.html#oficina', link:'Ver el prototipo →' },
  ];

  const pj = document.getElementById('proyectos'), wb = document.getElementById('webs');   // el Portfolio del inicio volvió a las 4 tarjetas fijas del HTML (#trabajo)
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const n2 = i => String(i + 1).padStart(2, '0');
  const media = p => p.collage
    ? `<div class="pj-collage">${p.collage.map(src => `<img src="${src}" alt="">`).join('')}</div>`
    : p.media
    ? `<video src="${p.media}" poster="${p.poster}" muted loop playsinline preload="metadata" aria-hidden="true"></video>`
    : `<img src="${p.poster}" alt="">`;

  // ---------- lo que tengo en producción ----------
  if(pj){
    pj.innerHTML = `
      <div class="pj-pin">
        <div class="pj-left wrap">
          <header class="pj-intro">
            <span class="pj-label">Proyectos</span>
            <h2>Lo que tengo<br>en <em>producción</em>.</h2>
            <p class="pj-hint">Bajá para recorrerlos <span aria-hidden="true">↓</span></p>
          </header>
          ${PROYECTOS.map((p, i) => `
          <article class="pj-item" data-i="${i}" style="--bg:${p.bg}">
            <div class="pj-media-m">${media(p)}</div>
            <span class="pj-num"><i></i>${n2(i)} — ${p.estado}</span>
            <h3>${p.nombre}</h3>
            <p>${p.desc}</p>
            <dl>${p.datos.map(d => `<div><dt>${d[0]}</dt><dd>${d[1]}</dd></div>`).join('')}</dl>
            <div class="pj-links">${p.links.map(l => `<a href="${l[1]}"${l[2] ? ' target="_blank" rel="noopener"' : ''}>${l[0]}</a>`).join('')}</div>
          </article>`).join('')}
        </div>
        <div class="pj-right" aria-hidden="true"><div class="pj-col">${PROYECTOS.map(p => `<div class="pj-card">${media(p)}</div>`).join('')}</div></div>
        <div class="pj-bars" aria-hidden="true">${PROYECTOS.map(() => '<i></i>').join('')}</div>
      </div>`;

    const items = [...pj.querySelectorAll('.pj-item')], N = PROYECTOS.length;
    const vids = [...pj.querySelectorAll('.pj-card video')], mvids = [...pj.querySelectorAll('.pj-media-m video')];
    const desk = matchMedia('(min-width:861px)').matches && !reduce && window.gsap && window.ScrollTrigger;

    if(desk){
      pj.classList.add('pj-desk');
      gsap.registerPlugin(ScrollTrigger);
      const pin = pj.querySelector('.pj-pin'), col = pj.querySelector('.pj-col'), cards = [...pj.querySelectorAll('.pj-card')];
      const intro = pj.querySelector('.pj-intro'), bars = [...pj.querySelectorAll('.pj-bars i')];
      const cvid = cards.map(c => c.querySelector('video'));
      let cur = -2;
      const show = i => { if(i === cur) return; cur = i;
        items.forEach((el, k) => el.classList.toggle('on', k === i));
        intro.classList.toggle('off', i >= 0);
        bars.forEach((b, k) => b.classList.toggle('on', k === Math.max(0, i)));
        pin.classList.toggle('claro', i >= 0 && PROYECTOS[i].claro);
        cards.forEach((c, k) => c.classList.toggle('on', k === i));
        cvid.forEach((v, k) => { if(!v) return; if(k === Math.max(0, i)) v.play().catch(() => {}); else v.pause(); }); };
      // dónde tiene que quedar la columna para centrar la tarjeta i
      const yFor = i => { const c = cards[i], h = pin.clientHeight; return -(c.offsetTop + c.offsetHeight / 2 - h / 2); };
      const tl = gsap.timeline({ defaults:{ ease:'none' }, scrollTrigger:{
        trigger:pj, start:'top top', end:() => '+=' + innerHeight * (N + 1) * .85, pin, scrub:.7, invalidateOnRefresh:true,
        onUpdate:st => { const t = st.progress * tl.duration(); show(t < .8 ? -1 : Math.min(N - 1, Math.floor(t + .5) - 1)); } } });
      // intro: fondo negro y la columna chica que se agranda; de negro va pasando al color del primer proyecto
      tl.fromTo(col, { scale:.9, y:() => yFor(0) + innerHeight * .03 }, { scale:1, y:() => yFor(0), duration:1 }, 0)
        .fromTo(pin, { backgroundColor:'#0a0a0b' }, { backgroundColor:PROYECTOS[0].bg, duration:.9 }, .1);
      // cada proyecto: la columna sube a su captura y el fondo cambia a su color
      for(let i = 1; i < N; i++){
        tl.to(col, { y:() => yFor(i), duration:1 }, i)
          .to(pin, { backgroundColor:PROYECTOS[i].bg, duration:.6 }, i + .2);
      }
      tl.to({}, { duration:.6 });
      show(-1);
      // el nombre del proyecto va lo más grande posible pero sin pasarse de su columna
      const fit = () => items.forEach(el => { const h = el.querySelector('h3'); h.style.removeProperty('--fs');
        const max = parseFloat(getComputedStyle(h).fontSize), w = el.clientWidth;
        if(h.scrollWidth > w) h.style.setProperty('--fs', Math.floor(max * w / h.scrollWidth * .98) + 'px'); });
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(fit); addEventListener('resize', fit);
    } else {
      // celular / movimiento reducido: un bloque por proyecto con su color, imagen arriba y texto abajo, aparecen al bajar
      pj.classList.add('pj-stack');
      const check = () => { const h = innerHeight;
        items.forEach((el, i) => { const r = el.getBoundingClientRect(), vis = r.top < h * .88 && r.bottom > h * .1;
          if(vis) el.classList.add('in');
          const v = el.querySelector('.pj-media-m video'); if(v){ if(vis && !reduce) v.play().catch(() => {}); else v.pause(); } }); };
      check(); addEventListener('scroll', check, { passive:true }); addEventListener('resize', check);
    }
  }

  // ---------- portfolio (algunas piezas + ver todo) ----------
  if(wb){
    wb.innerHTML = `
      <div class="wrap">
        <span class="pj-label">Portfolio</span>
        <h2 class="wb-h">Algunos <em>trabajos</em>.</h2>
        <div class="wb-grid">
          ${PORTFOLIO.map((w, i) => `
          <a class="wb-card" href="${w.url}"${w.ext ? ' target="_blank" rel="noopener"' : ''}>
            <span class="wb-img"><img src="${w.img}" alt="" loading="lazy"></span>
            <span class="wb-meta"><span class="wb-n">${n2(i)}</span><b>${w.nombre}</b></span>
            <span class="wb-rubro">${w.rubro}</span>
            <span class="wb-go">${w.link}</span>
          </a>`).join('')}
        </div>
        <div class="wb-all"><a class="btn wb-btn" href="portfolio.html">Ver todo el portfolio →</a></div>
      </div>`;
  }
})();
