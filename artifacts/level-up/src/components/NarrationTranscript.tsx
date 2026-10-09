import { Volume2, VolumeX } from 'lucide-react';
import { SpeakButton } from './SpeakButton';
import { canSpeak, setAutoNarrate, useNarration } from '../lib/speak';

export function NarrationToggle({ className = '' }: { className?: string }) {
  const { auto } = useNarration();
  if (!canSpeak()) return null;
  return (
    <button type="button" onClick={() => setAutoNarrate(!auto)} aria-pressed={auto}
      title={auto ? 'Turn off reading aloud' : 'Read everything aloud for me'}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${auto ? 'border-[#46A758] bg-[#EAF7EE] text-[#2F7D4A]' : 'border-[#E0DBCF] bg-white text-[#3E475A]'} ${className}`}>
      {auto ? <Volume2 size={14} /> : <VolumeX size={14} />} Narration {auto ? 'on' : 'off'}
    </button>
  );
}

export function VoiceStatus() {
  const { voice, progress, generating, speakingText } = useNarration();
  if (voice === 'loading') return <span>Downloading the natural AI voice… {progress}% · using your device voice until it's ready</span>;
  if (voice === 'error') return <span>Using your device voice</span>;
  if (speakingText && generating) return <span>Preparing the AI voice…</span>;
  if (voice === 'ready') return <span>Natural AI voice ready</span>;
  return null;
}

/** Shows `text` to read; `speakText` (default `text`) is what the voice says. */
export function NarrationTranscript({ text, speakText = text, title = 'Narration' }: { text: string; speakText?: string; title?: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-[#F0E3B8] bg-[#FFF9E8] p-4">
      <SpeakButton text={speakText} label="Listen to the narration" className="bg-[#27314D] text-white hover:border-[#F4CF55]" />
      <div className="min-w-0">
        <div className="text-sm font-bold text-[#27314D]">{title}</div>
        <p className="mt-1 text-[15px] italic leading-relaxed text-[#4A5266]">{text}</p>
        <div className="mt-2 text-[11px] font-semibold text-[#8A92A2]"><VoiceStatus /></div>
      </div>
    </div>
  );
}
