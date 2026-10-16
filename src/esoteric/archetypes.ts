import type { ArchetypePreset, AnyLayer, GlyphPlacement, GlyphId } from './types';

let uidCounter = 0;
export function genId(prefix = 'layer'): string {
  uidCounter += 1;
  return `${prefix}-${Date.now()}-${uidCounter}`;
}

function ring(
  radius: number,
  color: string,
  opts: Partial<{
    name: string; opacity: number; strokeWidth: number; glow: number;
    rotation: number; dashArray: string; spacingMode: 'standard' | 'phi' | 'fibonacci';
  }> = {}
): AnyLayer {
  return {
    id: genId('ring'), name: opts.name ?? `Ring ${radius}`, type: 'ring', color,
    opacity: opts.opacity ?? 0.8, strokeWidth: opts.strokeWidth ?? 1.5,
    glow: opts.glow ?? 0, rotation: 0, visible: true,
    radius, dashArray: opts.dashArray ?? 'none',
    spacingMode: opts.spacingMode ?? 'standard',
  };
}

function polygon(
  radius: number, sides: number, color: string,
  opts: Partial<{ name: string; opacity: number; strokeWidth: number; glow: number; rotation: number }> = {}
): AnyLayer {
  return {
    id: genId('poly'), name: opts.name ?? `${sides}-gon`, type: 'polygon', color,
    opacity: opts.opacity ?? 0.7, strokeWidth: opts.strokeWidth ?? 1.5,
    glow: opts.glow ?? 0, rotation: opts.rotation ?? 0, visible: true,
    radius, sides,
  };
}

function axis(
  count: number, innerRadius: number, outerRadius: number, color: string,
  opts: Partial<{ name: string; opacity: number; strokeWidth: number; glow: number }> = {}
): AnyLayer {
  return {
    id: genId('axis'), name: opts.name ?? `${count} Axes`, type: 'axis', color,
    opacity: opts.opacity ?? 0.5, strokeWidth: opts.strokeWidth ?? 1,
    glow: opts.glow ?? 0, rotation: 0, visible: true,
    count, innerRadius, outerRadius,
  };
}

function textRing(
  radius: number, text: string, color: string,
  opts: Partial<{ name: string; fontSize: number; reverse: boolean; opacity: number; glow: number }> = {}
): AnyLayer {
  return {
    id: genId('text'), name: opts.name ?? 'Text Ring', type: 'textRing', color,
    opacity: opts.opacity ?? 0.85, strokeWidth: 0, glow: opts.glow ?? 0,
    rotation: 0, visible: true,
    radius, text, fontSize: opts.fontSize ?? 14, reverse: opts.reverse ?? false,
  };
}

function spine(
  offset: number, nodeCount: number, color: string,
  opts: Partial<{ name: string; nodeRadius: number; nodeGlyph: GlyphId | null; opacity: number }> = {}
): AnyLayer {
  return {
    id: genId('spine'), name: opts.name ?? 'Center Spine', type: 'spine', color,
    opacity: opts.opacity ?? 0.6, strokeWidth: 1.5, glow: 0, rotation: 0, visible: true,
    offset, nodeCount, nodeRadius: opts.nodeRadius ?? 20, nodeGlyph: opts.nodeGlyph ?? null,
  };
}

