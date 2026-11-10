import asyncio,json,re,os,subprocess,hashlib
from pathlib import Path
import edge_tts
from edge_tts import communicate
if os.getenv('SSL_CERT_FILE'): communicate._SSL_CTX.load_verify_locations(os.environ['SSL_CERT_FILE'])
P=Path(__file__).parent
s=(P/'TREATMENT.md').read_text().split('## 2. Full narration script and scene direction')[1].split('## 3. Two original song passages')[0]
parts=re.findall(r'### (\d+) • (.*?) • (.*?)\n\n\*\*Narrator[^\n]*\n(.*?)\n\n\*\*',s,re.S)
async def main():
 chapters=[]
 for n,title,slot,txt in parts:
  path=P/'assets'/f'chapter-{int(n):02}.mp3'; timing=path.with_suffix('.json')
  request=path.with_suffix('.request.json')
  fingerprint=hashlib.sha256((txt.strip()+'|hi-IN-MadhurNeural|+0%').encode()).hexdigest()
  cached=json.loads(request.read_text()).get('sha256') if request.exists() else None
  if not path.exists() or not timing.exists() or cached!=fingerprint:
   words=[]
   with path.open('wb') as f:
    async for chunk in edge_tts.Communicate(txt.strip(),'hi-IN-MadhurNeural',rate='+0%',boundary='WordBoundary').stream():
     if chunk['type']=='audio':f.write(chunk['data'])
     elif chunk['type']=='WordBoundary':words.append({'start':chunk['offset']/1e7,'end':(chunk['offset']+chunk['duration'])/1e7,'text':chunk['text']})
   timing.write_text(json.dumps(words,ensure_ascii=False,indent=2))
   request.write_text(json.dumps({'sha256':fingerprint,'voice':'hi-IN-MadhurNeural','rate':'+0%'}))
  dur=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(path)]))
  chapters.append({'id':int(n),'title':title,'text':txt.strip(),'voiceDuration':dur,'words':json.loads(timing.read_text())})
  print(n,title,dur,flush=True)
 (P/'narration.json').write_text(json.dumps(chapters,ensure_ascii=False,indent=2))
asyncio.run(main())
