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
  aries: {
    id: 'aries',
    name: 'Aries',
    group: 'Zodiac',
    render: (size = S) => {
      const sw = size * 0.06;
      return `<path d="M ${size * 0.5} ${size * 0.9} L ${size * 0.5} ${size * 0.52} M ${size * 0.5} ${size * 0.52} C ${size * 0.5} ${size * 0.28} ${size * 0.24} ${size * 0.24} ${size * 0.24} ${size * 0.42} M ${size * 0.5} ${size * 0.52} C ${size * 0.5} ${size * 0.28} ${size * 0.76} ${size * 0.24} ${size * 0.76} ${size * 0.42}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  taurus: {
    id: 'taurus',
    name: 'Taurus',
    group: 'Zodiac',
    render: (size = S) => {
      const sw = size * 0.06;
      const cx = size / 2;
      const cy = size * 0.66;
      const r = size * 0.18;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor" stroke-width="${sw}"/><path d="M ${cx - size * 0.28} ${size * 0.38} C ${cx - size * 0.3} ${size * 0.16} ${cx - size * 0.14} ${size * 0.08} ${cx} ${size * 0.08} C ${cx + size * 0.14} ${size * 0.08} ${cx + size * 0.3} ${size * 0.16} ${cx + size * 0.28} ${size * 0.38}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    group: 'Zodiac',
    render: (size = S) => {
      const sw = size * 0.06;
      return `<path d="M ${size * 0.22} ${size * 0.14} C ${size * 0.36} ${size * 0.22} ${size * 0.64} ${size * 0.22} ${size * 0.78} ${size * 0.14}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><path d="M ${size * 0.22} ${size * 0.86} C ${size * 0.36} ${size * 0.78} ${size * 0.64} ${size * 0.78} ${size * 0.78} ${size * 0.86}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><line x1="${size * 0.36}" y1="${size * 0.2}" x2="${size * 0.36}" y2="${size * 0.8}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><line x1="${size * 0.64}" y1="${size * 0.2}" x2="${size * 0.64}" y2="${size * 0.8}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  cancer: {
    id: 'cancer',
    name: 'Cancer',
    group: 'Zodiac',
    render: (size = S) => {
      const sw = size * 0.055;
      return `<circle cx="${size * 0.32}" cy="${size * 0.38}" r="${size * 0.11}" fill="none" stroke="currentColor" stroke-width="${sw}"/><circle cx="${size * 0.68}" cy="${size * 0.62}" r="${size * 0.11}" fill="none" stroke="currentColor" stroke-width="${sw}"/><path d="M ${size * 0.68} ${size * 0.3} C ${size * 0.44} ${size * 0.16} ${size * 0.18} ${size * 0.22} ${size * 0.1} ${size * 0.4}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><path d="M ${size * 0.32} ${size * 0.7} C ${size * 0.56} ${size * 0.84} ${size * 0.82} ${size * 0.78} ${size * 0.9} ${size * 0.6}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  leo: {
    id: 'leo',
    name: 'Leo',
    group: 'Zodiac',
    render: (size = S) => {
      const sw = size * 0.055;
      return `<circle cx="${size * 0.34}" cy="${size * 0.36}" r="${size * 0.14}" fill="none" stroke="currentColor" stroke-width="${sw}"/><path d="M ${size * 0.34} ${size * 0.5} C ${size * 0.34} ${size * 0.72} ${size * 0.52} ${size * 0.7} ${size * 0.56} ${size * 0.56} C ${size * 0.6} ${size * 0.42} ${size * 0.6} ${size * 0.3} ${size * 0.72} ${size * 0.2} C ${size * 0.8} ${size * 0.13} ${size * 0.9} ${size * 0.18} ${size * 0.86} ${size * 0.28}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  virgo: {
    id: 'virgo',
    name: 'Virgo',
    group: 'Zodiac',
    render: (size = S) => {
      const sw = size * 0.055;
      return `<path d="M ${size * 0.14} ${size * 0.28} L ${size * 0.14} ${size * 0.72} M ${size * 0.14} ${size * 0.28} C ${size * 0.14} ${size * 0.2} ${size * 0.3} ${size * 0.2} ${size * 0.3} ${size * 0.28} L ${size * 0.3} ${size * 0.72} M ${size * 0.3} ${size * 0.28} C ${size * 0.3} ${size * 0.2} ${size * 0.46} ${size * 0.2} ${size * 0.46} ${size * 0.28} L ${size * 0.46} ${size * 0.72} M ${size * 0.46} ${size * 0.28} C ${size * 0.46} ${size * 0.2} ${size * 0.62} ${size * 0.2} ${size * 0.62} ${size * 0.3} L ${size * 0.62} ${size * 0.6} C ${size * 0.62} ${size * 0.72} ${size * 0.74} ${size * 0.7} ${size * 0.74} ${size * 0.6}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><path d="M ${size * 0.62} ${size * 0.46} C ${size * 0.74} ${size * 0.5} ${size * 0.78} ${size * 0.62} ${size * 0.7} ${size * 0.74}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  libra: {
    id: 'libra',
    name: 'Libra',
    group: 'Zodiac',
    render: (size = S) => {
      const sw = size * 0.06;
      return `<line x1="${size * 0.16}" y1="${size * 0.74}" x2="${size * 0.84}" y2="${size * 0.74}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><path d="M ${size * 0.16} ${size * 0.56} L ${size * 0.36} ${size * 0.56} A ${size * 0.14} ${size * 0.14} 0 0 1 ${size * 0.64} ${size * 0.56} L ${size * 0.84} ${size * 0.56}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  scorpio: {
    id: 'scorpio',
    name: 'Scorpio',
    group: 'Zodiac',
    render: (size = S) => {
      const sw = size * 0.055;
      return `<path d="M ${size * 0.14} ${size * 0.28} L ${size * 0.14} ${size * 0.72} M ${size * 0.14} ${size * 0.28} C ${size * 0.14} ${size * 0.2} ${size * 0.3} ${size * 0.2} ${size * 0.3} ${size * 0.28} L ${size * 0.3} ${size * 0.72} M ${size * 0.3} ${size * 0.28} C ${size * 0.3} ${size * 0.2} ${size * 0.46} ${size * 0.2} ${size * 0.46} ${size * 0.28} L ${size * 0.46} ${size * 0.72} M ${size * 0.46} ${size * 0.28} C ${size * 0.46} ${size * 0.2} ${size * 0.62} ${size * 0.2} ${size * 0.62} ${size * 0.32} L ${size * 0.62} ${size * 0.68} L ${size * 0.74} ${size * 0.58}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><path d="M ${size * 0.62} ${size * 0.68} L ${size * 0.5} ${size * 0.58} M ${size * 0.62} ${size * 0.68} L ${size * 0.74} ${size * 0.58}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  sagittarius: {
    id: 'sagittarius',
    name: 'Sagittarius',
    group: 'Zodiac',
    render: (size = S) => {
      const sw = size * 0.06;
      return `<line x1="${size * 0.2}" y1="${size * 0.82}" x2="${size * 0.8}" y2="${size * 0.2}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><path d="M ${size * 0.8} ${size * 0.2} L ${size * 0.58} ${size * 0.2} M ${size * 0.8} ${size * 0.2} L ${size * 0.8} ${size * 0.42}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><line x1="${size * 0.26}" y1="${size * 0.4}" x2="${size * 0.42}" y2="${size * 0.56}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  capricorn: {
    id: 'capricorn',
    name: 'Capricorn',
    group: 'Zodiac',
    render: (size = S) => {
      const sw = size * 0.055;
      return `<path d="M ${size * 0.16} ${size * 0.24} L ${size * 0.16} ${size * 0.7} M ${size * 0.16} ${size * 0.24} C ${size * 0.16} ${size * 0.16} ${size * 0.34} ${size * 0.16} ${size * 0.38} ${size * 0.3} C ${size * 0.42} ${size * 0.44} ${size * 0.42} ${size * 0.62} ${size * 0.52} ${size * 0.7} C ${size * 0.62} ${size * 0.78} ${size * 0.76} ${size * 0.72} ${size * 0.74} ${size * 0.58} C ${size * 0.72} ${size * 0.5} ${size * 0.64} ${size * 0.48} ${size * 0.58} ${size * 0.54}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  aquarius: {
    id: 'aquarius',
    name: 'Aquarius',
    group: 'Zodiac',
    render: (size = S) => {
      const sw = size * 0.055;
      return `<path d="M ${size * 0.1} ${size * 0.34} L ${size * 0.22} ${size * 0.22} L ${size * 0.34} ${size * 0.34} L ${size * 0.46} ${size * 0.22} L ${size * 0.58} ${size * 0.34} L ${size * 0.7} ${size * 0.22} L ${size * 0.82} ${size * 0.34}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/><path d="M ${size * 0.1} ${size * 0.66} L ${size * 0.22} ${size * 0.54} L ${size * 0.34} ${size * 0.66} L ${size * 0.46} ${size * 0.54} L ${size * 0.58} ${size * 0.66} L ${size * 0.7} ${size * 0.54} L ${size * 0.82} ${size * 0.66}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>`;
    },
  },
  pisces: {
    id: 'pisces',
    name: 'Pisces',
    group: 'Zodiac',
    render: (size = S) => {
      const sw = size * 0.055;
      return `<path d="M ${size * 0.3} ${size * 0.16} C ${size * 0.16} ${size * 0.36} ${size * 0.16} ${size * 0.64} ${size * 0.3} ${size * 0.84}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><path d="M ${size * 0.7} ${size * 0.16} C ${size * 0.84} ${size * 0.36} ${size * 0.84} ${size * 0.64} ${size * 0.7} ${size * 0.84}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><line x1="${size * 0.22}" y1="${size * 0.5}" x2="${size * 0.78}" y2="${size * 0.5}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  venus: {
    id: 'venus',
    name: 'Venus',
    group: 'Planets',
    render: (size = S) => {
      const sw = size * 0.06;
      const cx = size / 2;
      const cy = size * 0.38;
      const r = size * 0.2;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor" stroke-width="${sw}"/><line x1="${cx}" y1="${cy + r}" x2="${cx}" y2="${size * 0.9}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><line x1="${cx - size * 0.14}" y1="${size * 0.76}" x2="${cx + size * 0.14}" y2="${size * 0.76}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    group: 'Planets',
    render: (size = S) => {
      const sw = size * 0.06;
      const cx = size * 0.42;
      const cy = size * 0.6;
      const r = size * 0.2;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor" stroke-width="${sw}"/><line x1="${cx + r * 0.75}" y1="${cy - r * 0.75}" x2="${size * 0.82}" y2="${size * 0.18}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><path d="M ${size * 0.82} ${size * 0.18} L ${size * 0.64} ${size * 0.18} M ${size * 0.82} ${size * 0.18} L ${size * 0.82} ${size * 0.36}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jupiter',
    group: 'Planets',
    render: (size = S) => {
      const sw = size * 0.055;
      return `<path d="M ${size * 0.16} ${size * 0.22} C ${size * 0.34} ${size * 0.34} ${size * 0.32} ${size * 0.52} ${size * 0.16} ${size * 0.58}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><line x1="${size * 0.56}" y1="${size * 0.16}" x2="${size * 0.56}" y2="${size * 0.82}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><line x1="${size * 0.4}" y1="${size * 0.44}" x2="${size * 0.82}" y2="${size * 0.44}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  saturn: {
    id: 'saturn',
    name: 'Saturn',
    group: 'Planets',
    render: (size = S) => {
      const sw = size * 0.055;
      return `<line x1="${size * 0.34}" y1="${size * 0.12}" x2="${size * 0.34}" y2="${size * 0.84}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><line x1="${size * 0.24}" y1="${size * 0.24}" x2="${size * 0.44}" y2="${size * 0.24}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><path d="M ${size * 0.34} ${size * 0.46} C ${size * 0.34} ${size * 0.36} ${size * 0.6} ${size * 0.38} ${size * 0.64} ${size * 0.5} L ${size * 0.68} ${size * 0.84}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  uranus: {
    id: 'uranus',
    name: 'Uranus',
    group: 'Planets',
    render: (size = S) => {
      const sw = size * 0.055;
      const cx = size / 2;
      return `<circle cx="${cx}" cy="${size * 0.68}" r="${size * 0.16}" fill="none" stroke="currentColor" stroke-width="${sw}"/><circle cx="${cx}" cy="${size * 0.68}" r="${size * 0.04}" fill="currentColor"/><line x1="${cx}" y1="${size * 0.52}" x2="${cx}" y2="${size * 0.16}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><path d="M ${size * 0.24} ${size * 0.12} C ${size * 0.34} ${size * 0.22} ${size * 0.34} ${size * 0.34} ${size * 0.24} ${size * 0.44}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><path d="M ${size * 0.76} ${size * 0.12} C ${size * 0.66} ${size * 0.22} ${size * 0.66} ${size * 0.34} ${size * 0.76} ${size * 0.44}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  neptune: {
    id: 'neptune',
    name: 'Neptune',
    group: 'Planets',
    render: (size = S) => {
      const sw = size * 0.055;
      return `<path d="M ${size * 0.2} ${size * 0.14} C ${size * 0.2} ${size * 0.4} ${size * 0.3} ${size * 0.52} ${size * 0.5} ${size * 0.58} M ${size * 0.8} ${size * 0.14} C ${size * 0.8} ${size * 0.4} ${size * 0.7} ${size * 0.52} ${size * 0.5} ${size * 0.58} M ${size * 0.5} ${size * 0.12} L ${size * 0.5} ${size * 0.86}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  pluto: {
    id: 'pluto',
    name: 'Pluto',
    group: 'Planets',
    render: (size = S) => {
      const sw = size * 0.055;
      const cx = size / 2;
      return `<circle cx="${cx}" cy="${size * 0.26}" r="${size * 0.12}" fill="none" stroke="currentColor" stroke-width="${sw}"/><path d="M ${size * 0.24} ${size * 0.36} A ${size * 0.26} ${size * 0.26} 0 0 0 ${size * 0.76} ${size * 0.36}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><line x1="${cx}" y1="${size * 0.6}" x2="${cx}" y2="${size * 0.88}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/><line x1="${size * 0.34}" y1="${size * 0.88}" x2="${size * 0.66}" y2="${size * 0.88}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  fehu: {
    id: 'fehu',
    name: 'Fehu',
    group: 'Runes',
    render: (size = S) => {
      const sw = size * 0.07;
      return `<path d="M ${size * 0.3} ${size * 0.12} L ${size * 0.3} ${size * 0.88} M ${size * 0.3} ${size * 0.16} L ${size * 0.72} ${size * 0.32} M ${size * 0.3} ${size * 0.36} L ${size * 0.72} ${size * 0.52}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
    },
  },
  uruz: {
    id: 'uruz',
    name: 'Uruz',
    group: 'Runes',
    render: (size = S) => {
      const sw = size * 0.07;
      return `<path d="M ${size * 0.3} ${size * 0.12} L ${size * 0.3} ${size * 0.88} M ${size * 0.3} ${size * 0.12} L ${size * 0.7} ${size * 0.3} L ${size * 0.7} ${size * 0.88}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
    },
  },
  thurisaz: {
    id: 'thurisaz',
    name: 'Thurisaz',
    group: 'Runes',
    render: (size = S) => {
      const sw = size * 0.07;
      return `<path d="M ${size * 0.32} ${size * 0.12} L ${size * 0.32} ${size * 0.88} M ${size * 0.32} ${size * 0.3} L ${size * 0.68} ${size * 0.5} L ${size * 0.32} ${size * 0.7}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
    },
  },
  ansuz: {
    id: 'ansuz',
    name: 'Ansuz',
    group: 'Runes',
    render: (size = S) => {
      const sw = size * 0.07;
      return `<path d="M ${size * 0.3} ${size * 0.12} L ${size * 0.3} ${size * 0.88} M ${size * 0.3} ${size * 0.14} L ${size * 0.72} ${size * 0.26} M ${size * 0.3} ${size * 0.36} L ${size * 0.72} ${size * 0.48}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
    },
  },
  raidho: {
    id: 'raidho',
    name: 'Raidho',
    group: 'Runes',
    render: (size = S) => {
      const sw = size * 0.07;
      return `<path d="M ${size * 0.3} ${size * 0.12} L ${size * 0.3} ${size * 0.88} M ${size * 0.3} ${size * 0.12} L ${size * 0.56} ${size * 0.12} C ${size * 0.68} ${size * 0.16} ${size * 0.68} ${size * 0.34} ${size * 0.56} ${size * 0.38} L ${size * 0.3} ${size * 0.38} M ${size * 0.44} ${size * 0.38} L ${size * 0.7} ${size * 0.88}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
    },
  },
  kenaz: {
    id: 'kenaz',
    name: 'Kenaz',
    group: 'Runes',
    render: (size = S) => {
      const sw = size * 0.07;
      return `<path d="M ${size * 0.68} ${size * 0.14} L ${size * 0.28} ${size * 0.5} L ${size * 0.68} ${size * 0.86}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
    },
  },
  gebo: {
    id: 'gebo',
    name: 'Gebo',
    group: 'Runes',
    render: (size = S) => {
      const sw = size * 0.07;
      return `<path d="M ${size * 0.24} ${size * 0.16} L ${size * 0.76} ${size * 0.84} M ${size * 0.76} ${size * 0.16} L ${size * 0.24} ${size * 0.84}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  hagalaz: {
    id: 'hagalaz',
    name: 'Hagalaz',
    group: 'Runes',
    render: (size = S) => {
      const sw = size * 0.07;
      return `<path d="M ${size * 0.3} ${size * 0.12} L ${size * 0.3} ${size * 0.88} M ${size * 0.7} ${size * 0.12} L ${size * 0.7} ${size * 0.88} M ${size * 0.3} ${size * 0.5} L ${size * 0.7} ${size * 0.5}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  isa: {
    id: 'isa',
    name: 'Isa',
    group: 'Runes',
    render: (size = S) => {
      const sw = size * 0.07;
      return `<line x1="${size * 0.5}" y1="${size * 0.12}" x2="${size * 0.5}" y2="${size * 0.88}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
    },
  },
  algiz: {
    id: 'algiz',
    name: 'Algiz',
    group: 'Runes',
    render: (size = S) => {
      const sw = size * 0.07;
      return `<path d="M ${size * 0.5} ${size * 0.88} L ${size * 0.5} ${size * 0.36} M ${size * 0.5} ${size * 0.36} L ${size * 0.26} ${size * 0.12} M ${size * 0.5} ${size * 0.36} L ${size * 0.74} ${size * 0.12}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
    },
  },
  sowilo: {
    id: 'sowilo',
    name: 'Sowilo',
    group: 'Runes',
    render: (size = S) => {
      const sw = size * 0.07;
      return `<path d="M ${size * 0.66} ${size * 0.14} L ${size * 0.34} ${size * 0.34} L ${size * 0.66} ${size * 0.5} L ${size * 0.34} ${size * 0.86}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
    },
  },
  tiwaz: {
    id: 'tiwaz',
    name: 'Tiwaz',
    group: 'Runes',
    render: (size = S) => {
      const sw = size * 0.07;
      return `<path d="M ${size * 0.5} ${size * 0.88} L ${size * 0.5} ${size * 0.14} M ${size * 0.5} ${size * 0.14} L ${size * 0.28} ${size * 0.32} M ${size * 0.5} ${size * 0.14} L ${size * 0.72} ${size * 0.32}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
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
