# Motor de modelos 3D de producto (modelo-3d-producto/)

Objetivo: cargar fotos o un video de un producto → modelo 3D real, lo más fiel posible → visor profesional.

## Plan
- [x] Vistas limpias: lámina de 4 vistas (nano_banana_pro 4K) a partir de las fotos reales; recorte en 4 cuadradas
- [x] Generar con 3 motores en paralelo (Hunyuan3D v3, Tripo H3.1 multivista, Meshy 7 ultra)
- [x] Procesamiento web (motor/procesar.sh): soldar, simplificar a ~250k triángulos, texturas WebP 2048, meshopt
- [x] Visor nuevo: catálogo, comparar motores, comparar con la foto, vistas rápidas, malla/forma, fondo, sombra
- [x] Orientación por modelo (`giro` en catalogo.json) — verificado frente/3/4/costado/espalda con Tripo
- [x] Sumar Hunyuan y Meshy, comparar los 3 contra las fotos y elegir el más fiel
- [x] Probar el visor en celular (390px) y compu (1280px) — en celular el panel arranca plegado y el encuadre usa el alto libre
- [ ] Segundo producto de prueba (idealmente de tienda, con fotos que pase Camilo) para validar el flujo
- [ ] Entrada por video: sacar 8–12 cuadros alrededor del producto y usarlos como fotos
- [ ] Mostrarlo en el portfolio (dentro, no página suelta) cuando Camilo lo apruebe

## Revisión
- Tripo H3.1 (4 vistas, detailed, PBR): muy fiel en forma, tiras, logo, cierre y puños. 2M triángulos → 250k, 64 MB → 2 MB.
- Hunyuan3D v3: forma buena pero inventó un texto "adidas" en el pecho. Meshy 7 ultra (solo frente): tiras en la espalda
  (la real es lisa) y logo dentro de un parche. Elegido: Tripo.
- Costo de esta prueba: lámina de vistas ~8 + Hunyuan 15 + Tripo 18 + Meshy 44 créditos.
