import { Link } from 'wouter';
import { Check } from 'lucide-react';
import type { Topic, TopicProgress } from '../types';
import { Stars } from './Stars';

export const topicPalette = (t: Topic) => (t.subject === 'Math' ? 'bg-[#FFF3C4]' : 'bg-[#DFF3E6]');

export function TopicCard({ topic, progress, highlight }: { topic: Topic; progress?: TopicProgress; highlight?: boolean }) {
  const steps = [
    { label: 'See', done: !!progress?.visualized },
    { label: 'Learn', done: !!progress?.learned },
    { label: 'Practice', done: (progress?.stars ?? 0) > 0 },
  ];
  return (
    <Link href={`/learn/${topic.id}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-[#FFFDF8] transition hover:-translate-y-1 hover:shadow-lg ${highlight ? 'border-[#F4CF55] ring-2 ring-[#F4CF55]/50' : 'border-[#E6E1D6]'}`}>
      {highlight && <span className="absolute right-3 top-3 rounded-full bg-[#27314D] px-2 py-0.5 text-[10px] font-bold text-[#F4CF55]">NEXT UP</span>}
      <div className={`grid h-24 place-items-center text-5xl ${topicPalette(topic)}`}>{topic.emoji}</div>
      <div className="flex flex-1 flex-col p-4">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A92A2]">Grade {topic.grade} · {topic.subject}</div>
        <h3 className="mt-1 font-['Space_Grotesk'] text-base font-semibold text-[#232B40]">{topic.title}</h3>
        <p className="mt-1 flex-1 text-xs leading-relaxed text-[#6B7385]">{topic.blurb}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-1">
            {steps.map((s) => (
              <span key={s.label} className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${s.done ? 'bg-[#EAF7EE] text-[#2F7D4A]' : 'bg-[#F3F0E8] text-[#9AA0AC]'}`}>
                {s.done && <Check size={10} />}{s.label}
              </span>
            ))}
          </div>
          <Stars value={progress?.stars ?? 0} size={13} />
        </div>
      </div>
    </Link>
  );
}
