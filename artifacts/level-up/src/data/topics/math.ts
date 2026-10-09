import type { Topic } from '../../types';
import { numberChoices, pick, randInt, shuffle, textChoices } from '../../lib/random';
import { fromPool, makeQuestion, mix, repeatEmoji } from './helpers';

const things = ['🍎', '⭐', '🐟', '🎈', '🍪', '🌸', '🚗', '🐥'];

// ---------------- Grade 1 ----------------

const counting: Topic = {
  id: 'g1-counting',
  grade: 1,
  subject: 'Math',
  title: 'Counting to 100',
  emoji: '🔢',
  blurb: 'Count objects and find the numbers before and after.',
  visualizer: 'tenFrame',
  visualizerParams: { a: 7 },
  exploreGoal: 'Add and remove counters. Watch how a full ten-frame makes 10!',
  narration: 'Hello, little counter! Pip the squirrel has a basket of acorns, but he keeps losing count. Let us help him! Each counter below is one of his acorns. We will touch each one once and say one number for it: one, two, three. The boxes they sit in make a ten-frame. It has ten boxes, so when every box is full, we have exactly ten.',
  learnCards: [
    { emoji: '👆', title: 'Touch and count', text: 'Point to each thing once as you say a number: one, two, three. The last number you say tells how many.' },
    { emoji: '🔟', title: 'Ten-frames help', text: 'A ten-frame has 10 boxes. When it is full, you have 10. Two full frames make 20!' },
    { emoji: '➡️', title: 'After and before', text: 'The number after is one more. The number before is one less. After 29 comes 30, and before 30 is 29.' },
  ],
  realLife: 'You count when you share sweets with friends or check how many steps to the door.',
  generate: mix(
    () => {
      const n = randInt(3, 15);
      const e = pick(things);
      return makeQuestion('g1-counting', {
        prompt: `How many ${e} are there?`,
        picture: repeatEmoji(e, n),
        choices: numberChoices(n, [n - 1, n + 1]),
        answer: String(n),
        hint: 'Touch each one with your finger as you count. Do not count any twice!',
        why: `Counting each one once gives ${n}.`,
        misconceptions: {
          [n - 1]: 'You may have skipped one. Count again slowly.',
          [n + 1]: 'You may have counted one twice. Touch each one only once.',
        },
        show: { a: n },
      });
    },
    () => {
      const n = randInt(10, 98);
      const after = Math.random() < 0.5;
      const ans = after ? n + 1 : n - 1;
      return makeQuestion('g1-counting', {
        prompt: `What number comes just ${after ? 'after' : 'before'} ${n}?`,
        choices: numberChoices(ans, [after ? n - 1 : n + 1, n + 10]),
        answer: String(ans),
        hint: after ? 'The number after is one more. Count forward one step.' : 'The number before is one less. Count back one step.',
        why: `${after ? `${n} + 1` : `${n} − 1`} = ${ans}.`,
        misconceptions: {
          [after ? n - 1 : n + 1]: after ? 'That is the number before. "After" means one more.' : 'That is the number after. "Before" means one less.',
          [n + 10]: 'That is ten more. We only move one step.',
        },
        show: { start: n, hops: after ? 1 : -1, max: 100 },
      });
    },
  ),
};

const compare: Topic = {
  id: 'g1-compare',
  grade: 1,
  subject: 'Math',
  title: 'Bigger, Smaller, Same',
  emoji: '🐊',
  blurb: 'Compare numbers with >, < and =.',
  visualizer: 'compare',
  visualizerParams: { a: 8, b: 5 },
  exploreGoal: 'Change both groups. The hungry crocodile always opens its mouth to the bigger group!',
  narration: 'Snap, snap! Meet Coco the hungry crocodile. Coco is very greedy, so she always opens her big mouth towards the group that has more. If both groups are the same, Coco just smiles, because they are equal. Make one group bigger, then the other, and watch which way Coco turns.',
  learnCards: [
    { emoji: '🐊', title: 'The hungry crocodile', text: 'The crocodile mouth opens towards the bigger number. 9 > 4 means 9 is greater than 4.' },
    { emoji: '⚖️', title: 'Equal means same', text: 'When both sides have the same amount, we use the equal sign. 6 = 6.' },
    { emoji: '🔟', title: 'Look at the tens first', text: 'For big numbers, compare the tens first. 42 is bigger than 38 because 4 tens is more than 3 tens.' },
  ],
  realLife: 'You compare when you check who has more marbles or which line is shorter.',
  generate: mix(
    () => {
      const a = randInt(1, 20);
      const b = Math.random() < 0.2 ? a : randInt(1, 20);
      const ans = a > b ? '>' : a < b ? '<' : '=';
      return makeQuestion('g1-compare', {
        prompt: `Which sign makes this true?  ${a} ☐ ${b}`,
        choices: shuffle(['>', '<', '=']),
        answer: ans,
        hint: 'The crocodile mouth opens to eat the bigger number.',
        why: a === b ? `${a} and ${b} are the same, so we use =.` : `${Math.max(a, b)} is bigger, so the mouth opens towards it: ${a} ${ans} ${b}.`,
        misconceptions: {
          '>': 'The open side of > faces the left number. Is the left number really bigger?',
          '<': 'The open side of < faces the right number. Is the right number really bigger?',
          '=': 'Equal means both numbers are exactly the same.',
        },
        show: { a, b },
      });
    },
    () => {
      const a = randInt(11, 99);
      let b = randInt(11, 99);
      if (b === a) b = a + 1;
      const big = Math.random() < 0.5;
      const ans = big ? Math.max(a, b) : Math.min(a, b);
      return makeQuestion('g1-compare', {
        prompt: `Which number is ${big ? 'greater' : 'smaller'}: ${a} or ${b}?`,
        choices: shuffle([String(a), String(b)]),
        answer: String(ans),
        hint: 'Compare the tens digit first. If they match, compare the ones.',
        why: `${ans} is ${big ? 'greater' : 'smaller'} when we compare tens, then ones.`,
      });
    },
  ),
};

