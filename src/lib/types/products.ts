export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  manageStock: boolean;
  inStock: boolean;
  isFeatured: boolean;
  isActive: boolean;
  brandId?: number;
  fabricationCountryCode?: string;
  specifications?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  brand?: {
    id: number;
    name: string;
    slug: string;
    logoUrl?: string;
  };
  categories?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  files?: Array<{
    id: number;
    name: string;
    path: string;
    url: string;
    size: number;
    mimeType: string;
  }>;
  imageUrl?: string; // Computed field for the main image
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  message: string;
  status: number;
  timestamp: string;
}

export interface ProductFilters {
  search?: string;
  categoryId?: number;
  brandId?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface CreateProductData {
  name: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  manageStock?: boolean;
  inStock?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  brandId?: number;
  // Relations many-to-many avec les catégories
  categoryIds?: number[];
  // Gestion des images
  images?: Array<{
    url: string;
    alt?: string;
    isMain?: boolean;
  }>;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: number;
}
