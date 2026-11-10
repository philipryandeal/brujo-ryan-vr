// Scene 014 contract: {group, hotspots, actions, update}.
// The Lost Property Office, by David Bear.
// Biscuit, Treasurer of Lost Things, has run this office since before the hedges
// were planted. He charges fees for objects nobody lost. Moldy the Groundskeeper
// is here too, trying to get his own rake back. Neither of them has a body
// anywhere else yet; this is where they have always been.
// The way in is the hatch behind Mothlight at the First Threshold, marked
// LOST PROPERTY; the way out is the same hatch, behind you on arrival.
export function makeLostProperty(THREE, palette) {
  const group = new THREE.Group();
  const material = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, ...opts });
  const stone = material(palette.stone, { roughness: .95 });
  const dark = material(palette.dark, { roughness: .9 });
  const wood = material(palette.road, { roughness: .85 });
  const hedge = material(palette.hedge, { roughness: .95, emissive: palette.hedge, emissiveIntensity: .3 });
  const goblinSkin = material(palette.light, { emissive: palette.light, emissiveIntensity: .25, roughness: .7 });
  const orange = material(palette.orange, { emissive: palette.orange, emissiveIntensity: .85 });
  const brass = material(palette.road, { metalness: .65, roughness: .35 });
  const paper = material(0xffffff, { roughness: .85 });
  const glass = material(0xffffff, { transparent: true, opacity: .4, roughness: .1 });
  const velvet = material(palette.orange, { roughness: 1, emissive: palette.orange, emissiveIntensity: .25 });

  function add(geometry, mat, x, y, z, parent = group) {
    const object = new THREE.Mesh(geometry, mat);
    object.position.set(x, y, z);
    parent.add(object);
    return object;
  }
  const box = (x, y, z, w, h, d, mat, parent) => add(new THREE.BoxGeometry(w, h, d), mat, x, y, z, parent);
  const orb = (x, y, z, r, mat, parent) => add(new THREE.SphereGeometry(r, 14, 10), mat, x, y, z, parent);
  const cone = (x, y, z, r, h, mat, parent) => add(new THREE.ConeGeometry(r, h, 8), mat, x, y, z, parent);
  const tube = (x, y, z, r, h, mat, parent) => add(new THREE.CylinderGeometry(r, r, h, 10), mat, x, y, z, parent);
  const holder = (x, y, z) => { const g = new THREE.Group(); g.position.set(x, y, z); group.add(g); return g; };

  function sign(lines, w, h, x, y, z, fontSize = 44, parent = group) {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const brush = canvas.getContext('2d');
    brush.fillStyle = '#303636'; brush.fillRect(0, 0, 512, 256);
    brush.strokeStyle = '#FF5E1F'; brush.lineWidth = 14; brush.strokeRect(10, 10, 492, 236);
    brush.fillStyle = '#ffffff'; brush.textAlign = 'center';
    brush.font = `bold ${fontSize}px Georgia`;
    const step = fontSize * 1.3;
    const startY = 128 - ((lines.length - 1) * step) / 2 + fontSize * .35;
    lines.forEach((line, i) => brush.fillText(line, 256, startY + i * step, 470));
    return add(new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), side: THREE.DoubleSide }), x, y, z, parent);
  }

  // ── The office: a stone room much too small for its inventory.
  box(0, -.22, 0, 16, .45, 27, wood);
  box(0, .03, -1, 6, .04, 4, hedge); // a worn green rug in front of the counter
  box(-7.7, 3.8, -.5, .6, 8, 27, stone);
  box(7.7, 3.8, -.5, .6, 8, 27, stone);
  box(0, 7.9, -.5, 16, .5, 27, dark);
  box(0, 3.8, -11.6, 16, 8, .6, stone);

  // Shelves of tagged things on the back and side walls.
  const shelves = holder(0, 0, 0);
  const tags = [];
  const shelfItems = [dark, hedge, wood, paper, orange, stone, brass];
  function shelfWall(x, z, length, along, facing) {
    for (let level = 0; level < 4; level += 1) {
      const y = .9 + level * 1.45;
      if (along === 'x') box(x, y - .12, z, length, .1, 1, wood, shelves);
      else box(x, y - .12, z, 1, .1, length, wood, shelves);
      const count = Math.floor(length / 1.1);
      for (let i = 0; i < count; i += 1) {
        const offset = -length / 2 + .55 + i * 1.1;
        const px = along === 'x' ? x + offset : x;
        const pz = along === 'x' ? z : z + offset;
        const kind = (i * 3 + level) % 5;
        const m = shelfItems[(i * 2 + level) % shelfItems.length];
        if (kind === 0) orb(px, y + .22, pz, .24, m, shelves);
        else if (kind === 1) box(px, y + .2, pz, .5, .4, .4, m, shelves);
        else if (kind === 2) tube(px, y + .26, pz, .14, .5, m, shelves);
        else if (kind === 3) cone(px, y + .26, pz, .2, .5, m, shelves);
        else box(px, y + .08, pz, .6, .14, .45, m, shelves);
        // Every item wears a little paper price tag on a string.
        const tagGroup = new THREE.Group();
        tagGroup.position.set(px + (along === 'x' ? .22 : facing * .4), y + .5, pz + (along === 'x' ? facing * .4 : .22));
        shelves.add(tagGroup);
        box(0, -.12, 0, .14, .09, .01, paper, tagGroup);
        tags.push({ tagGroup, phase: i + level * 2.3 });
      }
    }
  }
  shelfWall(0, -10.9, 14, 'x', 1);
  shelfWall(-7, -3.5, 13, 'z', 1);

  // The counter, with its brass bell, cash box and enormous ledger.
  box(0, .65, -4.2, 8.4, 1.3, 1.2, wood);
  box(0, 1.34, -4.2, 8.8, .08, 1.5, dark);
  const bell = holder(2.6, 1.38, -3.9);
  add(new THREE.SphereGeometry(.16, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), brass, 0, 0, 0, bell);
  tube(0, .18, 0, .02, .12, brass, bell);
  box(-1.4, 1.58, -4.3, 1, .4, .6, brass); // the cash box, very large and very empty
  box(-1.4, 1.8, -4.3, .3, .04, .1, dark);
  const ledgerBook = box(.4, 1.42, -4.15, 1.2, .1, .85, paper);
  ledgerBook.rotation.y = .15;
  box(.4, 1.38, -4.15, 1.25, .06, .9, orange).rotation.y = .15;
  sign(['LOST PROPERTY', 'FEES APPLY'], 4.2, 1.6, 0, 6.7, -10.4, 52);
  sign(['MISSING INVENTORY?', 'IF YOU ARE A', 'SHOGGOTH: NO.'], 2.8, 1.5, 4.6, 6.7, -10.4, 40);

  // A goblin, built from the Labyrinth's usual parts.
  function goblin(parent, { bodyMat, bodyScale, headY }) {
    const body = orb(0, headY - .75, 0, .45, bodyMat, parent);
    body.scale.set(...bodyScale);
    orb(0, headY, 0, .38, goblinSkin, parent);
    for (const sx of [-1, 1]) {
      const ear = cone(sx * .42, headY + .05, 0, .14, .55, goblinSkin, parent);
      ear.rotation.z = -sx * 1.25;
      orb(sx * .14, headY + .06, .32, .06, dark, parent);
    }
    cone(0, headY - .05, .4, .07, .22, goblinSkin, parent).rotation.x = Math.PI / 2;
    return body;
  }

  // Biscuit, Treasurer of Lost Things: round, pleased, in a waistcoat of pockets.
  const biscuit = holder(-.2, 0, -5.4);
  goblin(biscuit, { bodyMat: wood, bodyScale: [1.35, 1.25, 1.15], headY: 2.55 });
  for (const [bx, by] of [[0, 1.95], [0, 1.7], [0, 1.45]]) orb(bx, by, .5, .05, orange, biscuit);
  for (const sx of [-1, 1]) box(sx * .32, 1.6, .48, .22, .18, .04, dark, biscuit); // pockets, all full
  add(new THREE.TorusGeometry(.12, .03, 6, 14), brass, .14, 2.61, .38, biscuit);
  orb(.14, 2.61, .39, .1, glass, biscuit);
  const stamp = holder(.55, 1.6, -5);
  tube(0, .25, 0, .05, .4, wood, stamp);
  tube(0, 0, 0, .14, .1, dark, stamp);

  // Moldy, Groundskeeper, leaning on the near end of the counter about his rake.
  const moldy = holder(-4.9, 0, -2.6);
  goblin(moldy, { bodyMat: hedge, bodyScale: [.95, 1.35, .9], headY: 2.25 });
  cone(0, 2.68, 0, .5, .4, wood, moldy); // a battered straw hat
  for (const sx of [-.16, .16]) box(sx, .15, .05, .2, .3, .32, dark, moldy); // muddy boots
  const mud = [];
  for (let i = 0; i < 4; i += 1) mud.push(orb(-.3 + i * .2, .02, .35 + (i % 2) * .1, .06, dark, moldy));
  // His rake, tagged and hung on the wall behind the counter, just out of reach.
  const rake = holder(-3.2, 3.4, -10.2);
  tube(0, 0, 0, .04, 3, wood, rake);
  box(0, 1.5, 0, .9, .08, .08, dark, rake);
  for (let i = 0; i < 6; i += 1) box(-.4 + i * .16, 1.38, .05, .03, .22, .03, dark, rake);
  const rakeTag = holder(.25, .6, .12); rake.add(rakeTag);
  box(0, 0, 0, .3, .18, .01, paper, rakeTag);

  // The Rock That Keeps Demanding a Lawyer, on a velvet cushion behind a brass rail.
  const rock = holder(4.6, 0, -.2);
  tube(0, .55, 0, .55, 1.1, stone, rock);
  const cushion = orb(0, 1.18, 0, .5, velvet, rock); cushion.scale.set(1, .3, 1);
  const theRock = orb(0, 1.48, 0, .32, stone, rock); theRock.scale.set(1.2, .8, 1);
  for (const [rx, rz] of [[-.8, .8], [.8, .8], [-.8, -.8], [.8, -.8]]) tube(rx, .5, rz, .03, 1, brass, rock);
  for (const rz of [.8, -.8]) { const bar = tube(0, 1, rz, .025, 1.6, brass, rock); bar.rotation.z = Math.PI / 2; }
  for (const rx of [.8, -.8]) { const bar = tube(rx, 1, 0, .025, 1.6, brass, rock); bar.rotation.x = Math.PI / 2; }
  sign(['FOUND', '(UNDER PROTEST)'], 1.5, .75, 0, 2.3, .1, 44, rock);

  // The Schedule of Fees, on the right-hand wall by the door.
  const fees = holder(7.35, 0, 5);
  const feeBoard = sign(['SCHEDULE OF FEES', 'retrieval: 1 shiny thing', 'storage: 1 per Tuesday', 'shoggoths: NO'], 3, 1.9, 0, 3.3, 0, 34, fees);
  feeBoard.rotation.y = -Math.PI / 2;

  // The hatch home, behind you: back to the First Threshold.
  box(-4.85, 3.8, 12.9, 5.9, 8, .6, stone);
  box(4.85, 3.8, 12.9, 5.9, 8, .6, stone);
  box(0, 6.3, 12.9, 3.8, 3.2, .6, stone);
  const exit = holder(0, 0, 12.55);
  box(0, 2.35, 0, 3, 4.7, .18, dark, exit);
  box(0, 4.75, 0, 3.4, .25, .3, orange, exit);
  orb(1.05, 2.3, -.15, .1, brass, exit);
  const exitSign = sign(['BACK TO THE', 'THRESHOLD'], 2.4, 1, 0, 5.6, -.35, 46, exit);
  exitSign.rotation.y = Math.PI;

  group.visible = false;
  return {
    group,
    hotspots: {
      biscuit: [biscuit],
      moldy: [moldy, rake],
      'lawyer-rock': [rock],
      'unclaimed-shelves': [shelves],
      'fee-schedule': [fees],
      'lost-property-return': [exit]
    },
    actions: {
      biscuit: { type: 'story', id: 'biscuit' },
      moldy: { type: 'story', id: 'moldy' },
      'lawyer-rock': { type: 'story', id: 'lawyer-rock' },
      'unclaimed-shelves': { type: 'story', id: 'unclaimed-shelves' },
      'fee-schedule': { type: 'story', id: 'fee-schedule' },
      'lost-property-return': { type: 'travel', destination: 'threshold' }
    },
    update(t) {
      // Biscuit rocks on his heels, delighted with the day's takings.
      biscuit.rotation.z = Math.sin(t * 1.1) * .04;
      biscuit.position.y = Math.abs(Math.sin(t * 1.1)) * .04;
      // Every so often the stamp comes down on something nobody submitted.
      const beat = (t % 6) / 6;
      stamp.position.y = 1.6 + (beat > .9 ? -.18 * Math.sin((beat - .9) * 10 * Math.PI) : .12);
      // Moldy taps one muddy boot, and the mud does not improve.
      moldy.rotation.y = .35 + Math.sin(t * .7) * .08;
      mud.forEach((m, i) => { m.position.y = .02 + Math.max(0, Math.sin(t * 6 + i)) * .03; });
      // The rock shifts on its cushion, as if clearing its throat.
      theRock.rotation.y = (t % 9) < .4 ? Math.sin(t * 40) * .05 : 0;
      // Price tags sway on their strings; the rake's tag sways most smugly of all.
      for (const tag of tags) tag.tagGroup.rotation.z = Math.sin(t * 1.3 + tag.phase) * .2;
      rakeTag.rotation.z = Math.sin(t * 1.7) * .3;
      bell.rotation.z = (t % 11) < .3 ? Math.sin(t * 50) * .2 : 0;
    }
  };
}
