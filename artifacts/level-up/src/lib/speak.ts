import { useEffect, useSyncExternalStore } from 'react';

/** 'loading' = AI voice downloading (device voice is used meanwhile); 'error' = AI voice unavailable. */
export type VoiceStatus = 'off' | 'loading' | 'ready' | 'error';

type NarrationState = {
  speakingText: string | null;
  generating: boolean;
  voice: VoiceStatus;
  progress: number;
  /** Read steps, cards and questions aloud automatically. */
  auto: boolean;
};

const AUTO_KEY = 'level-up-auto-narration';
const savedAuto = typeof localStorage !== 'undefined' ? localStorage.getItem(AUTO_KEY) : null;
let state: NarrationState = { speakingText: null, generating: false, voice: 'off', progress: 0, auto: savedAuto !== 'off' };
const listeners = new Set<() => void>();
const set = (patch: Partial<NarrationState>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => { listeners.delete(l); };
};

export const narrationState = () => state;
export const useNarration = () => useSyncExternalStore(subscribe, narrationState, narrationState);

const hasSynth = typeof window !== 'undefined' && 'speechSynthesis' in window;
const hasWorker = typeof Worker !== 'undefined';

export const canSpeak = () => hasSynth || hasWorker;

const spokenEmoji: Record<string, string> = {
  '🍎': 'apples', '⭐': 'stars', '🐟': 'fish', '🎈': 'balloons', '🍪': 'cookies', '🌸': 'flowers', '🚗': 'cars', '🐥': 'chicks',
};

