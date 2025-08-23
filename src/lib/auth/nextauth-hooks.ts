"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { nextAuthApiClient } from "@/lib/api/nextauth-client";
import type { RegisterData } from "@/lib/api/types";

// Hook pour obtenir l'état d'authentification
export function useAuth() {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && !!session;

  console.log("session", session);

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
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Gérer les erreurs spéciales
        try {
          const errorData = JSON.parse(result.error);
          if (errorData.type === "VERIFICATION_REQUIRED") {
            throw {
              type: "VERIFICATION_REQUIRED",
              message: errorData.message,
              userId: errorData.userId,
              email: errorData.email,
            };
          }
        } catch (parseError) {
          // Si ce n'est pas du JSON, c'est une erreur normale
        }
        throw new Error(result.error);
      }

      return result;
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
      console.log("🚀 Frontend register mutation called:", {
        email: userData.email,
      });

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
export function useVerifyOtp() {
  return useMutation({
    mutationFn: async ({ userId, otp }: { userId: number; otp: string }) => {
      const response = await nextAuthApiClient.post("/opened/auth/verify-otp", {
        userId,
        otp,
      });
      return response.data;
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
