import { useMemo, useState } from 'react';
import { ArrowLeft, Lightbulb, RotateCcw, Scissors, Shield, Shuffle } from 'lucide-react';
import type { Grade, Question, Topic } from '../types';
import { generateSet, topics } from '../data/topics';
import { useProfile } from '../store/progress';
import { PageTitle } from '../layout/AppShell';
import { PracticeRound } from '../components/PracticeRound';
import { Stars } from '../components/Stars';
import { Chip } from '../components/visualizers/common';

/** Topics that most need practice: started ones with the fewest stars first. */
export function weakestTopics(list: Topic[], progress: Record<string, { stars: number; visualized: boolean } | undefined>, n = 3) {
  const started = list.filter((t) => progress[t.id]?.visualized);
  const pool = started.length ? started : list;
  return [...pool].sort((a, b) => (progress[a.id]?.stars ?? 0) - (progress[b.id]?.stars ?? 0)).slice(0, n);
}

export function Practice() {
  const { profile, finishPractice } = useProfile();
  const [grade, setGrade] = useState<Grade>(profile.grade);
  const [selection, setSelection] = useState<Topic | 'mixed' | null>(null);
  const [round, setRound] = useState(0);
  const gradeTopics = topics.filter((t) => t.grade === grade);
  const weak = weakestTopics(gradeTopics, profile.topics);

  const questions = useMemo<Question[]>(() => {
    if (!selection) return [];
    if (selection !== 'mixed') return generateSet(selection.generate, 5);
    return weak.flatMap((t) => generateSet(t.generate, 2)).sort(() => Math.random() - 0.5);
    // weak is derived from profile; re-roll only when a new round starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, round]);

  if (selection) {
    const title = selection === 'mixed' ? 'Mixed review' : selection.title;
    return (
      <div className="page-enter mx-auto max-w-2xl">
        <button type="button" className="mb-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#6B7385] hover:text-[#27314D]" onClick={() => setSelection(null)}><ArrowLeft size={16} /> Choose another</button>
        <h1 className="mb-4 font-['Space_Grotesk'] text-3xl font-semibold text-[#232B40]">{selection === 'mixed' ? '🔀' : selection.emoji} {title}</h1>
        <PracticeRound
          key={`${title}-${round}`}
          questions={questions}
          onFinish={(c, t) => finishPractice(selection === 'mixed' ? null : selection.id, c, t)}
          actions={(
            <>
              <button type="button" className="button button-yellow" onClick={() => setRound(round + 1)}><RotateCcw size={15} /> New round</button>
              <button type="button" className="button button-dark" onClick={() => setSelection(null)}>Choose another</button>
            </>
          )}
        />
      </div>
    );
  }

  const L = profile.lifelines;
  return (
    <div className="page-enter">
      <PageTitle eyebrow="PRACTICE" title="Sharpen your skills" description="Fresh questions every time. Wrong answers are welcome — Nova will help you fix them." />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {([1, 2] as Grade[]).map((g) => <Chip key={g} active={grade === g} onClick={() => setGrade(g)}>Grade {g}</Chip>)}
        <span className="ml-auto inline-flex flex-wrap items-center gap-3 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#3E475A] border border-[#E6E1D6]">
          Today's lifelines: <span className="inline-flex items-center gap-1"><Scissors size={13} /> {L.fiftyFifty}</span>
          <span className="inline-flex items-center gap-1"><Lightbulb size={13} /> {L.hint}</span>
          <span className="inline-flex items-center gap-1"><Shield size={13} /> {L.shield}</span>
          <span className="font-normal text-[#8A92A2]">refill every day</span>
        </span>
      </div>

      <button type="button" onClick={() => { setSelection('mixed'); setRound(round + 1); }}
        className="mb-6 flex w-full items-center gap-4 rounded-3xl bg-[#27314D] p-5 text-left text-white transition hover:-translate-y-0.5">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F4CF55] text-[#27314D]"><Shuffle /></span>
        <span className="flex-1">
          <b className="font-['Space_Grotesk'] text-xl">Smart mixed review</b>
          <span className="block text-sm text-white/70">6 questions from the topics that need you most: {weak.map((t) => t.title).join(', ')}</span>
        </span>
      </button>

      {(['Math', 'Science'] as const).map((s) => (
        <section key={s} className="mb-6">
          <h2 className="mb-3 font-['Space_Grotesk'] text-lg font-semibold">{s === 'Math' ? '🔢 Math' : '🔬 Science'}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {gradeTopics.filter((t) => t.subject === s).map((t) => (
              <button key={t.id} type="button" onClick={() => { setSelection(t); setRound(round + 1); }}
                className="flex items-center gap-3 rounded-2xl border border-[#E6E1D6] bg-[#FFFDF8] p-3 text-left transition hover:-translate-y-0.5 hover:border-[#27314D]">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-white text-3xl">{t.emoji}</span>
                <span className="min-w-0 flex-1"><b className="block truncate text-sm text-[#232B40]">{t.title}</b><Stars value={profile.topics[t.id]?.stars ?? 0} size={12} /></span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
