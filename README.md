# BRUJO RYAN'S LABYRINTH
**Spirits live here. Mind your manners.**

An independent, playful browser world. Scenes 001–002: **The First Threshold** and **The Whisper Hedges**.

**Home:** [labyrinth.brujoryan.com](https://labyrinth.brujoryan.com) (custom domain; DNS verification may still be pending). Existing Railway address remains available.

**Want to add a room?** Begin with [The Labyrinth Scene Standard](SCENE_STANDARD.md), then copy [`src/scenes/scene-template.js`](src/scenes/scene-template.js). Creators may submit a scene card without writing code. Ryan reviews every proposed passage; no contributor pushes directly to production.

## The first stones
Dark-green stone and hedge walls, orange runes, the Orange Gate, a goblin named Nettle, a faerie called Mothlight, a distant glowing Tree, and the massive offstage shoggoth snoring so deeply the visitor's viewpoint trembles. Click the residents (or their accessible buttons) for original dialogue. Desktop users drag to look; compatible headsets can select Enter VR.

**Two scenes are connected now.** Cross the Orange Gate to reach the opinionated Whisper Hedges, then return through the glowing doorway. A gentle orange-thread fade makes the passage feel magical. Future destinations remain intentionally unbuilt.

Transition narration remains fully readable for five seconds between the fades, including when the visitor prefers reduced motion. This timing is shared by both passages and future scenes.

There is **no map and never will be one**. Discover the world by exploring actual scenes, talking to residents, and choosing doorways. Navigation is scene-to-scene, not a giant continuously loaded 3D level; each scene has explicit entrances and exits, and no headset or long walk is required.

## Goblin-keeper story foundation
The goblins keep this kingdom, but they do not exist solely to help visitors. Nettle has a bureaucracy, Biscuit has a lost-property racket, and Moldy has a long-running dispute with the hedges. Mothlight and the Orange Gate have opinions too.

The First Threshold now offers branching, authored conversations, a rotating goblin noticeboard, return-visit greetings within the open page, and idle whispers that suggest life beyond the visible path. All of this runs locally without accounts, analytics, an AI API, or server-side storage. A lightweight text-story mode remains usable if WebGL is unavailable. See [KINGDOM.md](KINGDOM.md) for the creative rules and how to add residents.

**Controls:** Cross the Threshold, click the gate (or **Approach the Gate**), ask if you may pass, and choose **Cross the Orange Gate** within its conversation. Then interact with the Hedge and return through the glowing doorway. Use resident or noticeboard buttons, select replies, and close dialogues with Escape or Close. In 3D, drag to look and use WASD/arrow keys to walk. No direct-entry shortcut, map, or fast-travel menu.

## Canon and boundaries
- **The official palette (Ryan's ruling, Oct 25, 2026)**: letters `#FFFFFF`, orange `#FF5E1F`, light green `#495A58`, dark green `#303636` — preserve it exactly. The yellowish faerie-light `#B9F3A4` stays by Ryan's word.
- Existing brujoryan.com stays untouched. This is a separate repo and experience.
- No accounts, tracking, database, or AI-provider keys. Resident dialogue is authored fiction.
- The eventual Poto Mitan / Living Tree heart retains ten stations and twenty-two Temple-authored roads, without Da'at.
- The Orange Thread symbolizes Techno-Kabbalah as a whole, not a station.

## Run
Node 20+: `npm start`, then open http://localhost:3000. `npm run check` checks JavaScript syntax and story-engine tests. Three.js 0.186.1 comes from a pinned CDN import map and requires internet for 3D. WebXR needs a compatible browser/headset and HTTPS, but no headset is needed for desktop story play. Headset performance and interactions still need real-device testing.

## The roads ahead
**Open now:** First Threshold ↔ Whisper Hedges.

**Possible future passages, not built yet:** Doors That Remember, Wishing Well, Shoggoth Moat, Bridge of Roots, Living Tree. Future scenes should follow the `src/scenes/whisper-hedges.js` contract and register only real adjacent exits in `src/scene-manager.js`.

The new `src/scenes/stage-runtime.js` handles click targets generically, using each stage's `{group, hotspots, actions, update}` contract. `src/scene-manager.js` provides backstage titles, passages, controls, and five-second transition text. The navigation engine no longer needs per-scene branches for existing controls or curtain text. The steward integrates each reviewed new scene; [the standard](SCENE_STANDARD.md) spells out responsibilities and safety checks.

## Deploy when ready
**Railway only.** The repository already has its own Railway production service and custom subdomain. Do not replace the existing apex site or its DNS. Branches and PRs before merging; Ryan reviews.

