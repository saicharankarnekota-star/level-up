import type { Topic } from '../../types';
import { numberChoices, pick, randInt, textChoices } from '../../lib/random';
import { fromPool, makeQuestion, mix } from './helpers';

const ID = 'g8-forces';
const newtons = (choices: string[]) => choices.map((c) => `${c} N`);

/** Net Force screen: two tug-of-war teams. */
const tugOfWar = () => {
  const left = randInt(1, 8) * 50;
  const right = Math.random() < 0.2 ? left : randInt(1, 8) * 50;
  const net = Math.abs(right - left);
  const dir = right > left ? 'right' : 'left';
  const answer = net === 0 ? '0 N — balanced, no motion' : `${net} N to the ${dir}`;
  const other = dir === 'right' ? 'left' : 'right';
  return makeQuestion(ID, {
    prompt: `In a tug of war, the left team pulls with ${left} N and the right team pulls with ${right} N. What is the net force?`,
    picture: '🧍🧍 ⬅️ 🪢 ➡️ 🧍🧍',
    choices: textChoices(answer, [
      `${left + right} N to the ${dir}`,
      `${net || 50} N to the ${other}`,
      net === 0 ? `${left} N to the right` : '0 N — balanced, no motion',
      `${net + 50} N to the ${dir}`,
    ]),
    answer,
    hint: 'Forces in opposite directions cancel. Subtract the smaller pull from the bigger one.',
    why: net === 0
      ? `Both teams pull with ${left} N, so the forces are balanced and the net force is 0 N.`
      : `${Math.max(left, right)} − ${Math.min(left, right)} = ${net} N, towards the stronger team on the ${dir}.`,
    misconceptions: {
      [`${left + right} N to the ${dir}`]: 'Opposite forces do not add up. They cancel, so subtract them.',
      [`${net || 50} N to the ${other}`]: 'The rope moves towards the team that pulls harder.',
    },
  });
};

/** Acceleration screen: F = m × a. */
const secondLaw = () => {
  const m = pick([40, 50, 80, 100, 200]);
  const a = pick([1, 2, 3, 4]);
  const f = m * a;
  if (Math.random() < 0.5) {
    return makeQuestion(ID, {
      prompt: `A net force acts on a ${m} kg crate and it speeds up at ${a} m/s². What is the net force?`,
      picture: '📦 ➡️',
      choices: newtons(numberChoices(f, [m + a, f / 2, f * 2], m)),
      answer: `${f} N`,
      hint: "Newton's second law: F = m × a.",
      why: `F = m × a = ${m} × ${a} = ${f} N.`,
      misconceptions: { [`${m + a} N`]: 'Multiply mass by acceleration, do not add them.' },
    });
  }
  return makeQuestion(ID, {
    prompt: `A ${f} N net force pushes a ${m} kg object. What is its acceleration?`,
    picture: '🛒 ➡️',
    choices: numberChoices(a, [a * 2, a + 1, Math.max(0, a - 1)], 2).map((c) => `${c} m/s²`),
    answer: `${a} m/s²`,
    hint: 'Rearrange F = m × a to a = F ÷ m.',
    why: `a = F ÷ m = ${f} ÷ ${m} = ${a} m/s².`,
  });
};

/** Friction screen: applied force minus friction. */
const friction = () => {
  const fr = randInt(1, 4) * 50;
  const push = fr + randInt(1, 4) * 50;
  const net = push - fr;
  return makeQuestion(ID, {
    prompt: `You push a sliding box with ${push} N. Friction pulls back with ${fr} N. What is the net force on the box?`,
    picture: '🧍➡️📦 ⬅️ friction',
    choices: newtons(numberChoices(net, [push + fr, push, fr], 50)),
    answer: `${net} N`,
    hint: 'Friction acts against the motion, so subtract it from your push.',
    why: `${push} − ${fr} = ${net} N in the direction of your push.`,
    misconceptions: {
      [`${push + fr} N`]: 'Friction works against you. It takes away from your push.',
      [`${push} N`]: 'Do not forget friction. It cancels part of your push.',
    },
  });
};

/** Static friction: does it start moving? */
const staticFriction = () => {
  const needed = randInt(2, 6) * 50;
  const push = needed + pick([-100, -50, 50, 100]);
  const moves = push > needed;
  const answer = moves ? 'Yes, it starts to slide' : 'No, static friction holds it still';
  return makeQuestion(ID, {
    prompt: `A heavy crate needs more than ${needed} N to start sliding. You push with ${push} N. Does it move?`,
    picture: '🧍➡️📦',
    choices: textChoices(answer, [
      'Yes, it starts to slide',
      'No, static friction holds it still',
      'It moves backwards',
      'It moves at a constant speed forever',
    ]),
    answer,
    hint: 'Static friction matches your push until your push is bigger than its limit.',
    why: moves
      ? `${push} N is more than ${needed} N, so you beat static friction and the crate starts to slide.`
      : `${push} N is not more than ${needed} N, so static friction matches your push and the net force stays 0.`,
  });
};

