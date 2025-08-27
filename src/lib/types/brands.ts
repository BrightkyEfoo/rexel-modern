export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Relations et propriétés calculées
  productCount?: number;
  files?: File[];
  imageUrl?: string;
}

export interface File {
  id: number;
  filename: string;
  originalName: string;
  path: string;
  url: string;
  size: number;
  mimeType: string;
  bucket: string;
  fileableType: string;
  fileableId: number;
  isMain: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BrandsResponse {
  data: Brand[];
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

export interface BrandFilters {
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface CreateBrandData {
  name: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  images?: Array<{
    url: string;
    alt?: string;
    isMain?: boolean;
  }>;
}

export interface UpdateBrandData extends Partial<CreateBrandData> {
  id: number;
}