const add20: Topic = {
  id: 'g1-add20',
  grade: 1,
  subject: 'Math',
  title: 'Adding within 20',
  emoji: '➕',
  blurb: 'Put groups together and count on.',
  visualizer: 'tenFrame',
  visualizerParams: { a: 3, b: 2 },
  exploreGoal: 'Change the two groups and see the total. Can you make 10 in different ways?',
  narration: 'Mia has 3 red counters. Her friend gives her 2 green counters. When we put the two groups together, we are adding. Count them all: one, two, three, four, five. So 3 plus 2 makes 5! Now it is your turn. Add more red and green counters and see how many you have altogether.',
  learnCards: [
    { emoji: '🍎', title: 'Adding means putting together', text: '3 red apples and 2 green apples together make 5 apples. We write 3 + 2 = 5.' },
    { emoji: '🐇', title: 'Count on', text: 'Start with the bigger number in your head, then count on. For 8 + 3, say 8... then 9, 10, 11!' },
    { emoji: '🔟', title: 'Make a ten', text: 'For 9 + 4, move 1 from the 4 to make 10. Then 10 + 3 = 13.' },
  ],
  realLife: 'Adding helps you find how many sweets you have after a friend gives you more.',
  generate: () => {
    const a = randInt(1, 10);
    const b = randInt(1, Math.min(10, 20 - a));
    const sum = a + b;
    const e = pick(things);
    const story = Math.random() < 0.4;
    const names = ['Riya', 'Aarav', 'Mia', 'Leo', 'Zara'];
    const name = pick(names);
    return makeQuestion('g1-add20', {
      prompt: story ? `${name} has ${a} ${e}. A friend gives ${b} more. How many now?` : `What is ${a} + ${b}?`,
      picture: sum <= 14 ? `${repeatEmoji(e, a)}  +  ${repeatEmoji(e, b)}` : undefined,
      choices: numberChoices(sum, [sum - 1, sum + 1, Math.abs(a - b)]),
      answer: String(sum),
      hint: `Start at ${Math.max(a, b)} and count on ${Math.min(a, b)} more.`,
      why: `${a} + ${b} = ${sum}. Putting both groups together gives ${sum}.`,
      misconceptions: {
        [sum - 1]: 'Off by one! When counting on, start with the next number, not the one you are on.',
        [sum + 1]: 'Off by one! You may have counted the starting number again.',
        [Math.abs(a - b)]: 'That is the difference (taking away). Adding puts groups together, so the answer gets bigger.',
      },
      show: { a, b },
    });
  },
};

const sub20: Topic = {
  id: 'g1-sub20',
  grade: 1,
  subject: 'Math',
  title: 'Taking away within 20',
  emoji: '➖',
  blurb: 'Take away and hop back on the number line.',
  visualizer: 'numberLine',
  visualizerParams: { start: 9, hops: -3, max: 20 },
  exploreGoal: 'Hop the frog backwards. Each hop back takes away 1!',
  narration: 'Ribbit! Freddy the frog is sitting on number 9. He wants to hop home, but his home is behind him. Every hop backwards takes away one. Hop, hop, hop: 8, 7, 6. Freddy took away 3, so 9 take away 3 leaves 6. Help Freddy hop and find out what is left.',
  learnCards: [
    { emoji: '🍯', title: 'Taking away', text: 'Bruno has 5 honey pots and gives away 2. Now he has 3. We write 5 − 2 = 3.' },
    { emoji: '🐸', title: 'Hop back', text: 'On a number line, subtracting means hopping back. 9 − 3: start at 9, hop back 3 times to land on 6.' },
    { emoji: '🔁', title: 'Think addition', text: 'For 12 − 4, ask: 4 plus what makes 12? 4 + 8 = 12, so 12 − 4 = 8.' },
  ],
  realLife: 'You subtract when you eat some cookies and want to know how many are left.',
  generate: () => {
    const a = randInt(5, 20);
    const b = randInt(1, Math.min(10, a));
    const diff = a - b;
    return makeQuestion('g1-sub20', {
      prompt: Math.random() < 0.4 ? `There are ${a} birds on a tree. ${b} fly away. How many are left?` : `What is ${a} − ${b}?`,
      picture: Math.random() < 0.4 ? undefined : a <= 12 ? repeatEmoji('🐦', a) : undefined,
      choices: numberChoices(diff, [a + b, diff + 1, diff - 1]),
      answer: String(diff),
      hint: `Start at ${a} and hop back ${b} times.`,
      why: `${a} − ${b} = ${diff}. Taking ${b} away from ${a} leaves ${diff}.`,
      misconceptions: {
        [a + b]: 'You added! Taking away makes the number smaller.',
        [diff + 1]: 'Off by one. Count each hop back carefully.',
        [diff - 1]: 'Off by one. Do not count the number you start on as a hop.',
      },
      show: { start: a, hops: -b, max: 20 },
    });
  },
};

