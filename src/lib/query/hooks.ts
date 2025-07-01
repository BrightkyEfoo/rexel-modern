import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SearchFilters, Product, Category, Brand, User, Cart } from '../api/types';
import {
  productsService,
  categoriesService,
  brandsService,
  usersService,
  cartService,
  favoritesService,
  contentService,
  statsService,
} from '../api/services';

// Query Keys
export const queryKeys = {
  // Products
  products: ['products'] as const,
  product: (id: string) => ['products', id] as const,
  productsByCategory: (categoryId: string) => ['products', 'category', categoryId] as const,
  featuredProducts: ['products', 'featured'] as const,
  searchProducts: (query: string) => ['products', 'search', query] as const,

  // Categories
  categories: ['categories'] as const,
  category: (id: string) => ['categories', id] as const,
  categoryBySlug: (slug: string) => ['categories', 'slug', slug] as const,
  mainCategories: ['categories', 'main'] as const,
  subCategories: (parentId: string) => ['categories', parentId, 'children'] as const,

  // Brands
  brands: ['brands'] as const,
  brand: (id: string) => ['brands', id] as const,
  featuredBrands: ['brands', 'featured'] as const,

  // Users
  currentUser: ['users', 'me'] as const,

  // Cart
  cart: ['cart'] as const,
  cartCount: ['cart', 'count'] as const,

  // Favorites
  favorites: ['favorites'] as const,
  isFavorite: (productId: string) => ['favorites', 'check', productId] as const,

  // Content
  testimonials: ['content', 'testimonials'] as const,
  services: ['content', 'services'] as const,
  tools: ['content', 'tools'] as const,
  promotions: ['content', 'promotions'] as const,

  // Stats
  dashboardStats: ['stats', 'dashboard'] as const,
} as const;

// Products Hooks
export function useProducts(filters?: SearchFilters) {
  return useQuery({
    queryKey: [...queryKeys.products, filters],
    queryFn: () => productsService.getProducts(filters),
    enabled: true,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => productsService.getProduct(id),
    enabled: !!id,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: queryKeys.featuredProducts,
    queryFn: () => productsService.getFeaturedProducts(),
  });
}

export function useProductsByCategory(categoryId: string) {
  return useQuery({
    queryKey: queryKeys.productsByCategory(categoryId),
    queryFn: () => productsService.getProductsByCategory(categoryId),
    enabled: !!categoryId,
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: queryKeys.searchProducts(query),
    queryFn: () => productsService.searchProducts(query),
    enabled: !!query && query.length > 2,
  });
}

// Categories Hooks
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => categoriesService.getCategories(),
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: queryKeys.category(id),
    queryFn: () => categoriesService.getCategory(id),
    enabled: !!id,
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.categoryBySlug(slug),
    queryFn: () => categoriesService.getCategoryBySlug(slug),
    enabled: !!slug,
  });
}

export function useMainCategories() {
  return useQuery({
    queryKey: queryKeys.mainCategories,
    queryFn: () => categoriesService.getMainCategories(),
  });
}

export function useSubCategories(parentId: string) {
  return useQuery({
    queryKey: queryKeys.subCategories(parentId),
    queryFn: () => categoriesService.getSubCategories(parentId),
    enabled: !!parentId,
  });
}

// Brands Hooks
export function useBrands() {
  return useQuery({
    queryKey: queryKeys.brands,
    queryFn: () => brandsService.getBrands(),
  });
}

export function useBrand(id: string) {
  return useQuery({
    queryKey: queryKeys.brand(id),
    queryFn: () => brandsService.getBrand(id),
    enabled: !!id,
  });
}

export function useFeaturedBrands() {
  return useQuery({
    queryKey: queryKeys.featuredBrands,
    queryFn: () => brandsService.getFeaturedBrands(),
  });
}

// Users Hooks
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: () => usersService.getCurrentUser(),
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      usersService.login(email, password),
    onSuccess: (data) => {
      // Save token and update user cache
      queryClient.setQueryData(queryKeys.currentUser, { data: data.data.user });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      company?: string;
    }) => usersService.register(userData),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.currentUser, { data: data.data.user });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => usersService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      usersService.updateUser(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.currentUser, data);
    },
  });
}

// Cart Hooks
export function useCart() {
  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: () => cartService.getCart(),
    retry: false,
  });
}

export function useCartCount() {
  return useQuery({
    queryKey: queryKeys.cartCount,
    queryFn: () => cartService.getCartItemCount(),
    retry: false,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity?: number }) =>
      cartService.addToCart(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      queryClient.invalidateQueries({ queryKey: queryKeys.cartCount });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartService.updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      queryClient.invalidateQueries({ queryKey: queryKeys.cartCount });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => cartService.removeFromCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      queryClient.invalidateQueries({ queryKey: queryKeys.cartCount });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      queryClient.invalidateQueries({ queryKey: queryKeys.cartCount });
    },
  });
}

// Favorites Hooks
export function useFavorites() {
  return useQuery({
    queryKey: queryKeys.favorites,
    queryFn: () => favoritesService.getFavorites(),
    retry: false,
  });
}

export function useIsFavorite(productId: string) {
  return useQuery({
    queryKey: queryKeys.isFavorite(productId),
    queryFn: () => favoritesService.isFavorite(productId),
    enabled: !!productId,
    retry: false,
  });
}

export function useAddToFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => favoritesService.addToFavorites(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
      queryClient.setQueryData(queryKeys.isFavorite(productId), true);
    },
  });
}

export function useRemoveFromFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => favoritesService.removeFromFavorites(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
      queryClient.setQueryData(queryKeys.isFavorite(productId), false);
    },
  });
}

// Content Hooks
export function useTestimonials() {
  return useQuery({
    queryKey: queryKeys.testimonials,
    queryFn: () => contentService.getTestimonials(),
  });
}

export function useServices() {
  return useQuery({
    queryKey: queryKeys.services,
    queryFn: () => contentService.getServices(),
  });
}

export function useTools() {
  return useQuery({
    queryKey: queryKeys.tools,
    queryFn: () => contentService.getTools(),
  });
}

export function usePromotions() {
  return useQuery({
    queryKey: queryKeys.promotions,
    queryFn: () => contentService.getPromotions(),
  });
}

// Stats Hooks
export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: () => statsService.getDashboardStats(),
  });
}
