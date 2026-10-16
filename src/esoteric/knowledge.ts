import type { GlyphId } from './types';
import {
  Circle,
  Hexagon,
  Move3D,
  Type,
  AlignCenterVertical,
  Flame,
  Sun,
  Lock,
  Flower2,
  LucideIcon,
} from 'lucide-react';

export interface KnowledgeEntry {
  title: string;
  body: string;
}

export interface KnowledgeSection {
  id: string;
  label: string;
  entries: KnowledgeEntry[];
}

export const LAYER_TYPE_ICONS: Record<string, LucideIcon> = {
  ring: Circle,
  polygon: Hexagon,
  axis: Move3D,
  textRing: Type,
  spine: AlignCenterVertical,
};

export const ARCHETYPE_ICONS: Record<string, LucideIcon> = {
  transmutation: Flame,
  celestial: Sun,
  binding: Lock,
  sacredGeometry: Flower2,
};

// ── Layer Properties ──────────────────────────────────────

export const LAYER_TOOLTIPS: Record<string, string> = {
  name: 'A text label for this layer, shown in the layer manager. Rename it to keep your composition organized.',
  color: 'The stroke or fill color used for every element in this layer. Use the color picker or type a hex code directly.',
  opacity: 'Controls how transparent this layer is. At 100% it is fully visible; at 0% it is invisible. Lower values let underlying layers show through, creating depth.',
  strokeWidth: 'The thickness of the lines drawn by this layer. Thicker strokes appear bolder and more prominent; thinner ones are delicate and fine.',
  glow: 'Applies a Gaussian blur halo around this layer\'s strokes, simulating a luminous aura. Higher values create a wider, softer glow. Zero disables it entirely.',
  radius: 'The distance from the center of the canvas to the edge of this layer. Larger values push the shape outward; smaller ones pull it toward the core.',
  sides: 'The number of edges on a polygon. 3 makes a triangle, 4 a square, 5 a pentagon, 6 a hexagon, up to 12. Each value produces a different sacred geometry.',
  rotation: 'Rotates the entire shape clockwise around the canvas center, in degrees. Use this to align polygon vertices with axis lines or interlock multiple shapes.',
  dashArray: 'Breaks a solid line into a repeating pattern of dashes and gaps. Solid draws a continuous line; the other options create dotted, dashed, or mixed rhythms.',
  spacingMode: 'Determines how sub-rings are generated inside this ring. Standard draws just one circle. Golden Ratio nests progressively smaller rings at 1/1.618 scale. Fibonacci spaces them at Fibonacci-number radii.',
  count: 'The number of radial spoke lines drawn from the center outward. 6 creates a hexadic star, 8 an octadic pattern, 12 maps to the astrological houses.',
  innerRadius: 'The distance from center where each spoke begins. Set to 0 to start at the exact center; increase it to create a gap, so spokes start partway out.',
  outerRadius: 'The distance from center where each spoke ends. Spokes extend from the inner radius to this outer radius, slicing through the circle.',
  fontSize: 'The size of each character in the circular text ring. Larger values are more legible but take up more arc space; smaller ones fit more text.',
  text: 'The incantation or cipher text wrapped along the circular path. It repeats to fill the ring. Use spaces between words for readability.',
  direction: 'Controls whether text reads clockwise or counter-clockwise around the ring. Counter-clockwise mirrors the text along the bottom half.',
  offset: 'Shifts all spine nodes up or down along the vertical center line, in pixels. Positive moves down, negative moves up.',
  nodeCount: 'How many small circular sigil anchors are stacked vertically along the center spine. Each node can hold a glyph.',
  nodeRadius: 'The radius of each spine node circle. Set to 0 to hide nodes entirely, leaving only the bare vertical line.',
  nodeGlyph: 'An optional glyph stamped inside each spine node. Choose None for empty circles, or pick any symbol from the library to embed.',
};

// ── Glyph Lore ─────────────────────────────────────────────

