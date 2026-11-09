#!/usr/bin/env bash
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
: "${LEMO_ROOT:?Set LEMO_ROOT}"
mkdir -p "$HERE/out"
node "$LEMO_ROOT/core/render/still.mjs" "$HERE" 0 3 7.5 8 12 16 --size 1920x1080 --out "$HERE/out/stills" 2>&1 | tee "$HERE/out/render-log.txt"
node "$LEMO_ROOT/core/render/video.mjs" "$HERE" --size 1920x1080 --fps 30 --workers 2 --out "$HERE/out/picture.mp4" 2>&1 | tee -a "$HERE/out/render-log.txt"
ffmpeg -y -v error -i "$HERE/out/picture.mp4" -i "$HERE/assets/audio.m4a" -map 0:v -map 1:a -c copy -t 17 -movflags +faststart "$HERE/out/Ayodhya_Lemo_Picture_v2.mp4"
