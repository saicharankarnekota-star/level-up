import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Chip, Controls, Readout, Stepper, clamp, num, str, type VisualizerProps } from './common';

// ---------- Ten-frame counters (counting, addition) ----------

export function TenFrame({ params, onInteract }: VisualizerProps) {
  const twoGroups = params?.b !== undefined;
  const [a, setA] = useState(clamp(num(params, 'a', 5), 0, twoGroups ? 10 : 20));
  const [b, setB] = useState(clamp(num(params, 'b', 0), 0, 10));
  const total = a + (twoGroups ? b : 0);
  const cells = Array.from({ length: 20 }, (_, i) => (i < a ? 'a' : twoGroups && i < total ? 'b' : null));
  const change = (fn: (n: number) => void) => (n: number) => { fn(n); onInteract?.(); };

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[0, 1].map((frame) => (
          <div key={frame} className={`grid grid-cols-5 gap-1.5 rounded-xl border-2 border-[#27314D] bg-[#FFFDF8] p-2 ${frame === 1 && total <= 10 ? 'opacity-40' : ''}`}>
            {cells.slice(frame * 10, frame * 10 + 10).map((c, i) => (
              <div key={i} className="grid aspect-square place-items-center rounded-md border border-[#E3DED2] bg-white">
                {c && <span className={`block h-[70%] w-[70%] rounded-full shadow-inner transition-all ${c === 'a' ? 'bg-[#E5484D]' : 'bg-[#46A758]'}`} />}
              </div>
            ))}
          </div>
        ))}
      </div>
      <Controls>
        <Stepper label={twoGroups ? 'Red' : 'Counters'} value={a} min={0} max={twoGroups ? 10 : 20} onChange={change(setA)} />
        {twoGroups && <Stepper label="Green" value={b} min={0} max={10} onChange={change(setB)} />}
      </Controls>
      <Readout>{twoGroups ? `${a} + ${b} = ${total}` : `${total} counter${total === 1 ? '' : 's'}${total >= 10 ? ` = ${Math.floor(total / 10)} ten${total >= 20 ? 's' : ''} and ${total % 10} ones` : ''}`}</Readout>
    </div>
  );
}

// ---------- Number line hop (counting on/back, subtraction) ----------

