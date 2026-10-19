import { useState, useCallback, useEffect, useMemo } from 'react';
import { ARCHETYPES, clonePreset } from '@/esoteric/archetypes';
import { downloadSvg, downloadPng, type RenderOptions } from '@/esoteric/svgUtils';
import { THEMES, applyTheme, DEFAULT_THEME_ID } from '@/esoteric/theme';
import { generateSigil } from '@/esoteric/randomize';
import { conjureSigil } from '@/esoteric/conjure';
import { readDesignFromHash, buildShareUrl } from '@/esoteric/share';
import { deriveThemeColors, useCustomThemes } from '@/hooks/useCustomThemes';
import Sidebar from '@/components/Sidebar';
import SigilCanvas from '@/components/SigilCanvas';
import GrimoirePanel from '@/components/GrimoirePanel';
import Onboarding from '@/components/Onboarding';
import {
  Circle, BookOpen, Palette, Download, X, Menu, Undo2, Redo2,
  Wand2, Play, Pause, Share2, Coffee, Info, Trash2, Sparkles,
} from 'lucide-react';
import { usePwaInstall } from '@/hooks/usePwaInstall';
import { useDesignStorage } from '@/hooks/useDesignStorage';
import { useDebouncedEffect } from '@/hooks/useDebouncedEffect';
import { useDocHistory } from '@/hooks/useDocHistory';

const DONATE_URL = 'https://buymeacoffee.com/';
const ONBOARDED_KEY = 'arcane-onboarded';
const AUTOSAVE_KEY = 'arcane-autosave';

