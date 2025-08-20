'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthUser } from '@/lib/auth/auth-hooks';
import { useAuthRedirect } from '@/lib/hooks/useAuthRedirect';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function AuthGuard({ children, requireAuth = false, redirectTo = '/auth/login' }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthUser();
  const router = useRouter();
  const pathname = usePathname();
  const { saveCurrentUrl } = useAuthRedirect();

  useEffect(() => {
    // Ne rien faire pendant le chargement
    if (isLoading) return;

    // Si l'authentification est requise mais l'utilisateur n'est pas connecté
    if (requireAuth && !isAuthenticated) {
      // Sauvegarder l'URL actuelle avant de rediriger
      saveCurrentUrl(pathname);
      
      // Rediriger vers la page de connexion
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, requireAuth, pathname, redirectTo, router, saveCurrentUrl]);

  // Afficher le contenu si pas de restriction ou utilisateur authentifié
  if (!requireAuth || isAuthenticated) {
    return <>{children}</>;
  }

  // Afficher un spinner pendant le chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Ne pas afficher le contenu si l'authentification est requise mais l'utilisateur n'est pas connecté
  return null;
}
