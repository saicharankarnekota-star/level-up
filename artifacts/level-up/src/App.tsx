import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { Link, Route, Switch, useLocation, useRoute } from 'wouter';
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Award, BookOpen,
  Check, CheckCircle2, ChevronRight, ChevronDown, CircleHelp, Compass, Flame, Gamepad2,
  GraduationCap, Lightbulb, LockKeyhole, Menu, PenLine, Play, Plus, Search,
  ShieldCheck, Sparkles, Star, Target, Trophy, X, Zap, Bot,
  Palette, User, RefreshCw, Shield
} from 'lucide-react';
import './index.css';

import type {
  AppData, Profile, Activity, Creation, LifelineInventory,
  AvatarConfig, PracticeQuestion, SubjectLesson, MissionData,
} from './types';
import { AvatarRenderer, defaultAvatarConfig } from './components/avatar/AvatarRenderer';
import { AvatarCustomizerModal } from './components/avatar/AvatarCustomizerModal';
import { AITutorMistakeModal } from './components/ai/AITutorMistakeModal';
import { DailyStreakModal } from './components/streak/DailyStreakModal';
import { LifelinesBar } from './components/lifelines/LifelinesBar';
import {
  allLessons, allPracticeQuestions, allMissions, allSyllabusChapters
} from './data/curriculumData';
import {
  fullGradeQuestions, gradesList, syllabusChapters
} from './data/fullGradeSyllabus';
import { MathAdventurePlayer } from './components/math-adventure/MathAdventurePlayer';
import { mathAdventureLevels } from './data/mathAdventureModules';

const initialData: AppData = {
  profile: {
    name: 'Alex',
    age: 10,
    grade: 'Grade 5',
    avatar: 'A',
    avatarConfig: { ...defaultAvatarConfig },
    interests: ['Space', 'Math', 'Animals', 'Robotics'],
    xp: 740,
    level: 8,
    streak: 4,
    streakShields: 1,
    lastActiveDate: new Date().toISOString().slice(0, 10),
    claimedStreakDates: [new Date().toISOString().slice(0, 10)],
  },
  activity: {
    lessonsCompleted: 12,
    missionsCompleted: 2,
    questionsAnswered: 38,
    gamesPlayed: 9,
    creationsCount: 1,
    dailyGoal: 3,
    lifelinesUsed: 2,
    mistakesReviewed: 4,
  },
  mission: { completed: false, currentStep: 0, activeMissionId: 'mission-fraction-galaxy' },
  completedMissions: [],
  unlockedAdventureLevels: [1],
  creations: [
    {
      id: 'seed-1',
      title: 'Why the moon changes shape',
      type: 'Explanation',
      topic: 'Space',
      subject: 'Science',
      content: 'The moon does not change shape. We see different amounts of its sunlit side as it travels around Earth.',
      createdAt: 'Today',
    },
  ],
  badges: ['Curious starter', 'Four-day spark', 'Idea maker', 'Trail finder'],
  games: {},
  lifelines: {
    fiftyFifty: 3,
    aiClue: 3,
    realLife: 3,
    secondChance: 2,
  },
};

const pages = [
  { href: '/', label: 'Home', icon: Compass },
  { href: '/adventure', label: 'Math Adventure', icon: Sparkles },
  { href: '/learn', label: 'Learn', icon: BookOpen },
  { href: '/missions', label: 'Missions', icon: Target },
  { href: '/games', label: 'Games', icon: Gamepad2 },
  { href: '/practice', label: 'Practice', icon: Zap },
  { href: '/create', label: 'Create', icon: PenLine },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
];

const parseGradeNumber = (grade: string): number | null => {
  const normalized = grade.trim().replace(/\s+/g, ' ');
  const match = normalized.match(/Grade\s*(K|[0-9]+)(?:\s*[-–]\s*(K|[0-9]+))?/i);

  if (!match) return null;

  const startValue = match[1].toLowerCase() === 'k' ? 0 : Number(match[1]);
  const endValue = match[2]
    ? match[2].toLowerCase() === 'k'
      ? 0
      : Number(match[2])
    : startValue;

  return Math.min(startValue, endValue);
};

const gradeMatchesSelection = (selectedGrade: string, gradeLabels?: string | string[]) => {
  if (!selectedGrade || !gradeLabels) return true;

  const targetGrade = parseGradeNumber(selectedGrade);
  if (targetGrade === null) return true;

  const values = Array.isArray(gradeLabels) ? gradeLabels : [gradeLabels];

  return values.some((label) => {
    const normalized = label.replace(/–/g, '-').replace(/\s+/g, ' ').trim();
    const matches = [...normalized.matchAll(/(?:Grade\s*)?(K|[0-9]+)(?:\s*-\s*(K|[0-9]+))?/gi)];

    if (!matches.length) return true;

    return matches.some((match) => {
      const start = match[1].toLowerCase() === 'k' ? 0 : Number(match[1]);
      const end = match[2]
        ? match[2].toLowerCase() === 'k'
          ? 0
          : Number(match[2])
        : start;

      const min = Math.min(start, end);
      const max = Math.max(start, end);
      return targetGrade >= min && targetGrade <= max;
    });
  });
};

function readSaved(): AppData {
  try {
    const saved = localStorage.getItem('level-up-progress-v1');
    if (saved) {
      const restored = JSON.parse(saved);
      const profile: Profile = {
        ...initialData.profile,
        ...restored.profile,
        avatarConfig: {
          ...defaultAvatarConfig,
          ...(restored.profile?.avatarConfig || {}),
        },
        streakShields: restored.profile?.streakShields ?? 1,
        claimedStreakDates: restored.profile?.claimedStreakDates ?? [],
      };
      return {
        ...initialData,
        ...restored,
        profile: {
          ...profile,
          level: Math.floor((profile.xp || 740) / 100) + 1,
        },
        activity: {
          ...initialData.activity,
          ...(restored.activity || {}),
        },
        lifelines: {
          ...initialData.lifelines,
          ...(restored.lifelines || {}),
        },
        completedMissions: restored.completedMissions || (restored.mission?.completed ? ['mission-fraction-galaxy'] : []),
        unlockedAdventureLevels: restored.unlockedAdventureLevels || [1],
      };
    }
  } catch { /* Keep the friendly demo state if storage is unavailable. */ }
  return initialData;
}

