import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Celebrate } from '../../anim/Celebrate';

export type Answer = 'correct' | 'wrong' | null;

export interface SceneProps {
  answer: Answer;
  /** Speaks a short line if narration is on. */
  say: (text: string) => void;
}

export type Backdrop = 'orchard' | 'forest' | 'space' | 'kingdom' | 'peak';

function Scenery({ kind }: { kind: Backdrop }) {
  if (kind === 'orchard' || kind === 'forest') {
    const forest = kind === 'forest';
    return (
      <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id={`sky-${kind}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={forest ? '#9AD1C4' : '#8FD3FF'} /><stop offset="1" stopColor={forest ? '#E6F4EA' : '#E8F7FF'} />
          </linearGradient>
        </defs>
        <rect width="800" height="400" fill={`url(#sky-${kind})`} />
        {!forest && <circle cx="700" cy="70" r="40" fill="#FFD166" />}
        <g fill="#fff" opacity=".9"><ellipse cx="150" cy="70" rx="50" ry="16" /><ellipse cx="185" cy="60" rx="34" ry="18" /><ellipse cx="520" cy="50" rx="44" ry="14" /></g>
        <path d="M0 260 Q200 200 400 250 T800 230 V400 H0 Z" fill={forest ? '#5DA271' : '#8BCB6A'} />
        <path d="M0 300 Q220 260 420 300 T800 290 V400 H0 Z" fill={forest ? '#3E7C55' : '#6DB255'} />
        {forest && [60, 140, 640, 730].map((x, i) => (
          <g key={x} transform={`translate(${x} ${200 + (i % 2) * 20})`}>
            <rect x="-6" y="40" width="12" height="60" fill="#6B4423" />
            <path d="M0 -40 L40 50 H-40 Z" fill="#2F6B45" /><path d="M0 -70 L32 10 H-32 Z" fill="#3B8257" />
          </g>
        ))}
      </svg>
    );
  }
  if (kind === 'space') {
    return (
      <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="neb" cx="70%" cy="20%" r="80%"><stop offset="0" stopColor="#4361EE" /><stop offset=".6" stopColor="#1B1446" /><stop offset="1" stopColor="#0B0A24" /></radialGradient>
        </defs>
        <rect width="800" height="400" fill="url(#neb)" />
        {Array.from({ length: 60 }, (_, i) => (
          <circle key={i} cx={(i * 137) % 800} cy={(i * 71) % 400} r={i % 7 === 0 ? 2 : 1} fill="#fff" opacity={0.3 + (i % 5) * 0.14}>
            {i % 6 === 0 && <animate attributeName="opacity" values=".2;1;.2" dur={`${2 + (i % 4)}s`} repeatCount="indefinite" />}
          </circle>
        ))}
        <circle cx="110" cy="330" r="120" fill="#7209B7" opacity=".55" />
        <ellipse cx="110" cy="330" rx="170" ry="26" fill="none" stroke="#B5179E" strokeWidth="6" opacity=".6" />
      </svg>
    );
  }
  if (kind === 'kingdom') {
    return (
      <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs><linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4CC9F0" /><stop offset="1" stopColor="#C8B6FF" /></linearGradient></defs>
        <rect width="800" height="400" fill="url(#dusk)" />
        <path d="M0 300 Q200 250 400 290 T800 280 V400 H0 Z" fill="#7BC47F" />
        <path d="M0 340 H800 V400 H0 Z" fill="#A7896B" />
        {Array.from({ length: 16 }, (_, i) => <rect key={i} x={i * 52} y="344" width="48" height="22" rx="3" fill="#BFA588" />)}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs><linearGradient id="peak" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#03071E" /><stop offset=".7" stopColor="#6A040F" /><stop offset="1" stopColor="#D00000" /></linearGradient></defs>
      <rect width="800" height="400" fill="url(#peak)" />
      {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(i * 113) % 800} cy={(i * 47) % 180} r="1.2" fill="#fff" opacity=".5" />)}
      <path d="M0 400 L160 200 L260 300 L400 140 L540 290 L640 210 L800 400 Z" fill="#370617" />
      <path d="M360 190 L400 140 L440 190 L420 180 L400 200 L380 180 Z" fill="#fff" opacity=".2" />
    </svg>
  );
}

export function Stage({ backdrop, celebrate, shake, children, className = '' }: {
  backdrop: Backdrop; celebrate?: boolean; shake?: boolean; children: ReactNode; className?: string;
}) {
  return (
    <motion.div
      className={`relative isolate min-h-[300px] overflow-hidden rounded-2xl sm:min-h-[340px] ${className}`}
      animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }}
      transition={{ duration: 0.45 }}>
      <Scenery kind={backdrop} />
      <div className="relative z-10 h-full">{children}</div>
      <Celebrate trigger={celebrate} />
    </motion.div>
  );
}

/** Big friendly number / equation bubble. */
export function Bubble({ children, tone = 'light', className = '' }: { children: ReactNode; tone?: 'light' | 'dark' | 'gold'; className?: string }) {
  const tones = { light: 'bg-white/95 text-[#27314D]', dark: 'bg-[#27314D]/90 text-[#F4CF55]', gold: 'bg-[#F4CF55] text-[#27314D]' };
  return (
    <AnimatePresence mode="popLayout">
      <motion.div key={String(children)} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 font-['Space_Grotesk'] text-xl font-bold shadow-lg sm:text-2xl ${tones[tone]} ${className}`}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function Hint({ children }: { children: ReactNode }) {
  return <div className="pointer-events-none inline-block rounded-full bg-black/35 px-3 py-1 text-center text-xs font-bold text-white backdrop-blur-sm">{children}</div>;
}

/** Wraps a sprite so it pops in with a stagger and wiggles on hover. */
export function Pop({ i = 0, children, className = '', onClick, label }: { i?: number; children: ReactNode; className?: string; onClick?: () => void; label?: string }) {
  const Comp = onClick ? motion.button : motion.div;
  return (
    <Comp type={onClick ? 'button' : undefined} onClick={onClick} aria-label={label}
      initial={{ scale: 0, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 16, delay: i * 0.08 }}
      whileHover={onClick ? { scale: 1.1, rotate: -4 } : undefined} whileTap={onClick ? { scale: 0.9 } : undefined}
      className={`relative ${onClick ? 'cursor-pointer' : ''} ${className}`}>
      {children}
    </Comp>
  );
}

export function CountBadge({ n }: { n: number }) {
  return (
    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      className="absolute -right-1 -top-1 z-10 grid h-6 w-6 place-items-center rounded-full bg-[#27314D] text-xs font-bold text-[#F4CF55] ring-2 ring-white">
      {n}
    </motion.span>
  );
}
