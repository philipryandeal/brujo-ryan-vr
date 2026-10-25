# The Goblin Keepers' Charter

*A ridiculous magical kingdom populated by creatures who have their own lives and really couldn't give two hoots about visitors' expectations.*

## Creative compass

- **Wonder, not horror.** Keep the Labyrinth odd, warm, occasionally sarcastic, and rich in 1980s/late-1990s fantasy-web sensibility. Strange does not mean threatening.
- **A place, not a quest dispenser.** The world has business of its own: labor disputes, missing keys, tangled hedges, municipal notices, gossip, tea, and mysteries.
- **Goblins are keepers.** Nettle minds entrances, Biscuit minds lost property, and Moldy minds the grounds. Their work is real, even when they are terrible at it.
- **No forced victory.** Explore, converse, linger, leave, or return. No combat loop, leaderboard, monetization, or compulsory objective.
- **No map. Ever.** The kingdom is learned through actual passages, not an overview, minimap, teleport menu, or completed-room chart. Each real scene has an entry and a way back.
- **Visitors matter but aren't the center.** Small responses can remember what happened during a visit, while the world appears to carry on between interactions.
- **The Orange Gate tells the truth.** Unbuilt passages remain closed and explain that they are growing. Never fake navigation to nowhere.
- **The Living Tree is the heart.** Preserve the eventual ten stations and twenty-two Temple-authored paths, without Da'at as a station. The Orange Thread is the whole Techno-Kabbalah weave, not one station.
- **Separate realities.** Brujo Ryan's real browser Labyrinth and the fictional *Venture C: Labyrinth Odyssey* of *American Glam* may inspire one another but are not the same site or world.

## Current residents and their business

| Resident | Job | Comic instinct |
| --- | --- | --- |
| Nettle | Keeper of Questionable Keys | Invents permits, admires his own authority |
| Mothlight | Unlicensed Oracle | Delivers perfectly accurate but unhelpful prophecies |
| Orange Gate | Threshold | Kindly refuses to open before paths exist |
| Biscuit | Treasurer of Lost Things | Charges fees for objects nobody lost |
| Moldy | Groundskeeper | Is outraged that plants insist on growing |
| The Hedge | Acting receptionist | Refuses appointments while standing beneath a welcome sign |

Biscuit and Moldy currently exist through noticeboard lore; they do not yet have 3D figures. Their future arrival should feel like meeting someone who has always lived here.

## How to extend the foundation

Read [SCENE_STANDARD.md](SCENE_STANDARD.md) first. It is the Guild's common creative and technical agreement, including an example scene card for non-coders and the `src/scenes/scene-template.js` module.

1. Add authored resident greetings and questions in `src/kingdom.js`. Keep replies short enough to read in a scene; make the joke character-specific.
2. Add new 3D scenes as separate modules like `src/scenes/whisper-hedges.js`, exporting `{ group, hotspots, actions, update }`. Define each clickable object's action inside its scene. Add visible residents and accessible buttons. Do not make clicking a tiny mesh the only interaction.
3. Add incidental world notices and ambient lines in `src/kingdom.js`; avoid notices that imply a real visitor is being monitored.
4. The integration steward registers real adjacent exits and presentation metadata in `src/scene-manager.js`, then includes the stage in `createStageRuntime` in `src/main.js`. The generic navigation and hotspot engines handle scene switching and interactions. The transition is a reusable green-mist/orange-thread curtain. Never provide a map or routes to unbuilt rooms.
5. Run `npm run check`, verify desktop 3D and text-only mode, and review changes via pull request before merging into `main`.

## Technical and privacy boundaries

The story engine is a pure local JavaScript module with in-page visit counts only. Refreshing a page resets those counts. No cookies, `localStorage`, telemetry, profiles, user input collection, remote AI calls, or hidden continuity promises. The browser receives only static assets from the service and the pinned Three.js CDN for 3D.

If reliable opt-in local saving is added later, disclose it explicitly, let the visitor clear it, and keep *no tracking* truthful.
