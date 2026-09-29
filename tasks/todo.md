# Motor de modelos 3D de producto (modelo-3d-producto/)

Objetivo: cargar fotos o un video de un producto → modelo 3D real, lo más fiel posible → visor profesional.

## Plan
- [x] Vistas limpias: lámina de 4 vistas (nano_banana_pro 4K) a partir de las fotos reales; recorte en 4 cuadradas
- [x] Generar con 3 motores en paralelo (Hunyuan3D v3, Tripo H3.1 multivista, Meshy 7 ultra)
- [x] Procesamiento web (motor/procesar.sh): soldar, simplificar a ~250k triángulos, texturas WebP 2048, meshopt
- [x] Visor nuevo: catálogo, comparar motores, comparar con la foto, vistas rápidas, malla/forma, fondo, sombra
- [x] Orientación por modelo (`giro` en catalogo.json) — verificado frente/3/4/costado/espalda con Tripo
- [x] Sumar Hunyuan y Meshy, comparar los 3 contra las fotos y elegir el más fiel
- [x] Probar el visor en celular (390px) y compu (1280px) — en celular el panel arranca plegado y el encuadre usa el alto libre
- [ ] Segundo producto de prueba (idealmente de tienda, con fotos que pase Camilo) para validar el flujo
- [ ] Entrada por video: sacar 8–12 cuadros alrededor del producto y usarlos como fotos
- [ ] Mostrarlo en el portfolio (dentro, no página suelta) cuando Camilo lo apruebe

## Revisión
- Tripo H3.1 (4 vistas, detailed, PBR): muy fiel en forma, tiras, logo, cierre y puños. 2M triángulos → 250k, 64 MB → 2 MB.
- Hunyuan3D v3: forma buena pero inventó un texto "adidas" en el pecho. Meshy 7 ultra (solo frente): tiras en la espalda
  (la real es lisa) y logo dentro de un parche. Elegido: Tripo.
- Costo de esta prueba: lámina de vistas ~8 + Hunyuan 15 + Tripo 18 + Meshy 44 créditos.

---

# YouTube — "Día del Juicio Final, año 2045" (intro found footage)
Objetivo: intro corta con el video de Camilo (cara y voz reales) pero en Rosario 2045 tomada por robots.

## Plan
- [x] Transcribir el video y marcar los momentos (presentación, señala drones, pasa un drone y sale corriendo)
- [x] Cortar 3 tramos de ~9 s y subirlos a 720p (Kling Edit falla con 576p)
- [x] Kling 3.0 Omni Edit (pro, 18 créditos c/u): cambiar el departamento por calle de Rosario con vegetación y robots
- [x] 3 tomas sin Camilo (Kling 3.0): drone escaneando, cubo de carga de robots, autos/motos robot
- [x] Armar la intro con su audio original, revisar cuadros y mandársela

## Revisión
- Tu cara, gorra y campera quedaron iguales en los 3 tramos (jobs f087477f, 12bf874d, 2d3daf6e). Kling Edit falla sin aviso con 576p: subir a 720p.
- Tomas extra: drone (8c418ffb) y cubos de carga (9fe7bb04) sí; la de autos/moto (a747ee9a) no: la moto tiene un piloto humano.
- En el tramo final (2d3daf6e) se ve una persona chiquita caminando en la calle: a revisar con Camilo.
- Intro: 41 s vertical, audio original de Camilo, marca REC + "ROSARIO 12/03/2045", cierre con título. Créditos: ~90.

## Versión 2 (correcciones de Camilo)
- [ ] Referencias fijas (nano_banana_pro): interior de casa abandonada con ventana rota mirando a la calle; ciudad con
      casas abandonadas + edificios robot desde el piso (con robots enchufados / vidriados con base de IA); Monumento a la Bandera lejos
- [ ] Rehacer los tramos de Camilo con la casa de fondo (siempre escondido), robots lejos, sin personas
- [ ] Tomas extra: moto robot futurista, autos futuristas, drones altos rápidos, drone bajo escaneando casas,
      edificios robot, cruce + muro alto con el Monumento de lejos
- [ ] Revisar TODOS los cuadros: ninguna persona, robots lejos, Camilo siempre escondido
- [ ] Armar y mandar
