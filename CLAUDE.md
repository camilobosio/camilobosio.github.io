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
  `#producto-360`)... ORDEN NUEVO (19/10): Contenido con IA → Páginas web (M Perfumerie) → Oficina virtual (`#oficina`) → Contenido interactivo (`#ropa`) → Proyecto personal (`#personal`, Last Rental) al final.
  ORDEN NUEVO (21/10): Contenido con IA → Páginas web → apartado final **"Prototipos en proceso"** (`#prototipos`, línea punteada,
  cartel "En proceso" con ruedita naranja que gira y título grande, SIN texto explicativo: Camilo quiere solo el título).
  Adentro: Para empresas (`#oficina`) → Contenido interactivo (`#ropa`: 360 + probador) → Experiencia visual (`#personal`, Last Rental,
  ya no se titula "Proyecto personal"; el texto arranca "Un proyecto personal: me armé una habitación…"). Todo lo de arriba = terminado.
  En `#wnav` NO va el "1 / 2": solo pestañas + flechitas.
  Títulos "Contenido con IA" y "Páginas web" = `.pf-h.big` (22px) con ícono animado `.pf-ico` (elegidos de 3 bocetos c/u):
  IA = 3 destellos que titilan; Web = ventanita con mouse que hace clic en un botón.
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

## Sumado el 19/10 (PUBLICADO)
- Galería `#contenido`: **Tesla volador** (`portfolio/videos-ia/tesla-volador.mp4` + .jpg, `tile wide`, personas): Camilo
  reemplazó al actor y habla con su voz real. Tiene la marca de agua de sync.so y Camilo decidió dejarla ("quiero mostrar lo
  que se puede hacer"). **Reel de lanzamiento de M Perfumerie** (`portfolio/perfumes/lanzamiento-pagina.mp4`, notebook + celular).
- Sección **Prototipos** (`#prototipos`, botón en `.pf-jump`):
  - **Oficina virtual** (`.case.proto`, panel oscuro como el caso M Perfumerie): PRODUCTO PARA EMPRESAS, NO un juego (la estética
    de juego es para que sea agradable). Texto básico: "adaptable para tu empresa, cada empleado es un bot que configurás".
    Camilo NO quiere cifras (cantidad de empleados/áreas): es configurable. Video `portfolio/prototipos/oficina-paneo.mp4`
    = paneo hecho con capturas reales de la app (zoom suave + fundidos; la app en este entorno renderiza a ~1 cuadro/s,
    no se puede grabar en vivo). Botón "Quiero una para mi empresa" → WhatsApp con el mensaje único.
    App en la PC de Camilo: `Desktop\Oficina Virtual\virtual-office-ai` (build en `apps/web/dist`, sin servidor = sin chat).
  - **Last Rental** (`.lr`, más chico, sin prioridad): juego personal, 2 capturas (`last-rental-portada.webp`, `last-rental-local.webp`).
    Juego en `Desktop\LAST-RENTAL` (`dist/last-rental.js`).
- Las capturas por sección con Playwright muestran la franja naranja del menú en el medio: es el menú fijo, no un error.
  Para mostrarle a Camilo, sacar captura de pantalla completa (viewport), no del elemento.

## Idioma ES | EN (19/10, PUBLICADO)
- Botones **ES | EN** (`#langSeg`, `.theme-seg.lang-seg`) a la DERECHA de "Escribime", mismo estilo que sol | luna.
- `js/idioma.js` (se carga antes de sitio.js): la página sigue escrita en español; en inglés traduce en el navegador con un
  diccionario texto exacto → inglés (`EN`) + reglas para textos con partes variables (`RX`). Un MutationObserver traduce
  lo que agrega el JS (generador, "Ver más", visor). Arranca siempre en español; se guarda en `localStorage` (`idioma`).
  En inglés los links de WhatsApp mandan el mismo mensaje único pero en inglés.
- TEXTO NUEVO EN LA PÁGINA = agregarlo al diccionario `EN` de idioma.js (si no, queda en español al pasar a inglés).
  Textos que el JS dibuja en canvas: envolverlos con `T('...')`.

## Oficina virtual interactiva (19/10, reemplaza al video con zoom)
- Camilo NO quiere zoom ni movimiento: la imagen de la oficina queda SIEMPRE fija (`portfolio/prototipos/oficina.webp`,
  captura real de la app en vista general). Sobre cada empleado hay un punto dorado que late (`.vo-spot`); al tocarlo se
  abre su ficha al costado (`.vo-panel`, copia del panel de la app: avatar, rol, área, pestañas, especialidades, a quién deriva).
  En celular la ficha se abre abajo de la imagen. Datos (es/en) y posiciones al final de js/sitio.js.
- Posiciones: cajas de cada puesto proyectadas desde la escena 3D de la app (en px de 1280×800). Si cambia la planta, rehacer.
- Last Rental (`#personal`): texto = "me armé una habitación ambientada en un videoclub de los 2000, estilo juego… organizo
  películas que vi y tengo, juegos e imágenes de mi PC".

## Overesthetic en Páginas web (19/10, PUBLICADO)
- `#web` ahora tiene 2 páginas que se pasan con flechitas/pestañas (`#wnav`, `.wslide`, JS al final de sitio.js):
  1) M Perfumerie (igual que antes) y 2) **Overesthetic** (`.case.ov`, "En desarrollo", sin link: "Próximamente online").
