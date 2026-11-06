// Portfolio: las campañas con muchas piezas de la misma temática se muestran con 2 tarjetas en la galería;
// al tocar una se abre la campaña entera, todas las historias una al lado de la otra.
// PARA SUMAR OTRA CAMPAÑA: agregar su lista en GRUPOS y poner data-grp="<nombre>" en sus tarjetas de portfolio.html.
(function(){
  const H = 'portfolio/campanas/halloween/';
  const GRUPOS = {
    halloween:{ titulo:'Campaña de Halloween · M Perfumerie', sub:'Un personaje y una escena para cada perfume, con su frase. Todo hecho con IA.',
      piezas:['portada-calabaza','linterdit-elixir','spicebomb-infrared','gentleman-givenchy','9pm-night-out','maahir-black','jpg-la-belle-1','scandal-elixir',
              'alien-mugler','hypnotic-poison','phantom','jpg-la-belle-2','good-girl-jasmine','invictus-elixir','eros-flame','black-opium','toy-boy','most-wanted',
              'hypnotic-poison-edp','jpg-la-belle-3'].map(n => H + n + '.webp?v=2') },
  };
  const css = document.createElement('style');
  css.textContent = `
    .tile.grp{ position:relative; }
    .grp-tag{ position:absolute; top:10px; left:10px; z-index:2; padding:5px 10px; border-radius:999px; background:rgba(10,10,11,.78); color:#fff;
      font-family:var(--mono); font-size:10.5px; letter-spacing:.06em; text-transform:uppercase; pointer-events:none; }
    .grp-ov{ position:fixed; inset:0; z-index:200; background:rgba(10,10,11,.98); color:#f3f1ec; display:flex; flex-direction:column; opacity:0; transition:opacity .3s; }
    .grp-ov.on{ opacity:1; }
    .grp-hd{ display:flex; align-items:flex-start; justify-content:space-between; gap:16px; padding:22px 24px 10px; }
    .grp-hd b{ font-family:var(--display); font-weight:800; font-size:clamp(22px, 2.6vw, 34px); letter-spacing:-.03em; display:block; }
    .grp-hd span{ font-size:14.5px; opacity:.7; }
    .grp-x{ flex:none; width:44px; height:44px; border-radius:50%; border:1.5px solid rgba(255,255,255,.4); background:none; color:#fff; font-size:20px; cursor:pointer; }
    .grp-row{ flex:1; display:flex; gap:16px; overflow-x:auto; padding:10px 24px 28px; scroll-snap-type:x mandatory; align-items:center; scrollbar-width:thin; }
    .grp-row img{ height:min(62vh, 560px); width:auto; aspect-ratio:4/5; object-fit:cover; border-radius:10px; flex:none; scroll-snap-align:center;
      opacity:0; transform:translateY(16px); animation:grpIn .5s var(--ease, ease) forwards; }
    @keyframes grpIn{ to{ opacity:1; transform:none; } }
    .grp-nav{ position:absolute; top:50%; width:46px; height:46px; border-radius:50%; border:0; background:rgba(255,255,255,.9); color:#111; font-size:20px; cursor:pointer; }
    .grp-prev{ left:12px; } .grp-next{ right:12px; }
    @media (max-width:760px){ .grp-row img{ height:68vh; } .grp-nav{ display:none; } }
    @media (prefers-reduced-motion:reduce){ .grp-row img{ animation:none; opacity:1; transform:none; } }`;
  document.head.appendChild(css);

  function abrir(g){
    const G = GRUPOS[g]; if(!G) return;
    const ov = document.createElement('div'); ov.className = 'grp-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', G.titulo);
    ov.innerHTML = `<div class="grp-hd"><div><b>${G.titulo}</b><span>${G.sub}</span></div><button class="grp-x" type="button" aria-label="Cerrar">✕</button></div>
      <div class="grp-row">${G.piezas.map((src, i) => `<img src="${src}" alt="" style="animation-delay:${Math.min(i, 8) * .06}s">`).join('')}</div>
      <button class="grp-nav grp-prev" type="button" aria-label="Anterior">←</button><button class="grp-nav grp-next" type="button" aria-label="Siguiente">→</button>`;
    document.body.appendChild(ov); document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(() => ov.classList.add('on'));
    const row = ov.querySelector('.grp-row'), mover = d => row.scrollBy({ left:d * row.clientWidth * .6, behavior:'smooth' });
    const cerrar = () => { ov.classList.remove('on'); document.documentElement.style.overflow = ''; removeEventListener('keydown', tecla); setTimeout(() => ov.remove(), 300); };
    const tecla = e => { if(e.key === 'Escape') cerrar(); if(e.key === 'ArrowRight') mover(1); if(e.key === 'ArrowLeft') mover(-1); };
    ov.querySelector('.grp-x').onclick = cerrar; ov.querySelector('.grp-prev').onclick = () => mover(-1); ov.querySelector('.grp-next').onclick = () => mover(1);
    ov.addEventListener('click', e => { if(e.target === ov || e.target === row) cerrar(); });
    addEventListener('keydown', tecla); ov.querySelector('.grp-x').focus();
  }
  // se engancha antes que el visor común (sitio.js), así estas tarjetas abren la campaña entera
  document.querySelectorAll('.tile[data-grp]').forEach(t => t.addEventListener('click', e => { e.stopImmediatePropagation(); abrir(t.dataset.grp); }, true));
})();
