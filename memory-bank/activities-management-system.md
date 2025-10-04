# Système de gestion des activités

## Vue d'ensemble

Ce document décrit l'implémentation du système de gestion des activités pour les managers et administrateurs, permettant un suivi complet de toutes les modifications apportées aux produits.

## Changements majeurs

### 1. Permissions des managers élargies

**Avant :**
- Les managers ne pouvaient modifier que leurs propres produits
- Les managers ne pouvaient pas modifier les produits approuvés

**Maintenant :**
- ✅ Les managers peuvent modifier **tous les produits** (peu importe qui les a créés)
- ✅ Les managers peuvent modifier les produits approuvés (ils repassent en `pending`)
- ✅ Les managers peuvent supprimer les produits non approuvés (peu importe qui les a créés)
- ✅ Toutes les modifications sont enregistrées comme activités avec traçabilité complète

### 2. Nouvel onglet "Activités" dans le dashboard

**Pour les administrateurs :**
- Voient **toutes** les activités de tous les managers
- Peuvent filtrer par type d'activité (création, modification, soumission, approbation, rejet)
- Vue complète de l'historique avec détails des produits et utilisateurs

**Pour les managers :**
- Voient **seulement leurs propres** activités
- Peuvent filtrer par type d'activité
- Suivi de leurs propres actions

## Architecture technique

### Backend

#### Services modifiés

**`product_validation_service.ts`**

```typescript
canUserEditProduct(product: Product, user: User): boolean {
  // Admin peut tout modifier
  if (user.type === 'admin') {
    return true
  }

  // Manager peut modifier tous les produits (peu importe qui les a créés)
  if (user.type === 'manager') {
    return true
  }

  return false
}

canUserDeleteProduct(product: Product, user: User): boolean {
  // Admin peut tout supprimer
  if (user.type === 'admin') {
    return true
  }

  // Manager peut supprimer tous les produits non approuvés
  if (user.type === 'manager') {
    return product.status !== ProductStatus.APPROVED
  }

  return false
}
```

**`product_activity_service.ts`**

Nouvelle méthode ajoutée :

```typescript
async getAllActivities(filters: {
  page?: number
  perPage?: number
  userId?: number
  activityType?: ProductActivityType
  productId?: number
}) {
  const page = filters.page || 1
  const perPage = filters.perPage || 20

  const query = ProductActivity.query()
    .preload('product', (productQuery) => {
      productQuery.preload('categories')
      productQuery.preload('brand')
    })
    .preload('user')

  // Filtrer par utilisateur si spécifié (pour les managers)
  if (filters.userId) {
    query.where('user_id', filters.userId)
  }

  // Filtrer par type d'activité
  if (filters.activityType) {
    query.where('activity_type', filters.activityType)
  }

  // Filtrer par produit
  if (filters.productId) {
    query.where('product_id', filters.productId)
  }

  return query.orderBy('created_at', 'desc').paginate(page, perPage)
}
```

#### Controller

**`products_controller.ts`**

Nouvelle méthode ajoutée :

```typescript
async allActivities({ request, response, auth }: HttpContext) {
  try {
    const user = await auth.authenticate()

    // Vérifier que l'utilisateur est admin ou manager
    if (user.type !== 'admin' && user.type !== 'manager') {
      return response.forbidden({
        message: 'Accès non autorisé',
      })
    }

    const page = request.input('page', 1)
    const perPage = request.input('per_page', 20)
    const activityType = request.input('activity_type')
    const productId = request.input('product_id')

    // Si manager, filtrer uniquement ses activités
    const userId = user.type === 'manager' ? user.id : request.input('user_id')

    const paginatedActivities = await this.activityService.getAllActivities({
      page,
      perPage,
      userId,
      activityType,
      productId,
    })

    return response.ok({
      data: paginatedActivities.all(),
      meta: {
        total: paginatedActivities.total,
        per_page: paginatedActivities.perPage,
        current_page: paginatedActivities.currentPage,
        last_page: paginatedActivities.lastPage,
      },
      message: 'Activities retrieved successfully',
      status: 200,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching activities:', error)
    return response.internalServerError({
      message: 'Error fetching activities',
      error: error.message,
      status: 500,
      timestamp: new Date().toISOString(),
    })
  }
}
```

#### Routes

**`routes/products.ts`**

```typescript
// Route pour toutes les activités (admin + manager)
router.get('/activities', '#controllers/products_controller.allActivities')
```

Accessible via : `GET /api/v1/secured/activities`

### Frontend

#### Service API

**`src/lib/api/activities.ts` (nouveau fichier)**

