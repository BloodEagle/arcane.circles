export interface ThemeColors {
  bg: string;
  panel: string;
  panelHover: string;
  border: string;
  borderHover: string;
  text: string;
  textMuted: string;
  textDim: string;
  accent: string;
  accentHover: string;
  accentBorder: string;
  accentRing: string;
  accentThumb: string;
  inputBg: string;
  danger: string;
  dangerHover: string;
  success: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

export const THEMES: Theme[] = [
  {
    id: 'grimoire',
    name: 'Grimoire Dark',
    colors: {
      bg: '#0B0F12', panel: '#12181D', panelHover: '#1E293B', border: '#1E293B',
      borderHover: '#334155', text: '#E2E8F0', textMuted: '#94A3B8', textDim: '#64748B',
      accent: '#06B6D4', accentHover: '#22D3EE', accentBorder: '#0891B2',
      accentRing: 'rgba(6,182,212,0.3)', accentThumb: '#06b6d4',
      inputBg: 'rgba(30,41,59,0.4)', danger: '#991B1B', dangerHover: '#B91C1C',
      success: '#10B981',
    },
  },
  {
    id: 'parchment',
    name: 'Parchment Light',
    colors: {
      bg: '#F5F0E1', panel: '#EDE5D0', panelHover: '#E0D5BC', border: '#D4C7A9',
      borderHover: '#C4B78F', text: '#3E3527', textMuted: '#6B5D47', textDim: '#94846A',
      accent: '#92400E', accentHover: '#B45309', accentBorder: '#78350F',
      accentRing: 'rgba(146,64,14,0.25)', accentThumb: '#92400E',
      inputBg: 'rgba(245,240,225,0.6)', danger: '#991B1B', dangerHover: '#B91C1C',
      success: '#166534',
    },
  },
  {
    id: 'void',
    name: 'Void Black',
    colors: {
      bg: '#000000', panel: '#0A0A0A', panelHover: '#171717', border: '#1A1A1A',
      borderHover: '#2A2A2A', text: '#FAFAFA', textMuted: '#888888', textDim: '#555555',
      accent: '#A3E635', accentHover: '#BEF264', accentBorder: '#84CC16',
      accentRing: 'rgba(163,230,53,0.3)', accentThumb: '#A3E635',
      inputBg: 'rgba(20,20,20,0.6)', danger: '#DC2626', dangerHover: '#EF4444',
      success: '#16A34A',
    },
  },
  {
    id: 'alchemy',
    name: 'Alchemy Gold',
    colors: {
      bg: '#0C0A08', panel: '#15110B', panelHover: '#1E1810', border: '#2A2218',
      borderHover: '#3D3320', text: '#F4E4BC', textMuted: '#B8A07A', textDim: '#7A6748',
      accent: '#D4A017', accentHover: '#E8B931', accentBorder: '#B8881A',
      accentRing: 'rgba(212,160,23,0.3)', accentThumb: '#D4A017',
      inputBg: 'rgba(30,24,16,0.5)', danger: '#9F1239', dangerHover: '#BE123C',
      success: '#15803D',
    },
  },
  {
    id: 'abyss',
    name: 'Abyss Indigo',
    colors: {
      bg: '#080A14', panel: '#0E111E', panelHover: '#1A1E2E', border: '#1E2335',
      borderHover: '#2D3450', text: '#C7D2FE', textMuted: '#818CF8', textDim: '#4F5BD1',
      accent: '#6366F1', accentHover: '#818CF8', accentBorder: '#4F46E5',
      accentRing: 'rgba(99,102,241,0.3)', accentThumb: '#6366F1',
      inputBg: 'rgba(26,30,46,0.5)', danger: '#DC2626', dangerHover: '#EF4444',
      success: '#10B981',
    },
  },
];

export const DEFAULT_THEME_ID = 'grimoire';

export function getTheme(id: string): Theme {
  return THEMES.find(t => t.id === id) ?? THEMES[0];
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  const c = theme.colors;
  root.style.setProperty('--c-bg', c.bg);
  root.style.setProperty('--c-panel', c.panel);
  root.style.setProperty('--c-panel-hover', c.panelHover);
  root.style.setProperty('--c-border', c.border);
  root.style.setProperty('--c-border-hover', c.borderHover);
  root.style.setProperty('--c-text', c.text);
  root.style.setProperty('--c-text-muted', c.textMuted);
  root.style.setProperty('--c-text-dim', c.textDim);
  root.style.setProperty('--c-accent', c.accent);
  root.style.setProperty('--c-accent-hover', c.accentHover);
  root.style.setProperty('--c-accent-border', c.accentBorder);
  root.style.setProperty('--c-accent-ring', c.accentRing);
  root.style.setProperty('--c-accent-thumb', c.accentThumb);
  root.style.setProperty('--c-input-bg', c.inputBg);
  root.style.setProperty('--c-danger', c.danger);
  root.style.setProperty('--c-danger-hover', c.dangerHover);
  root.style.setProperty('--c-success', c.success);
}
