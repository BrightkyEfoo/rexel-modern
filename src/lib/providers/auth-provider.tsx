'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/auth/auth-service';
import { authKeys } from '@/lib/auth/auth-hooks';
import type { User } from '@/lib/api/types';

interface AuthContextValue {
  isHydrated: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextValue>({
  isHydrated: false,
  isAuthenticated: false,
  user: null,
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Hydratation de l'état d'authentification au démarrage
    const hydrateAuth = async () => {
      try {
        // Vérifier si on a un token et un utilisateur stockés
        const token = authService.getAccessToken();
        const storedUser = authService.getStoredUser();

        if (token && storedUser) {
          // Vérifier si le token n'est pas expiré
          if (!authService.isTokenExpired(token)) {
            // Le token est valide, on peut considérer l'utilisateur comme connecté
            setIsAuthenticated(true);
            setUser(storedUser);

            // Initialiser les données dans React Query
            queryClient.setQueryData(authKeys.isAuthenticated, true);
            queryClient.setQueryData(authKeys.currentUser, storedUser);

            // Optionnel: Vérifier auprès du serveur que le token est toujours valide
            // et mettre à jour les informations utilisateur (en mode silencieux)
            // On fait cela après avoir restauré l'état pour éviter les "flash"
            setTimeout(async () => {
              try {
                const freshUser = await authService.getCurrentUser();
                setUser(freshUser);
                queryClient.setQueryData(authKeys.currentUser, freshUser);
              } catch (error) {
                // Si la vérification échoue, déconnecter l'utilisateur
                console.warn('Token validation failed, logging out:', error);
                await authService.logout();
                setIsAuthenticated(false);
                setUser(null);
                queryClient.setQueryData(authKeys.isAuthenticated, false);
                queryClient.removeQueries({ queryKey: authKeys.currentUser });
              }
            }, 100); // Petit délai pour éviter les "flash"
          } else {
            // Token expiré, nettoyer le stockage
            console.warn('Token expired, clearing storage');
            await authService.logout();
            setIsAuthenticated(false);
            setUser(null);
            queryClient.setQueryData(authKeys.isAuthenticated, false);
            queryClient.removeQueries({ queryKey: authKeys.currentUser });
          }
        } else {
          // Aucun token ou utilisateur stocké
          setIsAuthenticated(false);
          setUser(null);
          queryClient.setQueryData(authKeys.isAuthenticated, false);
          queryClient.removeQueries({ queryKey: authKeys.currentUser });
        }
      } catch (error) {
        console.error('Auth hydration error:', error);
        // En cas d'erreur, considérer comme non connecté
        setIsAuthenticated(false);
        setUser(null);
        queryClient.setQueryData(authKeys.isAuthenticated, false);
        queryClient.removeQueries({ queryKey: authKeys.currentUser });
      } finally {
        setIsHydrated(true);
      }
    };

    hydrateAuth();
  }, [queryClient]);

  // Écouter les changements d'état d'authentification dans React Query
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.query.queryKey[0] === 'auth') {
        if (event.query.queryKey[1] === 'isAuthenticated') {
          const authStatus = event.query.state.data as boolean;
          if (authStatus !== undefined) {
            setIsAuthenticated(authStatus);
          }
        } else if (event.query.queryKey[1] === 'currentUser') {
          const userData = event.query.state.data as User | null;
          setUser(userData);
        }
      }
    });

    return unsubscribe;
  }, [queryClient]);

  const contextValue: AuthContextValue = {
    isHydrated,
    isAuthenticated,
    user,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
