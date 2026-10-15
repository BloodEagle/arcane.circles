import { useState, useRef, useEffect, useCallback } from 'react';
import { Info } from 'lucide-react';

interface Props {
  text: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ text, side = 'top' }: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const iconRef = useRef<HTMLSpanElement>(null);
  const id = useRef(`tt-${Math.random().toString(36).slice(2)}`);

  const calc = useCallback(() => {
    const el = iconRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const maxW = 240;
    let top = 0;
    let left = 0;
    if (side === 'top') {
      top = r.top - 8;
      left = r.left + r.width / 2 - maxW / 2;
    } else if (side === 'bottom') {
      top = r.bottom + 8;
      left = r.left + r.width / 2 - maxW / 2;
    } else if (side === 'right') {
      top = r.top + r.height / 2 - 40;
      left = r.right + 8;
    } else {
      top = r.top + r.height / 2 - 40;
      left = r.left - maxW - 8;
    }
    if (left < 4) left = 4;
    if (left + maxW > window.innerWidth - 4) left = window.innerWidth - maxW - 4;
    if (top < 4) top = 4;
    setPos({ top, left });
  }, [side]);

  useEffect(() => {
    if (open) calc();
  }, [open, calc]);

  return (
    <>
      <span
        ref={iconRef}
        className="inline-flex items-center cursor-help align-middle"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={e => { e.stopPropagation(); setOpen(v => !v); calc(); }}
      >
        <Info size={12} className="text-[var(--c-text-dim)] hover:text-[var(--c-accent)] transition-colors" />
      </span>
      {open && (
        <span
          id={id.current}
          className="fixed z-[9999] pointer-events-none"
          style={{ top: pos.top, left: pos.left, maxWidth: 240 }}
          role="tooltip"
        >
          <span
            className="block px-3 py-2 rounded-lg text-[11px] leading-relaxed shadow-xl"
            style={{
              background: 'var(--c-panel)',
              border: '1px solid var(--c-border-hover)',
              color: 'var(--c-text-muted)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}
          >
            {text}
          </span>
        </span>
      )}
    </>
  );
}
