#!/usr/bin/env bash
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
: "${LEMO_ROOT:?Set LEMO_ROOT to upstream checkout}"
mkdir -p "$HERE/out"
node "$LEMO_ROOT/core/render/video.mjs" "$HERE" --size 1920x1080 --fps 24 --workers 2 --out "$HERE/out/picture.mp4"
python3 "$HERE/captions.py"
python3 "$HERE/mix.py"
ffmpeg -y -i "$HERE/out/picture.mp4" -i "$HERE/out/mix.wav" -map 0:v -map 1:a -vf "ass=$HERE/kinetic-highlight.ass" -c:v libx264 -crf 18 -preset fast -c:a aac -b:a 192k -t 18 -movflags +faststart "$HERE/out/Ramayana_Shadow_Theatre.mp4"
