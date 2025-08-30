import { useCallback, useRef } from 'react';

/**
 * Hook pour debouncer une fonction et éviter les appels multiples rapides
 * @param func La fonction à debouncer
 * @param delay Le délai en millisecondes (défaut: 300ms)
 * @returns La fonction debouncée
 */
export function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 300
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef(false);

  const debouncedFunc = useCallback(
    (...args: Parameters<T>) => {
      // Si déjà en cours de traitement, ignorer
      if (isProcessingRef.current) {
        return;
      }

      // Annuler le timeout précédent
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Créer un nouveau timeout
      timeoutRef.current = setTimeout(async () => {
        isProcessingRef.current = true;
        try {
          await func(...args);
        } finally {
          isProcessingRef.current = false;
        }
      }, delay);
    },
    [func, delay]
  ) as T;

  return debouncedFunc;
}