import type { Question, VisualizerParams } from '../../types';
import { pick, textChoices, uid } from '../../lib/random';

export const makeQuestion = (topicId: string, fields: Omit<Question, 'id' | 'topicId'>): Question => ({
  id: `${topicId}-${uid()}`,
  topicId,
  ...fields,
});

export interface PoolItem {
  prompt: string;
  answer: string;
  wrong: string[];
  hint: string;
  why: string;
  picture?: string;
  mis?: Record<string, string>;
  show?: VisualizerParams;
}

/** Generator that picks a random hand-written question and shuffles its choices. */
export const fromPool = (topicId: string, pool: PoolItem[]) => () => {
  const item = pick(pool);
  return makeQuestion(topicId, {
    prompt: item.prompt,
    picture: item.picture,
    choices: textChoices(item.answer, item.wrong),
    answer: item.answer,
    hint: item.hint,
    why: item.why,
    misconceptions: item.mis,
    show: item.show,
  });
};

/** Mix several generators, picking one at random each time. */
export const mix = (...gens: (() => Question)[]) => () => pick(gens)();

export const repeatEmoji = (emoji: string, n: number) => Array.from({ length: n }, () => emoji).join('');
