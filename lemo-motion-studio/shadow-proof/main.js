import {piece,drawPiece,cut,cutLine,beadLine,cloud,scales,within,ink} from './engine/carve.js';
const cv=document.querySelector('canvas');cv.width=1920;cv.height=1080;const c=cv.getContext('2d');
const E=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)},ease=(t,a,b)=>E((t-a)/(b-a));
const P=(g,s,col,stroke='#351d14',w=3)=>{let p=new Path2D(s);g.fillStyle=col;g.fill(p);g.strokeStyle=stroke;g.lineWidth=w;g.stroke(p);return p};
function hole(g,x,y,r){cut(g,q=>q.arc(x,y,r,0,Math.PI*2))}
function floral(g,x,y,r){for(let i=0;i<8;i++){let a=i*Math.PI/4;cut(g,q=>q.ellipse(x+Math.cos(a)*r*.55,y+Math.sin(a)*r*.55,r*.27,r*.10,a,0,Math.PI*2))}hole(g,x,y,2.5)}
function band(g,y,x0,x1){beadLine(g,x0,y,x1,y,2.5,12);for(let x=x0+8;x<x1;x+=25)floral(g,x,y+15,11)}
function robe(kind,col){return piece([-110,-15,130,365],g=>{let s=kind==='queen'?'M-37 0 Q-78 25-53 117 Q-75 203-104 330 Q0 365 125 328 Q65 203 48 100 L48 10 Q0-16-37 0Z':'M-48 0 Q-79 58-52 130 L-91 295 Q10 330 115 288 L51 130 Q64 65 43 4 Q0-18-48 0Z';const p=P(g,s,col);g.save();g.clip(p);for(let y=35;y<330;y+=44){for(let x=-80;x<110;x+=38)floral(g,x+(y%3)*7,y,15)}for(let y of [18,110,300,328])band(g,y,-95,120);g.restore();if(kind==='queen'){P(g,'M-52 8 Q-32 93 71 239 L101 325 L72 334 Q31 226-37 169 Q-67 78-52 8Z','#d78a23');for(let y=40;y<270;y+=25)hole(g,-37+(y-40)*.45,y,3)}else{P(g,'M-56 100 Q0 114 55 97 L59 123 Q0 139-58 123Z','#c69326');beadLine(g,-46,116,47,116,3,13)}})}
function head(kind){return piece([-84,-143,91,70],g=>{
 P(g,'M-34-90 Q12-111 43-79 L50-48 L76-31 L52-20 Q68-9 53 2 L50 26 Q30 46 4 24 L-1 62 L-40 56 L-34 13 Q-65-29-34-90Z','#d8a55b');
 if(kind==='queen'){P(g,'M-38-87 Q-78-78-67-31 L-52 18 L-28 29 Q-43-20-25-54 L21-70 L48-72 Q12-122-38-87Z','#342418');P(g,'M-63-39 Q-102-56-76-88 Q-44-112-44-67Z','#3b2619');}
 else if(kind==='king'){P(g,'M-40-25 L-28 7 Q-7 36 47 22 L26 64 L-3 45 L-34 33Z','#6a4729');for(let i=0;i<6;i++)cutLine(g,1.8,q=>{q.moveTo(-28+i*11,18);q.lineTo(-15+i*7,43)});P(g,'M11-5 Q35-23 59-8 Q41 5 32-4 Q22 8 11-5Z','#392015');}
 else {P(g,'M-39-85 Q-69-63-51-3 L-40 15 L-27-23 Q-38-60 25-73 L47-76 Q8-116-39-85Z','#2b2319');P(g,'M-42-92 Q-73-135-30-139 Q15-136-2-103Z','#2b2319');}
 if(kind!=='rama'){P(g,'M-48-80 L-55-107 L-31-103 L-21-137 L-1-110 L19-143 L31-108 L51-114 L47-80Z','#c38920');beadLine(g,-37,-91,39,-91,3,11);floral(g,13,-117,13)}
 ink(g,3,q=>{q.moveTo(10,-47);q.quadraticCurveTo(31,-54,43,-43)});P(g,'M14-37 Q28-46 40-35 Q26-28 14-37Z','#f5dba0','#4b2817',2);g.fillStyle='#2a1810';g.beginPath();g.arc(31,-36,3,0,7);g.fill();
 ink(g,2,q=>{q.moveTo(48,8);q.lineTo(58,7)});P(g,'M-16-13 Q-37-29-32-5 Q-30 8-14 6Z','#ce913c');hole(g,-22,-7,3);P(g,'M-21 8 Q-35 27-16 37 Q0 24-21 8Z','#d2a02c');hole(g,-18,23,5);
 if(kind==='rama'){ink(g,3,q=>{q.moveTo(34,-70);q.lineTo(35,-54)},'#8f211d');}
 },{seed:kind.length})}
