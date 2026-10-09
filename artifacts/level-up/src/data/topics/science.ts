import type { Question, Topic } from '../../types';
import { pick, shuffle } from '../../lib/random';
import { sortSets, type SortSet } from '../sortSets';
import { fromPool, makeQuestion, mix, type PoolItem } from './helpers';

/** Generators built from a sort set: "Which of these is ___?" and "Which group does ___ belong to?" */
function sortQuestions(topicId: string, set: SortSet, why: (binLabel: string) => string): (() => Question)[] {
  const label = (it: { emoji: string; name: string }) => `${it.emoji} ${it.name}`;
  return [
    () => {
      const bin = pick(set.bins);
      const right = pick(set.items.filter((i) => i.bin === bin.id));
      const wrong = shuffle(set.items.filter((i) => i.bin !== bin.id)).slice(0, 3);
      return makeQuestion(topicId, {
        prompt: `Which one is ${set.id === 'habitats' ? `found in the ${bin.label.toLowerCase()}` : `${/^[aeiou]/i.test(bin.label) ? 'an' : 'a'} ${bin.label.toLowerCase()}`}?`,
        choices: shuffle([right, ...wrong]).map(label),
        answer: label(right),
        hint: set.question,
        why: `${label(right)} belongs with ${bin.label}. ${why(bin.label)}`,
        misconceptions: Object.fromEntries(wrong.map((w) => [label(w), `${label(w)} belongs with ${set.bins.find((b) => b.id === w.bin)?.label}, not ${bin.label}.`])),
        show: { set: set.id, highlight: right.name },
      });
    },
    () => {
      const item = pick(set.items);
      const bin = set.bins.find((b) => b.id === item.bin)!;
      return makeQuestion(topicId, {
        prompt: set.id === 'habitats' ? `Where does the ${item.name.toLowerCase()} live?` : `${item.name}: which group does it belong to?`,
        picture: item.emoji,
        choices: shuffle(set.bins.map((b) => `${b.emoji} ${b.label}`)),
        answer: `${bin.emoji} ${bin.label}`,
        hint: set.question,
        why: `${item.emoji} ${item.name} belongs with ${bin.label}. ${why(bin.label)}`,
        show: { set: set.id, highlight: item.name },
      });
    },
  ];
}

// ---------------- Grade 1 ----------------

const living: Topic = {
  id: 'g1-living',
  grade: 1,
  subject: 'Science',
  title: 'Living & Non-living',
  emoji: '🌱',
  blurb: 'What makes something alive?',
  visualizer: 'sortBins',
  visualizerParams: { set: 'living' },
  exploreGoal: 'Sort each thing into Living or Non-living. Ask: does it grow, eat and breathe?',
  learnCards: [
    { emoji: '🐶', title: 'Living things', text: 'Living things grow, need food and water, breathe, and can have babies. Plants and animals are living!' },
    { emoji: '🪨', title: 'Non-living things', text: 'Non-living things do not grow, eat or breathe. A rock, a chair and a toy are non-living.' },
    { emoji: '🤖', title: 'Tricky ones', text: 'A robot can move, but it does not grow or eat. So it is non-living!' },
  ],
  realLife: 'Your pet, the plants in your garden and you are all living things.',
  generate: mix(
    ...sortQuestions('g1-living', sortSets.living, (b) => (b === 'Living' ? 'It grows and needs food and water.' : 'It does not grow, eat or breathe.')),
    fromPool('g1-living', [
      { prompt: 'What do ALL living things need?', answer: 'Food and water', wrong: ['Toys', 'Batteries', 'Shoes'], hint: 'Think of what plants and animals both need.', why: 'Every living thing needs food (or sunlight) and water to live.' },
      { prompt: 'A car moves. Why is it NOT living?', answer: 'It does not grow or eat', wrong: ['It is too big', 'It has wheels', 'It is shiny'], hint: 'Moving is not enough. Does it grow?', why: 'Living things grow, eat and breathe. A car does none of these.' },
      { prompt: 'Which of these shows a living thing growing?', answer: '🌱 A seed becoming a plant', wrong: ['🎈 A balloon getting air', '🧊 Ice melting', '🔥 A fire spreading'], hint: 'Growing means getting bigger by itself from food and water.', why: 'Plants grow from seeds. That is a sign of life.' },
    ]),
  ),
};

