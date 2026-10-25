import { createSceneManager, SCENES } from './scene-manager.js';

const world = createSceneManager();
const veil = document.getElementById('scene-veil');
const veilText = document.getElementById('scene-veil-text');
const listeners = new Set();
let changing = false;
export const TRANSITION_READ_MS = 5000;
const sceneButtonIds = new Set(Object.values(SCENES).flatMap(room => room.controls));

export const currentScene = () => world.current();
export function onSceneEnter(listener) { listeners.add(listener); }

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
function syncControls() {
  const id = currentScene();
  const room = SCENES[id];
  for (const controlId of sceneButtonIds) {
    const button = document.getElementById(controlId);
    if (button) button.hidden = !room.controls.includes(controlId);
  }
  document.body.dataset.scene = id;
  document.querySelector('.subtitle').textContent = `${room.title.toUpperCase()} · ${room.number}`;
}

export async function goToScene(destination, {readMs = TRANSITION_READ_MS} = {}) {
  if (changing || !world.canEnter(destination)) return false;
  changing = true;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  veilText.textContent = SCENES[destination].arrivalText;
  veil.hidden = false;
  // Give the browser a frame to paint before starting the fade.
  await pause(reducedMotion ? 0 : 25);
  veil.classList.add('visible');
  await pause(reducedMotion ? 0 : 650);
  world.enter(destination);
  syncControls();
  for (const listener of listeners) listener(currentScene());
  // Reading time is independent of animation preferences: the words matter.
  await pause(readMs);
  veil.classList.remove('visible');
  await pause(reducedMotion ? 0 : 650);
  veil.hidden = true;
  changing = false;
  return true;
}

document.getElementById('return-gate').addEventListener('click', () => goToScene('threshold'));
const countingGateButton = document.getElementById('counting-gate');
if (countingGateButton) countingGateButton.addEventListener('click', () => goToScene('counting-house'));
const countingReturnButton = document.getElementById('counting-return');
if (countingReturnButton) countingReturnButton.addEventListener('click', () => goToScene('whisper-hedges'));
const riverReturnButton = document.getElementById('river-return');
if (riverReturnButton) riverReturnButton.addEventListener('click', () => goToScene('counting-house'));
syncControls();
const entry=document.getElementById('department-door');
if(entry)entry.addEventListener('click',()=>goToScene('unnecessary-doors'));
const exit=document.getElementById('office-return');
if(exit)exit.addEventListener('click',()=>goToScene('counting-house'));

const oracleReturnButton=document.getElementById('oracle-return');
if(oracleReturnButton)oracleReturnButton.addEventListener('click',()=>goToScene('counting-house'));
