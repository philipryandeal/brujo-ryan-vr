// Scene 012 contract: {group, hotspots, actions, update}.
// Beneath the Heart Tree, by David Bear, from the founder's own words:
// "I am going to live in the tree at the center of my labyrinth... probably
// under the roots... I am keeping the shoggoth for a pet, his name is Ralph."
//
// The Brujo is out. Ralph is home. Something is always simmering.
// The way in is the Bridge of Roots from the River House; the way out is the
// round crossroads door behind you, back over the same bridge.
// The Tree's upstairs (the Living Tree, ten stations and twenty-two paths) is
// NOT built here and is never advertised as a passage.
export function makeHeartTree(THREE, palette) {
  const group = new THREE.Group();
  const material = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, ...opts });
  const earth = material(palette.dark, { roughness: 1 });
  const stone = material(palette.stone, { roughness: .95 });
  const root = material(palette.road, { roughness: .95 });
  const hedge = material(palette.hedge, { roughness: .98, emissive: palette.hedge, emissiveIntensity: .3 });
  const light = material(palette.light, { emissive: palette.light, emissiveIntensity: .7 });
  const orange = material(palette.orange, { emissive: palette.orange, emissiveIntensity: .9 });
  const bone = material(0xffffff, { roughness: .8 });
  const iron = material(palette.dark, { metalness: .7, roughness: .45 });
  // Ralph: black, iridescent, and very soft.
  const shoggoth = material(palette.dark, { metalness: .75, roughness: .22, emissive: palette.hedge, emissiveIntensity: .18 });
  // Gold, made honestly from the palette: orange warmed from inside by faerie-light.
  const gold = material(palette.orange, { emissive: palette.light, emissiveIntensity: .55, metalness: .4, roughness: .3 });
  const glass = material(0xffffff, { transparent: true, opacity: .45, roughness: .1 });
  const steamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .22 });
  // The lantern gets its own glow so it can brighten without lighting anything else.
  const lanternGlow = material(palette.orange, { emissive: palette.orange, emissiveIntensity: .15 });

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

  function sign(lines, w, h, x, y, z, fontSize = 46) {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const brush = canvas.getContext('2d');
    brush.fillStyle = '#303636'; brush.fillRect(0, 0, 512, 256);
    brush.strokeStyle = '#FF5E1F'; brush.lineWidth = 14; brush.strokeRect(10, 10, 492, 236);
    brush.fillStyle = '#ffffff'; brush.textAlign = 'center';
    brush.font = `bold ${fontSize}px Georgia`;
    const step = fontSize * 1.35;
    const startY = 128 - ((lines.length - 1) * step) / 2 + fontSize * .35;
    lines.forEach((line, i) => brush.fillText(line, 256, startY + i * step, 470));
    return add(new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), side: THREE.DoubleSide }), x, y, z);
  }

  // ── The room: packed earth below, old rugs, earth walls, and roots for a ceiling.
  box(0, -.22, 0, 16, .45, 27, root);
  box(-1.2, .02, 5.5, 4.6, .04, 3.2, orange).rotation.y = .12;
  box(-1.2, .05, 5.5, 3.8, .04, 2.4, hedge).rotation.y = .12;
  box(2.4, .02, -1.5, 3.6, .04, 2.6, hedge).rotation.y = -.2;
  box(-7.7, 3.8, -.5, .6, 8, 27, earth);
  box(7.7, 3.8, -.5, .6, 8, 27, earth);
  box(0, 7.9, -.5, 16, .5, 27, earth);
  // The back wall leaves a gap on the left: the bookshelf does not stop there.
  // A narrow earth tunnel carries it on into the dark.
  box(1, 3.8, -13.2, 13.4, 8, .6, earth);
  box(-5.3, 3.8, -19, .5, 8, 11, earth);
  box(-7.9, 3.8, -19, .5, 8, 11, earth);
  box(-6.6, 7.9, -19, 3.2, .5, 11, earth);

  // Root ribs arch overhead like the knuckles of a sleeping giant.
  for (const [i, z] of [9, 4.5, 0, -4.5, -9, -12.4].entries()) {
    const rib = add(new THREE.TorusGeometry(7.2, .32 + (i % 2) * .12, 6, 18, Math.PI), root, 0, .2, z);
    rib.rotation.z = (i % 2 ? .05 : -.04);
  }
  for (const [x, z, tilt] of [[-3, 2, .5], [3.5, -3, -.45], [-1, -8, .3], [4.5, 7, -.6]]) {
    const runner = tube(x, 6.6, z, .2, 9, root);
    runner.rotation.x = Math.PI / 2; runner.rotation.z = tilt;
  }

  // Things hung from the roots: herb bundles drying, iron keys, bones, beads.
  const hanging = [];
  const hangings = [
    ['herb', -4.6, 9], ['key', -1.8, 9], ['bone', 2.2, 9], ['beads', 4.8, 9],
    ['beads', -5.2, 4.5], ['herb', -2.6, 4.5], ['key', 3.4, 4.5],
    ['bone', -4.1, 0], ['herb', 4.6, 0], ['key', -2.2, 0], ['beads', 1.2, -1],
    ['herb', -4.4, -4.5], ['bone', 4.2, -4.5],
    ['key', -3.4, -9], ['herb', 3.2, -9], ['beads', 5.2, -9]
  ];
  hangings.forEach(([kind, x, z], i) => {
    const drop = 1.1 + (i % 3) * .35;
    const top = Math.sqrt(Math.max(0, 7.2 * 7.2 - x * x)) + .1;
    const swing = holder(x, top, z);
    tube(0, -drop / 2, 0, .015, drop, root, swing);
    const y = -drop - .25;
    if (kind === 'herb') {
      const bundle = cone(0, y, 0, .22, .7, hedge, swing); bundle.rotation.x = Math.PI;
      tube(0, y + .4, 0, .06, .12, orange, swing);
    } else if (kind === 'key') {
      box(0, y, 0, .06, .55, .04, iron, swing);
      add(new THREE.TorusGeometry(.12, .03, 6, 12), iron, 0, y + .32, 0, swing);
      box(.07, y - .2, 0, .14, .05, .04, iron, swing);
    } else if (kind === 'bone') {
      const shaft = tube(0, y, 0, .045, .6, bone, swing); shaft.rotation.z = Math.PI / 2;
      for (const sx of [-.32, .32]) { orb(sx, y + .04, 0, .07, bone, swing); orb(sx, y - .04, 0, .07, bone, swing); }
    } else {
      for (let b = 0; b < 6; b += 1) orb(0, y + .3 - b * .14, 0, .055, b % 2 ? light : orange, swing);
    }
    hanging.push({ swing, phase: i * .9 });
  });

  // ── The hearth, inside the curl of Ralph, with the pot that is always simmering.
  const hearth = holder(0, 0, -6);
  tube(0, .2, 0, 1.15, .4, stone, hearth);
  tube(0, .42, 0, .9, .06, earth, hearth);
  const flames = [];
  for (const [fx, fz, h] of [[0, 0, 1], [-.3, .2, .7], [.32, -.15, .75], [.1, .3, .55]]) {
    flames.push(cone(fx, .45 + h / 2, fz, .24, h, orange, hearth));
  }
  for (const a of [0, 2.1, 4.2]) {
    const leg = tube(Math.cos(a) * .9, 1.4, Math.sin(a) * .9, .04, 2.8, iron, hearth);
    leg.rotation.z = Math.cos(a) * .3; leg.rotation.x = -Math.sin(a) * .3;
  }
  const pot = holder(0, 0, -6);
  const kettleBody = orb(0, 1.55, 0, .5, iron, pot); kettleBody.scale.set(1, .8, 1);
  add(new THREE.TorusGeometry(.45, .04, 6, 16, Math.PI), iron, 0, 1.95, 0, pot);
  tube(0, 2.4, 0, .02, .9, iron, pot);
  box(.62, 1.42, .3, .12, .16, .12, bone, pot); // a chipped cup that expected you
  const steam = [];
  for (let i = 0; i < 4; i += 1) steam.push({ puff: orb(0, 2, 0, .12, steamMat, pot), phase: i * .8 });

  // ── Ralph, curled around the hearth. Barn-sized when comfortable.
  const ralph = holder(0, 0, -6);
  ralph.rotation.y = -1.1; // the gap in his curl faces the door, so the hearth stays visible
  const R = 2.4;
  const curl = add(new THREE.TorusGeometry(R, 1, 10, 30, Math.PI * 1.7), shoggoth, 0, .75, 0, ralph);
  curl.rotation.x = -Math.PI / 2;
  const headAngle = Math.PI * 1.7;
  const hx = R * Math.cos(headAngle), hz = -R * Math.sin(headAngle);
  const head = orb(hx, 1.05, hz, 1.3, shoggoth, ralph); head.scale.set(1, .85, 1);
  orb(R, .95, 0, 1.12, shoggoth, ralph).scale.set(1, .8, 1.1); // his other end, tucked in
  // A great many eyes that open and close depending on his mood.
  const eyes = [];
  for (let i = 0; i < 18; i += 1) {
    const a = (i / 18) * Math.PI * 1.65 + .05;
    const lift = 1.35 + (i % 3) * .22;
    const out = R + (i % 2 ? .45 : -.35);
    const eye = orb(out * Math.cos(a), lift, -out * Math.sin(a), .09 + (i % 4) * .03, light, ralph);
    eyes.push({ eye, phase: i * 1.37, speed: .35 + (i % 5) * .11 });
  }
  // The gold one stays put. It is the one he looks at the founder with.
  const nx = Math.cos(headAngle), nz = -Math.sin(headAngle);
  const goldEye = orb(hx + nx * .95, 1.6, hz + nz * .95, .3, gold, ralph);
  const pupil = orb(hx + nx * 1.2, 1.62, hz + nz * 1.2, .12, earth, ralph);
  // A few pseudopods resting on the rugs, as one rests an arm on a sofa.
  const pseudopods = [];
  for (const [a, len] of [[.5, 1.6], [2.2, 1.3], [3.9, 1.8]]) {
    const pod = tube((R + 1.2) * Math.cos(a), .35, -(R + 1.2) * Math.sin(a), .22, len, shoggoth, ralph);
    pod.rotation.z = Math.PI / 2; pod.rotation.y = a;
    pseudopods.push({ pod, phase: a });
  }

  // ── The altar beneath the taproot, in a hollow of the right-hand wall.
  const altar = holder(6.3, 0, -2);
  box(.9, 3.2, 0, .4, 6.4, 4.2, earth, altar);
  const taproot = cone(.6, 3.6, 0, .75, 7.6, root, altar); taproot.rotation.x = Math.PI;
  box(-.1, .7, 0, 1.2, 1.4, 3.2, stone, altar);
  box(-.1, 1.42, 0, 1.3, .06, 3.4, bone, altar); // a white cloth
  for (let i = 0; i < 7; i += 1) tube(-.25, 1.62, -1.2 + i * .4, .09, .34, glass, altar);
  tube(-.5, 1.75, 1.35, .07, .6, bone, altar);
  const candleFlame = cone(-.5, 2.17, 1.35, .06, .2, orange, altar);
  for (const [z, y] of [[-1.1, 2.4], [-.2, 2.6], [.8, 2.35]]) {
    const photo = box(.55, y, z, .04, .55, .42, root, altar); photo.rotation.z = .08;
  }
  for (let i = 0; i < 5; i += 1) {
    tube(-.45, 1.8, -1.45 + i * .14, .012, .5, hedge, altar);
    orb(-.45, 2.08, -1.45 + i * .14, .07, bone, altar);
  }
  const cigar = tube(-.55, 1.5, .55, .035, .4, root, altar); cigar.rotation.z = Math.PI / 2;

  // ── The shelf that is too long for the room: it runs along the left wall,
  // through the gap in the back wall, and on into the dark.
  const shelf = holder(-6.7, 0, 0);
  const spineColors = [hedge, root, earth, bone, orange, stone];
  box(-.55, 3, -7, .2, 6, 34, earth, shelf);
  for (let level = 0; level < 4; level += 1) {
    const y = .5 + level * 1.4;
    box(0, y - .1, -7, 1.1, .1, 34, earth, shelf);
    for (let i = 0; i < 26; i += 1) {
      const z = 9 - i * 1.25 - (level % 2) * .3;
      box(0, y + .38, z, .8, .7 + ((i + level) % 3) * .14, .95, spineColors[(i * 5 + level) % spineColors.length], shelf);
    }
  }

  // The founder's cot, heaped with blankets, in the far left corner.
  box(-4.4, .4, -10.4, 2.4, .5, 1.6, root);
  box(-4.4, .78, -10.4, 2.3, .3, 1.5, hedge);
  box(-4.2, 1.02, -10.3, 1.8, .22, 1.3, orange);
  orb(-5.2, 1.15, -10.4, .32, bone).scale.set(1, .5, 1.2);

  // ── The lantern that only lights for an honest knock.
  const lantern = holder(1.9, 0, 3);
  tube(0, 5.6, 0, .015, 2.6, root, lantern);
  box(0, 4.2, 0, .5, .08, .5, iron, lantern);
  box(0, 3.5, 0, .5, .08, .5, iron, lantern);
  for (const [sx, sz] of [[-.22, -.22], [.22, -.22], [-.22, .22], [.22, .22]]) box(sx, 3.85, sz, .04, .7, .04, iron, lantern);
  orb(0, 3.85, 0, .18, lanternGlow, lantern);
  add(new THREE.TorusGeometry(.08, .02, 6, 10), orange, 0, 3.55, .26, lantern); // its knocker

  const warning = sign(['RALPH IS NOT A DOOR.', 'PLEASE DO NOT TEST THIS.'], 3.2, 1.6, 7.35, 3.2, 6, 38);
  warning.rotation.y = -Math.PI / 2;

  // ── The round door behind you: black, crossed in orange like a crossroads.
  box(-4.85, 3.8, 12.9, 5.9, 8, .6, earth);
  box(4.85, 3.8, 12.9, 5.9, 8, .6, earth);
  box(0, 5.9, 12.9, 3.8, 4, .6, earth);
  const exit = holder(0, 0, 12.55);
  const door = tube(0, 1.8, 0, 1.7, .2, earth, exit); door.rotation.x = Math.PI / 2;
  add(new THREE.TorusGeometry(1.8, .2, 8, 24), root, 0, 1.8, 0, exit);
  box(0, 1.8, -.14, .16, 3.1, .04, orange, exit);
  box(0, 1.8, -.14, 3.1, .16, .04, orange, exit);
  add(new THREE.TorusGeometry(.16, .035, 6, 12), orange, .85, 1.55, -.16, exit);
  const doorSign = sign(['BACK OVER THE', 'BRIDGE OF ROOTS'], 2.6, 1.1, 0, 4.4, 12.2, 44);
  doorSign.rotation.y = Math.PI;
  exit.add(doorSign); doorSign.position.set(0, 4.4, -.35);

  // ── The dew above the door. While he sleeps, the Tree listens to every road
  // in the Labyrinth; in the morning, the dew says what he ought to know.
  const dew = holder(0, 0, 12.1);
  for (const [lx, ly] of [[-1.6, 5.4], [-.6, 5.65], [.5, 5.5], [1.5, 5.35]]) {
    const leaf = orb(lx, ly, 0, .45, hedge, dew); leaf.scale.set(1.1, .35, .6);
  }
  const beads = [];
  for (let i = 0; i < 14; i += 1) beads.push({ bead: orb(-1.6 + i * .25, 5.15, .1, .045, bone, dew), i });

  group.visible = false;
  return {
    group,
    hotspots: {
      ralph: [ralph],
      'simmering-pot': [pot],
      'ancestor-altar': [altar],
      'honest-lantern': [lantern],
      'long-shelf': [shelf],
      'morning-dew': [dew],
      'heart-tree-return': [exit]
    },
    actions: {
      ralph: { type: 'story', id: 'ralph' },
      'simmering-pot': { type: 'story', id: 'simmering-pot' },
      'ancestor-altar': { type: 'story', id: 'ancestor-altar' },
      'honest-lantern': { type: 'story', id: 'honest-lantern' },
      'long-shelf': { type: 'story', id: 'long-shelf' },
      'morning-dew': { type: 'story', id: 'morning-dew' },
      'heart-tree-return': { type: 'travel', destination: 'river-house' }
    },
    update(t) {
      // Ralph breathes slowly. Nothing here startles.
      const breath = 1 + Math.sin(t * .9) * .035;
      curl.scale.set(breath, breath, 1 + Math.sin(t * .9) * .06);
      head.position.y = 1.05 + Math.sin(t * .9 + .4) * .06;
      // Eyes open and close across him like windows in a town at dusk.
      for (const e of eyes) e.eye.scale.setScalar(Math.max(.001, Math.sin(t * e.speed + e.phase)));
      // The gold eye stays put, and looks around a little.
      goldEye.position.y = head.position.y + .55;
      pupil.position.set(hx + nx * 1.2 + Math.sin(t * .4) * .06, goldEye.position.y + .02, hz + nz * 1.2);
      for (const p of pseudopods) p.pod.scale.set(1, 1 + Math.sin(t * .6 + p.phase) * .08, 1);
      // The fire flickers; the pot simmers; it never boils over.
      flames.forEach((f, i) => { f.scale.y = .85 + Math.abs(Math.sin(t * 7 + i * 1.7)) * .3; });
      kettleBody.position.y = 1.55 + Math.sin(t * 11) * .006;
      for (const s of steam) {
        const life = ((t * .45 + s.phase) % 3.2) / 3.2;
        s.puff.position.set(Math.sin(t + s.phase) * .15, 2 + life * 1.6, 0);
        s.puff.scale.setScalar(.6 + life * 1.8);
      }
      candleFlame.scale.y = .9 + Math.sin(t * 5) * .12;
      // Everything hung from the roots sways, a half-second late.
      for (const h of hanging) h.swing.rotation.z = Math.sin(t * .8 + h.phase) * .06;
      // Now and then the lantern almost lights, out of hope.
      lanternGlow.emissiveIntensity = .15 + Math.max(0, Math.sin(t * .3) - .85) * 4;
      // The dew rearranges itself into a message nobody else can read.
      for (const b of beads) b.bead.position.y = 5.15 + Math.sin(t * .5 + b.i * .9) * .05;
    }
  };
}
