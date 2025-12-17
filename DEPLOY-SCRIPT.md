# Script de Déploiement Simplifié - KesiMarket

Documentation du script `deploy-kesimarket.sh` qui déploie automatiquement le frontend et le backend sur le serveur de production.

**Script** : `/Users/macbookpro/Desktop/warap/deploy-kesimarket.sh`

---

## Architecture du Déploiement

### Structure sur le Serveur

```
~/system/service/x7k9m2v4/
├── api-service/                 # Backend
│   ├── src/                     # Code cloné depuis GitHub
│   ├── .env                     # Variables d'environnement
│   └── docker-compose.yml       # Configuration Docker
└── web-client/                  # Frontend
    ├── src/                     # Code cloné depuis GitHub
    ├── .env
    ├── .env.production
    └── docker-compose.yml
```

### Conteneurs Docker

| Service | Nom du conteneur | Image | Port |
|---------|------------------|-------|------|
| Frontend (Next.js) | `x7k9-wcli-1` | `x7k9-wcli` | 3000 |
| Backend (AdonisJS) | `x7k9-asvc-1` | `x7k9-asvc` | 3333 |
| PostgreSQL | `x7k9-pgsql` | postgres:16-alpine | 5432 |
| MinIO | `x7k9-objst` | minio/minio:latest | 9000, 9001 |
| Typesense | `x7k9-srch` | typesense/typesense:27.0 | 8108 |

> **Note** : Les noms sont volontairement obfusqués.

---

## Variables d'Environnement

### Backend (17 variables)

Basées sur l'analyse du code source (`start/env.ts`, `config/*.ts`) :

```env
# Core AdonisJS
NODE_ENV=production
PORT=3333
HOST=0.0.0.0
LOG_LEVEL=info
APP_KEY=<généré>

# Database (config/database.ts)
DB_HOST=x7k9-pgsql
DB_PORT=5432
DB_USER=kesimkt_usr
DB_PASSWORD=<généré>
DB_DATABASE=kesimkt_db

# MinIO (config/minio.ts)
MINIO_HOST=x7k9-objst
MINIO_PORT=9000
MINIO_ACCESS_KEY=kesimkt_minio
MINIO_SECRET_KEY=<généré>
MINIO_USE_SSL=false
MINIO_PUBLIC_ENDPOINT=https://storage.kesimarket.com

# Typesense (config/typesense.ts)
TYPESENSE_HOST=x7k9-srch
TYPESENSE_PORT=8108
TYPESENSE_API_KEY=<généré>

# Email Gmail SMTP (config/mail.ts)
MAIL_USERNAME=<email>
GOOGLE_APP_SECRET=<app password>

# Frontend URL (auth_controller.ts)
FRONTEND_URL=https://kesimarket.com
```

### Frontend (9 variables)

Basées sur l'analyse du code source (`src/lib/**/*.ts`) :

```env
# Core
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# API (src/lib/api/client.ts)
NEXT_PUBLIC_API_URL=https://api.kesimarket.com

# NextAuth
NEXTAUTH_URL=https://kesimarket.com
NEXTAUTH_SECRET=<généré>

# MinIO (src/lib/config/minio.ts)
NEXT_PUBLIC_MINIO_BUCKET_URL=https://storage.kesimarket.com/rexel-public

# Currency (src/lib/utils/currency.ts)
NEXT_PUBLIC_CURRENCY_SYMBOL=XAF
NEXT_PUBLIC_CURRENCY_CODE=XAF
NEXT_PUBLIC_CURRENCY_NAME=Franc CFA
```

---

## Commandes du Script

```bash
./deploy-kesimarket.sh [command] [options]
```

| Commande | Description |
|----------|-------------|
| `all` (défaut) | Déploie backend + frontend |
| `backend` | Déploie uniquement le backend |
| `frontend` | Déploie uniquement le frontend |
| `setup` | Configure le serveur (dossiers, réseau Docker) |
| `status` | Affiche l'état des conteneurs |
| `migrate` | Lance les migrations de base de données |
| `seed` | Lance les seeds de base de données |
| `logs [service]` | Affiche les logs (frontend\|backend\|db\|minio) |
| `caddy` | Affiche la configuration Caddy recommandée |

