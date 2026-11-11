import test from 'node:test';
import assert from 'node:assert/strict';
import {createKingdom} from '../src/kingdom.js';
import {createSceneManager,SCENES,validateSceneRegistry} from '../src/scene-manager.js';

test('River House water-gate reaches the real Shoggoth Moat by way of the Sluice',()=>{
 const k=createKingdom();const passage=k.answer('water-gate','enter');
 assert.equal(passage.destination,'sluice');
 assert.equal(passage.destinationLabel,'Duck into the Sluice →');
 assert.ok(SCENES['river-house'].exits.includes('sluice'));
 assert.ok(SCENES.sluice.exits.includes('shoggoth-moat'));
});
test('Moat has a reciprocal return without exposing unrelated shortcuts',()=>{
 const w=createSceneManager();w.enter('whisper-hedges');w.enter('counting-house');w.enter('long-way');w.enter('river-house');w.enter('sluice');w.enter('shoggoth-moat');
 assert.equal(w.canEnter('sluice'),true);assert.equal(w.canEnter('river-house'),false);assert.equal(w.canEnter('counting-house'),false);
 w.enter('sluice');w.enter('river-house');assert.equal(validateSceneRegistry(),true);
});
test('All three moat residents have dialogue',()=>{
 const k=createKingdom();
 for(const id of ['bridge-tender','snoring-buoy','tax-box']){
  const meet=k.meet(id);assert.ok(meet.choices.length>=3);
  for(const choice of meet.choices)assert.ok(k.answer(id,choice.id).text);
 }
});
