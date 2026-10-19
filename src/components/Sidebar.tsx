import type { AnyLayer, GlyphPlacement, PlacementTarget, GlyphId } from '@/esoteric/types';
import { ARCHETYPES, genId } from '@/esoteric/archetypes';
import { glyphGroups } from '@/esoteric/glyphs';
import { createLayer } from '@/esoteric/svgUtils';
import { PLACEMENT_TOOLTIPS, EXPORT_TOOLTIPS, LAYER_TYPE_LORE, GLYPH_LORE, LAYER_TYPE_ICONS, ARCHETYPE_ICONS } from '@/esoteric/knowledge';
import LayerEditor from './LayerEditor';
import Tooltip from './Tooltip';
import { Plus, Trash2, Download, FileImage, Sparkles, Save, FolderOpen, Upload, X, Circle, LucideIcon } from 'lucide-react';
import { useDesignStorage, type SavedDesign } from '@/hooks/useDesignStorage';
import { useState, useRef } from 'react';

interface Props {
  layers: AnyLayer[];
  placements: GlyphPlacement[];
  onLayersChange: (layers: AnyLayer[]) => void;
  onPlacementsChange: (p: GlyphPlacement[]) => void;
  onExportSvg: () => void;
  onExportPng: () => void;
  onApplyPreset: (id: string) => void;
  globalRotation: number;
  onGlobalRotationChange: (deg: number) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const ADD_LAYER_OPTIONS: { label: string; type: AnyLayer['type']; tooltipKey: string; icon: LucideIcon }[] = [
  { label: 'Ring', type: 'ring', tooltipKey: 'ring', icon: LAYER_TYPE_ICONS.ring },
  { label: 'Polygon', type: 'polygon', tooltipKey: 'polygon', icon: LAYER_TYPE_ICONS.polygon },
  { label: 'Axis / Spokes', type: 'axis', tooltipKey: 'axis', icon: LAYER_TYPE_ICONS.axis },
  { label: 'Text Ring', type: 'textRing', tooltipKey: 'textRing', icon: LAYER_TYPE_ICONS.textRing },
  { label: 'Center Spine', type: 'spine', tooltipKey: 'spine', icon: LAYER_TYPE_ICONS.spine },
];

export default function Sidebar({ layers, placements, onLayersChange, onPlacementsChange, onExportSvg, onExportPng, onApplyPreset, globalRotation, onGlobalRotationChange, onClose, isMobile = false }: Props) {
  const glyphGroupsMap = glyphGroups();
  const {
    savedDesigns,
    saveDesign,
    deleteDesign,
    exportDesign,
    importDesign,
  } = useDesignStorage();

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyPreset = (presetId: string) => {
    onApplyPreset(presetId);
  };

  const handleSave = () => {
    if (saveName.trim()) {
      saveDesign(saveName, layers, placements, 'grimoire');
      setSaveName('');
      setSaveDialogOpen(false);
    }
  };

  const handleLoad = (design: SavedDesign) => {
    onLayersChange(design.layers);
    onPlacementsChange(design.placements);
    setLoadDialogOpen(false);
    if (onClose) onClose();
  };

  const handleDelete = (id: string) => {
    deleteDesign(id);
  };

  const handleExport = (design: SavedDesign) => {
    exportDesign(design);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const design = await importDesign(file);
        onLayersChange(design.layers);
        onPlacementsChange(design.placements);
        if (onClose) onClose();
      } catch (err) {
        console.error('Failed to import design:', err);
        alert('Failed to import design. Please check the file format.');
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      {isMobile && (
        <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: '1px solid var(--c-border)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>Editor</h3>
          <button onClick={onClose} className="p-1 rounded transition-colors" style={{ color: 'var(--c-text-dim)' }}>
            <X size={18} />
          </button>
        </div>
      )}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scroll p-4 space-y-5">
        <Section title="Narrative Archetype" icon={<Sparkles size={14} />} highlighted={true}>
          <div className="flex items-center gap-1">
            <select
              onChange={e => { applyPreset(e.target.value); e.target.value = ''; }}
              defaultValue=""
              className="input-base"
            >
              <option value="" disabled>Select a preset...</option>
              {ARCHETYPES.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <Tooltip text="Choosing a preset replaces all current layers and glyphs with a pre-configured thematic layout. Each archetype sets its own geometry, colors, and glyph placements." />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {ARCHETYPES.map(p => {
              const IconComponent = ARCHETYPE_ICONS[p.id as keyof typeof ARCHETYPE_ICONS] as LucideIcon;
              return (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className="p-2 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    border: '1px solid var(--c-accent-border)',
                    background: 'var(--c-input-bg)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <IconComponent size={18} style={{ color: 'var(--c-accent)' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--c-text)' }}>
                      {p.name.split(' ')[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--c-text-dim)' }}>
            Each preset sweeps all layers and glyphs to a thematic layout.
          </p>
        </Section>

        <Section title="Canvas" icon={<Circle size={14} />}>
          <FieldRow label="Rotation" tooltip="Rotates the entire sigil — every layer and glyph — around the canvas center. Baked into SVG/PNG exports." isMobile={isMobile}>
            <input
              type="range" min={0} max={360} step={1} value={globalRotation}
              onChange={e => onGlobalRotationChange(parseFloat(e.target.value))}
              className={`flex-1 cursor-pointer ${isMobile ? 'mobile-slider-thumb' : ''}`}
            />
            <span className={`font-mono w-10 text-right ${isMobile ? 'text-xs' : 'text-[10px]'}`} style={{ color: 'var(--c-text-muted)' }}>{Math.round(globalRotation)}°</span>
          </FieldRow>
        </Section>

        <Section title="Saved Designs" icon={<FolderOpen size={14} />}>
          <div className="flex gap-1.5 mb-2">
            <button onClick={() => setSaveDialogOpen(true)} className="btn-secondary flex-1"><Save size={14} /> Save</button>
            <button onClick={() => setLoadDialogOpen(true)} className="btn-secondary flex-1"><FolderOpen size={14} /> Load</button>
            <button onClick={() => fileInputRef.current?.click()} className="btn-secondary flex-1"><Upload size={14} /> Import</button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          {saveDialogOpen && (
            <div className="rounded-lg p-3 space-y-2" style={{ border: '1px solid var(--c-border)', background: 'var(--c-input-bg)' }}>
              <input
                type="text"
                value={saveName}
                onChange={e => setSaveName(e.target.value)}
                placeholder="Design name..."
                className="input-sm"
                autoFocus
              />
              <div className="flex gap-1.5">
                <button onClick={handleSave} className="btn-primary flex-1">Save</button>
                <button onClick={() => { setSaveDialogOpen(false); setSaveName(''); }} className="btn-secondary flex-1">Cancel</button>
              </div>
            </div>
          )}
          {loadDialogOpen && (
            <div className="rounded-lg p-2 space-y-1.5 max-h-48 overflow-y-auto custom-scroll" style={{ border: '1px solid var(--c-border)', background: 'var(--c-input-bg)' }}>
              {savedDesigns.length === 0 ? (
                <p className="text-xs text-center py-4" style={{ color: 'var(--c-text-dim)' }}>No saved designs</p>
              ) : (
                savedDesigns.map(design => (
                  <div key={design.id} className="flex items-center gap-2 p-2 rounded" style={{ background: 'var(--c-bg)' }}>
                    <button onClick={() => handleLoad(design)} className="flex-1 text-left text-xs truncate" style={{ color: 'var(--c-text)' }}>
                      {design.name}
                    </button>
                    <button onClick={() => handleExport(design)} className="p-1 rounded transition-colors" style={{ color: 'var(--c-text-dim)' }} title="Export">
                      <Download size={12} />
                    </button>
                    <button onClick={() => handleDelete(design.id)} className="p-1 rounded transition-colors" style={{ color: 'var(--c-danger)' }} title="Delete">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
              )}
              <button onClick={() => setLoadDialogOpen(false)} className="btn-secondary w-full mt-2">Close</button>
            </div>
          )}
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
                <FieldRow label="Place" tooltip={PLACEMENT_TOOLTIPS[p.target]} isMobile={isMobile}>
                  <select value={p.target} onChange={e => updatePlacement(i, { target: e.target.value as PlacementTarget })} className="input-sm flex-1">
                    <option value="center">Target Center</option>
                    <option value="vertices">Target Vertices</option>
                    <option value="intersections">Target Intersections</option>
                  </select>
                </FieldRow>
                {p.target === 'vertices' && (
                  <FieldRow label="On" tooltip={PLACEMENT_TOOLTIPS.targetLayer} isMobile={isMobile}>
                    <select value={p.targetLayerId ?? ''} onChange={e => updatePlacement(i, { targetLayerId: e.target.value || null })} className="input-sm flex-1">
                      <option value="">Auto (first polygon)</option>
                      {polygonLayers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </FieldRow>
                )}
                {p.target === 'intersections' && (
                  <FieldRow label="Axis" tooltip={PLACEMENT_TOOLTIPS.targetLayer} isMobile={isMobile}>
                    <select value={p.targetLayerId ?? ''} onChange={e => updatePlacement(i, { targetLayerId: e.target.value || null })} className="input-sm flex-1">
                      <option value="">Auto (first axis)</option>
                      {axisLayers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </FieldRow>
                )}
                <FieldRow label="Size" tooltip={PLACEMENT_TOOLTIPS.size} isMobile={isMobile}>
                  <input type="range" min={12} max={120} step={2} value={p.size} onChange={e => updatePlacement(i, { size: parseInt(e.target.value) })} className={`flex-1 cursor-pointer ${isMobile ? 'mobile-slider-thumb' : ''}`} />
                  <span className={`font-mono w-8 text-right ${isMobile ? 'text-xs' : 'text-[10px]'}`} style={{ color: 'var(--c-text-muted)' }}>{p.size}</span>
                </FieldRow>
                <FieldRow label="Rotate" tooltip={PLACEMENT_TOOLTIPS.rotation} isMobile={isMobile}>
                  <input type="range" min={0} max={360} step={1} value={p.rotation ?? 0} onChange={e => updatePlacement(i, { rotation: parseFloat(e.target.value) })} className={`flex-1 cursor-pointer ${isMobile ? 'mobile-slider-thumb' : ''}`} />
                  <span className={`font-mono w-8 text-right ${isMobile ? 'text-xs' : 'text-[10px]'}`} style={{ color: 'var(--c-text-muted)' }}>{Math.round(p.rotation ?? 0)}°</span>
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
                isMobile={isMobile}
              />
            ))}
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {ADD_LAYER_OPTIONS.map(opt => {
              const IconComponent = opt.icon;
              return (
                <div key={opt.type} className="flex items-center gap-0.5">
                  <button
                    onClick={() => addLayer(opt.type)}
                    className="px-2.5 py-1.5 text-[11px] rounded-md transition-colors flex items-center gap-1.5"
                    style={{
                      background: 'var(--c-input-bg)',
                      border: '1px solid var(--c-border)',
                      color: 'var(--c-text-muted)',
                    }}
                  >
                    <IconComponent size={12} style={{ color: 'var(--c-accent)' }} />
                    {opt.label}
                  </button>
                  <Tooltip text={LAYER_TYPE_LORE[opt.tooltipKey].body} />
                </div>
              );
            })}
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

function Section({ title, icon, children, highlighted = false }: { title: string; icon?: React.ReactNode; children: React.ReactNode; highlighted?: boolean }) {
  return (
    <div className={`space-y-2 ${highlighted ? 'p-3 rounded-lg' : ''}`} style={highlighted ? { border: '1px solid var(--c-accent-border)', background: 'var(--c-accent-ring)' } : {}}>
      <h3 className={`font-semibold uppercase tracking-wider flex items-center gap-1.5 ${highlighted ? 'text-sm' : 'text-xs'}`} style={{ color: highlighted ? 'var(--c-accent)' : 'var(--c-text-muted)' }}>
        {icon}{title}
      </h3>
      {children}
    </div>
  );
}

function FieldRow({ label, tooltip, children, isMobile = false }: { label: string; tooltip?: string; children: React.ReactNode; isMobile?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <label className={`text-[11px] w-16 shrink-0 flex items-center gap-0.5 ${isMobile ? 'mobile-touch-target' : ''}`} style={{ color: 'var(--c-text-dim)' }}>
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      {children}
    </div>
  );
}
