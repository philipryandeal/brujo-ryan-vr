import test from 'node:test';
import assert from 'node:assert/strict';
import {createSceneManager, SCENES} from '../src/scene-manager.js';

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
  assert.deepEqual(Object.keys(SCENES).sort(),['threshold','whisper-hedges']);
});
