import type { AnyLayer, PolygonLayer, AxisLayer, RingLayer, TextRingLayer, SpineLayer, GlyphPlacement, GlyphId } from './types';
import { CENTER, CANVAS_SIZE } from './types';
import { GLYPHS } from './glyphs';
import { genId } from './archetypes';

const PHI = 1.61803398875;

export function polarToXY(angle: number, radius: number): { x: number; y: number } {
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

export function polygonVertices(radius: number, sides: number, rotationDeg = 0): { x: number; y: number }[] {
  const verts: { x: number; y: number }[] = [];
  const rotRad = (rotationDeg * Math.PI) / 180;
  for (let i = 0; i < sides; i++) {
    const angle = rotRad + (i * 2 * Math.PI) / sides - Math.PI / 2;
    verts.push(polarToXY(angle, radius));
  }
  return verts;
}

function filterDef(id: string, glow: number): string {
  if (glow <= 0) return '';
  return `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${glow}" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
}

export function arcPath(radius: number, startAngleDeg = 0, sweep = 360): string {
  const start = polarToXY((startAngleDeg * Math.PI) / 180 - Math.PI / 2, radius);
  const end = polarToXY(((startAngleDeg + sweep - 0.001) * Math.PI) / 180 - Math.PI / 2, radius);
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export function fullCirclePath(radius: number): string {
  const r = Math.max(1, radius);
  return `M ${CENTER - r} ${CENTER} A ${r} ${r} 0 1 0 ${CENTER + r} ${CENTER} A ${r} ${r} 0 1 0 ${CENTER - r} ${CENTER}`;
}

export function renderLayer(layer: AnyLayer, filterDefs: Map<string, string>): string {
  if (!layer.visible) return '';
  const filterId = `glow-${layer.id}`;
  let filterAttr = '';
  if (layer.glow > 0) {
    filterDefs.set(filterId, filterDef(filterId, layer.glow));
    filterAttr = ` filter="url(#${filterId})"`;
  }
  const opacity = layer.opacity;
  const color = layer.color;

  switch (layer.type) {
    case 'ring':
      return renderRing(layer, filterAttr, opacity);
    case 'polygon':
      return renderPolygon(layer, filterAttr, opacity);
    case 'axis':
      return renderAxis(layer, filterAttr, opacity);
    case 'textRing':
      return renderTextRing(layer, filterAttr, opacity);
    case 'spine':
      return renderSpine(layer, filterAttr, opacity);
    default:
      return '';
  }
}

function renderRing(layer: RingLayer, filterAttr: string, opacity: number): string {
  const r = Math.max(1, layer.radius);
  let out = `<circle cx="${CENTER}" cy="${CENTER}" r="${r}" fill="none" stroke="${layer.color}" stroke-width="${layer.strokeWidth}" opacity="${opacity}"${filterAttr}`;
  if (layer.dashArray && layer.dashArray !== 'none') {
    out += ` stroke-dasharray="${layer.dashArray}"`;
  }
  out += `/>`;
  if (layer.spacingMode === 'phi') {
    let cr = r * (1 / PHI);
    while (cr > 8) {
      out += `\n  <circle cx="${CENTER}" cy="${CENTER}" r="${cr}" fill="none" stroke="${layer.color}" stroke-width="${layer.strokeWidth * 0.6}" opacity="${opacity * 0.5}"/>`;
      cr = cr * (1 / PHI);
    }
  } else if (layer.spacingMode === 'fibonacci') {
    const fibs = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233];
    const scale = r / 233;
    for (const f of fibs) {
      const fr = f * scale;
      if (fr < 8 || fr >= r) continue;
      out += `\n  <circle cx="${CENTER}" cy="${CENTER}" r="${fr}" fill="none" stroke="${layer.color}" stroke-width="${layer.strokeWidth * 0.5}" opacity="${opacity * 0.4}"/>`;
    }
  }
  return out;
}

function renderPolygon(layer: PolygonLayer, filterAttr: string, opacity: number): string {
  const verts = polygonVertices(layer.radius, layer.sides, layer.rotation);
  const points = verts.map(v => `${v.x.toFixed(2)},${v.y.toFixed(2)}`).join(' ');
  return `<polygon points="${points}" fill="none" stroke="${layer.color}" stroke-width="${layer.strokeWidth}" opacity="${opacity}"${filterAttr} stroke-linejoin="round"/>`;
}

function renderAxis(layer: AxisLayer, filterAttr: string, opacity: number): string {
  let out = '';
  for (let i = 0; i < layer.count; i++) {
    const angle = (i * 2 * Math.PI) / layer.count - Math.PI / 2;
    const inner = polarToXY(angle, layer.innerRadius);
    const outer = polarToXY(angle, layer.outerRadius);
    out += `\n  <line x1="${inner.x.toFixed(2)}" y1="${inner.y.toFixed(2)}" x2="${outer.x.toFixed(2)}" y2="${outer.y.toFixed(2)}" stroke="${layer.color}" stroke-width="${layer.strokeWidth}" opacity="${opacity}"${filterAttr} stroke-linecap="round"/>`;
  }
  return out.trim();
}

function renderTextRing(layer: TextRingLayer, filterAttr: string, opacity: number): string {
  const r = Math.max(10, layer.radius);
  const pathId = `tp-${layer.id}`;
  const pathD = fullCirclePath(r);
  const repeat = layer.text.repeat(3);
  const startOffset = layer.reverse ? '100%' : '0%';
  const sideAttr = layer.reverse ? ' side="right"' : '';
  return `<defs><path id="${pathId}" d="${pathD}"/></defs><text font-size="${layer.fontSize}" fill="${layer.color}" opacity="${opacity}" font-family="monospace" letter-spacing="2"${filterAttr}><textPath href="#${pathId}" startOffset="${startOffset}"${sideAttr}>${escapeXml(repeat)}</textPath></text>`;
}

function renderSpine(layer: SpineLayer, filterAttr: string, opacity: number): string {
  const cx = CENTER;
  const top = 20;
  const bot = CANVAS_SIZE - 20;
  let out = `<line x1="${cx}" y1="${top}" x2="${cx}" y2="${bot}" stroke="${layer.color}" stroke-width="${layer.strokeWidth}" opacity="${opacity * 0.5}"/>`;
  if (layer.nodeCount > 0 && layer.nodeRadius > 0) {
    const spacing = (bot - top) / (layer.nodeCount + 1);
    for (let i = 0; i < layer.nodeCount; i++) {
      const ny = top + spacing * (i + 1) + layer.offset;
      if (ny < top || ny > bot) continue;
      out += `\n  <circle cx="${cx}" cy="${ny}" r="${layer.nodeRadius}" fill="none" stroke="${layer.color}" stroke-width="${layer.strokeWidth}" opacity="${opacity}"${filterAttr}/>`;
      if (layer.nodeGlyph) {
        const g = GLYPHS[layer.nodeGlyph];
        const gs = layer.nodeRadius * 1.4;
        const half = gs / 2;
        out += `\n  <g transform="translate(${cx - half},${ny - half}) scale(${gs / 50})" color="${layer.color}" opacity="${opacity}">${g.render(50)}</g>`;
      }
    }
  }
  return out;
}

export function computePlacementCoords(
  placement: GlyphPlacement,
  layers: AnyLayer[]
): { x: number; y: number }[] {
  switch (placement.target) {
    case 'center':
      return [{ x: CENTER, y: CENTER }];
    case 'vertices': {
      const target = layers.find(l => l.id === placement.targetLayerId) ||
        layers.find(l => l.type === 'polygon');
      if (target && target.type === 'polygon') {
        return polygonVertices(target.radius, target.sides, target.rotation);
      }
      return [{ x: CENTER, y: CENTER }];
    }
    case 'intersections': {
      const axisLayer = layers.find(l => l.id === placement.targetLayerId) ||
        layers.find(l => l.type === 'axis');
      const ringLayer = layers.filter(l => l.type === 'ring').sort((a, b) => b.radius - a.radius)[0] as RingLayer | undefined;
      if (axisLayer && axisLayer.type === 'axis' && ringLayer) {
        const coords: { x: number; y: number }[] = [];
        const r = ringLayer.radius;
        for (let i = 0; i < axisLayer.count; i++) {
          const angle = (i * 2 * Math.PI) / axisLayer.count - Math.PI / 2;
          coords.push(polarToXY(angle, r));
        }
        return coords;
      }
      return [{ x: CENTER, y: CENTER }];
    }
    default:
      return [{ x: CENTER, y: CENTER }];
  }
}

export function renderGlyphPlacement(
  placement: GlyphPlacement,
  layers: AnyLayer[]
): string {
  const glyph = GLYPHS[placement.glyphId];
  if (!glyph) return '';
  const coords = computePlacementCoords(placement, layers);
  let out = '';
  for (const c of coords) {
    const half = placement.size / 2;
    const scale = placement.size / 50;
    out += `\n  <g transform="translate(${(c.x - half).toFixed(2)},${(c.y - half).toFixed(2)}) scale(${scale.toFixed(3)})" color="#E2E8F0">${glyph.render(50)}</g>`;
  }
  return out.trim();
}

export function buildSvgInner(layers: AnyLayer[], placements: GlyphPlacement[]): string {
  const filterDefs = new Map<string, string>();
  let body = '';
  for (const layer of layers) {
    body += '\n  ' + renderLayer(layer, filterDefs);
  }
  for (const p of placements) {
    body += '\n  ' + renderGlyphPlacement(p, layers);
  }
  let defs = '';
  for (const [, def] of filterDefs) {
    defs += '\n  ' + def;
  }
  return defs + body;
}

export function buildExportSvg(layers: AnyLayer[], placements: GlyphPlacement[]): string {
  const inner = buildSvgInner(layers, placements);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}" width="${CANVAS_SIZE}" height="${CANVAS_SIZE}">\n${inner}\n</svg>`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export function downloadSvg(layers: AnyLayer[], placements: GlyphPlacement[]): void {
  const svg = buildExportSvg(layers, placements);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `esoteric-circle-${Date.now()}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadPng(layers: AnyLayer[], placements: GlyphPlacement[], scale = 2): void {
  const svg = buildExportSvg(layers, placements);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_SIZE * scale;
    canvas.height = CANVAS_SIZE * scale;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((pngBlob) => {
        if (pngBlob) {
          const pngUrl = URL.createObjectURL(pngBlob);
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = `esoteric-circle-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(pngUrl);
        }
      }, 'image/png');
    }
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

export function createLayer(type: AnyLayer['type']): AnyLayer {
  const id = genId(type);
  const base = {
    id, name: '', color: '#94A3B8', opacity: 0.7, strokeWidth: 1.5,
    glow: 0, rotation: 0, visible: true,
  };
  switch (type) {
    case 'ring':
      return { ...base, name: 'New Ring', type: 'ring', radius: 200, dashArray: 'none', spacingMode: 'standard' as const };
    case 'polygon':
      return { ...base, name: 'New Polygon', type: 'polygon', radius: 200, sides: 6 };
    case 'axis':
      return { ...base, name: 'New Axis', type: 'axis', count: 8, innerRadius: 100, outerRadius: 350, opacity: 0.4, strokeWidth: 1 };
    case 'textRing':
      return { ...base, name: 'New Text Ring', type: 'textRing', radius: 280, text: 'ENTER YOUR INCANTATION', fontSize: 14, reverse: false, strokeWidth: 0, opacity: 0.85 };
    case 'spine':
      return { ...base, name: 'New Spine', type: 'spine', offset: 0, nodeCount: 3, nodeRadius: 25, nodeGlyph: null, opacity: 0.5 };
  }
}
