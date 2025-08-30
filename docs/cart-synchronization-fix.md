# Correction de la synchronisation du panier avec NextAuth

## Problème identifié

Pour les nouveaux utilisateurs qui venaient de créer leur compte, le panier n'était pas correctement synchronisé avec le backend. Le problème venait de plusieurs points :

1. **Pas de création automatique du panier backend** pour les nouveaux utilisateurs
2. **Incohérence dans l'utilisation des hooks** : `useCartSync()` vs `useAddToCart()` direct
3. **Logique de fusion incomplète** dans le `CartProvider`
4. **Adaptation nécessaire pour NextAuth** : Le système utilisait des hooks d'authentification personnalisés au lieu de NextAuth
5. **Boucles infinies** : La page panier entrait dans des boucles infinies de synchronisation
6. **Ajouts multiples** : Les utilisateurs pouvaient déclencher plusieurs ajouts au panier avec un seul clic
7. **Ordre des items** : Les produits dans le panier n'étaient pas ordonnés de manière cohérente

## Solutions implémentées

### 1. Amélioration du CartProvider pour NextAuth

**Fichier :** `src/lib/providers/cart-provider.tsx`

- **Migration vers NextAuth** : Remplacement de `useAuthUser()` par `useAuth()` de NextAuth
- **Gestion des tokens NextAuth** : Utilisation de `session?.accessToken` au lieu de localStorage
- **Ajout de la synchronisation automatique** : Quand un nouvel utilisateur authentifié a des items locaux mais pas de panier backend, le système synchronise automatiquement les items locaux vers le backend
- **Logs améliorés** : Messages de debug pour suivre la synchronisation
- **Protection contre les boucles infinies** : Ajout d'un flag `isProcessing` pour éviter les synchronisations simultanées
- **Tri des items** : Tri automatique des items par ID pour une expérience utilisateur cohérente

```typescript
// Migration vers NextAuth
const { isAuthenticated, session } = useAuth();

// Vérification du token via NextAuth
const hasValidToken = !!session?.accessToken;

// Protection contre les boucles infinies
const isProcessing = useRef(false);

// Fonction utilitaire pour trier les items par ID
const sortItemsById = (items: StoreCartItem[]): StoreCartItem[] => {
  return [...items].sort((a, b) => {
    const idA = parseInt(a.id, 10);
    const idB = parseInt(b.id, 10);
    return idA - idB;
  });
};

// Nouvelle fonction de synchronisation avec protection
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
```

### 2. Amélioration du hook useCartSync pour NextAuth

**Fichier :** `src/lib/hooks/useCartSync.ts`

- **Migration vers NextAuth** : Remplacement de `useAuthUser()` par `useAuth()` de NextAuth
- **Gestion des tokens NextAuth** : Vérification de `session?.accessToken` avant les opérations backend
- **Gestion des doublons** : Vérification si un produit existe déjà avant l'ajout
- **Optimisation avec useCallback** : Éviter les re-renders inutiles
- **Meilleure gestion des erreurs** : Conservation de l'état local en cas d'échec backend
- **Protection contre les appels multiples** : Ajout d'un flag `isProcessing` et de try/catch/finally
- **Tri des items** : Tri automatique des items retournés pour une expérience cohérente

```typescript
// Migration vers NextAuth
const { isAuthenticated, session } = useAuth();

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

    // Ajouter localement d'abord pour un feedback immédiat
    addLocalItem(product, quantity);

    // Synchroniser avec le backend si connecté via NextAuth
    if (isAuthenticated && session?.accessToken) {
      try {
        await addToCartMutation.mutateAsync({
          productId: product.id.toString(),
          quantity,
        });
        await refetchCart();
      } catch (error) {
        console.error('Failed to sync cart with backend:', error);
      }
    }
  } catch (error) {
    console.error('Failed to add item:', error);
  } finally {
    isProcessing.current = false;
  }
}, [isAuthenticated, session?.accessToken, localItems, addLocalItem, addToCartMutation, refetchCart, updateQuantity]);

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
```

### 3. Amélioration du store Zustand

**Fichier :** `src/lib/stores/cart-store.ts`

- **Tri automatique** : Tous les items sont automatiquement triés par ID lors de l'ajout, modification ou suppression
- **Cohérence** : L'ordre des items reste constant dans toutes les opérations
- **Performance** : Tri optimisé avec une fonction utilitaire réutilisable

```typescript
// Fonction utilitaire pour trier les items par ID
const sortItemsById = (items: CartItem[]): CartItem[] => {
  return [...items].sort((a, b) => {
    const idA = parseInt(a.id, 10);
    const idB = parseInt(b.id, 10);
    return idA - idB;
  });
};

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
```

### 4. Tri côté backend

**Fichier :** `rexel-modern-backend/app/controllers/carts_controller.ts`

