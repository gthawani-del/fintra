import {c,cv,E,ease,P,chars,robe,head,limb,puppet,palace,cloth,drawPiece} from './puppets.js';
const T=await (await fetch('timeline.json')).json();
const files={city:'city.webp',rama:'rama.webp',sea:'sea.webp',fly:'hanuman.webp',forest:'forest.webp',grove:'grove.webp',sita:'sita.webp',kneel:'hanuman-kneel.webp',coronation:'coronation.webp'};
const A={};await Promise.all(Object.entries(files).map(([k,f])=>new Promise((ok,no)=>{const i=new Image;i.onload=()=>{A[k]=i;ok()};i.onerror=no;i.src='assets/'+f})));
await document.fonts.load('700 50px Noto');
const seeds={sita:['queen','#b56b26'],bharata:['rama','#59827b'],lakshmana:['rama','#b84532'],hanuman:['monkey','#cfc0a0'],sugriva:['monkey','#a75e30'],vali:['monkey','#97712d'],kumbhakarna:['rama','#76604f'],indrajit:['king','#253d62'],shurpanakha:['queen','#6b4255'],ravana:['king','#572d53'],vibhishana:['king','#496965'],manthara:['queen','#5b3c4e']};
for(const [k,[h,col]] of Object.entries(seeds))chars[k]={body:robe(h,col),head:head(h==='queen'&&k==='sita'?'sita':h),upper:limb(85,19,col),fore:limb(88,12,'#c39b60')};
const S=(a,b,t)=>a+(b-a)*E(t);const text=(s,x,y,size=48,col='#ffefcc',align='center')=>{c.font=`700 ${size}px Noto`;c.textAlign=align;c.fillStyle=col;c.fillText(s,x,y)};
function backdrop(k,t){c.drawImage(A[k],0,0,1920,1080);if(k==='sea'){
 // Separate depth bands of paper surf slide at different speeds; the skyline stays fixed.
 for(let y=650;y<1080;y+=12){const sy=y/1080*A.sea.height,sh=12/1080*A.sea.height,dx=Math.sin(t*1.05-y*.012)*(y-600)*.025;c.drawImage(A.sea,0,sy,A.sea.width,sh,dx,y,1920,12);}
}else if(k==='city'){
 for(let y=650;y<890;y+=5){const sy=y/1080*A.city.height;c.drawImage(A.city,0,sy,A.city.width,5/1080*A.city.height,Math.sin(t*1.1+y*.08)*1.5,y,1920,5)}
}}
function leaves(t,kind='forest'){
 c.save();c.globalAlpha=.7;for(let i=0;i<14;i++){let x=(i*173+42)%1920,y=30+(i%3)*75;c.save();c.translate(x,y);c.rotate(.12*Math.sin(t*.8+i));c.fillStyle=kind==='grove'?'#445526':'#304a2b';c.beginPath();c.ellipse(0,0,70,14,-.3,0,7);c.fill();c.restore()}c.restore();
}
function actor(k,x=960,y=420,sc=1,flip=1,t=0,pose={}){
 puppet(k,x,y,sc,flip,{a:.45+.05*Math.sin(t*.9),b:.65,head:.025*Math.sin(t*.6),...pose},t);
 if(['hanuman','sugriva','vali'].includes(k)){c.save();c.strokeStyle='#a67b40';c.lineWidth=9;c.beginPath();c.moveTo(x-flip*50*sc,y+200*sc);c.bezierCurveTo(x-flip*210*sc,y+190*sc,x-flip*210*sc,y-80*sc,x-flip*145*sc,y-35*sc);c.stroke();c.restore()}
}
function theatre(t,setting='palace'){
 c.drawImage(cloth,0,0,1920,1080);c.save();c.globalCompositeOperation='multiply';
 if(setting==='palace')drawPiece(c,palace);
 else if(setting==='forest'){
 for(const x of [70,1710]){P(c,`M${x} 820 L${x+45} 220 Q${x-180} 60 ${x+40} 60 Q${x+310} 20 ${x+240} 230 L${x+95} 300 L${x+125} 820Z`,'#476447');for(let j=0;j<20;j++){c.fillStyle='#e9cf91';c.beginPath();c.ellipse(x+(j*29)%170,100+(j*41)%170,19,6,j,0,7);c.fill()}}
 }else{for(let i=0;i<7;i++)P(c,`M${i*350-300} 820 Q${i*350} ${590+i%2*80} ${i*350+400} 820Z`,'#8f6b44');}
 c.restore();c.fillStyle='#7f512d';c.fillRect(0,825,1920,14);
}
function crown(x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);P(c,'M-95 45 L-110-60 L-55-15 L0-95 L55-15 L110-60 L95 45Z','#c79032','#573718',4);for(let j=-2;j<=2;j++){c.fillStyle=j%2?'#8c3131':'#f7d887';c.beginPath();c.arc(j*35,12,8,0,7);c.fill()}c.restore()}
function sandals(x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);for(let a of [-70,70]){c.save();c.translate(a,0);c.rotate(-.14);P(c,'M-35-70 Q0-110 35-70 L32 80 Q0 110-30 80Z','#9c602d','#57361e',4);c.fillStyle='#e6ac5a';c.beginPath();c.ellipse(0,-30,12,16,0,0,7);c.fill();c.restore()}c.restore()}
function ring(x,y,s=1,t=0){c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle='#bd7d24';c.lineWidth=18;c.beginPath();c.ellipse(0,0,67,49,0,0,7);c.stroke();c.strokeStyle='#ffe3a3';c.lineWidth=4;c.beginPath();c.ellipse(-3,-4,67,49,0,3.3,5.9);c.stroke();c.restore()}
function lamp(t,x=960,y=650,off=false){c.save();c.translate(x,y);P(c,'M-100 0 Q0 100 100 0Z','#965a2c');c.fillStyle=off?'#655342':'#ffcc62';if(!off){c.beginPath();c.ellipse(0,-45,18+2*Math.sin(t*7),48,0,0,7);c.fill()}c.restore()}
function archFrame(){c.strokeStyle='#8b582e';c.lineWidth=16;c.strokeRect(30,25,1860,1010)}
function paintingSprite(k,x,y,h,t,flip=1){const img=A[k],w=h*img.width/img.height;c.save();c.translate(x,y);c.scale(flip,1);c.rotate(.002*Math.sin(t*.8));c.drawImage(img,-w/2,-h,w,h);c.restore()}
function bird(x,y,s,t){c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle='#4c3a27';c.lineWidth=11;c.beginPath();c.moveTo(-90,-20-Math.sin(t*3)*30);c.quadraticCurveTo(-40,-30,0,0);c.quadraticCurveTo(40,-30,90,-20-Math.sin(t*3)*30);c.stroke();c.restore()}
function fireCurtain(t,progress=1){c.save();for(let i=0;i<13;i++){const x=460+i*80,h=(100+70*Math.sin(i*2+t*4))*progress;P(c,`M${x} 835 Q${x-45} ${780-h*.5} ${x+15} ${730-h} Q${x+5} ${790-h*.6} ${x+65} 835Z`,i%2?'#d99935':'#aa4a27','#7c3821',2)}c.restore()}
function deer(x,y,t){c.save();c.translate(x,y);c.fillStyle='#d8aa46';c.beginPath();c.ellipse(0,0,85,40,0,0,7);c.fill();P(c,'M50-10 L62-85 L92-92 L110-72 L86-60 L84 15Z','#d8aa46');c.strokeStyle='#745122';c.lineWidth=7;for(let j=0;j<4;j++){let a=-50+j*32;c.beginPath();c.moveTo(a,20);c.lineTo(a+Math.sin(t*5+j)*18,95);c.stroke()}c.beginPath();c.moveTo(73,-85);c.lineTo(55,-130);c.lineTo(38,-139);c.moveTo(57,-125);c.lineTo(70,-144);c.stroke();c.restore()}
function mountains(x,y,s,t){c.save();c.translate(x,y);c.scale(s,s);P(c,'M-190 60 L-120-60 L-70-40 L0-145 L65-60 L110-85 L185 60Z','#597246','#324c39',4);for(let j=0;j<9;j++){c.fillStyle='#afc57a';c.beginPath();c.ellipse(-130+j*30,15-Math.sin(j)*30,12,22,0,0,7);c.fill()}c.restore()}
function visual(id,u,d,t,ch){const p=E(u/d),gesture=ease(u,1,3), reaction=ease(u,3,5);
 const oil=['city','rama','home','empty','shelter','garden','sita','approach','ring','token','coronation','bookend','family'];
 const sea=['shore','brace','leap','flight','surasa','landing','welcome','nala','workers','bridge','homeward'];
 let mode=oil.includes(id)?'oil':sea.includes(id)?'paper':'shadow';
 let base=(['garden','sita','approach','ring','token'].includes(id)?'grove':['home','empty','shelter'].includes(id)?'forest':id==='coronation'||id==='family'?'coronation':'city');
 if(mode==='oil')backdrop(base,t);else if(mode==='paper')backdrop('sea',t);else theatre(t,['whisper','boons','court','crown','grief','vow','conspire','vibhishana','peace','marriage'].includes(id)?'palace':['walk','meeting','listen','alliance','vali','search','deer','pursuit','brothers','sitaChoice','quiver','shelter'].includes(id)?'forest':'field');
 // Shot-specific camera placement. Close and insert shots have genuine scale changes.
 const close=['grief','vow','sita','ring','token','crown','lamp','sandals','decision','injury'].includes(id);
 c.save();let z=id==='ring'?1.5:close?1.18:1.02;z+=.025*p;let cx=960,cy=close?480:540;c.translate(960,540);c.scale(z,z);c.translate(-cx,-cy);
 if(id==='city'||id==='bookend'){} 
 else if(id==='rama'){paintingSprite('rama',960,1050,1050,t);}
 else if(id==='crown'){c.fillStyle='#8b5a30';c.fillRect(730,650,460,110);crown(960,570+12*(1-gesture),1.6)}
 else if(id==='bow'){actor('rama',750,420,1.15,1,t,{a:-.5*gesture,b:-.25});actor('sita',1260,440,1,-1,t,{head:-.05})}
 else if(id==='marriage'){actor('rama',760,410,1.1,1,t,{a:-.1,b:.3});actor('sita',1180,410,1.1,-1,t,{a:-.1,b:.3});lamp(t,960,760)}
 else if(id==='court'){actor('king',1180,380,1.15,-1,t);actor('queen',580,400,1.1,1,t);crown(960,640,.6)}
 else if(id==='whisper'){actor('queen',1150,400,1.15,-1,t,{head:.1*gesture});actor('manthara',710,430,1,1,t,{tilt:.1,a:-.4,b:-.4})}
 else if(id==='boons'){actor('queen',620,370,1.2,1,t,{a:.3-1.1*gesture,b:-.4,hand:'two'});actor('king',1320,400,1.1,-1,t,{head:.2*reaction})}
 else if(id==='grief'){actor('king',1020,400,1.25,-1,t,{head:.22*gesture,a:1.1,b:.2,tilt:-.05*gesture})}
 else if(id==='vow'){actor('rama',840,400,1.15,1,t,{a:.8*gesture,b:2.2*gesture,head:.18*gesture});actor('king',1300,420,.9,-1,t,{head:.15})}
 else if(id==='sitaChoice'){actor('sita',750,400,1.1,1,t,{a:-.4*gesture,b:.2,hand:'open'});actor('rama',1260,400,1.1,-1,t)}
 else if(id==='quiver'){actor('lakshmana',960,390,1.2,1,t,{a:-.5,b:2*gesture});P(c,'M810 410 L855 410 L845 650 L805 650Z','#74502c');}
 else if(['farewell','walk','search','homeward'].includes(id)){for(let j=0;j<3;j++)actor(['rama','sita','lakshmana'][j],540+j*330+120*p,450,1,1,t,{step:5*Math.sin(t*4+j),a:.8,b:.3,head:.04})}
 else if(id==='boat'){P(c,'M350 720 Q960 1010 1570 720 L1500 805 Q960 990 430 805Z','#8c592e');for(let j=0;j<3;j++)actor(['rama','sita','lakshmana'][j],650+j*280+40*p,450,.85,1,t);for(let j=0;j<4;j++){c.strokeStyle='#506c6b';c.lineWidth=8;c.beginPath();c.moveTo(250,850+j*35);c.bezierCurveTo(650,810+j*35,1150,880+j*35,1650,850+j*35);c.stroke()}}
 else if(id==='shelter'||id==='home'){actor('rama',1090,520,.75,-1,t,{a:.1,b:.6});actor('sita',1400,530,.7,-1,t,{a:.2,b:.7});}
 else if(id==='lamp'){lamp(t,960,650,u>2.4)}
 else if(id==='bharata'){actor('bharata',930,410,1.2,1,t,{head:.2*gesture,a:1.2,b:.1})}
 else if(id==='brothers'||id==='reunion'||id==='embrace'){actor('rama',770+50*gesture,410,1.1,1,t,{a:-.2,b:.3});actor(id==='embrace'?'hanuman':'bharata',1160-50*gesture,410,1.1,-1,t,{a:-.2,b:.3});}
 else if(id==='sandals'||id==='steward'){sandals(960,580,1.3);if(id==='steward')actor('bharata',1450,460,.95,-1,t,{head:.18,a:.8,b:2})}
 else if(id==='conflict'){actor('rama',650,400,1.1,1,t,{a:-.3,b:.1});actor('shurpanakha',1300,400,1.1,-1,t,{a:-.4,b:.3})}
 else if(id==='conspire'){actor('ravana',650,370,1.2,1,t,{a:-.3*gesture,b:.4});actor('sugriva',1290,420,1,-1,t,{head:.12})}
 else if(id==='deer'||id==='pursuit'){deer(1070+250*p,640-12*Math.sin(t*3),t);actor('rama',480+130*p,440,1,1,t,{a:.1,b:.3,step:4*Math.sin(t*4)})}
 else if(id==='empty'){}
 else if(id==='jatayu'){bird(700+220*p,420-90*Math.sin(p*Math.PI),2.1,t);P(c,'M1130 580 L1570 580 L1510 680 L1180 680Z','#8b422d');actor('ravana',1280+100*p,220,.9,-1,t);actor('sita',1500+100*p,240,.75,-1,t);}
 else if(id==='loss'){actor('rama',980,480,1,-1,t,{head:.3,a:1.2,b:.1});bird(650,720,1.4,0)}
 else if(id==='meeting'||id==='listen'||id==='alliance'){actor('rama',680,420,1.1,1,t,{a:.3-.3*gesture,b:.2});actor(id==='alliance'?'sugriva':'hanuman',1280,420,1.1,-1,t,{a:.2-.3*gesture,b:.3,head:.08})}
 else if(id==='vali'){actor('sugriva',700,430,1.1,1,t,{head:.2});actor('vali',1250,480,1,-1,t,{tilt:-.25*gesture,head:.2,a:1.3,b:0})}
 else if(id==='shore'||id==='reassure'||id==='brace'){paintingSprite('kneel',1130,900,630,t);if(id==='reassure')actor('king',580,430,1.05,1,t,{a:-.5*gesture,b:.2})}
 else if(id==='leap'||id==='flight'||id==='surasa'||id==='landing'){let x=id==='leap'?450+850*E(p):id==='landing'?1250+200*p:970+120*Math.sin(p*Math.PI),y=id==='leap'?1000-380*Math.sin(p*Math.PI/2):id==='landing'?640+240*E(p):670+12*Math.sin(t*1.1);paintingSprite('fly',x,y,id==='flight'?470:620,t);if(id==='surasa'){c.strokeStyle='#735842';c.lineWidth=26;c.beginPath();c.ellipse(1420,540,150,260,0,-1.7,1.7);c.stroke()}}
 else if(['garden','sita','approach','ring','token'].includes(id)){paintingSprite('sita',1320,900,id==='sita'?720:650,t);if(id!=='garden'&&id!=='sita')paintingSprite('kneel',670+30*gesture,920,650,t);if(id==='token'){ring(960,470,.32,t)}}
 else if(id==='return'){actor('rama',1260,420,1.1,-1,t,{a:.2,b:.1});actor('hanuman',650+50*p,430,1.1,1,t,{a:-.2,b:.3});}
 else if(id==='vibhishana'){actor('ravana',1300,400,1.1,-1,t,{a:-.4,b:.2});actor('vibhishana',700-140*p,410,1.1,-1,t,{head:.02})}
 else if(id==='welcome'){actor('rama',630,420,1.1,1,t,{a:-.15,b:.4});actor('vibhishana',1250-70*p,420,1.1,-1,t,{head:.13,a:.7,b:2})}
 else if(id==='nala'||id==='workers'||id==='bridge'){if(id!=='bridge'){P(c,'M0 700 Q400 640 850 710 Q1400 665 1920 710 L1920 1080 L0 1080Z','#c1ac80','#776743',4)}let count=id==='bridge'?Math.floor(5+14*p):7;for(let j=0;j<count;j++){let x=520+j*57,y=970-j*24;P(c,`M${x} ${y} l70-25 l36 27 l-67 32Z`,'#b9aa83','#615c49',2)}if(id!=='bridge'){for(let j=0;j<4;j++)actor(j===0?'hanuman':'sugriva',420+j*350,390+(j%2)*40,.85,1,t,{a:-.25,b:-.1,step:4*Math.sin(t*3+j)});for(let j=0;j<3;j++)P(c,`M${660+j*350} 460 l95-12 l35 45 l-100 25Z`,'#a9a28c')}}
 else if(id==='armies'||id==='peace'){for(let j=0;j<4;j++){actor('rama',220+j*180,520,.65,1,t);actor('ravana',1700-j*180,520,.65,-1,t)}if(id==='peace')actor('hanuman',960,410,1.1,1,t,{a:-.5,b:.2})}
 else if(id==='giant'){actor('kumbhakarna',1190,330,1.45,-1,t,{a:1,b:.1});actor('rama',530,550,.65,1,t,{a:-.2,b:.3})}
 else if(id==='indrajit'){actor('indrajit',1300,400,1.1,-1,t,{a:-.5,b:-.1});actor('lakshmana',650,420,1.1,1,t,{a:-.3,b:.2});c.strokeStyle='#674322';c.lineWidth=5;c.beginPath();c.moveTo(1260-500*gesture,510);c.lineTo(1380-500*gesture,510);c.stroke()}
 else if(id==='injury'||id==='recovery'){actor('lakshmana',1020,520-(id==='recovery'?100*gesture:0),1,-1,t,{tilt:id==='injury'?-.35:.25*(1-gesture),head:.22*(1-gesture),a:1.2,b:.2});actor('rama',600,440,1.05,1,t,{head:.15})}
 else if(id==='mountain'){paintingSprite('fly',890,770,580,t);mountains(1290,370,1,t)}
 else if(id==='duel'){actor('rama',600,420,1.1,1,t,{a:-.35,b:.1});actor('ravana',1320,420,1.2,-1,t,{a:-.35,b:.2,head:.08*reaction});if(u>3){c.strokeStyle='#7a4e24';c.lineWidth=5;c.beginPath();c.moveTo(800+400*reaction,470);c.lineTo(950+400*reaction,470);c.stroke()}}
 else if(id==='silence'){for(let j=0;j<7;j++){c.save();c.translate(420+j*180,790);c.rotate(.3+j*.07);c.fillStyle='#684c32';c.fillRect(-70,-4,140,8);c.restore()}lamp(t,560,690);const w=ch.phrases.flatMap(p=>p.words).find(w=>w.text==='विभीषण');if(w&&t-ch.voiceStart>=w.start){actor('vibhishana',1240,420,1.1,-1,t,{head:.05});crown(1240,240,.5)}}
 else if(id==='news'){actor('sita',1220,430,1.1,-1,t,{head:-.07});actor('hanuman',600,440,1.05,1,t,{a:-.25,b:.3})}
 else if(id==='distance'||id==='decision'){actor('rama',480,420,1.1,1,t,{a:1.2,b:.1});actor('sita',1400,420,1.1,-1,t,{a:id==='decision'?-.5*gesture:.8,b:.2,head:-.05})}
 else if(id==='fire'){actor('sita',960,420,1.1,-1,t,{head:-.05,a:.8,b:.2});fireCurtain(t,Math.sin(p*Math.PI));}
 else if(id==='pushpaka'){P(c,'M390 740 Q960 880 1530 740 L1450 810 L480 810Z','#ba8b38');for(let j=0;j<3;j++)actor(['rama','sita','lakshmana'][j],680+j*280,370,.8,1,t);crown(960,240,2.2)}
 else if(id==='arrival'){actor('bharata',680,410,1.1,1,t,{a:-.3*gesture,b:.2});actor('rama',1400-140*p,420,1.1,-1,t,{step:4*Math.sin(t*3)})}
 if(mode==='oil'&&['forest','grove'].includes(base))leaves(t,base);
 if(id==='family'||id==='coronation'){for(let j=0;j<24;j++){const x=(j*163+t*16)%2000-40,y=(j*81+t*39)%870;c.save();c.translate(x,y);c.rotate(t*.6+j);c.fillStyle=j%2?'#b95947':'#e7c16b';c.beginPath();c.ellipse(0,0,7,3,0,0,7);c.fill();c.restore()}}
 c.restore();if(mode==='shadow')archFrame();return mode;
}
function captions(ch,t){const v=t-ch.voiceStart,ph=ch.phrases.find(x=>v>=x.start&&v<x.end);if(!ph)return;const ws=ph.words,active=ws.findIndex(w=>v>=w.start&&v<w.end);c.font='700 49px Noto';const space=c.measureText(' ').width,widths=ws.map(w=>c.measureText(w.text).width),w=widths.reduce((a,b)=>a+b,0)+(ws.length-1)*space;const x=(1920-w)/2,entry=E((v-ph.start)/.18),y=987+9*(1-entry);c.fillStyle='rgba(24,18,14,.86)';c.beginPath();c.roundRect(x-30,920,w+60,93,14);c.fill();let pos=x;for(let j=0;j<ws.length;j++){text(ws[j].text,pos,y,49,j===active?'#ffd267':'#fff1d5','left');pos+=widths[j]+space}}
function render(globalTime){const ch=T.chapters.find(x=>globalTime>=x.start&&globalTime<x.start+x.duration)||T.chapters.at(-1),local=globalTime-ch.start,shot=ch.shots.find(x=>local>=x.start&&local<x.end)||ch.shots.at(-1),u=local-shot.start,d=shot.end-shot.start;c.setTransform(cv.width/1920,0,0,cv.height/1080,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';c.clearRect(0,0,1920,1080);visual(shot.id,u,d,globalTime,ch);
 if(local<3.7){c.fillStyle='rgba(30,23,16,.8)';c.beginPath();c.roundRect(65,55,400,74,12);c.fill();text(ch.label,92,106,35,'#f3d49b','left')}
 captions(ch,globalTime);
 if(ch.id===1&&local>2&&local<6){text('रामायण',960,270,94,'#f9e4ae');text('वचन से विजय तक',960,340,42,'#f9e4ae')}
 if(ch.id===12&&local>ch.duration-6){c.fillStyle='rgba(27,21,16,.6)';c.fillRect(420,300,1080,240);text('रामायण',960,415,90);text('वचन से विजय तक',960,490,44)}
}
const q=new URLSearchParams(location.search),selected=q.get('chapter');const start=selected?T.chapters[Number(selected)-1].start:0;window.DUR=selected?T.chapters[Number(selected)-1].duration:T.duration;window.render=t=>render(t+start);window.TEXTS=()=>[];window.READY=true;window.render(0);
