import {clamp,lerp,ss,seg} from '/core/lib.js';
const C=document.getElementById('film'),g=C.getContext('2d');
const T=await(await fetch('timeline.json')).json();
const ENV=await(await fetch('envelopes.json')).json();
await Promise.all([document.fonts.load('30px Sans'),document.fonts.load('700 30px Sans'),document.fonts.load('40px Hindi'),document.fonts.load('50px Serif')]);
const P={paper:'#f4ecde',cream:'#fff9eb',ink:'#2b3233',teal:'#437d78',rust:'#b65b43',gold:'#c89b4a',blue:'#6c8595',skin:'#c58a68',skinL:'#dca27d',hair:'#302e2d',shadow:'#d8c7ac'};
let t=0;
function path(d,fill,stroke=null,w=3){let p=new Path2D(d);if(fill){g.fillStyle=fill;g.fill(p)}if(stroke){g.strokeStyle=stroke;g.lineWidth=w;g.lineJoin='round';g.lineCap='round';g.stroke(p)}}
function rect(x,y,w,h,c,r=0){g.fillStyle=c;g.beginPath();g.roundRect(x,y,w,h,r);g.fill()}
function ell(x,y,rx,ry,c){g.fillStyle=c;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill()}
function line(x,y,a,b,c=P.ink,w=3){g.strokeStyle=c;g.lineWidth=w;g.lineCap='round';g.beginPath();g.moveTo(x,y);g.lineTo(a,b);g.stroke()}
function txt(s,x,y,size=32,color=P.ink,font='Sans',weight=400,align='left'){g.fillStyle=color;g.font=`${weight} ${size}px ${font}`;g.textAlign=align;g.fillText(s,x,y)}
function local(x,y,s,rot,fn){g.save();g.translate(x,y);g.rotate(rot);g.scale(s,s);fn();g.restore()}
function mouth(who){let c=T.cues.find(c=>c.who===who&&t>=c.start&&t<c.end);if(!c)return 0;let e=ENV[c.id];return e[Math.min(e.length-1,Math.floor((t-c.start)*24))]||0}
function hand(x,y,angle=0){local(x,y,1,angle,()=>{path('M-15 1 Q-20 -10 -12 -16 L-8 -21 Q-3 -23 -1 -16 L7 -12 Q18 -11 18 0 Q17 13 4 15 L-9 10Z',P.skinL,P.ink,2);line(-4,-8,7,-4,'#a86e53',1.5);line(-6,-2,6,1,'#a86e53',1.5)})}
function arm(sx,sy,ex,ey,hx,hy,color){path(`M${sx} ${sy} Q${ex} ${ey} ${hx} ${hy}`,null,P.ink,37);path(`M${sx} ${sy} Q${ex} ${ey} ${hx} ${hy}`,null,color,31);hand(hx,hy,Math.atan2(hy-ey,hx-ex))}
function character(who,x,y,s=1,mood='neutral',gesture=0){
 local(x,y,s,0,()=>{
 const father=who==='rajiv',mother=who==='meera',girl=who==='tara',col=father?P.blue:mother?P.teal:P.rust;
 const breath=Math.sin(t*1.7+(father?0:mother?1:2))*1.5;
 // legs and held torso, shoulder seam kept inside body
 path('M-58 165 L-66 300 L-12 300 L2 197 L20 300 L73 300 L54 165Z',father?'#485a62':'#6c5148');
 path('M-49 -13 Q0 -32 49 -13 Q78 39 72 181 Q0 201 -77 179 L-70 52Z',col,P.ink,3);
 path('M35 4 Q55 68 57 180 L74 178 L69 36Z',father?'#5b7382':mother?'#326760':'#9d4939');
 if(father){path('M-24 -16 L0 17 L-16 37 L-43 -10Z',P.paper);path('M23 -16 L0 17 L17 37 L43 -10Z',P.paper);line(0,20,0,179,'#415661',2);for(let i=0;i<4;i++)ell(5,47+i*32,2.2,2.2,P.cream);rect(26,60,26,33,'#879aa7',2)}
 if(mother){path('M-39 -16 Q-16 31 46 59 L62 173 L36 181 L18 75 Q-37 60 -54 15Z','#bb7057');for(let k=0;k<4;k++)line(44+k*4,151,46+k*4,178,'#e0aa7a',1)}
 if(girl){path('M-21 -18 Q0 11 23 -18 L29 -9 Q0 26 -30 -9Z','#e7b28b')}
 // arms, gesture anticipation and follow-through
 let lift=gesture;arm(-59,20,-110,75,-92+lift*24,117-lift*115,col);arm(58,20,110,78,91+lift*33,116-lift*64,col);
 // neck
 rect(-20,-53,40,56,P.skin,10);path('M-20 -37 Q0 -25 20 -38 L20 -18 Q-2 -8 -20 -23Z','#af7355');
 const tilt=(mood==='question'?-0.075:mood==='smile'?0.035:0)+Math.sin(t*1.15)*.008;
 local(0,-95+breath,1,tilt,()=>{
  if(!father){ell(0,-13,61,76,P.hair);if(mother)ell(56,-28,24,27,P.hair);else path('M45 -43 Q103 -59 86 43 Q75 94 52 103 Q71 39 50 16Z',P.hair)}
  ell(-50,4,12,18,P.skin);ell(50,4,12,18,P.skin);
  path('M-45 -40 Q-43 -65 2 -65 Q42 -64 47 -33 L45 23 Q40 63 3 66 Q-36 63 -45 25Z',P.skinL,P.ink,2.5);
  path('M33 -40 Q50 -16 42 29 Q32 54 9 62 Q40 66 47 30 L47 -31Z',P.skin);
  if(father){path('M-47 -14 L-51 -43 Q-44 -78 3 -77 Q45 -73 50 -42 L44 -9 L32 -39 Q10 -28 -18 -43 L-37 -29Z','#4a4743');path('M-45 -48 Q-22 -78 15 -68',null,'#b4aaa0',7);path('M-47 -30 L-43 2 M43 -27 L44 3',null,'#a6a19a',5)}else{path('M-49 -7 Q-58 -62 -16 -72 Q34 -83 48 -39 L48 -6 Q21 -20 6 -49 Q-15 -19 -49 -7Z',P.hair);path('M-34 -43 Q-16 -61 12 -61',null,'#5a4b43',4)}
  const blink=((t+(father?1:mother?2:0))%4.7<.13),gaze=mood==='question'?6:mother?-3:girl?-4:2;
  for(const xx of [-20,20]){if(blink)line(xx-7,1,xx+7,1,P.ink,2.4);else{ell(xx,1,9,7.5,P.cream);ell(xx+gaze*.45,1,3.2,4.5,P.ink)}}
  let brow=mood==='worried'?7:mood==='question'?9:2;
  line(-29,-15,-12,-15-brow,P.hair,3);line(12,-15-brow,29,-15,P.hair,3);
  path('M3 1 L-2 20 Q3 25 11 20',null,'#a46850',2);
  if(father){rect(-35,-11,29,25,'#00000000',5);g.strokeStyle=P.ink;g.lineWidth=2.7;g.strokeRect(-35,-11,29,25);g.strokeRect(8,-11,29,25);line(-6,-3,8,-3);line(-48,-4,-35,-3);path('M-18 30 Q-6 22 0 29 Q8 22 22 32 L12 37 L0 33 L-13 38Z','#4b4540')}
  let mo=mouth(who);if(mo>.12){ell(2,42,10+mo*3,3+mo*11,'#713f36');if(mo>.45)rect(-4,37,14,3,P.cream,1)}else path(mood==='smile'?'M-9 39 Q3 50 17 38':'M-8 42 Q3 44 14 40',null,'#793f33',2.5);
  if(mother){ell(-51,23,5,7,P.gold);ell(51,23,5,7,P.gold)}
 });
 });
}
function room(){rect(0,0,1920,1080,P.paper);rect(0,710,1920,370,'#d8c7af');rect(100,90,480,500,'#c3cfca',14);rect(116,106,448,468,'#234e58',6);
 for(let i=0;i<9;i++){let x=125+i*51,h=90+(i*37)%170;rect(x,574-h,40,h,'#38616a');for(let j=0;j<3;j++)if((i+j)%3)rect(x+9,594-h+j*42,9,16,'#d3b86f')}
 line(340,105,340,575,'#e5d7bf',13);line(116,360,564,360,'#e5d7bf',12);
 path('M84 80 L166 80 L153 592 L78 610Z','#c89172');path('M510 80 L590 80 L600 610 L525 592Z','#c89172');
 for(let x of [95,115,136,530,551,574])line(x,100,x+5,579,'#b68065',2);
 line(959,0,959,131,'#574f44',4);path('M871 132 Q960 81 1049 132 L1081 195 L839 195Z','#cead6c');ell(960,195,121,17,'#e6c986');
 rect(1335,125,290,300,'#c5a27b',4);rect(1348,138,264,274,P.cream);path('M1368 385 L1446 207 L1508 327 L1558 250 L1592 385Z','#a7b5a0');ell(1538,207,26,26,P.rust);
 line(1265,510,1740,510,'#96785c',12);rect(1300,438,18,68,P.rust);rect(1324,450,22,56,P.blue);rect(1353,432,15,74,P.teal);
 rect(1658,444,47,63,'#c88f6c',8);for(let j=0;j<4;j++)path(`M1680 449 Q${1620+j*30} 380 ${1640+j*27} ${362+j*6}`,null,'#667b56',9);
}
function table(){ell(953,868,655,68,'#bca88c');path('M390 722 L1500 722 L1595 835 L320 835Z','#c79767',P.ink,3);path('M320 835 L1595 835 L1590 859 L326 859Z','#aa7952');path('M409 856 L437 971 L467 971 L463 856 M1440 856 L1429 971 L1456 971 L1488 856','#735743');
 for(let x of [565,960,1353]){ell(x,777,103,31,'#a67e5a');ell(x,771,97,29,P.cream);ell(x,770,75,20,'#e7d6b1');ell(x-19,771,37,14,'#d8ad66');ell(x+42,767,20,12,'#798457');}
 ell(787,793,63,20,'#744f36');path('M727 780 Q734 833 787 833 Q840 833 846 780Z','#527e80');ell(787,780,60,18,'#bc8a48');ell(1138,798,50,16,'#744f36');path('M1092 791 L1102 823 L1174 823 L1185 791Z','#a15d44');ell(1139,791,47,14,'#c48c4b');
 local(1058,743,1,-.16,()=>{rect(-25,-43,50,82,P.ink,6);rect(-21,-36,42,67,'#b9d2c9',3);line(-12,-20,13,-20,P.teal,2);line(-12,-9,9,-9,P.teal,2)});for(let x of [439,1467]){rect(x,715,29,64,'#b7c4bd',5);line(x+6,723,x+6,765,P.cream,3)}
}
function dinner(mode){room();let z=1,cx=960,cy=505;if(mode==='tara'){z=1.72;cx=1370;cy=510}else if(mode==='rajiv'){z=1.72;cx=565;cy=510}else if(mode==='meera'){z=1.62;cx=965;cy=510}
 g.save();g.translate(960,500);g.scale(z,z);g.translate(-cx,-cy);
 // restrained backdrop inside same camera transform
 room();for(let x of [560,960,1360])rect(x-80,570,160,219,'#876b54',20);
 const current=T.cues.find(c=>t>=c.start&&t<c.end);const gest=who=>current?.who===who?.toString()?Math.sin(Math.PI*clamp((t-current.start)/.6))*.15+.45:0;
 character('rajiv',560,607,1.34,t>11?'question':'worried',gest('rajiv'));character('meera',960,600,1.35,'smile',gest('meera'));character('tara',1360,602,1.29,t>11?'question':'worried',gest('tara'));table();g.restore();
}
function paperBase(){rect(0,0,1920,1080,P.paper);ell(1100,819,660,70,'#ddceb5');path('M390 820 L1000 880 L1630 808 L1002 718Z','#c6b491');path('M390 801 L1000 860 L1630 790 L1000 696Z',P.cream,P.shadow,3);line(1000,696,1000,860,'#d1bfa2',3)}
function office(u){paperBase();let p=ss(seg(u,0,.8));local(1090,759,1,0,()=>{g.scale(1,p);path('M-475 0 L-475 -453 L465 -453 L465 0Z','#ced9d5');for(let x=-420;x<420;x+=180){rect(x,-405,135,226,'#ecf1e9',4);line(x+68,-405,x+68,-179,'#a6bbb6',4)}
 rect(-350,-130,700,25,'#a17d5a',3);rect(-327,-105,18,105,'#7a6654');rect(306,-105,18,105,'#7a6654');rect(-78,-292,202,126,P.ink,8);rect(-67,-282,180,104,'#e7ede4');line(23,-166,23,-137,P.ink,8);line(-20,-136,68,-136,P.ink,7);
 for(let i=0;i<3;i++)rect(-275+i*23,-160-i*10,115,8,'#f7edce',2);
 let a=1-ss(seg(u,2.5,4));g.save();g.globalAlpha=a;rect(-14,-100,121,128,'#6e8b94',18);line(40,28,40,66,P.ink,7);g.restore();
 });character('rajiv',380,630,1.65,'worried',.1);txt('बीस साल का अनुभव',1020,190,54,P.ink,'Hindi',400,'center');if(u>2)txt('अब क्या?',1370,365,56,P.rust,'Hindi',400,'center');}
