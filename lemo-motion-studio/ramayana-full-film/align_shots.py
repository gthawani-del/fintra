import json,re
from pathlib import Path
p=Path(__file__).parent;t=json.loads((p/'timeline.json').read_text())
anchors=[
[None,'सरयू','विश्वामित्र','विवाह सीता','अब नगर'],
[None,'मंथरा','कैकेयी ने दशरथ','पहला','दशरथ के लिए','राम ने पिता'],
[None,'लक्ष्मण', 'पीछे', '@0','@13','@27'],
[None,'लौटे हुए भरत','दोनों भाइयों','खड़ाऊँ','स्वामी नहीं'],
[None,'शूर्पणखा','लंका में रावण','स्वर्ण मृग','राम को आश्रम','अकेली सीता','जटायु ने','लौटकर राम'],
[None,'हनुमान ने','राम और सुग्रीव','वाली के वध','फिर सीता'],
[None,'जाम्बवान','वे पर्वत','फिर उन्होंने','@0','@12','@26'],
[None,'अशोक वाटिका','हनुमान ने सावधानी','मुद्रिका','सीता ने अपना','लंका में आगे'],
[None,'विभीषण ने','राम की शरण','नल के','किसी ने भार','हनुमान ने जो'],
[None,'युद्ध टालने','कुंभकर्ण','इंद्रजित','लक्ष्मण गंभीर','पर्वत उठा','लक्ष्मण फिर','राम और रावण','शस्त्र शांत'],
[None,'लेकिन पुनर्मिलन','आहत होकर सीता','अग्नि ने','इसके बाद','पुष्पक'],
[None,'भरत अपने','राज्य का दायित्व','राज्याभिषेक','मुकुट फिर']]
def clean(s):return re.sub(r'[^\w\s\u0900-\u097f]','',s).replace('।','').strip()
for ch,aa in zip(t['chapters'],anchors):
 words=ch['words'];joined=' '.join(clean(w['text']) for w in words);positions=[];c=0
 for w in words:positions.append(c);c+=len(clean(w['text']))+1
 last=0;starts=[]
 for j,a in enumerate(aa):
  if a is None:v=0
  elif a.startswith('@'):v=ch['songStart']-ch['start']+float(a[1:])
  else:
   pos=joined.find(clean(a),last)
   if pos<0:print('MISSING',ch['id'],a);v=ch['shots'][j]['start']
   else:
    wi=max(i for i,x in enumerate(positions) if x<=pos);v=words[wi]['start']+1.3;last=pos+len(a)
  if starts:v=max(v,starts[-1]+1.2)
  starts.append(v)
 for j,sh in enumerate(ch['shots']):sh['start']=starts[j];sh['end']=starts[j+1] if j+1<len(starts) else ch['duration']
 print(ch['id'],[(s['id'],round(s['start'],1)) for s in ch['shots']])
(p/'timeline.json').write_text(json.dumps(t,ensure_ascii=False,indent=2))
