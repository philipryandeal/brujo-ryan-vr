import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createKingdom} from '../src/kingdom.js';
import {SCENES,createSceneManager,validateSceneRegistry} from '../src/scene-manager.js';
import {makeWeatherCloset} from '../src/scenes/weather-closet.js';
import {createStageRuntime} from '../src/scenes/stage-runtime.js';

test('Weather Closet is a real side room with one honest way home', () => {
  const world=createSceneManager();
  world.enter('whisper-hedges');
  world.enter('counting-house');
  world.enter('waiting-hall');
  world.enter('unnecessary-doors');
  assert.equal(world.canEnter('weather-closet'),true);
  world.enter('weather-closet');
  assert.deepEqual([...SCENES['weather-closet'].exits],['unnecessary-doors']);
  assert.equal(world.canEnter('kamidana'),false);
  world.enter('unnecessary-doors');
  assert.equal(validateSceneRegistry(),true);
});

test('Mizzle, Tuesday, and the umbrella stand have optional authored dialogue', () => {
  const story=createKingdom();
  for(const id of ['mizzle','tuesday-jar','umbrella-stand']){
    const entry=story.meet(id);
    assert.ok(entry.choices.length>=3);
    for(const choice of entry.choices)assert.ok(story.answer(id,choice.id).text.length>0);
  }
  assert.match(story.nextAmbient('weather-closet'),/storm|Mizzle|drizzle|umbrella|rumble/i);
});

class Object3D {
  constructor(){this.children=[];this.visible=true;this.position={set:(x,y,z)=>Object.assign(this.position,{x,y,z})};this.rotation={};}
  add(o){if(o.parent)o.parent.children=o.parent.children.filter(child=>child!==o);this.children.push(o);o.parent=this;}
}
class Mesh extends Object3D {constructor(geometry,material){super();this.geometry=geometry;this.material=material;}}
class Value {constructor(...args){this.args=args;}}
const THREE={Group:Object3D,Mesh,BoxGeometry:Value,SphereGeometry:Value,ConeGeometry:Value,CylinderGeometry:Value,
  PlaneGeometry:Value,MeshStandardMaterial:Value,MeshBasicMaterial:Value,CanvasTexture:Value,DoubleSide:2};

test('Weather Closet stage exposes three discoveries and the real return door', () => {
  globalThis.document={createElement:()=>({getContext:()=>({fillStyle:'',strokeStyle:'',lineWidth:0,font:'',textAlign:'',fillRect(){},strokeRect(){},fillText(){}})})};
  const stage=makeWeatherCloset(THREE,{stone:1,hedge:2,road:3,dark:4,orange:5,light:6});
  assert.equal(stage.group.visible,false);
  assert.deepEqual(Object.keys(stage.hotspots).sort(),['mizzle','tuesday-jar','umbrella-stand','weather-return']);
  assert.deepEqual(stage.actions['weather-return'],{type:'travel',destination:'unnecessary-doors'});
  for(const id of ['mizzle','tuesday-jar','umbrella-stand'])assert.deepEqual(stage.actions[id],{type:'story',id});
  assert.doesNotThrow(()=>stage.update(42));

  const stages=Object.fromEntries(Object.keys(SCENES).map(id=>[id,id==='weather-closet'?stage:{
    group:{visible:false},hotspots:{resident:[{}]},actions:{resident:{type:'notices'}},update(){}
  }]));
  const runtime=createStageRuntime(stages,SCENES);
  runtime.show('weather-closet');
  assert.equal(stage.group.visible,true);

  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  for(const id of SCENES['weather-closet'].controls)assert.match(html,new RegExp(`<button id="${id}"`));
  assert.match(html,/<button id="weather-entry" hidden>The Weather Storage Door/);
});
