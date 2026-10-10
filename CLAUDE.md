# Página de Camilo Bosio — memoria del proyecto

Sitio personal de Camilo Bosio (Rosario, Argentina): portfolio + servicios + planes.
Publicado con GitHub Pages (rama `main`, carpeta raíz) con dominio propio https://camilobosio.com/ (archivo `CNAME`; antes camilobosio.github.io, que redirige solo).
Hablarle a Camilo en español rioplatense, simple y sin tecnicismos.

## Estructura
- `index.html` — INICIO: solo pantallazos ("destellos") de todo. Portada con celular + anillo que gira detrás (`#orbit`,
  imágenes en `images/orbita/` + logos de `images/crear/` + camperas del probador), servicios, "¿Qué vamos a crear?",
  pantallazos del portfolio (`.peek`, 4 tarjetas que llevan a portfolio.html), planes, cómo trabajo, quién, contacto.
- `portfolio.html` — PORTFOLIO, en este ORDEN (pedido de Camilo, 8/10): 1) Contenido con IA (`#ia`, mosaico con cada pieza en su
  formato, tal cual el original: bordes REDONDEADOS (probó cuadrados y esquinas rectas, no le gustaron); filtros Perfumes / En la calle / Personas),
  2) Páginas web (`#web`, M Perfumerie + experiencia interactiva), 3) Contenido interactivo (`#ropa`: `#probador` y
  `#producto-360`) AL FINAL, porque es lo más nuevo y sigue en desarrollo.
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
- "¿Qué vamos a crear?" (`.make`) con fondo gris muy suave #ebeae6 (más claro que el resto; blanco le pareció demasiado) y puntitos suaves.
- Títulos de grupos de planes ("Páginas web" azul, "Contenido con IA" naranja): pintados con marcador (bloque lleno, bordes rectos irregulares, letras blancas), sin números ni subrayado. Menú sin "Planes"; sección "Elegí tu plan"; Premium en naranja.
- "¿Arrancamos tu proyecto?" (`.contact`): el recuadro azul se derrite por abajo con brillo (al bajar se estira de ondulado a chorreado, siempre curvo; una vez completo queda así al subir y se reinicia recién arriba de todo; `paintDrip` al final de
  js/sitio.js; perfil copiado de una referencia de Camilo, gotas afinadas; en celular 3 gotas). Sin sombra 3D.
- Miniatura de M Perfumerie en el portfolio del inicio = video del celular con los productos (`celular-producto.mp4`).
- Herramientas: sumado Pomelli (Google), ícono propio `images/herramientas/pomelli.svg`.
- Inicio, orden: Lo que hago → Planes → ¿Qué vamos a crear? → Portfolio → Cómo trabajo (sin texto al costado: trabaja solo) → Quién → Contacto.
- Título de servicios: "Lo que hago por tu marca" (no "por tu negocio": puede ser empresa o emprendimiento).
- Textos: primero "página para tu empresa" (institucional, sin vender) y después tienda online / e-commerce
  (pedido por WhatsApp o pago en la página). Premium web = PÁGINA INTERACTIVA (no "landing page").
- Planes resumidos: 3 puntos + "Ver más" que despliega el resto ahí mismo (`.plan.short`, JS al final de sitio.js).
- Al entrar, la franja naranja del menú baja cuando el balde vuelca (`.top.pre` → `.drop`), en 1,5 s suave y sin rebote. NO tocar el balde ni el logo
  de compu. En celular el logo va centrado en el espacio libre al lado de "Bosio", apoyado en su línea.
- Previsualizar con la tipografía real (fuentes por curl en Playwright); sin ella la "o" se corre y el balde parece roto.
- Sección "Quién está detrás": Camilo es el **creativo**, no solo alguien que automatiza con IA: idea, propone opciones,
  se adapta a lo que quiere el cliente, diseña, programa y desarrolla (páginas, publicidades, videos, fotos).

- Clic en cualquier lado (las dos páginas): gotita de pintura naranja brillante que explota en gotitas chicas (`.paint-pop`,
  canvas fijo, al final de js/sitio.js). Referencia de Camilo: "Blob Cursor" (gota azul cromada), pero chica, naranja y solo al clic. NO sobre la credencial (`#lanyard`). En celular solo con un toque corto y quieto (deslizar para bajar NO hace gotitas).
