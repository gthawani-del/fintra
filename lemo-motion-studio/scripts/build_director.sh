#!/usr/bin/env bash
set -euo pipefail
project_dir=$(cd "$(dirname "$0")/.." && pwd)
: "${LEMO_ROOT:?Set LEMO_ROOT to the pinned official Lemo checkout}"
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
python3 "$project_dir/scripts/prepare_director_media.py" "${1:?B-roll source directory required}"
# Source photos, original clip frames and licensed fonts are prepared by prepare_final_cut.py.
if [ ! -e "$project_dir/director-cut/assets" ]; then ln -s ../final-cut/assets "$project_dir/director-cut/assets"; fi
mkdir -p "$project_dir/director-cut/out"
node "$LEMO_ROOT/core/render/video.mjs" "$project_dir/director-cut" --fps 24 --size 1080x1920 --workers 3 --out "$project_dir/director-cut/out/picture.mp4"
ffmpeg -nostdin -y -v error -i "$project_dir/director-cut/out/picture.mp4" -i "$project_dir/final-cut/assets/song.mp3" -map 0:v -map 1:a -c:v libx264 -crf 21 -preset fast -threads 4 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest "$project_dir/director-cut/out/Woh_Lamhe_Director_Cut.mp4"
