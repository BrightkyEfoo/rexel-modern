# ✅ Fix: Tri par prix avec prise en compte du salePrice

## Statut
**COMPLÉTÉ** - Implémenté le 7 octobre 2025

## Problème
Le tri par prix (`sort_by=price`) ne prenait en compte que le champ `price` et ignorait le `salePrice`.

## Solution Implémentée

### Modifications Backend

#### Fichier modifié
`rexel-modern-backend/app/repositories/product_repository.ts`

#### Changements apportés

1. **Tri par prix** : Modifié dans 3 méthodes
   - `findFeatured()` (ligne ~100)
   - `findWithPaginationAndFilters()` (ligne ~232)
   - `applySorting()` (ligne ~532)

```typescript
if (sortBy === 'price') {
  // Pour le tri par prix, prendre en compte le salePrice en priorité
  query.orderByRaw(`COALESCE(sale_price, price) ${sortOrder.toUpperCase()}`)
} else {
  query.orderBy(sortBy, sortOrder)
}
```

2. **Filtres de prix** : Modifié dans 2 endroits
   - `findWithPaginationAndFilters()` (ligne ~199)
   - `applyFilters()` (ligne ~471)

```typescript
// Filtres de prix (prendre en compte le salePrice en priorité)
if (filters.minPrice !== undefined) {
  query.whereRaw('COALESCE(sale_price, price) >= ?', [filters.minPrice])
}

if (filters.maxPrice !== undefined) {
  query.whereRaw('COALESCE(sale_price, price) <= ?', [filters.maxPrice])
}
```

3. **Fourchette de prix globale** : Modifié `getGlobalPriceRange()`

```typescript
const result = await Product.query()
  .select(
    Product.query()
      .min(Product.query().raw('COALESCE(sale_price, price)'))
      .where('is_active', true)
      .as('min_price'),
    Product.query()
      .max(Product.query().raw('COALESCE(sale_price, price)'))
      .where('is_active', true)
      .as('max_price')
  )
  .where('is_active', true)
  .first()
```

### Explication SQL
`COALESCE(sale_price, price)` retourne :
- `sale_price` si la valeur n'est pas NULL
- `price` sinon

### Résultat
✅ Les produits en promotion sont maintenant triés par leur prix soldé
✅ Les filtres de prix considèrent le prix effectif (sale_price ou price)
✅ La fourchette de prix globale reflète les vrais prix
✅ Le tri croissant/décroissant fonctionne correctement

### Endpoints affectés
- `GET /api/v1/opened/products` 
- `GET /api/v1/opened/products/category/:slug` 
- `GET /api/v1/opened/products/brand-slug/:slug` 
- `GET /api/v1/secured/products` 
- Et tous les autres endpoints utilisant le repository

## Frontend
✅ Le frontend affichait déjà le `salePrice` en priorité, aucune modification nécessaire.

