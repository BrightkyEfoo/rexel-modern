import { apiClient } from './client';
import type {
  Product,
  Category,
  Brand,
  User,
  Cart,
  CartItem,
  SearchFilters,
  PaginatedResponse,
  ApiResponse,
  CategoryDetail,
  File,
  CreateProductRequest,
  UpdateProductRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateBrandRequest,
  UpdateBrandRequest,
} from './types';

// Products Service
export class ProductsService {
  async getProducts(filters?: SearchFilters): Promise<PaginatedResponse<Product>> {
    const params = this.buildSearchParams(filters);
    return apiClient.getPaginated<Product>('/opened/products', { params });
  }

  async getProduct(slugOrId: string | number): Promise<ApiResponse<Product>> {
    return apiClient.get<Product>(`/opened/products/${slugOrId}`);
  }

  async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>('/opened/products/featured', { cacheTime: 10 * 60 * 1000 });
  }

  async getProductsByCategory(categoryId: number): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>(`/opened/products/category/${categoryId}`);
  }

  async getProductsByCategorySlug(categorySlug: string, filters?: SearchFilters): Promise<PaginatedResponse<Product>> {
    const params = this.buildCategorySearchParams(filters);
    const response = await apiClient.get<{
      data: Product[];
      meta: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
      };
      category?: {
        id: number;
        name: string;
        slug: string;
        description?: string;
        breadcrumb_slugs: string[];
      };
      message: string;
      status: number;
      timestamp: string;
    }>(`/opened/products/category/${categorySlug}`, { params });
    
    // Retourner la structure PaginatedResponse standard
    return {
      data: response.data.data,
      meta: response.data.meta
    };
  }

  async getProductsByBrand(brandId: number): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>(`/opened/products/brand/${brandId}`);
  }

  async searchProducts(query: string, page = 1, perPage = 20): Promise<PaginatedResponse<Product>> {
    return apiClient.getPaginated<Product>('/opened/products', {
      params: { search: query, page, per_page: perPage },
    });
  }

  // Admin endpoints (secured)
  async createProduct(data: CreateProductRequest): Promise<ApiResponse<Product>> {
    return apiClient.post<Product>('/secured/products', data);
  }

  async updateProduct(id: number, data: UpdateProductRequest): Promise<ApiResponse<Product>> {
    return apiClient.put<Product>(`/secured/products/${id}`, data);
  }

  async deleteProduct(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/secured/products/${id}`);
  }

  private buildSearchParams(filters?: SearchFilters): Record<string, unknown> {
    if (!filters) return {};

    const params: Record<string, unknown> = {};

    if (filters.query) params.search = filters.query;
    if (filters.categories?.length) params.categoryId = filters.categories[0]; // Backend expects single categoryId
    if (filters.brands?.length) params.brandId = filters.brands[0]; // Backend expects single brandId
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.per_page = filters.limit;

    // Note: priceRange, availability, sortBy not implemented in backend yet
    // if (filters.priceRange) {
    //   params.price_gte = filters.priceRange.min;
    //   params.price_lte = filters.priceRange.max;
    // }
    // if (filters.sortBy) {
    //   params._sort = filters.sortBy;
    //   params._order = filters.sortOrder || 'asc';
    // }

    return params;
  }

  private buildCategorySearchParams(filters?: SearchFilters): Record<string, unknown> {
    if (!filters) return {};

    const params: Record<string, unknown> = {};

    if (filters.query) params.search = filters.query;
    if (filters.brands?.length) params.brandId = filters.brands[0];
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.per_page = filters.limit;
    if (filters.sortBy) params.sort_by = filters.sortBy;
    if (filters.sortOrder) params.sort_order = filters.sortOrder;

    // Gestion des filtres de prix
    if (filters.priceRange) {
      if (filters.priceRange.min) params.min_price = filters.priceRange.min;
      if (filters.priceRange.max) params.max_price = filters.priceRange.max;
    }

    // Gestion de la disponibilité
    if (filters.availability?.length) {
      const availabilityMap = {
        'in_stock': 'true',
        'out_of_stock': 'false',
        'limited': 'limited'
      };
      const availabilityValues = filters.availability.map(av => availabilityMap[av]).filter(Boolean);
      if (availabilityValues.length > 0) {
        params.in_stock = availabilityValues.join(',');
      }
    }

    return params;
  }
}

// Categories Service
export class CategoriesService {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return apiClient.get<Category[]>('/opened/categories', { cacheTime: 15 * 60 * 1000 });
  }

  async getCategory(slugOrId: string | number): Promise<ApiResponse<Category>> {
    return apiClient.get<Category>(`/opened/categories/${slugOrId}`);
  }

  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
    return apiClient.get<Category>(`/opened/categories/${slug}`);
  }

  async getMainCategories(): Promise<ApiResponse<Category[]>> {
    return apiClient.get<Category[]>('/opened/categories/main', { cacheTime: 15 * 60 * 1000 });
  }

  async getSubCategories(parentId: number): Promise<ApiResponse<Category[]>> {
    return apiClient.get<Category[]>(`/opened/categories/${parentId}/children`);
  }

  // Admin endpoints (secured)
  async createCategory(data: CreateCategoryRequest): Promise<ApiResponse<Category>> {
    return apiClient.post<Category>('/secured/categories', data);
  }

  async updateCategory(id: number, data: UpdateCategoryRequest): Promise<ApiResponse<Category>> {
    return apiClient.put<Category>(`/secured/categories/${id}`, data);
  }

  async deleteCategory(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/secured/categories/${id}`);
  }
}