function education(u){paperBase();let grow=ss(seg(u,0,1));local(1100,760,1,0,()=>{g.scale(1,grow);path('M-380 -50 L-380 -334 L-180 -334 L-100 -415 L-5 -334 L350 -334 L350 -50Z','#d5bfa0');path('M-411 -334 L-100 -491 L382 -334Z',P.rust);rect(-106,-258,142,208,'#f6e9d2');for(let x of [-315,-220,117,224])rect(x,-263,62,77,P.cream,3);
 path('M-80 -50 L-150 52 L-315 70 M-80 -50 L0 63 L170 70 M-80 -50 L130 -2 L310 14',null,P.teal,12);
 for(let [x,y]of[[-315,70],[170,70],[310,14]])ell(x,y,13,13,P.gold);
 });character('tara',390,650,1.65,'question',.15);txt('आज की पढ़ाई',1070,175,54,P.ink,'Hindi',400,'center');txt('कल का रास्ता?',1260,267,47,P.rust,'Hindi',400,'center');}
function shop(u){paperBase();let p=ss(seg(u,0,.85));local(1120,765,1,0,()=>{g.scale(1,p);rect(-350,-350,700,350,'#e6c7a4',5);rect(-330,-265,660,240,P.cream);for(let x=-330,i=0;x<330;x+=110,i++){rect(x,-370,110,82,i%2?P.cream:P.teal);ell(x+55,-288,55,18,i%2?P.cream:P.teal)}rect(-370,-420,740,56,P.teal,3);txt('घर का खाना',0,-380,36,P.cream,'Hindi',400,'center');rect(-355,-90,710,18,'#ac7f57');for(let i=0;i<4;i++){rect(-280+i*150,-142,115,43,'#d9ba85',7);rect(-284+i*150,-149,123,12,'#b59461',4)}
 });character('meera',380,641,1.65,'smile',.45);txt('थोड़ा आसान',1080,180,58,P.ink,'Hindi',400,'center');}
