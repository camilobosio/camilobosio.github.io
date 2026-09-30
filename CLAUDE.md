# Página de Camilo Bosio — memoria del proyecto

Sitio personal de Camilo Bosio (Rosario, Argentina): portfolio + servicios + planes.
Publicado con GitHub Pages en https://camilobosio.github.io/ (rama `main`, carpeta raíz).
Hablarle a Camilo en español rioplatense, simple y sin tecnicismos.

## Forma de trabajar (pedido de Camilo)
- Al empezar, leer `tasks/lessons.md` (lo que Camilo corrigió) y `tasks/todo.md` (plan en curso).
- Tareas de 3+ pasos: plan primero en `tasks/todo.md` con ítems tildables; avisar el plan; tildar a medida que se avanza;
  al final, sección de revisión. Si algo se tuerce, frenar y replanificar.
- Después de cada corrección de Camilo, anotar la lección en `tasks/lessons.md`.
- Nada está terminado sin probarlo (tests, navegador, logs). Cambios simples y mínimos; causas de fondo, no parches.
- Se pueden usar subagentes para investigar o probar en paralelo.

## Estructura
- `index.html` — INICIO: solo pantallazos ("destellos") de todo. Portada con celular + anillo que gira detrás (`#orbit`,
  imágenes en `images/orbita/` + logos de `images/crear/` + camperas del probador), servicios, "¿Qué vamos a crear?",
  pantallazos del portfolio (`.peek`, 4 tarjetas que llevan a portfolio.html), planes, cómo trabajo, quién, contacto.
- `portfolio.html` — PORTFOLIO completo y ordenado: Páginas web (M Perfumerie + experiencia interactiva), Contenido
  interactivo (`#probador` y `#producto-360`), Contenido con IA (galería con filtros Perfumes / En la calle / Personas).
- `css/sitio.css` y `js/sitio.js` — estilos y código COMPARTIDOS por las dos páginas (sin build). El JS chequea que
  cada elemento exista, porque no todos están en las dos páginas.
- En celular el inicio tiene que ser corto: servicios y las grabaciones de M Perfumerie se deslizan de costado; los PLANES
  van apilados (Básico arriba, Premium abajo) y compactos, sin deslizar (pedido de Camilo).
- `images/` — capturas de M Perfumerie, foto de Camilo.
  - `logo.svg` + `logo-180.png` = logo "M1": CB de líneas rectas estilo circuito, pintada en naranja→rosa y chorreando pintura, sobre fondo violeta (arte + tecnología; elegido entre muchas pruebas), usado como ícono de la pestaña y en la barra superior. `icono.jpg` (foto de Camilo) ya no se usa: Camilo no quiere su cara en la pestaña.
  - `og-logo.jpg` = vista previa de WhatsApp/redes ACTIVA (solo el logo sobre violeta, pedido de Camilo).
  - `og-productos.jpg` = vista previa vieja (productos), sin uso.
  - `og-mixto.jpg` = alternativa (flyer + productos). `og-image.jpg` = versión vieja, sin uso.
- `portfolio/perfumes/` — publicidades de perfumes hechas con IA + Canva (14 imágenes .webp + 1 video Kling).
- `portfolio/videos-ia/` — 3 videos (misma escena, 3 ángulos) con la cara de Camilo, hechos a partir de un par de fotos.
- `modelo-3d-producto/` — PRIMERA VERSIÓN, queda aparte (NO va en la página por ahora). Camilo la vio: "se ve como un
  modelo 3D básico", textura rara, y prefiere la campera de videos (`#producto-360`), que es la que queda en la página.
  Modernizar el 3D más adelante, "hoy no". Visor 3D (Three.js por CDN) con 2 ejemplos en pestañas: **Campera** (principal) y Frasco (formas).
  Campera = 2 modelos Higgsfield/Meshy: `campera-cerrada.glb` (multi_image_to_3d con fotos 47894ddb, 609bd543, 12750336,
  40a9f202 → job 97f6ce0b) y `campera-abierta.glb` (image_to_3d con foto 2bde9db7 → job 530da202), comprimidos con
  gltf-transform (webp + meshopt; el visor usa MeshoptDecoder). La cerrada vino con el torso blanco en la textura:
  `TORSO_NEGRO` lo oscurece por posición en un shader. Cierre: tirador naranja de frente; al bajarlo, planos de corte
  muestran la abierta arriba y la cerrada abajo. Nunca gira sola; imán al frente. Camilo lo tiene en su PC en
  `C:\Users\Camilo\Desktop\modelo 3D producto` (se manda en .zip: este entorno no accede a su compu).
