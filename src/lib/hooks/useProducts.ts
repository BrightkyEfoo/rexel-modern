"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { nextAuthApiClient } from "@/lib/api/nextauth-client";
import type { 
  Product, 
  ProductsResponse, 
  ProductFilters, 
  CreateProductData, 
  UpdateProductData 
} from "@/lib/types/products";
import { convertProductFilters } from "@/lib/utils/case-conversion";

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

// Hook pour récupérer les produits avec pagination et filtres
export function useProducts(filters: ProductFilters = {}) {
  console.log('🎯 useProducts called with filters:', filters);
  
  // Stabiliser les filtres pour éviter les re-renders inutiles
  const stableFilters = useMemo(() => {
    // Créer un objet avec seulement les valeurs définies et dans un ordre stable
    const cleanFilters: Record<string, any> = {};
    
    // Utiliser des clés dans un ordre fixe pour éviter les changements de référence
    const orderedKeys = [
      'page', 'per_page', 'sort_by', 'sort_order', 'search', 
      'categoryId', 'brandId', 'minPrice', 'maxPrice',
      'inStock', 'isFeatured', 'isActive'
    ];
    
    for (const key of orderedKeys) {
      const value = filters[key as keyof ProductFilters];
      if (value !== undefined && value !== null && value !== '') {
        cleanFilters[key] = value;
      }
    }
    
    return cleanFilters;
  }, [
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
    filters.isActive
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  return useQuery({
    queryKey: productKeys.list(stableFilters),
    queryFn: async (): Promise<ProductsResponse> => {
      const params = new URLSearchParams();
      
      // Convertir les filtres en snake_case pour le backend
      const backendFilters = convertProductFilters(filters);
      
      Object.entries(backendFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await nextAuthApiClient.get<ProductsResponse>(
        `/opened/products?${params.toString()}`
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Assurer que la requête se lance même si les données sont en cache
    refetchOnMount: true,
    // Éviter les requêtes multiples simultanées
    refetchOnWindowFocus: false,
  });
}

// Hook pour récupérer un produit par ID
export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async (): Promise<Product> => {
      const response = await nextAuthApiClient.get<{ data: Product }>(
        `/opened/products/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });
}

// Hook pour créer un produit
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductData): Promise<Product> => {
      const response = await nextAuthApiClient.post<{ data: Product }>(
        '/secured/products',
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      // Invalider toutes les listes de produits mais préserver les filtres actuels
      queryClient.invalidateQueries({ 
        queryKey: productKeys.lists(),
        // Refetch en arrière-plan pour éviter les interruptions
        refetchType: 'active'
      });
    },
  });
}

// Hook pour mettre à jour un produit
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateProductData): Promise<Product> => {
      const response = await nextAuthApiClient.put<{ data: Product }>(
        `/secured/products/${id}`,
        data
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      // Invalider les listes et mettre à jour le détail
      queryClient.invalidateQueries({ 
        queryKey: productKeys.lists(),
        refetchType: 'active'
      });
      queryClient.setQueryData(productKeys.detail(data.id), data);
    },
  });
}

// Hook pour supprimer un produit
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await nextAuthApiClient.delete(`/secured/products/${id}`);
    },
    onSuccess: (_, id) => {
      // Invalider les listes et supprimer le détail du cache
      queryClient.invalidateQueries({ 
        queryKey: productKeys.lists(),
        refetchType: 'active'
      });
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
    },
  });
}

// Hook pour suppression en lot
export function useBulkDeleteProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productIds: number[]): Promise<void> => {
      // Supprimer chaque produit individuellement
      await Promise.all(
        productIds.map(id => 
          nextAuthApiClient.delete(`/secured/products/${id}`)
        )
      );
    },
    onSuccess: () => {
      // Invalider toutes les requêtes de produits
      queryClient.invalidateQueries({ 
        queryKey: productKeys.all,
        refetchType: 'active'
      });
    },
  });
}