function phone(u){rect(0,0,1920,1080,P.paper);path('M0 770 L1920 450 L1920 1080 L0 1080Z','#e0c6a2');
 local(510,485,1,-.08,()=>{rect(-300,-300,600,600,'#cbb48e',10);rect(-310,-310,600,600,P.cream,8);txt('घर का खाना',-240,-211,45,P.teal,'Hindi');txt('आज का मेन्यू',-240,-150,34,P.ink,'Hindi');for(let [i,s]of ['दाल, चावल, सब्ज़ी','रोटी और सलाद','₹150 प्रति डिब्बा'].entries())txt(s,-240,-55+i*83,35,P.ink,'Hindi');line(-237,185,235,185,'#cbbca2',2);txt('मूल जानकारी',-240,242,25,P.rust,'Hindi');});
 let p=ss(seg(u,.3,1.4));local(1300,505+55*(1-p),.91,p*.015,()=>{rect(-205,-375,430,775,'#b9a88e',47);rect(-220,-390,430,775,P.ink,47);rect(-204,-370,398,735,P.cream,34);rect(-70,-361,136,22,P.ink,12);rect(-204,-316,398,96,P.teal);txt('आज का मेन्यू',-169,-254,37,P.cream,'Hindi');
 txt('घर जैसा खाना',-169,-160,35,P.ink,'Hindi');for(let [i,s]of ['दाल • चावल • सब्ज़ी','रोटी और ताज़ा सलाद'].entries())txt(s,-169,-89+i*54,26,P.ink,'Hindi');txt('₹150',-169,74,58,P.rust,'Sans',700);txt('प्रति डिब्बा',-169,123,26,P.ink,'Hindi');rect(-170,193,328,56,'#e9dcc6',12);txt('ड्राफ्ट — भेजने से पहले जाँचें',-6,231,22,P.ink,'Hindi',400,'center');});
 txt('वही जानकारी। साफ़ प्रस्तुति।',960,120,44,P.ink,'Hindi',400,'center');}