- `Camilo-Bosio-Paginas-web.pdf` — PDF de planes. Solo tiene los planes de páginas web (falta sumar el de IA).

- "Con qué trabajo" (`.apps`, dentro de `#quien` en index.html): 20 herramientas con logo (`images/herramientas/`).
  Las de Camilo: Claude Code, ChatGPT, Higgsfield, Busy (la abejita, logo que pasó él), Canva (logo nuevo que pasó él),
  Photoshop, Illustrator; las demás las sugerí yo y Camilo aprobó todas. Logos de simple-icons (SVG) y favicons.
  En celular: grilla de 4 íconos con nombre, sin descripción.

- Logo animado (PUBLICADO, código al final de js/sitio.js, se arma en `.logo-balde` / `.logo-pincel`):
  balde de pintura REAL (`images/balde/balde.webp`, foto 82510ff9) que vuelca pintura sobre el logo limpio, y pincel REAL
  (`images/balde/pincel.webp`, foto 1e3940c0) que sigue el trazo exacto de la C y la B y después pinta las gotas.
  Dónde: el BALDE chiquito al lado de "Bosio" en la portada (compu y celular, `.hero-balde`), sale y vuelve a esconderse atrás
  de la "o" de "Camilo" (recortado con la caja de tinta de la letra), queda ELEVADO arriba del logo y la pintura cae con
  distancia sobre la línea larga de la B y baja; pocas salpicaduras. Abajo de todo SOLO el pincel, grande (`.firma`).
  Camilo NO quiere una franja/sección con explicación ("Así nace una marca" se sacó). `window.__logos(t)` dibuja un instante.
- Portfolio, debajo de la Campera 360 (`.p3-mock`, PUBLICADO): video del mockup notebook + celu
  (`portfolio/ropa/mockup-campera.mp4`). Se genera con `herramientas-video/` (landing web3 sin texto grabada cuadro a
  cuadro con Playwright y pegada con perspectiva en la foto del mockup, job 944fcfcf).

## Textos y orden (pedido de Camilo, 30/9)
- NADA de "pensado para celular" solo: las páginas se piensan para compu Y celular, con un diseño para cada uno.
- Pedidos: por WhatsApp O compra cerrada en la página (Mercado Pago, débito, crédito, transferencia).
- Página de administrador: entra solo el dueño con mail y contraseña; cambia títulos, productos, precios, fotos, stock,
  publicidades y ve las compras.
- Sin "Como M Perfumerie" en el Premium; sin "Rosario, Santa Fe" arriba; pie = solo "© 2026" (sin nombre ni ciudad).
- Portfolio "Contenido interactivo": primero PRODUCTO 360 (antes "Campera 360") + video del mockup, abajo el probador
  SIN giro 360 (solo cambia la campera). En celular las 4 interacciones de M Perfumerie van 2×2 y se abren en grande al tocar.

- Pintura al cargar (`#splashLoad`, PUBLICADO): mancha naranja REDONDEADA (como la referencia de Camilo: cuerpo con lóbulos, brazos cortos con bolita en la punta; hecha con círculos + filtro "goo", NADA de puntas triangulares), grande, naranja oscuro con opacidad .9; detrás la página se ve BORROSA (backdrop-filter). Después aparecen gotitas salpicadas arriba y abajo y las grandes se escurren para abajo con rastro, como gota en un vidrio. Se va a los ~1,9 s. SIN logo. Sale en CADA carga. Estilo y código DENTRO de index.html y portfolio.html (no en sitio.css: en PC había un sitio.css viejo en caché y la pintura quedaba pegada arriba). Al cambiar css/js subir el `?v=N` de los links (hoy 29). Generador: scratchpad splash3.py.

