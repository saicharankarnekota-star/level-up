import { useMemo, useState } from 'react';
import { Bot, CheckCircle2, Eye, Lightbulb, MessageCircle, Sparkles, XCircle } from 'lucide-react';
import type { Question } from '../../types';
import { topicById } from '../../data/topics';
import { Modal } from '../Modal';
import { SpeakButton } from '../SpeakButton';
import { Visualizer } from '../visualizers';

type Tab = 'why' | 'show' | 'try' | 'ask';

interface Props {
  question: Question;
  studentAnswer: string;
  onClose: () => void;
  onReviewed: () => void;
}

export function TutorModal({ question, studentAnswer, onClose, onReviewed }: Props) {
  const topic = topicById(question.topicId);
  const [tab, setTab] = useState<Tab>('why');
  const [chat, setChat] = useState<{ from: 'nova' | 'me'; text: string }[]>([]);
  const twin = useMemo(() => topic?.generate(), [topic]);
  const [twinPick, setTwinPick] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState(false);

  const misconception = question.misconceptions?.[studentAnswer];
  const whatHappened = misconception
    ?? `You chose "${studentAnswer}", but the answer is "${question.answer}". Let's look at the question again, step by step.`;

  const ask = (prompt: string, reply: string) => setChat((c) => [...c, { from: 'me', text: prompt }, { from: 'nova', text: reply }]);

  const finish = () => {
    if (!reviewed) onReviewed();
    setReviewed(true);
    onClose();
  };

  const tabs: { id: Tab; label: string; icon: typeof Lightbulb }[] = [
    { id: 'why', label: 'Why?', icon: Lightbulb },
    ...(topic ? [{ id: 'show' as Tab, label: 'Show me', icon: Eye }] : []),
    ...(twin ? [{ id: 'try' as Tab, label: 'Try one', icon: Sparkles }] : []),
    { id: 'ask', label: 'Ask Nova', icon: MessageCircle },
  ];

  return (
    <Modal wide title={<span className="flex items-center gap-2"><Bot size={20} className="text-[#3E63DD]" /> Nova the tutor</span>} onClose={onClose}>
      <div className="rounded-2xl border border-[#E6E1D6] bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="font-['Space_Grotesk'] text-base font-semibold text-[#27314D]">{question.prompt}</p>
          <SpeakButton text={`${question.prompt}. ${whatHappened}`} />
        </div>
        {question.picture && <div className="mt-2 whitespace-pre-line text-center text-2xl leading-snug">{question.picture}</div>}
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FDECEC] px-3 py-1 font-bold text-[#B42318]"><XCircle size={14} /> You said: {studentAnswer}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5E9] px-3 py-1 font-bold text-[#2F7D4A]"><CheckCircle2 size={14} /> Answer: {question.answer}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" onClick={() => setTab(id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition ${tab === id ? 'bg-[#27314D] text-white' : 'bg-white text-[#3E475A] border border-[#E0DBCF]'}`}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === 'why' && (
          <ol className="space-y-3">
            <li className="rounded-2xl bg-[#FFF7E6] p-4"><b className="block text-xs uppercase tracking-wider text-[#A0782A]">1 · What happened</b><p className="mt-1 text-[#3E475A]">{whatHappened}</p></li>
            <li className="rounded-2xl bg-[#EEF3FF] p-4"><b className="block text-xs uppercase tracking-wider text-[#3E63DD]">2 · A helpful clue</b><p className="mt-1 text-[#3E475A]">{question.hint}</p></li>
            <li className="rounded-2xl bg-[#EAF7EE] p-4"><b className="block text-xs uppercase tracking-wider text-[#2F7D4A]">3 · The answer</b><p className="mt-1 text-[#3E475A]">{question.why}</p></li>
          </ol>
        )}

        {tab === 'show' && topic && (
          <div className="rounded-2xl border border-[#E6E1D6] bg-white p-4">
            <p className="mb-3 text-sm text-[#6B7385]">Play with this model. It is set up to match the question.</p>
            <Visualizer kind={topic.visualizer} params={question.show ?? topic.visualizerParams} />
          </div>
        )}

        {tab === 'try' && twin && (
          <div className="rounded-2xl border border-[#E6E1D6] bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6B7385]">Practice twin — no XP lost if you miss it</p>
            <p className="mt-2 font-['Space_Grotesk'] text-base font-semibold">{twin.prompt}</p>
            {twin.picture && <div className="mt-2 whitespace-pre-line text-center text-2xl">{twin.picture}</div>}
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {twin.choices.map((c) => {
                const picked = twinPick === c;
                const state = twinPick && c === twin.answer ? 'border-[#46A758] bg-[#EAF7EE]' : picked ? 'border-[#E5484D] bg-[#FDECEC]' : 'border-[#E0DBCF] bg-white';
                return <button key={c} type="button" disabled={!!twinPick} onClick={() => setTwinPick(c)} className={`rounded-xl border-2 px-3 py-2.5 text-left font-semibold ${state}`}>{c}</button>;
              })}
            </div>
            {twinPick && <p className={`mt-3 text-sm font-bold ${twinPick === twin.answer ? 'text-[#2F7D4A]' : 'text-[#B42318]'}`}>{twinPick === twin.answer ? 'You got it! 🎉' : `Not yet. ${twin.why}`}</p>}
          </div>
        )}

        {tab === 'ask' && (
          <div className="rounded-2xl border border-[#E6E1D6] bg-white p-4">
            <div className="max-h-56 space-y-2 overflow-y-auto">
              <div className="mr-10 rounded-2xl rounded-tl-sm bg-[#EEF3FF] px-3 py-2 text-sm">Hi! I'm Nova 🤖. Tap a question below and I'll help.</div>
              {chat.map((m, i) => (
                <div key={i} className={`rounded-2xl px-3 py-2 text-sm ${m.from === 'me' ? 'ml-10 rounded-tr-sm bg-[#27314D] text-white' : 'mr-10 rounded-tl-sm bg-[#EEF3FF]'}`}>{m.text}</div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="rounded-full border border-[#E0DBCF] px-3 py-1.5 text-xs font-bold hover:border-[#27314D]" onClick={() => ask('Explain it more simply', topic?.learnCards[0].text ?? question.why)}>Explain it more simply</button>
              <button type="button" className="rounded-full border border-[#E0DBCF] px-3 py-1.5 text-xs font-bold hover:border-[#27314D]" onClick={() => ask('Give me a hint', question.hint)}>Give me a hint</button>
              <button type="button" className="rounded-full border border-[#E0DBCF] px-3 py-1.5 text-xs font-bold hover:border-[#27314D]" onClick={() => ask('Where do I see this in real life?', topic?.realLife ?? question.why)}>Where is this in real life?</button>
              {topic && <button type="button" className="rounded-full border border-[#E0DBCF] px-3 py-1.5 text-xs font-bold hover:border-[#27314D]" onClick={() => ask('Give me a trick to remember', topic.learnCards[topic.learnCards.length - 1].text)}>A trick to remember</button>}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-[#6B7385]">Mistakes help your brain grow 🧠 Reviewing one earns +5 XP.</span>
        <button type="button" className="button button-yellow" onClick={finish}><CheckCircle2 size={16} /> I understand now</button>
      </div>
    </Modal>
  );
}
