import numpy as np
from scipy.io.wavfile import write
sr=48000
a=np.zeros(24*sr)
for t in [8,15]:
    for k,f in enumerate([440,1020.8,1870,2917.2]):
        x=np.arange(int(sr*2.5))/sr
        s=.05/(k+1)*np.sin(2*np.pi*f*x)*np.exp(-x*(2+k*.6))
        st=int(t*sr)
        a[st:st+len(s)]+=s
rng=np.random.default_rng(19)
for t in [7.7,14.7]:
    x=np.arange(int(sr*.6))/sr
    noise=rng.normal(0,.012,len(x))*np.sin(np.pi*x/.6)**2
    st=int(t*sr)
    a[st:st+len(noise)]+=noise
write('accents.wav',sr,a.astype('float32'))
