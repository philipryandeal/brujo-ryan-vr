import test from 'node:test';
import assert from 'node:assert/strict';

const fakeElement = () => ({
  hidden:false,
  textContent:'',
  handlers:new Map(),
  classes:new Set(),
  addEventListener(event, fn){this.handlers.set(event,fn);},
  classList:{add(){},remove(){}}
});
const ids=['scene-veil','scene-veil-text','goblin','faerie','gate','notices','enter-gate','hedge','return-gate'];
const elements=new Map(ids.map(id=>[id,fakeElement()]));
const subtitle=fakeElement();
globalThis.document={
  body:{dataset:{}},
  getElementById:id=>elements.get(id),
  querySelector:selector=>selector==='.subtitle'?subtitle:null
};
globalThis.window={matchMedia:()=>({matches:true})};
const navigation=await import('../src/navigation.js');

test('threshold exposes an entrance without a map',()=>{
  assert.equal(navigation.currentScene(),'threshold');
  assert.equal(elements.get('enter-gate').hidden,false);
  assert.equal(elements.get('return-gate').hidden,true);
});

test('entering hedges swaps the available physical exits and permits return',async()=>{
  const seen=[];
  navigation.onSceneEnter(id=>seen.push(id));
  assert.equal(await navigation.goToScene('whisper-hedges'),true);
  assert.equal(elements.get('hedge').hidden,false);
  assert.equal(elements.get('enter-gate').hidden,true);
  assert.equal(elements.get('return-gate').hidden,false);
  assert.match(subtitle.textContent,/WHISPER HEDGES/);
  assert.equal(await navigation.goToScene('threshold'),true);
  assert.deepEqual(seen,['whisper-hedges','threshold']);
  assert.equal(elements.get('scene-veil').hidden,true);
  assert.equal(elements.get('enter-gate').hidden,false);
});
