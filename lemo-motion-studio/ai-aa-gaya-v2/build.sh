#!/usr/bin/env bash
set -euo pipefail
P="$(cd "$(dirname "$0")" && pwd)"
LEMO="${1:?Pass path to Lemo-Opuscar checkout}"
mkdir -p "$P/fonts" "$P/out"
cp /usr/share/fonts/truetype/noto/NotoSansDevanagari-Regular.ttf "$P/fonts/hindi.ttf"
node "$LEMO/core/render/still.mjs" "$P" 2 --out "$P/out" --prefix styleframe-
node "$LEMO/core/render/still.mjs" "$P" 2 --q base=1 --out "$P/out" --prefix base-
