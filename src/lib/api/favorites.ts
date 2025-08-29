import { nextAuthApi } from './nextauth-client';
import type { ApiResponse, PaginatedResponse } from './types';

export interface Favorite {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    slug: string;
    salePrice?: string;
    imageUrl?: string;
    availability: 'in_stock' | 'out_of_stock';
    brand?: {
      id: string;
      name: string;
    };
    categories?: Array<{
      id: string;
      name: string;
    }>;
    files?: Array<{
      id: string;
      url: string;
      filename: string;
    }>;
  };
}

export interface GetFavoritesOptions {
  page?: number;
  limit?: number;
  sortBy?: 'created_at' | 'product_name';
  sortOrder?: 'asc' | 'desc';
}

export interface FavoriteToggleResponse {
  action: 'added' | 'removed';
  isFavorite: boolean;
  favoriteId?: string;
}

export interface FavoriteCheckResponse {
  isFavorite: boolean;
  favoriteId?: string;
}

/**
 * Récupérer tous les favoris de l'utilisateur connecté
 */
export async function getFavorites(options: GetFavoritesOptions = {}): Promise<PaginatedResponse<Favorite>> {
  try {
    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    const queryString = params.toString();
    const url = queryString ? `/favorites?${queryString}` : '/favorites';

    const response = await nextAuthApi.secured.get<PaginatedResponse<Favorite>>(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
}

/**
 * Ajouter un produit aux favoris
 */
export async function addToFavorites(productId: string): Promise<ApiResponse<Favorite>> {
  try {
    const response = await nextAuthApi.secured.post<ApiResponse<Favorite>>('/favorites', {
      productId: Number(productId)
    });
    return response.data;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
}

/**
 * Retirer un produit des favoris par ID de favori
 */
export async function removeFromFavorites(favoriteId: string): Promise<ApiResponse<void>> {
  try {
    const response = await nextAuthApi.secured.delete<ApiResponse<void>>(`/favorites/${favoriteId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
}

/**
 * Retirer un produit des favoris par ID de produit
 */
export async function removeFromFavoritesByProduct(productId: string): Promise<ApiResponse<void>> {
  try {
    const response = await nextAuthApi.secured.delete<ApiResponse<void>>(`/favorites/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing product from favorites:', error);
    throw error;
  }
}

/**
 * Basculer l'état favori d'un produit (ajouter/retirer)
 */
export async function toggleFavorite(productId: string): Promise<ApiResponse<FavoriteToggleResponse>> {
  try {
    const response = await nextAuthApi.secured.post<ApiResponse<FavoriteToggleResponse>>('/favorites/toggle', {
      productId: Number(productId)
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
}

// Supprimée - on utilise maintenant la liste des favoris pour déterminer le statut

/**
 * Obtenir le nombre total de favoris
 */
export async function getFavoritesCount(): Promise<ApiResponse<{ count: number }>> {
  try {
    const response = await nextAuthApi.secured.get<ApiResponse<{ count: number }>>('/favorites/count');
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites count:', error);
    throw error;
  }
}
