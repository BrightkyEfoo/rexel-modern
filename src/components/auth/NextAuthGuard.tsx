'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/nextauth-hooks';
import { useAuthRedirect } from '@/lib/hooks/useAuthRedirect';

interface NextAuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRoles?: string[];
  redirectTo?: string;
}

export function NextAuthGuard({ 
  children, 
  requireAuth = false, 
  requiredRoles,
  redirectTo = '/auth/login' 
}: NextAuthGuardProps) {
  const { isAuthenticated, isLoading, hasAnyRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { saveCurrentUrl } = useAuthRedirect();

  const hasRequiredRole = requiredRoles ? hasAnyRole(requiredRoles) : true;
  const hasAccess = isAuthenticated && hasRequiredRole;

  useEffect(() => {
    // Ne rien faire pendant le chargement
    if (isLoading) return;

    // Si l'authentification est requise mais l'utilisateur n'est pas connecté
    if (requireAuth && !isAuthenticated) {
      // Sauvegarder l'URL actuelle avant de rediriger
      saveCurrentUrl(pathname);
      
      // Rediriger vers la page de connexion
      router.push(redirectTo);
      return;
    }

    // Si l'utilisateur est connecté mais n'a pas les droits requis
    if (requireAuth && isAuthenticated && !hasRequiredRole) {
      // Rediriger vers une page d'accès refusé ou l'accueil
      router.push('/');
      return;
    }
  }, [isAuthenticated, isLoading, hasRequiredRole, requireAuth, pathname, redirectTo, router, saveCurrentUrl]);

  // Afficher le contenu si pas de restriction ou utilisateur a accès
  if (!requireAuth || hasAccess) {
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
