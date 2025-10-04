# Système de Rôle Manager avec Validation de Produits

## 📋 Vue d'ensemble

Système complet de gestion des rôles avec workflow de validation de produits permettant aux **Managers** de créer des produits qui doivent être approuvés par les **Admins** avant d'être visibles aux clients.

## 🎯 Objectifs

- ✅ Nouveau rôle **MANAGER** avec permissions limitées
- ✅ Workflow de validation pour les produits créés par managers
- ✅ Traçabilité complète de toutes les actions (création, modification, validation)
- ✅ Filtrage automatique des produits non-approuvés côté client
- ✅ Historique détaillé avec timeline d'activités

## 🏗️ Architecture

### Backend (AdonisJS 6)

#### Enums et Types
```typescript
// app/types/user.ts
export enum UserType {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CUSTOMER = 'customer',
}

// app/types/product.ts
export enum ProductStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum ProductActivityType {
  CREATE = 'create',
  UPDATE = 'update',
  SUBMIT = 'submit',
  APPROVE = 'approve',
  REJECT = 'reject',
}
```

#### Modèles

**Product** - Champs de validation ajoutés :
- `status`: ProductStatus (statut de validation)
- `createdById`: number (ID du créateur)
- `approvedById`: number (ID de l'admin qui a approuvé)
- `submittedAt`: DateTime (date de soumission)
- `approvedAt`: DateTime (date d'approbation)
- `rejectionReason`: string (raison du rejet si rejeté)

**ProductActivity** - Traçabilité :
- `productId`: number
- `activityType`: ProductActivityType
- `userId`: number
- `oldStatus`: ProductStatus
- `newStatus`: ProductStatus
- `description`: string
- `metadata`: Record<string, any>

#### Services (Clean Architecture)

**ProductValidationService**
- `getInitialStatus(user)`: Détermine le statut initial selon le rôle
- `submitForApproval(product, user)`: Soumet un produit pour validation
- `approve(product, admin, comment?)`: Approuve un produit
- `reject(product, admin, reason)`: Rejette un produit avec raison
- `handleProductUpdate(product, user)`: Gère le statut après modification
- `getPendingProducts()`: Récupère les produits en attente
- `canUserEditProduct(product, user)`: Vérifie les permissions d'édition
- `canUserDeleteProduct(product, user)`: Vérifie les permissions de suppression

**ProductActivityService**
- `logActivity(params)`: Enregistre une activité générique
- `logCreate(product, user)`: Enregistre une création
- `logUpdate(product, user, changes)`: Enregistre une modification
- `logSubmit(product, user)`: Enregistre une soumission
- `logApprove(product, admin, comment?)`: Enregistre une approbation
- `logReject(product, admin, reason)`: Enregistre un rejet
- `getProductActivities(productId)`: Récupère l'historique d'un produit
- `getUserActivities(userId)`: Récupère les activités d'un utilisateur
- `getRecentActivities(limit)`: Récupère les dernières activités

**CheckRoleMiddleware**
- Middleware réutilisable pour vérifier les rôles
- Méthodes statiques : `requireAdmin`, `requireAdminOrManager`, `requireManager`

#### Endpoints API

**Routes sécurisées (/secured):**
```typescript
POST   /products                    // Créer (admin=approved, manager=pending)
PUT    /products/:id                // Modifier (manager=repending si approved)
DELETE /products/:id                // Supprimer (avec vérification)
GET    /products/pending            // Liste produits en attente (admin only)
POST   /products/:id/approve        // Approuver un produit (admin only)
POST   /products/:id/reject         // Rejeter un produit (admin only)
GET    /products/:id/activities     // Historique d'un produit
```

**Routes publiques (/opened):**
- Tous les endpoints filtrent automatiquement les produits avec `status != 'approved'`
- Les clients ne voient que les produits validés

#### Migrations

1. `add_validation_fields_to_products`: Ajout des champs de validation
2. `create_product_activities`: Table de traçabilité
3. `update_users_type_constraint`: Ajout du type 'manager' à la contrainte

#### Seeders

**manager_seeder.ts** - 3 comptes managers de test :
- manager1@kesimarket.com (Manager Product)
- manager2@kesimarket.com (Sophie Martin)
- manager3@kesimarket.com (Thomas Dubois)
- Mot de passe : `manager123`

### Frontend (Next.js 15)

#### Types

```typescript
// src/lib/types/product.ts
export enum ProductStatus { ... }
export enum ProductActivityType { ... }
export interface ProductActivity { ... }
```

#### Services API

**products-validation.ts**
- `getPendingProducts(params?)`: Récupère les produits en attente
- `approveProduct(productId, data?)`: Approuve un produit
- `rejectProduct(productId, data)`: Rejette un produit
- `getProductActivities(productId)`: Récupère l'historique

#### Composants Admin

**PendingProductsManagement**
- Liste tous les produits en attente de validation
- Affiche les informations du produit et du manager
- Permet d'approuver ou rejeter directement
- Vue détaillée avec tabs (détails + historique)
- Rafraîchissement automatique toutes les 30 secondes

**ProductApprovalDialog**
- Dialog modal pour approuver ou rejeter
- Mode 'approve' : commentaire optionnel
- Mode 'reject' : raison obligatoire
- Affiche les informations du produit
- Gestion des états de chargement

**ProductActivityTimeline**
- Timeline visuelle des activités
- Icônes et couleurs par type d'activité
- Affichage des métadonnées en détails
- Format de date localisé (français)
- Scrollable pour historiques longs

**Tab Validations dans Dashboard Admin**
- Nouvel onglet après "Vue d'ensemble"
- Icône ClipboardCheck
- Badge avec nombre de produits en attente
- Accès uniquement pour les admins

## 🔄 Workflows

### 1. Création de Produit

#### Par un Admin :
```
Admin crée produit
  → status = 'approved'
  → approvedById = admin.id
  → approvedAt = now
  → Activité CREATE enregistrée
  → Produit visible immédiatement aux clients
```

#### Par un Manager :
```
Manager crée produit
  → status = 'pending'
  → createdById = manager.id
  → submittedAt = now
  → Activité CREATE enregistrée
  → Produit en attente de validation
  → Apparaît dans le tab "Validations" de l'admin
```

### 2. Modification de Produit

#### Par un Admin :
```
Admin modifie produit (approved)
  → status reste 'approved'
  → Activité UPDATE enregistrée avec changements
  → Produit reste visible aux clients
```

#### Par un Manager :
```
Manager modifie produit (approved)
  → status = 'pending'
  → submittedAt = now
  → approvedById = null
  → Activité UPDATE enregistrée
  → Produit repasse en validation
  → Admin doit revalider
```

### 3. Validation par Admin

#### Approbation :
```
Admin approuve
  → status = 'approved'
  → approvedById = admin.id
  → approvedAt = now
  → rejectionReason = null
  → Activité APPROVE enregistrée
  → Produit visible aux clients
  → Manager notifié (toast)
```

#### Rejet :
```
Admin rejette avec raison
  → status = 'rejected'
  → rejectionReason = raison fournie
  → Activité REJECT enregistrée
  → Produit non visible aux clients
  → Manager peut voir la raison et corriger
```

## 🔐 Permissions

| Action | Admin | Manager | Customer |
|--------|-------|---------|----------|
| Créer produit | ✅ (approved) | ✅ (pending) | ❌ |
| Modifier produit approved | ✅ (reste approved) | ✅ (repending) | ❌ |
| Modifier produit pending | ✅ | ✅ (son propre) | ❌ |
| Modifier produit rejected | ✅ | ✅ (son propre) | ❌ |
| Supprimer produit approved | ✅ | ❌ | ❌ |
| Supprimer produit pending | ✅ | ✅ (son propre) | ❌ |
| Approuver produit | ✅ | ❌ | ❌ |
| Rejeter produit | ✅ | ❌ | ❌ |
| Voir produits pending | ✅ | ❌ | ❌ |
| Voir historique | ✅ | ✅ (ses produits) | ❌ |
| Voir produits approved | ✅ | ✅ | ✅ |

## 📊 Traçabilité

Toutes les actions sont enregistrées dans `product_activities` :
- Qui a fait l'action (user_id)
- Quel type d'action (activity_type)
- Ancien et nouveau statut (old_status, new_status)
- Description de l'action
- Métadonnées (changements, raisons, commentaires)
- Date et heure précise (created_at)

### Exemples d'activités :
- "Produit 'Câble USB' créé par Sophie Martin"
- "Produit 'Câble USB' modifié par Sophie Martin"
- "Produit 'Câble USB' soumis pour validation par Sophie Martin"
- "Produit 'Câble USB' approuvé par Admin KesiMarket"
- "Produit 'Câble USB' rejeté par Admin KesiMarket : Prix trop élevé"

## 🎨 Interface Utilisateur

### Dashboard Admin - Tab Validations
- Badge avec compteur de produits en attente
- Liste scrollable avec cartes produits
- Aperçu : image, nom, SKU, créateur, prix
- Actions rapides : Détails, Approuver, Rejeter
- Dialog de détails avec tabs (info + historique)

### Couleurs et Icônes
- **Pending** : Jaune (Clock icon)
- **Approved** : Vert (CheckCircle icon)
- **Rejected** : Rouge (XCircle icon)
- **Create** : Bleu (Plus icon)
- **Update** : Orange (Edit icon)
- **Submit** : Violet (Send icon)

## 🧪 Tests Recommandés

1. **Admin crée produit** → Vérifie status='approved' immédiat
2. **Manager crée produit** → Vérifie status='pending' et apparition dans validations
3. **Manager modifie produit approved** → Vérifie passage à 'pending'
4. **Admin modifie produit approved** → Vérifie status reste 'approved'
5. **Admin approuve produit** → Vérifie passage à 'approved' et activité
6. **Admin rejette produit** → Vérifie passage à 'rejected' avec raison
7. **Client consulte catalogue** → Vérifie seuls produits approved affichés
8. **Historique** → Vérifie toutes activités enregistrées

## 📝 Comptes de Test

### Admins
- admin@kesimarket.com / admin123

### Managers
- manager1@kesimarket.com / manager123
- manager2@kesimarket.com / manager123
- manager3@kesimarket.com / manager123

### Customers
- Existants dans user_seeder

## 🚀 Principes Respectés

✅ **SOLID**
- Single Responsibility : Services dédiés (Validation, Activity)
- Open/Closed : Services extensibles sans modification
- Liskov Substitution : Hiérarchie cohérente
- Interface Segregation : Interfaces spécifiques
- Dependency Inversion : Services injectés

✅ **Clean Architecture**
- Séparation claire : Controllers → Services → Repositories → Models
- Pas de dépendances circulaires
- Logique métier isolée dans services

✅ **DRY (Don't Repeat Yourself)**
- Middleware réutilisable (CheckRoleMiddleware)
- Services de validation centralisés
- Services d'activités unifiés

✅ **Composants Réutilisables**
- ProductApprovalDialog (approve/reject)
- ProductActivityTimeline (historique)
- PendingProductsManagement (gestion validations)

## 📈 Évolutions Futures

- [ ] Notifications email aux managers lors de validation/rejet
- [ ] Notification en temps réel (WebSockets)
- [ ] Commentaires lors des modifications
- [ ] Workflow multi-niveaux (manager → senior manager → admin)
- [ ] Dashboard analytics pour managers (taux d'approbation, etc.)
- [ ] Export des rapports d'activités
- [ ] Filtres avancés dans la liste des produits pending

