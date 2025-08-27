# Configuration de la Devise

Ce document explique comment configurer la devise dans l'application KesiMarket Modern.

## Variables d'environnement

L'application utilise les variables d'environnement suivantes pour configurer la devise :

### Variables requises

- `NEXT_PUBLIC_CURRENCY_SYMBOL` : Le symbole de la devise (ex: €, $, £)
- `NEXT_PUBLIC_CURRENCY_CODE` : Le code ISO de la devise (ex: EUR, USD, GBP)
- `NEXT_PUBLIC_CURRENCY_NAME` : Le nom de la devise (ex: Euro, Dollar, Livre)

### Configuration par défaut

Si les variables d'environnement ne sont pas définies, l'application utilise les valeurs par défaut suivantes :

- Symbole : €
- Code : EUR
- Nom : Euro

## Configuration des environnements

### Développement local

Créez un fichier `.env.local` à la racine du projet :

```env
# ===== CURRENCY =====
NEXT_PUBLIC_CURRENCY_SYMBOL=€
NEXT_PUBLIC_CURRENCY_CODE=EUR
NEXT_PUBLIC_CURRENCY_NAME=Euro
```

### Production

Les variables sont déjà configurées dans `env.production.example` :

```env
# ===== CURRENCY =====
NEXT_PUBLIC_CURRENCY_SYMBOL=€
NEXT_PUBLIC_CURRENCY_CODE=EUR
NEXT_PUBLIC_CURRENCY_NAME=Euro
```

### Staging

Les variables sont déjà configurées dans `env.staging.example` :

```env
# ===== CURRENCY =====
NEXT_PUBLIC_CURRENCY_SYMBOL=€
NEXT_PUBLIC_CURRENCY_CODE=EUR
NEXT_PUBLIC_CURRENCY_NAME=Euro
```

## Utilisation dans le code

### Import de l'utilitaire

```typescript
import { formatPrice, getCurrencySymbol, getCurrencyCode, getCurrencyName } from '@/lib/utils/currency';
```

### Fonctions disponibles

#### `formatPrice(price, options?)`

Formate un prix avec le symbole de devise configuré.

```typescript
// Utilisation basique
formatPrice(123.45) // "123.45€"

// Avec options
formatPrice(123.45, { showCode: true }) // "123.45 EUR"
formatPrice(123.45, { showSymbol: false }) // "123.45"
formatPrice(123.45, { decimals: 0 }) // "123€"
```

#### `getCurrencySymbol()`

Retourne le symbole de devise configuré.

```typescript
getCurrencySymbol() // "€"
```

#### `getCurrencyCode()`

Retourne le code de devise configuré.

```typescript
getCurrencyCode() // "EUR"
```

#### `getCurrencyName()`

Retourne le nom de devise configuré.

```typescript
getCurrencyName() // "Euro"
```

#### `formatPriceRange(minPrice, maxPrice, options?)`

Formate une fourchette de prix.

```typescript
formatPriceRange(100, 200) // "100€ - 200€"
formatPriceRange(100, 200, { showCode: true }) // "100 - 200 EUR"
```

#### `formatDiscount(amount, options?)`

Formate un montant de réduction.

```typescript
formatDiscount(25.50) // "-25.50€"
formatDiscount(25.50, { showCode: true }) // "-25.50 EUR"
```

## Exemples d'utilisation

### Dans un composant React

```typescript
import { formatPrice } from '@/lib/utils/currency';

export function ProductCard({ product }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p className="price">{formatPrice(product.price)}</p>
      {product.salePrice && (
        <p className="sale-price">{formatPrice(product.salePrice)}</p>
      )}
    </div>
  );
}
```

### Dans un filtre de prix

```typescript
import { getCurrencySymbol } from '@/lib/utils/currency';

export function PriceFilter() {
  return (
    <div>
      <label>Prix ({getCurrencySymbol()})</label>
      <input type="range" min="0" max="1000" />
    </div>
  );
}
```

## Migration depuis l'ancien système

Si vous avez du code qui utilise directement le symbole €, remplacez-le par l'utilitaire :

### Avant

```typescript
<span>{price.toFixed(2)} €</span>
```

### Après

```typescript
import { formatPrice } from '@/lib/utils/currency';

<span>{formatPrice(price)}</span>
```

## Support de nouvelles devises

Pour ajouter le support d'une nouvelle devise, il suffit de modifier les variables d'environnement :

```env
# Pour le Dollar américain
NEXT_PUBLIC_CURRENCY_SYMBOL=$
NEXT_PUBLIC_CURRENCY_CODE=USD
NEXT_PUBLIC_CURRENCY_NAME=Dollar

# Pour la Livre sterling
NEXT_PUBLIC_CURRENCY_SYMBOL=£
NEXT_PUBLIC_CURRENCY_CODE=GBP
NEXT_PUBLIC_CURRENCY_NAME=Livre
```

## Notes importantes

1. Les variables d'environnement commençant par `NEXT_PUBLIC_` sont exposées côté client
2. Les changements de devise nécessitent un redémarrage de l'application
3. L'utilitaire gère automatiquement le formatage des nombres avec 2 décimales par défaut
4. Tous les prix dans l'application utilisent maintenant cet utilitaire pour la cohérence
