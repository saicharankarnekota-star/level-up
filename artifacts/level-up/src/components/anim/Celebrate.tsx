import { useEffect, useState } from 'react';
import { LottieSprite, prefersReducedMotion, type LottieName } from './LottieSprite';

/** Plays a one-shot effect over its (relatively positioned) parent whenever `trigger` changes to a truthy value. */
export function Celebrate({ trigger, effect = 'confetti' }: { trigger: string | number | boolean | null | undefined; effect?: LottieName }) {
  const [shot, setShot] = useState(0);
  useEffect(() => { if (trigger) setShot((s) => s + 1); }, [trigger]);
  if (!shot || prefersReducedMotion()) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
      <LottieSprite key={shot} name={effect} loop={false} className="h-full w-full" onComplete={() => setShot(0)} />
    </div>
  );
}