## Posicionamiento (decidido)
La página es general, no "solo páginas web": **diseño web + contenido con IA** (campañas publicitarias, flyers, fotos de producto, videos, interacciones para webs).

Dos servicios, dos planes cada uno (sin precios, botón "Consultar" por WhatsApp):
1. **Páginas web**: Básico y Premium (Premium = como M Perfumerie).
2. **Contenido con IA**: Básico y Premium. Lo que cambia son los créditos de IA → más videos, más largos, más opciones/variantes.
   Todavía sin cantidades concretas: pedirle a Camilo números (cantidad y duración de videos por plan) si los quiere.

## "¿Qué vamos a crear?" (sección `#crear`, clases `.make` / `.g*`)
Entre "Lo que hago" y el portfolio. Barra tipo la de la portada de base44.com (Camilo NO quería tarjetas, quería esto):
recuadro para escribir "¿Qué querés crear o modificar?", botón "+" para subir una foto (también arrastrar o pegar),
modo Crear / Variaciones, botón naranja de generar y sugerencias abajo. Todo corre en el navegador (canvas, sin IA ni
servidor; la foto no se sube): genera una base simple para probar →
- Crear + texto → 4 logos (Pintura que chorrea, Monograma, Ícono, Retro) con las iniciales o el nombre entre comillas;
  si hay foto, usa sus colores.
- Variaciones + foto → 6 (sobre color, degradé, blanco y negro, duotono, insignia, tarjeta). El chip usa `images/logo.svg`.
- Texto con flyer/promo/oferta/2x1 + foto → 3 flyers.
"Generar otras" cambia colores; cada resultado se descarga en PNG; "Pulirlo con Camilo" abre WhatsApp con el pedido.
- A los costados (en compu; abajo en celular): ejemplos en abanico, izquierda = variaciones del logo de Camilo, derecha =
  flyers del perfume (`images/crear/*.webp`, sacados del mismo generador). Tocarlos genera ese ejemplo en vivo.
- Con el logo de Camilo (`imgName === 'logo de ejemplo'`): SIN descarga, marca "© Camilo Bosio" y su nombre/mail (pedido de Camilo).
- Recuadro "Solo una prueba": aclara que es lo básico que una IA hace en segundos y que lo real se pule con Camilo.

## Portfolio (sección `#trabajo`)
- Caso M Perfumerie (mperfumerie.com.ar), página web real.
- Sección "Experiencia interactiva" (`#interactivo`, clases `.ix-*`): 4 videos cortos en loop (`portfolio/interacciones/*.mp4`
  + póster .jpg) GRABADOS de la página real de M Perfumerie (repo `maugeperfumerie/mperfumerie`, código de las
  interacciones en `experience/experience.js` e `index.html`): estrellas de "Tendencias", cajas de "Nuevos ingresos",
  burbujas del inicio (hover + pop) y rocío dorado al tocar el flyer. Camilo pidió que sean las reales, no imitaciones.
  Se grabaron con Playwright (screencast CDP, zoom CSS para agrandar) + ffmpeg de `pip install imageio-ffmpeg` (H.264).
  Muestran el valor del plan Premium web; Básico = formato de tienda + carga de productos.
- Galería "Publicidades hechas con IA" (`#contenido`): mosaico con filtros por rubro (`.cats`, botones con `data-f`)
  y visor a pantalla completa. Cada pieza es un `<button class="tile" data-cat="...">` con `<img>` o `<video>` y un `.cap`
  (título en `<b>` + tipo de pieza). Para sumar un rubro nuevo: agregar botón en `.cats` + tiles con ese `data-cat`.
  Rubros actuales: `perfumes`, `personas` ("Videos con personas").
- Videos: en el mosaico se reproducen solos y mudos al verse; en el visor se abren con sonido.

