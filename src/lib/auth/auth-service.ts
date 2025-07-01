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

export class AuthService {
  private readonly ACCESS_TOKEN_KEY = "rexel_access_token";
  private readonly REFRESH_TOKEN_KEY = "rexel_refresh_token";
  private readonly USER_KEY = "rexel_user";

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      return {
        accessToken: "",
        refreshToken: "",
        expiresIn: 0,
        user: {
          id: "1",
          email: "user@example.com",
          firstName: "Jean",
          lastName: "Dupont",
          company: "Électricité Moderne",
          role: "customer",
          preferences: {
            language: "fr",
            currency: "EUR",
            notifications: true,
            newsletter: false,
          },
          addresses: [
            {
              id: "addr-1",
              type: "billing",
              name: "Jean Dupont",
              company: "Électricité Moderne",
              street: "123 Avenue de la République",
              city: "Lyon",
              postalCode: "69001",
              country: "France",
              isDefault: true,
            },
            {
              id: "addr-2",
              type: "shipping",
              name: "Jean Dupont",
              company: "Électricité Moderne",
              street: "456 Rue du Commerce",
              city: "Lyon",
              postalCode: "69002",
              country: "France",
              isDefault: false,
            },
          ],
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-06-15T10:00:00Z",
          lastLogin: "2024-06-15T10:00:00Z",
          isVerified: true,
        },
      };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Register new user
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        "/auth/register",
        userData
      );

      if (response.data) {
        this.storeTokens(response.data);
        this.storeUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        await apiClient.post("/auth/logout", { refreshToken });
      }
    } catch (error) {
      console.warn("Logout request failed:", error);
    } finally {
      this.clearStorage();
    }
  }

  // Refresh access token
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await apiClient.post<AuthResponse>("/auth/refresh", {
        refreshToken,
      });

      if (response.data) {
        this.storeTokens(response.data);
        this.storeUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      this.clearStorage();
      throw this.handleAuthError(error);
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    const token = this.getAccessToken();

    if (!token || this.isTokenExpired(token)) {
      throw new Error("No valid token available");
    }

    try {
      const response = await apiClient.get<User>("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      this.storeUser(response.data);
      return response.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<User>("/auth/profile", userData);
      this.storeUser(response.data);
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
      await apiClient.post("/auth/change-password", {
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
      await apiClient.post("/auth/password-reset/confirm", {
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

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
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
    return token !== null && !this.isTokenExpired(token);
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
  private storeTokens(authData: AuthResponse): void {
    if (typeof window === "undefined") return;

    localStorage.setItem(this.ACCESS_TOKEN_KEY, authData.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, authData.refreshToken);
  }

  private storeUser(user: User): void {
    if (typeof window === "undefined") return;

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

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