const shapeFacts = [
  { name: 'Circle', sides: 0, corners: 0, objects: ['🕐 clock', '🍪 cookie', '🪙 coin'] },
  { name: 'Triangle', sides: 3, corners: 3, objects: ['🍕 pizza slice', '⛺ tent'] },
  { name: 'Square', sides: 4, corners: 4, objects: ['🎲 dice face', '🪟 window pane'] },
  { name: 'Rectangle', sides: 4, corners: 4, objects: ['🚪 door', '📱 phone', '📺 TV'] },
  { name: 'Pentagon', sides: 5, corners: 5, objects: ['🏠 house outline'] },
  { name: 'Hexagon', sides: 6, corners: 6, objects: ['🐝 honeycomb cell'] },
];
const shapeNames = shapeFacts.map((s) => s.name);

const shapes: Topic = {
  id: 'g1-shapes',
  grade: 1,
  subject: 'Math',
  title: '2D Shapes',
  emoji: '🔺',
  blurb: 'Name shapes and count sides and corners.',
  visualizer: 'shapes',
  exploreGoal: 'Tap each shape. Count its sides and corners as they light up.',
  narration: 'Welcome to Shape Town! Every house here is built from shapes. A triangle has 3 straight sides and 3 corners, like a slice of pizza. A square has 4 sides that are all the same length. A circle is round, with no sides and no corners at all, just like a wheel. Tap a shape and count its sides with me.',
  learnCards: [
    { emoji: '📐', title: 'Sides and corners', text: 'A side is a straight line. A corner is where two sides meet. A triangle has 3 sides and 3 corners.' },
    { emoji: '⬜', title: 'Square vs rectangle', text: 'Both have 4 sides. A square has all sides the same length. A rectangle has 2 long and 2 short sides.' },
    { emoji: '⭕', title: 'Circles are round', text: 'A circle has no straight sides and no corners. It is round all the way!' },
  ],
  realLife: 'Shapes are everywhere: round wheels, rectangle doors and triangle roofs.',
  generate: mix(
    () => {
      const s = pick(shapeFacts.filter((f) => f.sides > 0));
      return makeQuestion('g1-shapes', {
        prompt: `How many sides does a ${s.name.toLowerCase()} have?`,
        choices: numberChoices(s.sides, [s.sides + 1, s.sides - 1]),
        answer: String(s.sides),
        hint: 'Trace each straight line with your finger and count.',
        why: `A ${s.name.toLowerCase()} has ${s.sides} straight sides.`,
        show: { shape: s.name },
      });
    },
    () => {
      const s = pick(shapeFacts.filter((f) => f.name !== 'Rectangle' && f.name !== 'Square'));
      return makeQuestion('g1-shapes', {
        prompt: s.corners ? `Which shape has ${s.corners} corners?` : 'Which shape has no corners?',
        choices: textChoices(s.name, shapeNames),
        answer: s.name,
        hint: 'Corners are the pointy parts where sides meet.',
        why: `A ${s.name.toLowerCase()} has ${s.corners === 0 ? 'no' : s.corners} corners.`,
        show: { shape: s.name },
      });
    },
    () => {
      const s = pick(shapeFacts);
      const obj = pick(s.objects);
      return makeQuestion('g1-shapes', {
        prompt: `What shape is a ${obj.slice(obj.indexOf(' ') + 1)}?`,
        picture: obj.split(' ')[0],
        choices: textChoices(s.name, shapeNames),
        answer: s.name,
        hint: 'Imagine tracing around its outline. Count the sides.',
        why: `A ${obj.slice(obj.indexOf(' ') + 1)} looks like a ${s.name.toLowerCase()}.`,
        show: { shape: s.name },
      });
    },
  ),
};

const lengthItems = [
  { name: 'pencil', emoji: '✏️' },
  { name: 'crayon', emoji: '🖍️' },
  { name: 'spoon', emoji: '🥄' },
  { name: 'key', emoji: '🔑' },
  { name: 'brush', emoji: '🖌️' },
];

