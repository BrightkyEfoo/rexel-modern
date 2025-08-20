# Système de Redirection Après Authentification

## 🎯 **Objectif**

Rediriger automatiquement l'utilisateur vers la page qu'il visitait avant d'entrer dans le flow d'authentification (login/register/OTP).

## 🔧 **Composants**

### 1. **Hook `useAuthRedirect`**
```typescript
import { useAuthRedirect } from '@/lib/hooks/useAuthRedirect';

const { 
  saveCurrentUrl,      // Sauvegarder l'URL actuelle
  redirectAfterAuth,   // Rediriger après authentification
  getSavedRedirectUrl, // Récupérer l'URL sauvegardée
  clearSavedUrl       // Nettoyer l'URL sauvegardée
} = useAuthRedirect();
```

### 2. **Composant `AuthLink`**
Remplace les liens `<Link>` vers les pages d'auth pour sauvegarder automatiquement l'URL :

```tsx
// ❌ Avant
<Link href="/auth/login">Connexion</Link>

// ✅ Après
<AuthLink href="/auth/login">Connexion</AuthLink>
```

### 3. **Composant `AuthGuard`**
Protège les routes et sauvegarde l'URL avant redirection :

```tsx
<AuthGuard requireAuth redirectTo="/auth/login">
  <ProtectedContent />
</AuthGuard>
```

## 🌊 **Flow d'Utilisation**

```mermaid
graph TD
    A[Utilisateur sur /categorie/cables] --> B[Clique sur 'Connexion']
    B --> C[AuthLink sauvegarde '/categorie/cables']
    C --> D[Redirection vers /auth/login]
    D --> E[Utilisateur se connecte]
    E --> F[redirectAfterAuth() appelé]
    F --> G[Retour sur /categorie/cables]
```

## 📱 **Cas d'Usage**

### **1. Navigation normale**
```typescript
// L'utilisateur clique sur un AuthLink
<AuthLink href="/auth/login">Se connecter</AuthLink>
// → URL actuelle sauvegardée automatiquement
```

### **2. Protection de route**
```typescript
// Page protégée
<AuthGuard requireAuth>
  <MonCompte />
</AuthGuard>
// → URL de la page protégée sauvegardée avant redirection
```

### **3. Après authentification**
```typescript
// Dans les pages login/register/OTP
const { redirectAfterAuth } = useAuthRedirect();

const onSuccess = () => {
  redirectAfterAuth(); // → Retour vers l'URL sauvegardée
};
```

## 🔄 **Priorités de Redirection**

1. **Paramètre URL** : `?redirect=/ma-page`
2. **URL sauvegardée** : localStorage
3. **Fallback** : `/` (page d'accueil)

## 🎯 **Intégration**

### **Pages d'authentification**
Toutes les pages utilisent `redirectAfterAuth()` au lieu de `router.push('/')` :
- ✅ `/auth/login/page.tsx`
- ✅ `/auth/register/page.tsx` 
- ✅ `/auth/verify-otp/page.tsx`

### **Header/Navigation**
Tous les liens d'auth utilisent `AuthLink` :
- ✅ Header desktop
- ✅ Header mobile

### **Pages protégées**
Utilisent `AuthGuard` pour la protection :
```tsx
export default function MaPageProtegee() {
  return (
    <AuthGuard requireAuth>
      <MonContenu />
    </AuthGuard>
  );
}
```

## 🧪 **Test du System**

1. **Aller sur** `/categorie/cables`
2. **Cliquer** sur "Connexion"
3. **Se connecter**
4. **Vérifier** le retour sur `/categorie/cables`

## 📝 **Logs de Debug**

Le système inclut des logs pour le débogage :
```
🔗 URL sauvegardée pour redirection: /categorie/cables
🔗 URL de redirection récupérée: /categorie/cables  
🔗 Redirection après auth vers: /categorie/cables
```
