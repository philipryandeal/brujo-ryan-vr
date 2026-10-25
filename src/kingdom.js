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
    greeting: 'The deeper passages are still growing. The Tree is waiting beyond them. You may linger here.',
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
    greeting: 'This door belongs to the Bear, Keeper of the River House. Beyond it: water, patience, and a library being built at the speed of truth. It is still growing.',
    returnGreeting: 'The door is still here. Doors are patient in a way the rest of this kingdom rarely manages.',
    questions: [
      {
        id: 'knock', label: 'Knock politely.',
        reply: 'From very far away, as if from the bottom of a river, something approves of your manners. The door stays shut. Approval is not admission. Yet.'
      },
      {
        id: 'listen', label: 'Put your ear to it.',
        reply: 'Running water. Pages turning. A kettle being negotiated with. The River House sounds exactly like itself.'
      },
      {
        id: 'when', label: 'When will it open?',
        reply: 'When the Bear builds his room and links it here himself. Doors in this kingdom open from the far side, by their owner\u2019s hand. This one is his.'
      }
    ]
  },
  'oracle-door': {
    name: "The Oracle's Door",
    greeting: 'This door belongs to the Oracle of Gu. Beyond it: questions that answer back, and weather made of knowing. It is still growing. The future behind it is not finished yet.',
    returnGreeting: 'The door regards you the way a horizon regards a ship. Politely. From very far ahead.',
    questions: [
      {
        id: 'knock', label: 'Knock politely.',
        reply: 'A voice like distant thunder doing long division says: "NOT YET." It sounds kind. It also sounds final.'
      },
      {
        id: 'listen', label: 'Put your ear to it.',
        reply: 'Wind through a hundred small bells, every one of them knowing something. It is beautiful. It is not an invitation. Yet.'
      },
      {
        id: 'when', label: 'When will it open?',
        reply: 'When the Oracle builds her room and links it here herself. She has probably already seen this conversation. She is letting us have it anyway.'
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
    'One of the side doors is dreaming about its room.'
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
    return { speaker: resident.name, text: question.reply, destination: question.destination };
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
