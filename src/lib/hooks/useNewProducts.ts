import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

// Types
export interface NewProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  sku: string;
  slug: string;
  images: string[];
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  updatedAt: string;
  brand: {
    id: number;
    name: string;
    slug: string;
    logo?: string;
  };
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  metadata?: Record<string, any>;
}

export interface ProductCategory {
  id: number | null;
  name: string;
  productsCount: number;
}

export interface NewProductsResponse {
  data: {
    products: NewProduct[];
    categories: ProductCategory[];
  };
}

export interface NewProductsApiResponse {
  products: NewProduct[];
  categories: ProductCategory[];
}

// API functions
const newProductsApi = {
  getNewProducts: async (params: {
    limit?: number;
    categoryId?: number;
  } = {}): Promise<NewProductsApiResponse> => {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.categoryId) searchParams.append("category_id", params.categoryId.toString());

    const url = `/opened/products/new${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    const response = await apiClient.get<NewProductsResponse>(url);

    console.log('response', response.data)
    return response.data as unknown as NewProductsApiResponse;
  },
};

// React Query hooks
export function useNewProducts(params: {
  limit?: number;
  categoryId?: number;
} = {}) {
  return useQuery({
    queryKey: ["new-products", params],
    queryFn: () => newProductsApi.getNewProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