const plantPartFacts: PoolItem[] = [
  { prompt: 'Which part of a plant takes in water from the soil?', answer: 'Roots', wrong: ['Leaves', 'Flower', 'Stem'], hint: 'Which part is under the ground?', why: 'Roots grow in the soil and soak up water. They also hold the plant in place.', show: { part: 'roots' } },
  { prompt: 'Which part carries water from the roots to the leaves?', answer: 'Stem', wrong: ['Flower', 'Seed', 'Roots'], hint: 'It is like a straw that holds the plant up.', why: 'The stem carries water up and holds the plant tall.', show: { part: 'stem' } },
  { prompt: 'Which part makes food for the plant using sunlight?', answer: 'Leaves', wrong: ['Roots', 'Stem', 'Seed'], hint: 'This part is usually green and flat.', why: 'Leaves use sunlight, air and water to make food.', show: { part: 'leaves' } },
  { prompt: 'Which part of the plant makes seeds?', answer: 'Flower', wrong: ['Roots', 'Leaves', 'Stem'], hint: 'Bees love to visit this colourful part.', why: 'Flowers make seeds that can grow into new plants.', show: { part: 'flower' } },
  { prompt: 'What can a seed grow into?', answer: 'A new plant', wrong: ['A rock', 'A bird', 'A cloud'], hint: 'Plant it, water it and wait!', why: 'A seed has a tiny baby plant inside.', show: { part: 'seed' } },
  { prompt: 'What does a plant need to grow?', answer: 'Sunlight, water and air', wrong: ['Only sweets', 'Darkness only', 'Toys and music'], hint: 'Plants need light from the sky and a drink.', why: 'Plants need sunlight, water, air and good soil.', show: { part: 'leaves' } },
  { prompt: 'Which part of the plant is under the ground?', answer: 'Roots', wrong: ['Flower', 'Leaves', 'Fruit'], hint: 'Dig in the soil to find it.', why: 'Roots grow down into the soil.', show: { part: 'roots' } },
];

const plantParts: Topic = {
  id: 'g1-plant',
  grade: 1,
  subject: 'Science',
  title: 'Parts of a Plant',
  emoji: '🌻',
  blurb: 'Roots, stem, leaves and flowers each have a job.',
  visualizer: 'plantParts',
  exploreGoal: 'Tap each part of the plant to find out its job.',
  learnCards: [
    { emoji: '🟫', title: 'Roots', text: 'Roots hide in the soil. They drink water and hold the plant steady.' },
    { emoji: '🌿', title: 'Stem and leaves', text: 'The stem carries water up like a straw. Leaves use sunlight to make food.' },
    { emoji: '🌸', title: 'Flowers and seeds', text: 'Flowers make seeds. Seeds grow into new plants!' },
  ],
  realLife: 'Carrots are roots, celery is a stem, spinach is leaves and peas are seeds that we eat!',
  generate: fromPool('g1-plant', plantPartFacts),
};

