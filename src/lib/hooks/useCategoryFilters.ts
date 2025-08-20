import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { SearchFilters } from '@/lib/api/types';
import { useDebounce } from './useDebounce';

type SortOption = 'popularity' | 'price' | 'name' | 'newest';

type AvailabilityOption = 'in_stock' | 'out_of_stock' | 'limited';

interface UseCategoryFiltersParams {
  categorySlug: string;
  priceRange: [number, number];
}

export function useCategoryFilters({ categorySlug, priceRange }: UseCategoryFiltersParams) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Debounce price range pour éviter trop de requêtes
  const debouncedPriceRange = useDebounce(priceRange, 500);

  // Construire les filtres à partir des paramètres d'URL
  const filters = useMemo((): SearchFilters => {
    const urlFilters: SearchFilters = {
      sortBy: (searchParams.get('sort') as SortOption) || 'popularity',
      sortOrder: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 20,
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
        params.delete(key);
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
    const newUrl = `/categorie/${categorySlug}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [categorySlug, router, searchParams]);

  // Fonction pour réinitialiser tous les filtres
  const clearFilters = useCallback(() => {
    router.replace(`/categorie/${categorySlug}`, { scroll: false });
  }, [categorySlug, router]);

  return {
    filters,
    updateFilters,
    clearFilters,
  };
}
