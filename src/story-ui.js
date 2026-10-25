import { createKingdom } from './kingdom.js';
import { currentScene, onSceneEnter, goToScene } from './navigation.js';
import { SCENES } from './scene-manager.js';

const kingdom = createKingdom();
const dialogue = document.getElementById('dialogue');
const speaker = document.getElementById('speaker');
const speech = document.getElementById('speech');
const choices = document.getElementById('choices');
const hint = document.getElementById('hint');
// Conversations still work in locked-down browsers without a WebGL context.
try {
  const probe = document.createElement('canvas');
  if (!probe.getContext('webgl2') && !probe.getContext('webgl')) {
    document.body.classList.add('text-mode');
    document.getElementById('sound').hidden = true;
    document.getElementById('reset').hidden = true;
  }
} catch {
  document.body.classList.add('text-mode');
  document.getElementById('sound').hidden = true;
  document.getElementById('reset').hidden = true;
}
let lastTrigger = null;
let started = false;
let onWorldStart = () => {};

export function registerWorldStart(callback) {
  onWorldStart = callback;
  if (started) onWorldStart();
}

function closeStory() {
  dialogue.hidden = true;
  if (lastTrigger && lastTrigger.getClientRects().length) lastTrigger.focus();
  else {
    const control = SCENES[currentScene()].controls.find(id => !document.getElementById(id)?.hidden);
    if (control) document.getElementById(control).focus();
  }
}

function showPanel(entry, actions = []) {
  speaker.textContent = entry.speaker;
  speech.textContent = entry.text;
  choices.replaceChildren();
  for (const action of actions) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = action.label;
    button.addEventListener('click', action.run);
    choices.appendChild(button);
  }
  dialogue.hidden = false;
  choices.querySelector('button')?.focus();
}

export function openStory(id, newVisit = true) {
  if (newVisit) lastTrigger = document.activeElement;
  const entry = kingdom.meet(id, newVisit);
  showPanel(entry, entry.choices.map(choice => ({
    label: choice.label,
    run: () => {
      const reply = kingdom.answer(id, choice.id);
      showPanel(reply, [
        ...(reply.destination ? [{label:reply.destinationLabel || 'Cross the Orange Gate →',run:()=>goToScene(reply.destination)}] : []),
        { label: 'Ask another question', run: () => openStory(id, false) },
        { label: 'Leave them to it', run: closeStory }
      ]);
    }
  })));
}

export function openNotices() {
  lastTrigger = document.activeElement;
  showNextNotice();
}

function showNextNotice() {
  showPanel(kingdom.nextNotice(), [
    { label: 'Read another notice', run: showNextNotice },
    { label: 'Back to the Labyrinth', run: closeStory }
  ]);
}

document.getElementById('dismiss').addEventListener('click', closeStory);
document.getElementById('goblin').addEventListener('click', () => openStory('goblin'));
document.getElementById('faerie').addEventListener('click', () => openStory('faerie'));
document.getElementById('gate').addEventListener('click', () => openStory('gate'));
document.getElementById('hedge').addEventListener('click', () => openStory('hedge'));
for (const residentId of ['ledger', 'nib', 'stamp', 'seven', 'bear-door', 'oracle-door',
  'quillon', 'river-kettle', 'pell', 'reading-chair', 'sentence-bucket',
  'picklesworth', 'union-door', 'office-bell',
  'kore', 'barometer', 'answer-jar', 'bell-chime']) {
  const button = document.getElementById(residentId);
  if (button) button.addEventListener('click', () => openStory(residentId));
}
document.getElementById('notices').addEventListener('click', openNotices);
document.getElementById('begin').addEventListener('click', () => {
  if (started) return;
  started = true;
  const threshold = document.getElementById('threshold');
  threshold.hidden = true;
  threshold.style.display = 'none';
  document.querySelector('.controls').hidden = false;
  hint.hidden = false;
  hint.textContent = kingdom.nextAmbient(currentScene());
  onWorldStart();
  // The kingdom goes about its business even when the visitor does nothing.
  setInterval(() => { hint.textContent = kingdom.nextAmbient(currentScene()); }, 14000);
});
onSceneEnter(sceneId => {
  dialogue.hidden = true;
  hint.textContent = kingdom.nextAmbient(sceneId);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !dialogue.hidden) {
    event.preventDefault();
    closeStory();
  }
});
