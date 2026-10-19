import type { AnyLayer, GlyphPlacement, GlyphId } from './types';
import { genId } from './archetypes';
import { GLYPH_LIST } from './glyphs';
import { hslToHex } from './colorUtils';

interface IntentToken {
  glyphs?: GlyphId[];
  symmetry?: number;
  hue?: number;
  saturation?: number;
  lightness?: number;
  glow?: number;
  warded?: boolean;
  dashed?: boolean;
  opacity?: number;
  incantation?: string;
}

const LEXICON: Record<string, IntentToken> = {
  // ── Elements ──
  fire: { glyphs: ['fire'], symmetry: 3, hue: 15, glow: 5, incantation: 'IGNIS' },
  flame: { glyphs: ['fire'], symmetry: 3, hue: 15, glow: 5 },
  water: { glyphs: ['water'], hue: 210, incantation: 'AQUA' },
  ocean: { glyphs: ['water'], hue: 210 },
  air: { glyphs: ['air'], hue: 190, lightness: 0.75, incantation: 'AER' },
  wind: { glyphs: ['air'], hue: 190, lightness: 0.75 },
  earth: { glyphs: ['earth'], symmetry: 4, hue: 110, incantation: 'TERRA' },
  soil: { glyphs: ['earth'], symmetry: 4, hue: 110 },

  // ── Primes ──
  sulfur: { glyphs: ['sulfur'], hue: 45 },
  brimstone: { glyphs: ['sulfur'], hue: 45 },
  mercury: { glyphs: ['mercury'], hue: 200, lightness: 0.7 },
  quicksilver: { glyphs: ['mercury'], hue: 200, lightness: 0.7 },
  salt: { glyphs: ['salt'], hue: 60, saturation: 0.3 },

  // ── Planets & celestial ──
  sun: { glyphs: ['sun'], symmetry: 12, hue: 45, glow: 6, incantation: 'SOL INVICTVS' },
  solar: { glyphs: ['sun'], symmetry: 12, hue: 45, glow: 6 },
  moon: { glyphs: ['moon'], hue: 225, saturation: 0.4, incantation: 'LVNA' },
  lunar: { glyphs: ['moon'], hue: 225, saturation: 0.4 },
  moonlight: { glyphs: ['moon'], hue: 225, saturation: 0.35, lightness: 0.72 },
  star: { symmetry: 12, lightness: 0.75 },
  stars: { symmetry: 12, lightness: 0.75 },
  celestial: { symmetry: 12, hue: 230, glyphs: ['sun', 'moon'] },
  venus: { glyphs: ['venus'], hue: 330, incantation: 'VENVS' },
  mars: { glyphs: ['mars'], hue: 5, incantation: 'MARS' },
  jupiter: { glyphs: ['jupiter'], hue: 260, incantation: 'IVPITER' },
  saturn: { glyphs: ['saturn'], hue: 250, saturation: 0.3, incantation: 'SATVRNVS' },
  uranus: { glyphs: ['uranus'], hue: 190 },
  neptune: { glyphs: ['neptune'], hue: 215 },
  pluto: { glyphs: ['pluto'], hue: 270, saturation: 0.4 },

  // ── Zodiac ──
  aries: { glyphs: ['aries'], hue: 10 },
  taurus: { glyphs: ['taurus'], hue: 100 },
  gemini: { glyphs: ['gemini'], hue: 50 },
  cancer: { glyphs: ['cancer'], hue: 220, saturation: 0.45 },
  leo: { glyphs: ['leo'], hue: 35 },
  virgo: { glyphs: ['virgo'], hue: 100, saturation: 0.5 },
  libra: { glyphs: ['libra'], hue: 200, saturation: 0.5 },
  scorpio: { glyphs: ['scorpio'], hue: 340, saturation: 0.55 },
  sagittarius: { glyphs: ['sagittarius'], hue: 20 },
  capricorn: { glyphs: ['capricorn'], hue: 260, saturation: 0.4 },
  aquarius: { glyphs: ['aquarius'], hue: 195 },
  pisces: { glyphs: ['pisces'], hue: 215 },

  // ── Runes ──
  fehu: { glyphs: ['fehu'], hue: 50 },
  uruz: { glyphs: ['uruz'], hue: 15 },
  thurisaz: { glyphs: ['thurisaz'], hue: 350, warded: true },
  ansuz: { glyphs: ['ansuz'], hue: 190 },
  raidho: { glyphs: ['raidho'], hue: 150 },
  kenaz: { glyphs: ['kenaz'], hue: 40, glow: 5 },
  gebo: { glyphs: ['gebo'], hue: 55 },
  hagalaz: { glyphs: ['hagalaz'], hue: 200, dashed: true },
  isa: { glyphs: ['isa'], hue: 195, saturation: 0.35, lightness: 0.8 },
  algiz: { glyphs: ['algiz'], hue: 350, warded: true },
  sowilo: { glyphs: ['sowilo'], hue: 45, glow: 5 },
  tiwaz: { glyphs: ['tiwaz'], hue: 5 },

  // ── Intents ──
  protection: { symmetry: 8, hue: 350, glyphs: ['algiz', 'earth'], warded: true, incantation: 'PROTEGE' },
  protect: { symmetry: 8, hue: 350, glyphs: ['algiz', 'earth'], warded: true },
  ward: { symmetry: 8, hue: 350, glyphs: ['algiz'], warded: true },
  warding: { symmetry: 8, hue: 350, glyphs: ['algiz'], warded: true },
  guard: { symmetry: 8, glyphs: ['algiz'], warded: true },
  aegis: { symmetry: 8, glyphs: ['algiz'], warded: true },
  shield: { symmetry: 8, glyphs: ['algiz', 'earth'], warded: true },
  defend: { symmetry: 8, glyphs: ['algiz'], warded: true },
  binding: { symmetry: 8, hue: 355, glyphs: ['earth'], warded: true, incantation: 'LIGA' },
  bind: { symmetry: 8, hue: 355, glyphs: ['earth'], warded: true },
  seal: { symmetry: 8, warded: true, glyphs: ['salt'] },
  contain: { symmetry: 8, warded: true },
  banish: { symmetry: 7, hue: 330, glyphs: ['thurisaz', 'scorpio'] },
  banishing: { symmetry: 7, hue: 330, glyphs: ['thurisaz'] },
  transformation: { symmetry: 6, hue: 35, glyphs: ['sulfur', 'mercury'], incantation: 'SOLVE ET COAGVLA' },
  transform: { symmetry: 6, hue: 35, glyphs: ['sulfur'] },
  transmute: { symmetry: 6, hue: 35, glyphs: ['sulfur', 'mercury'] },
  transmutation: { symmetry: 6, hue: 35, glyphs: ['sulfur', 'mercury'] },
  alchemy: { symmetry: 6, hue: 45, glyphs: ['sulfur', 'mercury', 'salt'] },
  change: { symmetry: 6, glyphs: ['mercury'] },
  healing: { symmetry: 6, hue: 140, glyphs: ['uruz', 'sun'], incantation: 'SANARE' },
  heal: { symmetry: 6, hue: 140, glyphs: ['uruz'] },
  health: { symmetry: 6, hue: 140, glyphs: ['uruz'] },
  vitality: { symmetry: 6, hue: 140, glyphs: ['uruz', 'sun'] },
  abundance: { symmetry: 5, hue: 50, glyphs: ['fehu', 'jupiter'], incantation: 'ABVNDANTIA' },
  wealth: { symmetry: 5, hue: 50, glyphs: ['fehu'] },
  prosperity: { symmetry: 5, hue: 50, glyphs: ['fehu', 'jupiter'] },
  money: { symmetry: 5, hue: 50, glyphs: ['fehu'] },
  love: { symmetry: 6, hue: 330, glyphs: ['venus'], incantation: 'AMOR' },
  attraction: { hue: 330, glyphs: ['venus'] },
  beauty: { hue: 330, glyphs: ['venus'], lightness: 0.72 },
  wisdom: { symmetry: 9, hue: 210, glyphs: ['kenaz', 'ansuz'], incantation: 'SAPIENTIA' },
  knowledge: { symmetry: 9, hue: 210, glyphs: ['kenaz'] },
  study: { hue: 210, glyphs: ['kenaz'] },
  truth: { hue: 220, lightness: 0.75, glyphs: ['kenaz'] },
  power: { symmetry: 5, hue: 10, glyphs: ['uruz', 'tiwaz'] },
  strength: { symmetry: 5, hue: 10, glyphs: ['uruz'] },
  might: { symmetry: 5, hue: 10, glyphs: ['uruz'] },
  victory: { symmetry: 5, hue: 45, glyphs: ['sowilo', 'tiwaz'], incantation: 'VICTORIA' },
  success: { symmetry: 5, hue: 45, glyphs: ['sowilo'] },
  justice: { symmetry: 7, hue: 220, glyphs: ['tiwaz', 'libra'] },
  oath: { symmetry: 6, glyphs: ['gebo', 'tiwaz'] },
  contract: { symmetry: 6, glyphs: ['gebo'] },
  journey: { hue: 150, glyphs: ['raidho'], incantation: 'ITER' },
  travel: { hue: 150, glyphs: ['raidho'] },
  path: { hue: 150, glyphs: ['raidho'] },
  communication: { hue: 195, glyphs: ['ansuz', 'mercury'] },
  message: { hue: 195, glyphs: ['ansuz'] },
  speech: { hue: 195, glyphs: ['ansuz'] },
  dream: { symmetry: 9, hue: 260, glyphs: ['moon', 'pisces'], opacity: 0.6 },
  dreams: { symmetry: 9, hue: 260, glyphs: ['moon', 'pisces'], opacity: 0.6 },
  vision: { symmetry: 9, hue: 270, glyphs: ['neptune', 'moon'] },
  intuition: { hue: 260, glyphs: ['pisces', 'moon'] },
  psychic: { hue: 270, glyphs: ['neptune'] },
  death: { symmetry: 7, hue: 280, saturation: 0.3, glyphs: ['scorpio', 'pluto'], incantation: 'MORS' },
  endings: { hue: 280, glyphs: ['scorpio'] },
  underworld: { hue: 280, saturation: 0.4, glyphs: ['pluto'] },
  rebirth: { symmetry: 6, hue: 20, glyphs: ['scorpio', 'sun'], incantation: 'RENASCOR' },
  renewal: { symmetry: 6, hue: 20, glyphs: ['sun'] },
  luck: { symmetry: 5, hue: 55, glyphs: ['jupiter', 'fehu'] },
  fortune: { symmetry: 5, hue: 55, glyphs: ['jupiter'] },
  chaos: { symmetry: 7, dashed: true, hue: 280 },
  order: { symmetry: 4, hue: 220, saturation: 0.5 },
  spirit: { opacity: 0.55, glow: 6, lightness: 0.78, glyphs: ['ansuz'] },
  spirits: { opacity: 0.55, glow: 6, lightness: 0.78 },
  ghost: { opacity: 0.5, glow: 7, lightness: 0.8 },
  ethereal: { opacity: 0.55, glow: 6, lightness: 0.78 },
  divine: { symmetry: 12, hue: 48, glow: 5, glyphs: ['sun'], incantation: 'DIVINVS' },
  sacred: { symmetry: 6, hue: 55, glow: 4 },
  holy: { symmetry: 12, hue: 48, glow: 5, glyphs: ['sun'] },
  goddess: { hue: 330, glyphs: ['venus', 'moon'] },
  god: { hue: 45, glyphs: ['sun'] },
  fertility: { hue: 120, glyphs: ['taurus', 'venus'] },
  growth: { hue: 120, glyphs: ['taurus'] },
  iron: { hue: 210, saturation: 0.15, lightness: 0.55, warded: true },
  bone: { hue: 50, saturation: 0.25, lightness: 0.7 },
  blood: { hue: 0, saturation: 0.7, glyphs: ['mars'] },
  serpent: { symmetry: 6, hue: 140, glyphs: ['scorpio'] },
  serpentine: { symmetry: 6, hue: 140 },
  dragon: { symmetry: 7, hue: 15, glyphs: ['sulfur'], glow: 4 },
  phoenix: { symmetry: 6, hue: 25, glyphs: ['fire', 'sun'], incantation: 'PHOENIX' },
  void: { hue: 250, saturation: 0.3, lightness: 0.5, opacity: 0.55, glow: 5 },
  abyss: { hue: 250, saturation: 0.3, lightness: 0.5, opacity: 0.55 },
  shadow: { hue: 260, saturation: 0.3, lightness: 0.5, opacity: 0.6 },
  shadows: { hue: 260, saturation: 0.3, lightness: 0.5, opacity: 0.6 },
  dark: { hue: 260, saturation: 0.35, lightness: 0.5 },
  darkness: { hue: 260, saturation: 0.35, lightness: 0.5 },
  night: { hue: 240, saturation: 0.4, glyphs: ['moon'] },
  pale: { saturation: 0.25, lightness: 0.78 },
  silver: { saturation: 0.2, lightness: 0.75 },
  white: { saturation: 0.15, lightness: 0.8 },
  black: { hue: 260, saturation: 0.3, lightness: 0.45 },
  light: { saturation: 0.3, lightness: 0.75, glow: 4 },
  crimson: { hue: 350, saturation: 0.75 },
  red: { hue: 5, saturation: 0.7 },
  golden: { hue: 45, glow: 4 },
  gold: { hue: 45, glow: 4 },
  green: { hue: 130 },
  blue: { hue: 220 },
  violet: { hue: 275 },
  purple: { hue: 275 },
  ice: { hue: 195, saturation: 0.4, lightness: 0.78, glyphs: ['isa'], incantation: 'GLACIES' },
  frozen: { hue: 195, lightness: 0.75, glyphs: ['isa'] },
  cold: { hue: 195, lightness: 0.75 },
  storm: { hue: 220, dashed: true, glyphs: ['sowilo'], incantation: 'TEMPESTAS' },
  lightning: { hue: 55, glow: 5, dashed: true, glyphs: ['sowilo', 'uruz'] },
  thunder: { hue: 220, dashed: true },
  ancient: { dashed: true, saturation: 0.5, lightness: 0.6 },
  elder: { dashed: true, saturation: 0.5, lightness: 0.6 },
  summoning: { symmetry: 6, glow: 5, glyphs: ['ansuz'], incantation: 'EVOCO' },
  summon: { symmetry: 6, glow: 5, glyphs: ['ansuz'] },
  invocation: { symmetry: 6, glow: 5 },
  invoke: { symmetry: 6, glow: 5 },
  ritual: { symmetry: 8, dashed: true },
  circle: { symmetry: 12 },
  magic: { symmetry: 7, glow: 4, incantation: 'MAGIA' },
  magick: { symmetry: 7, glow: 4 },
  arcane: { symmetry: 9, hue: 265, glow: 4 },
  enchant: { symmetry: 6, hue: 300, glow: 4 },
  curse: { symmetry: 7, hue: 335, glyphs: ['hagalaz', 'mars'] },
  hex: { symmetry: 6, hue: 335, glyphs: ['hagalaz'] },
  rune: { glyphs: ['fehu', 'algiz', 'sowilo'] },
  runes: { glyphs: ['fehu', 'algiz', 'sowilo'] },
};

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export interface ConjureResult {
  layers: AnyLayer[];
  placements: GlyphPlacement[];
  matched: string[];
}