## Probador virtual (`portfolio.html#probador`, clases `.pv-*`, código al final de `js/sitio.js`)
Camilo NO quiere una landing aparte: es un ejemplo dentro del portfolio, con el mismo formato que la campera 360.
Solo sus 5 camperas reales de adidas, SIN gorros. Deslizar = cambia la campera (efecto escáner); botón "360°" = girar
arrastrando (tira de 60 cuadros, nunca gira sola, imán al frente).
- Modelo base: Higgsfield job 964f6c99 (nano_banana_pro 4:5 2k, pelo rapado, encuadre de torso). Cada campera = edición
  de esa foto ("keep everything else pixel-identical"), así no se mueve nada al cambiar.
- `probador/prendas/<id>.webp` (1080×1341) + `-mini.webp`; `probador/giros/<id>.webp` (10 col. × 6 filas de 540×670,
  del video Kling 3.0 pro 5 s con start = end = la foto, ~8,75 créditos).
- Camperas (links de Camilo): Audi F1 KE8919 (job 6c5881c0), Teamgeist KR7070 (033560df), Blocked KR1378 (1e03476f),
  Workwear KR9657 (2072b45b), SST jean KQ6332 (690b6bcb). adidas.com bloquea este entorno (403): las fotos salen de
  tiendas Shopify que las venden (`<tienda>/products/<handle>.json` da las URLs) o store.audif1.com, y se importan a
  Higgsfield con media_import_url. Falta la negra acolchada con franjas beige (no pasó link).

## Visores de producto (campera 360 y probador): calidad, giro y zoom
- Videos mejorados con Higgsfield upscale_video (bytedance, 2k, preset aigc, 24 fps): mismos cuadros y timing, así
  el cierre sigue alineado con el giro. Campera: jobs f3d191aa, 7678ca44, 3e901dde, ae222ff5 (giros) y a81f8045
  (apertura). Probador: df8e9c02 (Audi), 74eb5fd9 (jean), a1c3b95b (blocked), e85b229e (workwear), 0ad60813 (teamgeist).
- Giro: entre un cuadro y el siguiente se funden (se ve continuo); una vuelta = 1,7 anchos de arrastre; inercia suave
  (vel *= 0.05^dt, tope 540°/s); imán al frente. Nunca gira sola.
- Zoom compartido (`zoomer()` al principio de js/sitio.js): doble clic / doble toque, pellizco, pellizco de trackpad
  (ctrl+rueda) y botones + / −. Con zoom, arrastrar mueve la vista. Al acercar se carga la foto HD del ángulo:
  campera `portfolio/ropa/campera-360/hd/g-000…071` (cada 5°) y `a-00…12` (cierre), 900×1600;
  probador `probador/hd/<id>/00…29` (cada 12°), 960×1191. La rueda sola NO hace zoom (no roba el scroll).

## Prenda interactiva (`portfolio.html#prenda`, clases `.pr-*`, código al final de `js/sitio.js`)
Pedido de Camilo: la PRENDA SOLA, sin personas (estilo maniquí invisible), que se maneje con el mouse de varias formas.
Campera Teamgeist gris con capucha. Estados (fotos 4K alineadas, nano_banana_pro editando la misma base):
A cerrada (b2be8804) · B cierre abierto (7b75662f) · C costado corrido (d03fd9b6) · D capucha puesta (d718c7fe) ·
E sin la campera, remera sola (db8c1938). Videos Kling 3.0 modo 4k, 5 s, start/end = esas fotos (30 créditos c/u):
spin A→A (80505ed3), zip A→B (433580f5), flap B→C (16390476), hood A→D (441705b8), off B→E (4c6bea42).
- `portfolio/ropa/prenda/<clip>.webp`: tiras de 8 columnas de 480×597 (spin 72 cuadros, el resto 48); `hd/A…E.webp`.
- Puntos para agarrar en `HANDLES` (% del cuadro, inicio→fin). `curve` = [avance de la mano, tiempo del video]: el
  tirador del cierre recién baja entre el 33% y el 70% del video (medido), el costado entre el 45% y el 85%.
- Botones = atajos: buscan el camino entre estados (A-B, B-C, A-D, B-E) y lo reproducen paso a paso.

