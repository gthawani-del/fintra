from pathlib import Path
import json
HERE=Path(__file__).parent
header='''[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
ScaledBorderAndShadow: yes
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Paper,Noto Sans Devanagari,132,&H00E6EFF6,&H00E6EFF6,&H00352B21,&H60352B21,-1,0,0,0,100,100,0,0,1,0,2,5,60,60,60,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
'''
# Whisper small word timings, corrected to source narration start where model crossed the audio boundary.
phrases=[
(1.18,2.30,['अयोध्या।'],[1.18,1.82]),
(2.48,4.98,['जहाँ','राजमुकुट','से','भी','बड़ा','था,'],[2.48,3.14,3.80,4.04,4.22,4.56,4.82]),
(5.1,7.1,['दिया','हुआ','वचन।'],[5.1,5.38,5.66,6.0]),
(7.6,10.9,['राम','के','राज्याभिषेक','की','तैयारी','थी।'],[7.6,8.12,8.32,9.2,9.38,9.94,10.5]),
(11.22,12.70,['लेकिन','एक','निर्णय,'],[11.22,11.82,12.1,12.54]),
(12.78,16.6,['सब','कुछ','बदलने','वाला','था।'],[12.78,13.0,13.24,13.78,14.1,15.0])]
def ts(t):
 n=round(t*100);return f'0:{n//6000:02}:{n//100%60:02}.{n%100:02}'
lines=[]
def event(layer,a,b,t):lines.append(f'Dialogue: {layer},{ts(a)},{ts(b)},Paper,,0,0,0,,{t}')
for a,b,words,times in phrases:
 event(0,a,b,r'{\an7\pos(170,820)\p1\bord0\shad0\1c&H352617&\1a&H30&\fad(0,130)}m 24 0 l 1556 0 b 1570 0 1580 10 1580 24 l 1580 176 b 1580 190 1570 200 1556 200 l 24 200 b 10 200 0 190 0 176 l 0 24 b 0 10 10 0 24 0')
 size=120 if len(words)>=6 else 132
 for i,w in enumerate(words):
  text=' '.join((r'{\c&H0061D9FF&\b700}' if j==i else r'{\c&H00E6EFF6&\b700}')+word for j,word in enumerate(words))
  pos=r'\move(960,940,960,919,0,140)' if i==0 else r'\pos(960,919)'
  event(1,times[i],times[i+1],'{'+r'\an5'+pos+f'\\fs{size}'+r'\b700\bord0\shad1}'+text)
 text=' '.join((r'{\c&H0061D9FF&\b700}' if (a==5.1 and j==2) else r'{\c&H00E6EFF6&\b700}')+word for j,word in enumerate(words))
 event(1,times[-1],b,'{'+r'\an5\pos(960,919)'+f'\\fs{size}'+r'\b700\bord0\shad1\fad(0,130)}'+text)
(HERE/'kinetic-highlight.ass').write_text(header+'\n'.join(lines)+'\n')
(HERE/'caption-timing.json').write_text(json.dumps([{'start':a,'end':b,'words':w,'boundaries':t} for a,b,w,t in phrases],ensure_ascii=False,indent=2))