function limb(len,w,col){return piece([-w-3,-w-3,len+w+4,w+5],g=>{P(g,`M0 ${-w} Q${len*.5} ${-w*.65} ${len} ${-w*.65} Q${len+w} 0 ${len} ${w*.65} Q${len*.5} ${w*.8} 0 ${w} Q${-w} 0 0 ${-w}Z`,col);for(let x=14;x<len-8;x+=18)hole(g,x,0,3);P(g,`M${len-18} ${-w} L${len-7} ${-w} L${len-7} ${w} L${len-18} ${w}Z`,'#ba8423');hole(g,0,0,4)})}
const hands={};for(const kind of ['open','two','point','rest'])hands[kind]=piece([-8,-40,68,32],g=>{const s=kind==='two'?'M0-12 L18-14 L25-38 Q29-43 33-38 L31-14 L43-35 Q49-39 51-32 L40-7 L52-2 L58 8 L45 17 L20 19 L0 11Z':kind==='point'?'M0-12 L24-12 L61-17 Q69-14 62-9 L33-3 L47 6 L45 16 L20 20 L0 10Z':kind==='open'?'M0-11 L19-14 L45-27 Q51-29 51-23 L31-10 L58-16 Q65-15 60-9 L35-2 L62-4 Q68-1 61 3 L35 7 L54 10 Q59 15 51 17 L21 20 L0 11Z':'M0-11 Q20-19 39-9 L48 4 L43 17 L18 20 L0 11Z';P(g,s,'#d1a15d');hole(g,7,0,3)});
const chars={};for(const kind of ['queen','king','rama']){let col=kind==='queen'?'#a82728':kind==='king'?'#287365':'#c67926';chars[kind]={body:robe(kind,col),head:head(kind),upper:limb(85,19,col),fore:limb(88,12,'#d1a15d')}}
function joint(x,y){c.fillStyle='#332016';c.beginPath();c.arc(x,y,6,0,7);c.fill();c.strokeStyle='#f4d18c';c.lineWidth=1.3;c.beginPath();c.moveTo(x-3,y-3);c.lineTo(x+3,y+3);c.moveTo(x+3,y-3);c.lineTo(x-3,y+3);c.stroke()}
function arm(ch,x,y,a,b,h){c.save();c.translate(x,y);c.rotate(a);drawPiece(c,ch.upper);joint(0,0);c.translate(85,0);c.rotate(b);drawPiece(c,ch.fore);joint(0,0);c.translate(88,0);drawPiece(c,hands[h]);joint(0,0);let m=c.getTransform();c.restore();return [m.e,m.f]}
function puppet(kind,x,y,scale,flip,pose,t){const ch=chars[kind];c.save();c.translate(x+Math.sin(t*3.1)*.6,y+Math.sin(t*2.7)*.7);c.scale(scale*flip,scale);c.rotate(pose.tilt||0);c.globalCompositeOperation='multiply';
 // Feet and lower robe remain attached to the body; the first step uses a small heel lift.
 for(const side of [-1,1]){c.save();c.translate(side*34,307+(pose.step||0)*side);P(c,'M-19 0 L16 0 L22 33 Q46 31 48 43 L-22 43Z','#654024');c.restore()}
 drawPiece(c,ch.body);arm(ch,-22,42,1.35,.2,'rest');
 c.save();c.translate(4,-22);c.rotate(pose.head||0);drawPiece(c,ch.head);c.restore();
 // Necklace is a separate perforated gold collar.
 P(c,'M-43-1 Q1 36 48 0 L43 24 Q0 56-43 22Z','#c29124');for(let a=0;a<7;a++){c.fillStyle='#f0cd85';c.beginPath();c.arc(-31+a*11,23+Math.sin(a/6*Math.PI)*11,2.5,0,7);c.fill()}
 const hand=arm(ch,35,34,pose.a??.4,pose.b??.7,pose.hand||'open');
 if(kind==='rama'){c.save();c.translate(-73,50);ink(c,7,q=>{q.moveTo(0,-100);q.bezierCurveTo(-60,-20,-60,170,0,240)},'#6b3e1b');ink(c,2,q=>{q.moveTo(0,-100);q.lineTo(0,240)},'#492514');c.restore()}
 const neck=c.getTransform().transformPoint(new DOMPoint(0,-15));c.restore();c.save();c.globalCompositeOperation='multiply';c.strokeStyle='rgba(70,47,28,.28)';c.lineWidth=2;c.beginPath();c.moveTo(...hand);c.lineTo(hand[0]+26,1060);c.moveTo(neck.x,neck.y);c.lineTo(neck.x-35,1060);c.stroke();c.restore();}
