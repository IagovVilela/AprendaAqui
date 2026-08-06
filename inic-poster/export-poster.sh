#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
HTML="file://${DIR}/poster-aprenda-aqui.html"
CHROME="${CHROME:-google-chrome}"

"$CHROME" --headless=new --disable-gpu --no-sandbox \
  --user-data-dir="${TMPDIR:-/tmp}/chrome-poster-data" \
  --virtual-time-budget=10000 \
  --run-all-compositor-stages-before-draw \
  --print-to-pdf="${DIR}/poster-aprenda-aqui.pdf" \
  --no-pdf-header-footer \
  "$HTML"

if command -v python3 >/dev/null; then
  (cd "$DIR" && python3 - <<'PY'
import sys
try:
    import fitz
except ImportError:
    sys.exit(0)
doc = fitz.open("poster-aprenda-aqui.pdf")
pix = doc[0].get_pixmap(matrix=fitz.Matrix(2, 2))
pix.save("poster-aprenda-aqui.png")
print(f"PNG: {pix.width}x{pix.height}")
PY
)
fi

echo "Gerado: ${DIR}/poster-aprenda-aqui.pdf e .png"
