import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { operationsSet, sortSets } from '../../data/sortSets';
import { shuffle } from '../../lib/random';
import { Chip, Controls, Readout, num, str, type VisualizerProps } from './common';

// ---------- Sort into bins ----------

export function SortBins({ params, onInteract }: VisualizerProps) {
  const setId = str(params, 'set', 'living');
  const set = (setId === operationsSet.id ? operationsSet : sortSets[setId]) ?? sortSets.living;
  const highlight = str(params, 'highlight', '');
  const [round, setRound] = useState(0);
  const queue = useMemo(() => {
    const items = shuffle(set.items).slice(0, 8);
    const h = set.items.find((i) => i.name === highlight);
    return h ? [h, ...items.filter((i) => i !== h)].slice(0, 8) : items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [set, highlight, round]);
  const [index, setIndex] = useState(0);
  const [placed, setPlaced] = useState<Record<string, string[]>>({});
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const current = queue[index];

  const choose = (binId: string) => {
    if (!current) return;
    onInteract?.();
    const correct = set.bins.find((b) => b.id === current.bin)!;
    if (binId === current.bin) {
      setPlaced({ ...placed, [binId]: [...(placed[binId] ?? []), current.emoji] });
      setFeedback({ ok: true, text: `Yes! ${current.name} → ${correct.label}` });
      setIndex(index + 1);
    } else {
      setFeedback({ ok: false, text: `Hmm, think again: ${set.question}` });
    }
  };

  const restart = () => { setRound(round + 1); setIndex(0); setPlaced({}); setFeedback(null); };

  return (
    <div>
      <div className="text-center text-xs font-bold text-[#6B7385]">{set.title}</div>
      <div className="mx-auto mt-2 grid h-28 w-full max-w-xs place-items-center rounded-2xl border-2 border-[#27314D] bg-[#FFFDF8]">
        {current ? (
          <div className="text-center"><div className="text-5xl">{current.emoji}</div><b className="text-sm text-[#27314D]">{current.name}</b></div>
        ) : (
          <div className="text-center"><div className="text-4xl">🎉</div><b className="text-sm">All sorted!</b></div>
        )}
      </div>
      {feedback && <p className={`mt-2 text-center text-sm font-bold ${feedback.ok ? 'text-[#2F8F5B]' : 'text-[#C2410C]'}`}>{feedback.text}</p>}
      <div className={`mt-3 grid gap-2 ${set.bins.length > 2 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2'}`}>
        {set.bins.map((b) => (
          <button key={b.id} type="button" onClick={() => choose(b.id)} disabled={!current}
            className="min-h-[96px] rounded-2xl border-2 border-dashed border-[#BFB8A6] bg-white p-2 text-left transition hover:border-[#27314D] hover:bg-[#FFF9E6] disabled:cursor-default">
            <div className="font-bold text-[#27314D]">{b.emoji} {b.label}</div>
            <div className="mt-1 flex flex-wrap gap-0.5 text-xl">{(placed[b.id] ?? []).map((e, i) => <span key={i}>{e}</span>)}</div>
          </button>
        ))}
      </div>
      <Controls>
        <button type="button" className="button button-dark" onClick={restart}><RotateCcw size={14} /> New set</button>
      </Controls>
    </div>
  );
}

// ---------- Plant parts ----------

const PLANT_PARTS = {
  flower: { label: 'Flower', emoji: '🌸', job: 'Makes seeds. Its colours and smell invite bees and butterflies.' },
  leaves: { label: 'Leaves', emoji: '🍃', job: 'Use sunlight, air and water to make food for the plant.' },
  stem: { label: 'Stem', emoji: '🌿', job: 'Holds the plant up and carries water from roots to leaves, like a straw.' },
  roots: { label: 'Roots', emoji: '🟫', job: 'Grow in the soil, drink water and hold the plant steady.' },
  seed: { label: 'Seed', emoji: '🌰', job: 'A tiny baby plant with food inside. Plant it and it grows!' },
} as const;
type PlantPart = keyof typeof PLANT_PARTS;

export function PlantParts({ params, onInteract }: VisualizerProps) {
  const initial = str(params, 'part', '') as PlantPart;
  const [part, setPart] = useState<PlantPart | null>(initial in PLANT_PARTS ? initial : null);
  const pick = (p: PlantPart) => { setPart(p); onInteract?.(); };
  const ring = (p: PlantPart) => (part === p ? 'ring-4 ring-[#F4CF55] rounded-xl' : '');
  return (
    <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
      <div className="relative mx-auto h-[300px] w-[200px] overflow-hidden rounded-2xl bg-gradient-to-b from-[#CDEBFF] to-[#EAF7FF]">
        <span className="absolute right-3 top-2 text-3xl">☀️</span>
        <button type="button" onClick={() => pick('flower')} className={`absolute left-1/2 top-6 -translate-x-1/2 text-6xl ${ring('flower')}`}>🌸</button>
        <button type="button" onClick={() => pick('stem')} className={`absolute left-1/2 top-[88px] h-[105px] w-6 -translate-x-1/2 ${ring('stem')}`}>
          <span className="mx-auto block h-full w-3 rounded bg-[#3F9142]" />
        </button>
        <button type="button" onClick={() => pick('leaves')} className={`absolute left-[34px] top-[118px] text-4xl ${ring('leaves')}`}>🍃</button>
        <button type="button" onClick={() => pick('leaves')} className={`absolute right-[34px] top-[138px] -scale-x-100 text-4xl ${ring('leaves')}`}>🍃</button>
        <div className="absolute bottom-0 h-[105px] w-full bg-[#8B5E3C]" />
        <button type="button" onClick={() => pick('roots')} className={`absolute bottom-6 left-1/2 h-[80px] w-[120px] -translate-x-1/2 ${ring('roots')}`} aria-label="Roots">
          <svg viewBox="0 0 120 80" className="h-full w-full"><path d="M60 0 V40 M60 20 L30 55 M60 25 L95 60 M60 40 L45 78 M60 40 L75 75 M30 55 L15 70" stroke="#F1E3C6" strokeWidth="4" fill="none" strokeLinecap="round" /></svg>
        </button>
        <button type="button" onClick={() => pick('seed')} className={`absolute bottom-3 right-4 text-2xl ${ring('seed')}`}>🌰</button>
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PLANT_PARTS) as PlantPart[]).map((p) => <Chip key={p} active={part === p} onClick={() => pick(p)}>{PLANT_PARTS[p].emoji} {PLANT_PARTS[p].label}</Chip>)}
        </div>
        <Readout>{part ? <>{PLANT_PARTS[part].label}: <span className="text-white">{PLANT_PARTS[part].job}</span></> : 'Tap a part of the plant'}</Readout>
      </div>
    </div>
  );
}