## Carteles en la calle (`portfolio/calle/`, también en el anillo de la portada)
Flyers de perfumes puestos en una parada de colectivo, afiche en pared, subte, cartel en altura y vidriera, más el logo
en neón y en papelería (nano_banana_pro con el flyer de referencia importado desde raw.githubusercontent.com).

## Pendiente (semana en curso)
- (Hecho) Caso M Perfumerie: PC = video real de la portada (`portada-pc.mp4`); celular = video de tocar un perfume y que
  se abra la ficha (`celular-producto.mp4`). El del celular se grabó con el código real de la página pero con 4 productos
  de muestra (los mismos de las capturas, imágenes recortadas de `images/m_grid.jpg` y `m_modal.jpg`), porque los datos
  reales están en Firestore y ese acceso fue denegado en este entorno.
- Campera Adidas interactiva (sección `#producto-360`, clases `.p3-*`, PUBLICADA): "Contenido interactivo".
  Arrastrar desde cualquier lado gira (suavizado + inercia); de frente aparece un punto en el cierre: se agarra (cursor grab)
  y se baja para abrir (recorre el video de apertura según cuánto bajes). Sin botón, sin piso/base (flota en fondo oscuro).
  El giro son 4 videos Kling de 3 s (frente→costado→espalda→costado→frente). Al cargar, el JS saca 80 cuadros del giro y
  24 del cierre (seek + drawImage en canvas) y los dibuja según el mouse: giro 1 a 1 sin demora, inercia corta, imán al frente,
  NUNCA gira sola (pedido de Camilo). El tirador del cierre se ve siempre que está de frente (clase .front), con zona de agarre
  amplia; tocarlo abre entero; en celular, touchstart sobre el cierre hace preventDefault para que no se mueva la página
  (antes era invisible y diminuto y no se podía abrir). Zona: --zt 30,8% (tirador REAL del cierre, donde
  lo marcó Camilo, NO en el cuello) y --zh 42,7% (hasta el ruedo).
  Desde el 29/9 los cuadros vienen PRE-CORTADOS en tiras `portfolio/ropa/campera-360/giro-1..4.webp` (36 cuadros c/u,
  144 = 2,5° cada uno) y `apertura.webp` (37), 6 columnas de 450×800; ya no se sacan del video en el navegador.
  Jobs Higgsfield: fotos frente 47894ddb, costado 609bd543, espalda 12750336 (mangas colgando, la vieja 9892caf9 tenía las mangas hacia atrás), otro costado 40a9f202, abierta 2bde9db7;
  giros d1a5003c, 04ca87b8, a0e8a095, 43918be3; apertura 29299012. Ahora el CDN de Higgsfield (d8j0ntlcm91z4.cloudfront.net)
  sí se puede bajar con curl desde este entorno. 3 publicidades de la campera (jobs 6b1c0c83, 7974a2e7, f7ac0fb1) sin sumar aún.
  Subir referencias a Higgsfield: la subida directa está bloqueada; se suben al repo y se importan con media_import_url
  desde raw.githubusercontent.com.
- Camilo va a seguir creando contenido esta semana y pasarlo en tandas: campaña de **ropa**, videos de otros productos.
  Se puede usar el conector de **Higgsfield** para generar imágenes/videos con él.
- El video `portfolio/perfumes/video-kling-1.mp4` figura como "Video de producto": preguntar qué perfume es.
- Confirmar que los videos se vean bien en el navegador real (en el entorno de pruebas no se pueden reproducir, son H.264).
- Actualizar el PDF de planes con el servicio de contenido con IA.
- Contacto: WhatsApp 3468 437518 (wa.me/5493468437518), camilobosio96@gmail.com.

## Cómo trabajar
- Guardar archivos nuevos que mande Camilo en `portfolio/<rubro>/` con nombres descriptivos.
- Revisar en compu (1280px) y celular (390px) con Playwright (Chromium en /opt/pw-browsers) que no haya scroll horizontal.
- Para publicar: los cambios tienen que llegar a `main`. WhatsApp guarda la vista previa vieja: compartir el link con `?v=N`.
