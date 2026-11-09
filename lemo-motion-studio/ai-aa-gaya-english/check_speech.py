"""Read-only ASR check. Recognition differences are reported, never hidden."""
import json,re,difflib,subprocess
import numpy as np
from pathlib import Path
from faster_whisper import WhisperModel
p=Path(__file__).resolve().parent
m=WhisperModel('base.en',device='cpu',compute_type='int8',cpu_threads=3,download_root=str(p.parents[2]/'asr_models'))
rows=json.loads((p/'script.json').read_text());result=[]
def norm(t):return re.sub(r'[^a-z0-9 ]','',t.lower()).split()
for i,q in enumerate(rows):
 raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(p/'voices'/f'{i:02}.mp3'),'-f','f32le','-ar','16000','-ac','1','-'])
 audio=np.frombuffer(raw,dtype=np.float32)
 seg,_=m.transcribe(audio,language='en',beam_size=5,condition_on_previous_text=False)
 heard=' '.join(s.text.strip() for s in seg);ratio=difflib.SequenceMatcher(None,norm(q['text']),norm(heard)).ratio()
 result.append(dict(id=i,expected=q['text'],heard=heard,similarity=round(ratio,3)))
 print(i,round(ratio,3),heard,flush=True)
 (p/'out/asr_check.json').write_text(json.dumps(result,indent=2))
