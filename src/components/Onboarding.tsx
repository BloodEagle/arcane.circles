import { Circle, Sparkles, SlidersHorizontal, Share2, X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    icon: Sparkles,
    title: 'Choose an Archetype',
    body: 'Start from a narrative preset — Transmutation, Celestial, Binding, or Sacred Geometry — or press Invoke to conjure a random circle.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Shape the Circle',
    body: 'Add rings, polygons, axes, text incantations, and glyphs. Every property is tunable — the Grimoire panel explains what each part means.',
  },
  {
    icon: Share2,
    title: 'Save & Share',
    body: 'Export SVG or PNG, save designs locally, and share a link that loads your exact circle in anyone else\'s browser.',
  },
];

export default function Onboarding({ open, onClose }: Props) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 space-y-5"
        style={{ background: 'var(--c-panel)', border: '1px solid var(--c-border-hover)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{
              border: '2px solid var(--c-accent)',
              background: 'color-mix(in srgb, var(--c-accent) 12%, transparent)',
            }}
          >
            <Circle size={18} style={{ color: 'var(--c-accent)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold" style={{ color: 'var(--c-text)' }}>arcane.circles</h2>
            <p className="text-[11px]" style={{ color: 'var(--c-text-dim)' }}>Procedural sigil & circle engine</p>
          </div>
          <button onClick={onClose} className="p-1 rounded transition-colors shrink-0" style={{ color: 'var(--c-text-dim)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'var(--c-input-bg)', border: '1px solid var(--c-border)' }}
                >
                  <Icon size={15} style={{ color: 'var(--c-accent)' }} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-semibold" style={{ color: 'var(--c-text)' }}>{step.title}</h3>
                  <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: 'var(--c-text-muted)' }}>{step.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={onClose} className="btn-primary w-full">Begin</button>
      </div>
    </div>
  );
}
