// Backstage scene manifest. This is NOT a visitor-facing map.
// A steward registers reviewed scenes here after their stage modules are ready.
export const SCENES = Object.freeze({
  threshold: Object.freeze({
    number: '001',
    title: 'The First Threshold',
    exits: Object.freeze(['whisper-hedges']),
    controls: Object.freeze(['goblin', 'faerie', 'gate', 'notices']),
    arrivalText: 'The thread winds home. Nettle is already blaming someone.',
    appearance: Object.freeze({ background: 0x476f95, torch: 0xff5e1f, resetLabel: 'Look to Gate' })
  }),
  'whisper-hedges': Object.freeze({
    number: '002',
    title: 'The Whisper Hedges',
    exits: Object.freeze(['threshold', 'counting-house']),
    controls: Object.freeze(['hedge', 'return-gate', 'counting-gate']),
    arrivalText: 'The Orange Thread unspools. Somewhere, a hedge files a complaint.',
    appearance: Object.freeze({ background: 0x476f95, torch: 0xb9f3a4, resetLabel: 'Look Ahead' })
  }),
  'counting-house': Object.freeze({
    number: '003',
    title: 'The Counting House',
    exits: Object.freeze(['whisper-hedges', 'river-house', 'unnecessary-doors', 'oracle-room']),
    controls: Object.freeze(['ledger', 'nib', 'stamp', 'seven', 'bear-door', 'oracle-door', 'department-door', 'counting-return']),
    arrivalText: 'The Orange Thread is tallied, not tied. Something large and iron is deciding what you owe.',
    appearance: Object.freeze({ background: 0x476f95, torch: 0xff5e1f, resetLabel: 'Look to the Ledger' })
  }),
  'unnecessary-doors': Object.freeze({
    number: '005', title: 'The Department of Unnecessary Doors',
    exits: Object.freeze(['counting-house']),
    controls: Object.freeze(['picklesworth','union-door','office-bell','office-return']),
    arrivalText: 'The orange thread catches on a brass doorknob. A clerk stamps an application nobody submitted.',
    appearance: Object.freeze({background:0x476f95,torch:0xff5e1f,resetLabel:'Look to the Desk'})
  }),
  'oracle-room': Object.freeze({
    number:'006', title:'The Observatory of Second Tuesdays',
    exits:Object.freeze(['counting-house']),
    controls:Object.freeze(['kore','barometer','answer-jar','bell-chime','oracle-return']),
    arrivalText:'A hundred small bells agree to stop talking at once; the air smells of ozone, old almanacs, and a Tuesday that has not happened yet.',
    appearance:Object.freeze({background:0x476f95,torch:0xb9f3a4,resetLabel:'Look to the Astrolabe'})
  }),
  'shoggoth-moat': Object.freeze({
    number:'007',title:'The Shoggoth Moat',exits:Object.freeze(['river-house']),
    controls:Object.freeze(['bridge-tender','snoring-buoy','tax-box','moat-return']),
    arrivalText:'The low stone arch gives way to open night; moonlight silvers the water, the bridge sways with a slow six-second breath, and someone very small whispers at you to mind your shoes.',
    appearance:Object.freeze({background:0x476f95,torch:0xb9f3a4,resetLabel:'Look Along the Bridge'})
  }),
  'river-house': Object.freeze({
    number: '004',
    title: 'The River House',
    exits: Object.freeze(['counting-house','shoggoth-moat']),
    controls: Object.freeze(['quillon', 'river-kettle', 'pell', 'reading-chair', 'sentence-bucket', 'water-gate', 'river-return']),
    arrivalText: 'The Orange Thread dips below the waterline, and somewhere ahead, a kettle clears its throat.',
    appearance: Object.freeze({ background: 0x476f95, torch: 0xb9f3a4, resetLabel: 'Look Downriver' })
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