- "Quién": la foto es una CREDENCIAL COLGANTE (`#lanyard`, `.ly-*`, física al final de js/sitio.js): cinta negra con las
  iniciales CB del logo en naranja (3 veces, arrancando un poco arriba de la chapita), chapita de metal + aro que pasa por una
  ranura finita. Arrastrar = se mueve y gira; clic = se da vuelta (dorso azul con logo, nombre y web). Frente SIN nombre.
  Al aparecer se mece suave (no cae ni da vueltas: a Camilo le pareció "loco"). Referencia: componente "Lanyard".
- Copia local del sitio: `C:UsersCamiloDesktopMi web personal` (clon de este repo).

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
"Generar otras" cambia colores; cada resultado se descarga en PNG; "Pulirlo con Camilo" abre WhatsApp con el mensaje único (ver Contacto).
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
- El mosaico se arma en columnas por JS (`layout()` en sitio.js, `.gallery.js .gcol`), NO con CSS columns: en iPhone dejaban un recuadro gris al filtrar.
- Videos "Escena con IA – Persona en Ferrari · ángulo 1/2/3": el 2 y el 3 tienen póster propio (.jpg) y `data-t` para arrancar en otro momento; en celular se oculta el `.sub` (`.tile.wide`).

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

## Publicidad animada Día de la Madre (M Perfumerie, PUBLICADA)
Video vertical 16 s para historias, estilo de una publicidad de Shopify que pasó Camilo pero con formas propias (flores,
cintas, recuadros redondeados) para que no parezca copia. Hecho 100% con código: canvas + Playwright cuadro a cuadro,
sonido sintetizado con Python (música chill bajita, tic-tac, "ding" de notificaciones, toques suaves; el soplido bien bajo;
en el logo un acorde cálido — NO destello agudo ni spray, Camilo los descartó). Perfumes = fotos del catálogo sin fondo.
Conteo desde el domingo 4/10 14 h → 13:10:00:00. Final = logo solo (sin "M PERFUMERIE") + "Ver catálogo".
En `portfolio/perfumes/dia-de-la-madre-animada.mp4` (galería) y `images/orbita/dia-madre.mp4` (anillo de la portada,
reemplazó a las remeras con el logo, que Camilo no quiere). Python figura en "Con qué trabajo".

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
- MENSAJE DE WHATSAPP ÚNICO (10/10, pedido de Camilo): TODOS los botones/links a WhatsApp (index, portfolio y el `#gwa` del generador en sitio.js) mandan el mismo texto:
  "Hola Camilo, vi tu página y quería consultarte por tus servicios. ¿Me podrías pasar más información para armar un presupuesto?" No poner textos distintos por botón.

## Cómo trabajar
- REGLA DE CAMILO: todo cambio VISUAL se le muestra primero con captura(s) en el chat y se publica SOLO cuando él dice que sí. Nunca publicar un cambio visual sin su OK.
- Guardar archivos nuevos que mande Camilo en `portfolio/<rubro>/` con nombres descriptivos.
- Revisar en compu (1280px) y celular (390px) con Playwright (Chromium en /opt/pw-browsers) que no haya scroll horizontal.
- Para publicar: los cambios tienen que llegar a `main`. WhatsApp guarda la vista previa vieja: compartir el link con `?v=N`.

## Modo oscuro (10/10, PUBLICADO)
- Arriba, al lado de "Escribime": botones **sol | luna** solo con íconos (`#themeSeg`, `.theme-seg`); el activo queda pintado.
  Arranca SIEMPRE en claro; la elección se guarda en `localStorage` (`tema` = claro/oscuro) y un script en el `<head>` la aplica antes de pintar.
- Colores oscuros en `html[data-theme="dark"]` al final de `css/sitio.css` (fondo #141416). Lo que tiene color propio queda igual
  (franja naranja, contacto azul, Premium naranja). Paneles negros (`.case`, `.plan.pro`, `.fact`) pasan a #1f1f25 con borde.
- Camilo eligió de 4 bocetos: sin palabras "Claro/Oscuro", solo sol y luna.

## Portfolio del inicio (10/10)
- Sin texto al costado del título. Tarjetas: M Perfumerie → Publicidades (video Día de la Madre) → Videos con personas
  (`portfolio/videos-ia/lentes-inicio.mp4`, recorte vertical del ÁNGULO 3 desde 2,38 s: se pone los lentes + primer plano; Camilo lo prefirió al ángulo 2)
  → Producto 360 (gira solo: `portfolio/ropa/campera-360/giro-inicio.mp4`, los 144 cuadros de las tiras giro-1..4 a 24 fps). Sin probador.
- En oscuro, los recuadros de "Lo que hago" NO llevan fondo en compu (igual que en claro); en celular sí (#1b1b1f).
