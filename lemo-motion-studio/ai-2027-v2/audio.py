import asyncio,json,subprocess
from pathlib import Path
import edge_tts,numpy as np
from scipy.io.wavfile import write
P=Path(__file__).parent
lines=[(.4,'The state of AI in twenty twenty-seven. Here is the outlook.'),(6.4,'Agents could turn more requests into completed work, with tools and review.'),(14.4,'Text, voice and vision could become one continuous interaction.'),(22.4,'World models could let us test agents in simulated environments.'),(30.4,'But greater capability will demand stronger control.'),(36.0,'The next test? Dependable outcomes.')]
async def voices():
 for i,(at,words) in enumerate(lines):
  p=P/'assets'/f'voice{i}.mp3'
  if not p.exists():await edge_tts.Communicate(words,'en-GB-RyanNeural',rate='+8%').save(str(p))
asyncio.run(voices())
sr=48000;n=sr*40;rng=np.random.default_rng(2027);music=np.zeros((n,2));voice=np.zeros(n)
def add(sig,at,gain=1,pan=0):
 a=int(at*sr);b=min(n,a+len(sig));
 if b>a:music[a:b,0]+=sig[:b-a]*gain*(1-pan*.4);music[a:b,1]+=sig[:b-a]*gain*(1+pan*.4)
def tone(freq,dur,decay=2):
 t=np.arange(int(dur*sr))/sr;return (np.sin(2*np.pi*freq*t)+.30*np.sin(2*np.pi*freq*3*t)+.12*np.sin(2*np.pi*freq*5*t))*np.exp(-t*decay)*np.minimum(t/.012,1)
# Original warm wooden-pluck motif and sustained harmony.
for k in range(80):
 at=k*.5;f=[220,261.626,329.628,440,392,329.628,261.626,293.665][k%8]
 add(tone(f*1.5,1.2,5),at,.065,(-1 if k%2 else 1)*.5)
 if k%2==0:
  t=np.arange(int(.18*sr))/sr;add(np.sin(2*np.pi*(65*t+3*(1-np.exp(-t*25))))*np.exp(-t*25),at,.12)
 if k%4==2:
  t=np.arange(int(.08*sr))/sr;add(rng.normal(0,1,len(t))*np.exp(-t*65),at,.018)
for at in range(0,40,4):
 for f in [220,261.626,329.628]:
  t=np.arange(4*sr)/sr;add(np.sin(2*np.pi*f*t)*np.sin(np.pi*t/4)**2,at,.018)
for at in [1.4,1.9,2.2,2.325,2.45,2.575,2.7,2.825,6.1,6.6,7.1,14,14.25,14.625,15,22,22.125,22.25,22.375,22.5,22.625,22.75,22.875,23,30,32.7,36]:
 t=np.arange(int(.6*sr))/sr;add(tone(880,.6,8)+.3*tone(1320,.6,10),at,.12)
 t=np.arange(int(.45*sr))/sr;noise=rng.normal(0,1,len(t));noise=np.convolve(noise,np.ones(17)/17,'same');add(noise*np.sin(np.pi*t/.45)**2,max(0,at-.15),.025)
for at in [21.6,35.6]:music[int(at*sr):int((at+.36)*sr)]*=.05
cues=[]
for i,(at,words) in enumerate(lines):
 raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(P/'assets'/f'voice{i}.mp3'),'-f','f32le','-ar',str(sr),'-ac','1','-'])
 v=np.frombuffer(raw,dtype=np.float32);v=np.tanh(v*2.5)*.6;a=int(at*sr);b=min(n,a+len(v));voice[a:b]+=v[:b-a];music[max(0,a-int(.1*sr)):min(n,b+int(.2*sr))]*=.28
 cues.append({'start':at,'end':round(b/sr,3),'text':words})
mix=music+voice[:,None];mix*=np.minimum(np.arange(n)/sr/.03,1)[:,None];mix*=np.minimum((n-np.arange(n))/sr/.35,1)[:,None];write(P/'out'/'mix.wav',sr,np.int16(np.clip(mix,-.98,.98)*32767))
(P/'narration.json').write_text(json.dumps(cues,indent=2))
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
(P/'State_of_AI_2027.srt').write_text('\n\n'.join(f'{i+1}\n{stamp(c["start"])} --> {stamp(c["end"])}\n{c["text"]}' for i,c in enumerate(cues)))
print(json.dumps(cues,indent=2))
