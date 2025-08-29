import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  removeFromFavoritesByProduct,
  toggleFavorite,
  getFavoritesCount,
  type GetFavoritesOptions,
  type Favorite,
} from "@/lib/api/favorites";

// Query keys
export const favoritesQueryKeys = {
  all: ["favorites"] as const,
  lists: () => [...favoritesQueryKeys.all, "list"] as const,
  list: (options: GetFavoritesOptions) =>
    [...favoritesQueryKeys.lists(), options] as const,
  count: () => [...favoritesQueryKeys.all, "count"] as const,
};

/**
 * Hook pour récupérer les favoris avec pagination et tri
 */
export function useFavorites(options: GetFavoritesOptions = {}) {
  return useQuery({
    queryKey: favoritesQueryKeys.list(options),
    queryFn: () => getFavorites(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour récupérer le nombre total de favoris
 */
export function useFavoritesCount() {
  return useQuery({
    queryKey: favoritesQueryKeys.count(),
    queryFn: getFavoritesCount,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour ajouter un produit aux favoris
 */
export function useAddToFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToFavorites,
    onSuccess: () => {
      // Invalider toutes les requêtes de favoris
      queryClient.invalidateQueries({ queryKey: favoritesQueryKeys.all });
    },
    onError: (error) => {
      console.error("Error adding to favorites:", error);
    },
  });
}

/**
 * Hook pour retirer un produit des favoris par ID de favori
 */
export function useRemoveFromFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromFavorites,
    onSuccess: () => {
      // Invalider toutes les requêtes de favoris
      queryClient.invalidateQueries({ queryKey: favoritesQueryKeys.all });
    },
    onError: (error) => {
      console.error("Error removing from favorites:", error);
    },
  });
}

/**
 * Hook pour retirer un produit des favoris par ID de produit
 */
export function useRemoveFromFavoritesByProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromFavoritesByProduct,
    onSuccess: () => {
      // Invalider toutes les requêtes de favoris
      queryClient.invalidateQueries({ queryKey: favoritesQueryKeys.all });
    },
    onError: (error) => {
      console.error("Error removing product from favorites:", error);
    },
  });
}

/**
 * Hook pour basculer l'état favori d'un produit
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFavorite,
    onSuccess: () => {
      // Invalider toutes les requêtes de favoris pour forcer un refetch
      queryClient.invalidateQueries({ queryKey: favoritesQueryKeys.all });
    },
    onError: (error) => {
      console.error("Error toggling favorite:", error);
    },
  });
}

/**
 * Hook utilitaire pour gérer les favoris sur les cartes produits
 * Utilise la liste des favoris pour déterminer le statut
 */
export function useProductFavoriteStatus(productId?: string) {
  const { data: favoritesData } = useFavorites();

  const toggleMutation = useToggleFavorite();

  // Chercher si le produit est dans les favoris
  const favorites = favoritesData?.data || [];
  const isFavorite = favorites.some(
    (fav: Favorite) =>
      Number(fav.product?.id) === Number(productId) ||
      Number(fav.productId) === Number(productId)
  );

  const toggle = async () => {
    try {
      await toggleMutation.mutateAsync(productId || "");
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  };

  return {
    isFavorite,
    isLoading: toggleMutation.isPending,
    toggle,
  };
}
