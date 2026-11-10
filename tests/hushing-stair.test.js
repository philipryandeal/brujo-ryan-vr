import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createKingdom} from '../src/kingdom.js';
import {SCENES,createSceneManager,validateSceneRegistry} from '../src/scene-manager.js';
import {makeHushingStair} from '../src/scenes/hushing-stair.js';
import {createStageRuntime} from '../src/scenes/stage-runtime.js';

test('the stair separates the Department from the Kamidana, with physical returns both ways', () => {
  const world = createSceneManager();
  for (const id of ['whisper-hedges', 'counting-house', 'waiting-hall', 'unnecessary-doors']) world.enter(id);
  assert.equal(world.canEnter('kamidana'), false);
  world.enter('hushing-stair');
  assert.deepEqual([...SCENES['hushing-stair'].exits].sort(), ['kamidana', 'unnecessary-doors']);
  world.enter('kamidana');
  assert.deepEqual([...SCENES.kamidana.exits], ['hushing-stair']);
  assert.equal(world.canEnter('unnecessary-doors'), false);
  for (const id of ['hushing-stair', 'unnecessary-doors', 'waiting-hall', 'counting-house', 'whisper-hedges', 'threshold']) world.enter(id);
  assert.equal(validateSceneRegistry(), true);
});

test('stair residents have optional local authored dialogue and ambient life', () => {
  const story = createKingdom();
  for (const id of ['sotto', 'noise-basket', 'shoe-bench']) {
    const entry = story.meet(id);
    assert.ok(entry.choices.length >= 2);
    for (const choice of entry.choices) assert.ok(story.answer(id, choice.id).text.length > 0);
    assert.notEqual(story.meet(id).text, entry.text);
  }
  // The Kamidana's own residents are untouched.
  assert.equal(story.meet('kamidana-attendant').text, 'You do not have to know your name to rest here.');
  assert.match(story.nextAmbient('hushing-stair'), /Sotto|door|boot|ember/);
});

class Object3D {
  constructor(){this.children=[];this.visible=true;this.position={set:(x,y,z)=>Object.assign(this.position,{x,y,z})};this.rotation={};}
  add(o){if(o.parent)o.parent.children=o.parent.children.filter(child=>child!==o);this.children.push(o);o.parent=this;}
}
class Mesh extends Object3D {constructor(geometry,material){super();this.geometry=geometry;this.material=material;}}
class Value {constructor(...args){this.args=args;}}
const THREE={Group:Object3D,Mesh,BoxGeometry:Value,SphereGeometry:Value,ConeGeometry:Value,CylinderGeometry:Value,
  TorusGeometry:Value,PlaneGeometry:Value,MeshStandardMaterial:Value,MeshBasicMaterial:Value,CanvasTexture:Value,DoubleSide:2};

test('stage factory registers real hotspots, both doors, buttons and safe animations', () => {
  globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},strokeRect(){},fillText(){}})})};
  const stage=makeHushingStair(THREE,{stone:1,hedge:2,road:3,dark:4,orange:5,light:6});
  const stages=Object.fromEntries(Object.keys(SCENES).map(id=>[id,id==='hushing-stair'?stage:{
    group:{visible:false},hotspots:{resident:[{}]},actions:{resident:{type:'notices'}},update(){}
  }]));
  const runtime=createStageRuntime(stages,SCENES);
  assert.equal(stage.group.visible,false);runtime.show('hushing-stair');
  assert.equal(stage.group.visible,true);
  const travel=Object.values(stage.actions).filter(a=>a.type==='travel').map(a=>a.destination).sort();
  assert.deepEqual(travel,['kamidana','unnecessary-doors']);
  for(const [name,roots] of Object.entries(stage.hotspots)){
    assert.ok(roots.every(root=>root.parent===stage.group));
    const child=roots[0].children[0]||roots[0];
    assert.deepEqual(runtime.actionFor('hushing-stair',child),stage.actions[name]);
    if(stage.actions[name].type==='story')assert.ok(SCENES['hushing-stair'].controls.includes(stage.actions[name].id));
  }
  assert.doesNotThrow(()=>runtime.update('hushing-stair',42));
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  for(const id of SCENES['hushing-stair'].controls)assert.match(html,new RegExp(`<button id="${id}"`));
  assert.match(html,/<button id="shrine-return" hidden>← Back down the Hushing Stair</);
  const nav=readFileSync(new URL('../src/navigation.js',import.meta.url),'utf8');
  assert.match(nav,/\['stair-up','kamidana'\],\['stair-return','unnecessary-doors'\]/);
  assert.match(nav,/keepOutDoorButton\.addEventListener\('click',\(\)=>goToScene\('hushing-stair'\)\)/);
  assert.match(nav,/shrineReturnButton\.addEventListener\('click',\(\)=>goToScene\('hushing-stair'\)\)/);
  const ui=readFileSync(new URL('../src/story-ui.js',import.meta.url),'utf8');
  for(const id of ['sotto','noise-basket','shoe-bench'])assert.match(ui,new RegExp(`'${id}'`));
});
