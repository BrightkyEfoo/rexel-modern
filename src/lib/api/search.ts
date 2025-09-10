import { ApiClient } from './client'
import type { 
  MultiSearchResult, 
  SearchResult, 
  SearchOptions,
  SearchParams 
} from '@/lib/types/search'
import type { ApiResponse } from './types'

export class SearchService {
  private client: ApiClient

  constructor() {
    this.client = new ApiClient()
  }

  /**
   * Recherche globale dans toutes les collections
   */
  async search(query: string, options: SearchOptions = {}): Promise<MultiSearchResult> {
    const params = new URLSearchParams({
      q: query,
      limit: (options.per_page || 20).toString(),
    })

    if (options.collections) {
      params.append('collections', options.collections.join(','))
    }

    const response = await this.client.get<MultiSearchResult>(
      `/api/v1/opened/search?${params.toString()}`
    )
    
    return response.data
  }

  /**
   * Autocomplétion pour la barre de recherche (5 résultats max)
   */
  async autocomplete(query: string, collections: string[] = ['products', 'categories', 'brands']): Promise<MultiSearchResult> {
    const params = new URLSearchParams({
      q: query,
      collections: collections.join(',')
    })

    const response = await this.client.get<MultiSearchResult>(
      `/api/v1/opened/search/autocomplete?${params.toString()}`
    )
    
    return response.data
  }

  /**
   * Recherche dans les produits avec pagination et filtres
   */
  async searchProducts(params: SearchParams): Promise<SearchResult> {
    const searchParams = new URLSearchParams()
    
    if (params.q) searchParams.append('q', params.q)
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.per_page) searchParams.append('per_page', params.per_page.toString())
    if (params.sort) searchParams.append('sort_by', params.sort)
    if (params.brand_id) searchParams.append('brand_id', params.brand_id.toString())
    if (params.category_ids) searchParams.append('category_ids', params.category_ids)
    if (params.min_price) searchParams.append('min_price', params.min_price.toString())
    if (params.max_price) searchParams.append('max_price', params.max_price.toString())
    if (params.is_featured !== undefined) searchParams.append('is_featured', params.is_featured.toString())
    if (params.in_stock !== undefined) searchParams.append('in_stock', params.in_stock.toString())

    const response = await this.client.get<SearchResult>(
      `/api/v1/opened/search/products?${searchParams.toString()}`
    )

    return response.data
  }

  /**
   * Recherche dans les catégories
   */
  async searchCategories(params: SearchParams): Promise<SearchResult> {
    const searchParams = new URLSearchParams()
    
    if (params.q) searchParams.append('q', params.q)
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.per_page) searchParams.append('per_page', params.per_page.toString())
    if (params.sort) searchParams.append('sort_by', params.sort)

    const response = await this.client.get<SearchResult>(
      `/api/v1/opened/search/categories?${searchParams.toString()}`
    )

    return response.data
  }

  /**
   * Recherche dans les marques
   */
  async searchBrands(params: SearchParams): Promise<SearchResult> {
    const searchParams = new URLSearchParams()
    
    if (params.q) searchParams.append('q', params.q)
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.per_page) searchParams.append('per_page', params.per_page.toString())
    if (params.sort) searchParams.append('sort_by', params.sort)

    const response = await this.client.get<SearchResult>(
      `/api/v1/opened/search/brands?${searchParams.toString()}`
    )

    return response.data
  }

  /**
   * Vérification de la santé du service de recherche
   */
  async health(): Promise<any> {
    const response = await this.client.get<ApiResponse<any>>('/opened/search/health')
    return response.data
  }
}

// Instance singleton
export const searchService = new SearchService()