export const GLYPH_LORE: Record<GlyphId, KnowledgeEntry> = {
  fire: {
    title: 'Fire (Triangle Up)',
    body: 'The alchemical element of Fire, represented by an upward-pointing triangle. Symbolizes transformation, energy, passion, and the active masculine principle. In the Magnum Opus, Fire is the calcination stage -- burning away the impure to reveal essence.',
  },
  water: {
    title: 'Water (Triangle Down)',
    body: 'The alchemical element of Water, a downward-pointing triangle. Represents fluidity, emotion, intuition, and the passive feminine principle. Associated with dissolution -- the stage where the solid is broken down into its liquid components.',
  },
  air: {
    title: 'Air (Triangle Up, Barred)',
    body: 'The alchemical element of Air: an upward triangle crossed by a horizontal bar. Denotes intellect, communication, and the volatile principle. In alchemy, Air mediates between Fire and Water, representing the sublimation of matter into spirit.',
  },
  earth: {
    title: 'Earth (Triangle Down, Barred)',
    body: 'The alchemical element of Earth: a downward triangle crossed by a horizontal bar. Signifies stability, materiality, and the fixed principle. Earth is the coagulation stage -- the final solidification of the philosopher\'s stone.',
  },
  sulfur: {
    title: 'Sulfur (Triangle over Cross)',
    body: 'One of the three alchemical Primes (Tria Prima). Sulfur is the active, fiery soul of matter -- representing consciousness, the animating spirit, and the principle of combustibility. Paired with Mercury and Salt, it forms the trinity of all transformation.',
  },
  mercury: {
    title: 'Mercury (Crescent over Circle over Cross)',
    body: 'The second alchemical Prime. Mercury is the fluid, connecting spirit -- representing intellect, communication, and the volatile essence that flows between states. It unites Sulfur\'s fire with Salt\'s body, mediating all transformation.',
  },
  salt: {
    title: 'Salt (Circle Divided by Line)',
    body: 'The third alchemical Prime. Salt is the passive, crystalline body of matter -- representing form, stability, and the material vessel. It is what remains after all volatile principles have been driven off, the ash that holds the essence.',
  },
  sun: {
    title: 'Sun (Circle with Center Dot)',
    body: 'The astrological Sun: a circle with a dot at its center. Represents the solar principle -- consciousness, vitality, the ego, and the illuminating force. In alchemy, the Sun is associated with gold and the completion of the Great Work.',
  },
  moon: {
    title: 'Moon (Crescent)',
    body: 'The astrological Moon: a crescent shape. Represents the lunar principle -- the unconscious, reflection, cycles, and the silvered aspect of matter. Paired with the Sun, it forms the duality that alchemy seeks to unite.',
  },
  earthAntimony: {
    title: 'Earth / Antimony (Globus Cruciger)',
    body: 'A circle surmounted by a cross, styled as the Globus Cruciger. In alchemy, this glyph represents both the planet Earth and the metal Antimony. Antimony was used in purification processes -- it cleans gold of its impurities, paralleling the spiritual purification of the soul.',
  },
};

// ── Placement Modes ────────────────────────────────────────

export const PLACEMENT_TOOLTIPS: Record<string, string> = {
  center: 'Stamps the glyph at the exact center of the canvas (400, 400). Best for a single dominant symbol like a Sun or Sulfur glyph.',
  vertices: 'Clones the glyph onto every corner of the active polygon layer. If multiple polygons exist, select which one to target, or leave on Auto for the first polygon.',
  intersections: 'Clones the glyph onto the exact coordinates where the radial axis lines cross the outermost ring. Choose an axis layer to target, or leave on Auto.',
  size: 'The rendered size of each stamped glyph in pixels. Larger glyphs are more prominent; smaller ones work well when many are stamped at vertices or intersections.',
  targetLayer: 'Specifies which polygon or axis layer the placement targets. Leave on Auto to use the first matching layer in the stack.',
  glyphSelect: 'Choose a symbol from the hardcoded glyph library. Each glyph carries its own alchemical or astrological meaning -- hover the name in the Grimoire panel to learn more.',
};

// ── Archetype Descriptions ────────────────────────────────

