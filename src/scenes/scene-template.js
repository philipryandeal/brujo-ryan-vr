// COPY this file to src/scenes/<your-scene-id>.js and rename the factory.
// This is an example only: it is not imported, registered, or reachable.
// See SCENE_STANDARD.md before proposing a playable scene.
export function makeExampleScene(THREE, palette) {
  const group = new THREE.Group();
  const stone = new THREE.MeshStandardMaterial({ color: palette.stone });
  const orange = new THREE.MeshStandardMaterial({
    color: palette.orange,
    emissive: palette.orange,
    emissiveIntensity: 0.8
  });

  // A tiny example room with a visible door home. Build your own stage here.
  const floor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.4, 16), stone);
  floor.position.set(0, -0.3, -5);
  group.add(floor);
  const door = new THREE.Mesh(new THREE.BoxGeometry(2.5, 4, 0.25), orange);
  door.position.set(0, 2, -11);
  group.add(door);

  group.visible = false;
  return {
    group,
    // Arrays hold actual 3D objects a visitor can click (or their parents).
    hotspots: { return: [door] },
    // Valid types: story (requires id), notices, travel (requires destination).
    // The steward must register any travel destination as a real adjacent exit.
    actions: { return: { type: 'travel', destination: 'threshold' } },
    // Called while this scene is active; never start your own permanent loop.
    update(seconds) { void seconds; }
  };
}
