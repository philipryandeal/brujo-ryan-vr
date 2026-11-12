import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createKingdom} from '../src/kingdom.js';
import {SCENES,createSceneManager,validateSceneRegistry} from '../src/scene-manager.js';
import {makeTopiaryParlour} from '../src/scenes/topiary-parlour.js';
import {makeWhisperHedges} from '../src/scenes/whisper-hedges.js';
import {createStageRuntime} from '../src/scenes/stage-runtime.js';

test('the parlour opens off the Whisper Hedges and returns the same way', () => {
  const world = createSceneManager();
  world.enter('whisper-hedges');
  world.enter('topiary-parlour');
  assert.deepEqual([...SCENES['topiary-parlour'].exits], ['whisper-hedges']);
  assert.equal(world.canEnter('threshold'), false);
  world.enter('whisper-hedges');
  world.enter('threshold');
  // The Hedges keep their existing passages.
  for (const id of ['threshold', 'counting-house']) assert.ok(SCENES['whisper-hedges'].exits.includes(id));
  assert.equal(validateSceneRegistry(), true);
});

test('parlour residents have optional local authored dialogue, and the Hedge only gains a hint', () => {
  const story = createKingdom();
  for (const id of ['snip', 'half-swan', 'appointment-book']) {
    const entry = story.meet(id);
    assert.ok(entry.choices.length >= 2);
    for (const choice of entry.choices) assert.ok(story.answer(id, choice.id).text.length > 0);
    assert.notEqual(story.meet(id).text, entry.text);
  }
  const hedge = story.meet('hedge');
  for (const id of ['appointment', 'leaves', 'goblins', 'doors', 'stylist']) assert.ok(hedge.choices.some(c => c.id === id));
  assert.match(story.answer('hedge', 'stylist').text, /Snip/);
  assert.match(story.nextAmbient('topiary-parlour'), /Snip|swan|clipping|bell/);
});

class Object3D {
  constructor(){this.children=[];this.visible=true;this.position={set:(x,y,z)=>Object.assign(this.position,{x,y,z})};this.rotation={};this.scale={set(){}};}
  add(o){if(o.parent)o.parent.children=o.parent.children.filter(child=>child!==o);this.children.push(o);o.parent=this;}
}
class Mesh extends Object3D {constructor(geometry,material){super();this.geometry=geometry;this.material=material;}}
class Value {constructor(...args){this.args=args;}}
const THREE={Group:Object3D,Mesh,BoxGeometry:Value,SphereGeometry:Value,ConeGeometry:Value,CylinderGeometry:Value,
  TorusGeometry:Value,PlaneGeometry:Value,MeshStandardMaterial:Value,MeshBasicMaterial:Value,CanvasTexture:Value,DoubleSide:2};

test('stage factories register real hotspots, both sides of the gap, buttons and safe animations', () => {
  globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},strokeRect(){},fillText(){}})})};
  const palette={stone:1,hedge:2,road:3,dark:4,orange:5,light:6,deep:7};
  const stage=makeTopiaryParlour(THREE,palette);
  const hedges=makeWhisperHedges(THREE,palette);
  const stages=Object.fromEntries(Object.keys(SCENES).map(id=>[id,id==='topiary-parlour'?stage:id==='whisper-hedges'?hedges:{
    group:{visible:false},hotspots:{resident:[{}]},actions:{resident:{type:'notices'}},update(){}
  }]));
  const runtime=createStageRuntime(stages,SCENES);
  assert.equal(stage.group.visible,false);runtime.show('topiary-parlour');
  assert.equal(stage.group.visible,true);
  const travel=Object.values(stage.actions).filter(a=>a.type==='travel').map(a=>a.destination);
  assert.deepEqual(travel,['whisper-hedges']);
  for(const [name,roots] of Object.entries(stage.hotspots)){
    assert.ok(roots.every(root=>root.parent===stage.group));
    assert.ok(SCENES['topiary-parlour'].controls.includes(name));
    const child=roots[0].children[0]||roots[0];
    assert.deepEqual(runtime.actionFor('topiary-parlour',child),stage.actions[name]);
  }
  assert.deepEqual(hedges.actions['parlour-gap'],{type:'travel',destination:'topiary-parlour'});
  assert.deepEqual(runtime.actionFor('whisper-hedges',hedges.hotspots['parlour-gap'][0].children[0]),hedges.actions['parlour-gap']);
  // The Hedges' original passages are unchanged.
  assert.deepEqual(hedges.actions.return,{type:'travel',destination:'threshold'});
  assert.deepEqual(hedges.actions['counting-gate'],{type:'travel',destination:'counting-house'});
  assert.doesNotThrow(()=>runtime.update('topiary-parlour',42));
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  for(const id of [...SCENES['topiary-parlour'].controls,'parlour-gap'])assert.match(html,new RegExp(`<button id="${id}"`));
  const nav=readFileSync(new URL('../src/navigation.js',import.meta.url),'utf8');
  assert.match(nav,/\['parlour-gap','topiary-parlour'\],\['parlour-return','whisper-hedges'\]/);
  const ui=readFileSync(new URL('../src/story-ui.js',import.meta.url),'utf8');
  for(const id of ['snip','half-swan','appointment-book'])assert.match(ui,new RegExp(`'${id}'`));
});
