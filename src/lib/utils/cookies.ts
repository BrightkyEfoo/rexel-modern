import Cookies from 'js-cookie';

export interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

export class CookieService {
  private static readonly DEFAULT_OPTIONS: CookieOptions = {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  /**
   * Définir un cookie
   */
  static set(name: string, value: string, options: CookieOptions = {}): void {
    const finalOptions = { ...this.DEFAULT_OPTIONS, ...options };
    Cookies.set(name, value, finalOptions);
  }

  /**
   * Récupérer un cookie
   */
  static get(name: string): string | undefined {
    return Cookies.get(name);
  }

  /**
   * Supprimer un cookie
   */
  static remove(name: string, options: CookieOptions = {}): void {
    const finalOptions = { ...this.DEFAULT_OPTIONS, ...options };
    Cookies.remove(name, finalOptions);
  }

  /**
   * Vérifier si un cookie existe
   */
  static exists(name: string): boolean {
    return Cookies.get(name) !== undefined;
  }

  /**
   * Définir un cookie avec expiration en jours
   */
  static setWithDays(name: string, value: string, days: number, options: CookieOptions = {}): void {
    this.set(name, value, {
      ...options,
      expires: days,
    });
  }

  /**
   * Définir un cookie de session (expire à la fermeture du navigateur)
   */
  static setSession(name: string, value: string, options: CookieOptions = {}): void {
    this.set(name, value, {
      ...options,
      expires: undefined, // Pas d'expiration = cookie de session
    });
  }
}

// Constantes pour les noms de cookies
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'kesimarket_access_token',
  REFRESH_TOKEN: 'kesimarket_refresh_token',
  USER_DATA: 'kesimarket_user',
  REMEMBER_ME: 'kesimarket_remember_me',
  THEME: 'kesimarket_theme',
  LANGUAGE: 'kesimarket_language',
} as const;
