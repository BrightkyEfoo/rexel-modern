import { apiClient } from './client'
import type { ProductActivity } from '../types/product'
import nextAuthApiClient from './nextauth-client'

export interface ActivitiesResponse {
  data: Array<ProductActivity & {
    product: {
      id: number
      name: string
      slug: string
      sku: string | null
      price: number
      imageUrl?: string
      categories?: Array<{ id: number; name: string }>
      brand?: { id: number; name: string }
    }
  }>
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
  message: string
  status: number
  timestamp: string
}

export interface ActivitiesFilters {
  page?: number
  per_page?: number
  user_id?: number
  activity_type?: string
  product_id?: number
}

/**
 * Service API pour la gestion des activités
 * Admin: voit toutes les activités
 * Manager: voit seulement ses propres activités
 */
export const activitiesService = {
  /**
   * Récupère toutes les activités avec pagination et filtres
   */
  getAll: async (filters?: ActivitiesFilters): Promise<ActivitiesResponse> => {
    const response = await nextAuthApiClient.get<ActivitiesResponse>('/secured/activities', {
      params: filters,
    })
    return response.data
  },
}


