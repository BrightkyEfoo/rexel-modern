export interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  enabled: boolean;
  cookies: CookieInfo[];
}

export interface CookieInfo {
  name: string;
  purpose: string;
  duration: string;
  type: 'first-party' | 'third-party';
}

export interface CookieConsent {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
  version: string;
}

export interface CookieBannerSettings {
  showBanner: boolean;
  position: 'bottom' | 'top';
  theme: 'light' | 'dark';
  acceptAllButton: boolean;
  rejectAllButton: boolean;
  customizeButton: boolean;
}

export const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: 'necessary',
    name: 'Cookies nécessaires',
    description: 'Ces cookies sont essentiels au fonctionnement du site web et ne peuvent pas être désactivés.',
    required: true,
    enabled: true,
    cookies: [
      {
        name: 'kesimarket_access_token',
        purpose: 'Authentification utilisateur',
        duration: '1 jour à 30 jours selon "Se souvenir de moi"',
        type: 'first-party',
      },
      {
        name: 'kesimarket_user',
        purpose: 'Données utilisateur pour la session',
        duration: '1 jour à 30 jours selon "Se souvenir de moi"',
        type: 'first-party',
      },
      {
        name: 'kesimarket_remember_me',
        purpose: 'Préférence "Se souvenir de moi"',
        duration: '30 jours',
        type: 'first-party',
      },
      {
        name: 'kesimarket_cookie_consent',
        purpose: 'Préférences de consentement aux cookies',
        duration: '1 an',
        type: 'first-party',
      },
    ],
  },
  {
    id: 'functional',
    name: 'Cookies fonctionnels',
    description: 'Ces cookies permettent d\'améliorer les fonctionnalités et la personnalisation du site.',
    required: false,
    enabled: false,
    cookies: [
      {
        name: 'kesimarket_theme',
        purpose: 'Préférence de thème (clair/sombre)',
        duration: '1 an',
        type: 'first-party',
      },
      {
        name: 'kesimarket_language',
        purpose: 'Préférence de langue',
        duration: '1 an',
        type: 'first-party',
      },
      {
        name: 'kesimarket_cart_preferences',
        purpose: 'Préférences d\'affichage du panier',
        duration: '30 jours',
        type: 'first-party',
      },
    ],
  },
  {
    id: 'analytics',
    name: 'Cookies analytiques',
    description: 'Ces cookies nous aident à comprendre comment les visiteurs utilisent notre site web.',
    required: false,
    enabled: false,
    cookies: [
      {
        name: '_ga',
        purpose: 'Google Analytics - Identification des utilisateurs uniques',
        duration: '2 ans',
        type: 'third-party',
      },
      {
        name: '_ga_*',
        purpose: 'Google Analytics - Données de session',
        duration: '2 ans',
        type: 'third-party',
      },
      {
        name: 'kesimarket_analytics',
        purpose: 'Statistiques internes d\'utilisation',
        duration: '1 an',
        type: 'first-party',
      },
    ],
  },
  {
    id: 'marketing',
    name: 'Cookies marketing',
    description: 'Ces cookies sont utilisés pour vous proposer des publicités pertinentes.',
    required: false,
    enabled: false,
    cookies: [
      {
        name: '_fbp',
        purpose: 'Facebook Pixel - Suivi des conversions',
        duration: '3 mois',
        type: 'third-party',
      },
      {
        name: 'kesimarket_marketing_prefs',
        purpose: 'Préférences marketing personnalisées',
        duration: '6 mois',
        type: 'first-party',
      },
    ],
  },
];

export const COOKIE_CONSENT_VERSION = '1.0';
export const COOKIE_CONSENT_DURATION = 365; // jours
