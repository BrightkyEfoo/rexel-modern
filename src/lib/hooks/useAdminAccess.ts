'use client';

import { useAuth } from '@/lib/auth/nextauth-hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLogout } from '../auth/auth-hooks';

/**
 * Hook pour vérifier l'accès admin ou manager
 */
export function useAdminAccess() {
  const { user, isAuthenticated, isLoading, hasRole } = useAuth();
  
  const isAdmin = isAuthenticated && hasRole('admin');
  const isManager = isAuthenticated && hasRole('manager');
  const hasAdminAccess = isAdmin || isManager;
  const needsLogin = !isLoading && !isAuthenticated;
  const needsAdminRole = !isLoading && isAuthenticated && !hasAdminAccess;

  return {
    user,
    isAuthenticated,
    isAdmin,
    isManager,
    hasAdminAccess,
    isLoading,
    needsLogin,
    needsAdminRole,
    hasAccess: hasAdminAccess,
  };
}

/**
 * Hook pour protéger les pages admin avec NextAuth
 * Permet l'accès aux admins et aux managers
 */
export function useRequireAdminAuth() {
  const router = useRouter();
  const { isAdmin, isManager, hasAdminAccess, needsLogin, needsAdminRole, isLoading, user } = useAdminAccess();

  useEffect(() => {
    if (needsLogin) {
      // Rediriger vers la page de login admin
      router.push('/admin/login');
    } else if (needsAdminRole) {
      // Rediriger vers l'accueil si ni admin ni manager
      router.push('/?error=access_denied');
    }
  }, [needsLogin, needsAdminRole, router]);

  return {
    isAuthenticated: hasAdminAccess,
    adminUser: user,
    isAdmin,
    isManager,
    isLoading,
    hasAccess: hasAdminAccess,
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
