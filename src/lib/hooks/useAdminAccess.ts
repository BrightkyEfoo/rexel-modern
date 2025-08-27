'use client';

import { useAuth } from '@/lib/auth/nextauth-hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLogout } from '../auth/auth-hooks';

/**
 * Hook pour vérifier l'accès admin
 */
export function useAdminAccess() {
  const { user, isAuthenticated, isLoading, hasRole } = useAuth();
  
  const isAdmin = isAuthenticated && hasRole('admin');
  const needsLogin = !isLoading && !isAuthenticated;
  const needsAdminRole = !isLoading && isAuthenticated && !hasRole('admin');

  return {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    needsLogin,
    needsAdminRole,
    hasAccess: isAdmin,
  };
}

/**
 * Hook pour protéger les pages admin avec NextAuth
 */
export function useRequireAdminAuth() {
  const router = useRouter();
  const { isAdmin, needsLogin, needsAdminRole, isLoading, user } = useAdminAccess();

  useEffect(() => {
    if (needsLogin) {
      // Rediriger vers la page de login admin
      router.push('/admin/login');
    } else if (needsAdminRole) {
      // Rediriger vers l'accueil si pas admin
      router.push('/?error=access_denied');
    }
  }, [needsLogin, needsAdminRole, router]);

  return {
    isAuthenticated: isAdmin,
    adminUser: user,
    isLoading,
    hasAccess: isAdmin,
  };
}

/**
 * Hook pour la déconnexion admin (utilise NextAuth)
 */
export function useAdminLogout() {
  const logoutMutation = useLogout();
  
  return {
    logout: () => logoutMutation.mutate(),
    isLoading: logoutMutation.isPending,
  };
}