const senseFacts: PoolItem[] = [
  { prompt: 'Which body part helps you hear a bell?', picture: '🔔', answer: 'Ears 👂', wrong: ['Eyes 👀', 'Nose 👃', 'Tongue 👅'], hint: 'Bells make sounds.', why: 'We hear sounds with our ears.', show: { sense: 'hearing' } },
  { prompt: 'You smell a flower with your...', picture: '🌸', answer: 'Nose 👃', wrong: ['Ears 👂', 'Hands ✋', 'Eyes 👀'], hint: 'Sniff, sniff!', why: 'Our nose smells.', show: { sense: 'smell' } },
  { prompt: 'Which sense tells you a lemon is sour?', picture: '🍋', answer: 'Taste', wrong: ['Sight', 'Hearing', 'Smell'], hint: 'Sour is a flavour on your tongue.', why: 'Our tongue tastes sweet, sour, salty and bitter.', show: { sense: 'taste' } },
  { prompt: 'Which sense tells you ice is cold?', picture: '🧊', answer: 'Touch', wrong: ['Hearing', 'Sight', 'Taste'], hint: 'You feel cold with your skin.', why: 'Our skin feels hot, cold, soft and rough.', show: { sense: 'touch' } },
  { prompt: 'You see a rainbow with your...', picture: '🌈', answer: 'Eyes 👀', wrong: ['Ears 👂', 'Nose 👃', 'Tongue 👅'], hint: 'Colours are seen.', why: 'Our eyes let us see colours and shapes.', show: { sense: 'sight' } },
  { prompt: 'How many senses do we have?', answer: '5', wrong: ['3', '2', '10'], hint: 'See, hear, smell, taste, touch.', why: 'Sight, hearing, smell, taste and touch: five senses.' },
  { prompt: 'Which sense helps you know a teddy bear is soft?', picture: '🧸', answer: 'Touch', wrong: ['Taste', 'Hearing', 'Smell'], hint: 'Give it a squeeze!', why: 'We feel soft and hard with our skin.', show: { sense: 'touch' } },
  { prompt: 'Which body part do you use to taste ice cream?', picture: '🍦', answer: 'Tongue 👅', wrong: ['Nose 👃', 'Eyes 👀', 'Ears 👂'], hint: 'Lick it!', why: 'We taste with our tongue.', show: { sense: 'taste' } },
];

const senses: Topic = {
  id: 'g1-senses',
  grade: 1,
  subject: 'Science',
  title: 'My Five Senses',
  emoji: '👂',
  blurb: 'See, hear, smell, taste and touch.',
  visualizer: 'senses',
  exploreGoal: 'Tap each body part to discover its sense.',
  learnCards: [
    { emoji: '👀', title: 'Sight and hearing', text: 'Eyes let us see colours and shapes. Ears let us hear music and voices.' },
    { emoji: '👃', title: 'Smell and taste', text: 'Our nose smells flowers and food. Our tongue tastes sweet, sour and salty.' },
    { emoji: '✋', title: 'Touch', text: 'Our skin feels hot, cold, soft, rough and bumpy.' },
  ],
  realLife: 'When you eat a mango you see it, smell it, touch it and taste it!',
  generate: fromPool('g1-senses', senseFacts),
};

