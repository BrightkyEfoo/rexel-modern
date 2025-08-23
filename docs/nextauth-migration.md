# Migration vers NextAuth.js

## ✅ Migration Complète

L'authentification a été migrée de notre système personnalisé vers NextAuth.js pour une meilleure persistance des sessions et une gestion plus robuste.

## Changements Principaux

### 1. Architecture NextAuth
```
NextAuthProvider (SessionProvider de NextAuth)
└── QueryProvider
    └── SessionProvider (notre provider pour cart/session)
        └── CartProvider
```

### 2. Nouveaux Fichiers Créés

- `/src/app/api/auth/[...nextauth]/route.ts` - Route API NextAuth
- `/src/lib/auth/nextauth-config.ts` - Configuration NextAuth
- `/src/lib/auth/nextauth-hooks.ts` - Hooks d'authentification NextAuth
- `/src/lib/api/nextauth-client.ts` - Client API adapté à NextAuth
- `/src/lib/providers/nextauth-provider.tsx` - Provider NextAuth
- `/src/components/auth/NextAuthGuard.tsx` - Guard avec NextAuth
- `/src/types/next-auth.d.ts` - Types étendus pour NextAuth

### 3. Fichiers Modifiés

- **Layout principal** : Utilise maintenant `NextAuthProvider`
- **Toutes les pages** : Remplacé `useAuthUser` par `useAuth`
- **Header** : Utilise les nouveaux hooks NextAuth
- **Pages d'auth** : Login/Register utilisent NextAuth

## Fonctionnalités NextAuth

### ✅ Persistance Automatique
- Sessions persistantes avec cookies sécurisés
- Pas besoin de localStorage pour les tokens
- Gestion automatique de l'expiration des sessions
- Synchronisation entre onglets

### ✅ Sécurité Renforcée
- Tokens JWT gérés côté serveur
- Protection CSRF intégrée
- Gestion sécurisée des cookies
- Validation automatique des sessions

### ✅ Hooks Simplifiés
```tsx
// Nouveau hook principal
const { user, isAuthenticated, isLoading, session } = useAuth();

// Hook pour les mutations
const loginMutation = useLogin();
const logoutMutation = useLogout();
const registerMutation = useRegister();

// Hook pour les pages protégées
const { hasAccess, needsAuth } = useRequireAuth(['admin']);
```

## Utilisation

### Authentification de Base
```tsx
import { useAuth } from '@/lib/auth/nextauth-hooks';

function MyComponent() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <Loading />;

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

### Connexion
```tsx
import { useLogin } from '@/lib/auth/nextauth-hooks';

function LoginForm() {
  const loginMutation = useLogin();

  const handleSubmit = async (data) => {
    try {
      await loginMutation.mutateAsync(data);
      // NextAuth gère automatiquement la redirection
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Pages Protégées
```tsx
import { NextAuthGuard } from '@/components/auth/NextAuthGuard';

function ProtectedPage() {
  return (
    <NextAuthGuard requireAuth requiredRoles={['admin']}>
      <div>Contenu administrateur</div>
    </NextAuthGuard>
  );
}
```

### Accès au Token
```tsx
import { useAccessToken } from '@/lib/auth/nextauth-hooks';

function ApiComponent() {
  const token = useAccessToken();
  
  // Le token est automatiquement ajouté aux requêtes par l'interceptor
  return <div>Token disponible: {!!token}</div>;
}
```

## API Client

### Nouveau Client NextAuth
Le nouveau client API (`nextauth-client.ts`) :
- Récupère automatiquement le token via `getSession()`
- Ajoute le token aux requêtes sécurisées
- Gère les erreurs 401 avec NextAuth
- Maintient la compatibilité avec notre backend

### Routes API
```tsx
import { nextAuthApi } from '@/lib/api/nextauth-client';

// Routes publiques
const products = await nextAuthApi.public.get('/products');

// Routes sécurisées (token automatique)
const orders = await nextAuthApi.secured.get('/orders');
```

## Variables d'Environnement

Ajouter à `.env.local` :
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXT_PUBLIC_API_URL=http://localhost:3333
```

## Migration des Types

Les types de session sont étendus dans `/src/types/next-auth.d.ts` :
```typescript
declare module 'next-auth' {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      email: string;
      name: string;
      firstName: string;
      lastName: string;
      phone: string;
      userType: string;
      isEmailVerified: boolean;
    };
  }
}
```

## Avantages de NextAuth

- **🔒 Sécurité** : Cookies sécurisés, protection CSRF
- **⚡ Performance** : Sessions côté serveur, pas de localStorage
- **🔄 Sync** : Synchronisation automatique entre onglets
- **🛡️ Robustesse** : Gestion d'erreur intégrée
- **📱 SSR** : Support complet du rendu côté serveur
- **🔧 Maintenance** : Moins de code personnalisé à maintenir

## Prochaines Étapes

1. ✅ Configuration NextAuth complétée
2. ✅ Migration des hooks
3. ✅ Migration des composants
4. 🔄 Tests d'intégration
5. 📝 Documentation finale
6. 🚀 Déploiement

La persistance des sessions est maintenant gérée automatiquement par NextAuth.js !
