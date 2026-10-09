import { Suspense, lazy, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { LottieRefCurrentProps } from 'lottie-react';

const Lottie = lazy(() => import('lottie-react'));

export type LottieName =
  | 'bear' | 'castle' | 'coins' | 'confetti' | 'crocodile' | 'dragon'
  | 'frog' | 'girl' | 'rocket' | 'sparkle' | 'squirrel' | 'trophy';

const cache = new Map<LottieName, Promise<unknown>>();

/** Paused/reduced-motion frame for files whose first frame is blank. */
const STILL_FRAME: Partial<Record<LottieName, number>> = { rocket: 30, trophy: 85 };

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
  /** Frame shown when paused or with reduced motion (some files start on a blank frame). */
  stillFrame?: number;
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
  name, loop = true, play = true, segment, playKey, stillFrame = STILL_FRAME[name] ?? 0, speed = 1, flip, className = '', style, label, fallback = null, onComplete,
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
    if (reduced || !play) { a.goToAndStop(stillFrame, true); return; }
    if (segment) a.playSegments(segment, true);
    else a.goToAndPlay(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, play, seg, playKey, stillFrame, speed, reduced]);

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
            if (reduced || !play) a.goToAndStop(stillFrame, true);
            else if (segment) a.playSegments(segment, true);
            else a.play();
          }}
          onComplete={() => onComplete?.()}
          className="h-full w-full" />
      </Suspense>
    </div>
  );
}
