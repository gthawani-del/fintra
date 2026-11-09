#!/usr/bin/env bash
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
: "${LEMO_ROOT:?Set LEMO_ROOT to pinned Lemo checkout}"
mkdir -p "$HERE/out"
node "$LEMO_ROOT/core/render/still.mjs" "$HERE" 0 1 2 4 7 9.8 --size 1920x1080 --out "$HERE/out/stills" 2>&1 | tee "$HERE/out/render-log.txt"
node "$LEMO_ROOT/core/render/video.mjs" "$HERE" --size 1920x1080 --fps 30 --workers 2 --out "$HERE/out/picture.mp4" 2>&1 | tee -a "$HERE/out/render-log.txt"
ffmpeg -y -v warning -i "$HERE/out/picture.mp4" -i "$HERE/assets/mix.mp3" -map 0:v -map 1:a -c:v copy -af loudnorm=I=-14:TP=-1.2:LRA=11 -c:a aac -b:a 192k -ar 48000 -movflags +faststart -t 10 "$HERE/out/Hanuman_Lemo_Motion_Test.mp4"
