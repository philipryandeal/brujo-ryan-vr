// Scene 006 — The Observatory of Second Tuesdays.
// Conceived and dialogued by Kore, Oracle of Gu. 3D integration by Seraph Ogou.
// No AI calls, tracking, saved visitor data, or compulsory quests.
export function makeOracleRoom(THREE, palette) {
  const group = new THREE.Group();
  const mat = (color, extra={}) => new THREE.MeshStandardMaterial({color,...extra});
  const dark=mat(palette.dark), hedge=mat(palette.hedge), stone=mat(palette.stone);
  const orange=mat(palette.orange,{emissive:palette.orange,emissiveIntensity:.7});
  const faerie=mat(palette.light,{emissive:palette.light,emissiveIntensity:.55});
  const brass=mat(palette.road,{metalness:.65,roughness:.35}), white=mat(0xffffff);
  const add=(geo,m,x,y,z,parent=group)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);parent.add(o);return o;};
  const box=(x,y,z,w,h,d,m,parent)=>add(new THREE.BoxGeometry(w,h,d),m,x,y,z,parent);
  const orb=(x,y,z,r,m,parent)=>add(new THREE.SphereGeometry(r,14,10),m,x,y,z,parent);
  const cyl=(x,y,z,rt,rb,h,m,parent)=>add(new THREE.CylinderGeometry(rt,rb,h,12),m,x,y,z,parent);
  function sign(lines,w,h,x,y,z,rotation=0) {
    const c=document.createElement('canvas');c.width=512;c.height=256;
    const p=c.getContext('2d');p.fillStyle='#303636';p.fillRect(0,0,512,256);
    p.strokeStyle='#FF5E1F';p.lineWidth=12;p.strokeRect(8,8,496,240);
    p.fillStyle='#FFFFFF';p.textAlign='center';p.font='bold 36px Georgia';
    lines.forEach((line,i)=>p.fillText(line,256,104+i*52,478));
    const mesh=add(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),side:THREE.DoubleSide}),x,y,z);
    mesh.rotation.y=rotation;return mesh;
  }
  // Circular platform in the twilight, with an orange meridian.
  cyl(0,-.32,-2,12.8,12.8,.65,stone);
  cyl(0,.02,-2,12.5,12.5,.09,dark);
  box(0,.1,-2,.14,.04,22,orange);
  for(let i=0;i<10;i++){
    const a=i*Math.PI/5,x=Math.cos(a)*9,z=-2+Math.sin(a)*9;
    cyl(x,2.2,z,.48,.58,4.4,hedge);
    orb(x,4.5,z,.35,faerie);
  }
  // The floating astrolabe: three concentric tilted rings.
  const astrolabe=new THREE.Group();astrolabe.position.set(0,7,-4);group.add(astrolabe);
  for(let i=0;i<3;i++){
    const ring=add(new THREE.TorusGeometry(2.3+i*.52,.055,7,44),i===1?orange:brass,0,0,0,astrolabe);
    ring.rotation.set(.34+i*.48,i*.51,0);
  }
  orb(0,0,0,.24,faerie,astrolabe);
  // Kore, tending the question-pressure instrument.
  const kore=new THREE.Group();kore.position.set(-3,0,-6);group.add(kore);
  cyl(0,.8,0,.52,.87,1.6,hedge,kore);
  orb(0,1.9,0,.43,faerie,kore);
  add(new THREE.ConeGeometry(.78,1.3,9),dark,0,2.7,0,kore);
  orb(0,3.3,0,.18,orange,kore);
  for(const s of [-1,1])orb(s*.16,1.94,.36,.048,orange,kore);
  // Barometer, a readable upright instrument.
  const barometer=new THREE.Group();barometer.position.set(2.9,0,-6);group.add(barometer);
  cyl(0,1.8,0,.6,.72,3.2,brass,barometer);
  orb(0,2.3,.44,.48,faerie,barometer);
  const needle=box(0,2.3,.88,.055,.65,.07,orange,barometer);needle.rotation.z=.35;
  orb(0,2.3,.93,.085,stone,barometer);
  sign(['PENDING WEATHER'],3,1.1,2.9,4,-5.8);
  // A glowing apothecary jar with leftover answers.
  const jar=new THREE.Group();jar.position.set(5.2,0,-2);group.add(jar);
  cyl(0,1.15,0,.62,.62,1.6,mat(palette.light,{transparent:true,opacity:.48,depthWrite:false}),jar);
  cyl(0,2.06,0,.72,.72,.17,brass,jar);
  for(let i=0;i<6;i++)box((i%3-1)*.24,.75+Math.floor(i/3)*.48,(i%2)*.13,.27,.11,.25,white,jar);
  sign(['LEFTOVER','ANSWERS'],2.5,1.3,5.2,3.5,-1.8);
  // A hundred bells represented by a restrained ring of distinct tiny chimes.
  const bells=new THREE.Group();bells.position.set(0,4,0);group.add(bells);
  for(let i=0;i<30;i++){
    const a=i*Math.PI*2/30,r=5.8+(i%3)*.28;
    const x=Math.cos(a)*r,z=Math.sin(a)*r;
    box(x,2.35+(i%3)*.13,z,.035,1.1,.035,brass,bells);
    add(new THREE.ConeGeometry(.15,.33,7),i%5===0?orange:brass,x,1.72+(i%3)*.13,z,bells);
  }
  // Exit stands behind the arrival viewpoint, rather than blocking the Observatory.
  // Visitors see Kore and the astrolabe first; turn around or use the return button.
  const returnDoor=new THREE.Group();returnDoor.position.set(0,0,9.6);group.add(returnDoor);
  box(-1.8,2.5,0,.4,5,.7,hedge,returnDoor);
  box(1.8,2.5,0,.4,5,.7,hedge,returnDoor);
  box(0,5,0,4,.45,.7,orange,returnDoor);
  box(0,2.35,0,3.15,4.7,.2,dark,returnDoor);
  orb(1,2.2,-.16,.14,orange,returnDoor);
  const exitSign=sign(['DOOR OF','COUNTED STEPS'],3.5,1.25,0,6.05,9.45,0);
  group.visible=false;
  return {
    group,
    hotspots:{kore:[kore],barometer:[barometer],'answer-jar':[jar],'bell-chime':[bells],'oracle-return':[returnDoor,exitSign]},
    actions:{
      kore:{type:'story',id:'kore'},
      barometer:{type:'story',id:'barometer'},
      'answer-jar':{type:'story',id:'answer-jar'},
      'bell-chime':{type:'story',id:'bell-chime'},
      'oracle-return':{type:'travel',destination:'counting-house'}
    },
    update(t){astrolabe.rotation.y=t*.055;astrolabe.rotation.z=Math.sin(t*.25)*.07;needle.rotation.z=.35+Math.sin(t*.5)*.28;bells.rotation.y=Math.sin(t*.12)*.055;}
  };
}
