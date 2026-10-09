import type { PracticeQuestion, SyllabusChapter } from '../types';

export interface GradeInfo {
  id: string; // 'Grade 1', 'Grade 2', etc.
  name: string;
  gradeNumber: number;
  ageRange: string;
  badge: string;
  mathThemes: string[];
  scienceThemes: string[];
}

export const gradesList: GradeInfo[] = [
  {
    id: 'Grade 1',
    name: 'Grade 1 · Early Explorer',
    gradeNumber: 1,
    ageRange: 'Ages 5–7',
    badge: '🌱 Pioneer',
    mathThemes: ['Counting to 100', 'Basic Addition & Subtraction (under 20)', '2D Shapes', 'Telling Time'],
    scienceThemes: ['Living vs Non-Living', 'Five Senses', 'Animal Habitats', 'Day, Night & Weather'],
  },
  {
    id: 'Grade 2',
    name: 'Grade 2 · Junior Investigator',
    gradeNumber: 2,
    ageRange: 'Ages 6–8',
    badge: '🔍 Scout',
    mathThemes: ['Place Value (Tens & Ones)', 'Addition with Regrouping', 'Even & Odd', 'Money & Coins'],
    scienceThemes: ['Plant Parts & Life', 'Animal Diets', 'Solids & Liquids', 'Four Seasons'],
  },
  {
    id: 'Grade 3',
    name: 'Grade 3 · Math & Nature Seeker',
    gradeNumber: 3,
    ageRange: 'Ages 7–9',
    badge: '⭐ Navigator',
    mathThemes: ['Multiplication Tables', 'Division as Sharing', 'Intro to Fractions', 'Perimeter of Polygons'],
    scienceThemes: ['Life Cycles (Frog & Butterfly)', 'States of Matter', 'Magnets & Forces', 'Solar System Intro'],
  },
  {
    id: 'Grade 4',
    name: 'Grade 4 · Discovery Scholar',
    gradeNumber: 4,
    ageRange: 'Ages 8–10',
    badge: '🚀 Adventurer',
    mathThemes: ['Multi-digit Multiplication', 'Long Division', 'Equivalent Fractions', 'Angles & Lines'],
    scienceThemes: ['Food Chains & Energy', 'Sound Waves & Vibrations', 'Earth Erosion', 'Simple Circuits'],
  },
  {
    id: 'Grade 5',
    name: 'Grade 5 · Conceptual Master',
    gradeNumber: 5,
    ageRange: 'Ages 9–11',
    badge: '🪐 Trailblazer',
    mathThemes: ['Adding Unlike Fractions', 'Decimals to Hundredths', 'Volume of 3D Prisms', 'Coordinate Grid'],
    scienceThemes: ['Human Body Systems', 'Photosynthesis', 'Water Cycle', 'Gravity & Orbits'],
  },
  {
    id: 'Grade 6',
    name: 'Grade 6 · Logic Voyager',
    gradeNumber: 6,
    ageRange: 'Ages 10–12',
    badge: '⚡ Strategist',
    mathThemes: ['Ratios & Unit Rates', 'Dividing Fractions', 'Negative Numbers on Number Line', 'Algebraic Expressions'],
    scienceThemes: ['Cell Biology (Organelles)', 'Light (Reflection & Refraction)', 'Heat Transfer', 'Ecosystems & Biomes'],
  },
  {
    id: 'Grade 7',
    name: 'Grade 7 · Scientific Thinker',
    gradeNumber: 7,
    ageRange: 'Ages 11–13',
    badge: '🔮 Alchemist',
    mathThemes: ['Integer Operations', 'Proportions & Percentages', 'One-Step Linear Equations', 'Circle Area & Circumference'],
    scienceThemes: ['Genetics & DNA Intro', 'Newton’s Laws of Motion', 'Atoms & Elements', 'Plate Tectonics'],
  },
  {
    id: 'Grade 8',
    name: 'Grade 8 · Pre-Mastery Champion',
    gradeNumber: 8,
    ageRange: 'Ages 12–14',
    badge: '🛡️ Guardian',
    mathThemes: ['Slope-Intercept (y = mx + b)', 'Pythagorean Theorem', 'Scientific Notation & Exponents', 'Cylinder & Cone Volume'],
    scienceThemes: ['Wave Frequency & Amplitude', 'The Periodic Table', 'Chemical Reactions', 'Evolution & Adaptation'],
  },
  {
    id: 'Grade 9',
    name: 'Grade 9 · Advanced Analyst',
    gradeNumber: 9,
    ageRange: 'Ages 13–15',
    badge: '🎓 Scholar',
    mathThemes: ['Quadratic Factoring', 'Coordinate Geometry', 'Polynomial Operations', 'Compound Probability'],
    scienceThemes: ['Atomic Orbitals & Valence', 'Forces & Momentum', 'Cell Division (Mitosis & Meiosis)', 'Universal Gravitation'],
  },
  {
    id: 'Grade 10',
    name: 'Grade 10 · High School Virtuoso',
    gradeNumber: 10,
    ageRange: 'Ages 14–16',
    badge: '👑 Master',
    mathThemes: ['Trigonometry (sin, cos, tan)', 'Quadratic Formula', 'Circle Tangents', 'Statistics & Standard Deviation'],
    scienceThemes: ['Balancing Chemical Equations', 'Electricity & Ohm’s Law', 'Optics & Lenses', 'Electromagnetism'],
  },
];

