# Página de Camilo Bosio — memoria del proyecto

Sitio personal de Camilo Bosio (Rosario, Argentina): portfolio + servicios + planes.
Publicado con GitHub Pages en https://camilobosio.github.io/ (rama `main`, carpeta raíz).
Hablarle a Camilo en español rioplatense, simple y sin tecnicismos.

## Estructura
- `index.html` — toda la página (HTML + CSS + JS en un solo archivo, sin build).
- `images/` — capturas de M Perfumerie, foto de Camilo.
  - `logo.svg` + `logo-180.png` = logo "M1": CB de líneas rectas estilo circuito, pintada en naranja→rosa y chorreando pintura, sobre fondo violeta (arte + tecnología; elegido entre muchas pruebas), usado como ícono de la pestaña y en la barra superior. `icono.jpg` (foto de Camilo) ya no se usa: Camilo no quiere su cara en la pestaña.
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

## Estilo
- Colores: violeta (`--violet`) como principal + **naranja del logo** (`--orange`, `--paint` = degradé naranja→rosa) como acento
  (frases que rotan en la portada, puntos de la cinta, números de pasos, todo lo del servicio "Contenido con IA").
- Sección "Quién está detrás": Camilo es el **creativo**, no solo alguien que automatiza con IA: idea, propone opciones,
  se adapta a lo que quiere el cliente, diseña, programa y desarrolla (páginas, publicidades, videos, fotos).

## Posicionamiento (decidido)
La página es general, no "solo páginas web": **diseño web + contenido con IA** (campañas publicitarias, flyers, fotos de producto, videos, interacciones para webs).

Dos servicios, dos planes cada uno (sin precios, botón "Consultar" por WhatsApp):
1. **Páginas web**: Esencial y Premium (Premium = como M Perfumerie).
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
  Muestran el valor del plan Premium web; Esencial = formato de tienda + carga de productos.
- Galería "Publicidades hechas con IA" (`#contenido`): mosaico con filtros por rubro (`.cats`, botones con `data-f`)
  y visor a pantalla completa. Cada pieza es un `<button class="tile" data-cat="...">` con `<img>` o `<video>` y un `.cap`
  (título en `<b>` + tipo de pieza). Para sumar un rubro nuevo: agregar botón en `.cats` + tiles con ese `data-cat`.
  Rubros actuales: `perfumes`, `personas` ("Videos con personas").
- Videos: en el mosaico se reproducen solos y mudos al verse; en el visor se abren con sonido.

## Probador virtual (`probador/`, landing aparte; en el portfolio es un CASO como M Perfumerie: `.case.case-2#probador`)
Pedido de Camilo: landing tipo tienda de ropa, modelo con pelo rapado, encuadre de torso (sin zapatillas), deslizar para
cambiarle camperas/buzos y gorros. Marca ficticia "PROBADOR · DEMO" (no es tienda real).
- Modelo base: Higgsfield job 964f6c99 (nano_banana_pro 4:5 2k). Cada prenda = edición de esa foto con nano_banana_pro
  ("keep everything else pixel-identical"): la pose queda igual al píxel, así que se cambian sin que el modelo se mueva.
- `prendas/<id>.webp` (1080×1341) + `-mini.webp`. Jobs: capucha gris 1adb02de, buzo negro 5f336093, jean f3886ce5,
  bomber 6aa6adb7, puffer 58491609, rompevientos 080300f6, cuero dbdf1e10, varsity 357b987d.
- Gorros (jobs 29b44cec gorra, 221ad967 gorro lana, 3af00e03 piluso, 15663201 trucker): recortados como PNG transparente
  comparando con la foto base (diferencia de píxeles) → `gorros/*.webp`, con su caja en % en `HATS` del JS. Van encima de
  cualquier prenda.
- Giro 360°: video Kling 3.0 pro 5 s (start = end = foto de la prenda, ~8,75 créditos) → 60 cuadros en tira
  `giros/<id>.webp` (10 columnas de 540×670). Botón "Girar 360°": arrastrar gira, inercia corta, imán al frente, nunca sola.
- El caso del portfolio muestra videos grabados de la landing (`portfolio/probador/probador-pc.mp4` 1440×900 y
  `probador-celular.mp4` 390×844, Playwright recordVideo + cursor dibujado + ffmpeg H.264). Regrabarlos al sumar prendas.
- Camilo NO quiere publicar el probador hasta que estén sus camperas Adidas.
- Sumar prenda: editar la foto base con nano_banana_pro, generar el giro, agregar en `TOPS` (id, cat, name, desc).
- Pendiente: Camilo pasó fotos de 4 camperas Adidas (negra con franjas beige, blanca equipo Audi F1, marrón de trabajo
  con cuello de corderoy, gris con capucha y franjas). Hay que subirlas a Higgsfield (widget) para ponérselas al modelo.

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
