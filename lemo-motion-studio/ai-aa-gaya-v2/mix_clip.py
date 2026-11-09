from pathlib import Path
import json,subprocess,sys,numpy as np,soundfile as sf
P=Path(__file__).resolve().parent;O=P/'out';O.mkdir(exist_ok=True)
source=Path(sys.argv[1]) if len(sys.argv)>1 else P/'out'/'AI_Aa_Gaya_Hindi_Voice_V2.mp3'
subprocess.run(['ffmpeg','-v','error','-y','-i',str(source),'-t','27.728','-ar','48000','-ac','1',str(O/'speech.wav')],check=True)
a,sr=sf.read(O/'speech.wav');N=30*sr;voice=np.zeros(N);voice[sr:sr+len(a)]=a
# Speech-driven puppet mouth envelope, not phoneme lip-sync.
env=[]
for i in range(0,N,800):env.append(float(min(1,np.sqrt(np.mean(voice[i:i+800]**2))*12)))
(P/'mouth.json').write_text(json.dumps(env))
t=np.arange(N)/sr;music=np.zeros((N,2));rng=np.random.default_rng(33)
# Original 88 BPM D-major progression, fingerpicked voicings with a soft felt attack.
chords=[[146.832,220,293.665,369.994],[123.471,185,246.942,293.665],[98,146.832,196,246.942],[110,164.814,220,277.183]]
def note(at,f,d=2.0,gain=.023,pan=0):
 start=int(at*sr);n=min(int(d*sr),N-start)
 if n<=0:return
 tt=np.arange(n)/sr
 y=(np.sin(2*np.pi*f*tt)+.23*np.sin(2*np.pi*f*2*tt)+.09*np.sin(2*np.pi*f*3*tt))*np.exp(-tt*2.8)*(1-np.exp(-tt*70))*gain
 music[start:start+n,0]+=y*np.sqrt((1-pan)/2);music[start:start+n,1]+=y*np.sqrt((1+pan)/2)
beat=60/88
for b in range(44):
 at=b*beat;ch=chords[(b//8)%4];note(at,ch[[0,2,1,3][b%4]],gain=.032 if b%4==0 else .022,pan=(-.25 if b%2 else .25))
 if b%4==0:note(at,ch[0]/2,d=2.6,gain=.018)
# Sparse musical reply after the mother's line, ending in D.
for at,f in [(28.1,369.994),(28.45,329.628),(28.9,293.665)]:note(at,f,gain=.022)
duck=np.ones(N)
for start,end in [(1,5.848),(6.848,18.512),(19.512,28.728)]:
 mask=np.clip((t-start+.15)/.2,0,1)*np.clip((end+.35-t)/.35,0,1);duck*=1-.48*mask
music*=duck[:,None]*np.minimum(1,t/.7)[:,None]*np.clip((30-t)/1.05,0,1)[:,None]
# Short paper rustle and card clicks at camera cuts; no sounds over word onsets.
sfx=np.zeros(N)
for at in [.15,6.2,18.9]:
 n=int(.16*sr);tt=np.arange(n)/sr;noise=rng.normal(0,1,n);noise=np.convolve(noise,np.ones(9)/9,mode='same');sound=.012*noise*np.sin(np.pi*tt/.16)**2;ii=int(at*sr);sfx[ii:ii+n]+=sound
mix=voice[:,None]*np.ones((1,2))+music*2.8+sfx[:,None]
sf.write(O/'clip_mix.wav',mix,sr,subtype='PCM_24')
print('30 seconds mixed; source speech preserved; music ducked under voice')
