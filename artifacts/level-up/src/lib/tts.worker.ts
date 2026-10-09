import { KokoroTTS, TextSplitterStream } from 'kokoro-js';

// Kokoro-82M (Apache-2.0) runs fully in the browser; q8 weights are ~90 MB and cached after the first download.
const MODEL_ID = 'onnx-community/Kokoro-82M-v1.0-ONNX';

type InMessage = { type: 'load' } | { type: 'cancel' } | { type: 'speak'; id: number; text: string };

let ttsPromise: Promise<KokoroTTS> | null = null;
let latestId = 0;
let queue = Promise.resolve();

function load() {
  ttsPromise ??= KokoroTTS.from_pretrained(MODEL_ID, {
    dtype: 'q8',
    device: 'wasm',
    progress_callback: (p) => {
      if (p.status === 'progress' && p.file.endsWith('.onnx')) self.postMessage({ type: 'progress', progress: Math.round(p.progress) });
    },
  }).then(
    (tts) => { self.postMessage({ type: 'ready' }); return tts; },
    (err) => { ttsPromise = null; self.postMessage({ type: 'load-error', error: String(err) }); throw err; },
  );
  return ttsPromise;
}

async function narrate(id: number, text: string) {
  if (id !== latestId) return;
  try {
    const tts = await load();
    // A plain string never closes kokoro's splitter, so the last sentence would hang forever.
    const sentences = new TextSplitterStream();
    sentences.push(text);
    sentences.close();
    for await (const { audio } of tts.stream(sentences, { voice: 'af_heart', speed: 0.9 })) {
      if (id !== latestId) return;
      self.postMessage({ type: 'chunk', id, blob: audio.toBlob() });
    }
    self.postMessage({ type: 'done', id });
  } catch (err) {
    self.postMessage({ type: 'error', id, error: String(err) });
  }
}

// Only the most recent request is generated; one model run at a time.
self.onmessage = (e: MessageEvent<InMessage>) => {
  const msg = e.data;
  if (msg.type === 'load') load().catch(() => {});
  else if (msg.type === 'cancel') latestId = -1;
  else {
    latestId = msg.id;
    queue = queue.then(() => narrate(msg.id, msg.text));
  }
};
