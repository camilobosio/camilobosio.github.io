# Videos hechos con código (sin créditos)
- `pincel.html` + `rec.js`: logo pintado con pincel. El pincel sigue los trazos reales de `images/logo.svg`
  (ancho de la punta = ancho del trazo, 4.2) y después vuelve con el color del chorreado. `node rec.js` saca los
  cuadros (30 fps) y ffmpeg los une. `node rec.js test` saca 10 cuadros de prueba.
- `landing-campera.html` + `rec-landing.js`: landing de demo (tienda "NOVA") con cursor que gira la campera negra,
  baja el cierre, desliza a la gris y la agrega al carrito. Usa los sprites de `portfolio/ropa/` servidos con
  `python3 -m http.server 8765` desde la raíz del repo.
- `mockup-pantalla.py`: pega esos cuadros en la pantalla de la notebook del mockup (perspectiva, esquinas medidas).
