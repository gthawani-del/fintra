#!/usr/bin/env bash
set -euo pipefail
P=$(cd "$(dirname "$0")" && pwd)
: "${LEMO_ROOT:?Set LEMO_ROOT to official Lemo checkout at bebbbe1aa92a3cb4bb6f83500e61b23a17d1aa00}"
mkdir -p "$P/assets" "$P/out"
cp /usr/share/fonts/truetype/open-sans/OpenSans-Light.ttf "$P/assets/light.ttf"
cp /usr/share/fonts/truetype/open-sans/OpenSans-Semibold.ttf "$P/assets/bold.ttf"
python "$P/audio.py"
node "$LEMO_ROOT/core/render/video.mjs" "$P" --fps 24 --size 1080x1920 --workers 3 --out "$P/out/picture.mp4"
ffmpeg -y -v error -i "$P/out/picture.mp4" -i "$P/out/mix.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -af loudnorm=I=-14:TP=-1.2:LRA=9 -t 40 -movflags +faststart "$P/out/State_of_AI_2027_Lemo_3D.mp4"