function captions(){let c=T.cues.find(c=>t>=c.start&&t<Math.min(c.end+.32,T.cues[c.id+1]?.start??99));if(!c)return;let ls=c.en.split('\n');g.font='34px Sans';let w=Math.max(...ls.map(s=>g.measureText(s).width))+70;let h=ls.length*46+28;rect((1920-w)/2,1035-h,w,h,'#293335',12);ls.forEach((s,i)=>txt(s,960,1035-h+47+i*46,34,P.cream,'Sans',400,'center'))}
// Subtle static paper texture, generated once, never random frame-to-frame.
const grain=document.createElement('canvas');grain.width=1920;grain.height=1080;const gg=grain.getContext('2d');let seed=81;for(let i=0;i<24000;i++){seed=(1664525*seed+1013904223)>>>0;let x=seed%1920;seed=(1664525*seed+1013904223)>>>0;let y=seed%1080;gg.fillStyle=i%2?'rgba(80,60,40,.025)':'rgba(255,255,240,.10)';gg.fillRect(x,y,1,1)}
window.DUR=50.5;
window.render=(time)=>{t=time;g.clearRect(0,0,1920,1080);if(new URLSearchParams(location.search).has('models')){rect(0,0,1920,1080,P.paper);txt('CHARACTER / PERFORMANCE STUDY',100,90,30,P.teal,'Sans',700);['rajiv','meera','tara'].forEach((who,i)=>{txt(['RAJIV','MEERA','TARA'][i],180+i*610,174,26,P.ink,'Sans',700);character(who,220+i*610,370,.85,'worried',0);character(who,430+i*610,370,.85,'smile',.7);character(who,220+i*610,820,.75,'question',.2);character(who,430+i*610,820,.75,'neutral',.55)});return;}
 if(t<3.45)dinner(t<1.2?'wide':'tara');else if(t<10.85)dinner('rajiv');else if(t<14.5)dinner('meera');else if(t<16.3)dinner('rajiv');else if(t<20.5)dinner('meera');else if(t<24.05){dinner('wide');let p=ss(seg(t,20.5,21.2));g.globalAlpha=p;rect(515,65,890,96,P.cream,9);txt('एक घर। तीन नज़रिए।',960,134,49,P.teal,'Hindi',400,'center');g.globalAlpha=1}
 else if(t<29.1)office(t-24.05);else if(t<34.4)education(t-29.1);else if(t<40.15)shop(t-34.4);else if(t<46.32)phone(t-40.15);else{rect(0,0,1920,1080,P.teal);txt('AI आ गया।',960,425,112,P.cream,'Hindi',400,'center');txt('अब हमारा क्या?',960,566,112,P.cream,'Hindi',400,'center');line(820,650,1100,650,'#ccac73',3);txt('OPENING PROOF  /  eliv8lyf',960,727,28,'#e2d4b9','Sans',400,'center');}
 // short object-colour wipes, not fades, at metaphor transitions
 for(let cut of [24.05,29.1,34.4,40.15])if(t>cut-.18&&t<cut+.22){let p=(t-cut+.18)/.4;let w=1920*Math.sin(p*Math.PI);rect(p*1920-w/2,0,w,1080,'#e2c49e')}
 g.drawImage(grain,0,0);if(t<46.32)captions();
};window.READY=true;window.render(0);