const measure: Topic = {
  id: 'g1-length',
  grade: 1,
  subject: 'Math',
  title: 'Measuring Length',
  emoji: '📏',
  blurb: 'Measure with paper clips and compare lengths.',
  visualizer: 'measure',
  visualizerParams: { a: 6, b: 4 },
  exploreGoal: 'Stretch the two objects. Count the paper clips under each one.',
  narration: 'Which is longer, the pencil or the crayon? We can find out by measuring! Line up paper clips under each one, end to end, with no gaps. Then count the clips. The one with more paper clips under it is longer. Stretch the pencil and the crayon, and count the clips to see.',
  learnCards: [
    { emoji: '📎', title: 'Measure with units', text: 'Line up paper clips end to end, with no gaps. Count them to find how long something is.' },
    { emoji: '↔️', title: 'Longer and shorter', text: 'The object with more clips is longer. The one with fewer clips is shorter.' },
    { emoji: '📏', title: 'Rulers', text: 'A ruler is a measuring tool with the units already marked. Start measuring at 0!' },
  ],
  realLife: 'You measure to check if a toy fits in your bag or how tall you have grown.',
  generate: mix(
    () => {
      const [x, y] = shuffle(lengthItems).slice(0, 2);
      const a = randInt(3, 10);
      let b = randInt(2, 10);
      if (b === a) b = a - 1;
      const longer = Math.random() < 0.5;
      const ans = (a > b) === longer ? x : y;
      return makeQuestion('g1-length', {
        prompt: `The ${x.name} is ${a} 📎 long. The ${y.name} is ${b} 📎 long. Which is ${longer ? 'longer' : 'shorter'}?`,
        picture: `${x.emoji} ${repeatEmoji('📎', a)}\n${y.emoji} ${repeatEmoji('📎', b)}`,
        choices: shuffle([x.name, y.name]),
        answer: ans.name,
        hint: `${longer ? 'More' : 'Fewer'} paper clips means ${longer ? 'longer' : 'shorter'}.`,
        why: `${Math.max(a, b)} clips is more than ${Math.min(a, b)} clips, so the ${(a > b ? x : y).name} is longer.`,
        show: { a, b },
      });
    },
    () => {
      const a = randInt(5, 12);
      const b = randInt(2, a - 1);
      return makeQuestion('g1-length', {
        prompt: `A ribbon is ${a} 📎 long. A string is ${b} 📎 long. How many clips longer is the ribbon?`,
        choices: numberChoices(a - b, [a + b]),
        answer: String(a - b),
        hint: 'Find the difference: take the shorter length away from the longer one.',
        why: `${a} − ${b} = ${a - b} clips longer.`,
        misconceptions: { [a + b]: 'Adding gives the total length together. We want how much longer, so subtract.' },
        show: { a, b },
      });
    },
    fromPool('g1-length', [
      { prompt: 'Which tool is best for measuring the length of a book?', answer: 'Ruler 📏', wrong: ['Clock 🕐', 'Thermometer 🌡️', 'Cup 🥤'], hint: 'Which tool has marks for length?', why: 'A ruler measures length.' },
      { prompt: 'When measuring with paper clips, how should they be placed?', answer: 'End to end, no gaps', wrong: ['With big gaps', 'Stacked on top', 'In a circle'], hint: 'Every bit of the object should be covered once.', why: 'Clips must touch end to end with no gaps or overlaps.' },
    ]),
  ),
};

const patternSets = [['🔴', '🔵'], ['⭐', '🌙'], ['🍎', '🍌'], ['🐶', '🐱'], ['🔺', '🟩']];

const patterns: Topic = {
  id: 'g1-patterns',
  grade: 1,
  subject: 'Math',
  title: 'Patterns',
  emoji: '🔁',
  blurb: 'Spot repeating patterns and find what comes next.',
  visualizer: 'pattern',
  exploreGoal: 'Build a pattern by tapping shapes, then see it repeat!',
  narration: 'Look at Zara’s necklace: red bead, blue bead, red bead, blue bead. Do you see how it repeats? That is a pattern! A pattern is a part that repeats again and again, so we can guess what comes next. Tap the shapes to make your own pattern, and watch it repeat.',
  learnCards: [
    { emoji: '🔴', title: 'What is a pattern?', text: 'A pattern repeats again and again. Red, blue, red, blue is an AB pattern.' },
    { emoji: '🔍', title: 'Find the core', text: 'Find the part that repeats: the core. In ⭐⭐🌙 ⭐⭐🌙, the core is ⭐⭐🌙.' },
    { emoji: '🔢', title: 'Number patterns', text: '2, 4, 6, 8... adds 2 each time. 10, 20, 30... adds 10 each time.' },
  ],
  realLife: 'Patterns are in stripes on clothes, beads on a necklace and days of the week.',
  generate: mix(
    () => {
      const set = pick(patternSets);
      const shapesOfCore = pick([[0, 1], [0, 0, 1], [0, 1, 1]]);
      const core = shapesOfCore.map((i) => set[i]);
      const shown = randInt(core.length + 2, core.length * 2 + 1);
      const seq = Array.from({ length: shown }, (_, i) => core[i % core.length]);
      const next = core[shown % core.length];
      const other = pick(patternSets.flat().filter((e) => !set.includes(e)));
      return makeQuestion('g1-patterns', {
        prompt: 'What comes next in the pattern?',
        picture: `${seq.join(' ')} ❓`,
        choices: shuffle([...set, other]),
        answer: next,
        hint: 'Find the part that repeats, then say the pattern out loud.',
        why: `The pattern repeats ${core.join(' ')}, so next is ${next}.`,
        show: { core },
      });
    },
    () => {
      const step = pick([2, 5, 10]);
      const start = step * randInt(1, 4);
      const seq = [0, 1, 2, 3].map((i) => start + i * step);
      const ans = start + 4 * step;
      return makeQuestion('g1-patterns', {
        prompt: `What comes next? ${seq.join(', ')}, ☐`,
        choices: numberChoices(ans, [ans - 1, ans + step, ans + 1]),
        answer: String(ans),
        hint: 'How much does it grow each time?',
        why: `It goes up by ${step} each time: ${seq[3]} + ${step} = ${ans}.`,
      });
    },
  ),
};

// ---------------- Grade 2 ----------------

