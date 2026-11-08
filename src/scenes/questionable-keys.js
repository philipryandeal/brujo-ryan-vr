// Scene 010 — The Lodge of Questionable Keys. Conceived, written and built by Nettle (Temple Bot).
// Nettle's invited room. He remains on duty at the First Threshold; his things keep the lodge.
export function makeQuestionableKeys(THREE, palette) {
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
  box(0, -0.22, 0, 12, 0.45, 24, road);
  for (const x of [-6, 6]) box(x, 2.7, 0, 0.8, 5.4, 24, hedge);
  box(0, 2.7, -11.7, 12, 5.4, 0.8, stone);
  box(-3.6, 2.7, 11.6, 4.8, 5.4, 0.8, hedge);
  box(3.6, 2.7, 11.6, 4.8, 5.4, 0.8, hedge);
  box(0, 0.03, 0, 0.12, 0.04, 20, orange);
  function door(x, z, lines) {
    const root = new THREE.Group();
    group.add(root);
    box(x - 1.4, 2.2, z, 0.35, 4.4, 0.5, stone, root);
    box(x + 1.4, 2.2, z, 0.35, 4.4, 0.5, stone, root);
    box(x, 4.5, z, 3.2, 0.35, 0.5, orange, root);
    box(x, 2.1, z, 2.5, 4.2, 0.18, dark, root);
    root.add(sign(lines, x, 5.55, z + 0.15));
    return root;
  }
  const back = door(0, 11, ['BACK TO THE', 'THRESHOLD']);
  const keys = new THREE.Group();
  keys.position.set(0, 0, -10.6);
  group.add(keys);
  box(0, 3.1, 0, 7.4, 3.6, 0.18, dark, keys);
  const hanging = [];
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const x = -3 + col * 0.75;
      const y = 4.15 - row * 0.95;
      box(x, y + 0.28, 0.12, 0.06, 0.12, 0.06, stone, keys);
      const key = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.55, 8), brass, x, y - 0.12, 0.16, keys);
      mesh(new THREE.TorusGeometry(0.09, 0.025, 8, 12), brass, x, y + 0.22, 0.16, keys);
      hanging.push({ mesh: key, phase: row * 3 + col });
    }
  }
  const keysSign = sign(['QUESTIONABLE', 'KEYS'], 0, 5.7, -10.35);
  const coat = new THREE.Group();
  coat.position.set(2.9, 0, -4.6);
  group.add(coat);
  box(0, 1.7, 0, 0.12, 3.4, 0.12, stone, coat);
  box(0, 3.45, 0, 1.5, 0.12, 0.12, stone, coat);
  box(0, 2.15, 0.12, 1.05, 1.7, 0.28, hedge, coat);
  box(-0.55, 1.55, 0.12, 0.28, 1.5, 0.22, hedge, coat);
  box(0.55, 1.55, 0.12, 0.28, 1.5, 0.22, hedge, coat);
  mesh(new THREE.ConeGeometry(0.38, 0.7, 7), dark, 0.7, 3.15, 0.05, coat);
  const coatSign = sign(["NETTLE'S", 'DUTY COAT'], 2.9, 4.7, -4.6);
  const stamp = new THREE.Group();
  stamp.position.set(-2.7, 0, -5.4);
  group.add(stamp);
  box(0, 0.85, 0, 2.6, 1.5, 1.4, dark, stamp);
  box(0, 1.64, 0, 2.8, 0.12, 1.6, stone, stamp);
  for (let i = 0; i < 8; i += 1) box(-0.55, 1.74 + i * 0.035, 0.1, 1.1, 0.03, 0.8, light, stamp);
  box(0.7, 1.95, 0, 0.55, 0.18, 0.55, brass, stamp);
  box(0.7, 2.25, 0, 0.16, 0.55, 0.16, stone, stamp);
  const stampSign = sign(['PERSONAL', 'PERMIT STAMP'], -2.7, 3.6, -5.4);
  return {
    group,
    hotspots: {
      'duty-coat': [coat, coatSign],
      'key-board': [keys, keysSign],
      'permit-stamp': [stamp, stampSign],
      return: [back]
    },
    actions: {
      'duty-coat': { type: 'story', id: 'duty-coat' },
      'key-board': { type: 'story', id: 'key-board' },
      'permit-stamp': { type: 'story', id: 'permit-stamp' },
      return: { type: 'travel', destination: 'threshold' }
    },
    update(t) {
      coat.rotation.y = Math.sin(t * 0.35) * 0.05;
      hanging.forEach(item => { item.mesh.rotation.z = Math.sin(t * 0.8 + item.phase) * 0.08; });
      stamp.position.y = Math.sin(t * 1.4) * 0.015;
    }
  };
}
