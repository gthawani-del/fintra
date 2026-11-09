import {Impasto} from './impasto.js';
import {Ref,paintRef} from './plate.js';
const W=1600,H=900;
const rect=(x,y,w,h)=>c=>c.rect(x,y,w,h);
const ellipse=(x,y,a,b)=>c=>c.ellipse(x,y,a,b,0,0,Math.PI*2);
const path=d=>c=>{const p=new Path2D(d); /* Ref requires traced path: handled via svg helper below */};
function svg(R,d,col,pr={}){const p=new Path2D(d);let k=R._id({maxR:8,dir:'edge',...pr});R.ctx.fillStyle=col;R.ctx.fill(p);R.idc.fillStyle=R._idStyle(k);R.idc.fill(p);}
function line(R,d,col,w,pr={}){const p=new Path2D(d),k=R._id({maxR:3,...pr});for(let c of [R.ctx,R.idc]){c.lineWidth=w;c.lineCap='round';c.strokeStyle=c===R.ctx?col:R._idStyle(k);c.stroke(p);}}
function arch(R,x,y,w,h,col){svg(R,`M${x} ${y+h}V${y+w*.5}Q${x+w*.5} ${y-w*.25} ${x+w} ${y+w*.5}V${y+h}Z`,col);}
function tower(R,x,y,w,h,col){R.fill(rect(x,y,w,h),col,{maxR:18,dir:90});svg(R,`M${x-8} ${y}L${x+w/2} ${y-w*.58}L${x+w+8} ${y}Z`,'#dcaf72',{maxR:10});R.fill(rect(x-12,y-4,w+24,11),'#f0d299',{maxR:5});R.fill(rect(x+w/2-3,y-w*.8,6,w*.24),'#a9743e',{maxR:2});for(let i=0;i<3;i++)arch(R,x+w*(.1+i*.3),y+24,w*.2,h*.31,'#675858');R.fill(rect(x-5,y+h*.65,w+10,8),'#dab27c',{maxR:3});}
async function painted(R){let cv=document.createElement('canvas');cv.width=R.w;cv.height=R.h;const E=new Impasto(cv,{W:R.w,H:R.h,ss:1});const s=paintRef(R,{R:[28,14,7,3,1.7],T:14,seed:811});E.begin();E.under(E.texture(R.ctx.canvas),R.w,R.h);E.draw(E.batch(s.data()),{run:.12});E.finish({light:[-.5,-.6,.65],norm:4.4,amb:.88,dif:.22,spec:.18,ao:.55,expo:1,sat:.9,vig:0,weave:.04});let out=document.createElement('canvas');out.width=R.w;out.height=R.h;const c=out.getContext('2d');c.drawImage(cv,0,0);c.globalCompositeOperation='destination-in';c.drawImage(R.ctx.canvas,0,0,R.w,R.h);c.globalCompositeOperation='source-over';E.gl.getExtension('WEBGL_lose_context')?.loseContext();return out;}
export async function buildOil(){
let R=new Ref(1800,1000,.65);
const g=R.ctx.createLinearGradient(0,0,0,1000);g.addColorStop(0,'#777f8e');g.addColorStop(.37,'#dec5a5');g.addColorStop(.64,'#f2d4a2');g.addColorStop(1,'#687e83');R.fill(rect(0,0,1800,1000),g,{maxR:40,dir:-4,detail:2});
R.fill(ellipse(1250,240,105,105),'#f3dbae',{maxR:20,group:'sun'});
// atmosphere, distant city and raised terraces
for(let i=0;i<16;i++){let x=i*125-80,y=450+Math.sin(i*2.4)*45; tower(R,x,y,80,160,'#a99c91');}
R.fill(rect(0,610,1800,100),'#b89879',{maxR:24,dir:0});
for(let i=0;i<5;i++)R.fill(rect(0,640+i*19,1800,13),['#e3c194','#cab08e','#d5b68f','#9f8d7d','#bcaa94'][i],{maxR:18,dir:0});
// river plane with palette-knife horizontal reflection dabs
R.fill(rect(0,735,1800,265),'#78918d',{maxR:24,dir:0});
for(let i=0;i<180;i++){let x=(i*173.21)%1800,y=740+(i*31.13)%250;R.fill(rect(x,y,22+(i*17)%95,3+i%5),i%3?'#9da89a':'#e1c699',{maxR:7,dir:0});}
// principal palace, Indian chhatri pavilions
R.fill(rect(180,385,870,260),'#c29a6c',{maxR:22,dir:90});R.fill(rect(180,380,870,20),'#f3d5a1',{maxR:8,dir:0});
for(let i=0;i<10;i++)arch(R,210+i*80,460,48,130,'#6e615c');
tower(R,195,315,150,160,'#cba678');tower(R,845,315,150,160,'#cba678');
R.fill(rect(400,330,395,115),'#d6b185',{maxR:18,dir:90});
for(let i=0;i<5;i++)arch(R,422+i*74,354,40,78,'#9c7a61');
tower(R,500,215,185,125,'#d5b286');
for(let i=0;i<3;i++)R.fill(rect(170-i*12,634+i*15,890+i*24,12),i%2?'#b19376':'#ecd0a1',{maxR:8,dir:0});
// royal terrace foreground balustrade
R.fill(rect(0,910,1800,90),'#584f49',{maxR:30,dir:0});
for(let x=15;x<1800;x+=65){R.fill(rect(x,845,15,68),'#8e7a61',{maxR:5,dir:90});R.fill(ellipse(x+7,841,14,10),'#b79b77',{maxR:4});}R.fill(rect(0,822,1800,17),'#bca17a',{maxR:8,dir:0});
const bg=await painted(R);
// Rama: separately painted body, articulated arm and animated cloth, no photo zoom substitute.
R=new Ref(400,690,.8);
svg(R,'M169 490Q145 557 145 623L135 657Q147 674 181 659L189 559L218 502Z','#739597');
svg(R,'M213 486L221 598L211 650Q234 667 263 650L257 628L258 536L244 478Z','#90b0ad');
svg(R,'M153 356Q136 429 135 514Q202 552 273 511L252 352Z','#c48737',{maxR:10});
svg(R,'M158 370L148 505L179 523L191 379Z','#e3b657');svg(R,'M216 365L199 530L221 522L240 373Z','#f1c66c');
svg(R,'M166 182Q130 193 133 236L143 353Q192 379 249 351L262 235Q257 201 226 186L215 162L178 159Z','#86a6a4',{maxR:7});
svg(R,'M147 207Q167 234 190 234L220 193L241 205L202 254L159 243Z','#a9c4b8');
svg(R,'M173 159L175 195Q201 211 222 185L216 154Z','#8caead');
svg(R,'M171 85Q204 65 230 88L231 112L241 128L231 134Q229 165 213 173Q189 176 174 153Z','#9ab6ad',{maxR:4});
svg(R,'M163 94Q153 55 180 49Q170 16 201 18Q226 20 219 48Q253 52 239 96L228 103L217 80Q197 93 175 88L178 149L157 159Z','#323b3f',{maxR:5});
line(R,'M207 110Q217 106 225 110','#354b4c',3);line(R,'M219 112L224 112','#263b40',2);line(R,'M218 146L229 142','#6a6960',2);line(R,'M209 91L211 103','#efe5c6',3);
line(R,'M156 213Q180 270 239 214','#d9b56b',5);R.fill(ellipse(201,251,8,12),'#e8c77c',{maxR:2});
svg(R,'M149 187L168 181L235 351L216 363Z','#e9b25c');line(R,'M143 354Q195 371 253 352','#eac17c',9);
// left hanging arm
svg(R,'M145 202Q121 210 119 242L124 317L111 365Q119 387 132 375L145 326L153 248Z','#759596');line(R,'M123 300L144 303','#e0b666',8);
// bow
line(R,'M282 176Q358 342 284 544','#795130',9);line(R,'M282 176L284 544','#d7be8a',2);line(R,'M272 335L293 335','#e8ca80',8);
let body=await painted(R);
R=new Ref(200,300,.85);svg(R,'M45 22Q78 5 92 36L97 114L148 150Q168 152 174 171L160 182L136 169L72 144Q58 137 57 116Z','#8dadab',{maxR:5});line(R,'M63 107L95 105','#e2bd76',9);let arm=await painted(R);
return function draw(c,t){
c.save();let zoom=t<6?1.01+t*.006:1.18+(t-6)*.012;let x=t<6?-t*3:-120-(t-6)*2;c.translate(x,-50);c.scale(zoom,zoom);c.drawImage(bg,-80,-30,1800,1000);
// flags and reflected moving light, matter moves; background texture stays fixed.
for(let k=0;k<3;k++){let fx=435+k*190,fy=238+(k%2)*70;c.strokeStyle='#91744d';c.lineWidth=4;c.beginPath();c.moveTo(fx,fy);c.lineTo(fx,fy-72);c.stroke();c.fillStyle='#b86b3e';c.beginPath();c.moveTo(fx,fy-70);c.bezierCurveTo(fx+25,fy-76+Math.sin(t*2+k)*6,fx+42,fy-56,fx+65,fy-63);c.lineTo(fx+47,fy-43);c.quadraticCurveTo(fx+20,fy-38,fx,fy-48);c.fill();}
const move=Math.max(0,t-12)*5; c.translate(1030+move,185+Math.sin(t*.8)*1.5);let sc=t<6?.91:1.02;c.scale(sc,sc);c.drawImage(body,0,0);c.save();c.translate(247,207);c.rotate(-.20-Math.sin(t*.5)*.04-(t>10?Math.min(.55,(t-10)*.1):0));c.drawImage(arm,-45,-22);c.restore();
// trailing sash follows wind, retaining paint-toned edges
c.fillStyle='#c88c46';c.beginPath();c.moveTo(146,212);c.bezierCurveTo(84,242,58,304+Math.sin(t*1.8)*10,15,306);c.lineTo(4,322);c.bezierCurveTo(78,334+Math.sin(t*1.8)*8,116,275,161,237);c.fill();c.restore();
};}
