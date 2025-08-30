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
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (productId: string) => number;
  isItemInCart: (productId: string) => boolean;
  onUserLogin: () => void;
  onUserLogout: () => void;
}

// Fonction utilitaire pour trier les items par ID
const sortItemsById = (items: CartItem[]): CartItem[] => {
  return [...items].sort((a, b) => {
    const idA = parseInt(a.id, 10);
    const idB = parseInt(b.id, 10);
    return idA - idB;
  });
};

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
            const updatedItems = state.items.map(item =>
              item.id === product.id.toString()
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
            return {
              items: sortItemsById(updatedItems),
            };
          } else {
            // Ajouter un nouvel item
            const newItem: CartItem = {
              id: product.id.toString(),
              product,
              quantity,
              addedAt: new Date().toISOString(),
            };
            const updatedItems = [...state.items, newItem];
            return {
              items: sortItemsById(updatedItems),
            };
          }
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: sortItemsById(state.items.filter(item => item.id !== productId)),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set((state) => {
          const updatedItems = state.items.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          );
          return {
            items: sortItemsById(updatedItems),
          };
        });
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
          const price = Number(item.product.salePrice || item.product.price);
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
