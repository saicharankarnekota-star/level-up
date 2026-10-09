import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

export function Modal({ title, onClose, children, wide }: { title: ReactNode; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#151D2D]/50 p-3 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" className={`page-enter max-h-[92dvh] w-full overflow-y-auto rounded-3xl bg-[#FBF9F3] shadow-2xl ${wide ? 'max-w-3xl' : 'max-w-lg'}`}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E8E5DC] bg-[#FBF9F3]/95 px-5 py-4 backdrop-blur">
          <div className="font-['Space_Grotesk'] text-lg font-semibold text-[#27314D]">{title}</div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full hover:bg-[#EFEBE1]"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
