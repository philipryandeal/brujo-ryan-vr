import test from 'node:test';
import assert from 'node:assert/strict';
import { SCENES } from '../src/scene-manager.js';
import { createStageRuntime } from '../src/scenes/stage-runtime.js';

function makeStages() {
  const goblin = { parent: null };
  const portal = { parent: null };
  const ledger = { parent: null };
  const otter = { parent: null };
  const clerk = { parent: null };
  const kore = { parent: null };
  const bridgeTender = { parent: null };
  return {
    threshold: {
      group: { visible: true },
      hotspots: { goblin: [goblin] },
      actions: { goblin: { type: 'story', id: 'goblin' } },
      update() {}
    },
    'whisper-hedges': {
      group: { visible: false },
      hotspots: { portal: [portal] },
      actions: { portal: { type: 'travel', destination: 'threshold' } },
      update() {}
    },
    'counting-house': {
      group: { visible: false },
      hotspots: { ledger: [ledger] },
      actions: { ledger: { type: 'story', id: 'ledger' } },
      update() {}
    },
    'river-house': {
      group: { visible: false },
      hotspots: { otter: [otter] },
      actions: { otter: { type: 'story', id: 'quillon' } },
      update() {}
    },
    'unnecessary-doors': {
      group: { visible: false },
      hotspots: { clerk: [clerk] },
      actions: { clerk: { type: 'story', id: 'picklesworth' } },
      update() {}
    },
    'oracle-room': {
      group: { visible: false },
      hotspots: { kore: [kore] },
      actions: { kore: { type: 'story', id: 'kore' } },
      update() {}
    },
    'shoggoth-moat': {
      group: { visible: false },
      hotspots: { bridgeTender: [bridgeTender] },
      actions: { bridgeTender: { type: 'travel', destination: 'river-house' } },
      update() {}
    }
  };
}

test('the test stages cover every registered scene', () => {
  assert.deepEqual(Object.keys(makeStages()).sort(), Object.keys(SCENES).sort());
});

test('a stage brings only its own geometry forward and resolves nested clicks', () => {
  const stages = makeStages();
  const runtime = createStageRuntime(stages, SCENES);
  const goblinChild = { parent: stages.threshold.hotspots.goblin[0] };
  assert.deepEqual(runtime.actionFor('threshold', goblinChild), { type: 'story', id: 'goblin' });
  assert.equal(runtime.actionFor('threshold', { parent: null }), null);
  runtime.show('whisper-hedges');
  assert.equal(stages.threshold.group.visible, false);
  assert.equal(stages['whisper-hedges'].group.visible, true);
  assert.deepEqual(runtime.roots('whisper-hedges'), stages['whisper-hedges'].hotspots.portal);
});

test('an unregistered scene or imaginary doorway is rejected before the world starts', () => {
  const missingScene = makeStages();
  delete missingScene['whisper-hedges'];
  assert.throws(() => createStageRuntime(missingScene, SCENES), /exactly one stage/);

  const fantasyExit = makeStages();
  fantasyExit['whisper-hedges'].actions.portal.destination = 'not-a-real-place';
  assert.throws(() => createStageRuntime(fantasyExit, SCENES), /Unregistered passage/);

  const missingAction = makeStages();
  missingAction.threshold.actions = {};
  assert.throws(() => createStageRuntime(missingAction, SCENES), /unmatched stage hotspots/);
});
