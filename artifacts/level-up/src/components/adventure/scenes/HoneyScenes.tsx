import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HoneyJar } from '../../anim/sprites';
import { LottieSprite } from '../../anim/LottieSprite';
import { Bubble, CountBadge, Hint, Pop, Stage, type SceneProps } from './Stage';

const Bear = ({ cheer = false }: { cheer?: boolean }) => (
  <motion.div animate={cheer ? { y: [0, -18, 0, -10, 0] } : { y: 0 }} transition={{ duration: 0.9 }}>
    <LottieSprite name="bear" label="Barnaby the bear" className="h-28 w-28 sm:h-36 sm:w-36"
      fallback={<div className="h-full w-full rounded-full bg-[#8B5A2B]" />} />
  </motion.div>
);

const Squirrel = ({ flip }: { flip?: boolean }) => (
  <LottieSprite name="squirrel" label="Squirrel friend" flip={flip} className="h-20 w-24 sm:h-24 sm:w-28"
    fallback={<div className="h-full w-full rounded-full bg-[#D9A441]" />} />
);

function Shelf({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex min-h-[70px] items-end justify-center gap-1 px-2">{children}</div>
      <div className="h-3 w-full min-w-[220px] rounded-sm bg-gradient-to-b from-[#B07D4F] to-[#7A4E2A] shadow-md" />
      <div className="flex w-full justify-between px-6"><span className="h-6 w-2 bg-[#7A4E2A]" /><span className="h-6 w-2 bg-[#7A4E2A]" /></div>
    </div>
  );
}

export function HoneyIntro({ say }: SceneProps) {
  const [counted, setCounted] = useState<number[]>([]);
  const tap = (i: number) => {
    if (counted.includes(i)) return;
    setCounted([...counted, i]);
    say(String(counted.length + 1));
  };
  return (
    <Stage backdrop="forest">
      <div className="flex h-full min-h-[300px] flex-col items-center justify-between gap-3 p-4 sm:min-h-[340px]">
        <Hint>Tap the jars to count Barnaby’s honey</Hint>
        <div className="flex w-full flex-wrap items-end justify-center gap-4 sm:gap-8">
          <Bear />
          <Shelf>
            {[0, 1, 2, 3, 4].map((i) => (
              <Pop key={i} i={i} onClick={() => tap(i)} label={`Honey jar ${i + 1}`}>
                <HoneyJar size={60} />
                {counted.includes(i) && <CountBadge n={counted.indexOf(i) + 1} />}
              </Pop>
            ))}
          </Shelf>
          <div className="flex -space-x-6"><Squirrel /><Squirrel flip /></div>
        </div>
        <Bubble tone={counted.length === 5 ? 'gold' : 'light'}>{counted.length === 5 ? '5 jars! 2 hungry squirrels…' : `${counted.length} jars counted`}</Bubble>
      </div>
    </Stage>
  );
}

export function HoneyTakeaway({ say }: SceneProps) {
  const [given, setGiven] = useState<number[]>([]);
  const left = 5 - given.length;
  const done = given.length === 2;
  const toggle = (i: number) => {
    if (given.includes(i)) { setGiven(given.filter((g) => g !== i)); return; }
    if (given.length >= 2) return;
    const next = [...given, i];
    setGiven(next);
    say(next.length === 2 ? '5 take away 2 leaves 3!' : `${5 - next.length} left`);
  };
  return (
    <Stage backdrop="forest" celebrate={done}>
      <div className="flex h-full min-h-[300px] flex-col items-center justify-between gap-3 p-4 sm:min-h-[340px]">
        <Hint>{done ? 'Tap a squirrel’s jar to give it back' : 'Tap 2 jars to give them to the squirrels'}</Hint>
        <div className="flex w-full flex-wrap items-end justify-center gap-4 sm:gap-8">
          <Bear cheer={done} />
          <Shelf>
            <AnimatePresence>
              {[0, 1, 2, 3, 4].filter((i) => !given.includes(i)).map((i) => (
                <motion.button key={i} layoutId={`jar${i}`} type="button" onClick={() => toggle(i)} aria-label="Give this jar away"
                  whileHover={{ y: -6 }} whileTap={{ scale: 0.9 }}>
                  <HoneyJar size={60} />
                </motion.button>
              ))}
            </AnimatePresence>
          </Shelf>
          <div className="flex flex-col items-center">
            <div className="flex min-h-[64px] gap-1">
              {given.map((i) => (
                <motion.button key={i} layoutId={`jar${i}`} type="button" onClick={() => toggle(i)} aria-label="Give this jar back"
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}>
                  <HoneyJar size={48} />
                </motion.button>
              ))}
            </div>
            <div className="flex -space-x-6"><Squirrel /><Squirrel flip /></div>
          </div>
        </div>
        <Bubble tone={done ? 'gold' : 'dark'}>5 − {given.length} = {left}</Bubble>
      </div>
    </Stage>
  );
}

export function PauseSub({ answer }: SceneProps) {
  const solved = answer === 'correct';
  const jars = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <Stage backdrop="forest" celebrate={solved} shake={answer === 'wrong'}>
      <div className="flex h-full min-h-[300px] flex-col items-center justify-between gap-3 p-4 sm:min-h-[340px]">
        <Hint>Barnaby had 8 jars and shares 3 with the deer family</Hint>
        <div className="flex w-full flex-wrap items-end justify-center gap-4 sm:gap-8">
          <Bear cheer={solved} />
          <Shelf>
            {jars.filter((i) => !solved || i < 5).map((i) => (
              <motion.div key={i} layoutId={`p${i}`} className={!solved && i >= 5 ? 'opacity-60' : ''}>
                <HoneyJar size={44} />
              </motion.div>
            ))}
          </Shelf>
          <div className="flex min-h-[60px] min-w-[120px] items-end justify-center gap-1 rounded-2xl border-2 border-dashed border-white/70 bg-white/20 p-2">
            {solved ? jars.slice(5).map((i) => (
              <motion.div key={i} layoutId={`p${i}`} transition={{ type: 'spring', stiffness: 180, damping: 18, delay: (i - 5) * 0.12 }}><HoneyJar size={40} /></motion.div>
            )) : <span className="text-xs font-bold text-white">Deer family</span>}
          </div>
        </div>
        <Bubble tone={solved ? 'gold' : 'dark'}>{solved ? '8 − 3 = 5!' : '8 − 3 = ?'}</Bubble>
      </div>
    </Stage>
  );
}
