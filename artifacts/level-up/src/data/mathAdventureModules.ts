export interface StoryboardScene {
  id: string;
  sceneNumber: number;
  timeRange: string;
  title: string;
  voiceOverScript: string;
  subtitle: string;
  visualGraphic: 'apples_intro' | 'apples_add' | 'number_line_forward' | 'pause_interactive_add'
                | 'honey_intro' | 'honey_takeaway' | 'number_line_backward' | 'pause_interactive_sub'
                | 'spaceships_intro' | 'repeated_addition' | 'array_grid' | 'pause_interactive_mul'
                | 'kingdom_add' | 'kingdom_sub' | 'kingdom_mul' | 'dragon_intro';
  interactivePrompt?: {
    question: string;
    choices: string[];
    correct: string;
    feedbackRight: string;
    feedbackWrong: string;
  };
}

export interface AdventureQuizQuestion {
  prompt: string;
  choices: string[];
  correct: string;
  explanation: string;
}

export interface MathAdventureLevel {
  levelNumber: number;
  id: string;
  title: string;
  subtitle: string;
  story: string;
  character: string;
  icon: string;
  themeColor: string;
  bgGradient: string;
  duration: string;
  learningObjectives: string[];
  scenes: StoryboardScene[];
  exploreActivity: {
    title: string;
    instructions: string;
    type: 'fruit_basket' | 'honey_pots' | 'array_builder' | 'mixed_potion' | 'dragon_battle';
  };
  games: {
    id: string;
    name: string;
    type: string;
    description: string;
  }[];
  quizQuestions: AdventureQuizQuestion[];
  unlockThreshold: number; // e.g. 70 (%)
  badgeName: string;
  xpReward: number;
}

