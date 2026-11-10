import json,subprocess,sys
from pathlib import Path
from PIL import Image,ImageDraw
p=Path(__file__).parent;t=json.loads((p/'timeline.json').read_text());part=int(sys.argv[1]);chapters=t['chapters'][(part-1)*4:part*4];offset=chapters[0]['start'];frames=[]
for ch in chapters:
 for sh in ch['shots']:
  moment=ch['start']-offset+sh['start']+min(1.5,(sh['end']-sh['start'])/2)
  out=p/'out'/f"sample-{ch['id']:02}-{sh['id']}.jpg"
  subprocess.run(['ffmpeg','-v','error','-y','-ss',str(moment),'-i',str(p/'out'/f'part{part}.mp4'),'-frames:v','1','-vf','scale=384:216',str(out)],check=True)
  frames.append((out,ch['id'],sh['id']))
for page in range((len(frames)+11)//12):
 batch=frames[page*12:(page+1)*12];im=Image.new('RGB',(1152,4*244),'#e8ddc8');d=ImageDraw.Draw(im)
 for i,(f,n,name) in enumerate(batch):
  x=i%3*384;y=i//3*244;im.paste(Image.open(f),(x,y));d.text((x+8,y+220),f'{n}: {name}',fill='black')
 im.save(p/'out'/f'part{part}-sheet-{page}.jpg',quality=85)
print(len(frames),'encoded shot samples')