- Videos en `portfolio/overesthetic/`: GRABACIONES REALES de la página (carpeta `Desktop\LABURO\Overesthetic web`) con
  Playwright recordVideo: portada-pc (intro llanta→logo), celular, y 4 interacciones (intro-llanta, titulo-brillo, modulos, reflejo).
  Para grabar: copiar la página, pasar sus .mp4 a .webm (el Chromium de pruebas no reproduce H.264) y servir las fuentes
  (Big Shoulders Display, Archivo, IBM Plex Mono) desde @fontsource por npm porque fonts.googleapis está bloqueado.
- portada-pc de Overesthetic (aprobada por Camilo): arranca con la página YA desenfocada y la llanta entrando (fuentes
  cargadas antes: se graba con un reload), el logo sube y en ese instante la página baja RÁPIDO hasta el final (~6,5 s),
  "un pantallazo, no para leer". ~10 s en total, fundido de entrada de 0,3 s.

## Portada BOSIO STUDIO (29/10, PUBLICADO)
- Arriba de todo `#studio` (`.studio`, fondo negro): "Camilo" chico arriba (el JS le ajusta tamaño y espaciado para que vaya
  de punta a punta de la B, un poco adentro), **BOSIO** en Syne 800 (Camilo eligió esta entre Bodoni/Syne/Bricolage),
  "Studio" en Instrument Serif cursiva con el degradé del logo, descripción breve y "Ver trabajos".
- Rastro al mover el mouse: miniaturas de trabajos reales (`images/rastro/01..24.webp`) que aparecen y se van en ~1 s,
  SOLO dentro de la portada. En celular aparecen solas a los costados.
- Gotitas de pintura al clic: NO en la portada negra ni en la barra de arriba (pedido de Camilo).
- Barra: al entrar baja la franja naranja como siempre; si bajás y seguís sobre la portada negra, la barra se pone negra.
- Tema (claro/oscuro) e idioma (ES/EN) ahora están en un menú de TRES RAYITAS (`#menuBtn`, `.menu-panel`, siempre tres
  rayitas, nunca cruz) a la derecha de "Escribime", en las dos páginas. Caja chica.
- Sección del celular (`.hero#trabajos`) quedó abajo, sin el nombre grande ni el párrafo largo. Arriba de "Hago…", a la
  izquierda, el LOGO CON BALDE (`.hero-logo`, data-from="#studio", data-delay="1000"): al llegar, 1 s después el balde sale
  de atrás del borde negro, baja, vuelca sobre el logo y se esconde (misma animación de antes, cambia el origen).
- "Lo que hago por tu marca": solo títulos; el tipo + descripción aparecen en un recuadro al pasar el mouse
  (`.svc-pop`); en celular se tocan y se despliegan.

- 29/10 (2ª tanda, PUBLICADO): BOSIO más chico (clamp 54–150px), "Camilo" chiquito apoyado sobre la B (ya NO de punta a punta),
  sin "Ver trabajos" ni "Trabajos reales". En la portada el mouse es una BOLITA DE PINTURA naranja (`#stCursor`, solo ahí);
  recuadros del rastro CUADRADOS (object-fit), ~75–90px, bordes difuminados. Logo y celular más abajo (más recorrido del balde).
  Servicios: el recuadro aparece SOLO al pasar por el ícono (`.ic:hover ~ .svc-pop`), no por el título.
  Tema e idioma: además de localStorage se guardan en cookie (Camilo decía que se reiniciaban).
- 29/10 (3ª tanda, PUBLICADO): en la portada el mouse es un PINCEL dibujado (`images/balde/pincel-cursor.svg`: mango de madera,
  virola de metal corta, punta naranja-rosa; punta arriba a la izquierda como la flecha del mouse). Tocar BOSIO cambia la letra
  Syne → Bodoni → Bricolage (se repinta de izq. a der.). Recuadros del rastro cuadrados, SIN difuminar, ~90–115px.
  Barra sobre la portada SIEMPRE negra (nunca blanca); arriba de todo la franja naranja baja sobre el negro.
  Textos: servicios "juntos o por separado"; sin descripción al lado de "Elegí tu plan"; sin "+640 productos".
