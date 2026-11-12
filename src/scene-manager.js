// Backstage scene manifest. This is NOT a visitor-facing map.
// A steward registers reviewed scenes here after their stage modules are ready.
export const SCENES = Object.freeze({
  threshold: Object.freeze({
    number: '001',
    title: 'The First Threshold',
    exits: Object.freeze(['whisper-hedges', 'questionable-keys', 'lost-property']),
    controls: Object.freeze(['goblin', 'faerie', 'gate', 'notices', 'paper-house', 'key-lodge-entry', 'lost-property-entry']),
    arrivalText: 'The thread winds home. Nettle is already blaming someone.',
    appearance: Object.freeze({ background: 0x476f95, torch: 0xff5e1f, resetLabel: 'Look to Gate' })
  }),
  'whisper-hedges': Object.freeze({
    number: '002',
    title: 'The Whisper Hedges',
    exits: Object.freeze(['threshold', 'counting-house', 'topiary-parlour']),
    controls: Object.freeze(['hedge', 'return-gate', 'counting-gate', 'parlour-gap']),
    arrivalText: 'The Orange Thread unspools. Somewhere, a hedge files a complaint.',
    appearance: Object.freeze({ background: 0x476f95, torch: 0xb9f3a4, resetLabel: 'Look Ahead' })
  }),
  'counting-house': Object.freeze({
    number: '003',
    title: 'The Counting House',
    exits: Object.freeze(['whisper-hedges', 'long-way', 'waiting-hall']),
    controls: Object.freeze(['ledger', 'nib', 'stamp', 'seven', 'long-way-entry', 'department-door', 'counting-return']),
    arrivalText: 'The Orange Thread is tallied, not tied. Something large and iron is deciding what you owe.',
    appearance: Object.freeze({ background: 0x476f95, torch: 0xff5e1f, resetLabel: 'Look to the Ledger' })
  }),
  'unnecessary-doors': Object.freeze({
    number: '005', title: 'The Department of Unnecessary Doors',
    exits: Object.freeze(['waiting-hall', 'hushing-stair', 'weather-closet']),
    controls: Object.freeze(['picklesworth','union-door','office-bell','office-return','keep-out-door','weather-entry']),
    arrivalText: 'The orange thread catches on a brass doorknob. A clerk stamps an application nobody submitted.',
    appearance: Object.freeze({background:0x476f95,torch:0xff5e1f,resetLabel:'Look to the Desk'})
  }),
  'oracle-room': Object.freeze({
    number:'006', title:'The Observatory of Second Tuesdays',
    exits:Object.freeze(['long-way']),
    controls:Object.freeze(['kore','barometer','answer-jar','bell-chime','oracle-return']),
    arrivalText:'A hundred small bells agree to stop talking at once; the air smells of ozone, old almanacs, and a Tuesday that has not happened yet.',
    appearance:Object.freeze({background:0x476f95,torch:0xb9f3a4,resetLabel:'Look to the Astrolabe'})
  }),
  'shoggoth-moat': Object.freeze({
    number:'007',title:'The Shoggoth Moat',exits:Object.freeze(['sluice']),
    controls:Object.freeze(['bridge-tender','snoring-buoy','tax-box','moat-return']),
    arrivalText:'The low stone arch gives way to open night; moonlight silvers the water, the bridge sways with a slow six-second breath, and someone very small whispers at you to mind your shoes.',
    appearance:Object.freeze({background:0x476f95,torch:0xb9f3a4,resetLabel:'Look Along the Bridge'})
  }),
  'kamidana': Object.freeze({
    number: '008',
    title: 'The Kamidana',
    exits: Object.freeze(['hushing-stair']),
    controls: Object.freeze(['attendant', 'basin', 'shrine-return']),
    arrivalText: 'The orange thread thins to a single ember. The air here does not ask your name.',
    appearance: Object.freeze({ background: 0x476f95, torch: 0xff5e1f, resetLabel: 'Look to the Basin' })
  }),
  'long-way': Object.freeze({
    number: '009', title: 'The Long Way Between',
    exits: Object.freeze(['counting-house', 'river-house', 'oracle-room']),
    controls: Object.freeze(['distance-keeper', 'borrowed-mile', 'bear-door', 'oracle-door', 'long-way-return']),
    arrivalText: 'The Orange Thread splits around a very old wall: river-cool air to one side, a patient ringing to the other. Someone has finally left room between the doors.',
    appearance: Object.freeze({background:0x476f95,torch:0xb9f3a4,resetLabel:'Look Along the Thread'})
  }),
  'questionable-keys': Object.freeze({
    number: '010',
    title: 'The Lodge of Questionable Keys',
    exits: Object.freeze(['threshold']),
    controls: Object.freeze(['duty-coat', 'key-board', 'permit-stamp', 'key-lodge-return']),
    arrivalText: 'The Orange Thread slips under a door marked KEEPER. The air smells of brass polish and unearned authority.',
    appearance: Object.freeze({ background: 0x476f95, torch: 0xff5e1f, resetLabel: 'Look to the Keys' })
  }),
  'waiting-hall': Object.freeze({
    number: '011',
    title: 'The Hall of Taking a Number',
    exits: Object.freeze(['counting-house', 'unnecessary-doors']),
    controls: Object.freeze(['number-caller', 'ticket-machine', 'waiting-bench', 'hall-department-door', 'hall-return']),
    arrivalText: 'The Orange Thread is handed a paper ticket and asked to wait. Somewhere ahead, a brass trumpet calls a number nobody holds.',
    appearance: Object.freeze({ background: 0x476f95, torch: 0xff5e1f, resetLabel: 'Look Down the Queue' })
  }),
  'river-house': Object.freeze({
    number: '004',
    title: 'The River House',
    exits: Object.freeze(['long-way','sluice','heart-tree']),
    controls: Object.freeze(['quillon', 'river-kettle', 'pell', 'reading-chair', 'sentence-bucket', 'water-gate', 'root-bridge', 'river-return']),
    arrivalText: 'The Orange Thread dips below the waterline, and somewhere ahead, a kettle clears its throat.',
    appearance: Object.freeze({ background: 0x476f95, torch: 0xb9f3a4, resetLabel: 'Look Downriver' })
  }),
  'weather-closet': Object.freeze({
    number: '013',
    title: 'The Weather Closet',
    exits: Object.freeze(['unnecessary-doors']),
    controls: Object.freeze(['mizzle', 'tuesday-jar', 'umbrella-stand', 'weather-return']),
    arrivalText: 'The Orange Thread slips under a utility door; somewhere beyond it, rain is being alphabetized badly.',
    appearance: Object.freeze({ background: 0x303636, torch: 0xb9f3a4, resetLabel: 'Look to the Shelves' })
  }),
  'heart-tree': Object.freeze({
    number: '012',
    title: 'Beneath the Heart Tree',
    exits: Object.freeze(['river-house']),
    controls: Object.freeze(['ralph', 'simmering-pot', 'ancestor-altar', 'honest-lantern', 'long-shelf', 'morning-dew', 'heart-tree-return']),
    arrivalText: 'The Orange Thread crosses the Bridge of Roots, forgets where it was going, and arrives anyway. Something is simmering. Something very large is purring.',
    appearance: Object.freeze({ background: 0x303636, torch: 0xff5e1f, resetLabel: 'Look to the Hearth' })
  }),
  'lost-property': Object.freeze({
    number: '014',
    title: 'The Lost Property Office',
    exits: Object.freeze(['threshold']),
    controls: Object.freeze(['biscuit', 'moldy', 'lawyer-rock', 'unclaimed-shelves', 'fee-schedule', 'lost-property-return']),
    arrivalText: 'The Orange Thread is weighed, tagged and entered into inventory. A small bell rings. Somebody is already writing you a receipt for something you never lost.',
    appearance: Object.freeze({ background: 0x303636, torch: 0xff5e1f, resetLabel: 'Look to the Counter' })
  }),
  'hushing-stair': Object.freeze({
    number: '015',
    title: 'The Hushing Stair',
    exits: Object.freeze(['unnecessary-doors', 'kamidana']),
    controls: Object.freeze(['sotto', 'noise-basket', 'shoe-bench', 'stair-up', 'stair-return']),
    arrivalText: 'Behind the KEEP OUT door, the Orange Thread lowers its voice. A stair climbs toward one small ember, and the Department\'s clatter is gently taken from you at the bottom step.',
    appearance: Object.freeze({ background: 0x303636, torch: 0xb9f3a4, resetLabel: 'Look Up the Stair' })
  }),
  sluice: Object.freeze({
    number: '016',
    title: 'The Sluice of Second Thoughts',
    exits: Object.freeze(['river-house', 'shoggoth-moat']),
    controls: Object.freeze(['dabble', 'drying-line', 'rowboat', 'sluice-onward', 'sluice-return']),
    arrivalText: 'The Orange Thread ducks under the water-gate and begins to drip. Somewhere ahead a wheel turns a quarter-inch, a very large snore is being let through, and a paperback is having second thoughts.',
    appearance: Object.freeze({ background: 0x303636, torch: 0xb9f3a4, resetLabel: 'Look Down the Culvert' })
  }),
  'topiary-parlour': Object.freeze({
    number: '017',
    title: 'The Topiary Parlour',
    exits: Object.freeze(['whisper-hedges']),
    controls: Object.freeze(['snip', 'half-swan', 'appointment-book', 'parlour-return']),
    arrivalText: 'The Orange Thread squeezes through a gap in the hedge and comes out the other side with a slightly better haircut. Somewhere ahead, a pair of shears is thinking.',
    appearance: Object.freeze({ background: 0x476f95, torch: 0xb9f3a4, resetLabel: 'Look Around the Parlour' })
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
