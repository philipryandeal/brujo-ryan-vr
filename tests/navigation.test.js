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
const ids=['scene-veil','scene-veil-text','goblin','faerie','gate','notices','hedge','return-gate','long-way-entry','long-way-return','bear-door','oracle-door','distance-keeper','borrowed-mile','oracle-return','river-return'];
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
  assert.equal(elements.get('scene-veil-text').textContent,'The Orange Thread unspools. Somewhere, a hedge files a complaint.');
  assert.equal(elements.get('hedge').hidden,false);
  assert.equal(elements.get('gate').hidden,true);
  assert.equal(elements.get('return-gate').hidden,false);
  assert.match(subtitle.textContent,/WHISPER HEDGES/);
  assert.equal(await navigation.goToScene('threshold',{readMs:0}),true);
  assert.equal(elements.get('scene-veil-text').textContent,'The thread winds home. Nettle is already blaming someone.');
  assert.deepEqual(seen,['whisper-hedges','threshold']);
  assert.equal(elements.get('scene-veil').hidden,true);
  assert.equal(elements.get('gate').hidden,false);
});


test('connector controls and both companion returns follow the new physical passages',async()=>{
  await navigation.goToScene('whisper-hedges',{readMs:0});
  await navigation.goToScene('counting-house',{readMs:0});
  assert.equal(elements.get('long-way-entry').hidden,false);
  assert.equal(elements.get('bear-door').hidden,true);
  assert.equal(await navigation.goToScene('river-house',{readMs:0}),false);
  await navigation.goToScene('long-way',{readMs:0});
  assert.equal(elements.get('long-way-entry').hidden,true);
  assert.equal(elements.get('distance-keeper').hidden,false);
  assert.equal(elements.get('bear-door').hidden,false);
  for(const room of ['river-house','oracle-room']){
    assert.equal(await navigation.goToScene(room,{readMs:0}),true);
    assert.equal(await navigation.goToScene('counting-house',{readMs:0}),false);
    assert.equal(await navigation.goToScene('long-way',{readMs:0}),true);
  }
  assert.equal(await navigation.goToScene('counting-house',{readMs:0}),true);
  assert.equal(elements.get('distance-keeper').hidden,true);
  assert.equal(navigation.TRANSITION_READ_MS,5000);
});
