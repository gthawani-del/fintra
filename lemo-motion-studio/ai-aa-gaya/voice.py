import os,json,pathlib
os.environ['OMP_NUM_THREADS']='4'
import numpy as np,soundfile as sf,onnxruntime as ort
from kokoro_onnx import Kokoro
P=pathlib.Path(__file__).resolve().parent
M=pathlib.Path(os.environ.get('MODEL_DIR',str(P.parents[2]/'models')))
opts=ort.SessionOptions();opts.intra_op_num_threads=4;opts.inter_op_num_threads=2
k=Kokoro.from_session(ort.InferenceSession(str(M/'kokoro.onnx'),sess_options=opts,providers=['CPUExecutionProvider']),str(M/'voices.bin'))
lines=[
('tara','hf_beta','पापा, आज कॉलेज में बोला, ए आई सीखो।','Dad, college told us to learn AI today.'),
('rajiv','hm_omega','हमारे ऑफिस में भी। पहले बोले नया सॉफ्टवेयर सीखो। अब बोले, सॉफ्टवेयर खुद सीख रहा है।','Same at work. First, learn new software.\nNow the software is learning by itself.'),
('meera','hf_alpha','मैंने तो आज इस्तेमाल भी कर लिया।','I already used it today.'),
('rajiv','hm_omega','तुमने? किसलिए?','You did? What for?'),
('meera','hf_alpha','ग्राहक को जवाब देना था। तुम तो मीटिंग में थे।','A customer needed a reply.\nYou were in a meeting.'),
('narrator','hm_psi','एक ही घर में, ए आई के तीन मतलब थे।','One home. Three different meanings of AI.'),
('narrator','hm_psi','राजीव के लिए, बीस साल का अनुभव अचानक एक सवाल बन गया था।','For Rajiv, twenty years of experience\nsuddenly felt uncertain.'),
('narrator','hm_psi','तारा सोच रही थी, जो आज सीख रही हूँ, कल उसकी ज़रूरत भी होगी?','Tara wondered: will what I learn today\nstill matter tomorrow?'),
('narrator','hm_psi','और मीरा? उन्हें बस अपने छोटे से काम को थोड़ा आसान बनाना था।','And Meera? She just wanted\nto make her small business a little easier.'),
('meera','hf_alpha','देखो। ये मेरा पुराना मेन्यू। और ये, उसी का नया ड्राफ्ट।','Look. My old menu.\nAnd a new draft of the same menu.')]
cues=[];t=.65
for i,(who,v,txt,en) in enumerate(lines):
 f=P/'voices'/f'{i:02}.wav'
 if not f.exists():
  a,sr=k.create(txt,voice=v,speed=1.02,lang='hi')
  nz=np.where(np.abs(a)>max(np.abs(a))*.018)[0]
  a=a[max(0,nz[0]-720):min(len(a),nz[-1]+2400)]
  sf.write(f,a,sr)
 a,sr=sf.read(f);dur=len(a)/sr
 cues.append(dict(id=i,who=who,voice=v,text=txt,en=en,start=round(t,3),end=round(t+dur,3)))
 print(i,round(t,2),round(dur,2),flush=True)
 t+=dur+(.85 if i in [1,2,4,8] else .45)
json.dump(dict(duration=round(t+1.5,3),cues=cues),open(P/'timeline.json','w'),ensure_ascii=False,indent=2)