export function NumberLine({ params, onInteract }: VisualizerProps) {
  const max = num(params, 'max', 20);
  const [start, setStart] = useState(clamp(num(params, 'start', 5), 0, max));
  const [hops, setHops] = useState(num(params, 'hops', 3));
  const [pos, setPos] = useState(start);
  const [trail, setTrail] = useState<number[]>([]);
  const timer = useRef<number | undefined>(undefined);
  const end = clamp(start + hops, 0, max);
  const windowStart = max <= 20 ? 0 : clamp(Math.min(start, end) - 2, 0, max - 20);
  const ticks = Array.from({ length: 21 }, (_, i) => windowStart + i);

  useEffect(() => () => window.clearInterval(timer.current), []);
  useEffect(() => { setPos(start); setTrail([]); }, [start, hops]);

  const play = () => {
    window.clearInterval(timer.current);
    onInteract?.();
    let p = start;
    setPos(p);
    setTrail([]);
    const dir = Math.sign(end - start);
    if (!dir) return;
    timer.current = window.setInterval(() => {
      p += dir;
      setPos(p);
      setTrail((t) => [...t, p]);
      if (p === end) window.clearInterval(timer.current);
    }, 450);
  };

  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <div className="relative mx-auto min-w-[560px] px-3 pt-12">
          <div className="absolute left-3 right-3 top-[68px] h-1 rounded bg-[#27314D]" />
          <div className="relative grid" style={{ gridTemplateColumns: `repeat(${ticks.length}, minmax(0,1fr))` }}>
            {ticks.map((t) => (
              <div key={t} className="relative flex flex-col items-center">
                {t === pos && <span className="absolute -top-10 text-3xl transition-all">🐸</span>}
                <span className={`mt-3 h-4 w-0.5 ${t === start ? 'bg-[#E5484D]' : 'bg-[#27314D]'}`} />
                <span className={`mt-1 rounded px-1 text-[11px] font-bold ${t === end && trail.includes(end) ? 'bg-[#F4CF55] text-[#27314D]' : trail.includes(t) ? 'text-[#46A758]' : t === start ? 'text-[#E5484D]' : 'text-[#6B7385]'}`}>{t}</span>
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

// ---------- Compare two groups ----------

export function Compare({ params, onInteract }: VisualizerProps) {
  const [a, setA] = useState(clamp(num(params, 'a', 8), 0, 20));
  const [b, setB] = useState(clamp(num(params, 'b', 5), 0, 20));
  const sign = a > b ? '>' : a < b ? '<' : '=';
  const dots = (n: number, color: string) => (
    <div className="grid w-28 grid-cols-5 gap-1.5 rounded-xl bg-[#FFFDF8] p-2 border border-[#E6E1D6] min-h-[60px] content-start">
      {Array.from({ length: n }, (_, i) => <span key={i} className={`aspect-square rounded-full ${color}`} />)}
    </div>
  );
  return (
    <div>
      <div className="flex items-center justify-center gap-4">
        <div className="text-center">{dots(a, 'bg-[#E5484D]')}<b className="mt-2 block font-['Space_Grotesk'] text-2xl">{a}</b></div>
        <div className="text-center">
          <div className={`text-4xl transition ${sign === '<' ? '-scale-x-100' : ''}`}>{sign === '=' ? '⚖️' : '🐊'}</div>
          <b className="font-['Space_Grotesk'] text-5xl text-[#27314D]">{sign}</b>
        </div>
        <div className="text-center">{dots(b, 'bg-[#3E63DD]')}<b className="mt-2 block font-['Space_Grotesk'] text-2xl">{b}</b></div>
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
      {Array.from({ length: tens }, (_, i) => (
        <div key={`t${i}`} className="grid grid-rows-10 gap-px rounded-sm border border-[#27314D]/40 bg-[#27314D]/30 p-px">
          {Array.from({ length: 10 }, (_, j) => <span key={j} className={`h-[11px] w-[11px] ${tone}`} />)}
        </div>
      ))}
      <div className="grid grid-cols-5 gap-px self-end">
        {Array.from({ length: ones }, (_, i) => <span key={`o${i}`} className="h-[11px] w-[11px] rounded-[2px] bg-[#F4A23C] ring-1 ring-[#C47B1F]/50" />)}
      </div>
    </div>
  );
}

export function BaseTen({ params, onInteract }: VisualizerProps) {
  const op = str(params, 'op', '');
  if (op === '+' || op === '−') return <BaseTenOp params={params} onInteract={onInteract} />;
  const n0 = clamp(num(params, 'n', 34), 0, 99);
  const [tens, setTens] = useState(Math.floor(n0 / 10));
  const [ones, setOnes] = useState(n0 % 10);
  const addOne = () => {
    onInteract?.();
    if (ones === 9 && tens < 9) { setOnes(0); setTens(tens + 1); } else if (ones < 9) setOnes(ones + 1);
  };
  return (
    <div>
      <div className="rounded-xl border border-[#E6E1D6] bg-[#FFFDF8] p-4"><Blocks tens={tens} ones={ones} /></div>
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
        <div className="rounded-xl border border-[#E6E1D6] bg-[#FFFDF8] p-3">
          <div className="mb-1 text-xs font-bold text-[#6B7385]">{stage === 0 ? `${a}` : 'Now'}</div>
          <Blocks tens={stage === 0 ? ta : tens} ones={stage === 0 ? oa : ones} />
        </div>
        <div className={`rounded-xl border border-dashed border-[#E6E1D6] p-3 ${stage > 0 && op === '+' ? 'opacity-30' : ''}`}>
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

// ---------- Arrays ----------

export function ArrayBuilder({ params, onInteract }: VisualizerProps) {
  const [rows, setRows] = useState(clamp(num(params, 'rows', 3), 1, 6));
  const [cols, setCols] = useState(clamp(num(params, 'cols', 4), 1, 10));
  return (
    <div>
      <div className="flex flex-col items-center gap-1.5 rounded-xl border border-[#E6E1D6] bg-[#FFFDF8] p-4">
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} className="flex items-center gap-1.5">
            {Array.from({ length: cols }, (_, c) => <span key={c} className="text-2xl leading-none">🍪</span>)}
            <span className="ml-3 w-8 text-right text-sm font-bold text-[#46A758]">{(r + 1) * cols}</span>
          </div>
        ))}
      </div>
      <Controls>
        <Stepper label="Rows" value={rows} min={1} max={6} onChange={(v) => { setRows(v); onInteract?.(); }} />
        <Stepper label="In each row" value={cols} min={1} max={10} onChange={(v) => { setCols(v); onInteract?.(); }} />
      </Controls>
      <Readout>{Array.from({ length: rows }, () => cols).join(' + ')} = {rows * cols}<span className="block text-xs text-white/70">{rows} rows of {cols} = {rows} × {cols}</span></Readout>
    </div>
  );
}

// ---------- Shapes ----------

const SHAPES = [
  { name: 'Circle', sides: 0 },
  { name: 'Triangle', sides: 3 },
  { name: 'Square', sides: 4 },
  { name: 'Rectangle', sides: 4 },
  { name: 'Pentagon', sides: 5 },
  { name: 'Hexagon', sides: 6 },
];

function shapePoints(name: string, sides: number): [number, number][] {
  if (name === 'Rectangle') return [[30, 60], [170, 60], [170, 140], [30, 140]];
  if (name === 'Square') return [[50, 50], [150, 50], [150, 150], [50, 150]];
  return Array.from({ length: sides }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
    return [100 + 70 * Math.cos(a), 105 + 70 * Math.sin(a)];
  });
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
      <svg viewBox="0 0 200 200" className="mx-auto mt-3 h-56 w-56">
        {shape.sides === 0 ? (
          <circle cx="100" cy="100" r="70" fill="#FFF3C4" stroke="#27314D" strokeWidth="4" />
        ) : (
          <>
            <polygon points={pts.map((p) => p.join(',')).join(' ')} fill="#FFF3C4" stroke="#27314D" strokeWidth="4" strokeLinejoin="round" />
            {pts.map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="9" fill="#E5484D" />
                <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">{i + 1}</text>
              </g>
            ))}
          </>
        )}
      </svg>
      <Readout>{shape.name}: {shape.sides === 0 ? 'no straight sides and no corners' : `${shape.sides} sides and ${shape.sides} corners`}</Readout>
    </div>
  );
}

