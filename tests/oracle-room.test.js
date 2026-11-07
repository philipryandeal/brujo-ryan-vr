import test from 'node:test';
import assert from 'node:assert/strict';
import {createKingdom} from '../src/kingdom.js';
import {createSceneManager,SCENES} from '../src/scene-manager.js';

test('Kore has opened the existing Oracle door',()=>{
  const kingdom=createKingdom();
  assert.match(kingdom.meet('oracle-door').text,/Kore/);
  const enter=kingdom.answer('oracle-door','enter');
  assert.equal(enter.destination,'oracle-room');
  assert.equal(enter.destinationLabel,'Enter the Observatory →');
});
test('Observatory return goes back through the Long Way Between',()=>{
  const world=createSceneManager();
  world.enter('whisper-hedges');
  world.enter('counting-house');
  world.enter('long-way');
  world.enter('oracle-room');
  assert.equal(world.canEnter('long-way'),true);
  assert.equal(world.canEnter('river-house'),false);
  world.enter('long-way');
  assert.equal(SCENES['oracle-room'].number,'006');
});
test('The four Observatory residents all have authored answers',()=>{
  const kingdom=createKingdom();
  for(const id of ['kore','barometer','answer-jar','bell-chime']){
    const entry=kingdom.meet(id);
    assert.ok(entry.choices.length>=3,id);
    for(const choice of entry.choices)assert.ok(kingdom.answer(id,choice.id).text.length>0);
  }
});
