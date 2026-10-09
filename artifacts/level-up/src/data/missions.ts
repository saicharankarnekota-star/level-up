import type { Mission, Question } from '../types';

const q = (missionId: string, i: number, topicId: string, fields: Omit<Question, 'id' | 'topicId'>): Question => ({
  id: `${missionId}-${i}`,
  topicId,
  ...fields,
});

export const missions: Mission[] = [
  {
    id: 'picnic-party',
    grade: 1,
    subject: 'Math',
    title: 'The Picnic Party',
    emoji: '🧺',
    intro: 'Pip the panda is planning a picnic for friends in the park. Help Pip count, add and share the food!',
    outro: 'The picnic was perfect! Everyone had enough to eat, thanks to your counting skills.',
    xpReward: 60,
    steps: [
      {
        narration: 'Pip packs the basket. How many sandwiches are inside?',
        question: q('picnic-party', 1, 'g1-counting', {
          prompt: 'How many 🥪 are in the basket?', picture: '🥪🥪🥪🥪🥪🥪🥪', choices: ['6', '7', '8', '5'], answer: '7',
          hint: 'Touch each sandwich once.', why: 'Counting one by one gives 7 sandwiches.', show: { a: 7 },
          misconceptions: { '6': 'One sandwich was skipped. Count again slowly.', '8': 'One was counted twice.' },
        }),
      },
      {
        narration: 'Pip has 6 apples. Kiki the cat brings 5 more!',
        question: q('picnic-party', 2, 'g1-add20', {
          prompt: 'What is 6 + 5?', picture: '🍎🍎🍎🍎🍎🍎 + 🍎🍎🍎🍎🍎', choices: ['10', '11', '12', '1'], answer: '11',
          hint: 'Start at 6 and count on 5: 7, 8, 9, 10, 11.', why: '6 + 5 = 11 apples.', show: { a: 6, b: 5 },
          misconceptions: { '1': 'That is 6 − 5. Adding makes more!', '10': 'Off by one. Count on carefully.' },
        }),
      },
      {
        narration: 'Oh no! A sneaky crow takes 4 of the 12 cookies.',
        question: q('picnic-party', 3, 'g1-sub20', {
          prompt: 'What is 12 − 4?', choices: ['8', '16', '7', '9'], answer: '8',
          hint: 'Start at 12 and hop back 4.', why: '12 − 4 = 8 cookies left.', show: { start: 12, hops: -4, max: 20 },
          misconceptions: { '16': 'You added. The crow TOOK cookies, so subtract.' },
        }),
      },
      {
        narration: 'Who brought more juice boxes: Pip with 9 or Kiki with 14?',
        question: q('picnic-party', 4, 'g1-compare', {
          prompt: 'Which sign makes this true?  9 ☐ 14', choices: ['>', '<', '='], answer: '<',
          hint: 'The crocodile eats the bigger number.', why: '14 is bigger, so 9 < 14.', show: { a: 9, b: 14 },
        }),
      },
    ],
  },
  {
    id: 'garden-rescue',
    grade: 1,
    subject: 'Science',
    title: 'Garden Rescue',
    emoji: '🌻',
    intro: "Grandma Rosa's garden is drooping! Use your science senses to find out what the plants need.",
    outro: 'The garden is blooming again! You are a true plant doctor.',
    xpReward: 60,
    steps: [
      {
        narration: 'First, sort the garden. Which of these is living?',
        question: q('garden-rescue', 1, 'g1-living', {
          prompt: 'Which one is living?', choices: ['🌷 Tulip', '🪨 Rock', '🪣 Bucket', '🧤 Glove'], answer: '🌷 Tulip',
          hint: 'Which one grows and needs water?', why: 'Plants grow and need water, so the tulip is living.', show: { set: 'living' },
        }),
      },
      {
        narration: 'The soil is dry. Which part of the plant drinks the water?',
        question: q('garden-rescue', 2, 'g1-plant', {
          prompt: 'Which plant part takes in water from the soil?', choices: ['Roots', 'Flower', 'Leaves', 'Seed'], answer: 'Roots',
          hint: 'It is hidden underground.', why: 'Roots soak up water from the soil.', show: { part: 'roots' },
        }),
      },
      {
        narration: 'A big tree is blocking the sunlight! Which part of the plant needs sunlight to make food?',
        question: q('garden-rescue', 3, 'g1-plant', {
          prompt: 'Which part uses sunlight to make food?', choices: ['Leaves', 'Roots', 'Stem', 'Soil'], answer: 'Leaves',
          hint: 'It is green and flat.', why: 'Leaves make food from sunlight.', show: { part: 'leaves' },
        }),
      },
      {
        narration: 'The flowers smell lovely now! Which sense tells you that?',
        question: q('garden-rescue', 4, 'g1-senses', {
          prompt: 'You smell the roses with your...', picture: '🌹', choices: ['Nose 👃', 'Ears 👂', 'Tongue 👅', 'Hands ✋'], answer: 'Nose 👃',
          hint: 'Sniff, sniff!', why: 'We smell with our nose.', show: { sense: 'smell' },
        }),
      },
    ],
  },
  {
    id: 'toy-shop',
    grade: 2,
    subject: 'Math',
    title: 'The Toy Shop Trip',
    emoji: '🧸',
    intro: 'Max has saved coins in a piggy bank and is off to the toy shop. Help Max count money and watch the time!',
    outro: 'Max bought the perfect toy and got home on time. Great maths shopping!',
    xpReward: 80,
    steps: [
      {
        narration: 'Max opens the piggy bank and finds ₹10, ₹5, ₹2 and ₹1.',
        question: q('toy-shop', 1, 'g2-money', {
          prompt: 'How much money does Max have? ₹10 + ₹5 + ₹2 + ₹1', choices: ['₹18', '₹17', '₹4', '₹16'], answer: '₹18',
          hint: 'Start with ₹10 and count on.', why: '10 + 5 + 2 + 1 = 18.', show: { coins: [10, 5, 2, 1] },
          misconceptions: { '₹4': 'That counts the coins, not their values.' },
        }),
      },
      {
        narration: 'The shop opens at half past 10. What does that look like?',
        question: q('toy-shop', 2, 'g2-time', {
          prompt: 'Which time is "half past 10"?', choices: ['10:30', '10:00', '11:30', '6:10'], answer: '10:30',
          hint: 'Half past means 30 minutes after.', why: 'Half past 10 is 10:30.', show: { hour: 10, minute: 30 },
        }),
      },
      {
        narration: 'A robot costs ₹13. Max pays with ₹18.',
        question: q('toy-shop', 3, 'g2-money', {
          prompt: 'How much change does Max get?', choices: ['₹5', '₹31', '₹6', '₹4'], answer: '₹5',
          hint: 'Count up from 13 to 18.', why: '₹18 − ₹13 = ₹5.', show: { coins: [5] },
          misconceptions: { '₹31': 'You added. Change is what is left over.' },
        }),
      },
      {
        narration: 'The shop has toy cars on a shelf: 4 rows with 5 cars in each row.',
        question: q('toy-shop', 4, 'g2-arrays', {
          prompt: 'How many toy cars are on the shelf?', picture: '🚗🚗🚗🚗🚗\n🚗🚗🚗🚗🚗\n🚗🚗🚗🚗🚗\n🚗🚗🚗🚗🚗', choices: ['20', '9', '15', '25'], answer: '20',
          hint: 'Skip count by 5s: 5, 10, 15...', why: '5 + 5 + 5 + 5 = 20.', show: { rows: 4, cols: 5 },
          misconceptions: { '9': 'You added rows and columns. Count every car.' },
        }),
      },
    ],
  },
  {
    id: 'pond-explorer',
    grade: 2,
    subject: 'Science',
    title: 'Pond Explorer',
    emoji: '🐸',
    intro: 'Join Ranger Ravi at the pond to discover how animals grow and where they live!',
    outro: 'You discovered the secrets of the pond. Ranger Ravi gives you an explorer hat!',
    xpReward: 80,
    steps: [
      {
        narration: 'Look! Tiny wriggly creatures with tails are swimming in the pond.',
        question: q('pond-explorer', 1, 'g2-lifecycles', {
          prompt: 'What is a baby frog called?', choices: ['Tadpole', 'Caterpillar', 'Chick', 'Calf'], answer: 'Tadpole',
          hint: 'It has a tail and swims.', why: 'Baby frogs are tadpoles.', show: { cycle: 'frog' },
        }),
      },
      {
        narration: 'On a leaf, a caterpillar is munching. What will it become?',
        question: q('pond-explorer', 2, 'g2-lifecycles', {
          prompt: 'In the butterfly life cycle, what comes after the caterpillar?', choices: ['🫘 Pupa', '🥚 Egg', '🦋 Butterfly', '🐸 Frog'], answer: '🫘 Pupa',
          hint: 'It wraps up in a case first.', why: 'Egg → caterpillar → pupa → butterfly.', show: { cycle: 'butterfly' },
        }),
      },
      {
        narration: 'Ravi finds a fish. Which home is best for it?',
        question: q('pond-explorer', 3, 'g2-habitats', {
          prompt: 'Fish breathe with gills. Where can they live?', picture: '🐟', choices: ['💧 In water', '🏜️ In the desert', '🌲 Up a tree', '🧊 On dry ice'], answer: '💧 In water',
          hint: 'Gills work underwater.', why: 'Fish need water to breathe with their gills.', show: { set: 'habitats' },
        }),
      },
      {
        narration: 'The sun warms the pond and some water turns into a gas and floats away.',
        question: q('pond-explorer', 4, 'g2-matter', {
          prompt: 'When water gets very hot, it turns into...', choices: ['Steam (a gas)', 'Ice (a solid)', 'Sand', 'Wood'], answer: 'Steam (a gas)',
          hint: 'Think of a boiling kettle.', why: 'Heat turns liquid water into gas.', show: { set: 'matter' },
        }),
      },
    ],
  },
];

export const missionById = (id: string | undefined) => missions.find((m) => m.id === id);
