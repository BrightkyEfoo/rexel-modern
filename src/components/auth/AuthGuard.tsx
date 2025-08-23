'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthRedirect } from '@/lib/hooks/useAuthRedirect';
import { useRequireAuthState } from '@/lib/hooks/useAuthState';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function AuthGuard({ children, requireAuth = false, redirectTo = '/auth/login' }: AuthGuardProps) {
  const { shouldShowLogin, canShowContent, isLoading, isHydrated } = useRequireAuthState();
  const router = useRouter();
  const pathname = usePathname();
  const { saveCurrentUrl } = useAuthRedirect();

  useEffect(() => {
    // Ne rien faire pendant l'hydratation ou le chargement
    if (!isHydrated || isLoading) return;

    // Si l'authentification est requise mais l'utilisateur n'est pas connecté
    if (requireAuth && shouldShowLogin) {
      // Sauvegarder l'URL actuelle avant de rediriger
      saveCurrentUrl(pathname);
      
      // Rediriger vers la page de connexion
      router.push(redirectTo);
    }
  }, [shouldShowLogin, isLoading, isHydrated, requireAuth, pathname, redirectTo, router, saveCurrentUrl]);

  // Afficher le contenu si pas de restriction ou utilisateur peut voir le contenu
  if (!requireAuth || canShowContent) {
    return <>{children}</>;
  }

  // Afficher un spinner pendant l'hydratation ou le chargement
  if (!isHydrated || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Ne pas afficher le contenu si l'authentification est requise mais l'utilisateur n'est pas connecté
  return null;
}
