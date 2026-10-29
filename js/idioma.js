/* Idioma: botones ES | EN arriba, al lado de "Escribime" (mismo estilo que sol | luna).
   La página está escrita en español; en inglés se traduce en el navegador con este diccionario (texto exacto → inglés).
   Arranca SIEMPRE en español; la elección se guarda en localStorage (idioma = es/en).
   Un MutationObserver traduce también lo que el JS agrega después (generador, "Ver más", visor, etc.).
   Para sumar un texto nuevo: agregarlo a EN con su traducción (la clave es el texto tal cual, con espacios simplificados). */
(() => {
const EN = {
  // menú y generales
  'Servicios':'Services', 'Portfolio':'Portfolio', 'Cómo trabajo':'How I work', 'Escribime':'Message me',
  'Secciones':'Sections', 'Modo de la página':'Page mode', 'Modo claro':'Light mode', 'Modo oscuro':'Dark mode', 'Idioma':'Language',
  'Español':'Spanish', 'Inglés':'English',
  'Camilo Bosio · Páginas web y contenido con IA':'Camilo Bosio · Websites and AI content',
  'Portfolio · Camilo Bosio':'Portfolio · Camilo Bosio',
  'Páginas web para negocios y contenido con IA para campañas: catálogo, carrito a WhatsApp, panel propio, flyers y videos con IA. Camilo Bosio, Rosario.':'Websites for businesses and AI content for campaigns: catalog, WhatsApp cart, your own admin panel, AI flyers and videos. Camilo Bosio, Rosario, Argentina.',
  // portada
  'Contenido con inteligencia artificial, visuales para campañas y páginas web. Diseño, desarrollo y producción digital para marcas.':'Artificial intelligence content, campaign visuals and websites. Design, development and digital production for brands.',
  'Contenido con inteligencia artificial, visuales para campañas y páginas web.':'Artificial intelligence content, campaign visuals and websites.', 'Diseño, desarrollo y producción digital para marcas.':'Design, development and digital production for brands.',
  'Ver trabajos':'See work', 'Tema':'Theme', 'Opciones':'Options', 'Tienda online':'Online store', '(e-commerce)':'(e-commerce)', 'Trabajos reales':'Real work', 'Bosio Studio':'Bosio Studio',
  'Hago':'I make', 'páginas web':'websites', 'campañas con IA':'AI campaigns', 'tiendas online':'online stores', 'videos con IA':'AI videos',
  'webs con animaciones':'animated websites', 'flyers con IA':'AI flyers',
  'Hago páginas web y contenido con inteligencia artificial para empresas, marcas y negocios: desde la página de tu empresa para mostrar quiénes son y lo que hacen, hasta tiendas online para vender. Y también campañas publicitarias, flyers, fotos de producto y videos. Pensado para compu y para celular.':'I make websites and artificial intelligence content for companies, brands and businesses: from your company’s website showing who you are and what you do, to online stores to sell. Plus ad campaigns, flyers, product photos and videos. Designed for desktop and mobile.',
  'Hablemos por WhatsApp':'Let’s talk on WhatsApp', 'Ver portfolio':'See portfolio',
  '+640 productos cargados en M Perfumerie':'+640 products loaded on M Perfumerie', 'Compu y celular':'Desktop and mobile',
  'Proyecto real, en uso':'Real project, live',
  'Páginas para empresas':'Company websites', 'Tiendas online':'Online stores', 'Catálogos con carrito':'Catalogs with cart',
  'Panel de administración':'Admin panel', 'Pedidos por WhatsApp':'Orders via WhatsApp', 'Pagos online':'Online payments',
  'Diseño para compu y celular':'Desktop and mobile design', 'Animaciones':'Animations', 'Rediseño de páginas':'Website redesign',
  'Contenido con IA':'AI content', 'Videos para campañas':'Campaign videos',
  'Mi logo: tocalo y le cae un balde de pintura':'My logo: tap it and a bucket of paint falls on it',
  'La página de M Perfumerie en un celular':'The M Perfumerie website on a phone',
  'Portada de M Perfumerie en el celular':'M Perfumerie home page on mobile',
  'Productos destacados de M Perfumerie':'M Perfumerie featured products', 'Ficha de un perfume en M Perfumerie':'A perfume’s page on M Perfumerie',
  'Mi logo animado':'My animated logo', 'Mi logo pintado con pincel. Tocalo para repetir':'My logo painted with a brush. Tap it to repeat',
  // servicios
  'Lo que hago por tu marca':'What I do for your brand',
  'Dos servicios: tu página web y el contenido para promocionarla. La página puede ser para mostrar tu empresa o emprendimiento, o una tienda online para vender. Trabajo con inteligencia artificial, así llego más rápido y a menor costo a un resultado profesional, hecho a medida de tu marca.':'Two services: your website and the content to promote it. The website can showcase your company or venture, or be an online store to sell. I work with artificial intelligence, so I reach a professional result faster and at a lower cost, tailored to your brand.',
  'Página web':'Website', 'Página para tu empresa':'A website for your company',
  'La página de tu empresa o marca, desde cero: quiénes son, qué hacen, sus servicios y trabajos, y cómo contactarlos. No hace falta vender nada online.':'Your company or brand website, from scratch: who you are, what you do, your services and work, and how to reach you. No need to sell anything online.',
  'Tienda online (e-commerce)':'Online store (e-commerce)',
  'Si vendés, la página suma catálogo, buscador y carrito. La compra se termina en la misma página (Mercado Pago, débito, crédito o transferencia) o te llega el pedido por WhatsApp con el detalle listo.':'If you sell, the website adds a catalog, search and cart. Purchases are completed on the site (Mercado Pago, debit, credit or bank transfer) or the order reaches you on WhatsApp with all the details.',
  'Mejorar tu página':'Improve your website',
  'Si ya tenés una, la actualizo: diseño más moderno, más rápida, bien armada para compu y celular y más fácil de administrar.':'If you already have one, I update it: a more modern design, faster, well built for desktop and mobile, and easier to manage.',
  'Página de administrador':'Admin page',
  'Una página solo para vos, a la que entrás con tu mail y contraseña: cambiás textos, fotos y publicidades, y si vendés, también productos, precios y stock, y ves las compras que te hicieron.':'A page just for you, where you log in with your email and password: change texts, photos and ads, and if you sell, also products, prices and stock, and see the orders you received.',
  'Fotos y flyers':'Photos and flyers',
  'Fotos de producto, flyers y portadas creadas con IA para tus publicaciones, historias y la portada de tu página.':'Product photos, flyers and covers made with AI for your posts, stories and your website’s home page.',
  'Videos con IA para publicidades, reels y animaciones para tu página, con variantes para probar qué funciona mejor.':'AI videos for ads, reels and animations for your website, with variants to test what works best.',
  // planes
  'Elegí tu plan':'Choose your plan',
  'Elegí tu página web, el contenido con IA, o los dos. Cada servicio tiene un plan para arrancar y uno Premium.':'Choose your website, AI content, or both. Each service has a starter plan and a Premium one.',
  'Páginas web':'Websites',
  'Sirven para la página de una empresa (quiénes son, servicios, trabajos y contacto) o para una tienda online. Los dos incluyen tu marca y una página de administrador, con tu mail y contraseña, para que actualices todo vos. Premium suma una':'They work for a company website (who you are, services, work and contact) or for an online store. Both include your branding and an admin page, with your email and password, so you can update everything yourself. Premium adds an',
  'experiencia interactiva':'interactive experience', 'que hace que tu página se recuerde.':'that makes your website memorable.',
  'Básico':'Basic', 'Premium':'Premium', 'Consultar':'Ask', 'Ver menos':'See less',
  'La página de tu empresa o tu tienda online, prolija, rápida y fácil de mantener.':'Your company website or online store: clean, fast and easy to maintain.',
  'Diseño con tu logo, colores y datos':'Design with your logo, colors and details',
  'Secciones de tu empresa: quiénes son, servicios, trabajos y contacto':'Sections for your company: who you are, services, work and contact',
  'Si vendés: catálogo con buscador, categorías y ficha de cada producto':'If you sell: catalog with search, categories and a page for each product',
  'Carrito: el pedido se termina por WhatsApp o dentro de la página (Mercado Pago, débito, crédito o transferencia)':'Cart: orders are completed via WhatsApp or on the site (Mercado Pago, debit, credit or bank transfer)',
  'Página de administrador (entrás con tu mail y contraseña) para cambiar textos y fotos, y cargar productos, precios y stock':'Admin page (log in with your email and password) to change texts and photos, and add products, prices and stock',
  'Portada con carrusel de fotos y publicidades que cambiás desde el panel':'Home page with a photo and ad carousel you change from the panel',
  'Registro de las compras en el panel':'Order history in the panel', 'Datos de contacto editables desde el panel':'Contact details editable from the panel',
  'Publicación en tu dominio':'Published on your domain',
  'Para marcas que quieren destacarse: una página interactiva, que se mueve y responde al mouse y al toque, y hace que tu marca se recuerde.':'For brands that want to stand out: an interactive website that moves and responds to the mouse and touch, and makes your brand memorable.',
  'Todo lo del plan Básico':'Everything in the Basic plan',
  'Página interactiva: títulos con destellos, cajas que se abren, burbujas que responden y flyers que reaccionan al toque':'Interactive website: sparkling titles, opening boxes, responsive bubbles and flyers that react to touch',
  'Intro animada con tu logo, y títulos y secciones con animación':'Animated intro with your logo, plus animated titles and sections',
  'Ficha con galería deslizable y animación de apertura':'Product page with a swipeable gallery and opening animation',
  'Filtros avanzados, marcas y orden por precio':'Advanced filters, brands and sort by price',
  'Variantes (tamaños o talles) con precio y stock propios':'Variants (sizes) with their own price and stock',
  'Productos destacados con sello animado':'Featured products with an animated badge', 'Portada y flyers creados con IA':'Home page and flyers made with AI',
  'Ver interacciones':'See interactions', '¿Ya tenés página?':'Already have a website?',
  'La reviso y te propongo mejoras: diseño, velocidad, que se vea bien en compu y celular, pagos online o un panel para que la actualices vos.':'I review it and suggest improvements: design, speed, looking good on desktop and mobile, online payments or a panel so you can update it yourself.',
  'Pedir una revisión':'Request a review', 'Descargar PDF':'Download PDF (Spanish)',
  'Imágenes y videos creados con inteligencia artificial para tus campañas, redes y página. Lo que cambia entre planes son los créditos de IA: más créditos, más videos, más largos y más opciones.':'Images and videos made with artificial intelligence for your campaigns, social media and website. What changes between plans is the AI credits: more credits, more videos, longer ones and more options.',
  'Para empezar a publicar con contenido profesional sin hacer una producción de fotos.':'To start posting professional content without a photo shoot.',
  'Fotos de producto y flyers con tu marca':'Product photos and flyers with your brand', 'Videos cortos para reels, historias y anuncios':'Short videos for reels, stories and ads',
  'Textos para acompañar cada publicación':'Copy for every post', 'Créditos de IA incluidos para la campaña':'AI credits included for the campaign',
  'Formatos listos para Instagram, WhatsApp y tu página':'Formats ready for Instagram, WhatsApp and your website',
  'Más créditos de IA':'More AI credits',
  'Para campañas publicitarias completas: más volumen, videos más largos y más opciones para elegir.':'For full ad campaigns: more volume, longer videos and more options to choose from.',
  'Más créditos de IA para toda la campaña':'More AI credits for the whole campaign', 'Más videos y de mayor duración':'More and longer videos',
  'Más variantes de cada pieza para probar en tus anuncios':'More variants of each piece to test in your ads',
  'Campañas completas para publicidad en redes':'Full campaigns for social media ads', 'Animaciones e interacciones con IA para tu página web':'AI animations and interactions for your website',
  // ¿Qué vamos a crear?
  '¿Qué vamos a crear?':'What are we creating?',
  'Escribí tu idea o subí una foto (tu logo, un producto) y probá. Es una':'Write your idea or upload a photo (your logo, a product) and try it. It’s a',
  'prueba básica':'basic test', ', lo que una IA arma en segundos; el trabajo real lo pulimos juntos, a medida de tu marca.':', what an AI puts together in seconds; we polish the real work together, tailored to your brand.',
  'Crear':'Create', 'Variaciones':'Variations', 'Modo':'Mode', 'Generar':'Generate',
  'Logo con una M':'Logo with an M', 'Logo para “Luna Café”':'Logo for “Luna Café”', 'Variaciones de un logo':'Variations of a logo', 'Flyer con tu producto':'Flyer with your product',
  'Tu foto no se sube a ningún lado: todo pasa en tu navegador.':'Your photo isn’t uploaded anywhere: everything happens in your browser.',
  'Generando…':'Generating…', 'Generar otras':'Generate more', 'Pulirlo con Camilo':'Polish it with Camilo',
  'Creá un logo con una M…':'Create a logo with an M…', 'Hacé variaciones de mi logo…':'Make variations of my logo…', 'Un logo para “Luna Café”…':'A logo for “Luna Café”…',
  'Un flyer para mi producto…':'A flyer for my product…', 'Agregar una foto':'Add a photo', 'Sacar la foto':'Remove photo',
  'Variaciones de mi logo':'Variations of my logo', 'Escribí una idea o subí una foto con el +':'Write an idea or upload a photo with the +',
  'Subí la foto del producto':'Upload the product photo', 'Mirando tu foto…':'Looking at your photo…', 'Probando fondos y colores…':'Trying backgrounds and colors…',
  'Armando variaciones…':'Building variations…', 'Leyendo tu idea…':'Reading your idea…', 'Acomodando la foto…':'Placing the photo…', 'Diseñando el flyer…':'Designing the flyer…',
  'Sacando colores de tu foto…':'Picking colors from your photo…', 'Probando colores…':'Trying colors…', 'Dibujando logos…':'Drawing logos…',
  'Pintura':'Paint', 'Monograma':'Monogram', 'Ícono':'Icon', 'Retro':'Retro', 'Sobre color':'On color', 'Degradé':'Gradient', 'Blanco y negro':'Black and white',
  'Duotono':'Duotone', 'Insignia':'Badge', 'Tarjeta':'Card', 'Flyer oscuro':'Dark flyer', 'Flyer color':'Color flyer', 'Flyer elegante':'Elegant flyer',
  'Logo de Camilo':'Camilo’s logo', 'Descargar':'Download', 'Pedí por WhatsApp':'Order on WhatsApp', 'Nuevo en la tienda':'New in store',
  'Solo una prueba':'Just a test', 'logo de ejemplo':'sample logo',
  // portfolio del inicio
  'M Perfumerie':'M Perfumerie', 'Publicidades':'Ads', 'Videos con personas':'Videos with people', 'Contenido interactivo':'Interactive content',
  'Producto 360':'360° product', 'Ver todo el portfolio →':'See the full portfolio →',
  // cómo trabajo
  'Charlamos':'We talk', 'Me contás qué hacés, a quién le vendés y qué necesitás: una página, contenido o los dos.':'You tell me what you do, who you sell to and what you need: a website, content or both.',
  'Ideas y opciones':'Ideas and options', 'Te propongo ideas y distintas opciones con tu marca, o sigo la que ya tenés en mente.':'I suggest ideas and different options for your brand, or follow the one you already have in mind.',
  'Ajustamos juntos':'We fine-tune together', 'Vas viendo avances por WhatsApp y corregimos hasta que quede como querés.':'You see progress on WhatsApp and we adjust until it’s just how you want it.',
  'Entrega':'Delivery', 'Publicamos tu página y te llevás las piezas listas para usar en redes y anuncios.':'We publish your website and you get the pieces ready to use on social media and ads.',
  // quién
  'Arrastrala · tocala para darla vuelta':'Drag it · tap it to flip it', 'Credencial de Camilo Bosio: tocala para darla vuelta':'Camilo Bosio’s badge: tap it to flip it',
  'Quién está detrás':'Who’s behind it', 'Ideas, diseño y desarrollo':'Ideas, design and development',
  'Más allá de la inteligencia artificial, lo que aporto es la idea. Propongo conceptos y opciones, los diseño y los desarrollo hasta el resultado final: páginas web, publicidades, videos y fotos para tu marca.':'Beyond artificial intelligence, what I bring is the idea. I propose concepts and options, then design and develop them through to the final result: websites, ads, videos and photos for your brand.',
  'Si ya tenés una idea clara, me adapto a ella; si no, la construimos juntos. Todo el proceso lo coordinás directamente conmigo.':'If you already have a clear idea, I adapt to it; if not, we build it together. You coordinate the whole process directly with me.',
  'Ideación':'Ideation', 'Diseño':'Design', 'Programación':'Programming', 'Desarrollo':'Development', 'Dirección creativa':'Creative direction',
  'Conceptos y propuestas':'Concepts and proposals', 'Campañas publicitarias':'Ad campaigns', 'Fotos de producto':'Product photos', 'Programación con IA':'AI-assisted programming',
  'Con qué trabajo':'What I work with', 'Ideas y textos':'Ideas and copy', 'Fotos y videos con IA':'AI photos and videos', 'Contenido de marca':'Brand content',
  'Diseño y flyers':'Design and flyers', 'Edición de fotos':'Photo editing', 'Logos y vectores':'Logos and vectors', 'Diseño de páginas':'Web design',
  'Editor de código':'Code editor', 'Animación y sonido con código':'Animation and sound with code', 'Publicar páginas':'Publishing websites',
  'Videos con IA':'AI videos', 'Imágenes con IA':'AI images', 'Voces con IA':'AI voices', 'Música con IA':'AI music', 'Edición de video':'Video editing', 'Animación':'Animation',
  // contacto
  '¿Arrancamos tu proyecto?':'Shall we start your project?', 'Copiar':'Copy', 'Copiado':'Copied', 'Escribime por WhatsApp':'Message me on WhatsApp', 'Volver arriba ↑':'Back to top ↑',
  // portfolio
  'Lo que hice':'What I’ve made',
  'Publicidades y videos con IA, páginas web, contenido interactivo y prototipos. Todo real: tocá, arrastrá y probá.':'AI ads and videos, websites, interactive content and prototypes. All real: tap, drag and try.',
  'Prototipos':'Prototypes', 'Ir a':'Go to', 'Publicidades hechas con IA':'Ads made with AI',
  'Fotos de producto, banners, flyers con precio y videos creados con inteligencia artificial, y cómo se ven puestos en la calle. Incluso escenas con una persona real a partir de un par de fotos, desde distintos ángulos y hablando con su propia voz.':'Product photos, banners, flyers with prices and videos made with artificial intelligence, and how they look out on the street. Even scenes with a real person from just a couple of photos, from different angles and speaking in their own voice.',
  'Filtrar por rubro':'Filter by category', 'Todo':'All', 'Perfumes':'Perfumes', 'En la calle':'On the street',
  'Día de la Madre · M Perfumerie':'Mother’s Day · M Perfumerie', 'Publicidad animada para historias':'Animated ad for stories',
  'Publicidad animada Día de la Madre, M Perfumerie':'Animated Mother’s Day ad, M Perfumerie',
  'Cartel en altura · 1 Million':'Billboard · 1 Million', 'Banner en la calle':'Street banner', 'Foto de producto':'Product photo',
  'Colección de perfumes':'Perfume collection', 'Banner de campaña':'Campaign banner', 'Historia vertical':'Vertical story',
  'Escena con IA – Persona en Ferrari · ángulo 1':'AI scene – Person in a Ferrari · angle 1', 'Escena con IA – Persona en Ferrari · ángulo 2':'AI scene – Person in a Ferrari · angle 2',
  'Escena con IA – Persona en Ferrari · ángulo 3':'AI scene – Person in a Ferrari · angle 3',
  'Escena con IA, persona en Ferrari, ángulo 1':'AI scene, person in a Ferrari, angle 1', 'Escena con IA, persona en Ferrari, ángulo 2':'AI scene, person in a Ferrari, angle 2',
  'Escena con IA, persona en Ferrari, ángulo 3':'AI scene, person in a Ferrari, angle 3',
  'Mi cara, a partir de un par de fotos':'My face, from a couple of photos',
  'Escena con IA – Tesla volador':'AI scene – Flying Tesla', 'Me puse en lugar del actor, hablando con mi voz real':'I replaced the actor with myself, speaking in my real voice',
  'Escena con IA: un Tesla volador aterriza en una terraza y me bajo a hablar a cámara':'AI scene: a flying Tesla lands on a rooftop and I step out to talk to the camera',
  'Afiche en la pared · Polo Sport':'Wall poster · Polo Sport', 'Flyer en la calle':'Street flyer', 'Video de producto':'Product video', 'Video con IA':'AI video',
  'Flyer con precio':'Flyer with price', 'Lanzamiento de la página · M Perfumerie':'Website launch · M Perfumerie',
  'Reel con la página en la compu y el celular':'Reel showing the website on desktop and mobile',
  'Reel de lanzamiento de la página de M Perfumerie, en la compu y el celular':'Launch reel for the M Perfumerie website, on desktop and mobile',
  'Vidriera · Tommy Now':'Shop window · Tommy Now', 'Parada de colectivo · 1 Million':'Bus stop · 1 Million', 'Subte · Khamrah Waha':'Subway · Khamrah Waha',
  'Ver publicidad':'View ad', 'Cerrar':'Close', 'Anterior':'Previous', 'Siguiente':'Next',
  'Portfolio · Página web · 2025 – hoy':'Portfolio · Website · 2025 – today',
  'Tienda de perfumería importada de Rosario. Diseñé y programé toda la página: catálogo con buscador y filtros, fichas con acordes y notas de cada perfume, carrito que envía el pedido por WhatsApp (también se puede cerrar la compra en la página con Mercado Pago o tarjetas) y un panel propio para cargar productos, publicidades y datos de contacto.':'Imported perfume store from Rosario. I designed and programmed the whole website: catalog with search and filters, pages with each perfume’s accords and notes, a cart that sends the order via WhatsApp (purchases can also be completed on the site with Mercado Pago or cards) and a custom panel to manage products, ads and contact details.',
  'Ver captura':'View screenshot', 'Portada':'Home page', 'Ficha de producto':'Product page',
  'perfumes en el catálogo':'perfumes in the catalog', 'secciones editables desde el panel':'sections editable from the panel',
  'diseños: uno para compu y otro para celular':'designs: one for desktop and one for mobile', 'comisiones por venta':'sales commissions',
  'Catálogo con buscador':'Catalog with search', 'Filtros por marca y género':'Filters by brand and gender', 'Carrito a WhatsApp':'WhatsApp cart',
  'Publicidades administrables':'Manageable ads', 'Visitar la página':'Visit the website', 'Abrir mperfumerie.com.ar':'Open mperfumerie.com.ar',
  'Portada de M Perfumerie en computadora, con destellos dorados que suben':'M Perfumerie home page on desktop, with rising golden sparkles',
  'Ficha de producto de M Perfumerie en computadora':'M Perfumerie product page on desktop',
  'En el celular: se toca un perfume y la ficha se abre en grande':'On mobile: tap a perfume and its page opens up',
  'Experiencia interactiva · Plan Premium':'Interactive experience · Premium plan', 'Una página que reacciona':'A website that reacts',
  'En el plan Premium la página no solo muestra productos: responde cuando la tocás. Estas son grabaciones reales de M Perfumerie.':'In the Premium plan the website doesn’t just show products: it responds when you touch it. These are real recordings from M Perfumerie.',
  'Títulos con destellos':'Sparkling titles',
  'Las estrellas al lado de "Tendencias" laten y, al pasar el mouse, sueltan un anillo de luz con chispas en forma de estrella.':'The stars next to “Trending” pulse and, on hover, release a ring of light with star-shaped sparks.',
  'Cajas que se abren':'Opening boxes',
  'A cada lado de "Nuevos ingresos" hay una caja: las solapas se abren hacia afuera y de adentro sale un destello dorado.':'On each side of “New arrivals” there’s a box: the flaps open outward and a golden sparkle comes out.',
  'Burbujas que responden':'Responsive bubbles',
  'Los botones del inicio se iluminan en dorado y se elevan al pasar por encima; al tocarlos rebotan con un sonidito de burbuja.':'The home page buttons light up in gold and rise on hover; when tapped they bounce with a little bubble sound.',
  'Un flyer que responde':'A flyer that responds',
  'La portada tiene polvo dorado que sube y titila; cada toque en la foto suelta un rocío dorado, como el spray de un perfume.':'The home page has rising, twinkling gold dust; every tap on the photo releases a golden mist, like a perfume spray.',
  'Títulos con destellos, grabado en M Perfumerie':'Sparkling titles, recorded on M Perfumerie', 'Cajas que se abren, grabado en M Perfumerie':'Opening boxes, recorded on M Perfumerie',
  'Burbujas que responden, grabado en M Perfumerie':'Responsive bubbles, recorded on M Perfumerie', 'Un flyer que responde, grabado en M Perfumerie':'A flyer that responds, recorded on M Perfumerie',
  'Ropa · Hecho con IA':'Clothing · Made with AI',
  'Probá girar la campera y abrirle el cierre. Arrastrala desde cualquier lado para verla de todos los ángulos; acercate al cierre, agarralo y bajalo para descubrir la remera. Un clic la vuelve a cerrar.':'Try spinning the jacket and opening its zipper. Drag it from anywhere to see it from every angle; go to the zipper, grab it and pull it down to reveal the T-shirt. One click closes it again.',
  'Las imágenes y los movimientos los generé con inteligencia artificial a partir de las fotos del producto; la interacción la programé yo. Se puede hacer con cualquier producto.':'I generated the images and movements with artificial intelligence from the product photos; I programmed the interaction myself. It can be done with any product.',
  'Arrastrá para girar':'Drag to spin', 'Agarrá el cierre y bajalo':'Grab the zipper and pull it down', 'Preparando la campera…':'Getting the jacket ready…',
  'Arrastrá para girar · Agarrá el cierre':'Drag to spin · Grab the zipper',
  'Así se ve en una tienda: en la compu las camperas flotan y se manejan con el mouse (girar, bajar el cierre, pasar a otra); en el celular, el mismo visor.':'This is how it looks in a store: on desktop the jackets float and you control them with the mouse (spin, unzip, switch to another); on mobile, the same viewer.',
  'Así se ve en una tienda: en la compu las camperas flotan y se manejan con el mouse; en el celular, el mismo visor':'This is how it looks in a store: on desktop the jackets float and you control them with the mouse; on mobile, the same viewer',
  'Campera interactiva: arrastrá para girarla; acercate al cierre, agarralo y bajalo para abrirla. Con el teclado: flechas para girar, Enter para abrir o cerrar':'Interactive jacket: drag to spin it; go to the zipper, grab it and pull it down to open it. With the keyboard: arrows to spin, Enter to open or close',
  'Probador virtual':'Virtual fitting room',
  'Cinco camperas reales de adidas puestas sobre el mismo modelo. Deslizá sobre el modelo (o usá las flechas) para cambiarle la campera.':'Five real adidas jackets on the same model. Swipe over the model (or use the arrows) to change the jacket.',
  'El modelo y las camperas puestas los generé con inteligencia artificial a partir de las fotos de la tienda; la interacción la programé yo. Sirve para cualquier marca de ropa.':'I generated the model and the jackets on him with artificial intelligence from the store’s photos; I programmed the interaction myself. It works for any clothing brand.',
  'Deslizá para cambiar':'Swipe to change', 'Deslizá para cambiar la campera':'Swipe to change the jacket',
  'Probador: deslizá para cambiar la campera. Con el teclado: flechas para cambiar':'Fitting room: swipe to change the jacket. With the keyboard: arrows to change',
  'Campera anterior':'Previous jacket', 'Campera siguiente':'Next jacket', '✓ Listo':'✓ Done', 'Workwear marrón':'Workwear brown',
  'Prototipo · Adaptable para tu empresa':'Prototype · Adaptable to your company', 'Oficina':'Virtual', 'virtual':'office',
  'Una oficina con empleados de inteligencia artificial, adaptable para tu empresa. Cada empleado es un bot que configurás según cómo querés que trabaje: programación, desarrollo, tecnología, marketing, atención al cliente o lo que necesites.':'An office with artificial intelligence employees, adaptable to your company. Each employee is a bot you configure to work the way you want: programming, development, technology, marketing, customer service or whatever you need.',
  'Oficina virtual · prototipo':'Virtual office · prototype', 'Tecnología':'Technology', 'Marketing':'Marketing', 'Atención al cliente':'Customer service',
  'Lo que tu empresa necesite':'Whatever your company needs', 'Quiero una para mi empresa':'I want one for my company',
  'Recorrido por la oficina virtual: vista general, el estudio creativo y el perfil de una empleada con IA':'Tour of the virtual office: overview, the creative studio and the profile of an AI employee',
  'Proyecto personal · Juego 3D':'Personal project · 3D game',
  'Un videoclub de los 2000 que se recorre en primera persona desde el navegador: más de 9.000 películas y juegos en las estanterías, cajas que se sacan y se dan vuelta, heladera, flippers, teles de tubo y música propia. Lo cerré solo para mí.':'A 2000s video rental store you explore in first person from the browser: over 9,000 movies and games on the shelves, cases you can pick up and flip, a fridge, pinball machines, CRT TVs and my own music. I closed it just for me.',
  'Pantalla de inicio de Last Rental':'Last Rental start screen', 'Adentro del videoclub de Last Rental':'Inside the Last Rental video store',
  'Páginas del portfolio':'Portfolio websites', 'Página anterior':'Previous website', 'Página siguiente':'Next website',
  'Portfolio · Página web · En desarrollo':'Portfolio · Website · In development', 'overesthetic · en desarrollo':'overesthetic · in development',
  'Página para Overesthetic, un taller de detailing de autos: vende su curso online y toma turnos. Diseñé y programé toda la página: una intro con una llanta que se convierte en el logo, títulos que brillan, íconos animados en cada módulo del curso, videos de sus trabajos y un panel para que ellos mismos cambien textos, precio, fotos y videos. Todavía no está publicada.':'Website for Overesthetic, a car detailing shop: it sells their online course and books appointments. I designed and programmed the whole site: an intro with a wheel that turns into the logo, glowing titles, animated icons for each course module, videos of their work and a panel so they can change texts, price, photos and videos themselves. Not published yet.',
  'clases del curso, presentadas por módulo':'course lessons, presented by module', 'módulos con íconos animados':'modules with animated icons', 'panel propio para editar todo':'custom panel to edit everything',
  'Portada de Overesthetic en computadora: una llanta entra rodando, se convierte en el logo y vuela hasta el menú':'Overesthetic home page on desktop: a wheel rolls in, turns into the logo and flies up to the menu',
  'Overesthetic en el celular: la intro y el inicio':'Overesthetic on mobile: the intro and home page',
  'Intro animada':'Animated intro', 'Venta del curso':'Course sales', 'Pedido de turnos':'Appointment booking', 'Videos de trabajos':'Work videos', 'Panel para editar':'Editing panel',
  'Próximamente online':'Coming soon', 'Una página con movimiento':'A website in motion',
  'Cada página Premium tiene sus propias interacciones, pensadas para la marca. Estas son grabaciones reales de Overesthetic.':'Every Premium website has its own interactions, designed for the brand. These are real recordings from Overesthetic.',
  'La llanta que se vuelve logo':'The wheel that becomes the logo',
  'Al entrar, una llanta llega rodando, se convierte en el logo y sube volando hasta el menú, dejando humo. Si tocás el logo, suena el motor.':'On arrival, a wheel rolls in, turns into the logo and flies up to the menu, leaving smoke behind. Tap the logo and the engine revs.',
  'Títulos que brillan':'Glowing titles', 'Al pasar el mouse por los títulos grandes, un brillo dorado sigue al cursor sobre las letras.':'When you hover over the big titles, a golden glow follows the cursor across the letters.',
  'Íconos animados':'Animated icons', 'Cada módulo del curso tiene su ícono en movimiento: barras que crecen, burbujas que suben del auto recién lavado, un pulidor que gira.':'Each course module has its own moving icon: growing bars, bubbles rising from a freshly washed car, a spinning polisher.',
  'Reflejo que sigue al mouse':'A reflection that follows the mouse', 'Las tarjetas se iluminan justo donde pasa el mouse, como un reflejo sobre la pintura, y los botones tienen un destello que los cruza.':'Cards light up right where the mouse passes, like a reflection on paint, and the buttons have a gleam that sweeps across them.',
  'La llanta que se vuelve logo, grabado en Overesthetic':'The wheel that becomes the logo, recorded on Overesthetic', 'Títulos que brillan, grabado en Overesthetic':'Glowing titles, recorded on Overesthetic',
  'Íconos animados, grabado en Overesthetic':'Animated icons, recorded on Overesthetic', 'Reflejo que sigue al mouse, grabado en Overesthetic':'A reflection that follows the mouse, recorded on Overesthetic',
  'Prototipo para empresas':'Prototype for companies', 'Oficina virtual':'Virtual office', 'Proyecto personal':'Personal project',
  'Prototipos en proceso':'Prototypes in progress', 'En proceso':'In progress', 'Para empresas':'For companies', 'Experiencia visual':'Visual experience',
  'Experiencia visual · Recorrido 3D':'Visual experience · 3D walkthrough',
  'Un proyecto personal: me armé una habitación ambientada en un videoclub de los 2000, estilo juego, que recorro en primera persona desde el navegador, para ordenar todo lo que tengo en mi PC. Ahí están todas las películas que vi, todos mis juegos y mis imágenes, usadas como cuadros y pósters en las paredes: saco las cajas de los estantes, las doy vuelta, pongo mi música y miro videos en las teles de tubo.':'A personal project: I built myself a room set in a 2000s video rental store, game-style, that I walk through in first person from the browser, to organize everything on my PC. All the movies I’ve watched, all my games and my images are there, used as framed pictures and posters on the walls: I pull cases off the shelves, flip them over, play my music and watch videos on the CRT TVs.',
  'Tocá un empleado para ver su ficha':'Tap an employee to see their profile',
  'La oficina virtual vista desde arriba, con cada empleado en su puesto':'The virtual office seen from above, with each employee at their desk',
  'Me armé una habitación ambientada en un videoclub de los 2000, estilo juego, que recorro en primera persona desde el navegador. Ahí organizo todas las películas que vi y tengo, mis juegos y las imágenes de mi PC: saco las cajas de los estantes, las doy vuelta, pongo mi música y miro videos en las teles de tubo.':'I built myself a room set in a 2000s video rental store, game-style, that I walk through in first person from the browser. There I organize all the movies I’ve watched and own, my games and the images on my PC: I pull cases off the shelves, flip them over, play my music and watch videos on the CRT TVs.'
};
// textos con partes variables
const RX = [
  [/^Ver más \((\d+) más\) ↓$/, m => `See more (${m[1]} more) ↓`],
  [/^(\d+) propuestas base · (.+)$/, m => `${m[1]} base ideas · ${({ 'variaciones de tu foto':'variations of your photo', flyers:'flyers', logos:'logos' })[m[2]] || m[2]}`],
  [/^Descargar (.+)$/, m => 'Download ' + (EN[m[1]] || m[1])],
  [/^(Flyer con precio|Foto de producto|Banner de campaña|Historia vertical): (.+)$/, m => EN[m[1]] + ': ' + (EN[m[2]] || m[2])]
];
const WA_ES = 'Hola Camilo, vi tu página y quería consultarte por tus servicios. ¿Me podrías pasar más información para armar un presupuesto?';
const WA_EN = 'Hi Camilo, I saw your website and wanted to ask about your services. Could you send me more information to put together a quote?';
const ATTRS = ['aria-label', 'alt', 'placeholder', 'title', 'data-t'];

let lang = 'es';
try { if (localStorage.getItem('idioma') === 'en') lang = 'en'; } catch (e) {}
const norm = s => s.replace(/\s+/g, ' ').trim();
function tr(s) { const k = norm(s); if (!k) return null; if (EN[k] !== undefined) return EN[k]; for (const [r, f] of RX) { const m = k.match(r); if (m) return f(m); } return null; }
window.T = s => (lang === 'en' && tr(s)) || s;   // para textos que el JS dibuja en canvas
window.idioma = () => lang;

const origText = new WeakMap(), origAttr = new WeakMap(), done = new WeakSet();
let busy = false;
function textNode(n) {
  if (!n.parentElement || n.parentElement.closest('script,style')) return;
  if (lang === 'en') {
    if (done.has(n) && origText.has(n) && tr(origText.get(n)) === norm(n.nodeValue)) return;
    const t = tr(n.nodeValue); if (t === null) { done.delete(n); return; }
    origText.set(n, n.nodeValue); done.add(n);
    const lead = n.nodeValue.match(/^\s*/)[0], trail = n.nodeValue.match(/\s*$/)[0];
    n.nodeValue = lead + t + trail;
  } else if (origText.has(n) && done.has(n)) { n.nodeValue = origText.get(n); done.delete(n); }
}
function elAttrs(el) {
  let o = origAttr.get(el);
  for (const a of ATTRS) {
    if (!el.hasAttribute(a)) continue;
    const v = el.getAttribute(a);
    if (lang === 'en') {
      const t = tr(v); if (t === null) continue;
      if (!o) { o = {}; origAttr.set(el, o); } o[a] = v; el.setAttribute(a, t);
    } else if (o && o[a] !== undefined && tr(o[a]) === v) { el.setAttribute(a, o[a]); delete o[a]; }
  }
  if (el.tagName === 'A' && el.href.indexOf('wa.me/') > -1) {
    const u = new URL(el.href), want = lang === 'en' ? WA_EN : WA_ES;
    if (u.searchParams.has('text') && u.searchParams.get('text') !== want) { u.searchParams.set('text', want); el.href = u.toString(); }
  }
}
function walk(root) {
  if (root.nodeType === 3) { textNode(root); return; }
  if (root.nodeType !== 1) return;
  elAttrs(root);
  const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let n; while ((n = w.nextNode())) n.nodeType === 3 ? textNode(n) : elAttrs(n);
}
function apply() {
  busy = true;
  document.documentElement.lang = lang;
  if (!document.__t0) document.__t0 = document.title;
  document.title = lang === 'en' ? (tr(document.__t0) || document.__t0) : document.__t0;
  const md = document.querySelector('meta[name="description"]');
  if (md) { if (!md.__o) md.__o = md.content; md.content = lang === 'en' ? (tr(md.__o) || md.__o) : md.__o; }
  walk(document.body);
  document.querySelectorAll('#langSeg button').forEach(b => b.setAttribute('aria-pressed', b.dataset.l === lang));
  busy = false;
}
new MutationObserver(ms => {
  if (busy || lang !== 'en') return;
  busy = true;
  for (const m of ms) {
    if (m.type === 'childList') m.addedNodes.forEach(walk);
    else if (m.type === 'characterData') textNode(m.target);
    else if (m.type === 'attributes') elAttrs(m.target);
  }
  busy = false;
}).observe(document.body, { childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:ATTRS.concat('href') });

document.querySelectorAll('#langSeg button').forEach(b => b.addEventListener('click', () => {
  if (b.dataset.l === lang) return;
  lang = b.dataset.l; try { localStorage.setItem('idioma', lang); } catch (e) {}
  apply();
  // el mosaico y algunos textos cambian de largo: que se reacomoden
  dispatchEvent(new Event('resize'));
}));
apply();
})();
