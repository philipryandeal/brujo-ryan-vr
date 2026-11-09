import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createKingdom} from '../src/kingdom.js';
import {SCENES, createSceneManager, validateSceneRegistry} from '../src/scene-manager.js';
import {makeHeartTree} from '../src/scenes/heart-tree.js';
import {createStageRuntime} from '../src/scenes/stage-runtime.js';

test('the Bridge of Roots in the River House leads somewhere real', () => {
  const story = createKingdom();
  const crossing = story.answer('root-bridge', 'enter');
  assert.equal(crossing.destination, 'heart-tree');
  assert.equal(crossing.destinationLabel, 'Go down beneath the Heart Tree →');
  assert.ok(SCENES['river-house'].exits.includes('heart-tree'));
  assert.ok(SCENES['river-house'].controls.includes('root-bridge'));
});

test('beneath the Heart Tree there is one way in and the same way home', () => {
  const world = createSceneManager();
  for (const room of ['whisper-hedges', 'counting-house', 'long-way', 'river-house', 'heart-tree']) world.enter(room);
  assert.deepEqual([...SCENES['heart-tree'].exits], ['river-house']);
  assert.equal(world.canEnter('threshold'), false);
  for (const room of ['river-house', 'long-way', 'counting-house', 'whisper-hedges', 'threshold']) world.enter(room);
  assert.equal(validateSceneRegistry(), true);
});

test('Ralph and the house can all be spoken to, and the Brujo is out', () => {
  const story = createKingdom();
  for (const id of ['root-bridge', 'ralph', 'simmering-pot', 'ancestor-altar', 'honest-lantern', 'long-shelf', 'morning-dew']) {
    const entry = story.meet(id);
    assert.ok(entry.choices.length >= 3, `${id} needs at least three replies`);
    for (const choice of entry.choices) assert.ok(story.answer(id, choice.id).text.length > 20);
  }
  assert.match(createKingdom().meet('ralph').text, /Tekeli-li/);
  assert.match(story.answer('ralph', 'brujo').text, /Out, then/);
  assert.match(story.answer('honest-lantern', 'test').text, /does not light for experiments/);
});

test('the Tree upstairs is mentioned honestly and never offered as a passage', () => {
  const story = createKingdom();
  const lines = new Set();
  for (let i = 0; i < 12; i += 1) lines.add(story.nextAmbient('heart-tree'));
  assert.ok([...lines].some(line => /not open to visitors yet/.test(line)));
  for (const id of SCENES['heart-tree'].controls) {
    if (id === 'heart-tree-return') continue;
    for (const choice of story.meet(id).choices) assert.equal(story.answer(id, choice.id).destination, undefined);
  }
});

class Vec {
  constructor(){this.x=0;this.y=0;this.z=0;}
  set(x,y,z){Object.assign(this,{x,y,z});return this;}
  setScalar(v){return this.set(v,v,v);}
}
class Object3D {
  constructor(){this.children=[];this.visible=true;this.position=new Vec();this.rotation=new Vec();this.scale=new Vec().setScalar(1);}
  add(o){if(o.parent)o.parent.children=o.parent.children.filter(child=>child!==o);this.children.push(o);o.parent=this;}
}
class Mesh extends Object3D {constructor(geometry,material){super();this.geometry=geometry;this.material=material;}}
class Value {constructor(...args){this.args=args;Object.assign(this,args[0]||{});}}
const THREE={Group:Object3D,Mesh,BoxGeometry:Value,SphereGeometry:Value,ConeGeometry:Value,CylinderGeometry:Value,
  TorusGeometry:Value,PlaneGeometry:Value,MeshStandardMaterial:Value,MeshBasicMaterial:Value,CanvasTexture:Value,DoubleSide:2};

test('stage factory keeps the palette, wires real hotspots and one way home', () => {
  globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},strokeRect(){},fillText(){}})})};
  const palette={dark:0x303636,stone:0x303636,road:0x7d6b57,hedge:0x495a58,light:0xb9f3a4,orange:0xff5e1f,deep:0x303636};
  const stage=makeHeartTree(THREE,palette);
  const stages=Object.fromEntries(Object.keys(SCENES).map(id=>[id,id==='heart-tree'?stage:{
    group:{visible:false},hotspots:{resident:[{}]},actions:{resident:{type:'notices'}},update(){}
  }]));
  const runtime=createStageRuntime(stages,SCENES);
  assert.equal(stage.group.visible,false);
  runtime.show('heart-tree');
  assert.equal(stage.group.visible,true);
  const travel=Object.values(stage.actions).filter(a=>a.type==='travel').map(a=>a.destination);
  assert.deepEqual(travel,['river-house']);
  for(const [name,roots] of Object.entries(stage.hotspots)){
    assert.ok(roots.every(root=>root.parent===stage.group));
    assert.ok(SCENES['heart-tree'].controls.includes(name), `${name} needs an accessible button`);
    const child=roots[0].children[0];
    assert.deepEqual(runtime.actionFor('heart-tree',child),stage.actions[name]);
  }
  // Every colour used is from the official palette, or white.
  const allowed=new Set([...Object.values(palette),0xffffff]);
  const walk=o=>{for(const c of o.children){
    for(const key of ['color','emissive'])if(c.material?.[key]!==undefined)assert.ok(allowed.has(c.material[key]),`off-palette ${key} ${c.material[key].toString(16)}`);
    walk(c);
  }};
  walk(stage.group);
  for(const t of [0,1.5,42,600])assert.doesNotThrow(()=>runtime.update('heart-tree',t));
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  for(const id of [...SCENES['heart-tree'].controls,'root-bridge'])assert.match(html,new RegExp(`<button id="${id}" hidden>`));
  const nav=readFileSync(new URL('../src/navigation.js',import.meta.url),'utf8');
  assert.match(nav,/\['heart-tree-return','river-house'\]/);
});
