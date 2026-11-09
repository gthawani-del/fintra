import {mulberry} from '/core/lib.js';
const c=document.querySelector('canvas'),x=c.getContext('2d');
const ink='#3e4140',dark='#343b3c';
function path(d,f,s=ink,w=2){const p=new Path2D(d);if(f){x.fillStyle=f;x.fill(p)}if(s){x.strokeStyle=s;x.lineWidth=w;x.lineCap='round';x.lineJoin='round';x.stroke(p)}}
function ellipse(a,b,r,t,f,s=null,w=2){x.beginPath();x.ellipse(a,b,r,t,0,0,Math.PI*2);if(f){x.fillStyle=f;x.fill()}if(s){x.strokeStyle=s;x.lineWidth=w;x.stroke()}}
function rect(a,b,w,h,f,s=null,l=2){x.fillStyle=f;x.fillRect(a,b,w,h);if(s){x.strokeStyle=s;x.lineWidth=l;x.strokeRect(a,b,w,h)}}
function line(d,col=ink,w=2){path(d,null,col,w)}
function grad(a,b,c,d,stops){const g=x.createLinearGradient(a,b,c,d);for(const [t,s]of stops)g.addColorStop(t,s);return g}
function group(a,b,s,fn){x.save();x.translate(a,b);x.scale(s,s);fn();x.restore()}
function shadow(a,b,r,t,alpha=.16){ellipse(a,b,r,t,`rgba(33,43,45,${alpha})`)}
function flower(a,b,s,col){group(a,b,s,()=>{for(let i=0;i<5;i++){x.save();x.rotate(i*Math.PI*2/5);ellipse(0,-8,4,9,col);x.restore()}ellipse(0,0,4,4,'#ccae78')})}
function frame(a,b,w,h,kind){rect(a+5,b+7,w,h,'#777c71');rect(a,b,w,h,'#654f3d',ink,2);rect(a+7,b+7,w-14,h-14,'#d7c8a7');rect(a+13,b+13,w-26,h-26,'#9ba598');x.save();x.beginPath();x.rect(a+13,b+13,w-26,h-26);x.clip();if(kind===0){ellipse(a+w*.5,b+h*.43,w*.16,h*.18,'#be9472');path(`M ${a+w*.2} ${b+h} Q ${a+w*.22} ${b+h*.6} ${a+w*.5} ${b+h*.61} Q ${a+w*.8} ${b+h*.6} ${a+w*.83} ${b+h} Z`,'#727d84',null);path(`M ${a+w*.34} ${b+h*.43} Q ${a+w*.28} ${b+h*.16} ${a+w*.56} ${b+h*.23} Q ${a+w*.72} ${b+h*.24} ${a+w*.65} ${b+h*.44} L ${a+w*.56} ${b+h*.32} Z`,'#4a4640',null)}else{path(`M${a} ${b+h*.8} L${a+w*.4} ${b+h*.45} L${a+w*.7} ${b+h*.65} L${a+w} ${b+h*.35} L${a+w} ${b+h} H${a}Z`,'#687d76',null);ellipse(a+w*.6,b+h*.32,w*.12,w*.12,'#d5be80')}x.restore();line(`M${a+4} ${b+h-4}V${b+4}H${a+w-4}`,'#9a7f5b',1)}
function background(){
rect(0,0,1920,1080,grad(0,0,1700,1000,[[0,'#a6b4b0'],[.55,'#c5c7b3'],[1,'#b5b6a0']]));
// Architectural perspective and cooler left wall.
path('M0 0 H470 L490 654 L0 810Z',grad(0,0,490,600,[[0,'#829798'],[1,'#a8b7b0']]),null);
path('M0 809 L490 654 L1920 693 V1080 H0Z',grad(0,650,1700,1080,[[0,'#b6b3a0'],[.7,'#d6c5a3'],[1,'#c2ae8d']]),ink,2);
path('M0 795 L490 642 L1920 680 V698 L490 661 L0 818Z','#7a857d',ink,2);
line('M470 0 L490 642','#798b86',3);line('M0 58 L466 93 L1920 60','#d4d4be',9);line('M0 68 L466 104 L1920 71','#83938b',2);
for(let i=0;i<10;i++)line(`M${490+i*162} 661 L${-300+i*310} 1080`,'#9f9f8e',1);
for(const y of [715,789,881,1000])line(`M0 ${y+150} L1920 ${y}`,'#a4a291',1);
// Window with a recognisable barred Indian frame, evening outside.
path('M55 151 L409 174 L415 577 L55 628Z','#556d70',ink,3);
path('M69 166 L394 187 L399 564 L69 609Z',grad(0,170,0,610,[[0,'#607b92'],[.65,'#9ab2b9'],[1,'#b8c5bc']]),'#c0ccc0',3);
// Neighbourhood facades within the window.
x.save();path('M69 166 L394 187 L399 564 L69 609Z');x.clip(new Path2D('M69 166 L394 187 L399 564 L69 609Z'));
rect(50,352,134,270,'#819898',ink,1);rect(173,285,139,330,'#a4b0a8',ink,1);rect(310,384,130,230,'#778d90',ink,1);
for(let col=0;col<5;col++)for(let row=0;row<3;row++){const xx=80+col*68,yy=380+row*66;rect(xx,yy,29,42,(col+row)%3?'#526b77':'#dbc68d','#bbc3ac',2);line(`M${xx+14} ${yy}v42`,'#8c9f9c',1)}
line('M54 301 Q220 345 414 306 M68 327 Q230 367 410 339','#4f646a',1.5);
for(let i=0;i<4;i++)path(`M${205+i*25} 350 l22 2 l-3 35 l-19 -2Z`,['#9e7065','#8c9b85','#c4ac81','#698698'][i],null);
x.restore();
for(const xx of [110,166,225,285,345])line(`M${xx} ${170+(xx-69)*.065} L${xx+3} ${605-(xx-69)*.14}`,'#41585e',5);
for(const y of [275,420,530])line(`M69 ${y} L397 ${y-8}`,'#41585e',4);
line('M238 178 L242 585','#d5d2b4',9);line('M246 182 L249 586','#41585e',2);
path('M40 627 L414 576 L433 588 L43 649Z','#b9b6a0',ink,2);
// Curtain drawn to one side, fabric folds.
path('M8 129 Q58 140 96 146 Q87 260 76 380 Q62 505 88 612 L18 636 Q29 406 8 129Z','#bdbaa2',ink,2);
for(let i=0;i<5;i++)line(`M${18+i*14} 146 Q${37+i*11} 363 ${27+i*12} 622`,'#969e90',1.5);
line('M0 124 L429 151','#5b605b',6);
// Wall clock.
ellipse(1045,168,63,63,'#526864',ink,3);ellipse(1045,168,54,54,'#ddd6bb',ink,2);ellipse(1045,168,48,48,'#d1d0b5');
for(let i=0;i<12;i++){const a=i*Math.PI/6;line(`M${1045+42*Math.sin(a)} ${168-42*Math.cos(a)} L${1045+47*Math.sin(a)} ${168-47*Math.cos(a)}`,'#67746c',2)}line('M1045 168 L1045 137 M1045 168 L1074 185','#425851',3);ellipse(1045,168,4,4,'#425851');
// Family photographs and shelf — actual framing, not blank boxes.
frame(546,152,102,132,0);frame(671,159,122,95,1);frame(815,154,100,134,0);frame(673,278,128,99,0);
path('M529 401 L934 402 L957 420 L550 423Z','#80634d',ink,2);rect(550,423,407,10,'#5c5143',ink,2);path('M580 433 L580 477 L614 433 M889 433 L920 474 L920 433','#7b6851',ink,2);
for(let i=0;i<7;i++){rect(577+i*27,337-i%3*7,22,64+i%3*7,['#7b8d83','#a77a5a','#a9a886','#6c8286'][i%4],ink,1.3);line(`M${580+i*27} 349 L${595+i*27} 349 M${580+i*27} 391 L${595+i*27} 391`,'#d0c3a0',1)}
// Metal storage tins; their highlights carry cool room light.
for(let i=0;i<3;i++){const a=803+i*40,b=349-i*8;rect(a,b,34,52+i*8,grad(a,0,a+34,0,[[0,'#697d7d'],[.25,'#d4d8c8'],[.52,'#94a5a0'],[.8,'#c1c8b8'],[1,'#6e8380']]),ink,1.3);ellipse(a+17,b,18,5,'#c7d1c5',ink,1.3);ellipse(a+17,b-3,18,4,'#a7b6ae',ink,1)}
// Right cabinet with recessed panels, real handles.
path('M1602 195 L1845 181 L1881 222 L1874 702 L1615 680Z','#6f776b',ink,3);path('M1623 218 L1840 207 L1836 673 L1629 659Z','#a4a58b',ink,2);line('M1737 213 L1735 666','#626d61',3);rect(1710,395,7,47,'#d0c4a2',ink,1);rect(1748,395,7,47,'#d0c4a2',ink,1);line('M1641 238 L1719 233 L1717 640 L1647 636Z M1754 232 L1820 228 L1816 650 L1751 645Z','#7f8977',2);
rect(1629,166,104,36,'#987752',ink,2);ellipse(1680,165,52,9,'#b89f73',ink,2);line('M1647 171 V196 M1665 170 V197 M1682 170 V198 M1700 170 V198 M1718 170 V198','#775e46',1);
// A small grocery calendar: ruled marks, no invented readable wording.
rect(1171,250,115,148,'#d3d1b8','#667970',1.5);rect(1171,250,115,30,'#8e6c59');
for(let row=0;row<5;row++)for(let col=0;col<7;col++)rect(1183+col*14,294+row*18,4,6,col===0?'#a5795e':'#7e8d7d');line('M1182 246H1273','#6a7769',3);
// A warm household wall lamp.
line('M1472 115 V215','#616d63',3);path('M1424 188 L1522 188 L1550 254 Q1472 282 1398 254Z','#c5ad76',ink,2);ellipse(1473,255,74,13,'#ead8a7',ink,1);const glow=x.createRadialGradient(1473,256,5,1473,280,280);glow.addColorStop(0,'rgba(255,227,162,.22)');glow.addColorStop(1,'rgba(255,227,162,0)');rect(1150,100,650,500,glow);
// Cane-backed sofa and printed upholstery.
shadow(1260,703,350,35,.15);path('M1048 465 Q1027 449 1023 486 L1018 692 L1043 711 L1063 502 L1488 502 L1515 716 L1535 695 L1529 478 Q1527 451 1506 466Z','#775e46',ink,3);
path('M1061 464 Q1260 441 1488 468 L1499 600 L1047 600Z','#b5b19a',ink,3);path('M1046 593 L1496 594 L1524 660 L1028 657Z','#b8b09a',ink,3);
x.save();x.clip(new Path2D('M1061 464 Q1260 441 1488 468 L1499 600 L1047 600Z'));for(let i=0;i<9;i++)for(let j=0;j<4;j++){const a=1065+i*56,b=473+j*36;flower(a,b,.9,'#9b786b');line(`M${a} ${b+10}q13 10 20 8`,'#6d897b',1.5)}x.restore();
line('M1267 457 L1266 593 M1036 635 L1511 640','#817b67',2);path('M1082 478 L1160 479 L1148 566 L1065 564Z','#c2c0a6',ink,2);for(let i=0;i<8;i++)line(`M${1076+i*10} 487 l-10 66`,'#979d88',1);
// Floor fan in corner with radial wire cage.
group(1790,505,1,()=>{ellipse(0,182,61,15,'#5a6c67',ink,2);path('M-9 30L-14 179Q0 191 14 179L8 30Z','#71857e',ink,2);ellipse(0,0,75,78,'#7e9390',ink,2);for(let i=0;i<3;i++){x.save();x.rotate(i*2*Math.PI/3);path('M-8 0 Q-62 -17 -51 -52 Q-25 -73 -3 -24Z','#577b79',ink,1);x.restore()}for(let r=15;r<75;r+=13)ellipse(0,0,r,r*1.04,null,'#aebbb0',1);for(let i=0;i<18;i++){const a=i*Math.PI/9;line(`M0 0L${Math.cos(a)*75} ${Math.sin(a)*78}`,'#aebbb0',1)}ellipse(0,0,13,13,'#c2c8b5',ink,1.5)});
// Left low sideboard and old familiar domestic objects.
path('M27 681 L278 627 L372 678 L110 746Z','#997a57',ink,2);path('M110 746 L372 678 V863 L110 955Z','#74614d',ink,3);path('M27 681 L110 746 V955 L27 878Z','#675e4e',ink,3);path('M127 760 L350 704 V775 L127 840Z','#b09a76',ink,2);path('M127 855 L350 790 V849 L127 926Z','#8c7d61',ink,2);line('M235 744 V802 M234 825 V888','#5c5d50',2);ellipse(220,784,3,6,'#d8c69c');ellipse(250,777,3,6,'#d8c69c');
// Potted plant on cabinet.
path('M200 659 L245 652 L239 700 Q221 710 205 700Z','#a47352',ink,2);ellipse(222,656,24,8,'#706e51',ink,1);for(let i=0;i<7;i++){const a=222+(i-3)*12,b=569+(i%3)*25;line(`M222 660Q${a-6} ${b+45} ${a} ${b}`,'#627b59',2);path(`M${a} ${b+21}Q${a-28} ${b-4} ${a-9} ${b-19}Q${a+13} ${b-17} ${a} ${b+21}Z`,i%2?'#68836a':'#8b9e70',ink,1)}
// A woven family rug, deep perspective and stitched border.
path('M490 731 L1370 713 L1690 1015 L204 1037Z','#7f7463',ink,2);path('M500 746 L1362 729 L1650 1000 L242 1020Z','#a66d55','#c8b086',3);path('M516 765 L1348 748 L1603 982 L286 1002Z','#c2ad83','#766f5a',3);path('M535 783 L1335 765 L1562 966 L327 984Z','#9caa91','#866f53',2);
for(let i=0;i<32;i++){line(`M${255+i*43} 1017 l-15 16`,'#d2c49f',2);line(`M${510+i*26} 746 l8 13`,'#dbc399',2)}
for(let i=0;i<11;i++)line(`M${365+i*101} 981 L${550+i*71} 783`,'rgba(69,94,82,.17)',1);
for(let i=0;i<13;i++)line(`M${329+i*17} ${980-i*15} L${1560-i*17} ${964-i*15}`,'rgba(80,101,82,.18)',1);
}
// Heads use layered, asymmetrical facial contours, brows, eyelids and directed pupils.
function eye(a,b,look=1){path(`M${a-12} ${b}Q${a} ${b-9} ${a+13} ${b}Q${a+1} ${b+6} ${a-12} ${b}Z`,'#dfd7bc','#554a3e',1.5);ellipse(a+look*3,b-1,4.4,5,'#3d443f');ellipse(a+look*3+1,b-3,1.2,1.2,'#e6d9b9');line(`M${a-12} ${b-2}Q${a} ${b-10} ${a+13} ${b-1}`,'#48443a',2)}
function face(who){const male=who==='father',mom=who==='mother',skin=male?'#bc8c66':mom?'#c99a73':'#d6ad84';
// neck, lit plane and collarbone
path('M-26 81 L-29 120 Q-1 142 34 118 L22 75Z',skin,ink,2);path('M-25 85 Q0 111 26 87 L29 112 Q7 124 -27 105Z','#ad7e59',null);
if(!male){ellipse(-43,20,26,34,'#3c3d37',ink,2);if(!mom)path('M-44 0 Q-99 7 -83 72 Q-74 113 -59 141 Q-37 120 -50 80 Q-65 50 -33 33Z','#40443b',ink,2)}
path('M-48 -9 Q-54 -51 -13 -57 Q35 -62 50 -26 L47 32 Q46 62 25 84 Q9 98 -12 84 Q-37 73 -44 42 L-49 21Z',grad(-50,0,60,30,[[0,male?'#ae7c59':'#bb8c67'],[.45,skin],[1,male?'#d3a078':'#e0b38a']]),ink,2.4);
ellipse(-46,23,10,17,skin,ink,1.8);line('M-47 13Q-55 27 -43 30M-48 19l5 7','#8b634d',1.4);
path('M-48 16 Q-58 -10 -49 -36 Q-32 -65 7 -62 Q44 -62 51 -32 Q58 -14 47 5 Q32 -3 28 -30 Q5 -9 -27 -14 Q-34 0 -35 23 L-45 31Z',male?'#444740':'#363b34',ink,2);
if(male){for(let i=0;i<7;i++)line(`M${-40+i*10} -31 Q${-18+i*8} -53 ${3+i*6} -40`,'#7a7b67',1.6);path('M-40 -7 L-37 31 L-44 32 L-49 0Z','#797b68',null)}else{line('M-35 -25 Q-8 -50 20 -48 M-43 -15Q-12 -40 17 -43','#68705c',1.3);if(mom){ellipse(-58,-7,20,24,'#394137',ink,2);line('M-64 -20Q-47 -15 -54 8','#73785f',1.5)}}
// Soft illustrated facial modelling, with warm cheek planes and cool under-chin shadows.
path('M-34 29 Q-30 55 -8 66 Q-22 66 -35 54Z','rgba(118,71,48,.17)',null);
path('M-29 -6Q-18 -15 -5 -13L-9 5Q-17 2 -27 7Z','rgba(250,220,172,.18)',null);
path('M19 29Q31 24 40 30Q35 43 23 43Z','rgba(242,198,147,.26)',null);
line('M-28 45q8 3 13 2 M23 49l8 -3','#b18663',.85);
// Forehead planes and cheek shading.
path('M34 9 Q49 34 37 61 Q26 78 12 80 Q37 79 44 50Z','#af805e',null);
line('M-27 6Q-15 0 -3 7 M17 6Q29 0 39 8',male?'#48453a':'#4b4438',male?3.5:2.6);
eye(-16,20,male?1:-1);eye(28,20,male?1:-1);
line('M9 17 Q8 34 5 42 Q12 46 19 42 M8 45l-4 3','#8c644c',1.6);
if(male){path('M-4 53 Q7 44 13 51 Q25 47 32 57 Q20 60 13 56 Q6 61 -4 58Z','#4b4337',null);line('M2 66 Q15 71 27 64','#75503c',1.6);line('M-29 40l7 5 M32 41l7 -5 M-22 75Q-4 83 7 81','#9b7052',1);}
else{path('M-1 58 Q10 54 14 58 Q22 56 29 55 Q18 68 5 64Z','#a36752','#80553f',1);line('M2 59Q15 63 26 57','#f0c5a2',1);ellipse(-43,46,5,7,'#c8a85f','#765f3e',1);ellipse(44,45,4,6,'#c8a85f','#765f3e',1);if(mom)ellipse(9,0,3.2,4.3,'#9d503e');}
if(male){path('M-32 12Q-19 8 -4 13L-5 32Q-17 38 -31 30Z',null,'#4e5146',2);path('M17 12Q30 8 43 14L41 31Q29 36 18 29Z',null,'#4e5146',2);line('M-4 17Q8 11 17 17 M-33 17L-46 12','#4e5146',2)}
}
function father(){group(535,468,1.16,()=>{
shadow(8,325,178,36,.18);
// Crossed trousers: separate thigh, shin, exposed foot.
path('M-93 199 Q-159 207 -171 264 Q-178 290 -126 309 L47 340 Q86 336 97 306 Q93 280 48 267 L-4 234Z','#637b7c',ink,2.5);
path('M60 209 Q121 210 159 251 Q188 275 158 306 Q117 335 -72 337 Q-110 330 -106 307 Q-101 283 -53 273 L42 262Z','#7b8f8a',ink,2.5);
path('M-132 253Q-99 281 -41 296 M-148 270Q-115 292 -46 307 M75 244Q54 269 16 279 M119 266Q78 302 -58 316 M-64 327Q5 319 72 311',null,'#4c6568',2);
path('M-70 315 Q-112 309 -123 319 Q-136 329 -127 339 Q-109 349 -64 346 L-28 339Z','#bf936b',ink,2);line('M-121 329l28 3 M-120 335l25 3','#8a684e',1);
// Shirt, collar, rolled sleeves and fabric structure.
path('M-35 103 Q-91 103 -110 142 L-109 216 L-74 246 Q10 271 85 240 L93 164 Q85 125 30 105 L0 127Z',grad(-100,120,90,260,[[0,'#a6b1a0'],[.55,'#c6c9ae'],[1,'#93a394']]),ink,2.5);
path('M-33 101L1 124L-9 157L-41 124Z M29 102L1 124L20 149L43 119Z','#d5d1b3',ink,1.7);line('M1 128Q11 192 4 255','#748c81',2);for(let i=0;i<4;i++)ellipse(8,160+i*23,2.3,2.5,'#626f62');
path('M-80 140Q-65 170 -73 229 M-52 170Q-40 209 -20 236 M33 174L25 228 M-57 239Q-18 252 4 246 M40 243l31 -5',null,'#83988b',1.5);
path('M40 151L74 157L70 190Q54 198 39 188Z','#a8b5a3',ink,1.4);line('M45 157l24 4','#d5d6bb',1.2);
path('M-74 153Q-69 205 -52 239L-71 246L-88 205Z','rgba(53,81,72,.14)',null);
path('M13 163L25 236L6 247Z','rgba(77,101,81,.12)',null);
path('M-49 121Q-65 137 -65 152L-54 158L-34 133Z','rgba(255,240,197,.15)',null);
line('M-60 194l14 26 M-58 200l7 18 M20 221l5 16 M40 238l16 -9 M43 243l15 -8','#879b87',.8);
// Right forearm reaches the meal; hand has fingers and a clear wrist.
path('M73 168 Q99 174 105 194 L115 239 L145 260 Q155 273 142 280 Q127 278 105 267 Q89 256 84 239 L66 196Z','#c09169',ink,2);
path('M129 257Q145 251 155 259L176 269Q183 273 178 277L151 270 M146 267L174 280Q180 285 173 288L145 278 M140 273L166 287Q170 293 162 293L137 281 M135 276L153 290Q155 296 147 295L125 281Z','#c99c73',ink,1.6);
path('M66 148Q84 150 100 171L96 199L68 202L58 176Z','#b9c3ab',ink,2);path('M66 187L98 188L97 202L67 202Z','#d1cfb2',ink,1.5);
// Resting arm on knee.
path('M-106 174Q-117 210 -102 241L-80 268Q-64 276 -54 269Q-50 261 -62 253L-78 232L-80 184Z','#c49a74',ink,2);path('M-112 158L-80 161L-75 191L-110 190Z','#cdd0b4',ink,1.8);line('M-85 251l15 11 M-79 249l16 10 M-73 247l15 10','#8e6d51',1);
group(-7,18,1,()=>{x.rotate(.065);face('father')});
});}
function mother(){group(945,434,1.20,()=>{
shadow(5,355,158,35,.17);
// Sari seated cross-legged, fabric follows knees.
path('M-73 218Q-157 245 -161 306Q-159 335 -102 349L29 370Q118 367 139 333Q153 303 107 275L61 230Z',grad(-130,230,140,360,[[0,'#b57c5c'],[.4,'#c48b65'],[1,'#926750']]),ink,2.6);
path('M-112 273Q-62 302 79 340 M-134 293Q-72 323 61 351 M-119 317Q-54 336 -12 337 M78 264Q49 292 15 303 M112 290Q79 313 41 316',null,'#805e4b',2);
path('M-145 315Q-52 360 117 335L111 351Q12 392 -127 339Z','#cab27a',ink,1.6);line('M-136 326Q-26 371 115 344','#607d73',4);
// Blouse and wrap with diagonal woven border.
path('M-29 105Q-86 99 -106 151L-89 215L-57 243L73 238L92 156Q76 115 28 105Z','#5b7b72',ink,2.4);
path('M-21 110Q-20 141 13 149Q36 141 33 109',null,'#d1b175',3);
path('M-57 110L-21 106Q-11 167 73 211L79 250Q20 254 -67 215L-77 166Z','#b88361',ink,2.2);
path('M-62 108L-45 110Q-37 168 76 226L77 243Q-35 208 -76 142Z','#d1b27b',ink,1.5);line('M-56 112Q-41 170 77 234','#608277',5);
for(let i=0;i<9;i++){const yy=130+i*10,xx=-52+i*11;line(`M${xx} ${yy}l-5 9`,'#ab8158',1)}
line('M-48 163Q-17 195 32 213 M-58 190Q-24 218 25 232 M12 153Q29 172 45 181 M-36 231l-7 24','#815c48',1.7);
path('M-138 302Q-53 320 80 338L98 344Q-10 365 -113 336Z','rgba(91,65,45,.14)',null);
path('M-69 156Q-34 203 47 230L23 229Q-45 210 -72 184Z','rgba(99,63,41,.16)',null);
path('M-106 263Q-53 283 -18 292L-43 293Q-97 278 -121 280Z','rgba(245,202,144,.18)',null);
for(let i=0;i<8;i++)line(`M${-104+i*9} ${289+i*3}q24 11 43 13`,'rgba(103,70,47,.22)',.8);
// Repeated but small woven motifs on fabric.
for(const [a,b]of [[-16,183],[-44,204],[28,225],[-65,281],[-26,309],[78,318]])flower(a,b,.32,'#d6b586');
// Left arm and fingers resting on lap.
path('M-103 154Q-115 197 -97 230Q-76 256 -38 270L-28 252L-72 218L-77 169Z','#c69770',ink,2.2);path('M-107 158L-79 169L-84 185L-110 176Z','#d2ad70',ink,1);line('M-80 227l11 -10 M-76 231l11 -10','#dec17d',3);
path('M-40 249Q-22 244 -7 254L20 265Q24 271 18 273L-9 265 M-16 265L14 277Q19 284 11 283L-22 273 M-25 272L1 284Q4 291 -4 289L-35 277Q-44 271 -40 249Z','#cda17b',ink,1.5);
// Raised forearm supports phone; thumb wraps around edge, not floating.
path('M78 153Q101 162 98 195L96 225Q95 238 106 234L128 192L146 195Q139 231 120 257Q110 273 91 258Q67 239 66 210L58 171Z','#cda079',ink,2.2);
path('M64 148Q85 145 99 163L100 183L74 191L57 173Z','#729083',ink,2);line('M124 204l17 5 M121 211l17 5','#d6b369',4);
// Phone, clearly contemporary but modest, held up for the family.
x.save();x.translate(142,167);x.rotate(.14);path('M-18 -43Q-18 -49 -12 -49L23 -49Q29 -49 29 -43L29 33Q29 39 23 39L-12 39Q-18 39 -18 33Z','#354c4c',ink,2);rect(-13,-38,37,63,'#b8c9bb');rect(-5,-45,13,2,'#8c9f96');for(let i=0;i<5;i++)rect(-8,-27+i*10,27-i%2*8,4,i%2?'#7b9e92':'#e3e7d1');ellipse(5,32,3,3,'#8ea598');x.restore();
path('M129 197Q128 183 134 175Q140 172 144 181L142 193L143 205Q137 212 130 205Z','#d4aa83',ink,1.6);line('M137 177l3 9','#e1bd94',1);
group(-3,17,1,()=>{x.rotate(-.045);face('mother')});
});}
function daughter(){group(1373,493,1.14,()=>{
shadow(5,330,165,35,.17);
// Bent legs and folded kurta; natural asymmetric seated silhouette.
path('M-64 211Q-131 237 -147 287Q-155 312 -100 331L64 356Q117 347 132 322Q143 293 106 273L61 227Z','#566e79',ink,2.5);
path('M-112 276Q-53 288 46 329 M-124 291Q-80 319 16 333 M74 263Q54 287 13 296 M97 282L56 307',null,'#3d5664',2);
path('M-45 321Q-81 316 -99 325Q-111 337 -93 345L-44 352L-9 344Z','#d4ac86',ink,2);line('M-95 331l28 6 M-95 337l25 6','#a07d5c',1);
// Mustard kurta with placket, sleeve cuffs and floral stitch marks.
path('M-32 105Q-88 107 -101 145L-89 235Q-11 276 90 238L89 155Q76 120 30 107Z',grad(-80,130,90,250,[[0,'#be9f62'],[.4,'#d2b87c'],[1,'#a68b59']]),ink,2.4);
path('M-23 107Q-14 132 4 139Q24 131 30 108L16 106Q5 124 -9 106Z','#d9c18c',ink,1.4);path('M3 139L14 140L14 206L3 204Z','#b58d58',ink,1.4);for(let j=0;j<4;j++)ellipse(9,151+j*15,2,2,'#e1d0a5');
line('M-70 149Q-60 191 -63 231 M-46 172L-30 236 M37 166Q26 204 30 243 M62 200L73 238 M-68 237Q-21 251 6 249','#a88a53',1.5);
for(const [a,b]of [[-48,158],[46,151],[-26,217],[56,218]])flower(a,b,.24,'#e7d3a1');
path('M-75 172Q-60 219 -35 246L-61 242L-84 216Z','rgba(119,91,45,.17)',null);
path('M27 146L39 219L27 241L17 205Z','rgba(255,229,168,.15)',null);
for(let i=0;i<5;i++)line(`M${45+i*5} ${217+i*3}l13 17`,'rgba(111,88,49,.25)',.8);
// Hand reaching toward mother, open relaxed palm; a conversational gesture.
path('M-95 157Q-112 180 -114 216L-149 222L-151 239Q-107 249 -92 236Q-81 226 -76 182Z','#d5aa7e',ink,2);path('M-99 147L-75 154L-78 183L-104 180Z','#d6bd83',ink,1.5);
path('M-149 221Q-165 211 -178 216L-194 225Q-199 231 -193 233L-175 227L-184 235Q-188 241 -181 242L-161 234L-172 244Q-174 250 -167 249L-149 240Q-142 235 -149 221Z','#d9b48b',ink,1.5);
// Other hand rests on the knee.
path('M79 167Q103 182 100 212L91 251L72 274L54 263L71 237L73 189Z','#d8ae84',ink,2);path('M71 148L95 159L102 186L75 193L61 176Z','#c6ab70',ink,2);path('M71 255Q54 254 44 269L36 284Q37 290 43 286L57 274L49 290Q49 297 55 292L65 279L61 294Q63 299 68 292L79 274Z','#dcb78d',ink,1.5);
group(1,24,1,()=>{x.rotate(-.11);face('daughter')});
});}
function plate(a,b,s){group(a,b,s,()=>{shadow(0,9,96,26,.2);ellipse(0,0,94,31,grad(-90,-30,90,30,[[0,'#859a99'],[.2,'#d7ded0'],[.5,'#a9b9af'],[.8,'#d9dfcd'],[1,'#7a9390']]),ink,1.7);ellipse(0,-1,84,25,'#bfc9b5','#798d85',1);ellipse(-25,-4,37,17,'#c6a26a','#826b49',1);ellipse(-26,-7,35,16,'#d7b67b','#aa895b',1);const r=mulberry(23);for(let i=0;i<25;i++)ellipse(-51+r()*50,-17+r()*19,1.6+r()*2,1,'#b18b54');ellipse(45,-6,23,12,'#d2d9c4','#617e79',1.2);ellipse(45,-8,19,9,'#b39548');for(let i=0;i<9;i++)ellipse(33+r()*23,-13+r()*9,1.4,1,'#74763a');ellipse(10,11,15,6,'#829967');ellipse(15,10,8,4,'#b09269')})}
function glass(a,b,s=1){group(a,b,s,()=>{shadow(0,6,16,5);path('M-16 -45L-12 1Q0 10 12 1L16 -45Z',grad(-16,0,16,0,[[0,'#718b8c'],[.28,'#e2e6d6'],[.5,'#a3b8b2'],[.8,'#c7d2c1'],[1,'#5d7c7e']]),ink,1.4);ellipse(0,-45,16,5,'#b8c8be',ink,1.4);ellipse(0,-44,12,3,'#79958f');line('M-10 -38L-8 -1','#e1e3cc',2)})}
function food(){plate(547,922,1.06);plate(953,925,.95);plate(1371,943,1.05);glass(689,909,1);glass(1080,894,.9);glass(1516,948,1.05);
// Shared steel serving bowls, folded cloth, ladle.
group(791,1001,1,()=>{shadow(0,9,72,20);path('M-68 -23Q-58 16 0 18Q59 14 67 -23Z','#98aca3',ink,2);ellipse(0,-23,68,23,'#ccd5c1',ink,2);ellipse(0,-23,59,17,'#b5aa66');const r=mulberry(19);for(let i=0;i<30;i++)ellipse(-45+r()*90,-34+r()*19,2,1.3,i%3?'#8b8b4b':'#d5c883');line('M30 -20L88 -69','#e0e0c9',7);line('M30 -20L88 -69','#6d8782',1.4)});
path('M1104 999L1191 985L1230 1017L1143 1036Z','#ddd1b1',ink,1.5);for(let i=0;i<5;i++)line(`M${1115+i*17} ${1002-i*2}l34 23`,'#8b9c8d',2);
// A small lidded casserole at the edge of the mat.
ellipse(1023,1019,52,16,'#7d9388',ink,2);path('M972 1000L979 1021Q1023 1046 1068 1021L1074 1000Z','#c3ccb7',ink,1.5);ellipse(1023,999,52,17,'#d8dbc1',ink,1.5);ellipse(1023,994,42,13,'#a4b7a8',ink,1.2);ellipse(1023,986,12,5,'#677e74',ink,1.4);
}
function finish(){
// Restrained cool/window and warm/lamp light keep the skin palette readable.
const warm=x.createRadialGradient(1110,605,30,1110,605,660);warm.addColorStop(0,'rgba(255,212,139,.07)');warm.addColorStop(1,'rgba(255,212,139,0)');rect(400,0,1500,1080,warm);
// Fine deterministic pigment tooth across the drawing, not a heavy texture overlay.
const r=mulberry(234);for(let i=0;i<28000;i++){x.fillStyle=i%2?'rgba(40,55,50,.023)':'rgba(255,247,217,.035)';const a=r()*1920,b=r()*1080;x.fillRect(a,b,.5+r()*1.7,.5+r()*1.4)}
const v=x.createRadialGradient(1000,570,250,1000,570,1200);v.addColorStop(0,'rgba(32,47,45,0)');v.addColorStop(1,'rgba(26,43,45,.13)');rect(0,0,1920,1080,v);
}
window.DUR=1;window.render=t=>{x.clearRect(0,0,1920,1080);background();father();mother();daughter();food();finish()};window.render(0);window.READY=true;
