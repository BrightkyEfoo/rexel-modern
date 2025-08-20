import { useEffect } from 'react';
import { useAuthUser, useLogout } from '@/lib/auth/auth-hooks';
import { useCartStore } from '@/lib/stores/cart-store';
import { useSessionId } from './useSessionId';

/**
 * Hook pour gérer le nettoyage des stores lors de la déconnexion
 */
export function useAuthCleanup() {
  const { isAuthenticated, user } = useAuthUser();
  const { onUserLogout } = useCartStore();
  const { renewSessionId } = useSessionId();
  const logoutMutation = useLogout();

  // Fonction de déconnexion avec nettoyage
  const handleLogout = async () => {
    try {
      // Déconnexion API
      await logoutMutation.mutateAsync();
      
      // Nettoyage du store de panier
      onUserLogout();
      
      // Renouveler le session ID pour un nouveau panier anonyme
      renewSessionId();
      
      // Redirection sera gérée par le auth service
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Écouter les changements d'état d'authentification
  useEffect(() => {
    // Si l'utilisateur se déconnecte (devient non authentifié)
    if (!isAuthenticated && user === null) {
      // S'assurer que le panier est vidé
      onUserLogout();
      
      // Renouveler le session ID
      renewSessionId();
    }
  }, [isAuthenticated, user, onUserLogout, renewSessionId]);

  return {
    handleLogout,
    isLoggingOut: logoutMutation.isPending,
  };
}
