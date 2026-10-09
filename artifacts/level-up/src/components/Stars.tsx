import { Star } from 'lucide-react';

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} of 3 stars`}>
      {[1, 2, 3].map((i) => (
        <Star key={i} size={size} className={i <= value ? 'fill-[#F4CF55] text-[#D9A928]' : 'text-[#D8D3C6]'} />
      ))}
    </span>
  );
}
