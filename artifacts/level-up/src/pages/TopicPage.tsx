import { useMemo, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, ArrowRight, BookOpen, Eye, Gamepad2, LockKeyhole, RotateCcw, Target } from 'lucide-react';
import { topicById, topics, generateSet } from '../data/topics';
import { useProfile } from '../store/progress';
import { Visualizer } from '../components/visualizers';
import { SpeakButton } from '../components/SpeakButton';
import { NarrationTranscript, VoiceStatus } from '../components/NarrationTranscript';
import { useAutoSpeak } from '../lib/speak';
import { PracticeRound } from '../components/PracticeRound';
import { Stars } from '../components/Stars';
import { topicPalette } from '../components/TopicCard';
import { NotFound } from './NotFound';

type Step = 'see' | 'learn' | 'practice';
const EXPLORE_TARGET = 3;

export function TopicPage({ topicId }: { topicId: string }) {
  const topic = topicById(topicId);
  const { profile, completeVisualize, completeLearn, finishPractice } = useProfile();
  const [, navigate] = useLocation();
  const progress = profile.topics[topicId];
  const [step, setStep] = useState<Step>(() => (!progress?.visualized ? 'see' : !progress.learned ? 'learn' : 'practice'));
  const [interactions, setInteractions] = useState(0);
  const [card, setCard] = useState(0);
  const [round, setRound] = useState(0);
  const [practicing, setPracticing] = useState(false);
  const questions = useMemo(() => (topic ? generateSet(topic.generate, 5) : []), [topic, round]);

  const cards = topic ? [...topic.learnCards, { emoji: '🌍', title: 'In real life', text: topic.realLife }] : [];
  const cardSpeech = (i: number) => cards[i] && `${cards[i].title}. ${cards[i].text}`;
  const seeSpeech = topic && (topic.narration ? `${topic.narration} ${topic.exploreGoal}` : topic.exploreGoal);
  const practiceSpeech = topic && `Time to practise ${topic.title}! Answer 5 questions. Get 3 right for one star, 4 right for two stars, and all 5 right for three stars.`;
  useAutoSpeak(step === 'see' ? seeSpeech : step === 'learn' ? cardSpeech(card) : !practicing ? practiceSpeech : null);

  if (!topic) return <NotFound />;

  const visualized = !!progress?.visualized;
  const learned = !!progress?.learned;
  const stars = progress?.stars ?? 0;
  const sameGrade = topics.filter((t) => t.grade === topic.grade && t.subject === topic.subject);
  const next = sameGrade[sameGrade.indexOf(topic) + 1];

  const steps: { id: Step; label: string; icon: typeof Eye; done: boolean; locked: boolean }[] = [
    { id: 'see', label: '1. See it', icon: Eye, done: visualized, locked: false },
    { id: 'learn', label: '2. Learn it', icon: BookOpen, done: learned, locked: !visualized },
    { id: 'practice', label: '3. Practice it', icon: Target, done: stars > 0, locked: !learned },
  ];

  return (
    <div className="page-enter">
      <Link href="/learn" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6B7385] hover:text-[#27314D]"><ArrowLeft size={16} /> All topics</Link>

      <div className={`mt-3 flex flex-wrap items-center gap-4 rounded-3xl p-5 ${topicPalette(topic)}`}>
        <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white text-5xl shadow-sm">{topic.emoji}</div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7385]">Grade {topic.grade} · {topic.subject}</div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-semibold text-[#232B40]">{topic.title}</h1>
          <p className="text-sm text-[#4D5666]">{topic.blurb}</p>
        </div>
        <div className="text-right"><Stars value={stars} size={24} /><div className="text-xs font-bold text-[#6B7385]">best score</div></div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {steps.map((s) => (
          <button key={s.id} type="button" disabled={s.locked} onClick={() => { setStep(s.id); setPracticing(false); }}
            className={`flex items-center justify-center gap-2 rounded-2xl border-2 px-2 py-3 text-sm font-bold transition ${step === s.id ? 'border-[#27314D] bg-[#27314D] text-white' : s.done ? 'border-[#BFE3C9] bg-[#EAF7EE] text-[#2F7D4A]' : 'border-[#E6E1D6] bg-white text-[#3E475A]'} disabled:cursor-not-allowed disabled:opacity-50`}>
            {s.locked ? <LockKeyhole size={15} /> : <s.icon size={15} />} <span>{s.label}</span>{s.done && step !== s.id && ' ✓'}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {step === 'see' && (
          <div className="rounded-3xl border border-[#E5E1D7] bg-[#FFFDF8] p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="eyebrow">TRY IT YOURSELF</div>
                <p className="mt-1 font-['Space_Grotesk'] text-lg font-semibold text-[#232B40]">{topic.exploreGoal}</p>
              </div>
              {!topic.narration && <SpeakButton text={seeSpeech!} />}
            </div>
            {topic.narration && <div className="mb-4"><NarrationTranscript text={topic.narration} speakText={seeSpeech!} title="Story time" /></div>}
            <Visualizer kind={topic.visualizer} params={topic.visualizerParams} onInteract={() => setInteractions((n) => n + 1)} />
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-[#6B7385]">
                {visualized ? 'Explored ✓ — play as much as you like!' : interactions >= EXPLORE_TARGET ? 'Great exploring!' : `Try ${EXPLORE_TARGET - interactions} more change${EXPLORE_TARGET - interactions === 1 ? '' : 's'} to unlock the next step`}
              </span>
              <button type="button" className="button button-yellow" disabled={!visualized && interactions < EXPLORE_TARGET}
                onClick={() => { completeVisualize(topic.id); setStep('learn'); }}>
                {visualized ? 'Go to Learn it' : 'I explored it!'} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 'learn' && (
          <div className="rounded-3xl border border-[#E5E1D7] bg-[#FFFDF8] p-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">{cards.map((_, i) => <span key={i} className={`h-2 w-8 rounded-full ${i <= card ? 'bg-[#F4CF55]' : 'bg-[#E6E1D6]'}`} />)}</div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-[#8A92A2]">
                <VoiceStatus />
                <SpeakButton key={card} text={cardSpeech(card)} next={cardSpeech(card + 1)} />
              </div>
            </div>
            <div key={card} className="page-enter py-6 text-center">
              <div className="text-7xl">{cards[card].emoji}</div>
              <h2 className="mt-4 font-['Space_Grotesk'] text-2xl font-semibold text-[#232B40]">{cards[card].title}</h2>
              <p className="mx-auto mt-3 max-w-lg text-lg leading-relaxed text-[#3E475A]">{cards[card].text}</p>
            </div>
            <div className="flex justify-between">
              <button type="button" className="button button-dark" disabled={card === 0} onClick={() => setCard(card - 1)}><ArrowLeft size={16} /> Back</button>
              {card < cards.length - 1 ? (
                <button type="button" className="button button-yellow" onClick={() => setCard(card + 1)}>Next <ArrowRight size={16} /></button>
              ) : (
                <button type="button" className="button button-yellow" onClick={() => { completeLearn(topic.id); setStep('practice'); }}>
                  {learned ? 'Go to Practice' : "I've got it!"} <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {step === 'practice' && !practicing && (
          <div className="rounded-3xl border border-[#E5E1D7] bg-[#FFFDF8] p-8 text-center">
            <div className="flex items-start justify-center gap-2"><div className="text-6xl">🎯</div><SpeakButton text={practiceSpeech!} /></div>
            <h2 className="mt-3 font-['Space_Grotesk'] text-2xl font-semibold text-[#232B40]">5 questions on {topic.title}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#6B7385]">Get 3 right for ⭐, 4 for ⭐⭐ and all 5 for ⭐⭐⭐. Every round has new questions!</p>
            <div className="mt-3 flex justify-center"><Stars value={stars} size={28} /></div>
            <button type="button" className="button button-yellow mt-5 min-h-12 px-6" onClick={() => { setRound(round + 1); setPracticing(true); }}>
              {stars ? 'Practice again' : 'Start practice'} <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 'practice' && practicing && (
          <PracticeRound
            key={round}
            questions={questions}
            onFinish={(c, t) => finishPractice(topic.id, c, t)}
            actions={(
              <>
                <button type="button" className="button button-dark" onClick={() => setRound(round + 1)}><RotateCcw size={15} /> New questions</button>
                {next && <button type="button" className="button button-yellow" onClick={() => navigate(`/learn/${next.id}`)}>Next topic: {next.title} <ArrowRight size={15} /></button>}
                <Link href="/games" className="button bg-[#EEF3FF] text-[#3E63DD]"><Gamepad2 size={15} /> Play a game</Link>
              </>
            )}
          />
        )}
      </div>
    </div>
  );
}
