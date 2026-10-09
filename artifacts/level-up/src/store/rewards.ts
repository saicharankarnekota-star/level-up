import type { DayLog, Lifelines, ProfileData } from '../types';
import { daysBetween, localDate } from '../lib/date';

export const DAILY_GOAL = 3;
/** Max XP per day from repeatable activities (replays, games, reviews). */
export const DAILY_CAPPED_XP = 60;
export const MAX_SHIELDS = 2;
export const LIFELINE_MAX: Omit<Lifelines, 'refilledOn'> = { fiftyFifty: 2, hint: 3, shield: 1 };
export const STREAK_MILESTONES = [
  { days: 3, xp: 30 },
  { days: 7, xp: 70 },
  { days: 14, xp: 150 },
  { days: 30, xp: 300 },
];
export const XP = {
  visualize: 10,
  learn: 10,
  star: 15,
  goal: 20,
  perCorrectReplay: 2,
};

/** Total XP needed to reach a level: 0, 100, 250, 450, 700... */
export const levelThreshold = (level: number) => 25 * (level - 1) * (level + 2);

export function levelInfo(xp: number) {
  let level = 1;
  while (xp >= levelThreshold(level + 1)) level++;
  const start = levelThreshold(level);
  const next = levelThreshold(level + 1);
  return { level, into: xp - start, span: next - start, toNext: next - xp };
}

export function dayLog(p: ProfileData, date = localDate()): DayLog {
  p.daily[date] ??= { activities: 0, xp: 0, cappedXp: 0, goalMet: false };
  return p.daily[date];
}

export function gainXp(p: ProfileData, amount: number) {
  if (amount <= 0) return;
  p.xp += amount;
  dayLog(p).xp += amount;
}

/** Award XP only the first time `key` is seen. */
export function awardOnce(p: ProfileData, key: string, amount: number): boolean {
  if (p.awarded[key]) return false;
  p.awarded[key] = true;
  gainXp(p, amount);
  return true;
}

/** Award repeatable XP, limited by the daily cap. Returns XP actually given. */
export function awardCapped(p: ProfileData, amount: number): number {
  const log = dayLog(p);
  const given = Math.max(0, Math.min(amount, DAILY_CAPPED_XP - log.cappedXp));
  log.cappedXp += given;
  gainXp(p, given);
  return given;
}

/** Streak as it stands today, accounting for missed days that shields can cover. */
export function effectiveStreak(p: ProfileData, today = localDate()): number {
  if (!p.lastActiveDate) return 0;
  const gap = daysBetween(p.lastActiveDate, today);
  if (gap <= 1) return p.streak;
  return p.shields >= gap - 1 ? p.streak : 0;
}

/** Call once per learning activity: updates streak, daily goal and their rewards. */
export function recordActivity(p: ProfileData) {
  const today = localDate();
  const log = dayLog(p, today);
  log.activities += 1;

  if (p.lastActiveDate !== today) {
    if (!p.lastActiveDate) {
      p.streak = 1;
    } else {
      const gap = daysBetween(p.lastActiveDate, today);
      if (gap === 1) {
        p.streak += 1;
      } else if (gap > 1) {
        const missed = gap - 1;
        if (p.shields >= missed) {
          p.shields -= missed;
          p.streak += 1;
        } else {
          p.streak = 1;
        }
      }
    }
    p.lastActiveDate = today;
    p.activeDates = [...p.activeDates, today].slice(-90);
    p.bestStreak = Math.max(p.bestStreak, p.streak);
    for (const m of STREAK_MILESTONES) {
      if (p.streak >= m.days) awardOnce(p, `streak:${m.days}`, m.xp);
    }
  }

  if (!log.goalMet && log.activities >= DAILY_GOAL) {
    log.goalMet = true;
    awardOnce(p, `goal:${today}`, XP.goal);
    p.goalDays += 1;
    if (p.goalDays % 3 === 0 && p.shields < MAX_SHIELDS) p.shields += 1;
  }
}

export function refreshLifelines(p: ProfileData) {
  const today = localDate();
  if (p.lifelines.refilledOn !== today) p.lifelines = { ...LIFELINE_MAX, refilledOn: today };
}

export const starsFor = (correct: number, total: number) => {
  const ratio = total ? correct / total : 0;
  if (ratio >= 1) return 3;
  if (ratio >= 0.8) return 2;
  if (ratio >= 0.6) return 1;
  return 0;
};