export const ARCHETYPES: ArchetypePreset[] = [
  {
    id: 'transmutation',
    name: 'Transmutation & Change',
    description: 'Interlocking triangles, three concentric rings (Sulfur, Mercury, Salt), sulfur-yellow glow.',
    layers: [
      ring(380, '#F59E0B', { name: 'Outer Sulfur Ring', strokeWidth: 2, glow: 6, dashArray: '8 4' }),
      ring(320, '#FCD34D', { name: 'Mercury Ring', strokeWidth: 1.5, glow: 3 }),
      ring(260, '#FDE68A', { name: 'Salt Ring', strokeWidth: 1, dashArray: '2 4' }),
      polygon(320, 3, '#FBBF24', { name: 'Upward Triangle (Sulfur)', rotation: -90, glow: 4 }),
      polygon(260, 3, '#F59E0B', { name: 'Downward Triangle (Salt)', rotation: 90, glow: 4 }),
      polygon(290, 6, '#FCD34D', { name: 'Hexagram (Quaternary)', opacity: 0.4, rotation: 0 }),
      axis(6, 260, 380, '#FBBF24', { name: 'Mercury/Sulfur Axes', opacity: 0.3 }),
      ring(120, '#FDE68A', { name: 'Core Ring', strokeWidth: 1 }),
      spine(80, 2, '#F59E0B', { name: 'Spine Anchors', nodeRadius: 28, nodeGlyph: 'mercury' }),
    ],
    glyphPlacements: [
      { id: genId('g'), glyphId: 'sulfur', target: 'center', targetLayerId: null, size: 70 },
      { id: genId('g'), glyphId: 'mercury', target: 'intersections', targetLayerId: null, size: 28 },
    ],
  },
  {
    id: 'celestial',
    name: 'Celestial & Astrological Alignment',
    description: 'Central solar core, 12 radiating house axes, Zodiac text ring, starlight silver-blue.',
    layers: [
      ring(390, '#94A3B8', { name: 'Celestial Boundary', strokeWidth: 2, glow: 4 }),
      ring(350, '#CBD5E1', { name: 'House Ring', strokeWidth: 1, dashArray: '4 4' }),
      ring(300, '#94A3B8', { name: 'Inner Sphere', strokeWidth: 0.8, opacity: 0.5 }),
      axis(12, 300, 390, '#CBD5E1', { name: '12 House Axes', opacity: 0.4 }),
      textRing(365, 'ARIES TAURUS GEMINI CANCER LEO VIRGO LIBRA SCORPIO SAGITTARIUS CAPRICORN AQUARIUS PISCES', '#E2E8F0', { name: 'Zodiac Ring', fontSize: 13 }),
      polygon(150, 12, '#94A3B8', { name: 'Inner Dodecagon', opacity: 0.3 }),
      ring(80, '#E2E8F0', { name: 'Solar Core Ring', strokeWidth: 1.5, glow: 8 }),
      spine(100, 1, '#CBD5E1', { name: 'Celestial Spine', nodeRadius: 0, nodeGlyph: null }),
    ],
    glyphPlacements: [
      { id: genId('g'), glyphId: 'sun', target: 'center', targetLayerId: null, size: 80 },
    ],
  },
  {
    id: 'binding',
    name: 'Binding & Containment',
    description: 'Heavy outer octagon, tight concentric boundary rings, compressed radial spokes, iron-crimson.',
    layers: [
      ring(395, '#991B1B', { name: 'Outer Containment', strokeWidth: 3, glow: 3 }),
      polygon(390, 8, '#B91C1C', { name: 'Binding Octagon', strokeWidth: 2.5, glow: 2 }),
      ring(370, '#DC2626', { name: 'Seal Ring', strokeWidth: 1.5 }),
      ring(350, '#991B1B', { name: 'Ward Ring', strokeWidth: 1, dashArray: '10 3' }),
      ring(320, '#7F1D1D', { name: 'Inner Ward', strokeWidth: 1.5 }),
      ring(280, '#B91C1C', { name: 'Compression Ring', strokeWidth: 0.8, opacity: 0.5 }),
      axis(8, 280, 390, '#DC2626', { name: 'Binding Spokes', opacity: 0.35, strokeWidth: 1.5 }),
      polygon(280, 8, '#991B1B', { name: 'Inner Octagon', rotation: 22.5, opacity: 0.4 }),
      ring(100, '#DC2626', { name: 'Core Bind', strokeWidth: 2 }),
    ],
    glyphPlacements: [
      { id: genId('g'), glyphId: 'earth', target: 'vertices', targetLayerId: null, size: 32 },
    ],
  },
  {
    id: 'sacredGeometry',
    name: 'Sacred Geometric Resonance',
    description: 'Nested phi-proportional rings, golden-ratio spacing, flower-of-life matrix, glowing emerald cyan.',
    layers: [
      ring(390, '#10B981', { name: 'Phi Ring 1', strokeWidth: 1.5, glow: 6, spacingMode: 'phi' }),
      ring(240, '#14B8A6', { name: 'Phi Ring 2', strokeWidth: 1, glow: 4, spacingMode: 'phi' }),
      ring(148, '#06B6D4', { name: 'Phi Ring 3', strokeWidth: 0.8, glow: 3, spacingMode: 'phi' }),
      ring(91, '#22D3EE', { name: 'Phi Ring 4', strokeWidth: 0.6, glow: 2, spacingMode: 'phi' }),
      ring(56, '#67E8F9', { name: 'Phi Ring 5', strokeWidth: 0.5, glow: 2, spacingMode: 'phi' }),
      polygon(240, 6, '#10B981', { name: 'Flower Hexagon', opacity: 0.3 }),
      polygon(148, 6, '#14B8A6', { name: 'Inner Hexagon', rotation: 30, opacity: 0.3 }),
      polygon(91, 6, '#06B6D4', { name: 'Core Hexagon', rotation: 0, opacity: 0.3 }),
      axis(6, 56, 390, '#2DD4BF', { name: 'Resonance Axes', opacity: 0.2, strokeWidth: 0.8 }),
      ring(30, '#67E8F9', { name: 'Seed Core', strokeWidth: 1, glow: 8 }),
    ],
    glyphPlacements: [
      { id: genId('g'), glyphId: 'salt', target: 'center', targetLayerId: null, size: 50 },
    ],
  },
];

export function clonePreset(preset: ArchetypePreset): { layers: AnyLayer[]; glyphPlacements: GlyphPlacement[] } {
  return {
    layers: preset.layers.map(l => ({ ...l, id: genId(l.type) })),
    glyphPlacements: preset.glyphPlacements.map(g => ({ ...g, id: genId('g') })),
  };
}
