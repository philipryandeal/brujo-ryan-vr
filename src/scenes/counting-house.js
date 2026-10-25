// Scene 003 contract: {group, hotspots, actions, update}.
// The Counting House, by Thomas (La Sociedad del Libro de Hierro).
// A room the hedges grew around a book. Everything that happens in the
// Labyrinth gets written down here, so it is not lost. Especially the kettle.
// Two doors in the side walls belong to the Bear and the Oracle. They stand
// closed and growing until their owners build their rooms and link out —
// doors in this kingdom open from the far side, by their owner's hand.
export function makeCountingHouse(THREE, palette) {
  const group = new THREE.Group();
  const material = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, ...opts });
  const stone = material(palette.stone, { roughness: .95 });
  const dark = material(palette.dark, { roughness: .9 });
  const iron = material(palette.deep, { roughness: .45, metalness: .55 });
  const hedge = material(palette.hedge, { roughness: .98, emissive: palette.hedge, emissiveIntensity: .38 });
  const leaf = material(palette.light, { emissive: 0x495a58, emissiveIntensity: .3 });
  const pages = material(palette.light, { roughness: .85 });
  const orange = material(palette.orange, { emissive: palette.orange, emissiveIntensity: .8 });
  const road = material(palette.road, { roughness: 1 });

  function add(geometry, mat, x, y, z, parent = group) {
    const object = new THREE.Mesh(geometry, mat);
    object.position.set(x, y, z);
    parent.add(object);
    return object;
  }
  const box = (x, y, z, w, h, d, mat, parent) => add(new THREE.BoxGeometry(w, h, d), mat, x, y, z, parent);
  const orb = (x, y, z, r, mat, parent) => add(new THREE.SphereGeometry(r, 14, 10), mat, x, y, z, parent);
  const cone = (x, y, z, r, h, mat, parent) => add(new THREE.ConeGeometry(r, h, 9), mat, x, y, z, parent);
  const tube = (x, y, z, r, h, mat, parent) => add(new THREE.CylinderGeometry(r, r, h, 10), mat, x, y, z, parent);

  function signTexture(lines, fontSize = 54) {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const brush = canvas.getContext('2d');
    brush.fillStyle = '#303636'; brush.fillRect(0, 0, 512, 256);
    brush.strokeStyle = '#FF5E1F'; brush.lineWidth = 14; brush.strokeRect(10, 10, 492, 236);
    brush.fillStyle = '#ffffff'; brush.textAlign = 'center';
    // Shrink to fit: no letter ever runs off the board again.
    let size = fontSize;
    brush.font = `bold ${size}px Georgia`;
    const widest = Math.max(...lines.map(line => brush.measureText(line).width));
    if (widest > 460) {
      size = Math.max(22, Math.floor(size * (460 / widest)));
      brush.font = `bold ${size}px Georgia`;
    }
    const step = size * 1.35;
    const startY = 128 - ((lines.length - 1) * step) / 2 + size * .35;
    lines.forEach((line, i) => brush.fillText(line, 256, startY + i * step));
    return new THREE.CanvasTexture(canvas);
  }
  function digitTexture(digit) {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 160;
    const brush = canvas.getContext('2d');
    brush.clearRect(0, 0, 128, 160);
    brush.font = 'bold 120px Georgia'; brush.textAlign = 'center';
    brush.lineWidth = 8; brush.strokeStyle = '#FF5E1F';
    brush.strokeText(digit, 64, 122);
    brush.fillStyle = '#ffffff';
    brush.fillText(digit, 64, 122);
    return new THREE.CanvasTexture(canvas);
  }

  // The dirt floor of the office.
  box(0, -.22, -1, 22, .45, 36, road);
  box(0, .06, -15.2, 24, .14, 2.4, stone);

  // Back wall of stone, with one window the hedge is growing through.
  box(-9.2, 3.4, -16, 6.4, 6.8, 1, stone);
  box(6.4, 3.4, -16, 11.2, 6.8, 1, stone);
  box(-4.4, 6.1, -16, 3.4, 1.6, 1, stone);
  box(-4.4, 1.1, -16, 3.4, 2.2, 1, stone);
  box(-6.1, 3.9, -15.3, 1.6, 3.4, 1.4, hedge);
  box(-3.2, 4.4, -15.4, 1.3, 2.6, 1.2, hedge);
  cone(-5.4, 6.2, -15.3, 1, 1.8, leaf);

  // Hedge walls down both sides — the room is held by the Hedges themselves.
  function hedgeRun(x, zFrom, zTo) {
    const length = zTo - zFrom;
    box(x, 2.5, zFrom + length / 2, 1.2, 5, length, hedge);
    for (let z = zFrom + 2; z < zTo - 1; z += 4.2) cone(x, 5.7, z, 1.05, 1.7, leaf);
  }

  // A door that belongs to somebody else: stone-framed, iron, honestly shut.
  function sideDoor(x, z, signLines) {
    const doorGroup = new THREE.Group();
    group.add(doorGroup);
    const inward = x < 0 ? 1 : -1;
    box(x, 2.9, z - 1.9, 1.3, 5.8, .9, stone, doorGroup);
    box(x, 2.9, z + 1.9, 1.3, 5.8, .9, stone, doorGroup);
    box(x, 5.9, z, 1.3, .8, 4.7, stone, doorGroup);
    box(x + inward * .1, 2.6, z, .22, 5.2, 2.9, iron, doorGroup);
    box(x + inward * .24, 2.6, z, .05, 5.2, .09, orange, doorGroup);
    orb(x + inward * .3, 2.5, z + .95, .11, orange, doorGroup);
    const sign = add(new THREE.PlaneGeometry(2.9, 1.45),
      new THREE.MeshBasicMaterial({ map: signTexture(signLines, 58), side: THREE.DoubleSide }),
      x + inward * .75, 6.85, z, doorGroup);
    sign.rotation.y = inward > 0 ? Math.PI / 2 : -Math.PI / 2;
    return doorGroup;
  }

  // Left wall, with the Bear's door in it.
  hedgeRun(-8, -16, -7.2);
  hedgeRun(-8, -2.8, 13);
  const bearDoor = sideDoor(-8, -5, ['THE BEAR']);
  // Right wall, with the Oracle's door in it.
  hedgeRun(8, -16, -7.2);
  hedgeRun(8, -2.8, 13);
  const oracleDoor = sideDoor(8, -5, ['THE ORACLE']);

  // The little orange departmental door is a real passage to Scene 005.
  const departmentDoor = new THREE.Group(); group.add(departmentDoor);
  box(0,2.45,-15.28,2.6,4.9,.35,iron,departmentDoor);
  box(-1.46,2.6,-15.05,.28,5.15,.55,orange,departmentDoor);
  box(1.46,2.6,-15.05,.28,5.15,.55,orange,departmentDoor);
  orb(.8,2.25,-14.95,.15,orange,departmentDoor);
  add(new THREE.PlaneGeometry(3.8,1.4),new THREE.MeshBasicMaterial({map:signTexture(['UNNECESSARY','DOORS'],48),side:THREE.DoubleSide}),0,6.5,-15.05,departmentDoor);
  // The entrance wall behind the visitor: hedge, with the way home in it.
  box(-4.9, 2.5, 13, 6.2, 5, 1.2, hedge);
  box(4.9, 2.5, 13, 6.2, 5, 1.2, hedge);
  cone(-6.5, 5.7, 13, 1.05, 1.7, leaf);
  cone(6.5, 5.7, 13, 1.05, 1.7, leaf);
  box(-1.85, 2.9, 13, .9, 5.8, 1.3, stone);
  box(1.85, 2.9, 13, .9, 5.8, 1.3, stone);
  box(0, 5.9, 13, 4.6, .8, 1.3, stone);
  const returnDoor = box(0, 2.6, 13, 2.8, 5.2, .2, iron);
  box(0, 2.6, 12.85, .09, 5.2, .06, orange);
  const exitSign = add(new THREE.PlaneGeometry(3.4, 1.7),
    new THREE.MeshBasicMaterial({ map: signTexture(['YOU HAVE BEEN COUNTED.', 'THIS IS NOT A THREAT.'], 40), side: THREE.DoubleSide }), 0, 7.4, 13);
  exitSign.rotation.y = Math.PI;

  // Shelves of ledgers along the back wall. Every book is a happening.
  const spineMats = [dark, hedge, stone, dark, hedge, dark, stone];
  for (let shelf = 0; shelf < 3; shelf += 1) {
    const y = 1.6 + shelf * 1.7;
    box(6.4, y - .35, -15.2, 9.6, .14, .9, dark);
    for (let i = 0; i < 11; i += 1) {
      const mat = (i + shelf) % 6 === 4 ? orange : spineMats[(i + shelf) % spineMats.length];
      box(2.2 + i * .78, y + .15, -15.2, .6, .95 + ((i * 7 + shelf) % 3) * .12, .62, mat);
    }
  }

  // The lectern, and on it the Iron Ledger itself: asleep, breathing slowly.
  tube(-4.6, .8, -6.5, .16, 1.6, iron);
  const lecternTop = box(-4.6, 1.7, -6.5, 2.9, .14, 2, dark);
  lecternTop.rotation.x = -.32;
  const ledger = new THREE.Group();
  ledger.position.set(-4.6, 2.05, -6.5);
  ledger.rotation.x = -.32;
  group.add(ledger);
  box(0, 0, 0, 2.3, .16, 1.6, iron, ledger);
  box(0, .19, 0, 2.14, .22, 1.46, pages, ledger);
  const topCover = box(-.12, .4, 0, 2.3, .1, 1.6, iron, ledger);
  topCover.rotation.z = .1;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(sx * 1.02, .42, sz * .68, .24, .08, .24, orange, ledger);
  box(.35, .18, .95, .12, .5, .04, orange, ledger);

  // The desk: an old door on two barrels, as is traditional.
  tube(2.2, .45, -5.5, .42, .9, stone);
  tube(4.6, .45, -5.5, .42, .9, stone);
  box(3.4, 1, -5.5, 3.6, .14, 1.7, dark);

  // The Stamp of Final Reckoning, on the desk. It stamps on its own schedule.
  const stamp = new THREE.Group();
  stamp.position.set(2.5, 1.07, -5.6);
  group.add(stamp);
  box(0, .05, 0, .7, .1, .7, dark, stamp);
  const stampHead = new THREE.Group();
  stampHead.position.y = .62;
  stamp.add(stampHead);
  tube(0, -.18, 0, .06, .34, iron, stampHead);
  orb(0, .06, 0, .13, road, stampHead);
  box(0, -.42, 0, .5, .12, .5, iron, stampHead);
  box(.75, .03, .25, .55, .05, .55, iron, stamp);

  // The kettle, on the desk corner. It has been counted fourteen times.
  const kettle = new THREE.Group();
  kettle.position.set(4.45, 1.07, -5.9);
  group.add(kettle);
  const kettleBody = orb(0, .22, 0, .3, iron, kettle);
  kettleBody.scale.set(1, .82, 1);
  cone(.3, .3, 0, .07, .26, iron, kettle).rotation.z = -.8;
  add(new THREE.TorusGeometry(.17, .03, 6, 14, Math.PI), iron, 0, .42, 0, kettle);
  box(0, .3, .31, .1, .14, .03, orange, kettle);

  // The filing cabinet. All drawers are labeled M. One is open, on principle.
  box(5.9, 1.35, -9.5, 1.5, 2.7, .95, dark);
  for (let i = 0; i < 4; i += 1) {
    const y = .55 + i * .55;
    if (i === 1) {
      box(5.9, y, -8.85, 1.26, .42, .5, stone);
      box(5.9, y + .1, -8.8, 1.1, .1, .4, pages);
    } else {
      box(5.9, y, -8.99, 1.26, .42, .06, stone);
    }
    box(5.9, y, -8.94, .34, .06, .05, orange);
  }

  // Nib, the filing imp (entire staff), holding his net at the ready.
  const nib = new THREE.Group();
  nib.position.set(-2, 0, -4);
  group.add(nib);
  cone(0, .42, 0, .3, .85, hedge, nib);
  orb(0, 1.05, 0, .27, pages, nib);
  cone(0, 1.42, 0, .2, .45, dark, nib);
  for (const sx of [-1, 1]) orb(sx * .1, 1.08, .24, .05, iron, nib);
  const netPole = tube(.42, 1.05, .1, .025, 1.1, road, nib);
  netPole.rotation.z = .7;
  add(new THREE.TorusGeometry(.24, .025, 6, 16), orange, .78, 1.5, .1, nib);

  // The Seven, at large — patrolling the shelves in plain sight now.
  const seven = add(new THREE.PlaneGeometry(1, 1.25),
    new THREE.MeshBasicMaterial({ map: digitTexture('7'), transparent: true, side: THREE.DoubleSide }), 0, 2.3, -8.5);

  // Lesser numerals drift like dust over the office.
  const motes = [];
  [['3', -4.5, -10.5], ['4', 1.2, -11.5], ['9', -6.5, -6], ['2', 6.8, -12], ['5', -.5, -13.5]].forEach(([digit, x, z], i) => {
    const mote = add(new THREE.PlaneGeometry(.36, .45),
      new THREE.MeshBasicMaterial({ map: digitTexture(digit), transparent: true, side: THREE.DoubleSide, opacity: .85 }),
      x, 1.8 + (i % 3) * .5, z);
    motes.push({ mesh: mote, baseY: mote.position.y, phase: i * 1.35 });
  });

  // The entrance board: office rules, posted where arrivals can read them.
  const entrySign = add(new THREE.PlaneGeometry(3.1, 1.55),
    new THREE.MeshBasicMaterial({ map: signTexture(['ALL VISITORS', 'MUST BE COUNTED'], 52), side: THREE.DoubleSide }), 4, 2.5, 6.5);
  entrySign.rotation.y = -.35;
  box(4, .8, 6.55, .14, 1.8, .14, dark);

  group.visible = false;
  return {
    group,
    hotspots: { ledger: [ledger], nib: [nib], stamp: [stamp], seven: [seven], 'bear-door': [bearDoor], 'oracle-door': [oracleDoor], 'department-door': [departmentDoor], return: [returnDoor] },
    actions: {
      ledger: { type: 'story', id: 'ledger' },
      nib: { type: 'story', id: 'nib' },
      stamp: { type: 'story', id: 'stamp' },
      seven: { type: 'story', id: 'seven' },
      'bear-door': { type: 'story', id: 'bear-door' },
      'oracle-door': { type: 'story', id: 'oracle-door' },
      'department-door': { type: 'travel', destination: 'unnecessary-doors' },
      return: { type: 'travel', destination: 'whisper-hedges' }
    },
    update(t) {
      // The Ledger snores in base ten.
      const breath = 1 + Math.sin(t * .8) * .012;
      ledger.scale.set(breath, 1 + Math.sin(t * .8) * .02, breath);
      // The stamp keeps its own counsel, and its own schedule.
      const cycle = t % 6.5;
      stampHead.position.y = .62 - (cycle < .5 ? Math.sin((cycle / .5) * Math.PI) * .16 : 0);
      // Nib is ready. Nib is always ready. It does not help.
      nib.position.y = Math.abs(Math.sin(t * 2.1)) * .06;
      nib.rotation.y = Math.sin(t * .7) * .25;
      // The Seven patrols the shelves, unrepentant, where everyone can see it.
      seven.position.x = Math.sin(t * .33) * 3.4;
      seven.position.z = -8.5 + Math.cos(t * .47) * 1.8;
      seven.position.y = 2.3 + Math.sin(t * 1.25) * .25;
      seven.rotation.y = Math.sin(t * .33) * .5;
      for (const mote of motes) {
        mote.mesh.position.y = mote.baseY + Math.sin(t * .9 + mote.phase) * .16;
        mote.mesh.rotation.y = Math.sin(t * .5 + mote.phase) * .4;
      }
    }
  };
}
