const TAU=Math.PI*2;
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)};
function path(c,d,col,stroke='#573724',width=2){c.fillStyle=col;c.strokeStyle=stroke;c.lineWidth=width;const p=new Path2D(d);c.fill(p);if(width)c.stroke(p);}
function circle(c,x,y,r,col){c.beginPath();c.arc(x,y,r,0,TAU);c.fillStyle=col;c.fill();}
function line(c,pts,col,w){c.beginPath();c.moveTo(...pts[0]);for(let p of pts.slice(1))c.lineTo(...p);c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.stroke();}
function jewel(c,x,y,r){circle(c,x,y,r,'#70412c');circle(c,x,y,r*.61,'#f7dfa0');circle(c,x,y,r*.21,'#97533c');}
function lattice(c,x,y,w,h,col){c.save();c.beginPath();c.rect(x,y,w,h);c.clip();for(let j=0;j<h;j+=18)for(let i=0;i<w;i+=17){let xx=x+i+(j%36?8:0);path(c,`M${xx} ${y+j}l5 7l-5 7l-5 -7Z`,col,col,0);}c.restore();}
function arm(c,x,y,a,b,female,t){c.save();c.translate(x,y);c.rotate(a);path(c,'M-14 0Q-23 40-12 91Q0 104 12 91L16 5Z',female?'#a74432':'#8d7145');lattice(c,-8,16,16,61,'#e6c47f');jewel(c,0,4,9);c.translate(0,93);c.rotate(b);path(c,'M-11 0L-9 75Q-19 90-6 107L5 110L17 94L10 77L12 0Z','#bd8a48');line(c,[[-11,62],[10,62]],'#efd18e',7);jewel(c,0,2,8);for(let i=0;i<3;i++)line(c,[[1+i*4,84],[3+i*4,99]],'#6c462c',1);line(c,[[5,87],[27,310]],'rgba(82,56,38,.3)',2);c.restore();}
function puppet(c,x,y,s,kind,t,gesture=0){const female=kind==='queen',rama=kind==='rama';c.save();c.translate(x,y+Math.sin(t*1.8)*1.1);c.scale(s,s);if(female)c.scale(-1,1);
let slump=kind==='king'?.12*ease((t-9)/3):0;c.rotate(slump);
// loose rear veil and deeply cut clothing
if(female)path(c,'M-45-143Q-136-105-122 75L-147 230Q-49 268 33 211L20-105Z','#ab573b');
path(c,'M-52 60Q-62 147-83 236Q-14 267 77 236L52 58Z',female?'#91442f':rama?'#b67d36':'#547a65');
lattice(c,-55,86,111,143,'#e5bf78');
path(c,'M-45-45Q-66-15-47 66Q-5 84 48 62L53-21Q29-48 15-51Z',female?'#b46638':rama?'#6e8f7b':'#8c6538');
lattice(c,-36,-19,70,70,'#e5c78b');line(c,[[-45,59],[46,59]],'#e9c77e',9);
// profile face and headwear
c.save();c.translate(0,-65);c.rotate(kind==='king'?slump*1.6:0);
path(c,'M-35-53Q-25-88 14-76Q36-64 31-39L47-25L31-18Q31 16 8 24L-26 10L-36-15Z',rama?'#759b81':'#d2a25c');
if(kind==='king'){path(c,'M-29-7Q-7 20 31-13L25 36L8 63L-22 39Z','#664d38');for(let i=0;i<5;i++)line(c,[[-18+i*8,15],[-10+i*5,43]],'#ddbd7c',2);}
if(female){path(c,'M-34-41Q-57-54-38-85Q-13-107 23-74L-5-67L-24-26Z','#6a432f');circle(c,-39,-40,17,'#875333');}
// crown has open lattice and pearl points
path(c,'M-39-66L-42-104L-23-93L-13-127L4-99L22-121L25-90L41-104L34-66Z',female?'#be763d':'#c09242');for(let i=0;i<5;i++){jewel(c,-30+i*14,-76,5);circle(c,-39+i*17,-101+(i%2?10:0),3,'#f1d797');}
path(c,'M10-43Q19-50 28-41Q18-34 10-43Z','#f3d89a');circle(c,23,-42,2.5,'#4b392c');line(c,[[10,-52],[27,-49]],'#60432d',3);line(c,[[20,0],[31,-2]],'#795033',2);jewel(c,-23,-11,9);line(c,[[11,-67],[13,-57]],'#b04d2b',3);c.restore();
// necklace and articulated gestures
for(let i=0;i<9;i++){let a=Math.PI*i/8;jewel(c,Math.cos(a)*35,-27+Math.sin(a)*35,4);}
arm(c,-48,-23,.08,0,female,t);arm(c,43,-25,-.40-gesture*.85,-gesture*.60,female,t);
// feet / suspended central rod
path(c,'M-52 236L-56 267L-27 270L-13 261L-29 247Z','#9d723f');path(c,'M31 237L37 263L70 269L80 259L50 246Z','#b18447');line(c,[[0,-65],[-10,410]],'rgba(93,60,34,.27)',2);
c.restore();}
export function buildShadow(){let cloth=document.createElement('canvas');cloth.width=1600;cloth.height=900;let c=cloth.getContext('2d');let g=c.createRadialGradient(790,360,30,800,450,850);g.addColorStop(0,'#f4dda4');g.addColorStop(.65,'#dab47a');g.addColorStop(1,'#8e5f3d');c.fillStyle=g;c.fillRect(0,0,1600,900);for(let y=0;y<900;y+=3){c.fillStyle=y%6?'rgba(91,59,30,.035)':'rgba(255,244,210,.055)';c.fillRect(0,y,1600,1);}for(let x=0;x<1600;x+=4){c.fillStyle='rgba(90,54,22,.025)';c.fillRect(x,0,1,900);}return function(c,t){c.save();let close=ease((t-7)/2)*(1-ease((t-12)/2));let z=1+.32*close;c.translate(800,450);c.scale(z,z);c.translate(-800+130*close,-450);c.drawImage(cloth,0,0);c.save();c.globalCompositeOperation='multiply';
// carved palace proscenium, arch and borders
path(c,'M0 0H1600V105H0Z','#7d492c');path(c,'M0 0H125V900H0Z','#75442c');path(c,'M1475 0H1600V900H1475Z','#75442c');
for(let x=30;x<1600;x+=55){path(c,`M${x} 33q22-22 39 0q-17 30-39 0Z`,'#d6ad69');circle(c,x+19,33,5,'#87512e');}
for(let x of [53,1515])for(let y=135;y<790;y+=57){path(c,`M${x} ${y}q-20 25 0 47q35-25 0-47Z`,'#c79650');}
// palace scalloped frame
c.strokeStyle='#a77342';c.lineWidth=12;c.beginPath();c.moveTo(190,685);c.lineTo(190,295);c.bezierCurveTo(280,90,515,190,800,140);c.bezierCurveTo(1100,190,1315,90,1410,295);c.lineTo(1410,685);c.stroke();
// throne behind king
path(c,'M400 690V430Q400 270 520 260Q640 270 640 430V690Z','#ab7a45');path(c,'M425 653V433Q425 305 520 292Q615 305 615 433V653Z','#dcb571');for(let y=350;y<600;y+=35){jewel(c,416,y,7);jewel(c,623,y,7);}
// ritual lamps
for(let xx of [255,1345]){path(c,`M${xx-8} 690L${xx-3} 540H${xx+3}L${xx+8} 690Z`,'#886338');path(c,`M${xx-38} 535Q${xx} 570 ${xx+38} 535Z`,'#a0733c');circle(c,xx,528,8,'#f9e9b3');}
let queenGesture=ease((t-1)/2)*(1-.3*ease((t-7)/2));puppet(c,1095,434,1.03,'queen',t,queenGesture);
puppet(c,515,438,1.02,'king',t,Math.max(0,1-ease((t-6)/4))*.4);
if(t>12){let p=ease((t-12)/2.6);c.globalAlpha=p;puppet(c,780-35*p,480,.78,'rama',t,.7);c.globalAlpha=1;}
c.restore();
// low stage and subtle lamp flicker (never darkens people beyond readability)
c.fillStyle='#513a2d';c.fillRect(0,752,1600,148);c.fillStyle='#be945f';c.fillRect(0,746,1600,5);c.fillStyle=`rgba(255,218,135,${.015+.012*Math.sin(t*7.1)})`;c.fillRect(0,0,1600,750);c.restore();
};}