```typescript
export interface ActivitiesResponse {
  data: Array<ProductActivity & {
    product: {
      id: number
      name: string
      slug: string
      sku: string | null
      price: number
      imageUrl?: string
      categories?: Array<{ id: number; name: string }>
      brand?: { id: number; name: string }
    }
  }>
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
  message: string
  status: number
  timestamp: string
}

export const activitiesService = {
  getAll: async (filters?: ActivitiesFilters): Promise<ActivitiesResponse> => {
    const response = await apiClient.get<ActivitiesResponse>('/secured/activities', {
      params: filters,
    })
    return response.data
  },
}
```

#### Composant

**`src/components/admin/activities/ActivitiesManagement.tsx` (nouveau fichier)**

Fonctionnalités :
- Affichage paginé des activités
- Filtrage par type d'activité (création, modification, soumission, approbation, rejet)
- Affichage des détails : produit, utilisateur, changements de statut
- Images des produits
- Horodatage formaté
- Auto-refresh toutes les 30 secondes

#### Intégration dashboard

**`src/app/admin/page.tsx`**

Nouvel onglet ajouté :
```typescript
{ id: 'activities', label: 'Activités', icon: Activity, roles: ['admin', 'manager'] }
```

Position : Deuxième onglet après "Vue d'ensemble"

## Workflow complet

### Scénario 1 : Manager modifie un produit créé par un autre manager

```
1. Manager A crée un produit
   ↓
2. Admin approuve le produit
   ↓
3. Manager B modifie le produit (ex: change le prix)
   ↓
4. Produit repasse en statut "pending"
   ↓
5. Activité enregistrée :
   - Type: UPDATE
   - User: Manager B
   - Changements détaillés dans metadata
   - Old status: approved → New status: pending
   ↓
6. Admin voit le produit dans "Validations"
   ↓
7. Admin voit l'activité dans "Activités"
   - Qui a modifié (Manager B)
   - Quels champs ont changé
   - Quand
   ↓
8. Admin approuve ou rejette
```

### Scénario 2 : Manager crée un produit

```
1. Manager crée un produit
   ↓
2. Produit en statut "pending"
   ↓
3. Activité enregistrée :
   - Type: CREATE
   - User: Manager
   - Status: pending
   ↓
4. Visible dans "Activités" (pour admin et le manager)
   ↓
5. Visible dans "Validations" pour admin
```

### Scénario 3 : Admin approuve un produit

```
1. Admin approuve un produit
   ↓
2. Produit passe en statut "approved"
   ↓
3. Activité enregistrée :
   - Type: APPROVE
   - User: Admin
   - Old status: pending → New status: approved
   - Comment (optionnel)
   ↓
4. Visible dans "Activités"
   ↓
5. Le manager qui a créé/modifié le produit peut voir cette activité
```

## Types d'activités enregistrées

1. **CREATE** : Création d'un nouveau produit
   - Enregistre le créateur, le statut initial
   
2. **UPDATE** : Modification d'un produit
   - Enregistre tous les changements de champs
   - Compare valeurs avant/après
   - Changements de statut (approved → pending pour managers)

3. **SUBMIT** : Soumission pour validation
   - Quand un manager soumet un produit draft

4. **APPROVE** : Approbation par admin
   - Avec commentaire optionnel
   - Statut pending → approved

5. **REJECT** : Rejet par admin
   - Avec raison obligatoire
   - Statut pending → rejected

## Permissions détaillées

### Manager

| Action | Permission | Règle |
|--------|-----------|-------|
| Créer un produit | ✅ Oui | Statut: `pending` |
| Modifier n'importe quel produit | ✅ Oui | Si approuvé → repasse en `pending` |
| Supprimer produit non approuvé | ✅ Oui | Peu importe le créateur |
| Supprimer produit approuvé | ❌ Non | Seul admin peut |
| Voir toutes les activités | ❌ Non | Seulement les siennes |
| Voir onglet "Validations" | ❌ Non | Admin only |
| Approuver/Rejeter | ❌ Non | Admin only |

### Admin

| Action | Permission | Règle |
|--------|-----------|-------|
| Créer un produit | ✅ Oui | Statut: `approved` direct |
| Modifier n'importe quel produit | ✅ Oui | Reste `approved` |
| Supprimer n'importe quel produit | ✅ Oui | Sans restriction |
| Voir toutes les activités | ✅ Oui | De tous les managers |
| Filtrer par manager | ✅ Oui | Via paramètre `user_id` |
| Approuver/Rejeter | ✅ Oui | Exclusif admin |

## Interface utilisateur

### Onglet "Activités"

