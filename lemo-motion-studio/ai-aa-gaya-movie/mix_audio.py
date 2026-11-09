"""Original deterministic underscore; no samples or external music assets."""
from pathlib import Path
import json, numpy as np, soundfile as sf
P=Path(__file__).resolve().parent; data=json.loads((P/'timeline.json').read_text()); sr=24000;n=int(np.ceil(data['duration']*sr))
voice,vs=sf.read(P/'out/voice.wav',dtype='float32'); assert vs==sr
voice=np.pad(voice,(0,max(0,n-len(voice))))[:n]
duck=np.ones(n,dtype=np.float32)
for q in data['cues']:
 a,b=int(q['start']*sr),int(q['end']*sr);v=voice[a:b];active=v[np.abs(v)>.015];rms=np.sqrt(np.mean(active**2)) if len(active) else .1
 gain=np.clip(.105/max(rms,.001),.5,2.5);voice[a:b]*=gain
 # Smooth ducking is independent of short syllabic gaps.
 aa=max(0,a-int(.22*sr));bb=min(n,b+int(.4*sr));duck[aa:a]=np.minimum(duck[aa:a],np.linspace(1,.35,a-aa));duck[a:b]=.35;duck[b:bb]=np.minimum(duck[b:bb],np.linspace(.35,1,bb-b))
music=np.zeros((n,2),dtype=np.float32)
def note(start,midi,dur,level,pan=0,kind='pluck'):
 a=int(start*sr); count=min(int(dur*sr),n-a)
 if count<=0:return
 t=np.arange(count)/sr;f=440*2**((midi-69)/12)
 if kind=='pad':
  env=np.minimum(t/.7,1)*np.minimum((dur-t)/.8,1);v=(np.sin(2*np.pi*f*t)+.2*np.sin(2*np.pi*f*2*t))*env
 else:
  env=(1-np.exp(-t*100))*np.exp(-t*3.1);v=(np.sin(2*np.pi*f*t)+.28*np.sin(2*np.pi*f*2*t)+.09*np.sin(2*np.pi*f*3*t))*env
 v=(v*level).astype(np.float32);music[a:a+count,0]+=v*np.sqrt((1-pan)/2);music[a:a+count,1]+=v*np.sqrt((1+pan)/2)
chords=[[50,57,62,66],[47,54,59,62],[43,50,55,59],[45,52,57,61]];beat=60/88;bar=beat*4
for bi,start in enumerate(np.arange(0,data['duration'],bar)):
 sc=next((s['id'] for s in reversed(data['scenes']) if start>=s['start']),0); chord=chords[bi%4]
 density=.65 if sc in (3,4,5) else 1
 for m in chord:note(start,m,bar+.6,.008*density,(m%5-2)*.18,'pad')
 # Evolving arpeggios, occasional answering motif; sparse during reflective scenes.
 pattern=[0,2,1,3] if bi%2==0 else [2,1,3,2]
 for j,k in enumerate(pattern):
  if sc in (4,5) and j%2:continue
  note(start+j*beat,chord[k]+12,1.8,.023*density,(-1 if j%2 else 1)*.28)
 if sc in (0,1,2,7,8,9) and bi%4==3:
  for j,m in enumerate([74,73,69,66]):note(start+j*beat/2,m,1.5,.014,.15)
music*=duck[:,None]
# Let the interview question and missing-cost discovery breathe.
for qid,gap in [(14,1.3),(20,1.0)]:
 q=data['cues'][qid];a=int((q['end']-.25)*sr);b=int((q['end']+.6+gap)*sr);b=min(n,b)
 env=np.zeros(b-a);r=min(int(.25*sr),len(env)//2);env[:r]=np.linspace(1,0,r);env[-r:]=np.linspace(0,1,r);music[a:b]*=env[:,None]
fade=int(2.2*sr);music[:fade]*=np.linspace(0,1,fade)[:,None];music[-fade:]*=np.linspace(1,0,fade)[:,None]
# Quiet paper/tap cues at chapter changes, seeded and short.
rng=np.random.default_rng(8)
for sc in data['scenes'][2:9]:
 a=int(sc['start']*sr);nn=int(.16*sr);t=np.arange(nn)/sr;v=rng.normal(0,1,nn)*np.exp(-t*35)*.003
 music[a:a+nn]+=v[:,None]
sf.write(P/'out/music.wav',music,sr,subtype='PCM_24');sf.write(P/'out/mix.wav',music+voice[:,None],sr,subtype='PCM_24')
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
sub=[]
for q in data['cues']:
 words=q['words'];chunks=[]
 if words:
  curr=[];length=0
  for w in words:
   if length+len(w['text'])>54 and curr:chunks.append(curr);curr=[];length=0
   curr.append(w);length+=len(w['text'])+1
  if curr:chunks.append(curr)
  if len(chunks)>1 and len(' '.join(w['text'] for w in chunks[-1]))<18:chunks[-2].extend(chunks.pop())
  for i,ch in enumerate(chunks):
   a=q['start']+(ch[0]['start'] if i else 0);b=q['start']+(chunks[i+1][0]['start'] if i+1<len(chunks) else q['end']-q['start'])
   sub.append((a,b,' '.join(w['text'] for w in ch)))
 else:
  import re
  bits=re.findall(r'[^।!?]+[।!?]?',q['text']);total=sum(map(len,bits));a=q['start']
  for bit in bits:
   b=a+(q['end']-q['start'])*len(bit)/total;sub.append((a,b,bit.strip()));a=b
(P/'AI_Aa_Gaya_Hindi.srt').write_text('\n\n'.join(f'{i+1}\n{stamp(a)} --> {stamp(b)}\n{s}' for i,(a,b,s) in enumerate(sub))+'\n')
print('mix',data['duration'],'seconds; peak',float(np.max(np.abs(music+voice[:,None]))),'subtitle phrases',len(sub))