/**
 * Parses a free-text intent and composes a sigil from a domain lexicon.
 * Fully client-side: tokenize → match → merge tokens → build geometry.
 */
export function conjureSigil(prompt: string): ConjureResult {
  const words = prompt
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);

  const tokens: { word: string; token: IntentToken }[] = [];
  const seen = new Set<string>();
  for (const w of words) {
    const token = LEXICON[w];
    if (token && !seen.has(w)) {
      tokens.push({ word: w, token });
      seen.add(w);
    }
  }

  const glyphs: GlyphId[] = [];
  for (const { token } of tokens) {
    for (const g of token.glyphs ?? []) {
      if (!glyphs.includes(g)) glyphs.push(g);
    }
  }

  const first = <K extends keyof IntentToken>(key: K): IntentToken[K] | undefined => {
    for (const { token } of tokens) {
      if (token[key] !== undefined) return token[key];
    }
    return undefined;
  };

  const hue = first('hue') ?? Math.floor(Math.random() * 360);
  const sat = first('saturation') ?? 0.72;
  const lit = first('lightness') ?? 0.62;
  const col = (dl = 0) => hslToHex(hue, sat, Math.max(0.2, Math.min(0.9, lit + dl)));
  const n = first('symmetry') ?? pick([5, 6, 7, 8] as const);
  const warded = tokens.some(t => t.token.warded);
  const dashed = tokens.some(t => t.token.dashed);
  const glowBase = first('glow') ?? 2;
  const opacityMul = first('opacity') ?? 1;

  const layers: AnyLayer[] = [];
  const push = (l: AnyLayer) => layers.push({ ...l, opacity: Math.min(1, l.opacity * opacityMul) });

  push({
    id: genId('ring'), name: 'Boundary', type: 'ring', color: col(0.08),
    opacity: 0.85, strokeWidth: 2, glow: glowBase + 2, rotation: 0, visible: true,
    radius: 388, dashArray: 'none', spacingMode: 'standard',
  });

  if (warded) {
    push({
      id: genId('poly'), name: 'Ward Octagon', type: 'polygon', color: col(),
      opacity: 0.8, strokeWidth: 2.5, glow: glowBase, rotation: 0, visible: true,
      radius: 384, sides: 8,
    });
    push({
      id: genId('ring'), name: 'Ward Ring', type: 'ring', color: col(-0.05),
      opacity: 0.6, strokeWidth: 1, glow: 0, rotation: 0, visible: true,
      radius: 360, dashArray: '10 3', spacingMode: 'standard',
    });
  }

  push({
    id: genId('poly'), name: `${n}-gon`, type: 'polygon', color: col(0.1),
    opacity: 0.75, strokeWidth: 1.5, glow: glowBase, rotation: 0, visible: true,
    radius: 230 + Math.floor(Math.random() * 80), sides: n,
  });

  push({
    id: genId('axis'), name: `${n} Spokes`, type: 'axis', color: col(),
    opacity: 0.35, strokeWidth: 1, glow: 0, rotation: 0, visible: true,
    count: n, innerRadius: 130, outerRadius: warded ? 355 : 385,
  });

  push({
    id: genId('ring'), name: 'Core Ring', type: 'ring', color: col(0.12),
    opacity: 0.7, strokeWidth: 1.2, glow: glowBase + 3, rotation: 0, visible: true,
    radius: 100 + Math.floor(Math.random() * 40),
    dashArray: dashed ? '4 4' : 'none', spacingMode: 'standard',
  });

  const incantation = first('incantation') ??
    (tokens.length > 0 ? prompt.trim().toUpperCase().split(/\s+/).slice(0, 4).join(' ') : 'SIGILLVM');
  push({
    id: genId('text'), name: 'Incantation', type: 'textRing', color: col(0.16),
    opacity: 0.8, strokeWidth: 0, glow: 0, rotation: 0, visible: true,
    radius: 368, text: incantation, fontSize: 13, reverse: false,
  });

  const placements: GlyphPlacement[] = [];
  const centerGlyph = glyphs[0] ?? (pick(GLYPH_LIST).id as GlyphId);
  placements.push({ id: genId('g'), glyphId: centerGlyph, target: 'center', targetLayerId: null, size: 65 });
  if (glyphs[1]) {
    placements.push({ id: genId('g'), glyphId: glyphs[1], target: 'vertices', targetLayerId: null, size: 30 });
  }
  if (glyphs[2]) {
    placements.push({ id: genId('g'), glyphId: glyphs[2], target: 'intersections', targetLayerId: null, size: 24 });
  }

  return { layers, placements, matched: tokens.map(t => t.word) };
}
