import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LottieSprite } from '../../anim/LottieSprite';
import { Bubble, Hint, Stage, type SceneProps } from './Stage';

function Flames({ id }: { id: number }) {
  return (
    <motion.svg key={id} viewBox="0 0 200 80" className="pointer-events-none absolute left-[-55%] top-[38%] w-[70%]" aria-hidden
      initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }} transition={{ duration: 1.1 }} style={{ originX: 1 }}>
      <defs>
        <radialGradient id={`fire${id}`} cx="90%" cy="50%" r="90%"><stop offset="0" stopColor="#FFF3B0" /><stop offset=".4" stopColor="#FFB703" /><stop offset="1" stopColor="#E85D04" stopOpacity="0" /></radialGradient>
      </defs>
      <path d="M200 40 C150 10 80 0 0 20 C40 34 40 46 0 60 C80 80 150 70 200 40 Z" fill={`url(#fire${id})`} />
    </motion.svg>
  );
}

/** The Maths Dragon. `mood` reacts to battle events; changing `eventKey` replays the reaction. */
export function Dragon({ mood = 'idle', eventKey, className = 'h-40 w-64' }: { mood?: 'idle' | 'hit' | 'fire'; eventKey?: number | string; className?: string }) {
  return (
    <motion.div key={`${mood}-${eventKey}`} className={`relative ${className}`}
      animate={mood === 'hit' ? { x: [0, 14, -10, 6, 0], filter: ['brightness(1)', 'brightness(2.2)', 'brightness(1)'] } : mood === 'fire' ? { scale: [1, 1.08, 1] } : {}}
      transition={{ duration: 0.6 }}>
      <LottieSprite name="dragon" label="Pyroth the Maths Dragon" flip className="h-full w-full"
        fallback={<div className="h-full w-full rounded-full bg-[#2F9E44]/50" />} />
      {mood === 'fire' && <Flames id={Number(eventKey) || 0} />}
    </motion.div>
  );
}

export function DragonIntro({ say }: SceneProps) {
  const [roars, setRoars] = useState(0);
  return (
    <Stage backdrop="peak">
      <div className="flex h-full min-h-[300px] flex-col items-center justify-between gap-3 p-4 sm:min-h-[340px]">
        <Hint>Tap the dragon to hear it roar</Hint>
        <button type="button" onClick={() => { setRoars(roars + 1); say('Roaaar! Answer my questions if you dare!'); }} aria-label="Make the dragon roar"
          className="relative">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
            <Dragon mood={roars ? 'fire' : 'idle'} eventKey={roars} className="h-44 w-72 sm:h-56 sm:w-96" />
          </motion.div>
        </button>
        <Bubble tone="gold">{roars ? 'Defeat me in 4 rounds!' : 'Pyroth awakens…'}</Bubble>
      </div>
    </Stage>
  );
}
