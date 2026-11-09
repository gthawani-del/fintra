import pathlib,json,os,soundfile as sf
from scipy.signal import resample_poly
from faster_whisper import WhisperModel
P=pathlib.Path(__file__).resolve().parent
m=WhisperModel(os.environ.get('WHISPER_MODEL','small'),device='cpu',compute_type='int8',cpu_threads=4)
results=[]
for c in json.load(open(P/'timeline.json'))['cues']:
 a,sr=sf.read(P/'voices'/f"{c['id']:02}.wav"); a=resample_poly(a,16000,sr).astype("float32")
 segs,_=m.transcribe(a,language="hi",beam_size=3)
 heard=' '.join(s.text for s in segs)
 results.append(dict(id=c['id'],expected=c['text'],heard=heard))
 print(c['id'],heard,flush=True)
json.dump(results,open(P/'qa/voice-asr.json','w'),ensure_ascii=False,indent=2)
