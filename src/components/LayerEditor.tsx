import type { AnyLayer, RingLayer, PolygonLayer, AxisLayer, TextRingLayer, SpineLayer } from '@/esoteric/types';
import { GLYPH_LIST, glyphGroups } from '@/esoteric/glyphs';
import { LAYER_TOOLTIPS } from '@/esoteric/knowledge';
import { Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import Tooltip from './Tooltip';

interface Props {
  layer: AnyLayer;
  index: number;
  total: number;
  onChange: (updated: AnyLayer) => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
  isMobile?: boolean;
}

export default function LayerEditor({ layer, onChange, onDelete, onMove, isMobile = false }: Props) {
  const glyphGroupsMap = glyphGroups();

  const update = (patch: Partial<AnyLayer>) => onChange({ ...layer, ...patch } as AnyLayer);

  return (
    <div
      className="rounded-lg p-3 space-y-2.5"
      style={{ border: '1px solid var(--c-border)', background: 'var(--c-input-bg)' }}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={() => update({ visible: !layer.visible } as AnyLayer)}
          className="p-1 rounded transition-colors"
          style={{ color: 'var(--c-text-dim)' }}
          title={layer.visible ? 'Hide' : 'Show'}
        >
          {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
        <span
          className="text-xs font-mono uppercase tracking-wider flex-1 truncate"
          style={{ color: 'var(--c-text-muted)' }}
        >
          {layer.name}
        </span>
        <span
          className="text-[10px] font-mono px-1.5 py-0.5 rounded"
          style={{ background: 'var(--c-bg)', color: 'var(--c-text-dim)' }}
        >
          {layer.type}
        </span>
        <button onClick={() => onMove(-1)} className="p-1 rounded transition-colors" style={{ color: 'var(--c-text-dim)' }}><ChevronUp size={14} /></button>
        <button onClick={() => onMove(1)} className="p-1 rounded transition-colors" style={{ color: 'var(--c-text-dim)' }}><ChevronDown size={14} /></button>
        <button onClick={onDelete} className="p-1 rounded transition-colors" style={{ color: 'var(--c-text-dim)' }}><Trash2 size={14} /></button>
      </div>

      {layer.visible && (
        <div className="space-y-2 pl-6">
          <Field label="Name" tooltip={LAYER_TOOLTIPS.name}>
            <input type="text" value={layer.name} onChange={e => update({ name: e.target.value } as AnyLayer)} className="input-sm" />
          </Field>

          <Field label="Color" tooltip={LAYER_TOOLTIPS.color}>
            <div className="flex items-center gap-2">
              <input type="color" value={layer.color} onChange={e => update({ color: e.target.value } as AnyLayer)} className="w-8 h-8 rounded cursor-pointer bg-transparent" style={{ border: '1px solid var(--c-border)' }} />
              <input type="text" value={layer.color} onChange={e => update({ color: e.target.value } as AnyLayer)} className="input-sm flex-1 font-mono text-xs" />
            </div>
          </Field>

          <SliderField label="Opacity" tooltip={LAYER_TOOLTIPS.opacity} value={layer.opacity} min={0} max={1} step={0.05} onChange={v => update({ opacity: v } as AnyLayer)} format={v => `${Math.round(v * 100)}%`} isMobile={isMobile} />
          <SliderField label="Stroke Width" tooltip={LAYER_TOOLTIPS.strokeWidth} value={layer.strokeWidth} min={0.5} max={8} step={0.5} onChange={v => update({ strokeWidth: v } as AnyLayer)} format={v => v.toFixed(1)} isMobile={isMobile} />
          <SliderField label="Glow" tooltip={LAYER_TOOLTIPS.glow} value={layer.glow} min={0} max={15} step={0.5} onChange={v => update({ glow: v } as AnyLayer)} format={v => v.toFixed(1)} isMobile={isMobile} />

          {layer.type === 'ring' && <RingControls layer={layer as RingLayer} update={update} isMobile={isMobile} />}
          {layer.type === 'polygon' && <PolygonControls layer={layer as PolygonLayer} update={update} isMobile={isMobile} />}
          {layer.type === 'axis' && <AxisControls layer={layer as AxisLayer} update={update} isMobile={isMobile} />}
          {layer.type === 'textRing' && <TextRingControls layer={layer as TextRingLayer} update={update} isMobile={isMobile} />}
          {layer.type === 'spine' && <SpineControls layer={layer as SpineLayer} update={update} glyphGroupsMap={glyphGroupsMap} isMobile={isMobile} />}
        </div>
      )}
    </div>
  );
}

function RingControls({ layer, update, isMobile }: { layer: RingLayer; update: (p: Partial<AnyLayer>) => void; isMobile: boolean }) {
  return (
    <>
      <SliderField label="Radius" tooltip={LAYER_TOOLTIPS.radius} value={layer.radius} min={10} max={395} step={1} onChange={v => update({ radius: v } as AnyLayer)} isMobile={isMobile} />
      <Field label="Dash Pattern" tooltip={LAYER_TOOLTIPS.dashArray}>
        <select value={layer.dashArray} onChange={e => update({ dashArray: e.target.value } as AnyLayer)} className="input-sm">
          <option value="none">Solid</option>
          <option value="4 4">Dashed</option>
          <option value="2 4">Dotted</option>
          <option value="10 3">Long Dash</option>
          <option value="1 2">Fine Dots</option>
          <option value="8 4 2 4">Dash-Dot</option>
        </select>
      </Field>
      <Field label="Spacing" tooltip={LAYER_TOOLTIPS.spacingMode}>
        <select value={layer.spacingMode} onChange={e => update({ spacingMode: e.target.value as RingLayer['spacingMode'] } as AnyLayer)} className="input-sm">
          <option value="standard">Standard</option>
          <option value="phi">Golden Ratio (Phi)</option>
          <option value="fibonacci">Fibonacci</option>
        </select>
      </Field>
    </>
  );
}

function PolygonControls({ layer, update, isMobile }: { layer: PolygonLayer; update: (p: Partial<AnyLayer>) => void; isMobile: boolean }) {
  return (
    <>
      <SliderField label="Radius" tooltip={LAYER_TOOLTIPS.radius} value={layer.radius} min={10} max={395} step={1} onChange={v => update({ radius: v } as AnyLayer)} isMobile={isMobile} />
      <SliderField label="Sides" tooltip={LAYER_TOOLTIPS.sides} value={layer.sides} min={3} max={12} step={1} onChange={v => update({ sides: Math.round(v) } as AnyLayer)} format={v => String(Math.round(v))} isMobile={isMobile} />
      <SliderField label="Rotation" tooltip={LAYER_TOOLTIPS.rotation} value={layer.rotation} min={0} max={360} step={1} onChange={v => update({ rotation: v } as AnyLayer)} format={v => `${Math.round(v)}°`} isMobile={isMobile} />
    </>
  );
}

function AxisControls({ layer, update, isMobile }: { layer: AxisLayer; update: (p: Partial<AnyLayer>) => void; isMobile: boolean }) {
  return (
    <>
      <SliderField label="Count" tooltip={LAYER_TOOLTIPS.count} value={layer.count} min={2} max={24} step={1} onChange={v => update({ count: Math.round(v) } as AnyLayer)} format={v => String(Math.round(v))} isMobile={isMobile} />
      <SliderField label="Inner Radius" tooltip={LAYER_TOOLTIPS.innerRadius} value={layer.innerRadius} min={0} max={395} step={1} onChange={v => update({ innerRadius: v } as AnyLayer)} isMobile={isMobile} />
      <SliderField label="Outer Radius" tooltip={LAYER_TOOLTIPS.outerRadius} value={layer.outerRadius} min={10} max={395} step={1} onChange={v => update({ outerRadius: v } as AnyLayer)} isMobile={isMobile} />
    </>
  );
}

function TextRingControls({ layer, update, isMobile }: { layer: TextRingLayer; update: (p: Partial<AnyLayer>) => void; isMobile: boolean }) {
  return (
    <>
      <SliderField label="Radius" tooltip={LAYER_TOOLTIPS.radius} value={layer.radius} min={20} max={395} step={1} onChange={v => update({ radius: v } as AnyLayer)} isMobile={isMobile} />
      <SliderField label="Font Size" tooltip={LAYER_TOOLTIPS.fontSize} value={layer.fontSize} min={6} max={40} step={1} onChange={v => update({ fontSize: Math.round(v) } as AnyLayer)} format={v => `${Math.round(v)}px`} isMobile={isMobile} />
      <Field label="Text" tooltip={LAYER_TOOLTIPS.text}>
        <input type="text" value={layer.text} onChange={e => update({ text: e.target.value } as AnyLayer)} className="input-sm" placeholder="Enter incantation..." />
      </Field>
      <Field label="Direction" tooltip={LAYER_TOOLTIPS.direction}>
        <select value={layer.reverse ? 'reverse' : 'forward'} onChange={e => update({ reverse: e.target.value === 'reverse' } as AnyLayer)} className="input-sm">
          <option value="forward">Clockwise</option>
          <option value="reverse">Counter-Clockwise</option>
        </select>
      </Field>
    </>
  );
}

function SpineControls({ layer, update, glyphGroupsMap, isMobile }: { layer: SpineLayer; update: (p: Partial<AnyLayer>) => void; glyphGroupsMap: Record<string, typeof GLYPH_LIST>; isMobile: boolean }) {
  return (
    <>
      <SliderField label="Offset" tooltip={LAYER_TOOLTIPS.offset} value={layer.offset} min={-200} max={200} step={5} onChange={v => update({ offset: v } as AnyLayer)} isMobile={isMobile} />
      <SliderField label="Node Count" tooltip={LAYER_TOOLTIPS.nodeCount} value={layer.nodeCount} min={0} max={8} step={1} onChange={v => update({ nodeCount: Math.round(v) } as AnyLayer)} format={v => String(Math.round(v))} isMobile={isMobile} />
      <SliderField label="Node Radius" tooltip={LAYER_TOOLTIPS.nodeRadius} value={layer.nodeRadius} min={0} max={80} step={1} onChange={v => update({ nodeRadius: v } as AnyLayer)} isMobile={isMobile} />
      <Field label="Node Glyph" tooltip={LAYER_TOOLTIPS.nodeGlyph}>
        <select value={layer.nodeGlyph ?? ''} onChange={e => update({ nodeGlyph: e.target.value || null } as AnyLayer)} className="input-sm">
          <option value="">None</option>
          {Object.entries(glyphGroupsMap).map(([group, glyphs]) => (
            <optgroup key={group} label={group}>
              {glyphs.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </optgroup>
          ))}
        </select>
      </Field>
    </>
  );
}

function Field({ label, tooltip, children }: { label: string; tooltip?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-[11px] w-20 shrink-0 flex items-center gap-0.5" style={{ color: 'var(--c-text-dim)' }}>
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      {children}
    </div>
  );
}

function SliderField({ label, tooltip, value, min, max, step, onChange, format, isMobile }: {
  label: string; tooltip?: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; format?: (v: number) => string; isMobile: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className={`text-[11px] w-20 shrink-0 flex items-center gap-0.5 ${isMobile ? 'mobile-touch-target' : ''}`} style={{ color: 'var(--c-text-dim)' }}>
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className={`flex-1 cursor-pointer ${isMobile ? 'mobile-slider-thumb' : ''}`}
      />
      <span className={`font-mono w-10 text-right ${isMobile ? 'text-xs' : 'text-[10px]'}`} style={{ color: 'var(--c-text-muted)' }}>{format ? format(value) : value}</span>
    </div>
  );
}
