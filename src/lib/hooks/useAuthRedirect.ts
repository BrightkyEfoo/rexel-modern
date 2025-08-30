'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const REDIRECT_URL_KEY = 'auth_redirect_url';
const CURRENT_PAGE_KEY = 'current_page_url';

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
    const currentPage = localStorage.getItem(CURRENT_PAGE_KEY);
    const redirectParam = searchParams.get('redirect');
    
    // Priorité au paramètre URL, puis à l'URL sauvegardée, puis à la page actuelle, puis à l'accueil
    const redirectUrl = redirectParam || savedUrl || currentPage || '/';
    
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

// Hook pour sauvegarder automatiquement la page actuelle à chaque visite
export function useCurrentPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Construire l'URL complète avec les paramètres de recherche
    const currentUrl = searchParams.toString() 
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    // Ne pas sauvegarder les pages d'authentification
    if (currentUrl.startsWith('/auth/')) {
      return;
    }

    // Ne pas sauvegarder la page d'accueil comme page courante
    if (currentUrl === '/') {
      return;
    }

    // Sauvegarder la page actuelle
    localStorage.setItem(CURRENT_PAGE_KEY, currentUrl);
  }, [pathname, searchParams]);

  // Récupérer la page actuelle sauvegardée
  const getCurrentPage = (): string => {
    return localStorage.getItem(CURRENT_PAGE_KEY) || '/';
  };

  // Nettoyer la page sauvegardée
  const clearCurrentPage = () => {
    localStorage.removeItem(CURRENT_PAGE_KEY);
  };

  return {
    getCurrentPage,
    clearCurrentPage,
  };
}

// Fonction utilitaire pour nettoyer toutes les données utilisateur lors de la déconnexion
export function clearUserData() {
  // Nettoyer le localStorage (garder seulement la page actuelle)
  const keysToKeep = ['current_page_url']; // Garder la page actuelle pour la redirection
  const keysToRemove = Object.keys(localStorage).filter(key => !keysToKeep.includes(key));
  keysToRemove.forEach(key => localStorage.removeItem(key));

  // Nettoyer le sessionStorage
  sessionStorage.clear();

  // Nettoyer le sessionId
  localStorage.removeItem('cart-session-id');

  // Nettoyer le panier Zustand
  if (typeof window !== "undefined") {
    try {
      import("@/lib/stores/cart-store").then(({ useCartStore }) => {
        useCartStore.getState().clearCart();
      });
    } catch (error) {
      console.log("Cart store not found");
    }
  }
}
