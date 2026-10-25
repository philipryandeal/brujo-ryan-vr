// Scene 004 contract: {group, hotspots, actions, update}.
// The River House, by David Bear.
// A slow green river runs straight through the middle of a library. The shelves
// stand in the water. Books that float are fiction; books that sink are
// nonfiction. The Bear is not home. He has gone fishing for a sentence.
// The way in is the Bear's Door in the Counting House; the way out is the same door.
export function makeRiverHouse(THREE, palette) {
  const group = new THREE.Group();
  const material = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, ...opts });
  const stone = material(palette.stone, { roughness: .95 });
  const dark = material(palette.dark, { roughness: .9 });
  const road = material(palette.road, { roughness: 1 });
  const hedge = material(palette.hedge, { roughness: .98, emissive: palette.hedge, emissiveIntensity: .38 });
  const light = material(palette.light, { emissive: palette.light, emissiveIntensity: .55 });
  const pages = material(0xffffff, { roughness: .85 });
  const orange = material(palette.orange, { emissive: palette.orange, emissiveIntensity: .9 });
  // The river is the sky, lying down for a rest.
  const water = material(0x476f95, { roughness: .2, metalness: .3, transparent: true, opacity: .82, emissive: 0x476f95, emissiveIntensity: .25 });
  const ripple = new THREE.MeshBasicMaterial({ color: palette.light, transparent: true, opacity: .35, side: THREE.DoubleSide });

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
    let size = fontSize;
    brush.font = `bold ${size}px Georgia`;
    const widest = Math.max(...lines.map(line => brush.measureText(line).width));
    if (widest > 460) {
      size = Math.max(20, Math.floor(size * (460 / widest)));
      brush.font = `bold ${size}px Georgia`;
    }
    const step = size * 1.35;
    const startY = 128 - ((lines.length - 1) * step) / 2 + size * .35;
    lines.forEach((line, i) => brush.fillText(line, 256, startY + i * step));
    return new THREE.CanvasTexture(canvas);
  }
  function noteTexture(lines) {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 192;
    const brush = canvas.getContext('2d');
    brush.fillStyle = '#ffffff'; brush.fillRect(0, 0, 256, 192);
    brush.fillStyle = '#303636'; brush.textAlign = 'center';
    brush.font = 'italic 24px Georgia';
    lines.forEach((line, i) => brush.fillText(line, 128, 52 + i * 34));
    return new THREE.CanvasTexture(canvas);
  }
  const sign = (lines, w, h, x, y, z, fontSize) => add(new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: signTexture(lines, fontSize), side: THREE.DoubleSide }), x, y, z);

  // Riverbanks of packed earth, and the river itself down the middle.
  box(-7, -.22, -1, 6, .45, 36, road);
  box(7, -.22, -1, 6, .45, 36, road);
  box(0, -.6, -1, 8, .3, 36, dark);
  const river = add(new THREE.PlaneGeometry(8, 36), water, 0, -.18, -1);
  river.rotation.x = -Math.PI / 2;

  // The Orange Thread lies along the riverbed like a lost hair ribbon.
  for (let i = 0; i < 14; i += 1) {
    const strand = box(Math.sin(i * .9) * .9, -.42, 11 - i * 1.8, .1, .03, 1.9, orange);
    strand.rotation.y = Math.cos(i * .9) * .45;
  }

  // Stepping stones from the Bear's Door down the river.
  const steps = [];
  for (let i = 0; i < 9; i += 1) {
    const step = tube(Math.sin(i * 1.3) * .8, -.08, 11 - i * 2.3, .75 + (i % 3) * .1, .22, road);
    step.scale.z = .8;
    steps.push(step);
  }

  // Shelves standing in the water, both banks, as if the river came later
  // and the library simply refused to move.
  const spines = [dark, hedge, stone, light, dark, hedge, orange, stone];
  function shelfStack(x, z, facing) {
    box(x, 2.5, z, .25, 5, 3.4, dark);
    for (let level = 0; level < 4; level += 1) {
      const y = .55 + level * 1.15;
      box(x + facing * .45, y - .25, z, .9, .1, 3.4, dark);
      for (let i = 0; i < 6; i += 1) {
        const tilt = (i + level) % 5 === 3 ? .25 : 0;
        const book = box(x + facing * .45, y + .2, z - 1.4 + i * .55, .55, .75 + ((i + level) % 3) * .12, .38,
          spines[(i * 3 + level) % spines.length]);
        book.rotation.x = tilt;
      }
    }
  }
  for (const z of [6, -1, -8]) { shelfStack(-4.6, z, 1); shelfStack(4.6, z, -1); }

  // A willow bank behind the shelves keeps the room feeling outdoors.
  for (const x of [-9.4, 9.4]) {
    box(x, 2.5, -1, 1.2, 5, 34, hedge);
    for (let z = 13; z > -16; z -= 4.5) cone(x, 5.6, z, 1.1, 1.8, light);
  }

  // Roots across the ceiling, with lamps hanging from them.
  const lamps = [];
  for (let i = 0; i < 6; i += 1) {
    const z = 10 - i * 4.6;
    const root = tube(0, 7.3, z, .14, 18, road);
    root.rotation.z = Math.PI / 2 + Math.sin(i) * .08;
    for (const x of [-2.6, 2.6]) {
      const cord = tube(x, 6.6, z, .02, 1.4, road);
      void cord;
      const lamp = orb(x, 5.75, z, .22, light);
      lamps.push({ mesh: lamp, phase: i * .7 + x });
    }
  }

  // Back wall: a mossy stone arch where the river leaves through a culvert.
  box(-5.2, 3.4, -16.5, 6.4, 6.8, 1, stone);
  box(5.2, 3.4, -16.5, 6.4, 6.8, 1, stone);
  box(0, 6, -16.5, 4.2, 1.6, 1, stone);
  sign(['PLEASE DO NOT', 'FEED THE FOOTNOTES'], 3.4, 1.7, 0, 3.4, -16, 46);

  // Floating fiction: books drifting downstream, quite pleased with themselves.
  const floaters = [];
  [[-1.8, 7], [1.4, 1], [-.6, -4], [2.2, -10], [-2.4, -13]].forEach(([x, z], i) => {
    const book = new THREE.Group();
    book.position.set(x, -.05, z);
    group.add(book);
    box(0, 0, 0, .7, .12, .5, spines[(i * 2 + 1) % spines.length], book);
    box(0, .02, 0, .64, .1, .46, pages, book);
    floaters.push({ book, x, z, phase: i * 1.7 });
  });
  // Sunken nonfiction, visible on the riverbed.
  for (let i = 0; i < 6; i += 1) box(Math.sin(i * 2.1) * 2.6, -.43, 9 - i * 4.2, .6, .1, .45, spines[i % spines.length]);

  // Ripples where things are thinking underwater.
  const ripples = [];
  for (let i = 0; i < 5; i += 1) {
    const ring = add(new THREE.RingGeometry(.35, .42, 24), ripple, Math.sin(i * 1.9) * 2.4, -.15, 6 - i * 4.5);
    ring.rotation.x = -Math.PI / 2;
    ripples.push({ ring, phase: i * 1.3 });
  }

  // Quillon, Otter Librarian, on a rock, holding a cookbook that cannot decide.
  const quillon = new THREE.Group();
  quillon.position.set(-2.4, 0, 2.6);
  group.add(quillon);
  tube(0, .05, 0, .8, .4, stone, quillon);
  // Long and slick, with a pointed face: decidedly not a small bear.
  const otterBody = orb(0, .85, 0, .3, road, quillon);
  otterBody.scale.set(.75, 1.9, .72);
  const otterBelly = orb(0, .85, .13, .22, pages, quillon);
  otterBelly.scale.set(.6, 1.7, .45);
  const otterHead = orb(0, 1.52, .08, .19, road, quillon);
  otterHead.scale.set(.9, .85, 1.25);
  const snout = orb(0, 1.47, .3, .1, pages, quillon);
  snout.scale.set(1.1, .7, 1.2);
  orb(0, 1.5, .41, .035, dark, quillon);
  for (const sx of [-1, 1]) {
    orb(sx * .08, 1.6, .24, .03, dark, quillon);
    orb(sx * .14, 1.66, .02, .035, road, quillon);
    for (const tilt of [-.15, .15]) {
      const whisker = box(sx * .17, 1.46 + tilt * .2, .36, .22, .008, .008, pages, quillon);
      whisker.rotation.z = sx * tilt;
    }
  }
  const tail = cone(0, .28, -.55, .12, 1.1, road, quillon);
  tail.rotation.x = -1.35;
  const cookbook = new THREE.Group();
  cookbook.position.set(.18, 1.05, .32);
  quillon.add(cookbook);
  box(0, 0, 0, .45, .55, .08, orange, cookbook);
  box(0, 0, .05, .4, .5, .02, pages, cookbook);

  // The Kettle, on a flat stone table on the right bank, mid-negotiation.
  box(5.4, .55, 5.6, 1.4, .14, 1.1, stone);
  tube(5.4, .25, 5.6, .18, .5, stone);
  const kettle = new THREE.Group();
  kettle.position.set(5.4, .62, 5.6);
  group.add(kettle);
  const kettleBody = orb(0, .26, 0, .34, dark, kettle);
  kettleBody.scale.set(1, .8, 1);
  const spout = cone(-.36, .32, 0, .07, .3, dark, kettle);
  spout.rotation.z = .9;
  add(new THREE.TorusGeometry(.2, .035, 6, 14, Math.PI), dark, 0, .5, 0, kettle);
  orb(0, .58, 0, .06, orange, kettle);
  // The contract, unsigned, under a pebble.
  box(5.9, .64, 5.35, .4, .01, .52, pages);
  orb(5.95, .7, 5.3, .07, road);
  const steam = [];
  for (let i = 0; i < 3; i += 1) steam.push({ puff: orb(5.05, 1.1, 5.6, .08, ripple), phase: i * .9 });

  // Mrs. Pell, Heron of Late Fees, in the shallows. She has not moved in forty years.
  const pell = new THREE.Group();
  pell.position.set(2.5, -.15, -5.5);
  group.add(pell);
  for (const sx of [-.12, .12]) tube(sx, .9, 0, .03, 1.8, orange, pell);
  const heronBody = orb(0, 2.05, 0, .42, stone, pell);
  heronBody.scale.set(.75, .85, 1.35);
  const wing = orb(0, 2.15, -.1, .34, hedge, pell);
  wing.scale.set(.9, .7, 1.4);
  const neck = tube(0, 2.65, .38, .07, .9, stone, pell);
  neck.rotation.x = .35;
  orb(0, 3.12, .55, .16, pages, pell);
  const beak = cone(0, 3.1, .88, .05, .55, orange, pell);
  beak.rotation.x = Math.PI / 2;
  for (const sx of [-1, 1]) orb(sx * .1, 3.17, .64, .035, dark, pell);
  // Her ledger of fees owed, which no one has ever paid.
  box(.3, 2.0, .35, .25, .32, .05, pages, pell);

  // The reading chair: a riverbed stone worn into the shape of somebody large and patient.
  const chair = new THREE.Group();
  chair.position.set(-6.4, 0, -4.5);
  group.add(chair);
  const seat = orb(0, .5, 0, 1.1, stone, chair);
  seat.scale.set(1.25, .55, 1.05);
  const back = orb(-.55, 1.55, 0, 1, stone, chair);
  back.scale.set(.45, 1.05, 1.05);
  orb(.1, .82, 0, .7, hedge, chair).scale.set(1, .25, .9);
  const note = add(new THREE.PlaneGeometry(.75, .56),
    new THREE.MeshBasicMaterial({ map: noteTexture(['Gone fishing', 'for a sentence.', 'Back when', 'it bites.']), side: THREE.DoubleSide }),
    .1, .98, .2, chair);
  note.rotation.x = -Math.PI / 2.4;
  note.rotation.z = -.4;
  // The Bear's fishing spot, abandoned mid-thought: a rod propped against the chair.
  const rod = tube(.95, 1.6, .55, .025, 3.4, road, chair);
  rod.rotation.z = -.55;

  // The Bucket of Unfinished Sentences, on the left bank near the entrance.
  const bucket = new THREE.Group();
  bucket.position.set(-5.4, 0, 7.4);
  group.add(bucket);
  add(new THREE.CylinderGeometry(.42, .34, .7, 14, 1, true), dark, 0, .35, 0, bucket);
  tube(0, .02, 0, .34, .04, dark, bucket);
  add(new THREE.TorusGeometry(.4, .025, 6, 18, Math.PI), road, 0, .7, 0, bucket);
  const scraps = [];
  for (let i = 0; i < 5; i += 1) {
    const scrap = box(Math.sin(i * 2.2) * .15, .7 + i * .06, Math.cos(i * 2.2) * .15, .24, .01, .16, pages, bucket);
    scrap.rotation.y = i;
    scraps.push({ scrap, phase: i * 1.1 });
  }

  // The Bear's Door, from this side: the way back to the Counting House.
  box(-1.85, 2.9, 13, .9, 5.8, 1.3, stone);
  box(1.85, 2.9, 13, .9, 5.8, 1.3, stone);
  box(0, 5.9, 13, 4.6, .8, 1.3, stone);
  box(-4.4, 2.5, 13, 4.2, 5, 1.2, hedge);
  box(4.4, 2.5, 13, 4.2, 5, 1.2, hedge);
  const returnDoor = box(0, 2.6, 13, 2.8, 5.2, .2, dark);
  box(0, 2.6, 12.86, .09, 5.2, .06, orange);
  orb(.95, 2.5, 12.82, .11, orange);
  const homeSign = sign(['THE RIVER HOUSE', 'THE BEAR IS OUT'], 3.4, 1.7, 0, 7.4, 13, 46);
  homeSign.rotation.y = Math.PI;
  const welcome = sign(['QUIET PLEASE', 'THE RIVER IS READING'], 2.8, 1.4, 5.8, 2.6, 9.5, 44);
  welcome.rotation.y = -.5;
  box(5.8, .9, 9.55, .14, 1.9, .14, dark);

  group.visible = false;
  return {
    group,
    hotspots: {
      quillon: [quillon],
      'river-kettle': [kettle],
      pell: [pell],
      'reading-chair': [chair],
      'sentence-bucket': [bucket],
      return: [returnDoor]
    },
    actions: {
      quillon: { type: 'story', id: 'quillon' },
      'river-kettle': { type: 'story', id: 'river-kettle' },
      pell: { type: 'story', id: 'pell' },
      'reading-chair': { type: 'story', id: 'reading-chair' },
      'sentence-bucket': { type: 'story', id: 'sentence-bucket' },
      return: { type: 'travel', destination: 'counting-house' }
    },
    update(t) {
      // Fiction floats downstream, then politely starts again upstream.
      for (const f of floaters) {
        const z = ((f.z - t * .35 + 16) % 30 + 30) % 30 - 16;
        f.book.position.set(f.x + Math.sin(t * .6 + f.phase) * .3, -.05 + Math.sin(t * 1.4 + f.phase) * .04, z);
        f.book.rotation.y = Math.sin(t * .4 + f.phase) * .6;
      }
      for (const r of ripples) {
        const life = ((t * .45 + r.phase) % 2) / 2;
        r.ring.scale.setScalar(.5 + life * 2.2);
        r.ring.material.opacity = .35 * (1 - life);
      }
      for (const lamp of lamps) lamp.mesh.position.y = 5.75 + Math.sin(t * .7 + lamp.phase) * .06;
      // Quillon keeps checking whether the cookbook has decided.
      quillon.rotation.y = Math.sin(t * .5) * .25;
      cookbook.rotation.z = Math.sin(t * 1.3) * .2;
      // The Kettle is exploring its options: it trembles, but does not boil.
      kettle.rotation.z = Math.sin(t * 9) * .015;
      for (const s of steam) {
        const life = ((t * .5 + s.phase) % 2.7) / 2.7;
        s.puff.position.set(5.05 - life * .25, 1.05 + life * .9, 5.6);
        s.puff.scale.setScalar(.6 + life * 1.4);
      }
      // Mrs. Pell does not move. That is the joke. (Once in a long while, she blinks.)
      pell.scale.y = (t % 23) < .12 ? .995 : 1;
      // Unfinished sentences rustle, hoping somebody will end them.
      for (const s of scraps) s.scrap.rotation.z = Math.sin(t * 2 + s.phase) * .15;
    }
  };
}
