import { CookieService, COOKIE_NAMES } from '../utils/cookies';
import { 
  CookieConsent, 
  COOKIE_CATEGORIES, 
  COOKIE_CONSENT_VERSION, 
  COOKIE_CONSENT_DURATION 
} from '../types/cookies';

export class CookieConsentService {
  private static readonly CONSENT_COOKIE_NAME = 'kesimarket_cookie_consent';
  
  /**
   * Obtenir le consentement actuel
   */
  static getConsent(): CookieConsent | null {
    if (typeof window === 'undefined') return null;
    
    const consentData = CookieService.get(this.CONSENT_COOKIE_NAME);
    if (!consentData) return null;
    
    try {
      const consent = JSON.parse(consentData) as CookieConsent;
      
      // Vérifier si le consentement est encore valide (version)
      if (consent.version !== COOKIE_CONSENT_VERSION) {
        this.clearConsent();
        return null;
      }
      
      return consent;
    } catch {
      this.clearConsent();
      return null;
    }
  }
  
  /**
   * Sauvegarder le consentement
   */
  static saveConsent(consent: Omit<CookieConsent, 'timestamp' | 'version'>): void {
    if (typeof window === 'undefined') return;
    
    const fullConsent: CookieConsent = {
      ...consent,
      timestamp: Date.now(),
      version: COOKIE_CONSENT_VERSION,
    };
    
    CookieService.setWithDays(
      this.CONSENT_COOKIE_NAME,
      JSON.stringify(fullConsent),
      COOKIE_CONSENT_DURATION
    );
    
    // Appliquer le consentement
    this.applyConsent(fullConsent);
  }
  
  /**
   * Accepter tous les cookies
   */
  static acceptAll(): void {
    this.saveConsent({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    });
  }
  
  /**
   * Rejeter tous les cookies non nécessaires
   */
  static rejectAll(): void {
    this.saveConsent({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
  }
  
  /**
   * Vérifier si le consentement a été donné
   */
  static hasConsent(): boolean {
    return this.getConsent() !== null;
  }
  
  /**
   * Vérifier si une catégorie spécifique est autorisée
   */
  static isAllowed(category: keyof Omit<CookieConsent, 'timestamp' | 'version'>): boolean {
    const consent = this.getConsent();
    if (!consent) return false;
    
    return consent[category];
  }
  
  /**
   * Effacer le consentement
   */
  static clearConsent(): void {
    if (typeof window === 'undefined') return;
    
    CookieService.remove(this.CONSENT_COOKIE_NAME);
    this.clearNonNecessaryCookies();
  }
  
  /**
   * Appliquer le consentement (nettoyer les cookies non autorisés)
   */
  private static applyConsent(consent: CookieConsent): void {
    if (typeof window === 'undefined') return;
    
    // Si les cookies fonctionnels ne sont pas autorisés
    if (!consent.functional) {
      CookieService.remove(COOKIE_NAMES.THEME);
      CookieService.remove(COOKIE_NAMES.LANGUAGE);
      CookieService.remove('kesimarket_cart_preferences');
    }
    
    // Si les cookies analytiques ne sont pas autorisés
    if (!consent.analytics) {
      this.clearAnalyticsCookies();
    }
    
    // Si les cookies marketing ne sont pas autorisés
    if (!consent.marketing) {
      this.clearMarketingCookies();
    }
    
    // Déclencher un événement personnalisé pour informer l'application
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', {
      detail: consent
    }));
  }
  
  /**
   * Nettoyer tous les cookies non nécessaires
   */
  private static clearNonNecessaryCookies(): void {
    if (typeof window === 'undefined') return;
    
    // Cookies fonctionnels
    CookieService.remove(COOKIE_NAMES.THEME);
    CookieService.remove(COOKIE_NAMES.LANGUAGE);
    CookieService.remove('kesimarket_cart_preferences');
    
    // Cookies analytiques et marketing
    this.clearAnalyticsCookies();
    this.clearMarketingCookies();
  }
  
  /**
   * Nettoyer les cookies analytiques
   */
  private static clearAnalyticsCookies(): void {
    if (typeof window === 'undefined') return;
    
    // Google Analytics
    CookieService.remove('_ga');
    CookieService.remove('_ga_*');
    CookieService.remove('_gid');
    CookieService.remove('_gat');
    CookieService.remove('kesimarket_analytics');
    
    // Désactiver Google Analytics si présent
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
  }
  
  /**
   * Nettoyer les cookies marketing
   */
  private static clearMarketingCookies(): void {
    if (typeof window === 'undefined') return;
    
    // Facebook Pixel
    CookieService.remove('_fbp');
    CookieService.remove('_fbc');
    CookieService.remove('kesimarket_marketing_prefs');
    
    // Désactiver le suivi marketing
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
  }
  
  /**
   * Obtenir les statistiques des cookies
   */
  static getCookieStats(): {
    total: number;
    necessary: number;
    functional: number;
    analytics: number;
    marketing: number;
  } {
    const stats = {
      total: 0,
      necessary: 0,
      functional: 0,
      analytics: 0,
      marketing: 0,
    };
    
    COOKIE_CATEGORIES.forEach(category => {
      const count = category.cookies.length;
      stats.total += count;
      stats[category.id as keyof typeof stats] = count;
    });
    
    return stats;
  }
}

// Types pour window.gtag (Google Analytics)
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