export default function App() {
  const initial = clonePreset(ARCHETYPES[0]);
  const { doc, setDoc, replaceDoc, undo, redo, canUndo, canRedo } = useDocHistory({
    layers: initial.layers,
    placements: initial.glyphPlacements,
    themeId: DEFAULT_THEME_ID,
  });
  const { layers, placements, themeId } = doc;

  const [grimoireOpen, setGrimoireOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [themeEditorOpen, setThemeEditorOpen] = useState(false);
  const [iosHintOpen, setIosHintOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [autoContrast, setAutoContrast] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [conjureOpen, setConjureOpen] = useState(false);
  const [conjureText, setConjureText] = useState('');
  const [globalRotation, setGlobalRotation] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(() => {
    try {
      return !localStorage.getItem(ONBOARDED_KEY) && !readDesignFromHash() && !localStorage.getItem(AUTOSAVE_KEY);
    } catch {
      return true;
    }
  });
  const { canInstall, isInstalled, isIOS, promptInstall } = usePwaInstall();
  const { saveAutosave, loadAutosave } = useDesignStorage();
  const { customThemes, addTheme, deleteTheme, resolveTheme } = useCustomThemes();

  const [newThemeName, setNewThemeName] = useState('');
  const [seedBg, setSeedBg] = useState('#0B0F12');
  const [seedPanel, setSeedPanel] = useState('#12181D');
  const [seedText, setSeedText] = useState('#E2E8F0');
  const [seedAccent, setSeedAccent] = useState('#06B6D4');

  useEffect(() => {
    applyTheme(resolveTheme(themeId, THEMES));
  }, [themeId, resolveTheme]);

  const renderOptions = useMemo<RenderOptions>(() => {
    const theme = resolveTheme(themeId, THEMES);
    return {
      bgColor: theme.colors.bg,
      glyphColor: theme.colors.text,
      autoContrast,
      globalRotation,
    };
  }, [themeId, autoContrast, globalRotation, resolveTheme]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useDebouncedEffect(() => {
    saveAutosave(layers, placements, themeId);
  }, 1000, [layers, placements, themeId]);

  // Restore shared design from URL hash, else fall back to autosave
  useEffect(() => {
    const shared = readDesignFromHash();
    if (shared) {
      replaceDoc(shared);
      return;
    }
    const autosave = loadAutosave();
    if (autosave) {
      replaceDoc({ layers: autosave.layers, placements: autosave.placements, themeId: autosave.themeId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Undo/redo keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable]')) return;
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.key.toLowerCase() === 'z' && e.shiftKey) || e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  const handleExportSvg = useCallback(() => downloadSvg(layers, placements, renderOptions), [layers, placements, renderOptions]);
  const handleExportPng = useCallback(() => downloadPng(layers, placements, renderOptions), [layers, placements, renderOptions]);

  const applyPresetById = useCallback((id: string) => {
    const preset = ARCHETYPES.find(p => p.id === id);
    if (!preset) return;
    const cloned = clonePreset(preset);
    setDoc(d => ({ ...d, layers: cloned.layers, placements: cloned.glyphPlacements }));
  }, [setDoc]);

  const invoke = useCallback(() => {
    const { layers: l, placements: p } = generateSigil();
    setDoc(d => ({ ...d, layers: l, placements: p }));
  }, [setDoc]);

  const conjure = useCallback(() => {
    if (!conjureText.trim()) return;
    const { layers: l, placements: p } = conjureSigil(conjureText);
    setDoc(d => ({ ...d, layers: l, placements: p }));
    setConjureOpen(false);
    setConjureText('');
  }, [conjureText, setDoc]);

  const shareDesign = useCallback(async () => {
    const url = buildShareUrl({ layers, placements, themeId });
    window.history.replaceState(null, '', url);
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      window.prompt('Copy this link to share your design:', url);
    }
  }, [layers, placements, themeId]);

  const closeOnboarding = useCallback(() => {
    setOnboardingOpen(false);
    try {
      localStorage.setItem(ONBOARDED_KEY, '1');
    } catch {
      // ignore
    }
  }, []);

  const handleCreateTheme = useCallback(() => {
    if (!newThemeName.trim()) return;
    const theme = addTheme(newThemeName.trim(), deriveThemeColors(seedBg, seedPanel, seedText, seedAccent));
    setNewThemeName('');
    setThemeEditorOpen(false);
    setDoc(d => ({ ...d, themeId: theme.id }));
  }, [newThemeName, seedBg, seedPanel, seedText, seedAccent, addTheme, setDoc]);

  const headerBtn = 'p-2 rounded-md transition-colors flex items-center gap-1.5';
  const headerBtnStyle = { border: '1px solid var(--c-border)', color: 'var(--c-text-muted)' } as const;

  return (
    <div
      className="app-shell flex flex-col overflow-hidden"
      style={{ background: 'var(--c-bg)', color: 'var(--c-text)' }}
    >
      <header className="shrink-0" style={{ borderBottom: '1px solid var(--c-border)', background: 'var(--c-panel)' }}>
        <div className="flex items-center gap-3 px-5 py-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{
                border: `2px solid var(--c-accent)`,
                background: 'color-mix(in srgb, var(--c-accent) 12%, transparent)',
              }}
            >
              <Circle size={16} style={{ color: 'var(--c-accent)' }} />
            </div>
            <div className="min-w-0 shrink-0">
              <h1 className="text-sm font-semibold tracking-wide" style={{ color: 'var(--c-text)' }}>
                arcane.circles
              </h1>
              <p className="text-[10px] tracking-wider uppercase hidden sm:block" style={{ color: 'var(--c-text-dim)' }}>
                Procedural Sigil & Circle Engine · Vector Output
              </p>
            </div>
          </div>
          <div className="ml-auto hidden md:flex items-center gap-3 text-[11px] font-mono" style={{ color: 'var(--c-text-dim)' }}>
            <span>{layers.length} layers</span>
            <span>·</span>
            <span>{placements.length} glyphs</span>
          </div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(true)}
              className={`${headerBtn} ml-auto`}
              style={headerBtnStyle}
              title="Open editor"
            >
              <Menu size={15} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 px-3 py-1.5 overflow-x-auto custom-scroll" style={{ borderTop: '1px solid var(--c-border)' }}>
          <button onClick={undo} disabled={!canUndo} className={`${headerBtn} disabled:opacity-30`} style={headerBtnStyle} title="Undo (Ctrl+Z)">
            <Undo2 size={15} />
          </button>
          <button onClick={redo} disabled={!canRedo} className={`${headerBtn} disabled:opacity-30`} style={headerBtnStyle} title="Redo (Ctrl+Shift+Z)">
            <Redo2 size={15} />
          </button>
          <div className="w-px h-5 shrink-0" style={{ background: 'var(--c-border)' }} />
          <button onClick={invoke} className={headerBtn} style={{ ...headerBtnStyle, color: 'var(--c-accent)', borderColor: 'var(--c-accent-border)' }} title="Invoke — generate a random sigil">
            <Wand2 size={15} />
          </button>
          <div className="relative">
            <button onClick={() => setConjureOpen(v => !v)} className={headerBtn} style={{ ...headerBtnStyle, color: 'var(--c-accent)', borderColor: 'var(--c-accent-border)' }} title="Conjure — describe your intent">
              <Sparkles size={15} />
              <span className="hidden sm:inline text-[11px] font-medium">Conjure</span>
            </button>
            {conjureOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setConjureOpen(false)} />
                <div
                  className="absolute left-0 top-full mt-1 z-20 rounded-lg p-3 shadow-xl w-[280px]"
                  style={{ background: 'var(--c-panel)', border: '1px solid var(--c-border-hover)' }}
                >
                  <p className="text-[11px] mb-2 leading-relaxed" style={{ color: 'var(--c-text-muted)' }}>
                    Describe your intent — the circle reads the old tongue: <em>protection, moon, fire, wealth, binding...</em>
                  </p>
                  <input
                    type="text"
                    value={conjureText}
                    onChange={e => setConjureText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') conjure(); }}
                    placeholder="a ward of protection under the moon"
                    className="input-sm mb-2"
                    autoFocus
                  />
                  <button onClick={conjure} className="btn-primary w-full">Conjure</button>
                </div>
              </>
            )}
          </div>
          <button onClick={() => setAnimating(v => !v)} className={headerBtn} style={headerBtnStyle} title={animating ? 'Pause animation' : 'Animate sigil'}>
            {animating ? <Pause size={15} /> : <Play size={15} />}
          </button>
          <button onClick={shareDesign} className={headerBtn} style={shareCopied ? { ...headerBtnStyle, color: 'var(--c-success)', borderColor: 'var(--c-success)' } : headerBtnStyle} title="Copy share link">
            <Share2 size={15} />
            {shareCopied && <span className="text-[11px] font-medium">Copied</span>}
          </button>
          <div className="w-px h-5 shrink-0" style={{ background: 'var(--c-border)' }} />

          {!isInstalled && (canInstall || isIOS) && (
            <div className="relative">
              <button
                onClick={() => {
                  if (isIOS) setIosHintOpen(v => !v);
                  else promptInstall();
                }}
                className={headerBtn}
                style={{ border: '1px solid var(--c-accent-border)', color: 'var(--c-accent)', background: 'var(--c-input-bg)' }}
                title="Install app"
              >
                <Download size={15} />
                <span className="hidden lg:inline text-[11px] font-medium">Install</span>
              </button>
              {isIOS && iosHintOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIosHintOpen(false)} />
                  <div
                    className="absolute right-0 top-full mt-1 z-20 rounded-lg p-3 shadow-xl max-w-[240px]"
                    style={{ background: 'var(--c-panel)', border: '1px solid var(--c-border-hover)' }}
                  >
                    <div className="flex items-start gap-2">
                      <p className="text-[11px] leading-relaxed flex-1" style={{ color: 'var(--c-text-muted)' }}>
                        To install on iOS: tap the <strong style={{ color: 'var(--c-text)' }}>Share</strong> button in Safari, then tap <strong style={{ color: 'var(--c-text)' }}>Add to Home Screen</strong>.
                      </p>
                      <button onClick={() => setIosHintOpen(false)} className="shrink-0">
                        <X size={13} style={{ color: 'var(--c-text-dim)' }} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="relative">
            <button
              onClick={() => setThemeMenuOpen(v => !v)}
              className={headerBtn}
              style={headerBtnStyle}
              title="Switch theme"
            >
              <Palette size={15} />
            </button>
            {themeMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => { setThemeMenuOpen(false); setThemeEditorOpen(false); }} />
                <div
                  className="absolute right-0 top-full mt-1 z-20 rounded-lg py-1 min-w-[220px] shadow-xl max-h-[70vh] overflow-y-auto custom-scroll"
                  style={{ background: 'var(--c-panel)', border: '1px solid var(--c-border-hover)' }}
                >
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => { setDoc(d => ({ ...d, themeId: t.id })); setThemeMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors hover:bg-[var(--c-panel-hover)]"
                      style={{
                        color: t.id === themeId ? 'var(--c-accent)' : 'var(--c-text-muted)',
                        background: t.id === themeId ? 'var(--c-input-bg)' : 'transparent',
                      }}
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ background: t.colors.accent, border: `1px solid ${t.colors.borderHover}` }}
                      />
                      {t.name}
                    </button>
                  ))}

                  {customThemes.length > 0 && (
                    <>
                      <div style={{ borderTop: '1px solid var(--c-border)', marginTop: '4px' }} />
                      <p className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-wider" style={{ color: 'var(--c-text-dim)' }}>Custom</p>
                      {customThemes.map(t => (
                        <div key={t.id} className="flex items-center">
                          <button
                            onClick={() => { setDoc(d => ({ ...d, themeId: t.id })); setThemeMenuOpen(false); }}
                            className="flex-1 flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors hover:bg-[var(--c-panel-hover)]"
                            style={{
                              color: t.id === themeId ? 'var(--c-accent)' : 'var(--c-text-muted)',
                              background: t.id === themeId ? 'var(--c-input-bg)' : 'transparent',
                            }}
                          >
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ background: t.colors.accent, border: `1px solid ${t.colors.borderHover}` }}
                            />
                            {t.name}
                          </button>
                          <button
                            onClick={() => {
                              deleteTheme(t.id);
                              if (themeId === t.id) setDoc(d => ({ ...d, themeId: DEFAULT_THEME_ID }));
                            }}
                            className="p-1.5 mr-2 rounded transition-colors"
                            style={{ color: 'var(--c-text-dim)' }}
                            title="Delete theme"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </>
                  )}

                  <div style={{ borderTop: '1px solid var(--c-border)', marginTop: '4px' }} />
                  {!themeEditorOpen ? (
                    <button
                      onClick={() => setThemeEditorOpen(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors hover:bg-[var(--c-panel-hover)]"
                      style={{ color: 'var(--c-accent)' }}
                    >
                      + Create custom theme
                    </button>
                  ) : (
                    <div className="px-3 py-2 space-y-2">
                      <input
                        type="text"
                        value={newThemeName}
                        onChange={e => setNewThemeName(e.target.value)}
                        placeholder="Theme name..."
                        className="input-sm"
                      />
                      {([['Background', seedBg, setSeedBg], ['Panel', seedPanel, setSeedPanel], ['Text', seedText, setSeedText], ['Accent', seedAccent, setSeedAccent]] as const).map(([label, val, set]) => (
                        <div key={label} className="flex items-center gap-2">
                          <span className="text-[10px] w-16 shrink-0" style={{ color: 'var(--c-text-dim)' }}>{label}</span>
                          <input
                            type="color" value={val}
                            onChange={e => set(e.target.value)}
                            className="w-7 h-7 rounded cursor-pointer bg-transparent"
                            style={{ border: '1px solid var(--c-border)' }}
                          />
                          <span className="text-[10px] font-mono" style={{ color: 'var(--c-text-muted)' }}>{val}</span>
                        </div>
                      ))}
                      <div className="flex gap-1.5 pt-1">
                        <button onClick={handleCreateTheme} className="btn-primary flex-1 text-[11px] py-1.5">Add</button>
                        <button onClick={() => setThemeEditorOpen(false)} className="btn-secondary flex-1 text-[11px] py-1.5">Cancel</button>
                      </div>
                    </div>
                  )}

                  <div style={{ borderTop: '1px solid var(--c-border)', marginTop: '4px' }} />
                  <button
                    onClick={() => setAutoContrast(v => !v)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors hover:bg-[var(--c-panel-hover)]"
                    style={{ color: 'var(--c-text-muted)' }}
                  >
                    <span
                      className="w-3 h-3 rounded-sm shrink-0 flex items-center justify-center"
                      style={{
                        border: '1px solid var(--c-accent-border)',
                        background: autoContrast ? 'var(--c-accent)' : 'transparent',
                      }}
                    >
                      {autoContrast && <span className="text-[8px]" style={{ color: 'var(--c-bg)' }}>✓</span>}
                    </span>
                    Auto-contrast
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setGrimoireOpen(true)}
            className={headerBtn}
            style={headerBtnStyle}
            title="Open Grimoire"
          >
            <BookOpen size={15} />
          </button>
          <button
            onClick={() => setOnboardingOpen(true)}
            className={`${headerBtn} hidden sm:flex`}
            style={headerBtnStyle}
            title="About / help"
          >
            <Info size={15} />
          </button>
          <a
            href={DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={headerBtn}
            style={headerBtnStyle}
            title="Support arcane.circles"
          >
            <Coffee size={15} />
          </a>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {isMobile ? (
          <>
            <main className="flex-1 relative overflow-hidden" style={{ background: 'var(--c-bg)' }}>
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, var(--c-bg) 70%)',
                }}
              />
              <SigilCanvas layers={layers} placements={placements} renderOptions={renderOptions} animate={animating} />
            </main>
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-40 transition-opacity"
                style={{ background: 'rgba(0,0,0,0.5)' }}
                onClick={() => setSidebarOpen(false)}
              />
            )}
            <div
              className="fixed top-0 right-0 h-full w-[420px] max-w-[90vw] z-50 flex flex-col transition-transform duration-300 ease-out"
              style={{
                background: 'var(--c-panel)',
                borderLeft: '1px solid var(--c-border)',
                transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)',
                paddingBottom: 'env(safe-area-inset-bottom)',
              }}
            >
              <Sidebar
                layers={layers}
                placements={placements}
                onLayersChange={l => setDoc(d => ({ ...d, layers: l }), 'layers')}
                onPlacementsChange={p => setDoc(d => ({ ...d, placements: p }), 'placements')}
                onExportSvg={handleExportSvg}
                onExportPng={handleExportPng}
                onApplyPreset={applyPresetById}
                globalRotation={globalRotation}
                onGlobalRotationChange={setGlobalRotation}
                onClose={() => setSidebarOpen(false)}
                isMobile={true}
              />
            </div>
          </>
        ) : (
          <>
            <aside
              className="w-[360px] shrink-0 overflow-hidden flex flex-col"
              style={{ borderRight: '1px solid var(--c-border)', background: 'var(--c-panel)' }}
            >
              <Sidebar
                layers={layers}
                placements={placements}
                onLayersChange={l => setDoc(d => ({ ...d, layers: l }), 'layers')}
                onPlacementsChange={p => setDoc(d => ({ ...d, placements: p }), 'placements')}
                onExportSvg={handleExportSvg}
                onExportPng={handleExportPng}
                onApplyPreset={applyPresetById}
                globalRotation={globalRotation}
                onGlobalRotationChange={setGlobalRotation}
                isMobile={false}
              />
            </aside>

            <main className="flex-1 relative overflow-hidden" style={{ background: 'var(--c-bg)' }}>
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, var(--c-bg) 70%)',
                }}
              />
              <SigilCanvas layers={layers} placements={placements} renderOptions={renderOptions} animate={animating} />
            </main>
          </>
        )}
      </div>

      <GrimoirePanel
        open={grimoireOpen}
        onClose={() => setGrimoireOpen(false)}
        onArchetypeSelect={applyPresetById}
      />
      <Onboarding open={onboardingOpen} onClose={closeOnboarding} />
    </div>
  );
}
