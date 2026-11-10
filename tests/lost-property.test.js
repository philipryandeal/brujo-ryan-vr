import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createKingdom, NOTICES} from '../src/kingdom.js';
import {SCENES, createSceneManager, validateSceneRegistry} from '../src/scene-manager.js';
import {makeLostProperty} from '../src/scenes/lost-property.js';
import {createStageRuntime} from '../src/scenes/stage-runtime.js';

test('the hatch behind Mothlight opens on the Lost Property Office, and it leads straight home', () => {
  const world = createSceneManager();
  assert.equal(world.canEnter('lost-property'), true);
  world.enter('lost-property');
  assert.deepEqual([...SCENES['lost-property'].exits], ['threshold']);
  assert.equal(world.canEnter('whisper-hedges'), false);
  world.enter('threshold');
  assert.ok(SCENES.threshold.controls.includes('lost-property-entry'));
  assert.equal(validateSceneRegistry(), true);
});

test('Biscuit, Moldy, the rock and the office can all be spoken to', () => {
  const story = createKingdom();
  for (const id of ['biscuit', 'moldy', 'lawyer-rock', 'unclaimed-shelves', 'fee-schedule']) {
    const entry = story.meet(id);
    assert.ok(entry.choices.length >= 2, `${id} needs at least two replies`);
    for (const choice of entry.choices) {
      const reply = story.answer(id, choice.id);
      assert.ok(reply.text.length > 20);
      assert.equal(reply.destination, undefined);
    }
  }
  assert.match(createKingdom().meet('biscuit').text, /one shiny thing/);
  assert.match(story.answer('biscuit', 'inventory').text, /forty-one invoices/);
  assert.match(createKingdom().meet('lawyer-rock').text, /I want a lawyer/);
  assert.match(story.nextAmbient('lost-property'), /STAMP|Moldy|rock|tag|cash box/);
});

test('the office keeps faith with the existing lore', () => {
  const story = createKingdom();
  // The noticeboard's FOUND notice is what the office actually holds.
  const notices = Array.from({length: NOTICES.length}, () => story.nextNotice().text).join(' ');
  assert.match(notices, /left socks, an abandoned prophecy, and a rock that keeps demanding a lawyer/);
  const shelves = createKingdom().meet('unclaimed-shelves').text;
  assert.match(shelves, /left socks/);
  assert.match(shelves, /prophecy/);
  // Nettle and the Ledger are unchanged, and still name Biscuit.
  assert.match(story.answer('goblin', 'key').text, /Biscuit/);
  assert.match(story.answer('ledger', 'sign').text, /Biscuit is currently Undefeated/);
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
  const stage=makeLostProperty(THREE,palette);
  const stages=Object.fromEntries(Object.keys(SCENES).map(id=>[id,id==='lost-property'?stage:{
    group:{visible:false},hotspots:{resident:[{}]},actions:{resident:{type:'notices'}},update(){}
  }]));
  const runtime=createStageRuntime(stages,SCENES);
  assert.equal(stage.group.visible,false);
  runtime.show('lost-property');
  assert.equal(stage.group.visible,true);
  const travel=Object.values(stage.actions).filter(a=>a.type==='travel').map(a=>a.destination);
  assert.deepEqual(travel,['threshold']);
  for(const [name,roots] of Object.entries(stage.hotspots)){
    assert.ok(roots.every(root=>root.parent===stage.group));
    assert.ok(SCENES['lost-property'].controls.includes(name), `${name} needs an accessible button`);
    assert.deepEqual(runtime.actionFor('lost-property',roots[0].children[0]),stage.actions[name]);
  }
  const allowed=new Set([...Object.values(palette),0xffffff]);
  const walk=o=>{for(const c of o.children){
    for(const key of ['color','emissive'])if(c.material?.[key]!==undefined)assert.ok(allowed.has(c.material[key]),`off-palette ${key} ${c.material[key].toString(16)}`);
    walk(c);
  }};
  walk(stage.group);
  for(const t of [0,1.5,5.7,42,600])assert.doesNotThrow(()=>runtime.update('lost-property',t));
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  for(const id of [...SCENES['lost-property'].controls,'lost-property-entry'])assert.match(html,new RegExp(`<button id="${id}" hidden>`));
  const nav=readFileSync(new URL('../src/navigation.js',import.meta.url),'utf8');
  assert.match(nav,/\['lost-property-entry','lost-property'\],\['lost-property-return','threshold'\]/);
  const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
  assert.match(main,/'lost-property-entry':\{type:'travel',destination:'lost-property'\}/);
});
