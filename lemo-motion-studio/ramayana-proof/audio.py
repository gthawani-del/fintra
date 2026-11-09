import json,subprocess
from pathlib import Path
import numpy as np
from scipy.io.wavfile import write
from scipy.signal import butter,sosfilt
P=Path(__file__).parent;sr=48000;D=54;n=D*sr;rng=np.random.default_rng(27);score=np.zeros((n,2),dtype=np.float32);voice=np.zeros(n,dtype=np.float32)
cues=json.loads((P/'narration.json').read_text());cues[5]['start']=42.2;(P/'narration.json').write_text(json.dumps(cues,ensure_ascii=False,indent=2))
def add(v,at,gain=1,pan=0):
 a=max(0,int(at*sr));b=min(n,a+len(v));score[a:b,0]+=v[:b-a]*gain*(1-.35*pan);score[a:b,1]+=v[:b-a]*gain*(1+.35*pan)
def pluck(f,d=3):
 t=np.arange(int(d*sr))/sr;env=(1-np.exp(-t*240))*np.exp(-t*2.4);return sum(np.sin(2*np.pi*f*k*t)*np.exp(-t*k*.5)/k**1.7 for k in range(1,6))*env
# Original pentatonic motif, neither borrowed melody nor simulated authentic instrument recording.
for at in np.arange(.3,16.5,.9):
 i=int((at-.3)/.9);add(pluck([196,220,261.63,293.66,392,293.66,261.63,220][i%8]),at,.065,(-1)**i*.4)
for at in np.arange(18,33,2.0):add(pluck([146.83,196,220,196][int(at/2)%4],4),at,.05)
for at in np.arange(35.3,53,.67):
 i=int((at-35.3)/.67);add(pluck([196,261.63,293.66,392,440,392][i%6]),at,.055,(-1)**i*.5)
# breathy lead, modest dynamics and harmonic drone
for start,notes in [(1,[392,440,523.25,440]),(10,[392,293.66,261.63]),(36,[392,523.25,587.33]),(46,[587.33,523.25,440,392])]:
 for j,f in enumerate(notes):
  tt=np.arange(int(1.6*sr))/sr;env=np.sin(np.pi*tt/1.6)**1.8;v=(np.sin(2*np.pi*f*tt+.025*np.sin(2*np.pi*5*tt))+.13*np.sin(2*np.pi*f*2*tt))*env;add(v,start+j*1.5,.027)
for at in np.arange(0,54,6):
 tt=np.arange(6*sr)/sr;env=np.sin(np.pi*tt/6)**2
 for f in [98,196,293.66]:add(np.sin(2*np.pi*f*tt)*env,at,.012)
def noise(d,low=2000):
 v=rng.normal(0,1,int(d*sr));return sosfilt(butter(2,low,fs=sr,output='sos'),v)
# ambient river / sea, separate material sounds
for at,d,g in [(0,17,.014),(17,18,.005),(34.6,19.4,.035)]:
 tt=np.arange(int(d*sr))/sr;add(noise(d,1200)*(0.65+.35*np.sin(tt*.8)**2),at,g)
for at in [5.9,11.9,16.65,19.2,23.7,27.4,29.8,32,34.65]:
 d=.55;tt=np.arange(int(d*sr))/sr;add(noise(d,2700)*np.sin(np.pi*tt/d)**2,at,.06 if at in [16.65,34.65] else .018)
for at in [18.2,24,35.5,42.2,45.5,48.2]:
 tt=np.arange(int(.7*sr))/sr;add(np.sin(2*np.pi*(75*tt+4*(1-np.exp(-tt*15))))*np.exp(-tt*8),at,.16)
# impending leap silence and wind swell
score[int(41.55*sr):int(42.15*sr)]*=.12
score[int(26.0*sr):int(26.8*sr)]*=.1
for at,d,g in [(41.9,1.3,.11),(44,3,.04)]:
 tt=np.arange(int(d*sr))/sr;add(noise(d,1800)*np.sin(np.pi*tt/d)**2,at,g,-.3)
for q in cues:
 raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(P/q['file']),'-f','f32le','-ar',str(sr),'-ac','1','-']);v=np.frombuffer(raw,np.float32);v=np.tanh(v*2.2)*.58;a=int(q['start']*sr);b=min(n,a+len(v));voice[a:b]+=v[:b-a];score[max(0,a-4800):min(n,b+9600)]*=.31;q['end']=round(b/sr,3)
mix=score+voice[:,None];fade=np.minimum(np.arange(n)/(sr*.15),1)*np.minimum((n-np.arange(n))/(sr*1.2),1);mix*=fade[:,None];write(P/'out'/'mix.wav',sr,(np.clip(mix,-.99,.99)*32767).astype(np.int16));write(P/'out'/'voice.wav',sr,(voice*32767).astype(np.int16))
(P/'narration.json').write_text(json.dumps(cues,ensure_ascii=False,indent=2))
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
(P/'Ramayana_Proof_Hindi.srt').write_text('\n\n'.join(f'{i+1}\n{stamp(q["start"])} --> {stamp(q["end"])}\n{q["text"]}' for i,q in enumerate(cues)))
print(json.dumps({'duration':D,'voice_segments':len(cues),'peak':float(abs(mix).max()),'voice_end':cues[-1]['end']}))
