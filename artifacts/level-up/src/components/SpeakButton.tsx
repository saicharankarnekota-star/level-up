import { useEffect } from 'react';
import { Loader2, Volume2, VolumeX } from 'lucide-react';
import { canSpeak, narrationState, prefetchSpeech, speak, stopSpeaking, useNarration } from '../lib/speak';

type Props = { text: string; next?: string; label?: string; className?: string };

/** `next` is voiced in the background so the following card/step plays without waiting. */
export function SpeakButton({ text, next, label = 'Read aloud', className = '' }: Props) {
  const { speakingText, generating } = useNarration();
  const speaking = speakingText === text;
  useEffect(() => () => { if (narrationState().speakingText === text) stopSpeaking(); }, [text]);
  useEffect(() => prefetchSpeech(text, next), [text, next]);
  if (!canSpeak()) return null;
  const title = speaking ? (generating ? 'Getting the voice ready…' : 'Stop reading') : label;
  return (
    <button
      type="button"
      aria-label={title}
      title={title}
      onClick={() => (speaking ? stopSpeaking() : speak(text))}
      className={`inline-grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#E0DBCF] bg-white text-[#27314D] transition hover:border-[#27314D] ${speaking ? 'bg-[#FFF3C4]' : ''} ${className}`}
    >
      {speaking && generating ? <Loader2 size={16} className="animate-spin" /> : speaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  );
}
