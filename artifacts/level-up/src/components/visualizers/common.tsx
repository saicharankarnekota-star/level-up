import type { ReactNode } from 'react';
import { Minus, Plus } from 'lucide-react';
import type { VisualizerParams } from '../../types';

export interface VisualizerProps {
  params?: VisualizerParams;
  onInteract?: () => void;
}

export const num = (params: VisualizerParams | undefined, key: string, fallback: number) => {
  const v = params?.[key];
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
};

export const str = (params: VisualizerParams | undefined, key: string, fallback: string) => {
  const v = params?.[key];
  return typeof v === 'string' ? v : fallback;
};

export const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export function Stepper({ label, value, min, max, onChange }: {
  label: string; value: number; min: number; max: number; onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[#E6E1D6] bg-white px-2 py-1.5">
      <span className="text-[11px] font-bold text-[#6B7385]">{label}</span>
      <button type="button" aria-label={`Less ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)}
        className="grid h-8 w-8 place-items-center rounded-lg bg-[#F3F0E8] text-[#27314D] disabled:opacity-30 hover:bg-[#E9E4D7]">
        <Minus size={15} />
      </button>
      <b className="w-7 text-center font-['Space_Grotesk'] text-lg text-[#27314D]">{value}</b>
      <button type="button" aria-label={`More ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}
        className="grid h-8 w-8 place-items-center rounded-lg bg-[#F3F0E8] text-[#27314D] disabled:opacity-30 hover:bg-[#E9E4D7]">
        <Plus size={15} />
      </button>
    </div>
  );
}

export function Readout({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 rounded-xl bg-[#27314D] px-4 py-3 text-center font-['Space_Grotesk'] text-lg font-semibold text-[#F4CF55]">
      {children}
    </div>
  );
}

export function Controls({ children }: { children: ReactNode }) {
  return <div className="mt-4 flex flex-wrap items-center justify-center gap-2">{children}</div>;
}

export function Chip({ active, onClick, children }: { active?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${active ? 'border-[#27314D] bg-[#27314D] text-white' : 'border-[#E0DBCF] bg-white text-[#3E475A] hover:border-[#27314D]'}`}>
      {children}
    </button>
  );
}
