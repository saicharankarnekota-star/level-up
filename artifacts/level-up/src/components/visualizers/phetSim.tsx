import { useRef, useState } from 'react';
import { Loader2, Maximize2 } from 'lucide-react';
import { str, type VisualizerProps } from './common';

/** Official PhET builds, self-hosted in public/sims (CC BY-NC 4.0, attribution required near the sim). */
const SIMS: Record<string, { title: string; file: string; url: string }> = {
  'forces-and-motion-basics': {
    title: 'Forces and Motion: Basics',
    file: 'forces-and-motion-basics.html',
    url: 'https://phet.colorado.edu/en/simulations/forces-and-motion-basics',
  },
};

export function PhetSim({ params, onInteract }: VisualizerProps) {
  const sim = SIMS[str(params, 'sim', 'forces-and-motion-basics')] ?? SIMS['forces-and-motion-basics'];
  const frame = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const interact = useRef(onInteract);
  interact.current = onInteract;

  // Same-origin iframe, so we can count real clicks/drags inside the sim to unlock the next step.
  const onLoad = () => {
    setLoaded(true);
    let last = 0;
    frame.current?.contentWindow?.addEventListener('pointerup', () => {
      if (Date.now() - last < 500) return;
      last = Date.now();
      interact.current?.();
    }, true);
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-[#E0DBCF] bg-black" style={{ aspectRatio: '1024 / 618' }}>
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center text-sm font-bold text-white/80">
            <span className="inline-flex items-center gap-2"><Loader2 size={18} className="animate-spin" /> Loading simulation…</span>
          </div>
        )}
        <iframe ref={frame} title={sim.title} src={`${import.meta.env.BASE_URL}sims/${sim.file}`} onLoad={onLoad}
          className="absolute inset-0 h-full w-full" allow="fullscreen" />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6B7385]">
        <span>
          Simulation by <a className="underline" href={sim.url} target="_blank" rel="noreferrer">PhET Interactive Simulations</a>, University of Colorado Boulder, licensed under{' '}
          <a className="underline" href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noreferrer">CC BY-NC 4.0</a>.
        </span>
        <button type="button" className="inline-flex items-center gap-1 rounded-full border border-[#E0DBCF] bg-white px-3 py-1 font-bold text-[#27314D]"
          onClick={() => frame.current?.requestFullscreen?.()}>
          <Maximize2 size={12} /> Full screen
        </button>
      </div>
    </div>
  );
}
