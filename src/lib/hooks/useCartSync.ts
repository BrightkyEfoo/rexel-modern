import { useEffect } from 'react';
import { useCartStore } from '@/lib/stores/cart-store';
import { useCart, useAddToCart, useUpdateCartItem, useRemoveFromCart } from '@/lib/query/hooks';
import { useAuthUser } from '@/lib/auth/auth-hooks';
import type { Product } from '@/lib/api/types';

/**
 * Hook pour synchroniser le store Zustand local avec l'API backend
 * - Pour les utilisateurs non connectés : persistence locale uniquement
 * - Pour les utilisateurs connectés : synchronisation avec le backend
 */
export function useCartSync() {
  const { isAuthenticated } = useAuthUser();
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

  // Fonction pour ajouter un item (local + backend si connecté)
  const addItem = async (product: Product, quantity: number = 1) => {
    // Toujours ajouter localement d'abord pour un feedback immédiat
    addLocalItem(product, quantity);

    // Si l'utilisateur est connecté, synchroniser avec le backend
    if (isAuthenticated) {
      try {
        await addToCartMutation.mutateAsync({
          productId: product.id.toString(),
          quantity,
        });
        // Recharger le panier backend pour synchroniser
        refetchCart();
      } catch (error) {
        console.error('Failed to sync cart with backend:', error);
        // En cas d'erreur, on garde la version locale
      }
    }
  };

  // Fonction pour mettre à jour la quantité
  const updateQuantity = async (productId: string, quantity: number) => {
    // Mise à jour locale immédiate
    updateLocalQuantity(productId, quantity);

    // Si connecté, synchroniser avec le backend
    if (isAuthenticated && backendCart?.data) {
      try {
        const backendItem = backendCart.data.items.find(
          item => item.product.id.toString() === productId
        );
        
        if (backendItem) {
          await updateCartMutation.mutateAsync({
            itemId: backendItem.id,
            quantity,
          });
          refetchCart();
        }
      } catch (error) {
        console.error('Failed to sync cart update with backend:', error);
      }
    }
  };

  // Fonction pour supprimer un item
  const removeItem = async (productId: string) => {
    // Suppression locale immédiate
    removeLocalItem(productId);

    // Si connecté, synchroniser avec le backend
    if (isAuthenticated && backendCart?.data) {
      try {
        const backendItem = backendCart.data.items.find(
          item => item.product.id.toString() === productId
        );
        
        if (backendItem) {
          await removeCartMutation.mutateAsync(backendItem.id);
          refetchCart();
        }
      } catch (error) {
        console.error('Failed to sync cart removal with backend:', error);
      }
    }
  };

  // Synchroniser le store local avec les données backend lors du chargement initial
  useEffect(() => {
    if (isAuthenticated && backendCart?.data) {
      // Vider le panier local
      clearLocalCart();
      
      // Repeupler avec les données backend
      backendCart.data.items.forEach(item => {
        addLocalItem(item.product, item.quantity);
      });
    }
  }, [isAuthenticated, backendCart, addLocalItem, clearLocalCart]);

  return {
    // Fonctions synchronisées
    addItem,
    updateQuantity,
    removeItem,
    
    // État local (toujours à jour)
    items: localItems,
    totalItems: localItems.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: localItems.reduce((sum, item) => {
      const price = parseFloat(item.product.salePrice || item.product.price);
      return sum + (price * item.quantity);
    }, 0),
    
    // État de synchronisation
    isLoading: addToCartMutation.isPending || updateCartMutation.isPending || removeCartMutation.isPending,
    error: addToCartMutation.error || updateCartMutation.error || removeCartMutation.error,
  };
}
