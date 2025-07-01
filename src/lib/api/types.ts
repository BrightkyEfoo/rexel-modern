export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  status: number;
  details?: Record<string, unknown>;
}

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cache?: boolean;
  cacheTime?: number;
  headers?: Record<string, string>;
}

// Types backend correspondants aux modèles AdonisJS
export interface File {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  bucket: string;
  url: string;
  fileableType?: string;
  fileableId?: number;
  createdAt: string;
  updatedAt: string;
}

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
  categoryId?: number;
  brandId?: number;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  category?: Category;
  brand?: Brand;
  files?: File[];
  
  // Frontend computed properties
  imageUrl?: string; // Computed from files[0]?.url
  availability?: 'in_stock' | 'out_of_stock' | 'limited';
  originalPrice?: number; // For display when on sale
  averageRating?: number;
  reviewCount?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  parent?: Category;
  children?: Category[];
  products?: Product[];
  files?: File[];
  
  // Frontend computed properties
  imageUrl?: string; // Computed from files[0]?.url
  productCount?: number; // Computed from products.length
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  products?: Product[];
  files?: File[];
  
  // Frontend computed properties
  productCount?: number; // Computed from products.length
}

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  role?: 'customer' | 'admin' | 'vendor';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  isVerified?: boolean;
  
  // Frontend extended properties
  preferences?: {
    language: string;
    currency: string;
    notifications: boolean;
    newsletter: boolean;
  };
  addresses?: Address[];
}

export interface Address {
  id: string;
  type: 'billing' | 'shipping';
  name: string;
  company?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CartItem {
  id: string;
  productId: number;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  totalPrice: number;
  addedAt: string;
}

export interface Cart {
  id: string;
  userId: number;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalPrice: number;
  updatedAt: string;
  expiresAt: string;
}

export interface Order {
  id: string;
  userId: number;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalPrice: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export interface CategoryDetail extends Category {
  subcategories: Category[];
  featuredProducts: Product[];
  filters: {
    brands: Brand[];
    priceRange: {
      min: number;
      max: number;
    };
    specifications: {
      name: string;
      values: string[];
    }[];
  };
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface ProductReview {
  id: string;
  userId: number;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  verified: boolean;
}

export interface ProductDetail extends Product {
  longDescription?: string;
  variants?: ProductVariant[];
  reviews?: ProductReview[];
  averageRating?: number;
  reviewCount?: number;
  relatedProducts?: Product[];
  downloadableFiles?: {
    type: 'manual' | 'datasheet' | 'certificate';
    name: string;
    url: string;
  }[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  warranty?: string;
  certifications?: string[];
  specifications?: Record<string, string>;
}

export interface SearchFilters {
  categories?: number[];
  brands?: number[];
  priceRange?: {
    min: number;
    max: number;
  };
  availability?: ('in_stock' | 'out_of_stock' | 'limited')[];
  rating?: number;
  query?: string;
  sortBy?: 'name' | 'price' | 'popularity' | 'newest' | 'rating';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchSuggestion {
  type: 'product' | 'category' | 'brand';
  id: number;
  name: string;
  imageUrl?: string;
  category?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface Favorite {
  id: string;
  userId: number;
  productId: number;
  product: Product;
  addedAt: string;
}

// Request/Create types pour les API calls
export interface CreateProductRequest {
  name: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  price: number;
  salePrice?: number;
  stockQuantity?: number;
  manageStock?: boolean;
  inStock?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  categoryId?: number;
  brandId?: number;
}

export type UpdateProductRequest = Partial<CreateProductRequest>

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: number;
  isActive?: boolean;
  sortOrder?: number;
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>

export interface CreateBrandRequest {
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  isActive?: boolean;
}

export type UpdateBrandRequest = Partial<CreateBrandRequest>
