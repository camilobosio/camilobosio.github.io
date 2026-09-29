# Modelo 3D de producto — código base

Visor para mostrar un producto en 3D en la web: se gira arrastrando con el mouse o el dedo (con suavizado),
se acerca con la rueda o pellizcando, y **nunca gira solo**.

## Cómo verlo
Abrí `index.html` con doble clic (Chrome o Edge). Si todavía no hay modelo, aparece un frasco de perfume de muestra.

## Cómo poner el producto real
1. Conseguí el modelo 3D del producto en formato **.glb** (por ejemplo, Higgsfield lo genera a partir de una foto del producto).
2. Para probarlo al toque: arrastralo arriba de la página o usá el botón **"Cargar modelo (.glb)"**.
3. Para dejarlo fijo: guardalo en esta carpeta con el nombre **`modelo.glb`**.
   Ojo: abriendo con doble clic el navegador no deja leer `modelo.glb` solo; ya publicado en la web (GitHub Pages) sí lo abre.

## Ajustes rápidos (arriba de todo en el código de `index.html`)
- `MODELO`: nombre del archivo 3D.
- `TAMANIO`: qué tan grande se ve.
- `GIRA_SOLO`: está en `false` a propósito.
