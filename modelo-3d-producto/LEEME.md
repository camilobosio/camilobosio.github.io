# Producto en 3D — código base

Dos ejemplos en la misma página (se eligen arriba a la derecha):

- **Campera Adidas**: modelo 3D real, generado con Higgsfield a partir de las fotos (frente, costados y espalda).
  Se gira arrastrando con el mouse o el dedo, **nunca gira sola**, y si la soltás casi de frente se acomoda de frente.
  De frente aparece un **tirador naranja en el cuello**: lo agarrás y lo bajás, y la campera se va abriendo
  (arriba del tirador se ve abierta, con la remera; abajo, cerrada). Tocarlo sin arrastrar la abre o cierra entera.
  Abierta también se puede girar.
- **Frasco de perfume**: ejemplo armado con formas, solo para girar.

## Archivos
- `index.html` — el visor (todo el código).
- `campera-cerrada.glb` y `campera-abierta.glb` — los modelos 3D, comprimidos (menos de 2 MB cada uno).

## Cómo verlo
Con doble clic el navegador no deja leer los .glb de la carpeta, así que los busca en internet (en Higgsfield) y tarda un poco más.
Publicado en la página (GitHub Pages) usa los de la carpeta.
Para probar otro producto: arrastrá cualquier archivo .glb encima de la página.

## Ajustes (arriba de todo en `index.html`)
- `ALTO`: tamaño del producto.
- `GIRA_SOLO`: en `false` a propósito.
- `TORSO_NEGRO`: la textura que armó Higgsfield para la campera cerrada tenía el torso blanco; el visor lo pinta
  de negro solo en el torso (las mangas y sus tiras quedan igual).
