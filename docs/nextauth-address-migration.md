# Migration du système d'adresses vers NextAuth

## Vue d'ensemble

Le système d'adresses a été migré pour utiliser NextAuth au lieu de la gestion manuelle des tokens. Cette approche est plus sécurisée, plus maintenable et suit les meilleures pratiques.

## Changements effectués

### 1. API Client migré
**Avant** (`api` from './client'):
```typescript
const response = await api.secured.get('/addresses', { params });
```

**Après** (`nextAuthApi` from './nextauth-client'):
```typescript
const response = await nextAuthApi.secured.get('/addresses', { params });
```

### 2. Gestion automatique des tokens
- **Avant** : Stockage manuel dans localStorage (`kesimarket_access_token`)
- **Après** : NextAuth gère automatiquement la session et les tokens

### 3. Intercepteurs simplifiés
NextAuth s'occupe de :
- ✅ Récupération automatique du token depuis la session
- ✅ Ajout automatique de `Authorization: Bearer <token>`
- ✅ Gestion des erreurs 401 (session expirée)
- ✅ Refresh des tokens si nécessaire

## Avantages de NextAuth

### 🔐 Sécurité renforcée
- Tokens stockés côté serveur (JWT sécurisé)
- Pas de stockage de tokens sensibles dans localStorage
- Gestion automatique de l'expiration des sessions
- Protection contre les attaques XSS

### 🚀 Simplicité de développement
- Plus besoin de gérer manuellement les tokens
- Gestion automatique des intercepteurs
- Intégration native avec React/Next.js
- Session partagée entre toutes les requêtes

### 📱 UX améliorée
- Redirection automatique vers login si session expirée
- Persistance de session entre les onglets
- Gestion transparente du refresh des tokens

## Configuration NextAuth

### Session et JWT
```typescript
session: {
  strategy: 'jwt',
  maxAge: 24 * 60 * 60, // 24 heures
},

jwt: {
  maxAge: 24 * 60 * 60, // 24 heures
},
```

### Callbacks importants
```typescript
async jwt({ token, user, account }) {
  if (account && user) {
    token.accessToken = (user as any).accessToken;
    // ... autres propriétés utilisateur
  }
  return token;
},

async session({ session, token }) {
  if (token) {
    session.accessToken = token.accessToken as string;
    // ... autres propriétés
  }
  return session;
}
```

## Utilisation dans les composants

### Récupération de la session
```typescript
import { useSession } from 'next-auth/react';

export function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <Loading />;
  if (status === 'unauthenticated') return <Login />;
  
  // Session disponible avec session.accessToken
  return <AuthenticatedContent />;
}
```

### Appels API sécurisés
```typescript
// L'API client NextAuth gère automatiquement l'authentification
const addresses = await nextAuthApi.secured.get('/addresses');
```

## Migration des autres API clients

Il est recommandé de migrer progressivement tous les appels API vers NextAuth :

1. **Cart API** - Déjà compatible
2. **Products API** - Migration recommandée
3. **User API** - Migration prioritaire
4. **Orders API** - Migration future

## Test de la migration

### Vérifications nécessaires
1. ✅ Connexion/déconnexion fonctionne
2. ✅ Requêtes sécurisées passent le token
3. ✅ Gestion des erreurs 401
4. ✅ Persistance de session
5. ✅ Performance (pas de sur-authentification)

### Debugging
```typescript
// Vérifier la session
const session = await getSession();
console.log('Session:', session);

// Vérifier le token
console.log('Access Token:', session?.accessToken);
```

## Nettoyage

### Fichiers désormais inutiles (à supprimer progressivement)
- Ancienne gestion manuelle des tokens
- localStorage token management
- Intercepteurs manuels d'authentification

### Migration complète
Une fois tous les API clients migrés vers NextAuth, l'ancien `client.ts` peut être supprimé.

## Avantages pour l'équipe

1. **Moins de code** : Plus de gestion manuelle des tokens
2. **Plus sûr** : Sécurité gérée par NextAuth
3. **Standard** : Suit les meilleures pratiques industry
4. **Maintenable** : Code plus simple et robuste
5. **Extensible** : Facilite l'ajout d'autres providers OAuth

Le système d'adresses est maintenant entièrement sécurisé avec NextAuth ! 🔐✨
