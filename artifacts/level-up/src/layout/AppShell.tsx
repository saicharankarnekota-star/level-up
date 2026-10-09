import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import {
  BookOpen, Castle, Check, ChevronDown, ChevronRight, CheckCircle2, Flame, Gamepad2, GraduationCap, Home, Map, Menu,
  NotebookPen, Target, Trophy, X, Zap,
} from 'lucide-react';
import { useProfile } from '../store/progress';
import { DAILY_GOAL, effectiveStreak, levelInfo } from '../store/rewards';
import { localDate } from '../lib/date';
import { AvatarRenderer } from '../components/avatar/AvatarRenderer';
import { StreakModal } from '../components/streak/StreakModal';
import { NarrationToggle } from '../components/NarrationTranscript';
import type { Grade } from '../types';

export const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/learn', label: 'Learn', icon: BookOpen },
  { href: '/practice', label: 'Practice', icon: Target },
  { href: '/games', label: 'Games', icon: Gamepad2 },
  { href: '/adventure', label: 'Adventure', icon: Castle },
  { href: '/missions', label: 'Missions', icon: Map },
  { href: '/notebook', label: 'Notebook', icon: NotebookPen },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
];

const isActive = (location: string, href: string) => (href === '/' ? location === '/' : location === href || location.startsWith(`${href}/`));

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { profile, toast, dismissToast, updateProfile } = useProfile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [streakOpen, setStreakOpen] = useState(false);
  const [gradeOpen, setGradeOpen] = useState(false);
  const gradeRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMobileOpen(false), [location]);
  useEffect(() => {
    if (!gradeOpen) return undefined;
    const onDown = (e: MouseEvent) => !gradeRef.current?.contains(e.target as Node) && setGradeOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setGradeOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [gradeOpen]);

  const today = profile.daily[localDate()];
  const done = Math.min(today?.activities ?? 0, DAILY_GOAL);
  const streak = effectiveStreak(profile);
  const { level } = levelInfo(profile.xp);
  const current = navItems.find((n) => isActive(location, n.href));
  const crumb = current?.label ?? (location.startsWith('/profile') ? 'Profile' : 'Explore');

  const setGrade = (g: Grade) => { if (g !== profile.grade) updateProfile({ grade: g }); setGradeOpen(false); };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <Link href="/" className="brand" aria-label="LEVEL UP home">
          <span className="brand-mark"><span /></span>
          <span>LEVEL<span className="brand-accent">UP</span><small>SEE IT · LEARN IT · PLAY IT</small></span>
        </Link>
        <div className="nav-caption">YOUR ADVENTURE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`nav-link ${isActive(location, href) ? 'active' : ''}`}>
              <Icon size={18} strokeWidth={2.1} />
              <span>{label}</span>
              {href === '/missions' && profile.missionsCompleted.length === 0 && <i className="nav-dot" />}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button type="button" onClick={() => setStreakOpen(true)} className="daily-side w-[calc(100%-10px)] text-left transition hover:brightness-110">
            <div className="daily-side-top"><span>TODAY'S GOAL</span><Flame size={15} className="text-[#E0662A]" fill="currentColor" /></div>
            <strong>{streak} day{streak === 1 ? '' : 's'}</strong>
            <div className="tiny-track"><span style={{ width: `${(done / DAILY_GOAL) * 100}%` }} /></div>
            <small className="flex items-center justify-between"><span>Goal: {done}/{DAILY_GOAL}</span><span className="text-[#F4CF55]">Streak →</span></small>
          </button>
          <Link href="/profile" className="sidebar-profile flex items-center gap-2.5">
            <AvatarRenderer config={profile.avatarConfig} size={36} />
            <span className="min-w-0 flex-1"><b className="block truncate">{profile.name}</b><small className="block truncate">Level {level} · Grade {profile.grade}</small></span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </aside>

      {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button menu-trigger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu"><Menu size={20} /></button>
          <div className="crumb"><span>YOUR SPACE</span><ChevronRight size={13} /><b>{crumb.toUpperCase()}</b></div>
          <div className="top-actions">
            <div className="relative" ref={gradeRef}>
              <button type="button" onClick={() => setGradeOpen(!gradeOpen)} aria-expanded={gradeOpen}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E0DBCF] bg-white px-3 py-1.5 text-xs font-bold text-[#27314D] hover:border-[#27314D]">
                <GraduationCap size={15} className="text-[#3B4E7A]" /> Grade {profile.grade} <ChevronDown size={13} className="text-[#8890A2]" />
              </button>
              {gradeOpen && (
                <div className="absolute right-0 top-full z-50 mt-1.5 w-44 space-y-1 rounded-2xl border border-[#E8E2D5] bg-white p-2 shadow-xl">
                  {([1, 2] as Grade[]).map((g) => (
                    <button key={g} type="button" onClick={() => setGrade(g)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold ${profile.grade === g ? 'bg-[#27314D] text-white' : 'text-[#3E475A] hover:bg-[#F5F2EB]'}`}>
                      <span>Grade {g}<span className="block text-[10px] font-normal opacity-70">Ages {g === 1 ? '6–7' : '7–8'}</span></span>
                      {profile.grade === g && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <NarrationToggle className="hidden sm:inline-flex" />
            <div className="xp-pill" title={`Level ${level}`}><Zap size={14} fill="currentColor" /><span>{profile.xp} XP</span></div>
            <button className="streak-pill" onClick={() => setStreakOpen(true)} title="Your streak">
              <Flame size={15} className="text-[#D96527]" fill="currentColor" /><b>{streak}</b><span>day streak</span>
            </button>
            <Link href="/profile" className="rounded-full p-0.5 ring-2 ring-[#E8E1C9] transition hover:ring-[#27314D]" aria-label="Profile">
              <AvatarRenderer config={profile.avatarConfig} size={32} />
            </Link>
          </div>
        </header>
        <div className="page-wrap">{children}</div>
      </main>

      {toast && (
        <div key={toast.id} className="toast" role="status">
          <CheckCircle2 size={18} /> {toast.text}
          <button onClick={dismissToast} aria-label="Dismiss"><X size={15} /></button>
        </div>
      )}
      {streakOpen && <StreakModal onClose={() => setStreakOpen(false)} />}
    </div>
  );
}

export function PageTitle({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