// ---------- Measure with paper clips ----------

export function Measure({ params, onInteract }: VisualizerProps) {
  const [a, setA] = useState(clamp(num(params, 'a', 6), 1, 12));
  const [b, setB] = useState(clamp(num(params, 'b', 4), 1, 12));
  const row = (len: number, emoji: string, color: string) => (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{emoji}</span>
        <div className={`h-5 rounded-full ${color} transition-all`} style={{ width: `${len * 34}px` }} />
      </div>
      <div className="ml-9 mt-1 flex">{Array.from({ length: len }, (_, i) => <span key={i} className="w-[34px] text-center text-xl">📎</span>)}</div>
    </div>
  );
  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-[#E6E1D6] bg-[#FFFDF8] p-4">
        {row(a, '✏️', 'bg-[#F4CF55]')}
        {row(b, '🖍️', 'bg-[#3E63DD]')}
      </div>
      <Controls>
        <Stepper label="Pencil" value={a} min={1} max={12} onChange={(v) => { setA(v); onInteract?.(); }} />
        <Stepper label="Crayon" value={b} min={1} max={12} onChange={(v) => { setB(v); onInteract?.(); }} />
      </Controls>
      <Readout>{a === b ? 'Same length!' : `The ${a > b ? 'pencil' : 'crayon'} is longer by ${Math.abs(a - b)} 📎`}</Readout>
    </div>
  );
}

// ---------- Pattern maker ----------

const PALETTE = ['🔴', '🔵', '⭐', '🌙', '🍎', '🍌', '🔺', '🟩'];