function App() {
  const [location, navigate] = useLocation();
  const [data, setData] = useState<AppData>(readSaved);
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState('');

  // Modals state
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [streakModalOpen, setStreakModalOpen] = useState(false);
  const [gradeMenuOpen, setGradeMenuOpen] = useState(false);
  const [aiModalState, setAiModalState] = useState<{
    isOpen: boolean;
    questionText: string;
    studentAnswer: string;
    correctAnswer: string;
    explanation: string;
    misconception?: any;
    realLifeExample?: any;
    subject?: string;
    onRetry?: () => void;
  }>({
    isOpen: false,
    questionText: '',
    studentAnswer: '',
    correctAnswer: '',
    explanation: '',
  });

  useEffect(() => {
    localStorage.setItem('level-up-progress-v1', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const patch = (fn: (d: AppData) => AppData) => setData((current) => fn(current));

  const awardXp = (amount: number) => {
    patch((d) => {
      const xp = d.profile.xp + amount;
      const level = Math.floor(xp / 100) + 1;
      return { ...d, profile: { ...d.profile, xp, level } };
    });
  };

  const handleClaimDailyStreak = () => {
    const today = new Date().toISOString().slice(0, 10);
    patch((d) => {
      const alreadyClaimed = d.profile.claimedStreakDates.includes(today);
      if (alreadyClaimed) return d;
      const newStreak = d.profile.streak + 1;
      const xp = d.profile.xp + 20;
      const level = Math.floor(xp / 100) + 1;
      return {
        ...d,
        profile: {
          ...d.profile,
          xp,
          level,
          streak: newStreak,
          lastActiveDate: today,
          claimedStreakDates: [...d.profile.claimedStreakDates, today],
        },
      };
    });
    setToast('🔥 Day-to-Day Strike secured! +20 XP awarded!');
  };

  const handleSaveAvatar = (newConfig: AvatarConfig) => {
    patch((d) => ({
      ...d,
      profile: { ...d.profile, avatarConfig: newConfig },
    }));
    setToast('✨ Custom avatar updated successfully!');
  };

  const useLifeline = (type: keyof LifelineInventory) => {
    patch((d) => {
      if (d.lifelines[type] <= 0) return d;
      return {
        ...d,
        lifelines: { ...d.lifelines, [type]: d.lifelines[type] - 1 },
        activity: { ...d.activity, lifelinesUsed: d.activity.lifelinesUsed + 1 },
      };
    });
  };

  const completeMission = (missionId: string, badgeName: string, xpGain: number) => {
    patch((d) => {
      const alreadyCompleted = d.completedMissions.includes(missionId);
      const completedList = alreadyCompleted ? d.completedMissions : [...d.completedMissions, missionId];
      const badges = d.badges.includes(badgeName) ? d.badges : [...d.badges, badgeName];
      const xp = d.profile.xp + (alreadyCompleted ? 20 : xpGain);
      const level = Math.floor(xp / 100) + 1;

      return {
        ...d,
        mission: { completed: true, currentStep: 3, activeMissionId: missionId },
        completedMissions: completedList,
        badges,
        profile: { ...d.profile, xp, level },
        activity: {
          ...d.activity,
          missionsCompleted: d.activity.missionsCompleted + (alreadyCompleted ? 0 : 1),
        },
      };
    });
  };

  const handleCompleteAdventureLevel = (levelNumber: number, xpReward: number, badgeName: string) => {
    patch((d) => {
      const currentUnlocked = d.unlockedAdventureLevels || [1];
      const nextLevel = levelNumber + 1;
      const newUnlocked = nextLevel <= 5 && !currentUnlocked.includes(nextLevel)
        ? [...currentUnlocked, nextLevel]
        : currentUnlocked;
      const badges = d.badges.includes(badgeName) ? d.badges : [...d.badges, badgeName];
      const xp = d.profile.xp + xpReward;
      const level = Math.floor(xp / 100) + 1;

      return {
        ...d,
        unlockedAdventureLevels: newUnlocked,
        badges,
        profile: { ...d.profile, xp, level },
        activity: {
          ...d.activity,
          lessonsCompleted: d.activity.lessonsCompleted + 1,
        },
      };
    });
    setToast(`🎉 Level ${levelNumber} Passed! +${xpReward} XP awarded!`);
  };

  const handleSelectGrade = (newGrade: string) => {
    patch((d) => ({
      ...d,
      profile: { ...d.profile, grade: newGrade },
    }));
    setToast(`Syllabus changed to ${newGrade}! Questions and chapters updated.`);
  };

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <Link href="/" className="brand" aria-label="LEVEL UP home">
          <span className="brand-mark"><span /></span>
          <span>LEVEL<span className="brand-accent">UP</span><small>LEARN YOUR WAY</small></span>
        </Link>

        <div className="nav-caption">YOUR ADVENTURE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {pages.map(({ href, label, icon: Icon }) => (
            <Link
              data-testid={`link-${label.toLowerCase()}`}
              key={href}
              href={href}
              className={`nav-link ${location === href ? 'active' : ''}`}
            >
              <Icon size={18} strokeWidth={2.1} />
              <span>{label}</span>
              {href === '/missions' && !data.mission.completed && <i className="nav-dot" />}
            </Link>
          ))}
        </nav>

        <div className="sidebar-bottom">
          {/* Daily Spark & Strike Widget */}
          <button
            type="button"
            onClick={() => setStreakModalOpen(true)}
            className="daily-side w-full text-left transition hover:brightness-105 active:scale-98"
          >
            <div className="daily-side-top">
              <span>DAY STRIKE</span>
              <Flame size={15} className="text-[#E0662A]" fill="currentColor" />
            </div>
            <strong>{data.profile.streak} Days</strong>
            <div className="tiny-track">
              <span style={{ width: `${Math.min((data.activity.lessonsCompleted % data.activity.dailyGoal) / data.activity.dailyGoal * 100, 100)}%` }} />
            </div>
            <small className="flex items-center justify-between">
              <span>Goal: {data.activity.lessonsCompleted % data.activity.dailyGoal}/{data.activity.dailyGoal}</span>
              <span className="text-[#F4CF55]">View Strike →</span>
            </small>
          </button>

          {/* User Profile Card with Custom Avatar */}
          <div className="sidebar-profile flex items-center justify-between">
            <button
              type="button"
              onClick={() => setAvatarModalOpen(true)}
              className="flex items-center gap-2.5 text-left flex-1 min-w-0"
              title="Click to customize avatar"
            >
              <AvatarRenderer config={data.profile.avatarConfig} size={36} />
              <div className="min-w-0">
                <b className="truncate block">{data.profile.name}</b>
                <small className="truncate block">Level {data.profile.level} learner</small>
              </div>
            </button>
            <Link href="/profile" className="text-[#9FA8B9] hover:text-white p-1" aria-label="Open profile">
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
      )}

      {/* Main Area */}
      <main className="main-area">
        {/* Topbar */}
        <header className="topbar">
          <button
            className="icon-button menu-trigger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>

          <div className="crumb">
            <span>YOUR SPACE</span>
            <ChevronRight size={13} />
            <b>{pages.find((p) => p.href === location)?.label ?? 'Explore'}</b>
          </div>

          <div className="top-actions">
            {/* Grade Syllabus Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setGradeMenuOpen(!gradeMenuOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E0DBCF] text-xs font-bold text-[#27314D] hover:border-[#27314D] transition shadow-2xs"
                title="Click to switch grade syllabus"
              >
                <GraduationCap size={15} className="text-[#3B4E7A]" />
                <span>{data.profile.grade}</span>
                <ChevronDown size={13} className="text-[#8890A2]" />
              </button>

              {gradeMenuOpen && (
                <div className="absolute top-full mt-1.5 right-0 z-50 w-64 bg-white rounded-2xl shadow-xl border border-[#E8E2D5] p-2 space-y-1 animate-fade-in max-h-80 overflow-y-auto">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A92A2] px-2 py-1 flex items-center justify-between">
                    <span>Class Syllabus</span>
                    <span className="text-[9px] font-normal text-[#B0B7C5]">Grades 1–10</span>
                  </div>
                  {gradesList.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        handleSelectGrade(g.id);
                        setGradeMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition ${
                        data.profile.grade === g.id
                          ? 'bg-[#27314D] text-white'
                          : 'text-[#3E475A] hover:bg-[#F5F2EB]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span>{g.id}</span>
                          <span className="text-[10px] opacity-80">{g.badge}</span>
                        </div>
                        <span className="block text-[10px] font-normal opacity-70">{g.ageRange}</span>
                      </div>
                      {data.profile.grade === g.id && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* XP Pill */}
            <div className="xp-pill">
              <Zap size={14} fill="currentColor" />
              <span>{data.profile.xp} XP</span>
            </div>

            {/* Day-to-Day Strike Pill */}
            <button
              className="streak-pill"
              onClick={() => setStreakModalOpen(true)}
              title="Click to view daily strike calendar"
            >
              <Flame size={15} className="text-[#D96527]" fill="currentColor" />
              <b>{data.profile.streak}</b>
              <span>day strike</span>
            </button>

            {/* Avatar Pill */}
            <button
              type="button"
              onClick={() => setAvatarModalOpen(true)}
              className="rounded-full ring-2 ring-[#E8E1C9] hover:ring-[#27314D] transition p-0.5"
              title="Customize your avatar"
              aria-label="Customize avatar"
            >
              <AvatarRenderer config={data.profile.avatarConfig} size={32} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-wrap">
          <Switch>
            <Route path="/">
              <Dashboard
                data={data}
                navigate={navigate}
                search={search}
                setSearch={setSearch}
                onOpenAvatarModal={() => setAvatarModalOpen(true)}
                onOpenStreakModal={() => setStreakModalOpen(true)}
              />
            </Route>

            <Route path="/learn">
              <Learn
                data={data}
                search={search}
                setSearch={setSearch}
                onComplete={() => {
                  patch((d) => ({
                    ...d,
                    activity: { ...d.activity, lessonsCompleted: d.activity.lessonsCompleted + 1 },
                    badges:
                      d.activity.lessonsCompleted + 1 >= 10 && !d.badges.includes('Trail finder')
                        ? [...d.badges, 'Trail finder']
                        : d.badges,
                  }));
                  awardXp(25);
                  setToast('Lesson complete. +25 XP');
                }}
                onOpenAiExplainer={(q, studentAns, correctAns, why, misc, realLife, subj) => {
                  setAiModalState({
                    isOpen: true,
                    questionText: q,
                    studentAnswer: studentAns,
                    correctAnswer: correctAns,
                    explanation: why,
                    misconception: misc,
                    realLifeExample: realLife,
                    subject: subj,
                  });
                }}
              />
            </Route>

            <Route path="/adventure">
              <div className="page-enter">
                <MathAdventurePlayer
                  initialLevelNumber={1}
                  unlockedLevels={data.unlockedAdventureLevels || [1]}
                  onCompleteLevel={handleCompleteAdventureLevel}
                  onBack={() => navigate('/learn')}
                />
              </div>
            </Route>

            <Route path="/adventure/:levelNumber">
              {(params) => {
                const lvl = parseInt(params.levelNumber || '1', 10);
                return (
                  <div className="page-enter">
                    <MathAdventurePlayer
                      initialLevelNumber={isNaN(lvl) ? 1 : lvl}
                      unlockedLevels={data.unlockedAdventureLevels || [1]}
                      onCompleteLevel={handleCompleteAdventureLevel}
                      onBack={() => navigate('/learn')}
                    />
                  </div>
                );
              }}
            </Route>

            <Route path="/missions">
              <Missions
                data={data}
                onStartMission={(id) => navigate(`/missions/${id}`)}
              />
            </Route>

            <Route path="/missions/:missionId">
              <MissionRoute
                data={data}
                onUseLifeline={useLifeline}
                onComplete={(missionId, badgeName, xpGain) => {
                  completeMission(missionId, badgeName, xpGain);
                  setToast(`Mission complete. +${xpGain} XP and ${badgeName} badge!`);
                }}
                onOpenAiExplainer={(q, studentAns, correctAns, why, misc, realLife, subj) => {
                  setAiModalState({
                    isOpen: true,
                    questionText: q,
                    studentAnswer: studentAns,
                    correctAnswer: correctAns,
                    explanation: why,
                    misconception: misc,
                    realLifeExample: realLife,
                    subject: subj,
                  });
                }}
                go={navigate}
              />
            </Route>

            {/* Legacy path redirect */}
            <Route path="/missions/fraction-galaxy">
              <MissionPlayer
                mission={allMissions[0]}
                data={data}
                onUseLifeline={useLifeline}
                onComplete={() => {
                  completeMission('mission-fraction-galaxy', 'Fraction Explorer', 120);
                  setToast('Mission complete. +120 XP and Fraction Explorer badge!');
                }}
                go={navigate}
                onOpenAiExplainer={(q, studentAns, correctAns, why, misc, realLife, subj) => {
                  setAiModalState({
                    isOpen: true,
                    questionText: q,
                    studentAnswer: studentAns,
                    correctAnswer: correctAns,
                    explanation: why,
                    misconception: misc,
                    realLifeExample: realLife,
                    subject: subj,
                  });
                }}
              />
            </Route>

            <Route path="/games">
              <Games
                data={data}
                finish={(name, xp) => {
                  patch((d) => ({
                    ...d,
                    activity: { ...d.activity, gamesPlayed: d.activity.gamesPlayed + 1 },
                    games: { ...d.games, [name]: (d.games[name] ?? 0) + 1 },
                  }));
                  awardXp(xp);
                  setToast(`Nice run! +${xp} XP`);
                }}
              />
            </Route>

            <Route path="/practice">
              <Practice
                data={data}
                onSelectGrade={handleSelectGrade}
                onUseLifeline={useLifeline}
                onDone={(n) => {
                  patch((d) => ({
                    ...d,
                    activity: { ...d.activity, questionsAnswered: d.activity.questionsAnswered + n },
                  }));
                  awardXp(40);
                  setToast('Practice round finished. +40 XP');
                }}
                onOpenAiMistakeModal={(q, ans, onRetry) => {
                  const misc = q.misconceptions[ans];
                  setAiModalState({
                    isOpen: true,
                    questionText: q.q,
                    studentAnswer: ans,
                    correctAnswer: q.answer,
                    explanation: q.why,
                    misconception: misc,
                    realLifeExample: q.realLifeExample,
                    subject: q.subject,
                    onRetry,
                  });
                }}
              />
            </Route>

            <Route path="/create">
              <Create
                data={data}
                onSave={(c) => {
                  patch((d) => ({
                    ...d,
                    creations: [c, ...d.creations],
                    activity: { ...d.activity, creationsCount: d.activity.creationsCount + 1 },
                  }));
                  awardXp(20);
                  setToast('Your idea is saved. +20 XP');
                }}
              />
            </Route>

            <Route path="/achievements">
              <Achievements data={data} />
            </Route>

            <Route path="/profile">
              <ProfilePage
                data={data}
                onOpenCustomizer={() => setAvatarModalOpen(true)}
                save={(profile) => {
                  patch((d) => ({ ...d, profile }));
                  setToast('Profile saved!');
                }}
              />
            </Route>

            <Route>
              <NotFound go={navigate} />
            </Route>
          </Switch>
        </div>
      </main>

      {/* Global Toast */}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={18} />
          {toast}
          <button onClick={() => setToast('')} aria-label="Dismiss">
            <X size={15} />
          </button>
        </div>
      )}

      {/* Global Avatar Customizer Modal */}
      <AvatarCustomizerModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        currentConfig={data.profile.avatarConfig}
        onSave={handleSaveAvatar}
        userName={data.profile.name}
      />

      {/* Global Day-to-Day Strike Modal */}
      <DailyStreakModal
        isOpen={streakModalOpen}
        onClose={() => setStreakModalOpen(false)}
        profile={data.profile}
        onClaimDailyStreak={handleClaimDailyStreak}
      />

      {/* Global Interactive AI Mistake Explainer Modal */}
      <AITutorMistakeModal
        isOpen={aiModalState.isOpen}
        onClose={() => setAiModalState((prev) => ({ ...prev, isOpen: false }))}
        questionText={aiModalState.questionText}
        studentAnswer={aiModalState.studentAnswer}
        correctAnswer={aiModalState.correctAnswer}
        explanation={aiModalState.explanation}
        misconception={aiModalState.misconception}
        realLifeExample={aiModalState.realLifeExample}
        userAvatar={data.profile.avatarConfig}
        subject={aiModalState.subject}
        onRetry={aiModalState.onRetry}
      />
    </div>
  );
}

function PageTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function Dashboard({
  data,
  navigate,
  search,
  setSearch,
  onOpenAvatarModal,
  onOpenStreakModal,
}: {
  data: AppData;
  navigate: (path: string) => void;
  search: string;
  setSearch: (s: string) => void;
  onOpenAvatarModal: () => void;
  onOpenStreakModal: () => void;
}) {
  const fractionDone = data.completedMissions.includes('mission-fraction-galaxy');
  const scienceDone = data.completedMissions.includes('mission-matter-lab');

  return (
    <div className="dashboard page-enter">
      {/* Welcome line */}
      <div className="welcome-line">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenAvatarModal}
            className="hover:scale-105 transition active:scale-95 p-1 rounded-2xl bg-white border border-[#E7E2D5] shadow-xs"
            title="Click to customize your avatar"
          >
            <AvatarRenderer config={data.profile.avatarConfig} size={52} />
          </button>
          <div>
            <div className="eyebrow">YOUR ACTIVE ADVENTURE</div>
            <h1>
              Hey {data.profile.name}
              <span className="wave-mark">.</span>
            </h1>
            <p>Ready to level up your Math & Science skills today?</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenStreakModal}
          className="welcome-stamp hover:brightness-105 transition"
        >
          <Flame size={18} className="text-[#E0662A]" fill="currentColor" />
          <span>
            <b>{data.profile.streak}-Day Strike Active!</b>
            <br />
            Keep the spark alive
          </span>
        </button>
      </div>

      {/* Hero & Daily Strike Grid */}
      <div className="dashboard-grid">
        <section className="hero-card">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span className="kicker-dot" /> PICK UP WHERE YOU LEFT OFF
            </div>
            <h2>
              {!fractionDone
                ? 'A universe of\nfractions awaits.'
                : !scienceDone
                ? 'Cosmic Matter Lab\nneeds your science.'
                : 'Explore new trails\nacross the galaxy.'}
            </h2>
            <p>
              {!fractionDone
                ? 'Help the Star Keeper share moon-pies fairly across the galaxy with Math.'
                : !scienceDone
                ? 'Rescue the deep space greenhouse by manipulating states of matter!'
                : 'Your curiosity has no limits. Choose your next subject trail.'}
            </p>
            <button
              className="button button-yellow"
              onClick={() =>
                navigate(
                  !fractionDone
                    ? '/missions/mission-fraction-galaxy'
                    : !scienceDone
                    ? '/missions/mission-matter-lab'
                    : '/learn'
                )
              }
            >
              {!fractionDone
                ? 'Start Math Mission'
                : !scienceDone
                ? 'Start Science Mission'
                : 'Explore Lessons'}
              <ArrowRight size={17} />
            </button>
            <span className="hero-meta">
              Interactive AI Tutor · Lifelines · Real-Life Examples
            </span>
          </div>

          <div className="orbit-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="planet">
              <div className="planet-ring" />
              <span className="planet-crater crater-a" />
              <span className="planet-crater crater-b" />
            </div>
            <span className="orbit-star star-a">✦</span>
            <span className="orbit-star star-b">✧</span>
            <span className="orbit-star star-c">✦</span>
            <span className="orbit-label">
              MATH & SCIENCE<br />LEVEL UP
            </span>
          </div>
        </section>

        {/* Daily Spark Card */}
        <section className="daily-card">
          <div className="card-overline">
            <span>YOUR DAILY SPARK</span>
            <Flame size={16} className="text-[#E0662A]" fill="currentColor" />
          </div>
          <h3>
            Day-to-day strike:
            <br />
            {data.profile.streak} Days Strong!
          </h3>
          <p>Complete lessons & practice to keep the flame glowing.</p>

          <div className="goal-row">
            <div className="goal-dots">
              {[0, 1, 2].map((n) => (
                <span
                  key={n}
                  className={n < data.activity.lessonsCompleted % 3 ? 'filled' : ''}
                >
                  {n < data.activity.lessonsCompleted % 3 && <Check size={12} />}
                </span>
              ))}
            </div>
            <b>
              {data.activity.lessonsCompleted % 3}
              <small> / 3</small>
            </b>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button className="text-action" onClick={() => navigate('/practice')}>
              Quick Practice <ArrowRight size={15} />
            </button>
            <button className="text-action text-[#D96527]" onClick={onOpenStreakModal}>
              View Strike Chain →
            </button>
          </div>
        </section>
      </div>

      {/* Adventures Row */}
      <div className="section-head">
        <div>
          <div className="eyebrow">MADE FOR YOUR KIND OF CURIOUS</div>
          <h2>Pick your next adventure</h2>
        </div>
        <button className="text-action" onClick={() => navigate('/learn')}>
          See everything <ArrowRight size={15} />
        </button>
      </div>

      <div className="adventure-row">
        <button
          className="adventure-card adventure-mission bg-gradient-to-br from-[#FFF5F0] to-[#FFEBE0] border-[#F4CDBE]"
          onClick={() => navigate('/adventure')}
        >
          <span className="adventure-icon bg-[#E0662A] text-white">
            <Sparkles size={20} />
          </span>
          <span className="adventure-copy">
            <b className="text-[#842A0C]">Math Adventure 🍎🐻🚀</b>
            <small className="text-[#A34B29]">Levels 1–5: Mia to Maths Dragon</small>
          </span>
          <span className="adventure-count font-bold text-[#D05417]">
            {(data.unlockedAdventureLevels || [1]).length}/5 open
          </span>
          <ArrowUpRight size={17} className="text-[#D05417]" />
        </button>

        <button
          className="adventure-card adventure-mission"
          onClick={() => navigate('/missions')}
        >
          <span className="adventure-icon">
            <Target size={20} />
          </span>
          <span className="adventure-copy">
            <b>Missions</b>
            <small>Math & Science stories</small>
          </span>
          <span className="adventure-count">{data.completedMissions.length} done</span>
          <ArrowUpRight size={17} />
        </button>

        <button
          className="adventure-card adventure-games"
          onClick={() => navigate('/practice')}
        >
          <span className="adventure-icon">
            <Zap size={20} />
          </span>
          <span className="adventure-copy">
            <b>Practice & Lifelines</b>
            <small>AI Mistake Explainer</small>
          </span>
          <span className="adventure-count">{data.activity.questionsAnswered} solved</span>
          <ArrowUpRight size={17} />
        </button>

        <button
          className="adventure-card adventure-create"
          onClick={() => navigate('/create')}
        >
          <span className="adventure-icon">
            <PenLine size={20} />
          </span>
          <span className="adventure-copy">
            <b>Make something</b>
            <small>Your ideas belong here</small>
          </span>
          <span className="adventure-count">{data.creations.length} saved</span>
          <ArrowUpRight size={17} />
        </button>
      </div>

      {/* Bottom Dashboard */}
      <div className="bottom-dashboard">
        <section className="continue-card">
          <div className="section-head compact">
            <div>
              <div className="eyebrow">KEEP THE MOMENTUM</div>
              <h2>Little wins add up</h2>
            </div>
            <button
              onClick={onOpenStreakModal}
              className="soft-chip hover:scale-105 transition"
            >
              <Flame size={14} className="text-[#E0662A]" fill="currentColor" />
              {data.profile.streak} day strike
            </button>
          </div>

          <div className="stats-row">
            <Stat
              label="Lessons explored"
              value={data.activity.lessonsCompleted}
              icon={<BookOpen size={17} />}
              color="sage"
            />
            <Stat
              label="Questions solved"
              value={data.activity.questionsAnswered}
              icon={<CheckCircle2 size={17} />}
              color="sun"
            />
            <Stat
              label="XP earned"
              value={data.profile.xp}
              icon={<Zap size={17} />}
              color="ink"
            />
          </div>

          <div className="level-row">
            <div className="level-copy">
              <b>Level {data.profile.level} explorer</b>
              <span>{100 - (data.profile.xp % 100)} XP to level {data.profile.level + 1}</span>
            </div>
            <div className="progress-line">
              <span style={{ width: `${data.profile.xp % 100}%` }} />
            </div>
          </div>
        </section>

        <section className="quick-search">
          <div className="eyebrow">GOT A QUESTION IN MIND?</div>
          <h2>Go find out.</h2>
          <p>Search Math, Science, and real-life ideas.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate('/learn');
            }}
            className="search-field"
          >
            <Search size={17} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Try “fractions” or “matter”"
              aria-label="Search learning topics"
            />
            <button aria-label="Search">
              <ArrowRight size={17} />
            </button>
          </form>
        </section>
      </div>

      <div className="local-note">
        <LockKeyhole size={13} /> Your progress and customizable avatar stay on this device.
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  color: string;
}) {
  return (
    <div className="stat-item">
      <span className={`stat-icon ${color}`}>{icon}</span>
      <b>{value}</b>
      <small>{label}</small>
    </div>
  );
}

