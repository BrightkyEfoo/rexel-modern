# System Patterns - Rexel Modern

## Architecture générale

### Frontend (Next.js)
```
src/
├── app/                    # App Router (Next.js 13+)
├── components/             # Composants réutilisables
│   ├── ui/                # Composants de base (shadcn/ui)
│   ├── layout/            # Header, Footer, Navigation
│   └── sections/          # Sections de pages
├── lib/                   # Utilitaires et configuration
│   ├── api/               # Client API et types
│   ├── auth/              # Services d'authentification
│   └── query/             # React Query setup
```

### Backend (AdonisJS)
```
app/
├── Controllers/Http/       # Contrôleurs REST API
├── Models/                # Modèles ORM (Lucid)
├── Services/              # Logique métier
├── Repositories/          # Accès aux données
├── Validators/            # Validation des requêtes
├── Middlewares/           # Middlewares (auth, etc.)
└── Utils/                 # Fonctions utilitaires
```

## Patterns architecturaux

### 1. Clean Architecture
- **Séparation des responsabilités** : Controllers → Services → Repositories → Models
- **Dépendances inversées** : Les couches internes ne dépendent pas des externes
- **Testabilité** : Chaque couche peut être testée indépendamment

### 2. Repository Pattern
- **Abstraction** : Interface entre la logique métier et la persistance
- **Flexibilité** : Changement de ORM sans impact sur la logique
- **Testabilité** : Mock des repositories pour les tests

### 3. Service Layer
- **Logique métier** : Encapsulation des règles business
- **Réutilisabilité** : Services utilisables par plusieurs contrôleurs
- **Validation** : Vérification des règles métier

## Patterns spécifiques

### Gestion des slugs
```typescript
class SlugService {
  // Génération automatique à partir du nom
  // Vérification d'unicité
  // Mise à jour conditionnelle
}
```

### Upload de fichiers
```typescript
class FileService {
  // Upload vers MinIO
  // Gestion des buckets par contexte
  // Relations polymorphiques
}
```

### Authentification
```typescript
// Middleware intelligent selon préfixe URL
// /secured → Vérification token
// /opened → Accès libre
```

## Relations entre entités

### Principales entités
- **User** : Utilisateurs du système
- **Product** : Produits du catalogue
- **Category** : Catégories de produits
- **Brand** : Marques
- **File** : Fichiers (polymorphique)
- **Order** : Commandes
- **Cart** : Panier

### Relations clés
- Product belongsTo Category
- Product belongsTo Brand
- Product hasMany Files (polymorphic)
- User hasMany Orders
- Order hasMany OrderItems
- User hasOne Cart

## Conventions de nommage

### API Routes
- `GET /opened/products` : Liste publique
- `POST /secured/products` : Création (auth requise)
- `PUT /secured/products/:id` : Mise à jour
- `DELETE /secured/products/:id` : Suppression

### Base de données
- Tables en snake_case
- Clés étrangères avec suffixe _id
- Timestamps automatiques (created_at, updated_at)
- Soft deletes où nécessaire

### Code
- Classes en PascalCase
- Méthodes en camelCase
- Variables en camelCase
- Constantes en UPPER_SNAKE_CASE 