export const games = [
  { id: 'math-dash', title: 'Math Dash', emoji: '⚡', subject: 'Math', description: 'Answer as many sums as you can in 60 seconds!', tone: 'bg-[#FFF3C4]' },
  { id: 'memory-match', title: 'Memory Match', emoji: '🃏', subject: 'Math & Science', description: 'Flip cards and find the matching pairs.', tone: 'bg-[#EEF3FF]' },
  { id: 'sort-it', title: 'Sort It!', emoji: '🧺', subject: 'Science', description: 'Sort living things, animals, foods and more into the right baskets.', tone: 'bg-[#DFF3E6]' },
  { id: 'number-hop', title: 'Number Line Hop', emoji: '🐸', subject: 'Math', description: 'Help the frog land on the right number.', tone: 'bg-[#FDECEC]' },
] as const;

export type GameId = (typeof games)[number]['id'];
