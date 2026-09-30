# Página de Camilo Bosio — memoria del proyecto

Sitio personal de Camilo Bosio (Rosario, Argentina): portfolio + servicios + planes.
Publicado con GitHub Pages en https://camilobosio.github.io/ (rama `main`, carpeta raíz).
Hablarle a Camilo en español rioplatense, simple y sin tecnicismos.

## Estructura
- `index.html` — INICIO: solo pantallazos ("destellos") de todo. Portada con celular + anillo que gira detrás (`#orbit`,
  imágenes en `images/orbita/` + logos de `images/crear/` + camperas del probador), servicios, "¿Qué vamos a crear?",
  pantallazos del portfolio (`.peek`, 4 tarjetas que llevan a portfolio.html), planes, cómo trabajo, quién, contacto.
- `portfolio.html` — PORTFOLIO completo y ordenado: Páginas web (M Perfumerie + experiencia interactiva), Contenido
  interactivo (`#probador` y `#producto-360`), Contenido con IA (galería con filtros Perfumes / En la calle / Personas).
- `css/sitio.css` y `js/sitio.js` — estilos y código COMPARTIDOS por las dos páginas (sin build). El JS chequea que
  cada elemento exista, porque no todos están en las dos páginas.
- En celular el inicio tiene que ser corto: servicios, planes y las grabaciones de M Perfumerie se deslizan de costado.
- `images/` — capturas de M Perfumerie, foto de Camilo.
  - `logo.svg` + `logo-180.png` = logo "M1": CB de líneas rectas estilo circuito, pintada en naranja→rosa y chorreando pintura, sobre fondo AZUL (#4d7cff→#1d3fc4; antes violeta, Camilo lo cambió: "más azul, un poco más fuerte, nada de celeste ni lila") (arte + tecnología; elegido entre muchas pruebas), usado como ícono de la pestaña y en la barra superior. `icono.jpg` (foto de Camilo) ya no se usa: Camilo no quiere su cara en la pestaña.
  - `og-productos.jpg` = vista previa de WhatsApp/redes activa (todo producto).
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

## Estilo
- Fondo gris "cemento" (`--paper:#d6d5d0`, `--paper-2:#cac9c3`, `--line:#b9b8b1`, `--muted:#4f4e55`): Camilo no quiere blanco (cansa la vista). Probó perla/piedra y eligió cemento.
- Salpicón de carga (`#splashLoad`, en index.html y portfolio.html, iguales): forma copiada de una referencia de Camilo
  (mancha con brazos gorditos y bolitas, uno largo a la derecha), golpe que se abre desde el centro sin rebote ni onda,
  gotitas arriba/abajo/costados que caen con hilito, y 3 chorreadas. Versión PLANA (probó 3D con relieve y no le gustó).
  El logo animado del balde arranca recién cuando termina el salpicón (`splashDone` en js/sitio.js).
- Colores: azul (`--violet` = #2b50d8; la variable conserva el nombre viejo) como principal. La frase que rota en la portada: degradé original azul 10% → naranja (leve destello; probó sin naranja y con más naranja, eligió este). Logo de la portada en la línea de "Bosio", un espacio después de la o (`.hero-balde`, igual en compu y celular) + **naranja del logo** (`--orange`, `--paint` = degradé naranja→rosa) como acento
  (frases que rotan en la portada, puntos de la cinta, números de pasos, todo lo del servicio "Contenido con IA").
- Menú de arriba: SOLO el logo (sin "Camilo Bosio"); en celular todas las secciones en una 2ª fila. Al entrar es una franja
  de pintura naranja con borde ondulado suave (`.top::before/::after`); al bajar se va para arriba y queda el gris.
- "¿Qué vamos a crear?" (`.make`) con fondo casi blanco #f4f4f1 y puntitos suaves.
- "¿Arrancamos tu proyecto?" (`.contact`): el recuadro azul se derrite por abajo con brillo (`paintDrip` al final de
  js/sitio.js; perfil copiado de una referencia de Camilo, gotas afinadas; en celular 3 gotas). Sin sombra 3D.
- Miniatura de M Perfumerie en el portfolio del inicio = video del celular con los productos (`celular-producto.mp4`).
- Herramientas: sumado Pomelli (Google), ícono propio `images/herramientas/pomelli.svg`.
- Sección "Quién está detrás": Camilo es el **creativo**, no solo alguien que automatiza con IA: idea, propone opciones,
  se adapta a lo que quiere el cliente, diseña, programa y desarrolla (páginas, publicidades, videos, fotos).

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
- REGLA DE CAMILO: todo cambio VISUAL se le muestra primero con captura(s) en el chat y se publica SOLO cuando él dice que sí. Nunca publicar un cambio visual sin su OK.
- Guardar archivos nuevos que mande Camilo en `portfolio/<rubro>/` con nombres descriptivos.
- Revisar en compu (1280px) y celular (390px) con Playwright (Chromium en /opt/pw-browsers) que no haya scroll horizontal.
- Para publicar: los cambios tienen que llegar a `main`. WhatsApp guarda la vista previa vieja: compartir el link con `?v=N`.
