"use client";

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
  return useQuery({
    queryKey: productKeys.list(filters),
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
      // Invalider toutes les listes de produits
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
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
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
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
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
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
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
