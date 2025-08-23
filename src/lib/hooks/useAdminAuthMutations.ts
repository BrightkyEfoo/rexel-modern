import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { adminLogin, verifyAdminToken, adminLogout, AdminLoginRequest } from '../api/admin-auth';

// Query keys pour l'auth admin
export const adminAuthKeys = {
  all: ['admin-auth'] as const,
  user: () => [...adminAuthKeys.all, 'user'] as const,
  verify: (token: string) => [...adminAuthKeys.all, 'verify', token] as const,
};

/**
 * Mutation pour la connexion admin
 */
export function useAdminLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: AdminLoginRequest) => adminLogin(credentials),
    onSuccess: (response) => {
      // Stocker les données d'authentification
      localStorage.setItem('admin_token', response.data.token);
      localStorage.setItem('admin_user', JSON.stringify(response.data.user));
      
      // Invalider les queries d'auth pour refetch
      queryClient.invalidateQueries({ queryKey: adminAuthKeys.all });
      
      // Rediriger vers le dashboard
      router.push('/admin');
    },
    onError: (error) => {
      console.error('Erreur de connexion admin:', error);
    }
  });
}

/**
 * Mutation pour la déconnexion admin
 */
export function useAdminLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminLogout(),
    onSuccess: () => {
      // Supprimer les données d'authentification
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      
      // Vider le cache des queries d'auth
      queryClient.removeQueries({ queryKey: adminAuthKeys.all });
      
      // Rediriger vers la page de login
      router.push('/admin/login');
    },
    onError: (error) => {
      console.error('Erreur de déconnexion admin:', error);
      // Même en cas d'erreur, on déconnecte localement
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      router.push('/admin/login');
    }
  });
}

/**
 * Query pour vérifier l'authentification admin
 */
export function useAdminAuthStatus() {
  return useQuery({
    queryKey: adminAuthKeys.user(),
    queryFn: async () => {
      const token = localStorage.getItem('admin_token');
      const userStr = localStorage.getItem('admin_user');

      if (!token || !userStr) {
        return { isAuthenticated: false, user: null };
      }

      try {
        // Vérifier le token côté serveur (simulation)
        const response = await verifyAdminToken(token);
        
        if (response.success && response.data.valid) {
          const user = JSON.parse(userStr);
          return { isAuthenticated: true, user };
        } else {
          // Token invalide, nettoyer le localStorage
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          return { isAuthenticated: false, user: null };
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du token admin:', error);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        return { isAuthenticated: false, user: null };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false
  });
}

/**
 * Hook pour protéger les pages admin
 */
export function useRequireAdminAuth() {
  const router = useRouter();
  const { data: authStatus, isLoading, error } = useAdminAuthStatus();

  // Rediriger si pas authentifié (une fois le loading terminé)
  React.useEffect(() => {
    if (!isLoading && (!authStatus?.isAuthenticated || error)) {
      router.push('/admin/login');
    }
  }, [isLoading, authStatus?.isAuthenticated, error, router]);

  return {
    isAuthenticated: authStatus?.isAuthenticated || false,
    adminUser: authStatus?.user,
    isLoading,
    error
  };
}

// Import React pour useEffect
import React from 'react';
