/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "../api/client";
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  TokenPayload,
  ApiResponse,
} from "../api/types";
import { UserType } from "../types/user";

export class AuthService {
  private readonly ACCESS_TOKEN_KEY = "rexel_access_token";
  private readonly REFRESH_TOKEN_KEY = "rexel_refresh_token";
  private readonly USER_KEY = "rexel_user";

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<{
        message: string;
        data: {
          user: User;
          token: string;
        };
      }>('/opened/auth/login', credentials);

      if (response.data.data.user && response.data.data.token) {
        // Stocker le token et l'utilisateur
        localStorage.setItem(this.ACCESS_TOKEN_KEY, response.data.data.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.data.user));

        return {
          data: {
            userId: response.data.data.user.id,
            email: response.data.data.user.email,
            requiresVerification: false,
          },
          accessToken: response.data.data.token,
          refreshToken: '', // Pas utilisé dans notre implémentation
          expiresIn: 86400, // 24h par défaut
          user: {
            ...response.data.data.user,
            addresses: [], // Pas d'adresses pour l'instant
          },
        };
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      if (error.response?.data?.data?.requiresVerification) {
        // L'utilisateur doit vérifier son email
        throw {
          type: 'VERIFICATION_REQUIRED',
          message: error.response.data.message,
          userId: error.response.data.data.userId,
          email: error.response.data.data.email,
        };
      }
      throw this.handleAuthError(error);
    }
  }

  // Register new user
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<{
        message: string;
        data: {
          userId: number;
          email: string;
          requiresVerification: boolean;
        };
      }>('/opened/auth/register', userData);

      console.log('response', response)

      if (response.data.data.requiresVerification) {
        // Retourner les informations pour la vérification
        throw {
          type: 'VERIFICATION_REQUIRED',
          message: response.data.message,
          userId: response.data.data.userId,
          email: response.data.data.email,
        };
      }

      // En cas de succès direct (ne devrait pas arriver dans notre cas)
      throw new Error('Unexpected registration flow');
    } catch (error: any) {
      if (error.type === 'VERIFICATION_REQUIRED') {
        throw error;
      }
      throw this.handleAuthError(error);
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      const accessToken = this.getAccessToken();
      if (accessToken) {
        await apiClient.post("/secured/auth/logout");
      }
    } catch (error) {
      console.warn("Logout request failed:", error);
    } finally {
      this.clearStorage();
    }
  }



  // Get current user
  async getCurrentUser(): Promise<User> {
    const token = this.getAccessToken();

    if (!token) {
      throw new Error("No access token available");
    }

    try {
      const response = await apiClient.get<{
        data: User;
      }>("/secured/auth/me");

      localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.data));
      return response.data.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<User>("/auth/profile", userData);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Change password
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      await apiClient.post("/secured/auth/change-password", {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await apiClient.post("/auth/password-reset/request", { email });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post("/opened/auth/password-reset/confirm", {
        token,
        password: newPassword,
      });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    try {
      await apiClient.post("/auth/verify-email", { token });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Resend verification email
  async resendVerificationEmail(): Promise<void> {
    try {
      await apiClient.post("/auth/resend-verification");
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Token management
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }



  getStoredUser(): User | null {
    if (typeof window === "undefined") return null;

    const userString = localStorage.getItem(this.USER_KEY);
    if (!userString) return null;

    try {
      return JSON.parse(userString);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const user = this.getStoredUser();
    return token !== null && user !== null;
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  decodeToken(token: string): TokenPayload {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  }

  getUserRole(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = this.decodeToken(token);
      return payload.role;
    } catch {
      return null;
    }
  }

  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }

  // Private methods
  private clearStorage(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  private handleAuthError(error: any): Error {
    if (error?.response?.status === 401) {
      this.clearStorage();
      return new Error("Session expirée. Veuillez vous reconnecter.");
    }

    if (error?.response?.status === 403) {
      return new Error("Accès refusé. Permissions insuffisantes.");
    }

    if (error?.response?.data?.message) {
      return new Error(error.response.data.message);
    }

    return new Error("Une erreur d'authentification s'est produite.");
  }
}

// Singleton instance
export const authService = new AuthService();
