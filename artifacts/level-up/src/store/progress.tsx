import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { AvatarConfig, Grade, Lifelines, Note, ProfileData, SavedState } from '../types';
import { isGrade } from '../data/grades';
import { defaultAvatarConfig } from '../components/avatar/AvatarRenderer';
import { localDate } from '../lib/date';
import { uid } from '../lib/random';
import { badgeRules, evaluateBadges } from './badges';
import {
  LIFELINE_MAX, XP, awardCapped, awardOnce, levelInfo, recordActivity, refreshLifelines, starsFor,
} from './rewards';

const STORAGE_KEY = 'level-up-v2';
const LEGACY_KEYS = ['level-up-progress-v1'];

function blankProfile(name: string, grade: Grade, avatarConfig: AvatarConfig): ProfileData {
  return {
    id: uid(),
    name,
    grade,
    avatarConfig,
    createdAt: new Date().toISOString(),
    xp: 0,
    streak: 0,
    bestStreak: 0,
    shields: 0,
    lastActiveDate: null,
    activeDates: [],
    goalDays: 0,
    topics: {},
    awarded: {},
    badges: {},
    daily: {},
    lifelines: { ...LIFELINE_MAX, refilledOn: localDate() },
    stats: { questionsAnswered: 0, correctAnswers: 0, gamesPlayed: 0, mistakesReviewed: 0 },
    gameBest: {},
    adventureCompleted: [],
    missionsCompleted: [],
    notes: [],
  };
}

const emptyState = (): SavedState => ({ version: 2, activeId: null, profiles: {} });

function load(): SavedState {
  try {
    LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<SavedState>;
    if (parsed.version !== 2 || !parsed.profiles) return emptyState();
    const profiles: SavedState['profiles'] = {};
    for (const [id, p] of Object.entries(parsed.profiles)) {
      const base = blankProfile(p.name ?? 'Learner', isGrade(p.grade) ? p.grade : 1, p.avatarConfig ?? defaultAvatarConfig);
      profiles[id] = { ...base, ...p, id, grade: base.grade, stats: { ...base.stats, ...p.stats }, lifelines: { ...base.lifelines, ...p.lifelines } };
    }
    const activeId = parsed.activeId && profiles[parsed.activeId] ? parsed.activeId : null;
    return { version: 2, activeId, profiles };
  } catch {
    return emptyState();
  }
}

type LifelineKind = keyof Omit<Lifelines, 'refilledOn'>;

interface ProgressApi {
  profiles: ProfileData[];
  profile: ProfileData | null;
  toast: { id: number; text: string } | null;
  dismissToast: () => void;
  notify: (text: string) => void;
  createProfile: (name: string, grade: Grade, avatar: AvatarConfig) => void;
  switchProfile: (id: string | null) => void;
  deleteProfile: (id: string) => void;
  resetProgress: () => void;
  updateProfile: (patch: Partial<Pick<ProfileData, 'name' | 'grade' | 'avatarConfig'>>) => void;
  completeVisualize: (topicId: string) => void;
  completeLearn: (topicId: string) => void;
  recordAnswer: (correct: boolean) => void;
  finishPractice: (topicId: string | null, correct: number, total: number) => number;
  consumeLifeline: (kind: LifelineKind) => boolean;
  finishGame: (gameId: string, score: number, xp: number) => void;
  completeMission: (missionId: string, xp: number, correct: number) => void;
  completeAdventure: (level: number, xp: number) => void;
  reviewMistake: () => void;
  saveNote: (note: Pick<Note, 'title' | 'text' | 'topicId'> & { id?: string }) => void;
  deleteNote: (id: string) => void;
}

