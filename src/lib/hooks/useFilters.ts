import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useDebounceValue } from "./useDebounce";
import type { SearchFilters } from "@/lib/api/types";

interface UseFiltersParams {
  baseUrl: string;
  priceRange: [number, number];
}

export function useFilters({ baseUrl, priceRange }: UseFiltersParams) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Debounce price range pour éviter trop de requêtes
  const debouncedPriceRange = useDebounceValue(priceRange, 500);

  // Construire les filtres à partir des paramètres d'URL avec useMemo
  const filters = useMemo((): SearchFilters => {
    const urlFilters: SearchFilters = {
      query: searchParams.get("search") || undefined,
      brands: searchParams.get("brands")?.split(",").map(Number).filter(Boolean) || [],
      availability: (searchParams.get("availability")?.split(",") as (
        | "in_stock"
        | "out_of_stock"
        | "limited"
      )[]) || [],
      sortBy: (searchParams.get("sort_by") as SearchFilters["sortBy"]) || "popularity",
      sortOrder: (searchParams.get("sort_order") as "asc" | "desc") || "desc",
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("per_page")) || 20,
    };

    // Prix avec debounce
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    
    if (minPrice || maxPrice || (debouncedPriceRange[0] > 0 || debouncedPriceRange[1] < 1000)) {
      urlFilters.priceRange = {
        min: minPrice ? Number(minPrice) : debouncedPriceRange[0],
        max: maxPrice ? Number(maxPrice) : debouncedPriceRange[1],
      };
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
          params.set('min_price', priceRange.min.toString());
        } else {
          params.delete('min_price');
        }
        if (priceRange.max < 1000) {
          params.set('max_price', priceRange.max.toString());
        } else {
          params.delete('max_price');
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
    const queryString = params.toString();
    const newUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    router.replace(newUrl, { scroll: false });
  }, [router, searchParams, baseUrl]);

  // Fonction pour réinitialiser tous les filtres
  const clearFilters = useCallback(() => {
    router.replace(baseUrl, { scroll: false });
  }, [router, baseUrl]);

  return {
    filters,
    updateFilters,
    clearFilters,
  };
}
