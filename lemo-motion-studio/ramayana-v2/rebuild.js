import {material} from './materials.js';
import {forest} from './forest.js';
import {c,E,P,chars,cloth,drawPiece} from './puppets.js';
const mix=(a,b,p)=>a+(b-a)*E(p),clamp=x=>Math.max(0,Math.min(1,x));
function line(points,col,w){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke()}
function ellipse(x,y,rx,ry,col){c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()}
export function stage(t,war=false){
 const g=c.createRadialGradient(war?1300:900,430,20,960,500,1120);
 g.addColorStop(0,war?'#f18c66':'#68b5c3');g.addColorStop(.52,war?'#a12c56':'#30598d');g.addColorStop(1,'#15224c');c.fillStyle=g;c.fillRect(0,0,1920,1080);
 c.save();c.globalAlpha=.13;c.globalCompositeOperation='soft-light';c.drawImage(cloth,0,0,1920,1080);c.restore();
 // Distant architecture and hills are deliberately low contrast.
 for(let j=0;j<9;j++){let x=j*280-200;c.fillStyle=war?'#49244e':'#244963';c.globalAlpha=.26;c.beginPath();c.moveTo(x,780);c.quadraticCurveTo(x+140,500+(j%3)*70,x+360,780);c.fill()}c.globalAlpha=1;
 if(war){for(let j=0;j<11;j++){let x=j*190;P(c,`M${x} 755 V620 H${x+20} V590 H${x+45} V620 H${x+80} V755Z`,'#402547','#402547',0)}}
 const ground=c.createLinearGradient(0,755,0,1080);ground.addColorStop(0,'#242545');ground.addColorStop(1,'#151b25');c.fillStyle=ground;c.fillRect(0,785,1920,295);
 c.strokeStyle='rgba(255,211,142,.35)';c.lineWidth=2;c.beginPath();c.moveTo(0,785);c.lineTo(1920,785);c.stroke();
 // Foreground foliage frames the stage without a rectangular border.
 for(let side of (war?[]:[0,1])){c.save();c.translate(side?1920:0,0);c.scale(side?-1:1,1);P(c,'M0 0 H90 Q48 340 140 800 L0 1080Z','#172127','#172127',0);for(let j=0;j<7;j++){c.save();c.translate(20,130+j*86);c.rotate(-.5+j*.11);ellipse(0,0,210-j*16,22,'#132b45');c.restore()}c.restore()}
 for(let j=0;j<36;j++){let x=(j*137+t*(war?22:6))%1920,y=(j*79-t*(war?19:5)+2160)%900;ellipse(x,y,j%3?1.3:2.4,j%3?1.3:2.4,war?'rgba(255,172,78,.43)':'rgba(255,235,179,.3)')}
}
// Articulated arm with a fixed world-space hand target; elbow bends naturally.
function reach(ch,sx,sy,tx,ty,bend=1){
 let dx=tx-sx,dy=ty-sy,L=96,D=Math.max(.001,Math.hypot(dx,dy));if(D>188){dx*=188/D;dy*=188/D;D=188;tx=sx+dx;ty=sy+dy}
 const h=Math.sqrt(Math.max(0,L*L-D*D/4)),ex=sx+dx/2-dy/D*h*bend,ey=sy+dy/2+dx/D*h*bend;
 for(const [x,y,a,b,piece] of [[sx,sy,ex,ey,ch.upper],[ex,ey,tx,ty,ch.fore]]){c.save();c.translate(x,y);c.rotate(Math.atan2(b-y,a-x));c.scale(Math.hypot(a-x,b-y)/85,1);drawPiece(c,piece);c.restore()}
 ellipse(tx,ty,14,9,'#d5ab6b');line([[tx-8,ty],[tx+16,ty-4]],'#efd196',3);
}
export function figure(k,x,ground,s,flip,t,pose={}){
 const ch=chars[k];ellipse(x,ground+8,90*s,13*s,'rgba(5,13,20,.34)');
 c.save();c.translate(x,ground-350*s);c.scale(s*flip,s);
 c.rotate(pose.tilt||0);
 c.shadowColor='rgba(20,14,18,.45)';c.shadowBlur=15;c.shadowOffsetX=-10;c.shadowOffsetY=6;
 // Legs shift from planted weight to a short measured step.
 for(let side of [-1,1]){let st=(pose.step||0)*side;line([[side*31,265],[side*31+st,322],[side*31+st+18,345]],'#69492e',23);line([[side*31+st,345],[side*31+st+40,345]],'#cda466',13)}
 drawPiece(c,ch.body);c.shadowBlur=0;c.shadowOffsetX=0;c.shadowOffsetY=0;
 reach(ch,-24,42,...(pose.back||[-30,205]),-1);
 c.save();c.translate(4,-22);c.rotate(pose.head||0);drawPiece(c,ch.head);c.restore();
 P(c,'M-43-1 Q0 36 48 0 L43 24 Q0 56-43 22Z','#c39248','#523823',2);
 reach(ch,35,34,...(pose.hand||[135,100]),pose.bend||1);
 if(['hanuman','sugriva','vali'].includes(k)){c.strokeStyle='#c4a477';c.lineWidth=12;c.beginPath();c.moveTo(-60,225);c.bezierCurveTo(-220,280,-220,50,-150,40);c.bezierCurveTo(-90,25,-125,100,-150,70);c.stroke()}
 c.restore();
}
function vignette(){let g=c.createRadialGradient(960,500,400,960,540,1100);g.addColorStop(0,'transparent');g.addColorStop(1,'rgba(8,15,25,.44)');c.fillStyle=g;c.fillRect(0,0,1920,1080)}
export function rebuilt(id,u,d,t,ch,A){
 if(!['embrace','brothers','reunion','duel','pushpaka','homeward','welcome','surasa','nala','workers','bridge','injury','recovery','armies','silence'].includes(id))return false;
 const p=clamp(u/d);
 if(id==='surasa'){
 c.drawImage(material('ocean',t),0,0,1920,1080);
 // A recognisable paper serpent: coiled neck, open jaws, eye and teeth.
 c.save();c.translate(1450,800);c.rotate(-.08*Math.sin(t));
 P(c,'M200 250 Q-220 150-160-100 Q-140-290 80-370 L160-330 Q-40-240 10-60 Q150 40 300 140Z','#42676b','#243b4c',9);
 P(c,'M-80-280 Q-180-430-90-480 L180-460 L220-400 L20-390 L-40-320Z','#728b78','#253d4a',7);
 P(c,'M-60-260 L120-180 L210-250 L20-300Z','#728b78','#253d4a',7);
 ellipse(80,-435,12,8,'#e6c470');
 for(let j=0;j<5;j++)P(c,`M${j*34-25}-392 l17 40 l13-40Z`,'#e4d5ad','#9f9e83',1);
 c.restore();
 const shrink=1-.75*E((p-.3)/.4),h=440*shrink,x=mix(420,1530,p),y=440+Math.sin(p*Math.PI)*80;c.drawImage(A.fly,x-h*.88,y-h*.4,h*1.77,h);vignette();return true;
 }
 if(id==='pushpaka'||id==='homeward'){
 const sky=c.createLinearGradient(0,0,0,1080);sky.addColorStop(0,'#324c66');sky.addColorStop(.7,'#edc897');sky.addColorStop(1,'#9c8f79');c.fillStyle=sky;c.fillRect(0,0,1920,1080);
 for(let j=0;j<8;j++){c.fillStyle=j%2?'#f4dfb9':'#c4b8a1';c.globalAlpha=.4;c.beginPath();c.ellipse((j*370-t*25)%2400,180+j*100,370,35,0,0,7);c.fill()}c.globalAlpha=1;
 c.save();c.translate(0,Math.sin(t*.7)*9);
 P(c,'M450 730 Q960 950 1470 730 L1380 840 Q960 1010 540 840Z','#aa703b','#68482f',6);
 for(let x of [550,1370]){P(c,`M${x} 790 V335 h25 V790Z`,'#bd904d','#6c4b33',3)}
 P(c,'M420 365 Q960 260 1500 365 L1430 300 Q960 185 490 300Z','#cda15f','#694c36',5);
 P(c,'M600 300 Q960 150 1320 300 Q960 70 600 300Z','#e7c78c','#694c36',4);
 figure('rama',770,800,.8,1,t,{hand:[70,165]});figure('sita',1010,800,.8,-1,t,{hand:[60,165]});figure('lakshmana',1230,800,.75,-1,t);
 c.restore();vignette();return true;
 }

 if(['nala','workers','bridge'].includes(id)){
 c.drawImage(material('ocean',t),0,0,1920,1080);
 // Solid shoreline and a perspective causeway connect foreground to Lanka.
 P(c,'M0 690 Q280 640 520 770 L780 1080 H0Z','#254c69','#a5c7b7',5);
 const n=id==='bridge'?Math.floor(7+22*p):14;
 for(let j=n;j>=0;j--){let v=j/30,x=500+1080*v,y=900-390*v,w=220*(1-v)+20;
 P(c,`M${x-w*.5} ${y} l${w} -20 l${w*.17} 34 l-${w} 30Z`,j%2?'#9eb7ad':'#71989b','#244b65',3)}
 if(id!=='bridge'){for(let j=0;j<3;j++){
 const ph=(u*.35+j*.3)%1,lift=Math.sin(ph*Math.PI),x=260+j*230,ground=900;
 figure(j===0?'hanuman':'sugriva',x,ground,.78,1,t,{hand:[125,90-60*lift],back:[95,110-60*lift],head:.08});
 P(c,`M${x+75} ${ground-220-45*lift} l90 -15 l28 42 l-93 25Z`,'#adc2b4','#355d6e',3);
 }}
 return true;
 }
 if(id==='injury'||id==='recovery'){
 stage(t,true);
 figure('rama',570,785,1.1,1,t,{head:.25,hand:[120,175]});
 const rise=id==='recovery'?E(u/3):0;
 c.save();c.translate(1220,770);c.rotate(-Math.PI/2*(1-rise));
 figure('lakshmana',0,0,1,-1,t,{head:.2*(1-rise),hand:[65,165]});c.restore();
 return true;
 }
 if(id==='armies'){
 stage(t,true);
 for(let row=0;row<3;row++)for(let j=0;j<5;j++){
 const sc=.38+row*.12,y=700+row*38;
 figure(j%2?'sugriva':'hanuman',180+j*105-row*20,y,sc,1,t,{hand:[140,90],step:Math.sin(u*4+j)*5});
 figure(j%2?'indrajit':'vibhishana',1730-j*100+row*20,y,sc,-1,t,{hand:[140,90]});
 }
 figure('rama',650,800,1.12,1,t,{hand:[110,100]});figure('ravana',1290,800,1.25,-1,t,{hand:[125,60]});
 return true;
 }
 if(id==='silence'){
 stage(t,true);
 for(let j=0;j<9;j++){c.save();c.translate(300+j*150,815);c.rotate(-.2+j*.06);line([[-60,0],[60,0]],'#a8928c',4);c.restore()}
 const w=ch.phrases.flatMap(p=>p.words).find(w=>w.text==='विभीषण');
 if(w&&t-ch.voiceStart>=w.start)figure('vibhishana',1100,785,1.15,-1,t,{head:.13,hand:[70,155]});
 return true;
 }
 const war=id==='duel';if(war)stage(t,true);else forest(t);
 const z=war?1.02+.09*E(p):1.03+.16*E(p);c.save();c.translate(960,530);c.scale(z,z);c.translate(-960,-530);
 if(war){
 const draw=E(u/1.8),release=E((u-2.2)/.55),hit=E((u-3.05)/.6);
 figure('rama',530,785,1.28,1,t,{hand:[170,20],back:[100-100*draw,25],head:-.05,tilt:-.035});
 // Bow and visible string drawn between hand and anchor; arrow travels once.
 c.save();c.translate(747,375);c.strokeStyle='#d2ad68';c.lineWidth=7;c.beginPath();c.moveTo(0,-145);c.bezierCurveTo(120,-80,120,160,0,200);c.stroke();line([[0,-145],[-130*draw*(1-release),25],[0,200]],'#f8deb0',2);c.restore();
 figure('ravana',1370+hit*65,785,1.42,-1,t,{hand:[140,55+hit*70],back:[-50,140],head:.22*hit,tilt:-.18*hit});
 if(u>2.2&&u<3.1){const x=mix(680,1350,(u-2.2)/.9);line([[x-160,410],[x,410]],'#ffe2a7',5);P(c,`M${x} 410 l-28-12 v24Z`,'#f8dfae','#c09b60',1)}
 // Dust responds to the impact without flashing the entire frame.
 if(hit>0){for(let j=0;j<15;j++){let a=j*.8,rr=110*E((u-3)/1.2);ellipse(1400+Math.cos(a)*rr,740+Math.sin(a)*rr*.3,9*(1-p),5*(1-p),'rgba(224,176,117,.35)')}}
 }else if(id==='welcome'){
 figure('rama',690,785,1.18,1,t,{hand:[140,90],head:.06});
 figure('vibhishana',mix(1380,1160,p),785,1.15,-1,t,{hand:[65,90],back:[70,90],head:.24,tilt:.04});
 }else{
 const approach=E(u/2.8),hold=E((u-2.3)/1.2),other=id==='embrace'?'hanuman':'bharata';
 const x1=mix(660,875,approach),x2=mix(1320,1045,approach),s=1.22;
 figure(other,x2,785,s,-1,t,{head:.17*hold,hand:[mix(110,80,hold),mix(100,12,hold)],back:[-30,160],step:Math.sin(u*6)*10*(1-approach),tilt:.035*hold});
 figure('rama',x1,785,s,1,t,{head:.12*hold,hand:[mix(150,143,hold),mix(65,-5,hold)],back:[90,80],step:Math.sin(u*6+1)*10*(1-approach),tilt:.025*hold});
 // Foreground forearm wraps around the far shoulder once contact is made.
 if(hold>.01){c.save();c.globalAlpha=hold;line([[x1+70,400],[x2+38,426],[x2+50,450]],'#d1a264',22);ellipse(x2+48,451,14,10,'#e1b77e');c.restore()}
 }
 c.restore();vignette();return true;
}