const ProgressContext = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SavedState>(load);
  const ref = useRef(state);
  const [toast, setToast] = useState<ProgressApi['toast']>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full or unavailable (private mode): keep playing in memory.
    }
  }, [state]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const commit = useCallback((next: SavedState) => {
    ref.current = next;
    setState(next);
  }, []);

  const notify = useCallback((text: string) => setToast({ id: Date.now(), text }), []);

  /** Apply a change to the active profile, then evaluate badges and announce rewards. */
  const act = useCallback((fn: (p: ProfileData) => string | void) => {
    const prev = ref.current;
    const id = prev.activeId;
    if (!id) return;
    const before = prev.profiles[id];
    const p = structuredClone(before);
    refreshLifelines(p);
    const message = fn(p);
    evaluateBadges(p);
    commit({ ...prev, profiles: { ...prev.profiles, [id]: p } });

    const today = localDate();
    const parts: string[] = [];
    if (message) parts.push(message);
    const gained = p.xp - before.xp;
    if (gained > 0) parts.push(`+${gained} XP`);
    if (levelInfo(p.xp).level > levelInfo(before.xp).level) parts.push(`Level ${levelInfo(p.xp).level} reached!`);
    if (!before.daily[today]?.goalMet && p.daily[today]?.goalMet) parts.push('Daily goal done! 🎯');
    if (p.streak > before.streak && p.lastActiveDate !== before.lastActiveDate) parts.push(`🔥 ${p.streak}-day streak`);
    for (const rule of badgeRules) {
      if (p.badges[rule.id] && !before.badges[rule.id]) parts.push(`New badge: ${rule.emoji} ${rule.name}`);
    }
    if (parts.length) setToast({ id: Date.now(), text: parts.join(' · ') });
  }, [commit]);

  const topicProgress = (p: ProfileData, topicId: string) => {
    p.topics[topicId] ??= { visualized: false, learned: false, stars: 0, rounds: 0 };
    return p.topics[topicId];
  };

  const api = useMemo<ProgressApi>(() => {
    const active = state.activeId ? state.profiles[state.activeId] : null;
    const today = localDate();
    const profile = active && active.lifelines.refilledOn !== today
      ? { ...active, lifelines: { ...LIFELINE_MAX, refilledOn: today } }
      : active;

    return {
      profiles: Object.values(state.profiles).sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
      profile,
      toast,
      dismissToast: () => setToast(null),
      notify,

      createProfile: (name, grade, avatar) => {
        const p = blankProfile(name.trim() || 'Learner', grade, avatar);
        const prev = ref.current;
        commit({ ...prev, activeId: p.id, profiles: { ...prev.profiles, [p.id]: p } });
        notify(`Welcome, ${p.name}! Let's level up 🚀`);
      },
      switchProfile: (id) => commit({ ...ref.current, activeId: id }),
      deleteProfile: (id) => {
        const prev = ref.current;
        const profiles = { ...prev.profiles };
        delete profiles[id];
        commit({ ...prev, profiles, activeId: prev.activeId === id ? null : prev.activeId });
      },
      resetProgress: () => {
        const prev = ref.current;
        if (!prev.activeId) return;
        const old = prev.profiles[prev.activeId];
        const fresh = { ...blankProfile(old.name, old.grade, old.avatarConfig), id: old.id, createdAt: old.createdAt };
        commit({ ...prev, profiles: { ...prev.profiles, [old.id]: fresh } });
        notify('Progress reset. Fresh start!');
      },
      updateProfile: (patch) => act((p) => {
        Object.assign(p, patch);
        return 'Profile saved';
      }),

      completeVisualize: (topicId) => act((p) => {
        const t = topicProgress(p, topicId);
        if (t.visualized) return;
        t.visualized = true;
        awardOnce(p, `visualize:${topicId}`, XP.visualize);
        recordActivity(p);
        return 'Explored! 👀';
      }),
      completeLearn: (topicId) => act((p) => {
        const t = topicProgress(p, topicId);
        if (t.learned) return;
        t.learned = true;
        awardOnce(p, `learn:${topicId}`, XP.learn);
        recordActivity(p);
        return 'Lesson learned! 📘';
      }),
      recordAnswer: (correct) => {
        // Stats only; saved silently without a toast.
        const prev = ref.current;
        if (!prev.activeId) return;
        const p = structuredClone(prev.profiles[prev.activeId]);
        p.stats.questionsAnswered += 1;
        if (correct) p.stats.correctAnswers += 1;
        commit({ ...prev, profiles: { ...prev.profiles, [p.id]: p } });
      },
      finishPractice: (topicId, correct, total) => {
        const stars = starsFor(correct, total);
        act((p) => {
          let starXp = 0;
          if (topicId) {
            const t = topicProgress(p, topicId);
            t.rounds += 1;
            for (let s = 1; s <= stars; s++) {
              if (awardOnce(p, `star:${topicId}:${s}`, XP.star)) starXp += XP.star;
            }
            t.stars = Math.max(t.stars, stars);
          }
          if (!starXp) awardCapped(p, correct * XP.perCorrectReplay);
          recordActivity(p);
          return `${correct}/${total} correct${stars ? ` · ${'⭐'.repeat(stars)}` : ''}`;
        });
        return stars;
      },
      consumeLifeline: (kind) => {
        const current = ref.current.activeId ? ref.current.profiles[ref.current.activeId] : null;
        if (!current) return false;
        const available = current.lifelines.refilledOn === localDate() ? current.lifelines[kind] : LIFELINE_MAX[kind];
        if (available <= 0) return false;
        act((p) => {
          p.lifelines[kind] -= 1;
        });
        return true;
      },
      finishGame: (gameId, score, xp) => act((p) => {
        p.stats.gamesPlayed += 1;
        const best = p.gameBest[gameId] ?? 0;
        if (score > best) p.gameBest[gameId] = score;
        awardOnce(p, `game:${gameId}`, 15);
        awardCapped(p, xp);
        recordActivity(p);
        return score > best && best > 0 ? `New best: ${score}! 🏆` : `Score: ${score}`;
      }),
      completeMission: (missionId, xp, correct) => act((p) => {
        const first = !p.missionsCompleted.includes(missionId);
        if (first) {
          p.missionsCompleted.push(missionId);
          awardOnce(p, `mission:${missionId}`, xp);
        } else {
          awardCapped(p, correct * XP.perCorrectReplay);
        }
        recordActivity(p);
        return first ? 'Mission complete! 🎉' : 'Mission replayed';
      }),
      completeAdventure: (level, xp) => act((p) => {
        const first = !p.adventureCompleted.includes(level);
        if (first) {
          p.adventureCompleted.push(level);
          awardOnce(p, `adventure:${level}`, xp);
        }
        recordActivity(p);
        return first ? `Adventure level ${level} cleared! 🎉` : `Level ${level} replayed`;
      }),
      reviewMistake: () => act((p) => {
        p.stats.mistakesReviewed += 1;
        awardCapped(p, 5);
        return 'Mistake reviewed 🧠';
      }),
      saveNote: (note) => act((p) => {
        const now = new Date().toISOString();
        if (note.id) {
          p.notes = p.notes.map((n) => (n.id === note.id ? { ...n, ...note, id: n.id, updatedAt: now } : n));
          return 'Note updated';
        }
        p.notes = [{ id: uid(), title: note.title, text: note.text, topicId: note.topicId, createdAt: now, updatedAt: now }, ...p.notes];
        awardCapped(p, 5);
        return 'Note saved 📒';
      }),
      deleteNote: (id) => act((p) => {
        p.notes = p.notes.filter((n) => n.id !== id);
        return 'Note deleted';
      }),
    };
  }, [state, toast, act, commit, notify]);

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}

/** For pages rendered only after onboarding. */
export function useProfile() {
  const ctx = useProgress();
  if (!ctx.profile) throw new Error('No active profile');
  return { ...ctx, profile: ctx.profile };
}
