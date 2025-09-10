"use client"

import { useQueryStates, parseAsInteger, parseAsString, parseAsBoolean } from "nuqs"
import type { SearchParams } from "@/lib/types/search"
import { useMemo } from "react"

/**
 * Hook pour gérer les paramètres de recherche avec nuqs
 * Synchronise l'état des filtres de recherche avec l'URL
 */
export function useSearchFilters() {
  const [filters, setFilters] = useQueryStates(
    {
      // Requête de recherche
      q: parseAsString.withDefault(""),
      
      // Pagination
      page: parseAsInteger.withDefault(1),
      per_page: parseAsInteger.withDefault(20),
      
      // Tri
      sort: parseAsString.withDefault("_score:desc"),
      
      // Type de recherche
      type: parseAsString.withDefault("all"),
      
      // Filtres de produits
      brand_id: parseAsInteger,
      category_ids: parseAsString,
      min_price: parseAsInteger,
      max_price: parseAsInteger,
      is_featured: parseAsBoolean,
      in_stock: parseAsBoolean,
    },
    {
      // Options de nuqs
      history: "push", // Utilise pushState pour la navigation
      shallow: true,   // Navigation shallow pour éviter les re-renders complets
      clearOnDefault: true, // Supprime les paramètres qui ont la valeur par défaut
    }
  )

  // Convertir les filtres nuqs en format SearchParams (stabilisé avec useMemo)
  const searchParams = useMemo((): SearchParams => {
    return {
      q: filters.q || undefined,
      page: filters.page,
      per_page: filters.per_page,
      sort: filters.sort !== "_score:desc" ? filters.sort : undefined,
      type: filters.type !== "all" ? filters.type as any : undefined,
      brand_id: filters.brand_id || undefined,
      category_ids: filters.category_ids || undefined,
      min_price: filters.min_price || undefined,
      max_price: filters.max_price || undefined,
      is_featured: filters.is_featured || undefined,
      in_stock: filters.in_stock || undefined,
    }
  }, [filters])

  // Fonctions utilitaires pour modifier les filtres
  const updateQuery = (query: string) => {
    setFilters({ q: query, page: 1 }) // Reset page quand on change la requête
  }

  const updatePage = (page: number) => {
    setFilters({ page })
  }

  const updateSort = (sort: string) => {
    setFilters({ sort, page: 1 }) // Reset page quand on change le tri
  }

  const updateType = (type: string) => {
    setFilters({ type, page: 1 }) // Reset page quand on change le type
  }

  const updateBrand = (brandId: number | null) => {
    setFilters({ brand_id: brandId, page: 1 })
  }

  const updateCategories = (categoryIds: string | null) => {
    setFilters({ category_ids: categoryIds, page: 1 })
  }

  const updatePriceRange = (minPrice: number | null, maxPrice: number | null) => {
    setFilters({ min_price: minPrice, max_price: maxPrice, page: 1 })
  }

  const updateFeatured = (isFeatured: boolean | null) => {
    setFilters({ is_featured: isFeatured, page: 1 })
  }

  const updateInStock = (inStock: boolean | null) => {
    setFilters({ in_stock: inStock, page: 1 })
  }

  const resetFilters = () => {
    setFilters({
      q: "",
      page: 1,
      per_page: 20,
      sort: "_score:desc",
      type: "all",
      brand_id: null,
      category_ids: null,
      min_price: null,
      max_price: null,
      is_featured: null,
      in_stock: null,
    })
  }

  const resetFiltersKeepQuery = () => {
    setFilters({
      page: 1,
      per_page: 20,
      sort: "_score:desc",
      type: "all",
      brand_id: null,
      category_ids: null,
      min_price: null,
      max_price: null,
      is_featured: null,
      in_stock: null,
    })
  }

  return {
    // État actuel
    filters,
    searchParams,
    
    // Fonctions de mise à jour
    updateQuery,
    updatePage,
    updateSort,
    updateType,
    updateBrand,
    updateCategories,
    updatePriceRange,
    updateFeatured,
    updateInStock,
    resetFilters,
    resetFiltersKeepQuery,
    
    // Fonction générique
    setFilters,
  }
}
