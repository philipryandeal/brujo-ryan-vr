import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createKingdom} from '../src/kingdom.js';
import {SCENES,createSceneManager,validateSceneRegistry} from '../src/scene-manager.js';
import {makeSluice} from '../src/scenes/sluice.js';
import {createStageRuntime} from '../src/scenes/stage-runtime.js';

test('the sluice separates the River House from the Moat, with physical returns both ways', () => {
  const world = createSceneManager();
  for (const id of ['whisper-hedges', 'counting-house', 'long-way', 'river-house']) world.enter(id);
  assert.equal(world.canEnter('shoggoth-moat'), false);
  world.enter('sluice');
  assert.deepEqual([...SCENES.sluice.exits].sort(), ['river-house', 'shoggoth-moat']);
  world.enter('shoggoth-moat');
  assert.deepEqual([...SCENES['shoggoth-moat'].exits], ['sluice']);
  assert.equal(world.canEnter('river-house'), false);
  for (const id of ['sluice', 'river-house', 'long-way', 'counting-house', 'whisper-hedges', 'threshold']) world.enter(id);
  assert.equal(validateSceneRegistry(), true);
});

test('the water-gate still opens the same way, now into the sluice', () => {
  const story = createKingdom();
  const passage = story.answer('water-gate', 'enter');
  assert.equal(passage.destination, 'sluice');
  assert.equal(passage.destinationLabel, 'Duck into the Sluice →');
  assert.ok(SCENES['river-house'].exits.includes('sluice'));
  assert.ok(!SCENES['river-house'].exits.includes('shoggoth-moat'));
});

test('sluice residents have optional local authored dialogue and ambient life', () => {
  const story = createKingdom();
  for (const id of ['dabble', 'drying-line', 'rowboat']) {
    const entry = story.meet(id);
    assert.ok(entry.choices.length >= 2);
    for (const choice of entry.choices) assert.ok(story.answer(id, choice.id).text.length > 0);
    assert.notEqual(story.meet(id).text, entry.text);
  }
  // The Moat's residents are untouched.
  for (const id of ['bridge-tender', 'snoring-buoy', 'tax-box']) assert.ok(story.meet(id).choices.length >= 3);
  assert.match(story.nextAmbient('sluice'), /Dabble|paperback|snore|rowboat/);
});

class Object3D {
  constructor(){this.children=[];this.visible=true;this.position={set:(x,y,z)=>Object.assign(this.position,{x,y,z})};this.rotation={};}
  add(o){if(o.parent)o.parent.children=o.parent.children.filter(child=>child!==o);this.children.push(o);o.parent=this;}
}
class Mesh extends Object3D {constructor(geometry,material){super();this.geometry=geometry;this.material=material;}}
class Value {constructor(...args){this.args=args;}}
const THREE={Group:Object3D,Mesh,BoxGeometry:Value,SphereGeometry:Value,ConeGeometry:Value,CylinderGeometry:Value,
  TorusGeometry:Value,PlaneGeometry:Value,MeshStandardMaterial:Value,MeshBasicMaterial:Value,CanvasTexture:Value,DoubleSide:2};

test('stage factory registers real hotspots, both arches, buttons and safe animations', () => {
  globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},strokeRect(){},fillText(){}})})};
  const stage=makeSluice(THREE,{stone:1,hedge:2,road:3,dark:4,orange:5,light:6});
  const stages=Object.fromEntries(Object.keys(SCENES).map(id=>[id,id==='sluice'?stage:{
    group:{visible:false},hotspots:{resident:[{}]},actions:{resident:{type:'notices'}},update(){}
  }]));
  const runtime=createStageRuntime(stages,SCENES);
  assert.equal(stage.group.visible,false);runtime.show('sluice');
  assert.equal(stage.group.visible,true);
  const travel=Object.values(stage.actions).filter(a=>a.type==='travel').map(a=>a.destination).sort();
  assert.deepEqual(travel,['river-house','shoggoth-moat']);
  for(const [name,roots] of Object.entries(stage.hotspots)){
    assert.ok(roots.every(root=>root.parent===stage.group));
    assert.ok(SCENES.sluice.controls.includes(name));
    const child=roots[0].children[0]||roots[0];
    assert.deepEqual(runtime.actionFor('sluice',child),stage.actions[name]);
  }
  assert.doesNotThrow(()=>runtime.update('sluice',42));
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  for(const id of SCENES.sluice.controls)assert.match(html,new RegExp(`<button id="${id}"`));
  assert.match(html,/<button id="moat-return" hidden>← Back through the Sluice</);
  const nav=readFileSync(new URL('../src/navigation.js',import.meta.url),'utf8');
  assert.match(nav,/\['sluice-onward','shoggoth-moat'\],\['sluice-return','river-house'\]/);
  assert.match(nav,/moatReturnButton\.addEventListener\('click',\(\)=>goToScene\('sluice'\)\)/);
  const ui=readFileSync(new URL('../src/story-ui.js',import.meta.url),'utf8');
  for(const id of ['dabble','drying-line','rowboat'])assert.match(ui,new RegExp(`'${id}'`));
  const moat=readFileSync(new URL('../src/scenes/shoggoth-moat.js',import.meta.url),'utf8');
  assert.match(moat,/'moat-return':\{type:'travel',destination:'sluice'\}/);
});