- **Tri automatique** : Tous les items sont retournés triés par `productId` en ordre croissant
- **Cohérence** : L'ordre est garanti côté serveur pour tous les endpoints
- **Performance** : Utilisation de `orderBy('productId', 'asc')` dans les requêtes

```typescript
// Récupérer le panier avec items triés
cart = await Cart.query()
  .where('userId', user.id)
  .preload('items', (itemQuery) => {
    itemQuery
      .preload('product', (productQuery) => {
        productQuery.preload('brand')
      })
      .orderBy('productId', 'asc') // Trier par ID du produit
  })
  .first()

// Recharger le panier avec les items triés
await cart.load('items', (itemQuery) => {
  itemQuery
    .preload('product', (productQuery) => {
      productQuery.preload('brand')
    })
    .orderBy('productId', 'asc') // Trier par ID du produit
})
```

### 5. Correction de la page produit

**Fichier :** `src/app/produit/[slug]/page.tsx`

- **Remplacement de `useAddToCart()` par `useCartSync()`** pour une synchronisation cohérente
- **Amélioration de l'UX** : Messages de confirmation et gestion d'erreurs
- **Correction de l'état du bouton** : Affichage correct quand le produit est déjà dans le panier

```typescript
const { addItem, items } = useCartSync();

const handleAddToCart = async () => {
  if (!isAuthenticated) {
    window.location.href = "/auth/login";
    return;
  }

  if (!productId || !product?.data) {
    return;
  }

  try {
    await addItem(product.data, quantity);
    toast({
      title: "Produit ajouté au panier",
      description: `${product.data.name} a été ajouté au panier`,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    toast({
      title: "Erreur",
      description: "Impossible d'ajouter le produit au panier",
      variant: "destructive",
    });
  }
};
```

### 6. Correction de la page panier

**Fichier :** `src/app/panier/components/CartStep.tsx`

- **Remplacement des hooks directs** : Utilisation de `useCartSync()` au lieu de `useUpdateCartItem()` et `useRemoveFromCart()`
- **Élimination des conflits** : Plus de conflits entre les hooks de synchronisation
- **Protection contre les boucles infinies** : Synchronisation unifiée via `useCartSync`

```typescript
// Avant : Hooks directs qui causaient des conflits
const updateCartItemMutation = useUpdateCartItem();
const removeFromCartMutation = useRemoveFromCart();

// Après : Hook unifié pour la synchronisation
const { updateQuantity, removeItem, isLoading } = useCartSync();

const handleQuantityChange = async (productId: string, newQuantity: number) => {
  if (newQuantity <= 0) return;

  try {
    await updateQuantity(productId, newQuantity);
  } catch (error) {
    console.error("Error updating quantity:", error);
  }
};
```

### 7. Protection contre les clics multiples

**Fichier :** `src/lib/hooks/useDebounce.ts`

- **Hook de debounce** : Nouveau hook pour éviter les clics multiples rapides
- **Protection automatique** : Délai de 300ms entre les appels
- **Gestion des états** : Flag de traitement pour éviter les appels simultanés

```typescript
export function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 300
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef(false);

  const debouncedFunc = useCallback(
    (...args: Parameters<T>) => {
      // Si déjà en cours de traitement, ignorer
      if (isProcessingRef.current) {
        return;
      }

      // Annuler le timeout précédent
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Créer un nouveau timeout
      timeoutRef.current = setTimeout(async () => {
        isProcessingRef.current = true;
        try {
          await func(...args);
        } finally {
          isProcessingRef.current = false;
        }
      }, delay);
    },
    [func, delay]
  ) as T;

  return debouncedFunc;
}
```

**Fichier :** `src/components/category/ProductCard.tsx`

- **Application du debounce** : Utilisation du hook de debounce sur l'ajout au panier
- **Protection contre les clics multiples** : Délai de 300ms entre les appels

```typescript
// Debouncer l'ajout au panier pour éviter les clics multiples
const debouncedAddItem = useDebounce(addItem, 300);

// Gestionnaires d'événements
const handleAddToCart = () => {
  debouncedAddItem(product, selectedQuantity);
};
```

### 8. Composant de debug adapté pour NextAuth

**Fichier :** `src/components/debug/CartDebugPanel.tsx`

- **Migration vers NextAuth** : Utilisation des hooks NextAuth
- **Affichage des informations NextAuth** : Email, type d'utilisateur, statut de session
- **Panel de debug** pour diagnostiquer les problèmes de synchronisation
- **Affichage en temps réel** de l'état du panier local et backend
- **Indicateurs visuels** pour l'authentification et la synchronisation

## Flux de synchronisation amélioré avec NextAuth

### Pour un nouvel utilisateur :

