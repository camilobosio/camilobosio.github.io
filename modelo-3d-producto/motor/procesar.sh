#!/usr/bin/env bash
# Deja un modelo 3D (GLB) listo para la web: texturas en WebP de hasta 2048 px, malla comprimida (meshopt),
# vértices soldados y sin partes que sobren. Uso:
#   motor/procesar.sh entrada.glb productos/<producto>/<motor>.glb [triángulos, por defecto 250000]
# Si el modelo tiene más triángulos, se simplifica hasta ese número (el detalle fino queda en la textura de relieve).
# Necesita Node (usa @gltf-transform/cli con npx, no hace falta instalar nada a mano).
set -euo pipefail
in="$1"; out="$2"; target="${3:-250000}"; tmp="$(mktemp -d)"
mkdir -p "$(dirname "$out")"
npx -y @gltf-transform/cli@4 weld "$in" "$tmp/1.glb"
tris=$(npx -y @gltf-transform/cli@4 inspect "$tmp/1.glb" --format csv 2>/dev/null | awk -F, '/TRIANGLES/{gsub(/[^0-9]/,"",$5); s+=$5} END{print s+0}')
if [ "$tris" -gt "$target" ]; then
  ratio=$(python3 -c "print(round($target/$tris, 4))")
  echo "Simplificando $tris -> ~$target triángulos (ratio $ratio)"
  npx -y @gltf-transform/cli@4 simplify "$tmp/1.glb" "$tmp/1s.glb" --ratio "$ratio" --error 0.002
  mv "$tmp/1s.glb" "$tmp/1.glb"
fi
npx -y @gltf-transform/cli@4 prune "$tmp/1.glb" "$tmp/2.glb"
npx -y @gltf-transform/cli@4 resize "$tmp/2.glb" "$tmp/3.glb" --width 2048 --height 2048
npx -y @gltf-transform/cli@4 webp "$tmp/3.glb" "$tmp/4.glb" --quality 88
npx -y @gltf-transform/cli@4 meshopt "$tmp/4.glb" "$out"
rm -rf "$tmp"
ls -la "$out"
