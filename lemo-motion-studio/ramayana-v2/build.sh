#!/usr/bin/env bash
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
: "${LEMO_RUNTIME:?Set LEMO_RUNTIME to official Lemo runtime checkout}"
: "${APPROVED_AUDIO:?Set APPROVED_AUDIO to the approved master.m4a}"
cd "$HERE"
mkdir -p out
for batch in 1 2 3; do
  node "$LEMO_RUNTIME/core/render/video.mjs" "$HERE" --q "batch=$batch" --size 1280x720 --fps 24 --workers 4 --out "out/batch$batch.mp4"
done
printf "file 'batch1.mp4'\nfile 'batch2.mp4'\nfile 'batch3.mp4'\n" > out/batches.txt
ffmpeg -y -v error -f concat -safe 0 -i out/batches.txt -c copy out/picture.mp4
ffmpeg -y -v error -i out/picture.mp4 -i "$APPROVED_AUDIO" -map 0:v -map 1:a -c:v libx264 -preset fast -crf 22 -c:a copy -t 623.064 -movflags +faststart out/Ramayana_Rebuilt_Full.mp4