const weather: Topic = {
  id: 'g1-weather',
  grade: 1,
  subject: 'Science',
  title: 'Weather & Seasons',
  emoji: '🌦️',
  blurb: 'Sunny, rainy, windy and the seasons of the year.',
  visualizer: 'weather',
  exploreGoal: 'Turn the season wheel. What do you wear and see in each season?',
  learnCards: [
    { emoji: '☀️', title: 'Weather changes', text: 'Weather is what the sky and air are like today: sunny, rainy, cloudy, windy or snowy.' },
    { emoji: '☂️', title: 'Dress for it', text: 'Take an umbrella when it rains. Wear a hat and drink water when it is hot and sunny.' },
    { emoji: '🍂', title: 'Seasons', text: 'A year has seasons. Summer is hot, winter is cold, and the rainy season brings lots of rain.' },
  ],
  realLife: 'Checking the weather helps you choose clothes before school.',
  generate: fromPool('g1-weather', [
    { prompt: 'What should you take on a rainy day?', answer: 'Umbrella ☂️', wrong: ['Sunglasses 🕶️', 'Kite 🪁', 'Sandcastle bucket 🪣'], hint: 'What keeps you dry?', why: 'An umbrella keeps the rain off you.', show: { season: 'rainy' } },
    { prompt: 'Which weather is best for flying a kite?', answer: 'Windy 🌬️', wrong: ['Still and calm', 'Foggy 🌫️', 'Snowy ❄️'], hint: 'Kites need moving air.', why: 'Wind pushes the kite up into the sky.', show: { season: 'spring' } },
    { prompt: 'In which season is it the coldest?', answer: 'Winter', wrong: ['Summer', 'Spring', 'Rainy season'], hint: 'You wear sweaters then.', why: 'Winter is the coldest season.', show: { season: 'winter' } },
    { prompt: 'What should you wear on a hot sunny day?', answer: 'A cap and light clothes', wrong: ['A thick coat', 'Woolly gloves', 'Snow boots'], hint: 'Stay cool!', why: 'Light clothes and a cap keep you cool in the sun.', show: { season: 'summer' } },
    { prompt: 'In which season do many flowers bloom?', answer: 'Spring', wrong: ['Winter', 'Night', 'Snowstorm'], hint: 'It comes after winter.', why: 'In spring, it gets warmer and flowers bloom.', show: { season: 'spring' } },
    { prompt: 'What falls from clouds on a rainy day?', picture: '🌧️', answer: 'Water drops', wrong: ['Sand', 'Leaves', 'Stars'], hint: 'You get wet!', why: 'Rain is water falling from clouds.', show: { season: 'rainy' } },
    { prompt: 'Which tool tells us how hot or cold it is?', answer: 'Thermometer 🌡️', wrong: ['Ruler 📏', 'Clock 🕐', 'Spoon 🥄'], hint: 'It measures temperature.', why: 'A thermometer measures temperature.' },
  ]),
};

const dayNight: Topic = {
  id: 'g1-daynight',
  grade: 1,
  subject: 'Science',
  title: 'Day & Night',
  emoji: '🌗',
  blurb: 'The Sun, the Moon and why we have day and night.',
  visualizer: 'dayNight',
  exploreGoal: 'Spin the Earth. When your house faces the Sun it is day!',
  learnCards: [
    { emoji: '☀️', title: 'The Sun', text: 'The Sun is a star. It gives us light and heat. When we can see the Sun, it is daytime.' },
    { emoji: '🌍', title: 'Earth spins', text: 'The Earth spins around like a top. The side facing the Sun has day; the other side has night.' },
    { emoji: '🌙', title: 'Night sky', text: 'At night we can see the Moon and stars. The Sun rises in the east and sets in the west.' },
  ],
  realLife: 'You wake up when the Sun rises and go to sleep when it is dark.',
  generate: fromPool('g1-daynight', [
    { prompt: 'What gives us light and heat during the day?', answer: 'The Sun ☀️', wrong: ['The Moon 🌙', 'A cloud ☁️', 'A star far away ⭐'], hint: 'It is very bright in the sky.', why: 'The Sun gives Earth light and heat.', show: { angle: 0 } },
    { prompt: 'Why do we have day and night?', answer: 'The Earth spins', wrong: ['The Sun switches off', 'Clouds cover the sky', 'The Moon hides the Sun'], hint: 'Think of a spinning ball near a lamp.', why: 'As Earth spins, our side turns towards and away from the Sun.', show: { angle: 180 } },
    { prompt: 'What can we see in the sky at night?', answer: 'The Moon and stars', wrong: ['A rainbow', 'The Sun', 'Blue sky'], hint: 'It is dark, but some things twinkle.', why: 'At night we can see the Moon and stars.', show: { angle: 180 } },
    { prompt: 'Where does the Sun rise?', answer: 'East', wrong: ['West', 'Under the ground', 'In the sea'], hint: 'It is the opposite of where it sets.', why: 'The Sun rises in the east and sets in the west.', show: { angle: 270 } },
    { prompt: 'Is the Sun a star?', answer: 'Yes', wrong: ['No, it is a planet', 'No, it is a moon', 'No, it is a cloud'], hint: 'It makes its own light.', why: 'The Sun is our closest star.', show: { angle: 0 } },
    { prompt: 'When is your shadow longest?', answer: 'Early morning or evening', wrong: ['At midnight', 'At noon', 'Never'], hint: 'When the Sun is low in the sky.', why: 'A low Sun makes long shadows.', show: { angle: 60 } },
  ]),
};

