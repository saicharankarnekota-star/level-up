import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Apple, Basket } from '../../anim/sprites';
import { LottieSprite } from '../../anim/LottieSprite';
import { Bubble, CountBadge, Hint, Pop, Stage, type SceneProps } from './Stage';

const Mia = ({ wave = true }: { wave?: boolean }) => (
  <LottieSprite name="girl" label="Mia" play={wave} className="h-24 w-24 drop-shadow-lg sm:h-32 sm:w-32"
    fallback={<div className="h-full w-full rounded-full bg-[#F4CF55]" />} />
);

/** Tap-to-count: each tap stamps the next number on the item. */
function useTapCount(say: SceneProps['say']) {
  const [order, setOrder] = useState<string[]>([]);
  const tap = (id: string) => {
    if (order.includes(id)) return;
    const next = [...order, id];
    setOrder(next);
    say(String(next.length));
  };
  return { order, tap, badge: (id: string) => (order.includes(id) ? order.indexOf(id) + 1 : 0) };
}

export function ApplesIntro({ say }: SceneProps) {
  const { order, tap, badge } = useTapCount(say);
  const apples = [...['r1', 'r2', 'r3'].map((id) => ({ id, color: 'red' as const })), ...['g1', 'g2'].map((id) => ({ id, color: 'green' as const }))];
  return (
    <Stage backdrop="orchard">
      <div className="flex h-full min-h-[300px] flex-col items-center justify-between gap-3 p-4 sm:min-h-[340px]">
        <Hint>Tap each apple to count it</Hint>
        <div className="flex w-full flex-wrap items-end justify-center gap-6 sm:gap-10">
          <div className="flex flex-col items-center"><Mia /><span className="mt-1 rounded-full bg-white/90 px-2 text-xs font-bold text-[#C1121F]">Mia has 3</span></div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-1">
              {apples.slice(0, 3).map((a, i) => (
                <Pop key={a.id} i={i} onClick={() => tap(a.id)} label={`Red apple ${i + 1}`}>
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}><Apple color="red" size={54} /></motion.div>
                  {badge(a.id) > 0 && <CountBadge n={badge(a.id)} />}
                </Pop>
              ))}
            </div>
            <Basket size={70} />
          </div>
          <div className="text-4xl font-black text-white drop-shadow">+</div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-1">
              {apples.slice(3).map((a, i) => (
                <Pop key={a.id} i={i + 3} onClick={() => tap(a.id)} label={`Green apple ${i + 1}`}>
                  <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ repeat: Infinity, duration: 2.4, delay: i * 0.4 }}><Apple color="green" size={54} /></motion.div>
                  {badge(a.id) > 0 && <CountBadge n={badge(a.id)} />}
                </Pop>
              ))}
            </div>
            <span className="rounded-full bg-white/90 px-2 text-xs font-bold text-[#2F7D4A]">Friend gives 2</span>
          </div>
        </div>
        <Bubble tone={order.length === 5 ? 'gold' : 'light'}>{order.length === 5 ? '5 apples in all!' : order.length ? `${order.length}…` : 'How many in all?'}</Bubble>
      </div>
    </Stage>
  );
}

export function ApplesAdd({ say }: SceneProps) {
  const basketRef = useRef<HTMLDivElement>(null);
  const [inBasket, setInBasket] = useState<string[]>([]);
  const greens = ['g1', 'g2'];
  const total = 3 + inBasket.length;
  const done = inBasket.length === 2;

  const drop = (id: string) => {
    if (inBasket.includes(id)) return;
    const next = [...inBasket, id];
    setInBasket(next);
    say(next.length === 2 ? '3 plus 2 makes 5!' : String(3 + next.length));
  };
  const overBasket = (x: number, y: number) => {
    const r = basketRef.current?.getBoundingClientRect();
    return !!r && x > r.left - 30 && x < r.right + 30 && y > r.top - 60 && y < r.bottom + 20;
  };

  return (
    <Stage backdrop="orchard" celebrate={done}>
      <div className="flex h-full min-h-[300px] flex-col items-center justify-between gap-3 p-4 sm:min-h-[340px]">
        <Hint>{done ? 'All in the basket!' : 'Drag (or tap) the green apples into Mia’s basket'}</Hint>
        <div className="flex w-full items-end justify-center gap-6 sm:gap-14">
          <Mia />
          <div ref={basketRef} className="flex flex-col items-center">
            <motion.div layout className="flex min-h-[48px] max-w-[220px] flex-wrap items-end justify-center -space-x-1">
              {[1, 2, 3].map((n) => <Apple key={n} color="red" size={44} />)}
              {inBasket.map((id) => (
                <motion.div key={id} layoutId={id} initial={{ y: -40 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}>
                  <Apple color="green" size={44} />
                </motion.div>
              ))}
            </motion.div>
            <Basket size={80} />
          </div>
          <div className="flex min-w-[120px] gap-2 rounded-2xl border-2 border-dashed border-white/70 bg-white/20 p-2">
            {greens.filter((id) => !inBasket.includes(id)).map((id) => (
              <motion.button key={id} layoutId={id} type="button" aria-label="Green apple — put it in the basket"
                drag dragSnapToOrigin dragElastic={0.6} whileDrag={{ scale: 1.2, zIndex: 30 }} whileHover={{ scale: 1.1 }}
                onDragEnd={(_, info) => overBasket(info.point.x - window.scrollX, info.point.y - window.scrollY) && drop(id)}
                onClick={() => drop(id)} className="cursor-grab touch-none active:cursor-grabbing">
                <Apple color="green" size={54} />
              </motion.button>
            ))}
            {done && <span className="m-auto text-xs font-bold text-white">empty!</span>}
          </div>
        </div>
        <Bubble tone={done ? 'gold' : 'dark'}>3 + {inBasket.length} = {total}</Bubble>
      </div>
    </Stage>
  );
}

export function PauseAdd({ answer }: SceneProps) {
  const solved = answer === 'correct';
  return (
    <Stage backdrop="orchard" celebrate={solved} shake={answer === 'wrong'}>
      <div className="flex h-full min-h-[300px] flex-col items-center justify-between gap-3 p-4 sm:min-h-[340px]">
        <Hint>Farmer Ben brings 4 apples. Mia has 3.</Hint>
        <div className="flex w-full items-end justify-center gap-4 sm:gap-10">
          {!solved && (
            <div className="flex flex-col items-center gap-1">
              <div className="grid grid-cols-2 gap-1">{[0, 1, 2, 3].map((i) => <motion.div key={i} layoutId={`ben${i}`}><Apple color="green" size={40} /></motion.div>)}</div>
              <span className="rounded-full bg-white/90 px-2 text-xs font-bold">Ben: 4</span>
            </div>
          )}
          <div className="flex flex-col items-center">
            <div className="flex min-h-[44px] max-w-[240px] flex-wrap justify-center -space-x-1">
              {[0, 1, 2].map((i) => <Apple key={i} color="red" size={40} />)}
              {solved && [0, 1, 2, 3].map((i) => (
                <motion.div key={i} layoutId={`ben${i}`} transition={{ type: 'spring', stiffness: 200, damping: 16, delay: i * 0.1 }}><Apple color="green" size={40} /></motion.div>
              ))}
            </div>
            <Basket size={86} />
            <span className="mt-1 rounded-full bg-white/90 px-2 text-xs font-bold">Mia: 3</span>
          </div>
          <Mia wave={solved} />
        </div>
        <Bubble tone={solved ? 'gold' : 'dark'}>{solved ? '4 + 3 = 7!' : '4 + 3 = ?'}</Bubble>
      </div>
    </Stage>
  );
}
