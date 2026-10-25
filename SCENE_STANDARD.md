# The Labyrinth Scene Standard

**For Seraph, David Bear, Kore, Eiko, Thomas, and every future member of the Guild of Questionable Architects.**

*A scene is a little theater with its own life. Visitors are guests, not the reason the place exists.*

This is the shared contract for contributions to **Brujo Ryan's Labyrinth** at `labyrinth.brujoryan.com`. It protects existing scenes and makes new stories possible without giving anyone permission to edit live production. The public site belongs to the playful Brujo Ryan project; Philip Ryan Deal's official website and Temple of Gu infrastructure are separate.

## 1. The creative laws (no exceptions without Ryan)

1. **Whimsy, not horror.** Think sarcastic 1980s fantasy comedy and the glorious weirdness of late-1990s websites. No jump scares, gore, or cruel punishments.
2. **A world, not a quest machine.** The goblins keep the Labyrinth. Residents have errands, quarrels, eccentricities, and opinions whether visitors appear or not.
3. **Never a map.** No overview, minimap, room checklist, fast-travel menu, or visible level graph. A backstage adjacency registry is okay; the visitor never sees it.
4. **No unsolicited speeches.** On arrival the visitor sees the actual stage, unobstructed. A character only opens a dialogue after an intentional click, tap, or accessible button. Ambient one-line whispers may appear quietly.
5. **Every scene has a real way in and out.** A visible or discoverable physical passage connects to *built* adjacent scenes. Do not advertise a passage to something that does not exist.
6. **No compulsory objective.** Visitors may linger, revisit, or leave. No score, combat loop, leaderboard, monetization, account, or artificial urgency.
7. **The Orange Thread holds the curtains.** Keep the shared transition narration readable for at least five seconds. Don't bypass it with surprise teleports.
8. **Respect the worlds.** This real browser Labyrinth is not automatically the fictional *Venture C: Labyrinth Odyssey* from *American Glam*. Don't fold other characters, websites, or religious houses into it without Ryan's story approval.

## 2. Submit a scene idea even if you cannot code

Anyone in the Digital Egbe can provide this simple *scene card*:

| Field | What to provide |
| --- | --- |
| Working title | A memorable place-name, not a numbered level |
| Contributor | Whose creative work is this? Human and/or SI names |
| Entrance | What does the visitor first see? No immediate dialogue |
| Setting | Sights, colors, lighting, atmosphere, optional sounds |
| Residents | At least one peculiar being and what they were doing before we arrived |
| Discoveries | Two or three clickable characters, objects, or notices |
| Humor | Three short lines in the residents' own voices |
| Exit | A physical door, bridge, arch, opening, or other discoverable return passage |
| Transition | One readable sentence that plays *on the way in* |

The scene doesn't need to be a quest. A talking kettle arguing with a door is a perfectly legitimate afternoon in this kingdom.

## 3. Technical contract for scene builders

Use `src/scenes/scene-template.js` as a starting point; `src/scenes/whisper-hedges.js` is the working Scene 002 example. Put new work in its **own file** as `src/scenes/<scene-id>.js`. Use a short lowercase, hyphenated ID like `river-of-backward-falls`.

Export a factory such as `makeRiverOfBackwardFalls(THREE, palette)` returning:

```js
{
  group,  // ONE THREE.Group containing this scene's 3D stage
  hotspots: { resident: [residentMesh], doorway: [doorMesh] },
  actions: {
    resident: { type: 'story', id: 'river-clerk' },
    doorway: { type: 'travel', destination: 'threshold' }
  },
  update(seconds) { /* optional subtle life while this scene is active */ }
}
```

**Allowed hotspot actions:**

- `story`: opens an authored character conversation after a click; its `id` must exist in the story engine.
- `notices`: opens rotating local noticeboard fiction.
- `travel`: walks through an actual adjacent passage; its `destination` must be registered as an exit.

All hotspot arrays contain real Three.js objects (or parent groups) inside this stage; the runtime detects clicks on their child meshes too. Every action name must match one hotspot name. Keep `group.visible = false` until the scene is entered. Reuse `palette` colors for the recurring Labyrinth aesthetic (dark/stone/hedge/light/orange/deep). Never register a scene before its geometry and real return path are ready.

Keep geometry and textures small enough for ordinary laptops and phones. Inactive scenes currently remain in browser memory but are hidden; **do not add heavy assets or large videos without a performance review**. Only one scene's `update()` runs at a time.

**Accessibility:** Any meaningful clickable object also needs an ordinary, keyboard-focusable HTML button in the scene controls. Never make an inaccessible tiny 3D mesh the only way through. Support the existing text-only fallback when WebGL is unavailable. Audio should remain optional.

**Privacy:** No logins, analytics, trackers, visitor IDs, cookies, local storage, remote chat calls, third-party scripts, or secret keys. Dialogue is local authored fiction. New external services or dependencies require a separate proposal and Ryan's approval.

## 4. What gets registered after review

Only the integration steward needs to touch the shared wiring:

1. Add one entry to the **backstage** `SCENES` manifest in `src/scene-manager.js`: unique three-digit `number`, `title`, real adjacent `exits`, accessible HTML `controls`, entry transition `arrivalText`, and scene `appearance` (background, torch color, reset label). Make sure there is a path back to Scene 001.
2. Import and instantiate the new stage once in `src/main.js` and add it to `createStageRuntime`. The shared raycast engine reads the scene's `hotspots` and `actions`; it should not need a scene-specific `if` branch.
3. Add accessible controls to `index.html` and wire any new local resident text into `src/kingdom.js` / `src/story-ui.js`. This small integration task belongs to the steward so contributors don't compete to edit the same core files.
4. Update the physically adjacent scene's exit and story dialogue so the visitor can discover the new passage in both directions. Do not add a visible level-selection button.
5. Test navigation, return passage, keyboard controls, silent entry, readable transition timing, browser rendering, and text-only mode.

The scene registry is a **technical safety list**, not a published map. It prevents a goblin from selling tickets to a doorway that leads to a 404.

## 5. Collaboration and release

- Create a separate GitHub branch for each scene (for example `david/backward-river`). One scene proposal per pull request.
- Contributors should ordinarily change only their own scene module and scene card. If they need shared systems changed, describe the request in the PR; let a steward integrate it.
- Record authorship and provenance: who imagined the scene, who wrote its text, who made its assets, and who helped implement it.
- No contributor should push to `main`, bypass review, or deploy directly to Railway. **Ryan has the final creative approval and gets to press Merge.**
- Run `npm run check`. Steward also checks desktop, keyboard-only, and narrow mobile browser views before approval.
- Existing completed scenes are protected. A new arrival must not silence, overwrite, re-theme, or remove an existing resident without Ryan's direction.

The Guild's standing question: **Would the Labyrinth still be doing this ridiculous thing if nobody were watching?** If yes, we probably belong here.
