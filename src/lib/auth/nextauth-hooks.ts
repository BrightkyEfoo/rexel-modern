"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { nextAuthApiClient } from "@/lib/api/nextauth-client";
import type { RegisterData } from "@/lib/api/types";
import type { LoginFormData } from "@/lib/validations/auth";

// Hook pour obtenir l'état d'authentification
export function useAuth() {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && !!session;

  return {
    user: session?.user || null,
    session,
    isAuthenticated,
    isLoading,
    status,
    // Helper pour vérifier les rôles
    hasRole: (role: string) => session?.user?.type === role,
    hasAnyRole: (roles: string[]) =>
      session?.user?.type ? roles.includes(session.user.type) : false,
  };
}

// Hook pour la connexion
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      sessionStorage.setItem("temp_password", password);
      try {
        // Appeler directement l'API backend
        const response = await nextAuthApiClient.post<{
          message: string;
          data: {
            user?: {
              id: number;
              firstName: string;
              lastName: string;
              fullName: string;
              email: string;
              company?: string;
              phone?: string;
              type: string;
              isVerified: boolean;
              emailVerifiedAt?: string;
            };
            token?: string;
            userId?: number;
            email?: string;
            requiresVerification?: boolean;
          };
        }>("/opened/auth/login", {
          email,
          password,
        });

        // Si la vérification est requise, sauvegarder le mot de passe et lancer une erreur spéciale
        if (response.data.data.requiresVerification) {
          // Sauvegarder temporairement le mot de passe pour la vérification OTP

          throw {
            type: "VERIFICATION_REQUIRED",
            message: response.data.message,
            userId: response.data.data.userId!,
            email: response.data.data.email!,
          };
        }

        // Si la connexion est réussie, utiliser NextAuth pour créer la session
        if (response.data.data.user && response.data.data.token) {
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
          });

          if (result?.error) {
            throw new Error(result.error);
          }
        }

        return response.data;
      } catch (error: any) {
        // Si c'est déjà une erreur de vérification, la relancer
        if (
          error.type === "VERIFICATION_REQUIRED" ||
          error.code === "VERIFICATION_REQUIRED"
        ) {
          throw { ...error, type: "VERIFICATION_REQUIRED" };
        }

        // Pour les autres erreurs, essayer de les parser
        if (error.response?.data) {
          const errorData = error.response.data;
          if (errorData.data?.requiresVerification) {
            throw {
              type: "VERIFICATION_REQUIRED",
              message: errorData.message,
              userId: errorData.data.userId,
              email: errorData.data.email,
            };
          }
          throw new Error(errorData.message || "Erreur de connexion");
        }

        throw error;
      }
    },
    onSuccess: () => {
      // Invalider toutes les queries pour forcer un rafraîchissement
      queryClient.invalidateQueries();
    },
  });
}

// Hook pour la déconnexion
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Optionnel: Appeler l'API de déconnexion du backend
      try {
        await nextAuthApiClient.post("/secured/auth/logout");
      } catch (error) {
        console.warn("Backend logout failed:", error);
      }

      // Déconnexion NextAuth
      await signOut({
        redirect: false,
        callbackUrl: "/",
      });
    },
    onSuccess: () => {
      // Nettoyer toutes les données en cache
      queryClient.clear();

      // Rediriger vers la page d'accueil
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    },
  });
}

// Hook pour l'inscription
export function useRegister() {
  return useMutation({
    mutationFn: async (userData: RegisterData) => {
      const response = await nextAuthApiClient.post<{
        message: string;
        data: {
          userId: number;
          email: string;
          requiresVerification: boolean;
        };
      }>("/opened/auth/register", userData);

      if (response.data.data.requiresVerification) {
        // Retourner les informations pour la vérification
        throw {
          type: "VERIFICATION_REQUIRED",
          message: response.data.message,
          userId: response.data.data.userId,
          email: response.data.data.email,
        };
      }

      return response.data;
    },
    onError: (error: { type: string }) => {
      if (error.type === "VERIFICATION_REQUIRED") {
        throw error;
      }
      console.error("❌ Registration error:", error);
    },
    retry: false,
  });
}

// Hook pour la vérification OTP
export function useVerifyOtp(redirectAfterAuth: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, otp }: { userId: number; otp: string }) => {
      const response = await nextAuthApiClient.post<{
        message: string;
        data: {
          user: {
            id: number;
            firstName: string;
            lastName: string;
            fullName: string;
            email: string;
            company?: string;
            phone?: string;
            type: string;
            isVerified: boolean;
            emailVerifiedAt?: string;
          };
          token: string;
        };
      }>("/opened/auth/verify-otp", {
        userId,
        otp,
      });

      return response.data;
    },
    onSuccess: async (data) => {
      // Après vérification réussie, connecter l'utilisateur via NextAuth
      if (data.data.user) {
        try {
          // Récupérer le mot de passe temporairement sauvegardé
          const tempPassword = sessionStorage.getItem("temp_password");

          // Utiliser NextAuth pour créer la session avec le mot de passe original
          const result = await signIn("credentials", {
            email: data.data.user.email,
            password: tempPassword || "", // Utiliser le mot de passe sauvegardé
            redirect: false,
          });

          // Nettoyer le mot de passe temporaire
          sessionStorage.removeItem("temp_password");

          if (result?.error) {
            console.error("NextAuth signIn error:", result.error);
          }
        } catch (error) {
          console.error("Error signing in with NextAuth:", error);
        }
      }

      // Invalider toutes les queries pour forcer un rafraîchissement
      queryClient.invalidateQueries();
      redirectAfterAuth();
    },
  });
}

// Hook pour renvoyer le code OTP
export function useResendOtp() {
  return useMutation({
    mutationFn: async ({ userId }: { userId: number }) => {
      const response = await nextAuthApiClient.post("/opened/auth/resend-otp", {
        userId,
      });
      return response.data;
    },
  });
}

// Hook pour les pages protégées
export function useRequireAuth(requiredRoles?: string[]) {
  const { user, isAuthenticated, isLoading, hasAnyRole } = useAuth();

  const hasRequiredRole = requiredRoles ? hasAnyRole(requiredRoles) : true;

  return {
    user,
    isAuthenticated,
    isLoading,
    hasAccess: isAuthenticated && hasRequiredRole,
    needsAuth: !isLoading && !isAuthenticated,
    needsRole: !isLoading && isAuthenticated && !hasRequiredRole,
  };
}

// Hook pour obtenir le token d'accès
export function useAccessToken() {
  const { session } = useAuth();
  return session?.accessToken || null;
}
