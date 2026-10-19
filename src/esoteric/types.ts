export type GlyphId =
  | 'fire'
  | 'water'
  | 'air'
  | 'earth'
  | 'sulfur'
  | 'mercury'
  | 'salt'
  | 'sun'
  | 'moon'
  | 'earthAntimony'
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto'
  | 'fehu'
  | 'uruz'
  | 'thurisaz'
  | 'ansuz'
  | 'raidho'
  | 'kenaz'
  | 'gebo'
  | 'hagalaz'
  | 'isa'
  | 'algiz'
  | 'sowilo'
  | 'tiwaz';

export type GlyphGroup = 'Elements' | 'Primes' | 'Astrological' | 'Zodiac' | 'Planets' | 'Runes';

export interface Glyph {
  id: GlyphId;
  name: string;
  group: GlyphGroup;
  render: (size?: number) => string;
}

export type LayerType = 'ring' | 'polygon' | 'axis' | 'textRing' | 'spine';

export type PlacementTarget = 'center' | 'vertices' | 'intersections';

export interface BaseLayer {
  id: string;
  name: string;
  type: LayerType;
  color: string;
  opacity: number;
  strokeWidth: number;
  glow: number;
  rotation: number;
  visible: boolean;
}

export interface RingLayer extends BaseLayer {
  type: 'ring';
  radius: number;
  dashArray: string;
  spacingMode: 'standard' | 'phi' | 'fibonacci';
}

export interface PolygonLayer extends BaseLayer {
  type: 'polygon';
  radius: number;
  sides: number;
}

export interface AxisLayer extends BaseLayer {
  type: 'axis';
  count: number;
  innerRadius: number;
  outerRadius: number;
}

export interface TextRingLayer extends BaseLayer {
  type: 'textRing';
  radius: number;
  text: string;
  fontSize: number;
  reverse: boolean;
}

export interface SpineLayer extends BaseLayer {
  type: 'spine';
  offset: number;
  nodeCount: number;
  nodeRadius: number;
  nodeGlyph: GlyphId | null;
}

export type AnyLayer = RingLayer | PolygonLayer | AxisLayer | TextRingLayer | SpineLayer;

export interface GlyphPlacement {
  id: string;
  glyphId: GlyphId;
  target: PlacementTarget;
  targetLayerId: string | null;
  size: number;
  rotation?: number;
}

export interface ArchetypePreset {
  id: string;
  name: string;
  description: string;
  layers: AnyLayer[];
  glyphPlacements: GlyphPlacement[];
}

export const CANVAS_SIZE = 800;
export const CENTER = CANVAS_SIZE / 2;
