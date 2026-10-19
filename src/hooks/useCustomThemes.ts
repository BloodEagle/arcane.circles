import { useState, useEffect, useCallback } from 'react';
import type { Theme, ThemeColors } from '@/esoteric/theme';
import { hexToRgb, rgbToHex, relativeLuminance } from '@/esoteric/colorUtils';
import { genId } from '@/esoteric/archetypes';

const STORAGE_KEY = 'arcane-custom-themes';

function mixHex(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  if (!ca || !cb) return a;
  return rgbToHex({
    r: ca.r + (cb.r - ca.r) * t,
    g: ca.g + (cb.g - ca.g) * t,
    b: ca.b + (cb.b - ca.b) * t,
  });
}

function rgba(hex: string, alpha: number): string {
  const c = hexToRgb(hex);
  if (!c) return hex;
  return `rgba(${c.r},${c.g},${c.b},${alpha})`;
}

/**
 * Derives a full ThemeColors palette from four seed colors.
 * Works for light and dark backgrounds by mixing toward the
 * appropriate pole.
 */
export function deriveThemeColors(bg: string, panel: string, text: string, accent: string): ThemeColors {
  const bgRgb = hexToRgb(bg);
  const isLight = bgRgb ? relativeLuminance(bgRgb) > 0.5 : false;
  const pole = isLight ? '#000000' : '#FFFFFF';
  return {
    bg,
    panel,
    panelHover: mixHex(panel, text, 0.12),
    border: mixHex(panel, text, isLight ? 0.18 : 0.15),
    borderHover: mixHex(panel, text, 0.3),
    text,
    textMuted: mixHex(text, bg, 0.35),
    textDim: mixHex(text, bg, 0.6),
    accent,
    accentHover: mixHex(accent, pole, isLight ? 0.15 : 0.2),
    accentBorder: mixHex(accent, bg, 0.2),
    accentRing: rgba(accent, 0.3),
    accentThumb: accent,
    inputBg: rgba(mixHex(panel, text, 0.08), isLight ? 0.6 : 0.5),
    danger: '#B91C1C',
    dangerHover: '#DC2626',
    success: isLight ? '#166534' : '#10B981',
  };
}

export function useCustomThemes() {
  const [customThemes, setCustomThemes] = useState<Theme[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCustomThemes(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to load custom themes:', e);
    }
  }, []);

  const addTheme = useCallback((name: string, colors: ThemeColors) => {
    const theme: Theme = { id: `custom-${genId('theme')}`, name, colors };
    setCustomThemes(prev => {
      const next = [...prev, theme];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save custom themes:', e);
      }
      return next;
    });
    return theme;
  }, []);

  const deleteTheme = useCallback((id: string) => {
    setCustomThemes(prev => {
      const next = prev.filter(t => t.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save custom themes:', e);
      }
      return next;
    });
  }, []);

  const resolveTheme = useCallback((id: string, builtins: Theme[]): Theme => {
    return customThemes.find(t => t.id === id) ?? builtins.find(t => t.id === id) ?? builtins[0];
  }, [customThemes]);

  return { customThemes, addTheme, deleteTheme, resolveTheme };
}
