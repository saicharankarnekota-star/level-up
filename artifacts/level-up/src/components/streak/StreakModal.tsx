import { Flame, Shield, Target } from 'lucide-react';
import { useProfile } from '../../store/progress';
import { DAILY_GOAL, STREAK_MILESTONES, dayLog, effectiveStreak } from '../../store/rewards';
import { addDays, localDate, weekdayShort } from '../../lib/date';
import { Modal } from '../Modal';

export function StreakModal({ onClose }: { onClose: () => void }) {
  const { profile } = useProfile();
  const today = localDate();
  const streak = effectiveStreak(profile, today);
  const todayLog = profile.daily[today] ?? dayLog(structuredClone(profile), today);
  const week = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const active = new Set(profile.activeDates);
  const learnedToday = active.has(today);

  return (
    <Modal title="Your learning streak" onClose={onClose}>
      <div className="rounded-3xl bg-gradient-to-br from-[#2A3352] to-[#1B2238] p-6 text-center text-white">
        <Flame size={44} className="mx-auto text-[#FF8A3D]" fill="currentColor" />
        <div className="mt-2 font-['Space_Grotesk'] text-5xl font-semibold">{streak}</div>
        <div className="text-sm text-white/70">day{streak === 1 ? '' : 's'} in a row · best {profile.bestStreak}</div>
        <p className="mt-3 text-sm text-[#F4CF55]">
          {learnedToday ? 'You learned today. Your streak is safe! 🔥' : streak > 0 ? 'Do any lesson, practice or game today to keep it going!' : 'Do any activity today to start a streak!'}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1.5">
        {week.map((d) => (
          <div key={d} className={`rounded-xl py-2 text-center ${active.has(d) ? 'bg-[#FFF1E6] text-[#C2410C]' : 'bg-white text-[#9AA0AC]'} ${d === today ? 'ring-2 ring-[#27314D]' : ''}`}>
            <div className="text-[10px] font-bold uppercase">{weekdayShort(d)}</div>
            <div className="mt-1 text-lg">{active.has(d) ? '🔥' : '·'}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#E6E1D6] bg-white p-4">
          <div className="flex items-center gap-2 font-bold text-[#27314D]"><Target size={16} /> Today's goal</div>
          <div className="mt-2 font-['Space_Grotesk'] text-2xl">{Math.min(todayLog.activities, DAILY_GOAL)} / {DAILY_GOAL}</div>
          <div className="progress-line mt-2"><span style={{ width: `${Math.min(100, (todayLog.activities / DAILY_GOAL) * 100)}%` }} /></div>
          <p className="mt-2 text-xs text-[#6B7385]">{todayLog.goalMet ? 'Done! +20 XP earned.' : 'Finish 3 activities for +20 XP.'}</p>
        </div>
        <div className="rounded-2xl border border-[#E6E1D6] bg-white p-4">
          <div className="flex items-center gap-2 font-bold text-[#27314D]"><Shield size={16} /> Streak shields: {profile.shields}</div>
          <p className="mt-2 text-xs text-[#6B7385]">A shield saves your streak if you miss a day. Earn one every 3 days you reach your daily goal (max 2).</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="text-xs font-bold uppercase tracking-wider text-[#6B7385]">Streak rewards</div>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {STREAK_MILESTONES.map((m) => {
            const got = !!profile.awarded[`streak:${m.days}`];
            return (
              <div key={m.days} className={`rounded-xl p-2 text-center ${got ? 'bg-[#EAF7EE] text-[#2F7D4A]' : 'bg-white text-[#6B7385]'}`}>
                <div className="font-['Space_Grotesk'] text-lg font-semibold">{m.days}d</div>
                <div className="text-[11px] font-bold">{got ? '✓ earned' : `+${m.xp} XP`}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
