export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): Rgb | null {
  const m = hex.trim().replace('#', '');
  if (/^[0-9a-fA-F]{3}$/.test(m)) {
    return {
      r: parseInt(m[0] + m[0], 16),
      g: parseInt(m[1] + m[1], 16),
      b: parseInt(m[2] + m[2], 16),
    };
  }
  if (/^[0-9a-fA-F]{6}$/.test(m)) {
    return {
      r: parseInt(m.slice(0, 2), 16),
      g: parseInt(m.slice(2, 4), 16),
      b: parseInt(m.slice(4, 6), 16),
    };
  }
  return null;
}

export function rgbToHex(c: Rgb): string {
  const h = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${h(c.r)}${h(c.g)}${h(c.b)}`;
}

function linearChannel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(c: Rgb): number {
  return 0.2126 * linearChannel(c.r) + 0.7152 * linearChannel(c.g) + 0.0722 * linearChannel(c.b);
}

export function contrastRatio(fg: string, bg: string): number {
  const f = hexToRgb(fg);
  const b = hexToRgb(bg);
  if (!f || !b) return 21;
  const lf = relativeLuminance(f);
  const lb = relativeLuminance(b);
  const hi = Math.max(lf, lb);
  const lo = Math.min(lf, lb);
  return (hi + 0.05) / (lo + 0.05);
}

function mix(a: Rgb, target: Rgb, t: number): Rgb {
  return {
    r: a.r + (target.r - a.r) * t,
    g: a.g + (target.g - a.g) * t,
    b: a.b + (target.b - a.b) * t,
  };
}

const BLACK: Rgb = { r: 0, g: 0, b: 0 };
const WHITE: Rgb = { r: 255, g: 255, b: 255 };

/**
 * Returns `color` if it already reads clearly against `bg`, otherwise blends it
 * toward black (light backgrounds) or white (dark backgrounds) until the
 * contrast ratio reaches `minRatio`.
 */
export function ensureContrast(color: string, bg: string, minRatio = 2.4): string {
  const fg = hexToRgb(color);
  const b = hexToRgb(bg);
  if (!fg || !b) return color;
  if (contrastRatio(color, bg) >= minRatio) return color;

  const bgIsLight = relativeLuminance(b) > 0.5;
  const target = bgIsLight ? BLACK : WHITE;

  for (let t = 0.1; t <= 1; t += 0.05) {
    const hex = rgbToHex(mix(fg, target, t));
    if (contrastRatio(hex, bg) >= minRatio) return hex;
  }
  return rgbToHex(target);
}
