# Lecciones (correcciones de Camilo) — leer al empezar cada sesión

## Entender el pedido antes de producir
- "Modelo 3D de producto" = un MODELO 3D REAL (GLB que se gira libre), generado desde fotos/videos del producto.
  NO son videos que se arrastran. Si dudo entre dos interpretaciones, preguntar antes de gastar créditos.
- Cuando pasa links o fotos de un producto real, el resultado tiene que ser ESE producto, detalle por detalle.
  Verificar contra la foto (logos, costuras, vivos, cuello) antes de mostrarlo; no aproximar.
- Para mostrar ropa/productos: la PRENDA SOLA, sin personas (salvo que lo pida).

## Estructura de la página
- Nada de páginas sueltas tipo "landing aparte": los ejemplos van DENTRO del portfolio, como la campera 360.
- El inicio son pantallazos cortos; lo completo va en portfolio.html. En celular no tiene que ser eterno.
- Nunca nada gira solo (campera, probador, 3D).

## Forma de trabajar
- Plan primero en tasks/todo.md con ítems tildables; avisar el plan antes de implementar lo grande.
- No dar nada por terminado sin probarlo (Playwright en 1280px y 390px, sin scroll horizontal, sin errores).
- Si algo sale torcido, frenar y replanificar, no seguir empujando.
- No publicar en main sin que Camilo diga que sí.
- Hablarle simple, en rioplatense, sin tecnicismos.

## Técnicas que funcionaron
- Editar la MISMA foto base con nano_banana_pro ("keep everything else pixel-identical") da imágenes alineadas al
  píxel: sirve para probadores y para encadenar estados.
- Kling 3.0 con start = end image da giros 360° perfectos que vuelven al frente.
- Para 3D: primero una lámina de 4 vistas limpias (una sola imagen = vistas consistentes), después los motores 3D.
- Cada motor 3D entrega el producto mirando para otro lado: corregir con `giro` en catalogo.json y verificar las 4 vistas.
- El Chromium de pruebas no confía en el proxy: en los tests servir three.js local con page.route.

## YouTube "Día del Juicio Final 2045" (29/9)
- Camilo SIEMPRE escondido: dentro de una casa abandonada/rota, detrás de una pared alta o de una ventana rota,
  filmando de costado hacia la calle. Nunca en el medio de la calle ni detrás de un murito.
- Los robots, drones, autos y motos van LEJOS (si están cerca, lo ven). Excepción: un drone bajo y lento que escanea
  las casas → es cuando él se esconde.
- NINGUNA otra persona en ninguna toma (ni caminando al fondo, ni manejando): está solo. Pedirlo explícito en el prompt.
- Motos robot = futuristas, sin piloto, no una moto común. Autos futuristas sin conductor.
- Edificios robot: construidos desde el piso, de varios pisos, mezclados con casas abandonadas (no apoyados arriba
  de una casa). Algunos con robots enchufados por fuera, otros vidriados mostrando una base de IA por dentro.
- Motos y autos NO los maneja un robot: el vehículo ES el robot y se maneja solo. Nada sentado encima (ni "cabeza
  robot" donde iría el piloto): moto sin asiento ni piloto, autos sin nadie adentro.
- Animaciones que tienen que seguir un trazo EXACTO (pincel sobre el logo): hacerlas con código sobre el SVG real,
  no con video IA (Kling improvisa el grosor y el recorrido).
- Pincel/objetos dibujados con código se ven "emoji": usar una FOTO real generada (fondo verde, recortada) y animarla.
- Landing de la campera: sin texto, sin círculo/anillo de fondo; fondo estilo web3 (luces de colores, grilla fina).
  Todas las prendas con el MISMO tratamiento (nada de resplandor blanco en una sola).
- El logo animado NO va en una sección nueva con texto: chiquito, integrado (al lado del nombre en compu, abajo de todo).
- Balde: que vuelque ELEVADO, con distancia entre el balde y el logo, sobre la línea larga de la B, y que se expanda hacia
  abajo desde ahí. No pegado al logo ni salpicando por todos lados.
- Vista previa de links (WhatsApp): solo el logo.
