import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { getSession } from 'next-auth/react';
import type { Session } from 'next-auth';

interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, unknown>;
}

export class NextAuthApiClient {
  private instance: AxiosInstance;

  constructor(baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333') {
    this.instance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      async (config) => {
        const url = config.url || '';

        // Handle /secured routes - require authentication
        if (url.startsWith('/secured')) {
          const session = await getSession();
          
          if (!session?.accessToken) {
            console.warn('🚫 No auth token for secured route:', url);
            return Promise.reject(new Error('No authentication token'));
          }

          // Add auth token
          config.headers.Authorization = `Bearer ${session.accessToken}`;
          // Replace with correct backend prefix
          config.url = url.replace('/secured', '/api/v1/secured');
        }

        // Handle /opened routes - add correct prefix and session ID
        if (url.startsWith('/opened')) {
          config.url = url.replace('/opened', '/api/v1/opened');
          
          // Add session ID for cart functionality
          const sessionId = typeof window !== 'undefined' 
            ? localStorage.getItem('cart-session-id') 
            : null;
          
          if (sessionId) {
            config.headers['x-session-id'] = sessionId;
          }
        }

        console.debug(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(this.transformError(error));
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        console.debug(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      async (error) => {
        console.error(
          `❌ API Error: ${error.response?.status || 'NETWORK'} ${error.config?.url}`,
          error.response?.data
        );

        // Handle 401 errors - NextAuth will handle session refresh
        if (error.response?.status === 401) {
          console.warn('🚫 401 Unauthorized - session may be expired');
          // NextAuth will handle the session refresh automatically
        }

        return Promise.reject(this.transformError(error));
      }
    );
  }

  private transformError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: 'Une erreur inattendue s\'est produite',
      code: 'UNKNOWN_ERROR',
      status: 500,
    };

    if (error.response) {
      const data = error.response.data as
        | { message?: string; code?: string; details?: unknown }
        | undefined;
      apiError.status = error.response.status;
      apiError.message = data?.message || error.message;
      apiError.code = data?.code || 'SERVER_ERROR';
      apiError.details = data?.details as Record<string, unknown> | undefined;
    } else if (error.request) {
      apiError.message = 'Erreur de connexion réseau';
      apiError.code = 'NETWORK_ERROR';
      apiError.status = 0;
    } else {
      apiError.message = error.message;
      apiError.code = 'REQUEST_ERROR';
    }

    return apiError;
  }

  // HTTP Methods
  async get<T>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.instance.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.instance.post(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.instance.put(url, data, config);
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.instance.patch(url, data, config);
  }

  async delete<T>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.instance.delete(url, config);
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health');
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton instance
export const nextAuthApiClient = new NextAuthApiClient();

// Helper functions for different route types
export const nextAuthApi = {
  // Routes publiques (préfixe /opened)
  public: {
    get: <T>(url: string, config?: any) =>
      nextAuthApiClient.get<T>(`/opened${url}`, config),
    post: <T>(url: string, data?: any, config?: any) =>
      nextAuthApiClient.post<T>(`/opened${url}`, data, config),
  },

  // Routes sécurisées (préfixe /secured)
  secured: {
    get: <T>(url: string, config?: any) =>
      nextAuthApiClient.get<T>(`/secured${url}`, config),
    post: <T>(url: string, data?: any, config?: any) =>
      nextAuthApiClient.post<T>(`/secured${url}`, data, config),
    put: <T>(url: string, data?: any, config?: any) =>
      nextAuthApiClient.put<T>(`/secured${url}`, data, config),
    patch: <T>(url: string, data?: any, config?: any) =>
      nextAuthApiClient.patch<T>(`/secured${url}`, data, config),
    delete: <T>(url: string, config?: any) =>
      nextAuthApiClient.delete<T>(`/secured${url}`, config),
  },
};

export default nextAuthApiClient;
