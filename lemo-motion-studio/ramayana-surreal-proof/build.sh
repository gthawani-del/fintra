#!/usr/bin/env bash
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
: "${LIB:?Set LIB to official lemo-opuscar checkout}"
: "${AUDIO_SCORE:?Set AUDIO_SCORE to the original instrumental MP3}"
cd "$HERE"
mkdir -p out
node "$LIB/core/render/video.mjs" "$HERE" --size 1280x720 --fps 24 --workers 4 --out out/picture.mp4
python3 accents.py
ffmpeg -y -v error -i "$AUDIO_SCORE" -i accents.wav -filter_complex '[0:a]atrim=0:24,asetpts=PTS-STARTPTS,afade=t=in:d=0.3,afade=t=out:st=22:d=2[m];[m][1:a]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=8[a]' -map '[a]' -ar 48000 out/music.wav
ffmpeg -y -v error -i out/picture.mp4 -i out/music.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -t 24 -movflags +faststart out/Ramayana_Surreal_Proof.mp4