// --------------------------------------------------------------------------
// LEARN VIEW (With Math, Science, Nature, Engineering tabs & Real-Life Stories)
// --------------------------------------------------------------------------
function Learn({
  data,
  search,
  setSearch,
  onComplete,
  onOpenAiExplainer,
}: {
  data: AppData;
  search: string;
  setSearch: (s: string) => void;
  onComplete: () => void;
  onOpenAiExplainer: (
    q: string,
    studentAns: string,
    correctAns: string,
    why: string,
    misc: any,
    realLife: any,
    subj: string
  ) => void;
}) {
  const [, navigate] = useLocation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'concept' | 'reallife'>('concept');
  const [selectedSyllabusGrade, setSelectedSyllabusGrade] = useState<string>(data.profile.grade || 'Grade 5');
  const [checkAnswer, setCheckAnswer] = useState<string | null>(null);
  const [checkFeedback, setCheckFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (data.profile.grade) {
      setSelectedSyllabusGrade(data.profile.grade);
    }
  }, [data.profile.grade]);

  const filtered = useMemo(
    () =>
      allLessons.filter(
        (l) =>
          (filter === 'All' || l.subject === filter) &&
          gradeMatchesSelection(selectedSyllabusGrade, l.grades) &&
          (!search ||
            `${l.title} ${l.description} ${l.tags.join(' ')} ${l.topic}`
              .toLowerCase()
              .includes(search.toLowerCase()))
      ),
    [filter, search, selectedSyllabusGrade]
  );

  const lesson = allLessons.find((l) => l.id === selectedId);

  const gradeSyllabus = useMemo(
    () =>
      syllabusChapters.filter((chapter) => chapter.grade === selectedSyllabusGrade),
    [selectedSyllabusGrade]
  );

  return (
    <div className="page-enter">
      {!lesson ? (
        <>
          <PageTitle
            eyebrow="SUBJECT TRAILS & REAL-WORLD LEARNING"
            title="Choose a trail."
            description="Explore Mathematics, Science, and the natural world with real-life examples and concepts that stick."
            action={
              <div className="learn-search">
                <Search size={16} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Math or Science..."
                  aria-label="Search lessons"
                />
                {search && (
                  <button onClick={() => setSearch('')} aria-label="Clear search">
                    <X size={14} />
                  </button>
                )}
              </div>
            }
          />

          {/* Level Up: Interactive Mathematics Lesson Plan (Levels 1–5) Hero Banner */}
          <div className="mb-6 p-6 rounded-3xl bg-gradient-to-br from-[#202842] via-[#2A3557] to-[#1E263D] text-white shadow-xl relative overflow-hidden border border-[#3C4A73]">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4CF55]/20 text-[#F4CF55] text-xs font-black uppercase tracking-wider mb-3">
                <Sparkles size={14} />
                <span>Featured Interactive Math Adventure · Levels 1–5</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight mb-2">
                Level Up: Interactive Mathematics Lesson Plan
              </h2>
              <p className="text-sm text-[#C8D1E6] mb-4 leading-relaxed">
                Experience mathematics through story, hands-on manipulatives, mini-games, and skill mastery quizzes! Complete each mission with ≥70% score to unlock the next level.
              </p>

              {/* Levels progression tags */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-5">
                {[
                  { lvl: 1, name: 'Addition', icon: '🍎', desc: 'Mia’s Apples' },
                  { lvl: 2, name: 'Subtraction', icon: '🐻', desc: 'Barnaby’s Honey' },
                  { lvl: 3, name: 'Multiplication', icon: '🚀', desc: 'Energy Crystals' },
                  { lvl: 4, name: 'Mixed Challenge', icon: '🏰', desc: 'Magic Kingdom' },
                  { lvl: 5, name: 'Maths Dragon', icon: '🐉', desc: 'Pyroth Boss' },
                ].map((item) => {
                  const isUnlocked = (data.unlockedAdventureLevels || [1]).includes(item.lvl);
                  return (
                    <div
                      key={item.lvl}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        isUnlocked
                          ? 'bg-white/10 border-white/20 text-white'
                          : 'bg-black/20 border-white/5 text-white/40'
                      }`}
                    >
                      <span className="text-lg block mb-0.5">{item.icon}</span>
                      <b className="text-[11px] block truncate">L{item.lvl}: {item.name}</b>
                      <small className="text-[9px] opacity-75 block">{item.desc}</small>
                    </div>
                  );
                })}
              </div>

              {/* 4-Step Cycle pills */}
              <div className="flex items-center gap-2 text-xs font-bold text-[#E2E8F5] mb-5 flex-wrap">
                <span className="text-[#F4CF55]">4-Step Cycle:</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10">1. Watch 🎬</span>
                <span>→</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10">2. Explore 🖐️</span>
                <span>→</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10">3. Play 🎮</span>
                <span>→</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10">4. Prove (≥70%) 🏆</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/adventure')}
                  className="px-5 py-2.5 rounded-xl bg-[#F4CF55] text-[#202842] text-xs font-extrabold hover:bg-[#FFDC68] transition shadow-md active:scale-95 flex items-center gap-2"
                >
                  <span>Start Math Adventure Journey</span>
                  <ArrowRight size={16} />
                </button>
                <span className="text-xs text-[#A9B4CC]">
                  {(data.unlockedAdventureLevels || [1]).length}/5 Levels Unlocked
                </span>
              </div>
            </div>

            <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none text-9xl">
              🚀
            </div>
          </div>

          {/* Grade Syllabus Selector Ribbon */}
          <div className="mb-6 p-4 rounded-2xl bg-white border border-[#E7E2D5] shadow-xs">
            <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7B8394] block">
                  BROWSE GRADE CURRICULUM SYLLABUS
                </span>
                <h3 className="text-sm font-bold text-[#27314D] flex items-center gap-2">
                  <span>Viewing Syllabus for <span className="text-[#3252A2] font-black underline decoration-2">{selectedSyllabusGrade}</span></span>
                  {gradesList.find((g) => g.id === selectedSyllabusGrade) && (
                    <span className="font-normal text-xs text-[#6F7788]">
                      ({gradesList.find((g) => g.id === selectedSyllabusGrade)?.ageRange} · {gradesList.find((g) => g.id === selectedSyllabusGrade)?.badge})
                    </span>
                  )}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => navigate('/practice')}
                className="text-xs px-3 py-1.5 rounded-xl bg-[#27314D] text-white font-bold hover:bg-[#384668] transition"
              >
                Practice Questions →
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {gradesList.map((g) => {
                const isSelected = selectedSyllabusGrade === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedSyllabusGrade(g.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#27314D] text-white shadow-sm ring-2 ring-[#27314D]/20 scale-102'
                        : 'bg-[#F7F5EE] text-[#555E70] hover:bg-[#EFECE2] hover:text-[#27314D]'
                    }`}
                  >
                    <span>{g.badge.split(' ')[0]}</span>
                    <span>{g.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="filter-row">
            {['All', 'Math', 'Science', 'Nature', 'Engineering'].map((f) => (
              <button
                key={f}
                className={`filter-chip ${filter === f ? 'selected' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'Math' ? '📐 Mathematics' : f === 'Science' ? '🔬 Science' : f}
              </button>
            ))}
          </div>

          {gradeSyllabus.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>
                {selectedSyllabusGrade} SYLLABUS UNITS
              </div>
              <div className="lesson-grid">
                {gradeSyllabus.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="lesson-card"
                    style={{ cursor: 'default', opacity: 1 }}
                  >
                    <div className="lesson-art">
                      <span>{chapter.subject === 'Math' ? '📐' : '🔬'}</span>
                      <small>{chapter.subject} · Unit {chapter.chapterNumber}</small>
                    </div>
                    <div className="lesson-body">
                      <div className="lesson-meta">
                        <span>{chapter.grade}</span>
                        <span>{chapter.subject}</span>
                      </div>
                      <h3>{chapter.chapterTitle}</h3>
                      <p>{chapter.description}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
                        {chapter.topics.slice(0, 3).map((topic) => (
                          <span
                            key={topic}
                            style={{
                              display: 'inline-block',
                              padding: '0.35rem 0.55rem',
                              borderRadius: '999px',
                              background: '#EEF4FF',
                              color: '#1F2B4D',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                            }}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filtered.length ? (
            <div className="lesson-grid">
              {filtered.map((item, i) => (
                <button
                  key={item.id}
                  className={`lesson-card ${item.palette}`}
                  onClick={() => {
                    setSelectedId(item.id);
                    setCheckAnswer(null);
                    setCheckFeedback(null);
                    setActiveTab('concept');
                  }}
                >
                  <div className="lesson-art">
                    <span>{item.glyph}</span>
                    <small>{item.subject} · {item.topic}</small>
                  </div>
                  <div className="lesson-body">
                    <div className="lesson-meta">
                      <span>{item.age}</span>
                      <span>{item.length}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="lesson-bottom">
                      <span>Start exploring</span>
                      <span className="circle-arrow">
                        <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="empty-card">
              <Search size={25} />
              <h3>No trails found just yet.</h3>
              <p>Try searching for “fractions”, “matter”, or “angles”.</p>
              <button
                className="button button-dark"
                onClick={() => {
                  setSearch('');
                  setFilter('All');
                }}
              >
                Show all trails
              </button>
            </div>
          )}

          <div className="learn-footnote">
            <Lightbulb size={16} />
            <span>Curiosity is the beginning of genius. Pick whatever sparks your interest.</span>
          </div>
        </>
      ) : (
        <div className="lesson-detail">
          <button className="back-link" onClick={() => setSelectedId(null)}>
            <ArrowLeft size={16} /> Back to trails
          </button>

          <div className={`lesson-detail-banner ${lesson.palette}`}>
            <span className="lesson-big-glyph">{lesson.glyph}</span>
            <div>
              <span className="eyebrow">
                {lesson.subject.toUpperCase()} · {lesson.topic.toUpperCase()} · {lesson.length}
              </span>
              <h1>{lesson.title}</h1>
              <p>{lesson.description}</p>
            </div>
          </div>

          {/* Toggle between The Big Idea & In Real Life */}
          <div className="flex gap-2 my-6 border-b border-[#E8E2D5] pb-2">
            <button
              onClick={() => setActiveTab('concept')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'concept'
                  ? 'bg-[#27314D] text-white'
                  : 'bg-white border border-[#E7E2D8] text-[#555E70] hover:text-[#27314D]'
              }`}
            >
              <BookOpen size={14} /> The Big Idea
            </button>
            <button
              onClick={() => setActiveTab('reallife')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'reallife'
                  ? 'bg-[#27314D] text-white'
                  : 'bg-white border border-[#E7E2D8] text-[#555E70] hover:text-[#27314D]'
              }`}
            >
              <Compass size={14} /> In Real Life (IRL)
            </button>
          </div>

          <div className="lesson-reading">
            {activeTab === 'concept' ? (
              <>
                <div className="reading-label">
                  <BookOpen size={17} /> THE CORE CONCEPT
                </div>
                <h2>Look a little closer.</h2>
                <p>
                  Every scientific law and math formula started as an observation about the universe.
                  Here is the foundation of this idea:
                </p>

                <div className="idea-box">
                  <span className="idea-mark">“</span>
                  <div>
                    <b>Take this idea with you:</b>
                    <p>{lesson.bigIdea}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="reading-label text-[#3A7E62]">
                  <Compass size={17} /> REAL-WORLD ANALOGY
                </div>
                <h2>{lesson.inRealLife.title}</h2>
                <p className="text-sm leading-relaxed text-[#515967]">
                  {lesson.inRealLife.story}
                </p>

                <div className="p-4 rounded-xl bg-[#F0F7F4] border border-[#D0E5DC] my-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#357B5D]">
                    Did You Know?
                  </span>
                  <p className="text-xs text-[#416856] leading-relaxed">
                    {lesson.inRealLife.didYouKnow}
                  </p>
                </div>
              </>
            )}

            {/* Quick Interactive Checkpoint */}
            <div className="p-5 rounded-xl border border-[#E7E1D2] bg-[#FAF8F2] my-6 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#828896] flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#58A986]" /> Quick Concept Check
              </span>
              <b className="text-sm text-[#27314D] block">{lesson.checkQuestion.prompt}</b>

              <div className="grid gap-2">
                {lesson.checkQuestion.choices.map((choice) => {
                  const isChosen = checkAnswer === choice;
                  const isCorrect = choice === lesson.checkQuestion.correct;
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => {
                        setCheckAnswer(choice);
                        if (isCorrect) {
                          setCheckFeedback('correct');
                        } else {
                          setCheckFeedback('incorrect');
                        }
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition ${
                        isChosen
                          ? isCorrect
                            ? 'border-[#58A986] bg-[#EDF7EF] text-[#2F6D4F] font-bold'
                            : 'border-[#E07A5F] bg-[#FFF2EE] text-[#A64B35]'
                          : 'border-[#E5E1D8] bg-white text-[#3E4759] hover:border-[#27314D]'
                      }`}
                    >
                      <span>{choice}</span>
                      {isChosen && (isCorrect ? <Check size={14} /> : <X size={14} />)}
                    </button>
                  );
                })}
              </div>

              {checkFeedback === 'correct' && (
                <div className="p-3 rounded-lg bg-[#EDF7EF] text-[#2E7350] text-xs font-semibold">
                  🎉 Exactly right! {lesson.checkQuestion.explanation}
                </div>
              )}

              {checkFeedback === 'incorrect' && checkAnswer && (
                <div className="p-3 rounded-lg bg-[#FFF2EE] text-[#934533] text-xs space-y-2">
                  <p>Not quite, but every try is a stepping stone!</p>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenAiExplainer(
                        lesson.checkQuestion.prompt,
                        checkAnswer,
                        lesson.checkQuestion.correct,
                        lesson.checkQuestion.explanation,
                        {
                          studentAnswer: checkAnswer,
                          misconception: 'Concept checkpoint slip-up',
                          whyWrong: 'Check the foundational rule in this lesson!',
                          keyRule: 'Remember the big idea above.',
                        },
                        {
                          headline: lesson.inRealLife.title,
                          scenario: lesson.inRealLife.story,
                          takeaway: lesson.bigIdea,
                        },
                        lesson.subject
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27314D] text-white text-[11px] font-bold hover:bg-[#384668] transition"
                  >
                    <Bot size={13} /> Ask Nova AI to explain why
                  </button>
                </div>
              )}
            </div>

            <button
              className="button button-dark"
              onClick={() => {
                onComplete();
                setSelectedId(null);
              }}
            >
              I explored this idea <Check size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------------------------
// MISSIONS VIEW (Math & Science Missions)
// --------------------------------------------------------------------------
function MissionRoute({
  data,
  onUseLifeline,
  onComplete,
  onOpenAiExplainer,
  go,
}: {
  data: AppData;
  onUseLifeline: (type: keyof LifelineInventory) => void;
  onComplete: (missionId: string, badgeName: string, xpGain: number) => void;
  onOpenAiExplainer: (
    q: string,
    studentAns: string,
    correctAns: string,
    why: string,
    misc: any,
    realLife: any,
    subj: string
  ) => void;
  go: (p: string) => void;
}) {
  const [, params] = useRoute('/missions/:missionId');
  const missionId = params?.missionId;
  const mission = allMissions.find((m) => m.id === missionId) || allMissions[0];
  const missionReward = {
    'mission-fraction-galaxy': { badge: 'Fraction Explorer', xp: 120 },
    'mission-matter-lab': { badge: 'Matter Alchemist', xp: 140 },
    'mission-bridge-builder': { badge: 'Bridge Builder', xp: 150 },
    'mission-pollinator-quest': { badge: 'Pollinator Protector', xp: 160 },
    'mission-plant-power': { badge: 'Plant Power', xp: 170 },
    'mission-planet-balance': { badge: 'Planet Balancer', xp: 180 },
  }[mission.id] || { badge: mission.badgeReward, xp: mission.xpReward };

  return (
    <MissionPlayer
      mission={mission}
      data={data}
      onUseLifeline={onUseLifeline}
      onComplete={() => {
        onComplete(mission.id, missionReward.badge, missionReward.xp);
      }}
      go={go}
      onOpenAiExplainer={onOpenAiExplainer}
    />
  );
}

function Missions({
  data,
  onStartMission,
}: {
  data: AppData;
  onStartMission: (id: string) => void;
}) {
  return (
    <div className="page-enter">
      <PageTitle
        eyebrow="CURRICULUM STORY MISSIONS"
        title="Missions."
        description="Embark on story-driven challenges in Mathematics and Science. Use lifelines, master misconceptions, and conquer each chapter."
      />

      <div className="space-y-6">
        {allMissions
          .filter((m) => gradeMatchesSelection(data.profile.grade, m.grades))
          .map((m) => {
          const isDone = data.completedMissions.includes(m.id);
          return (
            <section key={m.id} className="mission-list-card">
              <div className="mission-art">
                <div className="mission-sun" />
                <span className="mission-orbit orb-a" />
                <span className="mission-orbit orb-b" />
                <span className="mission-rock">{m.subject === 'Math' ? '½' : '⚛'}</span>
                <span className="mission-spark spark-1">✦</span>
                <span className="mission-spark spark-2">✧</span>
                <small>
                  {m.subject.toUpperCase()}<br />MISSION
                </small>
              </div>

              <div className="mission-info">
                <div className="mission-status">
                  {isDone ? (
                    <>
                      <CheckCircle2 size={14} /> MISSION COMPLETE
                    </>
                  ) : (
                    <>
                      <span className="live-dot" /> READY WHEN YOU ARE
                    </>
                  )}
                </div>

                <h2>{m.title}</h2>
                <p>{m.description}</p>

                <div className="mission-tags">
                  <span className="bg-[#EAE8E0] text-[#27314D] font-bold">{m.subject}</span>
                  <span>{m.grades.join(' · ')}</span>
                  <span>{m.challenges.length} challenges</span>
                  <span>{m.estimatedTime}</span>
                  <span className="text-[#3B7E62] font-semibold">+{m.xpReward} XP</span>
                </div>

                <div className="mission-progress">
                  <div className="mission-progress-label">
                    <span>Progress</span>
                    <b>{isDone ? 'Completed' : 'Ready'}</b>
                  </div>
                  <div className="progress-line">
                    <span style={{ width: isDone ? '100%' : '0%' }} />
                  </div>
                </div>

                <button
                  className="button button-dark"
                  onClick={() => onStartMission(m.id)}
                >
                  {isDone ? 'Replay Mission' : 'Start Mission'}
                  <ArrowRight size={17} />
                </button>
              </div>
            </section>
          );
        })}
      </div>

      <div className="mission-note">
        <Lightbulb size={17} />
        <span>
          Take all the time you need. Lifelines and interactive AI assistance are available on every step!
        </span>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// MISSION PLAYER COMPONENT (With Lifelines & AI Explainer)
// --------------------------------------------------------------------------
function MissionPlayer({
  mission,
  data,
  onUseLifeline,
  onComplete,
  go,
  onOpenAiExplainer,
}: {
  mission: MissionData;
  data: AppData;
  onUseLifeline: (type: keyof LifelineInventory) => void;
  onComplete: () => void;
  go: (p: string) => void;
  onOpenAiExplainer: (
    q: string,
    studentAns: string,
    correctAns: string,
    why: string,
    misc: any,
    realLife: any,
    subj: string
  ) => void;
}) {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [hint, setHint] = useState(false);
  const [finished, setFinished] = useState(false);

  // Lifelines state
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [aiClueActive, setAiClueActive] = useState(false);
  const [realLifeActive, setRealLifeActive] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);

  const currentQ = mission.challenges[Math.min(step, mission.challenges.length - 1)];

  const handleFiftyFifty = () => {
    if (eliminatedOptions.length > 0) return;
    const wrong = currentQ.options.filter((o) => o !== currentQ.correct);
    const twoWrong = wrong.slice(0, 2);
    setEliminatedOptions(twoWrong);
    onUseLifeline('fiftyFifty');
  };

  const handleAiClue = () => {
    setAiClueActive(true);
    onUseLifeline('aiClue');
  };

  const handleRealLife = () => {
    setRealLifeActive(true);
    onUseLifeline('realLife');
  };

  const handleShield = () => {
    setShieldActive(true);
    onUseLifeline('secondChance');
  };

  const check = () => {
    if (!answer) {
      setFeedback('Choose an answer to keep going.');
      return;
    }
    if (answer === currentQ.correct) {
      setFeedback('That’s it. You reasoned it out!');
    } else {
      if (shieldActive) {
        setFeedback('🛡️ Shield protected you! That was not quite right, try another option.');
        setShieldActive(false);
      } else {
        setFeedback('Not quite yet. Try another answer, or open Nova AI explainer.');
      }
    }
  };

  const advance = () => {
    setAnswer('');
    setHint(false);
    setFeedback('');
    setEliminatedOptions([]);
    setAiClueActive(false);
    setRealLifeActive(false);
    setShieldActive(false);

    if (step < mission.challenges.length - 1) {
      setStep(step + 1);
    } else {
      setFinished(true);
      onComplete();
    }
  };

  if (finished) {
    return (
      <div className="mission-finish page-enter">
        <button className="back-link" onClick={() => go('/missions')}>
          <ArrowLeft size={16} /> Back to missions
        </button>
        <div className="finish-badge">
          <Trophy size={38} />
          <span>NEW BADGE</span>
        </div>
        <div className="eyebrow">MISSION ACCOMPLISHED!</div>
        <h1>
          Curious Hero,<br />you solved it.
        </h1>
        <p>
          You mastered {mission.title} using reasoning and discovery.
        </p>
        <div className="reward-row">
          <div>
            <Zap size={18} />
            <b>+{mission.xpReward} XP</b>
          </div>
          <div>
            <Award size={18} />
            <b>{mission.badgeReward}</b>
          </div>
        </div>
        <button className="button button-dark" onClick={() => go('/missions')}>
          Back to missions <ArrowRight size={17} />
        </button>
      </div>
    );
  }

  return (
    <div className="page-enter mission-play">
      <button className="back-link" onClick={() => go('/missions')}>
        <ArrowLeft size={16} /> Leave mission
      </button>

      <div className="play-top">
        <div>
          <div className="eyebrow">
            {mission.title.toUpperCase()} · CHALLENGE {step + 1} OF {mission.challenges.length}
          </div>
          <h1>{mission.theme}</h1>
        </div>
        <div className="play-progress">
          {mission.challenges.map((_, i) => (
            <span className={i <= step ? 'on' : ''} key={i} />
          ))}
        </div>
      </div>

      {/* Lifelines bar */}
      <div className="mb-4">
        <LifelinesBar
          inventory={data.lifelines}
          onUseFiftyFifty={handleFiftyFifty}
          onUseAIClue={handleAiClue}
          onUseRealLife={handleRealLife}
          onUseSecondChance={handleShield}
          fiftyFiftyUsed={eliminatedOptions.length > 0}
          aiClueUsed={aiClueActive}
          realLifeUsed={realLifeActive}
          secondChanceUsed={shieldActive}
        />
      </div>

      <div className="mission-play-grid">
        {/* Story & Context panel */}
        <div className="story-panel">
          <div className="story-sky">
            <div className="story-moon">{mission.subject === 'Math' ? '½' : '⚛'}</div>
            <span className="story-star ss1">✦</span>
            <span className="story-star ss2">✧</span>
            <span className="story-star ss3">✦</span>
            <div className="space-caption">
              A SMALL PROBLEM<br />IN A VERY BIG PLACE
            </div>
          </div>
          <div className="story-text">
            <span className="story-label">THE MISSION CONTEXT</span>
            <p>{currentQ.realLifeScenario}</p>

            <div className="concept-tag">
              <span>Mission Focus</span>
              <b>{mission.subject} Discovery</b>
            </div>
          </div>
        </div>

        {/* Challenge panel */}
        <div className="challenge-panel">
          <div className="challenge-top">
            <span className="challenge-number">0{step + 1}</span>
            <span>YOUR CHALLENGE</span>
          </div>
          <h2>{currentQ.prompt}</h2>

          <div className="answer-options">
            {currentQ.options.map((option, i) => {
              const isEliminated = eliminatedOptions.includes(option);
              return (
                <button
                  key={option}
                  disabled={isEliminated}
                  className={`answer-option ${
                    isEliminated ? 'opacity-30 line-through cursor-not-allowed' : ''
                  } ${answer === option ? 'chosen' : ''} ${
                    feedback.includes('reasoned') && answer === option ? 'correct' : ''
                  }`}
                  onClick={() => {
                    setAnswer(option);
                    setFeedback('');
                  }}
                >
                  <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                  <span>{option}</span>
                  {answer === option && <Check size={17} />}
                </button>
              );
            })}
          </div>

          {/* AI Clue Lifeline Result */}
          {aiClueActive && (
            <div className="hint-box bg-[#FFF9E8] border border-[#F4E1A6] text-[#7A6223]">
              <Lightbulb size={18} />
              <div>
                <b>Nova AI Clue:</b>
                <p>{currentQ.teach}</p>
              </div>
            </div>
          )}

          {/* Real Life Lifeline Result */}
          {realLifeActive && (
            <div className="hint-box bg-[#F0F7F4] border border-[#CFE7DC] text-[#2E6B4F]">
              <Compass size={18} />
              <div>
                <b>Everyday Real-Life Picture:</b>
                <p>{currentQ.realLifeScenario}</p>
              </div>
            </div>
          )}

          {/* Regular hint */}
          {hint && !aiClueActive && (
            <div className="hint-box">
              <Lightbulb size={18} />
              <div>
                <b>A little breakdown</b>
                <p>{currentQ.teach}</p>
              </div>
            </div>
          )}

          {feedback && (
            <div
              className={`answer-feedback ${
                feedback.includes('reasoned') ? 'success' : ''
              }`}
            >
              {feedback}
            </div>
          )}

          {/* Button actions */}
          <div className="challenge-actions">
            <button className="hint-action" onClick={() => setHint(!hint)}>
              <CircleHelp size={16} />
              {hint ? 'Hide hint' : 'I need a hint'}
            </button>

            {feedback.includes('reasoned') ? (
              <button className="button button-dark" onClick={advance}>
                {step === mission.challenges.length - 1 ? 'Finish mission' : 'Next challenge'}
                <ArrowRight size={16} />
              </button>
            ) : (
              <div className="flex gap-2">
                {feedback && !feedback.includes('reasoned') && answer && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenAiExplainer(
                        currentQ.prompt,
                        answer,
                        currentQ.correct,
                        currentQ.teach,
                        {
                          studentAnswer: answer,
                          misconception: currentQ.misconceptionAlert,
                          whyWrong: currentQ.teach,
                          keyRule: 'Carefully compare all options!',
                        },
                        {
                          headline: 'Mission Real-World Scenario',
                          scenario: currentQ.realLifeScenario,
                          takeaway: currentQ.teach,
                        },
                        mission.subject
                      )
                    }
                    className="button bg-[#F4CF55] text-[#202842] hover:bg-[#FFDC68]"
                  >
                    <Bot size={15} /> Explain with AI
                  </button>
                )}
                <button className="button button-dark" onClick={check}>
                  Check answer <Check size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="no-rush">
            <ShieldCheck size={14} /> Lifelines available. Take all the time you need.
          </div>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// GAMES VIEW
// --------------------------------------------------------------------------
const gameList = [
  {
    name: 'Math Dash',
    sub: 'Quick-fire number patterns',
    category: 'MATH',
    time: '2 min',
    theme: 'game-dash',
    symbol: '÷',
    instruction: 'Which number completes the pattern: 4, 8, 12, __?',
    choices: ['14', '16', '18'],
    correct: '16',
    explainer: 'The pattern adds 4 each time: 4, 8, 12, then 16.',
  },
  {
    name: 'Memory Match',
    sub: 'Find pairs that belong together',
    category: 'MEMORY',
    time: '2 min',
    theme: 'game-memory',
    symbol: '◒',
    instruction: 'Which fraction is the same as one half?',
    choices: ['2/4', '1/3', '3/4'],
    correct: '2/4',
    explainer: 'Two out of four equal pieces cover exactly half of the whole.',
  },
  {
    name: 'Robot Logic',
    sub: 'Think ahead, step by step',
    category: 'LOGIC',
    time: '3 min',
    theme: 'game-robot',
    symbol: '□',
    instruction: 'A robot moves 2 spaces forward, then turns right. What does it do next?',
    choices: ['Turns left', 'Moves forward in a new direction', 'Moves backward'],
    correct: 'Moves forward in a new direction',
    explainer:
      'After turning right, the robot faces a new direction. Its next forward move follows that direction.',
  },
  {
    name: 'Matter Shifter',
    sub: 'Identify physical phase changes',
    category: 'SCIENCE',
    time: '2 min',
    theme: 'game-words',
    symbol: '⚛',
    instruction: 'What happens when liquid water reaches 100°C (212°F)?',
    choices: ['It freezes solid', 'It boils into steam (gas)', 'It turns into iron'],
    correct: 'It boils into steam (gas)',
    explainer: 'At 100°C, liquid water reaches its boiling point and turns into water vapor.',
  },
];

function Games({
  data,
  finish,
}: {
  data: AppData;
  finish: (n: string, x: number) => void;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(false);
  const game = gameList.find((g) => g.name === active);
  const close = () => {
    setActive(null);
    setAnswer('');
    setResult(false);
  };

  return (
    <div className="page-enter">
      {!game ? (
        <>
          <PageTitle
            eyebrow="PLAY WITH A PURPOSE"
            title="Brain games."
            description="Short, satisfying challenges that give your thinking a workout."
          />
          <div className="game-grid">
            {gameList.map((g, i) => (
              <button
                key={g.name}
                className={`game-card ${g.theme}`}
                onClick={() => setActive(g.name)}
              >
                <div className="game-art">
                  <span className="game-symbol">{g.symbol}</span>
                  <span className="game-level">0{i + 1}</span>
                  <span className="game-decoration dec-one" />
                  <span className="game-decoration dec-two" />
                </div>
                <div className="game-card-body">
                  <div className="game-meta">
                    <span>{g.category}</span>
                    <span>{g.time}</span>
                  </div>
                  <h3>{g.name}</h3>
                  <p>{g.sub}</p>
                  <div className="game-start">
                    <span>
                      {data.games[g.name]
                        ? `Played ${data.games[g.name]} ${
                            data.games[g.name] === 1 ? 'time' : 'times'
                          }`
                        : 'Ready to play'}
                    </span>
                    <span>
                      <Play size={14} fill="currentColor" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="game-footer">
            <Gamepad2 size={19} />
            <p>Every game has a real idea hiding inside. Play, notice, learn.</p>
          </div>
        </>
      ) : (
        <div className="game-play-card">
          <button className="back-link" onClick={close}>
            <ArrowLeft size={16} /> All games
          </button>
          <div className={`game-play-head ${game.theme}`}>
            <span className="game-play-symbol">{game.symbol}</span>
            <div>
              <div className="eyebrow">{game.category} · QUICK ROUND</div>
              <h1>{game.name}</h1>
            </div>
          </div>
          <div className="game-question">
            <span className="eyebrow">YOUR CHALLENGE</span>
            <h2>{game.instruction}</h2>
            <div className="game-answers">
              {game.choices.map((c, i) => (
                <button
                  key={c}
                  className={`answer-option ${answer === c ? 'chosen' : ''} ${
                    result && answer === game.correct ? 'correct' : ''
                  }`}
                  onClick={() => {
                    setAnswer(c);
                    setResult(false);
                  }}
                >
                  <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                  {c}
                </button>
              ))}
            </div>
            {result && (
              <div
                className={`hint-box ${
                  answer === game.correct ? 'game-right' : 'game-wrong'
                }`}
              >
                <CheckCircle2 size={18} />
                <div>
                  <b>{answer === game.correct ? 'You got it!' : 'Good try — here’s the idea'}</b>
                  <p>{game.explainer}</p>
                </div>
              </div>
            )}
            <button
              className="button button-dark"
              disabled={!answer}
              onClick={() => {
                if (!result) {
                  setResult(true);
                  if (answer === game.correct) finish(game.name, 15);
                } else close();
              }}
            >
              {result ? 'Play another' : 'Check my thinking'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------------------------
// PRACTICE VIEW (With Math & Science Subjects, Lifelines & Interactive AI Explainer)
// --------------------------------------------------------------------------
function Practice({
  data,
  onUseLifeline,
  onDone,
  onOpenAiMistakeModal,
  onSelectGrade,
}: {
  data: AppData;
  onUseLifeline: (type: keyof LifelineInventory) => void;
  onDone: (n: number) => void;
  onOpenAiMistakeModal: (
    q: PracticeQuestion,
    answer: string,
    onRetry: () => void
  ) => void;
  onSelectGrade?: (g: string) => void;
}) {
  const [, navigate] = useLocation();
  const [selectedGrade, setSelectedGrade] = useState<string>(data.profile.grade || 'Grade 5');
  const [subjectFilter, setSubjectFilter] = useState<'All' | 'Math' | 'Science' | 'Nature' | 'Engineering'>('All');
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState(false);
  const [right, setRight] = useState(0);
  const [finished, setFinished] = useState(false);

  // Lifelines
  const [eliminated, setEliminated] = useState<string[]>([]);
  const [aiClueActive, setAiClueActive] = useState(false);
  const [realLifeActive, setRealLifeActive] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);

  useEffect(() => {
    if (data.profile.grade && data.profile.grade !== selectedGrade) {
      setSelectedGrade(data.profile.grade);
      setIndex(0);
      resetQuestionState();
    }
  }, [data.profile.grade]);

  const handleGradeChange = (newGrade: string) => {
    setSelectedGrade(newGrade);
    onSelectGrade?.(newGrade);
    setIndex(0);
    resetQuestionState();
  };

  const filteredQuestions = useMemo(() => {
    const gradeSpecific = fullGradeQuestions.filter(
      (item) => item.grade === selectedGrade || item.gradeLevel === selectedGrade
    );
    const pool = gradeSpecific.length > 0
      ? gradeSpecific
      : allPracticeQuestions.filter((item) => gradeMatchesSelection(selectedGrade, item.gradeLevel || item.grade));

    if (subjectFilter === 'All') return pool;
    return pool.filter((item) => item.subject === subjectFilter);
  }, [selectedGrade, subjectFilter]);

  const q = filteredQuestions[Math.min(index, filteredQuestions.length - 1)] ?? null;

  const handleFiftyFifty = () => {
    if (!q || eliminated.length > 0) return;
    const wrong = q.choices.filter((c) => c !== q.answer);
    setEliminated(wrong.slice(0, 2));
    onUseLifeline('fiftyFifty');
  };

  const handleAiClue = () => {
    if (!q) return;
    setAiClueActive(true);
    onUseLifeline('aiClue');
  };

  const handleRealLife = () => {
    if (!q) return;
    setRealLifeActive(true);
    onUseLifeline('realLife');
  };

  const handleShield = () => {
    if (!q) return;
    setShieldActive(true);
    onUseLifeline('secondChance');
  };

  const resetQuestionState = () => {
    setAnswer('');
    setChecked(false);
    setEliminated([]);
    setAiClueActive(false);
    setRealLifeActive(false);
    setShieldActive(false);
  };

  const next = () => {
    if (!q) return;
    const isCorrect = answer === q.answer;
    const total = right + (isCorrect ? 1 : 0);

    if (index === filteredQuestions.length - 1) {
      setRight(total);
      setFinished(true);
      onDone(filteredQuestions.length);
    } else {
      setRight(total);
      setIndex(index + 1);
      resetQuestionState();
    }
  };

  if (!filteredQuestions.length) {
    return (
      <div className="page-enter">
        <div className="empty-card" style={{ maxWidth: 540, margin: '2rem auto' }}>
          <Search size={25} />
          <h3>No practice questions for this grade yet.</h3>
          <p>
            {data.profile.grade} does not have questions in the current subject filter. Try a different subject or reset the filter.
          </p>
          <button
            className="button button-dark"
            onClick={() => {
              setSubjectFilter('All');
              setIndex(0);
              resetQuestionState();
            }}
          >
            Show all practice topics
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="practice-finish page-enter">
        <div className="finish-badge practice-badge">
          <CheckCircle2 size={38} />
        </div>
        <div className="eyebrow">PRACTICE, NOT PRESSURE</div>
        <h1>
          You showed up.<br />That’s the win.
        </h1>
        <p>
          You answered {right} out of {filteredQuestions.length} questions correctly.
          Every question you try strengthens your knowledge!
        </p>
        <div className="practice-score">
          <span>QUESTIONS ANSWERED</span>
          <b>{data.activity.questionsAnswered + filteredQuestions.length}</b>
        </div>
        <button
          className="button button-dark"
          onClick={() => {
            setIndex(0);
            setRight(0);
            setFinished(false);
            resetQuestionState();
          }}
        >
          Try another round <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <button className="back-link" onClick={() => navigate('/')}>
        <ArrowLeft size={16} /> Back home
      </button>

      {/* Grade Syllabus Selector Ribbon */}
      <div className="mb-5 p-4 rounded-2xl bg-white border border-[#E7E2D5] shadow-xs">
        <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7B8394] block">
              CLASS SYLLABUS SELECTOR · GRADES 1 TO 10
            </span>
            <h3 className="text-sm font-bold text-[#27314D] flex items-center gap-2">
              <span>Practicing for <span className="text-[#3252A2] font-black underline decoration-2">{selectedGrade}</span></span>
              {gradesList.find((g) => g.id === selectedGrade) && (
                <span className="font-normal text-xs text-[#6F7788]">
                  ({gradesList.find((g) => g.id === selectedGrade)?.ageRange} · {gradesList.find((g) => g.id === selectedGrade)?.badge})
                </span>
              )}
            </h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#EEF2FB] text-[#22449E] font-bold">
            {filteredQuestions.length} Questions Available
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {gradesList.map((g) => {
            const isSelected = selectedGrade === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => handleGradeChange(g.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#27314D] text-white shadow-sm ring-2 ring-[#27314D]/20 scale-102'
                    : 'bg-[#F7F5EE] text-[#555E70] hover:bg-[#EFECE2] hover:text-[#27314D]'
                }`}
              >
                <span>{g.badge.split(' ')[0]}</span>
                <span>{g.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject Filter Switcher */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="filter-row mb-0">
          {(['All', 'Math', 'Science', 'Nature', 'Engineering'] as const).map((s) => (
            <button
              key={s}
              className={`filter-chip ${subjectFilter === s ? 'selected' : ''}`}
              onClick={() => {
                setSubjectFilter(s);
                setIndex(0);
                resetQuestionState();
              }}
            >
              {s === 'All' ? '🌟 All Subjects' : s === 'Math' ? '📐 Mathematics' : s === 'Science' ? '🔬 Science' : s === 'Nature' ? '🌿 Nature' : '🛠️ Engineering'}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#7F8694] font-semibold">
          Question {Math.min(index + 1, filteredQuestions.length)} of {filteredQuestions.length}
        </span>
      </div>

      <div className="practice-wrap">
        <div className="practice-progress">
          {filteredQuestions.map((_, i) => (
            <span
              key={i}
              className={i < index ? 'done' : i === index ? 'current' : ''}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#EBF0FC] text-[#22449E] text-[11px] font-bold">
            🎓 {selectedGrade}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#F4F1EA] text-[#4E5668] text-[11px] font-bold">
            {q.subject === 'Math' ? '📐 Mathematics' : q.subject === 'Science' ? '🔬 Science' : q.subject}
          </span>
          {q.chapter && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFF5DC] text-[#7E5E0F] text-[11px] font-bold">
              📖 {q.chapter}
            </span>
          )}
        </div>

        <div className="eyebrow">
          TOPIC: {q.topic.toUpperCase()}
        </div>
        <h1>Let’s see what<br />you’ve noticed.</h1>

        {/* Lifelines Bar */}
        <div className="mb-4">
          <LifelinesBar
            inventory={data.lifelines}
            onUseFiftyFifty={handleFiftyFifty}
            onUseAIClue={handleAiClue}
            onUseRealLife={handleRealLife}
            onUseSecondChance={handleShield}
            disabled={checked}
            fiftyFiftyUsed={eliminated.length > 0}
            aiClueUsed={aiClueActive}
            realLifeUsed={realLifeActive}
            secondChanceUsed={shieldActive}
          />
        </div>

        <div className="practice-question">
          <span className="question-mark">?</span>
          <h2>{q.q}</h2>

          <div className="answer-options">
            {q.choices.map((c, i) => {
              const isEliminated = eliminated.includes(c);
              return (
                <button
                  key={c}
                  disabled={isEliminated}
                  className={`answer-option ${
                    isEliminated ? 'opacity-30 line-through cursor-not-allowed' : ''
                  } ${answer === c ? 'chosen' : ''} ${
                    checked && answer === q.answer && answer === c ? 'correct' : ''
                  }`}
                  onClick={() => {
                    setAnswer(c);
                    setChecked(false);
                  }}
                >
                  <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                  <span>{c}</span>
                </button>
              );
            })}
          </div>

          {/* AI Clue Lifeline Display */}
          {aiClueActive && (
            <div className="hint-box bg-[#FFF9E8] border border-[#F4E1A6] text-[#7A6223] mb-3">
              <Lightbulb size={18} />
              <div>
                <b>AI Clue:</b>
                <p>{q.clueHint}</p>
              </div>
            </div>
          )}

          {/* Real Life Lifeline Display */}
          {realLifeActive && (
            <div className="hint-box bg-[#F0F7F4] border border-[#CFE7DC] text-[#2E6B4F] mb-3">
              <Compass size={18} />
              <div>
                <b>Real-World Analogy:</b>
                <p>{q.realLifeExample.scenario}</p>
              </div>
            </div>
          )}

          {/* Checked feedback */}
          {checked && (
            <div
              className={`hint-box ${
                answer === q.answer ? 'game-right' : 'game-wrong'
              }`}
            >
              <Lightbulb size={17} />
              <div>
                <b>{answer === q.answer ? 'Exactly right!' : 'Here’s the thinking.'}</b>
                <p>{q.why}</p>
              </div>
            </div>
          )}

          {/* AI Explain Mistake Trigger button */}
          {checked && answer !== q.answer && (
            <div className="p-3 my-3 rounded-xl bg-gradient-to-r from-[#202842] to-[#2E3A5E] text-white flex items-center justify-between gap-3 animate-fade-in shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#F4CF55] text-[#202842]">
                  <Bot size={18} />
                </div>
                <div className="text-xs">
                  <b className="block text-[#F4CF55]">Curious why "{answer}" was mistaken?</b>
                  <span className="text-[11px] text-[#C2C9D8]">
                    Nova AI breaks down the trap and gives you a 3-step ladder!
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onOpenAiMistakeModal(q, answer, () => {
                    setChecked(false);
                    setAnswer('');
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-[#F4CF55] text-[#202842] text-xs font-bold hover:bg-[#FFDC68] transition whitespace-nowrap active:scale-95"
              >
                Explain with AI ✨
              </button>
            </div>
          )}

          <button
            className="button button-dark practice-submit mt-3"
            disabled={!answer}
            onClick={() => (checked ? next() : setChecked(true))}
          >
            {checked
              ? index === filteredQuestions.length - 1
                ? 'Finish practice'
                : 'Next question'
              : 'Check answer'}
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="practice-reassure">
          <ShieldCheck size={15} /> This is just for you. Every try teaches you something.
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// CREATE VIEW
// --------------------------------------------------------------------------
function Create({
  data,
  onSave,
}: {
  data: AppData;
  onSave: (c: Creation) => void;
}) {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('Explanation');
  const [notice, setNotice] = useState('');

  const save = () => {
    if (!title.trim() || !content.trim()) {
      setNotice('Add a title and a few words to save your idea.');
      return;
    }
    onSave({
      id: Date.now().toString(),
      title: title.trim(),
      topic: topic.trim() || 'My ideas',
      subject: 'Math & Science',
      content: content.trim(),
      type,
      createdAt: 'Just now',
    });
    setTitle('');
    setTopic('');
    setContent('');
    setNotice('');
  };

  return (
    <div className="page-enter">
      <PageTitle
        eyebrow="YOUR IDEAS, YOUR WORDS"
        title="Make it make sense."
        description="Explain something you learned in Math or Science, or invent a story around it."
      />
      <div className="create-layout">
        <section className="create-form-card">
          <div className="create-card-top">
            <span className="create-mark">
              <PenLine size={20} />
            </span>
            <div>
              <b>A fresh page</b>
              <small>Start with what you know. Let curiosity take it from there.</small>
            </div>
          </div>

          <label className="field-label">What are you making?</label>
          <div className="type-select">
            {['Explanation', 'Story'].map((t) => (
              <button
                key={t}
                className={type === t ? 'chosen' : ''}
                onClick={() => setType(t)}
              >
                {t === 'Story' ? <Sparkles size={15} /> : <Lightbulb size={15} />}{' '}
                {t}
              </button>
            ))}
          </div>

          <label className="field-label" htmlFor="create-title">
            Give it a title
          </label>
          <input
            id="create-title"
            data-testid="input-create-title"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              type === 'Story'
                ? 'The little moon who got lost'
                : 'Why ice melts into water'
            }
          />

          <label className="field-label" htmlFor="create-topic">
            A topic (optional)
          </label>
          <input
            id="create-topic"
            className="form-input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Fractions, States of Matter, Solar System..."
          />

          <label className="field-label" htmlFor="create-content">
            Put your idea into words
          </label>
          <textarea
            id="create-content"
            className="form-input create-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              type === 'Story'
                ? 'Once upon a time, beyond the clouds…'
                : 'I learned that thermal energy makes molecules move faster...'
            }
            rows={7}
          />

          <div className="create-submit-row">
            <span>
              <LockKeyhole size={13} /> Saved just on this device
            </span>
            <button className="button button-dark" onClick={save}>
              <Plus size={16} /> Save my idea
            </button>
          </div>
          {notice && <div className="form-notice">{notice}</div>}
        </section>

        <aside className="saved-ideas">
          <div className="saved-head">
            <div>
              <div className="eyebrow">THE THINGS YOU'VE MADE</div>
              <h2>Your idea shelf</h2>
            </div>
            <span>{data.creations.length}</span>
          </div>
          {data.creations.length === 0 ? (
            <div className="empty-shelf">
              <PenLine size={20} />
              <b>Your shelf is waiting.</b>
              <p>Save a thought and it’ll live here.</p>
            </div>
          ) : (
            data.creations.map((c) => (
              <article key={c.id} className="saved-idea">
                <div className="saved-type">
                  {c.type === 'Story' ? <Sparkles size={13} /> : <Lightbulb size={13} />}{' '}
                  {c.type} <span>· {c.topic}</span>
                </div>
                <h3>{c.title}</h3>
                <p>{c.content}</p>
                <small>{c.createdAt}</small>
              </article>
            ))
          )}
        </aside>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// ACHIEVEMENTS VIEW
// --------------------------------------------------------------------------
const badgeInfo = [
  { name: 'Curious starter', desc: 'You began your learning adventure.', icon: Sparkles },
  { name: 'Four-day spark', desc: 'Showed up to learn four days in a row.', icon: Flame },
  { name: 'Fraction explorer', desc: 'Completed the Fraction Galaxy math mission.', icon: Target },
  { name: 'Matter Alchemist', desc: 'Rescued the Science Cosmic Matter Lab.', icon: Zap },
  { name: 'Idea maker', desc: 'Saved your first explanation or story.', icon: PenLine },
  { name: 'Bright streak', desc: 'Reach a seven-day learning streak.', icon: Flame },
  { name: 'Trail finder', desc: 'Explore ten different lessons.', icon: Compass },
];

function Achievements({ data }: { data: AppData }) {
  const earnedNames = new Set(data.badges);

  return (
    <div className="page-enter">
      <PageTitle
        eyebrow="NOTICE HOW FAR YOU'VE COME"
        title="Your bright spots."
        description="Every badge is a little reminder of what you can do."
      />
      <div className="achievement-summary">
        <div className="achievement-medal">
          <Trophy size={27} />
        </div>
        <div>
          <b>{data.badges.length} bright spots so far</b>
          <span>There’s always another Math or Science discovery ahead.</span>
        </div>
        <div className="achievement-counter">
          <strong>{data.badges.length}</strong>
          <small>OF {badgeInfo.length}</small>
        </div>
      </div>

      <div className="badge-grid">
        {badgeInfo.map((b, i) => {
          const unlocked = earnedNames.has(b.name);
          const Icon = b.icon;
          return (
            <div
              key={b.name}
              className={`badge-card ${unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="badge-art">
                <span className="badge-number">0{i + 1}</span>
                <Icon size={25} />
                {!unlocked && (
                  <span className="badge-lock">
                    <LockKeyhole size={14} />
                  </span>
                )}
              </div>
              <div className="badge-content">
                <span
                  className={`badge-state ${
                    unlocked ? 'state-earned' : 'state-locked'
                  }`}
                >
                  {unlocked ? (
                    <>
                      <Check size={12} /> EARNED
                    </>
                  ) : (
                    'STILL AHEAD'
                  )}
                </span>
                <h3>{b.name}</h3>
                <p>{b.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="progress-nudge">
        <div className="nudge-icon">
          <ArrowDownRight size={21} />
        </div>
        <div>
          <b>Progress is more than a badge.</b>
          <p>
            Every mistake you decode with Nova AI and every day-to-day strike you maintain counts as real growth.
          </p>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// PROFILE VIEW (With Avatar Studio Embed & Day Strike Info)
// --------------------------------------------------------------------------
function ProfilePage({
  data,
  save,
  onOpenCustomizer,
}: {
  data: AppData;
  save: (p: Profile) => void;
  onOpenCustomizer: () => void;
}) {
  const [draft, setDraft] = useState<Profile>(data.profile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(data.profile);
  }, [data.profile]);

  const interests = [
    'Mathematics',
    'Science',
    'Space',
    'Robotics',
    'Animals',
    'Drawing',
    'Puzzles',
    'Nature',
  ];

  const toggle = (interest: string) =>
    setDraft((p) => ({
      ...p,
      interests: p.interests.includes(interest)
        ? p.interests.filter((i) => i !== interest)
        : [...p.interests, interest],
    }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim()) return;
    save({ ...draft, name: draft.name.trim(), age: Number(draft.age) });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page-enter">
      <PageTitle
        eyebrow="THIS SPACE IS YOURS"
        title="A little about you."
        description="Make your learning space feel like yours. Customize your avatar and update your interests anytime."
      />

      <form className="profile-layout" onSubmit={submit}>
        <section className="profile-card">
          {/* Large Preview Header */}
          <div className="profile-preview flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onOpenCustomizer}
                className="hover:scale-105 transition rounded-2xl p-1 bg-white/10"
                title="Open Avatar Studio"
              >
                <AvatarRenderer config={draft.avatarConfig} size={70} />
              </button>
              <div>
                <span className="eyebrow">YOUR LEARNER CARD</span>
                <h2>{draft.name || 'Your name'}</h2>
                <p>
                  {draft.grade} · Level {data.profile.level} Explorer
                </p>
                <button
                  type="button"
                  onClick={onOpenCustomizer}
                  className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-[#F4CF55] text-[#202842] text-[10px] font-bold hover:bg-[#FFDC68] transition"
                >
                  <Palette size={12} /> Open Avatar Studio
                </button>
              </div>
            </div>
            <span className="preview-star">
              <Star size={20} fill="currentColor" />
            </span>
          </div>

          <div className="profile-fields">
            <label className="field-label" htmlFor="profile-name">
              What should we call you?
            </label>
            <input
              id="profile-name"
              className="form-input"
              value={draft.name}
              maxLength={24}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />

            <div className="two-fields">
              <div>
                <label className="field-label" htmlFor="profile-age">
                  Your age
                </label>
                <select
                  id="profile-age"
                  className="form-input"
                  value={draft.age}
                  onChange={(e) => setDraft({ ...draft, age: Number(e.target.value) })}
                >
                  {Array.from({ length: 13 }, (_, i) => i + 5).map((age) => (
                    <option key={age} value={age}>
                      {age} years old
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label" htmlFor="profile-grade">
                  Your grade
                </label>
                <select
                  id="profile-grade"
                  className="form-input"
                  value={draft.grade}
                  onChange={(e) => setDraft({ ...draft, grade: e.target.value })}
                >
                  {[
                    'Grade K',
                    'Grade 1',
                    'Grade 2',
                    'Grade 3',
                    'Grade 4',
                    'Grade 5',
                    'Grade 6',
                    'Grade 7',
                    'Grade 8',
                    'Grade 9',
                    'Grade 10',
                    'Grade 11',
                    'Grade 12',
                  ].map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Avatar Archetype Picker */}
            <div className="flex items-center justify-between mt-4 mb-2">
              <span className="field-label my-0">Customizable Avatar</span>
              <button
                type="button"
                onClick={onOpenCustomizer}
                className="text-[11px] font-bold text-[#3B7E62] hover:underline flex items-center gap-1"
              >
                Full Avatar Studio →
              </button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-3 rounded-xl bg-[#F7F5EE] border border-[#E5E1D8]">
              {(
                [
                  'astronaut',
                  'robot',
                  'owl',
                  'fox',
                  'cat',
                  'dino',
                  'wizard',
                  'star',
                ] as const
              ).map((char) => {
                const selected = draft.avatarConfig.character === char;
                return (
                  <button
                    key={char}
                    type="button"
                    onClick={() =>
                      setDraft((p) => ({
                        ...p,
                        avatarConfig: { ...p.avatarConfig, character: char },
                      }))
                    }
                    className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                      selected
                        ? 'border-[#27314D] bg-[#27314D] text-white shadow-xs'
                        : 'border-[#E0DBCF] bg-white hover:border-[#27314D]'
                    }`}
                  >
                    <AvatarRenderer
                      config={{ ...draft.avatarConfig, character: char }}
                      size={36}
                      animate={false}
                    />
                    <span className="text-[9px] font-bold capitalize truncate max-w-full">
                      {char}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="field-label mt-4">What do you like exploring?</div>
            <div className="interest-picker">
              {interests.map((i) => (
                <button
                  type="button"
                  key={i}
                  className={`interest-chip ${
                    draft.interests.includes(i) ? 'picked' : ''
                  }`}
                  onClick={() => toggle(i)}
                >
                  {draft.interests.includes(i) && <Check size={12} />} {i}
                </button>
              ))}
            </div>

            <button className="button button-dark save-profile" type="submit">
              {saved ? (
                <>
                  <Check size={16} /> Saved!
                </>
              ) : (
                <>
                  Save my profile <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </section>

        <aside className="profile-side">
          <div className="profile-stat-card">
            <div className="eyebrow">YOUR LEARNING SO FAR</div>
            <div className="profile-level-circle">
              <span>LEVEL</span>
              <b>{data.profile.level}</b>
            </div>
            <h3>{data.profile.xp} XP</h3>
            <p>Every bit of progress is yours to keep.</p>
            <div className="progress-line">
              <span style={{ width: `${data.profile.xp % 100}%` }} />
            </div>
            <div className="profile-next">
              {100 - (data.profile.xp % 100)} XP to level {data.profile.level + 1}
            </div>
          </div>

          <div className="privacy-card">
            <LockKeyhole size={17} />
            <div>
              <b>Just your device.</b>
              <p>
                Your customized avatar and learning strikes live right in your browser.
              </p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

function NotFound({ go }: { go: (p: string) => void }) {
  return (
    <div className="not-found">
      <div className="eyebrow">WRONG TURN? ALL PART OF THE ADVENTURE.</div>
      <h1>
        Nothing here<br />for now.
      </h1>
      <p>That page isn’t on this trail.</p>
      <button className="button button-dark" onClick={() => go('/')}>
        Head back home <ArrowRight size={16} />
      </button>
    </div>
  );
}

export default App;
