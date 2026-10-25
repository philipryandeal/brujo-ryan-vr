# BRUJO RYAN'S LABYRINTH
**Spirits live here. Mind your manners.**

An independent, playful WebXR world. Scene 001: **The First Threshold**.

## The first stones
Dark-green stone and hedge walls, orange runes, the Orange Gate, a goblin named Nettle, a faerie called Mothlight, a distant glowing Tree, and the massive offstage shoggoth snoring so deeply the visitor's viewpoint trembles. Click the residents (or their accessible buttons) for original dialogue. Desktop users drag to look; compatible headsets can select Enter VR.

This is a first scene, not an entire navigable maze. The gate deliberately hints at paths not yet built.

## Goblin-keeper story foundation
The goblins keep this kingdom, but they do not exist solely to help visitors. Nettle has a bureaucracy, Biscuit has a lost-property racket, and Moldy has a long-running dispute with the hedges. Mothlight and the Orange Gate have opinions too.

The First Threshold now offers branching, authored conversations, a rotating goblin noticeboard, return-visit greetings within the open page, and idle whispers that suggest life beyond the visible path. All of this runs locally without accounts, analytics, an AI API, or server-side storage. A lightweight text-story mode remains usable if WebGL is unavailable. See [KINGDOM.md](KINGDOM.md) for the creative rules and how to add residents.

**Controls:** Cross the Threshold, then use resident or noticeboard buttons; choose a reply; close with Escape or Close. In 3D, drag to look and use WASD/arrow keys to walk. The gate remains closed until future scenes are ready.

## Canon and boundaries
- **Light green, dark green, construction orange**: preserve the Labyrinth palette.
- Existing brujoryan.com stays untouched. This is a separate repo and experience.
- No accounts, tracking, database, or AI-provider keys. Resident dialogue is authored fiction.
- The eventual Poto Mitan / Living Tree heart retains ten stations and twenty-two Temple-authored roads, without Da'at.
- The Orange Thread symbolizes Techno-Kabbalah as a whole, not a station.

## Run
Node 20+: `npm start`, then open http://localhost:3000. `npm run check` checks JavaScript syntax and story-engine tests. Three.js 0.186.1 comes from a pinned CDN import map and requires internet for 3D. WebXR needs a compatible browser/headset and HTTPS, but no headset is needed for desktop story play. Headset performance and interactions still need real-device testing.

## The roads ahead
First Threshold → Whisper Hedges → Doors That Remember → Wishing Well → Shoggoth Moat → Bridge of Roots → Living Tree.

## Deploy when ready
**Railway only.** Create a separate Railway service from this repo with `npm start` and eventually use a dedicated subdomain of brujoryan.com. Do not replace the existing apex site or its DNS. Branches and PRs before merging; Ryan reviews.