// ---------------- Grade 2 ----------------

const habitats: Topic = {
  id: 'g2-habitats',
  grade: 2,
  subject: 'Science',
  title: 'Animal Homes',
  emoji: '🐠',
  blurb: 'Oceans, deserts, forests and polar ice.',
  visualizer: 'sortBins',
  visualizerParams: { set: 'habitats' },
  exploreGoal: 'Move each animal to the home where it can live best.',
  learnCards: [
    { emoji: '🏡', title: 'A habitat is a home', text: 'A habitat gives an animal food, water and shelter. Each animal is suited to its home.' },
    { emoji: '🐪', title: 'Desert and ocean', text: 'Camels store fat in their hump for dry deserts. Fish breathe with gills in water.' },
    { emoji: '🐧', title: 'Forest and polar', text: 'Monkeys climb forest trees. Polar bears and penguins have thick fat to stay warm on ice.' },
  ],
  realLife: 'A fish tank, a bird nest and an ant hill are all habitats you can spot near you.',
  generate: mix(
    ...sortQuestions('g2-habitats', sortSets.habitats, () => 'Its body helps it live there.'),
    fromPool('g2-habitats', [
      { prompt: 'What does a habitat give an animal?', answer: 'Food, water and shelter', wrong: ['Toys and games', 'Only sunshine', 'Cars and roads'], hint: 'Think of what you need at home.', why: 'A habitat provides food, water and shelter.' },
      { prompt: 'How does a polar bear stay warm?', picture: '🐻‍❄️', answer: 'Thick fur and fat', wrong: ['It wears a coat', 'It lives in a fire', 'It drinks hot milk'], hint: 'Its body is built for cold.', why: 'Thick fur and fat keep polar bears warm.', show: { set: 'habitats', highlight: 'Polar bear' } },
    ]),
  ),
};

const cycles = {
  butterfly: ['🥚 Egg', '🐛 Caterpillar', '🫘 Pupa', '🦋 Butterfly'],
  frog: ['🥚 Eggs', '🐟 Tadpole', '🐸 Froglet', '🐸 Frog'],
  plant: ['🌰 Seed', '🌱 Sprout', '🪴 Young plant', '🌻 Flowering plant'],
};

