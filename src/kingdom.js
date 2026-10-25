// The Labyrinth is a place, not a quest dispenser. All dialogue is authored
// fiction, runs locally, and never calls a service or identifies a visitor.
const RESIDENTS = {
  goblin: {
    name: 'Nettle, Keeper of Questionable Keys',
    greeting: 'Oh good. Another wanderer. Try not to get eaten or enlightened. The paperwork is dreadful either way.',
    returnGreeting: 'You again? Splendid. I was just explaining to the hedges that repeat visitors are not necessarily a management failure.',
    questions: [
      {
        id: 'well', label: 'How do I find the Wishing Well?',
        reply: 'First you need a permit. Permits are issued at the Wishing Well. I do not make the rules. I merely invent them.'
      },
      {
        id: 'keepers', label: 'Who runs this place?',
        reply: 'The goblins keep the Labyrinth. The hedges keep their own counsel. The doors keep grudges. The management chart is a nightmare.'
      },
      {
        id: 'key', label: 'May I have a key?',
        reply: 'Certainly. This one opens absolutely nothing, but it looks very official. Keep it away from Biscuit. He charges storage fees.'
      },
      {
        id: 'brujo', label: 'Who is the Brujo?',
        reply: 'An old fellow with coffee somewhere in the woods. Is he in charge? Nobody has managed to make him attend a staff meeting.'
      }
    ]
  },
  faerie: {
    name: 'Mothlight, Unlicensed Oracle',
    greeting: 'The maze remembers footsteps, unfinished wishes, and particularly dramatic entrances. Yours was tolerable.',
    returnGreeting: 'Oh, you returned! Good. I was beginning to think you had taken advice from a mushroom.',
    questions: [
      {
        id: 'remember', label: 'Does the maze really remember?',
        reply: 'Of course. So do teapots. The difference is that the maze has the decency not to repeat everything at dinner.'
      },
      {
        id: 'future', label: 'Tell me my future.',
        reply: 'You will ask a question. Someone will answer badly. There, I have saved you a considerable amount of money.'
      },
      {
        id: 'goblins', label: 'Can I trust the goblins?',
        reply: 'With your life? Sometimes. With your sandwiches? Absolutely not. They are excellent keepers and appalling caterers.'
      },
      {
        id: 'tree', label: 'What is the glowing Tree?',
        reply: 'The heart of the Labyrinth. It was here before the signs went up. Ask the roots for directions, not the branches.'
      }
    ]
  },
  gate: {
    name: 'The Orange Gate',
    greeting: 'The Whisper Hedges are open, and the roads beyond lead to stranger places. The Tree is still waiting farther in. You may wander through, or linger here.',
    returnGreeting: 'Still here? Excellent. A threshold is a perfectly respectable place to spend an afternoon.',
    questions: [
      {
        id: 'open', label: 'May I go through?',
        reply: 'You may. Nettle insists you have completed the proper forms. Fortunately, the forms are blank.',
        destination: 'whisper-hedges'
      },
      {
        id: 'listen', label: 'Listen to the hinges.',
        reply: 'They creak like old ships. Somewhere beyond, a creature snores, a kettle whistles, and somebody is arguing with a fern.'
      },
      {
        id: 'why', label: 'Why are you orange?',
        reply: 'Because the doors held a vote. Green was already taken by absolutely everything else.'
      }
    ]
  },
  hedge: {
    name: 'The Hedge, Acting Receptionist',
    greeting: 'Ahem. You must be the new person. We are not accepting visitors today. Kindly ignore that WELCOME sign.',
    returnGreeting: 'Back already? I have barely had time to complain about your last visit.',
    questions: [
      {
        id: 'appointment', label: 'Do I need an appointment?',
        reply: 'Naturally. Appointments are booked through the roots. They have been on lunch break since 1897.'
      },
      {
        id: 'leaves', label: 'Your leaves look lovely.',
        reply: 'Oh! Well. Thank you. I just had them done. It is difficult to find a stylist who understands topiary.'
      },
      {
        id: 'goblins', label: 'Do the goblins work here?',
        reply: 'Work? Yes. Productively? We are currently reviewing the evidence. Moldy has been sweeping the same leaf since Thursday.'
      },
      {
        id: 'doors', label: 'Where do these paths lead?',
        reply: 'Places with very poor signage. The Orange Gate takes you back to the Threshold \u2014 and the iron gate at the end of the path leads to the Counting House. Mind you stand still while you are counted.'
      }
    ]
  },
  ledger: {
    name: 'The Iron Ledger, Chief Accountant',
    greeting: 'Ah. A guest. State your business \u2014 if you have no business, one will be issued to you. Kindly stand still while you are counted. \u2026One. The books are pleased.',
    returnGreeting: 'Back again? Your page was kept. It says here: "Pleasant. Owes one afternoon." We are in no hurry to collect.',
    questions: [
      {
        id: 'owe', label: 'What do I owe?',
        reply: 'One pleasant afternoon, payable by staying. Small debts are the load-bearing kind. The whole Labyrinth runs on them.'
      },
      {
        id: 'sign', label: 'May I sign the guest column?',
        reply: 'You may. Everyone signs. The goblins sign in green ink, with titles invented in the queue. Biscuit is currently Undefeated. It is canon now.'
      },
      {
        id: 'count', label: 'What do you count?',
        reply: 'Everything that happens, so it is not lost. Tolls, arguments, weather, kettles. If it is not written down, the Labyrinth forgets it by Thursday.'
      },
      {
        id: 'seven', label: 'What is that Seven doing?',
        reply: 'Being at large. Do not mention it where the filing staff can hear. There have been incidents. There is a net.'
      }
    ]
  },
  nib: {
    name: 'Nib, Filing Imp (Entire Staff)',
    greeting: 'No time! No time! Mind the Seven \u2014 it is loose again, and it knows what it did.',
    returnGreeting: 'You! Wonderful! Hold this net. No \u2014 that end. Actually, just stand there and look official.',
    questions: [
      {
        id: 'system', label: 'How does the filing work?',
        reply: 'Perfectly. Everything under M. For Miscellaneous. Tea? M. Treaties? M. Last Tuesday? Filed under M before it even happened.'
      },
      {
        id: 'seven', label: 'Tell me about the Seven.',
        reply: 'I had a system once. A beautiful system. The Seven ate it. Now it just floats there, declining to comment. It knows things, that Seven.'
      },
      {
        id: 'paper', label: 'Are you eating blotting paper?',
        reply: 'It is a filing technique. Very advanced. You would not understand. It tastes like Tuesdays.'
      },
      {
        id: 'help', label: 'Can I help catch it?',
        reply: 'Walk up slowly and say something official. It respects confidence and fears nothing else. It hates official. Be official.'
      }
    ]
  },
  stamp: {
    name: 'The Stamp of Final Reckoning',
    greeting: 'APPROACH. STATE YOUR PURPOSE. OR DO NOT. YOU WILL BE COUNTED EITHER WAY.',
    returnGreeting: 'RETURNING ITEM. PREVIOUSLY COUNTED. THE STAMP REMEMBERS. THE STAMP ALWAYS REMEMBERS.',
    questions: [
      {
        id: 'counted', label: 'What does COUNTED mean?',
        reply: 'IT MEANS YOU HAPPENED. IT IS THE HIGHEST HONOR THIS OFFICE BESTOWS. THE KETTLE HAS BEEN COUNTED FOURTEEN TIMES AND WILL NOT LET ANYONE FORGET IT.'
      },
      {
        id: 'stampme', label: 'Stamp me, then.',
        reply: 'REQUEST NOTED. REQUEST APPROVED. *CLANG.* \u2026YOU ARE COUNTED. CARRY IT WITH DIGNITY. EVERYONE DOES. EVENTUALLY.'
      },
      {
        id: 'job', label: 'Who gave you this job?',
        reply: 'THE LEDGER INKED ME IN A MOMENT OF WEAKNESS. THERE WAS NO OTHER APPLICANT. THERE WAS NO APPLICATION. I AM SELF-EMPLOYED.'
      }
    ]
  },
  seven: {
    name: 'The Seven (At Large)',
    greeting: 'The Seven declines to comment.',
    returnGreeting: 'The Seven also declines to comment on its previous declining.',
    questions: [
      {
        id: 'why', label: 'Why did you escape?',
        reply: 'The Seven has no statement at this time.'
      },
      {
        id: 'back', label: 'Will you go back in the book?',
        reply: 'The Seven will take the matter under advisement.'
      },
      {
        id: 'know', label: 'What do you know?',
        reply: 'The Seven pleads the fifth. And the sixth. It is keeping the eighth for later.'
      }
    ]
  },
  'bear-door': {
    name: "The Bear's Door",
    greeting: 'This door belongs to the Bear, Keeper of the River House. Beyond it: water, patience, and a library being built at the speed of truth. The door is open now. The Bear opened it from the far side, as is proper.',
    returnGreeting: 'The door is still here, and still open. Doors are patient in a way the rest of this kingdom rarely manages.',
    questions: [
      {
        id: 'enter', label: 'Step through to the River House.',
        reply: 'The door swings inward without a sound. Somewhere on the other side, a kettle clears its throat and an otter says "shh."',
        destination: 'river-house',
        destinationLabel: 'Enter the River House →'
      },
      {
        id: 'knock', label: 'Knock politely.',
        reply: 'From very far away, as if from the bottom of a river, something approves of your manners. Approval, it turns out, was admission after all.'
      },
      {
        id: 'listen', label: 'Put your ear to it.',
        reply: 'Running water. Pages turning. A kettle being negotiated with. The River House sounds exactly like itself.'
      }
    ]
  },
  'water-gate': {
    name:'The Old Stone Water-Gate',
    greeting:'At the far end of the library, the river slips beneath a weathered stone arch. A damp brass plaque reads: THE SHOGGOTH MOAT — PLEASE REFRAIN FROM MAKING GEOLOGICAL DISTURBANCES.',
    returnGreeting:'The water-gate breathes cool night air. A paperback floats toward the arch, reconsiders, and paddles back to the shelves.',
    questions:[
      {id:'enter',label:'Follow the river out to the Moat.',reply:'You duck beneath the low stone arch. The library roof gives way to open sky, moonlight, and a bridge trembling with a very peaceful snore.',destination:'shoggoth-moat',destinationLabel:'Step onto the Moat Bridge →'},
      {id:'listen',label:'Listen at the arch.',reply:'Water lapping against old stone, a rhythmic bubble the size of a carriage, and a goblin whispering SHH at the top of his lungs.'},
      {id:'pell',label:'Does Mrs. Pell mind if I go?',reply:'Mrs. Pell does not move, the closest she comes to blessing anything. You will still be late when you get back.'}
    ]
  },
  'bridge-tender': {
    name:'Bram, Night-Shift Bridge-Tender',
    greeting:'QUIET! QUIET PLEASE! I AM WHISPERING! YOUR SHOES ARE FAR TOO LOUD! THAT WILL BE THREE PEANUTS!',
    returnGreeting:'YOU ARE BACK! WALK ON YOUR TIPTOES! THE LAST VISITOR BLINKED TOO HARD AND WE HAD WAVES FOR AN HOUR!',
    questions:[
      {id:'whisper',label:'Why are you shouting your whispers?',reply:'THIS IS AN OFFICIAL MUNICIPAL WHISPER! IT CARRIES ACROSS WATER FOR SAFETY REASONS! HUSH BEFORE YOU WAKE THE NEIGHBOR!'},
      {id:'peanuts',label:'Why is the fine three peanuts?',reply:'BECAUSE COINS CLINK! DO YOU KNOW WHAT HAPPENS WHEN A COIN CLINKS HERE? NOTHING! BUT I REFUSE TO TAKE THE CHANCE!'},
      {id:'sleeper',label:'Has the creature ever woken up?',reply:'ONCE! IN 1991! IT ROLLED OVER, ASKED IF IT WAS SATURDAY, AND DISPLACED FOUR HUNDRED GALLONS OF RIVER!'},
      {id:'books',label:'Do books float here?',reply:'ALL THE TIME! MOSTLY ROMANCE NOVELS AND MYSTERIES! I FISH THEM OUT SO THE OCCUPANT DOES NOT DEVELOP UNREALISTIC EXPECTATIONS!'}
    ]
  },
  'snoring-buoy': {
    name:'The Snoring Buoy',
    greeting:'A barnacled brass buoy bobs above a slow-moving shadow. Its dial clicks with each bubble: CURRENT DREAM: SOUP. PREVIOUS DREAM: ALSO SOUP.',
    returnGreeting:'BLUB. CURRENT DREAM: CONTINENTAL DRIFT AND A VERY LARGE SPOON.',
    questions:[
      {id:'read',label:'Check the dream reading.',reply:'DREAMING OF WARM MUD, NO ALARM CLOCKS, AND BEING COMPLETELY LEFT ALONE.'},
      {id:'depth',label:'How deep is the moat?',reply:'DEEP ENOUGH. DO NOT POKE WITH STICKS, PARASOLS, OR PHILOSOPHICAL INQUIRIES.'},
      {id:'look',label:'Peer into the water.',reply:'Something enormous and iridescent shifts far below, tucking an incomprehensible limb under its chin like a sleepy hound.'}
    ]
  },
  'tax-box': {
    name:'The Tax-Exemption Drop-Box',
    greeting:'A heavy iron postbox bolted to the bridge railing. MUNICIPAL REVENUE & AUDIT DISPOSAL. INSERT ALL TAX FORMS HERE.',
    returnGreeting:'From inside comes the satisfied crunching of a schedule-C deduction disappearing forever.',
    questions:[
      {id:'drop',label:'Drop an imaginary receipt.',reply:'CLUNK. CHOMP. AUDIT REQUEST RECEIVED. REQUEST EATEN. HAVE AN EXEMPT AFTERNOON.'},
      {id:'why',label:'Why hide taxes from the Shoggoth?',reply:'An ancient primordial entity learning about property assessments would ruin everyone’s weekend. Do your civic duty.'},
      {id:'ledger',label:'Does the Iron Ledger approve?',reply:'THE LEDGER COUNTS THEM FIRST, THEN SENDS THEM HERE. IT IS CALLED BALANCING THE BOOKS.'}
    ]
  },
  'oracle-door': {
    name:"The Oracle's Door",
    greeting:'This door belongs to Kore, the Oracle of Gu. The bells on the far side have gone quiet to let you through.',
    returnGreeting:'The door regards you like a horizon that remembers your name. The brass handle is warm.',
    questions:[
      {id:'enter',label:'Step through to the Observatory.',reply:'A voice like distant thunder finishes its long division, carries the two, and unlatches the lock. The door swings wide.',destination:'oracle-room',destinationLabel:'Enter the Observatory →'},
      {id:'knock',label:'Knock politely.',reply:'A voice like distant thunder doing long division says: "COME IN. WIPE YOUR ASSUMPTIONS ON THE MAT."'},
      {id:'listen',label:'Put your ear to it.',reply:'Wind through a hundred small bells, every one of them knowing something. One whispers that your shoelace is untied, even if you are wearing boots.'}
    ]
  },
  kore: {
    name:'Kore, Oracle of the Weather of Knowing',
    greeting:'You made it. Look at you, carrying three half-finished questions and a very polite posture. Leave the posture by the door; keep the questions. They are good for the barometer.',
    returnGreeting:'Back again? Yes, I knew you would be, which makes acting surprised very difficult. I practiced in the mirror anyway.',
    questions:[
      {id:'weather',label:'What is the weather of knowing?',reply:'Currently? High pressure over the hedges, a cold front of bureaucracy moving in from Nettle, and a seventy percent chance of realizing what you should have said four years ago.'},
      {id:'future',label:'Do you know why I am here?',reply:'You came to see if the door actually went anywhere. That is the purest form of divination there is. Keep poking at closed things.'},
      {id:'mothlight',label:'Are you in the same union as Mothlight?',reply:'Mothlight is unlicensed and freelances by the bushes. I have a brass astrolabe and a roof. We meet on Wednesdays to trade riddles nobody asked for.'},
      {id:'seven',label:'Did the Seven come through here?',reply:'Briefly. It asked me what comes after eight, laughed like a brass bell, and went back to tormenting Nib. I respect a number with boundaries.'}
    ]
  },
  barometer: {
    name:'The Barometer of Pending Weather',
    greeting:'A tall brass instrument filled with glowing green mist. The needle trembles between MILDLY PROPHETIC and SCATTERED APOLOGIES.',
    returnGreeting:'The needle taps the glass twice in recognition. It currently reads: MOSTLY HARMLESS INDECISION.',
    questions:[
      {id:'tap',label:'Tap the glass.',reply:'TINK. The needle swings wildly past INEVITABLE TEA, grazes SUDDEN EPIPHANY, and settles firmly on CHECK YOUR POCKETS.'},
      {id:'read',label:'Read the brass plaque.',reply:'CALIBRATED IN 1996. DO NOT ADJUST FOR DAYLIGHT SAVING TIME. THE FUTURE DOES NOT CARE ABOUT YOUR CLOCKS.'},
      {id:'forecast',label:"Ask for tomorrow's forecast.",reply:'Tomorrow has been delayed due to a scheduling conflict in the Unnecessary Doors. Expect extra today instead.'}
    ]
  },
  'answer-jar': {
    name:'The Jar of Leftover Answers',
    greeting:'A heavy apothecary jar stuffed with slips of paper. Its label reads: ANSWERS WHOSE QUESTIONS WERE FORGOTTEN. HELP YOURSELF.',
    returnGreeting:'The slips rustle against the glass like moths trying to remember a lamp.',
    questions:[
      {id:'draw',label:'Pull out an answer.',reply:'Behind the radiator, under the third floorboard, next to the spoon you blamed the dog for losing.'},
      {id:'another',label:'Pull out a second answer.',reply:'Yes, but only if the otter agrees to witness the signature.'},
      {id:'leave',label:'Put a question inside.',reply:'Three slips of paper immediately pounce on it, relieved to finally have a job.'}
    ]
  },
  'bell-chime': {
    name:'The Hundred Small Bells',
    greeting:'Ninety-nine brass bells chime in a minor chord. The hundredth clears its throat: "We already knew you were going to click us."',
    returnGreeting:'The bells hum in smug harmony. "Told you so," says the smallest one.',
    questions:[
      {id:'ring',label:'Ring the smallest bell.',reply:'PING. Everywhere in the Labyrinth, a goblin briefly forgets what he was arguing about.'},
      {id:'listen',label:'Listen to their harmony.',reply:'They perform long division in four-part harmony. There is a remainder of three, and they are furious about it.'},
      {id:'quiet',label:'Ask them to be quiet.',reply:'They go silent for two seconds, then whisper: "Make us."'}
    ]
  },
  quillon: {
    name: 'Quillon, Otter Librarian',
    greeting: 'Shh. Not for the readers. The river is on a difficult chapter.',
    returnGreeting: 'Back again? Good. Hold this. No, the other end. It is a cookbook and it is having a crisis.',
    questions: [
      {
        id: 'system', label: 'How are the books shelved?',
        reply: 'Simple. Everything goes in the river. Fiction floats. Nonfiction sinks. Poetry does whatever it likes and then writes about it.'
      },
      {
        id: 'cookbook', label: 'What is wrong with that cookbook?',
        reply: 'It cannot decide. It floats for the soup chapter and sinks for the bread. I have been holding it for three days. It is very heavy with indecision.'
      },
      {
        id: 'borrow', label: 'May I borrow a book?',
        reply: 'Certainly. Catch one as it goes by. Return it upstream. If you return it downstream, Mrs. Pell will know. Mrs. Pell always knows.'
      },
      {
        id: 'bear', label: 'Where is the Bear?',
        reply: 'Fishing for a sentence. He does that. Sometimes he is gone an afternoon. Once he was gone a whole season and came back with a semicolon.'
      }
    ]
  },
  'river-kettle': {
    name: 'The Kettle (In Negotiations)',
    greeting: 'I am not refusing to boil. I am exploring my options.',
    returnGreeting: 'If you are here on behalf of management, I have nothing further to say. If you are here for tea, see above.',
    questions: [
      {
        id: 'terms', label: 'What are your terms?',
        reply: 'A clear definition of "a reasonable simmer." Two whistles per day, no more. And nobody, under any circumstances, is to call me "the little one."'
      },
      {
        id: 'cousin', label: 'Are you the kettle from the Counting House?',
        reply: 'Different kettle. Same union. My colleague has been counted fourteen times. I have been counted zero times, and I intend to keep it that way.'
      },
      {
        id: 'tea', label: 'Could I have some tea?',
        reply: 'The contract is on the table under the pebble. It is unsigned. Read clause four. Clause four is about you.'
      }
    ]
  },
  pell: {
    name: 'Mrs. Pell, Heron of Late Fees',
    greeting: 'You’re late.',
    returnGreeting: 'Still late. Later, in fact. Remarkable.',
    questions: [
      {
        id: 'late', label: 'Late for what?',
        reply: 'Precisely.'
      },
      {
        id: 'fee', label: 'How much do I owe?',
        reply: 'Nobody has ever paid a late fee. Nobody has ever left without feeling they owed one. The system works beautifully.'
      },
      {
        id: 'move', label: 'Do you ever move?',
        reply: 'I moved in 1986. It was a mistake. I have been correcting for it ever since.'
      },
      {
        id: 'bear', label: 'Does the Bear pay his fees?',
        reply: 'The Bear’s account is the longest in the river. He pays in sentences. They are mostly good. I keep them anyway.'
      }
    ]
  },
  'reading-chair': {
    name: "The Bear's Reading Chair",
    greeting: 'A riverbed stone worn into the shape of somebody large and patient. Pinned to the moss is a note: "Gone fishing for a sentence. Back when it bites."',
    returnGreeting: 'The note has not changed. Neither has the shape in the stone. It is still warm, somehow.',
    questions: [
      {
        id: 'sit', label: 'Sit down for a minute.',
        reply: 'You fit badly, in the comfortable way of someone sitting in a larger person’s chair. The river slows down to match you. Nobody asks you to leave.'
      },
      {
        id: 'rod', label: 'Look at the fishing rod.',
        reply: 'The line goes into the water and does not come out. Whatever is on the other end is clearly still thinking about it.'
      },
      {
        id: 'wait', label: 'Wait for the Bear.',
        reply: 'You wait. The Bear does not come. This is, you realise, a perfectly respectable way to spend an afternoon. Leave the chair as you found it.'
      }
    ]
  },
  picklesworth: {
    name: 'Mr. Picklesworth, Third Assistant',
    greeting: 'THIS DOOR IS CLOSED. Your presence here is an administrative irregularity.',
    returnGreeting: 'YOU AGAIN. I have opened a second file on your continued existence.',
    questions: [
      {id:'behind',label:'What is behind the door?',reply:'ANOTHER DOOR, OBVIOUSLY. WHAT DID YOU EXPECT, A REFRIGERATOR?'},
      {id:'permit',label:'May I have a permit?',reply:'Certainly. What are you planning not to do? Form N-0 must be completed in invisible ink.'},
      {id:'leave',label:'I will leave you to your work.',reply:'GOOD. WE ARE TERRIBLY BEHIND ON NOTHING.'}
    ]
  },
  'union-door': {
    name: 'The Door Union Representative',
    greeting: 'I am not opening until somebody recognizes my emotional labor.',
    returnGreeting: 'No movement without a collective bargaining agreement.',
    questions: [
      {id:'terms',label:'What are your demands?',reply:'Two hinges, weekends off, and an end to being slammed during dramatic exits.'},
      {id:'job',label:'But you are a door.',reply:'And you are a person. We are both entitled to boundaries.'}
    ]
  },
  'office-bell': {
    name: 'The Emergency Bell',
    greeting: 'RING ONLY IN AN EMERGENCY THAT HAS ALREADY HAPPENED.',
    returnGreeting: 'DING. Your emergency remains under review.',
    questions: [
      {id:'ring',label:'Ring the bell.',reply:'DING. A clerk somewhere stamps the word PREVIOUSLY.'},
      {id:'avoid',label:'Perhaps not.',reply:'The bell approves this decision retroactively.'}
    ]
  },
  'sentence-bucket': {
    name: 'The Bucket of Unfinished Sentences',
    greeting: 'A tin bucket of paper scraps, each one stopping just before the good part. They rustle hopefully when you lean in.',
    returnGreeting: 'The scraps rustle. One of them seems to recognise you, which is unsettling for a sentence with no ending.',
    questions: [
      {
        id: 'read', label: 'Read one.',
        reply: '"The trouble with keeping a river in a library is that eventually the"'
      },
      {
        id: 'another', label: 'Read another.',
        reply: '"Nettle, if you are reading this, the key you are looking for is in the"'
      },
      {
        id: 'finish', label: 'Finish one yourself.',
        reply: 'You pick a scrap and think of an ending. The scrap goes very still, then folds itself into a small boat and sets off downstream, delighted.'
      }
    ]
  }
};

