// Types pour la recherche Typesense

export interface SearchHit {
  document: any
  highlights?: Array<{
    field: string
    matched_tokens: string[]
    snippet: string
  }>
  text_match: number
  text_match_info?: {
    best_field_score: string
    best_field_weight: number
    fields_matched: number
    score: string
    tokens_matched: number
  }
}

export interface SearchFacetCount {
  counts: Array<{
    count: number
    highlighted: string
    value: string
  }>
  field_name: string
  stats?: {
    avg?: number
    max?: number
    min?: number
    sum?: number
    total_values: number
  }
}

export interface SearchResult {
  collection: string
  query: string
  page?: number
  per_page?: number
  found: number
  hits: SearchHit[]
  facet_counts?: SearchFacetCount[]
  search_time_ms: number
}

export interface MultiSearchResult {
  query: string
  results: SearchResult[]
}

// Types pour les documents Typesense
export interface ProductDocument {
  id: number
  name: string
  slug: string
  description?: string
  short_description?: string
  sku?: string
  price: number
  sale_price?: number
  stock_quantity: number
  is_featured: boolean
  is_active: boolean
  brand_id?: number
  brand_name?: string
  brand_slug?: string
  category_ids?: number[]
  category_names?: string[]
  category_slugs?: string[]
  image_url?: string
  created_at: number
  updated_at: number
}

export interface CategoryDocument {
  id: number
  name: string
  slug: string
  description?: string
  parent_id?: number
  parent_name?: string
  is_active: boolean
  sort_order: number
  products_count: number
  created_at: number
}

export interface BrandDocument {
  id: number
  name: string
  slug: string
  description?: string
  is_active: boolean
  is_featured: boolean
  products_count: number
  created_at: number
}

// Types pour les filtres de recherche
export interface SearchFilters {
  brand_id?: number
  category_ids?: number[]
  min_price?: number
  max_price?: number
  is_featured?: boolean
  is_active?: boolean
  in_stock?: boolean
}

export interface SearchOptions {
  page?: number
  per_page?: number
  sort_by?: string
  collections?: string[]
  filters?: SearchFilters
}

// Types pour l'autocomplétion
export interface AutocompleteResult extends MultiSearchResult {}

// Types pour les suggestions de recherche
export interface SearchSuggestion {
  type: 'product' | 'category' | 'brand'
  id: number
  name: string
  slug: string
  image_url?: string
  description?: string
  extra?: {
    price?: number
    brand_name?: string
    category_names?: string[]
    products_count?: number
  }
}

// Types pour les résultats formatés
export interface FormattedSearchResult {
  type: 'product' | 'category' | 'brand'
  id: number
  title: string
  subtitle?: string
  description?: string
  image_url?: string
  url: string
  score: number
  highlights?: Array<{
    field: string
    snippet: string
  }>
}

// Types pour la page de recherche
export interface SearchPageResult {
  query: string
  total: number
  page: number
  per_page: number
  results: FormattedSearchResult[]
  facets?: SearchFacetCount[]
  search_time_ms: number
}

// Types pour les paramètres d'URL de recherche
export interface SearchParams {
  q?: string
  page?: number
  per_page?: number
  sort?: string
  type?: 'all' | 'products' | 'categories' | 'brands'
  brand_id?: number
  category_ids?: string
  min_price?: number
  max_price?: number
  is_featured?: boolean
  in_stock?: boolean
}
