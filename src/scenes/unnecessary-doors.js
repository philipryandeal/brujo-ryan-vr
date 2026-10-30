// Scene 005: a tiny municipal department with a magnificent sense of importance.
// All geometry and dialogue are local. The old rooms remain their own.
export function makeUnnecessaryDoors(THREE, palette) {
  const group = new THREE.Group();
  const material = (color, opts={}) => new THREE.MeshStandardMaterial({color,...opts});
  const stone=material(palette.stone), dark=material(palette.dark);
  const orange=material(palette.orange,{emissive:palette.orange,emissiveIntensity:.45});
  const green=material(palette.hedge), road=material(palette.road);
  const paper=material(0xffffff), iron=material(palette.deep,{metalness:.4,roughness:.55});
  const add=(geo,mat,x,y,z,parent=group)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);return m;};
  const box=(x,y,z,w,h,d,mat,parent)=>add(new THREE.BoxGeometry(w,h,d),mat,x,y,z,parent);
  const sphere=(x,y,z,r,mat,parent)=>add(new THREE.SphereGeometry(r,12,9),mat,x,y,z,parent);
  function sign(lines,w,h,x,y,z) {
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;
    const ctx=canvas.getContext('2d');ctx.fillStyle='#303636';ctx.fillRect(0,0,512,256);
    ctx.strokeStyle='#FF5E1F';ctx.lineWidth=16;ctx.strokeRect(10,10,492,236);
    ctx.fillStyle='#FFFFFF';ctx.font='bold 35px Georgia';ctx.textAlign='center';
    lines.forEach((line,i)=>ctx.fillText(line,256,100+i*51,475));
    return add(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(canvas),side:THREE.DoubleSide}),x,y,z);
  }
  box(0,-.22,-1,19,.44,26,road);
  box(-9,3,-1,.7,6,26,green);box(9,3,-1,.7,6,26,green);
  box(0,3,-14,19,6,.65,stone);
  box(0,6,-1,19,.28,26,dark);
  // Far-left door is marked KEEP OUT and leads to the Kamidana.
  const keepOutDoor=new THREE.Group();keepOutDoor.position.set(-7.35,0,-13.45);group.add(keepOutDoor);
  box(0,2.45,0,1.65,4.75,.25,iron,keepOutDoor);
  box(0,4.65,.25,1.25,.12,.15,orange,keepOutDoor);
  sphere(.54,2.2,.25,.095,orange,keepOutDoor);
  sign(['KEEP','OUT'],1.8,1.1,-7.35,5.1,-13.1);
  for(let i=1;i<7;i++){
    const x=-7.35+i*2.45;
    box(x,2.45,-13.45,1.65,4.75,.25,iron);
    box(x,4.65,-13.2,1.25,.12,.15,orange);
    sphere(x+.54,2.2,-13.2,.095,orange);
  }
  sign(['DEPARTMENT OF','UNNECESSARY DOORS'],5.6,2.15,0,5.8,-12.96);
  box(0,1.05,-5.8,5.5,2.1,2.4,dark);
  box(0,2.17,-5.8,5.9,.17,2.6,stone);
  for(let i=0;i<12;i++)box(-2.15+(i%3)*.12,2.28+i*.055,-5.8,1.28,.045,.83,paper);
  const picklesworth=new THREE.Group();picklesworth.position.set(1.1,2.22,-5.9);group.add(picklesworth);
  box(0,.35,0,.68,.7,.5,green,picklesworth);
  sphere(0,.99,0,.38,green,picklesworth);
  for(const side of [-1,1]){
    const ear=add(new THREE.ConeGeometry(.19,.55,5),green,side*.4,1.06,0,picklesworth);
    ear.rotation.z=side*.7;
    sphere(side*.15,1.05,.35,.065,paper,picklesworth);
  }
  add(new THREE.ConeGeometry(.35,.9,6),dark,0,1.62,0,picklesworth);
  const bell=sphere(-1.25,2.35,-4.9,.3,orange);
  box(-1.25,2.25,-4.9,.77,.09,.7,iron);
  const unionDoor=new THREE.Group();unionDoor.position.set(5.8,0,-7.3);group.add(unionDoor);
  box(0,2.35,0,2.3,4.7,.28,green,unionDoor);
  box(0,4.6,.16,2.25,.16,.15,orange,unionDoor);
  sphere(.72,2.2,.22,.14,orange,unionDoor);
  sign(['DOOR UNION','ON STRIKE'],2.6,1.3,5.8,5.7,-7.08);
  const returnDoor=box(0,2.35,10.85,3.2,4.7,.3,iron);
  box(-1.78,2.5,10.85,.35,5.2,.5,orange);
  box(1.78,2.5,10.85,.35,5.2,.5,orange);
  sphere(1,2.2,10.63,.14,orange);
  const exitSign=sign(['BACK TO THE','COUNTING HOUSE'],3.8,1.75,0,5.75,10.65);
  exitSign.rotation.y=Math.PI;
  group.visible=false;
  return {
    group,
    hotspots:{picklesworth:[picklesworth], 'union-door':[unionDoor], 'office-bell':[bell], 'office-return':[returnDoor,exitSign], 'keep-out-door':[keepOutDoor]},
    actions:{
      picklesworth:{type:'story',id:'picklesworth'},
      'union-door':{type:'story',id:'union-door'},
      'office-bell':{type:'story',id:'office-bell'},
      'office-return':{type:'travel',destination:'counting-house'},
      'keep-out-door':{type:'travel',destination:'kamidana'}
    },
    update(t){picklesworth.rotation.y=Math.sin(t*.65)*.12;}
  };
}
