import type { Grade } from '../types';

export interface SortItem {
  emoji: string;
  name: string;
  bin: string;
}

export interface SortSet {
  id: string;
  grade: Grade;
  title: string;
  question: string;
  bins: { id: string; label: string; emoji: string }[];
  items: SortItem[];
}

export const sortSets: Record<string, SortSet> = {
  living: {
    id: 'living',
    grade: 1,
    title: 'Living or Non-living?',
    question: 'Does it grow, breathe and need food?',
    bins: [
      { id: 'living', label: 'Living', emoji: '🌱' },
      { id: 'non-living', label: 'Non-living', emoji: '🪨' },
    ],
    items: [
      { emoji: '🐶', name: 'Dog', bin: 'living' },
      { emoji: '🌳', name: 'Tree', bin: 'living' },
      { emoji: '🐟', name: 'Fish', bin: 'living' },
      { emoji: '🌻', name: 'Sunflower', bin: 'living' },
      { emoji: '🐦', name: 'Bird', bin: 'living' },
      { emoji: '👧', name: 'Girl', bin: 'living' },
      { emoji: '🐛', name: 'Caterpillar', bin: 'living' },
      { emoji: '🪨', name: 'Rock', bin: 'non-living' },
      { emoji: '🚗', name: 'Car', bin: 'non-living' },
      { emoji: '🧸', name: 'Teddy bear', bin: 'non-living' },
      { emoji: '🪑', name: 'Chair', bin: 'non-living' },
      { emoji: '📱', name: 'Phone', bin: 'non-living' },
      { emoji: '⚽', name: 'Ball', bin: 'non-living' },
      { emoji: '🤖', name: 'Robot', bin: 'non-living' },
    ],
  },
  habitats: {
    id: 'habitats',
    grade: 2,
    title: 'Animal Homes',
    question: 'Where does this animal live?',
    bins: [
      { id: 'ocean', label: 'Ocean', emoji: '🌊' },
      { id: 'desert', label: 'Desert', emoji: '🏜️' },
      { id: 'forest', label: 'Forest', emoji: '🌲' },
      { id: 'polar', label: 'Polar ice', emoji: '🧊' },
    ],
    items: [
      { emoji: '🐠', name: 'Fish', bin: 'ocean' },
      { emoji: '🐳', name: 'Whale', bin: 'ocean' },
      { emoji: '🐙', name: 'Octopus', bin: 'ocean' },
      { emoji: '🦀', name: 'Crab', bin: 'ocean' },
      { emoji: '🐪', name: 'Camel', bin: 'desert' },
      { emoji: '🦎', name: 'Lizard', bin: 'desert' },
      { emoji: '🦂', name: 'Scorpion', bin: 'desert' },
      { emoji: '🐅', name: 'Tiger', bin: 'forest' },
      { emoji: '🐻', name: 'Bear', bin: 'forest' },
      { emoji: '🦌', name: 'Deer', bin: 'forest' },
      { emoji: '🐒', name: 'Monkey', bin: 'forest' },
      { emoji: '🐻‍❄️', name: 'Polar bear', bin: 'polar' },
      { emoji: '🐧', name: 'Penguin', bin: 'polar' },
      { emoji: '🦭', name: 'Seal', bin: 'polar' },
    ],
  },
  matter: {
    id: 'matter',
    grade: 2,
    title: 'Solid, Liquid or Gas?',
    question: 'Does it keep its shape, flow, or spread out?',
    bins: [
      { id: 'solid', label: 'Solid', emoji: '🧱' },
      { id: 'liquid', label: 'Liquid', emoji: '💧' },
      { id: 'gas', label: 'Gas', emoji: '💨' },
    ],
    items: [
      { emoji: '🪨', name: 'Rock', bin: 'solid' },
      { emoji: '📕', name: 'Book', bin: 'solid' },
      { emoji: '🧊', name: 'Ice cube', bin: 'solid' },
      { emoji: '🥄', name: 'Spoon', bin: 'solid' },
      { emoji: '🧱', name: 'Brick', bin: 'solid' },
      { emoji: '💧', name: 'Water', bin: 'liquid' },
      { emoji: '🥛', name: 'Milk', bin: 'liquid' },
      { emoji: '🧃', name: 'Juice', bin: 'liquid' },
      { emoji: '🍯', name: 'Honey', bin: 'liquid' },
      { emoji: '🎈', name: 'Air in a balloon', bin: 'gas' },
      { emoji: '♨️', name: 'Steam', bin: 'gas' },
      { emoji: '💨', name: 'Wind', bin: 'gas' },
    ],
  },
  force: {
    id: 'force',
    grade: 2,
    title: 'Push or Pull?',
    question: 'Are you moving it away, or towards you?',
    bins: [
      { id: 'push', label: 'Push', emoji: '👐' },
      { id: 'pull', label: 'Pull', emoji: '🪢' },
    ],
    items: [
      { emoji: '⚽', name: 'Kicking a ball', bin: 'push' },
      { emoji: '🛒', name: 'Moving a shopping cart forward', bin: 'push' },
      { emoji: '🛝', name: 'Swinging a friend on a swing', bin: 'push' },
      { emoji: '🔘', name: 'Pressing a button', bin: 'push' },
      { emoji: '🚪', name: 'Shutting a door', bin: 'push' },
      { emoji: '🗄️', name: 'Opening a drawer', bin: 'pull' },
      { emoji: '🪢', name: 'Tug of war', bin: 'pull' },
      { emoji: '🧲', name: 'A magnet grabbing a pin', bin: 'pull' },
      { emoji: '🪣', name: 'Lifting a bucket from a well', bin: 'pull' },
      { emoji: '🧦', name: 'Putting on socks', bin: 'pull' },
    ],
  },
  food: {
    id: 'food',
    grade: 2,
    title: 'Everyday Food or Sometimes Treat?',
    question: 'Does it help your body grow strong every day?',
    bins: [
      { id: 'everyday', label: 'Everyday food', emoji: '🥦' },
      { id: 'sometimes', label: 'Sometimes treat', emoji: '🍭' },
    ],
    items: [
      { emoji: '🍎', name: 'Apple', bin: 'everyday' },
      { emoji: '🥕', name: 'Carrot', bin: 'everyday' },
      { emoji: '🍌', name: 'Banana', bin: 'everyday' },
      { emoji: '🥛', name: 'Milk', bin: 'everyday' },
      { emoji: '🥚', name: 'Egg', bin: 'everyday' },
      { emoji: '🥦', name: 'Broccoli', bin: 'everyday' },
      { emoji: '🍚', name: 'Rice', bin: 'everyday' },
      { emoji: '🍬', name: 'Candy', bin: 'sometimes' },
      { emoji: '🍟', name: 'Fries', bin: 'sometimes' },
      { emoji: '🥤', name: 'Fizzy drink', bin: 'sometimes' },
      { emoji: '🍰', name: 'Cake', bin: 'sometimes' },
      { emoji: '🍦', name: 'Ice cream', bin: 'sometimes' },
    ],
  },
};