**Pour Admin :**
```
┌─────────────────────────────────────────────────────────┐
│ 🔄 Toutes les activités                  📊 1,234       │
│ Filtrer par type: [Tous les types ▼]                   │
├─────────────────────────────────────────────────────────┤
│ [CREATE] 15:32                                          │
│ 📦 Produit ABC                                          │
│ "Produit créé par Sophie Martin (manager)"             │
│ 👤 Sophie Martin (manager)                             │
│ draft → pending                                         │
├─────────────────────────────────────────────────────────┤
│ [UPDATE] 14:20                                          │
│ 📦 Produit XYZ                                          │
│ "Produit modifié par Thomas Dubois (manager)"          │
│ 👤 Thomas Dubois (manager)                             │
│ approved → pending                                      │
├─────────────────────────────────────────────────────────┤
│ [APPROVE] 13:45                                         │
│ 📦 Produit DEF                                          │
│ "Produit approuvé par Admin"                           │
│ 👤 Admin User (admin)                                  │
│ pending → approved                                      │
└─────────────────────────────────────────────────────────┘
```

**Pour Manager :**
```
┌─────────────────────────────────────────────────────────┐
│ 🔄 Mes activités                         📊 42          │
│ Filtrer par type: [Tous les types ▼]                   │
├─────────────────────────────────────────────────────────┤
│ [CREATE] 15:32                                          │
│ 📦 Mon nouveau produit                                  │
│ "Produit créé par moi"                                 │
│ 👤 Vous (manager)                                      │
│ draft → pending                                         │
├─────────────────────────────────────────────────────────┤
│ [UPDATE] 12:10                                          │
│ 📦 Produit d'un collègue                               │
│ "Produit modifié par moi"                              │
│ 👤 Vous (manager)                                      │
│ approved → pending                                      │
└─────────────────────────────────────────────────────────┘
```

## Tests recommandés

### Test 1 : Manager modifie produit d'un autre manager
1. Manager A crée un produit
2. Admin approuve
3. Se connecter en tant que Manager B
4. Modifier le produit
5. Vérifier que le produit repasse en `pending`
6. Vérifier l'activité dans l'onglet "Activités" de Manager B
7. Vérifier l'activité visible par l'admin

### Test 2 : Filtrage des activités
1. Se connecter en tant qu'admin
2. Créer des activités de différents types
3. Filtrer par type "CREATE"
4. Vérifier que seules les créations s'affichent
5. Filtrer par type "UPDATE"
6. Vérifier que seules les modifications s'affichent

### Test 3 : Pagination
1. Créer plus de 20 activités
2. Vérifier que la pagination fonctionne
3. Naviguer entre les pages
4. Vérifier les compteurs

### Test 4 : Auto-refresh
1. Ouvrir l'onglet "Activités"
2. Dans un autre onglet, créer une activité
3. Attendre 30 secondes
4. Vérifier que la nouvelle activité apparaît automatiquement

## Maintenance et évolutions

### Points d'attention
- **Performances** : Si le nombre d'activités devient très élevé (>10,000), considérer l'archivage ou la suppression automatique après X mois
- **Stockage** : Les métadonnées JSON peuvent devenir volumineuses avec beaucoup de changements
- **Index database** : Vérifier que les index sur `product_activities` sont optimaux

### Évolutions possibles
1. **Export CSV** : Permettre l'export des activités en CSV
2. **Notifications** : Notifier les managers quand leurs produits sont approuvés/rejetés
3. **Dashboard de métriques** :
   - Nombre d'activités par manager
   - Temps moyen entre soumission et validation
   - Taux d'approbation par manager
4. **Recherche avancée** : Recherche full-text dans les activités
5. **Groupement par produit** : Vue des activités groupées par produit

## Impact sur les performances

### Écriture
- ✅ Minimal : Une insertion dans `product_activities` par action
- ✅ Asynchrone : N'impacte pas la réponse utilisateur

### Lecture
- ✅ Paginé : Maximum 20 résultats par page
- ✅ Indexé : Index sur `user_id`, `product_id`, `activity_type`, `created_at`
- ✅ Preloading : Relations chargées efficacement

## Migration

### Aucune migration nécessaire
- ✅ La table `product_activities` existe déjà
- ✅ Toutes les colonnes sont présentes
- ✅ Les index sont en place
- ✅ Compatibilité backward complète

## Résumé des fichiers modifiés/créés

### Backend
```
✅ app/services/product_validation_service.ts (modifié)
✅ app/services/product_activity_service.ts (modifié)
✅ app/controllers/products_controller.ts (modifié)
✅ routes/products.ts (modifié)
```

### Frontend
```
✅ src/lib/api/activities.ts (nouveau)
✅ src/components/admin/activities/ActivitiesManagement.tsx (nouveau)
✅ src/components/admin/activities/index.ts (nouveau)
✅ src/app/admin/page.tsx (modifié)
✅ src/lib/hooks/useAdminTabs.ts (modifié)
```

### Documentation
```
✅ memory-bank/activities-management-system.md (nouveau)
```


