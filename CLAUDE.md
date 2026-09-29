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
- `Camilo-Bosio-Paginas-web.pdf` — PDF de planes. Solo tiene los planes de páginas web (falta sumar el de IA).

## Posicionamiento (decidido)
La página es general, no "solo páginas web": **diseño web + contenido con IA** (campañas publicitarias, flyers, fotos de producto, videos, interacciones para webs).

Dos servicios, dos planes cada uno (sin precios, botón "Consultar" por WhatsApp):
1. **Páginas web**: Esencial y Premium (Premium = como M Perfumerie).
2. **Contenido con IA**: Básico y Premium. Lo que cambia son los créditos de IA → más videos, más largos, más opciones/variantes.
   Todavía sin cantidades concretas: pedirle a Camilo números (cantidad y duración de videos por plan) si los quiere.

## Portfolio (sección `#trabajo`)
- Caso M Perfumerie (mperfumerie.com.ar), página web real.
- Sección "Experiencia interactiva" (`#interactivo`, clases `.ix-*`): 4 demos jugables que recrean interacciones reales de
  M Perfumerie (estrellas que explotan junto a "Tendencias", caja de regalo que se abre en "Nuevos ingresos", brillo al pasar
  por los botones/burbujas, destellos dorados al tocar el flyer). Muestra el valor del plan Premium web; Esencial = formato
  de tienda + carga de productos. En celular se animan solas cuando están a la vista.
- Galería "Publicidades hechas con IA" (`#contenido`): mosaico con filtros por rubro (`.cats`, botones con `data-f`)
  y visor a pantalla completa. Cada pieza es un `<button class="tile" data-cat="...">` con `<img>` o `<video>` y un `.cap`
  (título en `<b>` + tipo de pieza). Para sumar un rubro nuevo: agregar botón en `.cats` + tiles con ese `data-cat`.
  Rubros actuales: `perfumes`, `personas` ("Videos con personas").
- Videos: en el mosaico se reproducen solos y mudos al verse; en el visor se abren con sonido.

## Pendiente (semana en curso)
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
