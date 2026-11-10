import {c,P} from './puppets.js';
const TAU=Math.PI*2;
const hash=n=>{let v=Math.sin(n*127.1+43.7)*43758.5453;return v-Math.floor(v)};
const layers=[];
for(let j=0;j<5;j++){
 const a=document.createElement('canvas');a.width=2200;a.height=1080;const g=a.getContext('2d');
 const col=['#70c7bc','#44a795','#237d78','#175858','#102f43'][j];
 g.fillStyle=col;
 // Each plane has individual tree silhouettes and open spaces, not repeated rectangles.
 for(let k=0;k<6;k++){
  const x=k*420+hash(k+j*13)*160-100,y=720+j*35,w=22+j*12,h=520+hash(k*9+j)*320;
  g.beginPath();g.moveTo(x-w,y);g.bezierCurveTo(x+w*.8,y-h*.45,x-w*.8,y-h*.8,x-w*.5,y-h);g.lineTo(x+w*.4,y-h);g.bezierCurveTo(x+w*.4,y-h*.6,x-w*.5,y-h*.3,x+w,y);g.fill();
  for(let b=0;b<8;b++){let yy=y-h+b*65,side=b%2?1:-1;
   g.strokeStyle=col;g.lineWidth=7+j*3;g.beginPath();g.moveTo(x,yy+60);g.quadraticCurveTo(x+side*60,yy,x+side*(130+j*18),yy-20);g.stroke();
   for(let f=0;f<6;f++){g.save();g.translate(x+side*(60+f*28),yy-15-f*5);g.rotate(side*.3);g.beginPath();g.ellipse(0,0,60+j*8,12+j*2,side*.4,0,TAU);g.fill();g.restore()}}
 }
 g.beginPath();g.moveTo(0,850+j*40);g.bezierCurveTo(500,760+j*40,1200,910+j*35,2200,800+j*40);g.lineTo(2200,1200);g.lineTo(0,1200);g.fill();
 // Pulp marks remain fixed in each card.
 g.save();g.globalCompositeOperation='source-atop';for(let k=0;k<1600;k++){g.strokeStyle=k%2?'rgba(255,240,188,.055)':'rgba(0,20,41,.055)';g.lineWidth=1;let x=hash(k+j*14)*2200,y=hash(k+200)*1080;g.beginPath();g.moveTo(x,y);g.lineTo(x+6,y+2);g.stroke()}g.restore();
 layers.push(a);
}
export function forest(t,night=false){
 let g=c.createRadialGradient(1200,250,10,1050,400,1100);g.addColorStop(0,night?'#7c93b9':'#f6d49b');g.addColorStop(.4,night?'#34547e':'#74c6ad');g.addColorStop(1,'#112e4b');c.fillStyle=g;c.fillRect(0,0,1920,1080);
 c.fillStyle=night?'#e7d2a6':'#ffe2ac';c.shadowBlur=35;c.shadowColor='#eab46b';c.beginPath();c.arc(1250,250,90,0,TAU);c.fill();c.shadowBlur=0;
 for(let j=0;j<5;j++){c.save();c.shadowColor='rgba(8,28,46,.4)';c.shadowBlur=10+j*3;c.shadowOffsetY=10;c.drawImage(layers[j],-120+Math.sin(t*.18+j)*j*8,0);c.restore()}
 // Clear stage floor gives planted feet; leaf litter supplies material detail.
 c.fillStyle=night?'#182943':'#183c49';c.beginPath();c.moveTo(0,805);c.quadraticCurveTo(950,775,1920,805);c.lineTo(1920,1080);c.lineTo(0,1080);c.fill();
 for(let j=0;j<20;j++){let x=(j*137+40)%1920,y=860+(j*71)%200;c.fillStyle=j%3?'#307970':'#b49359';c.beginPath();c.ellipse(x,y,12,3,j*.5,0,TAU);c.fill()}
}