const palace=piece([0,0,1920,910],g=>{
 // Three carved cusped arches form the rear layer.
 for(const x of [115,695,1275]){P(g,`M${x} 110 L${x+510} 110 L${x+510} 740 L${x+466} 740 L${x+466} 341 Q${x+430} 230 ${x+345} 244 Q${x+280} 140 ${x+245} 230 Q${x+160} 202 ${x+45} 340 L${x+45} 740 L${x} 740Z`,'#c39a58','#78542c',3);band(g,130,x+10,x+500);for(let y=350;y<740;y+=38){floral(g,x+23,y,16);floral(g,x+487,y,16)}}
 P(g,'M0 0 H1920 V110 H0Z','#6c3125');for(let x=25;x<1920;x+=49)floral(g,x,55,24);
 P(g,'M0 752 H1920 V806 H0Z','#a77332');band(g,765,10,1910);
 // Empty central crown stand: the succession is the subject of the demand.
 P(g,'M835 680 L1060 680 L1060 702 L1040 715 L1040 751 L855 751 L855 715 L835 702Z','#a46b2a');band(g,691,855,1040);
 P(g,'M899 664 L894 617 L924 636 L945 598 L963 637 L995 615 L989 664Z','#b97e1e');beadLine(g,910,653,978,653,3,12);
});
const cloth=document.createElement('canvas');cloth.width=1920;cloth.height=1080;const g=cloth.getContext('2d');const gr=g.createRadialGradient(960,400,40,960,480,1200);gr.addColorStop(0,'#fff0ba');gr.addColorStop(.55,'#e9c887');gr.addColorStop(1,'#986c39');g.fillStyle=gr;g.fillRect(0,0,1920,1080);g.globalAlpha=.05;for(let y=0;y<1080;y+=3){g.fillStyle=y%6?'#fff4cb':'#473522';g.fillRect(0,y,1920,1)}for(let x=0;x<1920;x+=3){g.fillStyle=x%6?'#fff4cb':'#473522';g.fillRect(x,0,1,1080)}
function frame(t){c.globalCompositeOperation='source-over';c.drawImage(cloth,0,0);c.save();let z=1+.08*ease(t,3,8);let cx=960-60*ease(t,3,8);c.translate(960,470);c.scale(z,z);c.translate(-cx,-470);c.globalCompositeOperation='multiply';drawPiece(c,palace);
 const reaction=ease(t,7,10);let transition=ease(t,11.8,13.0);const queenX=525-1000*transition,kingX=1325-1000*transition;
 puppet('queen',queenX,370,1.10,1,{a:.35-1.2*ease(t,.7,2.0)+.48*ease(t,4.4,6),b:-.55+.25*ease(t,5,7),hand:t<4?'two':'point',head:-.04,tilt:-.025*ease(t,1,3)},t);
 puppet('king',kingX,370,1.15,t>12.4?1:-1,{a:.4+.8*reaction,b:.6-.5*reaction,head:.27*reaction,tilt:-.07*reaction,hand:'open'},t);
 if(t>11.8){let rx=2180-1000*transition-100*ease(t,16,18);puppet('rama',rx,370,1.1,-1,{a:.8*ease(t,13,14.5),b:2.2*ease(t,13,14.5),head:.13*ease(t,13.2,14.5)-.10*ease(t,15.6,17),step:5*Math.sin((t-16)*Math.PI)*ease(t,16,17),hand:'rest'},t)}
 c.restore();
 // Foreground architecture wipes between the court and the adjoining doorway.
 if(t>11.8&&t<13){let x=2150-2650*transition;c.save();c.fillStyle='#4d2b20';c.shadowColor='#51311f';c.shadowBlur=16;c.fillRect(x,0,270,1080);c.shadowBlur=0;c.strokeStyle='#bf8640';c.lineWidth=4;for(let j=0;j<5;j++)c.strokeRect(x+20+j*44,20,20,1040);c.restore()}
 c.save();c.globalCompositeOperation='multiply';c.fillStyle=`rgba(91,54,17,${.012+.006*Math.sin(t*43)+.055*ease(t,8.8,10.5)*(1-ease(t,13,15))})`;c.fillRect(0,0,1920,1080);c.restore();
 c.fillStyle='#40251c';c.fillRect(0,0,36,1080);c.fillRect(1884,0,36,1080);c.fillRect(0,0,1920,24);c.fillRect(0,1050,1920,30);c.strokeStyle='#b4813f';c.lineWidth=3;c.strokeRect(40,28,1840,1018);
}
window.DUR=18;window.TEXTS=()=>[];window.render=frame;frame(0);window.READY=true;
