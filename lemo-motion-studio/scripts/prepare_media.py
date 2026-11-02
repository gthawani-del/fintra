#!/usr/bin/env python3
"""Verify supplied files and extract deterministic frames; not a renderer."""
import argparse
import hashlib
import json
import math
from pathlib import Path
import shutil
import subprocess
import sys

PROJECT = Path(__file__).resolve().parents[1]


def digest(path):
    with path.open('rb') as handle:
        return hashlib.file_digest(handle, 'sha256').hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-dir', required=True, type=Path)
    parser.add_argument('--manifest', type=Path,
                        default=PROJECT / 'plan/supplied-media-2026-11-02.json')
    parser.add_argument('--seconds', type=float, default=15)
    parser.add_argument('--out', type=Path, default=PROJECT / '.local-media')
    args = parser.parse_args()
    if not math.isfinite(args.seconds) or not 0 < args.seconds <= 15:
        raise ValueError('--seconds must be finite and between 0 and 15')
    for binary in ('ffmpeg', 'ffprobe'):
        if not shutil.which(binary):
            raise ValueError(f'{binary} is required')
    manifest = json.loads(args.manifest.read_text())
    source = args.source_dir.resolve(strict=True)
    verified = []
    for asset in manifest['assets']:
        path = (source / asset['sourceFile']).resolve(strict=True)
        if not path.is_relative_to(source):
            raise ValueError('Source file must be inside --source-dir')
        if digest(path) != asset['sha256']:
            raise ValueError(f'Hash mismatch: {asset["sourceFile"]}')
        verified.append((asset, path))
    videos = [(a, p) for a, p in verified if a['kind'] == 'video']
    if len(videos) != 1:
        raise ValueError('Prepare one continuous clip at a time')
    video, video_path = videos[0]
    probe = json.loads(subprocess.check_output([
        'ffprobe', '-v', 'error', '-show_streams', '-of', 'json', str(video_path)
    ]))
    stream = next(s for s in probe['streams'] if s['codec_type'] == 'video')
    duration = float(stream['duration'])
    if args.seconds > duration + 0.000001:
        raise ValueError(f'Need {args.seconds:g}s; clip has only {duration:.6f}s. '
                         'Supply more footage. The source will not be padded.')
    output = args.out.resolve()
    if output.exists():
        raise ValueError(f'Output already exists: {output}; use a new --out')
    output.mkdir(parents=True)
    originals = output / 'originals'
    originals.mkdir()
    for asset, path in verified:
        shutil.copy2(path, originals / (asset['id'] + path.suffix.lower()))
    frames = output / 'frames'
    frames.mkdir()
    count = math.ceil(args.seconds * 24 - 1e-9)
    subprocess.run([
        'ffmpeg', '-nostdin', '-v', 'error', '-i', str(video_path),
        '-map', '0:v:0', '-an', '-vf',
        'fps=24,scale=540:960:force_original_aspect_ratio=increase,crop=540:960',
        '-frames:v', str(count), '-start_number', '0', '-q:v', '3',
        str(frames / '%04d.jpg')
    ], check=True)
    actual = len(list(frames.glob('*.jpg')))
    if actual != count:
        raise ValueError(f'Incomplete extraction: {actual}/{count}')
    result = {
        'status': 'MEDIA_PREPARED_NOT_RENDERED',
        'sourceVideoSha256': video['sha256'],
        'seconds': args.seconds, 'fps': 24, 'frameCount': actual,
        'width': 540, 'height': 960, 'framePattern': 'frames/%04d.jpg',
        'audio': 'originals/song.mp3', 'audioModified': False,
        'upscaledFrom': [stream['width'], stream['height']],
        'lyricsVerified': False
    }
    (output / 'prepared.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, KeyError, StopIteration, subprocess.CalledProcessError) as exc:
        print(f'BLOCKED: {exc}', file=sys.stderr)
        sys.exit(1)
