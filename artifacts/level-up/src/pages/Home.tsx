import { Link } from 'wouter';
import { ArrowRight, Castle, Flame, Gamepad2, Map, Target, Trophy, Zap } from 'lucide-react';
import { topics } from '../data/topics';
import { useProfile } from '../store/progress';
import { DAILY_GOAL, effectiveStreak, levelInfo } from '../store/rewards';
import { badgeRules } from '../store/badges';
import { localDate } from '../lib/date';
import { TopicCard } from '../components/TopicCard';
import { AvatarRenderer } from '../components/avatar/AvatarRenderer';
import { weakestTopics } from './Practice';

export function Home() {
  const { profile } = useProfile();
  const gradeTopics = topics.filter((t) => t.grade === profile.grade);
  // Continue the topic that was started but not finished, otherwise the next unstarred one.
  const inProgress = gradeTopics.find((t) => profile.topics[t.id]?.visualized && !(profile.topics[t.id]?.stars));
  const nextUp = inProgress ?? gradeTopics.find((t) => !(profile.topics[t.id]?.stars)) ?? weakestTopics(gradeTopics, profile.topics, 1)[0];
  const tp = profile.topics[nextUp.id];
  const nextStep = !tp?.visualized ? 'See it' : !tp.learned ? 'Learn it' : 'Practice it';
  const recommended = gradeTopics.filter((t) => t.id !== nextUp.id && !(profile.topics[t.id]?.stars)).slice(0, 3);
  const doneCount = gradeTopics.filter((t) => (profile.topics[t.id]?.stars ?? 0) > 0).length;
  const today = profile.daily[localDate()];
  const activities = Math.min(today?.activities ?? 0, DAILY_GOAL);
  const lvl = levelInfo(profile.xp);
  const streak = effectiveStreak(profile);
  const earned = badgeRules.filter((b) => profile.badges[b.id]).sort((a, b) => profile.badges[b.id].localeCompare(profile.badges[a.id])).slice(0, 4);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page-enter">
      <div className="welcome-line">
        <div>
          <div className="eyebrow">{greeting.toUpperCase()}</div>
          <h1>Hey {profile.name} <span className="wave-mark">👋</span></h1>
          <p>Ready to see, learn and play with Grade {profile.grade} Math & Science?</p>
        </div>
        <AvatarRenderer config={profile.avatarConfig} size={78} animate />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(260px,1fr)]">
        <Link href={`/learn/${nextUp.id}`} className="group relative flex min-h-[240px] overflow-hidden rounded-3xl bg-[#27314D] p-7 text-white">
          <div className="relative z-10 max-w-[60%]">
            <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#BDC5D3]">{inProgress ? 'Pick up where you left off' : 'Your next adventure'}</div>
            <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-semibold leading-tight">{nextUp.title}</h2>
            <p className="mt-2 text-sm text-[#C4CAD3]">{nextUp.blurb}</p>
            <span className="button button-yellow mt-5">{nextStep} <ArrowRight size={16} /></span>
          </div>
          <div className="absolute -right-6 top-1/2 grid h-56 w-56 -translate-y-1/2 place-items-center rounded-full border border-white/10 text-[110px] transition group-hover:scale-105">{nextUp.emoji}</div>
        </Link>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-[#E6E1D6] bg-[#FFFDF8] p-5">
            <div className="flex items-center justify-between"><b className="text-sm text-[#27314D]">Today's goal</b><Flame size={18} className="text-[#E0662A]" fill="currentColor" /></div>
            <div className="mt-2 flex items-end gap-2"><span className="font-['Space_Grotesk'] text-3xl font-semibold">{activities}/{DAILY_GOAL}</span><span className="pb-1 text-xs text-[#6B7385]">activities · {streak}-day streak</span></div>
            <div className="progress-line mt-3"><span style={{ width: `${(activities / DAILY_GOAL) * 100}%` }} /></div>
            <p className="mt-2 text-xs text-[#6B7385]">{today?.goalMet ? 'Goal done! Come back tomorrow to grow your streak 🔥' : 'Explore, learn, practice or play to fill it up.'}</p>
          </div>
          <div className="rounded-3xl border border-[#E6E1D6] bg-[#FFFDF8] p-5">
            <div className="flex items-center justify-between"><b className="text-sm text-[#27314D]">Level {lvl.level}</b><span className="inline-flex items-center gap-1 text-xs font-bold text-[#A0782A]"><Zap size={13} fill="currentColor" /> {profile.xp} XP</span></div>
            <div className="progress-line mt-3"><span style={{ width: `${(lvl.into / lvl.span) * 100}%`, background: '#F4CF55' }} /></div>
            <p className="mt-2 text-xs text-[#6B7385]">{lvl.toNext} XP to Level {lvl.level + 1} · {doneCount}/{gradeTopics.length} topics starred</p>
          </div>
        </div>
      </div>

      <h2 className="mb-3 mt-8 font-['Space_Grotesk'] text-xl font-semibold text-[#232B40]">Jump in</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { href: '/practice', label: 'Practice', sub: 'Mixed review', icon: Target, tone: 'bg-[#FFF3C4]' },
          { href: '/games', label: 'Games', sub: '4 mini-games', icon: Gamepad2, tone: 'bg-[#EEF3FF]' },
          { href: '/adventure', label: 'Math Adventure', sub: `${profile.adventureCompleted.length}/5 levels`, icon: Castle, tone: 'bg-[#FDECEC]' },
          { href: '/missions', label: 'Missions', sub: 'Story quests', icon: Map, tone: 'bg-[#DFF3E6]' },
        ].map(({ href, label, sub, icon: Icon, tone }) => (
          <Link key={href} href={href} className={`flex items-center gap-3 rounded-2xl p-4 transition hover:-translate-y-0.5 ${tone}`}>
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-[#27314D]"><Icon size={20} /></span>
            <span><b className="block text-sm text-[#232B40]">{label}</b><small className="text-[#6B7385]">{sub}</small></span>
          </Link>
        ))}
      </div>

      {recommended.length > 0 && (
        <>
          <h2 className="mb-3 mt-8 font-['Space_Grotesk'] text-xl font-semibold text-[#232B40]">More Grade {profile.grade} topics for you</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((t) => <TopicCard key={t.id} topic={t} progress={profile.topics[t.id]} />)}
          </div>
        </>
      )}

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-[#232B40]">Latest badges</h2>
        <Link href="/achievements" className="text-sm font-bold text-[#3E63DD]">See all →</Link>
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        {earned.length === 0 && <p className="rounded-2xl border border-dashed border-[#E0DBCF] px-4 py-3 text-sm text-[#6B7385]"><Trophy size={14} className="mr-1 inline" /> No badges yet — explore your first topic to earn “First Look” 👀</p>}
        {earned.map((b) => (
          <div key={b.id} className="flex items-center gap-2 rounded-2xl border border-[#E6E1D6] bg-white px-4 py-2.5"><span className="text-2xl">{b.emoji}</span><b className="text-sm">{b.name}</b></div>
        ))}
      </div>
    </div>
  );
}
