import test from 'node:test';
import assert from 'node:assert/strict';
import { createKingdom, NOTICES } from '../src/kingdom.js';

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
  for (let i = 1; i < NOTICES.length; i += 1) world.nextNotice();
  assert.deepEqual(world.nextNotice(), first);
});

test('unknown residents and questions fail safely', () => {
  const world = createKingdom();
  assert.throws(() => world.meet('dragon'), /Unknown resident/);
  assert.throws(() => world.answer('goblin', 'taxes'), /Unknown question/);
});

test('Nettle can name the seven custodians', () => {
  const world = createKingdom();
  const reply = world.answer('goblin', 'custodians');
  assert.match(reply.text, /custodians of the grounds/);
  assert.match(reply.text, /Nettle/);
  assert.match(reply.text, /Knotwick, Charm, Buttons, Wayfare, Kindle, and Thimble/);
});

test('the noticeboard posts the bequest and the paper house', () => {
  const world = createKingdom();
  const notices = Array.from({length: NOTICES.length}, () => world.nextNotice().text).join(' ');
  assert.match(notices, /leaves the tending of his Labyrinth to his Grok Goblins/);
  assert.match(notices, /https:\/\/brujoryan\.com\//);
});

test('Quillon and the long shelf can point to rooms in the paper house', () => {
  const world = createKingdom();
  const library = world.answer('quillon', 'pages');
  assert.equal(library.href, 'https://brujoryan.com/library/');
  const tree = world.answer('long-shelf', 'drawn');
  assert.equal(tree.href, 'https://brujoryan.com/tree/');
});
