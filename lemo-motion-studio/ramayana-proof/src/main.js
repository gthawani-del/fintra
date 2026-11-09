import {buildOil} from './oil.js';import {buildShadow} from './shadow.js';import {buildPaper} from './paper.js';
const cv=document.getElementById('film');cv.width=innerWidth;cv.height=innerHeight;const c=cv.getContext('2d');
const W=1600,H=900,C=x=>Math.max(0,Math.min(1,x)),E=x=>{x=C(x);return x*x*(3-2*x)};
await document.fonts.load('40px Dev');await document.fonts.load('30px Hindi');
const oil=await buildOil(),shadow=buildShadow(),paper=buildPaper();
const cues=await fetch('narration.json').then(r=>r.json());
const split=[['अयोध्या। जहाँ राजमुकुट से भी बड़ा था,','दिया हुआ वचन।'],['राम के राज्याभिषेक की तैयारी थी।','लेकिन एक निर्णय, सब कुछ बदलने वाला था।'],['कैकेयी ने अपने दो वर माँगे।','भरत को राजगद्दी, और राम को चौदह वर्ष का वनवास।'],['दशरथ मौन रह गए।','राम ने पिता के वचन को, अपना मार्ग बना लिया।'],['दूर, समुद्र के उस पार,','सीता की खोज में एक नई आशा जागी।'],['हनुमान ने छलाँग लगाई। सामने अथाह सागर था।','मन में केवल एक संकल्प।']];
function label(title,sub,t,x=156,y=175,col='#f6e5be'){let a=C(t/.7)*C((5.7-t)/.7);if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='left';c.shadowColor='rgba(0,0,0,.35)';c.shadowBlur=8;c.fillStyle=col;c.font='42px Dev';c.fillText(title,x,y);c.font='17px sans-serif';c.letterSpacing='3px';c.fillText(sub,x+2,y+34);c.restore();}
function captions(t){let i=cues.findIndex(q=>t>=q.start&&t<q.start+q.duration+.1);if(i<0)return;let q=cues[i];let g=c.createLinearGradient(0,755,0,900);g.addColorStop(0,'rgba(12,19,24,0)');g.addColorStop(.5,'rgba(12,19,24,.78)');g.addColorStop(1,'rgba(12,19,24,.91)');c.fillStyle=g;c.fillRect(0,755,1600,145);c.fillStyle='#f7edda';c.textAlign='center';c.font='29px Hindi';c.shadowColor='rgba(0,0,0,.7)';c.shadowBlur=4;split[i].forEach((s,j)=>c.fillText(s,800,827+j*42));c.shadowBlur=0;}
window.DUR=54;
window.render=t=>{c.setTransform(cv.width/W,0,0,cv.height/H,0,0);c.clearRect(0,0,W,H);
if(t<17){oil(c,t);label('अयोध्या','01  /  THE PROMISE',t,156,175,'#334344');}
else if(t<35){shadow(c,t-17);label('दो वरदान','02  /  THE PRICE OF A PROMISE',t-17,156,175,'#543824');}
else{paper(c,t-35);label('सागर के पार','03  /  THE LEAP OF FAITH',t-35,880,190);}
// warm material wipes rather than image cross-dissolves
for(let edge of [17,35])if(t>=edge-.48&&t<edge+.48){let q=(t-(edge-.48))/.96;let x=-1800+q*3600;c.save();c.fillStyle=edge===17?'#dec08b':'#263e4a';c.beginPath();c.moveTo(x,0);for(let y=0;y<=900;y+=30)c.lineTo(x+180+Math.sin(y*.027)*25,y);c.lineTo(x+1700,900);c.lineTo(x+1700,0);c.closePath();c.fill();c.restore();}
captions(t);
if(t>51.4){let a=E((t-51.4)/.8);c.save();c.globalAlpha=a;c.fillStyle='#f0dfb8';c.textAlign='left';c.font='46px Dev';c.fillText('रामायण',150,228);c.font='22px Hindi';c.fillText('वचन से विजय तक',153,271);c.restore();}
};
window.TEXTS=()=>[];window.READY=true;window.render(0);
