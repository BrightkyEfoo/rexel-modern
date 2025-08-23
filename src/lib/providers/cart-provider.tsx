'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAuthUser } from '@/lib/auth/auth-hooks';
import { useSessionId } from '@/lib/hooks/useSessionId';
import { useCartStore } from '@/lib/stores/cart-store';
import { useCart, useMergeCart } from '@/lib/query/hooks';
import type { CartItem } from '@/lib/types/cart';

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { isAuthenticated } = useAuthUser();
  const { sessionId } = useSessionId();
  const { clearCart } = useCartStore();
  const mergeCartMutation = useMergeCart();
  const hasMerged = useRef(false);
  const cartStore = useCartStore();
  
  // Vérifier si on a un token valide
  const hasValidToken = typeof window !== 'undefined' 
    ? !!localStorage.getItem('kesimarket_access_token') 
    : false;
  
  // Charger le panier backend seulement si authentifié ET token disponible
  const shouldFetchCart = isAuthenticated && hasValidToken;
  const { data: backendCart } = useCart({
    enabled: shouldFetchCart,
  });

  // Synchroniser le store Zustand avec les données backend
  useEffect(() => {
    if (backendCart?.data) {
      // Si on a des données backend, les synchroniser avec le store local
      const { items: backendItems } = backendCart.data;
      
      // Convertir les items backend au format du store Zustand
      const zustandItems = backendItems.map(item => ({
        id: item.id?.toString() || '0',
        product: item.product,
        quantity: item.quantity,
        addedAt: item.createdAt || new Date().toISOString(),
      }));

      // Mettre à jour le store local avec les données backend
      clearCart();
      zustandItems.forEach(item => {
        useCartStore.getState().addItem(item.product, item.quantity);
      });
    }
  }, [backendCart, clearCart]);

  // Suivre les changements d'authentification pour déclencher le merge au bon moment
  const prevAuthRef = useRef(isAuthenticated);
  
  useEffect(() => {
    const wasAuthenticated = prevAuthRef.current;
    const isNowAuthenticated = isAuthenticated;
    
    console.log('🛒 Auth change detected:', { 
      wasAuthenticated, 
      isNowAuthenticated, 
      sessionId, 
      hasMerged: hasMerged.current,
      hasValidToken
    });
    
    // Déclencher le merge seulement quand l'utilisateur VIENT de se connecter ET a un token valide
    if (!wasAuthenticated && isNowAuthenticated && sessionId && !hasMerged.current && hasValidToken) {
      const hasLocalItems = cartStore.items.length > 0;
      
      if (hasLocalItems) {
        console.log('🔄 Utilisateur vient de se connecter - fusion du panier...', { 
          itemCount: cartStore.items.length,
          hasToken: hasValidToken
        });
        
        // Marquer comme en cours de fusion
        hasMerged.current = true;
        
        // Fusionner avec le panier utilisateur
        mergeCartMutation.mutate();
      } else {
        console.log('🚫 Pas de fusion - panier local vide');
        hasMerged.current = true;
      }
    } else if (!wasAuthenticated && isNowAuthenticated && !hasValidToken) {
      console.log('🚫 Pas de fusion - token non disponible encore', { hasValidToken });
    }
    
    // Mettre à jour la ref pour le prochain cycle
    prevAuthRef.current = isAuthenticated;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, sessionId, hasValidToken]); // Ajouter hasValidToken pour détecter quand le token arrive

  // Reset la flag de fusion quand l'utilisateur se déconnecte
  useEffect(() => {
    if (!isAuthenticated) {
      hasMerged.current = false;
    }
  }, [isAuthenticated]);

  return <>{children}</>;
}
