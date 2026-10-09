import { useState } from 'react';
import { ArrowRight, Bot, CheckCircle2, Lightbulb, Scissors, Shield, XCircle } from 'lucide-react';
import type { Question } from '../types';
import { useProfile } from '../store/progress';
import { shuffle } from '../lib/random';
import { SpeakButton } from './SpeakButton';
import { useAutoSpeak } from '../lib/speak';
import { TutorModal } from './tutor/TutorModal';

interface Props {
  question: Question;
  /** Show the lifelines bar (50:50, hint, shield). */
  lifelines?: boolean;
  onAnswered: (correct: boolean) => void;
  onNext: () => void;
  nextLabel?: string;
}

/** One multiple-choice question. Remount with `key={question.id}` for each new question. */
export function QuestionCard({ question, lifelines = true, onAnswered, onNext, nextLabel = 'Next' }: Props) {
  const { profile, consumeLifeline, recordAnswer, reviewMistake, notify } = useProfile();
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [removed, setRemoved] = useState<string[]>([]);
  const [hintShown, setHintShown] = useState(false);
  const [shieldArmed, setShieldArmed] = useState(false);
  const [usedShield, setUsedShield] = useState(false);
  const [shieldMsg, setShieldMsg] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const correct = checked && selected === question.answer;
  const questionSpeech = `${question.prompt}. Is it: ${question.choices.filter((c) => !removed.includes(c)).join(', or ')}?`;
  const feedbackSpeech = `${correct ? 'Correct! Well done.' : `Not quite. The answer is ${question.answer}.`} ${question.why}`;
  useAutoSpeak(checked ? feedbackSpeech : questionSpeech);

  const use = (kind: 'fiftyFifty' | 'hint' | 'shield', apply: () => void) => {
    if (consumeLifeline(kind)) apply();
    else notify('No more of that lifeline today. They refill tomorrow!');
  };

  const check = () => {
    if (!selected) return;
    if (selected !== question.answer && shieldArmed) {
      setShieldArmed(false);
      setRemoved([...removed, selected]);
      setSelected(null);
      setShieldMsg(true);
      return;
    }
    setChecked(true);
    setShieldMsg(false);
    const ok = selected === question.answer;
    recordAnswer(ok);
    onAnswered(ok);
  };

  const L = profile.lifelines;
  const lifelineBtn = 'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition disabled:opacity-40';

  return (
    <div className="rounded-3xl border border-[#E5E1D7] bg-[#FFFDF8] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-['Space_Grotesk'] text-xl font-semibold leading-snug text-[#232B40]">{question.prompt}</h2>
        <SpeakButton text={questionSpeech} />
      </div>
      {question.picture && (
        <div className="mt-3 whitespace-pre-line rounded-2xl bg-white p-3 text-center text-3xl leading-snug tracking-wide">{question.picture}</div>
      )}

      {lifelines && !checked && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className={`${lifelineBtn} border-[#E0DBCF] bg-white hover:border-[#27314D]`} disabled={L.fiftyFifty <= 0 || removed.length > 0 || question.choices.length < 3}
            onClick={() => use('fiftyFifty', () => {
              const wrong = question.choices.filter((c) => c !== question.answer);
              setRemoved(shuffle(wrong).slice(0, Math.max(1, wrong.length - 1)));
              if (selected && selected !== question.answer) setSelected(null);
            })}>
            <Scissors size={13} /> 50:50 <span className="text-[#8A92A2]">×{L.fiftyFifty}</span>
          </button>
          <button type="button" className={`${lifelineBtn} border-[#E0DBCF] bg-white hover:border-[#27314D]`} disabled={L.hint <= 0 || hintShown}
            onClick={() => use('hint', () => setHintShown(true))}>
            <Lightbulb size={13} /> Hint <span className="text-[#8A92A2]">×{L.hint}</span>
          </button>
          <button type="button" className={`${lifelineBtn} ${shieldArmed ? 'border-[#3E63DD] bg-[#EEF3FF] text-[#3E63DD]' : 'border-[#E0DBCF] bg-white hover:border-[#27314D]'}`}
            disabled={L.shield <= 0 || shieldArmed || usedShield}
            onClick={() => use('shield', () => { setShieldArmed(true); setUsedShield(true); })}>
            <Shield size={13} /> {shieldArmed ? 'Shield on' : 'Shield'} <span className="text-[#8A92A2]">×{L.shield}</span>
          </button>
        </div>
      )}
      {hintShown && !checked && <p className="mt-3 rounded-xl bg-[#FFF7E6] px-3 py-2 text-sm text-[#7A5B16]">💡 {question.hint}</p>}
      {shieldMsg && <p className="mt-3 rounded-xl bg-[#EEF3FF] px-3 py-2 text-sm font-bold text-[#3E63DD]">🛡️ Shield saved you! That one was not right. Try once more.</p>}

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {question.choices.map((c) => {
          if (removed.includes(c)) return <div key={c} className="rounded-2xl border-2 border-dashed border-[#E6E1D6] px-4 py-3 text-center text-sm text-[#C3BFB4] line-through">{c}</div>;
          const isPicked = selected === c;
          let tone = isPicked ? 'border-[#27314D] bg-[#FFF3C4]' : 'border-[#E0DBCF] bg-white hover:border-[#27314D]';
          if (checked && c === question.answer) tone = 'border-[#46A758] bg-[#EAF7EE]';
          else if (checked && isPicked) tone = 'border-[#E5484D] bg-[#FDECEC]';
          return (
            <button key={c} type="button" disabled={checked} onClick={() => setSelected(c)}
              className={`flex min-h-[56px] items-center justify-between gap-2 rounded-2xl border-2 px-4 py-3 text-left text-base font-semibold text-[#27314D] transition ${tone}`}>
              <span>{c}</span>
              {checked && c === question.answer && <CheckCircle2 size={18} className="text-[#46A758]" />}
              {checked && isPicked && c !== question.answer && <XCircle size={18} className="text-[#E5484D]" />}
            </button>
          );
        })}
      </div>

      {!checked ? (
        <button type="button" className="button button-dark mt-5 w-full" disabled={!selected} onClick={check}>Check answer</button>
      ) : (
        <div className="mt-5">
          <div className={`flex items-start gap-3 rounded-2xl p-4 ${correct ? 'bg-[#EAF7EE]' : 'bg-[#FDECEC]'}`}>
            <div className="flex-1">
              <b className={correct ? 'text-[#2F7D4A]' : 'text-[#B42318]'}>{correct ? 'Correct! 🎉' : 'Not quite.'}</b>
              <p className="mt-1 text-sm text-[#3E475A]">{question.why}</p>
            </div>
            <SpeakButton text={feedbackSpeech} label="Hear why" />
          </div>
          <div className="mt-3 flex flex-wrap justify-end gap-2">
            {!correct && <button type="button" className="button bg-[#EEF3FF] text-[#3E63DD]" onClick={() => setTutorOpen(true)}><Bot size={16} /> Fix it with Nova</button>}
            <button type="button" className="button button-yellow" onClick={onNext}>{nextLabel} <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      {tutorOpen && selected && (
        <TutorModal question={question} studentAnswer={selected} onClose={() => setTutorOpen(false)}
          onReviewed={() => { if (!reviewed) { setReviewed(true); reviewMistake(); } }} />
      )}
    </div>
  );
}
