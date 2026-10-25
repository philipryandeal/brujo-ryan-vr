// A discoverable world, never a map. Only adjacent scene exits are exposed.
export const SCENES = Object.freeze({
  threshold: Object.freeze({
    title: 'The First Threshold',
    exits: Object.freeze(['whisper-hedges'])
  }),
  'whisper-hedges': Object.freeze({
    title: 'The Whisper Hedges',
    exits: Object.freeze(['threshold'])
  })
});

export function createSceneManager(start = 'threshold') {
  if (!SCENES[start]) throw new Error(`Unknown opening scene: ${start}`);
  let current = start;
  return {
    current: () => current,
    canEnter: next => SCENES[current].exits.includes(next),
    enter(next) {
      if (!SCENES[current].exits.includes(next)) {
        throw new Error(`No passage from ${current} to ${next}`);
      }
      current = next;
      return SCENES[current];
    }
  };
}
