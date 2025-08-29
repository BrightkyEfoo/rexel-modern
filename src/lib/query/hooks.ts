import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  SearchFilters,
  Product,
  Category,
  Brand,
  User,
  Cart,
} from "../api/types";
import {
  productsService,
  categoriesService,
  brandsService,
  usersService,
  cartService,
  contentService,
  statsService,
} from "../api/services";
import { 
  useFavorites as useFavoritesHook,
  useFavoritesCount,
  useAddToFavorites,
  useRemoveFromFavorites,
  useRemoveFromFavoritesByProduct,
  useToggleFavorite,
  useProductFavoriteStatus
} from "../hooks/useFavorites";

  // Query Keys
export const queryKeys = {
  // Products
  products: ["products"] as const,
  product: (id: string) => ["products", id] as const,
  productsByCategory: (categoryId: string) =>
    ["products", "category", categoryId] as const,
  productsByCategorySlug: (categorySlug: string) =>
    ["products", "category-slug", categorySlug] as const,
  featuredProducts: ["products", "featured"] as const,
  searchProducts: (query: string) => ["products", "search", query] as const,
  similarProducts: (slug: string) => ["products", "similar", slug] as const,

  // Categories
  categories: ["categories"] as const,
  category: (id: string) => ["categories", id] as const,
  categoryBySlug: (slug: string) => ["categories", "slug", slug] as const,
  mainCategories: ["categories", "main"] as const,
  subCategories: (parentId: string) =>
    ["categories", parentId, "children"] as const,

  // Brands
  brands: ["brands"] as const,
  brand: (id: string) => ["brands", id] as const,
  featuredBrands: ["brands", "featured"] as const,

  // Users
  currentUser: ["users", "me"] as const,

  // Cart
  cart: ["cart"] as const,
  cartCount: ["cart", "count"] as const,

  // Favorites
  favorites: ["favorites"] as const,
  isFavorite: (productId: string) => ["favorites", "check", productId] as const,

  // Content
  testimonials: ["content", "testimonials"] as const,
  services: ["content", "services"] as const,
  tools: ["content", "tools"] as const,
  promotions: ["content", "promotions"] as const,

  // Stats
  dashboardStats: ["stats", "dashboard"] as const,
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
    queryFn: () => productsService.getProductsByCategory(Number(categoryId)),
    enabled: !!categoryId,
  });
}

export function useProductsByCategorySlug(categorySlug: string, filters?: SearchFilters) {
  return useQuery({
    queryKey: [...queryKeys.productsByCategorySlug(categorySlug), filters],
    queryFn: () => productsService.getProductsByCategorySlug(categorySlug, filters),
    enabled: !!categorySlug,
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: queryKeys.searchProducts(query),
    queryFn: () => productsService.searchProducts(query),
    enabled: !!query && query.length > 2,
  });
}

export function useSimilarProducts(slug: string) {
  return useQuery({
    queryKey: queryKeys.similarProducts(slug),
    queryFn: () => productsService.getSimilarProducts(slug),
    enabled: !!slug,
  });
}

export function useGlobalFilters() {
  return useQuery({
    queryKey: ["products", "global-filters"],
    queryFn: () => productsService.getGlobalFilters(),
    staleTime: 5 * 60 * 1000, // 5 minutes
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
    queryFn: () => categoriesService.getSubCategories(Number(parentId)),
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
      usersService.updateUser(Number(id), data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.currentUser, data);
    },
  });
}

// Cart Hooks
export function useCart(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: () => cartService.getCart(),
    retry: false,
    enabled: options?.enabled ?? true,
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
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity?: number;
    }) => cartService.addToCart(Number(productId), quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      queryClient.invalidateQueries({ queryKey: queryKeys.cartCount });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
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
    mutationFn: (itemId: number) => cartService.removeFromCart(itemId),
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

export function useMergeCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      
      // Vérifier qu'on a un token avant d'appeler
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('kesimarket_access_token') 
        : null;
      
      if (!token) {
        throw new Error('User not authenticated');
      }
      
      return cartService.mergeCart();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      queryClient.invalidateQueries({ queryKey: queryKeys.cartCount });
    },
    onError: (error) => {
      console.error('❌ Cart merge failed:', error);
    },
  });
}

// Favorites Hooks - Re-exported from dedicated hooks
export const useFavorites = useFavoritesHook;
export { useFavoritesCount, useAddToFavorites, useRemoveFromFavorites, useRemoveFromFavoritesByProduct, useToggleFavorite, useProductFavoriteStatus };

// Hook simplifié pour vérifier si un produit est favori
export function useIsFavorite(productId: string) {
  const { isFavorite, isLoading } = useProductFavoriteStatus(productId);
  return {
    data: isFavorite,
    isLoading,
    error: null
  };
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
