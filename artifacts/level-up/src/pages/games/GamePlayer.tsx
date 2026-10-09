import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Play, RotateCcw, Trophy } from 'lucide-react';
import type { Grade } from '../../types';
import { useProfile } from '../../store/progress';
import { numberChoices, pick, randInt, shuffle } from '../../lib/random';
import { sortSets } from '../../data/sortSets';
import { NotFound } from '../NotFound';
import { games, type GameId } from './gameList';

interface GameProps {
  grade: Grade;
  onFinish: (score: number, xp: number) => void;
}

export function GamePlayer({ gameId }: { gameId: string }) {
  const { profile, finishGame } = useProfile();
  const game = games.find((g) => g.id === gameId);
  const [run, setRun] = useState(0);
  const [result, setResult] = useState<{ score: number; best: number } | null>(null);
  const [started, setStarted] = useState(false);
  if (!game) return <NotFound />;

  const props: GameProps = {
    grade: profile.grade,
    onFinish: (score, xp) => {
      setResult({ score, best: Math.max(score, profile.gameBest[game.id] ?? 0) });
      finishGame(game.id, score, xp);
    },
  };
  const Comp: Record<GameId, (p: GameProps) => ReactNode> = {
    'math-dash': MathDash,
    'memory-match': MemoryMatch,
    'sort-it': SortIt,
    'number-hop': NumberHop,
  };
  const Game = Comp[game.id];

  return (
    <div className="page-enter mx-auto max-w-3xl">
      <Link href="/games" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6B7385] hover:text-[#27314D]"><ArrowLeft size={16} /> All games</Link>
      <h1 className="mb-4 mt-2 font-['Space_Grotesk'] text-3xl font-semibold text-[#232B40]">{game.emoji} {game.title}</h1>

      {!started ? (
        <div className={`rounded-3xl p-8 text-center ${game.tone}`}>
          <div className="text-7xl">{game.emoji}</div>
          <p className="mx-auto mt-3 max-w-md text-lg text-[#27314D]">{game.description}</p>
          <p className="mt-1 text-sm text-[#6B7385]">Grade {profile.grade} level · Best score: {profile.gameBest[game.id] ?? 0}</p>
          <button type="button" className="button button-dark mt-5 min-h-12 px-6" onClick={() => setStarted(true)}><Play size={16} /> Play</button>
        </div>
      ) : result ? (
        <div className="rounded-3xl border border-[#E5E1D7] bg-[#FFFDF8] p-8 text-center">
          <Trophy size={48} className="mx-auto text-[#D9A928]" />
          <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-semibold">Score: {result.score}</h2>
          <p className="mt-1 text-sm text-[#6B7385]">{result.score >= result.best ? 'That is your best score! 🎉' : `Your best is ${result.best}. Keep trying!`}</p>
          <div className="mt-6 flex justify-center gap-2">
            <button type="button" className="button button-yellow" onClick={() => { setResult(null); setRun(run + 1); }}><RotateCcw size={15} /> Play again</button>
            <Link href="/games" className="button button-dark">Other games</Link>
          </div>
        </div>
      ) : (
        <Game key={run} {...props} />
      )}
    </div>
  );
}

// ---------------- Math Dash ----------------

function dashQuestion(grade: Grade) {
  if (grade === 1) {
    const add = Math.random() < 0.6;
    const a = randInt(1, 10);
    const b = add ? randInt(1, 10) : randInt(0, a);
    const ans = add ? a + b : a - b;
    return { text: `${a} ${add ? '+' : '−'} ${b}`, ans, choices: numberChoices(ans, [ans + 1, ans - 1]) };
  }
  const kind = randInt(0, 2);
  if (kind === 0) {
    const a = randInt(1, 8) * 10;
    const b = randInt(1, 9 - a / 10) * 10;
    return { text: `${a} + ${b}`, ans: a + b, choices: numberChoices(a + b, [a + b + 10, a + b - 10], 10) };
  }
  if (kind === 1) {
    const a = randInt(20, 99);
    const b = randInt(1, 9);
    const add = Math.random() < 0.5;
    const ans = add ? a + b : a - b;
    return { text: `${a} ${add ? '+' : '−'} ${b}`, ans, choices: numberChoices(ans, [ans + 10, ans - 1]) };
  }
  const m = pick([2, 5, 10]);
  const n = randInt(1, 6);
  return { text: `${n} groups of ${m}`, ans: m * n, choices: numberChoices(m * n, [m + n, m * n + m]) };
}

