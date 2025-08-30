import { useEffect, useCallback, useRef } from 'react';
import { useCartStore } from '@/lib/stores/cart-store';
import { useCart, useAddToCart, useUpdateCartItem, useRemoveFromCart } from '@/lib/query/hooks';
import { useAuth } from '@/lib/auth/nextauth-hooks';
import type { Product } from '@/lib/api/types';
import type { CartItem as StoreCartItem } from '@/lib/stores/cart-store';

/**
 * Hook pour synchroniser le store Zustand local avec l'API backend
 * - Pour les utilisateurs non connectés : persistence locale uniquement
 * - Pour les utilisateurs connectés : synchronisation avec le backend via NextAuth
 */
export function useCartSync() {
  const { isAuthenticated, session } = useAuth();
  const { data: backendCart, refetch: refetchCart } = useCart();
  const addToCartMutation = useAddToCart();
  const updateCartMutation = useUpdateCartItem();
  const removeCartMutation = useRemoveFromCart();

  const {
    items: localItems,
    addItem: addLocalItem,
    updateQuantity: updateLocalQuantity,
    removeItem: removeLocalItem,
    clearCart: clearLocalCart,
  } = useCartStore();

  // Refs pour éviter les boucles infinies et les appels multiples
  const hasInitialized = useRef(false);
  const isProcessing = useRef(false);

  // Fonction utilitaire pour trier les items par ID
  const sortItemsById = (items: StoreCartItem[]): StoreCartItem[] => {
    return [...items].sort((a, b) => {
      const idA = parseInt(a.id, 10);
      const idB = parseInt(b.id, 10);
      return idA - idB;
    });
  };

  // Fonction pour mettre à jour la quantité
  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    try {
      // Mise à jour locale immédiate
      updateLocalQuantity(productId, quantity);

      // Si connecté, synchroniser avec le backend
      if (isAuthenticated && session?.accessToken && backendCart?.data) {
        try {
          const backendItem = backendCart.data.items.find(
            item => item.product.id.toString() === productId
          );
          
          if (backendItem) {
            await updateCartMutation.mutateAsync({
              itemId: Number(backendItem.id),
              quantity,
            });
            await refetchCart();
          }
        } catch (error) {
          console.error('Failed to sync cart update with backend:', error);
        }
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      isProcessing.current = false;
    }
  }, [isAuthenticated, session?.accessToken, backendCart, updateLocalQuantity, updateCartMutation, refetchCart]);

  // Fonction pour ajouter un item (local + backend si connecté)
  const addItem = useCallback(async (product: Product, quantity: number = 1) => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    try {
      // Vérifier si l'item existe déjà localement
      const existingItem = localItems.find(item => item.id === product.id.toString());
      
      if (existingItem) {
        // Si l'item existe, mettre à jour la quantité
        const newQuantity = existingItem.quantity + quantity;
        await updateQuantity(product.id.toString(), newQuantity);
        return;
      }

      // Toujours ajouter localement d'abord pour un feedback immédiat
      addLocalItem(product, quantity);

      // Si l'utilisateur est connecté, synchroniser avec le backend
      if (isAuthenticated && session?.accessToken) {
        try {
          await addToCartMutation.mutateAsync({
            productId: product.id.toString(),
            quantity,
          });
          // Recharger le panier backend pour synchroniser
          await refetchCart();
        } catch (error) {
          console.error('Failed to sync cart with backend:', error);
          // En cas d'erreur, on garde la version locale
        }
      }
    } catch (error) {
      console.error('Failed to add item:', error);
    } finally {
      isProcessing.current = false;
    }
  }, [isAuthenticated, session?.accessToken, localItems, addLocalItem, addToCartMutation, refetchCart, updateQuantity]);

  // Fonction pour supprimer un item
  const removeItem = useCallback(async (productId: string) => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    try {
      // Suppression locale immédiate
      removeLocalItem(productId);

      // Si connecté, synchroniser avec le backend
      if (isAuthenticated && session?.accessToken && backendCart?.data) {
        try {
          const backendItem = backendCart.data.items.find(
            item => item.product.id.toString() === productId
          );
          
          if (backendItem) {
            await removeCartMutation.mutateAsync(Number(backendItem.id));
            await refetchCart();
          }
        } catch (error) {
          console.error('Failed to sync cart removal with backend:', error);
        }
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      isProcessing.current = false;
    }
  }, [isAuthenticated, session?.accessToken, backendCart, removeLocalItem, removeCartMutation, refetchCart]);

  // Synchroniser le store local avec les données backend lors du chargement initial
  useEffect(() => {
    if (isAuthenticated && session?.accessToken && backendCart?.data && !hasInitialized.current) {
      console.log('🔄 Synchronisation initiale du panier backend vers local');
      
      // Marquer comme initialisé pour éviter les re-synchronisations
      hasInitialized.current = true;
      
      // Vider le panier local
      clearLocalCart();
      
      // Repeupler avec les données backend triées
      const sortedItems = sortItemsById(backendCart.data.items.map(item => ({
        id: item.product.id.toString(),
        product: item.product,
        quantity: item.quantity,
        addedAt: item.createdAt || new Date().toISOString(),
      })));
      
      sortedItems.forEach(item => {
        addLocalItem(item.product, item.quantity);
      });
    }
  }, [isAuthenticated, session?.accessToken, backendCart, addLocalItem, clearLocalCart]);

  // Reset la ref quand l'utilisateur se déconnecte
  useEffect(() => {
    if (!isAuthenticated) {
      hasInitialized.current = false;
      isProcessing.current = false;
    }
  }, [isAuthenticated]);

  return {
    // Fonctions synchronisées
    addItem,
    updateQuantity,
    removeItem,
    
    // État local (toujours à jour et trié)
    items: sortItemsById(localItems),
    totalItems: localItems.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: localItems.reduce((sum, item) => {
      const price = Number(item.product.salePrice || item.product.price);
      return sum + (price * item.quantity);
    }, 0),
    
    // État de synchronisation
    isLoading: addToCartMutation.isPending || updateCartMutation.isPending || removeCartMutation.isPending,
    error: addToCartMutation.error || updateCartMutation.error || removeCartMutation.error,
  };
}
