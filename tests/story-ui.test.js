import test from 'node:test';
import assert from 'node:assert/strict';

function fakeElement() {
  const handlers = new Map();
  return {
    hidden: true,
    textContent: '',
    style: {},
    children: [],
    classList: { add() {}, remove() {} },
    addEventListener(event, handler) { handlers.set(event, handler); },
    click() { handlers.get('click')?.(); },
    replaceChildren() { this.children = []; },
    appendChild(child) { this.children.push(child); },
    querySelector(selector) { return selector === 'button' ? this.children[0] : null; },
    focus() { document.activeElement = this; },
    getClientRects() { return [{}]; }
  };
}

const ids = [
  'scene-veil', 'scene-veil-text', 'goblin', 'faerie', 'gate', 'notices',
  'hedge', 'return-gate', 'dialogue', 'speaker', 'speech', 'choices',
  'hint', 'sound', 'reset', 'dismiss', 'begin', 'threshold'
];
const elements = new Map(ids.map(id => [id, fakeElement()]));
const controls = fakeElement();
const subtitle = fakeElement();
globalThis.document = {
  body: { dataset: {}, classList: { add() {} } },
  activeElement: null,
  getElementById: id => elements.get(id),
  querySelector: selector => selector === '.controls' ? controls : subtitle,
  createElement: tag => tag === 'canvas' ? { getContext: () => ({}) } : fakeElement(),
  addEventListener() {}
};
globalThis.window = { matchMedia: () => ({ matches: true }) };
globalThis.setInterval = () => 0;

const { goToScene } = await import('../src/navigation.js');
await import('../src/story-ui.js');

test('the welcome opens into an uninterrupted scene; dialogue waits for a click', () => {
  elements.get('begin').click();
  assert.equal(elements.get('threshold').hidden, true);
  assert.equal(controls.hidden, false);
  assert.equal(elements.get('dialogue').hidden, true);

  elements.get('gate').click();
  assert.equal(elements.get('dialogue').hidden, false);
  assert.equal(elements.get('speaker').textContent, 'The Orange Gate');

  elements.get('dismiss').click();
  assert.equal(elements.get('dialogue').hidden, true);
});

test('the hedges also wait until the visitor initiates a conversation', async () => {
  assert.equal(await goToScene('whisper-hedges', { readMs: 0 }), true);
  assert.equal(elements.get('dialogue').hidden, true);

  elements.get('hedge').click();
  assert.equal(elements.get('dialogue').hidden, false);
  assert.equal(elements.get('speaker').textContent, 'The Hedge, Acting Receptionist');
});
