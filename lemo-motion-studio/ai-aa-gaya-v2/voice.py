import asyncio
from pathlib import Path
P=Path(__file__).resolve().parent
LINES=[
('tara','hi-IN-SwaraNeural','पापा, आज कॉलेज में सब ए आई की बात कर रहे थे।','+0%'),
('rajiv','hi-IN-MadhurNeural','हमारे दफ़्तर में भी यही चर्चा है। पहले नया काम सीखना पड़ता था। अब कहते हैं, मशीन हमारा काम सीख रही है।','+0%'),
('meera','hi-IN-SwaraNeural','मैंने तो आज इस्तेमाल भी कर लिया। एक ग्राहक को जवाब देना था। तुम तो मीटिंग में थे।','-5%'),
('narrator','hi-IN-MadhurNeural','एक ही घर में, ए आई के तीन अलग मतलब थे। राजीव को अपने काम की चिंता थी। तारा को अपने भविष्य की। और मीरा को बस अपना काम थोड़ा आसान बनाना था।','+0%')]
async def main():
 import edge_tts
 (P/'out').mkdir(exist_ok=True)
 for name,voice,text,rate in LINES:
  await edge_tts.Communicate(text,voice,rate=rate).save(str(P/'out'/f'{name}.mp3'))
  print(name,'generated',flush=True)
if __name__=='__main__':asyncio.run(main())
