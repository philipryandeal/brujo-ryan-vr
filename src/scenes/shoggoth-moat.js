// Scene 007 — The Shoggoth Moat. Kore's characters and weather, Seraph's geometry.
// Wonder, not horror. The sleeper remains beneath the water.
export function makeShoggothMoat(THREE,palette){
 const group=new THREE.Group();
 const mat=(c,o={})=>new THREE.MeshStandardMaterial({color:c,...o});
 const stone=mat(palette.stone),road=mat(palette.road),green=mat(palette.hedge);
 const orange=mat(palette.orange,{emissive:palette.orange,emissiveIntensity:.7});
 const brass=mat(palette.road,{metalness:.55,roughness:.4});
 const light=mat(palette.light,{emissive:palette.light,emissiveIntensity:.7});
 const water=mat(0x476f95,{transparent:true,opacity:.8,roughness:.18,metalness:.25,side:THREE.DoubleSide});
 const shadow=mat(palette.dark,{transparent:true,opacity:.75});
 const add=(g,m,x,y,z,parent=group)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o};
 const box=(x,y,z,w,h,d,m,p)=>add(new THREE.BoxGeometry(w,h,d),m,x,y,z,p);
 const orb=(x,y,z,r,m,p)=>add(new THREE.SphereGeometry(r,12,10),m,x,y,z,p);
 const cyl=(x,y,z,rt,rb,h,m,p)=>add(new THREE.CylinderGeometry(rt,rb,h,10),m,x,y,z,p);
 function sign(lines,w,h,x,y,z,rotation=0){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;
  const c=canvas.getContext('2d');c.fillStyle='#303636';c.fillRect(0,0,512,256);
  c.strokeStyle='#FF5E1F';c.lineWidth=14;c.strokeRect(10,10,492,236);
  c.fillStyle='#ffffff';c.textAlign='center';c.font='bold 33px Georgia';
  lines.forEach((line,i)=>c.fillText(line,256,87+i*52,480));
  const o=add(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(canvas),side:THREE.DoubleSide}),x,y,z);
  o.rotation.y=rotation;return o;
 }
 // Open sky, moonlit water and a long stone bridge oriented toward -Z.
 const lake=add(new THREE.PlaneGeometry(90,100),water,0,-.55,-5);lake.rotation.x=-Math.PI/2;
 const sleeper=orb(4,-2,-11,6.5,shadow);sleeper.scale.set(1.8,.28,2.4);
 const bridge=new THREE.Group();group.add(bridge);
 box(0,-.08,-2,5.5,.5,33,road,bridge);
 for(const x of [-2.6,2.6]){
  for(let i=0;i<12;i++)box(x,1.1,12-i*2.6,.4,2.3,.42,stone,bridge);
  box(x,2.13,-2,.24,.2,32,green,bridge);
 }
 for(let i=0;i<17;i++)box(0,.2,13-i*1.85,5.4,.035,.06,orange,bridge);
 // The night-shift bridge-tender stands to the left, loudly whispering.
 const bram=new THREE.Group();bram.position.set(-1.5,.17,-5);group.add(bram);
 cyl(0,.45,0,.25,.4,.9,green,bram);orb(0,1.08,0,.32,light,bram);
 add(new THREE.ConeGeometry(.42,.72,6),stone,0,1.55,0,bram);
 for(const x of [-.13,.13])orb(x,1.1,.29,.045,stone,bram);
 box(.32,.65,.25,.08,.75,.08,brass,bram);orb(.32,.28,.25,.19,orange,bram);
 // Dream-reading buoy beyond the right-hand railing.
 const buoy=new THREE.Group();buoy.position.set(5.1,0,-8);group.add(buoy);
 cyl(0,-.12,0,.65,.9,1.35,brass,buoy);
 cyl(0,.66,0,.14,.28,.75,orange,buoy);orb(0,1.15,0,.27,light,buoy);
 const dreamSign=sign(['CURRENT DREAM:','SOUP'],3.3,1.35,5.1,2.45,-7.8);
 // Documents go into a purely fictional box. No user inputs or tracking.
 const taxBox=new THREE.Group();taxBox.position.set(1.85,.25,-2);group.add(taxBox);
 box(0,.8,0,1.25,1.4,.85,stone,taxBox);
 box(0,1.55,0,1.4,.18,1.05,orange,taxBox);
 box(0,1.2,.46,.74,.07,.09,brass,taxBox);
 const taxSign=sign(['TAX-EXEMPTION','DROP BOX'],2.6,1.3,1.8,2.85,-2);
 // Distant glowing mushrooms along the banks.
 for(let i=0;i<18;i++){
  const x=(i%2?1:-1)*(8+(i%4)),z=12-i*2.1;
  cyl(x,-.1,z,.1,.1,.65,green);
  add(new THREE.ConeGeometry(.5,.45,7),i%3?light:orange,x,.3,z);
 }
 // Returning home through the real water-gate sits BEHIND the visitor on arrival.
 const exit=new THREE.Group();exit.position.set(0,0,15);group.add(exit);
 box(-2.8,2.45,0,.65,4.9,.65,stone,exit);box(2.8,2.45,0,.65,4.9,.65,stone,exit);
 box(0,5,0,6.1,.7,.65,stone,exit);
 const door=box(0,2.4,.1,4.7,4.7,.22,green,exit);
 const exitSign=sign(['BACK TO THE','RIVER HOUSE'],3.7,1.5,0,6,14.55,0);
 const bubbles=[];
 for(let i=0;i<9;i++){const b=orb(3+(i%3)*.8,-.45,-9-(i%4),.11+(i%3)*.07,light);bubbles.push({mesh:b,phase:i*.7})}
 group.visible=false;
 return {
  group,
  hotspots:{'bridge-tender':[bram],'snoring-buoy':[buoy,dreamSign],'tax-box':[taxBox,taxSign],'moat-return':[door,exitSign]},
  actions:{
   'bridge-tender':{type:'story',id:'bridge-tender'},
   'snoring-buoy':{type:'story',id:'snoring-buoy'},
   'tax-box':{type:'story',id:'tax-box'},
   'moat-return':{type:'travel',destination:'river-house'}
  },
  update(t){
   // Six-second breathing: no startle, no attack.
   bridge.position.y=Math.sin(t*Math.PI/3)*.025;
   buoy.position.y=Math.sin(t*Math.PI/3)*.2;
   sleeper.scale.y=.28+Math.sin(t*Math.PI/3)*.012;
   for(const b of bubbles)b.mesh.position.y=-.5+((t*.18+b.phase)%1)*.7;
  }
 };
}
