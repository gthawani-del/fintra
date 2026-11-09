#!/usr/bin/env bash
set -euo pipefail
PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
: "${LEMO_ROOT:?Set LEMO_ROOT to the lemo-opuscar checkout}"
PYTHON="${PYTHON:-python}"
mkdir -p "$PROJECT_DIR/voices" "$PROJECT_DIR/out"
"$PYTHON" "$PROJECT_DIR/make_voice.py"
"$PYTHON" "$PROJECT_DIR/mix_audio.py"
ffmpeg -y -i "$PROJECT_DIR/out/mix.wav" -af loudnorm=I=-16:TP=-1.5:LRA=9 -ar 48000 "$PROJECT_DIR/out/master.wav"
node "$LEMO_ROOT/core/render/video.mjs" "$PROJECT_DIR" --fps 24 --workers 3 --out "$PROJECT_DIR/out/picture.mp4"
ffmpeg -y -i "$PROJECT_DIR/out/picture.mp4" -i "$PROJECT_DIR/out/master.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -movflags +faststart -shortest "$PROJECT_DIR/out/AI_Is_Here_English_Full_Movie.mp4"
