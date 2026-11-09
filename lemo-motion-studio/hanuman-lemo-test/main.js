const W=1672,H=941,cv=document.querySelector('canvas');cv.width=innerWidth;cv.height=innerHeight;const c=cv.getContext('2d');
const load=src=>new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=src;});
const [hero,bg]=await Promise.all([load('assets/hanuman.webp'),load('assets/background.webp')]);
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)};
const path=pts=>{const p=new Path2D();pts.forEach(([x,y],i)=>i?p.lineTo(x,y):p.moveTo(x,y));p.closePath();return p;};
const canvas=()=>{let a=document.createElement('canvas');a.width=W;a.height=H;return a;};
// Art is kept intact within each rigid piece. Joints rotate; pixels never morph.
const pieces=[
 {id:'tail',p:[560,475],pts:[[0,0],[480,0],[480,350],[590,460],[560,490],[425,478],[355,379],[0,350]],angle:t=>.045*Math.sin(t*1.5-.8)},
 {id:'sash',p:[790,480],pts:[[0,352],[340,352],[430,420],[515,462],[625,390],[735,396],[810,463],[785,535],[660,563],[460,600],[0,613]],angle:t=>.035*Math.sin(t*2.0-1.1)},
 {id:'backarm',p:[552,315],pts:[[420,300],[535,277],[605,312],[600,440],[420,460]],angle:t=>-.09+ .10*ease(t/2)+.025*Math.sin(t*1.5)},
 {id:'rearleg',p:[620,635],pts:[[0,614],[500,555],[620,590],[663,656],[550,720],[280,810],[190,920],[0,941]],angle:t=>.10*(1-ease(t/2.1))-.045*ease((t-5)/3)},
 {id:'frontarm',p:[1240,329],pts:[[1225,225],[1672,115],[1672,415],[1253,405],[1196,369]],angle:t=>.105*(1-ease((t-.25)/1.5))-.015*Math.sin(t*.9)}
];
const body=canvas(),bc=body.getContext('2d');bc.drawImage(hero,0,0);
for(const part of pieces){part.path=path(part.pts);part.img=canvas();let x=part.img.getContext('2d');x.clip(part.path);x.drawImage(hero,0,0);bc.save();bc.globalCompositeOperation='destination-out';bc.fill(part.path);bc.restore();}
// Background sheets retain the detailed material and vary their motion by depth.
const wavePaths=[
 [[-100,615],[260,610],[335,576],[390,562],[455,575],[480,613],[590,619],[654,585],[713,574],[770,609],[850,627],[945,610],[1035,594],[1120,621],[1220,610],[1320,591],[1450,600],[1570,577],[1800,595],[1800,1100],[-100,1100]],
 [[-100,760],[272,744],[314,694],[350,675],[390,678],[416,704],[470,728],[520,701],[570,680],[620,691],[650,720],[720,737],[850,731],[930,690],[990,671],[1030,696],[1080,745],[1210,774],[1300,752],[1410,692],[1480,661],[1550,666],[1610,706],[1800,710],[1800,1100],[-100,1100]],
 [[-100,925],[490,918],[530,857],[595,812],[650,805],[699,827],[740,853],[890,875],[970,850],[1080,822],[1170,788],[1210,806],[1250,850],[1290,904],[1370,880],[1450,878],[1540,900],[1800,880],[1800,1100],[-100,1100]]
];
const waves=wavePaths.map(pts=>{const a=canvas(),x=a.getContext('2d');x.clip(path(pts));x.drawImage(bg,0,0);return a;});
function drawHero(t,x,y,s){c.save();c.translate(x,y);c.rotate(-.025-.045*ease(t/2));c.scale(s,s);c.translate(-900,-480);
 for(const part of pieces){c.save();c.translate(...part.p);c.rotate(part.angle(t));c.translate(-part.p[0],-part.p[1]);c.drawImage(part.img,0,0);c.restore();}
 c.drawImage(body,0,0);
 // Small original-texture joint caps hide opening wedges at paper pivots.
 for(const part of pieces.filter(p=>['frontarm','rearleg','backarm'].includes(p.id))){c.save();c.beginPath();c.arc(part.p[0],part.p[1],part.id==='rearleg'?25:18,0,Math.PI*2);c.clip();c.drawImage(hero,0,0);c.restore();}
 c.restore();}
window.DUR=10;window.TEXTS=()=>[];
window.render=t=>{c.setTransform(cv.width/W,0,0,cv.height/H,0,0);c.clearRect(0,0,W,H);
 const pull=ease((t-1.8)/7.7),z=1.09-.09*pull;
 c.save();c.translate(W/2,H/2);c.scale(z,z);c.translate(-W/2,-H/2);c.drawImage(bg,-18-8*ease(t/10),-8,W+48,H+24);
 waves.forEach((im,i)=>{c.save();const dx=-((t*(6+7*i))%(W*.10));c.translate(dx,Math.sin(t*(.6+i*.12)+i)*3);c.drawImage(im,0,0,W*1.18,H);c.restore();});
 c.restore();
 const x=770+330*ease(t/10),y=385-45*ease(t/2)+5*Math.sin(t*.8),s=.79-.31*pull;
 c.save();c.shadowColor='rgba(31,35,31,.30)';c.shadowBlur=9;c.shadowOffsetX=-5;c.shadowOffsetY=12;drawHero(t,x,y,s);c.restore();
 // Low foreground sheet passes independently, keeping airborne staging clear.
 c.save();c.translate(-t*15,30+3*Math.sin(t*.7));c.drawImage(waves[2],0,0,W*1.20,H);c.restore();
};window.render(0);window.READY=true;
