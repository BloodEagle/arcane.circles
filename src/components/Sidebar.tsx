import type { AnyLayer, GlyphPlacement, PlacementTarget, GlyphId } from '@/esoteric/types';
import { ARCHETYPES, clonePreset, genId } from '@/esoteric/archetypes';
import { GLYPH_LIST, glyphGroups } from '@/esoteric/glyphs';
import { createLayer } from '@/esoteric/svgUtils';
import { ARCHETYPE_LORE, PLACEMENT_TOOLTIPS, EXPORT_TOOLTIPS, LAYER_TYPE_LORE, GLYPH_LORE } from '@/esoteric/knowledge';
import LayerEditor from './LayerEditor';
import Tooltip from './Tooltip';
import { Plus, Trash2, Download, FileImage, Sparkles } from 'lucide-react';

interface Props {
  layers: AnyLayer[];
  placements: GlyphPlacement[];
  onLayersChange: (layers: AnyLayer[]) => void;
  onPlacementsChange: (p: GlyphPlacement[]) => void;
  onExportSvg: () => void;
  onExportPng: () => void;
  onApplyPreset: (id: string) => void;
}

const ADD_LAYER_OPTIONS: { label: string; type: AnyLayer['type']; tooltipKey: string }[] = [
  { label: 'Ring', type: 'ring', tooltipKey: 'ring' },
  { label: 'Polygon', type: 'polygon', tooltipKey: 'polygon' },
  { label: 'Axis / Spokes', type: 'axis', tooltipKey: 'axis' },
  { label: 'Text Ring', type: 'textRing', tooltipKey: 'textRing' },
  { label: 'Center Spine', type: 'spine', tooltipKey: 'spine' },
];

