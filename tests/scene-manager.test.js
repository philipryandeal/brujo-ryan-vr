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
  assert.deepEqual(Object.keys(SCENES).sort(),['counting-house','heart-tree','hushing-stair','kamidana','long-way','lost-property','oracle-room','questionable-keys','river-house','shoggoth-moat','sluice','threshold','topiary-parlour','unnecessary-doors','waiting-hall','weather-closet','whisper-hedges']);
  assert.equal(validateSceneRegistry(), true);
  assert.deepEqual(Object.values(SCENES).map(scene => scene.number), ['001', '002', '003', '005', '006', '007', '008', '009', '010', '011', '004', '013', '012', '014', '015', '016', '017']);
});

test('new contributions cannot strand visitors or create duplicate scene numbers', () => {
  const example = (number, exits) => ({
    number, title:'Example', exits, controls:['gate'],
    arrivalText:'A peculiar curtain falls.', setting:'outdoor',
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

test('every scene declares whether the snore may be heard there', () => {
  const settings = Object.fromEntries(Object.entries(SCENES).map(([id, room]) => [id, room.setting]));
  assert.deepEqual(settings, {
    threshold: 'outdoor',
    'whisper-hedges': 'outdoor',
    'counting-house': 'outdoor',
    'unnecessary-doors': 'indoor',
    'oracle-room': 'outdoor',
    'shoggoth-moat': 'outdoor',
    kamidana: 'indoor',
    'long-way': 'outdoor',
    'questionable-keys': 'indoor',
    'waiting-hall': 'indoor',
    'river-house': 'outdoor',
    'weather-closet': 'indoor',
    'heart-tree': 'indoor',
    'lost-property': 'indoor',
    'hushing-stair': 'indoor',
    sluice: 'indoor',
    'topiary-parlour': 'outdoor'
  });
  const withoutSetting = (number, exits) => ({
    number, title: 'Example', exits, controls: ['gate'],
    arrivalText: 'A peculiar curtain falls.',
    appearance: { background: 0x123b29, torch: 0xff6900, resetLabel: 'Look Ahead' }
  });
  assert.throws(() => validateSceneRegistry({
    threshold: withoutSetting('001', ['new-place']),
    'new-place': { ...withoutSetting('002', ['threshold']), setting: 'outdoor' }
  }), /Missing or invalid setting/);
});

test('the snore sounds only outdoors; the tremor only at the Threshold, and never against reduced motion', () => {
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(main, /SCENES\[here\]\.setting==='outdoor'&&elapsed-lastSnore>17/);
  assert.match(main, /snore\(\)&&here==='threshold'&&!prefersReducedMotion\(\)\)shaking=2\.7/);
  assert.match(main, /prefers-reduced-motion: reduce/);
});

test('every registered scene control has a real accessible HTML control', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  for (const room of Object.values(SCENES)) {
    for (const id of room.controls) {
      assert.match(
        html,
        new RegExp(`<(?:button\\s+id=\"${id}\"(?:\\s|>)|a\\s+id=\"${id}\"\\s+href=\"[^\"]+\")`),
        `Missing accessible control for ${id}`
      );
    }
  }
});
