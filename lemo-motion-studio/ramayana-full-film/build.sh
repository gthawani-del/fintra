#!/usr/bin/env bash
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
: "${LIB:?Set LIB to the official lemo-opuscar checkout}"
cd "$HERE"
mkdir -p out
python voice.py
python prepare.py
python align_shots.py
python score.py
: > out/chapters.txt
for chapter in {1..12}; do
  node "$LIB/core/render/video.mjs" "$HERE" --q "chapter=$chapter" --size 1280x720 --fps 30 --workers 2 --out "$HERE/out/chapter-$chapter.mp4"
  printf "file 'chapter-%s.mp4'\n" "$chapter" >> out/chapters.txt
done
ffmpeg -v error -y -f concat -safe 0 -i out/chapters.txt -c copy out/picture.mp4
python master.py
ffmpeg -v error -y -i out/picture.mp4 -i out/master.m4a -map 0:v -map 1:a -vf fps=30 -c:v libx264 -preset medium -crf 22 -pix_fmt yuv420p -c:a copy -movflags +faststart Ramayana_Full_Workprint.mp4