const concepts = fromPool(ID, [
  { prompt: 'A cart moves at a constant speed in a straight line. What is the net force on it?', answer: 'Zero', wrong: ['In the direction of motion', 'Opposite to the motion', 'Equal to its weight'], hint: 'Constant speed means no acceleration.', why: "Newton's first law: with no net force, an object keeps moving at the same speed and direction.", mis: { 'In the direction of motion': 'A force is only needed to change motion, not to keep it going.' } },
  { prompt: 'If you double the net force on the same object, its acceleration...', answer: 'Doubles', wrong: ['Halves', 'Stays the same', 'Becomes zero'], hint: 'a = F ÷ m.', why: 'Acceleration is directly proportional to net force, so 2× force gives 2× acceleration.' },
  { prompt: 'The same force pushes a 50 kg box and a 100 kg box. The 100 kg box accelerates...', answer: 'Half as much', wrong: ['Twice as much', 'The same', 'Not at all'], hint: 'More mass, less acceleration.', why: 'a = F ÷ m, so double the mass gives half the acceleration.' },
  { prompt: 'Which way does friction act on a box sliding to the right?', answer: 'To the left', wrong: ['To the right', 'Upwards', 'Downwards'], hint: 'Friction always opposes sliding.', why: 'Friction acts opposite to the direction of motion.' },
  { prompt: 'What happens to a sliding box if friction is turned off and you stop pushing?', answer: 'It keeps moving at the same speed', wrong: ['It stops at once', 'It slows down and stops', 'It speeds up'], hint: 'Try it in the Friction screen with friction set to none.', why: 'With no friction and no push, the net force is zero, so the box keeps its velocity (inertia).' },
  { prompt: 'Why is it harder to start pushing a fridge than a small crate?', answer: 'It has more mass, so more inertia', wrong: ['It is taller', 'It is colder', 'Gravity pushes it sideways'], hint: 'Inertia depends on mass.', why: 'More mass means more inertia, and usually more friction too.' },
  { prompt: 'The unit of force is the...', answer: 'Newton (N)', wrong: ['Kilogram (kg)', 'Metre per second (m/s)', 'Joule (J)'], hint: 'Named after Isaac Newton.', why: 'Force is measured in newtons. 1 N accelerates 1 kg by 1 m/s².' },
  { prompt: 'Two equal forces act on a ball in opposite directions. The forces are...', answer: 'Balanced', wrong: ['Unbalanced', 'Doubled', 'Only gravity'], hint: 'Equal and opposite cancel out.', why: 'Equal and opposite forces are balanced, so the net force is zero.' },
]);

const forcesMotion: Topic = {
  id: ID,
  grade: 8,
  subject: 'Science',
  title: 'Forces and Motion',
  emoji: '🪢',
  blurb: 'Net force, friction and F = ma with a PhET simulation.',
  visualizer: 'phetSim',
  visualizerParams: { sim: 'forces-and-motion-basics' },
  exploreGoal: 'Explore all four screens: Net Force, Motion, Friction and Acceleration. Change forces and watch what happens.',
  narration: 'Why does a heavy fridge refuse to budge, but a skateboard rolls away with a tiny push? It all comes down to forces. In this simulation you can run a tug of war, push crates, switch friction on and off, and measure acceleration. Start on the Net Force screen: add pullers to each side and predict which way the cart will roll before you press Go.',
  learnCards: [
    { emoji: '➡️', title: 'Force is a push or a pull', text: 'A force has a size, measured in newtons (N), and a direction. Forces can make objects start, stop, speed up, slow down or turn.' },
    { emoji: '🪢', title: 'Net force', text: 'Add forces in the same direction and subtract forces in opposite directions. What is left over is the net force. If it is zero, the forces are balanced.' },
    { emoji: '🛹', title: "Newton's first law: inertia", text: 'An object keeps doing what it is doing, staying still or moving at a constant velocity, unless an unbalanced force acts on it.' },
    { emoji: '📈', title: "Newton's second law: F = m × a", text: 'Acceleration equals net force divided by mass. Double the force and acceleration doubles. Double the mass and acceleration halves.' },
    { emoji: '🧱', title: 'Friction', text: 'Friction acts against sliding. Static friction holds an object still until your push beats its limit. Then kinetic friction keeps pulling back while it slides.' },
  ],
  realLife: 'Brakes use friction to stop a bicycle, seat belts protect you from your own inertia, and a lighter cricket ball is easier to accelerate with the same throw.',
  generate: mix(tugOfWar, secondLaw, friction, staticFriction, concepts, concepts),
};

export const grade8Topics: Topic[] = [forcesMotion];
