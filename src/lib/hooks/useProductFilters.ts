"use client";

import { useMemo, useCallback } from "react";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import type { ProductFilters } from "@/lib/types/products";

/**
 * Hook pour gérer les filtres de produits avec nuqs
 * Synchronise l'état des filtres avec l'URL
 */
export function useProductFilters() {
  const [filters, setFilters] = useQueryStates(
    {
      // Pagination
      page: parseAsInteger.withDefault(1),
      per_page: parseAsInteger.withDefault(20),
      
      // Tri
      sort_by: parseAsString.withDefault("created_at"),
      sort_order: parseAsString.withDefault("desc"),
      
      // Recherche et filtres
      search: parseAsString.withDefault(""),
      categoryId: parseAsInteger,
      brandId: parseAsInteger,
      
      // Filtres de prix
      minPrice: parseAsInteger,
      maxPrice: parseAsInteger,
      
      // Filtres booléens
      inStock: parseAsString, // "true", "false", ou undefined
      isFeatured: parseAsString,
      isActive: parseAsString,
    },
    {
      // Options de nuqs
      history: "push", // Utilise pushState pour la navigation
      shallow: true,   // Navigation shallow pour éviter les re-renders complets
      clearOnDefault: true, // Supprime les paramètres qui ont la valeur par défaut
    }
  );

  // Convertir les filtres nuqs en format ProductFilters (stabilisé avec useMemo)
  const productFilters: ProductFilters = useMemo(() => ({
    page: filters.page,
    per_page: filters.per_page,
    sort_by: filters.sort_by as ProductFilters["sort_by"],
    sort_order: filters.sort_order as ProductFilters["sort_order"],
    search: filters.search || undefined,
    categoryId: filters.categoryId || undefined,
    brandId: filters.brandId || undefined,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice || undefined,
    inStock: filters.inStock === "true" ? true : filters.inStock === "false" ? false : undefined,
    isFeatured: filters.isFeatured === "true" ? true : filters.isFeatured === "false" ? false : undefined,
    isActive: filters.isActive === "true" ? true : filters.isActive === "false" ? false : undefined,
  }), [
    filters.page,
    filters.per_page,
    filters.sort_by,
    filters.sort_order,
    filters.search,
    filters.categoryId,
    filters.brandId,
    filters.minPrice,
    filters.maxPrice,
    filters.inStock,
    filters.isFeatured,
    filters.isActive,
  ]);

  // Fonction pour mettre à jour les filtres (stabilisée avec useCallback)
  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    console.log('🔄 updateFilters called with:', newFilters);
    console.log('📊 Current filters before update:', productFilters);
    const nuqsFilters: any = {};
    
    // Convertir les filtres ProductFilters en format nuqs
    Object.entries(newFilters).forEach(([key, value]) => {
      if (key === "inStock" || key === "isFeatured" || key === "isActive") {
        // Gérer les booléens
        nuqsFilters[key] = value === true ? "true" : value === false ? "false" : null;
      } else if (value === null || value === undefined || value === "") {
        // Supprimer les valeurs vides
        nuqsFilters[key] = null;
      } else {
        nuqsFilters[key] = value;
      }
    });
    
    console.log('🔧 Setting filters:', nuqsFilters);
    setFilters(nuqsFilters);
  }, [setFilters]);

  // Fonction pour réinitialiser tous les filtres
  const resetFilters = () => {
    setFilters({
      page: 1,
      per_page: 20,
      sort_by: "created_at",
      sort_order: "desc",
      search: null,
      categoryId: null,
      brandId: null,
      minPrice: null,
      maxPrice: null,
      inStock: null,
      isFeatured: null,
      isActive: null,
    });
  };

  // Fonction pour réinitialiser seulement la pagination
  const resetPagination = () => {
    updateFilters({ page: 1 });
  };

  // Fonction pour réinitialiser seulement les filtres (garder pagination et tri)
  const resetSearchFilters = () => {
    updateFilters({
      search: undefined,
      categoryId: undefined,
      brandId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      inStock: undefined,
      isFeatured: undefined,
      isActive: undefined,
      page: 1, // Reset la pagination aussi
    });
  };

  return {
    filters: productFilters,
    updateFilters,
    resetFilters,
    resetPagination,
    resetSearchFilters,
  };
}