export default function Sidebar({ layers, placements, onLayersChange, onPlacementsChange, onExportSvg, onExportPng, onApplyPreset }: Props) {
  const glyphGroupsMap = glyphGroups();

  const applyPreset = (presetId: string) => {
    onApplyPreset(presetId);
  };

  const addLayer = (type: AnyLayer['type']) => {
    onLayersChange([...layers, createLayer(type)]);
  };

  const updateLayer = (index: number, updated: AnyLayer) => {
    const next = [...layers];
    next[index] = updated;
    onLayersChange(next);
  };

  const deleteLayer = (index: number) => {
    onLayersChange(layers.filter((_, i) => i !== index));
  };

  const moveLayer = (index: number, dir: -1 | 1) => {
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= layers.length) return;
    const next = [...layers];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    onLayersChange(next);
  };

  const addPlacement = () => {
    onPlacementsChange([...placements, { id: genId('g'), glyphId: 'sun', target: 'center', targetLayerId: null, size: 60 }]);
  };

  const updatePlacement = (index: number, patch: Partial<GlyphPlacement>) => {
    const next = [...placements];
    next[index] = { ...next[index], ...patch };
    onPlacementsChange(next);
  };

  const deletePlacement = (index: number) => {
    onPlacementsChange(placements.filter((_, i) => i !== index));
  };

  const polygonLayers = layers.filter(l => l.type === 'polygon');
  const axisLayers = layers.filter(l => l.type === 'axis');

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-5">
        <Section title="Narrative Archetype" icon={<Sparkles size={14} />}>
          <div className="flex items-center gap-1">
            <select
              onChange={e => { applyPreset(e.target.value); e.target.value = ''; }}
              defaultValue=""
              className="input-base"
            >
              <option value="" disabled>Select a preset...</option>
              {ARCHETYPES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <Tooltip text="Choosing a preset replaces all current layers and glyphs with a pre-configured thematic layout. Each archetype sets its own geometry, colors, and glyph placements." />
          </div>
          <p className="text-[11px] leading-relaxed mt-1.5" style={{ color: 'var(--c-text-dim)' }}>
            Each preset sweeps all layers and glyphs to a thematic layout.
          </p>
        </Section>

        <Section title="Glyph Injector">
          <div className="space-y-2">
            {placements.map((p, i) => (
              <div key={p.id} className="rounded-lg p-2.5 space-y-2" style={{ border: '1px solid var(--c-border)', background: 'var(--c-input-bg)' }}>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 flex-1">
                    <select value={p.glyphId} onChange={e => updatePlacement(i, { glyphId: e.target.value as GlyphId })} className="input-sm flex-1">
                      {Object.entries(glyphGroupsMap).map(([group, glyphs]) => (
                        <optgroup key={group} label={group}>
                          {glyphs.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </optgroup>
                      ))}
                    </select>
                    <Tooltip text={GLYPH_LORE[p.glyphId].body} />
                  </div>
                  <button onClick={() => deletePlacement(i)} className="p-1 rounded transition-colors" style={{ color: 'var(--c-text-dim)' }}><Trash2 size={13} /></button>
                </div>
                <FieldRow label="Place" tooltip={PLACEMENT_TOOLTIPS[p.target]}>
                  <select value={p.target} onChange={e => updatePlacement(i, { target: e.target.value as PlacementTarget })} className="input-sm flex-1">
                    <option value="center">Target Center</option>
                    <option value="vertices">Target Vertices</option>
                    <option value="intersections">Target Intersections</option>
                  </select>
                </FieldRow>
                {p.target === 'vertices' && (
                  <FieldRow label="On" tooltip={PLACEMENT_TOOLTIPS.targetLayer}>
                    <select value={p.targetLayerId ?? ''} onChange={e => updatePlacement(i, { targetLayerId: e.target.value || null })} className="input-sm flex-1">
                      <option value="">Auto (first polygon)</option>
                      {polygonLayers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </FieldRow>
                )}
                {p.target === 'intersections' && (
                  <FieldRow label="Axis" tooltip={PLACEMENT_TOOLTIPS.targetLayer}>
                    <select value={p.targetLayerId ?? ''} onChange={e => updatePlacement(i, { targetLayerId: e.target.value || null })} className="input-sm flex-1">
                      <option value="">Auto (first axis)</option>
                      {axisLayers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </FieldRow>
                )}
                <FieldRow label="Size" tooltip={PLACEMENT_TOOLTIPS.size}>
                  <input type="range" min={12} max={120} step={2} value={p.size} onChange={e => updatePlacement(i, { size: parseInt(e.target.value) })} className="flex-1 cursor-pointer" />
                  <span className="text-[10px] font-mono w-8 text-right" style={{ color: 'var(--c-text-muted)' }}>{p.size}</span>
                </FieldRow>
              </div>
            ))}
            <button onClick={addPlacement} className="btn-secondary w-full"><Plus size={14} /> Add Glyph</button>
          </div>
        </Section>

        <Section title="Layer Manager">
          <div className="space-y-2">
            {layers.map((layer, i) => (
              <LayerEditor
                key={layer.id}
                layer={layer}
                index={i}
                total={layers.length}
                onChange={updated => updateLayer(i, updated)}
                onDelete={() => deleteLayer(i)}
                onMove={dir => moveLayer(i, dir)}
              />
            ))}
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {ADD_LAYER_OPTIONS.map(opt => (
              <div key={opt.type} className="flex items-center gap-0.5">
                <button
                  onClick={() => addLayer(opt.type)}
                  className="px-2.5 py-1.5 text-[11px] rounded-md transition-colors flex items-center gap-1"
                  style={{
                    background: 'var(--c-input-bg)',
                    border: '1px solid var(--c-border)',
                    color: 'var(--c-text-muted)',
                  }}
                >
                  <Plus size={11} /> {opt.label}
                </button>
                <Tooltip text={LAYER_TYPE_LORE[opt.tooltipKey].body} />
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="p-3 flex gap-2" style={{ borderTop: '1px solid var(--c-border)', background: 'var(--c-panel)' }}>
        <div className="flex items-center gap-0.5 flex-1">
          <button onClick={onExportSvg} className="btn-primary flex-1"><Download size={14} /> Export SVG</button>
          <Tooltip text={EXPORT_TOOLTIPS.svg} />
        </div>
        <div className="flex items-center gap-0.5 flex-1">
          <button onClick={onExportPng} className="btn-secondary flex-1"><FileImage size={14} /> Export PNG</button>
          <Tooltip text={EXPORT_TOOLTIPS.png} />
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--c-text-muted)' }}>
        {icon}{title}
      </h3>
      {children}
    </div>
  );
}

function FieldRow({ label, tooltip, children }: { label: string; tooltip?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-[11px] w-16 shrink-0 flex items-center gap-0.5" style={{ color: 'var(--c-text-dim)' }}>
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      {children}
    </div>
  );
}
