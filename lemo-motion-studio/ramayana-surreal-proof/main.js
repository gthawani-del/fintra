import {Impasto,Strokes,hex,KNIFE} from './engine/impasto.js';
import {Ref,paintRef} from './engine/plate.js';
import {Pass,poly,circle} from './engine/glass.js';
import {makeComp} from './engine/comp.js';
const W=1280,H=720,screen=document.querySelector('#screen');screen.width=W;screen.height=H;const c=screen.getContext('2d');
const mk=()=>{let a=document.createElement('canvas');a.width=W;a.height=H;return a};
const E=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)},lerp=(a,b,p)=>a+(b-a)*p,TAU=Math.PI*2;
const rand=n=>{let v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};
const img=await new Promise((ok,no)=>{let i=new Image;i.onload=()=>ok(i);i.onerror=no;i.src='assets/hanuman.webp'});
await document.fonts.load('700 50px Noto');
const paintCanvas=mk(),paint=new Impasto(paintCanvas,{W,H,ss:1.5}),ref=new Ref(W,H,.75);
const box=(x,y,w,h,col,props={})=>ref.fill(g=>g.rect(x,y,w,h),col,props);
const shape=(p,col,props={})=>ref.fill(g=>{p.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath()},col,props);
const disk=(x,y,r,col)=>ref.fill(g=>g.arc(x,y,r,0,TAU),col,{maxR:10,group:2});
box(0,0,W,H,'#173d9d',{maxR:36,dir:0});
for(let j=0;j<10;j++)box(0,140+j*28,W,35,['#37549e','#5c5ba6','#875fa0','#b66394','#d87085','#ed7b76','#f89377','#f5a17b','#eda180','#d69b82'][j],{maxR:30,dir:0,group:1});
disk(640,205,94,'#ffd682');
for(let j=0;j<12;j++){let x=j*127-70,y=110+rand(j)*155;shape([[x,y],[x+130,y-12],[x+250,y+3],[x+150,y+17]],j%2?'#4653a2':'#fa9a88',{maxR:20,dir:0})}
function tower(x,y,w,h,col){
 box(x-w/2,y,w,h,col,{maxR:12,dir:Math.PI/2});
 ref.fill(g=>{g.moveTo(x-w*.68,y);g.quadraticCurveTo(x-w*.65,y-w*.52,x,y-w*1.05);g.quadraticCurveTo(x+w*.65,y-w*.52,x+w*.68,y);g.closePath()},col,{maxR:10,dir:Math.PI/2});
 ref.line(g=>{g.moveTo(x,y-w*1.05);g.lineTo(x,y-w*1.38)},'#ffd797',3,{maxR:2});
 shape([[x,y-w*1.35],[x+25,y-w*1.25],[x,y-w*1.13]],'#e4425c',{maxR:3});
 for(let j=0;j<3;j++){let xx=x-w*.3+j*w*.3;ref.fill(g=>{g.moveTo(xx-6,y+h*.75);g.lineTo(xx-6,y+20);g.quadraticCurveTo(xx,y+8,xx+6,y+20);g.lineTo(xx+6,y+h*.75)},'#f4c56c',{maxR:3,dir:Math.PI/2})}
 box(x-w*.6,y+h*.8,w*1.2,8,'#9f3365',{maxR:3,dir:0});
}
for(let j=0;j<15;j++)tower(j*95,410-rand(j+30)*90,46+rand(j)*22,120,'#574a8f');
box(240,410,800,155,'#b44c76',{maxR:16});
for(let j=0;j<9;j++)tower(290+j*88,400-Math.sin(j/8*Math.PI)*90,68,150,'#ed965b');
tower(640,290,130,240,'#f6b75f');tower(420,375,92,180,'#da6b64');tower(860,375,92,180,'#da6b64');
for(let j=0;j<5;j++)box(170-j*36,535+j*12,940+j*72,12,j%2?'#bc4973':'#f4b16d',{maxR:6,dir:0});
box(0,600,1280,120,'#123e80',{maxR:24,dir:0});
for(let j=0;j<250;j++){let x=rand(j+80)*W,y=603+rand(j+180)*117;box(x,y,12+rand(j+200)*45,2+rand(j+90)*5,j%4?'#227d9a':'#ef9470',{maxR:3,dir:0})}
disk(640,420,35,'#74265d');disk(640,420,27,'#ffd682');
const strokes=paintRef(ref,{R:[26,13,6,3],T:19,seed:27});
const batch=paint.batch(strokes.data()),under=paint.texture(ref.ctx.canvas,.8);
function oil(t){
 const push=E((t-4.5)/4),z=1+.25*E(t/7)+2.7*push;
 const cam={x:640,y:lerp(360,420,push),zoom:z,rot:0};
 paint.begin(hex('#163e83'));paint.under(under,W,H,{cam,grey:0});paint.draw(batch,{cam,grey:0,run:.35});
 const water=new Strokes();for(let j=0;j<130;j++){const x=rand(j+90)*W,y=607+rand(j+300)*105;water.push({x:x+Math.sin(t*.8+j)*4,y,ang:0,len:20+rand(j)*60,wid:2+rand(j+3)*5,c:hex(j%4?'#308fa5':'#f5b76d'),seed:j,type:KNIFE,hgt:.4})}
 paint.drawNow(water.data(),{cam,grey:0});paint.finish({light:[-.7,-.4,.6],sat:1.05,expo:1.06,vig:.12});
 c.drawImage(paintCanvas,0,0);
}
const gc=mk(),comp=makeComp(gc),layers={G:mk(),S:mk(),R:mk(),P:mk(),O:mk()};
const g=layers.G.getContext('2d'),s=layers.S.getContext('2d'),pass=new Pass(g,s);
function glassArt(){
 s.fillStyle='#343d55';s.fillRect(0,0,W,H);
 // Indian sun-window: hand-cut concentric petal pieces, not a stock cathedral.
 for(let ring=4;ring>=1;ring--){let n=ring===1?12:24,r0=45+ring*52,r1=r0+52;
  for(let j=0;j<n;j++){let a=j*TAU/n,b=(j+1)*TAU/n,mid=(a+b)/2;
   let pts=[[640+Math.cos(a)*r0,330+Math.sin(a)*r0],[640+Math.cos(mid)*r1,330+Math.sin(mid)*r1],[640+Math.cos(b)*r0,330+Math.sin(b)*r0],[640+Math.cos(mid)*(r0-20),330+Math.sin(mid)*(r0-20)]];
   pass.piece(poly(pts),['#2249aa','#bf2850','#e7a735','#1b7c92'][ring===1?2:(j+ring)%4],{lead:4,id:ring*100+j,matW:5});
  }}
 pass.piece(circle(640,330,89),'#ecb345',{lead:5,id:800,matW:9});
 // Sun's rays are separate glass wedges.
 for(let j=0;j<18;j++){let a=j*TAU/18;pass.piece(poly([[640+Math.cos(a-.045)*95,330+Math.sin(a-.045)*95],[640+Math.cos(a)*135,330+Math.sin(a)*135],[640+Math.cos(a+.045)*95,330+Math.sin(a+.045)*95]]),'#ed9b4c',{lead:2,id:900+j,matW:2})}
 // Side jali panels.
 for(let side of [0,1])for(let yy=90;yy<600;yy+=72)for(let xx=70;xx<350;xx+=72){let x=side?W-xx:xx;pass.piece(poly([[x,yy-33],[x+31,yy],[x,yy+33],[x-31,yy]]),(xx+yy)%3?'#204497':'#a52259',{lead:5,id:xx+yy+side*1000,matW:5})}
 // Structural arch and ornamental beading.
 s.strokeStyle='#d0a46b';s.lineWidth=7;s.beginPath();s.arc(640,330,316,0,TAU);s.stroke();
 for(let j=0;j<100;j++){let a=j*TAU/100;s.fillStyle='#b68759';s.beginPath();s.arc(640+Math.cos(a)*326,330+Math.sin(a)*326,2.5,0,TAU);s.fill()}
 s.fillStyle='#17233d';s.fillRect(0,650,W,70);
 const pg=layers.P.getContext('2d');pg.drawImage(layers.G,0,0);
}
glassArt();
function glass(t){
 const local=t-8,z=lerp(1.2,.95,E(local/2))+5*E((local-4.5)/2.5);
 // Transform render layers, so shader world coordinates and camera agree.
 const L={};for(let k of ['G','S','P']){L[k]=mk();let q=L[k].getContext('2d');q.translate(640,360);q.scale(z,z);q.translate(-640,-330);q.drawImage(layers[k],0,0)}
 L.R=layers.R;L.O=layers.O;
 comp.render(L,{cam:[640,330,z],sunU:400+local*80,bandW:440,bandSoft:160,sunI:2.8,skyI:.35,roseI:2.5,roseC:[640,330],roseR:95,amb:.7,ambCol:[.55,.65,1],roseCol:[1,.82,.5],floorMode:1,floorY:650,patchK:1.8,pmRect:[0,0,W,H],lancets:[{rect:[320,15,960,645],I:1.2}],time:t,bloom:.25,vign:.15,sat:1.1,expo:1.1});
 c.fillStyle='#17213b';c.fillRect(0,0,W,H);c.drawImage(gc,0,0);
}
const waveLayers=[];
function waveShape(q,j,dx=0){
 const y=325+j*58,amp=24+j*9,span=260+j*16,phase=-90-j*47;
 q.beginPath();q.moveTo(-500,1000);q.lineTo(-500,y+amp);
 for(let x=phase-span*2;x<1700;x+=span){
 q.bezierCurveTo(x+span*.35,y+amp,x+span*.5,y-amp*1.8,x+span*.77,y-amp);
 q.bezierCurveTo(x+span*.96,y-amp*.6,x+span*.84,y+amp*.15,x+span*.7,y-amp*.12);
 q.bezierCurveTo(x+span*.85,y+amp*.65,x+span*.94,y+amp,x+span,y+amp);
 }
 q.lineTo(1800,1000);q.closePath();
}
for(let j=0;j<7;j++){
 let a=mk();a.width=1800;let q=a.getContext('2d');const cols=['#77c8ca','#4db5c1','#259cae','#147b99','#195d88','#163e70','#13294d'];
 waveShape(q,j);q.fillStyle=cols[j];q.fill();q.save();q.clip();
 // Fixed paper fibres and irregular pulp; no temporal noise.
 for(let k=0;k<3000;k++){q.strokeStyle=k%2?'rgba(255,238,195,.08)':'rgba(7,30,60,.08)';q.lineWidth=.7;let x=rand(k+21)*W,y=rand(k+41)*H;q.beginPath();q.moveTo(x,y);q.lineTo(x+4+rand(k)*8,y+rand(k+2)*3);q.stroke()}
 q.restore();waveShape(q,j);q.strokeStyle='#d5e7c8';q.lineWidth=3;q.stroke();
 // Cream crest cutouts follow each curled wave, with perforated foam.
 const yy=325+j*58,aa=24+j*9,sp=260+j*16,ph=-90-j*47;
 q.save();waveShape(q,j);q.clip();
 for(let x=ph-sp;x<1600;x+=sp){q.strokeStyle=j<3?'#d5ead8':'#d1dfc4';q.lineWidth=4+j*.6;q.beginPath();q.moveTo(x+sp*.48,yy-aa*.65);q.bezierCurveTo(x+sp*.63,yy-aa*1.5,x+sp*.91,yy-aa,x+sp*.84,yy-aa*.3);q.stroke();
 for(let k=0;k<5;k++){q.fillStyle='#d5e4cf';q.beginPath();q.ellipse(x+sp*(.51+k*.065),yy-aa*.6+k*2,2+k*.2,1.7,0,0,TAU);q.fill()}}
 q.restore();waveLayers.push(a);
}
function ocean(t){
 const u=t-15;let sky=c.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#182967');sky.addColorStop(.55,'#6559a2');sky.addColorStop(.85,'#e98e83');sky.addColorStop(1,'#ffcc85');c.fillStyle=sky;c.fillRect(0,0,W,H);
 c.fillStyle='#ffd399';c.shadowColor='#f7b264';c.shadowBlur=55;c.beginPath();c.arc(640,240,82,0,TAU);c.fill();c.shadowBlur=0;
 // Distant Lanka is a tiny destination, never competes with Hanuman.
 c.fillStyle='#453f79';for(let j=0;j<8;j++){let x=1050+j*22,y=310-Math.sin(j/7*Math.PI)*48;c.fillRect(x,y,17,70);c.beginPath();c.moveTo(x-4,y);c.lineTo(x+8,y-25);c.lineTo(x+21,y);c.fill()}
 for(let j=0;j<7;j++){
  if(j===4){const x=lerp(190,935,E(u/8)),h=275+Math.sin(Math.min(1,u/9)*Math.PI)*35,y=320-Math.sin(Math.min(1,u/9)*Math.PI)*60;
   c.save();c.translate(x,y);c.rotate(-.035+Math.sin(u*.8)*.02);c.shadowColor='rgba(12,22,59,.3)';c.shadowBlur=14;c.shadowOffsetY=14;c.drawImage(img,-h*.88,-h*.5,h*1.77,h);c.restore()}
  const dx=Math.sin(u*.6+j)*5-u*(j+1)*3;
  c.save();c.shadowColor='rgba(8,23,52,.55)';c.shadowOffsetY=12;c.shadowBlur=12;c.drawImage(waveLayers[j],dx%150,Math.sin(u*.7+j)*2);c.restore();
 }
 // Cloud strips pass in foreground and give the travel scale.
 c.fillStyle='rgba(218,194,213,.14)';for(let j=0;j<4;j++){c.beginPath();c.ellipse((j*450-u*15+1600)%1800-200,80+j*52,230,12,0,0,TAU);c.fill()}
 if(u>6){const a=E((u-6)/1);c.save();c.globalAlpha=a;c.font='700 53px Noto';c.textAlign='center';c.fillStyle='#ffe5a8';c.shadowColor='#071832';c.shadowBlur=12;c.fillText('रामायण',640,630+16*(1-a));c.restore()}
}
window.DUR=24;window.TEXTS=()=>[];
window.render=t=>{
 c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,W,H);
 if(t<8)oil(t);else if(t<15)glass(t);else ocean(t);
 // Match-cut through a warm light source; brief flare stays tied to its centre.
 for(let cut of [8,15]){let v=1-Math.abs(t-cut)/.32;if(v>0){const grad=c.createRadialGradient(640,360,0,640,360,900);grad.addColorStop(0,'rgba(255,221,147,'+v*.82+')');grad.addColorStop(1,'rgba(250,177,105,0)');c.fillStyle=grad;c.fillRect(0,0,W,H)}}
};window.render(0);window.READY=true;
