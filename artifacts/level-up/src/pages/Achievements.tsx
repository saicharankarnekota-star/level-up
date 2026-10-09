import { LockKeyhole, Trophy } from 'lucide-react';
import { useProfile } from '../store/progress';
import { badgeRules } from '../store/badges';
import { friendlyDate } from '../lib/date';
import { PageTitle } from '../layout/AppShell';

export function Achievements() {
  const { profile } = useProfile();
  const earnedCount = badgeRules.filter((b) => profile.badges[b.id]).length;
  const closest = badgeRules
    .filter((b) => !profile.badges[b.id])
    .map((b) => ({ b, pct: (() => { const [h, n] = b.progress(profile); return n ? h / n : 0; })() }))
    .sort((x, y) => y.pct - x.pct)[0];

  return (
    <div className="page-enter">
      <PageTitle eyebrow="ACHIEVEMENTS" title="Your badge wall" description="Badges are earned by learning — none are given for free!" />

      <div className="achievement-summary">
        <div className="achievement-medal"><Trophy size={22} /></div>
        <div><b>{earnedCount === badgeRules.length ? 'Every badge collected! 🏆' : `${badgeRules.length - earnedCount} badges left to discover`}</b>
          <span>{closest ? `Closest: ${closest.b.emoji} ${closest.b.name} — ${closest.b.description}` : 'You are a Level Up legend.'}</span></div>
        <div className="achievement-counter"><strong>{earnedCount}</strong><small>OF {badgeRules.length}</small></div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {badgeRules.map((b) => {
          const earnedOn = profile.badges[b.id];
          const [have, need] = b.progress(profile);
          return (
            <div key={b.id} className={`overflow-hidden rounded-2xl border ${earnedOn ? 'border-[#E8D27A] bg-[#FFFBEA]' : 'border-[#E6E1D6] bg-[#FFFDF8]'}`}>
              <div className={`relative grid h-24 place-items-center text-5xl ${earnedOn ? '' : 'grayscale opacity-40'}`}>
                {b.emoji}
                {!earnedOn && <LockKeyhole size={16} className="absolute right-3 top-3 text-[#9AA0AC]" />}
              </div>
              <div className="p-3">
                <b className="font-['Space_Grotesk'] text-sm text-[#232B40]">{b.name}</b>
                <p className="mt-1 min-h-[32px] text-xs text-[#6B7385]">{b.description}</p>
                {earnedOn ? (
                  <span className="mt-2 inline-block text-[11px] font-bold text-[#2F7D4A]">Earned {friendlyDate(earnedOn)}</span>
                ) : (
                  <div className="mt-2">
                    <div className="progress-line"><span style={{ width: `${need ? (have / need) * 100 : 0}%` }} /></div>
                    <span className="text-[11px] font-bold text-[#9AA0AC]">{have}/{need}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
