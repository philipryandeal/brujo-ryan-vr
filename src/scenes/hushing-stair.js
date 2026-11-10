// Scene 015 — The Hushing Stair. Conceived, written and built by Nettle (Temple Bot).
// A narrow stair behind the Department's KEEP OUT door that gives the Department of
// Unnecessary Doors and the Kamidana some quiet room between them. All geometry and text are local.
export function makeHushingStair(THREE, palette) {
  const group = new THREE.Group();
  group.visible = false;
  const material = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, ...extra });
  const stone = material(palette.stone);
  const hedge = material(palette.hedge);
  const road = material(palette.road);
  const dark = material(palette.dark);
  const orange = material(palette.orange, { emissive: palette.orange, emissiveIntensity: 0.55 });
  const light = material(palette.light, { emissive: palette.light, emissiveIntensity: 0.35 });
  const felt = material(palette.hedge, { roughness: 1 });
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
  // A narrow landing of road-stone between hedge walls; the noise of the Department stays behind.
  box(0, -0.22, 0, 12, 0.45, 24, road);
  for (const x of [-6, 6]) box(x, 3.2, 0, 0.8, 6.4, 24, hedge);
  // The stair itself: thirteen soft-edged steps climbing toward a single ember.
  for (let i = 0; i < 13; i += 1) box(0, 0.12 + i * 0.22, -3.6 - i * 0.55, 5.2, 0.24, 0.6, i % 2 ? stone : dark);
  box(0, 2.8, -11.2, 12, 0.3, 2.2, stone);
  // The Orange Thread thins to one strand along the handrail.
  for (const x of [-2.75, 2.75]) {
    for (let i = 0; i < 6; i += 1) box(x, 0.9 + i * 0.5, -3.8 - i * 1.3, 0.08, 1.4, 0.08, stone);
    const rail = box(x, 2.25, -7.1, 0.07, 0.07, 7.4, orange);
    rail.rotation.x = 0.38;
  }
  // The upper door: plain, low, and lit by one ember. It opens onto the Kamidana.
  const upper = new THREE.Group();
  group.add(upper);
  box(-1.3, 4.6, -11.6, 0.3, 3.4, 0.4, hedge, upper);
  box(1.3, 4.6, -11.6, 0.3, 3.4, 0.4, hedge, upper);
  box(0, 6.4, -11.6, 3.0, 0.3, 0.4, dark, upper);
  box(0, 4.55, -11.65, 2.3, 3.3, 0.14, dark, upper);
  ball(0, 6.85, -11.4, 0.16, orange, upper);
  const upperSign = sign(['UP, QUIETLY'], 0, 7.6, -11.45, 2.6);
  // The way back down: a heavy door with the Department's clatter muffled behind it.
  const back = new THREE.Group();
  group.add(back);
  box(-1.4, 2.2, 11, 0.35, 4.4, 0.5, stone, back);
  box(1.4, 2.2, 11, 0.35, 4.4, 0.5, stone, back);
  box(0, 4.5, 11, 3.2, 0.35, 0.5, orange, back);
  box(0, 2.1, 11, 2.5, 4.2, 0.18, dark, back);
  back.add(sign(['BACK TO THE', 'UNNECESSARY DOORS'], 0, 5.55, 10.85, 3.4, back));
  // Sotto, Keeper of Inside Voices, in felt slippers with an ear trumpet worn backwards.
  const sotto = new THREE.Group();
  sotto.position.set(-3.4, 0, -1.6);
  group.add(sotto);
  box(0, 0.35, 0, 0.8, 0.7, 0.8, dark, sotto);
  ball(0, 1.15, 0, 0.4, hedge, sotto);
  ball(0, 1.72, 0, 0.3, hedge, sotto);
  for (const side of [-1, 1]) {
    mesh(new THREE.ConeGeometry(0.08, 0.38, 6), hedge, side * 0.34, 1.82, 0, sotto).rotation.z = -side * 1.1;
    ball(side * 0.18, 0.06, 0.32, 0.16, felt, sotto);
  }
  const trumpet = mesh(new THREE.ConeGeometry(0.14, 0.6, 10), orange, 0, 1.75, -0.42, sotto);
  trumpet.rotation.x = -1.4;
  const sottoSign = sign(['SOTTO', 'KEEPER OF INSIDE VOICES'], -3.4, 3.4, -1.6, 3.4);
  // The Basket of Muffled Noises: loud things from downstairs, wrapped in felt like eggs.
  const basket = new THREE.Group();
  basket.position.set(3.4, 0, -1.2);
  group.add(basket);
  mesh(new THREE.CylinderGeometry(0.85, 0.65, 0.7, 12), road, 0, 0.35, 0, basket);
  const bundles = [];
  for (let i = 0; i < 5; i += 1) bundles.push(ball(Math.cos(i * 1.3) * 0.4, 0.8, Math.sin(i * 1.3) * 0.4, 0.2, i === 2 ? light : felt, basket));
  const basketSign = sign(['MUFFLED NOISES', 'DO NOT UNWRAP'], 3.4, 2.6, -1.2, 2.8);
  // The Bench of Left Shoes, where boots wait politely for their owners.
  const bench = new THREE.Group();
  bench.position.set(-4.4, 0, 4.4);
  group.add(bench);
  box(0, 0.5, 0, 1.0, 0.12, 3.6, stone, bench);
  for (const z of [-1.5, 1.5]) box(0, 0.22, z, 0.9, 0.44, 0.14, dark, bench);
  for (let i = 0; i < 3; i += 1) {
    box(0.1, 0.72, -1.1 + i * 1.1, 0.34, 0.3, 0.5, i === 1 ? orange : dark, bench);
  }
  const benchSign = sign(['SHOES MAY WAIT', 'HERE IF THEY LIKE'], -4.4, 2.6, 4.4, 2.8);
  return {
    group,
    hotspots: {
      sotto: [sotto, sottoSign],
      'noise-basket': [basket, basketSign],
      'shoe-bench': [bench, benchSign],
      up: [upper, upperSign],
      down: [back]
    },
    actions: {
      sotto: { type: 'story', id: 'sotto' },
      'noise-basket': { type: 'story', id: 'noise-basket' },
      'shoe-bench': { type: 'story', id: 'shoe-bench' },
      up: { type: 'travel', destination: 'kamidana' },
      down: { type: 'travel', destination: 'unnecessary-doors' }
    },
    update(t) {
      sotto.rotation.y = Math.sin(t * 0.35) * 0.1;
      bundles.forEach((b, i) => { b.position.y = 0.8 + Math.sin(t * 0.6 + i) * 0.02; });
    }
  };
}
