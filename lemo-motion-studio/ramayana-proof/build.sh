#!/usr/bin/env bash
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
: "${LEMO_ROOT:?Set LEMO_ROOT to the pinned Lemo checkout}"
mkdir -p "$HERE/out" "$HERE/assets"
cp /usr/share/fonts/truetype/noto/NotoSerifDevanagari-Regular.ttf "$HERE/assets/"
cp /usr/share/fonts/truetype/noto/NotoSansDevanagari-Regular.ttf "$HERE/assets/"
python3 "$HERE/voice.py"
python3 "$HERE/audio.py"
node "$LEMO_ROOT/core/render/still.mjs" "$HERE" 3 10 21 29 38 44 49 --size 1280x720 --out "$HERE/out/stills" 2>&1 | tee "$HERE/out/render-log.txt"
node "$LEMO_ROOT/core/render/video.mjs" "$HERE" --size 1280x720 --fps 24 --workers 3 --out "$HERE/out/picture.mp4" 2>&1 | tee -a "$HERE/out/render-log.txt"
ffmpeg -y -v warning -i "$HERE/out/picture.mp4" -i "$HERE/out/mix.wav" -map 0:v -map 1:a -c:v copy -af loudnorm=I=-14:TP=-1.2:LRA=11 -c:a aac -b:a 192k -ar 48000 -movflags +faststart -t 54 "$HERE/out/Ramayana_Three_Styles_Proof.mp4"
