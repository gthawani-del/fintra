#!/usr/bin/env bash
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
cd "$HERE"
python3 captions.py
ffmpeg -y -v warning -i out/Ayodhya_Lemo_Picture.mp4 -vf ass=kinetic-highlight.ass -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p -c:a copy -movflags +faststart out/Ayodhya_Lemo_Highlight.mp4
