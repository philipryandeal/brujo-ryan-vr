import * as THREE from 'three';
import {VRButton} from 'three/addons/webxr/VRButton.js';
import {openStory, openNotices, registerWorldStart} from './story-ui.js';

const stage=document.getElementById('stage');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x0d281c);scene.fog=new THREE.FogExp2(0x0d281c,.017);
const camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,.1,160);camera.position.set(0,1.65,10);camera.lookAt(0,2,-10);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.xr.enabled=true;
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
stage.appendChild(renderer.domElement);renderer.shadowMap.enabled=false;
const V={dark:0x123b29,stone:0x29563b,hedge:0x17472c,light:0xb9f3a4,orange:0xff6900,deep:0x071b15};
const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,...extra});
const stone=mat(V.stone,{roughness:.95}),dark=mat(V.dark),hedge=mat(V.hedge),orange=mat(V.orange,{emissive:V.orange,emissiveIntensity:1.2}),light=mat(V.light,{emissive:0x5da44b,emissiveIntensity:.4}),black=mat(V.deep);
scene.add(new THREE.HemisphereLight(V.light,0x07221a,2.3));const moon=new THREE.DirectionalLight(0xb9f3a4,2);moon.position.set(-9,19,4);scene.add(moon);
const torch=new THREE.PointLight(V.orange,70,29);torch.position.set(0,5,-9);scene.add(torch);
function box(x,y,z,w,h,d,m){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);scene.add(o);return o}
function orb(x,y,z,r,m){const o=new THREE.Mesh(new THREE.SphereGeometry(r,12,10),m);o.position.set(x,y,z);scene.add(o);return o}
function cone(x,y,z,r,h,m){const o=new THREE.Mesh(new THREE.ConeGeometry(r,h,7),m);o.position.set(x,y,z);scene.add(o);return o}
function tube(x,y,z,r,h,m){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,8),m);o.position.set(x,y,z);scene.add(o);return o}
box(0,-.22,-10,36,.45,55,stone);
for(let i=0;i<17;i++){const z=9-i*2.4;box(-7,2,z,1,4.3,2.1,hedge);box(7,2,z,1,4.3,2.1,hedge);if(i%3===0){cone(-7,5,z,1.3,2.7,light);cone(7,5,z,1.3,2.7,light)}}
for(let i=0;i<12;i++){const z=7-i*2.4;box(-2.5,0.02,z,.18,.04,.9,orange);box(2.5,.02,z,.18,.04,.9,orange)}
// The first gate: closed until future world scenes exist.
box(-4,3.5,-14,2,7.4,2,stone);box(4,3.5,-14,2,7.4,2,stone);box(0,7.2,-14,10,1.5,2,stone);
box(0,8.1,-14,.9,.25,1.2,orange);for(let s of [-1,1]){for(let y=1;y<6.6;y+=1.25){orb(s*4.9,y,-12.8,.18,orange)}}
const gate=box(0,2.6,-13.9,5.9,5.2,.25,black);
for(let x=-2.6;x<3;x+=.95){box(x,2.6,-13.7,.10,5.1,.13,orange)}
box(0,2.3,-13.56,5.8,.16,.2,stone);
orb(0,5.2,-13.35,.6,orange);
const arch=box(0,7.3,-12.7,7,.7,.3,dark);
const greeting=new THREE.Group();scene.add(greeting);
// Goblin booth to the left
box(-5.4,.65,-6.5,2.3,1.3,1.7,dark);box(-5.4,1.5,-6.5,2.7,.28,1.9,stone);
const goblin=new THREE.Group();goblin.position.set(-5.35,1.83,-6.35);scene.add(goblin);
// A physical noticeboard makes goblin bureaucracy part of the scenery.
const noticeCanvas=document.createElement('canvas');noticeCanvas.width=512;noticeCanvas.height=256;
const nc=noticeCanvas.getContext('2d');nc.fillStyle='#123b29';nc.fillRect(0,0,512,256);
nc.strokeStyle='#ff6900';nc.lineWidth=18;nc.strokeRect(12,12,488,232);
nc.fillStyle='#c7f5a7';nc.font='bold 55px Georgia';nc.textAlign='center';
nc.fillText('GOBLIN',256,112);nc.fillText('NOTICES',256,181);
const noticeBoard=new THREE.Mesh(new THREE.PlaneGeometry(2.6,1.3),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(noticeCanvas),side:THREE.DoubleSide}));
noticeBoard.position.set(-3.05,2.7,-6.2);scene.add(noticeBoard);
function part(parent,geo,material,x,y,z){const o=new THREE.Mesh(geo,material);o.position.set(x,y,z);parent.add(o);return o}
part(goblin,new THREE.SphereGeometry(.38,12,8),light,0,.32,0);
part(goblin,new THREE.ConeGeometry(.3,.63,5),dark,0,.84,0);
for(let x of [-.3,.3]){part(goblin,new THREE.ConeGeometry(.17,.48,5),light,x,.38,0);part(goblin,new THREE.SphereGeometry(.075,8,6),black,x/2,.38,.34)}
// Faerie lantern to the right
const faerie=new THREE.Group();faerie.position.set(5,2.5,-6);scene.add(faerie);
part(faerie,new THREE.SphereGeometry(.29,14,9),orange,0,0,0);
for(let s of [-1,1]){const wing=part(faerie,new THREE.SphereGeometry(.36,10,7),mat(V.light,{transparent:true,opacity:.42,side:THREE.DoubleSide}),s*.42,.12,0);wing.scale.set(.7,1.65,.28)}
for(let i=0;i<7;i++){const t=i/7*Math.PI*2;orb(5+Math.sin(t)*1.2,1.2+(i%3)*.7,-6+Math.cos(t)*.7,.12,orange)}
// Distant orange tree beacon, intentionally behind the closed gate
tube(0,1,-23,.36,3.5,stone);cone(0,5.5,-23,2,5,light);orb(0,6,-23,.48,orange);
// Tiny floating sprites
const sprites=[];for(let i=0;i<48;i++){let x=Math.sin(i*31.13)*7,z=-2-(i*13%22),y=1.2+i%5;
const s=orb(x,y,z,.038+(i%3)*.02,i%3===0?orange:light);sprites.push({mesh:s,y,phase:i*.8})}
const residents=[goblin,faerie,gate,noticeBoard];const raycaster=new THREE.Raycaster(),mouse=new THREE.Vector2();
function say(which){openStory(which)}
let yaw=0,pitch=0,dragging=false,lastX=0,lastY=0,moved=false;const canvas=renderer.domElement;
canvas.addEventListener('pointerdown',e=>{dragging=true;moved=false;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!dragging||renderer.xr.isPresenting)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;if(Math.abs(dx)+Math.abs(dy)>2)moved=true;yaw-=dx*.004;pitch=Math.max(-.95,Math.min(.95,pitch-dy*.004));camera.rotation.set(pitch,yaw,0,'YXZ')});
canvas.addEventListener('pointerup',e=>{dragging=false;if(moved||renderer.xr.isPresenting)return;mouse.x=e.clientX/innerWidth*2-1;mouse.y=-(e.clientY/innerHeight)*2+1;raycaster.setFromCamera(mouse,camera);const hits=raycaster.intersectObjects(residents,true);if(hits.length){const item=hits[0].object;if(goblin.children.includes(item))say('goblin');else if(faerie.children.includes(item))say('faerie');else if(item===noticeBoard)openNotices();else say('gate')}});
document.getElementById('reset').onclick=()=>{yaw=0;pitch=0;camera.position.set(0,1.65,10);camera.rotation.set(0,0,0);camera.lookAt(0,2,-10)};
const keys=new Set();
addEventListener('keydown',e=>{
 if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
 const key=e.key.toLowerCase();
 if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key)){keys.add(key);e.preventDefault()}
});
addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
addEventListener('blur',()=>keys.clear());
function walk(dt){
 if(!started||renderer.xr.isPresenting||!document.getElementById('dialogue').hidden)return;
 let forward=Number(keys.has('w')||keys.has('arrowup'))-Number(keys.has('s')||keys.has('arrowdown'));
 let side=Number(keys.has('d')||keys.has('arrowright'))-Number(keys.has('a')||keys.has('arrowleft'));
 const length=Math.hypot(forward,side);if(!length)return;
 forward/=length;side/=length;
 const speed=3.7*dt;
 const dx=(-Math.sin(yaw)*forward+Math.cos(yaw)*side)*speed;
 const dz=(-Math.cos(yaw)*forward-Math.sin(yaw)*side)*speed;
 camera.position.x=THREE.MathUtils.clamp(camera.position.x+dx,-5.9,5.9);
 camera.position.z=THREE.MathUtils.clamp(camera.position.z+dz,-11.3,11.5);
}
let audio=null,soundEnabled=true,started=false;
function makeAudio(){if(audio)return;const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return;const ctx=new AudioContext(),master=ctx.createGain();master.gain.value=.13;master.connect(ctx.destination);audio={ctx,master};}
function snore(){if(!audio||!soundEnabled)return;const {ctx,master}=audio;if(ctx.state==='suspended')ctx.resume();const now=ctx.currentTime;const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sawtooth';osc.frequency.setValueAtTime(56,now);osc.frequency.exponentialRampToValueAtTime(31,now+1.9);gain.gain.setValueAtTime(.001,now);gain.gain.exponentialRampToValueAtTime(.3,now+.5);gain.gain.exponentialRampToValueAtTime(.001,now+2.6);osc.connect(gain).connect(master);osc.start(now);osc.stop(now+2.7);shaking=2.7}
document.getElementById('sound').onclick=()=>{soundEnabled=!soundEnabled;document.getElementById('sound').textContent=soundEnabled?'Sound: On':'Sound: Off';if(soundEnabled)makeAudio()};
registerWorldStart(()=>{started=true;makeAudio();audio?.ctx.resume()});
// No unsupported-VR warning on desktop. Show entry only on compatible headsets.
if(navigator.xr?.isSessionSupported){
 navigator.xr.isSessionSupported('immersive-vr').then(supported=>{
  if(!supported)return;
  const btn=VRButton.createButton(renderer);btn.style.bottom='85px';btn.style.background='#315d36';btn.style.border='1px solid #ff6900';document.body.appendChild(btn);
 }).catch(()=>{});
}
renderer.xr.addEventListener('sessionstart',()=>{const t=document.getElementById('threshold');t.hidden=true;t.style.display='none';document.querySelector('.controls').hidden=true;document.getElementById('hint').hidden=true;started=true;makeAudio()});
renderer.xr.addEventListener('sessionend',()=>{document.querySelector('.controls').hidden=false});
const clock=new THREE.Clock();let elapsed=0,lastSnore=0,shaking=0;
renderer.setAnimationLoop(()=>{const dt=Math.min(clock.getDelta(),.1);elapsed+=dt;walk(dt);
faerie.position.y=2.5+Math.sin(elapsed*1.7)*.22;goblin.rotation.y=Math.sin(elapsed*.65)*.12;
for(const s of sprites)s.mesh.position.y=s.y+Math.sin(elapsed*1.2+s.phase)*.18;
if(started&&elapsed-lastSnore>17){lastSnore=elapsed;snore()}
if(shaking>0){shaking-=dt;if(!renderer.xr.isPresenting){camera.position.y=1.65+Math.sin(elapsed*28)*.035*Math.max(0,shaking)/2.7}}else camera.position.y=1.65;
torch.intensity=60+Math.sin(elapsed*2)*9;
renderer.render(scene,camera)});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});

