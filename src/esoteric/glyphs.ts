import type { Glyph, GlyphId } from './types';

const S = 50;

export const GLYPHS: Record<GlyphId, Glyph> = {
  fire: {
    id: 'fire',
    name: 'Fire',
    group: 'Elements',
    render: (size = S) => {
      const h = size / 2;
      const w = size / 2;
      const sw = size * 0.06;
      return `<polygon points="${w},${0} ${0},${h} ${size},${h}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linejoin="round"/>`;
    },
  },
  water: {
    id: 'water',
    name: 'Water',
    group: 'Elements',
    render: (size = S) => {
      const h = size / 2;
      const w = size / 2;
      const sw = size * 0.06;
      return `<polygon points="${w},${h} ${0},${0} ${size},${0}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linejoin="round"/>`;
    },
  },
  air: {
    id: 'air',
    name: 'Air',
    group: 'Elements',
    render: (size = S) => {
      const h = size / 2;
      const w = size / 2;
      const barY = h * 0.5;
      const sw = size * 0.06;
      return `<polygon points="${w},${0} ${0},${h} ${size},${h}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linejoin="round"/><line x1="${size * 0.22}" y1="${barY}" x2="${size * 0.78}" y2="${barY}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  earth: {
    id: 'earth',
    name: 'Earth',
    group: 'Elements',
    render: (size = S) => {
      const h = size / 2;
      const w = size / 2;
      const barY = h * 0.5;
      const sw = size * 0.06;
      return `<polygon points="${w},${h} ${0},${0} ${size},${0}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linejoin="round"/><line x1="${size * 0.22}" y1="${barY}" x2="${size * 0.78}" y2="${barY}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  sulfur: {
    id: 'sulfur',
    name: 'Sulfur',
    group: 'Primes',
    render: (size = S) => {
      const cx = size / 2;
      const triH = size * 0.38;
      const triTop = size * 0.04;
      const triHalf = size * 0.24;
      const crossY = size * 0.52;
      const crossBot = size * 0.92;
      const crossHalf = size * 0.16;
      const sw = size * 0.055;
      return `<polygon points="${cx},${triTop} ${cx - triHalf},${triTop + triH} ${cx + triHalf},${triTop + triH}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linejoin="round"/><line x1="${cx}" y1="${triTop + triH}" x2="${cx}" y2="${crossBot}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><line x1="${cx - crossHalf}" y1="${crossY}" x2="${cx + crossHalf}" y2="${crossY}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  mercury: {
    id: 'mercury',
    name: 'Mercury',
    group: 'Primes',
    render: (size = S) => {
      const cx = size / 2;
      const sw = size * 0.05;
      const cresR = size * 0.18;
      const cresCY = size * 0.2;
      const circR = size * 0.16;
      const circCY = size * 0.5;
      const crossY = size * 0.72;
      const crossBot = size * 0.95;
      const crossHalf = size * 0.14;
      const path = `M ${cx - cresR} ${cresCY} A ${cresR} ${cresR} 0 1 0 ${cx + cresR} ${cresCY} A ${cresR * 0.7} ${cresR * 0.7} 0 1 1 ${cx - cresR} ${cresCY}`;
      return `<path d="${path}" fill="none" stroke="currentColor" stroke-width="${sw}"/><circle cx="${cx}" cy="${circCY}" r="${circR}" fill="none" stroke="currentColor" stroke-width="${sw}"/><line x1="${cx}" y1="${circCY + circR}" x2="${cx}" y2="${crossBot}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><line x1="${cx - crossHalf}" y1="${crossY}" x2="${cx + crossHalf}" y2="${crossY}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  salt: {
    id: 'salt',
    name: 'Salt',
    group: 'Primes',
    render: (size = S) => {
      const cx = size / 2;
      const cy = size / 2;
      const r = size * 0.42;
      const sw = size * 0.055;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor" stroke-width="${sw}"/><line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  sun: {
    id: 'sun',
    name: 'Sun',
    group: 'Astrological',
    render: (size = S) => {
      const cx = size / 2;
      const cy = size / 2;
      const r = size * 0.38;
      const dotR = size * 0.07;
      const sw = size * 0.055;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor" stroke-width="${sw}"/><circle cx="${cx}" cy="${cy}" r="${dotR}" fill="currentColor"/>`;
    },
  },
  moon: {
    id: 'moon',
    name: 'Moon',
    group: 'Astrological',
    render: (size = S) => {
      const cx = size / 2;
      const cy = size / 2;
      const r = size * 0.4;
      const sw = size * 0.055;
      const path = `M ${cx + r * 0.3} ${cy - r} A ${r} ${r} 0 1 0 ${cx + r * 0.3} ${cy + r} A ${r * 0.72} ${r * 0.72} 0 1 1 ${cx + r * 0.3} ${cy - r}`;
      return `<path d="${path}" fill="none" stroke="currentColor" stroke-width="${sw}"/>`;
    },
  },
  earthAntimony: {
    id: 'earthAntimony',
    name: 'Earth (Antimony)',
    group: 'Astrological',
    render: (size = S) => {
      const cx = size / 2;
      const cy = size / 2 + size * 0.06;
      const r = size * 0.34;
      const sw = size * 0.052;
      const crossTop = size * 0.04;
      const crossHalf = size * 0.16;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor" stroke-width="${sw}"/><line x1="${cx}" y1="${cy - r}" x2="${cx}" y2="${crossTop}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><line x1="${cx - crossHalf}" y1="${crossTop + size * 0.06}" x2="${cx + crossHalf}" y2="${crossTop + size * 0.06}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
};

export const GLYPH_LIST: Glyph[] = Object.values(GLYPHS);

export function glyphGroups(): Record<string, Glyph[]> {
  const groups: Record<string, Glyph[]> = {};
  for (const g of GLYPH_LIST) {
    if (!groups[g.group]) groups[g.group] = [];
    groups[g.group].push(g);
  }
  return groups;
}
