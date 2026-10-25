import { createSceneManager, SCENES } from './scene-manager.js';

const world = createSceneManager();
const veil = document.getElementById('scene-veil');
const veilText = document.getElementById('scene-veil-text');
const listeners = new Set();
let changing = false;

export const currentScene = () => world.current();
export function onSceneEnter(listener) { listeners.add(listener); }

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
function syncControls() {
  const inHedges = currentScene() === 'whisper-hedges';
  for (const id of ['goblin', 'faerie', 'gate', 'notices']) {
    document.getElementById(id).hidden = inHedges;
  }
  for (const id of ['hedge', 'return-gate']) {
    document.getElementById(id).hidden = !inHedges;
  }
  document.body.dataset.scene = currentScene();
  document.querySelector('.subtitle').textContent = `${SCENES[currentScene()].title.toUpperCase()} · ${inHedges ? '002' : '001'}`;
}

export async function goToScene(destination) {
  if (changing || !world.canEnter(destination)) return false;
  changing = true;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  veilText.textContent = destination === 'whisper-hedges'
    ? 'The Orange Thread unspools. Somewhere, a hedge files a complaint.'
    : 'The thread winds home. Nettle is already blaming someone.';
  veil.hidden = false;
  // Give the browser a frame to paint before starting the fade.
  await pause(reducedMotion ? 0 : 25);
  veil.classList.add('visible');
  await pause(reducedMotion ? 0 : 650);
  world.enter(destination);
  syncControls();
  for (const listener of listeners) listener(currentScene());
  await pause(reducedMotion ? 0 : 350);
  veil.classList.remove('visible');
  await pause(reducedMotion ? 0 : 650);
  veil.hidden = true;
  changing = false;
  return true;
}

document.getElementById('return-gate').addEventListener('click', () => goToScene('threshold'));
syncControls();
