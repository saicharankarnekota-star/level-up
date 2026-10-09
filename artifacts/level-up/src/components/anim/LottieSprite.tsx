import { Suspense, lazy, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { LottieRefCurrentProps } from 'lottie-react';

const Lottie = lazy(() => import('lottie-react'));

export type LottieName =
  | 'bear' | 'castle' | 'coins' | 'confetti' | 'crocodile' | 'dragon'
  | 'frog' | 'girl' | 'rocket' | 'sparkle' | 'squirrel' | 'trophy';

const cache = new Map<LottieName, Promise<unknown>>();

function loadAnimation(name: LottieName) {
  let p = cache.get(name);
  if (!p) {
    p = fetch(`${import.meta.env.BASE_URL}lottie/${name}.json`).then((r) => {
      if (!r.ok) throw new Error(`lottie ${name}: ${r.status}`);
      return r.json();
    });
    p.catch(() => cache.delete(name));
    cache.set(name, p);
  }
  return p;
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export interface LottieSpriteProps {
  name: LottieName;
  loop?: boolean;
  /** Pauses the animation when false. */
  play?: boolean;
  /** Frame range to play instead of the whole animation. */
  segment?: [number, number];
  /** Changing this value restarts the animation (or segment) from the start. */
  playKey?: string | number;
  speed?: number;
  flip?: boolean;
  className?: string;
  style?: CSSProperties;
  label?: string;
  /** Shown while loading and if the file cannot be loaded. */
  fallback?: ReactNode;
  onComplete?: () => void;
}

export function LottieSprite({
  name, loop = true, play = true, segment, playKey, speed = 1, flip, className = '', style, label, fallback = null, onComplete,
}: LottieSpriteProps) {
  const [data, setData] = useState<unknown>(null);
  const [failed, setFailed] = useState(false);
  const ref = useRef<LottieRefCurrentProps | null>(null);
  const reduced = prefersReducedMotion();
  const seg = segment ? `${segment[0]}-${segment[1]}` : '';

  useEffect(() => {
    let alive = true;
    loadAnimation(name).then((d) => alive && setData(d), () => alive && setFailed(true));
    return () => { alive = false; };
  }, [name]);

  useEffect(() => {
    const a = ref.current;
    if (!a || !data) return;
    a.setSpeed(speed);
    if (reduced) { a.goToAndStop(segment ? segment[1] : 0, true); return; }
    if (!play) { a.pause(); return; }
    if (segment) a.playSegments(segment, true);
    else a.goToAndPlay(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, play, seg, playKey, speed, reduced]);

  const box = `relative ${className}`;
  const flipStyle: CSSProperties = { ...style, ...(flip ? { transform: `${style?.transform ?? ''} scaleX(-1)` } : {}) };
  if (failed || !data) return <div className={box} style={flipStyle} role={label ? 'img' : undefined} aria-label={label}>{fallback}</div>;
  return (
    <div className={box} style={flipStyle} role={label ? 'img' : undefined} aria-label={label}>
      <Suspense fallback={fallback}>
        <Lottie lottieRef={ref} animationData={data} loop={loop && !reduced} autoplay={false}
          onDOMLoaded={() => {
            const a = ref.current;
            if (!a) return;
            a.setSpeed(speed);
            if (reduced) a.goToAndStop(segment ? segment[1] : 0, true);
            else if (play) segment ? a.playSegments(segment, true) : a.play();
          }}
          onComplete={() => onComplete?.()}
          className="h-full w-full" />
      </Suspense>
    </div>
  );
}
