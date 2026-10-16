import { useState, useEffect } from 'react';
import type { AnyLayer, GlyphPlacement } from '@/esoteric/types';

interface SavedDesign {
  id: string;
  name: string;
  layers: AnyLayer[];
  placements: GlyphPlacement[];
  themeId: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'arcane-designs';
const AUTOSAVE_KEY = 'arcane-autosave';

export function useDesignStorage() {
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load designs on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedDesigns(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load designs:', e);
    }
    setLoaded(true);
  }, []);

  // Save to localStorage whenever savedDesigns changes
  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDesigns));
      } catch (e) {
        console.error('Failed to save designs:', e);
      }
    }
  }, [savedDesigns, loaded]);

  const saveDesign = (name: string, layers: AnyLayer[], placements: GlyphPlacement[], themeId: string) => {
    const now = Date.now();
    const newDesign: SavedDesign = {
      id: `design-${now}`,
      name,
      layers,
      placements,
      themeId,
      createdAt: now,
      updatedAt: now,
    };
    setSavedDesigns(prev => [...prev, newDesign]);
    return newDesign.id;
  };

  const updateDesign = (id: string, layers: AnyLayer[], placements: GlyphPlacement[], themeId: string) => {
    setSavedDesigns(prev => prev.map(d =>
      d.id === id
        ? { ...d, layers, placements, themeId, updatedAt: Date.now() }
        : d
    ));
  };

  const deleteDesign = (id: string) => {
    setSavedDesigns(prev => prev.filter(d => d.id !== id));
  };

  const loadDesign = (id: string) => {
    return savedDesigns.find(d => d.id === id);
  };

  const exportDesign = (design: SavedDesign) => {
    const blob = new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${design.name.replace(/[^a-z0-9]/gi, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importDesign = (file: File): Promise<SavedDesign> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const design = JSON.parse(e.target?.result as string);
          // Validate structure
          if (!design.layers || !design.placements) {
            throw new Error('Invalid design file');
          }
          resolve({ ...design, id: `design-${Date.now()}` });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const saveAutosave = (layers: AnyLayer[], placements: GlyphPlacement[], themeId: string) => {
    try {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({
        layers,
        placements,
        themeId,
        timestamp: Date.now(),
      }));
    } catch (e) {
      console.error('Failed to save autosave:', e);
    }
  };

  const loadAutosave = () => {
    try {
      const stored = localStorage.getItem(AUTOSAVE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load autosave:', e);
    }
    return null;
  };

  const clearAutosave = () => {
    try {
      localStorage.removeItem(AUTOSAVE_KEY);
    } catch (e) {
      console.error('Failed to clear autosave:', e);
    }
  };

  return {
    savedDesigns,
    saveDesign,
    updateDesign,
    deleteDesign,
    loadDesign,
    exportDesign,
    importDesign,
    saveAutosave,
    loadAutosave,
    clearAutosave,
  };
}

export type { SavedDesign };
