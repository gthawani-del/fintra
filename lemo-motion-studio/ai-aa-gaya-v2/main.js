import * as T from 'three';
import {cv,finishCut,paperFill} from './vendor/paper.js';
import {cutMesh} from './vendor/cutmesh.js';
import {makeBook,texOf} from './vendor/book.js';
import {makePost} from './vendor/post.js';
import {ss,seg,mulberry} from './vendor/lib.js';
await document.fonts.load('40px Hindi');
const base=new URLSearchParams(location.search).has('base');
const P=base?{wall:'#71b8dc',shirt:'#6ea6df',sari:'#ee6a8e',tee:'#f5c840',wood:'#d59b57',floor:'#edce85'}:{wall:'#77908b',shirt:'#718c9a',sari:'#a95037',tee:'#c9a54e',wood:'#9b6546',floor:'#d8b689'};
const renderer=new T.WebGLRenderer({antialias:true});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(1);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.NeutralToneMapping;renderer.toneMappingExposure=1.05;document.body.prepend(renderer.domElement);
const scene=new T.Scene();scene.background=new T.Color('#343b38');const cam=new T.PerspectiveCamera(35,innerWidth/innerHeight,.004,12);
const post=makePost(renderer,scene,cam,innerWidth,innerHeight);post.dof.aper=.6;post.dof.maxCoc=8;post.bloom.strength=.035;
scene.add(new T.HemisphereLight('#f8eee0','#655342',1.4));
const lamp=new T.SpotLight('#ffe9c9',1.8,3,.72,.8,2);lamp.position.set(-.3,.7,.35);lamp.target.position.set(0,.03,.1);lamp.castShadow=true;lamp.shadow.mapSize.set(2048,2048);lamp.shadow.bias=-.00004;lamp.shadow.normalBias=.0002;scene.add(lamp,lamp.target);
function box(w,h,d,col,x,y,z){const o=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color:col,roughness:.85}));o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;scene.add(o);return o;}
// Procedural walnut desk, human-scale objects outside the book.
const wc=cv(1024,512),wx=wc.getContext('2d');wx.fillStyle='#75604c';wx.fillRect(0,0,1024,512);let R=mulberry(30);for(let i=0;i<900;i++){wx.strokeStyle=`rgba(35,23,16,${R()*.14})`;wx.lineWidth=.5+R()*2;wx.beginPath();let yy=R()*512;wx.moveTo(0,yy);wx.bezierCurveTo(300,yy+R()*9,650,yy-R()*8,1024,yy+R()*5);wx.stroke();}
const desk=box(3,.05,2,'#ffffff',0,-.029,.05);desk.material.map=texOf(wc);
box(2,1,.04,'#3f514a',0,.4,-.75);
const cup=new T.Mesh(new T.CylinderGeometry(.043,.032,.075,48),new T.MeshStandardMaterial({color:'#c8b7a0',roughness:.5}));cup.position.set(.37,.02,.04);cup.castShadow=true;scene.add(cup);const tea=new T.Mesh(new T.CircleGeometry(.039,48),new T.MeshStandardMaterial({color:'#573a27'}));tea.rotation.x=-Math.PI/2;tea.position.copy(cup.position).y+=.038;scene.add(tea);const handle=new T.Mesh(new T.TorusGeometry(.023,.006,12,32),cup.material);handle.position.set(.413,.025,.04);scene.add(handle);
box(.035,.004,.14,'#b47a38',-.34,.002,.13).rotation.y=.35;
// Hardcover book, using the actual upstream folding mechanism.
const cover=cv(1024,700),cx=cover.getContext('2d');paperFill(cx,1024,700,'#355d59');cx.strokeStyle='#cfae6d';cx.lineWidth=5;cx.strokeRect(35,35,954,630);cx.fillStyle='#e8cf97';cx.font='70px Hindi';cx.textAlign='center';cx.fillText('ए आई आ गया',512,320);cx.font='36px Hindi';cx.fillText('अब हमारा क्या?',512,400);const metal=cv(1024,700);metal.getContext('2d').fillStyle='#00ef00';metal.getContext('2d').fillRect(0,0,1024,700);
const book=makeBook({c:cover,m:metal});scene.add(book.root);book.setOpen(Math.PI/2);
const ground=cv(1024,700),gx=ground.getContext('2d');paperFill(gx,1024,700,P.floor);gx.strokeStyle='#ac8b67';gx.lineWidth=2;for(let i=0;i<12;i++){gx.beginPath();gx.moveTo(0,i*65);gx.lineTo(1024,i*65);gx.stroke();}for(let i=0;i<9;i++)gx.fillRect(i*130,0,1,700);book.groundMat.map=texOf(ground);
const wall=cv(1024,700),wx2=wall.getContext('2d');paperFill(wx2,1024,700,P.wall);wx2.fillStyle='#dcd1b8';wx2.fillRect(0,550,1024,150);for(let i=0;i<18;i++){wx2.fillStyle='rgba(57,79,70,.15)';wx2.fillRect(i*62,555,3,145);}book.backMat.map=texOf(wall);
const objects=[];
function card(w,h,draw,x,y,z,border=10){const c=cv(600,600*h/w),k=c.getContext('2d');k.scale(c.width/600,c.height/600);k.lineJoin=k.lineCap='round';draw(k);const out=finishCut(c,border);const mesh=cutMesh({c:out,w,h,ax:.5,ay:1});mesh.position.set(x,y,z);book.stage.add(mesh);objects.push(mesh);return mesh;}
function rr(k,x,y,w,h,r,fill,stroke='#47382f',lw=5){k.beginPath();k.roundRect(x,y,w,h,r);k.fillStyle=fill;k.fill();if(lw){k.strokeStyle=stroke;k.lineWidth=lw;k.stroke();}}
function line(k,pts,col='#47382f',lw=5){k.beginPath();k.moveTo(...pts[0]);for(const p of pts.slice(1))k.lineTo(...p);k.strokeStyle=col;k.lineWidth=lw;k.stroke();}
function ell(k,x,y,rx,ry,col,stroke=null,lw=5){k.beginPath();k.ellipse(x,y,rx,ry,0,0,Math.PI*2);k.fillStyle=col;k.fill();if(stroke){k.strokeStyle=stroke;k.lineWidth=lw;k.stroke();}}
// Layered room architecture: window, shutters, shelves, pendant and living plants.
card(.13,.13,k=>{rr(k,25,20,550,550,180,'#e9d8b4');rr(k,65,55,470,485,150,'#294f59');ell(k,400,150,40,40,'#e0c58d');for(let i=0;i<8;i++){rr(k,75+i*60,340-i%3*35,45,170+i%3*35,0,'#47656b',null,0);}line(k,[[300,55],[300,540]],'#e9d8b4',16);line(k,[[60,300],[540,300]],'#e9d8b4',16);},-.12,.085,.012);
card(.115,.085,k=>{rr(k,30,100,540,40,4,P.wood);rr(k,30,510,540,40,4,P.wood);for(let i=0;i<5;i++)rr(k,65+i*55,210-i%2*20,40,290+i%2*20,4,['#a9563b','#cbaa53','#5f7b76'][i%3]);rr(k,70,20,120,75,4,'#ece0c5');rr(k,370,260,130,230,10,'#c8b898');ell(k,435,260,68,30,'#77866a');},.133,.08,.02);
card(.05,.085,k=>{line(k,[[300,10],[300,260]],'#4c4138',10);k.beginPath();k.moveTo(160,260);k.lineTo(440,260);k.lineTo(535,470);k.lineTo(65,470);k.closePath();k.fillStyle='#d1ad58';k.fill();k.strokeStyle='#5b4533';k.lineWidth=9;k.stroke();ell(k,300,475,235,35,'#f7dfaa');},.015,.185,.05);
function plant(x,z){return card(.045,.09,k=>{rr(k,200,410,210,160,22,'#ba7150');line(k,[[310,440],[300,70]],'#4e6752',12);for(let i=0;i<6;i++){let a=i%2?-1:1;ell(k,300+a*80,100+i*55,85,30,i%2?'#6c8465':'#4c6a57');}},x,0,z);}
plant(-.185,.07);plant(.185,.095);
// Character art. Split body/arms/head cards provide true hinged gestures.
const actors=[];
function actor(who,x,z){const g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(1.4);book.stage.add(g);const isDad=who==='rajiv',isMom=who==='meera';const skin=isDad?'#bc875e':isMom?'#bf875e':'#d5a176',shirt=isDad?P.shirt:isMom?P.sari:P.tee;
function part(w,h,draw,x,y,z){const o=card(w,h,draw,0,0,0,7);book.stage.remove(o);g.add(o);o.position.set(x,y,z);return o;}
part(.043,.065,k=>{rr(k,155,400,110,165,20,isDad?'#535a57':'#4d6762');rr(k,330,400,110,165,20,isDad?'#535a57':'#4d6762');rr(k,100,65,400,390,75,shirt);if(isDad){line(k,[[300,100],[300,445]],'#d1d8ce',6);line(k,[[170,70],[280,180],[300,110],[330,180],[440,70]],'#e1d9c7',7);rr(k,350,230,90,70,4,shirt);for(let j=0;j<4;j++)ell(k,310,220+j*60,4,4,'#e3ded2');}else if(isMom){k.beginPath();k.moveTo(110,80);k.lineTo(235,80);k.lineTo(500,380);k.lineTo(470,470);k.closePath();k.fillStyle='#d4b574';k.fill();line(k,[[150,80],[470,430]],'#ead7a7',8);}else{line(k,[[175,110],[300,180],[430,110]],'#e4cc87',12);}},0,-.003,0);
const arm=part(.021,.044,k=>{rr(k,210,50,180,300,80,shirt);rr(k,230,310,140,240,65,skin);if(isMom){line(k,[[225,430],[375,430]],'#deba61',18);}},isDad?-.018:.018,.022,.001);arm.rotation.z=isDad?-.22:.3;
part(.012,.018,k=>{rr(k,130,0,340,590,80,skin,null,0);},0,.045,-.001);
const head=part(.043,.045,k=>{if(!isDad)ell(k,300,260,180,230,'#3e302a');ell(k,300,310,145,195,skin,'#614432',6);ell(k,176,330,22,38,skin);ell(k,430,330,22,38,skin);k.beginPath();k.moveTo(150,260);k.bezierCurveTo(130,0,480,10,450,270);k.bezierCurveTo(390,230,340,120,290,150);k.bezierCurveTo(250,230,210,230,150,260);k.fillStyle=isDad?'#4e4237':'#352b27';k.fill();if(isDad){for(let j=0;j<4;j++)line(k,[[190+j*18,120],[215+j*18,85]],'#a9a08e',6);rr(k,183,277,100,72,20,'#cba17b','#473b33',9);rr(k,319,277,100,72,20,'#cba17b','#473b33',9);line(k,[[283,303],[319,303]],'#473b33',8);}
ell(k,245,310,9,11,'#352e29');ell(k,368,310,9,11,'#352e29');line(k,[[300,330],[287,369],[310,374]],'#8c5e42',5);if(isDad){ell(k,302,401,52,12,'#49392c');}else if(isMom){ell(k,303,245,9,9,'#a34f37');ell(k,165,380,11,19,'#e6c16c');ell(k,440,380,11,19,'#e6c16c');}line(k,[[270,431],[300,442],[336,426]],'#693f31',6);},0,.049,.002);
actors.push({who,g,head,arm});return g;}
actor('rajiv',-.085,.126);actor('tara',0,.079);actor('meera',.093,.126);
// Table as stacked flat cards; plates above and front edge separated.
const tabletop=card(.245,.085,k=>{rr(k,30,80,540,430,55,P.wood);for(let j=0;j<8;j++)line(k,[[60,120+j*48],[540,125+j*48]],'#ba8155',2);},0,.044,.18);tabletop.rotation.x=-Math.PI/2;
card(.235,.043,k=>{rr(k,35,20,530,120,10,'#87513b');rr(k,80,120,35,430,5,'#79503c');rr(k,485,120,35,430,5,'#79503c');},0,0,.211);
for(const xx of [-.077,.076]){const plate=card(.052,.044,k=>{ell(k,300,300,260,210,'#e9dec5','#647c76',10);ell(k,300,300,215,170,'#f1e7d2');ell(k,260,300,105,95,'#c99750');ell(k,255,290,90,80,'#dcba76');for(let j=0;j<8;j++)ell(k,215+(j*23)%90,255+(j*33)%85,5,4,'#a87a43');ell(k,405,260,50,55,'#648262');},xx,.046,.167);plate.rotation.x=-Math.PI/2;}
// Phone rests beside Meera, visibly a physical card on the tabletop.
const phone=card(.025,.043,k=>{rr(k,130,25,340,550,40,'#314b4b');rr(k,155,80,290,440,12,'#e7e4d3');for(let j=0;j<4;j++)rr(k,180,120+j*80,220-j%2*50,40,12,j%2?'#b6c8bc':'#c9d3c6',null,0);},.108,.048,.18);phone.rotation.x=-1.1;
const ov=document.querySelector('#overlay');ov.width=1920;ov.height=1080;ov.style.pointerEvents='none';const o=ov.getContext('2d');
const mouthEnv=await (await fetch('./mouth.json')).json();
for(const ac of actors){const m=new T.Mesh(new T.CircleGeometry(1,24),new T.MeshBasicMaterial({color:'#653c2d',side:T.DoubleSide}));m.position.set(0,.0124,.0006);ac.head.add(m);ac.mouth=m;}
window.DUR=30;
const subs=[
 [1,5.85,'पापा, आज कॉलेज में सब ए आई की बात कर रहे थे।'],
 [6.85,10.4,'हमारे दफ़्तर में भी यही चर्चा है।'],
 [10.4,14.1,'पहले नया काम सीखना पड़ता था।'],
 [14.1,18.5,'अब कहते हैं, मशीन हमारा काम सीख रही है।'],
 [19.51,22.8,'मैंने तो आज इस्तेमाल भी कर लिया।'],
 [22.8,26,'एक ग्राहक को जवाब देना था।'],
 [26,28.73,'तुम तो मीटिंग में थे।']];
