import json,numpy as np,subprocess
from pathlib import Path
from scipy.io.wavfile import write
from scipy.signal import lfilter
P=Path(__file__).parent;T=json.loads((P/'timeline.json').read_text());sr=24000;n=int((T['duration']+.1)*sr)
voice=np.zeros(n,np.float32);score=np.zeros(n,np.float32);foley=np.zeros(n,np.float32);rng=np.random.default_rng(174)
def add(dst,x,t,gain=1):
 a=int(t*sr);b=min(n,a+len(x));
 if a>=0 and b>a:dst[a:b]+=x[:b-a]*gain
def note(m,d,kind='pluck'):
 t=np.arange(int(sr*d))/sr;f=440*2**((m-69)/12)
 if kind=='pluck':
  y=sum(np.sin(2*np.pi*f*k*t)*np.exp(-t*(2+k*.9))/k**1.7 for k in range(1,7));y*=np.minimum(t/.008,1)
 else:
  phase=2*np.pi*f*t+.018*np.sin(2*np.pi*5*t);y=np.sin(phase)+.16*np.sin(2*phase)+.04*np.sin(3*phase);y*=np.minimum(t/.12,1)*np.minimum((d-t)/.22,1)*.45
 return y.astype(np.float32)
def drum(d=.3,low=False):
 t=np.arange(int(sr*d))/sr;f=62 if low else 145;y=np.sin(2*np.pi*(f*t+14*(1-np.exp(-t*22))))*np.exp(-t*20);y+=rng.normal(0,.16,len(t))*np.exp(-t*55);return y.astype(np.float32)
for ch in T['chapters']:
 i=ch['id'];at=ch['start'];dur=ch['duration']
 x=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(P/'assets'/f'chapter-{i:02}.mp3'),'-f','f32le','-ar',str(sr),'-ac','1','-']),np.float32)
 add(voice,np.tanh(x*2)*.4,ch['voiceStart'])
 motif=[62,65,69,67,65,62,60,62] if i not in [5,10,11] else [62,63,67,65,63,60,62,57]
 beat=60/(72 if i in [3,4,8,11] else 88)
 for j,t in enumerate(np.arange(at+.3,at+dur-2,beat*2)):
  # Leave gaps after tragic beats, and space before chapter transitions.
  local=t-at
  if i in [2,4,5,10,11] and .72*dur<local<.82*dur:continue
  add(score,note(motif[j%8],2.2),t,.09)
  if j%4==0:add(score,note(50 if i%2 else 55,2.8),t,.055)
  if j%8==4:add(score,note(motif[(j+2)%8]+12,1.8,'flute'),t,.025)
  if i in [6,7,9,10]:add(score,drum(low=j%4==0),t,.045)
 if ch['songStart']:
  a=ch['songStart'];bpm=72 if i==3 else 100;b=60/bpm
  melody=[62,65,67,69,67,65,62,60,62,65,69,72,69,67,65,62] if i==3 else [62,62,67,69,72,69,67,65,67,69,74,72,69,67,65,62]
  for k,t in enumerate(np.arange(a,a+ch['songDuration']-.5,b)):
   add(score,note(melody[k%16],b*1.5,'flute'),t,.15)
   add(score,note(melody[(k+4)%16]-12,1.4),t,.15)
   add(score,drum(low=k%4==0),t,.09 if k%2==0 else .045)
 for sh in ch['shots']:
  t=at+sh['start'];noise=rng.normal(0,1,int(sr*.24)).astype(np.float32);noise=lfilter([1,-1],[1],noise)*np.exp(-np.arange(len(noise))/sr*20)
  add(foley,noise,t,.008)
 # Quiet scene ambience, filtered wind for sea, brief birds for forest.
 if i in [3,5,7,9]:
  length=int(dur*sr);amb=lfilter([.015],[1,-.985],rng.normal(0,1,length));add(foley,amb,at,.018)
  if i in [3,5]:
   for off in [4,19,33]:
    tt=np.arange(int(sr*.22))/sr;bird=np.sin(2*np.pi*(1600*tt+140*tt**2))*np.sin(np.pi*tt/.22)**2;add(foley,bird,at+off,.008)
# Duck by narration presence with conservative fixed floor throughout voice passage.
duck=np.ones(n,np.float32)
for ch in T['chapters']:
 a=int(ch['voiceStart']*sr);b=int((ch['voiceStart']+ch['voiceDuration'])*sr);duck[a:b]=.36
score*=duck
fade=np.minimum(np.arange(n)/sr/1.5,1)*np.minimum((n-np.arange(n))/sr/3,1)
for name,x in [('Narration',voice),('Instrumental_Score',score),('Foley',foley)]:
 write(P/'out'/f'{name}.wav',sr,(np.clip(x*fade,-1,1)*32767).astype(np.int16))
mix=(voice+score+foley)*fade
write(P/'out'/'mix.wav',sr,(np.clip(mix,-.98,.98)*32767).astype(np.int16))
print('duration',T['duration'],'peak',float(np.max(np.abs(mix))))