/** Used by the Math Adventure Level 4 sorter (not a science set, so kept separate). */
export const operationsSet: SortSet = {
  id: 'operations',
  grade: 2,
  title: 'Which operation solves it?',
  question: 'Are we putting together, taking away, or making equal groups?',
  bins: [
    { id: 'add', label: 'Add +', emoji: '➕' },
    { id: 'subtract', label: 'Subtract −', emoji: '➖' },
    { id: 'groups', label: 'Equal groups', emoji: '✖️' },
  ],
  items: [
    { emoji: '🪙', name: '6 coins and 4 more coins', bin: 'add' },
    { emoji: '🐟', name: '5 fish join 3 fish', bin: 'add' },
    { emoji: '🎈', name: '8 balloons, then 2 more arrive', bin: 'add' },
    { emoji: '💎', name: '12 gems, 5 are lost', bin: 'subtract' },
    { emoji: '🍪', name: '9 cookies, 4 are eaten', bin: 'subtract' },
    { emoji: '🐦', name: '7 birds, 3 fly away', bin: 'subtract' },
    { emoji: '📦', name: '4 chests with 3 gems each', bin: 'groups' },
    { emoji: '🚗', name: '3 cars with 4 wheels each', bin: 'groups' },
    { emoji: '🥚', name: '2 trays of 6 eggs', bin: 'groups' },
  ],
};

export const binLabel = (set: SortSet, binId: string) => set.bins.find((b) => b.id === binId)?.label ?? binId;