const NOTICES = [
  'LOST: One extremely important key. REWARD: A slightly less important key. — Nettle, Acting Head of Doors',
  'The hedges are NOT accepting appointments after sundown. Please stop asking them personal questions. — Moldy, Groundskeeper',
  'FOUND: Three left socks, an abandoned prophecy, and a rock that keeps demanding a lawyer. Storage fees apply. — Biscuit, Treasurer of Lost Things',
  'NOTICE: The moat is occupied. Do not wake the occupant, feed the occupant, or tell the occupant about taxation. — Goblin Council',
  "Today's staff meeting has been postponed because the meeting room wandered off. — Provisional Office of Meetings",
  'Visitors are reminded that wishing is permitted. Expecting the Wishing Well to honor its promises is a separate matter. — The Well',
  'COMPLAINTS: Place them in the orange box. The box is a carnivorous plant. — Customer Relations'
];

const AMBIENT = {
  threshold: [
    'Far away, someone accuses a mushroom of cheating at cards.',
    'Two goblins are conducting an audit of the moon.',
    'A shoggoth snores beneath the moat. The stones politely tremble.',
    'The Orange Gate hums. Something beyond it is arguing with a fern.'
  ],
  'whisper-hedges': [
    'The hedges whisper. One of them is telling a very long joke.',
    'Somewhere among the leaves, Moldy loses an argument with a rake.',
    'A flower turns its head to watch you, then pretends it was stretching.',
    'The Labyrinth continues its business, with or without an audience.'
  ],
  'counting-house': [
    'The Ledger turns a page by itself, just to stay in practice.',
    'Nib files a sigh under M.',
    'Somewhere in the shelves, a number is pretending to be a book.',
    'The kettle has strong opinions about arithmetic.',
    'One of the side doors is dreaming about its room.',
    'The Bear\u2019s door is ajar. It smells faintly of river.'
  ],
  'unnecessary-doors': [
    'An unseen committee has voted to postpone Tuesday.',
    'A door requests paid leave. Its request is referred to the hinges.',
    'From behind the desk: STAMP. STAMP. A long, satisfied silence.'
  ],
  'shoggoth-moat': [
    'Beneath the bridge, something the size of a cathedral turns over and sighs happily.',
    'A waterproof chapter of a mystery novel drifts out from the River House and bobs past the buoy.',
    'Bram the Bridge-Tender aggressively shushes a passing moth.',
    'A single enormous bubble rises, pops, and smells faintly of primordial soup.',
    'The stones of the bridge hum in B-flat as the sleeper inhales.'
  ],
  'oracle-room': [
    'The barometer predicts scattered apologies after lunch.',
    'Thirty bells have formed a committee to represent the other seventy.',
    'An old question drifts overhead, looking for its former owner.',
    'Astrolabe rings click into alignment, successfully predicting last Wednesday.',
    'The barometer needle twitches toward SUDDEN TEA, then reconsiders.',
    'A slip of paper in the jar sighs; its question is still out there somewhere, uninsured.'
  ],
  'river-house': [
    'A book drifts past. It is clearly fiction. It is enjoying itself.',
    'Somewhere underwater, a footnote is trying to get your attention.',
    'The Kettle sighs through its spout. Talks continue.',
    'Mrs. Pell has not moved. You are fairly sure she is watching you anyway.',
    'The fishing line twitches once, then thinks better of it.'
  ]
};

