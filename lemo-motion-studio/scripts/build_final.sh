#!/usr/bin/env bash
set -euo pipefail
project_dir=$(cd "$(dirname "$0")/.." && pwd)
: "${LEMO_ROOT:?Set LEMO_ROOT to Lemo-Opuscar commit bebbbe1aa92a3cb4bb6f83500e61b23a17d1aa00}"
test -f "$LEMO_ROOT/core/render/video.mjs"
python3 - "$LEMO_ROOT" "$project_dir/final-cut/renderer-source.json" <<'PY'
import sys,json,hashlib
from pathlib import Path
root=Path(sys.argv[1])
for entry in json.loads(Path(sys.argv[2]).read_text())['files']:
    data=(root/entry['path']).read_bytes()
    actual=hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
    if actual!=entry['gitBlobSha']:
        raise SystemExit('Lemo version mismatch: '+entry['path'])
PY
python3 "$project_dir/scripts/prepare_final_cut.py" "${1:?Source folder required}" "${2:?node_modules/@fontsource folder required}"
mkdir -p "$project_dir/final-cut/out"
node "$LEMO_ROOT/core/render/video.mjs" "$project_dir/final-cut" \
  --fps 24 --size 1080x1920 --workers 3 \
  --out "$project_dir/final-cut/out/picture.mp4"
ffmpeg -nostdin -y -v error -i "$project_dir/final-cut/out/picture.mp4" \
  -i "$project_dir/final-cut/assets/song.mp3" -map 0:v:0 -map 1:a:0 \
  -c:v libx264 -preset medium -crf 21 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -movflags +faststart -shortest \
  "$project_dir/final-cut/out/Woh_Lamhe_LEMO_Motion_Film.mp4"
ffprobe -v error -show_entries format=duration,size \
  -of json "$project_dir/final-cut/out/Woh_Lamhe_LEMO_Motion_Film.mp4"
