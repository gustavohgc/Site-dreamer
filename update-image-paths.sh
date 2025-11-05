#!/usr/bin/env bash
set -e

ROOT="/workspaces/Site-dreamer/Dreamer Imports"
HTML_DIR="$ROOT/html"

if [ ! -d "$HTML_DIR" ]; then
  echo "Pasta não encontrada: $HTML_DIR" >&2
  exit 1
fi

cd "$HTML_DIR"

# Para cada HTML, corrige src de imagens para ../img/<arquivo>
for f in *.html; do
  [ -f "$f" ] || continue

  # 1) src="nome.png"  -> src="../img/nome.png"
  perl -0777 -pi -e 's/src=(["'"'"'])(?!https?:|\/|\.\/|\.\.\/|.*?img\/)([^"'"'"'>]+\.(?:png|jpg|jpeg|svg|webp|gif))\1/src=$1..\/img\/$2$1/ig' "$f"

  # 2) src="./nome.png" -> src="../img/nome.png"
  perl -0777 -pi -e 's/src=(["'"'"'])\.\/([^"'"'"'>]+\.(?:png|jpg|jpeg|svg|webp|gif))\1/src=$1..\/img\/$2$1/ig' "$f"

  # 3) src="img/nome.png" -> src="../img/nome.png"
  perl -0777 -pi -e 's/src=(["'"'"'])img\/([^"'"'"'>]+\.(?:png|jpg|jpeg|svg|webp|gif))\1/src=$1..\/img\/$2$1/ig' "$f"

  echo "Atualizado: $f"
done

echo "Concluído. Coloque os arquivos de imagem em: $ROOT/img"