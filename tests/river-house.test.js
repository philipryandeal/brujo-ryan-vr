import test from 'node:test';
import assert from 'node:assert/strict';
import { createKingdom } from '../src/kingdom.js';
import { createSceneManager, SCENES } from '../src/scene-manager.js';

test('the Bear opened his door from the far side, and it leads somewhere real', () => {
  const world = createKingdom();
  const door = world.meet('bear-door');
  assert.match(door.text, /open now/);
  const enter = world.answer('bear-door', 'enter');
  assert.equal(enter.destination, 'river-house');
  assert.ok(SCENES['counting-house'].exits.includes('river-house'));
});

test('the River House has a way home', () => {
  const route = createSceneManager();
  route.enter('whisper-hedges');
  route.enter('counting-house');
  route.enter('river-house');
  assert.equal(route.canEnter('counting-house'), true);
  assert.equal(route.canEnter('threshold'), false);
});

test('every River House resident can be spoken to', () => {
  const world = createKingdom();
  for (const id of ['quillon', 'river-kettle', 'pell', 'reading-chair', 'sentence-bucket']) {
    const scene = world.meet(id);
    assert.ok(scene.choices.length >= 3, `${id} needs at least three replies`);
    for (const choice of scene.choices) assert.ok(world.answer(id, choice.id).text.length > 0);
  }
});

test('Mrs. Pell is succinct', () => {
  const world = createKingdom();
  assert.equal(world.meet('pell').text, 'You’re late.');
  assert.equal(world.answer('pell', 'late').text, 'Precisely.');
});
