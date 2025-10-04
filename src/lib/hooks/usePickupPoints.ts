"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { nextAuthApiClient } from "@/lib/api/nextauth-client";
import type { 
  PickupPoint, 
  PickupPointsResponse, 
  PickupPointFilters, 
  CreatePickupPointData, 
  UpdatePickupPointData,
  PickupPointStats,
  CountryManager,
  CountryPickupPointsResponse
} from "@/lib/types/pickup-points";
import { pickupPointsService } from "@/lib/api/services";

// Query keys
export const pickupPointKeys = {
  all: ['pickup-points'] as const,
  lists: () => [...pickupPointKeys.all, 'list'] as const,
  list: (filters: PickupPointFilters) => [...pickupPointKeys.lists(), filters] as const,
  details: () => [...pickupPointKeys.all, 'detail'] as const,
  detail: (slug: string) => [...pickupPointKeys.details(), slug] as const,
  search: (query: string) => [...pickupPointKeys.all, 'search', query] as const,
  stats: () => [...pickupPointKeys.all, 'stats'] as const,
  country: (countryCode: string) => [...pickupPointKeys.all, 'country', countryCode] as const,
  countryManager: (countryCode: string) => ['country-managers', countryCode] as const,
  countryWithManager: (countryCode: string) => [...pickupPointKeys.all, 'country-with-manager', countryCode] as const,
};

// Hook pour récupérer les points de relais publics
export function usePickupPoints() {
  return useQuery({
    queryKey: pickupPointKeys.all,
    queryFn: () => pickupPointsService.getPickupPoints(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Hook pour récupérer les points de relais avec filtres (admin)
export function usePickupPointsAdmin(filters: PickupPointFilters = {}) {
  return useQuery({
    queryKey: pickupPointKeys.list(filters),
    queryFn: () => pickupPointsService.getPickupPointsAdmin(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook pour récupérer un point de relais par slug
export function usePickupPoint(slug: string) {
  return useQuery({
    queryKey: pickupPointKeys.detail(slug),
    queryFn: () => pickupPointsService.getPickupPoint(slug),
    enabled: !!slug,
  });
}

// Hook pour rechercher des points de relais
export function useSearchPickupPoints(query: string) {
  return useQuery({
    queryKey: pickupPointKeys.search(query),
    queryFn: () => pickupPointsService.searchPickupPoints(query),
    enabled: !!query && query.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook pour récupérer les statistiques des points de relais
export function usePickupPointStats() {
  return useQuery({
    queryKey: pickupPointKeys.stats(),
    queryFn: () => pickupPointsService.getPickupPointStats(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Hook pour créer un point de relais
export function useCreatePickupPoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePickupPointData): Promise<PickupPoint> => {
      const response = await pickupPointsService.createPickupPoint(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalider toutes les listes de points de relais
      queryClient.invalidateQueries({ queryKey: pickupPointKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pickupPointKeys.stats() });
      queryClient.invalidateQueries({ queryKey: pickupPointKeys.all });
      // Invalider les activités pour afficher la nouvelle création
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}

// Hook pour mettre à jour un point de relais
export function useUpdatePickupPoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdatePickupPointData): Promise<PickupPoint> => {
      const response = await pickupPointsService.updatePickupPoint(id, data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalider les listes et mettre à jour le détail
      queryClient.invalidateQueries({ queryKey: pickupPointKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pickupPointKeys.stats() });
      queryClient.invalidateQueries({ queryKey: pickupPointKeys.all });
      // Invalider les activités pour afficher la modification
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      // Mettre à jour le cache du détail si on a le slug
      if (data.slug) {
        queryClient.setQueryData(pickupPointKeys.detail(data.slug), { data });
      }
    },
  });
}

// Hook pour supprimer un point de relais
export function useDeletePickupPoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await pickupPointsService.deletePickupPoint(id);
    },
    onSuccess: (_, id) => {
      // Invalider les listes et supprimer le détail du cache
      queryClient.invalidateQueries({ queryKey: pickupPointKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pickupPointKeys.stats() });
      queryClient.invalidateQueries({ queryKey: pickupPointKeys.all });
      // Invalider les activités pour afficher la suppression
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      // On ne peut pas supprimer le cache du détail car on n'a que l'ID
    },
  });
}

// Hook pour suppression en lot
export function useBulkDeletePickupPoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pickupPointIds: number[]): Promise<void> => {
      // Supprimer chaque point de relais individuellement
      await Promise.all(
        pickupPointIds.map(id => 
          pickupPointsService.deletePickupPoint(id)
        )
      );
    },
    onSuccess: () => {
      // Invalider toutes les requêtes de points de relais
      queryClient.invalidateQueries({ queryKey: pickupPointKeys.all });
      // Invalider les activités
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}

// Hook pour récupérer les points de relais par pays
export function usePickupPointsByCountry(countryCode: string) {
  return useQuery({
    queryKey: pickupPointKeys.country(countryCode),
    queryFn: () => pickupPointsService.getPickupPointsByCountry(countryCode),
    enabled: !!countryCode,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Hook pour récupérer le manager d'un pays
export function useCountryManager(countryCode: string) {
  return useQuery({
    queryKey: pickupPointKeys.countryManager(countryCode),
    queryFn: () => pickupPointsService.getCountryManager(countryCode),
    enabled: !!countryCode,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Hook pour récupérer les points de relais d'un pays avec le manager
export function useCountryPickupPointsWithManager(countryCode: string) {
  return useQuery({
    queryKey: pickupPointKeys.countryWithManager(countryCode),
    queryFn: () => pickupPointsService.getCountryPickupPointsWithManager(countryCode),
    enabled: !!countryCode,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
