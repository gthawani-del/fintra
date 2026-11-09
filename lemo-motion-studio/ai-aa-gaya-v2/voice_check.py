from pathlib import Path
import subprocess,json,numpy as np,soundfile as sf
from faster_whisper import WhisperModel
P=Path(__file__).resolve().parent
from voice import LINES
lines=[(name,text) for name,voice,text,rate in LINES]
model=WhisperModel('/home/agent/.cache/huggingface/hub/models--Systran--faster-whisper-small/snapshots/536b0662742c02347bc0e980a01041f333bce120',device='cpu',compute_type='int8',cpu_threads=4)
parts=[];results=[];cursor=0
for name,expected in lines:
 path=P/'out'/f'{name}.wav'
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(P/'out'/f'{name}.mp3'),'-ar','16000','-ac','1',str(path)],check=True)
 a,s=sf.read(path,dtype='float32');segs,_=model.transcribe(a,language='hi',beam_size=5)
 heard=' '.join(x.text for x in segs);results.append(dict(speaker=name,start=cursor,duration=len(a)/s,expected=expected,asr=heard));print(name,heard,flush=True)
 parts.extend([a,np.zeros(16000,dtype='float32')]);cursor+=len(a)/s+1
sf.write(P/'out'/'audition.wav',np.concatenate(parts),16000)
json.dump(results,open(P/'voice-check.json','w'),ensure_ascii=False,indent=2)
subprocess.run(['ffmpeg','-v','error','-y','-i',str(P/'out'/'audition.wav'),'-af','highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=8','-codec:a','libmp3lame','-b:a','160k',str(P/'out'/'AI_Aa_Gaya_Hindi_Voice_V2.mp3')],check=True)