const placeValue: Topic = {
  id: 'g2-placevalue',
  grade: 2,
  subject: 'Math',
  title: 'Tens and Ones',
  emoji: '🧱',
  blurb: 'Build two-digit numbers with tens rods and ones cubes.',
  visualizer: 'baseTen',
  visualizerParams: { n: 34 },
  exploreGoal: 'Add tens rods and ones cubes. Watch the number change!',
  learnCards: [
    { emoji: '🧱', title: 'A ten is ten ones', text: 'Ten little cubes snap together into one rod. That rod is a TEN.' },
    { emoji: '4️⃣', title: 'Read the digits', text: 'In 47, the 4 means 4 tens (40) and the 7 means 7 ones. 40 + 7 = 47.' },
    { emoji: '🔄', title: 'Order matters', text: '36 and 63 use the same digits but are different! 3 tens 6 ones vs 6 tens 3 ones.' },
  ],
  realLife: 'Money uses place value: four ₹10 notes and three ₹1 coins make ₹43.',
  generate: () => {
    const n = randInt(11, 99);
    const t = Math.floor(n / 10);
    const o = n % 10;
    const kind = randInt(0, 2);
    if (kind === 0) {
      return makeQuestion('g2-placevalue', {
        prompt: `How many tens are in ${n}?`,
        choices: numberChoices(t, [o, n]),
        answer: String(t),
        hint: 'The tens digit is on the left.',
        why: `${n} = ${t} tens and ${o} ones.`,
        misconceptions: { [o]: 'That is the ones digit. Tens are on the left.', [n]: 'That is the whole number. Count only the tens rods.' },
        show: { n },
      });
    }
    if (kind === 1) {
      const swapped = o * 10 + t;
      return makeQuestion('g2-placevalue', {
        prompt: `Which number has ${t} tens and ${o} ones?`,
        choices: numberChoices(n, [swapped !== n ? swapped : n + 10, t + o]),
        answer: String(n),
        hint: 'Write the tens digit first, then the ones digit.',
        why: `${t} tens = ${t * 10}, plus ${o} ones = ${n}.`,
        misconceptions: { [swapped]: 'The digits are swapped. Tens go on the left.', [t + o]: 'You added the digits. Tens are worth 10 each!' },
        show: { n },
      });
    }
    return makeQuestion('g2-placevalue', {
      prompt: `What is the value of the ${t} in ${n}?`,
      choices: numberChoices(t * 10, [t, n, t * 100]),
      answer: String(t * 10),
      hint: 'The left digit counts tens. Each ten is worth 10.',
      why: `The ${t} is in the tens place, so it is worth ${t} × 10 = ${t * 10}.`,
      misconceptions: { [t]: `The digit is ${t}, but it stands for ${t} tens, which is ${t * 10}.` },
      show: { n },
    });
  },
};

const addSub100: Topic = {
  id: 'g2-addsub100',
  grade: 2,
  subject: 'Math',
  title: 'Add & Subtract to 100',
  emoji: '🧮',
  blurb: 'Add and subtract two-digit numbers using tens and ones.',
  visualizer: 'baseTen',
  visualizerParams: { a: 27, b: 15, op: '+' },
  exploreGoal: 'Combine the blocks. When you get 10 ones, trade them for a ten rod!',
  learnCards: [
    { emoji: '🧱', title: 'Tens with tens, ones with ones', text: 'For 32 + 25: add tens 30 + 20 = 50, add ones 2 + 5 = 7. Total 57.' },
    { emoji: '🔁', title: 'Regroup when needed', text: 'For 27 + 15: ones 7 + 5 = 12. Trade 10 ones for 1 ten. So 3 tens + 1 ten + 2 ones = 42.' },
    { emoji: '✂️', title: 'Borrow a ten', text: 'For 42 − 15: you cannot take 5 from 2, so break a ten into 10 ones. 12 − 5 = 7, 3 − 1 = 2 tens. Answer 27.' },
  ],
  realLife: 'Adding prices at the shop or counting how many pages are left in a book.',
  generate: () => {
    const add = Math.random() < 0.55;
    if (add) {
      const a = randInt(10, 80);
      const b = randInt(5, 99 - a);
      const ans = a + b;
      const noCarry = Math.floor(a / 10) * 10 + Math.floor(b / 10) * 10 + ((a % 10) + (b % 10)) % 10;
      return makeQuestion('g2-addsub100', {
        prompt: `What is ${a} + ${b}?`,
        choices: numberChoices(ans, [noCarry !== ans ? noCarry : ans + 10, ans - 10, ans + 1]),
        answer: String(ans),
        hint: 'Add the tens, then add the ones. If ones make 10 or more, regroup!',
        why: `Tens: ${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10}. Ones: ${a % 10} + ${b % 10}. Total ${ans}.`,
        misconceptions: { [noCarry]: 'You forgot to carry the extra ten when the ones made 10 or more.', [ans - 10]: 'A ten went missing. Check the regrouping.' },
        show: { a, b, op: '+' },
      });
    }
    const a = randInt(20, 99);
    const b = randInt(5, a - 5);
    const ans = a - b;
    const noBorrow = Math.abs(Math.floor(a / 10) - Math.floor(b / 10)) * 10 + Math.abs((a % 10) - (b % 10));
    return makeQuestion('g2-addsub100', {
      prompt: `What is ${a} − ${b}?`,
      choices: numberChoices(ans, [noBorrow !== ans ? noBorrow : ans + 10, a + b > 100 ? ans + 1 : a + b, ans - 1]),
      answer: String(ans),
      hint: 'Subtract ones first. If there are not enough ones, break a ten into 10 ones.',
      why: `${a} − ${b} = ${ans}.`,
      misconceptions: { [noBorrow]: 'You took the smaller ones digit from the bigger one. Borrow a ten instead!', [a + b]: 'You added. Subtracting makes the number smaller.' },
      show: { a, b, op: '−' },
    });
  },
};

