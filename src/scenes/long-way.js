// Scene 009 — The Long Way Between. Conceived, written and built by Temple Bot.
// A breathing space, not a fast-travel menu. Existing companion dialogue is reused.
export function makeLongWay(THREE, palette) {
  const group=new THREE.Group();group.visible=false;
  const material=(color,extra={})=>new THREE.MeshStandardMaterial({color,...extra});
  const stone=material(palette.stone),hedge=material(palette.hedge),road=material(palette.road);
  const dark=material(palette.dark),orange=material(palette.orange,{emissive:palette.orange,emissiveIntensity:.7});
  const light=material(palette.light,{emissive:palette.light,emissiveIntensity:.45});
  const water=material(palette.hedge,{metalness:.45,roughness:.25});
  function mesh(geometry,mat,x,y,z,parent=group){
    const o=new THREE.Mesh(geometry,mat);o.position.set(x,y,z);parent.add(o);return o;
  }
  const box=(x,y,z,w,h,d,mat,parent)=>mesh(new THREE.BoxGeometry(w,h,d),mat,x,y,z,parent);
  const orb=(x,y,z,r,mat,parent)=>mesh(new THREE.SphereGeometry(r,10,8),mat,x,y,z,parent);
  function sign(lines,x,y,z,w=3.2){
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;
    const c=canvas.getContext('2d');c.fillStyle='#303636';c.fillRect(0,0,512,256);
    c.strokeStyle='#FF5E1F';c.lineWidth=12;c.strokeRect(8,8,496,240);
    c.fillStyle='#FFFFFF';c.textAlign='center';c.font='bold 36px Georgia';
    lines.forEach((line,i)=>c.fillText(line,256,105+i*52,478));
    return mesh(new THREE.PlaneGeometry(w,1.4),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(canvas),side:THREE.DoubleSide}),x,y,z);
  }
  box(0,-.22,0,14,.45,26,road);
  // The old spine screens the two approaches from one another. Its footprint
  // and a visitor-radius margin are enforced by walk-bounds.js.
  box(0,2.7,-6.7,2,5.4,9.4,hedge);
  for(const x of [-7,7])box(x,2.7,0,1,5.4,26,hedge);
  box(0,2.7,-12.5,14,5.4,1,stone);
  box(-4.9,2.7,12.4,4.2,5.4,1,hedge);box(4.9,2.7,12.4,4.2,5.4,1,hedge);
  // Split thread: the branches are actual paths on either side of the wall.
  box(0,.03,6,.12,.04,11.5,orange);
  box(0,.03,.3,8,.04,.12,orange);
  for(const x of [-4,4])box(x,.03,-4.4,.12,.04,9.4,orange);
  // Left: cool water, little paper boats, low arches. Right: brass and bells.
  box(-6.25,.01,-4.3,.5,.04,13,water);
  const boats=[];
  for(let i=0;i<4;i++){
    const boat=mesh(new THREE.ConeGeometry(.19,.35,3),light,-6.25,.22,1-i*2.7);
    boat.rotation.z=Math.PI/2;boats.push({mesh:boat,z:boat.position.z,phase:i});
  }
  const bells=[];
  for(const z of [-1.5,-5,-8.5]){
    for(const x of [-4,4]){
      box(x-1.7,2.6,z,.25,5.2,.35,stone);box(x+1.7,2.6,z,.25,5.2,.35,stone);
      box(x,5.3,z,3.65,.3,.35,x<0?hedge:orange);
    }
    box(4,4.7,z,.025,.8,.025,road);
    const bell=mesh(new THREE.ConeGeometry(.23,.35,10),orange,4,4.15,z);bells.push(bell);
    orb(-4,4.7,z,.18,light);
  }
  function door(x,z,lines){
    const root=new THREE.Group();group.add(root);
    box(x-1.4,2.2,z,.35,4.4,.5,stone,root);box(x+1.4,2.2,z,.35,4.4,.5,stone,root);
    box(x,4.5,z,3.2,.35,.5,orange,root);box(x,2.1,z,2.5,4.2,.18,dark,root);
    // Labels belong to the door's clickable root as well.
    root.add(sign(lines,x,5.55,z+.15));
    return root;
  }
  const bear=door(-4,-10.6,['THE BEAR','RIVER HOUSE']);
  const oracle=door(4,-10.6,['THE ORACLE','OBSERVATORY']);
  const back=door(0,12,['BACK TO THE','COUNTING HOUSE']);
  const keeper=new THREE.Group();keeper.position.set(-2.9,0,5.3);group.add(keeper);
  box(0,.7,0,.75,1.2,.6,hedge,keeper);orb(0,1.65,0,.36,light,keeper);
  for(const x of [-.3,.3])box(x,.17,.22,.4,.34,.9,dark,keeper);
  mesh(new THREE.ConeGeometry(.5,.8,7),dark,0,2.2,0,keeper);
  box(.75,.85,0,.9,.06,.12,orange,keeper);
  const keeperSign=sign(['SEDGE','DISTANCES KEPT'], -2.9,3.4,5.3);
  const spool=new THREE.Group();spool.position.set(2.9,0,5.3);group.add(spool);
  box(0,.55,0,1.4,1.1,1,stone,spool);
  mesh(new THREE.CylinderGeometry(.42,.42,.65,12),orange,0,1.45,0,spool);
  const spoolSign=sign(['ONE BORROWED','MILE'],2.9,3.4,5.3);
  return {
    group,
    hotspots:{'distance-keeper':[keeper,keeperSign],'borrowed-mile':[spool,spoolSign],
      'bear-door':[bear],'oracle-door':[oracle],return:[back]},
    actions:{'distance-keeper':{type:'story',id:'distance-keeper'},'borrowed-mile':{type:'story',id:'borrowed-mile'},
      'bear-door':{type:'story',id:'bear-door'},'oracle-door':{type:'story',id:'oracle-door'},
      return:{type:'travel',destination:'counting-house'}},
    update(t){
      keeper.rotation.y=Math.sin(t*.4)*.06;
      boats.forEach(b=>{b.mesh.position.z=b.z+Math.sin(t*.3+b.phase)*.3;});
      bells.forEach((bell,i)=>{bell.rotation.z=Math.sin(t*.7+i)*.06;});
    }
  };
}
