import { useState, useEffect, useCallback } from 'react';
import { CookieConsentService } from '../services/cookie-consent';
import { CookieConsent } from '../types/cookies';

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le consentement au montage
  useEffect(() => {
    const loadConsent = () => {
      const currentConsent = CookieConsentService.getConsent();
      setConsent(currentConsent);
      setShowBanner(!currentConsent);
      setIsLoading(false);
    };

    // Charger immédiatement si côté client
    if (typeof window !== 'undefined') {
      loadConsent();
    } else {
      // Attendre l'hydratation côté serveur
      setIsLoading(false);
    }
  }, []);

  // Écouter les changements de consentement
  useEffect(() => {
    const handleConsentChange = (event: CustomEvent<CookieConsent>) => {
      setConsent(event.detail);
      setShowBanner(false);
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange as EventListener);
    
    return () => {
      window.removeEventListener('cookieConsentChanged', handleConsentChange as EventListener);
    };
  }, []);

  // Accepter tous les cookies
  const acceptAll = useCallback(() => {
    CookieConsentService.acceptAll();
  }, []);

  // Rejeter tous les cookies non nécessaires
  const rejectAll = useCallback(() => {
    CookieConsentService.rejectAll();
  }, []);

  // Sauvegarder un consentement personnalisé
  const saveCustomConsent = useCallback((customConsent: Omit<CookieConsent, 'timestamp' | 'version'>) => {
    CookieConsentService.saveConsent(customConsent);
  }, []);

  // Vérifier si une catégorie est autorisée
  const isAllowed = useCallback((category: keyof Omit<CookieConsent, 'timestamp' | 'version'>) => {
    return CookieConsentService.isAllowed(category);
  }, [consent]);

  // Réinitialiser le consentement
  const resetConsent = useCallback(() => {
    CookieConsentService.clearConsent();
    setConsent(null);
    setShowBanner(true);
  }, []);

  // Masquer la bannière (sans sauvegarder)
  const hideBanner = useCallback(() => {
    setShowBanner(false);
  }, []);

  // Afficher la bannière
  const showConsentBanner = useCallback(() => {
    setShowBanner(true);
  }, []);

  return {
    // État
    consent,
    showBanner,
    isLoading,
    hasConsent: consent !== null,
    
    // Actions
    acceptAll,
    rejectAll,
    saveCustomConsent,
    resetConsent,
    hideBanner,
    showConsentBanner,
    
    // Utilitaires
    isAllowed,
    
    // Raccourcis pour les catégories courantes
    canUseAnalytics: isAllowed('analytics'),
    canUseMarketing: isAllowed('marketing'),
    canUseFunctional: isAllowed('functional'),
  };
}