1. **Création de compte** → NextAuth crée la session
2. **Ajout de produits** → Stockage local uniquement (triés par ID)
3. **Détection de l'authentification NextAuth** → `CartProvider` détecte le nouvel état
4. **Synchronisation automatique** → Items locaux transférés vers le backend via le token NextAuth
5. **Synchronisation bidirectionnelle** → Toutes les modifications futures synchronisées
6. **Tri cohérent** → Items toujours ordonnés par ID dans tous les contextes

### Pour un utilisateur existant :

1. **Connexion NextAuth** → Session créée avec token
2. **Chargement du panier backend** → Items chargés depuis le backend via le token NextAuth (triés)
3. **Synchronisation du store local** → Store Zustand mis à jour avec items triés
4. **Fusion si nécessaire** → Panier de session fusionné si présent
5. **Ordre maintenu** → Tri automatique appliqué à toutes les opérations

## Avantages de NextAuth pour la synchronisation

### 🔐 Sécurité renforcée
- **Tokens gérés côté serveur** : Pas de stockage de tokens sensibles dans localStorage
- **Sessions sécurisées** : Cookies HTTP-only pour la persistance
- **Gestion automatique de l'expiration** : NextAuth gère le refresh des tokens

### 🚀 Simplicité de développement
- **Hooks unifiés** : `useAuth()` pour tout l'état d'authentification
- **Client API intégré** : `nextAuthApiClient` gère automatiquement les tokens
- **Intercepteurs automatiques** : Ajout automatique des headers d'authentification

### 📱 UX améliorée
- **Persistance automatique** : Sessions persistantes entre les onglets
- **Synchronisation transparente** : L'utilisateur ne voit pas les détails techniques
- **Gestion d'erreur intégrée** : Redirection automatique en cas de session expirée
- **Ordre cohérent** : Les produits dans le panier sont toujours dans le même ordre

### 🛡️ Protection contre les appels multiples
- **Debounce automatique** : Délai de 300ms entre les appels
- **Flags de traitement** : Protection contre les appels simultanés
- **Monitoring en temps réel** : Surveillance des appels multiples

### 📋 Tri automatique des items
- **Cohérence** : Ordre identique côté client et serveur
- **Performance** : Tri optimisé avec indexation côté base de données
- **Maintenabilité** : Logique de tri centralisée et réutilisable

## Tests et validation

### Composant de debug
Le composant `CartDebugPanel` affiche en temps réel :
- État d'authentification NextAuth
- Présence du token d'accès
- Informations utilisateur (email, type)
- Contenu du panier local (trié)
- Contenu du panier backend (trié)
- État de synchronisation

### Logs de debug
Les logs dans la console permettent de suivre :
- `🔄 Synchronisation des items locaux vers le backend...`
- `✅ Synchronisation terminée`
- `🆕 Initialisation du panier backend pour nouvel utilisateur`
- `🔄 Fusion du panier de session avec le panier utilisateur`
- `🚪 Utilisateur déconnecté - nettoyage du panier`

### Surveillance des appels multiples
Les utilitaires de debug permettent de :
- Compter le nombre total d'appels `addItem`
- Mesurer le temps entre les appels
- Détecter les clics multiples sur les boutons
- Identifier les sources d'appels multiples

### Vérification du tri
Pour vérifier que le tri fonctionne correctement :
- Ajouter plusieurs produits au panier
- Vérifier que l'ordre reste constant après rechargement
- Confirmer que l'ordre est identique côté client et serveur
- Tester avec des IDs de produits très différents

## Résultat attendu

Après ces améliorations, les nouveaux utilisateurs devraient voir :
1. **Ajout immédiat** des produits au panier local
2. **Synchronisation automatique** avec le backend après authentification NextAuth
3. **Persistance** des données entre les sessions NextAuth
4. **Cohérence** entre l'affichage local et les données backend
5. **Sécurité renforcée** grâce à NextAuth
6. **Protection contre les clics multiples** avec debounce et flags de traitement
7. **Ordre cohérent** des produits dans le panier à tout moment

## Monitoring

Pour surveiller le bon fonctionnement :
1. Utiliser le panel de debug en bas à droite (affiche les infos NextAuth)
2. Vérifier les logs dans la console avec les emojis
3. Tester avec différents scénarios (nouvel utilisateur, utilisateur existant, déconnexion/reconnexion)
4. Vérifier que le token NextAuth est bien présent dans les requêtes API
5. Surveiller les appels multiples avec `cartDebug.monitorCalls()`
6. Vérifier que l'ordre des items reste constant dans toutes les opérations

## Migration complète vers NextAuth

Cette correction fait partie de la migration complète vers NextAuth qui apporte :
- ✅ **Authentification unifiée** avec gestion des rôles
- ✅ **Sécurité renforcée** avec tokens côté serveur
- ✅ **Performance optimisée** avec sessions persistantes
- ✅ **Maintenabilité améliorée** avec moins de code personnalisé
- ✅ **Protection contre les appels multiples** avec debounce et monitoring
- ✅ **Tri automatique** des items pour une expérience utilisateur cohérente