// ---------- Five senses ----------

const SENSES = {
  sight: { organ: '👀', label: 'Eyes — Sight', examples: '🌈 🦋 📖', text: 'We see colours, shapes and light.' },
  hearing: { organ: '👂', label: 'Ears — Hearing', examples: '🔔 🎵 🐶', text: 'We hear music, voices and a dog barking.' },
  smell: { organ: '👃', label: 'Nose — Smell', examples: '🌸 🍞 🧄', text: 'We smell flowers, fresh bread and garlic.' },
  taste: { organ: '👅', label: 'Tongue — Taste', examples: '🍋 🍯 🥨', text: 'We taste sour, sweet, salty and bitter.' },
  touch: { organ: '✋', label: 'Skin — Touch', examples: '🧊 🧸 🌵', text: 'We feel cold, soft, hard and prickly.' },
} as const;
type Sense = keyof typeof SENSES;

export function Senses({ params, onInteract }: VisualizerProps) {
  const init = str(params, 'sense', '') as Sense;
  const [sense, setSense] = useState<Sense | null>(init in SENSES ? init : null);
  return (
    <div>
      <div className="grid grid-cols-5 gap-2">
        {(Object.keys(SENSES) as Sense[]).map((s) => (
          <button key={s} type="button" onClick={() => { setSense(s); onInteract?.(); }}
            className={`grid aspect-square place-items-center rounded-2xl border-2 text-4xl transition ${sense === s ? 'scale-105 border-[#27314D] bg-[#FFF3C4]' : 'border-[#E6E1D6] bg-white hover:border-[#27314D]'}`}>
            {SENSES[s].organ}
          </button>
        ))}
      </div>
      {sense && <div className="mt-4 text-center text-4xl tracking-widest">{SENSES[sense].examples}</div>}
      <Readout>{sense ? <>{SENSES[sense].label}<span className="block text-sm text-white">{SENSES[sense].text}</span></> : 'Tap a body part'}</Readout>
    </div>
  );
}

