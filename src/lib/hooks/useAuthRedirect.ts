'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const REDIRECT_URL_KEY = 'auth_redirect_url';

export function useAuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sauvegarder l'URL actuelle avant d'aller vers une page auth
  const saveCurrentUrl = (currentPath: string) => {
    // Ne pas sauvegarder si on est déjà dans le flow auth
    if (currentPath.startsWith('/auth/')) {
      return;
    }

    // Ne pas sauvegarder la page d'accueil comme fallback
    if (currentPath === '/') {
      return;
    }

    localStorage.setItem(REDIRECT_URL_KEY, currentPath);
  };

  // Récupérer l'URL de redirection sauvegardée
  const getSavedRedirectUrl = (): string => {
    const savedUrl = localStorage.getItem(REDIRECT_URL_KEY);
    const redirectParam = searchParams.get('redirect');
    
    // Priorité au paramètre URL, puis à l'URL sauvegardée
    const redirectUrl = redirectParam || savedUrl || '/';
    
    return redirectUrl;
  };

  // Effectuer la redirection après authentification
  const redirectAfterAuth = () => {
    const redirectUrl = getSavedRedirectUrl();
    
    // Nettoyer l'URL sauvegardée
    localStorage.removeItem(REDIRECT_URL_KEY);
    
    router.push(redirectUrl);
  };

  // Nettoyer l'URL sauvegardée
  const clearSavedUrl = () => {
    localStorage.removeItem(REDIRECT_URL_KEY);
  };

  return {
    saveCurrentUrl,
    getSavedRedirectUrl,
    redirectAfterAuth,
    clearSavedUrl,
  };
}

// Hook pour sauvegarder automatiquement l'URL avant d'aller vers auth
export function useAuthUrlSaver() {
  const { saveCurrentUrl } = useAuthRedirect();

  const navigateToAuth = (authPath: string, currentPath?: string) => {
    // Utiliser l'URL actuelle ou celle fournie
    const urlToSave = currentPath || window.location.pathname + window.location.search;
    
    // Sauvegarder l'URL actuelle
    saveCurrentUrl(urlToSave);
    
    // Rediriger vers la page auth
    window.location.href = authPath;
  };

  return {
    navigateToAuth,
  };
}
