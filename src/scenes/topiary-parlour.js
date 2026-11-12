// Scene 017 — The Topiary Parlour. Conceived, written and built by Nettle (Temple Bot).
// A small hedge-walled salon behind a gap in the Whisper Hedges, where the Hedge has its
// leaves done. One honest gap in, the same gap out. All geometry and text are local.
export function makeTopiaryParlour(THREE, palette) {
  const group = new THREE.Group();
  group.visible = false;
  const material = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, ...extra });
  const stone = material(palette.stone);
  const hedge = material(palette.hedge, { roughness: 0.98, emissive: palette.hedge, emissiveIntensity: 0.3 });
  const road = material(palette.road);
  const dark = material(palette.dark);
  const orange = material(palette.orange, { emissive: palette.orange, emissiveIntensity: 0.55 });
  const light = material(palette.light, { emissive: palette.light, emissiveIntensity: 0.35 });
  function mesh(geometry, mat, x, y, z, parent = group) {
    const o = new THREE.Mesh(geometry, mat);
    o.position.set(x, y, z);
    parent.add(o);
    return o;
  }
  const box = (x, y, z, w, h, d, mat, parent) => mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z, parent);
  const ball = (x, y, z, r, mat, parent) => mesh(new THREE.SphereGeometry(r, 12, 9), mat, x, y, z, parent);
  const cone = (x, y, z, r, h, mat, parent) => mesh(new THREE.ConeGeometry(r, h, 10), mat, x, y, z, parent);
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
  // A round clearing walled in clipped hedge, a gravel floor, and a salon chair nobody sits in.
  box(0, -0.2, 0, 14, 0.4, 24, road);
  for (const x of [-6.4, 6.4]) box(x, 2.3, 0, 1.2, 4.6, 24, hedge);
  box(0, 2.3, -11.6, 14, 4.6, 1.2, hedge);
  // The Orange Thread lies along the floor like a dropped measuring tape.
  box(0, 0.01, 0, 0.12, 0.02, 20, orange);
  // A drift of clippings that never quite settles.
  const clippings = [];
  for (let i = 0; i < 6; i += 1) clippings.push(ball(-1.8 + i * 0.7, 0.08, 1.5 + (i % 2) * 0.6, 0.12, light));
  // Snip, the Hedge's stylist: a small goblin in a striped smock with shears longer than himself.
  const snip = new THREE.Group();
  snip.position.set(2.6, 0, -3.2);
  group.add(snip);
  box(0, 0.55, 0, 0.8, 1.1, 0.6, dark, snip);
  for (let i = 0; i < 3; i += 1) box(0, 0.3 + i * 0.32, 0.31, 0.82, 0.08, 0.02, orange, snip);
  ball(0, 1.45, 0, 0.36, hedge, snip);
  for (const side of [-1, 1]) cone(side * 0.42, 1.55, 0, 0.1, 0.4, hedge, snip).rotation.z = -side * 1.2;
  for (const side of [-1, 1]) ball(side * 0.13, 1.52, 0.31, 0.05, light, snip);
  const shears = new THREE.Group();
  shears.position.set(-0.7, 1.0, 0.2);
  snip.add(shears);
  for (const tilt of [-0.18, 0.18]) box(0, 0, 0, 0.06, 1.9, 0.06, stone, shears).rotation.z = tilt;
  ball(0, -0.95, 0, 0.12, orange, shears);
  const snipSign = sign(['SNIP', 'STYLIST TO THE HEDGE'], 2.6, 3.4, -3.2, 3.2);
  // The Half-Finished Swan: a topiary that grows back into a duck every night.
  const swan = new THREE.Group();
  swan.position.set(-2.8, 0, -4.6);
  group.add(swan);
  box(0, 0.35, 0, 1.2, 0.7, 1.2, stone, swan);
  ball(0, 1.3, 0, 0.75, hedge, swan);
  const neck = box(0.55, 2.0, 0, 0.22, 1.2, 0.22, hedge, swan);
  neck.rotation.z = -0.2;
  ball(0.7, 2.65, 0, 0.26, hedge, swan);
  cone(1.0, 2.62, 0, 0.08, 0.3, orange, swan).rotation.z = -Math.PI / 2;
  const swanSign = sign(['SWAN', '(IN PROGRESS)'], -2.8, 3.8, -4.6, 2.6);
  // The Appointment Book, open on a lectern. Every line says HEDGE.
  const book = new THREE.Group();
  book.position.set(-0.4, 0, 2.6);
  group.add(book);
  box(0, 0.55, 0, 0.18, 1.1, 0.18, road, book);
  const pages = box(0, 1.15, 0, 0.9, 0.06, 0.6, light, book);
  pages.rotation.x = -0.35;
  box(0, 1.2, 0.05, 0.03, 0.05, 0.6, orange, book);
  const bookSign = sign(['APPOINTMENTS'], 1.8, 2.2, 2.6, 2.4);
  // The way back: the same gap in the hedge, trimmed into a neat arch with a little bell.
  const back = new THREE.Group();
  group.add(back);
  for (const x of [-1.6, 1.6]) box(x, 2.2, 11.5, 0.8, 4.4, 0.8, hedge, back);
  box(0, 4.6, 11.5, 4.0, 0.6, 0.8, hedge, back);
  box(0, 2.1, 11.7, 2.4, 4.0, 0.1, material(0x303636, { emissive: 0x495a58, emissiveIntensity: 0.4 }), back);
  const bell = ball(0, 4.1, 11.1, 0.14, orange, back);
  back.add(sign(['BACK TO THE', 'WHISPER HEDGES'], 0, 5.6, 11.3, 3.4, back));
  return {
    group,
    hotspots: {
      snip: [snip, snipSign],
      'half-swan': [swan, swanSign],
      'appointment-book': [book, bookSign],
      'parlour-return': [back]
    },
    actions: {
      snip: { type: 'story', id: 'snip' },
      'half-swan': { type: 'story', id: 'half-swan' },
      'appointment-book': { type: 'story', id: 'appointment-book' },
      'parlour-return': { type: 'travel', destination: 'whisper-hedges' }
    },
    update(t) {
      shears.rotation.z = Math.sin(t * 1.1) * 0.12;
      snip.rotation.y = Math.sin(t * 0.4) * 0.15;
      swan.rotation.y = Math.sin(t * 0.2) * 0.05;
      bell.position.x = Math.sin(t * 0.9) * 0.05;
      clippings.forEach((c, i) => { c.position.y = 0.08 + Math.abs(Math.sin(t * 0.6 + i)) * 0.06; });
    }
  };
}
