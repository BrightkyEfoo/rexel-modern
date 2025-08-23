import { apiClient } from './client';

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      email: string;
      role: 'admin';
      permissions: string[];
      loginTime: string;
    };
  };
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

/**
 * Authentification admin
 */
export async function adminLogin(credentials: AdminLoginRequest): Promise<ApiResponse<AdminLoginResponse['data']>> {
  // TODO: Remplacer par une vraie API backend
  // Pour le moment, simulation d'authentification
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email === 'admin@rexel.com' && credentials.password === 'admin123') {
        resolve({
          success: true,
          data: {
            token: 'admin-authenticated-' + Date.now(),
            user: {
              email: credentials.email,
              role: 'admin',
              permissions: ['read', 'write', 'delete', 'manage_users', 'manage_products'],
              loginTime: new Date().toISOString()
            }
          },
          message: 'Connexion administrateur réussie'
        });
      } else {
        reject(new Error('Identifiants administrateur invalides'));
      }
    }, 1000); // Simulation de latence réseau
  });
}

/**
 * Vérification du token admin
 */
export async function verifyAdminToken(token: string): Promise<ApiResponse<{ valid: boolean; user?: AdminLoginResponse['data']['user'] }>> {
  // TODO: Remplacer par une vraie API backend
  return new Promise((resolve) => {
    setTimeout(() => {
      if (token.startsWith('admin-authenticated-')) {
        // Vérifier la validité temporelle (24h)
        const timestamp = parseInt(token.split('-').pop() || '0');
        const now = Date.now();
        const hoursDiff = (now - timestamp) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          resolve({
            success: true,
            data: {
              valid: true,
                          user: {
              email: 'admin@rexel.com',
              role: 'admin',
              permissions: ['read', 'write', 'delete', 'manage_users', 'manage_products'],
              loginTime: new Date(timestamp).toISOString()
            }
            },
            message: 'Token valide'
          });
        } else {
          resolve({
            success: false,
            data: { valid: false },
            message: 'Token expiré'
          });
        }
      } else {
        resolve({
          success: false,
          data: { valid: false },
          message: 'Token invalide'
        });
      }
    }, 300);
  });
}

/**
 * Déconnexion admin
 */
export async function adminLogout(): Promise<ApiResponse<null>> {
  // TODO: Remplacer par une vraie API backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: null,
        message: 'Déconnexion réussie'
      });
    }, 300);
  });
}
