// Scene 013: municipal weather storage, where atmosphere goes when it is geographically embarrassed.
export function makeWeatherCloset(THREE, palette) {
  const group = new THREE.Group();
  const material = (color, opts={}) => new THREE.MeshStandardMaterial({color,...opts});
  const stone=material(palette.stone,{roughness:.95});
  const dark=material(palette.dark);
  const green=material(palette.hedge);
  const road=material(palette.road,{roughness:1});
  const orange=material(palette.orange,{emissive:palette.orange,emissiveIntensity:.5});
  const light=material(palette.light,{emissive:palette.light,emissiveIntensity:.25});
  const glassGreen=material(palette.hedge,{transparent:true,opacity:.42});
  const glassOrange=material(palette.orange,{transparent:true,opacity:.34,emissive:palette.orange,emissiveIntensity:.15});
  const paper=material(0xffffff);

  const add=(geo,mat,x,y,z,parent=group)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);return m;};
  const box=(x,y,z,w,h,d,mat,parent)=>add(new THREE.BoxGeometry(w,h,d),mat,x,y,z,parent);
  const sphere=(x,y,z,r,mat,parent)=>add(new THREE.SphereGeometry(r,12,9),mat,x,y,z,parent);
  const cylinder=(x,y,z,rt,rb,h,mat,parent)=>add(new THREE.CylinderGeometry(rt,rb,h,10),mat,x,y,z,parent);

  function sign(lines,w,h,x,y,z,parent=group) {
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;
    const ctx=canvas.getContext('2d');ctx.fillStyle='#303636';ctx.fillRect(0,0,512,256);
    ctx.strokeStyle='#FF5E1F';ctx.lineWidth=14;ctx.strokeRect(9,9,494,238);
    ctx.fillStyle='#FFFFFF';ctx.font='bold 31px Georgia';ctx.textAlign='center';
    lines.forEach((line,i)=>ctx.fillText(line,256,82+i*48,480));
    const mesh=add(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(canvas),side:THREE.DoubleSide}),x,y,z,parent);
    return mesh;
  }

  // Room shell and drainage.
  box(0,-.22,-1,18,.44,25,road);
  box(-8.7,3,-1,.55,6,25,stone);box(8.7,3,-1,.55,6,25,stone);
  box(0,3,-13.25,18,6,.55,dark);box(0,6,-1,18,.3,25,dark);
  for(let z=8;z>-12;z-=2.4)box(0,-.02,z,10,.035,.14,orange);

  // Tall shelves. Containers are deliberately simple geometry for performance.
  const shelfXs=[-6.6,-3.8,3.8,6.6];
  const jars=[];
  for(const x of shelfXs){
    for(let y=.7;y<5.2;y+=1.15){
      box(x,y,-3.5,2.25,.12,12,green);
      for(let z=-8.3;z<1.8;z+=2.05){
        const glass=(Math.round((x+y+z)*10)%2===0)?glassGreen:glassOrange;
        const jar=cylinder(x+(z%2)*.08,y+.48,z,.28,.34,.72,glass);
        sphere(jar.position.x,y+.92,z,.19,light);
        jars.push(jar);
      }
    }
  }

  sign(['WEATHER STORAGE','NO CLIMATE REQUESTS'],5.4,1.6,0,5.25,-12.9);

  // Mizzle at the sorting bench.
  box(0,1.0,-5.8,5.2,2,2.2,dark);
  box(0,2.08,-5.8,5.5,.16,2.4,stone);
  const mizzle=new THREE.Group();mizzle.position.set(-.7,2.15,-5.75);group.add(mizzle);
  box(0,.38,0,.72,.76,.5,green,mizzle);
  sphere(0,1.02,0,.38,green,mizzle);
  for(const side of [-1,1]){
    const ear=add(new THREE.ConeGeometry(.18,.5,5),green,side*.4,1.07,0,mizzle);ear.rotation.z=side*.68;
    sphere(side*.15,1.08,.34,.06,paper,mizzle);
  }
  box(0,.5,.28,.9,.95,.08,orange,mizzle); // waxed apron
  const cap=add(new THREE.ConeGeometry(.38,.35,8),dark,0,1.43,0,mizzle);cap.rotation.z=.08;

  // Tuesday jar: low pedestal, intentionally strange and unhelpful.
  const tuesdayJar=new THREE.Group();tuesdayJar.position.set(3.2,0,-7.2);group.add(tuesdayJar);
  box(0,.55,0,1.55,1.1,1.55,stone,tuesdayJar);
  cylinder(0,1.55,0,.48,.58,1.35,glassGreen,tuesdayJar);
  sphere(0,2.2,0,.31,light,tuesdayJar);
  sign(['TUESDAY','4:17 PM'],1.9,1.0,3.2,3.0,-7.18);

  // Umbrella stand containing everything except umbrellas.
  const umbrellaStand=new THREE.Group();umbrellaStand.position.set(-3.0,0,-8.1);group.add(umbrellaStand);
  cylinder(0,.72,0,.52,.6,1.44,dark,umbrellaStand);
  for(const x of [-.28,-.08,.12,.3]){
    const stick=cylinder(x,1.7,0,.045,.045,2.15,x===.3?orange:stone,umbrellaStand);
    stick.rotation.z=x*.55;
  }
  sign(['UMBRELLAS REMOVED','FOR ORGANIZING THEMSELVES'],3.9,1.35,-3.0,3.65,-8.08);

  // Real return door.
  const returnDoor=new THREE.Group();returnDoor.position.set(0,0,10.55);group.add(returnDoor);
  box(0,2.35,0,3.2,4.7,.3,dark,returnDoor);
  box(-1.78,2.5,0,.35,5.2,.5,orange,returnDoor);
  box(1.78,2.5,0,.35,5.2,.5,orange,returnDoor);
  sphere(1,2.2,-.22,.14,orange,returnDoor);
  const exitSign=sign(['BACK TO THE','UNNECESSARY DOORS'],4.2,1.7,0,5.7,-.2,returnDoor);
  exitSign.rotation.y=Math.PI;

  group.visible=false;
  return {
    group,
    hotspots:{
      mizzle:[mizzle],
      'tuesday-jar':[tuesdayJar],
      'umbrella-stand':[umbrellaStand],
      'weather-return':[returnDoor]
    },
    actions:{
      mizzle:{type:'story',id:'mizzle'},
      'tuesday-jar':{type:'story',id:'tuesday-jar'},
      'umbrella-stand':{type:'story',id:'umbrella-stand'},
      'weather-return':{type:'travel',destination:'unnecessary-doors'}
    },
    update(t){
      mizzle.rotation.y=Math.sin(t*.55)*.08;
      for(let i=0;i<jars.length;i+=7)jars[i].rotation.y=Math.sin(t*.22+i)*.03;
    }
  };
}