- 29/10 (4ª tanda, PUBLICADO): mouse NORMAL en la portada (el pincel no lo convenció; el svg quedó en images/balde). BOSIO fijo en Syne.
  Tocar "Studio" cambia su estilo: cursiva (Instrument Serif) → pincelada (Kaushan Script + filtro #stBrush) → pintura que
  chorrea (Rubik Wet Paint). Recuadros del rastro que aparecen sobre el nombre van traslúcidos (.4); afuera, normales.
- 29/10 (5ª tanda, PUBLICADO): "Studio" ARRANCA en la pincelada (`.studio.s-brush`): al entrar (1,5 s) un pincel (`.st-pb`, el svg de
  madera) la recorre y la pinta de izq. a der. (máscara `.paint`). Al tocar: chorreada → cursiva → pincelada.
  Dorso de la credencial: "Camilo Bosio" + "Studio" pincelado (`.ly-studio`, usa el filtro #stBrush de la portada) + web.
- 29/10: ORDEN DEL INICIO nuevo: portada BOSIO → Hago… (logo + celular) → cinta → **Portfolio** (`#trabajo`) → Lo que hago → Planes →
  ¿Qué vamos a crear? → Cómo trabajo → Quién → Contacto.
- 29/10 (6ª tanda, PUBLICADO): "Studio" pincelado = SVG (`.st-draw`) con el texto en Kaushan Script destapado por una MÁSCARA de 9 trazos
  (`.k`, pathLength=1, stroke-dashoffset 1→0, orden de escritura a mano: S, t palito, t raya, u, d panza, d palo, i, punto, o;
  ~2,4 s). Trazos dibujados sobre la letra medida (viewBox 0 0 400 160, texto x=20 y=112 size=100). Sin el filtro #stBrush
  (se veía con puntitos). Al pasar por "Studio" el mouse es el pincel (`images/balde/pincel-mouse.svg`). Más espacio arriba de "Cómo trabajo".
- 29/10 (7ª tanda, PUBLICADO): mouse sobre "Studio" = el PINCEL DEL LOGO de abajo (`images/balde/pincel-mouse.png` 64px + `@2x`,
  sacado de pincel.webp rotado 150°, punta arriba a la izq.). "Studio" se escribe trazo por trazo SOLO al cargar la página;
  al tocar cambia directo (no se vuelve a escribir).
- 31/10 (celular, PUBLICADO): portada negra a pantalla completa, BOSIO 16,5vw, Studio 10vw, descripción abajo cerca del borde (eligió B).
  Rastro con el dedo: toque = ráfaga de 4, arrastrar = van saliendo; solas: 2 al entrar y una cada 2,6 s. "Hago…" centrado,
  botones en una línea. Servicios en grilla de 2 columnas (ícono + título); al tocar, recuadro negro flotante.
- 31/10 (celular 2, PUBLICADO): negro más corto pero lo justo para que abajo entre SOLO el logo + "Hago…" (min-height
  calc(100svh - 96px - 314px)); descripción del ancho de BOSIO, justificada, margin-top 64px (opción A). Sin botones WhatsApp/
  Portfolio en "Hago…" (solo celular). Rastro: toque = tanda de 3 escalonada (adelante, atrás der., más atrás izq.); solas de a 3.
  ORDEN AL ENTRAR (también compu): se escribe Studio → 1 s → balde (window.__studioDone) → ~2,5 s después recién las imágenes solas.
- 31/10 (PUBLICADO): página nueva `servicios.html` (base de portfolio.html): "Servicios y planes" + Lo que hago + Elegí tu plan
  completo. El menú "Servicios" lleva ahí en las 3 páginas. En el INICIO ya no están los planes: después de "Lo que hago" va
  `#planes-ir` (`.plan-cta`): "Elegí tu plan" pintado con marcador AZUL + botón NARANJA "Ver planes →" a la derecha.
  Celular: portada SIN descripción, BOSIO centrado; la 1ª tanda sola sale detrás de BOSIO difuminada (`.soft`).
  "Hago…" rota: páginas web, flyers con IA, diseños con IA, desarrollos, producciones digitales, campañas con IA,
  tiendas online, videos con IA, webs con animaciones.
- 31/10 (PUBLICADO): en CELULAR el contenido del menú (`.top .wrap`) baja junto con la franja naranja al entrar (.pre/.drop). En compu sin cambios.
