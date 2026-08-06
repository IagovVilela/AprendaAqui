#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
HTML="file://${DIR}/poster-aprenda-aqui.html"
CHROME="${CHROME:-google-chrome}"

"$CHROME" --headless=new --disable-gpu --no-sandbox \
  --virtual-time-budget=10000 \
  --run-all-compositor-stages-before-draw \
  --print-to-pdf="${DIR}/poster-aprenda-aqui.pdf" \
  --no-pdf-header-footer \
  "$HTML"

"$CHROME" --headless=new --disable-gpu --no-sandbox \
  --window-size=1200,1697 \
  --screenshot="${DIR}/poster-aprenda-aqui.png" \
  --default-background-color=FFFFFFFF \
  "$HTML"

echo "Gerado: ${DIR}/poster-aprenda-aqui.pdf e .png"
