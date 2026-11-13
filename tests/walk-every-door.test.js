// A goblin walks the whole Labyrinth on every check, the way a visitor would:
// through the buttons. In every room it presses every button, asks every
// resident every question, and follows every reply that offers a doorway.
// It fails if a button is missing or dead, a resident is unknown, a reply
// points at a door that will not open, or a registered passage cannot be
// reached from inside its room. (The 3D hotspots are checked by
// stage-runtime.test.js; this walk is the keyboard and text-mode road.)
// Since Philip's ruling of Nov 13, 2026, two Threshold passages — the Lodge
// of Questionable Keys and the Lost Property Office — have no buttons at
// all: their world doors are the only way in. The goblin reads those
// passages from the stage sources below and steps through by the
// registered exits; the hotspots themselves stay guarded by
// stage-runtime.test.js and the two scenes' own tests.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const tags = new Map([...html.matchAll(/<([a-z]+)[^>]*\sid="([^"]+)"/g)].map(m => [m[2], m[1]]));
const STOCK = new Set(['Ask another question', 'Leave them to it', 'Read another notice', 'Back to the Labyrinth']);

function fakeElement(tag = 'div') {
  const handlers = new Map();
  return {
    tag,
    hidden: true,
    textContent: '',
    style: {},
    dataset: {},
    children: [],
    classList: { add() {}, remove() {} },
    addEventListener(event, handler) { handlers.set(event, handler); },
    hasClick() { return handlers.has('click'); },
    click() { handlers.get('click')?.(); },
    replaceChildren() { this.children = []; },
    appendChild(child) { this.children.push(child); },
    querySelector(selector) { return this.children.find(child => child.tag === selector) || null; },
    focus() { document.activeElement = this; },
    getClientRects() { return this.hidden ? [] : [{}]; }
  };
}

const elements = new Map([...tags].map(([id, tag]) => [id, fakeElement(tag)]));
const controls = fakeElement();
const subtitle = fakeElement();
globalThis.document = {
  body: fakeElement('body'),
  activeElement: null,
  getElementById: id => elements.get(id),
  querySelector: selector => selector === '.controls' ? controls : subtitle,
  createElement: tag => tag === 'canvas' ? { getContext: () => ({}) } : fakeElement(tag),
  addEventListener() {}
};
globalThis.window = { matchMedia: () => ({ matches: true }) };
globalThis.setInterval = () => 0;

const { SCENES } = await import('../src/scene-manager.js');
const { goToScene, currentScene } = await import('../src/navigation.js');
await import('../src/story-ui.js');

// Passages a room's own stage offers as clickable world doors, read from the
// stage sources (the Threshold stage lives in main.js; the rest live in
// src/scenes/<room>.js). Only destinations the registry calls passages count.
const worldDoors = new Map();
for (const id of Object.keys(SCENES)) {
  const url = id === 'threshold'
    ? new URL('../src/main.js', import.meta.url)
    : new URL(`../src/scenes/${id}.js`, import.meta.url);
  let source = '';
  try { source = fs.readFileSync(url, 'utf8'); } catch { /* a room with no stage file offers no world doors here */ }
  const doors = new Set();
  for (const match of source.matchAll(/type:\s*['"]travel['"],\s*destination:\s*['"]([^'"]+)['"]/g)) {
    if (SCENES[id].exits.includes(match[1])) doors.add(match[1]);
  }
  worldDoors.set(id, doors);
}

const panel = () => elements.get('choices').children;
const dialogue = elements.get('dialogue');

// Doors hold the five-second reading pause. The walking goblin reads faster.
async function settle() {
  for (let i = 0; i < 30; i += 1) await new Promise(resolve => setImmediate(resolve));
}

// Step back to a room along registered passages (not by teleporting).
async function returnTo(room) {
  while (currentScene() !== room) {
    const from = currentScene();
    const seen = new Map([[from, null]]);
    const queue = [from];
    while (queue.length && !seen.has(room)) {
      const here = queue.shift();
      for (const next of SCENES[here].exits) if (!seen.has(next)) { seen.set(next, here); queue.push(next); }
    }
    assert.ok(seen.has(room), `no passage from ${from} back to ${room}`);
    let step = room;
    while (seen.get(step) !== from) step = seen.get(step);
    assert.equal(await goToScene(step, { readMs: 0 }), true, `${from} -> ${step}`);
  }
  dialogue.hidden = true;
}

test('a goblin walks every room, presses every button and follows every doorway reply', async () => {
  const realSetTimeout = globalThis.setTimeout;
  globalThis.setTimeout = fn => setImmediate(fn);
  try {
    const reached = new Set(['threshold']);
    const pending = ['threshold'];
    const doorsUsed = new Map();
    let buttons = 0;
    let replies = 0;
    while (pending.length) {
      const room = pending.shift();
      doorsUsed.set(room, new Set());
      const arrive = async (label, before) => {
        await settle();
        const now = currentScene();
        if (now === before) return false;
        assert.ok(SCENES[room].exits.includes(now), `${label} in ${room} led to ${now}, not one of its passages`);
        doorsUsed.get(room).add(now);
        if (!reached.has(now)) { reached.add(now); pending.push(now); }
        await returnTo(room);
        return true;
      };
      await returnTo(room);
      for (const next of worldDoors.get(room) ?? []) {
        doorsUsed.get(room).add(next);
        if (!reached.has(next)) { reached.add(next); pending.push(next); }
      }
      for (const id of SCENES[room].controls) {
        const element = elements.get(id);
        assert.ok(element, `${room}: no #${id} in index.html`);
        assert.equal(element.hidden, false, `${room}: #${id} is hidden in its own room`);
        buttons += 1;
        if (element.tag === 'a') {
          assert.match(html, new RegExp(`id="${id}"[^>]*href="https://`), `${room}: link #${id} has no address`);
          continue;
        }
        assert.ok(element.hasClick(), `${room}: #${id} does nothing when pressed`);
        dialogue.hidden = true;
        element.click();
        if (await arrive(`#${id}`, room)) continue;
        assert.equal(dialogue.hidden, false, `${room}: #${id} neither opens a door nor speaks`);
        assert.ok(elements.get('speaker').textContent, `${room}: #${id} speaks without a name`);
        if (id === 'notices') continue;
        const questions = panel().map(choice => choice.textContent);
        assert.ok(questions.length > 0, `${room}: #${id} has nothing to ask`);
        for (const question of questions) {
          dialogue.hidden = true;
          element.click();
          const choice = panel().find(item => item.textContent === question);
          choice.click();
          replies += 1;
          assert.ok(elements.get('speech').textContent, `${room}: #${id} / ${question} has no reply`);
          for (const offer of panel().filter(item => !STOCK.has(item.textContent))) {
            if (offer.tag === 'a') continue;
            offer.click();
            assert.ok(await arrive(`#${id} / ${question}`, room), `${room}: #${id} / ${question} offers "${offer.textContent}" but that door will not open`);
          }
        }
      }
    }
    assert.deepEqual([...reached].sort(), Object.keys(SCENES).sort(), 'every registered room can be reached from the Threshold, by buttons or by world doors');
    for (const [room, used] of doorsUsed) {
      for (const exit of SCENES[room].exits) assert.ok(used.has(exit), `${room} lists a passage to ${exit}, but no button, reply or world door there opens it`);
    }
    assert.ok(buttons >= 80 && replies >= 150, `walked ${buttons} buttons and ${replies} replies`);
  } finally {
    globalThis.setTimeout = realSetTimeout;
  }
});
