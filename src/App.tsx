import { useState, useCallback, useEffect } from 'react';
import type { AnyLayer, GlyphPlacement } from '@/esoteric/types';
import { ARCHETYPES, clonePreset } from '@/esoteric/archetypes';
import { downloadSvg, downloadPng } from '@/esoteric/svgUtils';
import { THEMES, getTheme, applyTheme, DEFAULT_THEME_ID } from '@/esoteric/theme';
import Sidebar from '@/components/Sidebar';
import SigilCanvas from '@/components/SigilCanvas';
import GrimoirePanel from '@/components/GrimoirePanel';
import { Circle, BookOpen, Palette, Download, X, Menu } from 'lucide-react';
import { usePwaInstall } from '@/hooks/usePwaInstall';
import { useDesignStorage } from '@/hooks/useDesignStorage';
import { useDebouncedEffect } from '@/hooks/useDebouncedEffect';

export default function App() {
  const initial = clonePreset(ARCHETYPES[0]);
  const [layers, setLayers] = useState<AnyLayer[]>(initial.layers);
  const [placements, setPlacements] = useState<GlyphPlacement[]>(initial.glyphPlacements);
  const [grimoireOpen, setGrimoireOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [themeId, setThemeId] = useState(DEFAULT_THEME_ID);
  const [iosHintOpen, setIosHintOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { canInstall, isInstalled, isIOS, promptInstall } = usePwaInstall();
  const { saveAutosave, loadAutosave } = useDesignStorage();

  useEffect(() => {
    applyTheme(getTheme(themeId));
  }, [themeId]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-save with debouncing
  useDebouncedEffect(() => {
    saveAutosave(layers, placements, themeId);
  }, 1000, [layers, placements, themeId]);

  // Load autosave on mount if available
  useEffect(() => {
    const autosave = loadAutosave();
    if (autosave) {
      setLayers(autosave.layers);
      setPlacements(autosave.placements);
      setThemeId(autosave.themeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExportSvg = useCallback(() => downloadSvg(layers, placements), [layers, placements]);
  const handleExportPng = useCallback(() => downloadPng(layers, placements), [layers, placements]);

  const applyPresetById = useCallback((id: string) => {
    const preset = ARCHETYPES.find(p => p.id === id);
    if (!preset) return;
    const cloned = clonePreset(preset);
    setLayers(cloned.layers);
    setPlacements(cloned.glyphPlacements);
  }, []);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: 'var(--c-bg)', color: 'var(--c-text)' }}
    >
      <header
        className="flex items-center gap-3 px-5 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--c-border)', background: 'var(--c-panel)' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              border: `2px solid var(--c-accent)`,
              background: 'color-mix(in srgb, var(--c-accent) 12%, transparent)',
            }}
          >
            <Circle size={16} style={{ color: 'var(--c-accent)' }} />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide" style={{ color: 'var(--c-text)' }}>
              Arcane.io
            </h1>
            <p className="text-[10px] tracking-wider uppercase" style={{ color: 'var(--c-text-dim)' }}>
              Procedural Sigil & Circle Engine · Vector Output
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md transition-colors"
              style={{ border: '1px solid var(--c-border)', color: 'var(--c-text-muted)' }}
              title="Open editor"
            >
              <Menu size={15} />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono mr-2" style={{ color: 'var(--c-text-dim)' }}>
            <span>{layers.length} layers</span>
            <span>·</span>
            <span>{placements.length} glyphs</span>
          </div>

          {!isInstalled && (canInstall || isIOS) && (
            <div className="relative">
              <button
                onClick={() => {
                  if (isIOS) setIosHintOpen(v => !v);
                  else promptInstall();
                }}
                className="p-2 rounded-md transition-colors flex items-center gap-1.5"
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
              className="p-2 rounded-md transition-colors flex items-center gap-1.5"
              style={{ border: '1px solid var(--c-border)', color: 'var(--c-text-muted)' }}
              title="Switch theme"
            >
              <Palette size={15} />
            </button>
            {themeMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setThemeMenuOpen(false)} />
                <div
                  className="absolute right-0 top-full mt-1 z-20 rounded-lg py-1 min-w-[160px] shadow-xl"
                  style={{ background: 'var(--c-panel)', border: '1px solid var(--c-border-hover)' }}
                >
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => { setThemeId(t.id); setThemeMenuOpen(false); }}
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
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setGrimoireOpen(true)}
            className="p-2 rounded-md transition-colors flex items-center"
            style={{ border: '1px solid var(--c-border)', color: 'var(--c-text-muted)' }}
            title="Open Grimoire"
          >
            <BookOpen size={15} />
          </button>
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
              <SigilCanvas layers={layers} placements={placements} />
            </main>
            {sidebarOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/50"
                  onClick={() => setSidebarOpen(false)}
                />
                <div
                  className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl transition-transform"
                  style={{
                    maxHeight: '85vh',
                    background: 'var(--c-panel)',
                    borderTop: '1px solid var(--c-border)',
                    paddingBottom: 'env(safe-area-inset-bottom)',
                  }}
                >
                  <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3 mb-2" />
                  <div className="overflow-hidden flex flex-col" style={{ maxHeight: 'calc(85vh - 24px)' }}>
                    <Sidebar
                      layers={layers}
                      placements={placements}
                      onLayersChange={setLayers}
                      onPlacementsChange={setPlacements}
                      onExportSvg={handleExportSvg}
                      onExportPng={handleExportPng}
                      onApplyPreset={applyPresetById}
                      onClose={() => setSidebarOpen(false)}
                      isMobile={true}
                    />
                  </div>
                </div>
              </>
            )}
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
                onLayersChange={setLayers}
                onPlacementsChange={setPlacements}
                onExportSvg={handleExportSvg}
                onExportPng={handleExportPng}
                onApplyPreset={applyPresetById}
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
              <SigilCanvas layers={layers} placements={placements} />
            </main>
          </>
        )}
      </div>

      <GrimoirePanel
        open={grimoireOpen}
        onClose={() => setGrimoireOpen(false)}
        onArchetypeSelect={applyPresetById}
      />
    </div>
  );
}
