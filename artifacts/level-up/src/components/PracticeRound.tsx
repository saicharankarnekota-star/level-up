import { useState, type ReactNode } from 'react';
import type { Question } from '../types';
import { QuestionCard } from './QuestionCard';
import { Stars } from './Stars';

interface Props {
  questions: Question[];
  /** Called once at the end; return the stars earned to show them. */
  onFinish: (correct: number, total: number) => number;
  actions: ReactNode;
}

export function PracticeRound({ questions, onFinish, actions }: Props) {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [result, setResult] = useState<{ correct: number; stars: number } | null>(null);
  const total = questions.length;

  if (result) {
    return (
      <div className="page-enter rounded-3xl border border-[#E5E1D7] bg-[#FFFDF8] p-8 text-center">
        <div className="text-6xl">{result.stars === 3 ? '🏆' : result.stars > 0 ? '🎉' : '💪'}</div>
        <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-[#232B40]">{result.correct} out of {total} correct</h2>
        <div className="mt-3 flex justify-center"><Stars value={result.stars} size={34} /></div>
        <p className="mt-3 text-sm text-[#6B7385]">
          {result.stars === 3 ? 'Perfect! You have mastered this.' : result.stars > 0 ? 'Great work! Try again for more stars.' : 'Keep going — get 3 or more right to earn a star. Mistakes help you learn!'}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">{actions}</div>
      </div>
    );
  }

  const q = questions[index];
  return (
    <div>
      <div className="mb-4 flex items-center gap-1.5">
        {questions.map((_, i) => (
          <span key={i} className={`h-2 flex-1 rounded-full ${i < index ? 'bg-[#46A758]' : i === index ? 'bg-[#F4CF55]' : 'bg-[#E6E1D6]'}`} />
        ))}
        <span className="ml-2 text-xs font-bold text-[#6B7385]">{index + 1}/{total}</span>
      </div>
      <QuestionCard
        key={q.id}
        question={q}
        onAnswered={(ok) => ok && setCorrect((c) => c + 1)}
        nextLabel={index + 1 < total ? 'Next question' : 'See my score'}
        onNext={() => {
          if (index + 1 < total) setIndex(index + 1);
          else setResult({ correct, stars: onFinish(correct, total) });
        }}
      />
    </div>
  );
}