export const mathAdventureLevels: MathAdventureLevel[] = [
  // ==========================================
  // LEVEL 1: ADDITION ADVENTURE 🍎
  // ==========================================
  {
    levelNumber: 1,
    id: 'addition-adventure',
    title: 'Addition Adventure',
    subtitle: 'Combine & Collect',
    story: 'Help Mia collect crisp red apples for her village festival. Learn to combine objects, jump on the number line, and solve sums!',
    character: 'Mia the Apple Gatherer',
    icon: '🍎',
    themeColor: '#E63946',
    bgGradient: 'from-[#FF6B6B] to-[#C92A2A]',
    duration: '15–20 minutes',
    learningObjectives: [
      'Understand the true meaning of addition as combining groups',
      'Combine two groups of physical objects to count the total',
      'Use forward jumps on a visual number line',
      'Solve basic sums and word problems with confidence',
    ],
    scenes: [
      {
        id: 'l1-s1',
        sceneNumber: 1,
        timeRange: '0:00 – 0:30',
        title: 'Scene 1 — The Problem',
        voiceOverScript: '“Mia is in the sunny village orchard. She has 3 shiny red apples in her basket. Her best friend runs over and gives her 2 more green apples. How many apples does Mia have now?”',
        subtitle: 'Mia has 3 apples. Her friend gives her 2 more. How many apples does she have now?',
        visualGraphic: 'apples_intro',
      },
      {
        id: 'l1-s2',
        sceneNumber: 2,
        timeRange: '0:30 – 1:15',
        title: 'Scene 2 — Visual Explanation',
        voiceOverScript: '“Look closely: here are the first 3 red apples. Watch as the 2 green apples roll right into the basket! Let us count them all together: One, Two, Three, Four, Five! We write this in math as 3 + 2 = 5.”',
        subtitle: '3 apples + 2 apples = 5 apples altogether! (3 + 2 = 5)',
        visualGraphic: 'apples_add',
      },
      {
        id: 'l1-s3',
        sceneNumber: 3,
        timeRange: '1:15 – 2:00',
        title: 'Scene 3 — Number-Line Jump',
        voiceOverScript: '“Addition also means jumping forward on a number line! Let us start our little frog on the number 3. We add 2, so we hop forward two times: Hop to 4, hop to 5! We land on 5. Moving forward is addition!”',
        subtitle: 'Start at 3. Hop forward 2 times: 3 → 4 → 5! Addition moves forward.',
        visualGraphic: 'number_line_forward',
      },
      {
        id: 'l1-s4',
        sceneNumber: 4,
        timeRange: '2:00 – 2:30',
        title: 'Scene 4 — Your Turn (Pause & Play)',
        voiceOverScript: '“Now it is your turn to help Mia! Farmer Ben brings 4 apples, and Mia already has 3 apples. What is 4 + 3? Choose the correct total to fill the festival basket!”',
        subtitle: 'Solve 4 + 3 to help Mia pack the festival basket!',
        visualGraphic: 'pause_interactive_add',
        interactivePrompt: {
          question: 'What is 4 + 3?',
          choices: ['6', '7', '8', '5'],
          correct: '7',
          feedbackRight: 'Hooray! 4 apples plus 3 apples makes 7 apples! Mia’s basket is overflowing with joy!',
          feedbackWrong: 'Let’s count: start at 4, then count 3 more: 5, 6, 7! 4 + 3 = 7.',
        },
      },
    ],
    exploreActivity: {
      title: 'PhET-Style Interactive Fruit Collector',
      instructions: 'Click or drag apples into Mia’s basket. Watch the visual count and the addition formula update live!',
      type: 'fruit_basket',
    },
    games: [
      { id: 'fruit-collector', name: 'Fruit Collector', type: 'Counting & Addition', description: 'Catch falling orchard fruit in the basket to reach target numbers!' },
      { id: 'number-rocket', name: 'Number Rocket', type: 'Mental Arithmetic', description: 'Solve addition problems to fuel your rocket and launch to new planets!' },
    ],
    quizQuestions: [
      { prompt: 'What is 2 + 3?', choices: ['4', '5', '6', '7'], correct: '5', explanation: '2 + 3 = 5. Start at 2 and count 3 more: 3, 4, 5.' },
      { prompt: 'What is 5 + 4?', choices: ['8', '9', '10', '7'], correct: '9', explanation: '5 + 4 = 9. 5 plus 4 more items equals 9 in total.' },
      { prompt: 'What is 7 + 2?', choices: ['8', '9', '10', '11'], correct: '9', explanation: '7 + 2 = 9. Hop forward 2 spaces on the number line from 7: 8, 9.' },
      { prompt: 'Sam has 6 stickers. He gets 3 more. How many stickers does he have now?', choices: ['8', '9', '10', '7'], correct: '9', explanation: '6 + 3 = 9 stickers altogether.' },
    ],
    unlockThreshold: 70,
    badgeName: 'Orchard Harvester',
    xpReward: 100,
  },

  // ==========================================
  // LEVEL 2: SUBTRACTION QUEST 🐻
  // ==========================================
  {
    levelNumber: 2,
    id: 'subtraction-quest',
    title: 'Subtraction Quest',
    subtitle: 'Find What’s Left',
    story: 'Help Barnaby the Bear share sweet honey jars with woodland friends. Discover taking away, backward number line hops, and saving the hive!',
    character: 'Barnaby the Forest Bear',
    icon: '🍯',
    themeColor: '#D97706',
    bgGradient: 'from-[#F59E0B] to-[#B45309]',
    duration: '15–20 minutes',
    learningObjectives: [
      'Understand subtraction as taking away or finding the difference',
      'Visualize objects leaving a group and count what remains',
      'Use backward jumps on a number line',
      'Build fluency in subtracting numbers up to 10 and 20',
    ],
    scenes: [
      {
        id: 'l2-s1',
        sceneNumber: 1,
        timeRange: '0:00 – 0:30',
        title: 'Scene 1 — The Mystery',
        voiceOverScript: '“Barnaby Bear has 5 golden honey jars lined up on his wooden shelf. Two of his squirrel friends visit looking hungry, so Barnaby gives them 2 jars. How many jars are left for Barnaby?”',
        subtitle: 'The bear has 5 honey jars. It gives 2 jars to friends. How many jars are left?',
        visualGraphic: 'honey_intro',
      },
      {
        id: 'l2-s2',
        sceneNumber: 2,
        timeRange: '0:30 – 1:15',
        title: 'Scene 2 — Take Away',
        voiceOverScript: '“Watch the shelf: two jars slide away with the happy squirrels. Look at what is left behind: One, Two, Three jars! We write this in math as 5 - 2 = 3. The minus sign means taking away.”',
        subtitle: '5 jars minus 2 jars = 3 jars left! (5 - 2 = 3)',
        visualGraphic: 'honey_takeaway',
      },
      {
        id: 'l2-s3',
        sceneNumber: 3,
        timeRange: '1:15 – 2:00',
        title: 'Scene 3 — Jump Backwards',
        voiceOverScript: '“On the number line, subtraction is jumping backwards toward smaller numbers! Barnaby places his frog friend on 5. We subtract 2, so it hops backward two steps: back to 4, back to 3! We land on 3.”',
        subtitle: 'Start at 5. Jump backwards 2 spaces: 5 → 4 → 3. Subtraction moves backwards!',
        visualGraphic: 'number_line_backward',
      },
      {
        id: 'l2-s4',
        sceneNumber: 4,
        timeRange: '2:00 – 2:30',
        title: 'Scene 4 — Save the Honey (Your Turn)',
        voiceOverScript: '“Now solve this challenge: Barnaby had 8 honey jars in the morning. He shared 3 with the deer family. How many jars remain? Choose the answer: 8 - 3 = ?”',
        subtitle: 'Solve 8 - 3 = ? to help Barnaby count his remaining honey!',
        visualGraphic: 'pause_interactive_sub',
        interactivePrompt: {
          question: 'What is 8 - 3?',
          choices: ['4', '5', '6', '3'],
          correct: '5',
          feedbackRight: 'Brilliant! 8 minus 3 leaves exactly 5 jars. Barnaby sends a big bear hug!',
          feedbackWrong: 'Count backward from 8: hop back 3 steps: 7, 6, 5! 8 - 3 = 5.',
        },
      },
    ],
    exploreActivity: {
      title: 'Honey Rescue Manipulative',
      instructions: 'Click jars to give them to forest friends. Watch the remaining count and the equation 5 - 2 = 3 change in real time!',
      type: 'honey_pots',
    },
    games: [
      { id: 'honey-rescue', name: 'Honey Rescue', type: 'Subtraction Practice', description: 'Remove jars requested by woodland animals to balance the pantry!' },
      { id: 'bridge-builder', name: 'Bridge Builder', type: 'Mental Subtraction', description: 'Solve subtraction sums to lay sturdy stepping stones across the river!' },
    ],
    quizQuestions: [
      { prompt: 'What is 6 - 2?', choices: ['3', '4', '5', '2'], correct: '4', explanation: '6 - 2 = 4. Count backward 2 from 6: 5, 4.' },
      { prompt: 'What is 9 - 4?', choices: ['5', '6', '4', '3'], correct: '5', explanation: '9 - 4 = 5. Taking 4 away from 9 leaves 5.' },
      { prompt: 'What is 10 - 3?', choices: ['6', '7', '8', '5'], correct: '7', explanation: '10 - 3 = 7. 10 minus 3 equals 7.' },
      { prompt: 'There are 7 birds on a tree branch. 3 birds fly away. How many birds remain?', choices: ['3', '4', '5', '2'], correct: '4', explanation: '7 - 3 = 4 birds remain on the branch.' },
    ],
    unlockThreshold: 70,
    badgeName: 'Honey Guardian',
    xpReward: 110,
  },

  // ==========================================
  // LEVEL 3: MULTIPLICATION GALAXY 🚀
  // ==========================================
  {
    levelNumber: 3,
    id: 'multiplication-galaxy',
    title: 'Multiplication Galaxy',
    subtitle: 'Build Equal Groups',
    story: 'Board the Astro-Shuttle with Commander Nova to distribute energy crystals across galaxy outposts using equal groups and arrays!',
    character: 'Commander Nova',
    icon: '⚡',
    themeColor: '#4361EE',
    bgGradient: 'from-[#3A0CA3] to-[#4361EE]',
    duration: '20–25 minutes',
    learningObjectives: [
      'Understand multiplication as combining equal-sized groups',
      'Connect multiplication with repeated addition (4 + 4 + 4 = 3 × 4)',
      'Construct arrays with rows and columns to find the area total',
      'Learn multiplication tables through visual patterns',
    ],
    scenes: [
      {
        id: 'l3-s1',
        sceneNumber: 1,
        timeRange: '0:00 – 0:35',
        title: 'Scene 1 — Equal Groups',
        voiceOverScript: '“Welcome aboard Space Station Alpha! There are 3 cargo spaceships docked outside. Each spaceship is loaded with 4 glowing power crystals. How many crystals are there altogether in the fleet?”',
        subtitle: 'There are 3 spaceships. Each carries 4 crystals. How many crystals altogether?',
        visualGraphic: 'spaceships_intro',
      },
      {
        id: 'l3-s2',
        sceneNumber: 2,
        timeRange: '0:35 – 1:20',
        title: 'Scene 2 — Repeated Addition',
        voiceOverScript: '“We could add them one ship at a time: 4 + 4 + 4 = 12. But mathematicians have a secret superpower called multiplication! Instead of saying 4 plus 4 plus 4, we write 3 groups of 4, which is 3 × 4 = 12!”',
        subtitle: '4 + 4 + 4 = 12 crystals. That is 3 groups of 4: 3 × 4 = 12!',
        visualGraphic: 'repeated_addition',
      },
      {
        id: 'l3-s3',
        sceneNumber: 3,
        timeRange: '1:20 – 2:00',
        title: 'Scene 3 — Build the Array',
        voiceOverScript: '“Look at this crystal energy grid! We have 3 rows, with 4 crystals in each row. Notice how rows and columns make an array. When you multiply rows by columns, you find the total instantly!”',
        subtitle: 'Arrays arrange items in rows and columns. 3 rows of 4 columns = 12 items.',
        visualGraphic: 'array_grid',
      },
      {
        id: 'l3-s4',
        sceneNumber: 4,
        timeRange: '2:00 – 2:30',
        title: 'Scene 4 — Power Up (Your Turn)',
        voiceOverScript: '“Space Station Beta needs power! 3 warp engines each need 5 energy cells. What is 3 × 5? Select the right power level to launch into hyperdrive!”',
        subtitle: 'Solve 3 × 5 = ? to charge the warp engines!',
        visualGraphic: 'pause_interactive_mul',
        interactivePrompt: {
          question: 'What is 3 × 5?',
          choices: ['12', '15', '18', '8'],
          correct: '15',
          feedbackRight: 'Hyperdrive engaged! 3 groups of 5 equal 15! Station Beta is fully powered!',
          feedbackWrong: 'Count by 5s three times: 5, 10, 15! 3 × 5 = 15.',
        },
      },
    ],
    exploreActivity: {
      title: 'Interactive Array Grid Builder',
      instructions: 'Use the row and column sliders to build crystal arrays. Watch the repeated addition and multiplication formula update live!',
      type: 'array_builder',
    },
    games: [
      { id: 'galaxy-grid', name: 'Galaxy Grid', type: 'Array Geometry', description: 'Arrange star constellations into rows and columns to charge space beacons!' },
      { id: 'times-table-race', name: 'Times-Table Race', type: 'Speed & Fluency', description: 'Solve quick-fire multiplication to speed your rocket through asteroid gates!' },
    ],
    quizQuestions: [
      { prompt: 'What is 2 × 3?', choices: ['5', '6', '7', '8'], correct: '6', explanation: '2 × 3 = 6. Two groups of three equals 3 + 3 = 6.' },
      { prompt: 'What is 4 × 5?', choices: ['16', '20', '25', '9'], correct: '20', explanation: '4 × 5 = 20. Count by 5s four times: 5, 10, 15, 20.' },
      { prompt: 'What is 3 × 6?', choices: ['15', '18', '21', '9'], correct: '18', explanation: '3 × 6 = 18. Three groups of 6 equals 6 + 6 + 6 = 18.' },
      { prompt: 'A baker packs 5 boxes with 6 cookies each. How many cookies in total?', choices: ['25', '30', '36', '11'], correct: '30', explanation: '5 × 6 = 30 cookies in total.' },
    ],
    unlockThreshold: 70,
    badgeName: 'Galaxy Navigator',
    xpReward: 120,
  },

  // ==========================================
  // LEVEL 4: MIXED MATHS CHALLENGE 🏰
  // ==========================================
  {
    levelNumber: 4,
    id: 'mixed-maths-challenge',
    title: 'Mixed Maths Challenge',
    subtitle: 'Save the Magic Kingdom',
    story: 'The Crystal Kingdom has lost its magic! You must complete three distinct missions (Addition, Subtraction, Multiplication) to restore power before facing the dragon.',
    character: 'Royal Alchemist Leo',
    icon: '🏰',
    themeColor: '#7209B7',
    bgGradient: 'from-[#4CC9F0] to-[#7209B7]',
    duration: '20–25 minutes',
    learningObjectives: [
      'Identify when to use Addition, Subtraction, or Multiplication based on context',
      'Solve multi-step real-life mathematical word problems',
      'Distinguish combining from separating from grouping',
      'Earn the Kingdom Hero Crest and unlock the Final Boss battle',
    ],
    scenes: [
      {
        id: 'l4-s1',
        sceneNumber: 1,
        timeRange: '0:00 – 1:00',
        title: 'Mission 1 — The Addition Shrine',
        voiceOverScript: '“You reach the first ancient tower. The gate needs 6 golden coins, and then 4 more silver coins to open the gate. Which operation brings two coin pouches together? 6 + 4 = 10!”',
        subtitle: 'Addition combines: 6 coins + 4 coins = 10 coins!',
        visualGraphic: 'kingdom_add',
      },
      {
        id: 'l4-s2',
        sceneNumber: 2,
        timeRange: '1:00 – 2:00',
        title: 'Mission 2 — The Subtraction Vault',
        voiceOverScript: '“Inside the vault, you start with 12 magical gems. A mysterious potion requires giving away 5 gems into the fountain. Subtraction finds what remains: 12 - 5 = 7 gems left!”',
        subtitle: 'Subtraction separates: 12 gems - 5 gems = 7 gems remaining.',
        visualGraphic: 'kingdom_sub',
      },
      {
        id: 'l4-s3',
        sceneNumber: 3,
        timeRange: '2:00 – 3:00',
        title: 'Mission 3 — The Multiplication Treasury',
        voiceOverScript: '“To light the kingdom beacons, you must fill 4 treasure chests with 3 gems each. Equal groups require multiplication: 4 chests × 3 gems = 12 gems in total!”',
        subtitle: 'Multiplication groups: 4 chests × 3 gems = 12 gems total.',
        visualGraphic: 'kingdom_mul',
      },
    ],
    exploreActivity: {
      title: 'Kingdom Operation Sorter',
      instructions: 'Drag problem cards to the correct operation cauldron (+, -, or ×). Watch the magical shield restore!',
      type: 'mixed_potion',
    },
    games: [
      { id: 'kingdom-puzzles', name: 'Kingdom Gates', type: 'Operation Choice', description: 'Choose whether a story needs +, -, or × to unlock the palace bridges!' },
    ],
    quizQuestions: [
      { prompt: 'Liam had 15 marbles and gave 6 to his brother. How many marbles does Liam have now?', choices: ['9', '21', '8', '11'], correct: '9', explanation: 'He gave them away, so subtract: 15 - 6 = 9.' },
      { prompt: 'A classroom has 4 tables with 5 chairs at each table. How many chairs are there?', choices: ['9', '20', '25', '15'], correct: '20', explanation: 'Equal groups of chairs: 4 × 5 = 20 chairs.' },
      { prompt: 'Ava collected 8 seashells in the morning and 7 seashells in the afternoon. Total seashells?', choices: ['14', '15', '16', '1'], correct: '15', explanation: 'Combining collections: 8 + 7 = 15 seashells.' },
      { prompt: 'Which problem requires MULTIPLICATION?', choices: ['Sharing 10 candies equally', '3 packs of 4 pencils each', 'Taking away 2 toys', 'Adding 5 and 3'], correct: '3 packs of 4 pencils each', explanation: 'Packs of equal items: 3 packs × 4 pencils = 12 pencils.' },
    ],
    unlockThreshold: 70,
    badgeName: 'Kingdom Guardian',
    xpReward: 140,
  },

  // ==========================================
  // LEVEL 5: MATHS CHAMPION (FINAL BOSS: THE MATHS DRAGON) 🐉
  // ==========================================
  {
    levelNumber: 5,
    id: 'maths-champion',
    title: 'Maths Champion · Final Boss',
    subtitle: 'The Maths Dragon',
    story: 'Scale the Dragon Peak and challenge Pyroth the Maths Dragon! Answer 10 progressive questions across 4 battle rounds to defeat the dragon, restore the kingdom, and claim the Master Champion Crest!',
    character: 'Pyroth the Dragon',
    icon: '🐉',
    themeColor: '#E63946',
    bgGradient: 'from-[#9D0208] to-[#03071E]',
    duration: '25–30 minutes',
    learningObjectives: [
      'Solve rapid single-digit mental calculations',
      'Compute two-digit carrying and borrowing calculations',
      'Interpret real-life contextual multi-step word problems',
      'Synthesize mixed operations (+, -, ×) in high-stakes problem solving',
    ],
    scenes: [
      {
        id: 'l5-s1',
        sceneNumber: 1,
        timeRange: '0:00 – 1:30',
        title: 'The Dragon Awakens',
        voiceOverScript: '“Roaaaar! I am Pyroth, guardian of mathematical truth! Only the cleverest minds can bypass my dragon fire. Test your knowledge across four epic rounds: calculations, word problems, and mixed mastery!”',
        subtitle: 'Pyroth challenges you! Answer correctly to deplete the dragon’s shield and claim victory.',
        visualGraphic: 'dragon_intro',
      },
    ],
    exploreActivity: {
      title: 'Dragon Battle Arena',
      instructions: 'Answer dragon trivia to cast water and ice spells that weaken the dragon shield!',
      type: 'dragon_battle',
    },
    games: [
      { id: 'maths-dragon-boss', name: 'The Maths Dragon', type: 'Boss Battle', description: 'Defeat the dragon in 4 rounds of progressive difficulty: single-digit, two-digit, word problems, and mixed operations!' },
    ],
    quizQuestions: [
      { prompt: 'Round 1: 9 + 8 = ?', choices: ['16', '17', '18', '15'], correct: '17', explanation: '9 + 8 = 17. Make a ten: 9 + 1 = 10, then 10 + 7 = 17.' },
      { prompt: 'Round 1: 14 − 6 = ?', choices: ['8', '7', '9', '20'], correct: '8', explanation: '14 − 6 = 8. Hop back 6 from 14.' },
      { prompt: 'Round 1: 3 groups of 2 = ?', choices: ['6', '5', '8', '32'], correct: '6', explanation: '2 + 2 + 2 = 6.' },
      { prompt: 'Round 2: 24 + 10 = ?', choices: ['34', '25', '44', '14'], correct: '34', explanation: 'Adding 10 adds one more ten: 24 + 10 = 34.' },
      { prompt: 'Round 2: 50 − 20 = ?', choices: ['30', '70', '48', '3'], correct: '30', explanation: '5 tens − 2 tens = 3 tens = 30.' },
      { prompt: 'Round 3: A tray has 2 rows of 5 cupcakes. How many cupcakes?', choices: ['10', '7', '12', '25'], correct: '10', explanation: '5 + 5 = 10 cupcakes.' },
      { prompt: 'Round 3: A bus has 12 children. 4 get off and 3 get on. How many now?', choices: ['11', '19', '9', '13'], correct: '11', explanation: '12 − 4 = 8, then 8 + 3 = 11.' },
      { prompt: 'Round 4: Which number has 6 tens and 2 ones?', choices: ['62', '26', '8', '602'], correct: '62', explanation: '6 tens = 60, plus 2 ones = 62.' },
      { prompt: 'Round 4: Which sum equals 15?', choices: ['8 + 7', '9 + 5', '6 + 6', '10 + 4'], correct: '8 + 7', explanation: '8 + 7 = 15.' },
      { prompt: 'Final Strike: 35 + 25 = ?', choices: ['60', '50', '510', '70'], correct: '60', explanation: 'Tens: 30 + 20 = 50. Ones: 5 + 5 = 10. 50 + 10 = 60!' },
    ],
    unlockThreshold: 70,
    badgeName: 'Maths Champion Dragon Slayer',
    xpReward: 250,
  },
];