export const ARCHETYPE_LORE: Record<string, KnowledgeEntry> = {
  transmutation: {
    title: 'Transmutation & Change',
    body: 'Built on interlocking triangles (the classic alchemical hexagram), with three concentric rings representing the Sulfur, Mercury, and Salt processing stages. The palette is sulfur-yellow with warm glow, and Mercury glyphs auto-populate at the outer intersections. Use this archetype for themes of transformation, alchemical process, and the Great Work.',
  },
  celestial: {
    title: 'Celestial & Astrological Alignment',
    body: 'A central solar core surrounded by 12 radiating axes for the astrological houses, with a text ring pre-populated with all twelve Zodiac signs from Aries to Pisces. The palette is starlight silver-blue. Use this archetype for horoscopic, planetary, or cosmic-narrative compositions.',
  },
  binding: {
    title: 'Binding & Containment',
    body: 'A heavy outer octagon with tight concentric boundary rings and compressed radial spokes, all in deep iron-crimson. Earth glyphs stamp at the octagon vertices. Use this archetype for themes of sealing, warding, imprisonment, or containment rituals.',
  },
  sacredGeometry: {
    title: 'Sacred Geometric Resonance',
    body: 'Nested rings spaced at golden-ratio proportions, with interlocking hexagonal flower-of-life matrices and subtle resonance axes. The palette is an ethereal glowing emerald-cyan, with a Salt glyph at the center. Use this archetype for themes of harmony, divine proportion, and sacred architecture.',
  },
};

// ── Export Descriptions ────────────────────────────────────

export const EXPORT_TOOLTIPS: Record<string, string> = {
  svg: 'Exports the current canvas as a standalone .svg file with transparent background. The vector format means it scales infinitely without quality loss -- ideal for laser cutting, engraving, or further editing in Illustrator or Inkscape.',
  png: 'Exports the current canvas as a high-resolution .png image at 2x scale (1600x1600). The background is transparent. Best for sharing on social media, embedding in documents, or any raster-only context.',
};

// ── Layer Type Descriptions ───────────────────────────────

export const LAYER_TYPE_LORE: Record<string, KnowledgeEntry> = {
  ring: {
    title: 'Ring',
    body: 'A concentric circle layer. Supports dash patterns and three spacing modes: Standard (single circle), Golden Ratio (cascading nested rings at 1/1.618 scale), and Fibonacci (rings at Fibonacci-number radii).',
  },
  polygon: {
    title: 'Polygon',
    body: 'An inscribed shape with 3 to 12 sides, pinned exactly onto a target radius. Triangles, squares, pentagons, hexagons, heptagons, and octagons are all available. Rotation lets you interlock shapes.',
  },
  axis: {
    title: 'Axis / Spokes',
    body: 'Radial lines drawn from an inner radius to an outer radius, slicing through the circle. 6 axes make a hexadic star, 12 map to the astrological houses, 8 create an octadic spoke pattern.',
  },
  textRing: {
    title: 'Text Ring',
    body: 'Wraps custom text along a circular path using SVG textPath. Type any incantation or cipher and it repeats to fill the ring. Supports clockwise and counter-clockwise directions.',
  },
  spine: {
    title: 'Center Spine',
    body: 'A vertical center line in the style of John Dee\'s Monas Hieroglyphica, with optional circular sigil-anchor nodes stacked along it. Each node can optionally contain a glyph from the library.',
  },
};

// ── Grimoire Sections (for the searchable panel) ──────────

export const GRIMOIRE_SECTIONS: KnowledgeSection[] = [
  {
    id: 'archetypes',
    label: 'Narrative Archetypes',
    entries: Object.values(ARCHETYPE_LORE),
  },
  {
    id: 'layerTypes',
    label: 'Layer Types',
    entries: Object.values(LAYER_TYPE_LORE),
  },
  {
    id: 'properties',
    label: 'Layer Properties',
    entries: Object.entries(LAYER_TOOLTIPS).map(([key, body]) => ({
      title: key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()),
      body,
    })),
  },
  {
    id: 'glyphs',
    label: 'Glyph Lore',
    entries: Object.values(GLYPH_LORE),
  },
  {
    id: 'placement',
    label: 'Placement & Stamping',
    entries: Object.entries(PLACEMENT_TOOLTIPS).map(([key, body]) => ({
      title: key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()),
      body,
    })),
  },
  {
    id: 'export',
    label: 'Export & Output',
    entries: Object.entries(EXPORT_TOOLTIPS).map(([key, body]) => ({
      title: key === 'svg' ? 'Export SVG' : 'Export PNG',
      body,
    })),
  },
];
