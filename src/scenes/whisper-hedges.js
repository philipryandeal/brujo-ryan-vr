// Scene 002 contract: {group, hotspots, actions, update}.
export function makeWhisperHedges(THREE, palette) {
  const group = new THREE.Group();
  const material = (color, opts = {}) => new THREE.MeshStandardMaterial({color, ...opts});
  const hedge = material(palette.hedge, {roughness: .98, emissive: palette.hedge, emissiveIntensity: .38});
  const stone = material(palette.stone, {roughness: .95});
  const orange = material(palette.orange, {emissive: palette.orange, emissiveIntensity: .8});
  const leaf = material(palette.light, {emissive: 0x495a58, emissiveIntensity: .3});
  const deep = material(palette.deep);
  function add(geometry, mat, x, y, z) {
    const object = new THREE.Mesh(geometry, mat);
    object.position.set(x, y, z);
    group.add(object);
    return object;
  }
  const box = (x,y,z,w,h,d,mat) => add(new THREE.BoxGeometry(w,h,d),mat,x,y,z);
  const orb = (x,y,z,r,mat) => add(new THREE.SphereGeometry(r,14,10),mat,x,y,z);
  const cone = (x,y,z,r,h,mat) => add(new THREE.ConeGeometry(r,h,9),mat,x,y,z);

  // A garden court and a winding, intentionally contained path.
  box(0,-.23,-10,28,.4,54,stone);
  box(0,.015,-9,4,.05,41,material(0x495a58));
  for (let i=0;i<14;i++) {
    const z=8-i*2.5;
    const sway=Math.sin(i*1.8)*.35;
    box(-6+sway,2.3,z,1.6,4.6,2.1,hedge);
    box(6-sway,2.3,z,1.6,4.6,2.1,hedge);
    if(i%2===0) {
      cone(-6+sway,5.3,z,1.25,2.1,leaf);
      cone(6-sway,5.3,z,1.25,2.1,leaf);
    }
  }

  // The opinionated hedge greets visitors from the left side of the path.
  const hedgeFace = new THREE.Group();
  hedgeFace.position.set(-3.4,1.9,-5.1);
  group.add(hedgeFace);
  function facePart(geometry,mat,x,y,z) {
    const mesh=new THREE.Mesh(geometry,mat);mesh.position.set(x,y,z);hedgeFace.add(mesh);return mesh;
  }
  const body = facePart(new THREE.SphereGeometry(1.25,18,14),hedge,0,0,0);
  body.scale.set(1.2,1.25,.75);
  for(const x of [-.48,.48]) {
    facePart(new THREE.SphereGeometry(.22,12,10),leaf,x,.25,.72);
    facePart(new THREE.SphereGeometry(.09,10,8),deep,x,.27,.91);
  }
  const mouth=facePart(new THREE.BoxGeometry(.65,.11,.1),deep,0,-.37,.78);
  cone(-3.4,3.6,-5.1,1.25,1.7,leaf);

  // Visible way home; it is a doorway, not a map or a fast-travel menu.
  box(4.7,2.4,-5.6,1.1,4.8,.9,stone);
  box(6.9,2.4,-5.6,1.1,4.8,.9,stone);
  box(5.8,5.05,-5.6,3.9,.7,.9,stone);
  const returnDoor=box(5.8,2.3,-5.05,1.2,3.7,.16,orange);
  const returnHandle=orb(6.1,2.4,-4.9,.12,deep);

  // A little late-1990s-web-style sign, now truly part of the 3D stage.
  const signCanvas=document.createElement('canvas');signCanvas.width=512;signCanvas.height=256;
  const brush=signCanvas.getContext('2d');
  brush.fillStyle='#303636';brush.fillRect(0,0,512,256);
  brush.strokeStyle='#FF5E1F';brush.lineWidth=16;brush.strokeRect(12,12,488,232);
  brush.fillStyle='#ffffff';brush.textAlign='center';brush.font='bold 48px Georgia';
  brush.fillText('HEDGE VISITS',256,108);brush.fillText('BY APPOINTMENT',256,176);
  const sign=add(new THREE.PlaneGeometry(3.5,1.75),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(signCanvas),side:THREE.DoubleSide}),0,4.6,-10);

  group.visible=false;
  return {
    group,
    hotspots: {hedge:[...hedgeFace.children,sign],return:[returnDoor,returnHandle]},
    actions: {
      hedge: {type:'story',id:'hedge'},
      return: {type:'travel',destination:'threshold'}
    },
    update(t) {
      hedgeFace.rotation.y=Math.sin(t*.9)*.06;
      mouth.scale.y=.65+Math.abs(Math.sin(t*1.4))*.7;
    }
  };
}
