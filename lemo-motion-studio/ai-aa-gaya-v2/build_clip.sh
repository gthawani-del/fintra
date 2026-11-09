#!/usr/bin/env bash
set -euo pipefail
P="$(cd "$(dirname "$0")" && pwd)"
LEMO="${1:?Lemo checkout path}"
VOICE="${2:?Approved Hindi audition MP3 path}"
PYTHON="${PYTHON:-python3}"
mkdir -p "$P/fonts" "$P/out"
cp /usr/share/fonts/truetype/noto/NotoSansDevanagari-Regular.ttf "$P/fonts/hindi.ttf"
"$PYTHON" "$P/mix_clip.py" "$VOICE"
node "$LEMO/core/render/video.mjs" "$P" --fps 24 --workers 3 --size 1280x720 --out "$P/out/picture.mp4"
ffmpeg -y -i "$P/out/clip_mix.wav" -af loudnorm=I=-16:TP=-1.5:LRA=9 -ar 48000 -c:a aac -b:a 192k "$P/out/master.m4a"
ffmpeg -y -i "$P/out/picture.mp4" -i "$P/out/master.m4a" -map 0:v -map 1:a -c copy -movflags +faststart -t 30 "$P/out/AI_Aa_Gaya_30s_BGM_Clip.mp4"
