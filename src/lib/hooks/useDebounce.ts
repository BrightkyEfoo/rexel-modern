import { useState, useEffect } from 'react';

/**
 * Hook pour debouncer une valeur
 * Retarde la mise à jour d'une valeur jusqu'à ce qu'elle reste stable pendant un délai donné
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Créer un timer qui met à jour la valeur debouncée après le délai
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Nettoyer le timeout si value change avant la fin du délai
    // Cela garantit que la valeur debouncée n'est mise à jour que si
    // la valeur d'entrée reste inchangée pendant le délai spécifié
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook pour debouncer une fonction
 * Utile pour limiter le nombre d'appels à une fonction coûteuse
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  return ((...args: Parameters<T>) => {
    // Annuler le timer précédent
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Créer un nouveau timer
    const newTimer = setTimeout(() => {
      callback(...args);
    }, delay);

    setDebounceTimer(newTimer);
  }) as T;
}