const W=1672,H=941,cv=document.querySelector('canvas');cv.width=innerWidth;cv.height=innerHeight;const c=cv.getContext('2d');
const load=src=>new Promise((ok,no)=>{let i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=src;});
const [bg,rama]=await Promise.all([load('assets/background.webp'),load('assets/rama.webp')]);
const E=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
function path(pts){let p=new Path2D();pts.forEach(([x,y],i)=>i?p.lineTo(x,y):p.moveTo(x,y));p.closePath();return p;}
function plate(){let a=document.createElement('canvas');a.width=W;a.height=H;return a;}
const headPath=path([[1080,12],[1332,12],[1350,200],[1315,256],[1290,298],[1205,298],[1150,265],[1090,205]]);
const clothPath=path([[630,650],[820,638],[945,590],[970,600],[963,685],[900,735],[825,786],[660,780],[630,735]]);
function piece(p){let a=plate(),x=a.getContext('2d');x.clip(p);x.drawImage(rama,0,0);return a;}
const head=piece(headPath),cloth=piece(clothPath),body=plate(),b=body.getContext('2d');b.drawImage(rama,0,0);b.globalCompositeOperation='destination-out';b.fill(headPath);b.fill(clothPath);
const river=path([[0,592],[130,580],[230,543],[290,505],[365,512],[407,548],[412,585],[455,630],[500,667],[620,722],[620,777],[180,815],[0,732]]);
function water(t){c.save();c.clip(river);for(let y=506;y<815;y+=3){const depth=(y-506)/309,dx=Math.sin(y*.12+t*1.65)*1.6*depth+Math.sin(y*.04-t*.7)*.9;c.drawImage(bg,0,y,W,3,dx,y,W,3);}c.restore();}
function flag(t,x,y,w,h,phase){c.save();c.beginPath();c.rect(x,y,w,h);c.clip();for(let j=0;j<w;j+=2){let v=j/w,dy=Math.sin(t*2.6-v*4+phase)*v*1.8;c.drawImage(bg,x+j,y,2,h,x+j,y+dy,2,h);}c.restore();}
function figure(t){
 // Breeze moves only the loose fabric, anchored near Rama's elbow.
 for(let x=630;x<970;x+=3){const free=1-E((x-630)/340);let dy=free*(Math.sin(t*1.9-x*.009)*8+Math.sin(t*.8)*3);c.drawImage(cloth,x,580,3,230,x,580+dy,3,230);}
 c.save();c.translate(1240,285);c.rotate((-.008*Math.sin(t*.75)+.022*E((t-11.2)/3.3)));c.translate(-1240,-285);c.drawImage(head,0,0);c.restore();
 c.drawImage(body,0,0);
 // Original neck texture covers the tiny rigid-joint opening.
 c.save();c.beginPath();c.ellipse(1242,292,48,12,0,0,Math.PI*2);c.clip();c.drawImage(rama,0,0);c.restore();
}
window.DUR=17;window.TEXTS=()=>[];
window.render=t=>{c.setTransform(cv.width/W,0,0,cv.height/H,0,0);c.clearRect(0,0,W,H);const blend=E((t-6.6)/2.0);const wide=1+.025*E(t/7.6),close=1.08+.035*E((t-7.6)/9.4);let z=wide*(1-blend)+close*blend;let ax=835+345*blend,ay=300-140*blend;c.save();c.translate(ax,ay);c.scale(z,z);c.translate(-ax,-ay);c.drawImage(bg,0,0);water(t);[[803,162,38,28,0],[983,95,27,33,1],[1120,199,30,28,2],[1225,232,27,28,3]].forEach(v=>flag(t,...v));figure(t);c.restore();};
window.render(0);window.READY=true;
