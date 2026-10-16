import { useEffect, useRef } from 'react';

export function useDebouncedEffect(
  effect: () => void,
  delay: number,
  deps: React.DependencyList
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const effectRef = useRef(effect);

  useEffect(() => {
    effectRef.current = effect;
  }, [effect]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      effectRef.current();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
}
