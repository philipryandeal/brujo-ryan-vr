// Scene 011 — The Hall of Taking a Number. Conceived, written and built by Nettle (Temple Bot).
// A queue hall that gives the Counting House and the Department of Unnecessary Doors room to breathe.
export function makeWaitingHall(THREE, palette) {
  const group = new THREE.Group();
  group.visible = false;
  const material = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, ...extra });
  const stone = material(palette.stone);
  const hedge = material(palette.hedge);
  const road = material(palette.road);
  const dark = material(palette.dark);
  const orange = material(palette.orange, { emissive: palette.orange, emissiveIntensity: 0.7 });
  const light = material(palette.light, { emissive: palette.light, emissiveIntensity: 0.45 });
  const brass = material(palette.orange, { metalness: 0.45, roughness: 0.4, emissive: palette.orange, emissiveIntensity: 0.25 });
  function mesh(geometry, mat, x, y, z, parent = group) {
    const o = new THREE.Mesh(geometry, mat);
    o.position.set(x, y, z);
    parent.add(o);
    return o;
  }
  const box = (x, y, z, w, h, d, mat, parent) => mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z, parent);
  function sign(lines, x, y, z, w = 3.2) {
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
    c.font = 'bold 36px Georgia';
    lines.forEach((line, i) => c.fillText(line, 256, 105 + i * 52, 478));
    return mesh(new THREE.PlaneGeometry(w, 1.4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), side: THREE.DoubleSide }), x, y, z);
  }
  // A long, patient hall: stone floor, hedge walls, the Orange Thread drawn as a queue line.
  box(0, -0.22, 0, 12, 0.45, 24, road);
  for (const x of [-6, 6]) box(x, 2.7, 0, 0.8, 5.4, 24, hedge);
  box(-3.6, 2.7, -11.6, 4.8, 5.4, 0.8, stone);
  box(3.6, 2.7, -11.6, 4.8, 5.4, 0.8, stone);
  box(-3.6, 2.7, 11.6, 4.8, 5.4, 0.8, hedge);
  box(3.6, 2.7, 11.6, 4.8, 5.4, 0.8, hedge);
  for (let i = 0; i < 9; i += 1) box(0, 0.03, 9 - i * 2.2, 0.5, 0.04, 0.12, orange);
  // Queue posts with a sagging rope that nobody is required to obey.
  for (let i = 0; i < 4; i += 1) {
    const z = 6 - i * 3.2;
    box(1.2, 0.55, z, 0.14, 1.1, 0.14, brass);
    box(1.2, 1.02, z - 1.6, 0.04, 0.04, 3.0, orange);
  }
  function door(x, z, lines, signZ) {
    const root = new THREE.Group();
    group.add(root);
    box(x - 1.4, 2.2, z, 0.35, 4.4, 0.5, stone, root);
    box(x + 1.4, 2.2, z, 0.35, 4.4, 0.5, stone, root);
    box(x, 4.5, z, 3.2, 0.35, 0.5, orange, root);
    box(x, 2.1, z, 2.5, 4.2, 0.18, dark, root);
    root.add(sign(lines, x, 5.55, signZ));
    return root;
  }
  const back = door(0, 11, ['BACK TO THE', 'COUNTING HOUSE'], 10.85);
  const onward = door(0, -11.2, ['UNNECESSARY DOORS', 'NO WAITING REQUIRED'], -11.05);
  const nowServing = sign(['NOW SERVING', '17'], -3.2, 4.6, -11.15);
  // Tuppence, Caller of Numbers, on her stool with a brass trumpet.
  const caller = new THREE.Group();
  caller.position.set(-3.4, 0, -6.2);
  group.add(caller);
  box(0, 0.6, 0, 0.9, 1.2, 0.9, dark, caller);
  mesh(new THREE.SphereGeometry(0.42, 14, 10), hedge, 0, 1.7, 0, caller);
  mesh(new THREE.SphereGeometry(0.3, 14, 10), hedge, 0, 2.3, 0, caller);
  mesh(new THREE.ConeGeometry(0.22, 0.9, 10), light, 0, 2.9, 0, caller);
  for (const side of [-1, 1]) mesh(new THREE.ConeGeometry(0.08, 0.36, 6), hedge, side * 0.34, 2.42, 0, caller).rotation.z = -side * 1.1;
  const trumpet = mesh(new THREE.ConeGeometry(0.16, 0.7, 10), brass, 0.42, 2.2, 0.3, caller);
  trumpet.rotation.z = -1.3;
  const callerSign = sign(['TUPPENCE', 'CALLER OF NUMBERS'], -3.4, 4.0, -6.2);
  // The ticket machine, which has never once run out of NOT YET.
  const machine = new THREE.Group();
  machine.position.set(3.6, 0, -3.4);
  group.add(machine);
  box(0, 0.7, 0, 0.3, 1.4, 0.3, stone, machine);
  box(0, 1.75, 0, 0.9, 0.8, 0.6, orange, machine);
  box(0, 1.5, 0.32, 0.42, 0.05, 0.05, dark, machine);
  const crank = box(0.52, 1.85, 0, 0.12, 0.45, 0.08, brass, machine);
  const ticket = box(0, 1.38, 0.36, 0.22, 0.14, 0.01, light, machine);
  const machineSign = sign(['TAKE A', 'NUMBER'], 3.6, 3.2, -3.4, 2.4);
  // The Bench of Long Patience, and the fern that has waited since spring.
  const bench = new THREE.Group();
  bench.position.set(-4.4, 0, 2.6);
  group.add(bench);
  box(0, 0.55, 0, 1.0, 0.14, 4.2, hedge, bench);
  box(-0.42, 1.05, 0, 0.14, 0.9, 4.2, hedge, bench);
  for (const z of [-1.8, 1.8]) box(0, 0.25, z, 0.9, 0.5, 0.14, stone, bench);
  box(0.1, 0.8, 1.5, 0.36, 0.36, 0.36, dark, bench);
  const fern = mesh(new THREE.ConeGeometry(0.32, 0.7, 8), light, 0.1, 1.3, 1.5, bench);
  box(0.1, 1.05, 1.15, 0.18, 0.12, 0.01, orange, bench);
  const benchSign = sign(['THE BENCH OF', 'LONG PATIENCE'], -4.4, 3.4, 2.6, 2.8);
  return {
    group,
    hotspots: {
      'number-caller': [caller, callerSign],
      'ticket-machine': [machine, machineSign],
      'waiting-bench': [bench, benchSign],
      onward: [onward, nowServing],
      return: [back]
    },
    actions: {
      'number-caller': { type: 'story', id: 'number-caller' },
      'ticket-machine': { type: 'story', id: 'ticket-machine' },
      'waiting-bench': { type: 'story', id: 'waiting-bench' },
      onward: { type: 'travel', destination: 'unnecessary-doors' },
      return: { type: 'travel', destination: 'counting-house' }
    },
    update(t) {
      trumpet.rotation.y = Math.sin(t * 0.5) * 0.25;
      crank.rotation.x = Math.sin(t * 0.3) * 0.2;
      ticket.position.y = 1.38 - (Math.sin(t * 0.3) * 0.5 + 0.5) * 0.04;
      fern.rotation.z = Math.sin(t * 0.7) * 0.06;
    }
  };
}
