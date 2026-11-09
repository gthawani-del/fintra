import pathlib,json,numpy as np,soundfile as sf
from scipy.signal import butter,sosfilt,resample_poly
P=pathlib.Path(__file__).resolve().parent;D=json.load(open(P/'timeline.json'));sr=48000;dur=50.5
mix=np.zeros((int(sr*dur),2),np.float32);speech=np.zeros(int(sr*dur),np.float32);envs={}
def add(a,at,gain=1,pan=0):
 start=int(at*sr);end=min(len(mix),start+len(a));a=a[:end-start];mix[start:end,0]+=a*gain*np.sqrt((1-pan)/2);mix[start:end,1]+=a*gain*np.sqrt((1+pan)/2)
for c in D['cues']:
 a,r=sf.read(P/'voices'/f"{c['id']:02}.wav");env=[]
 for j in range(int(np.ceil(len(a)/r*24))):
  f=a[int(j*r/24):int((j+1)*r/24)];env.append(float(np.sqrt(np.mean(f*f))) if len(f) else 0)
 top=max(env);envs[c['id']]=[round(min(1,v/(top*.75)),3) for v in env]
 a=resample_poly(a,sr,r);a=np.tanh(a*2.2)*.58
 st=int(c['start']*sr);speech[st:st+len(a)]+=a
mix[:,0]+=speech*.707;mix[:,1]+=speech*.707
rng=np.random.default_rng(32);n=int(dur*sr);tm=np.arange(n)/sr
room=sosfilt(butter(2,400,fs=sr,output='sos'),rng.normal(0,1,n))*.007;add(room,0)
# Original mallet/pluck cue, gentle syncopation, no sampled melody.
for j in range(80):
 at=j*.625
 if at<11 or 14.05<at<16.3 or 19.9<at<20.8:continue
 notes=[62,69,74,77,69,65,72,76];m=notes[j%8];f=440*2**((m-69)/12);tt=np.arange(int(sr*.8))/sr
 tone=(np.sin(2*np.pi*f*tt)*np.exp(-tt*7)+.23*np.sin(2*np.pi*f*2.01*tt)*np.exp(-tt*13))*(1-np.exp(-tt*150))
 # duck at actual speech timestamps
 gain=.032 if any(c['start']-.15<at<c['end']+.2 for c in D['cues']) else .065
 add(tone,at,gain,(-.25 if j%2 else .25))
 if j%4==0:
  tt=np.arange(int(sr*.65))/sr;f=110*2**(([2,0,5,7][j//8%4])/12);bass=(np.sin(2*np.pi*f*tt)+.3*np.sin(4*np.pi*f*tt))*np.exp(-tt*7);add(bass,at,.018)
def ping(at,f=1700,gain=.05):
 tt=np.arange(int(sr*.3))/sr;a=np.sin(2*np.pi*f*tt)*np.exp(-tt*24)+.4*np.sin(2*np.pi*f*2.7*tt)*np.exp(-tt*40);add(a,at,gain)
for at in [.15,10.95,14.4,20.12]:ping(at)
for at in [24.05,29.1,34.4,40.15]:
 tt=np.arange(int(sr*.4))/sr;noise=rng.normal(size=len(tt));a=sosfilt(butter(2,[700,4500],btype='bandpass',fs=sr,output='sos'),noise)*np.sin(np.pi*tt/.4)**2;add(a,at-.15,.055)
for at in [42.1,43.5]:ping(at,1000,.025)
fade=np.minimum(1,(dur-tm)/1.1);mix*=fade[:,None]
sf.write(P/'out/mix.wav',mix,sr);sf.write(P/'out/voice-audition.wav',np.stack([speech,speech],1)[:int(20.5*sr)],sr)
json.dump(envs,open(P/'envelopes.json','w'))
def ts(v):
 ms=round(v*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
with open(P/'out/AI_Aa_Gaya_Opening.srt','w') as f:
 for i,c in enumerate(D['cues']):f.write(f"{i+1}\n{ts(c['start'])} --> {ts(c['end']+.25)}\n{c['en']}\n\n")
