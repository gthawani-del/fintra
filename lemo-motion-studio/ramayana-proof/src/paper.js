const C=x=>Math.max(0,Math.min(1,x));const E=x=>{x=C(x);return x*x*(3-2*x)};
function p(c,d,col){c.fillStyle=col;c.fill(new Path2D(d));}
function line(c,d,col,w){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.stroke(new Path2D(d));}
function cut(c,d,col){c.save();c.shadowColor='rgba(0,12,23,.45)';c.shadowBlur=13;c.shadowOffsetY=10;c.shadowOffsetX=-5;p(c,d,col);c.shadowColor='transparent';line(c,d,'rgba(255,218,154,.16)',1.4);c.restore();}
function figure(c,t,leap){c.save();let angle=1.05*leap;c.rotate(angle);let crouch=(1-leap)*Math.sin(C((t-5.2)/2)*Math.PI)*.45;c.rotate(crouch);
// tail, a physical cut strip on its own plane
line(c,`M-30 36C-115 85-178 13-148-54C-131-99-80-86-91-48`, '#ae7553',13);line(c,`M-30 32C-115 81-178 9-148-58C-131-103-80-90-91-52`,'#e7bf88',3);
// separate bent legs; hips y30
c.save();c.translate(-22,33);c.rotate(leap*.8+(1-leap)*(-.4-crouch));cut(c,'M-18 0Q-25 36-14 78L5 90L19 76L15 0Z','#c4aa83');c.translate(0,80);c.rotate(leap*(-1.25)+(1-leap)*(.6+crouch));cut(c,'M-12 0L-10 58L-27 70Q-35 82-14 85L21 77L14 3Z','#d2b68b');c.restore();
c.save();c.translate(27,34);c.rotate(leap*(-.75)+(1-leap)*(.45+crouch));cut(c,'M-17 0L-15 77L2 89L17 76L16 1Z','#e6cca1');c.translate(0,78);c.rotate(leap*.85+(1-leap)*(-.65-crouch));cut(c,'M-12 0L-11 55L-23 70Q-29 81-9 83L26 75L13 0Z','#eed7ae');c.restore();
cut(c,'M-38-77Q-59-39-39 15L-29 46Q8 61 42 32L47-34Q41-78 16-86Z','#e5caa0');cut(c,'M-38 12Q1 34 42 12L49 55L7 73L-39 56Z','#ac583d');cut(c,'M-3 29L4 80L23 66L22 27Z','#d48a53');
// broad simian muzzle, cheek and modest coronet
cut(c,'M-26-128Q-4-153 24-131L31-104L52-92Q62-72 34-69L21-53L-8-63L-30-92Z','#ead3aa');cut(c,'M5-102Q30-110 45-96L52-86Q46-75 22-78L8-86Z','#bd8d69');cut(c,'M-28-122Q-41-132-28-146L-15-141L-13-158L4-147L19-158L22-139L34-142L29-124Z','#c2924c');line(c,'M9-117L22-114','#664b3a',3);line(c,'M20-112L24-111','#2d3433',3);line(c,'M12-133L14-124','#ad523a',4);line(c,'M33-85L46-85','#85583f',2);
// arms articulated at shoulders
for(let side of [-1,1]){c.save();c.translate(side*38,-58);c.rotate(leap*(side===1?-2.2:-.6)+(1-leap)*(side===1?-.5:.45));cut(c,'M-13 0Q-20 32-12 64L9 70L16 59L14 0Z',side===1?'#f1d9b0':'#c8ab84');c.translate(0,64);c.rotate(leap*(-.4)+(1-leap)*(-1.1));cut(c,'M-11 0L-12 61Q-21 72-8 80L13 76L19 65L11 2Z','#e6c89b');line(c,'M-12 52L12 52','#b48345',7);c.restore();}
// sash: rigid cut-paper sections rotate around pivots, not rubber morphing
c.save();c.translate(-34,-64);c.rotate(.1+leap*(.3+Math.sin(t*2)*.04));cut(c,'M0 0L-86 14L-130 47L-108 57L-75 31L4 15Z','#ad553a');c.restore();line(c,'M-28-56Q8-23 31-58','#b5884e',5);c.restore();}
export function buildPaper(){const textures=[];for(let k=0;k<5;k++){let cv=document.createElement('canvas');cv.width=1600;cv.height=900;let c=cv.getContext('2d');for(let i=0;i<7000;i++){let x=(i*137.527+k*51)%1600,y=(i*73.399)%900;c.fillStyle=i%2?'rgba(255,240,205,.07)':'rgba(0,0,0,.045)';c.fillRect(x,y,1.3,1);}textures.push(cv);}return function(c,t){
let g=c.createLinearGradient(0,0,0,900);g.addColorStop(0,'#172e41');g.addColorStop(.5,'#637f85');g.addColorStop(1,'#bbaf85');c.fillStyle=g;c.fillRect(0,0,1600,900);
// light through the rear paper: warm, readable, physically bounded
let glow=c.createRadialGradient(1190,295,35,1190,295,400);glow.addColorStop(0,'rgba(255,219,143,.40)');glow.addColorStop(1,'rgba(255,219,143,0)');c.fillStyle=glow;c.fillRect(0,0,1600,900);c.fillStyle='#e4d3a4';c.beginPath();c.arc(1190,285,78,0,Math.PI*2);c.fill();
// layered cloud cuts
cut(c,'M-80 170Q140 115 260 180Q350 125 480 180Q570 150 660 200L-80 225Z','#385464');cut(c,'M910 110Q1040 65 1180 125Q1330 85 1440 144L1690 151V170H910Z','#42616d');
const travel=E((t-7.2)/6),wide=E((t-10)/5);
// Lanka distant, revealed late with camera pullback
c.save();c.translate(1320-travel*60,482);c.scale(.65,.65);cut(c,'M-160 85Q-90-36 20 0Q90-65 190 85Z','#344f59');for(let i=0;i<6;i++){let x=-85+i*36,h=40+(i%3)*20;cut(c,`M${x} 35V${-h}L${x+12} ${-h-22}L${x+24} ${-h}V35Z`,'#b6a67c');}c.restore();
// 6 strata: back to front, cast shadows and warm cut edges
for(let k=0;k<6;k++){let y=510+k*57,amp=8+k*3,phase=t*(.16+k*.08);let d=`M-80 ${y}`;for(let x=-80;x<=1700;x+=40)d+=`L${x} ${y+Math.sin(x/125+phase)*amp}`;d+='L1700 920H-80Z';cut(c,d,['#7d9998','#63868a','#4d747e','#355d6e','#21485e','#143347'][k]);c.save();c.globalAlpha=.5;c.drawImage(textures[k%5],0,0);c.restore();
// luminous slits are intentional holes in each water layer
c.strokeStyle=['#c4c6a5','#9cb9af','#8baba6','#678d91','#486e7e','#30566b'][k];c.lineWidth=2;for(let j=0;j<9;j++){let x=((j*207-k*63-t*(9+k*4))%1900+1900)%1900-120;c.beginPath();c.moveTo(x,y+18);c.quadraticCurveTo(x+32,y+10,x+68,y+17);c.stroke();}}
// cliff is a near paper sheet, exits after the leap
let cliffX=-travel*510;cut(c,`M${cliffX-80} 900L${cliffX-80} 460L${cliffX+190} 430L${cliffX+290} 455L${cliffX+325} 500L${cliffX+240} 590L${cliffX+265} 900Z`,'#263c42');line(c,`M${cliffX-50} 461L${cliffX+187} 437L${cliffX+280} 463`,'#a49c76',3);
// anticipation -> airborne arc -> immense scale
let leap=E((t-7.2)/.7),prog=C((t-7.2)/8),x=250+leap*90+prog*690,y=280-Math.sin(prog*Math.PI*.8)*85;let sc=1-.07*leap-wide*.46;
c.save();c.translate(x,y);c.scale(sc,sc);figure(c,t,leap);c.restore();
// foreground palm cut silhouette introduces scale without covering the subject
cut(c,'M1490 900Q1510 590 1550 430L1564 437Q1546 640 1540 900Z','#102735');for(let j=0;j<7;j++){let a=(j-3)*.38,ex=1558+Math.sin(a)*240,ey=430-Math.cos(a)*110;cut(c,`M1558 437Q${ex} ${ey-70} ${ex} ${ey+50}Q${ex-30} ${ey-15} 1558 437Z`,'#102735');}
};}
