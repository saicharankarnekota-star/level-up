import { useId, type ReactNode } from 'react';

interface SpriteProps {
  size?: number;
  className?: string;
  title?: string;
}

function Svg({ size = 48, w = 100, h = 100, className = '', title, children }: SpriteProps & { w?: number; h?: number; children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={size * (w / h)} height={size} className={`block select-none ${className}`}
      role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

const useUid = () => useId().replace(/:/g, '');

// ---------- Food & nature ----------

export function Apple({ color = 'red', ...p }: SpriteProps & { color?: 'red' | 'green' }) {
  const id = useUid();
  const [hi, lo] = color === 'red' ? ['#FF6B6B', '#C1121F'] : ['#B5E853', '#4C9A2A'];
  return (
    <Svg {...p}>
      <defs>
        <radialGradient id={`a${id}`} cx="35%" cy="35%" r="70%"><stop offset="0" stopColor={hi} /><stop offset="1" stopColor={lo} /></radialGradient>
      </defs>
      <ellipse cx="50" cy="94" rx="28" ry="4" fill="#000" opacity=".12" />
      <path d="M50 28 C38 18 14 22 14 52 C14 76 32 94 44 92 C48 91 52 91 56 92 C68 94 86 76 86 52 C86 22 62 18 50 28 Z" fill={`url(#a${id})`} />
      <path d="M50 28 C49 24 48 18 50 10" stroke="#6B4423" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M52 18 C60 6 76 8 78 12 C70 20 60 22 52 18 Z" fill="#3FA34D" />
      <ellipse cx="32" cy="44" rx="7" ry="11" fill="#fff" opacity=".45" transform="rotate(-20 32 44)" />
    </Svg>
  );
}

export function Basket({ size = 120, className, title }: SpriteProps) {
  const id = useUid();
  return (
    <Svg size={size} w={160} h={100} className={className} title={title}>
      <defs>
        <linearGradient id={`b${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#D69A55" /><stop offset="1" stopColor="#9C6328" /></linearGradient>
      </defs>
      <path d="M10 30 L150 30 L134 94 L26 94 Z" fill={`url(#b${id})`} />
      {[44, 58, 72, 86].map((y) => <path key={y} d={`M${12 + (y - 30) / 4} ${y} H${148 - (y - 30) / 4}`} stroke="#7A4A1C" strokeWidth="2" opacity=".5" />)}
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${24 + i * 14} 32 L${32 + i * 12} 92`} stroke="#7A4A1C" strokeWidth="2" opacity=".35" />)}
      <rect x="4" y="22" width="152" height="12" rx="6" fill="#B87A3D" stroke="#7A4A1C" strokeWidth="2" />
    </Svg>
  );
}

export function HoneyJar({ empty, ...p }: SpriteProps & { empty?: boolean }) {
  const id = useUid();
  return (
    <Svg {...p} w={80} h={100}>
      <defs>
        <linearGradient id={`h${id}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#F7B32B" /><stop offset=".5" stopColor="#FFD166" /><stop offset="1" stopColor="#D98E04" /></linearGradient>
      </defs>
      <ellipse cx="40" cy="96" rx="26" ry="3" fill="#000" opacity=".12" />
      <path d="M14 30 Q8 34 8 46 V84 Q8 94 20 94 H60 Q72 94 72 84 V46 Q72 34 66 30 Z" fill="#FFF8E7" opacity=".5" stroke="#D9B26F" strokeWidth="2" />
      {!empty && <path d="M12 44 Q12 38 18 38 H62 Q68 38 68 44 V84 Q68 91 60 91 H20 Q12 91 12 84 Z" fill={`url(#h${id})`} />}
      <rect x="16" y="54" width="48" height="22" rx="4" fill="#FFFDF5" stroke="#B5651D" strokeWidth="1.5" />
      <text x="40" y="69" textAnchor="middle" fontSize="11" fontWeight="800" fill="#8A4B08" fontFamily="sans-serif">HONEY</text>
      <path d="M10 22 Q40 14 70 22 L68 32 Q40 26 12 32 Z" fill="#E5484D" />
      <path d="M12 22 L16 30 M24 19 L26 28 M36 18 L37 27 M48 18 L47 27 M60 20 L58 29" stroke="#fff" strokeWidth="2" opacity=".6" />
      <rect x="14" y="30" width="52" height="5" rx="2" fill="#8A4B08" />
      <path d="M18 44 V80" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".35" />
    </Svg>
  );
}

export function Cookie(p: SpriteProps) {
  const id = useUid();
  return (
    <Svg {...p}>
      <defs>
        <radialGradient id={`c${id}`} cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#F2C27B" /><stop offset="1" stopColor="#C4842F" /></radialGradient>
      </defs>
      <path d="M50 6 C74 6 94 24 94 50 C94 76 74 94 50 94 C26 94 6 76 6 50 C6 24 26 6 50 6 Z" fill={`url(#c${id})`} stroke="#A86B22" strokeWidth="2" />
      {[[32, 30, 7], [62, 26, 6], [70, 54, 8], [44, 58, 7], [26, 66, 5], [54, 78, 6], [80, 34, 4]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.8} fill="#4A2A12" />
      ))}
    </Svg>
  );
}

export type FruitKind = 'apple' | 'banana' | 'grapes' | 'orange';

export function Fruit({ kind, ...p }: SpriteProps & { kind: FruitKind }) {
  const id = useUid();
  if (kind === 'apple') return <Apple {...p} />;
  if (kind === 'banana') {
    return (
      <Svg {...p}>
        <defs><linearGradient id={`f${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE66D" /><stop offset="1" stopColor="#F2B705" /></linearGradient></defs>
        <path d="M18 30 C14 62 40 90 82 82 C88 80 88 74 82 74 C52 76 34 58 30 30 C29 24 19 24 18 30 Z" fill={`url(#f${id})`} stroke="#B98B00" strokeWidth="2" />
        <path d="M20 28 L18 18 L26 20 Z" fill="#6B4E16" />
        <path d="M84 76 L92 78 L86 82 Z" fill="#6B4E16" />
        <path d="M28 44 C32 62 46 74 66 76" stroke="#fff" strokeWidth="3" opacity=".5" fill="none" strokeLinecap="round" />
      </Svg>
    );
  }
  if (kind === 'grapes') {
    const g: [number, number][] = [[34, 34], [52, 34], [70, 34], [43, 50], [61, 50], [34, 66], [52, 66], [70, 66], [43, 82], [61, 82]].filter((_, i) => i !== 5 && i !== 7) as [number, number][];
    return (
      <Svg {...p}>
        <defs><radialGradient id={`f${id}`} cx="35%" cy="35%" r="70%"><stop offset="0" stopColor="#B57EDC" /><stop offset="1" stopColor="#5B2A86" /></radialGradient></defs>
        <path d="M52 26 C52 16 56 10 62 6" stroke="#6B4423" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M54 20 C62 10 78 14 80 18 C72 24 62 24 54 20 Z" fill="#3FA34D" />
        {g.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="10" fill={`url(#f${id})`} />)}
      </Svg>
    );
  }
  return (
    <Svg {...p}>
      <defs><radialGradient id={`f${id}`} cx="35%" cy="35%" r="70%"><stop offset="0" stopColor="#FFB347" /><stop offset="1" stopColor="#E36414" /></radialGradient></defs>
      <ellipse cx="50" cy="94" rx="28" ry="4" fill="#000" opacity=".12" />
      <circle cx="50" cy="54" r="38" fill={`url(#f${id})`} />
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={50 + 26 * Math.cos(i * 2.1)} cy={54 + 26 * Math.sin(i * 2.1)} r="1.4" fill="#C4500F" opacity=".5" />)}
      <path d="M50 18 C56 8 70 8 74 12 C66 20 56 20 50 18 Z" fill="#3FA34D" />
      <ellipse cx="36" cy="40" rx="6" ry="9" fill="#fff" opacity=".4" transform="rotate(-25 36 40)" />
    </Svg>
  );
}

// ---------- Treasure ----------

export function Crystal({ glow, ...p }: SpriteProps & { glow?: boolean }) {
  const id = useUid();
  return (
    <Svg {...p} w={70} h={100}>
      <defs>
        <linearGradient id={`k${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9BF6FF" /><stop offset=".5" stopColor="#4CC9F0" /><stop offset="1" stopColor="#7209B7" /></linearGradient>
        <filter id={`g${id}`}><feGaussianBlur stdDeviation="4" /></filter>
      </defs>
      {glow && <path d="M35 4 L62 32 L52 92 L18 92 L8 32 Z" fill="#4CC9F0" filter={`url(#g${id})`} opacity=".8" />}
      <path d="M35 4 L62 32 L52 92 L18 92 L8 32 Z" fill={`url(#k${id})`} stroke="#3A0CA3" strokeWidth="1.5" />
      <path d="M35 4 L35 92 M8 32 L62 32 M35 4 L22 32 L35 92 M35 4 L48 32 L35 92" stroke="#fff" strokeWidth="1.2" opacity=".55" fill="none" />
      <path d="M14 36 L20 70" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".7" />
    </Svg>
  );
}

export function Gem({ color = '#E5484D', ...p }: SpriteProps & { color?: string }) {
  const id = useUid();
  return (
    <Svg {...p}>
      <defs>
        <linearGradient id={`m${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".7" /><stop offset=".4" stopColor={color} /><stop offset="1" stopColor={color} stopOpacity=".75" /></linearGradient>
      </defs>
      <path d="M22 18 H78 L96 40 L50 92 L4 40 Z" fill={`url(#m${id})`} stroke="#00000033" strokeWidth="2" />
      <path d="M4 40 H96 M22 18 L36 40 L50 18 L64 40 L78 18 M36 40 L50 92 L64 40" stroke="#fff" strokeWidth="1.6" opacity=".6" fill="none" />
    </Svg>
  );
}

export function Chest({ open, ...p }: SpriteProps & { open?: boolean }) {
  const id = useUid();
  return (
    <Svg {...p} w={120} h={100}>
      <defs><linearGradient id={`t${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#A0522D" /><stop offset="1" stopColor="#6B3410" /></linearGradient></defs>
      {open
        ? <path d="M12 44 L22 8 H98 L108 44 Z" fill="#7A3E14" stroke="#4A2208" strokeWidth="2" />
        : <path d="M10 46 Q10 16 60 16 Q110 16 110 46 Z" fill={`url(#t${id})`} stroke="#4A2208" strokeWidth="2" />}
      <rect x="10" y="44" width="100" height="50" rx="4" fill={`url(#t${id})`} stroke="#4A2208" strokeWidth="2" />
      <rect x="10" y="44" width="100" height="8" fill="#E8B923" />
      <rect x="22" y="44" width="8" height="50" fill="#E8B923" opacity=".9" />
      <rect x="90" y="44" width="8" height="50" fill="#E8B923" opacity=".9" />
      <rect x="52" y="48" width="16" height="18" rx="3" fill="#F4CF55" stroke="#A67C00" strokeWidth="1.5" />
      <circle cx="60" cy="56" r="2.5" fill="#4A2208" />
    </Svg>
  );
}

export function Pouch(p: SpriteProps) {
  const id = useUid();
  return (
    <Svg {...p}>
      <defs><radialGradient id={`p${id}`} cx="40%" cy="40%" r="70%"><stop offset="0" stopColor="#B07D4F" /><stop offset="1" stopColor="#6E4524" /></radialGradient></defs>
      <path d="M36 26 C20 40 10 60 14 78 C18 94 82 94 86 78 C90 60 80 40 64 26 Z" fill={`url(#p${id})`} />
      <path d="M30 18 Q50 30 70 18 L64 28 Q50 34 36 28 Z" fill="#8C5A30" />
      <path d="M34 28 Q50 36 66 28" stroke="#F4CF55" strokeWidth="4" fill="none" strokeLinecap="round" />
      <text x="50" y="72" textAnchor="middle" fontSize="22" fontWeight="800" fill="#F4CF55" fontFamily="sans-serif">₹</text>
    </Svg>
  );
}

const COIN_STYLE: Record<number, { face: string; rim: string; ink: string; inner?: string }> = {
  1: { face: '#D9DEE5', rim: '#A3ABB7', ink: '#4B5563' },
  2: { face: '#E3E7EC', rim: '#9CA3AF', ink: '#374151' },
  5: { face: '#E9C46A', rim: '#B8892D', ink: '#6B4A0B' },
  10: { face: '#E9C46A', rim: '#C0C6CF', ink: '#6B4A0B', inner: '#E9C46A' },
};

export function Coin({ value, ...p }: SpriteProps & { value: number }) {
  const id = useUid();
  const s = COIN_STYLE[value] ?? COIN_STYLE[1];
  return (
    <Svg {...p}>
      <defs>
        <radialGradient id={`o${id}`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#fff" stopOpacity=".7" /><stop offset=".35" stopColor={s.face} /><stop offset="1" stopColor={s.rim} /></radialGradient>
      </defs>
      <circle cx="50" cy="52" r="46" fill="#00000022" />
      <circle cx="50" cy="50" r="46" fill={value === 10 ? '#C9CFD8' : `url(#o${id})`} stroke={s.rim} strokeWidth="3" />
      <circle cx="50" cy="50" r={value === 10 ? 32 : 38} fill={`url(#o${id})`} stroke={s.rim} strokeWidth="1.5" strokeDasharray={value === 10 ? undefined : '2 3'} />
      <text x="50" y="62" textAnchor="middle" fontSize={value === 10 ? 30 : 34} fontWeight="800" fill={s.ink} fontFamily="'Space Grotesk', sans-serif">₹{value}</text>
    </Svg>
  );
}

// ---------- Classroom ----------

export function Pencil({ length = 200, height = 26, className }: { length?: number; height?: number; className?: string }) {
  const w = Math.max(60, length);
  return (
    <svg viewBox={`0 0 ${w} 26`} width={w} height={height} className={`block ${className ?? ''}`} aria-hidden>
      <rect x="0" y="4" width="16" height="18" rx="4" fill="#F49AC2" />
      <rect x="14" y="3" width="10" height="20" fill="#C0C6CF" />
      <path d="M16 3 V23 M20 3 V23" stroke="#8A919C" strokeWidth="1" />
      <rect x="24" y="3" width={w - 52} height="20" fill="#F4C430" />
      <rect x="24" y="3" width={w - 52} height="6" fill="#FFE07A" />
      <rect x="24" y="17" width={w - 52} height="6" fill="#D9A400" />
      <path d={`M${w - 28} 3 L${w - 2} 13 L${w - 28} 23 Z`} fill="#F1D3A1" />
      <path d={`M${w - 10} 10 L${w - 2} 13 L${w - 10} 16 Z`} fill="#3A3A3A" />
    </svg>
  );
}

export function Crayon({ length = 160, height = 26, color = '#3E63DD', className }: { length?: number; height?: number; color?: string; className?: string }) {
  const w = Math.max(50, length);
  return (
    <svg viewBox={`0 0 ${w} 26`} width={w} height={height} className={`block ${className ?? ''}`} aria-hidden>
      <rect x="0" y="4" width={w - 22} height="18" rx="4" fill={color} />
      <rect x="10" y="4" width={w - 44} height="18" fill="#fff" opacity=".18" />
      <path d={`M14 4 V22 M${w - 34} 4 V22`} stroke="#00000040" strokeWidth="2" />
      <path d={`M${w - 24} 6 L${w - 2} 13 L${w - 24} 20 Z`} fill={color} />
      <path d={`M${w - 24} 6 L${w - 2} 13 L${w - 24} 20 Z`} fill="#000" opacity=".15" />
    </svg>
  );
}

export function PaperClip({ size = 34, color = '#8C95A3', className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 100 34" width={size} height={size * 0.34} className={`block ${className ?? ''}`} aria-hidden>
      <path d="M8 17 C8 8 14 4 22 4 H84 C92 4 96 10 96 17 C96 24 92 30 84 30 H26 C20 30 16 26 16 20 C16 15 20 12 26 12 H80"
        stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ---------- Pattern shapes ----------

export type PatternKind = 'circle' | 'square' | 'star' | 'moon' | 'triangle' | 'heart' | 'diamond' | 'leaf';

export const PATTERN_COLORS: Record<PatternKind, string> = {
  circle: '#E5484D', square: '#3E63DD', star: '#F4B400', moon: '#8E7CC3',
  triangle: '#46A758', heart: '#F06595', diamond: '#12A4B8', leaf: '#2F9E44',
};

export function PatternShape({ kind, ...p }: SpriteProps & { kind: PatternKind }) {
  const c = PATTERN_COLORS[kind];
  const shape = {
    circle: <circle cx="50" cy="50" r="40" fill={c} />,
    square: <rect x="12" y="12" width="76" height="76" rx="10" fill={c} />,
    star: <path d="M50 6 L62 36 L94 38 L69 58 L78 90 L50 72 L22 90 L31 58 L6 38 L38 36 Z" fill={c} />,
    moon: <path d="M64 8 A42 42 0 1 0 92 66 A34 34 0 1 1 64 8 Z" fill={c} />,
    triangle: <path d="M50 8 L94 88 H6 Z" fill={c} />,
    heart: <path d="M50 88 C10 60 6 36 22 22 C34 12 46 18 50 28 C54 18 66 12 78 22 C94 36 90 60 50 88 Z" fill={c} />,
    diamond: <path d="M50 4 L92 50 L50 96 L8 50 Z" fill={c} />,
    leaf: <path d="M14 86 C14 40 40 12 88 12 C88 60 60 86 14 86 Z M14 86 L60 40" fill={c} stroke="#1B5E20" strokeWidth="3" />,
  }[kind];
  return (
    <Svg {...p} title={p.title ?? kind}>
      <g style={{ filter: 'drop-shadow(0 3px 0 rgba(0,0,0,.15))' }}>{shape}</g>
      <ellipse cx="36" cy="32" rx="10" ry="6" fill="#fff" opacity=".35" transform="rotate(-30 36 32)" />
    </Svg>
  );
}
