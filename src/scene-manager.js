// Backstage scene manifest. This is NOT a visitor-facing map.
// A steward registers reviewed scenes here after their stage modules are ready.
export const SCENES = Object.freeze({
  threshold: Object.freeze({
    number: '001',
    title: 'The First Threshold',
    exits: Object.freeze(['whisper-hedges']),
    controls: Object.freeze(['goblin', 'faerie', 'gate', 'notices']),
    arrivalText: 'The thread winds home. Nettle is already blaming someone.',
    appearance: Object.freeze({ background: 0x303636, torch: 0xff5e1f, resetLabel: 'Look to Gate' })
  }),
  'whisper-hedges': Object.freeze({
    number: '002',
    title: 'The Whisper Hedges',
    exits: Object.freeze(['threshold']),
    controls: Object.freeze(['hedge', 'return-gate']),
    arrivalText: 'The Orange Thread unspools. Somewhere, a hedge files a complaint.',
    appearance: Object.freeze({ background: 0x303636, torch: 0xb9f3a4, resetLabel: 'Look Ahead' })
  })
});

// Every registered scene must lead back to the threshold by real passages.
export function validateSceneRegistry(registry = SCENES, start = 'threshold') {
  if (!registry[start]) throw new Error(`Unknown opening scene: ${start}`);
  const numbers = new Set();
  for (const [id, room] of Object.entries(registry)) {
    if (!/^[a-z][a-z0-9-]*$/.test(id)) throw new Error(`Invalid scene ID: ${id}`);
    if (!/^\d{3}$/.test(room.number) || numbers.has(room.number)) throw new Error(`Invalid or duplicate scene number: ${id}`);
    numbers.add(room.number);
    if (!room.title || !Array.isArray(room.exits) || !Array.isArray(room.controls)) throw new Error(`Incomplete scene: ${id}`);
    if (!room.appearance || !room.arrivalText) throw new Error(`Missing presentation metadata: ${id}`);
    if (new Set(room.controls).size !== room.controls.length || new Set(room.exits).size !== room.exits.length) {
      throw new Error(`Duplicate buttons or passages in ${id}`);
    }
    for (const next of room.exits) if (!registry[next]) throw new Error(`Unbuilt destination ${next} from ${id}`);
  }
  for (const id of Object.keys(registry)) {
    const visited = new Set();
    const reachesHome = from => {
      if (from === start) return true;
      if (visited.has(from)) return false;
      visited.add(from);
      return registry[from].exits.some(reachesHome);
    };
    if (!reachesHome(id)) throw new Error(`No return passage from ${id} to ${start}`);
  }
  return true;
}

export function createSceneManager(start = 'threshold', registry = SCENES) {
  validateSceneRegistry(registry, start);
  let current = start;
  return {
    current: () => current,
    canEnter: next => registry[current].exits.includes(next),
    enter(next) {
      if (!registry[current].exits.includes(next)) {
        throw new Error(`No passage from ${current} to ${next}`);
      }
      current = next;
      return registry[current];
    }
  };
}