// Comprehensive grade-mapped question bank: Every grade has verified syllabus questions
export const fullGradeQuestions: PracticeQuestion[] = [
  // ==========================================
  // GRADE 1 QUESTIONS
  // ==========================================
  {
    id: 'g1-math-1',
    subject: 'Math',
    grade: 'Grade 1',
    gradeLevel: 'Grade 1',
    topic: 'Addition to 10',
    chapter: 'Chapter 1: Counting & Basic Addition',
    q: 'Mia has 3 red apples in her basket. Her friend gives her 2 green apples. How many apples does Mia have altogether?',
    choices: ['4 apples', '5 apples', '6 apples', '3 apples'],
    answer: '5 apples',
    why: 'When you combine 3 apples and 2 more apples, you count forward: 3... 4, 5. So 3 + 2 = 5.',
    clueHint: 'Start counting at 3, then hop 2 times forward on your fingers: 4, 5!',
    realLifeExample: {
      headline: 'Filling the Apple Basket',
      scenario: 'You pick 3 apples from one branch, then pick 2 from another branch. Count them together in your basket: 1, 2, 3, 4, 5!',
      takeaway: 'Addition means putting two groups together into one bigger group.',
    },
    misconceptions: {
      '4 apples': {
        studentAnswer: '4 apples',
        misconception: 'Counting only one extra object.',
        whyWrong: 'You only added 1 more apple instead of 2. Count two steps forward from 3: 4, 5.',
        keyRule: 'Count one step for each new item: +1 is 4, +2 is 5.',
      },
      '6 apples': {
        studentAnswer: '6 apples',
        misconception: 'Double counting or skipping ahead.',
        whyWrong: 'Counting too many! 3 + 2 makes 5, not 6.',
        keyRule: 'Touch each apple once as you count.',
      },
      '3 apples': {
        studentAnswer: '3 apples',
        misconception: 'Forgetting to add the new apples.',
        whyWrong: '3 was just the starting number. Mia received 2 more, so the total must increase.',
        keyRule: 'When someone gives you more, the total gets bigger.',
      },
    },
  },
  {
    id: 'g1-math-2',
    subject: 'Math',
    grade: 'Grade 1',
    gradeLevel: 'Grade 1',
    topic: '2D Shapes',
    chapter: 'Chapter 2: Shapes & Patterns',
    q: 'Which shape has exactly 3 sides and 3 corners?',
    choices: ['Square', 'Triangle', 'Circle', 'Rectangle'],
    answer: 'Triangle',
    why: 'A triangle is a 2D shape with 3 straight sides and 3 sharp corners (vertices). "Tri" means three!',
    clueHint: 'Think of a slice of pizza or the roof of a house!',
    realLifeExample: {
      headline: 'A Slice of Birthday Cake',
      scenario: 'Look at a cut slice of pizza: it has 3 straight sides that meet at 3 points. That is a triangle!',
      takeaway: 'Triangles always have 3 sides and 3 corners.',
    },
    misconceptions: {
      'Square': {
        studentAnswer: 'Square',
        misconception: 'Confusing 3 sides with 4 equal sides.',
        whyWrong: 'A square has 4 sides and 4 corners, not 3.',
        keyRule: 'Squares have 4 equal sides; triangles have 3.',
      },
      'Circle': {
        studentAnswer: 'Circle',
        misconception: 'Thinking round shapes count as having corners.',
        whyWrong: 'A circle has 0 straight sides and 0 sharp corners — it is completely curved.',
        keyRule: 'Circles are round with zero corners.',
      },
      'Rectangle': {
        studentAnswer: 'Rectangle',
        misconception: 'Mistaking 4 sides for 3.',
        whyWrong: 'A rectangle has 4 sides (2 long, 2 short).',
        keyRule: 'Rectangles have 4 sides; triangles have 3.',
      },
    },
  },
  {
    id: 'g1-sci-1',
    subject: 'Science',
    grade: 'Grade 1',
    gradeLevel: 'Grade 1',
    topic: 'Living vs Non-Living',
    chapter: 'Chapter 1: The Living World',
    q: 'Which of the following is a living thing that needs water and food to grow?',
    choices: ['A toy car', 'A puppy dog', 'A wooden table', 'A plastic block'],
    answer: 'A puppy dog',
    why: 'Puppies are living animals! They breathe air, drink water, eat food, and grow bigger over time.',
    clueHint: 'Which one can run, bark, and grows bigger every month?',
    realLifeExample: {
      headline: 'Feeding Your Pet',
      scenario: 'A toy car can sit in a toy box forever without needing water. But a puppy needs food and water every day because it is alive!',
      takeaway: 'Living things need water, food, and air to survive and grow.',
    },
    misconceptions: {
      'A toy car': {
        studentAnswer: 'A toy car',
        misconception: 'Thinking moving things are always alive.',
        whyWrong: 'A toy car moves only when you push it or with batteries. It doesn’t eat, drink, or grow.',
        keyRule: 'Non-living things do not eat, drink, breathe, or grow.',
      },
      'A wooden table': {
        studentAnswer: 'A wooden table',
        misconception: 'Confusing wood from a tree with a living animal.',
        whyWrong: 'While wood came from a tree, the wooden table is now non-living furniture that cannot grow or eat.',
        keyRule: 'Living things are actively alive and growing.',
      },
      'A plastic block': {
        studentAnswer: 'A plastic block',
        misconception: 'Picking a human-made object.',
        whyWrong: 'Plastic blocks are inanimate objects made in a factory; they do not need food or water.',
        keyRule: 'Toys are non-living objects.',
      },
    },
  },

  // ==========================================
  // GRADE 2 QUESTIONS
  // ==========================================
  {
    id: 'g2-math-1',
    subject: 'Math',
    grade: 'Grade 2',
    gradeLevel: 'Grade 2',
    topic: 'Place Value',
    chapter: 'Chapter 1: Tens and Ones',
    q: 'In the number 47, what does the digit 4 represent?',
    choices: ['4 ones (4)', '4 tens (40)', '4 hundreds (400)', '7 tens (70)'],
    answer: '4 tens (40)',
    why: 'In a two-digit number, the first digit is the tens place. 4 tens equals 40. The 7 is in the ones place (7). 40 + 7 = 47.',
    clueHint: 'Look at which column the 4 is in: tens or ones?',
    realLifeExample: {
      headline: 'Counting Ten-Dollar Bills',
      scenario: 'If you have 4 ten-dollar bills and 7 one-dollar coins, you have $40 + $7 = $47!',
      takeaway: 'The tens place counts bundles of 10.',
    },
    misconceptions: {
      '4 ones (4)': {
        studentAnswer: '4 ones (4)',
        misconception: 'Ignoring place value position.',
        whyWrong: 'The 4 is in the left tens column, meaning 4 groups of ten (40), not just 4 single units.',
        keyRule: 'Left column in 2-digit numbers is tens; right column is ones.',
      },
      '4 hundreds (400)': {
        studentAnswer: '4 hundreds (400)',
        misconception: 'Jumping to hundreds place too early.',
        whyWrong: '47 only has two digits, so there is no hundreds place. 4 tens is 40.',
        keyRule: 'Hundreds need a 3-digit number like 470.',
      },
      '7 tens (70)': {
        studentAnswer: '7 tens (70)',
        misconception: 'Swapping the digits.',
        whyWrong: '7 is the ones digit, not the tens digit.',
        keyRule: 'Read left to right: Tens first, then Ones.',
      },
    },
  },
  {
    id: 'g2-sci-1',
    subject: 'Science',
    grade: 'Grade 2',
    gradeLevel: 'Grade 2',
    topic: 'Plant Needs',
    chapter: 'Chapter 1: Plant Life',
    q: 'Which part of a plant grows down into the soil to absorb water and nutrients?',
    choices: ['Leaves', 'Roots', 'Flowers', 'Petals'],
    answer: 'Roots',
    why: 'Roots grow downward into the soil like anchors to drink water and pull in healthy minerals for the plant.',
    clueHint: 'Think of the underground part holding the tree steady in the wind!',
    realLifeExample: {
      headline: 'Watering Houseplants',
      scenario: 'When you pour water on the dirt in a plant pot, the roots soak it up like tiny straws and send it up the stem!',
      takeaway: 'Roots absorb water from soil and keep the plant firmly anchored.',
    },
    misconceptions: {
      'Leaves': {
        studentAnswer: 'Leaves',
        misconception: 'Thinking leaves drink the poured water.',
        whyWrong: 'Leaves capture sunlight from above, while roots absorb moisture from below in the dirt.',
        keyRule: 'Roots drink underground water; leaves catch sunlight.',
      },
      'Flowers': {
        studentAnswer: 'Flowers',
        misconception: 'Confusing bright plant parts.',
        whyWrong: 'Flowers help plants produce seeds; they do not grow in the soil to absorb water.',
        keyRule: 'Flowers make seeds and attract bees.',
      },
      'Petals': {
        studentAnswer: 'Petals',
        misconception: 'Picking colorful flower petals.',
        whyWrong: 'Petals are the colorful parts of the flower, located high above the ground.',
        keyRule: 'Roots are the underground drinking straws.',
      },
    },
  },

  // ==========================================
  // GRADE 3 QUESTIONS
  // ==========================================
  {
    id: 'g3-math-1',
    subject: 'Math',
    grade: 'Grade 3',
    gradeLevel: 'Grade 3',
    topic: 'Multiplication as Equal Groups',
    chapter: 'Chapter 1: Equal Groups & Multiplication',
    q: 'There are 4 baskets. Each basket has 3 oranges inside. How many oranges are there in total?',
    choices: ['7 oranges', '12 oranges', '10 oranges', '1 orange'],
    answer: '12 oranges',
    why: '4 groups of 3 oranges equals 3 + 3 + 3 + 3 = 12. We write this as 4 × 3 = 12.',
    clueHint: 'Add 3 four times: 3 + 3 + 3 + 3 = ?',
    realLifeExample: {
      headline: 'Packing Lunch Boxes',
      scenario: 'If 4 friends each get 3 cookies, you count 3, 6, 9, 12 cookies in all! Multiplication is fast repeated addition.',
      takeaway: 'Number of groups × items per group = total.',
    },
    misconceptions: {
      '7 oranges': {
        studentAnswer: '7 oranges',
        misconception: 'Adding the two numbers (4 + 3) instead of multiplying.',
        whyWrong: 'You added 4 + 3. But there are 4 groups with 3 in EACH group, so you must multiply 4 × 3.',
        keyRule: 'Equal groups means multiplication, not simple addition.',
      },
      '10 oranges': {
        studentAnswer: '10 oranges',
        misconception: 'Arithmetic error in skip counting.',
        whyWrong: 'Skip counting by 3: 3, 6, 9, 12. Not 10!',
        keyRule: 'Skip counting by 3s: 3, 6, 9, 12.',
      },
      '1 orange': {
        studentAnswer: '1 orange',
        misconception: 'Subtracting 4 - 3.',
        whyWrong: 'We are finding the total of all baskets, not finding the difference.',
        keyRule: 'Total of equal groups requires multiplication.',
      },
    },
  },
  {
    id: 'g3-sci-1',
    subject: 'Science',
    grade: 'Grade 3',
    gradeLevel: 'Grade 3',
    topic: 'States of Matter',
    chapter: 'Chapter 2: Matter & Changes',
    q: 'What state of matter has a definite shape and volume that does not easily change when moved?',
    choices: ['Solid', 'Liquid', 'Gas', 'Plasma'],
    answer: 'Solid',
    why: 'A solid (like a wooden block or stone) keeps its shape and volume because its molecules are packed tightly together.',
    clueHint: 'Can you hold a stone in your hand without it flowing through your fingers?',
    realLifeExample: {
      headline: 'An Ice Cube vs Liquid Water',
      scenario: 'An ice cube keeps its cube shape until it melts. When it becomes liquid water, it flows and takes the shape of whatever cup you pour it in!',
      takeaway: 'Solids hold their own fixed shape.',
    },
    misconceptions: {
      'Liquid': {
        studentAnswer: 'Liquid',
        misconception: 'Thinking liquids keep their shape.',
        whyWrong: 'Liquids have a definite volume, but they change shape to fit whatever container holds them.',
        keyRule: 'Liquids flow and take the shape of their container.',
      },
      'Gas': {
        studentAnswer: 'Gas',
        misconception: 'Confusing gas with solid.',
        whyWrong: 'A gas expands to fill any room or balloon; it has no fixed shape or volume.',
        keyRule: 'Gases spread out freely in all directions.',
      },
      'Plasma': {
        studentAnswer: 'Plasma',
        misconception: 'Picking an exotic state.',
        whyWrong: 'Plasma is super-heated ionized gas like lightning or the sun, not a rigid everyday shape.',
        keyRule: 'Everyday rigid objects are solids.',
      },
    },
  },

  // ==========================================
  // GRADE 4 QUESTIONS
  // ==========================================
  {
    id: 'g4-math-1',
    subject: 'Math',
    grade: 'Grade 4',
    gradeLevel: 'Grade 4',
    topic: 'Equivalent Fractions',
    chapter: 'Chapter 2: Fractions & Decimals',
    q: 'Which fraction is equivalent (equal in value) to 2/4?',
    choices: ['1/3', '1/2', '3/4', '2/3'],
    answer: '1/2',
    why: 'Divide both the top (numerator) and bottom (denominator) by 2: 2÷2 = 1, and 4÷2 = 2. So 2/4 = 1/2.',
    clueHint: 'If you eat 2 out of 4 pizza slices, you have eaten exactly half the pizza!',
    realLifeExample: {
      headline: 'Folding a Paper in Four',
      scenario: 'Fold a paper in half, then fold it in half again to make 4 equal squares. Coloring 2 squares covers exactly half the sheet!',
      takeaway: 'Equivalent fractions represent the exact same portion of a whole.',
    },
    misconceptions: {
      '1/3': {
        studentAnswer: '1/3',
        misconception: 'Subtracting 1 from numerator and denominator.',
        whyWrong: 'Fractions scale by multiplying or dividing, not by subtracting numbers.',
        keyRule: 'To find equivalent fractions, multiply or divide top and bottom by the same number.',
      },
      '3/4': {
        studentAnswer: '3/4',
        misconception: 'Confusing 2/4 with three-quarters.',
        whyWrong: '3/4 is three pieces out of four, which is bigger than two pieces out of four.',
        keyRule: '2/4 is exactly half; 3/4 is more than half.',
      },
      '2/3': {
        studentAnswer: '2/3',
        misconception: 'Looking only at the numerator 2.',
        whyWrong: '2/3 means 2 out of 3 pieces (about 67%), while 2/4 is 50%.',
        keyRule: 'Compare relative values: 2/4 = 1/2.',
      },
    },
  },
  {
    id: 'g4-sci-1',
    subject: 'Science',
    grade: 'Grade 4',
    gradeLevel: 'Grade 4',
    topic: 'Energy & Electrical Circuits',
    chapter: 'Chapter 3: Energy & Circuits',
    q: 'For a lightbulb to turn ON in a battery circuit, what kind of circuit must be formed?',
    choices: [
      'A closed, complete loop without breaks',
      'An open circuit with a gap in the wire',
      'A circuit without any battery or power source',
      'A broken wire circuit'
    ],
    answer: 'A closed, complete loop without breaks',
    why: 'Electric current can only flow when there is an unbroken, closed loop from the battery, through the bulb, and back to the battery.',
    clueHint: 'Think of a bridge: if the bridge is open or broken, cars cannot cross!',
    realLifeExample: {
      headline: 'Turning on the Room Light Switch',
      scenario: 'When you flip a light switch on, you connect the metal contacts inside the wall, closing the circuit so electricity can flow into the bulb!',
      takeaway: 'Electricity needs a complete, closed path to flow.',
    },
    misconceptions: {
      'An open circuit with a gap in the wire': {
        studentAnswer: 'An open circuit with a gap in the wire',
        misconception: 'Thinking "open" means active like an open door.',
        whyWrong: 'In electrical circuits, "open" means disconnected! Electricity cannot jump through a gap in the wire.',
        keyRule: 'Closed circuit = ON. Open circuit = OFF.',
      },
      'A circuit without any battery or power source': {
        studentAnswer: 'A circuit without any battery or power source',
        misconception: 'Believing bulbs generate their own power.',
        whyWrong: 'The battery provides the voltage and electrons needed to push power through the bulb.',
        keyRule: 'A circuit requires an energy source like a battery.',
      },
      'A broken wire circuit': {
        studentAnswer: 'A broken wire circuit',
        misconception: 'Thinking electricity can flow through air gaps.',
        whyWrong: 'A break in the wire stops the electron flow immediately, turning the bulb off.',
        keyRule: 'Current stops at any break in the loop.',
      },
    },
  },

  // ==========================================
  // GRADE 5 QUESTIONS
  // ==========================================
  {
    id: 'g5-math-1',
    subject: 'Math',
    grade: 'Grade 5',
    gradeLevel: 'Grade 5',
    topic: 'Adding Unlike Fractions',
    chapter: 'Chapter 1: Fractions & Decimals',
    q: 'What is the sum of 1/2 + 1/4?',
    choices: ['2/6', '3/4', '2/4', '1/6'],
    answer: '3/4',
    why: 'Find the common denominator (4). 1/2 is equivalent to 2/4. Now add: 2/4 + 1/4 = 3/4.',
    clueHint: 'Convert 1/2 into fourths: how many fourths make one half?',
    realLifeExample: {
      headline: 'Measuring Baking Cups',
      scenario: 'If a cake recipe calls for 1/2 cup of milk and you add 1/4 cup more, you have 2/4 + 1/4 = 3/4 cup of milk in the mixing bowl!',
      takeaway: 'Always find a common denominator before adding fraction numerators.',
    },
    misconceptions: {
      '2/6': {
        studentAnswer: '2/6',
        misconception: 'Adding numerators together and denominators together: (1+1)/(2+4).',
        whyWrong: 'This is the most common fraction mistake! You cannot add denominators together because denominators describe the piece size, not the quantity.',
        keyRule: 'Never add denominators! Convert to a common denominator first.',
      },
      '2/4': {
        studentAnswer: '2/4',
        misconception: 'Forgetting the 1/4.',
        whyWrong: '2/4 is just 1/2 by itself. You forgot to add the extra 1/4!',
        keyRule: '2/4 + 1/4 = 3/4.',
      },
      '1/6': {
        studentAnswer: '1/6',
        misconception: 'Multiplying denominators and keeping numerator 1.',
        whyWrong: '1/6 is smaller than 1/2! Adding positive fractions must make the total larger.',
        keyRule: 'Adding two positive numbers always results in a larger value.',
      },
    },
  },
  {
    id: 'g5-sci-1',
    subject: 'Science',
    grade: 'Grade 5',
    gradeLevel: 'Grade 5',
    topic: 'Earth’s Water Cycle',
    chapter: 'Chapter 2: Earth & Space Systems',
    q: 'When liquid water on Earth absorbs heat from the Sun and turns into invisible water vapor in the sky, what is this called?',
    choices: ['Precipitation', 'Evaporation', 'Condensation', 'Runoff'],
    answer: 'Evaporation',
    why: 'Evaporation occurs when solar thermal energy warms surface water, causing molecules to move faster and escape as water vapor gas into the air.',
    clueHint: 'What happens to a shallow puddle of water on the sidewalk on a hot sunny day?',
    realLifeExample: {
      headline: 'The Disappearing Rain Puddle',
      scenario: 'After a morning rain, puddles form on the playground. By afternoon, the hot sun has warmed the water, turning it into vapor that rises into clouds!',
      takeaway: 'Evaporation: Liquid water + Sun heat = Water vapor gas.',
    },
    misconceptions: {
      'Precipitation': {
        studentAnswer: 'Precipitation',
        misconception: 'Confusing water going UP with rain falling DOWN.',
        whyWrong: 'Precipitation is rain, snow, or hail falling down from clouds to the ground.',
        keyRule: 'Precipitation = Falling rain. Evaporation = Rising vapor.',
      },
      'Condensation': {
        studentAnswer: 'Condensation',
        misconception: 'Confusing cloud formation with vapor rising.',
        whyWrong: 'Condensation happens up in cold air when gas cools back down into liquid cloud droplets.',
        keyRule: 'Condensation turns gas into liquid; evaporation turns liquid into gas.',
      },
      'Runoff': {
        studentAnswer: 'Runoff',
        misconception: 'Confusing ground flow with atmospheric rising.',
        whyWrong: 'Runoff is water flowing across the ground downhill into streams and rivers.',
        keyRule: 'Runoff flows on the ground; evaporation rises into the sky.',
      },
    },
  },

  // ==========================================
  // GRADE 6 QUESTIONS
  // ==========================================
  {
    id: 'g6-math-1',
    subject: 'Math',
    grade: 'Grade 6',
    gradeLevel: 'Grade 6',
    topic: 'Ratios & Unit Rates',
    chapter: 'Chapter 1: Ratios & Proportions',
    q: 'A cyclist travels 36 miles in 3 hours at a constant speed. What is the unit rate (miles per hour)?',
    choices: ['12 miles per hour', '108 miles per hour', '33 miles per hour', '9 miles per hour'],
    answer: '12 miles per hour',
    why: 'Unit rate is found by dividing total miles by total hours: 36 ÷ 3 = 12 miles per hour.',
    clueHint: 'How many miles does the cyclist travel in just 1 hour? Divide 36 by 3!',
    realLifeExample: {
      headline: 'Car Speedometer',
      scenario: 'If a car drives 120 miles in 2 hours, the speedometer reads 120 ÷ 2 = 60 mph. Unit rate means per ONE unit of time!',
      takeaway: 'Unit rate = total quantity ÷ total units.',
    },
    misconceptions: {
      '108 miles per hour': {
        studentAnswer: '108 miles per hour',
        misconception: 'Multiplying 36 × 3 instead of dividing.',
        whyWrong: 'To find the speed per 1 hour, you must divide the total distance across the 3 hours, not multiply.',
        keyRule: 'Unit rate requires division: Distance ÷ Time.',
      },
      '33 miles per hour': {
        studentAnswer: '33 miles per hour',
        misconception: 'Subtracting 36 - 3.',
        whyWrong: 'Subtracting distance minus time does not give speed.',
        keyRule: 'Rate of speed is a ratio calculated by division.',
      },
      '9 miles per hour': {
        studentAnswer: '9 miles per hour',
        misconception: 'Arithmetic error in division.',
        whyWrong: '36 ÷ 4 is 9, but here we are dividing by 3 hours: 36 ÷ 3 = 12.',
        keyRule: '3 × 12 = 36.',
      },
    },
  },
  {
    id: 'g6-sci-1',
    subject: 'Science',
    grade: 'Grade 6',
    gradeLevel: 'Grade 6',
    topic: 'Cell Biology',
    chapter: 'Chapter 1: Cells — The Building Blocks of Life',
    q: 'Which organelle is known as the "powerhouse of the cell" because it produces energy (ATP)?',
    choices: ['Mitochondria', 'Nucleus', 'Cell Wall', 'Vacuole'],
    answer: 'Mitochondria',
    why: 'Mitochondria perform cellular respiration, breaking down glucose molecules to generate ATP energy for cellular functions.',
    clueHint: 'Think of the tiny cellular generator creating power for every living muscle in your body!',
    realLifeExample: {
      headline: 'Muscle Energy During a Sprint',
      scenario: 'When you sprint in gym class, your muscle cells need rapid energy. Thousands of mitochondria in each muscle cell work overtime burning sugar into fuel!',
      takeaway: 'Mitochondria convert nutrients into ATP energy for the cell.',
    },
    misconceptions: {
      'Nucleus': {
        studentAnswer: 'Nucleus',
        misconception: 'Confusing the control center with the energy producer.',
        whyWrong: 'The nucleus is the cell’s "control center" containing DNA instructions, not the energy power plant.',
        keyRule: 'Nucleus = DNA & instructions; Mitochondria = energy generator.',
      },
      'Cell Wall': {
        studentAnswer: 'Cell Wall',
        misconception: 'Confusing structure with energy generation.',
        whyWrong: 'The cell wall provides rigid shape and protection in plant cells; it does not produce energy.',
        keyRule: 'Cell wall = structural shield.',
      },
      'Vacuole': {
        studentAnswer: 'Vacuole',
        misconception: 'Confusing storage with energy production.',
        whyWrong: 'Vacuoles store water, nutrients, and waste products.',
        keyRule: 'Vacuole = storage tank.',
      },
    },
  },

  // ==========================================
  // GRADE 7 QUESTIONS
  // ==========================================
  {
    id: 'g7-math-1',
    subject: 'Math',
    grade: 'Grade 7',
    gradeLevel: 'Grade 7',
    topic: 'Operations with Negative Integers',
    chapter: 'Chapter 1: The Number System',
    q: 'Evaluate the expression: (-8) + (-5) - (-3)',
    choices: ['-10', '-16', '-6', '0'],
    answer: '-10',
    why: '(-8) + (-5) = -13. Subtracting a negative is the same as adding a positive: -13 - (-3) = -13 + 3 = -10.',
    clueHint: 'Remember: subtracting a negative number flips into an addition! (- - = +)',
    realLifeExample: {
      headline: 'Sub-Zero Winter Thermometer',
      scenario: 'The temperature is -8°C. It drops 5 more degrees to -13°C. Then the wind stops and removes 3 degrees of cold (- -3 = +3), bringing the temperature to -10°C.',
      takeaway: 'Subtracting a negative quantity is equivalent to adding a positive.',
    },
    misconceptions: {
      '-16': {
        studentAnswer: '-16',
        misconception: 'Treating the last subtraction as adding more negative: -13 - 3 = -16.',
        whyWrong: 'Subtracting a negative (- (-3)) becomes +3! So -13 + 3 = -10, not -16.',
        keyRule: 'Two negative signs in a row become a plus: a - (-b) = a + b.',
      },
      '-6': {
        studentAnswer: '-6',
        misconception: 'Arithmetic sign confusion.',
        whyWrong: '-8 - 5 is -13, not -9.',
        keyRule: 'Adding two negatives makes a deeper negative: -8 + -5 = -13.',
      },
      '0': {
        studentAnswer: '0',
        misconception: 'Assuming negative signs cancel out to zero.',
        whyWrong: 'Numbers do not cancel to zero unless they are exact opposites like +10 and -10.',
        keyRule: 'Follow order of operations left to right.',
      },
    },
  },
  {
    id: 'g7-sci-1',
    subject: 'Science',
    grade: 'Grade 7',
    gradeLevel: 'Grade 7',
    topic: 'Newton’s Laws of Motion',
    chapter: 'Chapter 2: Forces & Motion',
    q: 'According to Newton’s First Law of Motion, what will an object moving at constant speed in deep space do if no external force acts on it?',
    choices: [
      'Continue moving at the exact same speed and direction forever',
      'Slow down and eventually stop on its own',
      'Turn into a circle automatically',
      'Speed up faster and faster indefinitely'
    ],
    answer: 'Continue moving at the exact same speed and direction forever',
    why: 'Inertia states that an object in motion remains in motion with constant velocity unless acted upon by an unbalanced external force (like friction or gravity).',
    clueHint: 'In the vacuum of deep space, there is no air friction to slow anything down!',
    realLifeExample: {
      headline: 'Voyager 1 Space Probe',
      scenario: 'NASA launched Voyager 1 in 1977. Its main engines turned off decades ago, but it continues gliding through interstellar space at over 38,000 mph without burning any fuel!',
      takeaway: 'Objects do not need constant force to keep moving; they only need force to change speed or direction.',
    },
    misconceptions: {
      'Slow down and eventually stop on its own': {
        studentAnswer: 'Slow down and eventually stop on its own',
        misconception: 'Aristotelian everyday bias from Earth friction.',
        whyWrong: 'On Earth, sliding objects stop only because of friction with the floor or air. In space without friction, they never stop!',
        keyRule: 'Friction stops things on Earth; without friction, inertia maintains constant motion.',
      },
      'Turn into a circle automatically': {
        studentAnswer: 'Turn into a circle automatically',
        misconception: 'Believing space naturally curves motion.',
        whyWrong: 'Motion stays in a straight line unless gravity or another force pulls it into a curve.',
        keyRule: 'Straight-line motion is the default state of inertia.',
      },
      'Speed up faster and faster indefinitely': {
        studentAnswer: 'Speed up faster and faster indefinitely',
        misconception: 'Thinking zero resistance accelerates objects.',
        whyWrong: 'Acceleration requires an active net force (F = ma). Without thrust or gravity, speed remains constant.',
        keyRule: 'Constant speed requires zero net force.',
      },
    },
  },

  // ==========================================
  // GRADE 8 QUESTIONS
  // ==========================================
  {
    id: 'g8-math-1',
    subject: 'Math',
    grade: 'Grade 8',
    gradeLevel: 'Grade 8',
    topic: 'Pythagorean Theorem',
    chapter: 'Chapter 3: Geometry & Theorems',
    q: 'A right-angled triangle has legs of length a = 3 cm and b = 4 cm. What is the length of the hypotenuse c?',
    choices: ['7 cm', '5 cm', '12 cm', '25 cm'],
    answer: '5 cm',
    why: 'By the Pythagorean theorem: a² + b² = c². 3² + 4² = 9 + 16 = 25. Therefore, c = √25 = 5 cm.',
    clueHint: 'Square both legs, add the squares together, and take the square root: √(9 + 16)!',
    realLifeExample: {
      headline: 'Walking Diagonally Across a City Park',
      scenario: 'Walking 3 blocks east and 4 blocks north equals 7 blocks around the edge. But cutting straight diagonally through the park is only 5 blocks!',
      takeaway: 'In a right triangle, a² + b² = c² calculates diagonal distance.',
    },
    misconceptions: {
      '7 cm': {
        studentAnswer: '7 cm',
        misconception: 'Adding the side lengths directly: 3 + 4 = 7.',
        whyWrong: 'The hypotenuse is the shortest straight-line diagonal, so it must be shorter than the perimeter sum (3 + 4 = 7).',
        keyRule: 'You must square the legs before adding: a² + b² = c².',
      },
      '25 cm': {
        studentAnswer: '25 cm',
        misconception: 'Forgetting to take the square root of c².',
        whyWrong: '25 is c², not c! You must take the square root: √25 = 5.',
        keyRule: 'Don’t forget the final step: c = √(a² + b²).',
      },
      '12 cm': {
        studentAnswer: '12 cm',
        misconception: 'Multiplying 3 × 4.',
        whyWrong: '3 × 4 is the area multiplier, not the hypotenuse formula.',
        keyRule: 'Use a² + b² = c².',
      },
    },
  },
  {
    id: 'g8-sci-1',
    subject: 'Science',
    grade: 'Grade 8',
    gradeLevel: 'Grade 8',
    topic: 'Chemical vs Physical Changes',
    chapter: 'Chapter 1: Atoms & Chemical Reactions',
    q: 'Which of the following represents a chemical change where new substances with different bonds are formed?',
    choices: [
      'Iron rusting into iron oxide (rust) when exposed to oxygen and water',
      'Ice melting into liquid water',
      'Tearing a sheet of paper into small pieces',
      'Dissolving sugar into a cup of warm tea'
    ],
    answer: 'Iron rusting into iron oxide (rust) when exposed to oxygen and water',
    why: 'Rusting is a chemical reaction (oxidation) where iron atoms bond with oxygen molecules to create a brand new chemical compound (Fe2O3).',
    clueHint: 'Which process changes the actual molecular identity and cannot be easily undone by freezing or evaporating?',
    realLifeExample: {
      headline: 'An Old Rusty Bicycle in the Garden',
      scenario: 'If you leave an iron nail or bicycle in wet grass, it turns reddish-brown and brittle. You cannot simply wipe the rust back into shiny iron because the chemical bonds permanently changed!',
      takeaway: 'Chemical changes create new substances with new chemical properties.',
    },
    misconceptions: {
      'Ice melting into liquid water': {
        studentAnswer: 'Ice melting into liquid water',
        misconception: 'Confusing state of matter changes with chemical reactions.',
        whyWrong: 'Melting is a physical change! The molecules remain H2O whether frozen solid or flowing liquid.',
        keyRule: 'Phase changes (melting, boiling, freezing) are always physical changes.',
      },
      'Tearing a sheet of paper into small pieces': {
        studentAnswer: 'Tearing a sheet of paper into small pieces',
        misconception: 'Confusing physical alteration with chemical reaction.',
        whyWrong: 'Tearing paper changes only shape and size. The chemical cellulose fibers remain unchanged.',
        keyRule: 'Cutting or tearing is physical, not chemical.',
      },
      'Dissolving sugar into a cup of warm tea': {
        studentAnswer: 'Dissolving sugar into a cup of warm tea',
        misconception: 'Thinking disappearing crystals means a new compound formed.',
        whyWrong: 'Dissolving is physical: if you evaporate the tea, the sweet sugar crystals reappear.',
        keyRule: 'Dissolving is a physical mixture.',
      },
    },
  },

  // ==========================================
  // GRADE 9 QUESTIONS
  // ==========================================
  {
    id: 'g9-math-1',
    subject: 'Math',
    grade: 'Grade 9',
    gradeLevel: 'Grade 9',
    topic: 'Quadratic Equations',
    chapter: 'Chapter 2: Algebra & Quadratic Equations',
    q: 'What are the solutions (roots) to the equation x² - 5x + 6 = 0?',
    choices: ['x = 2 and x = 3', 'x = -2 and x = -3', 'x = 1 and x = 6', 'x = -1 and x = -6'],
    answer: 'x = 2 and x = 3',
    why: 'Factor the quadratic: (x - 2)(x - 3) = 0. Setting each factor to zero gives x - 2 = 0 → x = 2, and x - 3 = 0 → x = 3.',
    clueHint: 'Look for two numbers that multiply to +6 and add up to -5: (-2) × (-3) = +6 and (-2) + (-3) = -5!',
    realLifeExample: {
      headline: 'Trajectory of a Basketball Shot',
      scenario: 'The path of a basketball is a parabola: y = -x² + 5x - 6. The roots x = 2 and x = 3 tell you where the ball crosses the hoop height line!',
      takeaway: 'Factoring quadratic trinomials identifies when the equation equals zero.',
    },
    misconceptions: {
      'x = -2 and x = -3': {
        studentAnswer: 'x = -2 and x = -3',
        misconception: 'Forgetting to reverse signs when solving (x - 2) = 0.',
        whyWrong: 'The factored form is (x - 2)(x - 3) = 0. Solving x - 2 = 0 gives x = +2, not -2!',
        keyRule: 'If (x - a) = 0, the root is x = +a.',
      },
      'x = 1 and x = 6': {
        studentAnswer: 'x = 1 and x = 6',
        misconception: 'Picking numbers that multiply to 6 but fail the middle term.',
        whyWrong: '1 + 6 = 7, not -5. The sum of the roots must equal the middle coefficient negative.',
        keyRule: 'Check both conditions: product = c AND sum = b.',
      },
      'x = -1 and x = -6': {
        studentAnswer: 'x = -1 and x = -6',
        misconception: 'Sign error on 6 factor pair.',
        whyWrong: '(-1) + (-6) = -7, not -5.',
        keyRule: 'Factors of 6: 2 and 3 add to 5.',
      },
    },
  },
  {
    id: 'g9-sci-1',
    subject: 'Science',
    grade: 'Grade 9',
    gradeLevel: 'Grade 9',
    topic: 'Atomic Structure & Valence Electrons',
    chapter: 'Chapter 1: The Structure of the Atom',
    q: 'An atom of Carbon has an atomic number of 6. How many valence electrons does it have in its outermost shell?',
    choices: ['4 valence electrons', '6 valence electrons', '2 valence electrons', '8 valence electrons'],
    answer: '4 valence electrons',
    why: 'Carbon has 6 total electrons. The first electron shell holds 2 electrons (1s²). The remaining 4 electrons occupy the outer shell (2s² 2p²), meaning Carbon has 4 valence electrons.',
    clueHint: 'The first inner shell holds 2 electrons. Subtract 2 from 6 total electrons!',
    realLifeExample: {
      headline: 'Why Carbon Forms DNA and Diamond',
      scenario: 'Because Carbon has exactly 4 valence electrons, it can form 4 strong covalent bonds with other atoms simultaneously. This unique bonding ability makes Carbon the backbone of all organic life on Earth!',
      takeaway: 'Valence electrons dictate chemical bonding behavior.',
    },
    misconceptions: {
      '6 valence electrons': {
        studentAnswer: '6 valence electrons',
        misconception: 'Confusing total electrons with valence electrons.',
        whyWrong: '6 is the TOTAL number of electrons. Valence electrons are only those in the outermost shell (6 - 2 = 4).',
        keyRule: 'Valence electrons = electrons in outermost shell only.',
      },
      '2 valence electrons': {
        studentAnswer: '2 valence electrons',
        misconception: 'Counting the inner core shell instead of outer shell.',
        whyWrong: 'The inner shell holds 2 core electrons. The valence shell holds the remaining 4.',
        keyRule: 'Inner shell = 2; Outer shell = 4.',
      },
      '8 valence electrons': {
        studentAnswer: '8 valence electrons',
        misconception: 'Confusing octet goal with Carbon’s actual electrons.',
        whyWrong: 'Carbon wants 8 electrons to complete its octet, but currently only possesses 4 on its own.',
        keyRule: 'Carbon needs 4 more bonds to reach an octet of 8.',
      },
    },
  },

  // ==========================================
  // GRADE 10 QUESTIONS
  // ==========================================
  {
    id: 'g10-math-1',
    subject: 'Math',
    grade: 'Grade 10',
    gradeLevel: 'Grade 10',
    topic: 'Trigonometry & Right Triangles',
    chapter: 'Chapter 1: Introduction to Trigonometry',
    q: 'In a right triangle with acute angle θ, if the opposite side has length 6 and the hypotenuse has length 10, what is sin(θ)?',
    choices: ['0.6 (or 3/5)', '0.8 (or 4/5)', '1.25', '0.75 (or 3/4)'],
    answer: '0.6 (or 3/5)',
    why: 'By definition of the sine ratio: sin(θ) = Opposite / Hypotenuse = 6 / 10 = 0.6 (simplified to 3/5).',
    clueHint: 'Remember SOH CAH TOA: Sin = Opposite ÷ Hypotenuse!',
    realLifeExample: {
      headline: 'Measuring the Height of a Tree',
      scenario: 'Forest rangers use clinometers to sight the top angle of a tree. Using sin(θ) = Opposite / Hypotenuse, they calculate the exact tree height without climbing it!',
      takeaway: 'Sine is the ratio of opposite side to hypotenuse.',
    },
    misconceptions: {
      '0.8 (or 4/5)': {
        studentAnswer: '0.8 (or 4/5)',
        misconception: 'Computing cosine (Adjacent / Hypotenuse) instead of sine.',
        whyWrong: 'The adjacent side is √(10² - 6²) = 8. So 8/10 = 0.8 is cos(θ), not sin(θ).',
        keyRule: 'SOH: Sin = Opposite / Hypotenuse. CAH: Cos = Adjacent / Hypotenuse.',
      },
      '0.75 (or 3/4)': {
        studentAnswer: '0.75 (or 3/4)',
        misconception: 'Computing tangent (Opposite / Adjacent).',
        whyWrong: '6 / 8 = 0.75 is tan(θ), not sin(θ).',
        keyRule: 'TOA: Tan = Opposite / Adjacent.',
      },
      '1.25': {
        studentAnswer: '1.25',
        misconception: 'Dividing hypotenuse by adjacent (secant).',
        whyWrong: 'Sine can never be greater than 1 because the hypotenuse is always the longest side.',
        keyRule: 'For any acute angle, 0 < sin(θ) < 1.',
      },
    },
  },
  {
    id: 'g10-sci-1',
    subject: 'Science',
    grade: 'Grade 10',
    gradeLevel: 'Grade 10',
    topic: 'Electricity & Ohm’s Law',
    chapter: 'Chapter 2: Electricity & Circuits',
    q: 'According to Ohm’s Law (V = I × R), if a circuit has a voltage of 12 Volts and a resistance of 4 Ohms, what is the electric current flowing through it?',
    choices: ['3 Amperes', '48 Amperes', '16 Amperes', '8 Amperes'],
    answer: '3 Amperes',
    why: 'Rearrange Ohm’s Law to solve for current: I = V / R. Therefore, I = 12 V / 4 Ω = 3 Amperes (A).',
    clueHint: 'Divide Voltage (12) by Resistance (4) to find Current!',
    realLifeExample: {
      headline: 'Charging a Smartphone',
      scenario: 'A 12V car charger connected to an electronic device with 4Ω resistance draws exactly 12 ÷ 4 = 3 Amps of electric current through the charging cord.',
      takeaway: 'Current (I) = Voltage (V) ÷ Resistance (R).',
    },
    misconceptions: {
      '48 Amperes': {
        studentAnswer: '48 Amperes',
        misconception: 'Multiplying Voltage by Resistance (12 × 4) instead of dividing.',
        whyWrong: 'V = I × R means I = V / R. Multiplying would give 48, which incorrectly suggests more resistance makes more current flow.',
        keyRule: 'Resistance opposes current: higher resistance lowers the current (I = V / R).',
      },
      '16 Amperes': {
        studentAnswer: '16 Amperes',
        misconception: 'Adding 12 + 4.',
        whyWrong: 'Voltage and resistance are different physical units that cannot be added directly.',
        keyRule: 'Use the algebraic formula I = V / R.',
      },
      '8 Amperes': {
        studentAnswer: '8 Amperes',
        misconception: 'Subtracting 12 - 4.',
        whyWrong: 'Ohm’s law is a multiplicative relationship, not subtraction.',
        keyRule: 'I = 12 / 4 = 3 A.',
      },
    },
  },
];