// ---------- Weather & seasons ----------

const SEASONS = {
  summer: { label: 'Summer', sky: 'from-[#FFD166] to-[#FFF1C1]', weather: '☀️', wear: '🧢 🩳 🕶️', do: '🍉 🏊 🍦', note: 'Hot and sunny. Drink lots of water!' },
  rainy: { label: 'Rainy season', sky: 'from-[#7B8BA3] to-[#C9D3E0]', weather: '🌧️', wear: '☂️ 🧥 👢', do: '🐸 ⛵ 🌱', note: 'Lots of rain. Plants and frogs love it!' },
  winter: { label: 'Winter', sky: 'from-[#A9C7E8] to-[#EEF5FC]', weather: '❄️', wear: '🧣 🧤 🧥', do: '☕ ⛄ 🛌', note: 'Cold days and long nights. Wrap up warm!' },
  spring: { label: 'Spring', sky: 'from-[#9ED8A0] to-[#E9F8E6]', weather: '🌤️', wear: '👕 👟 🧢', do: '🌷 🪁 🦋', note: 'Warm and breezy. Flowers bloom and kites fly.' },
} as const;
type Season = keyof typeof SEASONS;

export function Weather({ params, onInteract }: VisualizerProps) {
  const init = str(params, 'season', 'summer') as Season;
  const [season, setSeason] = useState<Season>(init in SEASONS ? init : 'summer');
  const s = SEASONS[season];
  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {(Object.keys(SEASONS) as Season[]).map((k) => <Chip key={k} active={k === season} onClick={() => { setSeason(k); onInteract?.(); }}>{SEASONS[k].weather} {SEASONS[k].label}</Chip>)}
      </div>
      <div className={`mt-3 grid h-48 place-items-center rounded-2xl bg-gradient-to-b ${s.sky} transition-all`}>
        <div className="text-center">
          <div className="text-7xl">{s.weather}</div>
          <div className="mt-2 flex justify-center gap-6 text-3xl"><span title="Wear">{s.wear}</span><span title="Do">{s.do}</span></div>
        </div>
      </div>
      <Readout>{s.label}: <span className="text-white">{s.note}</span></Readout>
    </div>
  );
}

// ---------- Day & night ----------

export function DayNight({ params, onInteract }: VisualizerProps) {
  const [angle, setAngle] = useState(num(params, 'angle', 0));
  // angle 0 = house facing the Sun (noon). The Sun is on the left of the picture.
  const theta = (angle + 270) % 360;
  const rad = (theta * Math.PI) / 180;
  const facing = -Math.sin(rad);
  const phase = facing > 0.25 ? 'day' : facing < -0.25 ? 'night' : Math.cos(rad) < 0 ? 'sunrise' : 'sunset';
  const sky = { day: 'from-[#62B6F7] to-[#CFEAFF]', night: 'from-[#0B1430] to-[#26315A]', sunrise: 'from-[#F7A35C] to-[#FFE1B3]', sunset: 'from-[#C2557A] to-[#F7A35C]' }[phase];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <svg viewBox="0 0 220 160" className="w-full rounded-2xl bg-[#0E1630]">
        {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={(i * 53) % 220} cy={(i * 37) % 160} r="1.2" fill="#fff" opacity="0.6" />)}
        <circle cx="20" cy="80" r="28" fill="#FDB813" />
        {Array.from({ length: 6 }, (_, i) => <line key={i} x1="50" y1={80 + (i - 2.5) * 12} x2="80" y2={80 + (i - 2.5) * 12} stroke="#FDB813" strokeOpacity="0.35" strokeWidth="2" />)}
        <circle cx="150" cy="80" r="42" fill="#3E7CC9" />
        <path d="M150 38 A42 42 0 0 1 150 122 Z" fill="#000" opacity="0.45" />
        <g transform={`rotate(${theta} 150 80)`}>
          <text x="150" y="40" textAnchor="middle" fontSize="18">🏠</text>
        </g>
      </svg>
      <div>
        <div className={`grid h-32 place-items-center rounded-2xl bg-gradient-to-b ${sky} text-6xl transition-all`}>
          {phase === 'day' ? '☀️' : phase === 'night' ? '🌙✨' : phase === 'sunrise' ? '🌅' : '🌇'}
        </div>
        <input type="range" min={0} max={359} value={angle} aria-label="Spin the Earth" className="mt-4 w-full accent-[#27314D]"
          onChange={(e) => { setAngle(Number(e.target.value)); onInteract?.(); }} />
        <Readout>{phase === 'day' ? 'Your home faces the Sun: it is DAY' : phase === 'night' ? 'Your home faces away: it is NIGHT' : phase === 'sunrise' ? 'Turning towards the Sun: SUNRISE' : 'Turning away from the Sun: SUNSET'}</Readout>
      </div>
    </div>
  );
}