window.render=t=>{
 book.setOpen(Math.PI/2);const level=mouthEnv[Math.min(mouthEnv.length-1,Math.floor(t*60))]||0;
 for(const ac of actors){const speaking=(ac.who==='tara'&&t>=1&&t<5.848)||(ac.who==='rajiv'&&t>=6.848&&t<18.512)||(ac.who==='meera'&&t>=19.512&&t<28.728);
 ac.head.rotation.z=speaking?Math.sin(t*2)*.018:0;
 ac.arm.rotation.z=(ac.who==='rajiv'?-.22:.3)+(speaking?Math.sin(t*1.5)*.09:0);
 ac.mouth.visible=speaking&&level>.08;ac.mouth.scale.set(.0018,.0003+level*.0014,1);
 }
 const target=new T.Vector3(0,.095,.11);
 cam.position.set(.22-.035*ss(seg(t,0,6.2)),.23-.025*ss(seg(t,0,6.2)),.63-.035*ss(seg(t,0,6.2)));
 if(t>=6.2&&t<18.9){cam.position.set(-.17+.012*ss(seg(t,6.2,18.9)),.18,.48-.012*ss(seg(t,6.2,18.9)));target.set(-.04,.105,.12);}
 if(t>=18.9){cam.position.set(.20-.015*ss(seg(t,18.9,30)),.18,.49-.018*ss(seg(t,18.9,30)));target.set(.055,.10,.12);}
 cam.lookAt(target);cam.updateProjectionMatrix();post.dof.focus=cam.position.distanceTo(target);post.composer.render();
 o.clearRect(0,0,1920,1080);o.shadowBlur=0;o.fillStyle='rgba(22,37,31,.6)';o.fillRect(45,29,470,53);o.fillStyle='#eadac0';o.font='22px sans-serif';o.fillText('ELIV8LYF  /  A PAPER THEATRE FILM',68,63);
 const sub=subs.find(c=>t>=c[0]&&t<c[1]);if(sub){o.font='36px Hindi';o.textAlign='center';const w=o.measureText(sub[2]).width;o.fillStyle='rgba(22,30,26,.88)';o.beginPath();o.roundRect(960-w/2-30,972,w+60,68,12);o.fill();o.fillStyle='#fff6df';o.fillText(sub[2],960,1018);o.textAlign='left';}
};
window.render(2);window.READY=true;
