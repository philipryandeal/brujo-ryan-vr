import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {createSceneManager, SCENES, validateSceneRegistry} from '../src/scene-manager.js';

test('only discovered adjacent thresholds can be crossed', () => {
  const world=createSceneManager();
  assert.equal(world.current(),'threshold');
  assert.equal(world.canEnter('whisper-hedges'),true);
  assert.equal(world.canEnter('threshold'),false);
  assert.throws(()=>world.enter('some-imaginary-map'),/No passage/);
  world.enter('whisper-hedges');
  assert.equal(world.current(),'whisper-hedges');
  assert.equal(world.canEnter('threshold'),true);
  world.enter('threshold');
  assert.equal(world.current(),'threshold');
});

test('scene registry contains no map or unbuilt destinations', () => {
  assert.deepEqual(Object.keys(SCENES).sort(),['counting-house','oracle-room','river-house','threshold','unnecessary-doors','whisper-hedges']);
  assert.equal(validateSceneRegistry(), true);
  assert.deepEqual(Object.values(SCENES).map(scene => scene.number), ['001', '002', '003', '005', '006', '004']);
});

test('new contributions cannot strand visitors or create duplicate scene numbers', () => {
  const example = (number, exits) => ({
    number, title:'Example', exits, controls:['gate'],
    arrivalText:'A peculiar curtain falls.',
    appearance:{background:0x123b29,torch:0xff6900,resetLabel:'Look Ahead'}
  });
  assert.throws(() => validateSceneRegistry({
    threshold:example('001',['new-place']),
    'new-place':example('002',[])
  }), /No return passage/);
  assert.throws(() => validateSceneRegistry({
    threshold:example('001',['new-place']),
    'new-place':example('001',['threshold'])
  }), /duplicate scene number/);
  assert.throws(() => validateSceneRegistry({
    threshold:example('001',['unbuilt'])
  }), /Unbuilt destination/);
});

test('every registered scene control has a real accessible HTML button', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  for (const room of Object.values(SCENES)) {
    for (const id of room.controls) {
      assert.match(html, new RegExp(`<button\\s+id="${id}"(?:\\s|>)`), `Missing button for ${id}`);
    }
  }
});