/** Turn maths symbols and counting emoji into words a voice can say. */
const clean = (text: string) =>
  text
    .replace(/\p{Extended_Pictographic}\uFE0F?/gu, (e) => (spokenEmoji[e.replace('\uFE0F', '')] ? ` ${spokenEmoji[e.replace('\uFE0F', '')]} ` : ' '))
    .replace(/₹\s?(\d+)/g, '$1 rupees')
    .replace(/m\/s²/g, ' metres per second squared')
    .replace(/(\d)\s?N\b/g, '$1 newtons')
    .replace(/(\d)\s?kg\b/g, '$1 kilograms')
    .replace(/(\d)\s*[−-]\s*(\d)/g, '$1 minus $2')
    .replace(/\s[−-]\s/g, ' minus ')
    .replace(/\+/g, ' plus ')
    .replace(/×/g, ' times ')
    .replace(/(\d)\s*>\s*(\d)/g, '$1 is greater than $2')
    .replace(/(\d)\s*<\s*(\d)/g, '$1 is less than $2')
    .replace(/(\d)\s*=\s*(\d)/g, '$1 equals $2')
    .replace(/>/g, ' greater than ')
    .replace(/</g, ' less than ')
    .replace(/=/g, ' equal ')
    .replace(/☐/g, ' blank ')
    .replace(/[“”"‘’]|\u200D/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s([,.?!])/g, '$1')
    .replace(/([?!])\./g, '$1')
    .trim();

type Job = { id: number; text: string; urls: string[]; done: boolean };

let worker: Worker | null = null;
let seq = 0;
let activeId = 0;
let audio: HTMLAudioElement | null = null;
let onEndCb: (() => void) | undefined;
const cache = new Map<string, string[]>();
let current: (Job & { i: number; waiting: boolean }) | null = null;
let prefetching: Job | null = null;
const prefetchQueue: string[] = [];

function finish(id: number) {
  if (id !== activeId) return;
  activeId = 0;
  current = null;
  set({ speakingText: null, generating: false });
  const cb = onEndCb;
  onEndCb = undefined;
  cb?.();
  pump();
}

function speakWithDevice(text: string, id: number) {
  if (!hasSynth) return finish(id);
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.9;
  u.pitch = 1.1;
  u.onend = u.onerror = () => finish(id);
  window.speechSynthesis.speak(u);
}

function playNext() {
  const c = current;
  if (!c || c.id !== activeId) return;
  if (c.i < c.urls.length) {
    c.waiting = false;
    set({ generating: false });
    audio ??= new Audio();
    audio.src = c.urls[c.i++];
    audio.onended = playNext;
    audio.play().catch(() => finish(c.id));
  } else if (c.done) {
    finish(c.id);
  } else {
    c.waiting = true;
    set({ generating: true });
  }
}

/** Generate queued texts in the background while the worker is idle. */
function pump() {
  if (!worker || state.voice !== 'ready' || prefetching || (current && !current.done)) return;
  let text: string | undefined;
  while ((text = prefetchQueue.shift()) && cache.has(text));
  if (!text) return;
  prefetching = { id: ++seq, text, urls: [], done: false };
  worker.postMessage({ type: 'speak', id: prefetching.id, text });
}

function onWorkerMessage(e: MessageEvent) {
  const m = e.data;
  if (m.type === 'progress') return set({ progress: m.progress });
  if (m.type === 'ready') {
    set({ voice: 'ready', progress: 100 });
    return pump();
  }
  if (m.type === 'load-error') {
    console.warn('AI voice could not load, using device voice:', m.error);
    set({ voice: 'error' });
    if (current) speakWithDevice(current.text, current.id);
    return;
  }

  if (prefetching && m.id === prefetching.id) {
    if (m.type === 'chunk') prefetching.urls.push(URL.createObjectURL(m.blob));
    else {
      if (m.type === 'done') cache.set(prefetching.text, prefetching.urls);
      prefetching = null;
      pump();
    }
    return;
  }

  const c = current;
  if (!c || m.id !== c.id) return;
  if (m.type === 'chunk') {
    c.urls.push(URL.createObjectURL(m.blob));
    if (c.waiting) playNext();
  } else if (m.type === 'done') {
    c.done = true;
    cache.set(c.text, c.urls);
    if (c.waiting) playNext();
    pump();
  } else if (m.type === 'error') {
    console.warn('AI voice failed, using device voice:', m.error);
    c.done = true;
    speakWithDevice(c.text, c.id);
  }
}

function getWorker() {
  if (!worker) {
    worker = new Worker(new URL('./tts.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = onWorkerMessage;
    worker.onerror = () => set({ voice: 'error' });
    set({ voice: 'loading' });
    worker.postMessage({ type: 'load' });
  }
  return worker;
}

/**
 * Read text aloud with the Kokoro AI voice. While the model is still downloading
 * (or if it fails), the device's built-in voice is used so children never wait.
 */
export function speak(text: string, onEnd?: () => void) {
  stopSpeaking();
  const t = clean(text);
  if (!t) return;
  set({ speakingText: text });
  onEndCb = onEnd;

  const w = hasWorker && state.voice !== 'error' ? getWorker() : null;
  if (!w || (state.voice !== 'ready' && hasSynth)) {
    activeId = ++seq;
    return speakWithDevice(t, activeId);
  }

  const cached = cache.get(t);
  if (cached) {
    current = { id: (activeId = ++seq), text: t, urls: [...cached], done: true, i: 0, waiting: true };
  } else if (prefetching?.text === t) {
    current = { ...prefetching, i: 0, waiting: true };
    activeId = current.id;
    prefetching = null;
  } else {
    if (prefetching) prefetchQueue.unshift(prefetching.text);
    prefetching = null;
    current = { id: (activeId = ++seq), text: t, urls: [], done: false, i: 0, waiting: true };
    w.postMessage({ type: 'speak', id: current.id, text: t });
  }
  playNext();
}

/** Queue texts to be voiced in the background (only once the child has used narration). */
export function prefetchSpeech(...texts: (string | undefined)[]) {
  if (!worker || state.voice === 'error') return;
  for (const raw of texts) {
    const t = raw && clean(raw);
    if (t && !cache.has(t) && !prefetchQueue.includes(t) && prefetching?.text !== t) prefetchQueue.push(t);
  }
  // Only what is on screen now matters; drop stale requests from pages the child has left.
  prefetchQueue.splice(0, Math.max(0, prefetchQueue.length - 4));
  pump();
}

export function setAutoNarrate(on: boolean) {
  localStorage.setItem(AUTO_KEY, on ? 'on' : 'off');
  if (!on) stopSpeaking();
  set({ auto: on });
}

/** Speak `text` whenever it changes while auto-narration is on; stops when the text goes away. */
export function useAutoSpeak(text: string | null | undefined) {
  const { auto } = useNarration();
  useEffect(() => {
    if (!auto || !text) return;
    speak(text);
    return () => stopSpeaking();
  }, [text, auto]);
}

export function stopSpeaking() {
  if (current && !current.done) worker?.postMessage({ type: 'cancel' });
  activeId = 0;
  current = null;
  onEndCb = undefined;
  audio?.pause();
  if (hasSynth) window.speechSynthesis.cancel();
  if (state.speakingText !== null || state.generating) set({ speakingText: null, generating: false });
}
