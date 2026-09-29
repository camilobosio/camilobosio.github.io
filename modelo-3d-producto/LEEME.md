# Estudio 3D de producto — motor

Motor para pasar de **fotos (o un video) de un producto** a un **modelo 3D real** que se gira, se acerca y se compara
con la foto original. `index.html` es el visor; `catalogo.json` lista los productos y los modelos de cada motor.

## Cómo se agrega un producto (el flujo del motor)
1. **Fuentes**: fotos del producto (frente, costados, espalda, detalles). Sirven fotos de tienda aunque tengan persona.
   Con un video: se sacan 8–12 cuadros alrededor del producto y se usan como fotos.
2. **Vistas limpias** (`productos/<id>/vistas/`): con Higgsfield (nano_banana_pro, 4K) se arma una lámina de 4 vistas
   del producto solo —frente, costado izquierdo, espalda, costado derecho— sobre fondo blanco, misma escala y luz,
   copiando cada detalle de las fotos. Se recorta en `frente.jpg`, `izquierda.jpg`, `espalda.jpg`, `derecha.jpg`
   (cuadradas, 2048 px). Esto es lo que más mejora la fidelidad: los motores 3D trabajan mucho mejor con vistas limpias.
3. **Generar el 3D** con varios motores a la vez (Higgsfield `generate_3d`):
   - `hunyuan3d_v3_image_to_3d` con las 4 vistas, `enable_pbr`, `face_count` 300000 (~15 créditos).
   - `tripo_h3_1_multiview_to_3d` con las 4 vistas en orden frente/izq/espalda/der, calidad `detailed`, PBR (~18).
   - `meshy_v7_image_to_3d` con el frente, `ultra_mode`, PBR (~44).
4. **Procesar** cada GLB para la web: `motor/procesar.sh entrada.glb productos/<id>/<motor>.glb`
   (texturas WebP ≤ 2048, malla comprimida con meshopt; el visor ya trae el decodificador).
5. **Comparar**: en el visor se cambia de motor y se activa "Comparar con la foto"; se deja como `elegido` el más fiel.
6. Sumar el producto a `catalogo.json` (nombre, descripción, fotos por vista, modelos, elegido).

## Visor
- Nunca gira solo (pedido de Camilo). Arrastrar gira con inercia suave; rueda/pellizco acerca hacia donde apuntás;
  doble clic se acerca a ese punto; clic derecho o dos dedos mueven la vista.
- Vistas rápidas (frente, 3/4, costados, espalda), "Comparar con la foto" (muestra la foto real del ángulo que mirás),
  ver la malla, ver solo la forma (sin textura), fondo claro u oscuro, y datos del modelo (triángulos, peso).
- Soltar un `.glb` encima lo muestra.
- Three.js 0.170 por CDN, luz de estudio (RoomEnvironment), sombra suave en el piso, tono ACES.

## Versión 1
La primera prueba (campera con cierre que se abría entre dos modelos) usaba un motor más viejo (Meshy multi-image) y
quedó con textura rara; está en el historial de git (`campera-cerrada.glb`, `campera-abierta.glb`).
