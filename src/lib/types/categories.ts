export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  parentId?: number;
  sortOrder: number;
  imageUrl?: string; // Computed field for the main image
  createdAt: string;
  updatedAt: string;
  
  // Relations et propriétés calculées
  parent?: {
    id: number;
    name: string;
    slug: string;
  };
  children?: Category[];
  productCount?: number;
  breadcrumb_slugs?: string[];
  ancestors?: Array<{
    id: number;
    name: string;
    slug: string;
    sortOrder: number;
  }>;
  is_leaf?: boolean;
  is_root?: boolean;
  files?: Array<{
    id: number;
    name: string;
    path: string;
    url: string;
    size: number;
    mimeType: string;
    isMain: boolean;
  }>;
}

export interface CategoriesResponse {
  data: Category[];
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

export interface CategoryFilters {
  search?: string;
  parentId?: number;
  isActive?: boolean;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  isActive?: boolean;
  parentId?: number;
  sortOrder?: number;
  // Gestion des images
  images?: Array<{
    url: string;
    alt?: string;
    isMain?: boolean;
  }>;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: number;
}