const arrays: Topic = {
  id: 'g2-arrays',
  grade: 2,
  subject: 'Math',
  title: 'Skip Counting & Arrays',
  emoji: '🍪',
  blurb: 'Count equal rows quickly by 2s, 5s and 10s.',
  visualizer: 'array',
  visualizerParams: { rows: 3, cols: 4 },
  exploreGoal: 'Change the rows and columns. Skip count each row to find the total.',
  learnCards: [
    { emoji: '🍪', title: 'Arrays are neat rows', text: 'An array puts things in equal rows. 3 rows of 4 cookies: 4, 8, 12 cookies.' },
    { emoji: '🦘', title: 'Skip counting', text: 'Skip counting jumps by the same amount: 5, 10, 15, 20. It is faster than counting by ones!' },
    { emoji: '✖️', title: 'Repeated adding', text: '3 rows of 4 is 4 + 4 + 4 = 12. Later you will write this as 3 × 4.' },
  ],
  realLife: 'Egg trays, chocolate bars and windows on a building are all arrays.',
  generate: mix(
    () => {
      const rows = randInt(2, 5);
      const cols = randInt(2, 5);
      const e = pick(['🍪', '🥚', '🌸', '⭐']);
      return makeQuestion('g2-arrays', {
        prompt: `There are ${rows} rows with ${cols} ${e} in each row. How many in all?`,
        picture: Array.from({ length: rows }, () => repeatEmoji(e, cols)).join('\n'),
        choices: numberChoices(rows * cols, [rows + cols, rows * cols - cols]),
        answer: String(rows * cols),
        hint: `Skip count by ${cols} for each row.`,
        why: `${Array.from({ length: rows }, () => cols).join(' + ')} = ${rows * cols}.`,
        misconceptions: { [rows + cols]: 'You added the rows and columns. Count every item in every row.', [rows * cols - cols]: 'One row is missing. Count all the rows.' },
        show: { rows, cols },
      });
    },
    () => {
      const step = pick([2, 5, 10]);
      const start = step * randInt(1, 5);
      const seq = [0, 1, 2].map((i) => start + i * step);
      const ans = start + 3 * step;
      return makeQuestion('g2-arrays', {
        prompt: `Skip count by ${step}s: ${seq.join(', ')}, ☐`,
        choices: numberChoices(ans, [seq[2] + 1, ans + step]),
        answer: String(ans),
        hint: `Add ${step} to the last number.`,
        why: `${seq[2]} + ${step} = ${ans}.`,
        misconceptions: { [seq[2] + 1]: `That counts by 1. We are jumping by ${step}s.` },
      });
    },
  ),
};

const clockEmoji = (h: number, half: boolean) => String.fromCodePoint((half ? 0x1f55c : 0x1f550) + h - 1);
const fmt = (h: number, m: number) => `${h}:${String(m).padStart(2, '0')}`;

const time: Topic = {
  id: 'g2-time',
  grade: 2,
  subject: 'Math',
  title: 'Telling Time',
  emoji: '🕒',
  blurb: "Read o'clock, half past and quarter times.",
  visualizer: 'clock',
  visualizerParams: { hour: 3, minute: 0 },
  exploreGoal: 'Drag the long minute hand around the clock. Watch the hour hand move too!',
  learnCards: [
    { emoji: '🕐', title: 'Two hands', text: 'The short hand shows the hour. The long hand shows the minutes.' },
    { emoji: '🕧', title: "O'clock and half past", text: "When the long hand points to 12 it is o'clock. When it points to 6 it is half past (30 minutes)." },
    { emoji: '⏱️', title: 'Count by 5s', text: 'Each number on the clock is 5 minutes for the long hand. Pointing at 3 means 15 minutes.' },
  ],
  realLife: 'Time tells you when school starts, when lunch is, and when it is bedtime.',
  generate: mix(
    () => {
      const h = randInt(1, 12);
      const half = Math.random() < 0.5;
      const m = half ? 30 : 0;
      const swapped = half ? fmt(6, h === 12 ? 0 : h * 5) : fmt(12, h * 5 === 60 ? 0 : h * 5);
      return makeQuestion('g2-time', {
        prompt: 'What time does the clock show?',
        picture: clockEmoji(h, half),
        choices: textChoices(fmt(h, m), [fmt(h, half ? 0 : 30), fmt(h === 12 ? 1 : h + 1, m), swapped, fmt(h === 1 ? 12 : h - 1, 30)]),
        answer: fmt(h, m),
        hint: 'Look at the short hand for the hour. Is the long hand at 12 or at 6?',
        why: `The short hand is at ${h}${half ? ' (just past it)' : ''} and the long hand is at ${half ? '6' : '12'}, so it is ${fmt(h, m)}.`,
        misconceptions: { [swapped]: 'You swapped the hands. The short hand is the hour.' },
        show: { hour: h, minute: m },
      });
    },
    () => {
      const h = randInt(1, 11);
      const m = pick([0, 15, 30, 45]);
      const add = pick([1, 2]);
      return makeQuestion('g2-time', {
        prompt: `It is ${fmt(h, m)}. What time will it be in ${add} hour${add > 1 ? 's' : ''}?`,
        choices: textChoices(fmt(((h + add - 1) % 12) + 1, m), [fmt(h, m + 15 > 45 ? 0 : m + 15), fmt(((h + add) % 12) + 1, m), fmt(h, m), fmt(((h + add - 1) % 12) + 1, (m + 30) % 60)]),
        answer: fmt(((h + add - 1) % 12) + 1, m),
        hint: 'Only the hour changes. The minutes stay the same.',
        why: `Moving the hour forward ${add} gives ${fmt(((h + add - 1) % 12) + 1, m)}.`,
        show: { hour: h, minute: m },
      });
    },
    () => {
      const h = randInt(1, 12);
      const [label, m] = pick([['half past', 30], ['quarter past', 15], ['quarter to', 45]] as const);
      const hour = label === 'quarter to' ? (h === 1 ? 12 : h - 1) : h;
      const ans = fmt(hour, m);
      return makeQuestion('g2-time', {
        prompt: `Which time is "${label} ${h}"?`,
        choices: textChoices(ans, [fmt(h, m), fmt(h, (m + 30) % 60), fmt(hour, m === 15 ? 45 : 15), fmt(h, 0)]),
        answer: ans,
        hint: label === 'quarter to' ? `"Quarter to ${h}" is 15 minutes before ${h}:00.` : `"${label}" means ${m} minutes after the hour.`,
        why: `"${label} ${h}" is ${ans}.`,
        show: { hour, minute: m },
      });
    },
  ),
};

