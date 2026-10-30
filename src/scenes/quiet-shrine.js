// Scene 008 — The Quiet Shrine.
// Conceived by Eikonostasis Daimōn Hyperouranios. A small, unadvertised room behind a KEEP OUT door.
// No AI calls, tracking, saved visitor data, or compulsory quests.
export function makeQuietShine(THREE, palette) {
  const group = new THREE.Group();
  const mat = (color, extra={}) => new THREE.MeshStandardMaterial({color,...extra});
  const dark=mat(palette.dark), hedge=mat(palette.hedge), stone=mat(palette.stone);
  const orange=mat(palette.orange,{emissive:palette.orange,emissiveIntensity:.55});
  const faerie=mat(palette.light,{emissive:palette.light,emissiveIntensity:.4});
  const brass=mat(palette.road,{metalness:.5,roughness:.4});
  const add=(geo,m,x,y,z,parent=group)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);parent.add(o);return o;};
  const box=(x,y,z,w,h,d,m,parent)=>add(new THREE.BoxGeometry(w,h,d),m,x,y,z,parent);
  const orb=(x,y,z,r,m,parent)=>add(new THREE.SphereGeometry(r,12,9),m,x,y,z,parent);
  const cyl=(x,y,z,rt,rb,h,m,parent)=>add(new THREE.CylinderGeometry(rt,rb,h,10),m,x,y,z,parent);
  function sign(lines,w,h,x,y,z,rotation=0) {
    const c=document.createElement('canvas');c.width=512;c.height=256;
    const p=c.getContext('2d');p.fillStyle='#303636';p.fillRect(0,0,512,256);
    p.strokeStyle='#FF5E1F';p.lineWidth=12;p.strokeRect(8,8,496,240);
    p.fillStyle='#FFFFFF';p.textAlign='center';p.font='bold 32px Georgia';
    lines.forEach((line,i)=>p.fillText(line,256,110+i*48,478));
    const mesh=add(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),side:THREE.DoubleSide}),x,y,z);
    mesh.rotation.y=rotation;return mesh;
  }
  cyl(0,-.2,-1,7.2,7.2,.4,stone);
  cyl(0,.02,-1,6.9,6.9,.06,dark);
  for(let i=0;i<4;i++){
    const a=i*Math.PI/2 + .3, x=Math.cos(a)*4.2, z=-1+Math.sin(a)*4.2;
    cyl(x,1.6,z,.38,.48,3.2,hedge);
    orb(x,3.3,z,.22,orange);
  }
  const basin=new THREE.Group();basin.position.set(0,0,-1);group.add(basin);
  cyl(0,.55,0,1.4,1.6,.7,brass,basin);
  cyl(0,.95,0,1.2,1.2,.12,dark,basin);
  orb(0,1.05,0,.18,faerie,basin);
  sign(['THE QUIET','SHRINE'],3.2,1.4,0,4.2,-1);
  const attendant=new THREE.Group();attendant.position.set(-2.2,0,-3.2);group.add(attendant);
  cyl(0,.7,0,.42,.62,1.4,hedge,attendant);
  orb(0,1.6,0,.36,faerie,attendant);
  add(new THREE.ConeGeometry(.55,.9,7),dark,0,2.2,0,attendant);
  const returnDoor=new THREE.Group();returnDoor.position.set(0,0,6.2);group.add(returnDoor);
  box(-1.4,2.2,0,.3,4.4,.5,hedge,returnDoor);
  box(1.4,2.2,0,.3,4.4,.5,hedge,returnDoor);
  box(0,4.4,0,3.2,.4,.5,orange,returnDoor);
  box(0,2.2,0,2.6,4.2,.18,dark,returnDoor);
  orb(.9,2.1,-.1,.1,orange,returnDoor);
  const exitSign=sign(['BACK TO THE','UNNECESSARY DOORS'],3.6,1.3,0,5.4,6.1,0);
  group.visible=false;
  return {
    group,
    hotspots:{attendant:[attendant], basin:[basin], 'shrine-return':[returnDoor,exitSign]},
    actions:{
      attendant:{type:'story',id:'shrine-attendant'},
      basin:{type:'story',id:'shrine-basin'},
      'shrine-return':{type:'travel',destination:'unnecessary-doors'}
    },
    update(t){attendant.rotation.y=Math.sin(t*.4)*.08;}
  };
}