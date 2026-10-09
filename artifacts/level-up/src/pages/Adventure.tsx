import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, Heart, LockKeyhole, Play, RotateCcw, Swords, Volume2, VolumeX } from 'lucide-react';
import type { Question, VisualizerKey, VisualizerParams } from '../types';
import { mathAdventureLevels, type MathAdventureLevel, type StoryboardScene } from '../data/mathAdventureModules';
import { useProfile } from '../store/progress';
import { prefetchSpeech, useAutoSpeak } from '../lib/speak';
import { PageTitle } from '../layout/AppShell';
import { Visualizer } from '../components/visualizers';
import { QuestionCard } from '../components/QuestionCard';
import { NarrationToggle, NarrationTranscript } from '../components/NarrationTranscript';
import { NotFound } from './NotFound';

const levelTopic: Record<number, string> = { 1: 'g1-add20', 2: 'g1-sub20', 3: 'g2-arrays', 4: 'g2-addsub100', 5: 'g2-addsub100' };
const levelHint: Record<number, string> = {
  1: 'Start with the bigger number and count on.',
  2: 'Start at the first number and hop back.',
  3: 'Skip count: add the same number for each group.',
  4: 'Are we putting together, taking away, or making equal groups?',
  5: 'Take your time. Use tens and ones, or count on and back.',
};
const exploreFor: Record<number, { kind: VisualizerKey; params: VisualizerParams; text: string }> = {
  1: { kind: 'tenFrame', params: { a: 3, b: 2 }, text: 'Change the red and green counters. Watch the addition sentence update.' },
  2: { kind: 'numberLine', params: { start: 8, hops: -3, max: 20 }, text: 'Pick a start and hop backwards. Where does the frog land?' },
  3: { kind: 'array', params: { rows: 3, cols: 4 }, text: 'Build rows of stars. Count them by skip counting.' },
  4: { kind: 'sortBins', params: { set: 'operations' }, text: 'Sort each story into the operation that solves it.' },
  5: { kind: 'numberLine', params: { start: 9, hops: 8, max: 20 }, text: 'Warm up for the battle: hop the frog and practise counting on.' },
};

const isUnlocked = (n: number, completed: number[]) => n === 1 || completed.includes(n - 1);

function sceneVisual(g: StoryboardScene['visualGraphic']) {
  const pictures: Partial<Record<StoryboardScene['visualGraphic'], string>> = {
    apples_intro: '🍎🍎🍎     🍏🍏',
    apples_add: '🍎🍎🍎 + 🍏🍏 = 🍎🍎🍎🍏🍏',
    honey_intro: '🐻 🍯🍯🍯🍯🍯',
    honey_takeaway: '🍯🍯🍯  ➡️ 🍯🍯 🐝',
    spaceships_intro: '🚀💎💎💎💎\n🚀💎💎💎💎\n🚀💎💎💎💎',
    repeated_addition: '💎💎💎💎 + 💎💎💎💎 + 💎💎💎💎 = 12',
    kingdom_add: '🏰 🪙🪙 + 🪙🪙🪙',
    kingdom_sub: '🏰 💎💎💎💎 ➡️ 💎💎',
    kingdom_mul: '🏰 📦📦📦 × 3',
    dragon_intro: '🐉🔥',
    pause_interactive_add: '🧺 ❓',
    pause_interactive_sub: '🍯 ❓',
    pause_interactive_mul: '🚀 ❓',
  };
  if (g === 'number_line_forward') return <Visualizer kind="numberLine" params={{ start: 3, hops: 2, max: 10 }} />;
  if (g === 'number_line_backward') return <Visualizer kind="numberLine" params={{ start: 5, hops: -2, max: 10 }} />;
  if (g === 'array_grid') return <Visualizer kind="array" params={{ rows: 3, cols: 4 }} />;
  return <div className="whitespace-pre-line py-6 text-center text-5xl leading-snug">{pictures[g] ?? '✨'}</div>;
}

