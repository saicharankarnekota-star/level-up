import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Chest, Coin, Gem, Pouch } from '../../anim/sprites';
import { LottieSprite } from '../../anim/LottieSprite';
import { Bubble, Hint, Pop, Stage, type SceneProps } from './Stage';

const GEM_COLORS = ['#E5484D', '#3E63DD', '#46A758', '#B5179E'];

/** The castle glows brighter with each mission completed. */
function KingdomStage({ mission, done, children }: { mission: 1 | 2 | 3; done: boolean; children: ReactNode }) {
  const power = mission - 1 + (done ? 1 : 0);
  return (
    <Stage backdrop="kingdom" celebrate={done}>
      <div className="pointer-events-none absolute right-0 top-0 h-32 w-56 opacity-90 sm:h-40 sm:w-72"
        style={{ filter: `saturate(${0.4 + power * 0.25}) brightness(${0.8 + power * 0.1}) drop-shadow(0 0 ${power * 8}px #F4CF55)` }}>
        <LottieSprite name="castle" label="Crystal Kingdom castle" className="h-full w-full" />
      </div>
      <div className="relative flex h-full min-h-[300px] flex-col items-center justify-between gap-3 p-4 sm:min-h-[340px]">
        <div className="self-start rounded-full bg-[#27314D]/80 px-3 py-1 text-xs font-bold text-[#F4CF55]">Kingdom power {power}/3</div>
        {children}
      </div>
    </Stage>
  );
}

export function KingdomAdd({ say }: SceneProps) {
  const coins = [...Array.from({ length: 6 }, (_, i) => ({ id: `g${i}`, gold: true })), ...Array.from({ length: 4 }, (_, i) => ({ id: `s${i}`, gold: false }))];
  const [inPouch, setInPouch] = useState<string[]>([]);
  const done = inPouch.length === 10;
  const drop = (id: string) => {
    if (inPouch.includes(id)) return;
    const next = [...inPouch, id];
    setInPouch(next);
    say(next.length === 10 ? '6 plus 4 makes 10! The gate opens!' : String(next.length));
  };
  const golds = inPouch.filter((c) => c.startsWith('g')).length;
  const silvers = inPouch.length - golds;
  return (
    <KingdomStage mission={1} done={done}>
      <Hint>Tap every coin to drop it in the pouch</Hint>
      <div className="flex flex-wrap items-center justify-center gap-6">
        <div className="flex flex-col gap-2">
          {[true, false].map((gold) => (
            <div key={String(gold)} className="flex min-h-[44px] gap-1">
              <AnimatePresence>
                {coins.filter((c) => c.gold === gold && !inPouch.includes(c.id)).map((c, i) => (
                  <Pop key={c.id} i={i} onClick={() => drop(c.id)} label={gold ? 'Gold coin' : 'Silver coin'}>
                    <Coin value={gold ? 5 : 1} label="" size={40} />
                  </Pop>
                ))}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <motion.div key={inPouch.length} animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 0.3 }}><Pouch size={110} /></motion.div>
      </div>
      <Bubble tone={done ? 'gold' : 'dark'}>{golds} gold + {silvers} silver = {inPouch.length}</Bubble>
    </KingdomStage>
  );
}

function Fountain({ splash }: { splash: number }) {
  return (
    <div className="relative">
      <svg viewBox="0 0 160 110" width="150" height="104" aria-hidden>
        <ellipse cx="80" cy="92" rx="72" ry="14" fill="#8D99AE" />
        <ellipse cx="80" cy="86" rx="64" ry="11" fill="#4CC9F0" />
        <rect x="72" y="40" width="16" height="46" fill="#ADB5BD" />
        <ellipse cx="80" cy="40" rx="30" ry="7" fill="#8D99AE" />
        <path d="M80 36 C70 10 56 18 52 40 M80 36 C90 10 104 18 108 40" stroke="#90E0EF" strokeWidth="4" fill="none" strokeLinecap="round">
          <animate attributeName="stroke-dasharray" values="0 80;80 0" dur="1.2s" repeatCount="indefinite" />
        </path>
      </svg>
      <AnimatePresence>
        {splash > 0 && (
          <motion.span key={splash} initial={{ scale: 0.4, opacity: 1 }} animate={{ scale: 1.8, opacity: 0 }} transition={{ duration: 0.7 }}
            className="absolute left-1/2 top-[70%] h-8 w-16 -translate-x-1/2 rounded-full border-4 border-white/80" />
        )}
      </AnimatePresence>
    </div>
  );
}

export function KingdomSub({ say }: SceneProps) {
  const [tossed, setTossed] = useState<number[]>([]);
  const done = tossed.length === 5;
  const toss = (i: number) => {
    if (tossed.includes(i) || done) return;
    const next = [...tossed, i];
    setTossed(next);
    say(next.length === 5 ? '12 take away 5 leaves 7 gems!' : `${12 - next.length} left`);
  };
  return (
    <KingdomStage mission={2} done={done}>
      <Hint>{done ? 'The potion is ready!' : 'Toss 5 gems into the fountain'}</Hint>
      <div className="flex flex-wrap items-center justify-center gap-6">
        <div className="grid min-h-[110px] grid-cols-6 gap-1 rounded-2xl bg-white/40 p-2">
          <AnimatePresence>
            {Array.from({ length: 12 }, (_, i) => i).filter((i) => !tossed.includes(i)).map((i) => (
              <motion.button key={i} type="button" onClick={() => toss(i)} aria-label="Toss gem into the fountain" layout
                exit={{ x: 160, y: 40, scale: 0.2, opacity: 0, transition: { duration: 0.5 } }} whileHover={{ y: -4 }}>
                <Gem color={GEM_COLORS[i % 4]} size={36} />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
        <Fountain splash={tossed.length} />
      </div>
      <Bubble tone={done ? 'gold' : 'dark'}>12 − {tossed.length} = {12 - tossed.length}</Bubble>
    </KingdomStage>
  );
}

export function KingdomMul({ say }: SceneProps) {
  const [opened, setOpened] = useState<number[]>([]);
  const done = opened.length === 4;
  const open = (i: number) => {
    if (opened.includes(i)) return;
    const next = [...opened, i];
    setOpened(next);
    say(next.length === 4 ? '4 chests times 3 gems is 12!' : String(next.length * 3));
  };
  return (
    <KingdomStage mission={3} done={done}>
      <Hint>Tap each chest to fill it with 3 gems</Hint>
      <div className="flex flex-wrap items-end justify-center gap-3 sm:gap-6">
        {[0, 1, 2, 3].map((i) => (
          <motion.button key={i} type="button" onClick={() => open(i)} aria-label={`Treasure chest ${i + 1}`} whileHover={{ y: -4 }} whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center">
            <div className="flex h-9 items-end gap-0.5">
              {opened.includes(i) && [0, 1, 2].map((g) => (
                <motion.div key={g} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: g * 0.1, type: 'spring' }}>
                  <Gem color={GEM_COLORS[(i + g) % 4]} size={26} />
                </motion.div>
              ))}
            </div>
            <Chest open={opened.includes(i)} size={62} />
          </motion.button>
        ))}
      </div>
      <Bubble tone={done ? 'gold' : 'dark'}>{opened.length ? `${opened.length} × 3 = ${opened.length * 3}` : '4 × 3 = ?'}</Bubble>
    </KingdomStage>
  );
}