// Brands Service
export class BrandsService {
  async getBrands(): Promise<ApiResponse<Brand[]>> {
    return apiClient.get<Brand[]>('/opened/brands', { cacheTime: 15 * 60 * 1000 });
  }

  async getBrand(slugOrId: string | number): Promise<ApiResponse<Brand>> {
    return apiClient.get<Brand>(`/opened/brands/${slugOrId}`);
  }

  async getFeaturedBrands(): Promise<ApiResponse<Brand[]>> {
    return apiClient.get<Brand[]>('/opened/brands/featured', { cacheTime: 15 * 60 * 1000 });
  }

  // Admin endpoints (secured)
  async createBrand(data: CreateBrandRequest): Promise<ApiResponse<Brand>> {
    return apiClient.post<Brand>('/secured/brands', data);
  }

  async updateBrand(id: number, data: UpdateBrandRequest): Promise<ApiResponse<Brand>> {
    return apiClient.put<Brand>(`/secured/brands/${id}`, data);
  }

  async deleteBrand(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/secured/brands/${id}`);
  }
}

// Users Service
export class UsersService {
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/secured/users/me', { cache: false });
  }

  async updateUser(id: number, data: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<User>(`/secured/users/${id}`, data);
  }

  async updatePreferences(preferences: User['preferences']): Promise<ApiResponse<User>> {
    return apiClient.patch<User>('/secured/users/me/preferences', { preferences });
  }

  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string; refreshToken: string }>> {
    return apiClient.post<{ user: User; token: string; refreshToken: string }>('/opened/auth/login', {
      email,
      password,
    });
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    company?: string;
  }): Promise<ApiResponse<{ user: User; token: string; refreshToken: string }>> {
    return apiClient.post<{ user: User; token: string; refreshToken: string }>('/opened/auth/register', userData);
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>('/secured/auth/logout');
    apiClient.removeAuthToken();
    return response;
  }

  async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/opened/auth/password-reset', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/opened/auth/password-reset/confirm', {
      token,
      password: newPassword,
    });
  }
}

// Cart Service
export class CartService {
  async getCart(): Promise<ApiResponse<Cart>> {
    return apiClient.get<Cart>('/secured/cart', { cache: false });
  }

  async addToCart(productId: number, quantity: number = 1): Promise<ApiResponse<Cart>> {
    return apiClient.post<Cart>('/secured/cart/items', {
      productId,
      quantity,
    });
  }

  async updateCartItem(itemId: string, quantity: number): Promise<ApiResponse<Cart>> {
    return apiClient.put<Cart>(`/secured/cart/items/${itemId}`, {
      quantity,
    });
  }

  async removeFromCart(itemId: string): Promise<ApiResponse<Cart>> {
    return apiClient.delete<Cart>(`/secured/cart/items/${itemId}`);
  }

  async clearCart(): Promise<ApiResponse<void>> {
    return apiClient.delete<void>('/secured/cart');
  }

  async getCartItemCount(): Promise<number> {
    try {
      const response = await this.getCart();
      return response.data.totalItems;
    } catch {
      return 0;
    }
  }
}

// Favorites Service
export class FavoritesService {
  async getFavorites(): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>('/secured/favorites');
  }

  async addToFavorites(productId: number): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/secured/favorites', { productId });
  }

  async removeFromFavorites(productId: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/secured/favorites/${productId}`);
  }

  async isFavorite(productId: number): Promise<boolean> {
    try {
      const response = await this.getFavorites();
      return response.data.some(product => product.id === productId);
    } catch {
      return false;
    }
  }
}

