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
const ids=['scene-veil','scene-veil-text','goblin','faerie','gate','notices','hedge','return-gate'];
const elements=new Map(ids.map(id=>[id,fakeElement()]));
const subtitle=fakeElement();
globalThis.document={
  body:{dataset:{}},
  getElementById:id=>elements.get(id),
  querySelector:selector=>selector==='.subtitle'?subtitle:null
};
globalThis.window={matchMedia:()=>({matches:true})};
const navigation=await import('../src/navigation.js');

test('threshold has an encounter, not a shortcut or map',()=>{
  assert.equal(navigation.TRANSITION_READ_MS,5000);
  assert.equal(navigation.currentScene(),'threshold');
  assert.equal(elements.has('enter-gate'),false);
  assert.equal(elements.get('gate').hidden,false);
  assert.equal(elements.get('return-gate').hidden,true);
});

test('entering hedges swaps the available physical exits and permits return',async()=>{
  const seen=[];
  navigation.onSceneEnter(id=>seen.push(id));
  assert.equal(await navigation.goToScene('whisper-hedges',{readMs:0}),true);
  assert.equal(elements.get('hedge').hidden,false);
  assert.equal(elements.get('gate').hidden,true);
  assert.equal(elements.get('return-gate').hidden,false);
  assert.match(subtitle.textContent,/WHISPER HEDGES/);
  assert.equal(await navigation.goToScene('threshold',{readMs:0}),true);
  assert.deepEqual(seen,['whisper-hedges','threshold']);
  assert.equal(elements.get('scene-veil').hidden,true);
  assert.equal(elements.get('gate').hidden,false);
});
