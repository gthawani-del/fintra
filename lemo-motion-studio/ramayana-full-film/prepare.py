import json,math,re,subprocess
from pathlib import Path
P=Path(__file__).parent
chap=json.loads((P/'narration.json').read_text());targets=[42,44,65,43,59,48,74,48,48,60,46,42]
names=['अयोध्या','दो वर','वन की ओर','भरत का उत्तर','टूटा आश्रम','मित्रता का वचन','सागर के पार','आशा की मुद्रिका','सबके लिए मार्ग','युद्ध का मूल्य','पुनर्मिलन','अयोध्या वापसी']
shots=[['crown','city','bow','marriage','rama'],['court','whisper','boons','crown','grief','vow'],['sitaChoice','quiver','farewell','boat','walk','shelter'],['lamp','bharata','brothers','sandals','steward'],['home','conflict','conspire','deer','pursuit','empty','jatayu','loss'],['meeting','listen','alliance','vali','search'],['shore','reassure','brace','leap','flight','surasa','landing'],['garden','sita','approach','ring','token','return'],['embrace','vibhishana','welcome','nala','workers','bridge'],['armies','peace','giant','indrajit','injury','mountain','recovery','duel','silence'],['news','distance','decision','fire','pushpaka','homeward'],['arrival','reunion','family','coronation','bookend']]
start=0
for i,ch in enumerate(chap):
 ch.update(start=start,duration=targets[i],label=names[i],voiceStart=start+1.3)
 ch['songStart']=ch['voiceStart']+ch['voiceDuration']+1 if i in [2,6] else None
 ch['songDuration']=40 if i==2 else 36 if i==6 else 0
 ch['duration']=max(ch['duration'],ch['voiceDuration']+2.3+ch['songDuration']+2)
 # shot spacing is a workprint layout; later edit uses precise dialogue beats.
 weights=[1]*len(shots[i]); boundaries=[j*ch['duration']/len(shots[i]) for j in range(len(shots[i])+1)]
 ch['shots']=[{'id':name,'start':boundaries[j],'end':boundaries[j+1]} for j,name in enumerate(shots[i])]
 ch['phrases']=[]
 # Preserve the exact script punctuation and spelling; use provider word boundary positions.
 tokens=ch['text'].split();words=ch['words']; index=0
 while index<len(words):
  end=min(index+6,len(words))
  for k in range(index,min(index+6,len(words))):
   if k<len(tokens) and re.search('[।?!]$',tokens[k]) and k>=index+2: end=k+1;break
  group=words[index:end]
  ch['phrases'].append({'start':group[0]['start'],'end':min(ch['voiceDuration'],group[-1]['end']+.24),'words':group})
  index=end
 start+=ch['duration']
(P/'timeline.json').write_text(json.dumps({'duration':start,'chapters':chap},ensure_ascii=False,indent=2))
print('TOTAL',start)
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
srt=[]
for ch in chap:
 for ph in ch['phrases']:
  srt.append(f"{len(srt)+1}\n{stamp(ch['voiceStart']+ph['start'])} --> {stamp(ch['voiceStart']+ph['end'])}\n{' '.join(w['text'] for w in ph['words'])}\n")
(P/'Ramayana_Workprint_Hindi.srt').write_text('\n'.join(srt))
