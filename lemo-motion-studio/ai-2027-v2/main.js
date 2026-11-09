import * as T from 'three';
import {makePost} from './post.js';
const W=innerWidth,H=innerHeight,Q=new URLSearchParams(location.search);window.DUR=+(Q.get('duration')||40);window.READY=false;
const R=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});R.setSize(W,H);R.toneMapping=T.NeutralToneMapping;R.toneMappingExposure=1.05;document.body.prepend(R.domElement);
const S=new T.Scene(),C=new T.OrthographicCamera(-4,4,7,-7,.1,180);S.add(new T.HemisphereLight('#fff7ea','#b5a6bb',2.1));const sun=new T.DirectionalLight('#fff3d5',3.4);sun.position.set(-6,10,5);S.add(sun);
const post=makePost(R,S,C,W,H,{ssaa:1,aoRadius:.3,aoScale:1.1,aoThickness:.4});post.bloom.strength=.07;post.grade.vig.value=0;post.grade.sat.value=1.03;post.tilt.maxR.value=1.2;post.comp.zen.value.set('#fffaf4');post.comp.hor.value.set('#f3d7c9');post.comp.hz0.value=40;post.comp.hz1.value=70;
const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.92,flatShading:true});const ivory=mat('#fff4dd'),teal=mat('#75b6b0'),deep=mat('#426c75'),lilac=mat('#b6a4d4'),purple=mat('#7d679b'),coral=mat('#e9a58d'),amber=mat('#efba65'),white=mat('#fffdf4');
const root=new T.Group();S.add(root);const growth=[],rotors=[],tiny=[];
function mesh(g,geo,m,x=0,y=0,z=0){let o=new T.Mesh(geo,m);o.position.set(x,y,z);g.add(o);return o}
function box(g,x,y,z,m,px=0,py=0,pz=0){return mesh(g,new T.BoxGeometry(x,y,z),m,px,py,pz)}
function cyl(g,r,h,m,x=0,y=0,z=0,n=6){return mesh(g,new T.CylinderGeometry(r,r,h,n),m,x,y,z)}
function group(g,x=0,y=0,z=0){let o=new T.Group();o.position.set(x,y,z);g.add(o);return o}
function born(o,t,kind='scale'){growth.push({o,t,kind,y:o.position.y});return o}
function line(g,a,b,m,r=.025){let A=new T.Vector3(...a),B=new T.Vector3(...b),o=mesh(g,new T.CylinderGeometry(r,r,A.distanceTo(B),6),m);o.position.copy(A.clone().add(B).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),B.sub(A).normalize());return o}
function tree(g,x,z,at){let p=born(group(g,x,0,z),at);cyl(p,.045,.28,coral,0,.14,0);mesh(p,new T.IcosahedronGeometry(.20,0),teal,0,.39,0)}
// Hexagonal ground grows in a measured outward wave.
let ti=0;for(let q=-3;q<=3;q++)for(let r=-3;r<=3;r++){if(Math.abs(q+r)>3)continue;let x=Math.sqrt(3)*(q+r/2)*.58,z=1.5*r*.58;let g=group(root,x,-.2,z),h=.32+((q*q+r*r)%3)*.06;born(g,.125*(ti++%14),'rise');cyl(g,.565,h,[(ivory),(coral),(lilac)][Math.abs(q+r)%3],0,-h/2,0);cyl(g,.56,.075,ivory,0,.015,0)}
// Central intelligence hub: layered low-poly mechanism.
const hub=born(group(root,0,-.13,0),1.4);cyl(hub,.72,.18,purple,0,.09);cyl(hub,.59,.2,lilac,0,.27);const hubTop=born(cyl(hub,.49,.23,ivory,0,.49),1.9);const gem=mesh(hub,new T.IcosahedronGeometry(.32,0),amber,0,.86);rotors.push(gem);
for(let i=0;i<6;i++){let a=i*Math.PI/3;box(hub,.08,.08,.15,amber,Math.cos(a)*.67,.25,Math.sin(a)*.67)}
// Workstations: input, tool execution, reviewed result.
const agents=group(root,-1.75,-.13,0);const stations=[];for(let i=0;i<3;i++){let g=born(group(agents,0,0,(i-1)*.8),6.1+i*.5);stations.push(g);box(g,.82,.14,.63,teal,0,.07);box(g,.13,.45,.08,deep,0,.32,-.17);let screen=box(g,.61,.40,.08,white,0,.58,-.17);for(let j=0;j<3;j++)box(g,.34-j*.05,.027,.018,i===2?teal:purple,-.04,.68-j*.09,-.12);box(g,.36,.035,.19,ivory,0,.16,.08)}
const docs=[];for(let i=0;i<3;i++){let d=box(agents,.23,.035,.30,amber,0,.27,0);docs.push(d)}
// Three modalities combine in a small physical studio.
const senses=group(root,1.7,-.13,-.1);const senseBase=born(cyl(senses,.92,.13,lilac),14);const modules=[];for(let i=0;i<3;i++){let a=i*2*Math.PI/3;let p=born(group(senses,Math.cos(a)*.56,.07,Math.sin(a)*.56),14.25+i*.375);modules.push(p);cyl(p,.28,.10,white,0,.05);}
box(modules[0],.35,.48,.06,teal,0,.32);for(let i=0;i<3;i++)box(modules[0],.22-i*.03,.035,.02,white,0,.46-i*.11,.04);
cyl(modules[1],.085,.38,purple,0,.34,0,10);mesh(modules[1],new T.IcosahedronGeometry(.14,1),coral,0,.55);line(modules[1],[-.15,.38,0],[-.15,.2,0],teal);line(modules[1],[.15,.38,0],[.15,.2,0],teal);line(modules[1],[-.15,.2,0],[.15,.2,0],teal);
box(modules[2],.43,.29,.22,coral,0,.28);let lens=cyl(modules[2],.12,.10,purple,0,.29,.16,12);lens.rotation.x=Math.PI/2;
const fusion=mesh(senses,new T.OctahedronGeometry(.18),amber,0,.60,0);
// A city testbed grows from discrete simulation cells.
const city=group(root,0,-.12,-1.9);const cityBlocks=[];for(let x=-1;x<=1;x++)for(let z=-1;z<=1;z++){let i=(x+1)*3+z+1,p=born(group(city,x*.55,0,z*.55),22+i*.125);box(p,.50,.08,.50,lilac,0,.04);if(x!==0){let h=.28+((i*3)%5)*.13;box(p,.30,h,.30,i%2?teal:ivory,0,.08+h/2);let roof=cyl(p,.24,.13,i%2?deep:coral,0,h+.15,0,4);roof.rotation.y=Math.PI/4;for(let j=0;j<3;j++)box(p,.15,.035,.012,amber,0,.17+j*.12,.158)}else box(p,.06,.012,.25,amber,0,.09);cityBlocks.push(p)}
const car=box(city,.17,.12,.27,coral,0,.18,0);const scanner=box(city,1.65,.025,.035,amber,0,1.05,0);
// Oversight as a process: a barrier waits, then opens for a reviewed package.
const gate=born(group(root,0,-.13,1.9),30);box(gate,1.7,.10,1.05,lilac,0,.05);box(gate,.14,.82,.14,teal,-.53,.46);box(gate,.14,.82,.14,teal,.53,.46);box(gate,1.22,.15,.19,teal,0,.92);let gateArm=group(gate,-.47,.53,.1);box(gate,.12,.2,.12,purple,-.48,.2,.15);box(gateArm,.94,.06,.08,coral,.47,0,0);const parcel=box(gate,.25,.25,.25,amber,0,.23,.5);const stamp=group(gate,.35,1.12,0);line(stamp,[-.16,0,0],[-.03,-.12,0],deep,.04);line(stamp,[-.03,-.12,0],[.22,.19,0],deep,.04);
// Small landscaping establishes scale without visual clutter.
[[-2.1,-1.5],[-1.5,1.8],[1.6,1.7],[1.7,-1.9],[-.8,-2.7],[2.5,.7]].forEach(([x,z],i)=>tree(root,x,z,2.2+i*.125));
const routes=[];for(let i=0;i<4;i++){let a=i*Math.PI/2;for(let j=0;j<5;j++){let d=.8+j*.15;let m=box(root,.09,.025,.09,amber,Math.cos(a)*d,-.05,Math.sin(a)*d);routes.push(m)}}
const chapters=[{t:0,k:'A WORLD TAKING SHAPE',title:['State of AI','in 2027'],d:'A forward-looking outlook.',p:[0,0,0],h:13.3},{t:6,k:'01 / AGENTIC SYSTEMS',title:['From answers','to actions.'],d:'Plan. Use tools. Review the result.',p:[-1.45,0,0],h:12.8},{t:14,k:'02 / MULTIMODAL AI',title:['One system.','More senses.'],d:'Text, voice and vision converge.',p:[1.45,0,-.1],h:12.8},{t:22,k:'03 / WORLD MODELS',title:['Simulate first.','Deploy next.'],d:'Virtual environments for testing agents.',p:[0,0,-1.65],h:13.2},{t:30,k:'04 / TRUST BY DESIGN',title:['Capability','needs control.'],d:'Permissions. Evaluation. Human oversight.',p:[0,0,1.65],h:13.0}];
const $=s=>document.getElementById(s),clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x)},pop=x=>x<=0?.001:1-Math.exp(-7*x)*Math.cos(10*x);let last=-1;
window.render=t=>{t+=+(Q.get('start')||0);if(t>=36){$('end').style.display='flex';$('copy').style.display='none';R.domElement.style.display='none';return}R.domElement.style.display='block';$('copy').style.display='block';$('end').style.display='none';let n=chapters.findLastIndex(s=>t>=s.t),s=chapters[n],u=t-s.t;
if(last!==n){$('title').innerHTML=s.title.map(row=>'<span class="line">'+[...row].map(c=>'<i>'+c+'</i>').join('')+'</span>').join('');$('kicker').textContent=s.k;$('deck').textContent=s.d;last=n}document.querySelectorAll('#title i').forEach((e,i)=>{let v=smooth((u-i*.016)/.5);e.style.transform=`translateY(${(1-v)*110}%)`});$('deck').style.opacity=smooth((u-.3)/.4);
for(const {o,t:at,kind,y} of growth){let a=t-at;if(kind==='rise'){o.position.y=y-(1-smooth(a/.5))*.75;o.scale.setScalar(Math.max(.001,smooth(a/.35)))}else o.scale.setScalar(Math.max(.001,pop(a)));}
gem.rotation.y=t*.45;gem.rotation.z=.13*Math.sin(t);hubTop.rotation.y=t*.12;fusion.rotation.y=t*.9;fusion.position.y=.62+Math.sin(t*2)*.06;
docs.forEach((d,i)=>{d.visible=t>=6.5;let a=((t-6.5+i*.65)%2.8+2.8)%2.8;d.position.z=.8-a/2.8*1.6;d.position.x=.12*Math.sin(a*2)});
car.visible=t>=22;scanner.visible=t>=22;car.position.z=-.6+((t*.22)%1.2);scanner.position.z=-.7+((t*.25)%1.4);gateArm.rotation.z=smooth((t-32)/.7)*1.1;parcel.position.z=.52-smooth((t-32.7)/1.8)*1.05;stamp.scale.setScalar(smooth((t-31.3)/.5));routes.forEach((r,i)=>r.scale.y=1+.8*Math.sin(t*3-i*.4));
let prev=chapters[Math.max(0,n-1)],mix=n?smooth(u/.85):1;let target=new T.Vector3().fromArray(prev.p).lerp(new T.Vector3().fromArray(s.p),mix);let h=prev.h+(s.h-prev.h)*mix;if(n===0)h=11.5+1.8*smooth(t/4);const angle=.65+t*.035,elev=n===3?.95:.72,dist=45;C.left=-h*W/H/2;C.right=h*W/H/2;C.top=h/2;C.bottom=-h/2;C.updateProjectionMatrix();target.x*=.2;target.z*=.2;target.y=1.15;C.position.set(target.x+Math.cos(angle)*Math.cos(elev)*dist,target.y+Math.sin(elev)*dist,target.z+Math.sin(angle)*Math.cos(elev)*dist);C.lookAt(target);post.comp.camDist.value=dist;post.comp.time.value=t;post.composer.render();};
await Promise.all([document.fonts.ready,document.querySelector('#end img').decode()]);window.render(0);window.READY=true;
