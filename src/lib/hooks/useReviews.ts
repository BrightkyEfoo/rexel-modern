"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { reviewsService, type CreateReviewData, type UpdateReviewData } from "../api/services/reviews"
import { queryKeys } from "../query/hooks"

// Hook pour récupérer les avis d'un produit
export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: [...queryKeys.product(productId), 'reviews'],
    queryFn: () => reviewsService.getProductReviews(productId),
    enabled: !!productId,
  })
}

// Hook pour récupérer les statistiques des avis d'un produit
export function useProductReviewStats(productId: string) {
  return useQuery({
    queryKey: [...queryKeys.product(productId), 'reviews', 'stats'],
    queryFn: () => reviewsService.getProductReviewStats(productId),
    enabled: !!productId,
  })
}

// Hook pour créer un avis
export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateReviewData) => reviewsService.createReview(data),
    onSuccess: (_, variables) => {
      // Invalider les avis du produit
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.product(variables.productId.toString()), 'reviews'],
      })
      // Invalider les statistiques
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.product(variables.productId.toString()), 'reviews', 'stats'],
      })
      // Invalider les avis récents
      queryClient.invalidateQueries({
        queryKey: ['reviews', 'recent'],
      })
    },
  })
}

// Hook pour mettre à jour un avis
export function useUpdateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReviewData }) =>
      reviewsService.updateReview(id, data),
    onSuccess: (_, variables) => {
      // Invalider toutes les requêtes d'avis
      queryClient.invalidateQueries({
        queryKey: ['products', 'reviews'],
      })
      // Invalider les avis récents
      queryClient.invalidateQueries({
        queryKey: ['reviews', 'recent'],
      })
    },
  })
}

// Hook pour supprimer un avis
export function useDeleteReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => reviewsService.deleteReview(id),
    onSuccess: () => {
      // Invalider toutes les requêtes d'avis
      queryClient.invalidateQueries({
        queryKey: ['products', 'reviews'],
      })
      // Invalider les avis récents
      queryClient.invalidateQueries({
        queryKey: ['reviews', 'recent'],
      })
    },
  })
}

// Hook pour marquer un avis comme utile
export function useMarkReviewHelpful() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => reviewsService.markReviewHelpful(id),
    onSuccess: () => {
      // Invalider toutes les requêtes d'avis
      queryClient.invalidateQueries({
        queryKey: ['products', 'reviews'],
      })
    },
  })
}