const lifeCycles: Topic = {
  id: 'g2-lifecycles',
  grade: 2,
  subject: 'Science',
  title: 'Life Cycles',
  emoji: '🦋',
  blurb: 'How butterflies, frogs and plants grow and change.',
  visualizer: 'lifeCycle',
  visualizerParams: { cycle: 'butterfly' },
  exploreGoal: 'Put the stages in the right order to complete the circle of life.',
  learnCards: [
    { emoji: '🐛', title: 'Butterfly', text: 'Egg → caterpillar → pupa (chrysalis) → butterfly. Then the butterfly lays eggs again!' },
    { emoji: '🐸', title: 'Frog', text: 'Eggs in water → tadpole with a tail → froglet with legs → frog that can hop on land.' },
    { emoji: '🔄', title: 'A cycle repeats', text: 'A life cycle is a circle. Grown-ups make babies, and the cycle starts again.' },
  ],
  realLife: 'You can watch tadpoles in a pond or a seed sprout in a cup at home.',
  generate: mix(
    () => {
      const key = pick(Object.keys(cycles) as (keyof typeof cycles)[]);
      const stages = cycles[key];
      const i = Math.floor(Math.random() * (stages.length - 1));
      return makeQuestion('g2-lifecycles', {
        prompt: `In the ${key} life cycle, what comes after "${stages[i].slice(stages[i].indexOf(' ') + 1)}"?`,
        choices: shuffle(stages),
        answer: stages[i + 1],
        hint: 'Think about how the baby grows into an adult.',
        why: `The ${key} cycle goes ${stages.join(' → ')}.`,
        show: { cycle: key },
      });
    },
    fromPool('g2-lifecycles', [
      { prompt: 'What is a baby frog called?', answer: 'Tadpole', wrong: ['Caterpillar', 'Puppy', 'Chick'], hint: 'It swims with a tail.', why: 'Frogs start as tadpoles.', show: { cycle: 'frog' } },
      { prompt: 'What does a caterpillar turn into?', answer: 'Butterfly', wrong: ['Frog', 'Bee', 'Snail'], hint: 'It gets colourful wings.', why: 'Caterpillars become butterflies.', show: { cycle: 'butterfly' } },
      { prompt: 'What is the first stage of a butterfly?', answer: 'Egg', wrong: ['Pupa', 'Caterpillar', 'Butterfly'], hint: 'It is very tiny on a leaf.', why: 'Butterflies start as eggs.', show: { cycle: 'butterfly' } },
      { prompt: 'Where do frogs lay their eggs?', answer: 'In water', wrong: ['In trees', 'In sand', 'In nests in the sky'], hint: 'Tadpoles need to swim.', why: 'Frog eggs are laid in ponds.', show: { cycle: 'frog' } },
      { prompt: 'What does a seed need to sprout?', answer: 'Water and warmth', wrong: ['Darkness and ice', 'Sweets', 'Nothing at all'], hint: 'Think of rain and sunshine.', why: 'Seeds need water and warmth to start growing.', show: { cycle: 'plant' } },
    ]),
  ),
};

const matter: Topic = {
  id: 'g2-matter',
  grade: 2,
  subject: 'Science',
  title: 'Solids, Liquids & Gases',
  emoji: '🧊',
  blurb: 'Things that keep their shape, flow, or spread out.',
  visualizer: 'sortBins',
  visualizerParams: { set: 'matter' },
  exploreGoal: 'Sort each thing: does it keep its shape, flow, or float around?',
  learnCards: [
    { emoji: '🧱', title: 'Solids', text: 'A solid keeps its own shape. A rock, a book and an ice cube are solids.' },
    { emoji: '💧', title: 'Liquids', text: 'A liquid flows and takes the shape of its container. Water, milk and juice are liquids.' },
    { emoji: '🎈', title: 'Gases', text: 'A gas spreads out to fill any space. The air in a balloon is a gas.' },
  ],
  realLife: 'Ice melts into water, and water boils into steam when you cook rice.',
  generate: mix(
    ...sortQuestions('g2-matter', sortSets.matter, (b) =>
      b === 'Solid' ? 'Solids keep their shape.' : b === 'Liquid' ? 'Liquids flow and take the shape of their container.' : 'Gases spread out to fill space.'),
    fromPool('g2-matter', [
      { prompt: 'What does ice turn into when it melts?', picture: '🧊', answer: 'Water', wrong: ['Rock', 'Air', 'Sand'], hint: 'Leave an ice cube in the sun.', why: 'Melting turns solid ice into liquid water.' },
      { prompt: 'A liquid takes the shape of its...', answer: 'Container', wrong: ['Colour', 'Smell', 'Name'], hint: 'Pour juice into a glass.', why: 'Liquids flow to fill the shape of their container.' },
      { prompt: 'What happens to water when it boils?', picture: '♨️', answer: 'It becomes steam', wrong: ['It becomes ice', 'It becomes a rock', 'Nothing'], hint: 'Watch a kettle.', why: 'Boiling turns liquid water into gas (steam).' },
    ]),
  ),
};

