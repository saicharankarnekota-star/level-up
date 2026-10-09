import type { Grade, ProfileData, Subject } from '../types';
import { topics } from '../data/topics';
import { missions } from '../data/missions';

export interface BadgeRule {
  id: string;
  name: string;
  emoji: string;
  description: string;
  progress: (p: ProfileData) => [number, number];
}

const topicsDone = (p: ProfileData) => topics.filter((t) => (p.topics[t.id]?.stars ?? 0) >= 1).length;

const setDone = (grade: Grade, subject: Subject) => (p: ProfileData): [number, number] => {
  const set = topics.filter((t) => t.grade === grade && t.subject === subject);
  return [set.filter((t) => (p.topics[t.id]?.stars ?? 0) >= 1).length, set.length];
};

export const badgeRules: BadgeRule[] = [
  {
    id: 'first-look', name: 'First Look', emoji: '👀',
    description: 'Explore your first visual model.',
    progress: (p) => [Math.min(1, topics.filter((t) => p.topics[t.id]?.visualized).length), 1],
  },
  {
    id: 'first-star', name: 'First Star', emoji: '⭐',
    description: 'Earn a star in any topic practice.',
    progress: (p) => [Math.min(1, topicsDone(p)), 1],
  },
  {
    id: 'five-topics', name: 'Trail Finder', emoji: '🧭',
    description: 'Earn stars in 5 different topics.',
    progress: (p) => [Math.min(5, topicsDone(p)), 5],
  },
  {
    id: 'triple-star', name: 'Super Star', emoji: '🌟',
    description: 'Get all 3 stars in any topic.',
    progress: (p) => [Math.min(1, Object.values(p.topics).filter((t) => t.stars === 3).length), 1],
  },
  { id: 'g1-math', name: 'Number Ninja', emoji: '🔢', description: 'Earn stars in every Grade 1 Math topic.', progress: setDone(1, 'Math') },
  { id: 'g1-science', name: 'Little Scientist', emoji: '🔬', description: 'Earn stars in every Grade 1 Science topic.', progress: setDone(1, 'Science') },
  { id: 'g2-math', name: 'Math Wizard', emoji: '🧮', description: 'Earn stars in every Grade 2 Math topic.', progress: setDone(2, 'Math') },
  { id: 'g2-science', name: 'Nature Detective', emoji: '🦋', description: 'Earn stars in every Grade 2 Science topic.', progress: setDone(2, 'Science') },
  {
    id: 'streak-3', name: 'Warm Spark', emoji: '🔥',
    description: 'Learn 3 days in a row.',
    progress: (p) => [Math.min(3, p.bestStreak), 3],
  },
  {
    id: 'streak-7', name: 'Blazing Week', emoji: '☄️',
    description: 'Learn 7 days in a row.',
    progress: (p) => [Math.min(7, p.bestStreak), 7],
  },
  {
    id: 'gamer', name: 'Game On', emoji: '🎮',
    description: 'Play 5 games.',
    progress: (p) => [Math.min(5, p.stats.gamesPlayed), 5],
  },
  {
    id: 'dash-15', name: 'Speedy Solver', emoji: '⚡',
    description: 'Score 15 or more in Math Dash.',
    progress: (p) => [Math.min(15, p.gameBest['math-dash'] ?? 0), 15],
  },
  {
    id: 'first-mission', name: 'Story Hero', emoji: '📖',
    description: 'Finish your first mission.',
    progress: (p) => [Math.min(1, p.missionsCompleted.length), 1],
  },
  {
    id: 'all-missions', name: 'Mission Master', emoji: '🏅',
    description: 'Finish every mission.',
    progress: (p) => [p.missionsCompleted.filter((id) => missions.some((m) => m.id === id)).length, missions.length],
  },
  {
    id: 'dragon', name: 'Dragon Tamer', emoji: '🐉',
    description: 'Beat the Maths Dragon in Math Adventure.',
    progress: (p) => [p.adventureCompleted.includes(5) ? 1 : 0, 1],
  },
  {
    id: 'tutor', name: 'Mistake Fixer', emoji: '🛠️',
    description: 'Review 3 mistakes with Nova.',
    progress: (p) => [Math.min(3, p.stats.mistakesReviewed), 3],
  },
  {
    id: 'notebook', name: 'Idea Keeper', emoji: '📒',
    description: 'Write 3 notes in your notebook.',
    progress: (p) => [Math.min(3, p.notes.length), 3],
  },
];

export function evaluateBadges(p: ProfileData) {
  for (const rule of badgeRules) {
    if (p.badges[rule.id]) continue;
    const [have, need] = rule.progress(p);
    if (need > 0 && have >= need) p.badges[rule.id] = new Date().toISOString();
  }
}
