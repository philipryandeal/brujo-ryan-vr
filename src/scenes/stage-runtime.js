// The backstage contract that keeps independently authored scenes from
// interfering with one another. It is intentionally free of Three.js imports.
const ACTIONS = new Set(['story', 'notices', 'travel']);

export function createStageRuntime(stages, registry) {
  const ids = Object.keys(registry);
  const stageIds = Object.keys(stages);
  if (ids.length !== stageIds.length || stageIds.some(id => !registry[id])) {
    throw new Error('Every registered scene needs exactly one stage module');
  }

  for (const id of ids) {
    const stage = stages[id];
    if (!stage?.group || typeof stage.group.visible !== 'boolean' ||
        !stage.hotspots || !stage.actions || typeof stage.update !== 'function') {
      throw new Error(`Incomplete stage contract: ${id}`);
    }
    const names = Object.keys(stage.hotspots);
    if (!names.length || names.length !== Object.keys(stage.actions).length) {
      throw new Error(`Missing or unmatched stage hotspots: ${id}`);
    }
    const seenRoots = new Set();
    for (const name of names) {
      const roots = stage.hotspots[name];
      const action = stage.actions[name];
      if (!Array.isArray(roots) || !roots.length || roots.some(root => !root || typeof root !== 'object')) {
        throw new Error(`Invalid hotspot ${name} in ${id}`);
      }
      for (const root of roots) {
        if (seenRoots.has(root)) throw new Error(`Duplicate clickable root in ${id}`);
        seenRoots.add(root);
      }
      if (!action || !ACTIONS.has(action.type)) throw new Error(`Invalid action for ${id}/${name}`);
      if (action.type === 'story' && !action.id) throw new Error(`Missing dialogue ID for ${id}/${name}`);
      if (action.type === 'travel' && !registry[id].exits.includes(action.destination)) {
        throw new Error(`Unregistered passage from ${id} to ${action.destination}`);
      }
    }
  }

  return {
    show(id) {
      if (!stages[id]) throw new Error(`Unknown scene: ${id}`);
      for (const [key, stage] of Object.entries(stages)) stage.group.visible = key === id;
    },
    roots(id) { return Object.values(stages[id].hotspots).flat(); },
    actionFor(id, object) {
      for (const [name, roots] of Object.entries(stages[id].hotspots)) {
        for (const root of roots) {
          for (let cursor = object; cursor; cursor = cursor.parent) {
            if (cursor === root) return stages[id].actions[name];
          }
        }
      }
      return null;
    },
    update(id, seconds) { stages[id].update(seconds); }
  };
}