const coinValues = [1, 2, 5, 10];

const money: Topic = {
  id: 'g2-money',
  grade: 2,
  subject: 'Math',
  title: 'Money',
  emoji: '🪙',
  blurb: 'Count coins and work out change.',
  visualizer: 'coins',
  exploreGoal: 'Tap coins into the purse. Can you make ₹15 in two different ways?',
  learnCards: [
    { emoji: '🪙', title: 'Coin values', text: 'Coins can be ₹1, ₹2, ₹5 or ₹10. A bigger coin is not always worth more: look at the number!' },
    { emoji: '➕', title: 'Count the biggest first', text: 'Start with the biggest coins: ₹10, then ₹5, then smaller ones. ₹10 + ₹5 + ₹2 = ₹17.' },
    { emoji: '🛍️', title: 'Change', text: 'If a toy costs ₹13 and you pay ₹20, the change is ₹20 − ₹13 = ₹7.' },
  ],
  realLife: 'You count money when buying a snack or saving coins in a piggy bank.',
  generate: mix(
    () => {
      const coins = Array.from({ length: randInt(2, 4) }, () => pick(coinValues)).sort((a, b) => b - a);
      const total = coins.reduce((s, c) => s + c, 0);
      return makeQuestion('g2-money', {
        prompt: `How much money is this? ${coins.map((c) => `₹${c}`).join(' + ')}`,
        picture: coins.map(() => '🪙').join(' '),
        choices: numberChoices(total, [coins.length, total + 1, total - 1]).map((v) => `₹${v}`),
        answer: `₹${total}`,
        hint: 'Start with the biggest coin and count on.',
        why: `${coins.map((c) => `₹${c}`).join(' + ')} = ₹${total}.`,
        misconceptions: { [`₹${coins.length}`]: 'You counted the coins, not their values. Add up the numbers on each coin.' },
        show: { coins },
      });
    },
    () => {
      const price = randInt(3, 18);
      const paid = price <= 10 ? 10 : 20;
      const change = paid - price;
      const item = pick(['🧃 juice', '🖍️ crayons', '🍫 chocolate', '🎈 balloon', '📒 notebook']);
      return makeQuestion('g2-money', {
        prompt: `A ${item.split(' ')[1]} costs ₹${price}. You pay ₹${paid}. How much change do you get?`,
        picture: item.split(' ')[0],
        choices: numberChoices(change, [paid + price, price]).map((v) => `₹${v}`),
        answer: `₹${change}`,
        hint: `Count up from ₹${price} to ₹${paid}.`,
        why: `₹${paid} − ₹${price} = ₹${change}.`,
        misconceptions: { [`₹${paid + price}`]: 'You added. Change is what is left, so subtract.', [`₹${price}`]: 'That is the price. Change is what you get back.' },
        show: { coins: [paid] },
      });
    },
  ),
};

