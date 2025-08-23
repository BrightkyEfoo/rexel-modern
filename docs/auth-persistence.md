# Persistance de l'État d'Authentification

## Fonctionnalités Implémentées

### ✅ Persistance Automatique
- Les tokens et informations utilisateur sont automatiquement sauvegardés dans `localStorage`
- L'état d'authentification persiste entre les rechargements de page
- Validation automatique des tokens au démarrage de l'application

### ✅ Hydratation Sans "Flash"
- Le système empêche les "flash" de contenu non-authentifié au chargement
- L'état est restauré immédiatement depuis le stockage local
- Vérification silencieuse du token auprès du serveur

### ✅ Gestion Intelligente des Tokens
- Vérification automatique de l'expiration des tokens
- Nettoyage automatique en cas de token invalide
- Synchronisation entre l'état local et les données serveur

## Architecture

### Providers
```
QueryProvider
└── AuthProvider (hydratation + persistance)
    └── SessionProvider
        └── CartProvider
```

### Composants Clés

1. **AuthProvider** (`/src/lib/providers/auth-provider.tsx`)
   - Gère l'hydratation de l'état d'authentification
   - Synchronise avec React Query
   - Valide les tokens au démarrage

2. **AuthService** (`/src/lib/auth/auth-service.ts`)
   - Gère le stockage des tokens dans localStorage
   - Fournit les méthodes d'authentification
   - Vérifie l'expiration des tokens

3. **Hooks d'Authentification**
   - `useAuthUser()` : État d'authentification de base
   - `useAuthState()` : État avec informations d'hydratation
   - `useRequireAuthState()` : Pour les composants protégés

## Utilisation

### Dans un Composant Standard
```tsx
import { useAuthState } from '@/lib/hooks/useAuthState';

function MyComponent() {
  const { isAuthenticated, user, canShowAuthContent } = useAuthState();

  // Attendre l'hydratation avant d'afficher du contenu conditionnel
  if (!canShowAuthContent) {
    return <Skeleton />;
  }

  return (
    <div>
      {isAuthenticated ? (
        <p>Bonjour {user?.firstName}</p>
      ) : (
        <p>Veuillez vous connecter</p>
      )}
    </div>
  );
}
```

### Pour les Pages Protégées
```tsx
import { AuthGuard } from '@/components/auth/AuthGuard';

function ProtectedPage() {
  return (
    <AuthGuard requireAuth>
      <div>Contenu protégé</div>
    </AuthGuard>
  );
}
```

### Dans le Header/Navigation
```tsx
import { useAuthUser } from '@/lib/auth/auth-hooks';

function Header() {
  const { isAuthenticated, user } = useAuthUser();
  
  return (
    <header>
      {isAuthenticated ? (
        <UserMenu user={user} />
      ) : (
        <LoginButton />
      )}
    </header>
  );
}
```

## Flux de Données

### Au Démarrage de l'Application
1. L'`AuthProvider` s'initialise
2. Vérification du token et utilisateur dans `localStorage`
3. Si valides : restauration immédiate de l'état
4. Vérification silencieuse auprès du serveur (100ms de délai)
5. Mise à jour de l'état si nécessaire

### Lors de la Connexion
1. L'utilisateur soumet ses identifiants
2. Le serveur retourne un token et les données utilisateur
3. Stockage automatique dans `localStorage`
4. Mise à jour de l'état React Query
5. Redirection automatique vers l'URL demandée

### Lors de la Déconnexion
1. Appel de l'API de déconnexion
2. Nettoyage du `localStorage`
3. Effacement de l'état React Query
4. Redirection vers la page d'accueil

## Avantages

- **🚀 Performance** : Pas de requête serveur nécessaire au démarrage
- **✨ UX Améliorée** : Pas de "flash" de déconnexion
- **🔒 Sécurisé** : Validation automatique des tokens
- **🎯 Fiable** : Gestion d'erreur robuste
- **⚡ Réactif** : Synchronisation temps réel avec React Query

## Considérations Sécuritaires

- Les tokens sont stockés dans `localStorage` (considérer `httpOnly` cookies pour plus de sécurité)
- Validation automatique côté serveur pour éviter les tokens compromis
- Nettoyage automatique en cas d'erreur d'authentification
- Expiration automatique des tokens côté client et serveur
