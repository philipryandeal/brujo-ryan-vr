import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createKingdom} from '../src/kingdom.js';
import {SCENES,createSceneManager} from '../src/scene-manager.js';
import {makeQuestionableKeys} from '../src/scenes/questionable-keys.js';
import {createStageRuntime} from '../src/scenes/stage-runtime.js';

test('the lodge opens from the Threshold and returns there without rewriting companion passages', () => {
  const world = createSceneManager();
  assert.equal(world.canEnter('questionable-keys'), true);
  world.enter('questionable-keys');
  assert.deepEqual([...SCENES['questionable-keys'].exits], ['threshold']);
  world.enter('threshold');
  world.enter('whisper-hedges');
  world.enter('counting-house');
  assert.equal(world.canEnter('questionable-keys'), false);
  world.enter('long-way');
  world.enter('river-house');
  world.enter('long-way');
  world.enter('oracle-room');
  world.enter('long-way');
  world.enter('counting-house');
  world.enter('waiting-hall');
  world.enter('unnecessary-doors');
  world.enter('hushing-stair');
  world.enter('kamidana');
});

test('lodge discoveries have optional local authored dialogue and ambient life', () => {
  const story = createKingdom();
  for (const id of ['duty-coat', 'key-board', 'permit-stamp']) {
    const entry = story.meet(id);
    assert.ok(entry.choices.length >= 2);
    for (const choice of entry.choices) assert.ok(story.answer(id, choice.id).text.length > 0);
  }
  assert.match(story.meet('goblin').choices.map(choice => choice.id).join(' '), /lodge/);
  assert.match(story.nextAmbient('questionable-keys'), /key|coat|stamp|permit|Nettle/i);
});

class Object3D {
  constructor(){this.children=[];this.visible=true;this.position={set:(x,y,z)=>Object.assign(this.position,{x,y,z})};this.rotation={};}
  add(o){if(o.parent)o.parent.children=o.parent.children.filter(child=>child!==o);this.children.push(o);o.parent=this;}
}
class Mesh extends Object3D {constructor(geometry,material){super();this.geometry=geometry;this.material=material;}}
class Value {constructor(...args){this.args=args;}}
const THREE={Group:Object3D,Mesh,BoxGeometry:Value,SphereGeometry:Value,ConeGeometry:Value,CylinderGeometry:Value,
  TorusGeometry:Value,PlaneGeometry:Value,MeshStandardMaterial:Value,MeshBasicMaterial:Value,CanvasTexture:Value,DoubleSide:2};

test('stage factory registers real nested hotspots and safe animations', () => {
  globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},strokeRect(){},fillText(){}})})};
  const stage=makeQuestionableKeys(THREE,{stone:1,hedge:2,road:3,dark:4,orange:5,light:6});
  const stages=Object.fromEntries(Object.keys(SCENES).map(id=>[id,id==='questionable-keys'?stage:{
    group:{visible:false},hotspots:{resident:[{}]},actions:{resident:{type:'notices'}},update(){}
  }]));
  const runtime=createStageRuntime(stages,SCENES);
  assert.equal(stage.group.visible,false);runtime.show('questionable-keys');
  assert.equal(stage.group.visible,true);
  for(const [name,roots] of Object.entries(stage.hotspots)){
    assert.ok(roots.every(root=>root.parent===stage.group));
    const child=roots[0].children[0]||roots[0];
    assert.deepEqual(runtime.actionFor('questionable-keys',child),stage.actions[name]);
    if(stage.actions[name].type==='story')assert.ok(SCENES['questionable-keys'].controls.includes(stage.actions[name].id));
  }
  assert.doesNotThrow(()=>runtime.update('questionable-keys',42));
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  for(const id of SCENES['questionable-keys'].controls)assert.match(html,new RegExp(`<button id="${id}"`));
  assert.match(html,/<button id="key-lodge-entry"/);
});
