# Système de Recherche avec Typesense

Ce dossier contient tous les composants pour le système de recherche avancée utilisant Typesense.

## Composants

### `SearchBar.tsx`
Barre de recherche avec autocomplétion en temps réel.
- Debounce de 200ms pour l'autocomplétion
- Navigation au clavier (flèches, Enter, Escape)
- Redirection automatique vers la page de recherche
- Support mobile avec dialog

### `SearchDropdown.tsx`
Dropdown d'autocomplétion qui s'affiche sous la barre de recherche.
- Affiche 5 résultats maximum
- Groupé par type (produits, catégories, marques)
- Highlights des termes de recherche
- Bouton "Voir tous les résultats"

### `SearchResults.tsx`
Conteneur pour afficher les résultats de recherche.
- Gestion des états de chargement et d'erreur
- Support des modes grille et liste
- Messages d'état (aucun résultat, erreurs)

### `SearchResultCard.tsx`
Carte de résultat pour l'affichage en grille.
- Image, titre, description
- Badge du type de résultat
- Highlights des termes recherchés
- Hover effects

### `SearchResultListItem.tsx`
Item de résultat pour l'affichage en liste.
- Layout horizontal compact
- Même contenu que les cartes
- Optimisé pour mobile

### `SearchFilters.tsx`
Panel de filtres latéraux.
- Filtres par catégorie, marque, prix
- Sections collapsibles
- Slider de prix interactif
- Synchronisation avec l'URL

### `SearchPagination.tsx`
Composant de pagination pour les résultats.
- Navigation intelligente avec ellipses
- Informations sur les résultats affichés
- Responsive design

## Hooks

### `useSearch.ts`
Hooks React Query pour les requêtes de recherche.
- `useAutocomplete()` - Autocomplétion avec debounce
- `useProductSearch()` - Recherche de produits
- `useCategorySearch()` - Recherche de catégories
- `useBrandSearch()` - Recherche de marques

### `useSearchFilters.ts`
Hook nuqs pour la gestion des paramètres d'URL.
- Synchronisation automatique avec l'URL
- Fonctions utilitaires pour modifier les filtres
- Reset des filtres

## Services

### `search.ts`
Service API pour communiquer avec le backend Typesense.
- Méthodes pour tous types de recherche
- Gestion des erreurs
- Types TypeScript complets

## Types

### `search.ts`
Types TypeScript pour tout le système de recherche.
- Documents Typesense
- Résultats de recherche
- Paramètres et filtres
- Interfaces UI

## Utilisation

### Barre de recherche simple
```tsx
import { SearchBar } from "@/components/search/SearchBar"

<SearchBar placeholder="Rechercher..." />
```

### Page de recherche complète
```tsx
import { SearchPageContent } from "@/app/recherche/SearchPageContent"

<SearchPageContent />
```

### Recherche programmatique
```tsx
import { useAutocomplete } from "@/lib/hooks/useSearch"

const { data, isLoading } = useAutocomplete("laptop")
```

## Configuration Backend

Le système nécessite Typesense configuré avec les collections :
- `products` - Produits avec marques et catégories
- `categories` - Catégories hiérarchiques
- `brands` - Marques avec compteurs de produits

## Fonctionnalités

✅ **Autocomplétion en temps réel** - 200ms debounce
✅ **Recherche multi-types** - Produits, catégories, marques
✅ **Filtres avancés** - Prix, catégories, marques, caractéristiques
✅ **Pagination** - Navigation intelligente
✅ **URL synchronisée** - Partage de liens de recherche
✅ **Responsive design** - Mobile et desktop
✅ **Gestion d'état** - React Query + nuqs
✅ **Types TypeScript** - Sécurité de type complète
✅ **Highlights** - Mise en évidence des termes
✅ **Navigation clavier** - Accessibilité
✅ **États de chargement** - UX optimisée

## Performance

- **Debounce** : Évite les requêtes inutiles
- **Cache** : React Query avec staleTime configuré
- **Lazy loading** : Images et composants
- **Pagination** : Limite les résultats par page
- **Optimistic UI** : Feedback immédiat
