import type { Grade } from '../types';

export const GRADES: { grade: Grade; emoji: string; ages: string; blurb: string }[] = [
  { grade: 1, emoji: '🐣', ages: '6–7', blurb: 'Counting, shapes, plants, senses' },
  { grade: 2, emoji: '🦉', ages: '7–8', blurb: 'Tens & ones, time, money, life cycles' },
  { grade: 8, emoji: '🚀', ages: '13–14', blurb: 'Forces & motion with PhET simulations' },
];

export const isGrade = (g: unknown): g is Grade => GRADES.some((x) => x.grade === g);
