import type { Grade, Question, Subject, Topic } from '../../types';
import { mathTopics } from './math';
import { scienceTopics } from './science';

export const topics: Topic[] = [...mathTopics, ...scienceTopics];

export const topicById = (id: string | undefined) => topics.find((t) => t.id === id);

export const topicsFor = (grade: Grade, subject?: Subject) =>
  topics.filter((t) => t.grade === grade && (!subject || t.subject === subject));

/** n questions from a generator with no repeated prompt+picture where possible. */
export function generateSet(gen: () => Question, n: number): Question[] {
  const out: Question[] = [];
  const seen = new Set<string>();
  for (let tries = 0; out.length < n && tries < n * 15; tries++) {
    const q = gen();
    const key = `${q.prompt}|${q.picture ?? ''}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  while (out.length < n) out.push(gen());
  return out;
}