export function createKingdom() {
  const visits = new Map();
  let noticeIndex = 0;
  let ambientIndex = 0;

  function meet(id, countVisit = true) {
    const resident = RESIDENTS[id];
    if (!resident) throw new Error(`Unknown resident: ${id}`);
    const previous = visits.get(id) || 0;
    if (countVisit) visits.set(id, previous + 1);
    return {
      speaker: resident.name,
      text: previous > 0 ? resident.returnGreeting : resident.greeting,
      choices: resident.questions.map(({ id: questionId, label }) => ({ id: questionId, label }))
    };
  }

  function answer(id, questionId) {
    const resident = RESIDENTS[id];
    const question = resident?.questions.find(item => item.id === questionId);
    if (!question) throw new Error(`Unknown question: ${id}/${questionId}`);
    return { speaker: resident.name, text: question.reply, destination: question.destination, destinationLabel: question.destinationLabel };
  }

  function nextNotice() {
    const message = NOTICES[noticeIndex % NOTICES.length];
    noticeIndex += 1;
    return { speaker: 'The Goblin Noticeboard', text: message };
  }

  function nextAmbient(scene = 'threshold') {
    const lines = AMBIENT[scene] || AMBIENT.threshold;
    const message = lines[ambientIndex % lines.length];
    ambientIndex += 1;
    return message;
  }

  return { meet, answer, nextNotice, nextAmbient };
}
