# Intégration NextAuth pour l'Administration

## 🎯 **Architecture Finale - NextAuth + Rôles**

### 🏗️ **Principe de Fonctionnement**
- ✅ **Une seule authentification** via NextAuth
- ✅ **Vérification de rôle** pour l'accès admin
- ✅ **Redirection intelligente** selon les permissions
- ✅ **Session partagée** entre app publique et admin

## 📁 **Structure des Fichiers**

### **1. Hooks d'Accès Admin**
```typescript
// src/lib/hooks/useAdminAccess.ts
export function useAdminAccess() {
  const { user, isAuthenticated, hasRole } = useAuth();
  
  return {
    isAdmin: isAuthenticated && hasRole('admin'),
    needsLogin: !isAuthenticated,
    needsAdminRole: isAuthenticated && !hasRole('admin'),
    hasAccess: isAdmin,
  };
}

export function useRequireAdminAuth() {
  // Redirection automatique selon le statut
  if (needsLogin) router.push('/auth/login?admin=true');
  if (needsAdminRole) router.push('/?error=access_denied');
}
```

### **2. Page de Login Admin**
```typescript
// src/app/admin/login/page.tsx
export default function AdminLoginPage() {
  const { hasRole } = useAuth();
  const loginMutation = useLogin(); // NextAuth login
  
  // Redirection si déjà admin
  useEffect(() => {
    if (isAuthenticated && hasRole('admin')) {
      router.push('/admin');
    }
  }, [hasRole]);

  // Validation des permissions après login
  if (!hasRole('admin') && isAuthenticated) {
    form.setError('root', {
      message: 'Vous n\'avez pas les permissions administrateur'
    });
  }
}
```

### **3. Header Admin**
```typescript
// src/components/admin/AdminHeader.tsx
export function AdminHeader() {
  const { user } = useAuth();           // Données NextAuth
  const logoutMutation = useLogout();   // Déconnexion NextAuth
  
  return (
    <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
      <LogOut className="mr-2 h-4 w-4" />
      Se déconnecter
    </DropdownMenuItem>
  );
}
```

### **4. Page Admin Protégée**
```typescript
// src/app/admin/page.tsx
export default function AdminDashboardPage() {
  const { isAuthenticated, isLoading, adminUser } = useRequireAdminAuth();
  
  // Protection automatique
  if (adminAuthLoading || !isAdminAuthenticated) {
    return <LoadingSpinner />;
  }
  
  return <AdminContent user={adminUser} />;
}
```

## 🔐 **Gestion de l'Authentification**

### **1. Utilisateurs Admin Backend**
```sql
-- Database avec rôles
INSERT INTO users (first_name, last_name, email, password, type) VALUES
('Admin', 'KesiMarket', 'admin@kesimarket.com', 'hash', 'admin'),
('Admin', 'Rexel', 'admin@rexel.com', 'hash', 'admin');
```

### **2. NextAuth Role Checking**
```typescript
// NextAuth déjà configuré avec hasRole()
const { hasRole } = useAuth();
const isAdmin = hasRole('admin');

// Vérification automatique dans useAdminAccess
const isAdmin = isAuthenticated && hasRole('admin');
```

### **3. Redirection Intelligente**
```typescript
// Flux de redirection
if (!isAuthenticated) {
  // → /auth/login?admin=true
} else if (!hasRole('admin')) {
  // → /?error=access_denied
} else {
  // → /admin (accès autorisé)
}
```

## 🎨 **Expérience Utilisateur**

### **Page de Login Admin**
- ✅ **Interface dédiée** avec branding admin
- ✅ **Validation RHF + Zod** temps réel
- ✅ **Messages d'erreur** contextuels
- ✅ **Feedback visuel** pour permissions insuffisantes

### **Dashboard Admin**
- ✅ **Header admin** avec déconnexion
- ✅ **Indicateur "Mode Admin"** visible
- ✅ **Navigation** vers le site principal
- ✅ **Couleurs cohérentes** avec l'app

## 🔄 **Flux Complet**

### **1. Utilisateur Normal → Admin**
```
1. Utilisateur va sur /admin
2. Redirection vers /auth/login?admin=true
3. Login avec email/password
4. Vérification rôle 'admin'
5. Si admin → Dashboard admin
6. Si pas admin → Erreur permissions
```

### **2. Admin → Déconnexion**
```
1. Clic sur "Se déconnecter"
2. NextAuth logout
3. Cache cleared
4. Redirection vers /
```

### **3. Déjà Connecté**
```
1. Admin va sur /admin/login
2. useEffect détecte hasRole('admin')
3. Redirection automatique vers /admin
```

## 🚀 **Avantages de cette Architecture**

### **1. Simplicité**
- ✅ **Une seule auth** pour tout
- ✅ **Pas de double token** à gérer
- ✅ **Session unifiée** NextAuth

### **2. Sécurité**
- ✅ **Vérification côté serveur** du rôle
- ✅ **Protection automatique** des pages
- ✅ **Invalidation propre** à la déconnexion

### **3. Performance**
- ✅ **Cache NextAuth** optimisé
- ✅ **Pas de requêtes redondantes**
- ✅ **React Query** pour les mutations

### **4. Maintenabilité**
- ✅ **Code réutilisable** (hooks)
- ✅ **Logique centralisée** dans useAuth
- ✅ **TypeScript strict** partout

## 📋 **Credentials de Test**

### **Admin Rexel**
```
Email: admin@rexel.com
Password: admin123
Role: admin
```

### **Admin KesiMarket**
```
Email: admin@kesimarket.com
Password: admin123
Role: admin
```

## 🎯 **URLs de l'Application**

### **Public**
- `/` - Accueil
- `/auth/login` - Login utilisateurs
- `/auth/register` - Inscription

### **Admin**
- `/admin/login` - Login admin (redirects to NextAuth)
- `/admin` - Dashboard admin (protégé)

## ✅ **Système Prêt !**

Le système d'authentification admin est maintenant **entièrement intégré avec NextAuth** :

1. 🔐 **Authentification unifiée** avec rôles
2. 🛡️ **Protection automatique** des pages admin
3. 🎨 **Interface cohérente** et moderne
4. 🚀 **Performance optimale** avec React Query
5. 🧩 **Maintenabilité élevée** avec hooks modulaires

L'admin peut maintenant se connecter avec `admin@rexel.com` / `admin123` et accéder au dashboard sécurisé ! 🎉✨
