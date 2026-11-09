import numpy as np
from scipy.io import wavfile
from pathlib import Path
p=Path(__file__).parent
sr,a=wavfile.read(p/'assets/audio.wav');a=a.astype(np.float64)/32768
rng=np.random.default_rng(45)
for start in [2.26,4.26,7.36,13.58,16.5]:
 t=np.arange(int(.12*sr))/sr
 tap=(np.sin(2*np.pi*720*t)*.65+rng.normal(0,.2,len(t)))*np.exp(-t*65)*.012
 i=int(start*sr);a[i:i+len(tap)]+=tap[:,None]
t=np.arange(int(1.2*sr))/sr
gong=sum(np.sin(2*np.pi*f*t)*np.exp(-t*(3+j*.4)) for j,f in enumerate([146,219,335,489]))*.008
i=int(5.8*sr);a[i:i+len(gong)]+=gong[:,None]
wavfile.write(p/'out/mix.wav',sr,np.int16(np.clip(a,-.98,.98)*32767))
