/**
 * Utilitaires de debug pour la synchronisation du panier avec NextAuth
 * À utiliser dans la console du navigateur pour diagnostiquer les problèmes
 */

export const cartDebugUtils = {
  /**
   * Vérifier l'état actuel du panier et de l'authentification
   */
  checkState() {
    const cartStore = window.localStorage.getItem('cart-storage');
    const sessionId = window.localStorage.getItem('cart-session-id');
    
    console.log('📊 État actuel du panier:');
    console.log('- Session ID:', sessionId || '❌ Non défini');
    console.log('- Cart local:', cartStore ? JSON.parse(cartStore) : '❌ Vide');
    
    // Vérifier NextAuth (si disponible)
    if (typeof window !== 'undefined' && (window as any).__NEXT_DATA__) {
      console.log('- NextAuth: ✅ Configuré');
    } else {
      console.log('- NextAuth: ❌ Non configuré');
    }
    
    return {
      sessionId,
      localCart: cartStore ? JSON.parse(cartStore) : null
    };
  },

  /**
   * Simuler l'ajout d'un produit au panier
   */
  simulateAddProduct(productId = 1, quantity = 1) {
    console.log(`🛒 Simulation ajout produit ${productId} (quantité: ${quantity})`);
    
    // Simuler un produit
    const mockProduct = {
      id: productId,
      name: `Produit Test ${productId}`,
      price: '100.00',
      salePrice: null,
      inStock: true,
      stockQuantity: 10,
      files: []
    };
    
    // Vérifier si useCartSync est disponible
    if (typeof window !== 'undefined' && (window as any).useCartSync) {
      (window as any).useCartSync().addItem(mockProduct, quantity);
    } else {
      console.log('❌ useCartSync non disponible - essayez d\'importer le hook');
    }
  },

  /**
   * Nettoyer le panier local
   */
  clearCart() {
    console.log('🧹 Nettoyage du panier local');
    window.localStorage.removeItem('cart-storage');
    console.log('✅ Panier local nettoyé');
  },

  /**
   * Vérifier les logs de synchronisation
   */
  checkSyncLogs() {
    console.log('🔍 Vérification des logs de synchronisation:');
    console.log('Recherchez ces messages dans la console:');
    console.log('- 🔄 Synchronisation des items locaux vers le backend...');
    console.log('- ✅ Synchronisation terminée');
    console.log('- 🆕 Initialisation du panier backend pour nouvel utilisateur');
    console.log('- 🔄 Fusion du panier de session avec le panier utilisateur');
    console.log('- 🚪 Utilisateur déconnecté - nettoyage du panier');
  },

  /**
   * Vérifier l'état NextAuth
   */
  checkNextAuth() {
    console.log('🔐 Vérification NextAuth:');
    
    // Vérifier les cookies NextAuth
    const cookies = document.cookie.split(';');
    const nextAuthCookies = cookies.filter(cookie => 
      cookie.trim().startsWith('next-auth')
    );
    
    console.log('- Cookies NextAuth:', nextAuthCookies.length > 0 ? '✅ Présents' : '❌ Absents');
    
    // Vérifier la session dans localStorage (si disponible)
    const sessionData = window.localStorage.getItem('next-auth.session-token');
    console.log('- Session token:', sessionData ? '✅ Présent' : '❌ Absent');
    
    return {
      hasCookies: nextAuthCookies.length > 0,
      hasSessionToken: !!sessionData
    };
  },

  /**
   * Afficher les informations de debug complètes
   */
  fullDebug() {
    console.log('🔍 DEBUG COMPLET DU PANIER');
    console.log('========================');
    
    this.checkState();
    console.log('---');
    this.checkNextAuth();
    console.log('---');
    this.checkSyncLogs();
    
    console.log('📝 Instructions:');
    console.log('1. Ouvrez le panel de debug en bas à droite');
    console.log('2. Vérifiez que NextAuth est connecté');
    console.log('3. Ajoutez un produit au panier');
    console.log('4. Surveillez les logs de synchronisation');
  }
};

// Exposer globalement pour utilisation dans la console
if (typeof window !== 'undefined') {
  (window as any).cartDebug = cartDebugUtils;
  console.log('✅ Utilitaires de debug du panier chargés');
  console.log('Utilisez: cartDebug.fullDebug() pour un diagnostic complet');
}
