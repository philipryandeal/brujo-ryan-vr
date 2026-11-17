import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createKingdom} from '../src/kingdom.js';
import {SCENES,createSceneManager} from '../src/scene-manager.js';
import {makeUnnecessaryDoors} from '../src/scenes/unnecessary-doors.js';
import {createStageRuntime} from '../src/scenes/stage-runtime.js';

test('every Department exit leads somewhere real, with a way back', () => {
  const world = createSceneManager();
  world.enter('whisper-hedges');
  world.enter('counting-house');
  world.enter('waiting-hall');
  world.enter('unnecessary-doors');
  assert.deepEqual([...SCENES['unnecessary-doors'].exits].sort(), ['hushing-stair', 'waiting-hall', 'weather-closet']);
  assert.equal(world.canEnter('waiting-hall'), true);
  assert.equal(world.canEnter('hushing-stair'), true);
  assert.equal(world.canEnter('weather-closet'), true);
  world.enter('waiting-hall');
  world.enter('unnecessary-doors');
  world.enter('hushing-stair');
  world.enter('unnecessary-doors');
  world.enter('weather-closet');
  world.enter('unnecessary-doors');
  world.enter('waiting-hall');
  world.enter('counting-house');
  world.enter('whisper-hedges');
  world.enter('threshold');
});

class Object3D {
  constructor(){this.children=[];this.visible=true;this.position={set:(x,y,z)=>Object.assign(this.position,{x,y,z})};this.rotation={};this.scale={set(){}};}
  add(o){if(o.parent)o.parent.children=o.parent.children.filter(child=>child!==o);this.children.push(o);o.parent=this;}
}
class Mesh extends Object3D {constructor(geometry,material){super();this.geometry=geometry;this.material=material;}}
class Value {constructor(...args){this.args=args;}}
const THREE={Group:Object3D,Mesh,BoxGeometry:Value,SphereGeometry:Value,ConeGeometry:Value,CylinderGeometry:Value,
  TorusGeometry:Value,PlaneGeometry:Value,MeshStandardMaterial:Value,MeshBasicMaterial:Value,CanvasTexture:Value,DoubleSide:2};

test('each clickable object has an honest action, the signs fit, and the Weather door stands alone', () => {
  const drawn=[];
  globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>({
    fillStyle:'',strokeStyle:'',lineWidth:0,font:'',textAlign:'',
    fillRect(){},strokeRect(){},clearRect(){},fillText(text){drawn.push(text);},strokeText(){},
    measureText:()=>({width:100})
  })})};
  const stage=makeUnnecessaryDoors(THREE,{stone:1,hedge:2,road:3,dark:4,orange:5,light:6,deep:7});
  assert.equal(stage.group.visible,false);
  assert.deepEqual(stage.actions['office-return'],{type:'travel',destination:'waiting-hall'});
  assert.deepEqual(stage.actions['keep-out-door'],{type:'travel',destination:'hushing-stair'});
  assert.deepEqual(stage.actions['weather-entry'],{type:'travel',destination:'weather-closet'});
  for (const id of ['picklesworth','union-door','office-bell']) {
    assert.deepEqual(stage.actions[id],{type:'story',id});
  }

  const ironSlabs=stage.group.children.filter(child=>child.geometry?.args?.[0]===1.65 && child.geometry?.args?.[1]===4.75 && child.geometry?.args?.[2]===0.25);
  assert.equal(ironSlabs.length, 5);
  assert.deepEqual(ironSlabs.map(slab=>Math.round(slab.position.x*100)/100).sort((a,b)=>a-b), [-4.9,-2.45,0,2.45,4.9]);
  assert.equal(ironSlabs.some(slab=>Math.abs(slab.position.x-7.35)<0.01), false);

  const ceilingBottom=6-0.14;
  const planes=[];
  const walk=(node)=>{
    if (node.geometry && node.geometry.constructor===Value && node.geometry.args.length===2) planes.push(node);
    for (const child of node.children||[]) walk(child);
  };
  walk(stage.group);
  assert.ok(planes.length>=5, 'the room should letter at least five signs');
  for (const plane of planes) {
    const top=plane.position.y + plane.geometry.args[1]/2;
    assert.ok(top<ceilingBottom, `sign at y=${plane.position.y} h=${plane.geometry.args[1]} tops out at ${top}, under the ceiling at ${ceilingBottom}`);
  }

  assert.ok(drawn.includes('DEPARTMENT OF'));
  assert.ok(drawn.includes('UNNECESSARY DOORS'));
  assert.ok(drawn.includes('DOOR UNION'));
  assert.ok(drawn.includes('ON STRIKE'));
  assert.ok(drawn.includes('BACK TO THE'));
  assert.ok(drawn.includes('HALL OF TAKING A NUMBER'));
  assert.equal(drawn.includes('WAITING HALL'), false);

  const stages=Object.fromEntries(Object.keys(SCENES).map(id=>[id,id==='unnecessary-doors'?stage:{
    group:{visible:false},hotspots:{resident:[{}]},actions:{resident:{type:'notices'}},update(){}
  }]));
  const runtime=createStageRuntime(stages,SCENES);
  runtime.show('unnecessary-doors');
  assert.equal(stage.group.visible,true);
  for (const [name,roots] of Object.entries(stage.hotspots)) {
    assert.ok(roots.every(root=>root.parent===stage.group), `${name} should be parented to the room`);
    const child=roots[0].children[0]||roots[0];
    assert.deepEqual(runtime.actionFor('unnecessary-doors',child),stage.actions[name]);
    if (stage.actions[name].type==='story') assert.ok(SCENES['unnecessary-doors'].controls.includes(stage.actions[name].id));
  }
  assert.doesNotThrow(()=>runtime.update('unnecessary-doors',42));

  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  for (const id of SCENES['unnecessary-doors'].controls) assert.match(html,new RegExp(`<button id="${id}"`));
  assert.match(html,/<button id="office-return" hidden>← Back to the Hall of Taking a Number/);
  assert.match(html,/<button id="keep-out-door" hidden>The KEEP OUT Door/);
  assert.match(html,/<button id="weather-entry" hidden>The Weather Storage Door/);

  const source=readFileSync(new URL('../src/scenes/unnecessary-doors.js',import.meta.url),'utf8');
  assert.match(source,/HALL OF TAKING A NUMBER/);
  assert.doesNotMatch(source,/WAITING HALL/);
  assert.match(source,/for\(let i=1;i<6;i\+\+\)/);
  assert.doesNotMatch(source,/i<7/);

  const story=createKingdom();
  assert.ok(story.meet('picklesworth').text.length>0);
  assert.ok(story.meet('union-door').text.length>0);
  assert.ok(story.meet('office-bell').text.length>0);
});
