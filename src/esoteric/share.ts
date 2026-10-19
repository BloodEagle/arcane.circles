import type { AnyLayer, GlyphPlacement } from './types';

export interface SharedDesign {
  layers: AnyLayer[];
  placements: GlyphPlacement[];
  themeId: string;
}

const PREFIX = '#d=';

export function encodeDesign(design: SharedDesign): string {
  const json = JSON.stringify({ l: design.layers, p: design.placements, t: design.themeId });
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decodeDesign(encoded: string): SharedDesign | null {
  try {
    const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(escape(atob(b64)));
    const obj = JSON.parse(json);
    if (!Array.isArray(obj.l) || !Array.isArray(obj.p) || typeof obj.t !== 'string') return null;
    return { layers: obj.l, placements: obj.p, themeId: obj.t };
  } catch {
    return null;
  }
}

export function readDesignFromHash(): SharedDesign | null {
  const hash = window.location.hash;
  if (!hash.startsWith(PREFIX)) return null;
  return decodeDesign(hash.slice(PREFIX.length));
}

export function buildShareUrl(design: SharedDesign): string {
  const base = window.location.href.split('#')[0];
  return `${base}${PREFIX}${encodeDesign(design)}`;
}
