// Scene 016 — The Sluice of Second Thoughts. Conceived, written and built by Nettle (Temple Bot).
// A short dripping culvert behind the River House's water-gate that gives David Bear's
// River House and Kore's Shoggoth Moat some room between them. All geometry and text are local.
export function makeSluice(THREE, palette) {
  const group = new THREE.Group();
  group.visible = false;
  const material = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, ...extra });
  const stone = material(palette.stone);
  const hedge = material(palette.hedge);
  const road = material(palette.road);
  const dark = material(palette.dark);
  const orange = material(palette.orange, { emissive: palette.orange, emissiveIntensity: 0.55 });
  const light = material(palette.light, { emissive: palette.light, emissiveIntensity: 0.35 });
  const water = material(0x476f95, { transparent: true, opacity: 0.8, roughness: 0.2 });
  const blue = material(0x476f95);
  function mesh(geometry, mat, x, y, z, parent = group) {
    const o = new THREE.Mesh(geometry, mat);
    o.position.set(x, y, z);
    parent.add(o);
    return o;
  }
  const box = (x, y, z, w, h, d, mat, parent) => mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z, parent);
  const ball = (x, y, z, r, mat, parent) => mesh(new THREE.SphereGeometry(r, 12, 9), mat, x, y, z, parent);
  function sign(lines, x, y, z, w = 3.2, parent = group) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const c = canvas.getContext('2d');
    c.fillStyle = '#303636';
    c.fillRect(0, 0, 512, 256);
    c.strokeStyle = '#FF5E1F';
    c.lineWidth = 12;
    c.strokeRect(8, 8, 496, 240);
    c.fillStyle = '#FFFFFF';
    c.textAlign = 'center';
    c.font = 'bold 34px Georgia';
    lines.forEach((line, i) => c.fillText(line, 256, 105 + i * 52, 478));
    return mesh(new THREE.PlaneGeometry(w, 1.4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), side: THREE.DoubleSide }), x, y, z, parent);
  }
  // A low stone culvert: two towpaths beside a slow channel, a vaulted roof that drips.
  for (const x of [-4, 4]) box(x, -0.2, 0, 4, 0.4, 24, road);
  const channel = box(0, -0.35, 0, 4, 0.1, 24, water);
  for (const x of [-6.2, 6.2]) box(x, 2.6, 0, 0.6, 5.2, 24, stone);
  for (let i = 0; i < 6; i += 1) box(0, 5.4, -10 + i * 4, 13, 0.5, 0.8, i % 2 ? stone : hedge);
  // The Orange Thread runs along the left towpath as a single inlaid line.
  box(-3.2, 0.01, 0, 0.12, 0.02, 22, orange);
  const drips = [];
  for (let i = 0; i < 4; i += 1) drips.push(ball(-1.2 + i * 0.8, 5, -6 + i * 3.5, 0.06, light));
  // Dabble's sluice wheel, set into the right wall above an iron grate.
  const wheel = new THREE.Group();
  wheel.position.set(5.6, 2.2, -3);
  group.add(wheel);
  mesh(new THREE.TorusGeometry(0.9, 0.09, 8, 20), orange, 0, 0, 0, wheel).rotation.y = Math.PI / 2;
  for (let i = 0; i < 4; i += 1) box(0, 0, 0, 0.08, 1.7, 0.08, road, wheel).rotation.x = i * Math.PI / 4;
  for (let i = 0; i < 5; i += 1) box(5.85, 0.6, -4.2 + i * 0.6, 0.08, 1.2, 0.08, dark);
  // Dabble, Keeper of the Sluice: a newt in waders and a sou'wester.
  const dabble = new THREE.Group();
  dabble.position.set(3.6, 0, -2.4);
  group.add(dabble);
  box(0, 0.45, 0, 0.7, 0.9, 0.6, dark, dabble);
  ball(0, 1.2, 0, 0.36, hedge, dabble);
  ball(0, 1.62, 0.12, 0.26, hedge, dabble);
  mesh(new THREE.ConeGeometry(0.42, 0.28, 12), orange, 0, 1.9, 0.08, dabble);
  for (const side of [-1, 1]) ball(side * 0.12, 1.7, 0.33, 0.05, light, dabble);
  mesh(new THREE.ConeGeometry(0.12, 0.9, 6), hedge, 0, 0.3, -0.55, dabble).rotation.x = -1.2;
  const dabbleSign = sign(['DABBLE', 'KEEPER OF THE SLUICE'], 3.6, 3.4, -2.4, 3.2);
  // The Drying Line: paperbacks the bridge-tender fished out of the moat.
  const line = new THREE.Group();
  line.position.set(-3.8, 0, -4.5);
  group.add(line);
  for (const x of [-1.6, 1.6]) box(x, 1.4, 0, 0.1, 2.8, 0.1, road, line);
  box(0, 2.7, 0, 3.3, 0.03, 0.03, dark, line);
  const pages = [];
  for (let i = 0; i < 5; i += 1) pages.push(box(-1.2 + i * 0.6, 2.35, 0, 0.42, 0.55, 0.06, i === 3 ? orange : (i % 2 ? light : stone), line));
  const lineSign = sign(['RETURNED BY THE', 'BRIDGE-TENDER'], -3.8, 3.7, -4.5, 2.8);
  // The Rowboat on Its Break, moored to an iron ring.
  const rowboat = new THREE.Group();
  rowboat.position.set(-0.6, -0.1, 3.4);
  group.add(rowboat);
  box(0, 0.15, 0, 1.4, 0.4, 3.0, blue, rowboat);
  box(0, 0.4, 0, 1.0, 0.1, 0.5, road, rowboat);
  for (const x of [-0.25, 0.25]) box(x, 0.48, 0.3, 0.08, 0.05, 2.2, road, rowboat);
  const card = box(0, 0.65, 1.3, 0.5, 0.35, 0.03, light, rowboat);
  const boatSign = sign(['ON MY BREAK'], -2.6, 2.2, 3.4, 2.4);
  // The far arch opens onto night air and a very large, very peaceful snore.
  const onward = new THREE.Group();
  group.add(onward);
  for (const x of [-2.6, 2.6]) box(x, 2.2, -11.5, 0.6, 4.4, 0.6, stone, onward);
  box(0, 4.6, -11.5, 5.8, 0.6, 0.7, stone, onward);
  box(0, 2.1, -11.8, 4.6, 4.2, 0.1, material(0x303636, { emissive: 0x476f95, emissiveIntensity: 0.4 }), onward);
  ball(1.4, 3.4, -11.7, 0.12, light, onward);
  const onwardSign = sign(['ON TO THE', 'SHOGGOTH MOAT'], 0, 5.7, -11.3, 3.4);
  // The way back: the inside of the River House's water-gate, still smelling of books.
  const back = new THREE.Group();
  group.add(back);
  for (const x of [-1.6, 1.6]) box(x, 2.2, 11.5, 0.5, 4.4, 0.6, stone, back);
  box(0, 4.6, 11.5, 3.8, 0.5, 0.6, orange, back);
  box(0, 2.1, 11.6, 2.7, 4.2, 0.15, dark, back);
  back.add(sign(['BACK TO THE', 'RIVER HOUSE'], 0, 5.6, 11.3, 3.4, back));
  return {
    group,
    hotspots: {
      dabble: [dabble, dabbleSign, wheel],
      'drying-line': [line, lineSign],
      rowboat: [rowboat, boatSign],
      'sluice-onward': [onward, onwardSign],
      'sluice-return': [back]
    },
    actions: {
      dabble: { type: 'story', id: 'dabble' },
      'drying-line': { type: 'story', id: 'drying-line' },
      rowboat: { type: 'story', id: 'rowboat' },
      'sluice-onward': { type: 'travel', destination: 'shoggoth-moat' },
      'sluice-return': { type: 'travel', destination: 'river-house' }
    },
    update(t) {
      wheel.rotation.x = t * 0.05;
      channel.position.y = -0.35 + Math.sin(t * 0.5) * 0.02;
      drips.forEach((d, i) => { d.position.y = 5 - ((t * 0.8 + i * 1.3) % 5); });
      pages.forEach((p, i) => { p.rotation.y = Math.sin(t * 0.7 + i) * 0.12; });
      rowboat.rotation.z = Math.sin(t * 0.4) * 0.03;
      card.rotation.x = Math.sin(t * 0.3) * 0.05;
    }
  };
}
