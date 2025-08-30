"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/lib/auth/nextauth-hooks";
import { useSessionId } from "@/lib/hooks/useSessionId";
import { useCartStore } from "@/lib/stores/cart-store";
import { useCart, useMergeCart, useAddToCart } from "@/lib/query/hooks";
import type { CartItem as StoreCartItem } from "@/lib/stores/cart-store";

interface CartProviderProps {
  children: React.ReactNode;
}

// Fonction utilitaire pour trier les items par ID (pour le store Zustand)
const sortItemsById = (items: StoreCartItem[]): StoreCartItem[] => {
  return [...items].sort((a, b) => {
    const idA = parseInt(a.id, 10);
    const idB = parseInt(b.id, 10);
    return idA - idB;
  });
};

export function CartProvider({ children }: CartProviderProps) {
  const { isAuthenticated, session } = useAuth();
  const { sessionId } = useSessionId();
  const { clearCart } = useCartStore();
  const mergeCartMutation = useMergeCart();
  const addToCartMutation = useAddToCart();
  const hasMerged = useRef(false);
  const hasInitializedBackendCart = useRef(false);
  const isProcessing = useRef(false);
  const cartStore = useCartStore();

  // Vérifier si on a un token valide via NextAuth
  const hasValidToken = !!session?.accessToken;

  // Charger le panier backend seulement si authentifié ET token disponible
  const shouldFetchCart = isAuthenticated && hasValidToken;
  const { data: backendCart, refetch: refetchCart } = useCart({
    enabled: shouldFetchCart,
  });

  // Fonction pour synchroniser les items locaux vers le backend
  const syncLocalItemsToBackend = useCallback(async () => {
    if (!isAuthenticated || !hasValidToken || !cartStore.items.length || isProcessing.current) {
      return;
    }

    isProcessing.current = true;

    try {
      console.log("🔄 Synchronisation des items locaux vers le backend...");
      
      // Pour chaque item local, l'ajouter au backend
      for (const item of cartStore.items) {
        await addToCartMutation.mutateAsync({
          productId: item.id,
          quantity: item.quantity,
        });
      }
      
      // Recharger le panier backend après synchronisation
      await refetchCart();
      hasInitializedBackendCart.current = true;
      console.log("✅ Synchronisation terminée");
    } catch (error) {
      console.error("❌ Erreur lors de la synchronisation vers le backend:", error);
    } finally {
      isProcessing.current = false;
    }
  }, [isAuthenticated, hasValidToken, cartStore.items, addToCartMutation, refetchCart]);

  // Synchroniser le store Zustand avec les données backend
  useEffect(() => {
    if (backendCart?.data && !isProcessing.current) {
      console.log("📦 Synchronisation du backend vers le store local");
      
      // Si on a des données backend, les synchroniser avec le store local
      const { items: backendItems } = backendCart.data;

      // Convertir les items backend au format du store Zustand et les trier
      const zustandItems: StoreCartItem[] = backendItems.map((item) => ({
        id: item.product.id.toString(),
        product: item.product,
        quantity: item.quantity,
        addedAt: item.createdAt || new Date().toISOString(),
      }));

      // Trier les items par ID
      const sortedItems = sortItemsById(zustandItems);

      // Mettre à jour le store local avec les données backend triées
      clearCart();
      sortedItems.forEach((item) => {
        useCartStore.getState().addItem(item.product, item.quantity);
      });
    }
  }, [backendCart, clearCart]);

  // Gérer l'initialisation du panier backend pour les nouveaux utilisateurs
  useEffect(() => {
    if (
      isAuthenticated && 
      hasValidToken && 
      !hasInitializedBackendCart.current &&
      !isProcessing.current &&
      cartStore.items.length > 0 &&
      (!backendCart?.data || backendCart.data.items.length === 0)
    ) {
      // Nouvel utilisateur avec des items locaux mais pas de panier backend
      console.log("🆕 Initialisation du panier backend pour nouvel utilisateur");
      syncLocalItemsToBackend();
    }
  }, [isAuthenticated, hasValidToken, backendCart, cartStore.items, syncLocalItemsToBackend]);

  // Suivre les changements d'authentification pour déclencher le merge au bon moment
  const prevAuthRef = useRef(isAuthenticated);

  useEffect(() => {
    const wasAuthenticated = prevAuthRef.current;
    const isNowAuthenticated = isAuthenticated;

    // Déclencher le merge seulement quand l'utilisateur VIENT de se connecter ET a un token valide
    if (
      !wasAuthenticated &&
      isNowAuthenticated &&
      sessionId &&
      !hasMerged.current &&
      hasValidToken
    ) {
      const hasLocalItems = cartStore.items.length > 0;

      if (hasLocalItems) {
        console.log("🔄 Fusion du panier de session avec le panier utilisateur");
        // Marquer comme en cours de fusion
        hasMerged.current = true;

        // Fusionner avec le panier utilisateur
        mergeCartMutation.mutate();
      } else {
        hasMerged.current = true;
      }
    } else if (!wasAuthenticated && isNowAuthenticated && !hasValidToken) {
      console.log("🚫 Pas de fusion - token non disponible encore", {
        hasValidToken,
        sessionId,
      });
    }

    // Mettre à jour la ref pour le prochain cycle
    prevAuthRef.current = isAuthenticated;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, sessionId, hasValidToken]); // Ajouter hasValidToken pour détecter quand le token arrive

  // Reset la flag de fusion quand l'utilisateur se déconnecte
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("🚪 Utilisateur déconnecté - nettoyage du panier");
      hasMerged.current = false;
      hasInitializedBackendCart.current = false;
      isProcessing.current = false;
      // Nettoyer le panier quand l'utilisateur se déconnecte
      clearCart();
    }
  }, [isAuthenticated, clearCart]);

  return <>{children}</>;
}
