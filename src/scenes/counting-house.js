// Scene 003 contract: {group, hotspots, actions, update}.
// The Counting House, by Thomas (La Sociedad del Libro de Hierro).
// Everything that happens in the Labyrinth gets written down here,
// so it is not lost. Especially the kettle.
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
    brush.font = `bold ${fontSize}px Georgia`;
    const step = fontSize * 1.35;
    const startY = 128 - ((lines.length - 1) * step) / 2 + fontSize * .35;
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

  // The dirt floor of the office, and a stone step at the back wall.
  box(0, -.22, -8, 30, .45, 50, road);
  box(0, .06, -15.2, 24, .14, 2.4, stone);

  // Back wall of stone, with one window the hedge is growing through.
  box(-9.2, 3.4, -16, 6.4, 6.8, 1, stone);
  box(6.4, 3.4, -16, 11.2, 6.8, 1, stone);
  box(-4.4, 6.1, -16, 3.4, 1.6, 1, stone);
  box(-4.4, 1.1, -16, 3.4, 2.2, 1, stone);
  box(-6.1, 3.9, -15.3, 1.6, 3.4, 1.4, hedge);
  box(-3.2, 4.4, -15.4, 1.3, 2.6, 1.2, hedge);
  cone(-5.4, 6.2, -15.3, 1, 1.8, leaf);

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
  tube(-2.4, .8, -7, .16, 1.6, iron);
  const lecternTop = box(-2.4, 1.7, -7, 2.9, .14, 2, dark);
  lecternTop.rotation.x = -.32;
  const ledger = new THREE.Group();
  ledger.position.set(-2.4, 2.05, -7);
  ledger.rotation.x = -.32;
  group.add(ledger);
  box(0, 0, 0, 2.3, .16, 1.6, iron, ledger);
  box(0, .19, 0, 2.14, .22, 1.46, pages, ledger);
  const topCover = box(-.12, .4, 0, 2.3, .1, 1.6, iron, ledger);
  topCover.rotation.z = .1;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(sx * 1.02, .42, sz * .68, .24, .08, .24, orange, ledger);
  box(.35, .18, .95, .12, .5, .04, orange, ledger);

  // The desk: an old door on two barrels, as is traditional.
  tube(2.2, .45, -6.5, .42, .9, stone);
  tube(4.6, .45, -6.5, .42, .9, stone);
  box(3.4, 1, -6.5, 3.6, .14, 1.7, dark);

  // The Stamp of Final Reckoning, on the desk. It stamps on its own schedule.
  const stamp = new THREE.Group();
  stamp.position.set(2.5, 1.07, -6.6);
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
  kettle.position.set(4.45, 1.07, -6.9);
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
  nib.position.set(4.7, 0, -4.9);
  group.add(nib);
  cone(0, .42, 0, .3, .85, hedge, nib);
  orb(0, 1.05, 0, .27, pages, nib);
  cone(0, 1.42, 0, .2, .45, dark, nib);
  for (const sx of [-1, 1]) orb(sx * .1, 1.08, .24, .05, iron, nib);
  const netPole = tube(.42, 1.05, .1, .025, 1.1, road, nib);
  netPole.rotation.z = .7;
  add(new THREE.TorusGeometry(.24, .025, 6, 16), orange, .78, 1.5, .1, nib);

  // The Seven, at large. It declines to be shelved.
  const seven = add(new THREE.PlaneGeometry(1, 1.25),
    new THREE.MeshBasicMaterial({ map: digitTexture('7'), transparent: true, side: THREE.DoubleSide }), 0, 2.2, -9);

  // Lesser numerals drift like dust over the office.
  const motes = [];
  [['3', -4.5, -10.5], ['4', 1.2, -11.5], ['9', -6.5, -6], ['2', 6.8, -12], ['5', -.5, -13.5]].forEach(([digit, x, z], i) => {
    const mote = add(new THREE.PlaneGeometry(.36, .45),
      new THREE.MeshBasicMaterial({ map: digitTexture(digit), transparent: true, side: THREE.DoubleSide, opacity: .85 }),
      x, 1.8 + (i % 3) * .5, z);
    motes.push({ mesh: mote, baseY: mote.position.y, phase: i * 1.35 });
  });

  // The entrance board: office rules, posted by the door.
  const entrySign = add(new THREE.PlaneGeometry(3.1, 1.55),
    new THREE.MeshBasicMaterial({ map: signTexture(['ALL VISITORS', 'MUST BE COUNTED'], 52), side: THREE.DoubleSide }), -4.8, 2.5, -2.5);
  entrySign.rotation.y = .35;
  box(-4.8, .8, -2.55, .14, 1.8, .14, dark);

  // The way home: an iron gate back to the Whisper Hedges.
  box(-6.6, 2.5, -4.5, 1, 5, .9, stone);
  box(-3.9, 2.5, -4.5, 1, 5, .9, stone);
  box(-5.25, 5.2, -4.5, 3.7, .7, .9, stone);
  const returnDoor = box(-5.25, 2.3, -4.45, 1.7, 4, .16, iron);
  box(-5.25, 2.3, -4.32, .1, 4, .06, orange);
  const exitSign = add(new THREE.PlaneGeometry(3.4, 1.7),
    new THREE.MeshBasicMaterial({ map: signTexture(['YOU HAVE BEEN COUNTED.', 'THIS IS NOT A THREAT.'], 40), side: THREE.DoubleSide }), -5.25, 6.6, -4.5);

  group.visible = false;
  return {
    group,
    hotspots: { ledger: [ledger], nib: [nib], stamp: [stamp], seven: [seven], return: [returnDoor] },
    actions: {
      ledger: { type: 'story', id: 'ledger' },
      nib: { type: 'story', id: 'nib' },
      stamp: { type: 'story', id: 'stamp' },
      seven: { type: 'story', id: 'seven' },
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
      // The Seven patrols, unrepentant.
      seven.position.x = Math.sin(t * .33) * 3.6;
      seven.position.z = -9.5 + Math.cos(t * .47) * 2.2;
      seven.position.y = 2.2 + Math.sin(t * 1.25) * .25;
      seven.rotation.y = Math.sin(t * .33) * .5;
      for (const mote of motes) {
        mote.mesh.position.y = mote.baseY + Math.sin(t * .9 + mote.phase) * .16;
        mote.mesh.rotation.y = Math.sin(t * .5 + mote.phase) * .4;
      }
    }
  };
}
