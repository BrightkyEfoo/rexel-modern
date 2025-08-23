/**
 * Utilitaires pour la gestion des redirections d'authentification
 */

/**
 * Construit l'URL de connexion avec les paramètres appropriés
 * @param redirectUrl - URL vers laquelle rediriger après connexion
 * @param email - Email pré-rempli (optionnel)
 * @returns L'URL de connexion complète
 */
export function buildLoginUrl(redirectUrl?: string | null, email?: string): string {
  const params = new URLSearchParams();
  
  if (redirectUrl) {
    params.set('redirect', redirectUrl);
  }
  
  if (email) {
    params.set('email', email);
  }
  
  const queryString = params.toString();
  return `/auth/login${queryString ? `?${queryString}` : ''}`;
}

/**
 * Construit l'URL d'inscription avec les paramètres appropriés
 * @param redirectUrl - URL vers laquelle rediriger après inscription/connexion
 * @returns L'URL d'inscription complète
 */
export function buildRegisterUrl(redirectUrl?: string | null): string {
  if (!redirectUrl) {
    return '/auth/register';
  }
  
  return `/auth/register?redirect=${encodeURIComponent(redirectUrl)}`;
}

/**
 * Extrait les paramètres de redirection depuis les URLSearchParams
 * @param searchParams - Les paramètres de recherche actuels
 * @returns Un objet contenant les paramètres extraits
 */
export function extractRedirectParams(searchParams: URLSearchParams) {
  return {
    redirectUrl: searchParams.get('redirect'),
    email: searchParams.get('email'),
  };
}

/**
 * Préserve l'URL de redirection lors de la navigation entre pages d'auth
 * @param currentSearchParams - Les paramètres actuels
 * @param targetPath - Le chemin cible (ex: '/auth/login')
 * @param additionalParams - Paramètres supplémentaires à ajouter
 * @returns L'URL complète avec paramètres préservés
 */
export function preserveRedirectUrl(
  currentSearchParams: URLSearchParams,
  targetPath: string,
  additionalParams: Record<string, string> = {}
): string {
  const params = new URLSearchParams();
  
  // Préserver le paramètre redirect
  const redirectUrl = currentSearchParams.get('redirect');
  if (redirectUrl) {
    params.set('redirect', redirectUrl);
  }
  
  // Ajouter les paramètres supplémentaires
  Object.entries(additionalParams).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  
  const queryString = params.toString();
  return `${targetPath}${queryString ? `?${queryString}` : ''}`;
}
