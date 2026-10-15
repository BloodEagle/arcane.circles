import { useState, useMemo } from 'react';
import { GRIMOIRE_SECTIONS, type KnowledgeSection } from '@/esoteric/knowledge';
import { Search, ChevronDown, X, BookOpen } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onArchetypeSelect?: (id: string) => void;
}

const ARCHETYPE_IDS = ['transmutation', 'celestial', 'binding', 'sacredGeometry'];
const ARCHETYPE_LABELS: Record<string, string> = {
  transmutation: 'Transmutation & Change',
  celestial: 'Celestial & Astrological Alignment',
  binding: 'Binding & Containment',
  sacredGeometry: 'Sacred Geometric Resonance',
};

export default function GrimoirePanel({ open, onClose, onArchetypeSelect }: Props) {
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    if (!query.trim()) return GRIMOIRE_SECTIONS;
    const q = query.toLowerCase();
    return GRIMOIRE_SECTIONS.map((s: KnowledgeSection) => ({
      ...s,
      entries: s.entries.filter(
        e => e.title.toLowerCase().includes(q) || e.body.toLowerCase().includes(q)
      ),
    })).filter(s => s.entries.length > 0);
  }, [query]);

  const toggle = (id: string) =>
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 transition-opacity"
          onClick={onClose}
          style={{ background: 'rgba(0,0,0,0.5)' }}
        />
      )}
      <div
        className="fixed top-0 right-0 h-full w-[420px] z-50 flex flex-col transition-transform duration-300 ease-out"
        style={{
          background: 'var(--c-panel)',
          borderLeft: '1px solid var(--c-border)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div
          className="flex items-center gap-2 px-4 py-3 shrink-0"
          style={{ borderBottom: '1px solid var(--c-border)' }}
        >
          <BookOpen size={16} style={{ color: 'var(--c-accent)' }} />
          <h2 className="text-sm font-semibold flex-1" style={{ color: 'var(--c-text)' }}>
            Grimoire
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded transition-colors"
            style={{ color: 'var(--c-text-dim)' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-4 py-3 shrink-0">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--c-text-dim)' }}
            />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search the grimoire..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-md transition-colors focus:outline-none"
              style={{
                background: 'var(--c-input-bg)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-text)',
              }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scroll px-4 pb-6 space-y-2">
          {filtered.length === 0 && (
            <p className="text-xs text-center mt-8" style={{ color: 'var(--c-text-dim)' }}>
              No entries found.
            </p>
          )}
          {filtered.map(section => {
            const isCollapsed = collapsed[section.id];
            return (
              <div key={section.id} className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--c-border)' }}>
                <button
                  onClick={() => toggle(section.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors"
                  style={{ background: 'var(--c-input-bg)' }}
                >
                  <ChevronDown
                    size={14}
                    className="transition-transform shrink-0"
                    style={{
                      color: 'var(--c-text-muted)',
                      transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                    }}
                  />
                  <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--c-text-muted)' }}
                  >
                    {section.label}
                  </span>
                  <span
                    className="ml-auto text-[10px] font-mono"
                    style={{ color: 'var(--c-text-dim)' }}
                  >
                    {section.entries.length}
                  </span>
                </button>
                {!isCollapsed && (
                  <div className="px-3 py-2 space-y-2">
                    {section.entries.map((entry, i) => {
                      const archId = ARCHETYPE_IDS.find(
                        id => ARCHETYPE_LABELS[id] === entry.title
                      );
                      return (
                        <div key={i} className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4
                              className="text-xs font-medium"
                              style={{ color: 'var(--c-text)' }}
                            >
                              {entry.title}
                            </h4>
                            {archId && onArchetypeSelect && (
                              <button
                                onClick={() => {
                                  onArchetypeSelect(archId);
                                  onClose();
                                }}
                                className="text-[10px] px-1.5 py-0.5 rounded transition-colors"
                                style={{
                                  background: 'var(--c-accent)',
                                  color: 'var(--c-bg)',
                                }}
                              >
                                Apply
                              </button>
                            )}
                          </div>
                          <p
                            className="text-[11px] leading-relaxed"
                            style={{ color: 'var(--c-text-muted)' }}
                          >
                            {entry.body}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
