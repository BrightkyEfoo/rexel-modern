// Ce fichier est maintenant remplacé par useAdminAuthMutations.ts
// Gardé pour compatibilité temporaire

import { useAdminAuthStatus, useAdminLogout } from './useAdminAuthMutations';

export function useAdminAuth() {
  const { data: authStatus, isLoading } = useAdminAuthStatus();
  const logoutMutation = useAdminLogout();

  return {
    isAuthenticated: authStatus?.isAuthenticated || false,
    adminUser: authStatus?.user || null,
    isLoading,
    logout: () => logoutMutation.mutate(),
    checkAuthentication: () => {
      // Cette fonction est maintenant gérée par React Query
      console.log('checkAuthentication appelée - maintenant gérée par React Query');
    },
    requireAuth: () => {
      // Cette fonction est maintenant gérée par useRequireAdminAuth
      console.log('requireAuth appelée - maintenant gérée par useRequireAdminAuth');
    }
  };
}

// Export de la nouvelle version
export { useRequireAdminAuth } from './useAdminAuthMutations';