function MathDash({ grade, onFinish }: GameProps) {
  const [time, setTime] = useState(60);
  const [score, setScore] = useState(0);
  const [q, setQ] = useState(() => dashQuestion(grade));
  const [flash, setFlash] = useState<'ok' | 'bad' | null>(null);
  const scoreRef = useRef(0);
  const finished = useRef(false);

  useEffect(() => {
    const t = window.setInterval(() => setTime((s) => s - 1), 1000);
    return () => window.clearInterval(t);
  }, []);
  useEffect(() => {
    if (time <= 0 && !finished.current) {
      finished.current = true;
      onFinish(scoreRef.current, scoreRef.current);
    }
  }, [time, onFinish]);

  const answer = (c: string) => {
    const ok = Number(c) === q.ans;
    if (ok) { scoreRef.current += 1; setScore(scoreRef.current); }
    setFlash(ok ? 'ok' : 'bad');
    window.setTimeout(() => setFlash(null), 250);
    setQ(dashQuestion(grade));
  };

  return (
    <div className={`rounded-3xl border-4 p-6 transition-colors ${flash === 'ok' ? 'border-[#46A758]' : flash === 'bad' ? 'border-[#E5484D]' : 'border-transparent'} bg-[#27314D] text-white`}>
      <div className="flex items-center justify-between text-sm font-bold">
        <span>⏱ {Math.max(0, time)}s</span><span>⭐ {score}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-[#F4CF55] transition-all" style={{ width: `${(time / 60) * 100}%` }} /></div>
      <div className="my-8 text-center font-['Space_Grotesk'] text-5xl font-semibold">{q.text} = ?</div>
      <div className="grid grid-cols-2 gap-3">
        {q.choices.map((c) => (
          <button key={c} type="button" onClick={() => answer(c)} className="rounded-2xl bg-white py-5 font-['Space_Grotesk'] text-3xl font-semibold text-[#27314D] transition active:scale-95 hover:bg-[#FFF3C4]">{c}</button>
        ))}
      </div>
    </div>
  );
}

// ---------------- Memory Match ----------------

const sciencePairs: [string, string][] = [
  ['👀', 'See'], ['👂', 'Hear'], ['👃', 'Smell'], ['👅', 'Taste'], ['✋', 'Touch'],
  ['🐛', '🦋'], ['🌰', '🌳'], ['🧊', '💧'], ['☀️', 'Day'], ['🌙', 'Night'], ['🐣', '🐔'],
];

function mathPairs(grade: Grade): [string, string][] {
  const used = new Set<number>();
  const out: [string, string][] = [];
  while (out.length < 6) {
    if (grade === 1) {
      const a = randInt(1, 9);
      const b = randInt(1, 9);
      if (used.has(a + b)) continue;
      used.add(a + b);
      out.push([`${a} + ${b}`, String(a + b)]);
    } else {
      const n = randInt(11, 99);
      if (used.has(n)) continue;
      used.add(n);
      out.push([`${Math.floor(n / 10)} tens ${n % 10} ones`, String(n)]);
    }
  }
  return out;
}

function MemoryMatch({ grade, onFinish }: GameProps) {
  const [mode, setMode] = useState<'math' | 'science' | null>(null);
  const cards = useMemo(() => {
    if (!mode) return [];
    const pairs = mode === 'math' ? mathPairs(grade) : shuffle(sciencePairs).slice(0, 6);
    return shuffle(pairs.flatMap(([a, b], i) => [{ id: `${i}a`, pair: i, face: a }, { id: `${i}b`, pair: i, face: b }]));
  }, [mode, grade]);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const finished = useRef(false);

  useEffect(() => {
    if (mode && matched.length === 6 && !finished.current) {
      finished.current = true;
      const score = Math.max(1, 20 - Math.max(0, moves - 6));
      onFinish(score, Math.round(score / 2) + 4);
    }
  }, [matched, mode, moves, onFinish]);

  if (!mode) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" className="rounded-3xl bg-[#FFF3C4] p-6 text-center font-bold" onClick={() => setMode('math')}><div className="text-5xl">🔢</div>Math pairs</button>
        <button type="button" className="rounded-3xl bg-[#DFF3E6] p-6 text-center font-bold" onClick={() => setMode('science')}><div className="text-5xl">🔬</div>Science pairs</button>
      </div>
    );
  }

  const flip = (i: number) => {
    if (open.length === 2 || open.includes(i) || matched.includes(cards[i].pair)) return;
    const next = [...open, i];
    setOpen(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [x, y] = next;
      if (cards[x].pair === cards[y].pair) {
        setMatched((m) => [...m, cards[x].pair]);
        setOpen([]);
      } else {
        window.setTimeout(() => setOpen([]), 900);
      }
    }
  };

  return (
    <div>
      <div className="mb-3 flex justify-between text-sm font-bold text-[#6B7385]"><span>Pairs: {matched.length}/6</span><span>Moves: {moves}</span></div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {cards.map((c, i) => {
          const shown = open.includes(i) || matched.includes(c.pair);
          return (
            <button key={c.id} type="button" onClick={() => flip(i)}
              className={`grid h-24 place-items-center rounded-2xl border-2 p-2 text-center font-['Space_Grotesk'] font-semibold transition ${matched.includes(c.pair) ? 'border-[#46A758] bg-[#EAF7EE]' : shown ? 'border-[#27314D] bg-white' : 'border-[#27314D] bg-[#27314D] text-[#F4CF55] hover:-translate-y-0.5'}`}>
              {shown ? <span className={c.face.length <= 2 ? 'text-4xl' : 'text-base'}>{c.face}</span> : <span className="text-2xl">?</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------- Sort It ----------------

function SortIt({ grade, onFinish }: GameProps) {
  const options = Object.values(sortSets).filter((s) => s.grade === grade || grade >= 2);
  const [setId, setSetId] = useState<string | null>(options.length === 1 ? options[0].id : null);
  const set = setId ? sortSets[setId] : null;
  const items = useMemo(() => (set ? shuffle(set.items).slice(0, 10) : []), [set]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!set) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((s) => (
          <button key={s.id} type="button" className="rounded-3xl border border-[#E6E1D6] bg-[#FFFDF8] p-5 text-left font-bold hover:border-[#27314D]" onClick={() => setSetId(s.id)}>
            <div className="text-3xl">{s.bins.map((b) => b.emoji).join(' ')}</div>{s.title}
          </button>
        ))}
      </div>
    );
  }

  const item = items[i];
  const choose = (bin: string) => {
    if (feedback) return;
    const ok = bin === item.bin;
    const newScore = score + (ok ? 1 : 0);
    setScore(newScore);
    setFeedback(ok ? '✅ Correct!' : `❌ It goes in ${set.bins.find((b) => b.id === item.bin)?.label}`);
    window.setTimeout(() => {
      setFeedback(null);
      if (i + 1 >= items.length) onFinish(newScore, newScore);
      else setI(i + 1);
    }, ok ? 600 : 1400);
  };

  return (
    <div>
      <div className="mb-3 flex justify-between text-sm font-bold text-[#6B7385]"><span>{set.title}</span><span>{i + 1}/{items.length} · ⭐ {score}</span></div>
      <div className="mx-auto grid h-40 max-w-xs place-items-center rounded-3xl border-2 border-[#27314D] bg-white">
        <div className="text-center"><div className="text-7xl">{item.emoji}</div><b>{item.name}</b></div>
      </div>
      <p className="mt-2 h-6 text-center font-bold">{feedback}</p>
      <div className={`mt-2 grid gap-3 ${set.bins.length > 2 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2'}`}>
        {set.bins.map((b) => (
          <button key={b.id} type="button" onClick={() => choose(b.id)} className="rounded-2xl border-2 border-dashed border-[#BFB8A6] bg-[#FFFDF8] py-6 text-lg font-bold hover:border-[#27314D] hover:bg-[#FFF9E6]">
            <div className="text-4xl">{b.emoji}</div>{b.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------- Number Line Hop ----------------

function hopRound(grade: Grade) {
  if (grade === 1) {
    const start = randInt(0, 15);
    const hop = randInt(1, 5) * (Math.random() < 0.6 || start < 5 ? 1 : -1);
    return { start, hop, end: start + hop, step: 1 };
  }
  const start = randInt(0, 16) * 5;
  const hop = pick([5, 10, 15, 20]) * (Math.random() < 0.6 || start < 20 ? 1 : -1);
  return { start, hop, end: Math.max(0, Math.min(100, start + hop)), step: 5 };
}

function NumberHop({ grade, onFinish }: GameProps) {
  const ROUNDS = 8;
  const [n, setN] = useState(0);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(() => hopRound(grade));
  const [picked, setPicked] = useState<number | null>(null);
  const ticks = Array.from({ length: 21 }, (_, i) => i * round.step);
  const frogAt = picked === null ? round.start : round.end;

  const choose = (t: number) => {
    if (picked !== null) return;
    setPicked(t);
    const ok = t === round.end;
    const s = score + (ok ? 1 : 0);
    setScore(s);
    window.setTimeout(() => {
      if (n + 1 >= ROUNDS) { onFinish(s, s * 2); return; }
      setN(n + 1);
      setRound(hopRound(grade));
      setPicked(null);
    }, 1300);
  };

  return (
    <div className="rounded-3xl border border-[#E5E1D7] bg-[#FFFDF8] p-5">
      <div className="flex justify-between text-sm font-bold text-[#6B7385]"><span>Round {n + 1}/{ROUNDS}</span><span>⭐ {score}</span></div>
      <p className="my-5 text-center font-['Space_Grotesk'] text-2xl font-semibold text-[#232B40]">
        Start at {round.start}. Hop {round.hop > 0 ? 'forward' : 'back'} {Math.abs(round.hop)}. Where do you land?
      </p>
      <div className="overflow-x-auto pb-2">
        <div className="relative grid min-w-[620px] pt-10" style={{ gridTemplateColumns: 'repeat(21, minmax(0,1fr))' }}>
          <div className="absolute left-0 right-0 top-[52px] h-1 rounded bg-[#27314D]" />
          {ticks.map((t) => {
            const state = picked === null ? '' : t === round.end ? 'bg-[#46A758] text-white' : t === picked ? 'bg-[#E5484D] text-white' : '';
            return (
              <button key={t} type="button" onClick={() => choose(t)} className="relative flex flex-col items-center">
                {t === frogAt && <span className="absolute -top-9 text-3xl transition-all">🐸</span>}
                <span className={`mt-1 h-4 w-0.5 ${t === round.start ? 'bg-[#E5484D]' : 'bg-[#27314D]'}`} />
                <span className={`mt-1 rounded-md px-1 py-0.5 text-[11px] font-bold hover:bg-[#FFF3C4] ${state}`}>{t}</span>
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-3 h-6 text-center font-bold">
        {picked !== null && (picked === round.end ? '✅ Perfect landing!' : `❌ ${round.start} ${round.hop > 0 ? '+' : '−'} ${Math.abs(round.hop)} = ${round.end}`)}
      </p>
    </div>
  );
}
