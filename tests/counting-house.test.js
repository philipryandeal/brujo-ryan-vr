import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createKingdom} from '../src/kingdom.js';
import {SCENES,createSceneManager} from '../src/scene-manager.js';
import {makeCountingHouse} from '../src/scenes/counting-house.js';
import {createStageRuntime} from '../src/scenes/stage-runtime.js';

test('every Counting House exit leads somewhere real, with a way back', () => {
  const world = createSceneManager();
  world.enter('whisper-hedges');
  world.enter('counting-house');
  assert.deepEqual([...SCENES['counting-house'].exits].sort(), ['long-way', 'waiting-hall', 'whisper-hedges']);
  assert.equal(world.canEnter('whisper-hedges'), true);
  assert.equal(world.canEnter('long-way'), true);
  assert.equal(world.canEnter('waiting-hall'), true);
  world.enter('whisper-hedges');
  world.enter('counting-house');
  world.enter('long-way');
  world.enter('counting-house');
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

test('each clickable object has an honest action, and both side doors share the Long Way', () => {
  globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>({
    fillStyle:'',strokeStyle:'',lineWidth:0,font:'',textAlign:'',
    fillRect(){},strokeRect(){},clearRect(){},fillText(){},strokeText(){},
    measureText:()=>({width:100})
  })})};
  const stage=makeCountingHouse(THREE,{stone:1,hedge:2,road:3,dark:4,orange:5,light:6,deep:7});
  assert.equal(stage.group.visible,false);
  assert.deepEqual(stage.actions.return,{type:'travel',destination:'whisper-hedges'});
  assert.deepEqual(stage.actions['bear-door'],{type:'travel',destination:'long-way'});
  assert.deepEqual(stage.actions['oracle-door'],{type:'travel',destination:'long-way'});
  assert.deepEqual(stage.actions['department-door'],{type:'travel',destination:'waiting-hall'});
  for (const id of ['ledger','nib','stamp','seven']) {
    assert.deepEqual(stage.actions[id],{type:'story',id});
  }

  const stages=Object.fromEntries(Object.keys(SCENES).map(id=>[id,id==='counting-house'?stage:{
    group:{visible:false},hotspots:{resident:[{}]},actions:{resident:{type:'notices'}},update(){}
  }]));
  const runtime=createStageRuntime(stages,SCENES);
  runtime.show('counting-house');
  assert.equal(stage.group.visible,true);
  for (const [name,roots] of Object.entries(stage.hotspots)) {
    assert.ok(roots.every(root=>root.parent===stage.group), `${name} should be parented to the room`);
    const child=roots[0].children[0]||roots[0];
    assert.deepEqual(runtime.actionFor('counting-house',child),stage.actions[name]);
    if (stage.actions[name].type==='story') assert.ok(SCENES['counting-house'].controls.includes(stage.actions[name].id));
  }
  assert.doesNotThrow(()=>runtime.update('counting-house',42));

  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  for (const id of SCENES['counting-house'].controls) assert.match(html,new RegExp(`<button id="${id}"`));
  assert.match(html,/<button id="department-door" hidden>The Hall of Taking a Number/);

  const source=readFileSync(new URL('../src/scenes/counting-house.js',import.meta.url),'utf8');
  assert.match(source,/Hall of Taking a Number/);
  assert.match(source,/TAKE A NUMBER/);
  assert.doesNotMatch(source,/Scene 005/);

  const story=createKingdom();
  assert.equal(
    story.answer('nib','help').text,
    'Walk up slowly and say something official. It respects confidence. It fears paperwork. Be official.'
  );
});
