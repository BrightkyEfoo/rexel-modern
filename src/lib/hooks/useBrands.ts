"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { nextAuthApiClient } from "@/lib/api/nextauth-client";
import type { 
  Brand, 
  BrandsResponse, 
  BrandFilters, 
  CreateBrandData, 
  UpdateBrandData 
} from "@/lib/types/brands";
import { convertBrandFilters } from "@/lib/utils/case-conversion";

// Query keys
export const brandKeys = {
  all: ['brands'] as const,
  lists: () => [...brandKeys.all, 'list'] as const,
  list: (filters: BrandFilters) => [...brandKeys.lists(), filters] as const,
  details: () => [...brandKeys.all, 'detail'] as const,
  detail: (id: number) => [...brandKeys.details(), id] as const,
};

// Hook pour récupérer les marques avec pagination et filtres
export function useBrandsAdmin(filters: BrandFilters = {}) {
  return useQuery({
    queryKey: brandKeys.list(filters),
    queryFn: async (): Promise<BrandsResponse> => {
      const params = new URLSearchParams();
      
      // Convertir les filtres en snake_case pour le backend
      const backendFilters = convertBrandFilters(filters);
      
      Object.entries(backendFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await nextAuthApiClient.get<BrandsResponse>(
        `/opened/brands?${params.toString()}`
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook pour récupérer une marque par ID
export function useBrand(id: number) {
  return useQuery({
    queryKey: brandKeys.detail(id),
    queryFn: async (): Promise<Brand> => {
      const response = await nextAuthApiClient.get<{ data: Brand }>(
        `/opened/brands/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });
}

// Hook pour créer une marque
export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBrandData): Promise<Brand> => {
      const response = await nextAuthApiClient.post<{ data: Brand }>(
        '/secured/brands',
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      // Invalider toutes les listes de marques
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
    },
  });
}

// Hook pour mettre à jour une marque
export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateBrandData): Promise<Brand> => {
      const response = await nextAuthApiClient.put<{ data: Brand }>(
        `/secured/brands/${id}`,
        data
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      // Invalider les listes et mettre à jour le détail
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.setQueryData(brandKeys.detail(data.id), data);
    },
  });
}

// Hook pour supprimer une marque
export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await nextAuthApiClient.delete(`/secured/brands/${id}`);
    },
    onSuccess: (_, id) => {
      // Invalider les listes et supprimer le détail du cache
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.removeQueries({ queryKey: brandKeys.detail(id) });
    },
  });
}

// Hook pour suppression en lot
export function useBulkDeleteBrands() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (brandIds: number[]): Promise<void> => {
      // Supprimer chaque marque individuellement
      await Promise.all(
        brandIds.map(id => 
          nextAuthApiClient.delete(`/secured/brands/${id}`)
        )
      );
    },
    onSuccess: () => {
      // Invalider toutes les requêtes de marques
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
    },
  });
}
