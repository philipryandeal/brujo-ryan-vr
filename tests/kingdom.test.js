import test from 'node:test';
import assert from 'node:assert/strict';
import { createKingdom } from '../src/kingdom.js';

test('Nettle greets first-time and returning visitors differently', () => {
  const world = createKingdom();
  assert.match(world.meet('goblin').text, /wanderer/);
  assert.match(world.meet('goblin').text, /again/);
});

test('all three visible residents have selectable dialogue', () => {
  const world = createKingdom();
  for (const id of ['goblin', 'faerie', 'gate']) {
    const scene = world.meet(id);
    assert.ok(scene.choices.length >= 3);
    assert.ok(world.answer(id, scene.choices[0].id).text.length > 20);
  }
});

test('notices rotate and wrap without a server or identity', () => {
  const world = createKingdom();
  const first = world.nextNotice();
  for (let i = 0; i < 6; i += 1) world.nextNotice();
  assert.deepEqual(world.nextNotice(), first);
});

test('unknown residents and questions fail safely', () => {
  const world = createKingdom();
  assert.throws(() => world.meet('dragon'), /Unknown resident/);
  assert.throws(() => world.answer('goblin', 'taxes'), /Unknown question/);
});
