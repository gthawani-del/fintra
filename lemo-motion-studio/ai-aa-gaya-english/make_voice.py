import asyncio,json,re,subprocess,sys
from pathlib import Path
import numpy as np,soundfile as sf,edge_tts
P=Path(__file__).resolve().parent
(P/'voices').mkdir(exist_ok=True);(P/'out').mkdir(exist_ok=True)
rows=json.loads((P/'script.json').read_text())
semaphore=asyncio.Semaphore(2)
async def make(i,r):
 f=P/'voices'/f'{i:02}.mp3';b=P/'voices'/f'{i:02}.json'
 if 'reuse' in r:
  a,d=r['reuse'];subprocess.run(['ffmpeg','-v','error','-y','-ss',str(a),'-i',sys.argv[1],'-t',str(d),'-c:a','libmp3lame','-b:a','192k',str(f)],check=True);b.write_text('[]');return
 if f.exists() and b.exists() and f.stat().st_size>2000:return
 async with semaphore:
  for attempt in range(3):
   try:
    voice='en-IN-NeerjaNeural' if r['who'] in ['tara','meera'] else 'en-IN-PrabhatNeural'
    comm=edge_tts.Communicate(r['text'],voice,rate='-5%' if r['who'] in ['meera','rajiv'] else '+0%',boundary='WordBoundary')
    bounds=[]
    with f.open('wb') as out:
     async for event in comm.stream():
      if event['type']=='audio':out.write(event['data'])
      elif event['type']=='WordBoundary':bounds.append(dict(start=event['offset']/1e7,end=(event['offset']+event['duration'])/1e7,text=event['text']))
    tokens=r['text'].split()
    if len(tokens)==len(bounds):
     for w,token in zip(bounds,tokens):w['text']=token
    b.write_text(json.dumps(bounds,ensure_ascii=False));print(i,r['who'],'done',flush=True);return
   except Exception as e:
    print(i,str(e)[:100],flush=True)
    if attempt==2:raise
async def main():await asyncio.gather(*(make(i,r) for i,r in enumerate(rows)))
asyncio.run(main())
# Audio is the timeline authority. Scene changes receive a short breathing space.
cues=[];scenes=[];cursor=3.2;last=-1;audio=[];sr=24000
for i,r in enumerate(rows):
 if r['scene']!=last:
  if scenes:scenes[-1]['end']=cursor+.3
  cursor+=.8 if last>=0 else 0
  scenes.append(dict(id=r['scene'],start=cursor-1.0));last=r['scene']
 f=P/'voices'/f'{i:02}.wav';subprocess.run(['ffmpeg','-v','error','-y','-i',str(P/'voices'/f'{i:02}.mp3'),'-ar',str(sr),'-ac','1',str(f)],check=True)
 a,_=sf.read(f);dur=len(a)/sr
 cues.append(dict(id=i,scene=r['scene'],who=r['who'],text=r['text'],start=round(cursor,3),end=round(cursor+dur,3),words=json.loads((P/'voices'/f'{i:02}.json').read_text())))
 audio.append((cursor,a));cursor+=dur+(.8 if r['who']=='narrator' else .6)
 # Hold a real silence after interview follow-up and missing delivery revelation.
 if i==14:cursor+=1.3
 if r['scene']==5 and r['who']=='tara':cursor+=1.0
scenes[-1]['end']=cursor+1.0;endcard=cursor+1.0;duration=round(endcard+7,3)
scenes.append(dict(id=9,start=endcard,end=duration))
v=np.zeros(int(np.ceil(duration*sr)))
for start,a in audio:v[round(start*sr):round(start*sr)+len(a)]+=a
sf.write(P/'out'/'voice.wav',v,sr)
env=[round(float(min(1,np.sqrt(np.mean(v[j:j+400]**2))*11)),3) for j in range(0,len(v),400)]
(P/'mouth.json').write_text(json.dumps(env));(P/'timeline.json').write_text(json.dumps(dict(duration=duration,scenes=scenes,cues=cues),ensure_ascii=False,indent=2))
print('DURATION',duration,'CUES',len(cues),flush=True)
