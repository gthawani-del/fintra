#!/usr/bin/env python3
"""Prepare the authorized existing-media edit without fetching new footage."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source_dir', type=Path)
parser.add_argument('fontsource_dir', type=Path,
                    help='Installed node_modules/@fontsource directory')
args = parser.parse_args()
manifest = json.loads((ROOT/'plan/supplied-media-2026-11-02.json').read_text())
sources = {}
for asset in manifest['assets']:
    path = (args.source_dir/asset['sourceFile']).resolve(strict=True)
    if not path.is_relative_to(args.source_dir.resolve()):
        raise ValueError('Source path escapes the supplied folder')
    with path.open('rb') as f:
        if hashlib.file_digest(f, 'sha256').hexdigest() != asset['sha256']:
            raise ValueError('Source hash mismatch: '+asset['sourceFile'])
    sources[asset['id']] = path
dest = ROOT/'final-cut/assets'
(dest/'frames').mkdir(parents=True, exist_ok=True)
(dest/'fonts').mkdir(exist_ok=True)
for asset_id in ['walk-reference','seated-reference','shore-reference']:
    shutil.copy2(sources[asset_id],dest/(asset_id+'.jpeg'))
shutil.copy2(sources['song'],dest/'song.mp3')
for family,weight,name in [('cormorant-garamond','400','serif'),
                          ('dm-sans','500','sans'),('bebas-neue','400','display')]:
    folder=args.fontsource_dir/family
    shutil.copy2(folder/'files'/f'{family}-latin-{weight}-normal.woff2',
                 dest/'fonts'/f'{name}.woff2')
    shutil.copy2(folder/'LICENSE',dest/'fonts'/f'{name}-LICENSE')
subprocess.run(['ffmpeg','-nostdin','-y','-v','error','-i',str(sources['shore-motion']),
                '-map','0:v:0','-an','-vf',
                'fps=24,scale=540:960:force_original_aspect_ratio=increase,crop=540:960',
                '-frames:v','120','-start_number','0','-q:v','3',
                str(dest/'frames/%04d.jpg')],check=True)
assert all((dest/'frames'/f'{i:04d}.jpg').is_file() for i in range(120))
print('Prepared verified existing media; no new footage or source audio changes.')