export function Adventure({ levelParam }: { levelParam?: string }) {
  const { profile } = useProfile();
  if (levelParam === undefined) {
    return (
      <div className="page-enter">
        <PageTitle eyebrow="MATH ADVENTURE" title="The road to the Maths Dragon" description="Five story levels. Watch, explore, then prove your skills to unlock the next level." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mathAdventureLevels.map((l) => {
            const unlocked = isUnlocked(l.levelNumber, profile.adventureCompleted);
            const done = profile.adventureCompleted.includes(l.levelNumber);
            const body = (
              <>
                <div className={`grid h-28 place-items-center bg-gradient-to-br text-6xl ${l.bgGradient} ${unlocked ? '' : 'grayscale opacity-50'}`}>{l.icon}</div>
                <div className="p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A92A2]">Level {l.levelNumber} · {l.subtitle}</div>
                  <h3 className="mt-1 font-['Space_Grotesk'] text-lg font-semibold text-[#232B40]">{l.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-[#6B7385]">{l.story}</p>
                  <div className="mt-2 text-xs font-bold">
                    {done ? <span className="text-[#2F7D4A]"><CheckCircle2 size={13} className="inline" /> Cleared</span>
                      : unlocked ? <span className="text-[#A0782A]">+{l.xpReward} XP</span>
                      : <span className="text-[#9AA0AC]"><LockKeyhole size={12} className="inline" /> Clear level {l.levelNumber - 1} first</span>}
                  </div>
                </div>
              </>
            );
            return unlocked
              ? <Link key={l.id} href={`/adventure/${l.levelNumber}`} className="overflow-hidden rounded-3xl border border-[#E6E1D6] bg-[#FFFDF8] transition hover:-translate-y-1 hover:shadow-lg">{body}</Link>
              : <div key={l.id} className="overflow-hidden rounded-3xl border border-[#E6E1D6] bg-[#FFFDF8]">{body}</div>;
          })}
        </div>
      </div>
    );
  }

  const n = Number(levelParam);
  const level = mathAdventureLevels.find((l) => l.levelNumber === n);
  if (!level) return <NotFound />;
  if (!isUnlocked(n, profile.adventureCompleted)) {
    return (
      <div className="not-found page-enter">
        <div className="text-6xl">🔒</div>
        <h1>Level {n} is locked</h1>
        <p>Clear level {n - 1} first to open the path.</p>
        <Link href={`/adventure/${n - 1}`} className="button button-yellow mt-4">Go to level {n - 1}</Link>
      </div>
    );
  }
  return <AdventureLevel level={level} />;
}

type Step = 'watch' | 'explore' | 'prove';

function AdventureLevel({ level }: { level: MathAdventureLevel }) {
  const { profile, completeAdventure } = useProfile();
  const n = level.levelNumber;
  const cleared = profile.adventureCompleted.includes(n);
  const [step, setStep] = useState<Step>('watch');
  const [scene, setScene] = useState(0);
  const [watched, setWatched] = useState(cleared);
  const [promptAnswer, setPromptAnswer] = useState<string | null>(null);
  const [explored, setExplored] = useState(cleared);
  const [interactions, setInteractions] = useState(0);
  const sc = level.scenes[scene];
  const promptSolved = !sc.interactivePrompt || promptAnswer === sc.interactivePrompt.correct;
  const lastScene = scene === level.scenes.length - 1;

  useAutoSpeak(step === 'watch' ? sc.voiceOverScript : null);
  useEffect(() => prefetchSpeech(level.scenes[scene + 1]?.voiceOverScript), [level, scene]);

  const steps: { id: Step; label: string; locked: boolean; done: boolean }[] = [
    { id: 'watch', label: '1. Watch', locked: false, done: watched },
    { id: 'explore', label: '2. Explore', locked: !watched, done: explored },
    { id: 'prove', label: n === 5 ? '3. Boss fight' : '3. Prove it', locked: !explored, done: cleared },
  ];

  return (
    <div className="page-enter">
      <Link href="/adventure" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6B7385] hover:text-[#27314D]"><ArrowLeft size={16} /> Adventure map</Link>
      <div className={`mt-3 rounded-3xl bg-gradient-to-br p-6 text-white ${level.bgGradient}`}>
        <div className="text-xs font-bold uppercase tracking-wider text-white/80">Level {n} · {level.subtitle}</div>
        <h1 className="mt-1 font-['Space_Grotesk'] text-3xl font-semibold">{level.icon} {level.title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-white/85">{level.story}</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {steps.map((s) => (
          <button key={s.id} type="button" disabled={s.locked} onClick={() => setStep(s.id)}
            className={`flex items-center justify-center gap-2 rounded-2xl border-2 px-2 py-3 text-sm font-bold ${step === s.id ? 'border-[#27314D] bg-[#27314D] text-white' : s.done ? 'border-[#BFE3C9] bg-[#EAF7EE] text-[#2F7D4A]' : 'border-[#E6E1D6] bg-white'} disabled:cursor-not-allowed disabled:opacity-50`}>
            {s.locked && <LockKeyhole size={14} />}{s.label}{s.done && step !== s.id && ' ✓'}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {step === 'watch' && (
          <div className="rounded-3xl border border-[#E5E1D7] bg-[#FFFDF8] p-5">
            <div className="flex items-center justify-between gap-3">
              <div><div className="eyebrow">SCENE {scene + 1} OF {level.scenes.length}</div><h2 className="font-['Space_Grotesk'] text-xl font-semibold">{sc.title}</h2></div>
              <NarrationToggle />
            </div>
            <div className="mt-4 rounded-2xl bg-white p-4">{sceneVisual(sc.visualGraphic)}</div>
            <p className="mt-4 text-center text-lg font-semibold text-[#27314D]">{sc.subtitle}</p>
            <div className="mt-4"><NarrationTranscript text={sc.voiceOverScript} title="Story narration" /></div>
            {sc.interactivePrompt && (
              <div className="mt-4 rounded-2xl bg-[#FFF7E6] p-4">
                <b>⏸️ Your turn: {sc.interactivePrompt.question}</b>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sc.interactivePrompt.choices.map((c) => (
                    <button key={c} type="button" disabled={promptSolved} onClick={() => setPromptAnswer(c)}
                      className={`min-w-14 rounded-xl border-2 px-4 py-2 font-bold ${promptAnswer === c ? (c === sc.interactivePrompt!.correct ? 'border-[#46A758] bg-[#EAF7EE]' : 'border-[#E5484D] bg-[#FDECEC]') : 'border-[#E0DBCF] bg-white'}`}>{c}</button>
                  ))}
                </div>
                {promptAnswer && <p className="mt-2 text-sm">{promptAnswer === sc.interactivePrompt.correct ? sc.interactivePrompt.feedbackRight : `${sc.interactivePrompt.feedbackWrong} Try again!`}</p>}
              </div>
            )}
            <div className="mt-5 flex justify-between">
              <button type="button" className="button button-dark" disabled={scene === 0} onClick={() => { setScene(scene - 1); setPromptAnswer(null); }}><ArrowLeft size={15} /> Back</button>
              {!lastScene ? (
                <button type="button" className="button button-yellow" disabled={!promptSolved} onClick={() => { setScene(scene + 1); setPromptAnswer(null); }}>Next scene <ArrowRight size={15} /></button>
              ) : (
                <button type="button" className="button button-yellow" disabled={!promptSolved} onClick={() => { setWatched(true); setStep('explore'); }}>Start exploring <Eye size={15} /></button>
              )}
            </div>
          </div>
        )}

        {step === 'explore' && (
          <div className="rounded-3xl border border-[#E5E1D7] bg-[#FFFDF8] p-5">
            <div className="eyebrow">EXPLORE</div>
            <p className="mb-4 mt-1 font-semibold text-[#27314D]">{exploreFor[n].text}</p>
            <Visualizer kind={exploreFor[n].kind} params={exploreFor[n].params} onInteract={() => setInteractions((i) => i + 1)} />
            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-[#6B7385]">{explored || interactions >= 3 ? 'Ready!' : `Try ${3 - interactions} more change${3 - interactions === 1 ? '' : 's'}`}</span>
              <button type="button" className="button button-yellow" disabled={!explored && interactions < 3} onClick={() => { setExplored(true); setStep('prove'); }}>
                {n === 5 ? 'Face the dragon' : 'Prove it'} <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {step === 'prove' && (n === 5
          ? <BossFight level={level} onWin={() => completeAdventure(n, level.xpReward)} />
          : <Quiz level={level} onPass={() => completeAdventure(n, level.xpReward)} />)}
      </div>
    </div>
  );
}

const toQuestions = (level: MathAdventureLevel): Question[] => level.quizQuestions.map((q, i) => ({
  id: `adv${level.levelNumber}-${i}`,
  topicId: levelTopic[level.levelNumber],
  prompt: q.prompt,
  choices: q.choices,
  answer: q.correct,
  hint: levelHint[level.levelNumber],
  why: q.explanation,
}));

function Quiz({ level, onPass }: { level: MathAdventureLevel; onPass: () => void }) {
  const [attempt, setAttempt] = useState(0);
  const [i, setI] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const questions = useMemo(() => toQuestions(level), [level]);
  const need = Math.ceil((questions.length * level.unlockThreshold) / 100);
  const next = mathAdventureLevels.find((l) => l.levelNumber === level.levelNumber + 1);

  if (done) {
    const passed = correct >= need;
    return (
      <div className="rounded-3xl border border-[#E5E1D7] bg-[#FFFDF8] p-8 text-center">
        <div className="text-6xl">{passed ? level.icon : '💪'}</div>
        <h2 className="mt-3 font-['Space_Grotesk'] text-2xl font-semibold">{passed ? `Level ${level.levelNumber} cleared!` : 'Almost there!'}</h2>
        <p className="mt-1 text-[#6B7385]">{correct} of {questions.length} correct{passed ? '' : ` — you need ${need} to pass.`}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button type="button" className="button button-dark" onClick={() => { setAttempt(attempt + 1); setI(0); setCorrect(0); setDone(false); }}><RotateCcw size={15} /> Try again</button>
          {passed && next && <Link href={`/adventure/${next.levelNumber}`} className="button button-yellow">Level {next.levelNumber}: {next.title} <ArrowRight size={15} /></Link>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 text-sm font-bold text-[#6B7385]">Question {i + 1} of {questions.length} · need {need} correct</div>
      <QuestionCard key={`${attempt}-${i}`} question={questions[i]} lifelines={false}
        onAnswered={(ok) => ok && setCorrect((c) => c + 1)}
        nextLabel={i + 1 < questions.length ? 'Next' : 'Finish'}
        onNext={() => {
          if (i + 1 < questions.length) { setI(i + 1); return; }
          setDone(true);
          if (correct >= need) onPass();
        }} />
    </div>
  );
}

function BossFight({ level, onWin }: { level: MathAdventureLevel; onWin: () => void }) {
  const questions = useMemo(() => toQuestions(level), [level]);
  const HITS_TO_WIN = 7;
  const [attempt, setAttempt] = useState(0);
  const [i, setI] = useState(0);
  const [hits, setHits] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [outcome, setOutcome] = useState<'win' | 'lose' | null>(null);
  const hp = Math.max(0, 100 - Math.round((hits / HITS_TO_WIN) * 100));

  const reset = () => { setAttempt(attempt + 1); setI(0); setHits(0); setHearts(3); setOutcome(null); };

  if (outcome) {
    return (
      <div className={`rounded-3xl p-8 text-center text-white ${outcome === 'win' ? 'bg-gradient-to-br from-[#2F7D4A] to-[#1B4D2E]' : 'bg-gradient-to-br from-[#9D0208] to-[#03071E]'}`}>
        <div className="text-7xl">{outcome === 'win' ? '🏆' : '🐉'}</div>
        <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-semibold">{outcome === 'win' ? 'You tamed the Maths Dragon!' : 'The dragon survived this time'}</h2>
        <p className="mt-2 text-white/80">{outcome === 'win' ? 'Pyroth bows to the new Maths Champion.' : 'Rest, review, and try again. You can do it!'}</p>
        <button type="button" className="button button-yellow mt-6" onClick={reset}><RotateCcw size={15} /> {outcome === 'win' ? 'Battle again' : 'Try again'}</button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 rounded-3xl bg-gradient-to-br from-[#9D0208] to-[#03071E] p-5 text-white">
        <div className="flex items-center gap-4">
          <div className={`text-6xl transition ${hits ? 'animate-[shake_.3s]' : ''}`} key={hits}>🐉</div>
          <div className="flex-1">
            <div className="flex justify-between text-xs font-bold"><span>Pyroth's shield</span><span>{hp}%</span></div>
            <div className="mt-1 h-3 overflow-hidden rounded-full bg-white/20"><div className="h-full bg-[#F4CF55] transition-all duration-500" style={{ width: `${hp}%` }} /></div>
            <div className="mt-2 flex items-center gap-1 text-xs font-bold">Your hearts: {[0, 1, 2].map((h) => <Heart key={h} size={16} className={h < hearts ? 'fill-[#E5484D] text-[#E5484D]' : 'text-white/30'} />)}</div>
          </div>
          <Swords className="text-white/60" />
        </div>
      </div>
      <QuestionCard key={`${attempt}-${i}`} question={questions[i % questions.length]}
        onAnswered={(ok) => (ok ? setHits((h) => h + 1) : setHearts((h) => h - 1))}
        nextLabel="Next attack"
        onNext={() => {
          if (hits >= HITS_TO_WIN) { setOutcome('win'); onWin(); return; }
          if (hearts <= 0) { setOutcome('lose'); return; }
          setI(i + 1);
        }} />
      <p className="mt-3 text-center text-xs text-[#6B7385]"><Play size={11} className="inline" /> Each right answer hits the dragon. Each wrong answer costs a heart. Lifelines work here!</p>
    </div>
  );
}
