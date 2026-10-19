import { useRef, useState, useCallback } from 'react';
import type { AnyLayer, GlyphPlacement } from '@/esoteric/types';

export interface Doc {
  layers: AnyLayer[];
  placements: GlyphPlacement[];
  themeId: string;
}

const MAX_HISTORY = 100;
const COALESCE_MS = 800;

/**
 * Undoable document state. `setDoc` accepts an optional coalesce key —
 * rapid successive edits with the same key (e.g. a slider drag) collapse
 * into a single history entry.
 */
export function useDocHistory(initial: Doc) {
  const [doc, setDocState] = useState<Doc>(initial);
  const [pastCount, setPastCount] = useState(0);
  const [futureCount, setFutureCount] = useState(0);
  const past = useRef<Doc[]>([]);
  const future = useRef<Doc[]>([]);
  const lastEdit = useRef<{ key: string; time: number } | null>(null);

  const setDoc = useCallback((updater: Doc | ((d: Doc) => Doc), coalesceKey?: string) => {
    setDocState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const now = Date.now();
      const coalesce =
        coalesceKey !== undefined &&
        lastEdit.current?.key === coalesceKey &&
        now - lastEdit.current.time < COALESCE_MS;
      if (!coalesce) {
        past.current.push(prev);
        if (past.current.length > MAX_HISTORY) past.current.shift();
        future.current = [];
        setPastCount(past.current.length);
        setFutureCount(0);
      }
      lastEdit.current = coalesceKey !== undefined ? { key: coalesceKey, time: now } : null;
      return next;
    });
  }, []);

  const replaceDoc = useCallback((next: Doc) => {
    lastEdit.current = null;
    past.current = [];
    future.current = [];
    setPastCount(0);
    setFutureCount(0);
    setDocState(next);
  }, []);

  const undo = useCallback(() => {
    lastEdit.current = null;
    setDocState(prev => {
      const prior = past.current.pop();
      if (!prior) return prev;
      future.current.push(prev);
      setPastCount(past.current.length);
      setFutureCount(future.current.length);
      return prior;
    });
  }, []);

  const redo = useCallback(() => {
    lastEdit.current = null;
    setDocState(prev => {
      const next = future.current.pop();
      if (!next) return prev;
      past.current.push(prev);
      setPastCount(past.current.length);
      setFutureCount(future.current.length);
      return next;
    });
  }, []);

  return { doc, setDoc, replaceDoc, undo, redo, canUndo: pastCount > 0, canRedo: futureCount > 0 };
}
