import { nextAuthApiClient } from "../nextauth-client";
import type { ProductReview } from "../types";

export interface CreateReviewData {
  productId: number;
  rating: number;
  title: string;
  comment: string;
}

export interface UpdateReviewData {
  rating: number;
  title: string;
  comment: string;
}

export interface ReviewStats {
  total: number;
  averageRating: number;
  ratingCounts: Array<{
    rating: number;
    count: number;
    percentage: number;
  }>;
}

export interface ReviewsResponse {
  data: ProductReview[];
  meta: ReviewStats;
}

export const reviewsService = {
  // Récupérer tous les avis d'un produit
  async getProductReviews(productId: string): Promise<ReviewsResponse> {
    const response = await nextAuthApiClient.get<ReviewsResponse>(
      `/opened/products/${productId}/reviews`
    );
    return response.data;
  },

  // Récupérer les statistiques des avis d'un produit
  async getProductReviewStats(
    productId: string
  ): Promise<{ data: ReviewStats }> {
    const response = await nextAuthApiClient.get<{ data: ReviewStats }>(
      `/opened/products/${productId}/reviews/stats`
    );
    return response.data;
  },

  // Créer un nouvel avis
  async createReview(
    data: CreateReviewData
  ): Promise<{ data: ProductReview; message: string }> {
    const response = await nextAuthApiClient.post<{
      data: ProductReview;
      message: string;
    }>("/secured/reviews", data);
    return response.data;
  },

  // Mettre à jour un avis
  async updateReview(
    id: string,
    data: UpdateReviewData
  ): Promise<{ data: ProductReview; message: string }> {
    const response = await nextAuthApiClient.put<{
      data: ProductReview;
      message: string;
    }>(`/secured/reviews/${id}`, data);
    return response.data;
  },

  // Supprimer un avis
  async deleteReview(id: string): Promise<{ message: string }> {
    const response = await nextAuthApiClient.delete<{ message: string }>(
      `/secured/reviews/${id}`
    );
    return response.data;
  },

  // Marquer un avis comme utile
  async markReviewHelpful(
    id: string
  ): Promise<{ data: { helpfulCount: number }; message: string }> {
    const response = await nextAuthApiClient.post<{
      data: { helpfulCount: number };
      message: string;
    }>(`/secured/reviews/${id}/helpful`);
    return response.data;
  },
};