const forces: Topic = {
  id: 'g2-forces',
  grade: 2,
  subject: 'Science',
  title: 'Push & Pull',
  emoji: '🛒',
  blurb: 'Forces make things move, stop and change direction.',
  visualizer: 'sortBins',
  visualizerParams: { set: 'force' },
  exploreGoal: 'Sort each action into Push or Pull.',
  learnCards: [
    { emoji: '👐', title: 'Push', text: 'A push moves something away from you. Kicking a ball is a push.' },
    { emoji: '🪢', title: 'Pull', text: 'A pull moves something towards you. Opening a drawer is a pull.' },
    { emoji: '💪', title: 'Bigger force', text: 'A bigger push or pull makes things move faster and farther.' },
  ],
  realLife: 'Playing on swings, pulling a wagon and kicking a football all use forces.',
  generate: mix(
    ...sortQuestions('g2-forces', sortSets.force, (b) => (b === 'Push' ? 'It moves away from you.' : 'It moves towards you.')),
    fromPool('g2-forces', [
      { prompt: 'What happens if you kick a ball harder?', picture: '⚽', answer: 'It goes farther', wrong: ['It stops', 'It gets smaller', 'It changes colour'], hint: 'More force means more movement.', why: 'A bigger push makes the ball go faster and farther.' },
      { prompt: 'A magnet can pull things made of...', picture: '🧲', answer: 'Iron', wrong: ['Wood', 'Paper', 'Plastic'], hint: 'Try a paper clip!', why: 'Magnets pull iron and steel.' },
      { prompt: 'What makes a rolling ball stop?', answer: 'A force like friction', wrong: ['Its colour', 'Its name', 'The Moon'], hint: 'Rolling on grass slows it down.', why: 'Friction from the ground slows and stops the ball.' },
    ]),
  ),
};

const food: Topic = {
  id: 'g2-food',
  grade: 2,
  subject: 'Science',
  title: 'Healthy Food',
  emoji: '🥦',
  blurb: 'Everyday foods and sometimes treats.',
  visualizer: 'sortBins',
  visualizerParams: { set: 'food' },
  exploreGoal: 'Fill the everyday basket and the treat basket.',
  learnCards: [
    { emoji: '🥕', title: 'Everyday foods', text: 'Fruits, vegetables, grains, milk and eggs help you grow and give you energy.' },
    { emoji: '🍬', title: 'Sometimes treats', text: 'Sweets, chips and fizzy drinks are fine sometimes, but not every day.' },
    { emoji: '💧', title: 'Drink water', text: 'Water keeps your body cool and helps it work well. Drink it every day!' },
  ],
  realLife: 'A healthy lunch box has fruit, a sandwich or roti, and water.',
  generate: mix(
    ...sortQuestions('g2-food', sortSets.food, (b) => (b === 'Everyday food' ? 'It helps your body grow strong.' : 'It has lots of sugar, salt or oil.')),
    fromPool('g2-food', [
      { prompt: 'Milk helps make your ___ strong.', picture: '🥛', answer: 'Bones', wrong: ['Hair', 'Shoes', 'Eyes'], hint: 'Your skeleton!', why: 'Milk has calcium that builds strong bones.' },
      { prompt: 'Why should we drink water every day?', picture: '💧', answer: 'It keeps our body working well', wrong: ['It makes us taller instantly', 'It changes our eye colour', 'We should not'], hint: 'Our body is mostly water.', why: 'Water keeps us cool and helps our body work.' },
      { prompt: 'Which is the healthiest snack?', answer: '🍎 Apple slices', wrong: ['🍬 Candy', '🥤 Fizzy drink', '🍟 Fries'], hint: 'It grows on a tree.', why: 'Fruit gives vitamins and energy without lots of sugar.' },
    ]),
  ),
};

export const scienceTopics: Topic[] = [living, plantParts, senses, weather, dayNight, habitats, lifeCycles, matter, forces, food];
