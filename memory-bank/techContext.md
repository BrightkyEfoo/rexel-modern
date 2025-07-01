# Tech Context - Rexel Modern

## Stack technique

### Frontend
- **Next.js 15** : Framework React avec App Router
- **TypeScript** : Typage statique
- **TailwindCSS** : Styles utilitaires
- **Shadcn/ui** : Composants UI modernes
- **React Query** : Gestion des requêtes et cache
- **NextAuth.js** : Authentification côté client
- **Framer Motion** : Animations
- **Zod** : Validation des schémas

### Backend
- **AdonisJS 6** : Framework Node.js moderne
- **TypeScript** : Typage statique
- **Lucid ORM** : ORM pour AdonisJS
- **PostgreSQL** : Base de données relationnelle
- **MinIO** : Stockage d'objets (S3-compatible)
- **JWT** : Tokens d'authentification

### DevOps & Outils
- **Bun** : Runtime et package manager
- **Biome** : Linter et formateur
- **Docker** : Containerisation
- **Netlify** : Déploiement frontend
- **Git** : Versioning avec conventions

## Configuration environnement

### Variables d'environnement (Backend)
```env
# Database
DB_CONNECTION=pg
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_DATABASE=rexel_modern

# MinIO
MINIO_HOST=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false

# Auth
JWT_SECRET=your-jwt-secret
APP_KEY=your-app-key

# Storage
STORAGE_DRIVER=minio
```

### Variables d'environnement (Frontend)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3333
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

## Architecture de déploiement

### Développement
- Frontend : localhost:3000 (Next.js dev)
- Backend : localhost:3333 (AdonisJS)
- Database : localhost:5432 (PostgreSQL)
- Storage : localhost:9000 (MinIO)

### Production
- Frontend : Netlify ou Vercel
- Backend : VPS ou cloud provider
- Database : PostgreSQL managé
- Storage : MinIO ou S3

## Dépendances principales

### Backend AdonisJS
```json
{
  "@adonisjs/core": "^6.0.0",
  "@adonisjs/lucid": "^20.0.0",
  "@adonisjs/auth": "^9.0.0",
  "minio": "^8.0.0",
  "pg": "^8.11.0"
}
```

### Frontend Next.js
```json
{
  "next": "^15.3.2",
  "@tanstack/react-query": "^5.80.6",
  "next-auth": "^4.24.0",
  "tailwindcss": "^3.4.17"
}
```

## Contraintes techniques

### Performance
- Requêtes optimisées avec indexation
- Cache Redis pour les données fréquentes
- Images optimisées et lazy loading
- Bundle splitting et code splitting

### Sécurité
- Validation stricte des entrées
- Authentification JWT sécurisée
- CORS configuré correctement
- Chiffrement des données sensibles

### Scalabilité
- Architecture modulaire
- Services découplés
- Base de données normalisée
- CDN pour les assets statiques

## Conventions de développement

### Git
- Branches : `feature/`, `fix/`, `hotfix/`
- Commits : format conventionnel
- Pull requests obligatoires
- Tests requis avant merge

### Code
- TypeScript strict mode
- ESLint + Biome pour la qualité
- Tests unitaires avec coverage > 80%
- Documentation du code 