// Files Service
export class FilesService {
  async uploadFile(file: globalThis.File, bucket = 'products', fileableType?: string, fileableId?: number): Promise<ApiResponse<File>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);
    if (fileableType) formData.append('fileable_type', fileableType);
    if (fileableId) formData.append('fileable_id', fileableId.toString());

    return apiClient.post<File>('/secured/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async uploadFiles(files: globalThis.File[], bucket = 'products', fileableType?: string, fileableId?: number): Promise<ApiResponse<File[]>> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('bucket', bucket);
    if (fileableType) formData.append('fileable_type', fileableType);
    if (fileableId) formData.append('fileable_id', fileableId.toString());

    return apiClient.post<File[]>('/secured/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async getEntityFiles(fileableType: string, fileableId: number): Promise<ApiResponse<File[]>> {
    return apiClient.get<File[]>(`/opened/files/${fileableType}/${fileableId}`);
  }

  async deleteFile(fileId: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/secured/files/${fileId}`);
  }
}

// Content Service (mock data for now)
export class ContentService {
  async getTestimonials(): Promise<ApiResponse<Array<{
    id: string;
    author: string;
    content: string;
    rating: number;
    date: string;
  }>>> {
    // Mock data - replace with actual API call when backend is ready
    return Promise.resolve({
      data: [],
      message: 'Testimonials not implemented in backend yet',
    });
  }

  async getServices(): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    link: string;
    features: string[];
  }>>> {
    // Mock data - replace with actual API call when backend is ready
    return Promise.resolve({
      data: [],
      message: 'Services not implemented in backend yet',
    });
  }

  async getTools(): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    link: string;
  }>>> {
    // Mock data - replace with actual API call when backend is ready
    return Promise.resolve({
      data: [],
      message: 'Tools not implemented in backend yet',
    });
  }

  async getPromotions(): Promise<ApiResponse<Array<{
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    validUntil: string;
  }>>> {
    // Mock data - replace with actual API call when backend is ready
    return Promise.resolve({
      data: [],
      message: 'Promotions not implemented in backend yet',
    });
  }
}

// Stats Service (mock data for now)
export class StatsService {
  async getDashboardStats(): Promise<ApiResponse<{
    totalProducts: number;
    totalCategories: number;
    totalBrands: number;
    totalAgencies: number;
    deliveryReferences: number;
    expertCount: number;
  }>> {
    // Mock data - replace with actual API call when backend is ready
    return Promise.resolve({
      data: {
        totalProducts: 0,
        totalCategories: 0,
        totalBrands: 0,
        totalAgencies: 0,
        deliveryReferences: 0,
        expertCount: 0,
      },
      message: 'Stats not implemented in backend yet',
    });
  }
}

// Export instances
export const productsService = new ProductsService();
export const categoriesService = new CategoriesService();
export const brandsService = new BrandsService();
export const usersService = new UsersService();
export const cartService = new CartService();
export const favoritesService = new FavoritesService();
export const filesService = new FilesService();
export const contentService = new ContentService();
export const statsService = new StatsService();
