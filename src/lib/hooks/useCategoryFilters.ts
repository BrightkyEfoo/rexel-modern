import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { SearchFilters } from '@/lib/api/types';
import { useDebounceValue } from './useDebounce';

type SortOption = 'popularity' | 'price' | 'name' | 'newest';

type AvailabilityOption = 'in_stock' | 'out_of_stock' | 'limited';

interface UseCategoryFiltersParams {
  categorySlug: string;
  priceRange: [number, number];
  baseUrl?: string;
}

export function useCategoryFilters({ categorySlug, priceRange, baseUrl }: UseCategoryFiltersParams) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Debounce price range pour éviter trop de requêtes
  const debouncedPriceRange = useDebounceValue(priceRange, 500);

  // Construire les filtres à partir des paramètres d'URL
  const filters = useMemo((): SearchFilters => {
    const urlFilters: SearchFilters = {
      sortBy: (searchParams.get('sort_by') as SortOption) || 'popularity',
      sortOrder: (searchParams.get('sort_order') as 'asc' | 'desc') || 'desc',
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('per_page')) || 20,
      query: searchParams.get('search') || '',
      inStock: searchParams.get('inStock') === 'true',
      search: searchParams.get('search') || '',
    };

    // Marques
    if (searchParams.get('brands')) {
      urlFilters.brands = searchParams.get('brands')?.split(',').map(Number);
    }

    // Prix avec debounce
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    
    if (minPrice || maxPrice || (debouncedPriceRange[0] > 0 || debouncedPriceRange[1] < 1000)) {
      urlFilters.priceRange = {
        min: minPrice ? Number(minPrice) : debouncedPriceRange[0],
        max: maxPrice ? Number(maxPrice) : debouncedPriceRange[1],
      };
    }

    // Stock
    const inStock = searchParams.get('inStock');
    if (inStock !== null) {
      urlFilters.inStock = inStock === 'true';
    }

    // Recherche
    const search = searchParams.get('search');
    if (search) {
      urlFilters.search = search;
    }

    // Disponibilité
    if (searchParams.get('availability')) {
      urlFilters.availability = searchParams.get('availability')?.split(',') as AvailabilityOption[];
    }

    return urlFilters;
  }, [searchParams, debouncedPriceRange]);

  // Fonction pour mettre à jour les filtres dans l'URL
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    const params = new URLSearchParams(searchParams);
    
    // Réinitialiser à la page 1 quand on change les filtres (sauf pagination)
    if (!newFilters.page) {
      params.set('page', '1');
    }

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        params.delete(key === 'sortBy' ? 'sort_by' : key === 'sortOrder' ? 'sort_order' : key === 'limit' ? 'per_page' : key);
      } else if (key === 'sortBy') {
        params.set('sort_by', value.toString());
      } else if (key === 'sortOrder') {
        params.set('sort_order', value.toString());
      } else if (key === 'limit') {
        params.set('per_page', value.toString());
      } else if (key === 'brands' && Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(','));
        } else {
          params.delete(key);
        }
      } else if (key === 'priceRange' && typeof value === 'object') {
        const priceRange = value as { min: number; max: number };
        if (priceRange.min > 0) {
          params.set('minPrice', priceRange.min.toString());
        } else {
          params.delete('minPrice');
        }
        if (priceRange.max < 1000) {
          params.set('maxPrice', priceRange.max.toString());
        } else {
          params.delete('maxPrice');
        }
      } else if (key === 'availability' && Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(','));
        } else {
          params.delete(key);
        }
      } else {
        params.set(key, value.toString());
      }
    });

    // Naviguer vers la nouvelle URL avec les filtres
    const newUrl = `${baseUrl || '/categorie'}/${categorySlug}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [categorySlug, router, searchParams, baseUrl]);

  // Fonction pour réinitialiser tous les filtres
  const clearFilters = useCallback(() => {
    router.replace(`${baseUrl || '/categorie'}/${categorySlug}`, { scroll: false });
  }, [categorySlug, router, baseUrl]);

  return {
    filters,
    updateFilters,
    clearFilters,
  };
}