---

## Processus de Déploiement

### 1. Setup du serveur
- Création des dossiers
- Création du réseau Docker `x7k9-internal-net`

### 2. Déploiement Backend
1. Écriture des fichiers `.env` et `docker-compose.yml` sur le serveur
2. Clone/Pull du code depuis GitHub (branche `master`)
3. Build de l'image Docker sur le serveur
4. Démarrage des conteneurs (PostgreSQL, MinIO, Typesense, Backend)
5. Exécution des migrations
6. Setup des buckets MinIO

### 3. Déploiement Frontend
1. Écriture des fichiers `.env`, `.env.production` et `docker-compose.yml`
2. Clone/Pull du code depuis GitHub (branche `main`)
3. Build de l'image Docker sur le serveur
4. Démarrage du conteneur Frontend

---

## Configuration Caddy (Reverse Proxy)

À ajouter dans `/etc/caddy/Caddyfile` sur le serveur :

```caddyfile
# Frontend
kesimarket.com, www.kesimarket.com {
    reverse_proxy 127.0.0.1:3000
}

# Backend API
api.kesimarket.com {
    reverse_proxy 127.0.0.1:3333
}

# MinIO Storage (public)
storage.kesimarket.com {
    reverse_proxy 127.0.0.1:9000
}

# MinIO Console (admin)
minio.kesimarket.com {
    reverse_proxy 127.0.0.1:9001
}

# Typesense Search
search.kesimarket.com {
    reverse_proxy 127.0.0.1:8108
}
```

Puis : `sudo systemctl reload caddy`

---

## Domaines Requis

| Domaine | Usage |
|---------|-------|
| `kesimarket.com` | Frontend |
| `api.kesimarket.com` | Backend API |
| `storage.kesimarket.com` | MinIO (stockage public) |
| `minio.kesimarket.com` | MinIO Console (admin) |
| `search.kesimarket.com` | Typesense (recherche) |

---

## Génération des Clés

Les clés secrètes sont générées avec OpenSSL :

```bash
# APP_KEY / NEXTAUTH_SECRET
openssl rand -base64 32

# DB_PASSWORD / MINIO_SECRET_KEY / TYPESENSE_API_KEY
openssl rand -hex 16
```

---

## Simplifications Effectuées

### Variables retirées (non utilisées dans le code)

- **Redis** : Aucune utilisation trouvée dans le code backend
- **JWT_SECRET** : Non utilisé (AdonisJS utilise APP_KEY)
- **CORS_ORIGINS** : Le backend a `origin: true` dans la config
- Variables de staging/analytics/social auth/payment du frontend

### Comparaison

| | Avant | Après |
|--|-------|-------|
| Variables Backend | ~40 | 17 |
| Variables Frontend | ~50 | 9 |
| Services Docker | 5 (avec Redis) | 4 (sans Redis) |

---

## Utilisation

```bash
# Premier déploiement complet
./deploy-kesimarket.sh

# Redéployer uniquement le backend après modification
./deploy-kesimarket.sh backend

# Redéployer uniquement le frontend après modification
./deploy-kesimarket.sh frontend

# Vérifier l'état
./deploy-kesimarket.sh status

# Voir les logs du backend
./deploy-kesimarket.sh logs backend

# Lancer les migrations
./deploy-kesimarket.sh migrate

# Lancer les seeds
./deploy-kesimarket.sh seed
```

---

## Repositories GitHub

| Projet | Repository | Branche |
|--------|------------|---------|
| Frontend | `git@github.com:BrightkyEfoo/rexel-modern.git` | `main` |
| Backend | `git@github.com:BrightkyEfoo/rexel-modern-backend.git` | `master` |
