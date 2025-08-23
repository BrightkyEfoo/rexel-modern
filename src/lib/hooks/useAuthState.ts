'use client';

import { useAuthUser } from '@/lib/auth/auth-hooks';
import { useAuthContext } from '@/lib/providers/auth-provider';

/**
 * Hook qui combine l'état d'authentification avec l'état d'hydratation
 * Utile pour éviter les "flash" de contenu non-authentifié pendant le chargement initial
 */
export function useAuthState() {
  const { user, isAuthenticated, isLoading, error, hasRole, hasAnyRole } = useAuthUser();
  const { isHydrated } = useAuthContext();

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || !isHydrated,
    isHydrated,
    error,
    hasRole,
    hasAnyRole,
    // État combiné pour savoir si on peut afficher du contenu conditionnel
    canShowAuthContent: isHydrated && !isLoading,
    // État pour savoir si l'utilisateur est vraiment connecté (pas en cours de vérification)
    isDefinitelyAuthenticated: isHydrated && !isLoading && isAuthenticated,
    // État pour savoir si l'utilisateur est vraiment déconnecté (pas en cours de vérification)
    isDefinitelyUnauthenticated: isHydrated && !isLoading && !isAuthenticated,
  };
}

/**
 * Hook pour les composants qui nécessitent une authentification
 * Retourne des helpers pour gérer l'affichage conditionnel
 */
export function useRequireAuthState(requiredRoles?: string[]) {
  const authState = useAuthState();
  const { isAuthenticated, user, isHydrated, isLoading } = authState;

  const hasRequiredRole = requiredRoles && user 
    ? authState.hasAnyRole(requiredRoles)
    : true;

  const hasAccess = isAuthenticated && hasRequiredRole;

  return {
    ...authState,
    hasAccess,
    needsAuth: isHydrated && !isLoading && !isAuthenticated,
    needsRole: isHydrated && !isLoading && isAuthenticated && !hasRequiredRole,
    canShowContent: isHydrated && !isLoading && hasAccess,
    shouldShowLogin: isHydrated && !isLoading && !isAuthenticated,
    shouldShowAccessDenied: isHydrated && !isLoading && isAuthenticated && !hasRequiredRole,
  };
}
