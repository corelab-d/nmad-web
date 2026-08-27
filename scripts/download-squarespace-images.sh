#!/bin/bash
# Descarga todas las imágenes de Squarespace organizadas por artista

DEST="$HOME/DEV/nmad-imagenes"
URLS_FILE="$(dirname "$0")/../data/squarespace-urls.txt"

mkdir -p "$DEST"

echo "Descargando imágenes a $DEST..."
count=0
fail=0

while IFS= read -r url; do
  filename=$(basename "$url" | cut -d'?' -f1)
  if [ ! -f "$DEST/$filename" ]; then
    curl -sL "$url" -o "$DEST/$filename"
    if [ $? -eq 0 ]; then
      ((count++))
    else
      echo "ERROR: $url"
      ((fail++))
    fi
  fi
done < "$URLS_FILE"

echo "Listo: $count descargadas, $fail errores"
