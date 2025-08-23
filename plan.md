Voici un **plan complet et détaillé** pour transformer ton projet en une architecture backend moderne avec AdonisJS, PostgreSQL, MinIO, une API REST clean, et une logique d’auth côté client conforme à tes besoins.

---

# 1. **Architecture & Structure du Backend (AdonisJS)**

## 1.1. **Structure de dossiers (Clean Architecture, SOLID, DRY, POO)**
```
kesimarket-modern-backend/
│
├── app/
│   ├── Controllers/Http/         # Contrôleurs REST (API)
│   ├── Models/                   # Modèles ORM (Lucid)
│   ├── Services/                 # Logique métier (ex: FileService, SlugService)
│   ├── Validators/               # Validation des requêtes
│   ├── Repositories/             # Accès aux données (pattern repository)
│   ├── Middlewares/              # Middlewares (auth, etc.)
│   └── Utils/                    # Fonctions utilitaires (slugify, etc.)
│
├── config/
│   ├── database.ts               # Config PostgreSQL
│   ├── minio.ts                  # Config MinIO
│   └── ...                       # Autres configs
│
├── database/
│   ├── migrations/               # Migrations SQL
│   └── seeders/                  # Données de seed
│
├── contracts/                    # Interfaces TypeScript
├── start/                        # Bootstrap (routes, kernel, etc.)
├── public/                       # Fichiers statiques (servis par Adonis)
├── .env                          # Variables d’environnement
└── package.json
```

---

# 2. **Fonctionnalités à implémenter**

## 2.1. **Connexion PostgreSQL**
- Utiliser Lucid ORM d’AdonisJS.
- Config dans `config/database.ts` (host, user, password, db, port).

## 2.2. **Gestion des slugs**
- Service `SlugService` dans `app/Services/SlugService.ts`.
- Générer un slug unique à la création (basé sur `name` ou `title`).
- Slug mis à jour automatiquement si le champ source change (sauf si déjà utilisé).
- Slug non modifiable manuellement.

## 2.3. **Gestion des fichiers (upload, MinIO)**
- Service `FileService` pour upload/download.
- Utiliser le package MinIO officiel.
- Buckets par contexte (ex: `products`, `categories`, `users`, etc.).
- API REST pour upload single/multiple (`POST /files`), retourne les paths relatifs.
- Table `files` avec relation polymorphique (ex: `fileable_id`, `fileable_type`).
- Lecture des fichiers : endpoint public, pas de sécurité contraignante.

## 2.4. **Modélisation des entités**
- Exemples : `Product`, `Category`, `Brand`, `User`, `File`, etc.
- Relations : 
  - Un produit a plusieurs fichiers (images, docs…)
  - Un fichier appartient à un item (relation polymorphique)
- Migrations pour chaque entité.

## 2.5. **API RESTful**
- Contrôleurs CRUD pour chaque ressource.
- Respecter les conventions REST (`GET`, `POST`, `PUT/PATCH`, `DELETE`).
- Validation via Validators.
- Utilisation de Repositories pour l’accès aux données (pattern repository).

## 2.6. **Sécurité & Authentification**
- Authentification JWT (AdonisJS Auth).
- Middleware `SecuredRoute` : 
  - Si l’URL commence par `/secured`, vérifie le token (issu de NextAuth côté client).
  - Si pas de token, retourne 401.
  - Les routes `/opened` sont publiques.
  - Les préfixes `/secured` et `/opened` sont retirés de l’URL avant routage réel.

## 2.7. **Centralisation de la logique d’upload**
- Un seul endpoint pour tous les uploads.
- Supporte single/multiple.
- Génère le chemin relatif selon le bucket/context.
- Retourne les URLs publiques.

---

# 3. **Côté Client (apiClient.ts)**

## 3.1. **Logique d’appel API**
- Si l’URL commence par `/secured`, utilise le token NextAuth de la session.
  - Si pas de token, redirige vers `/auth/login`.
  - Retire `/secured` du path avant d’appeler l’API.
- Si l’URL commence par `/opened` ou autre, n’utilise pas de token.
  - Retire `/opened` du path avant d’appeler l’API.

---

# 4. **Plan d’implémentation étape par étape**

## **Étape 1 : Initialisation du projet**
- Créer le projet AdonisJS (`npx create-adonis-ts-app kesimarket-modern-backend`).
- Installer les dépendances (PostgreSQL, MinIO, etc.).
- Configurer `.env` (DB, MinIO).

## **Étape 2 : Modélisation & Migrations**
- Créer les modèles et migrations pour : Product, Category, Brand, File, User, etc.
- Ajouter les relations (hasMany, belongsTo, morphMany pour les fichiers).

## **Étape 3 : Services**
- Créer `SlugService` (génération, unicité, update auto).
- Créer `FileService` (upload, download, gestion MinIO).

## **Étape 4 : Repositories**
- Créer un repository par entité pour l’accès aux données (ex: `ProductRepository`).

## **Étape 5 : Contrôleurs & Routes**
- Créer les contrôleurs CRUD.
- Définir les routes RESTful.
- Ajouter les middlewares d’auth (SecuredRoute, OpenedRoute).
- Gérer le stripping des préfixes `/secured` et `/opened`.

## **Étape 6 : Authentification**
- Mettre en place JWT Auth.
- Adapter le middleware pour vérifier le token NextAuth côté client.

## **Étape 7 : Upload de fichiers**
- Créer l’endpoint `/files` (single/multiple).
- Gérer le stockage sur MinIO, le bucket par contexte, et le retour des paths relatifs.
- Créer la table `files` et la relation polymorphique.

## **Étape 8 : Slugification**
- Générer le slug à la création.
- Mettre à jour le slug si le champ source change (sauf si déjà utilisé).

## **Étape 9 : Tests & Documentation**
- Tester tous les endpoints.
- Documenter l’API (Swagger ou autre).

---

# 5. **Exemple de routes**
- `POST /secured/products` (auth requise)
- `GET /opened/products` (public)
- `POST /files` (upload, auth requise si besoin)
- `GET /files/:bucket/:filename` (public)

---

# 6. **Résumé des points clés**
- **SOLID/DRY/POO** : services, repositories, controllers, models bien séparés.
- **Clean Architecture** : pas de logique métier dans les contrôleurs, tout passe par services/repositories.
- **Slug unique** : généré automatiquement, non modifiable manuellement.
- **Upload centralisé** : un seul endpoint, gestion MinIO, relation polymorphique.
- **Sécurité** : middleware intelligent selon le préfixe d’URL.
- **Client** : apiClient qui gère le token NextAuth uniquement pour `/secured`.
