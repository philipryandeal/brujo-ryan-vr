import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createKingdom} from '../src/kingdom.js';
import {SCENES,createSceneManager,validateSceneRegistry} from '../src/scene-manager.js';
import {makeWaitingHall} from '../src/scenes/waiting-hall.js';
import {createStageRuntime} from '../src/scenes/stage-runtime.js';

test('the hall separates the Counting House from the Department, with physical returns both ways', () => {
  const world = createSceneManager();
  world.enter('whisper-hedges');
  world.enter('counting-house');
  assert.equal(world.canEnter('unnecessary-doors'), false);
  world.enter('waiting-hall');
  assert.deepEqual([...SCENES['waiting-hall'].exits].sort(), ['counting-house', 'unnecessary-doors']);
  world.enter('unnecessary-doors');
  assert.equal(world.canEnter('counting-house'), false);
  world.enter('kamidana');
  world.enter('unnecessary-doors');
  world.enter('waiting-hall');
  world.enter('counting-house');
  world.enter('whisper-hedges');
  world.enter('threshold');
  assert.equal(validateSceneRegistry(), true);
});

test('hall residents have optional local authored dialogue and ambient life', () => {
  const story = createKingdom();
  for (const id of ['number-caller', 'ticket-machine', 'waiting-bench']) {
    const entry = story.meet(id);
    assert.ok(entry.choices.length >= 2);
    for (const choice of entry.choices) assert.ok(story.answer(id, choice.id).text.length > 0);
  }
  for (const id of ['duty-coat', 'picklesworth', 'ledger']) assert.ok(story.meet(id).choices.length >= 2);
  assert.match(story.nextAmbient('waiting-hall'), /Tuppence|ticket|STAMP/);
});

class Object3D {
  constructor(){this.children=[];this.visible=true;this.position={set:(x,y,z)=>Object.assign(this.position,{x,y,z})};this.rotation={};}
  add(o){if(o.parent)o.parent.children=o.parent.children.filter(child=>child!==o);this.children.push(o);o.parent=this;}
}
class Mesh extends Object3D {constructor(geometry,material){super();this.geometry=geometry;this.material=material;}}
class Value {constructor(...args){this.args=args;}}
const THREE={Group:Object3D,Mesh,BoxGeometry:Value,SphereGeometry:Value,ConeGeometry:Value,CylinderGeometry:Value,
  TorusGeometry:Value,PlaneGeometry:Value,MeshStandardMaterial:Value,MeshBasicMaterial:Value,CanvasTexture:Value,DoubleSide:2};

test('stage factory registers real nested hotspots, both doors, and safe animations', () => {
  globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},strokeRect(){},fillText(){}})})};
  const stage=makeWaitingHall(THREE,{stone:1,hedge:2,road:3,dark:4,orange:5,light:6});
  const stages=Object.fromEntries(Object.keys(SCENES).map(id=>[id,id==='waiting-hall'?stage:{
    group:{visible:false},hotspots:{resident:[{}]},actions:{resident:{type:'notices'}},update(){}
  }]));
  const runtime=createStageRuntime(stages,SCENES);
  assert.equal(stage.group.visible,false);runtime.show('waiting-hall');
  assert.equal(stage.group.visible,true);
  const travel=Object.values(stage.actions).filter(a=>a.type==='travel').map(a=>a.destination).sort();
  assert.deepEqual(travel,['counting-house','unnecessary-doors']);
  for(const [name,roots] of Object.entries(stage.hotspots)){
    assert.ok(roots.every(root=>root.parent===stage.group));
    const child=roots[0].children[0]||roots[0];
    assert.deepEqual(runtime.actionFor('waiting-hall',child),stage.actions[name]);
    if(stage.actions[name].type==='story')assert.ok(SCENES['waiting-hall'].controls.includes(stage.actions[name].id));
  }
  assert.doesNotThrow(()=>runtime.update('waiting-hall',42));
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  for(const id of SCENES['waiting-hall'].controls)assert.match(html,new RegExp(`<button id="${id}"`));
  assert.match(html,/<button id="office-return" hidden>← Back to the Hall of Taking a Number</);
  const nav=readFileSync(new URL('../src/navigation.js',import.meta.url),'utf8');
  assert.match(nav,/\['hall-department-door','unnecessary-doors'\],\['hall-return','counting-house'\]/);
});