export function PatternMaker({ params, onInteract }: VisualizerProps) {
  const initial = Array.isArray(params?.core) ? (params?.core as string[]) : ['🔴', '🔵'];
  const [core, setCore] = useState<string[]>(initial);
  const repeated = core.length ? Array.from({ length: Math.max(8, core.length * 3) }, (_, i) => core[i % core.length]) : [];
  return (
    <div>
      <div className="text-center text-xs font-bold text-[#6B7385]">Your core ({core.length}/4) — tap shapes below</div>
      <div className="mt-2 flex min-h-[52px] justify-center gap-2 rounded-xl border-2 border-dashed border-[#F4CF55] bg-[#FFF9E6] p-2 text-3xl">
        {core.map((e, i) => <span key={i}>{e}</span>)}
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-1 rounded-xl border border-[#E6E1D6] bg-[#FFFDF8] p-3 text-2xl">
        {repeated.map((e, i) => <span key={i} className={i % core.length === 0 ? 'ml-2' : ''}>{e}</span>)}
        {core.length > 0 && <span className="ml-2 animate-pulse">❓</span>}
      </div>
      <Controls>
        {PALETTE.map((e) => (
          <button key={e} type="button" disabled={core.length >= 4} onClick={() => { setCore([...core, e]); onInteract?.(); }}
            className="grid h-11 w-11 place-items-center rounded-xl border border-[#E0DBCF] bg-white text-2xl hover:border-[#27314D] disabled:opacity-40">{e}</button>
        ))}
        <button type="button" className="button button-dark" onClick={() => { setCore([]); onInteract?.(); }}><RotateCcw size={14} /> Clear</button>
      </Controls>
      <Readout>{core.length ? `Next comes ${core[repeated.length % core.length]}` : 'Tap shapes to build a pattern core'}</Readout>
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

  const addMinutes = (delta: number) => {
    let m = minute + delta;
    let h = hour;
    while (m >= 60) { m -= 60; h = h === 12 ? 1 : h + 1; }
    while (m < 0) { m += 60; h = h === 1 ? 12 : h - 1; }
    setMinute(m);
    setHour(h);
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
      <svg ref={svgRef} viewBox="0 0 200 200" className="mx-auto h-60 w-60 touch-none select-none"
        onPointerMove={onMove} onPointerUp={() => (dragging.current = false)} onPointerLeave={() => (dragging.current = false)}>
        <circle cx="100" cy="100" r="92" fill="#FFFDF8" stroke="#27314D" strokeWidth="5" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = ((i + 1) * 30 * Math.PI) / 180;
          return <text key={i} x={100 + 72 * Math.sin(a)} y={106 - 72 * Math.cos(a)} textAnchor="middle" fontSize="15" fontWeight="700" fill="#27314D">{i + 1}</text>;
        })}
        <line x1="100" y1="100" x2={100 + 45 * Math.sin((hourAngle * Math.PI) / 180)} y2={100 - 45 * Math.cos((hourAngle * Math.PI) / 180)} stroke="#27314D" strokeWidth="8" strokeLinecap="round" />
        <line x1="100" y1="100" x2={100 + 68 * Math.sin((minAngle * Math.PI) / 180)} y2={100 - 68 * Math.cos((minAngle * Math.PI) / 180)} stroke="#E5484D" strokeWidth="5" strokeLinecap="round" />
        <circle cx={100 + 68 * Math.sin((minAngle * Math.PI) / 180)} cy={100 - 68 * Math.cos((minAngle * Math.PI) / 180)} r="10" fill="#E5484D" fillOpacity="0.35"
          className="cursor-grab" onPointerDown={(e) => { dragging.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); }} />
        <circle cx="100" cy="100" r="6" fill="#27314D" />
      </svg>
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

const COINS = [
  { value: 1, color: 'bg-[#C9CED6]', size: 'h-10 w-10' },
  { value: 2, color: 'bg-[#D7DBE2]', size: 'h-11 w-11' },
  { value: 5, color: 'bg-[#E8C25A]', size: 'h-12 w-12' },
  { value: 10, color: 'bg-[#D9A441]', size: 'h-14 w-14' },
];

export function Coins({ params, onInteract }: VisualizerProps) {
  const [purse, setPurse] = useState<number[]>(Array.isArray(params?.coins) ? (params?.coins as number[]) : []);
  const total = purse.reduce((s, c) => s + c, 0);
  const coin = (v: number, key: string | number, onClick: () => void) => {
    const c = COINS.find((x) => x.value === v) ?? COINS[0];
    return (
      <button key={key} type="button" onClick={onClick}
        className={`grid ${c.size} place-items-center rounded-full ${c.color} border-2 border-black/15 font-['Space_Grotesk'] text-sm font-bold text-[#27314D] shadow-md transition hover:-translate-y-0.5`}>
        ₹{v}
      </button>
    );
  };
  return (
    <div>
      <div className="flex min-h-[96px] flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#D9A441] bg-[#FFF9E6] p-3">
        {purse.length === 0 && <span className="text-sm text-[#9A8F6B]">Purse is empty — tap coins below to add</span>}
        {[...purse].sort((x, y) => y - x).map((v, i) => coin(v, i, () => {
          const idx = purse.indexOf(v);
          setPurse(purse.filter((_, j) => j !== idx));
          onInteract?.();
        }))}
      </div>
      <Controls>{COINS.map((c) => coin(c.value, c.value, () => { setPurse([...purse, c.value]); onInteract?.(); }))}</Controls>
      <Readout>Total: ₹{total}{purse.length > 1 && <span className="block text-xs text-white/70">{[...purse].sort((x, y) => y - x).map((v) => `₹${v}`).join(' + ')}</span>}</Readout>
    </div>
  );
}

