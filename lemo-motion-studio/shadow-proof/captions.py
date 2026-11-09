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
# Original script retained. Whisper small estimates; merged tokens split proportionally. Opening uses original cue + observed voice lead-in.
phrases=[
(1.15,3.85,['कैकेयी','ने','अपने','दो','वर','माँगे।'],[1.15,1.65,1.9,2.26,2.5,2.72,3.14]),
(4.26,5.76,['भरत','को','राजगद्दी,'],[4.26,4.56,4.76,5.42]),
(5.8,9.25,['और','राम','को','चौदह','वर्ष','का','वनवास।'],[5.8,5.92,6.22,6.42,6.86,7.12,7.36,7.96]),
(10.06,12.25,['दशरथ','मौन','रह','गए।'],[10.06,10.64,11.0,11.22,11.48]),
(12.5,14.24,['राम','ने','पिता','के','वचन','को,'],[12.5,12.9,13.12,13.36,13.58,13.92,14.24]),
(14.24,17.5,['अपना','मार्ग','बना','लिया।'],[14.24,14.7,15.06,15.34,15.62])]

def ts(t):
 n=round(t*100);return f'0:{n//6000:02}:{n//100%60:02}.{n%100:02}'
lines=[]
def event(layer,a,b,t):lines.append(f'Dialogue: {layer},{ts(a)},{ts(b)},Paper,,0,0,0,,{t}')
for a,b,words,times in phrases:
 event(0,a,b,r'{\an7\pos(170,820)\p1\bord0\shad0\1c&H352617&\1a&H30&\fad(0,130)}m 24 0 l 1556 0 b 1570 0 1580 10 1580 24 l 1580 176 b 1580 190 1570 200 1556 200 l 24 200 b 10 200 0 190 0 176 l 0 24 b 0 10 10 0 24 0')
 size=104 if len(words)>=7 else 120 if len(words)>=6 else 132
 for i,w in enumerate(words):
  text=' '.join((r'{\c&H0061D9FF&\b700}' if j==i else r'{\c&H00E6EFF6&\b700}')+word for j,word in enumerate(words))
  pos=r'\move(960,940,960,919,0,140)' if i==0 else r'\pos(960,919)'
  event(1,times[i],times[i+1],'{'+r'\an5'+pos+f'\\fs{size}'+r'\b700\bord0\shad1}'+text)
 text=' '.join((r'{\c&H0061D9FF&\b700}' if (a==14.24 and j==1) else r'{\c&H00E6EFF6&\b700}')+word for j,word in enumerate(words))
 event(1,times[-1],b,'{'+r'\an5\pos(960,919)'+f'\\fs{size}'+r'\b700\bord0\shad1\fad(0,130)}'+text)
(HERE/'kinetic-highlight.ass').write_text(header+'\n'.join(lines)+'\n')
(HERE/'caption-timing.json').write_text(json.dumps([{'start':a,'end':b,'words':w,'boundaries':t} for a,b,w,t in phrases],ensure_ascii=False,indent=2))
