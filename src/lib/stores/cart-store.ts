import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/lib/api/types';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  
  // Actions pour la gestion de l'authentification
  onUserLogin: () => void;
  onUserLogout: () => void;
  
  // Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (productId: string) => number;
  isItemInCart: (productId: string) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id.toString());
          
          if (existingItem) {
            // Mettre à jour la quantité si l'item existe déjà
            return {
              items: state.items.map(item =>
                item.id === product.id.toString()
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          } else {
            // Ajouter un nouvel item
            const newItem: CartItem = {
              id: product.id.toString(),
              product,
              quantity,
              addedAt: new Date().toISOString(),
            };
            return {
              items: [...state.items, newItem],
            };
          }
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      setCartOpen: (isOpen: boolean) => {
        set({ isOpen });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = parseFloat(item.product.salePrice || item.product.price);
          return total + (price * item.quantity);
        }, 0);
      },

      getItemQuantity: (productId: string) => {
        const item = get().items.find(item => item.id === productId);
        return item ? item.quantity : 0;
      },

      isItemInCart: (productId: string) => {
        return get().items.some(item => item.id === productId);
      },
      
      // Gestion de la connexion utilisateur
      onUserLogin: () => {
        // Lors de la connexion, le panier sera fusionné via l'API
        // Ici on peut éventuellement faire des actions spécifiques
      },
      
      // Gestion de la déconnexion utilisateur
      onUserLogout: () => {
        // Vider le panier lors de la déconnexion
        set({ items: [] });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      // Persister seulement les items, pas l'état d'ouverture
      partialize: (state) => ({ items: state.items }),
    }
  )
);
