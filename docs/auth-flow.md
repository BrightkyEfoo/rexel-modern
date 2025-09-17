# Flux d'authentification

## 📋 Nouveau flux d'inscription/connexion

### 🔄 Flux principal

1. **Utilisateur sur une page protégée** (ex: `/produit/123`)
2. **Redirection vers inscription** → `/auth/register?redirect=%2Fproduits%2F123`
3. **Inscription réussie** → Redirection vers `/auth/login?redirect=%2Fproduits%2F123&email=user%40example.com`
4. **Connexion réussie** → Redirection vers `/produit/123`

### 🎯 Avantages

- ✅ **UX simplifiée** : L'utilisateur se connecte après inscription
- ✅ **Email pré-rempli** : Facilite la connexion après inscription  
- ✅ **URL préservée** : Retour automatique vers la page d'origine
- ✅ **Flux cohérent** : Navigation fluide entre inscription/connexion

### 📝 Cas d'usage

#### Cas 1 : Inscription depuis une page produit
```
/produit/abc123 
  → /auth/register?redirect=%2Fproduits%2Fabc123
  → /auth/login?redirect=%2Fproduits%2Fabc123&email=user%40example.com
  → /produit/abc123 (après connexion)
```

#### Cas 2 : Navigation directe vers inscription
```
/auth/register 
  → /auth/login?email=user%40example.com
  → / (page d'accueil par défaut)
```

#### Cas 3 : Basculement inscription ↔ connexion
```
/auth/register?redirect=%2Fcategories%2Felectrique
  → Lien "Se connecter" → /auth/login?redirect=%2Fcategories%2Felectrique

/auth/login?redirect=%2Fcategories%2Felectrique  
  → Lien "Créer un compte" → /auth/register?redirect=%2Fcategories%2Felectrique
```

### 🔧 Composants modifiés

1. **`/src/app/auth/register/page.tsx`**
   - Redirection vers `/auth/login` au lieu de `/auth/verify-otp`
   - Préservation du paramètre `redirect`
   - Email pré-rempli dans l'URL de connexion

2. **`/src/app/auth/login/page.tsx`**
   - Support du paramètre `email` pour pré-remplir le formulaire
   - Préservation du paramètre `redirect` dans les liens

3. **`/src/lib/utils/auth-redirect.ts`**
   - Utilitaires pour gérer les redirections d'auth
   - Fonctions pour préserver les paramètres URL

4. **`/src/lib/hooks/useAuthRedirect.ts`**
   - Logique de redirection après authentification (inchangée)
   - Gestion du localStorage pour URL de destination

### 🧪 Tests manuels

Pour tester le flux :

1. **Aller sur une page** (ex: `http://localhost:3000/categorie/electrique`)
2. **Cliquer "Se connecter"** ou aller vers une zone protégée
3. **Cliquer "Créer un compte"** sur la page de connexion
4. **Remplir le formulaire d'inscription** et valider
5. **Vérifier** : Redirection vers login avec email pré-rempli
6. **Se connecter** avec le mot de passe
7. **Vérifier** : Retour sur la page `/categorie/electrique`

### 🔍 Points de vérification

- [ ] L'URL de destination est préservée à travers tout le flux
- [ ] L'email est pré-rempli sur la page de connexion après inscription
- [ ] Les liens entre inscription/connexion préservent les paramètres
- [ ] La redirection finale mène bien vers l'URL d'origine
- [ ] Le flux fonctionne même sans URL de redirection (fallback vers `/`)

### 🚨 Cas particuliers

#### Compte nécessitant vérification
Si le backend retourne `VERIFICATION_REQUIRED`, l'utilisateur est quand même redirigé vers la connexion, où il pourra se connecter et être redirigé vers la vérification OTP si nécessaire.

#### URL invalides
Les URLs de redirection sont encodées/décodées proprement pour éviter les problèmes de caractères spéciaux.
