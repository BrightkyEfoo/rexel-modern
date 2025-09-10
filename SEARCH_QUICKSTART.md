# 🔍 Guide de Démarrage Rapide - Recherche Typesense

## Installation et Configuration

### 1. Démarrer les services

```bash
# Dans le dossier backend
cd /Users/macbookpro/Desktop/warap/rexel-modern-backend

# Démarrer tous les services (incluant Typesense)
docker-compose up -d

# Vérifier que Typesense fonctionne
curl http://localhost:8108/health
```

### 2. Ajouter des données de test

```bash
# Créer des produits, catégories et marques de test
node ace seed:search-data

# Initialiser Typesense et indexer les données
node ace typesense:setup
```

### 3. Tester l'API

```bash
# Tester les endpoints de recherche
node test-search.js
```

## Utilisation Frontend

### 1. Démarrer le frontend

```bash
# Dans le dossier frontend
cd /Users/macbookpro/Desktop/warap/rexel-modern

# Installer les dépendances (si pas déjà fait)
npm install

# Démarrer en mode développement
npm run dev
```

### 2. Tester la recherche

1. **Ouvrir** http://localhost:3000
2. **Utiliser la barre de recherche** dans le header
3. **Taper** "laptop", "iPhone", ou "Sony"
4. **Voir l'autocomplétion** apparaître avec 5 résultats max
5. **Cliquer** sur "Voir tous les résultats" ou appuyer sur Entrée
6. **Explorer** la page de recherche avec filtres et pagination

## Fonctionnalités Testables

### ✅ Barre de Recherche
- Autocomplétion en temps réel (debounce 200ms)
- Navigation au clavier (↑↓ Enter Escape)
- Redirection vers page de recherche
- Version mobile avec dialog

### ✅ Page de Recherche (/recherche)
- Recherche dans produits, catégories, marques
- Filtres par prix, marque, catégorie
- Tri par pertinence, nom, prix, date
- Pagination intelligente
- URL synchronisée (partage de liens)
- Modes d'affichage grille/liste

### ✅ API Endpoints
```bash
# Autocomplétion
GET /opened/search/autocomplete?q=laptop

# Recherche globale
GET /opened/search?q=ordinateur&limit=10

# Recherche produits avec filtres
GET /opened/search/products?q=laptop&brand_id=1&min_price=500

# Recherche catégories
GET /opened/search/categories?q=électronique

# Recherche marques
GET /opened/search/brands?q=apple

# Santé du service
GET /opened/search/health
```

## Données de Test Créées

### 📱 Produits (10 items)
- iPhone 15 Pro Max (Apple, 1479€)
- MacBook Pro 16" (Apple, 2799€ → 2599€)
- Samsung Galaxy S24 Ultra (Samsung, 1419€)
- Dell XPS 13 (Dell, 1299€ → 1199€)
- PlayStation 5 (Sony, 549€)
- Microsoft Surface Laptop 5 (Microsoft, 1129€ → 999€)
- AirPods Pro 2 (Apple, 279€ → 249€)
- Logitech MX Master 3S (Logitech, 109€)
- ASUS ROG Strix RTX 4080 (ASUS, 1349€ → 1299€)
- Sony WH-1000XM5 (Sony, 399€ → 349€)

### 📂 Catégories (6 items)
- Électronique, Ordinateurs, Smartphones
- Gaming, Audio, Accessoires

### 🏷️ Marques (8 items)
- Apple, Samsung, Microsoft, Sony
- Dell, HP, Logitech, ASUS

## Tests de Recherche

### Requêtes suggérées pour tester :
- **"laptop"** → MacBook Pro, Dell XPS, Surface
- **"iPhone"** → iPhone 15 Pro Max
- **"gaming"** → PlayStation 5, RTX 4080
- **"apple"** → iPhone, MacBook, AirPods
- **"sony"** → PlayStation, casque WH-1000XM5
- **"écouteurs"** → AirPods Pro, Sony WH-1000XM5
- **"ordinateur"** → MacBook, Dell XPS, Surface

### Filtres à tester :
- **Prix** : 0-500€, 500-1000€, 1000€+
- **Marques** : Apple, Samsung, Sony
- **Catégories** : Smartphones, Ordinateurs, Audio
- **Caractéristiques** : Produits en vedette, En stock

## Architecture Technique

### Backend (AdonisJS + Typesense)
```
TypesenseService → SearchController → API Routes
     ↓                    ↓              ↓
Collections:         Endpoints:     Frontend:
- products          /autocomplete   SearchBar
- categories        /search         SearchPage
- brands            /health         Filters
```

### Frontend (Next.js + React Query)
```
SearchBar → useAutocomplete → SearchDropdown
SearchPage → useProductSearch → SearchResults
SearchFilters → useSearchFilters → URL Sync (nuqs)
```

## Dépannage Rapide

### Typesense ne répond pas
```bash
docker-compose restart typesense
curl http://localhost:8108/health
```

### Pas de résultats de recherche
```bash
node ace typesense:setup  # Réindexer
```

### Frontend ne trouve pas l'API
Vérifier que `NEXT_PUBLIC_API_URL` pointe vers `http://localhost:3333`

### Erreur de CORS
L'API backend doit autoriser `http://localhost:3000` en développement

## Prochaines Étapes

1. **Personnaliser** les données de test selon vos besoins
2. **Ajouter** des images aux produits pour améliorer l'affichage
3. **Configurer** la synchronisation automatique Typesense
4. **Implémenter** l'analytics de recherche
5. **Optimiser** les performances avec du cache Redis

---

🎉 **Félicitations !** Vous avez maintenant un système de recherche complet et moderne avec Typesense, autocomplétion, filtres avancés et pagination !
