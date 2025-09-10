"use client"

import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { searchService } from '@/lib/api/search'
import type { SearchParams, SearchOptions } from '@/lib/types/search'

// Clés de requête pour React Query
export const searchKeys = {
  all: ['search'] as const,
  global: (query: string, options?: SearchOptions) => [...searchKeys.all, 'global', query, options] as const,
  autocomplete: (query: string, collections?: string[]) => [...searchKeys.all, 'autocomplete', query, collections] as const,
  products: (params: SearchParams) => [...searchKeys.all, 'products', params] as const,
  categories: (params: SearchParams) => [...searchKeys.all, 'categories', params] as const,
  brands: (params: SearchParams) => [...searchKeys.all, 'brands', params] as const,
}

/**
 * Hook pour la recherche globale
 */
export function useGlobalSearch(query: string, options: SearchOptions = {}) {
  // Debounce la requête pour éviter trop d'appels API
  const [debouncedQuery] = useDebounce(query, 300)

  return useQuery({
    queryKey: searchKeys.global(debouncedQuery, options),
    queryFn: () => searchService.search(debouncedQuery, options),
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook pour l'autocomplétion (utilisé dans la barre de recherche)
 */
export function useAutocomplete(query: string, collections: string[] = ['products', 'categories', 'brands']) {
  // Debounce plus court pour l'autocomplétion
  const [debouncedQuery] = useDebounce(query, 200)

  return useQuery({
    queryKey: searchKeys.autocomplete(debouncedQuery, collections),
    queryFn: () => searchService.autocomplete(debouncedQuery, collections),
    enabled: debouncedQuery.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Hook pour la recherche de produits avec pagination
 */
export function useProductSearch(params: SearchParams) {
  // Debounce seulement si on a une requête de recherche
  const [debouncedQuery] = useDebounce(params.q || '', 300)
  
  const searchParams = {
    ...params,
    q: debouncedQuery
  }

  return useQuery({
    queryKey: searchKeys.products(searchParams),
    queryFn: () => searchService.searchProducts(searchParams),
    enabled: !params.q || debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook pour la recherche de catégories
 */
export function useCategorySearch(params: SearchParams) {
  const [debouncedQuery] = useDebounce(params.q || '', 300)
  
  const searchParams = {
    ...params,
    q: debouncedQuery
  }

  return useQuery({
    queryKey: searchKeys.categories(searchParams),
    queryFn: () => searchService.searchCategories(searchParams),
    enabled: !params.q || debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook pour la recherche de marques
 */
export function useBrandSearch(params: SearchParams) {
  const [debouncedQuery] = useDebounce(params.q || '', 300)
  
  const searchParams = {
    ...params,
    q: debouncedQuery
  }

  return useQuery({
    queryKey: searchKeys.brands(searchParams),
    queryFn: () => searchService.searchBrands(searchParams),
    enabled: !params.q || debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook pour gérer l'état de la recherche avec nuqs
 */
export function useSearchParams() {
  // Ce hook sera implémenté avec nuqs dans le composant de recherche
  // Il permettra de synchroniser les paramètres de recherche avec l'URL
}

/**
 * Hook pour vérifier la santé du service de recherche
 */
export function useSearchHealth() {
  return useQuery({
    queryKey: [...searchKeys.all, 'health'],
    queryFn: () => searchService.health(),
    staleTime: 30 * 1000, // 30 secondes
    retry: 3,
  })
}
