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
        reply: 'Places with very poor signage. For the moment, the Orange Gate will take you back. New paths are still growing.'
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
