#!/usr/bin/env bash
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
: "${LEMO_ROOT:?Set LEMO_ROOT to the pinned upstream checkout}"
: "${MODEL_DIR:?Directory with kokoro.onnx and voices.bin}"
PYTHON_BIN=${PYTHON_BIN:-python3}
mkdir -p "$HERE/fonts" "$HERE/voices" "$HERE/out" "$HERE/qa"
cp /usr/share/fonts/truetype/noto/NotoSansDevanagari-Regular.ttf "$HERE/fonts/Hindi.ttf"
cp /usr/share/fonts/truetype/dejavu/DejaVuSans.ttf "$HERE/fonts/Sans.ttf"
cp /usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf "$HERE/fonts/Sans-Bold.ttf"
cp /usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf "$HERE/fonts/Serif.ttf"
"$PYTHON_BIN" "$HERE/voice.py"
"$PYTHON_BIN" "$HERE/audio.py"
node "$LEMO_ROOT/core/render/video.mjs" "$HERE" --fps 24 --workers 3 --out "$HERE/out/picture.mp4" 2>&1 | tee "$HERE/qa/render.log"
ffmpeg -y -v warning -i "$HERE/out/picture.mp4" -i "$HERE/out/mix.wav" -map 0:v -map 1:a -c:v copy -af loudnorm=I=-14:TP=-1.2:LRA=11 -c:a aac -b:a 192k -ar 48000 -t 50.5 -movflags +faststart "$HERE/out/AI_Aa_Gaya_Opening_Proof.mp4"
