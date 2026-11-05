// ETAPA 3 del inicio: "Qué puedo construir para vos" (tarjetas que aparecen una detrás de otra)
(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- tarjetas que aparecen al bajar ----------
  const cards = [...document.querySelectorAll('.cv3-card, .cv3-extra li')];
  if(cards.length){
    if(reduce) cards.forEach(c => c.classList.add('in'));
    else {
      const check = () => { const h = innerHeight; let k = 0;
        cards.forEach(c => { if(c.classList.contains('in')) return; const r = c.getBoundingClientRect();
          if(r.top < h * .9 && r.bottom > 0){ c.style.transitionDelay = (k++ * .12) + 's'; c.classList.add('in'); } }); };
      check(); addEventListener('scroll', check, { passive:true }); addEventListener('resize', check);
    }
  }

  // contacto: queda solo "Escribime por WhatsApp" con el mensaje único (pedido de Camilo, 5/11)
})();
