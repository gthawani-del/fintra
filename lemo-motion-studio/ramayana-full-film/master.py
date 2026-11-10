import json,re,subprocess
from pathlib import Path
P=Path(__file__).parent
r=subprocess.run(['ffmpeg','-hide_banner','-i',str(P/'out/mix.wav'),'-af','loudnorm=I=-16:TP=-1.5:LRA=10:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
m=json.loads(re.findall(r'\{[^{}]+\}',r.stderr)[-1]);(P/'out/loudness-measurement.json').write_text(json.dumps(m,indent=2))
f=f"loudnorm=I=-16:TP=-1.5:LRA=10:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true:print_format=json"
r=subprocess.run(['ffmpeg','-y','-hide_banner','-i',str(P/'out/mix.wav'),'-af',f,'-ar','48000','-c:a','aac','-b:a','160k',str(P/'out/master.m4a')],capture_output=True,text=True,check=True)
(P/'out/master.log').write_text(r.stderr)
