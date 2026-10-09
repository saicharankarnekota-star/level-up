import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { Crystal } from '../../anim/sprites';
import { LottieSprite } from '../../anim/LottieSprite';
import { Visualizer } from '../../visualizers';
import { Bubble, Hint, Pop, Stage, type SceneProps } from './Stage';

function Ship({ crystals, launched, lit, onClick, i }: { crystals: number; launched?: boolean; lit?: boolean; onClick?: () => void; i: number }) {
  return (
    <motion.button type="button" onClick={onClick} aria-label={`Spaceship ${i + 1} with ${crystals} crystals`}
      animate={launched ? { y: -40 } : { y: [0, -4, 0] }}
      transition={launched ? { duration: 0.8, delay: i * 0.15 } : { repeat: Infinity, duration: 2.5, delay: i * 0.4 }}
      className={`flex flex-col items-center rounded-2xl p-1 transition ${lit ? 'bg-[#4CC9F0]/25 ring-2 ring-[#4CC9F0]' : ''}`}>
      <LottieSprite name="rocket" play={!!launched} loop={false} segment={[30, 60]} className="h-24 w-24 sm:h-28 sm:w-28"
        fallback={<div className="mx-auto h-full w-10 rounded-t-full bg-white/80" />} />
      <div className="mt-1 flex gap-0.5 rounded-xl bg-black/30 px-1.5 py-1">
        {Array.from({ length: crystals }, (_, c) => <Pop key={c} i={i * crystals + c}><Crystal size={22} glow={lit} /></Pop>)}
      </div>
    </motion.button>
  );
}

export function SpaceshipsIntro({ say }: SceneProps) {
  const [tapped, setTapped] = useState<number[]>([]);
  const tap = (i: number) => {
    if (tapped.includes(i)) return;
    const next = [...tapped, i];
    setTapped(next);
    say(String(next.length * 4));
  };
  return (
    <Stage backdrop="space">
      <div className="flex h-full min-h-[300px] flex-col items-center justify-between gap-3 p-4 sm:min-h-[340px]">
        <Hint>Tap each ship to count its crystals by 4s</Hint>
        <div className="flex flex-wrap items-end justify-center gap-3 sm:gap-8">
          {[0, 1, 2].map((i) => <Ship key={i} i={i} crystals={4} lit={tapped.includes(i)} onClick={() => tap(i)} />)}
        </div>
        <Bubble tone={tapped.length === 3 ? 'gold' : 'dark'}>{tapped.length ? [4, 8, 12].slice(0, tapped.length).join(', ') : '3 ships × 4 crystals = ?'}</Bubble>
      </div>
    </Stage>
  );
}

export function RepeatedAddition({ say }: SceneProps) {
  const [groups, setGroups] = useState(0);
  useEffect(() => {
    if (groups >= 3) return;
    const t = window.setTimeout(() => setGroups((g) => g + 1), groups === 0 ? 600 : 1400);
    return () => window.clearTimeout(t);
  }, [groups]);
  useEffect(() => { if (groups === 3) say('4 plus 4 plus 4 is 12. That is 3 times 4!'); }, [groups, say]);
  return (
    <Stage backdrop="space" celebrate={groups === 3}>
      <div className="flex h-full min-h-[300px] flex-col items-center justify-between gap-3 p-4 sm:min-h-[340px]">
        <Hint>Each ship adds another group of 4</Hint>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          {[0, 1, 2].map((g) => (
            <div key={g} className="flex items-center gap-2 sm:gap-4">
              <motion.div animate={{ opacity: g < groups ? 1 : 0.25, scale: g < groups ? 1 : 0.92 }}
                className={`grid grid-cols-2 gap-1 rounded-2xl border-2 p-2 ${g < groups ? 'border-[#4CC9F0] bg-[#4CC9F0]/15' : 'border-white/20'}`}>
                {[0, 1, 2, 3].map((c) => <Crystal key={c} size={30} glow={g < groups} />)}
              </motion.div>
              {g < 2 && <span className="text-2xl font-black text-white/80">+</span>}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Bubble tone="dark">{groups ? Array(groups).fill(4).join(' + ') + ` = ${groups * 4}` : '…'}</Bubble>
          {groups === 3 && <Bubble tone="gold">3 × 4 = 12</Bubble>}
          {groups === 3 && (
            <button type="button" onClick={() => setGroups(0)} className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[#27314D]" aria-label="Play again"><RotateCcw size={16} /></button>
          )}
        </div>
      </div>
    </Stage>
  );
}

export function ArrayGridScene() {
  return (
    <Stage backdrop="space">
      <div className="p-3 sm:p-5">
        <div className="mb-2 text-center"><Hint>Change the rows and columns of the crystal grid</Hint></div>
        <div className="rounded-2xl bg-white/90 p-3"><Visualizer kind="array" params={{ rows: 3, cols: 4, item: 'crystal' }} /></div>
      </div>
    </Stage>
  );
}

export function PauseMul({ answer }: SceneProps) {
  const solved = answer === 'correct';
  return (
    <Stage backdrop="space" celebrate={solved} shake={answer === 'wrong'}>
      <div className="flex h-full min-h-[300px] flex-col items-center justify-between gap-3 p-4 sm:min-h-[340px]">
        <Hint>3 warp engines each need 5 energy cells</Hint>
        <div className="flex flex-wrap items-end justify-center gap-3 sm:gap-8">
          {[0, 1, 2].map((i) => <Ship key={i} i={i} crystals={5} launched={solved} lit={solved} />)}
        </div>
        <Bubble tone={solved ? 'gold' : 'dark'}>{solved ? '3 × 5 = 15 — Hyperdrive!' : '3 × 5 = ?'}</Bubble>
      </div>
    </Stage>
  );
}
