import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { missionById, missions } from '../data/missions';
import { useProfile } from '../store/progress';
import { PageTitle } from '../layout/AppShell';
import { QuestionCard } from '../components/QuestionCard';
import { SpeakButton } from '../components/SpeakButton';
import { NotFound } from './NotFound';

export function Missions() {
  const { profile } = useProfile();
  const sorted = [...missions].sort((a, b) => Number(b.grade === profile.grade) - Number(a.grade === profile.grade));
  return (
    <div className="page-enter">
      <PageTitle eyebrow="MISSIONS" title="Story quests" description="Help the characters solve problems using what you have learned. Get 3 of 4 right to complete a mission." />
      <div className="grid gap-4 md:grid-cols-2">
        {sorted.map((m) => {
          const done = profile.missionsCompleted.includes(m.id);
          return (
            <Link key={m.id} href={`/missions/${m.id}`} className={`flex gap-4 rounded-3xl border p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${done ? 'border-[#BFE3C9] bg-[#F3FBF5]' : 'border-[#E6E1D6] bg-[#FFFDF8]'}`}>
              <div className={`grid h-20 w-20 shrink-0 place-items-center rounded-2xl text-5xl ${m.subject === 'Math' ? 'bg-[#FFF3C4]' : 'bg-[#DFF3E6]'}`}>{m.emoji}</div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A92A2]">Grade {m.grade} · {m.subject} · {m.steps.length} challenges{m.grade === profile.grade ? ' · for you' : ''}</div>
                <h3 className="mt-1 font-['Space_Grotesk'] text-lg font-semibold text-[#232B40]">{m.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-[#6B7385]">{m.intro}</p>
                <div className="mt-2 text-xs font-bold">{done ? <span className="text-[#2F7D4A]"><CheckCircle2 size={13} className="inline" /> Completed — play again anytime</span> : <span className="text-[#A0782A]">+{m.xpReward} XP reward</span>}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function MissionPlayer({ missionId }: { missionId: string }) {
  const mission = missionById(missionId);
  const { profile, completeMission } = useProfile();
  const [stage, setStage] = useState<'intro' | 'play' | 'end'>('intro');
  const [step, setStep] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [already, setAlready] = useState(false);

  if (!mission) return <NotFound />;
  const need = mission.steps.length - 1;
  const passed = correct >= need;

  const restart = () => {
    setAlready(profile.missionsCompleted.includes(mission.id));
    setStage('play'); setStep(0); setCorrect(0); setAttempt(attempt + 1);
  };

  return (
    <div className="page-enter mx-auto max-w-2xl">
      <Link href="/missions" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6B7385] hover:text-[#27314D]"><ArrowLeft size={16} /> All missions</Link>
      <h1 className="mb-4 mt-2 font-['Space_Grotesk'] text-3xl font-semibold text-[#232B40]">{mission.emoji} {mission.title}</h1>

      {stage === 'intro' && (
        <div className="rounded-3xl bg-[#27314D] p-7 text-white">
          <div className="text-6xl">{mission.emoji}</div>
          <div className="mt-4 flex items-start gap-3">
            <p className="flex-1 text-lg leading-relaxed">{mission.intro}</p>
            <SpeakButton text={mission.intro} className="bg-white" />
          </div>
          <button type="button" className="button button-yellow mt-6" onClick={restart}>Start mission <ArrowRight size={16} /></button>
        </div>
      )}

      {stage === 'play' && (
        <div>
          <div className="mb-3 flex items-center gap-1.5">
            {mission.steps.map((_, i) => <span key={i} className={`h-2 flex-1 rounded-full ${i < step ? 'bg-[#46A758]' : i === step ? 'bg-[#F4CF55]' : 'bg-[#E6E1D6]'}`} />)}
          </div>
          <div className="mb-3 flex items-start gap-3 rounded-2xl bg-[#EEF3FF] p-4">
            <span className="text-3xl">{mission.emoji}</span>
            <p className="flex-1 font-semibold text-[#27314D]">{mission.steps[step].narration}</p>
            <SpeakButton text={mission.steps[step].narration} next={mission.steps[step + 1]?.narration} />
          </div>
          <QuestionCard
            key={`${attempt}-${step}`}
            question={mission.steps[step].question}
            onAnswered={(ok) => ok && setCorrect((c) => c + 1)}
            nextLabel={step + 1 < mission.steps.length ? 'Next challenge' : 'Finish mission'}
            onNext={() => {
              if (step + 1 < mission.steps.length) { setStep(step + 1); return; }
              setStage('end');
              if (correct >= need) completeMission(mission.id, mission.xpReward, correct);
            }}
          />
        </div>
      )}

      {stage === 'end' && (
        <div className="rounded-3xl border border-[#E5E1D7] bg-[#FFFDF8] p-8 text-center">
          <div className="text-6xl">{passed ? '🏅' : '💪'}</div>
          <h2 className="mt-3 font-['Space_Grotesk'] text-2xl font-semibold">{passed ? 'Mission complete!' : 'So close!'}</h2>
          <p className="mx-auto mt-2 max-w-md text-[#3E475A]">{passed ? mission.outro : `You got ${correct} of ${mission.steps.length}. Get ${need} right to complete the mission.`}</p>
          {passed && <p className="mt-2 text-sm font-bold text-[#A0782A]">{already ? `${correct}/${mission.steps.length} correct` : `+${mission.xpReward} XP`}</p>}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button type="button" className="button button-dark" onClick={restart}><RotateCcw size={15} /> {passed ? 'Play again' : 'Try again'}</button>
            <Link href="/missions" className="button button-yellow">More missions <ArrowRight size={15} /></Link>
          </div>
        </div>
      )}
    </div>
  );
}
