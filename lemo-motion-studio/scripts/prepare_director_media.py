#!/usr/bin/env python3
"""Extract B-roll at the composition frame rate; keep all frames private."""
from pathlib import Path
import subprocess,sys,json,hashlib
root=Path(__file__).resolve().parents[1];source=Path(sys.argv[1]);dest=root/'director-cut/media'
records=json.loads((root/'director-cut/broll-jobs.json').read_text())
for record in records:
 sid=record['shot_id'];p=source/(sid+'.mp4')
 assert hashlib.sha256(p.read_bytes()).hexdigest()==record['qa']['sha256'],sid+' source hash mismatch'
 target=dest/sid;target.mkdir(parents=True,exist_ok=True)
 subprocess.run(['ffmpeg','-nostdin','-y','-v','error','-i',str(p),'-an','-vf','fps=24','-frames:v','192','-q:v','2','-start_number','0',str(target/'%04d.jpg')],check=True)
 assert len(list(target.glob('*.jpg')))==192
 print('Prepared',sid,flush=True)
