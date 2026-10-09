import React, { useState } from 'react';
import {
  Play, Pause, RotateCcw, ArrowRight, ArrowLeft, Check, X,
  Trophy, Sparkles, Volume2, VolumeX, Lightbulb, Compass,
  Flame, Zap, Award, Star, Shield
} from 'lucide-react';
import type { MathAdventureLevel, StoryboardScene } from '../../data/mathAdventureModules';
import { mathAdventureLevels } from '../../data/mathAdventureModules';

interface MathAdventurePlayerProps {
  initialLevelNumber?: number;
  onCompleteLevel: (levelNumber: number, xpReward: number, badgeName: string) => void;
  unlockedLevels: number[];
  onBack: () => void;
}

export const MathAdventurePlayer: React.FC<MathAdventurePlayerProps> = ({
  initialLevelNumber = 1,
  onCompleteLevel,
  unlockedLevels = [1],
  onBack,
}) => {
  const [currentLevelNumber, setCurrentLevelNumber] = useState(initialLevelNumber);
  const [activeTab, setActiveTab] = useState<'watch' | 'explore' | 'play' | 'prove'>('watch');

  // Watch state
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isNarrating, setIsNarrating] = useState(true);
  const [pauseQuestionAnswer, setPauseQuestionAnswer] = useState<string | null>(null);
  const [pauseFeedback, setPauseFeedback] = useState<string | null>(null);

  // Explore interactive state
  const [appleCount, setAppleCount] = useState(3);
  const [honeyJars, setHoneyJars] = useState(5);
  const [arrayRows, setArrayRows] = useState(3);
  const [arrayCols, setArrayCols] = useState(4);
  const [dragonHealth, setDragonHealth] = useState(100);

  // Prove (Quiz) state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answeredMap, setAnsweredMap] = useState<Record<number, boolean>>({});

  const level = mathAdventureLevels.find((l) => l.levelNumber === currentLevelNumber) || mathAdventureLevels[0];
  const scene: StoryboardScene = level.scenes[Math.min(currentSceneIndex, level.scenes.length - 1)];

  const handleSelectLevel = (num: number) => {
    if (!unlockedLevels.includes(num)) return;
    setCurrentLevelNumber(num);
    setActiveTab('watch');
    setCurrentSceneIndex(0);
    setPauseQuestionAnswer(null);
    setPauseFeedback(null);
    setQuizIndex(0);
    setSelectedQuizAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);
    setAnsweredMap({});
    setDragonHealth(100);
  };

  const handleQuizAnswer = (choice: string) => {
    if (answeredMap[quizIndex]) return;
    setSelectedQuizAnswer(choice);
    const q = level.quizQuestions[quizIndex];
    const isCorrect = choice === q.correct;

    setAnsweredMap((prev) => ({ ...prev, [quizIndex]: true }));
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const nextQuizQuestion = () => {
    if (quizIndex < level.quizQuestions.length - 1) {
      setQuizIndex(quizIndex + 1);
      setSelectedQuizAnswer(null);
    } else {
      setQuizFinished(true);
      const percentage = Math.round(((quizScore + (selectedQuizAnswer === level.quizQuestions[quizIndex].correct ? 0 : 0)) / level.quizQuestions.length) * 100);
      if (percentage >= level.unlockThreshold) {
        onCompleteLevel(level.levelNumber, level.xpReward, level.badgeName);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top Navigation & Level Selector Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#E8E2D5]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5F6776] hover:text-[#27314D] transition"
        >
          <ArrowLeft size={16} /> Back to Learning Hub
        </button>

        {/* Level Path Bubbles */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {mathAdventureLevels.map((lvl) => {
            const isUnlocked = unlockedLevels.includes(lvl.levelNumber);
            const isCurrent = lvl.levelNumber === currentLevelNumber;
            return (
              <button
                key={lvl.id}
                type="button"
                disabled={!isUnlocked}
                onClick={() => handleSelectLevel(lvl.levelNumber)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  isCurrent
                    ? 'bg-[#27314D] text-white shadow-sm ring-2 ring-[#F4CF55]'
                    : isUnlocked
                    ? 'bg-white border border-[#E0DBCF] text-[#333C4F] hover:border-[#27314D]'
                    : 'bg-[#EDEAE1] text-[#9EA3AF] opacity-60 cursor-not-allowed'
                }`}
              >
                <span>{lvl.icon}</span>
                <span>L{lvl.levelNumber}: {lvl.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Level Banner */}
      <div className={`p-6 rounded-2xl bg-gradient-to-r ${level.bgGradient} text-white shadow-lg relative overflow-hidden`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-[10px] font-bold tracking-wider uppercase mb-2">
              <Sparkles size={11} /> Level {level.levelNumber} · {level.subtitle}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-['Space_Grotesk'] tracking-tight">
              {level.title} {level.icon}
            </h1>
            <p className="text-xs md:text-sm text-white/90 max-w-xl mt-1 leading-relaxed">
              {level.story}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-black/20 backdrop-blur-xs p-3 rounded-xl border border-white/20 flex-shrink-0">
            <Trophy size={24} className="text-[#F4CF55]" />
            <div className="text-xs">
              <span className="block text-[10px] uppercase font-bold text-white/70">Completion Reward</span>
              <b>+{level.xpReward} XP</b> · {level.badgeName}
            </div>
          </div>
        </div>
      </div>

      {/* 4-Step Cycle Tabs: 1. Watch, 2. Explore, 3. Play, 4. Prove */}
      <div className="grid grid-cols-4 gap-2 bg-[#F3EFE3] p-1.5 rounded-2xl border border-[#E5E0D2]">
        {[
          { id: 'watch', label: '1. Watch Story', icon: Play, desc: 'Animated Lesson' },
          { id: 'explore', label: '2. Explore', icon: Compass, desc: 'Hands-on Manipulative' },
          { id: 'play', label: '3. Play Games', icon: Zap, desc: 'Mini-Game Arena' },
          { id: 'prove', label: '4. Prove Skills', icon: Award, desc: 'Unlock Next Level' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-2.5 rounded-xl text-center transition flex flex-col items-center justify-center gap-1 ${
                isActive
                  ? 'bg-white text-[#27314D] shadow-sm font-bold border border-[#DDD7C7]'
                  : 'text-[#6A7282] hover:text-[#27314D] font-semibold'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-[#27314D]' : 'text-[#8C93A0]'} />
              <b className="text-xs block leading-tight">{tab.label}</b>
              <span className="text-[10px] opacity-75 hidden sm:block">{tab.desc}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: WATCH (ANIMATED STORYBOARD LESSON) */}
      {activeTab === 'watch' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E7E2D5] shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#F0EBE0] pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A909C]">
                {scene.timeRange}
              </span>
              <h2 className="text-lg font-bold text-[#27314D] font-['Space_Grotesk']">
                {scene.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsNarrating(!isNarrating)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                  isNarrating
                    ? 'bg-[#EDF7EF] text-[#2F6D4F] border-[#CDE5D5]'
                    : 'bg-[#F5F5F5] text-[#868A94] border-[#E0E0E0]'
                }`}
              >
                {isNarrating ? <Volume2 size={15} /> : <VolumeX size={15} />}
                <span>{isNarrating ? 'Narration ON' : 'Muted'}</span>
              </button>
            </div>
          </div>

          {/* Animated Visual Canvas */}
          <div className="p-8 rounded-2xl bg-[#202842] text-white flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden border border-[#3A4565]">
            {/* Background sparkle stars */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <span className="absolute top-4 left-10 text-xl">✦</span>
              <span className="absolute top-12 right-20 text-lg">✧</span>
              <span className="absolute bottom-8 left-1/4 text-sm">✦</span>
            </div>

            {/* Visual Graphic 1: Apples Intro & Add */}
            {level.levelNumber === 1 && (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center gap-6">
                  {/* Mia's original basket */}
                  <div className="flex flex-col items-center p-4 rounded-xl bg-white/10 border border-white/20">
                    <span className="text-4xl animate-bounce">🍎🍎🍎</span>
                    <span className="text-xs font-bold text-[#F4CF55] mt-2">Mia has 3 apples</span>
                  </div>

                  <span className="text-3xl font-extrabold text-[#F4CF55]">+</span>

                  {/* Friend's gift */}
                  <div className="flex flex-col items-center p-4 rounded-xl bg-white/10 border border-white/20">
                    <span className="text-4xl animate-pulse">🍏🍏</span>
                    <span className="text-xs font-bold text-[#A7F3D0] mt-2">Friend gives 2 apples</span>
                  </div>

                  <span className="text-3xl font-extrabold text-[#F4CF55]">=</span>

                  {/* Total */}
                  <div className="flex flex-col items-center p-4 rounded-xl bg-[#F4CF55] text-[#202842] font-bold shadow-lg">
                    <span className="text-4xl">🍎🍎🍎🍏🍏</span>
                    <span className="text-xs font-extrabold mt-2">Total = 5 Apples!</span>
                  </div>
                </div>

                {/* Number Line Visual Forward Jump */}
                <div className="w-full max-w-md p-3 rounded-xl bg-black/40 border border-white/10 mt-3">
                  <div className="text-[10px] uppercase font-bold text-center text-[#F4CF55] mb-1">
                    Number Line Jump: 3 + 2 = 5
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono font-bold px-2 pt-2 border-t border-white/20">
                    {['0', '1', '2', '3', '4', '5', '6', '7'].map((num) => (
                      <div key={num} className="flex flex-col items-center">
                        <span className={`w-2 h-2 rounded-full mb-1 ${num === '3' ? 'bg-[#38BDF8] ring-4 ring-[#38BDF8]/30' : num === '5' ? 'bg-[#4ADE80] ring-4 ring-[#4ADE80]/30' : 'bg-white/40'}`} />
                        <span className={num === '3' || num === '5' ? 'text-white font-bold' : 'text-white/60'}>{num}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Visual Graphic 2: Honey Jars Subtraction */}
            {level.levelNumber === 2 && (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-center">
                    <div className="text-4xl">🍯🍯🍯 <span className="opacity-40 line-through">🍯🍯</span></div>
                    <span className="text-xs font-bold text-[#F4CF55] mt-2 block">
                      Started with 5 jars → Shared 2 jars
                    </span>
                  </div>

                  <span className="text-3xl font-extrabold text-[#F4CF55]">=</span>

                  <div className="p-4 rounded-xl bg-[#F4CF55] text-[#202842] font-bold shadow-lg text-center">
                    <div className="text-4xl">🍯🍯🍯</div>
                    <span className="text-xs font-extrabold mt-2 block">3 Jars Remaining!</span>
                  </div>
                </div>

                {/* Number line backwards */}
                <div className="w-full max-w-md p-3 rounded-xl bg-black/40 border border-white/10 mt-2">
                  <div className="text-[10px] uppercase font-bold text-center text-[#FCD34D] mb-1">
                    Backward Jump: 5 - 2 = 3
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono font-bold px-2 pt-2 border-t border-white/20">
                    {['0', '1', '2', '3', '4', '5', '6', '7'].map((num) => (
                      <div key={num} className="flex flex-col items-center">
                        <span className={`w-2 h-2 rounded-full mb-1 ${num === '5' ? 'bg-[#F59E0B]' : num === '3' ? 'bg-[#10B981]' : 'bg-white/40'}`} />
                        <span className={num === '3' || num === '5' ? 'text-white font-bold' : 'text-white/60'}>{num}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Visual Graphic 3: Multiplication Galaxy Arrays */}
            {level.levelNumber === 3 && (
              <div className="flex flex-col items-center space-y-4">
                <div className="grid grid-rows-3 gap-2 p-4 rounded-xl bg-white/10 border border-white/20">
                  <div className="flex gap-3 text-2xl"><span>🚀 [4💎]</span> <span>= 4 crystals</span></div>
                  <div className="flex gap-3 text-2xl"><span>🚀 [4💎]</span> <span>= 4 crystals</span></div>
                  <div className="flex gap-3 text-2xl"><span>🚀 [4💎]</span> <span>= 4 crystals</span></div>
                </div>
                <div className="p-3 rounded-xl bg-[#F4CF55] text-[#202842] font-extrabold text-sm shadow-md">
                  4 + 4 + 4 = 12 crystals  ↔  3 ships × 4 crystals = 12!
                </div>
              </div>
            )}

            {/* Visual Graphic 4 & 5: Kingdom / Dragon */}
            {level.levelNumber >= 4 && (
              <div className="flex flex-col items-center space-y-3 text-center">
                <span className="text-6xl animate-pulse">{level.icon}</span>
                <b className="text-lg font-['Space_Grotesk'] text-[#F4CF55]">{level.character}</b>
                <p className="text-xs text-white/80 max-w-sm">
                  {level.subtitle} · Master mixed operations to conquer the realm!
                </p>
              </div>
            )}
          </div>

          {/* Narration Voice-Over Box */}
          <div className="p-4 rounded-xl bg-[#FFFBF0] border border-[#EFE4C6] flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#27314D] text-[#F4CF55] flex-shrink-0 mt-0.5">
              <Volume2 size={16} />
            </div>
            <div className="text-xs space-y-1">
              <b className="text-[#3A4565] block font-bold">Narration Audio Transcript:</b>
              <p className="text-[#626C80] italic leading-relaxed text-sm">
                {scene.voiceOverScript}
              </p>
            </div>
          </div>

          {/* Pause-and-Play Interactive Prompt (Scene 4) */}
          {scene.interactivePrompt && (
            <div className="p-5 rounded-xl border border-[#D5E5DA] bg-[#F4FAF6] space-y-3">
              <div className="flex items-center gap-2 text-[#2E6B4F] text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} /> Pause & Play Challenge
              </div>
              <h3 className="text-sm font-bold text-[#27314D]">
                {scene.interactivePrompt.question}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {scene.interactivePrompt.choices.map((choice) => {
                  const isChosen = pauseQuestionAnswer === choice;
                  const isCorrect = choice === scene.interactivePrompt?.correct;
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => {
                        setPauseQuestionAnswer(choice);
                        if (isCorrect) {
                          setPauseFeedback(scene.interactivePrompt!.feedbackRight);
                        } else {
                          setPauseFeedback(scene.interactivePrompt!.feedbackWrong);
                        }
                      }}
                      className={`p-3 rounded-xl border text-center font-bold text-sm transition ${
                        isChosen
                          ? isCorrect
                            ? 'border-[#3B8A5E] bg-[#E8F6ED] text-[#20633F]'
                            : 'border-[#E07A5F] bg-[#FFF2EE] text-[#A64B35]'
                          : 'border-[#E5E1D8] bg-white text-[#384157] hover:border-[#27314D]'
                      }`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>

              {pauseFeedback && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${pauseQuestionAnswer === scene.interactivePrompt.correct ? 'bg-[#EDF7EF] text-[#2F6D4F]' : 'bg-[#FFF2EE] text-[#9E4532]'}`}>
                  {pauseFeedback}
                </div>
              )}
            </div>
          )}

          {/* Scene navigation buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={currentSceneIndex === 0}
              onClick={() => setCurrentSceneIndex(currentSceneIndex - 1)}
              className="px-4 py-2 rounded-xl border border-[#DCD6C9] bg-white text-xs font-bold text-[#555E70] disabled:opacity-40 hover:bg-[#F5F2EB] transition flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> Previous Scene
            </button>

            <span className="text-xs font-semibold text-[#868C98]">
              Scene {currentSceneIndex + 1} of {level.scenes.length}
            </span>

            {currentSceneIndex < level.scenes.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentSceneIndex(currentSceneIndex + 1)}
                className="px-4 py-2 rounded-xl bg-[#27314D] text-white text-xs font-bold hover:bg-[#384668] transition flex items-center gap-1.5"
              >
                <span>Next Scene</span> <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('explore')}
                className="px-5 py-2 rounded-xl bg-[#F4CF55] text-[#202842] text-xs font-extrabold hover:bg-[#FFDC68] transition flex items-center gap-1.5 shadow-sm"
              >
                <span>Ready to Explore Hands-On!</span> <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: EXPLORE (HANDS-ON PHET-STYLE MANIPULATIVE) */}
      {activeTab === 'explore' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E7E2D5] shadow-xs space-y-6">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#798190]">
              Hands-On Laboratory
            </div>
            <h2 className="text-xl font-bold font-['Space_Grotesk'] text-[#27314D]">
              {level.exploreActivity.title}
            </h2>
            <p className="text-xs text-[#6F7684] mt-1">
              {level.exploreActivity.instructions}
            </p>
          </div>

          {/* Level 1: Interactive Fruit Basket */}
          {level.levelNumber === 1 && (
            <div className="p-6 rounded-2xl bg-[#FFFDF5] border border-[#EFE3C5] space-y-5 text-center">
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setAppleCount(Math.max(1, appleCount - 1))}
                  className="w-10 h-10 rounded-xl bg-white border border-[#D5CFBF] font-extrabold text-lg text-[#333D52] hover:bg-[#F0EBE0] transition"
                >
                  -
                </button>
                <div className="p-4 rounded-2xl bg-white border border-[#E0D9C8] min-w-[200px] shadow-inner">
                  <div className="text-4xl min-h-[50px] flex items-center justify-center flex-wrap gap-1">
                    {Array.from({ length: appleCount }).map((_, i) => (
                      <span key={i} className="animate-bounce inline-block" style={{ animationDelay: `${i * 100}ms` }}>
                        🍎
                      </span>
                    ))}
                  </div>
                  <b className="block text-sm font-bold text-[#27314D] mt-2">
                    {appleCount} Apples in Basket
                  </b>
                </div>
                <button
                  type="button"
                  onClick={() => setAppleCount(Math.min(10, appleCount + 1))}
                  className="w-10 h-10 rounded-xl bg-white border border-[#D5CFBF] font-extrabold text-lg text-[#333D52] hover:bg-[#F0EBE0] transition"
                >
                  +
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#27314D] text-white max-w-md mx-auto text-center font-mono text-base font-bold">
                Formula: {appleCount} apples = {appleCount}
                <div className="text-xs font-sans text-[#F4CF55] mt-1">
                  Adding 2 more: {appleCount} + 2 = {appleCount + 2} apples!
                </div>
              </div>
            </div>
          )}

          {/* Level 2: Interactive Honey Pot Giver */}
          {level.levelNumber === 2 && (
            <div className="p-6 rounded-2xl bg-[#FFFDF5] border border-[#EFE3C5] space-y-5 text-center">
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setHoneyJars(Math.max(0, honeyJars - 1))}
                  className="w-10 h-10 rounded-xl bg-white border border-[#D5CFBF] font-extrabold text-lg text-[#333D52] hover:bg-[#F0EBE0] transition"
                >
                  -
                </button>
                <div className="p-4 rounded-2xl bg-white border border-[#E0D9C8] min-w-[200px] shadow-inner">
                  <div className="text-4xl min-h-[50px] flex items-center justify-center flex-wrap gap-1">
                    {Array.from({ length: honeyJars }).map((_, i) => (
                      <span key={i} className="inline-block">🍯</span>
                    ))}
                    {honeyJars === 0 && <span className="text-xs text-[#8E95A5]">No jars left!</span>}
                  </div>
                  <b className="block text-sm font-bold text-[#27314D] mt-2">
                    {honeyJars} Jars on Shelf
                  </b>
                </div>
                <button
                  type="button"
                  onClick={() => setHoneyJars(Math.min(10, honeyJars + 1))}
                  className="w-10 h-10 rounded-xl bg-white border border-[#D5CFBF] font-extrabold text-lg text-[#333D52] hover:bg-[#F0EBE0] transition"
                >
                  +
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#27314D] text-white max-w-md mx-auto text-center font-mono text-base font-bold">
                Formula: Started with 10 - ({10 - honeyJars} given away) = {honeyJars} jars!
              </div>
            </div>
          )}

          {/* Level 3: Interactive Array Grid Builder */}
          {level.levelNumber === 3 && (
            <div className="p-6 rounded-2xl bg-[#F0F4FF] border border-[#D4E0FC] space-y-5">
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div>
                  <label className="text-xs font-bold text-[#2B354F] block mb-1">
                    Rows: {arrayRows}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={arrayRows}
                    onChange={(e) => setArrayRows(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2B354F] block mb-1">
                    Columns: {arrayCols}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={arrayCols}
                    onChange={(e) => setArrayCols(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="p-6 rounded-xl bg-[#1A2238] text-white flex flex-col items-center justify-center min-h-[160px] overflow-auto">
                <div
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `repeat(${arrayCols}, minmax(0, 1fr))` }}
                >
                  {Array.from({ length: arrayRows * arrayCols }).map((_, i) => (
                    <span key={i} className="text-2xl p-1 bg-white/10 rounded-lg text-center">
                      💎
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#27314D] text-white max-w-md mx-auto text-center font-mono text-sm font-bold">
                {arrayRows} rows × {arrayCols} columns = {arrayRows * arrayCols} total crystals!
                <div className="text-xs font-sans text-[#F4CF55] mt-1">
                  Repeated Addition: {Array(arrayRows).fill(arrayCols).join(' + ')} = {arrayRows * arrayCols}
                </div>
              </div>
            </div>
          )}

          {/* Level 4 & 5: Mixed / Dragon Battle */}
          {level.levelNumber >= 4 && (
            <div className="p-6 rounded-2xl bg-[#FFF2F2] border border-[#FCD4D4] space-y-4 text-center">
              <div className="w-full bg-[#E5E7EB] rounded-full h-4 overflow-hidden max-w-md mx-auto">
                <div
                  className="bg-[#DC2626] h-full transition-all duration-300"
                  style={{ width: `${dragonHealth}%` }}
                />
              </div>
              <span className="text-xs font-bold text-[#991B1B]">
                Dragon Shield: {dragonHealth}%
              </span>

              <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => setDragonHealth(Math.max(0, dragonHealth - 25))}
                  className="p-3 rounded-xl bg-[#27314D] text-white text-xs font-bold hover:bg-[#3E4C75] transition"
                >
                  Addition Spell (+25 Dmg)
                </button>
                <button
                  type="button"
                  onClick={() => setDragonHealth(Math.max(0, dragonHealth - 25))}
                  className="p-3 rounded-xl bg-[#27314D] text-white text-xs font-bold hover:bg-[#3E4C75] transition"
                >
                  Subtraction Blast (-25 Dmg)
                </button>
                <button
                  type="button"
                  onClick={() => setDragonHealth(Math.max(0, dragonHealth - 50))}
                  className="p-3 rounded-xl bg-[#F4CF55] text-[#202842] text-xs font-bold hover:bg-[#FFDC68] transition"
                >
                  Multiplication Mega (x2 Dmg)
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('play')}
              className="px-5 py-2.5 rounded-xl bg-[#27314D] text-white text-xs font-bold hover:bg-[#384668] transition flex items-center gap-2"
            >
              <span>Play Mini-Games Arena</span> <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: PLAY (INTERACTIVE MINI-GAMES) */}
      {activeTab === 'play' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E7E2D5] shadow-xs space-y-5">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#798190]">
              Game Arena
            </div>
            <h2 className="text-xl font-bold font-['Space_Grotesk'] text-[#27314D]">
              Interactive Challenges & Mini-Games
            </h2>
            <p className="text-xs text-[#6F7684] mt-1">
              Play and train your instincts with rapid arithmetic puzzles!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {level.games.map((g) => (
              <div
                key={g.id}
                className="p-5 rounded-2xl border border-[#E5E0D5] bg-[#FFFDF9] hover:border-[#27314D] transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#EFECE3] text-[#4F5768]">
                      {g.type}
                    </span>
                    <Flame size={15} className="text-[#D96527]" fill="currentColor" />
                  </div>
                  <h3 className="text-base font-bold text-[#27314D] font-['Space_Grotesk']">
                    {g.name}
                  </h3>
                  <p className="text-xs text-[#737A88] mt-1 leading-relaxed">
                    {g.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0EBE0] flex items-center justify-between">
                  <span className="text-xs text-[#38805F] font-semibold">+25 XP Per Round</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('prove')}
                    className="px-3.5 py-1.5 rounded-lg bg-[#27314D] text-white text-xs font-bold hover:bg-[#384668] transition flex items-center gap-1"
                  >
                    <span>Play Now</span> <Play size={12} fill="currentColor" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#F4FAF6] border border-[#D2E7DB] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#2E6B4F]">
              <Trophy size={16} />
              <span>Ready to test your mastery? Complete the lesson quiz to unlock the next level!</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('prove')}
              className="px-4 py-2 rounded-xl bg-[#2E6B4F] text-white text-xs font-bold hover:bg-[#255740] transition"
            >
              Take Quiz →
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: PROVE YOUR SKILLS (PASS QUIZ >= 70% TO UNLOCK NEXT LEVEL) */}
      {activeTab === 'prove' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E7E2D5] shadow-xs space-y-6">
          {!quizFinished ? (
            <>
              <div className="flex items-center justify-between border-b border-[#F0EBE0] pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#798190]">
                    Skill Check · Level {level.levelNumber}
                  </span>
                  <h2 className="text-lg font-bold font-['Space_Grotesk'] text-[#27314D]">
                    Question {quizIndex + 1} of {level.quizQuestions.length}
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-[#555E70]">
                  <span>Unlock Target: <b>{level.unlockThreshold}%</b></span>
                </div>
              </div>

              {/* Quiz question card */}
              <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#E8E2D5] space-y-4">
                <span className="text-2xl font-bold text-[#27314D] block font-['Space_Grotesk']">
                  {level.quizQuestions[quizIndex].prompt}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {level.quizQuestions[quizIndex].choices.map((choice) => {
                    const isChosen = selectedQuizAnswer === choice;
                    const isCorrect = choice === level.quizQuestions[quizIndex].correct;
                    const isAnswered = answeredMap[quizIndex];

                    return (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => handleQuizAnswer(choice)}
                        className={`p-3.5 rounded-xl border text-left font-bold text-sm transition flex items-center justify-between ${
                          isAnswered
                            ? isCorrect
                              ? 'border-[#3B8A5E] bg-[#E8F6ED] text-[#20633F]'
                              : isChosen
                              ? 'border-[#E07A5F] bg-[#FFF2EE] text-[#A64B35]'
                              : 'border-[#E5E1D8] bg-white text-[#777E8C]'
                            : isChosen
                            ? 'border-[#27314D] bg-[#27314D] text-white'
                            : 'border-[#E5E1D8] bg-white text-[#384157] hover:border-[#27314D]'
                        }`}
                      >
                        <span>{choice}</span>
                        {isAnswered && (isCorrect ? <Check size={16} /> : isChosen ? <X size={16} /> : null)}
                      </button>
                    );
                  })}
                </div>

                {answeredMap[quizIndex] && (
                  <div className="p-3.5 rounded-xl bg-[#F7F5EE] border border-[#E5E0D2] text-xs space-y-1">
                    <b className="text-[#333C4E] block">Explanation:</b>
                    <p className="text-[#646C7C]">{level.quizQuestions[quizIndex].explanation}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={!answeredMap[quizIndex]}
                  onClick={nextQuizQuestion}
                  className="px-6 py-2.5 rounded-xl bg-[#27314D] text-white text-xs font-bold disabled:opacity-40 hover:bg-[#384668] transition flex items-center gap-2"
                >
                  <span>{quizIndex === level.quizQuestions.length - 1 ? 'Finish & Check Results' : 'Next Question'}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center space-y-4">
              {Math.round((quizScore / level.quizQuestions.length) * 100) >= level.unlockThreshold ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-[#E8F6ED] text-[#20633F] flex items-center justify-center mx-auto text-3xl shadow-inner">
                    <Trophy size={32} />
                  </div>
                  <h2 className="text-2xl font-extrabold font-['Space_Grotesk'] text-[#27314D]">
                    Mastery Unlocked! Level Passed!
                  </h2>
                  <p className="text-xs text-[#5D6574] max-w-sm mx-auto">
                    You scored {quizScore} out of {level.quizQuestions.length} ({Math.round((quizScore / level.quizQuestions.length) * 100)}%).
                    You have unlocked the next adventure and earned the <b>{level.badgeName}</b> badge!
                  </p>

                  <div className="inline-flex items-center gap-2 p-3 rounded-xl bg-[#FFF9E6] border border-[#EAD8A7] text-xs font-bold text-[#8A7129]">
                    <Zap size={16} fill="currentColor" />
                    <span>+{level.xpReward} XP Awarded to your profile!</span>
                  </div>

                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setQuizFinished(false);
                        setQuizIndex(0);
                        setSelectedQuizAnswer(null);
                        setQuizScore(0);
                        setAnsweredMap({});
                      }}
                      className="px-4 py-2 rounded-xl border border-[#DCD6C9] bg-white text-xs font-bold text-[#555E70] hover:bg-[#F7F5EE] transition"
                    >
                      Retry Quiz
                    </button>
                    {level.levelNumber < mathAdventureLevels.length && (
                      <button
                        type="button"
                        onClick={() => handleSelectLevel(level.levelNumber + 1)}
                        className="px-6 py-2 rounded-xl bg-[#27314D] text-white text-xs font-bold hover:bg-[#384668] transition flex items-center gap-2"
                      >
                        <span>Start Level {level.levelNumber + 1}</span>
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-[#FFF2EE] text-[#A64B35] flex items-center justify-center mx-auto text-3xl shadow-inner">
                    <X size={32} />
                  </div>
                  <h2 className="text-2xl font-extrabold font-['Space_Grotesk'] text-[#27314D]">
                    Almost There! Keep Practicing!
                  </h2>
                  <p className="text-xs text-[#5D6574] max-w-sm mx-auto">
                    You scored {quizScore} out of {level.quizQuestions.length} ({Math.round((quizScore / level.quizQuestions.length) * 100)}%).
                    You need {level.unlockThreshold}% to unlock the next level. Replay the animated video and explore the hands-on activity to try again!
                  </p>
                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('watch')}
                      className="px-4 py-2 rounded-xl border border-[#DCD6C9] bg-white text-xs font-bold text-[#555E70] hover:bg-[#F7F5EE] transition"
                    >
                      Rewatch Lesson
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQuizFinished(false);
                        setQuizIndex(0);
                        setSelectedQuizAnswer(null);
                        setQuizScore(0);
                        setAnsweredMap({});
                      }}
                      className="px-6 py-2 rounded-xl bg-[#27314D] text-white text-xs font-bold hover:bg-[#384668] transition"
                    >
                      Try Quiz Again
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