// ---------- Life cycle sequencer ----------

const CYCLES: Record<string, string[]> = {
  butterfly: ['🥚 Egg', '🐛 Caterpillar', '🫘 Pupa', '🦋 Butterfly'],
  frog: ['🥚 Eggs', '🐟 Tadpole', '🐸 Froglet', '🐸 Frog'],
  plant: ['🌰 Seed', '🌱 Sprout', '🪴 Young plant', '🌻 Flowering plant'],
};

export function LifeCycle({ params, onInteract }: VisualizerProps) {
  const [cycle, setCycle] = useState(str(params, 'cycle', 'butterfly') in CYCLES ? str(params, 'cycle', 'butterfly') : 'butterfly');
  const stages = CYCLES[cycle];
  const [placed, setPlaced] = useState<string[]>([]);
  const [deck, setDeck] = useState(() => shuffle(stages));
  const [wrong, setWrong] = useState<string | null>(null);

  const reset = (c: string) => { setCycle(c); setPlaced([]); setDeck(shuffle(CYCLES[c])); setWrong(null); onInteract?.(); };
  const tap = (s: string) => {
    onInteract?.();
    if (s === stages[placed.length]) { setPlaced([...placed, s]); setDeck(deck.filter((d) => d !== s)); setWrong(null); }
    else setWrong(s);
  };

  return (
    <div>
      <div className="flex justify-center gap-2">
        {Object.keys(CYCLES).map((c) => <Chip key={c} active={c === cycle} onClick={() => reset(c)}>{c[0].toUpperCase() + c.slice(1)}</Chip>)}
      </div>
      <div className="mx-auto mt-4 grid max-w-md grid-cols-2 gap-3">
        {stages.map((_, i) => {
          const order = [0, 1, 3, 2][i];
          const s = placed[order];
          return (
            <div key={i} className={`grid h-20 place-items-center rounded-2xl border-2 ${s ? 'border-[#46A758] bg-[#EAF7EA]' : 'border-dashed border-[#BFB8A6] bg-white'}`}>
              <span className="text-center text-sm font-bold">{s ? <><span className="block text-3xl">{s.split(' ')[0]}</span>{s.slice(s.indexOf(' ') + 1)}</> : `Stage ${order + 1}`}</span>
            </div>
          );
        })}
      </div>
      <Controls>
        {deck.map((s) => (
          <button key={s} type="button" onClick={() => tap(s)}
            className={`rounded-xl border-2 bg-white px-3 py-2 text-sm font-bold transition ${wrong === s ? 'animate-[shake_.3s] border-[#E5484D]' : 'border-[#E0DBCF] hover:border-[#27314D]'}`}>
            {s}
          </button>
        ))}
      </Controls>
      <Readout>{placed.length === stages.length ? `${stages.map((s) => s.split(' ')[0]).join(' → ')} → and around again!` : wrong ? 'Not that one yet. What comes first?' : `Tap stage ${placed.length + 1}`}</Readout>
    </div>
  );
}
