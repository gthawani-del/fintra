import asyncio,json,subprocess
from pathlib import Path
import edge_tts
P=Path(__file__).parent
lines=[
(1.0,'अयोध्या। जहाँ राजमुकुट से भी बड़ा था, दिया हुआ वचन।'),
(7.6,'राम के राज्याभिषेक की तैयारी थी। लेकिन एक निर्णय, सब कुछ बदलने वाला था।'),
(18.0,'कैकेयी ने अपने दो वर माँगे। भरत को राजगद्दी, और राम को चौदह वर्ष का वनवास।'),
(27.0,'दशरथ मौन रह गए। राम ने पिता के वचन को, अपना मार्ग बना लिया।'),
(36.0,'दूर, समुद्र के उस पार, सीता की खोज में एक नई आशा जागी।'),
(43.8,'हनुमान ने छलाँग लगाई। सामने अथाह सागर था। मन में केवल एक संकल्प।')]
async def main():
 for i,(start,text) in enumerate(lines):
  p=P/'assets'/f'voice_{i}.mp3'
  if not p.exists():await edge_tts.Communicate(text,'hi-IN-MadhurNeural',rate='+0%').save(str(p))
  d=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(p)]))
  print(i,start,round(d,2),text,flush=True)
 cues=[{'start':at,'text':txt,'file':f'assets/voice_{i}.mp3','duration':float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(P/'assets'/f'voice_{i}.mp3')]))} for i,(at,txt) in enumerate(lines)]
 (P/'narration.json').write_text(json.dumps(cues,ensure_ascii=False,indent=2))
asyncio.run(main())
