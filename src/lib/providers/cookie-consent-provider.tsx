'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { CookieBanner } from '@/components/ui/cookie-banner';
import { useCookieConsent } from '@/lib/hooks/useCookieConsent';
import { CookieConsent } from '@/lib/types/cookies';

interface CookieConsentContextType {
  consent: CookieConsent | null;
  hasConsent: boolean;
  isLoading: boolean;
  showConsentBanner: () => void;
  resetConsent: () => void;
  canUseAnalytics: boolean;
  canUseMarketing: boolean;
  canUseFunctional: boolean;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

interface CookieConsentProviderProps {
  children: React.ReactNode;
  showBanner?: boolean;
  bannerPosition?: 'bottom' | 'top';
  bannerTheme?: 'light' | 'dark';
}

export function CookieConsentProvider({ 
  children, 
  showBanner = true,
  bannerPosition = 'bottom',
  bannerTheme = 'light'
}: CookieConsentProviderProps) {
  const cookieConsent = useCookieConsent();
  const [isClient, setIsClient] = useState(false);

  // Éviter les problèmes d'hydratation
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Charger Google Analytics si autorisé
  useEffect(() => {
    if (cookieConsent.canUseAnalytics && typeof window !== 'undefined') {
      // Ici vous pouvez charger Google Analytics
      console.log('Analytics autorisés - chargement de Google Analytics');
    }
  }, [cookieConsent.canUseAnalytics]);

  // Charger les scripts marketing si autorisés
  useEffect(() => {
    if (cookieConsent.canUseMarketing && typeof window !== 'undefined') {
      // Ici vous pouvez charger Facebook Pixel, etc.
      console.log('Marketing autorisé - chargement des scripts marketing');
    }
  }, [cookieConsent.canUseMarketing]);

  const contextValue: CookieConsentContextType = {
    consent: cookieConsent.consent,
    hasConsent: cookieConsent.hasConsent,
    isLoading: cookieConsent.isLoading,
    showConsentBanner: cookieConsent.showConsentBanner,
    resetConsent: cookieConsent.resetConsent,
    canUseAnalytics: cookieConsent.canUseAnalytics,
    canUseMarketing: cookieConsent.canUseMarketing,
    canUseFunctional: cookieConsent.canUseFunctional,
  };

  return (
    <CookieConsentContext.Provider value={contextValue}>
      {children}
      {isClient && showBanner && (
        <CookieBanner 
          position={bannerPosition}
          theme={bannerTheme}
        />
      )}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsentContext() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsentContext must be used within a CookieConsentProvider');
  }
  return context;
}
