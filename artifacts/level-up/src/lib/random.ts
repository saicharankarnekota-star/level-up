export const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const pick = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

export function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const uid = () => Math.random().toString(36).slice(2, 10);

/** Four shuffled number choices: the answer plus nearby distractors (never negative). */
export function numberChoices(answer: number, extra: number[] = [], spread = 3): string[] {
  const set = new Set<number>([answer]);
  for (const e of extra) if (e >= 0 && set.size < 4) set.add(e);
  let tries = 0;
  while (set.size < 4 && tries++ < 50) {
    const n = answer + randInt(-spread, spread);
    if (n >= 0) set.add(n);
  }
  let n = answer + 1;
  while (set.size < 4) set.add(n++);
  return shuffle([...set].map(String));
}

/** Answer plus 3 distinct distractors from a pool, shuffled. */
export function textChoices(answer: string, pool: readonly string[]): string[] {
  const others = shuffle([...new Set(pool)].filter((p) => p !== answer)).slice(0, 3);
  return shuffle([answer, ...others]);
}
