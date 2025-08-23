import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { z } from "zod";
import type {
  ApiError,
  ApiResponse,
  PaginatedResponse,
  RequestConfig,
} from "./types";

// Schema de validation pour les réponses API
const ApiResponseSchema = z.object({
  data: z.unknown(),
  message: z.string().optional(),
  status: z.number(),
  timestamp: z.string(),
});

const PaginatedResponseSchema = z.object({
  data: z.array(z.unknown()),
  meta: z.object({
    total: z.number(),
    per_page: z.number(),
    current_page: z.number(),
    last_page: z.number(),
  }),
});

interface CacheEntry {
  data: unknown;
  expiry: number;
}

interface RequestQueueItem {
  key: string;
  promise: Promise<unknown>;
}

interface RetryConfig {
  attempts: number;
  delay: number;
  exponentialBackoff: boolean;
}

// Add this interface for custom config
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: number;
  };
}

// Interface pour le token d'authentification
interface AuthToken {
  access_token: string;
  type: string;
  expires_at?: string;
}

export class ApiClient {
  private instance: AxiosInstance;
  private cache = new Map<string, CacheEntry>();
  private requestQueue = new Map<string, RequestQueueItem>();
  private defaultRetryConfig: RetryConfig = {
    attempts: 3,
    delay: 1000,
    exponentialBackoff: true,
  };
  constructor(
    baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
  ) {
    this.instance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (configParams) => {
        const config = configParams as CustomAxiosRequestConfig;
        const url = config.url || "";

        // Handle /secured routes - require authentication
        if (url.startsWith("/secured")) {
          const token = this.getAuthToken();

          if (!token) {
            // Ne pas rediriger automatiquement, laisser le composant gérer
            console.warn('🚫 No auth token for secured route:', url);
            return Promise.reject(new Error("No authentication token"));
          }

          // Add auth token
          config.headers.Authorization = `Bearer ${token}`;
          // Replace with correct backend prefix
          config.url = url.replace("/secured", "/api/v1/secured");
        }

        // Handle /opened routes - add correct prefix and session ID
        if (url.startsWith("/opened")) {
          config.url = url.replace("/opened", "/api/v1/opened");
          
          // Add session ID for cart functionality
          const sessionId = typeof window !== "undefined" 
            ? localStorage.getItem("cart-session-id") 
            : null;
          
          if (sessionId) {
            config.headers["x-session-id"] = sessionId;
          }
        }

        // Add request timestamp for logging
        config.metadata = {
          startTime: Date.now(),
        };

        console.debug(
          `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error) => {
        console.error("❌ Request error:", error);
        return Promise.reject(this.transformError(error));
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        const config = response.config as CustomAxiosRequestConfig;
        const duration = Date.now() - (config.metadata?.startTime || 0);
        console.debug(
          `✅ API Response: ${response.status} ${response.config.url} (${duration}ms)`
        );
        return response;
      },
      async (error) => {
        const config = error.config as CustomAxiosRequestConfig;
        const duration = Date.now() - (config?.metadata?.startTime || 0);
        console.error(
          `❌ API Error: ${error.response?.status || "NETWORK"} ${
            error.config?.url
          } (${duration}ms)`,
          error.response?.data
        );

        // Handle 401 errors - pas de refresh token dans notre système
        if (error.response?.status === 401) {
          console.warn("🚫 401 Unauthorized - token invalide ou expiré");
          // Ne pas rediriger automatiquement, laisser le composant gérer
          // this.handleAuthError(); ← Commenté pour éviter redirection automatique
        }

        return Promise.reject(this.transformError(error));
      }
    );
  }

  private getAuthToken(): string | null {
    return typeof window !== "undefined"
      ? localStorage.getItem("kesimarket_access_token")
      : null;
  }

  // Méthode refreshToken supprimée - nous utilisons un système plus simple avec seulement l'access token

  private handleAuthError(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("kesimarket_access_token");
      localStorage.removeItem("kesimarket_user");
      // Redirect to login page
      window.location.href = "/auth/login";
    }
  }

  private transformError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: "Une erreur inattendue s'est produite",
      code: "UNKNOWN_ERROR",
      status: 500,
    };

    if (error.response) {
      // Server responded with error status
      const data = error.response.data as
        | { message?: string; code?: string; details?: unknown }
        | undefined;
      apiError.status = error.response.status;
      apiError.message = data?.message || error.message;
      apiError.code = data?.code || "SERVER_ERROR";
      apiError.details = data?.details as Record<string, unknown> | undefined;
    } else if (error.request) {
      // Network error
      apiError.message = "Erreur de connexion réseau";
      apiError.code = "NETWORK_ERROR";
      apiError.status = 0;
    } else {
      // Request setup error
      apiError.message = error.message;
      apiError.code = "REQUEST_ERROR";
    }

    return apiError;
  }

  private generateCacheKey(
    url: string,
    params?: Record<string, unknown>
  ): string {
    const paramString = params ? JSON.stringify(params) : "";
    return `${url}:${paramString}`;
  }

  private isValidCacheEntry(entry: CacheEntry): boolean {
    return Date.now() < entry.expiry;
  }

  private async withCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    cacheTime = 5 * 60 * 1000 // 5 minutes
  ): Promise<T> {
    // Check cache first
    const cached = this.cache.get(key);
    if (cached && this.isValidCacheEntry(cached)) {
      console.debug(`📦 Cache hit: ${key}`);
      return cached.data as T;
    }

    // Check if request is already in progress
    const queued = this.requestQueue.get(key);
    if (queued) {
      console.debug(`⏳ Request queued: ${key}`);
      return queued.promise as Promise<T>;
    }

    // Make new request
    const promise = fetcher();
    this.requestQueue.set(key, { key, promise });

    try {
      const data = await promise;

      // Cache the result
      this.cache.set(key, {
        data,
        expiry: Date.now() + cacheTime,
      });

      console.debug(`💾 Cached response: ${key}`);
      return data;
    } finally {
      this.requestQueue.delete(key);
    }
  }

  private async withRetry<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<T> {
    const retryConfig = { ...this.defaultRetryConfig, ...config };
    let lastError: Error;

    for (let attempt = 1; attempt <= retryConfig.attempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt === retryConfig.attempts) {
          break;
        }

        const delay = retryConfig.exponentialBackoff
          ? retryConfig.delay * Math.pow(2, attempt - 1)
          : retryConfig.delay;

        console.warn(
          `🔄 Retry ${attempt}/${retryConfig.attempts} after ${delay}ms:`,
          error
        );
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private validateResponse<T>(data: unknown, schema?: z.ZodSchema<T>): T {
    if (schema) {
      return schema.parse(data);
    }
    return data as T;
  }

  private normalizeResponse<T>(response: AxiosResponse): ApiResponse<T> {
    const respData = response.data ?? {};

    // Si la réponse est déjà au format ApiResponse
    if (respData && typeof respData === "object" && "data" in respData) {
      return respData as ApiResponse<T>;
    }

    // Sinon, normaliser au format ApiResponse
    return {
      data: respData as T,
      status: response.status,
      timestamp: new Date().toISOString(),
    } as ApiResponse<T>;
  }

  // Public API methods
  async get<T>(
    url: string,
    config: RequestConfig & { params?: Record<string, unknown> } = {}
  ): Promise<ApiResponse<T>> {
    const {
      cache = true,
      cacheTime,
      retries,
      retryDelay,
      params,
      ...axiosConfig
    } = config;

    const operation = async () => {
      const response: AxiosResponse<T | ApiResponse<T>> =
        await this.instance.get(url, {
          params,
          ...axiosConfig,
        });

      return this.normalizeResponse<T>(response);
    };

    if (cache) {
      const cacheKey = this.generateCacheKey(url, params);
      return this.withCache(cacheKey, operation, cacheTime);
    }

    if (retries) {
      return this.withRetry(operation, {
        attempts: retries,
        delay: retryDelay || 1000,
      });
    }

    return operation();
  }

  async post<T, D = unknown>(
    url: string,
    data?: D,
    config: RequestConfig = {}
  ): Promise<AxiosResponse<T, unknown>> {
    const { retries, retryDelay, ...axiosConfig } = config;

    const operation = async () => {
      const response: AxiosResponse<T, unknown> =
        await this.instance.post(url, data, axiosConfig);
      return response;
    };

    if (retries) {
      return this.withRetry(operation, {
        attempts: retries,
        delay: retryDelay || 1000,
      });
    }

    return operation();
  }

  async put<T, D = unknown>(
    url: string,
    data?: D,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { retries, retryDelay, ...axiosConfig } = config;

    const operation = async () => {
      const response: AxiosResponse<T | ApiResponse<T>> =
        await this.instance.put(url, data, axiosConfig);
      return this.normalizeResponse<T>(response);
    };

    if (retries) {
      return this.withRetry(operation, {
        attempts: retries,
        delay: retryDelay || 1000,
      });
    }

    return operation();
  }

  async patch<T, D = unknown>(
    url: string,
    data?: D,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { retries, retryDelay, ...axiosConfig } = config;

    const operation = async () => {
      const response: AxiosResponse<T | ApiResponse<T>> =
        await this.instance.patch(url, data, axiosConfig);
      return this.normalizeResponse<T>(response);
    };

    if (retries) {
      return this.withRetry(operation, {
        attempts: retries,
        delay: retryDelay || 1000,
      });
    }

    return operation();
  }

  async delete<T>(
    url: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { retries, retryDelay, ...axiosConfig } = config;

    const operation = async () => {
      const response: AxiosResponse<T | ApiResponse<T>> =
        await this.instance.delete(url, axiosConfig);
      return this.normalizeResponse<T>(response);
    };

    if (retries) {
      return this.withRetry(operation, {
        attempts: retries,
        delay: retryDelay || 1000,
      });
    }

    return operation();
  }

  async getPaginated<T>(
    url: string,
    config: RequestConfig & {
      params?: Record<string, unknown>;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<PaginatedResponse<T>> {
    const { page = 1, limit = 20, params = {}, ...restConfig } = config;

    const paginationParams = {
      _page: page,
      _limit: limit,
      ...params,
    };

    const response = await this.get<T[]>(url, {
      ...restConfig,
      params: paginationParams,
    });

    // Simulate pagination for json-server
    const total = Number(response.data.length) || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data: response.data,
      meta: {
        total,
        per_page: limit,
        current_page: page,
        last_page: totalPages,
      },
    };
  }

  // Utility methods
  clearCache(): void {
    this.cache.clear();
    console.debug("🗑️ Cache cleared");
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  setAuthToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("kesimarket_access_token", token);
    }
  }

  removeAuthToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("kesimarket_access_token");
      localStorage.removeItem("kesimarket_user");
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.get("/health", { timeout: 5000, cache: false });
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton instance
export const apiClient = new ApiClient();

// Fonctions utilitaires pour les appels API avec gestion des préfixes
export const api = {
  // Routes publiques (préfixe /opened)
  public: {
    get: <T>(url: string, config?: RequestConfig) =>
      apiClient.get<T>(`/opened${url}`, config),
    post: <T, D = unknown>(url: string, data?: D, config?: RequestConfig) =>
      apiClient.post<T, D>(`/opened${url}`, data, config),
  },

  // Routes sécurisées (préfixe /secured)
  secured: {
    get: <T>(url: string, config?: RequestConfig) =>
      apiClient.get<T>(`/secured${url}`, config),
    post: <T, D = unknown>(url: string, data?: D, config?: RequestConfig) =>
      apiClient.post<T, D>(`/secured${url}`, data, config),
    put: <T, D = unknown>(url: string, data?: D, config?: RequestConfig) =>
      apiClient.put<T, D>(`/secured${url}`, data, config),
    patch: <T, D = unknown>(url: string, data?: D, config?: RequestConfig) =>
      apiClient.patch<T, D>(`/secured${url}`, data, config),
    delete: <T>(url: string, config?: RequestConfig) =>
      apiClient.delete<T>(`/secured${url}`, config),
  },

  // Routes sans préfixe (si nécessaire)
  direct: {
    get: <T>(url: string, config?: RequestConfig) =>
      apiClient.get<T>(url, config),
    post: <T, D = unknown>(url: string, data?: D, config?: RequestConfig) =>
      apiClient.post<T, D>(url, data, config),
  },
};

// Export de l'instance pour usage direct si nécessaire
export default apiClient;

// Exemples d'utilisation :
// api.public.get<Product[]>('/products') // -> GET /products
// api.secured.post<Product, CreateProductData>('/products', data) // -> POST /products avec auth
// api.public.get<Product[]>('/products/featured') // -> GET /products/featured
