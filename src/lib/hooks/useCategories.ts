"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { nextAuthApiClient } from "@/lib/api/nextauth-client";
import type { 
  Category, 
  CategoriesResponse, 
  CategoryFilters, 
  CreateCategoryData, 
  UpdateCategoryData 
} from "@/lib/types/categories";
import { convertCategoryFilters } from "@/lib/utils/case-conversion";

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: CategoryFilters) => [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
};

// Hook pour récupérer les catégories avec pagination et filtres
export function useCategoriesAdmin(filters: CategoryFilters = {}) {
  return useQuery({
    queryKey: categoryKeys.list(filters),
    queryFn: async (): Promise<CategoriesResponse> => {
      const params = new URLSearchParams();
      
      // Convertir les filtres en snake_case pour le backend
      const backendFilters = convertCategoryFilters(filters);
      
      Object.entries(backendFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await nextAuthApiClient.get<CategoriesResponse>(
        `/opened/categories?${params.toString()}`
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook pour récupérer une catégorie par ID
export function useCategory(id: number) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async (): Promise<Category> => {
      const response = await nextAuthApiClient.get<{ data: Category }>(
        `/opened/categories/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });
}

// Hook pour créer une catégorie
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryData): Promise<Category> => {
      const response = await nextAuthApiClient.post<{ data: Category }>(
        '/secured/categories',
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      // Invalider toutes les listes de catégories
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
}

// Hook pour mettre à jour une catégorie
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateCategoryData): Promise<Category> => {
      const response = await nextAuthApiClient.put<{ data: Category }>(
        `/secured/categories/${id}`,
        data
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      // Invalider les listes et mettre à jour le détail
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.setQueryData(categoryKeys.detail(data.id), data);
    },
  });
}

// Hook pour supprimer une catégorie
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await nextAuthApiClient.delete(`/secured/categories/${id}`);
    },
    onSuccess: (_, id) => {
      // Invalider les listes et supprimer le détail du cache
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.removeQueries({ queryKey: categoryKeys.detail(id) });
    },
  });
}

// Hook pour suppression en lot
export function useBulkDeleteCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryIds: number[]): Promise<void> => {
      // Supprimer chaque catégorie individuellement
      await Promise.all(
        categoryIds.map(id => 
          nextAuthApiClient.delete(`/secured/categories/${id}`)
        )
      );
    },
    onSuccess: () => {
      // Invalider toutes les requêtes de catégories
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
