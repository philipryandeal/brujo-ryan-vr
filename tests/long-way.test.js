import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {constrainWalk} from '../src/walk-bounds.js';
import {createKingdom} from '../src/kingdom.js';
import {SCENES,createSceneManager} from '../src/scene-manager.js';
import {makeLongWay} from '../src/scenes/long-way.js';
import {createStageRuntime} from '../src/scenes/stage-runtime.js';

test('the substantial connector separates both companions, with reciprocal exits',()=>{
  const world=createSceneManager();
  world.enter('whisper-hedges');world.enter('counting-house');
  for(const companion of ['river-house','oracle-room'])assert.equal(world.canEnter(companion),false);
  world.enter('long-way');
  for(const companion of ['river-house','oracle-room']){
    world.enter(companion);world.enter('long-way');
  }
  world.enter('counting-house');world.enter('waiting-hall');world.enter('unnecessary-doors');world.enter('kamidana');
  world.enter('unnecessary-doors');world.enter('waiting-hall');world.enter('counting-house');
  world.enter('whisper-hedges');world.enter('threshold');
});

test('both branches are walkable but the dividing wall and perimeter are solid',()=>{
  assert.deepEqual(constrainWalk('long-way',{x:0,z:-1.6},0,-.37),{x:0,z:-1.6});
  assert.deepEqual(constrainWalk('long-way',{x:-1.4,z:-4},.37,0),{x:-1.4,z:-4});
  assert.deepEqual(constrainWalk('long-way',{x:1.4,z:-4},-.37,0),{x:1.4,z:-4});
  for(const side of [-1,1]){
    let p={x:0,z:10};
    for(let i=0;i<50;i++)p=constrainWalk('long-way',p,0,-.2);
    for(let i=0;i<20;i++)p=constrainWalk('long-way',p,side*.2,0);
    for(let i=0;i<50;i++)p=constrainWalk('long-way',p,0,-.2);
    assert.ok(Math.abs(p.x-side*4)<.001);assert.ok(Math.abs(p.z+10)<.001);
  }
  assert.deepEqual(constrainWalk('long-way',{x:5.8,z:11.4},.37,.37),{x:5.9,z:11.5});
  assert.deepEqual(constrainWalk('river-house',{x:0,z:-4},.2,0),{x:.2,z:-4});
});

test('new discoveries have optional local authored dialogue and ambient life',()=>{
  const story=createKingdom();
  for(const id of ['distance-keeper','borrowed-mile']){
    const entry=story.meet(id);assert.ok(entry.choices.length>=2);
    for(const choice of entry.choices)assert.ok(story.answer(id,choice.id).text.length>0);
  }
  assert.match(story.nextAmbient('long-way'),/boat|bell|Sedge/);
});

// Factory smoke test without a GPU or new production dependencies.
class Object3D {
  constructor(){this.children=[];this.visible=true;this.position={set:(x,y,z)=>Object.assign(this.position,{x,y,z})};this.rotation={};}
  add(o){if(o.parent)o.parent.children=o.parent.children.filter(child=>child!==o);this.children.push(o);o.parent=this;}
}
class Mesh extends Object3D {constructor(geometry,material){super();this.geometry=geometry;this.material=material;}}
class Value {constructor(...args){this.args=args;}}
const THREE={Group:Object3D,Mesh,BoxGeometry:Value,SphereGeometry:Value,ConeGeometry:Value,CylinderGeometry:Value,
  PlaneGeometry:Value,MeshStandardMaterial:Value,MeshBasicMaterial:Value,CanvasTexture:Value,DoubleSide:2};
test('stage factory registers real nested hotspots and safe animations',()=>{
  globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},strokeRect(){},fillText(){}})})};
  const stage=makeLongWay(THREE,{stone:1,hedge:2,road:3,dark:4,orange:5,light:6});
  const stages=Object.fromEntries(Object.keys(SCENES).map(id=>[id,id==='long-way'?stage:{
    group:{visible:false},hotspots:{resident:[{}]},actions:{resident:{type:'notices'}},update(){}
  }]));
  const runtime=createStageRuntime(stages,SCENES);
  assert.equal(stage.group.visible,false);runtime.show('long-way');
  assert.equal(stage.group.visible,true);
  for(const [name,roots] of Object.entries(stage.hotspots)){
    assert.ok(roots.every(root=>root.parent===stage.group));
    const child=roots[0].children[0]||roots[0];
    assert.deepEqual(runtime.actionFor('long-way',child),stage.actions[name]);
    if(stage.actions[name].type==='story')assert.ok(SCENES['long-way'].controls.includes(stage.actions[name].id));
  }
  assert.doesNotThrow(()=>runtime.update('long-way',42));
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  for(const id of SCENES['long-way'].controls)assert.match(html,new RegExp(`<button id="${id}"`));
});