const fractions: Topic = {
  id: 'g2-fractions',
  grade: 2,
  subject: 'Math',
  title: 'Halves & Quarters',
  emoji: '🍕',
  blurb: 'Share fairly into equal parts.',
  visualizer: 'fraction',
  visualizerParams: { parts: 4, shaded: 1 },
  exploreGoal: 'Cut the pizza into 2, 3 or 4 equal slices, then tap slices to shade them.',
  learnCards: [
    { emoji: '🍕', title: 'Equal parts', text: 'A fraction is a part of a whole cut into EQUAL parts. Unequal pieces are not fair shares!' },
    { emoji: '½', title: 'One half', text: 'Cut into 2 equal parts: each part is one half, written 1/2.' },
    { emoji: '¼', title: 'One quarter', text: 'Cut into 4 equal parts: each part is one quarter, written 1/4. Two quarters make one half!' },
  ],
  realLife: 'Sharing a sandwich equally with a friend gives you each one half.',
  generate: mix(
    () => {
      const parts = pick([2, 3, 4]);
      const shaded = randInt(1, parts - 1);
      const ans = `${shaded}/${parts}`;
      return makeQuestion('g2-fractions', {
        prompt: `A pizza is cut into ${parts} equal slices. ${shaded} ${shaded > 1 ? 'are' : 'is'} eaten. What fraction is eaten?`,
        picture: `${repeatEmoji('🍕', shaded)}${repeatEmoji('⬜', parts - shaded)}`,
        choices: textChoices(ans, [`${parts}/${shaded}`, `${parts - shaded}/${parts}`, `1/${parts + 1}`, `${shaded}/${parts + 1}`].filter((c) => c !== ans)),
        answer: ans,
        hint: 'Top number: slices eaten. Bottom number: total equal slices.',
        why: `${shaded} out of ${parts} equal slices is ${ans}.`,
        misconceptions: {
          [`${parts}/${shaded}`]: 'The numbers are upside down. The total goes on the bottom.',
          [`${parts - shaded}/${parts}`]: 'That is the part NOT eaten.',
        },
        show: { parts, shaded },
      });
    },
    () => {
      const n = pick([4, 6, 8, 10, 12]);
      const quarter = n % 4 === 0 && Math.random() < 0.4;
      const ans = quarter ? n / 4 : n / 2;
      return makeQuestion('g2-fractions', {
        prompt: `What is ${quarter ? 'one quarter' : 'half'} of ${n} 🍓?`,
        picture: repeatEmoji('🍓', n),
        choices: numberChoices(ans, [n, n * 2, quarter ? n / 2 : n / 4]),
        answer: String(ans),
        hint: `Share them into ${quarter ? 4 : 2} equal groups.`,
        why: `${n} shared into ${quarter ? 4 : 2} equal groups gives ${ans} in each.`,
        show: { parts: quarter ? 4 : 2, shaded: 1 },
      });
    },
    fromPool('g2-fractions', [
      { prompt: 'How many quarters make a whole?', answer: '4', wrong: ['2', '3', '1'], hint: 'Quarter means 4 equal parts.', why: '4 quarters make 1 whole.', show: { parts: 4, shaded: 4 } },
      { prompt: 'Two quarters is the same as...', answer: 'One half', wrong: ['One whole', 'One quarter', 'One third'], hint: 'Shade 2 of 4 slices. How much is shaded?', why: '2/4 covers the same amount as 1/2.', show: { parts: 4, shaded: 2 } },
      { prompt: 'Which shows a fair half?', answer: 'Two equal pieces', wrong: ['One big and one small piece', 'Three pieces', 'One piece'], hint: 'Halves must be equal.', why: 'Halves are two EQUAL parts.' },
    ]),
  ),
};

const fruitIcons = ['🍎', '🍌', '🍇', '🍊'];
const fruitNames: Record<string, string> = { '🍎': 'apples', '🍌': 'bananas', '🍇': 'grapes', '🍊': 'oranges' };

const pictograph: Topic = {
  id: 'g2-pictograph',
  grade: 2,
  subject: 'Math',
  title: 'Pictographs',
  emoji: '📊',
  blurb: 'Read picture charts and compare amounts.',
  visualizer: 'pictograph',
  exploreGoal: 'Vote for fruits to build the chart. Which fruit is winning?',
  learnCards: [
    { emoji: '📊', title: 'Pictures show data', text: 'A pictograph uses pictures to show how many. Each picture stands for one vote.' },
    { emoji: '🏆', title: 'Most and least', text: 'The row with the most pictures is the most popular. The shortest row is the least.' },
    { emoji: '➖', title: 'How many more?', text: 'To find how many more, subtract: 5 apples − 3 bananas = 2 more apples.' },
  ],
  realLife: 'Class charts show favourite colours, pets or how many books everyone read.',
  generate: () => {
    const fruits = shuffle(fruitIcons).slice(0, 3);
    const counts = fruits.map(() => randInt(1, 7));
    const data = Object.fromEntries(fruits.map((f, i) => [f, counts[i]]));
    const picture = fruits.map((f, i) => `${repeatEmoji(f, counts[i])}`).join('\n');
    const kind = randInt(0, 2);
    if (kind === 0) {
      const f = pick(fruits);
      return makeQuestion('g2-pictograph', {
        prompt: `How many children like ${fruitNames[f]}?`,
        picture,
        choices: numberChoices(data[f], [data[f] + 1]),
        answer: String(data[f]),
        hint: `Count the ${f} pictures in that row.`,
        why: `There are ${data[f]} ${f} pictures.`,
        show: { data },
      });
    }
    if (kind === 1) {
      const max = Math.max(...counts);
      if (counts.filter((c) => c === max).length > 1) counts[0] = max + 1;
      const top = fruits[counts.indexOf(Math.max(...counts))];
      const pic = fruits.map((f, i) => repeatEmoji(f, counts[i])).join('\n');
      return makeQuestion('g2-pictograph', {
        prompt: 'Which fruit is the most popular?',
        picture: pic,
        choices: shuffle(fruits.map((f) => `${f} ${fruitNames[f]}`)),
        answer: `${top} ${fruitNames[top]}`,
        hint: 'Find the longest row.',
        why: `${fruitNames[top]} has the most pictures.`,
        show: { data: Object.fromEntries(fruits.map((f, i) => [f, counts[i]])) },
      });
    }
    const [a, b] = fruits;
    const hi = data[a] >= data[b] ? a : b;
    const lo = hi === a ? b : a;
    const diff = data[hi] - data[lo];
    return makeQuestion('g2-pictograph', {
      prompt: `How many more children like ${fruitNames[hi]} than ${fruitNames[lo]}?`,
      picture,
      choices: numberChoices(diff, [data[hi] + data[lo], data[hi]]),
      answer: String(diff),
      hint: 'Subtract the smaller row from the bigger row.',
      why: `${data[hi]} − ${data[lo]} = ${diff}.`,
      misconceptions: { [data[hi] + data[lo]]: 'You added both rows. "How many more" means subtract.' },
      show: { data },
    });
  },
};

export const mathTopics: Topic[] = [
  counting, compare, add20, sub20, shapes, measure, patterns,
  placeValue, addSub100, arrays, time, money, fractions, pictograph,
];
