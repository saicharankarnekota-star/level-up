import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import { Chip, Controls, Readout, Stepper, clamp, num, str, type VisualizerProps } from './common';
import {
  AnimalFace, Apple, Coin, Cookie, Crayon, Crystal, Fruit, PaperClip, PatternShape, Pencil, type FruitKind, type PatternKind,
} from '../anim/sprites';
import { LottieSprite } from '../anim/LottieSprite';
import { Celebrate } from '../anim/Celebrate';

const spring = { type: 'spring', stiffness: 420, damping: 20 } as const;

// ---------- Ten-frame apples (counting, addition) ----------

export function TenFrame({ params, onInteract }: VisualizerProps) {
  const twoGroups = params?.b !== undefined;
  const [a, setA] = useState(clamp(num(params, 'a', 5), 0, twoGroups ? 10 : 20));
  const [b, setB] = useState(clamp(num(params, 'b', 0), 0, 10));
  const total = a + (twoGroups ? b : 0);
  const cells = Array.from({ length: 20 }, (_, i) => (i < a ? 'a' : twoGroups && i < total ? 'b' : null));
  const change = (fn: (n: number) => void) => (n: number) => { fn(n); onInteract?.(); };
  const tapCell = (i: number) => {
    onInteract?.();
    if (cells[i] === 'a') setA(a - 1);
    else if (cells[i] === 'b') setB(b - 1);
    else if (twoGroups && b < 10) setB(b + 1);
    else if (!twoGroups && a < 20) setA(a + 1);
  };

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[0, 1].map((frame) => (
          <div key={frame} className={`grid grid-cols-5 gap-1.5 rounded-2xl border-4 border-[#8B5A2B] bg-gradient-to-b from-[#E8C39E] to-[#D4A373] p-2 shadow-inner transition ${frame === 1 && total <= 10 ? 'opacity-50' : ''}`}>
            {cells.slice(frame * 10, frame * 10 + 10).map((c, j) => {
              const i = frame * 10 + j;
              return (
                <button key={i} type="button" onClick={() => tapCell(i)} aria-label={c ? 'Remove apple' : 'Add apple'}
                  className="grid aspect-square place-items-center rounded-full bg-[#B07D4F]/40 shadow-[inset_0_3px_6px_rgba(0,0,0,.25)] hover:bg-[#B07D4F]/60">
                  <AnimatePresence>
                    {c && (
                      <motion.span key={c} initial={{ y: -30, scale: 0.4, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={spring}>
                        <Apple color={c === 'a' ? 'red' : 'green'} size={34} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-xs font-bold text-[#6B7385]">Tap an empty spot to add an apple, tap an apple to take it away</p>
      <Controls>
        <Stepper label={twoGroups ? 'Red' : 'Apples'} value={a} min={0} max={twoGroups ? 10 : 20} onChange={change(setA)} />
        {twoGroups && <Stepper label="Green" value={b} min={0} max={10} onChange={change(setB)} />}
      </Controls>
      <Readout>{twoGroups ? `${a} + ${b} = ${total}` : `${total} apple${total === 1 ? '' : 's'}${total >= 10 ? ` = ${Math.floor(total / 10)} ten${total >= 20 ? 's' : ''} and ${total % 10} ones` : ''}`}</Readout>
    </div>
  );
}

// ---------- Number line hop with the frog ----------

export function NumberLine({ params, onInteract }: VisualizerProps) {
  const max = num(params, 'max', 20);
  const [start, setStart] = useState(clamp(num(params, 'start', 5), 0, max));
  const [hops, setHops] = useState(num(params, 'hops', 3));
  const [pos, setPos] = useState(start);
  const [trail, setTrail] = useState<number[]>([]);
  const timer = useRef<number | undefined>(undefined);
  const end = clamp(start + hops, 0, max);
  const windowStart = max <= 20 ? 0 : clamp(Math.min(start, end) - 2, 0, max - 20);
  const ticks = Array.from({ length: Math.min(21, max + 1) }, (_, i) => windowStart + i);
  const xOf = (t: number) => ((t - windowStart + 0.5) / ticks.length) * 100;
  const dir = Math.sign(end - start);

  useEffect(() => () => window.clearInterval(timer.current), []);
  useEffect(() => { setPos(start); setTrail([]); }, [start, hops]);

  const play = () => {
    window.clearInterval(timer.current);
    onInteract?.();
    let p = start;
    setPos(p);
    setTrail([]);
    if (!dir) return;
    timer.current = window.setInterval(() => {
      p += dir;
      setPos(p);
      setTrail((t) => [...t, p]);
      if (p === end) window.clearInterval(timer.current);
    }, 650);
  };

  const steps = [start, ...trail];
  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <div className="relative mx-auto min-w-[560px] rounded-2xl bg-gradient-to-b from-[#E3F6FF] to-[#C9EBC0] px-3 pb-3 pt-24">
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-3 top-[64px] h-10 w-[calc(100%-24px)] overflow-visible" aria-hidden>
            {steps.slice(1).map((t, i) => {
              const x1 = xOf(steps[i]), x2 = xOf(t);
              return <motion.path key={`${i}-${t}`} d={`M${x1} 20 Q${(x1 + x2) / 2} -2 ${x2} 20`} stroke="#2F9E44" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 5" fill="none"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }} vectorEffect="non-scaling-stroke" />;
            })}
          </svg>
          <motion.div className="absolute top-4 z-10 -ml-9 h-16 w-[72px]" initial={false}
            animate={{ left: `calc(12px + (100% - 24px) * ${xOf(pos) / 100})`, y: trail.length ? [0, -34, 0] : 0 }}
            transition={{ left: { duration: 0.5, ease: 'easeInOut' }, y: { duration: 0.5 } }}>
            {/* The frog is drawn in the left half of its Lottie frame, so shift it back to centre. */}
            <div className="h-full w-full" style={{ transform: `translateX(${dir >= 0 ? -24 : 24}%)` }}>
              <LottieSprite name="frog" label="Frog" loop={false} playKey={trail.length} play={trail.length > 0} flip={dir >= 0} className="h-full w-full"
                fallback={<div className="mx-auto mt-4 h-10 w-12 rounded-full bg-[#46A758]" />} />
            </div>
          </motion.div>
          <div className="absolute left-3 right-3 top-[104px] h-1.5 rounded bg-[#27314D]" />
          <div className="relative grid" style={{ gridTemplateColumns: `repeat(${ticks.length}, minmax(0,1fr))` }}>
            {ticks.map((t) => (
              <div key={t} className="relative flex flex-col items-center">
                <span className={`mt-1 h-4 w-0.5 ${t === start ? 'bg-[#E5484D]' : 'bg-[#27314D]'}`} />
                <span className={`mt-1 rounded px-1 text-[11px] font-bold ${t === end && trail.includes(end) ? 'bg-[#F4CF55] text-[#27314D]' : trail.includes(t) ? 'text-[#2F7D4A]' : t === start ? 'text-[#E5484D]' : 'text-[#6B7385]'}`}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Controls>
        <Stepper label="Start" value={start} min={0} max={max} onChange={(n) => { setStart(n); onInteract?.(); }} />
        <Stepper label="Hops" value={hops} min={-start} max={max - start} onChange={(n) => { setHops(n); onInteract?.(); }} />
        <button type="button" className="button button-yellow" onClick={play}><Play size={15} /> Hop!</button>
      </Controls>
      <Readout>{start} {hops >= 0 ? '+' : '−'} {Math.abs(hops)} = {end}</Readout>
    </div>
  );
}

// ---------- Compare two groups with the hungry crocodile ----------

function Balance() {
  return (
    <svg viewBox="0 0 100 70" className="h-16 w-24" aria-label="Balanced scale" role="img">
      <path d="M50 12 V60 M34 64 H66" stroke="#27314D" strokeWidth="5" strokeLinecap="round" />
      <path d="M14 22 H86" stroke="#27314D" strokeWidth="4" strokeLinecap="round" />
      <path d="M14 22 L4 44 H24 Z M86 22 L76 44 H96 Z" fill="#F4CF55" stroke="#A0782A" strokeWidth="2" />
      <circle cx="50" cy="12" r="5" fill="#E5484D" />
    </svg>
  );
}

export function Compare({ params, onInteract }: VisualizerProps) {
  const [a, setA] = useState(clamp(num(params, 'a', 8), 0, 20));
  const [b, setB] = useState(clamp(num(params, 'b', 5), 0, 20));
  const sign = a > b ? '>' : a < b ? '<' : '=';
  const fish = (n: number, color: string) => (
    <div className="grid min-h-[64px] w-32 grid-cols-5 content-start gap-1 rounded-2xl bg-gradient-to-b from-[#A2D2FF] to-[#5FA8D3] p-2 shadow-inner">
      <AnimatePresence>
        {Array.from({ length: n }, (_, i) => (
          <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring}>
            <svg viewBox="0 0 40 24" className="w-full" aria-hidden><path d="M4 12 Q16 0 30 12 Q16 24 4 12 Z M30 12 L38 4 V20 Z" fill={color} /><circle cx="12" cy="10" r="2" fill="#fff" /></svg>
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
  return (
    <div>
      <div className="flex items-center justify-center gap-3 sm:gap-5">
        <div className="text-center">{fish(a, '#F77F00')}<b className="mt-2 block font-['Space_Grotesk'] text-2xl">{a}</b></div>
        <div className="flex flex-col items-center">
          {sign === '=' ? <Balance /> : (
            <motion.div key={`${a}-${b}`} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.4 }}>
              <LottieSprite name="crocodile" label={`Crocodile eats the bigger number, ${Math.max(a, b)}`} flip={sign === '<'} loop={false} playKey={`${a}-${b}`} className="h-20 w-28"
                fallback={<b className="text-4xl">{sign}</b>} />
            </motion.div>
          )}
          <b className="font-['Space_Grotesk'] text-5xl text-[#27314D]">{sign}</b>
        </div>
        <div className="text-center">{fish(b, '#3E63DD')}<b className="mt-2 block font-['Space_Grotesk'] text-2xl">{b}</b></div>
      </div>
      <Controls>
        <Stepper label="Left" value={a} min={0} max={20} onChange={(n) => { setA(n); onInteract?.(); }} />
        <Stepper label="Right" value={b} min={0} max={20} onChange={(n) => { setB(n); onInteract?.(); }} />
      </Controls>
      <Readout>{a} {sign} {b} — {sign === '=' ? 'they are equal' : `${Math.max(a, b)} is greater than ${Math.min(a, b)}`}</Readout>
    </div>
  );
}

// ---------- Base-ten blocks (place value, add/subtract to 100) ----------

function Blocks({ tens, ones, tone = 'bg-[#3E63DD]' }: { tens: number; ones: number; tone?: string }) {
  return (
    <div className="flex min-h-[132px] flex-wrap items-end gap-1.5">
      <AnimatePresence initial={false}>
        {Array.from({ length: tens }, (_, i) => (
          <motion.div key={`t${i}`} layout initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} exit={{ scaleY: 0, opacity: 0 }}
            transition={spring} style={{ originY: 1 }}
            className="grid grid-rows-10 gap-px rounded-sm border border-[#27314D]/40 bg-[#27314D]/30 p-px shadow">
            {Array.from({ length: 10 }, (_, j) => <span key={j} className={`h-[11px] w-[11px] ${tone}`} />)}
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="grid grid-cols-5 gap-px self-end">
        <AnimatePresence initial={false}>
          {Array.from({ length: ones }, (_, i) => (
            <motion.span key={`o${i}`} layout initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ y: -30, scale: 0.4, opacity: 0 }} transition={spring}
              className="h-[11px] w-[11px] rounded-[2px] bg-[#F4A23C] ring-1 ring-[#C47B1F]/50" />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function BaseTen({ params, onInteract }: VisualizerProps) {
  const op = str(params, 'op', '');
  if (op === '+' || op === '−') return <BaseTenOp params={params} onInteract={onInteract} />;
  return <BaseTenPlace params={params} onInteract={onInteract} />;
}

function BaseTenPlace({ params, onInteract }: VisualizerProps) {
  const n0 = clamp(num(params, 'n', 34), 0, 99);
  const [tens, setTens] = useState(Math.floor(n0 / 10));
  const [ones, setOnes] = useState(n0 % 10);
  const [traded, setTraded] = useState(0);
  const addOne = () => {
    onInteract?.();
    if (ones === 9 && tens < 9) { setOnes(0); setTens(tens + 1); setTraded(traded + 1); } else if (ones < 9) setOnes(ones + 1);
  };
  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border border-[#E6E1D6] bg-[#FFFDF8] p-4"><Blocks tens={tens} ones={ones} /><Celebrate trigger={traded} effect="sparkle" /></div>
      <Controls>
        <Stepper label="Tens" value={tens} min={0} max={9} onChange={(v) => { setTens(v); onInteract?.(); }} />
        <Stepper label="Ones" value={ones} min={0} max={9} onChange={(v) => { setOnes(v); onInteract?.(); }} />
        <button type="button" className="button button-dark" onClick={addOne}>+1 (watch 9 → 10!)</button>
      </Controls>
      <Readout>{tens} tens + {ones} ones = {tens * 10} + {ones} = {tens * 10 + ones}</Readout>
    </div>
  );
}

function BaseTenOp({ params, onInteract }: VisualizerProps) {
  const op = str(params, 'op', '+');
  const [a, setA] = useState(clamp(num(params, 'a', 27), 0, 99));
  const [b, setB] = useState(clamp(num(params, 'b', 15), 0, op === '+' ? 99 - a : a));
  const [stage, setStage] = useState(0);
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);
  const ta = Math.floor(a / 10), oa = a % 10, tb = Math.floor(b / 10), ob = b % 10;
  const result = op === '+' ? a + b : a - b;

  useEffect(() => { setStage(0); setTens(ta); setOnes(oa); }, [a, b, ta, oa]);

  const next = () => {
    onInteract?.();
    if (op === '+') {
      if (stage === 0) { setTens(ta + tb); setOnes(oa + ob); setStage(1); }
      else if (stage === 1 && ones >= 10) { setTens(tens + 1); setOnes(ones - 10); setStage(2); }
    } else if (stage === 0 && oa < ob) { setTens(ta - 1); setOnes(oa + 10); setStage(1); }
    else { setTens((stage === 0 ? ta : tens) - tb); setOnes((stage === 0 ? oa : ones) - ob); setStage(2); }
  };

  const nextLabel = op === '+'
    ? stage === 0 ? 'Put them together' : ones >= 10 ? 'Trade 10 ones → 1 ten' : null
    : stage === 0 && oa < ob ? 'Break a ten into 10 ones' : stage < 2 ? `Take away ${b}` : null;
  const done = !nextLabel;

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="relative overflow-hidden rounded-xl border border-[#E6E1D6] bg-[#FFFDF8] p-3">
          <div className="mb-1 text-xs font-bold text-[#6B7385]">{stage === 0 ? `${a}` : 'Now'}</div>
          <Blocks tens={stage === 0 ? ta : tens} ones={stage === 0 ? oa : ones} />
          <Celebrate trigger={stage === 2 && op === '+' ? 'traded' : null} effect="sparkle" />
        </div>
        <div className={`rounded-xl border border-dashed border-[#E6E1D6] p-3 transition ${stage > 0 && op === '+' ? 'opacity-30' : ''}`}>
          <div className="mb-1 text-xs font-bold text-[#6B7385]">{op === '+' ? `Add ${b}` : `Take away ${b}`}</div>
          <Blocks tens={tb} ones={ob} tone={op === '+' ? 'bg-[#46A758]' : 'bg-[#E5484D]/60'} />
        </div>
      </div>
      <Controls>
        <Stepper label="First" value={a} min={op === '+' ? 0 : b} max={op === '+' ? 99 - b : 99} onChange={(v) => { setA(v); onInteract?.(); }} />
        <Stepper label="Second" value={b} min={0} max={op === '+' ? 99 - a : a} onChange={(v) => { setB(v); onInteract?.(); }} />
        {nextLabel && <button type="button" className="button button-yellow" onClick={next}>{nextLabel}</button>}
        {stage > 0 && <button type="button" className="button button-dark" onClick={() => { setStage(0); setTens(ta); setOnes(oa); }}><RotateCcw size={14} /> Again</button>}
      </Controls>
      <Readout>{a} {op} {b} = {done ? result : '?'}{done && ` (${tens} tens and ${ones} ones)`}</Readout>
    </div>
  );
}

// ---------- Arrays (cookies on a tray, or power crystals) ----------

export function ArrayBuilder({ params, onInteract }: VisualizerProps) {
  const item = str(params, 'item', 'cookie');
  const [rows, setRows] = useState(clamp(num(params, 'rows', 3), 1, 6));
  const [cols, setCols] = useState(clamp(num(params, 'cols', 4), 1, 10));
  const [counted, setCounted] = useState(0);
  useEffect(() => setCounted(0), [rows, cols]);
  const crystal = item === 'crystal';
  const noun = crystal ? 'crystals' : 'cookies';
  return (
    <div>
      <div className={`flex flex-col items-center gap-1.5 rounded-2xl p-4 ${crystal ? 'bg-gradient-to-b from-[#1B1446] to-[#3A0CA3]' : 'border-4 border-[#9AA0AC] bg-gradient-to-b from-[#D9DDE3] to-[#B8BEC8] shadow-inner'}`}>
        {Array.from({ length: rows }, (_, r) => (
          <button key={r} type="button" onClick={() => { setCounted(r + 1); onInteract?.(); }} aria-label={`Count up to row ${r + 1}`}
            className={`flex items-center gap-1.5 rounded-xl px-1 transition ${r < counted ? (crystal ? 'bg-[#4CC9F0]/25' : 'bg-white/50') : ''}`}>
            {Array.from({ length: cols }, (_, c) => (
              <motion.span key={`${r}-${c}`} initial={{ scale: 0, y: -10 }} animate={{ scale: 1, y: 0 }} transition={{ ...spring, delay: r * 0.08 + c * 0.03 }}>
                {crystal ? <Crystal size={30} glow={r < counted} /> : <Cookie size={30} />}
              </motion.span>
            ))}
            <span className={`ml-3 w-8 text-right text-sm font-bold ${crystal ? 'text-[#9BF6FF]' : 'text-[#2F7D4A]'}`}>{r < counted || counted === 0 ? (r + 1) * cols : ''}</span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-center text-xs font-bold text-[#6B7385]">Tap a row to skip count up to it</p>
      <Controls>
        <Stepper label="Rows" value={rows} min={1} max={6} onChange={(v) => { setRows(v); onInteract?.(); }} />
        <Stepper label="In each row" value={cols} min={1} max={10} onChange={(v) => { setCols(v); onInteract?.(); }} />
      </Controls>
      <Readout>
        {counted ? `${Array.from({ length: counted }, (_, i) => (i + 1) * cols).join(', ')} ${noun}` : `${Array.from({ length: rows }, () => cols).join(' + ')} = ${rows * cols}`}
        <span className="block text-xs text-white/70">{rows} rows of {cols} = {rows} × {cols} = {rows * cols}</span>
      </Readout>
    </div>
  );
}

// ---------- Shapes, with a real-life example of each ----------

const SHAPES = [
  { name: 'Circle', sides: 0, example: 'a clock' },
  { name: 'Triangle', sides: 3, example: 'a road sign' },
  { name: 'Square', sides: 4, example: 'a window' },
  { name: 'Rectangle', sides: 4, example: 'a door' },
  { name: 'Pentagon', sides: 5, example: 'a house' },
  { name: 'Hexagon', sides: 6, example: 'a honeycomb cell' },
];

function shapePoints(name: string, sides: number): [number, number][] {
  if (name === 'Rectangle') return [[30, 60], [170, 60], [170, 140], [30, 140]];
  if (name === 'Square') return [[50, 50], [150, 50], [150, 150], [50, 150]];
  return Array.from({ length: sides }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
    return [100 + 70 * Math.cos(a), 105 + 70 * Math.sin(a)];
  });
}

function RealObject({ name }: { name: string }) {
  const art: Record<string, ReactNode> = {
    Circle: <><circle cx="50" cy="50" r="40" fill="#fff" stroke="#27314D" strokeWidth="6" />{Array.from({ length: 12 }, (_, i) => <circle key={i} cx={50 + 31 * Math.sin(i * Math.PI / 6)} cy={50 - 31 * Math.cos(i * Math.PI / 6)} r="2.5" fill="#27314D" />)}<path d="M50 50 V28 M50 50 L64 58" stroke="#E5484D" strokeWidth="4" strokeLinecap="round" /></>,
    Triangle: <><rect x="46" y="70" width="8" height="28" fill="#8D99AE" /><path d="M50 8 L92 76 H8 Z" fill="#fff" stroke="#E5484D" strokeWidth="9" strokeLinejoin="round" /><text x="50" y="62" textAnchor="middle" fontSize="26" fontWeight="900" fill="#27314D">!</text></>,
    Square: <><rect x="12" y="12" width="76" height="76" fill="#A2D2FF" stroke="#8B5A2B" strokeWidth="7" /><path d="M50 12 V88 M12 50 H88" stroke="#8B5A2B" strokeWidth="5" /><path d="M20 20 L36 36" stroke="#fff" strokeWidth="3" /></>,
    Rectangle: <><rect x="26" y="6" width="48" height="88" rx="2" fill="#B5651D" stroke="#7A4E2A" strokeWidth="4" /><rect x="33" y="14" width="34" height="30" fill="#9C5518" /><rect x="33" y="52" width="34" height="34" fill="#9C5518" /><circle cx="64" cy="50" r="3.5" fill="#F4CF55" /></>,
    Pentagon: <><path d="M50 8 L90 42 V92 H10 V42 Z" fill="#FFD6A5" stroke="#C1121F" strokeWidth="5" strokeLinejoin="round" /><rect x="40" y="62" width="20" height="30" fill="#8B5A2B" /><rect x="18" y="50" width="16" height="14" fill="#A2D2FF" /><rect x="66" y="50" width="16" height="14" fill="#A2D2FF" /></>,
    Hexagon: <>{[[50, 50], [24, 35], [76, 35], [24, 65], [76, 65], [50, 20], [50, 80]].map(([x, y], i) => <path key={i} transform={`translate(${x} ${y})`} d="M0 -14 L12 -7 V7 L0 14 L-12 7 V-7 Z" fill={i ? '#F7B32B' : '#FFD166'} stroke="#B5651D" strokeWidth="2" />)}</>,
  };
  return <svg viewBox="0 0 100 100" className="h-24 w-24" role="img" aria-label={name}>{art[name]}</svg>;
}

export function ShapeExplorer({ params, onInteract }: VisualizerProps) {
  const [name, setName] = useState(str(params, 'shape', 'Triangle'));
  const shape = SHAPES.find((s) => s.name === name) ?? SHAPES[1];
  const pts = shapePoints(shape.name, shape.sides);
  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {SHAPES.map((s) => <Chip key={s.name} active={s.name === name} onClick={() => { setName(s.name); onInteract?.(); }}>{s.name}</Chip>)}
      </div>
      <div className="relative mt-3 flex flex-wrap items-center justify-center gap-6">
        <Celebrate trigger={name} effect="sparkle" />
        <motion.svg key={shape.name} viewBox="0 0 200 200" className="h-56 w-56" initial={{ scale: 0.6, rotate: -15, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={spring}>
          {shape.sides === 0 ? (
            <circle cx="100" cy="100" r="70" fill="#FFF3C4" stroke="#27314D" strokeWidth="4" />
          ) : (
            <>
              <polygon points={pts.map((p) => p.join(',')).join(' ')} fill="#FFF3C4" stroke="#27314D" strokeWidth="4" strokeLinejoin="round" />
              {pts.map(([x, y], i) => (
                <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...spring, delay: 0.2 + i * 0.12 }} style={{ originX: `${x}px`, originY: `${y}px` }}>
                  <circle cx={x} cy={y} r="9" fill="#E5484D" />
                  <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">{i + 1}</text>
                </motion.g>
              ))}
            </>
          )}
        </motion.svg>
        <motion.div key={`ex-${shape.name}`} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.25 }}
          className="flex flex-col items-center rounded-2xl border border-[#E6E1D6] bg-white p-3">
          <RealObject name={shape.name} />
          <span className="mt-1 text-xs font-bold text-[#6B7385]">Like {shape.example}</span>
        </motion.div>
      </div>
      <Readout>{shape.name}: {shape.sides === 0 ? 'no straight sides and no corners' : `${shape.sides} sides and ${shape.sides} corners`}</Readout>
    </div>
  );
}

// ---------- Measure with paper clips ----------

const CLIP = 34;

export function Measure({ params, onInteract }: VisualizerProps) {
  const [a, setA] = useState(clamp(num(params, 'a', 6), 1, 12));
  const [b, setB] = useState(clamp(num(params, 'b', 4), 1, 12));
  const [clips, setClips] = useState<[number, number]>([0, 0]);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => { setClips([0, 0]); }, [a, b]);
  useEffect(() => () => window.clearInterval(timer.current), []);
  const lens = [a, b];

  const addClip = (row: 0 | 1) => {
    onInteract?.();
    setClips((c) => (c[row] >= lens[row] ? c : (row ? [c[0], c[1] + 1] : [c[0] + 1, c[1]])));
  };
  const measureAll = () => {
    onInteract?.();
    window.clearInterval(timer.current);
    setClips([0, 0]);
    timer.current = window.setInterval(() => {
      setClips((c) => {
        const next: [number, number] = [Math.min(a, c[0] + 1), Math.min(b, c[1] + 1)];
        if (next[0] === a && next[1] === b) window.clearInterval(timer.current);
        return next;
      });
    }, 220);
  };

  const done = clips[0] === a && clips[1] === b;
  const row = (i: 0 | 1, label: string, object: ReactNode) => (
    <div className="mb-3">
      <div className="mb-1 text-xs font-bold text-[#6B7385]">{label}</div>
      <div className="relative" style={{ width: lens[i] * CLIP + 4 }}>{object}</div>
      <button type="button" onClick={() => addClip(i)} aria-label={`Lay a paper clip under the ${label.toLowerCase()}`}
        className="mt-1 flex h-7 items-center rounded-lg border-2 border-dashed border-[#BFB8A6] bg-white/60 hover:border-[#27314D]" style={{ width: lens[i] * CLIP + 4 }}>
        <AnimatePresence>
          {Array.from({ length: clips[i] }, (_, k) => (
            <motion.span key={k} initial={{ y: -24, opacity: 0, rotate: -20 }} animate={{ y: 0, opacity: 1, rotate: 0 }} transition={spring} className="relative">
              <PaperClip size={CLIP} />
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#6B7385]">{k + 1}</span>
            </motion.span>
          ))}
        </AnimatePresence>
        {clips[i] < lens[i] && <span className="ml-1 text-[10px] font-bold text-[#9A8F6B]">tap to add a clip</span>}
      </button>
    </div>
  );
  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-[#E6E1D6] bg-[#FFFDF8] p-4">
        {row(0, 'Pencil', <Pencil length={a * CLIP} />)}
        {row(1, 'Crayon', <Crayon length={b * CLIP} color="#3E63DD" />)}
        <div className="relative mt-2 h-8 rounded-sm border-t-4 border-[#E9B949] bg-[#FFF3C4]" style={{ width: 12 * CLIP + 4 }} aria-label="Ruler in paper clips">
          {Array.from({ length: 13 }, (_, i) => (
            <span key={i} className="absolute top-0 h-3 border-l-2 border-[#A0782A]" style={{ left: i * CLIP }}>
              <span className="absolute -left-1 top-3 text-[9px] font-bold text-[#A0782A]">{i}</span>
            </span>
          ))}
        </div>
      </div>
      <Controls>
        <Stepper label="Pencil" value={a} min={1} max={12} onChange={(v) => { setA(v); onInteract?.(); }} />
        <Stepper label="Crayon" value={b} min={1} max={12} onChange={(v) => { setB(v); onInteract?.(); }} />
        <button type="button" className="button button-yellow" onClick={measureAll}>Measure both</button>
      </Controls>
      <Readout>{!done ? `Pencil: ${clips[0]} clips · Crayon: ${clips[1]} clips` : a === b ? 'Same length!' : `The ${a > b ? 'pencil' : 'crayon'} is longer by ${Math.abs(a - b)} clip${Math.abs(a - b) === 1 ? '' : 's'}`}</Readout>
    </div>
  );
}

// ---------- Pattern maker ----------

type Token = { kind: PatternKind; color?: string } | { fruit: FruitKind } | { animal: 'dog' | 'cat' };

const TOKENS: Record<string, Token> = {
  red: { kind: 'circle', color: '#E5484D' },
  blue: { kind: 'circle', color: '#3E63DD' },
  star: { kind: 'star' },
  moon: { kind: 'moon' },
  apple: { fruit: 'apple' },
  banana: { fruit: 'banana' },
  triangle: { kind: 'triangle', color: '#E5484D' },
  square: { kind: 'square', color: '#46A758' },
  heart: { kind: 'heart' },
  diamond: { kind: 'diamond' },
  dog: { animal: 'dog' },
  cat: { animal: 'cat' },
};
const FROM_EMOJI: Record<string, string> = {
  '🔴': 'red', '🔵': 'blue', '⭐': 'star', '🌙': 'moon', '🍎': 'apple', '🍌': 'banana', '🐶': 'dog', '🐱': 'cat', '🔺': 'triangle', '🟩': 'square',
};
const PALETTE = ['red', 'blue', 'star', 'moon', 'triangle', 'square', 'heart', 'apple'];

function TokenSprite({ id, size }: { id: string; size: number }) {
  const t = TOKENS[id] ?? TOKENS.red;
  if ('fruit' in t) return <Fruit kind={t.fruit} size={size} title={t.fruit} />;
  if ('animal' in t) return <AnimalFace kind={t.animal} size={size} />;
  return <PatternShape kind={t.kind} color={t.color} size={size} title={id} />;
}

export function PatternMaker({ params, onInteract }: VisualizerProps) {
  const initial = Array.isArray(params?.core) ? (params?.core as string[]).map((e) => FROM_EMOJI[e] ?? e).filter((e) => e in TOKENS) : ['red', 'blue'];
  const [core, setCore] = useState<string[]>(initial);
  const repeated = core.length ? Array.from({ length: Math.max(8, core.length * 3) }, (_, i) => core[i % core.length]) : [];
  const next = core.length ? core[repeated.length % core.length] : null;
  return (
    <div>
      <div className="text-center text-xs font-bold text-[#6B7385]">Your core ({core.length}/4) — tap shapes below</div>
      <div className="mt-2 flex min-h-[60px] items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#F4CF55] bg-[#FFF9E6] p-2">
        <AnimatePresence>
          {core.map((e, i) => <motion.span key={`${i}-${e}`} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={spring}><TokenSprite id={e} size={40} /></motion.span>)}
        </AnimatePresence>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1 rounded-xl border border-[#E6E1D6] bg-[#FFFDF8] p-3">
        {repeated.map((e, i) => (
          <motion.span key={`${core.join()}-${i}`} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
            className={i % core.length === 0 ? 'ml-2' : ''}><TokenSprite id={e} size={30} /></motion.span>
        ))}
        {next && (
          <motion.span animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.7, 0.35] }} transition={{ repeat: Infinity, duration: 1.4 }}
            className="ml-2 grid h-9 w-9 place-items-center rounded-lg border-2 border-dashed border-[#27314D] text-lg font-black text-[#27314D]">?</motion.span>
        )}
      </div>
      <Controls>
        {PALETTE.map((e) => (
          <motion.button key={e} type="button" disabled={core.length >= 4} onClick={() => { setCore([...core, e]); onInteract?.(); }} aria-label={`Add ${e}`}
            whileHover={{ y: -3 }} whileTap={{ scale: 0.9 }}
            className="grid h-12 w-12 place-items-center rounded-xl border border-[#E0DBCF] bg-white hover:border-[#27314D] disabled:opacity-40">
            <TokenSprite id={e} size={32} />
          </motion.button>
        ))}
        <button type="button" className="button button-dark" onClick={() => { setCore([]); onInteract?.(); }}><RotateCcw size={14} /> Clear</button>
      </Controls>
      <Readout>{next ? <span className="inline-flex items-center gap-2">Next comes <TokenSprite id={next} size={28} /></span> : 'Tap shapes to build a pattern core'}</Readout>
    </div>
  );
}

// ---------- Clock ----------

const timeWords = (h: number, m: number) => {
  if (m === 0) return `${h} o'clock`;
  if (m === 30) return `half past ${h}`;
  if (m === 15) return `quarter past ${h}`;
  if (m === 45) return `quarter to ${h === 12 ? 1 : h + 1}`;
  return `${m} minutes past ${h}`;
};

export function Clock({ params, onInteract }: VisualizerProps) {
  const [hour, setHour] = useState(clamp(num(params, 'hour', 3), 1, 12));
  const [minute, setMinute] = useState(num(params, 'minute', 0));
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const touched = useRef(false);

  const addMinutes = (delta: number) => {
    let m = minute + delta;
    let h = hour;
    while (m >= 60) { m -= 60; h = h === 12 ? 1 : h + 1; }
    while (m < 0) { m += 60; h = h === 1 ? 12 : h - 1; }
    setMinute(m);
    setHour(h);
    touched.current = true;
    onInteract?.();
  };

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!dragging.current || !svgRef.current) return;
    const r = svgRef.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    const deg = (Math.atan2(x, -y) * 180) / Math.PI;
    const m = (Math.round(((deg + 360) % 360) / 30) * 5) % 60;
    if (m === minute) return;
    let delta = m - minute;
    if (delta > 30) delta -= 60;
    if (delta < -30) delta += 60;
    addMinutes(delta);
  };

  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minAngle = minute * 6;

  return (
    <div>
      <div className="relative mx-auto w-fit">
        <Celebrate trigger={touched.current && minute === 0 ? `h${hour}` : null} effect="sparkle" />
        <svg ref={svgRef} viewBox="0 0 200 200" className="h-60 w-60 touch-none select-none drop-shadow-md"
          onPointerMove={onMove} onPointerUp={() => (dragging.current = false)} onPointerLeave={() => (dragging.current = false)}>
          <defs>
            <radialGradient id="clockface" cx="40%" cy="35%" r="75%"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#F3EEDF" /></radialGradient>
          </defs>
          <circle cx="100" cy="100" r="96" fill="#E5484D" />
          <circle cx="100" cy="100" r="86" fill="url(#clockface)" stroke="#B91C1C" strokeWidth="2" />
          {Array.from({ length: 60 }, (_, i) => {
            const a = (i * 6 * Math.PI) / 180;
            const long = i % 5 === 0;
            return <line key={i} x1={100 + (long ? 74 : 79) * Math.sin(a)} y1={100 - (long ? 74 : 79) * Math.cos(a)} x2={100 + 83 * Math.sin(a)} y2={100 - 83 * Math.cos(a)} stroke="#27314D" strokeWidth={long ? 2.5 : 1} />;
          })}
          {Array.from({ length: 12 }, (_, i) => {
            const a = ((i + 1) * 30 * Math.PI) / 180;
            return <text key={i} x={100 + 60 * Math.sin(a)} y={106 - 60 * Math.cos(a)} textAnchor="middle" fontSize="15" fontWeight="700" fill="#27314D">{i + 1}</text>;
          })}
          <line x1="100" y1="100" x2={100 + 42 * Math.sin((hourAngle * Math.PI) / 180)} y2={100 - 42 * Math.cos((hourAngle * Math.PI) / 180)} stroke="#27314D" strokeWidth="8" strokeLinecap="round" />
          <line x1="100" y1="100" x2={100 + 66 * Math.sin((minAngle * Math.PI) / 180)} y2={100 - 66 * Math.cos((minAngle * Math.PI) / 180)} stroke="#E5484D" strokeWidth="5" strokeLinecap="round" />
          <circle cx={100 + 66 * Math.sin((minAngle * Math.PI) / 180)} cy={100 - 66 * Math.cos((minAngle * Math.PI) / 180)} r="10" fill="#E5484D" fillOpacity="0.35"
            className="cursor-grab" onPointerDown={(e) => { dragging.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); }} />
          <circle cx="100" cy="100" r="6" fill="#27314D" />
        </svg>
      </div>
      <Controls>
        <button type="button" className="button button-dark" onClick={() => addMinutes(-60)}>− 1 hour</button>
        <button type="button" className="button button-dark" onClick={() => addMinutes(-5)}>− 5 min</button>
        <button type="button" className="button button-yellow" onClick={() => addMinutes(5)}>+ 5 min</button>
        <button type="button" className="button button-yellow" onClick={() => addMinutes(60)}>+ 1 hour</button>
      </Controls>
      <Readout>{hour}:{String(minute).padStart(2, '0')} — {timeWords(hour, minute)}<span className="block text-xs text-white/70">Drag the red dot on the long hand</span></Readout>
    </div>
  );
}

// ---------- Coins ----------

const COIN_VALUES = [1, 2, 5, 10];
const COIN_SIZE: Record<number, number> = { 1: 42, 2: 46, 5: 50, 10: 56 };

export function Coins({ params, onInteract }: VisualizerProps) {
  const [purse, setPurse] = useState<{ id: number; v: number }[]>(() =>
    (Array.isArray(params?.coins) ? (params?.coins as number[]) : []).map((v, id) => ({ id, v })));
  const nextId = useRef(purse.length);
  const total = purse.reduce((s, c) => s + c.v, 0);
  const sorted = [...purse].sort((x, y) => y.v - x.v);
  return (
    <div>
      <div className="relative rounded-[28px] bg-gradient-to-b from-[#9C6644] to-[#6F4518] p-2 shadow-lg">
        <div className="absolute inset-x-6 top-0 h-3 rounded-b-xl bg-[#5C3A13]" />
        <div className="flex min-h-[110px] flex-wrap items-center justify-center gap-2 rounded-[22px] border-2 border-dashed border-[#E6CCB2]/70 p-3">
          {purse.length === 0 && <span className="text-sm font-semibold text-[#F3E5D8]">The purse is empty — tap coins below to drop them in</span>}
          <AnimatePresence>
            {sorted.map((c) => (
              <motion.button key={c.id} type="button" aria-label={`Take out ₹${c.v}`} layout
                initial={{ y: -80, rotateY: 540, opacity: 0 }} animate={{ y: 0, rotateY: 0, opacity: 1 }} exit={{ y: -40, scale: 0.4, opacity: 0 }}
                transition={{ duration: 0.6, type: 'spring', bounce: 0.35 }}
                onClick={() => { setPurse(purse.filter((p) => p.id !== c.id)); onInteract?.(); }}>
                <Coin value={c.v} size={COIN_SIZE[c.v]} />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <Controls>
        {COIN_VALUES.map((v) => (
          <motion.button key={v} type="button" aria-label={`Add ₹${v}`} whileHover={{ y: -4, rotate: -6 }} whileTap={{ scale: 0.85 }}
            onClick={() => { setPurse([...purse, { id: nextId.current++, v }]); onInteract?.(); }}>
            <Coin value={v} size={COIN_SIZE[v]} />
          </motion.button>
        ))}
      </Controls>
      <Readout>Total: ₹{total}{purse.length > 1 && <span className="block text-xs text-white/70">{sorted.map((c) => `₹${c.v}`).join(' + ')}</span>}</Readout>
    </div>
  );
}

// ---------- Fraction pizza ----------

export function FractionPizza({ params, onInteract }: VisualizerProps) {
  const [parts, setParts] = useState(clamp(num(params, 'parts', 4), 2, 8));
  const [shaded, setShaded] = useState<boolean[]>(() => Array.from({ length: parts }, (_, i) => i < num(params, 'shaded', 1)));
  const count = shaded.filter(Boolean).length;
  const changeParts = (p: number) => { setParts(p); setShaded(Array.from({ length: p }, () => false)); onInteract?.(); };
  const angle = (i: number) => (i / parts) * 2 * Math.PI - Math.PI / 2;
  const slice = (i: number, r: number) => {
    const a0 = angle(i), a1 = angle(i + 1);
    return `M100,100 L${100 + r * Math.cos(a0)},${100 + r * Math.sin(a0)} A${r},${r} 0 0 1 ${100 + r * Math.cos(a1)},${100 + r * Math.sin(a1)} Z`;
  };
  const toppings = (i: number) => [0.3, 0.55, 0.75].map((f, k) => {
    const a = angle(i) + ((k + 1) / 4) * ((2 * Math.PI) / parts);
    const r = 20 + f * 52;
    return { x: 100 + r * Math.cos(a), y: 100 + r * Math.sin(a), k };
  });
  return (
    <div>
      <div className="flex justify-center gap-2">
        {[2, 3, 4, 8].map((p) => <Chip key={p} active={p === parts} onClick={() => changeParts(p)}>{p} slices</Chip>)}
      </div>
      <svg viewBox="-10 -10 220 220" className="mx-auto mt-3 h-60 w-60" aria-label={`Pizza cut into ${parts} equal slices`}>
        <circle cx="100" cy="104" r="96" fill="#000" opacity=".08" />
        <circle cx="100" cy="100" r="98" fill="#F1F3F5" stroke="#CED4DA" strokeWidth="2" />
        {shaded.map((s, i) => {
          const mid = angle(i) + Math.PI / parts;
          return (
            <motion.g key={`${parts}-${i}`} className="cursor-pointer" onClick={() => { setShaded(shaded.map((v, j) => (j === i ? !v : v))); onInteract?.(); }}
              animate={{ x: s ? 10 * Math.cos(mid) : 0, y: s ? 10 * Math.sin(mid) : 0 }} transition={spring}>
              <path d={slice(i, 88)} fill="#D4A15A" stroke="#A86B22" strokeWidth="2" />
              <path d={slice(i, 78)} fill={s ? '#FFD43B' : '#FFE8A3'} />
              <path d={slice(i, 78)} fill="#E8590C" opacity=".18" />
              {toppings(i).map(({ x, y, k }) => k === 1
                ? <ellipse key={k} cx={x} cy={y} rx="4" ry="2.5" fill="#2B8A3E" />
                : <circle key={k} cx={x} cy={y} r="6.5" fill="#C92A2A" stroke="#9B1C1C" strokeWidth="1" />)}
              {s && <path d={slice(i, 88)} fill="none" stroke="#27314D" strokeWidth="3.5" />}
            </motion.g>
          );
        })}
      </svg>
      <p className="text-center text-xs font-bold text-[#6B7385]">Tap a slice to take it</p>
      <Readout>
        {count}/{parts} of the pizza taken
        {count * 2 === parts && <span className="block text-xs text-white/70">That is one half!</span>}
        {count * 4 === parts && parts !== 2 && <span className="block text-xs text-white/70">That is one quarter!</span>}
      </Readout>
    </div>
  );
}

// ---------- Pictograph ----------

const FRUITS: { key: string; kind: FruitKind; name: string }[] = [
  { key: '🍎', kind: 'apple', name: 'Apples' },
  { key: '🍌', kind: 'banana', name: 'Bananas' },
  { key: '🍇', kind: 'grapes', name: 'Grapes' },
  { key: '🍊', kind: 'orange', name: 'Oranges' },
];

export function Pictograph({ params, onInteract }: VisualizerProps) {
  const init = (params?.data as Record<string, number> | undefined) ?? { '🍎': 4, '🍌': 2, '🍇': 5, '🍊': 3 };
  const [data, setData] = useState<Record<string, number>>(() => Object.fromEntries(FRUITS.map((f) => [f.key, init[f.key] ?? 0])));
  const max = Math.max(...Object.values(data));
  const leaders = FRUITS.filter((f) => data[f.key] === max && max > 0);
  const vote = (f: string, d: number) => { setData({ ...data, [f]: clamp(data[f] + d, 0, 10) }); onInteract?.(); };
  return (
    <div>
      <div className="rounded-xl border border-[#E6E1D6] bg-[#FFFDF8] p-3">
        <div className="mb-2 text-center text-xs font-bold text-[#6B7385]">Our favourite fruits (each picture = 1 vote)</div>
        {FRUITS.map((f) => (
          <div key={f.key} className={`flex items-center gap-2 border-t border-[#EFEDE7] py-1.5 ${leaders.includes(f) ? 'bg-[#FFF3C4]/60' : ''}`}>
            <span className="w-16 text-xs font-bold text-[#27314D]">{f.name}</span>
            <button type="button" className="grid h-7 w-7 place-items-center rounded-lg bg-[#F3F0E8] font-bold" onClick={() => vote(f.key, -1)} aria-label={`Remove a vote for ${f.name}`}>−</button>
            <button type="button" className="grid h-7 w-7 place-items-center rounded-lg bg-[#F4CF55] font-bold" onClick={() => vote(f.key, 1)} aria-label={`Add a vote for ${f.name}`}>+</button>
            <div className="flex min-h-[30px] flex-1 flex-wrap items-center gap-0.5">
              <AnimatePresence>
                {Array.from({ length: data[f.key] }, (_, i) => (
                  <motion.span key={i} initial={{ scale: 0, y: -12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0 }} transition={spring}>
                    <Fruit kind={f.kind} size={28} />
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
            <b className="w-6 text-right">{data[f.key]}</b>
          </div>
        ))}
      </div>
      <Readout>{leaders.length === 1 ? `${leaders[0].name} are the favourite with ${max} votes` : leaders.length ? `It's a tie: ${leaders.map((l) => l.name).join(' and ')}` : 'No votes yet'}</Readout>
    </div>
  );
}
