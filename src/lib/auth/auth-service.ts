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
import { CookieService, COOKIE_NAMES } from "../utils/cookies";

export class AuthService {
  private readonly ACCESS_TOKEN_KEY = COOKIE_NAMES.ACCESS_TOKEN;
  private readonly REFRESH_TOKEN_KEY = COOKIE_NAMES.REFRESH_TOKEN;
  private readonly USER_KEY = COOKIE_NAMES.USER_DATA;
  private readonly REMEMBER_ME_KEY = COOKIE_NAMES.REMEMBER_ME;

  // Login user
  async login(credentials: LoginCredentials & { rememberMe?: boolean }): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<{
        message: string;
        data: {
          user: User;
          token: string;
          expiresIn: number;
          rememberMe: boolean;
        };
      }>('/opened/auth/login', credentials);

      if (response.data.data.user && response.data.data.token) {
        const { user, token, expiresIn, rememberMe } = response.data.data;
        
        // Stocker selon "Se souvenir de moi"
        if (rememberMe) {
          // Cookies persistants (30 jours)
          const expirationDays = Math.ceil(expiresIn / (24 * 60 * 60)); // Convertir secondes en jours
          CookieService.setWithDays(this.ACCESS_TOKEN_KEY, token, expirationDays);
          CookieService.setWithDays(this.USER_KEY, JSON.stringify(user), expirationDays);
          CookieService.setWithDays(this.REMEMBER_ME_KEY, 'true', expirationDays);
        } else {
          // Cookies de session (expirent à la fermeture du navigateur)
          CookieService.setSession(this.ACCESS_TOKEN_KEY, token);
          CookieService.setSession(this.USER_KEY, JSON.stringify(user));
          CookieService.remove(this.REMEMBER_ME_KEY); // S'assurer que remember me est désactivé
        }

        // Fallback localStorage pour compatibilité
        localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));

        return {
          data: {
            userId: user.id,
            email: user.email,
            requiresVerification: false,
          },
          accessToken: token,
          refreshToken: '', // Pas utilisé dans notre implémentation
          expiresIn,
          user: {
            ...user,
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
    
    // Priorité aux cookies
    const cookieToken = CookieService.get(this.ACCESS_TOKEN_KEY);
    if (cookieToken) return cookieToken;
    
    // Fallback localStorage
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    
    // Priorité aux cookies
    const cookieToken = CookieService.get(this.REFRESH_TOKEN_KEY);
    if (cookieToken) return cookieToken;
    
    // Fallback localStorage
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getStoredUser(): User | null {
    if (typeof window === "undefined") return null;

    // Priorité aux cookies
    const cookieUser = CookieService.get(this.USER_KEY);
    if (cookieUser) {
      try {
        return JSON.parse(cookieUser);
      } catch {
        // Si erreur de parsing, essayer localStorage
      }
    }
    
    // Fallback localStorage
    const userString = localStorage.getItem(this.USER_KEY);
    if (!userString) return null;

    try {
      return JSON.parse(userString);
    } catch {
      return null;
    }
  }

  // Vérifier si "Se souvenir de moi" est activé
  isRememberMeEnabled(): boolean {
    if (typeof window === "undefined") return false;
    return CookieService.get(this.REMEMBER_ME_KEY) === 'true';
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

    // Nettoyer les cookies
    CookieService.remove(this.ACCESS_TOKEN_KEY);
    CookieService.remove(this.REFRESH_TOKEN_KEY);
    CookieService.remove(this.USER_KEY);
    CookieService.remove(this.REMEMBER_ME_KEY);

    // Nettoyer localStorage (fallback)
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