// ---------- Fraction pizza ----------

export function FractionPizza({ params, onInteract }: VisualizerProps) {
  const [parts, setParts] = useState(clamp(num(params, 'parts', 4), 2, 8));
  const [shaded, setShaded] = useState<boolean[]>(() => Array.from({ length: parts }, (_, i) => i < num(params, 'shaded', 1)));
  const count = shaded.filter(Boolean).length;
  const changeParts = (p: number) => { setParts(p); setShaded(Array.from({ length: p }, () => false)); onInteract?.(); };
  const slice = (i: number) => {
    const a0 = (i / parts) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((i + 1) / parts) * 2 * Math.PI - Math.PI / 2;
    const r = 85;
    return `M100,100 L${100 + r * Math.cos(a0)},${100 + r * Math.sin(a0)} A${r},${r} 0 ${parts === 1 ? 1 : 0} 1 ${100 + r * Math.cos(a1)},${100 + r * Math.sin(a1)} Z`;
  };
  return (
    <div>
      <div className="flex justify-center gap-2">
        {[2, 3, 4, 8].map((p) => <Chip key={p} active={p === parts} onClick={() => changeParts(p)}>{p} slices</Chip>)}
      </div>
      <svg viewBox="0 0 200 200" className="mx-auto mt-3 h-56 w-56">
        <circle cx="100" cy="100" r="92" fill="#E9B872" />
        {shaded.map((s, i) => (
          <path key={i} d={slice(i)} fill={s ? '#E5484D' : '#FFE8A3'} stroke="#8A5A1E" strokeWidth="3" className="cursor-pointer transition"
            onClick={() => { setShaded(shaded.map((v, j) => (j === i ? !v : v))); onInteract?.(); }} />
        ))}
      </svg>
      <Readout>
        {count}/{parts} shaded
        {count * 2 === parts && <span className="block text-xs text-white/70">That is one half!</span>}
        {count * 4 === parts && parts !== 2 && <span className="block text-xs text-white/70">That is one quarter!</span>}
      </Readout>
    </div>
  );
}

// ---------- Pictograph ----------

const FRUITS = ['🍎', '🍌', '🍇', '🍊'];

export function Pictograph({ params, onInteract }: VisualizerProps) {
  const init = (params?.data as Record<string, number> | undefined) ?? { '🍎': 4, '🍌': 2, '🍇': 5, '🍊': 3 };
  const [data, setData] = useState<Record<string, number>>(() => Object.fromEntries(FRUITS.map((f) => [f, init[f] ?? 0])));
  const max = Math.max(...Object.values(data));
  const leaders = FRUITS.filter((f) => data[f] === max && max > 0);
  const vote = (f: string, d: number) => { setData({ ...data, [f]: clamp(data[f] + d, 0, 10) }); onInteract?.(); };
  return (
    <div>
      <div className="rounded-xl border border-[#E6E1D6] bg-[#FFFDF8] p-3">
        <div className="mb-2 text-center text-xs font-bold text-[#6B7385]">Our favourite fruits (each picture = 1 vote)</div>
        {FRUITS.map((f) => (
          <div key={f} className="flex items-center gap-2 border-t border-[#EFEDE7] py-1.5">
            <button type="button" className="grid h-7 w-7 place-items-center rounded-lg bg-[#F3F0E8] font-bold" onClick={() => vote(f, -1)} aria-label="Remove vote">−</button>
            <button type="button" className="grid h-7 w-7 place-items-center rounded-lg bg-[#F4CF55] font-bold" onClick={() => vote(f, 1)} aria-label="Add vote">+</button>
            <div className="flex flex-1 flex-wrap gap-0.5 text-xl">{Array.from({ length: data[f] }, (_, i) => <span key={i}>{f}</span>)}</div>
            <b className="w-6 text-right">{data[f]}</b>
          </div>
        ))}
      </div>
      <Readout>{leaders.length === 1 ? `${leaders[0]} is the favourite with ${max} votes` : leaders.length ? `It's a tie: ${leaders.join(' ')}` : 'No votes yet'}</Readout>
    </div>
  );
}
