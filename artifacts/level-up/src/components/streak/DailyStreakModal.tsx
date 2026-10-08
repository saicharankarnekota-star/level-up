import React from 'react';
import {
  Flame, X, Check, ShieldCheck, Sparkles, Trophy,
  Calendar, Award, Zap, AlertCircle
} from 'lucide-react';
import type { Profile } from '../../types';

interface DailyStreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  onClaimDailyStreak: () => void;
}

export const DailyStreakModal: React.FC<DailyStreakModalProps> = ({
  isOpen,
  onClose,
  profile,
  onClaimDailyStreak,
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().slice(0, 10);
  const claimedToday = profile.claimedStreakDates?.includes(todayStr) ?? false;

  // Generate 7-day week window (e.g. Mon to Sun)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0, Sunday = 6

  const streakMilestones = [
    { days: 3, title: '3-Day Spark', xp: 50, unlocked: profile.streak >= 3 },
    { days: 7, title: '7-Day Blaze', xp: 150, unlocked: profile.streak >= 7 },
    { days: 14, title: '14-Day Inferno', xp: 300, unlocked: profile.streak >= 14 },
    { days: 30, title: '30-Day Legend', xp: 1000, unlocked: profile.streak >= 30 },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#FFFDF8] border border-[#E5E1D8] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with Warm Flame Energy */}
        <div className="relative px-6 py-6 bg-gradient-to-br from-[#27314D] via-[#313E61] to-[#202842] text-[#F7F5EE] text-center overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-[#A8B0C1] hover:text-white hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Glowing Animated Flame */}
          <div className="mx-auto w-16 h-16 rounded-full bg-[#FFF0D4] border-2 border-[#F4CF55] flex items-center justify-center text-[#D96527] shadow-lg mb-3 animate-pulse">
            <Flame size={36} fill="#E86C27" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold text-[#F4CF55] tracking-wider uppercase mb-1">
            <Sparkles size={11} /> Day-to-Day Strike Tracker
          </div>
          <h2 className="text-3xl font-extrabold font-['Space_Grotesk'] tracking-tight">
            {profile.streak} Day Strike!
          </h2>
          <p className="text-xs text-[#CBD2DF] max-w-xs mx-auto mt-1">
            Small daily sparks build massive genius minds. Every day you return keeps the fire burning!
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[65vh]">
          {/* 7-Day Calendar Streak Row */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7A8291]">
              <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Calendar size={13} /> This Week's Strike Chain
              </span>
              <span className="text-[11px] font-semibold text-[#488B6F]">
                {profile.streak} days active
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 p-3 rounded-xl bg-[#F6F4EB] border border-[#E7E2D5]">
              {daysOfWeek.map((day, idx) => {
                const isPast = idx < todayIndex;
                const isToday = idx === todayIndex;
                const isCovered = (idx <= todayIndex && profile.streak > (todayIndex - idx));

                return (
                  <div
                    key={day}
                    className={`flex flex-col items-center py-2 px-1 rounded-lg border text-center transition ${
                      isToday
                        ? 'border-[#E8924A] bg-[#FFF5EA] text-[#B85822] shadow-xs'
                        : isCovered
                        ? 'border-[#CBE3D5] bg-[#EEF7F1] text-[#367958]'
                        : 'border-[#E5E0D5] bg-white text-[#9FA4AE]'
                    }`}
                  >
                    <span className="text-[9px] font-bold uppercase">{day}</span>
                    <div className="mt-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                      {isCovered ? (
                        <Flame size={14} className="text-[#E0662A]" fill="currentColor" />
                      ) : isToday ? (
                        <span className="w-2 h-2 rounded-full bg-[#E8924A] animate-ping" />
                      ) : (
                        <span className="text-[10px] text-[#A5ABB7]">○</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Claim Today's Strike Card */}
          <div className="p-4 rounded-xl border border-[#E9DFCE] bg-[#FFFBF0] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FCE8B3] text-[#A27B17] flex items-center justify-center font-bold">
                <Zap size={20} fill="currentColor" />
              </div>
              <div>
                <b className="text-xs text-[#30384D] block font-bold">
                  {claimedToday ? 'Today’s Strike Secured!' : 'Check In Today’s Strike'}
                </b>
                <span className="text-[11px] text-[#78705C] block">
                  {claimedToday ? 'Awesome job learning today. +20 XP awarded!' : 'Keep your day-to-day strike alive. Earn +20 XP!'}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={claimedToday}
              onClick={onClaimDailyStreak}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                claimedToday
                  ? 'bg-[#E3E0D8] text-[#868A94] cursor-default'
                  : 'bg-[#E27635] text-white hover:bg-[#CF6220] active:scale-95'
              }`}
            >
              {claimedToday ? <Check size={14} className="inline mr-1" /> : null}
              {claimedToday ? 'Claimed' : 'Check In'}
            </button>
          </div>

          {/* Streak Shield / Freeze Protection */}
          <div className="p-3.5 rounded-xl border border-[#D5E6DA] bg-[#F2FAF5] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-[#418D68]" />
              <div className="text-xs">
                <b className="text-[#2F5F49] block">Strike Freeze Shield</b>
                <span className="text-[10px] text-[#5D8B74]">
                  {profile.streakShields > 0
                    ? `${profile.streakShields} shield active! Missed days won't reset your strike.`
                    : 'No shields active. Earn one by completing 5 lessons.'}
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#DCF2E4] text-[#2F6D4F] text-[10px] font-bold">
              🛡️ {profile.streakShields} Protected
            </span>
          </div>

          {/* Milestones */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#798190] block">
              Strike Milestones
            </span>
            <div className="grid grid-cols-2 gap-2">
              {streakMilestones.map((m) => (
                <div
                  key={m.days}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    m.unlocked
                      ? 'border-[#D9EADB] bg-[#F4FAF5] text-[#2F6D4F]'
                      : 'border-[#EBE7DD] bg-white text-[#838997]'
                  }`}
                >
                  <div>
                    <b className="block text-[11px] font-bold">{m.title}</b>
                    <small className="text-[10px] opacity-80">+{m.xp} XP Bonus</small>
                  </div>
                  {m.unlocked ? (
                    <Award size={18} className="text-[#46956F]" />
                  ) : (
                    <span className="text-[10px] font-semibold opacity-60">{m.days}d</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8E4DA] bg-white flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#27314D] text-white text-xs font-bold hover:bg-[#384668] transition"
          >
            Got it, Let’s Learn!
          </button>
        </div>
      </div>
    </div>
  );
};