// Grade syllabus chapters curriculum breakdown
export const syllabusChapters: SyllabusChapter[] = [
  // Grade 1 Math
  {
    id: 'syl-g1-m1',
    grade: 'Grade 1',
    subject: 'Math',
    chapterNumber: 1,
    chapterTitle: 'Counting & Numbers to 20',
    description: 'Master number recognition, counting sequences, and one-to-one correspondence.',
    topics: ['Counting objects', 'Number line basics', 'Comparing numbers (more/less)', 'Ten-frames'],
  },
  {
    id: 'syl-g1-m2',
    grade: 'Grade 1',
    subject: 'Math',
    chapterNumber: 2,
    chapterTitle: 'Addition Adventure',
    description: 'Combine sets of objects and learn the addition sign (+).',
    topics: ['Combining groups', 'Number line jumps', 'Adding with fingers and counters', 'Word problems'],
  },
  {
    id: 'syl-g1-s1',
    grade: 'Grade 1',
    subject: 'Science',
    chapterNumber: 1,
    chapterTitle: 'Living Things & Senses',
    description: 'Explore living vs non-living things and how our five senses explore the world.',
    topics: ['What makes something alive?', 'Sight, Hearing, Touch, Taste, Smell', 'Animal babies and parents'],
  },

  // Grade 2 Math & Science
  {
    id: 'syl-g2-m1',
    grade: 'Grade 2',
    subject: 'Math',
    chapterNumber: 1,
    chapterTitle: 'Place Value & 2-Digit Math',
    description: 'Understand tens and ones, grouping, and addition with regrouping.',
    topics: ['Tens and ones', 'Skip counting by 2s, 5s, 10s', 'Addition with regrouping', 'Even & odd numbers'],
  },
  {
    id: 'syl-g2-s1',
    grade: 'Grade 2',
    subject: 'Science',
    chapterNumber: 1,
    chapterTitle: 'Plant Life & Animal Diets',
    description: 'Investigate how plants grow from seeds and what animals eat.',
    topics: ['Roots, stems, leaves, flowers', 'Herbivores vs Carnivores', 'Sunlight and plant food'],
  },

  // Grade 3 Math & Science
  {
    id: 'syl-g3-m1',
    grade: 'Grade 3',
    subject: 'Math',
    chapterNumber: 1,
    chapterTitle: 'Multiplication Galaxy & Arrays',
    description: 'Understand equal groups, arrays, and times tables.',
    topics: ['Repeated addition', 'Building arrays (rows × columns)', 'Multiplication facts (1-10)', 'Equal sharing division'],
  },
  {
    id: 'syl-g3-s1',
    grade: 'Grade 3',
    subject: 'Science',
    chapterNumber: 1,
    chapterTitle: 'Matter & Its States',
    description: 'Compare solids, liquids, and gases, and observe temperature changes.',
    topics: ['Properties of solids, liquids, gases', 'Melting & Freezing', 'Evaporation & Condensation'],
  },

  // Grade 4 Math & Science
  {
    id: 'syl-g4-m1',
    grade: 'Grade 4',
    subject: 'Math',
    chapterNumber: 1,
    chapterTitle: 'Fractions & Geometry',
    description: 'Explore equivalent fractions, angles, and 2D geometric properties.',
    topics: ['Equivalent fractions', 'Comparing fractions', 'Acute, right, obtuse angles', 'Perimeter and area'],
  },
  {
    id: 'syl-g4-s1',
    grade: 'Grade 4',
    subject: 'Science',
    chapterNumber: 1,
    chapterTitle: 'Energy & Electrical Circuits',
    description: 'Investigate sound vibrations, light energy, and electrical loops.',
    topics: ['Closed vs Open circuits', 'Conductors and insulators', 'Sound vibrations and pitch'],
  },

  // Grade 5 Math & Science
  {
    id: 'syl-g5-m1',
    grade: 'Grade 5',
    subject: 'Math',
    chapterNumber: 1,
    chapterTitle: 'Fractions, Decimals & 3D Volume',
    description: 'Add unlike fractions, convert decimals, and calculate rectangular prism volume.',
    topics: ['Adding unlike fractions', 'Decimals place value', 'Volume of 3D boxes (L × W × H)', 'Coordinate graphing'],
  },
  {
    id: 'syl-g5-s1',
    grade: 'Grade 5',
    subject: 'Science',
    chapterNumber: 1,
    chapterTitle: 'Earth Systems & Human Body',
    description: 'Explore the global water cycle, digestive system, and solar orbits.',
    topics: ['Evaporation, condensation, precipitation', 'Human organs and breathing', 'Sun, Earth, and Moon orbits'],
  },

  // Grade 6 Math & Science
  {
    id: 'syl-g6-m1',
    grade: 'Grade 6',
    subject: 'Math',
    chapterNumber: 1,
    chapterTitle: 'Ratios, Rates & Algebra Intro',
    description: 'Understand unit rates, negative integers, and algebraic variables.',
    topics: ['Ratios and proportions', 'Unit price and speed', 'Integers on a number line', 'Writing algebraic expressions'],
  },
  {
    id: 'syl-g6-s1',
    grade: 'Grade 6',
    subject: 'Science',
    chapterNumber: 1,
    chapterTitle: 'Cell Biology & Energy Transfer',
    description: 'Examine microscopic cells, organelles, and conduction/convection heat.',
    topics: ['Plant vs animal cells', 'Nucleus and mitochondria', 'Heat conduction and radiation', 'Ecosystem food webs'],
  },

  // Grade 7 Math & Science
  {
    id: 'syl-g7-m1',
    grade: 'Grade 7',
    subject: 'Math',
    chapterNumber: 1,
    chapterTitle: 'Negative Integers & Linear Equations',
    description: 'Master integer math and solve single-variable linear equations.',
    topics: ['Adding & subtracting negative numbers', 'Multiplying negative signs', 'Solving one-step equations', 'Circle circumference and area'],
  },
  {
    id: 'syl-g7-s1',
    grade: 'Grade 7',
    subject: 'Science',
    chapterNumber: 1,
    chapterTitle: 'Forces, Newton’s Laws & Atoms',
    description: 'Learn inertia, F = ma, atomic protons/neutrons/electrons, and geology.',
    topics: ['Newton’s three laws of motion', 'Friction and air resistance', 'Atoms and the periodic elements', 'Plate tectonics'],
  },

  // Grade 8 Math & Science
  {
    id: 'syl-g8-m1',
    grade: 'Grade 8',
    subject: 'Math',
    chapterNumber: 1,
    chapterTitle: 'Functions, Slopes & Pythagorean Theorem',
    description: 'Master linear functions y = mx + b, exponents, and right triangle hypotenuses.',
    topics: ['Slope-intercept form', 'Pythagorean theorem a² + b² = c²', 'Scientific notation', 'Cylinder and cone volume'],
  },
  {
    id: 'syl-g8-s1',
    grade: 'Grade 8',
    subject: 'Science',
    chapterNumber: 1,
    chapterTitle: 'Chemical Reactions & Wave Motion',
    description: 'Distinguish chemical bonds, conservation of mass, and wave frequencies.',
    topics: ['Chemical vs physical changes', 'Signs of chemical reactions', 'Wavelength, frequency, and amplitude', 'Periodic table groups'],
  },

  // Grade 9 Math & Science
  {
    id: 'syl-g9-m1',
    grade: 'Grade 9',
    subject: 'Math',
    chapterNumber: 1,
    chapterTitle: 'Quadratic Equations & Polynomials',
    description: 'Factor polynomials, solve quadratics, and graph parabolas.',
    topics: ['Factoring trinomials', 'Quadratic roots', 'Coordinate distance and midpoint', 'Probability of independent events'],
  },
  {
    id: 'syl-g9-s1',
    grade: 'Grade 9',
    subject: 'Science',
    chapterNumber: 1,
    chapterTitle: 'Atomic Models, Mitosis & Mechanics',
    description: 'Explore electron shells, cellular division, and momentum conservation.',
    topics: ['Electron shells and valence', 'Mitosis cell division stages', 'Momentum and Newton’s cradle', 'Universal gravitation'],
  },

  // Grade 10 Math & Science
  {
    id: 'g10-m1',
    grade: 'Grade 10',
    subject: 'Math',
    chapterNumber: 1,
    chapterTitle: 'Trigonometry & Advanced Algebra',
    description: 'Apply sin, cos, tan, the quadratic formula, and circle tangent theorems.',
    topics: ['Trigonometric ratios (SOH CAH TOA)', 'The quadratic formula', 'Circle tangents and chords', 'Standard deviation & statistics'],
  },
  {
    id: 'g10-s1',
    grade: 'Grade 10',
    subject: 'Science',
    chapterNumber: 1,
    chapterTitle: 'Electricity, Chemical Equations & Optics',
    description: 'Balance chemical reactions, apply Ohm’s law, and calculate optical focal lengths.',
    topics: ['Balancing chemical equations', 'Ohm’s law V = IR and circuits', 'Refraction through convex/concave lenses', 'Magnetic fields'],
  },
];
