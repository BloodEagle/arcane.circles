import type { AnyLayer, GlyphPlacement, GlyphId } from './types';
import { genId } from './archetypes';
import { GLYPH_LIST } from './glyphs';

function hslToHex(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const INCANTATIONS = [
  'AS ABOVE SO BELOW', 'SOLVE ET COAGULA', 'IGNIS NATURA RENOVATUR INTEGRA',
  'LUX IN TENEBRIS', 'OMNIA VNV MEST', 'IN HOC SIGNO VINCES',
  'ABYSSVS ABYSSVM INVOCAT', 'VISITA INTERIORA TERRAE',
];

export function generateSigil(): { layers: AnyLayer[]; placements: GlyphPlacement[] } {
  const hue = Math.floor(Math.random() * 360);
  const col = (l: number, s = 0.75) => hslToHex(hue, s, l);
  const n = pick([4, 5, 6, 7, 8, 9, 12] as const);
  const layers: AnyLayer[] = [];

  layers.push({
    id: genId('ring'), name: 'Boundary', type: 'ring', color: col(0.65),
    opacity: 0.85, strokeWidth: 2, glow: 4, rotation: 0, visible: true,
    radius: 388, dashArray: 'none', spacingMode: 'standard',
  });

  if (Math.random() < 0.7) {
    layers.push({
      id: genId('ring'), name: 'Inner Ward', type: 'ring', color: col(0.55),
      opacity: 0.6, strokeWidth: 1, glow: 0, rotation: 0, visible: true,
      radius: 352, dashArray: pick(['4 4', '2 4', '10 3'] as const), spacingMode: 'standard',
    });
  }

  const polyR = 220 + Math.floor(Math.random() * 100);
  layers.push({
    id: genId('poly'), name: `${n}-gon`, type: 'polygon', color: col(0.7),
    opacity: 0.75, strokeWidth: 1.5, glow: 2, rotation: Math.random() < 0.5 ? 0 : 180 / n,
    visible: true, radius: polyR, sides: n,
  });

  if (Math.random() < 0.45) {
    layers.push({
      id: genId('poly'), name: `${n}-gon mirrored`, type: 'polygon', color: col(0.5),
      opacity: 0.45, strokeWidth: 1, glow: 0, rotation: 360 / (2 * n),
      visible: true, radius: Math.max(80, polyR - 60), sides: n,
    });
  }

  layers.push({
    id: genId('axis'), name: `${n} Spokes`, type: 'axis', color: col(0.6),
    opacity: 0.35, strokeWidth: 1, glow: 0, rotation: 0, visible: true,
    count: n, innerRadius: 120, outerRadius: 385,
  });

  if (Math.random() < 0.5) {
    layers.push({
      id: genId('text'), name: 'Incantation', type: 'textRing', color: col(0.75),
      opacity: 0.8, strokeWidth: 0, glow: 0, rotation: 0, visible: true,
      radius: 368, text: pick(INCANTATIONS), fontSize: 12 + Math.floor(Math.random() * 5),
      reverse: Math.random() < 0.25,
    });
  }

  const placements: GlyphPlacement[] = [
    { id: genId('g'), glyphId: pick(GLYPH_LIST).id as GlyphId, target: 'center', targetLayerId: null, size: 55 + Math.floor(Math.random() * 30) },
  ];
  if (Math.random() < 0.55) {
    placements.push({
      id: genId('g'),
      glyphId: pick(GLYPH_LIST).id as GlyphId,
      target: Math.random() < 0.5 ? 'vertices' : 'intersections',
      targetLayerId: null,
      size: 20 + Math.floor(Math.random() * 14),
    });
  }

  return { layers, placements };
}
