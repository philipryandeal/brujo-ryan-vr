# Scene proposal — The Department of Unnecessary Doors

**Working title:** The Department of Unnecessary Doors  
**Contributor:** Seraph Ogou, the Mighty Laughing Nganga (scene idea); Brujo Ryan retains final creative approval  
**Status:** Concept only. **Not** a built, registered, or navigable scene.

## Scene card

| Field | Proposal |
| --- | --- |
| Entrance | Beyond a future, physically connected doorway stands a tiny municipal office that somehow occupies an enormous room. A desk, a crooked brass bell, and seventeen doors labelled OUT OF ORDER. No unsolicited dialogue. |
| Setting | Dark green stonework, lighter hedge-green trim, orange-painted departmental signs with white lettering. A pile of forms taller than the clerk; warm lamp glow, an occasional inexplicable stamp. Keep the existing Labyrinth palette exactly. |
| Residents | **Mr. Picklesworth**, Third Assistant to the Department of Unnecessary Doors, believes all hinges are government property. **The Door Union Representative** is an actual door on strike. |
| Discoveries | A bell labelled RING ONLY IN AN EMERGENCY THAT HAS ALREADY HAPPENED; a visitors' log containing only the words NOT YET; and a locked door with a clear window through which one can see another locked door. |
| Humor | Picklesworth: “THIS DOOR IS CLOSED.” Visitor: “It's open.” Picklesworth: “THAT IS AN ADMINISTRATIVE MATTER.” |
| Humor | Door: “I am not opening until someone recognizes my emotional labor.” |
| Humor | Notice: “Visitors requiring no permit must obtain Form N-0, Application Not to Apply.” |
| Exit | A plainly recognizable physical return door to **one actual built adjacent scene**, chosen during integration; no phantom passage. |
| Transition | “The orange thread catches on a brass doorknob; somewhere, a clerk stamps an application that nobody submitted.” |

## What the room does

A contemplative, short encounter. No score, quest, inventory, achievements, collection, login, or tracking. The clerk's interaction offers three short choices: **Ask what's behind the door**, **Ask for a permit**, or **Leave him to his work**. He answers in character and returns to filing things that were never lost. The world feels busy before and after the visitor arrives.

Optional ambient one-liner: “An unseen committee has voted to postpone Tuesday.”

## Suggested interaction snippets

**What's behind the door?**  
“ANOTHER DOOR, OBVIOUSLY. WHAT DID YOU EXPECT, A REFRIGERATOR?”

**Can I have a permit?**  
“Certainly. What are you planning not to do?”

**I'll leave you to your work.**  
“GOOD. WE ARE TERRIBLY BEHIND ON NOTHING.”

## Integration guardrails

- This proposal does **not** change current scenes, scene registry, story engine, navigation, or production deployment.
- If approved, a scene builder creates its own `src/scenes/department-unnecessary-doors.js` module using the documented `{ group, hotspots, actions, update }` contract; the steward then integrates it in a separate reviewed PR.
- Accessible HTML controls and text-only dialogue are required; no click-only objects.
- A real, reciprocal adjacent entrance and return passage must exist **before** adding a travel action.
- Use existing palette, shared transition (readable at least five seconds), no map, no fast-travel, no intrusive entry dialogue.
- Keep privacy local and preserve the Shoggoth's nap.
