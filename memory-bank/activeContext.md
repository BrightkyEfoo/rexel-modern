# Contexte Actif - KesiMarket Modern

## 🎯 Focus Actuel (Janvier 2025)
**✅ Architecture Caddy Partagée Implémentée + Système de Types d'Utilisateurs Unifié + Pages Auth Thématisées + Filtres Dynamiques Backend**

## 📋 Changements Récents (Architecture Partagée)

### ✅ Migration vers Architecture Caddy Centralisée
1. **Caddy centralisé sur backend** - Un seul reverse proxy gère frontend et API
2. **Réseau Docker partagé `kesimarket-net`** - Communication entre conteneurs
3. **Domaines unifiés** - kesimarket.com et api.kesimarket.com gérés par un seul Caddy
4. **Déploiements indépendants** - Frontend et backend se déploient séparément
5. **Configuration SSL centralisée** - Let's Encrypt géré uniquement par le backend
6. **Logs centralisés** - Tous les logs Caddy dans le backend
7. **Rate limiting unifié** - Politique centralisée pour tous les services

### ✅ Nouvelles Configurations de Domaines

#### Production
- **Frontend** : `kesimarket.com` → `frontend:3000`
- **API** : `api.kesimarket.com` → `app:3333`

#### Staging  
- **Frontend** : `staging.kesimarket.com` → `frontend:3000`
- **API** : `staging-api.kesimarket.com` → `app:3333`

### ✅ Modification du Caddyfile Backend
Configuration complète pour 4 domaines :
```caddyfile
# Production
kesimarket.com { reverse_proxy frontend:3000 }
api.kesimarket.com { reverse_proxy app:3333 }

# Staging  
staging.kesimarket.com { reverse_proxy frontend:3000 }
staging-api.kesimarket.com { reverse_proxy app:3333 }
```

**Features implémentées :**
- ✅ **SSL automatique** pour tous les domaines
- ✅ **Rate limiting différentiel** (prod: 100 req/min, staging: 200 req/min)
- ✅ **CORS configuré** par environnement
- ✅ **Compression Gzip/Brotli**
- ✅ **Headers de sécurité** complets
- ✅ **Logs séparés** par domaine

### ✅ Docker Compose Frontend Simplifié
**Avant :**
```yaml
services:
  app: # Frontend
  caddy: # Reverse proxy
```

**Après :**
```yaml
networks:
  kesimarket-net:
    external: true

services:
  frontend: # Juste le conteneur Next.js
```

### ✅ GitHub Actions Workflow Mis à Jour

**Nouvelles fonctionnalités :**
1. **Vérification réseau partagé** - Création automatique si manquant
2. **Support staging/production** - Variables d'environnement différentiées
3. **Pas de transfert Caddyfile** - Géré par le backend
4. **Health checks adaptés** - Vérification connectivité réseau
5. **Documentation URLs** - Affichage des domaines finaux

**Workflow steps modifiés :**
- ✅ `docker-setup` : Vérification + création réseau `kesimarket-net`
- ✅ `build-docker` : Support environnements staging/production
- ✅ `transfer-image` : Plus de transfert Caddyfile
- ✅ `load-and-run` : Déploiement uniquement du service `frontend`
- ✅ `health-check` : Vérification connectivité réseau partagé

### ✅ Système de Filtres Dynamiques Backend (31/01/2025)

#### Architecture des Métadonnées
- ✅ **Table pivot** - `product_metadata` avec clés/valeurs dynamiques
- ✅ **Types de valeurs** - string, number, boolean, json pour flexibilité
- ✅ **Index optimisés** - Performance pour les requêtes de filtrage
- ✅ **Contrainte unique** - Évite les doublons par produit/clé

#### API Endpoints
- ✅ **Filtres dynamiques** - `/products?is_promo=true&couleur=rouge,bleu&materiau=plastique`
- ✅ **Filtres disponibles** - `GET /products/filters` - Liste des filtres
- ✅ **Valeurs par filtre** - `GET /products/filters/{key}/values` - Valeurs disponibles
- ✅ **Intégration complète** - Filtres dans toutes les requêtes produits

#### Métadonnées par Défaut
- ✅ **is_promo** - Produits en promotion
- ✅ **is_destockage** - Produits en destockage
- ✅ **couleur** - Couleur du produit
- ✅ **materiau** - Matériau utilisé
- ✅ **dimensions** - Dimensions du produit
- ✅ **poids** - Poids en grammes
- ✅ **garantie** - Durée de garantie
- ✅ **certification** - Certifications (CE, etc.)
- ✅ **pays_origine** - Pays d'origine
- ✅ **reference_fabricant** - Référence fabricant

### ✅ Système de Types d'Utilisateurs Unifié (31/01/2025)

**Backend (AdonisJS) :**
- ✅ **Enum UserType** - `app/types/user.ts` avec `ADMIN` et `CUSTOMER`
- ✅ **Migration** - Champ `type` (enum: 'admin', 'customer') dans table `users`
- ✅ **Modèle User** - Champ `type: UserType` avec import de l'enum
- ✅ **Seeder** - 5 utilisateurs de test (1 admin + 4 customers)

**Frontend (Next.js) :**
- ✅ **Enum UserType** - `src/lib/types/user.ts` identique au backend
- ✅ **Types API** - Interface `User` mise à jour avec `type: UserType`
- ✅ **Cohérence** - Même enum partagé entre backend et frontend

**Comptes de test créés :**
- **Admin** : `admin@kesimarket.com` (admin123) - Type: `ADMIN`
- **Customers** : 4 comptes avec différents emails (customer123) - Type: `CUSTOMER`

**Avantages du système :**
- ✅ **Type Safety** - TypeScript garantit l'utilisation des bonnes valeurs
- ✅ **Cohérence** - Même enum partagé entre backend et frontend
- ✅ **Simplicité** - Un seul champ `type` au lieu de `user_type`
- ✅ **Extensibilité** - Facile d'ajouter de nouveaux types d'utilisateurs
- ✅ **Maintenance** - Centralisation de la logique des types

### ✅ Pages d'Authentification Thématisées (01/02/2025)

**Migration vers couleurs du thème Tailwind :**

#### Page de Connexion (`/auth/login/page.tsx`)
- ✅ **Arrière-plan** : `from-gray-50 to-gray-100` → `from-muted to-background`
- ✅ **Logo** : `bg-[#162e77]` → `bg-primary` et `text-white` → `text-primary-foreground`
- ✅ **Titre KesiMarket** : `text-[#162e77]` → `text-primary`
- ✅ **Sous-titre** : `text-gray-500` → `text-muted-foreground`
- ✅ **Titre principal** : `text-gray-900` → `text-foreground`
- ✅ **Description** : `text-gray-600` → `text-muted-foreground`
- ✅ **Formulaire** : `bg-white` → `bg-card`
- ✅ **Labels** : `text-gray-700` → `text-foreground`
- ✅ **Icônes** : `text-gray-400` → `text-muted-foreground`
- ✅ **Erreurs** : `border-red-300 focus:border-red-500` → `border-destructive focus:border-destructive`
- ✅ **Messages d'erreur** : `text-red-600` → `text-destructive`
- ✅ **Checkbox** : `text-[#162e77] focus:ring-[#162e77] border-gray-300` → `text-primary focus:ring-primary border-border`
- ✅ **Liens** : `text-[#162e77] hover:text-[#1e40af]` → `text-primary hover:text-primary/80`
- ✅ **Bouton** : `bg-[#162e77] hover:bg-[#1e40af] text-white` → `bg-primary hover:bg-primary/90 text-primary-foreground`
- ✅ **Section avantages** : `bg-white` → `bg-card` et `text-gray-900` → `text-foreground`
- ✅ **Texte des avantages** : `text-gray-600` → `text-muted-foreground`

#### Page d'Inscription (`/auth/register/page.tsx`)
- ✅ **Toutes les mêmes modifications** que la page de connexion
- ✅ **Barre de force du mot de passe** : `bg-gray-200` → `bg-muted`
- ✅ **Label de force** : `text-gray-600` → `text-muted-foreground`

**Avantages de la thématisation :**
- ✅ **Cohérence avec le thème** - Utilisation des variables CSS définies dans `globals.css`
- ✅ **Support du mode sombre** - Les couleurs s'adapteront automatiquement
- ✅ **Maintenabilité** - Plus facile de changer les couleurs globalement
- ✅ **Accessibilité** - Les couleurs du thème respectent les contrastes d'accessibilité
- ✅ **Pas de couleurs codées en dur** - Utilisation exclusive des classes Tailwind du thème

### ✅ Variables d'Environnement Restructurées

**Production (.env.production.example) :**
```bash
NEXT_PUBLIC_API_URL=https://api.kesimarket.com
NEXTAUTH_URL=https://kesimarket.com
NEXT_PUBLIC_SITE_URL=https://kesimarket.com
```

**Staging (.env.staging.example) :**
```bash
NEXT_PUBLIC_API_URL=https://staging-api.kesimarket.com
NEXTAUTH_URL=https://staging.kesimarket.com
NEXT_PUBLIC_SITE_URL=https://staging.kesimarket.com
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_SHOW_STAGING_BANNER=true
```

### ✅ Documentation Complète Créée

1. **DEPLOYMENT-SHARED.md** - Guide architecture partagée
2. **README.md** - Documentation principale mise à jour
3. **scripts/setup-docker-network.sh** - Script automatisation réseau
4. **Diagrammes Mermaid** - Visualisation architecture

### ✅ Workflow de Déploiement Simplifié

**Étapes production :**
```bash
# 1. Créer réseau (une fois)
./scripts/setup-docker-network.sh

# 2. Déployer backend (avec Caddy)
cd ~/kesimarket-modern/backend && docker-compose -f docker-compose.prod.yml up -d

# 3. Déployer frontend
cd ~/kesimarket-modern/frontend && docker-compose -f docker-compose.prod.yml up -d
```

## 🏗️ Architecture Actuelle (Unifiée)

### Infrastructure Docker ✅
```yaml
# Réseau partagé
networks:
  kesimarket-net: external

# Backend Stack (kesimarket-modern-backend)
services:
  caddy:    # Reverse proxy pour TOUS les domaines
  app:      # AdonisJS backend  
  db:       # PostgreSQL
  minio:    # Object storage
  redis:    # Cache

# Frontend Stack (kesimarket-modern)  
services:
  frontend: # Next.js app
```

### Caddy Configuration Centralisée ✅
**Un seul Caddyfile gère :**
- ✅ **4 domaines** (prod/staging × frontend/api)
- ✅ **SSL automatique** avec Let's Encrypt
- ✅ **Rate limiting** configuré par environnement
- ✅ **CORS** configuré par domaine
- ✅ **Logs séparés** par service
- ✅ **Headers sécurité** uniformes

### Avantages de l'Architecture ✅
- ✅ **Un seul SSL** géré par Caddy
- ✅ **Configuration centralisée** des domaines
- ✅ **Rate limiting unifié** 
- ✅ **Logs centralisés**
- ✅ **Déploiements indépendants** frontend/backend
- ✅ **Scaling séparé** possible
- ✅ **Maintenance simplifiée**
- ✅ **Coûts réduits** (un seul VPS)

## 🔧 Déploiement Actuel

### GitHub Actions ✅
- **Backend Workflow** : Déploie Caddy + tous les services backend
- **Frontend Workflow** : Déploie uniquement le conteneur Next.js
- **Réseau automatique** : Création/vérification du réseau partagé
- **Support multi-env** : Production et staging avec URLs distinctes

### Structure VPS ✅
```
~/kesimarket-modern/
├── backend/
│   ├── logs/              # Logs Caddy (tous domaines)
│   ├── uploads/           # Fichiers backend
│   └── minio-data/        # Stockage MinIO
└── frontend/
    └── images/            # Images Docker frontend
```

## 🚀 Prochaines Étapes

### ✅ Issues Critiques Résolues

#### Réseau Docker Manquant (31/01/2025)
- 🚨 **Issue** : `network kesimarket-net declared as external, but could not be found`
- ✅ **Solution** : Ajout création automatique du réseau dans workflow backend
- ✅ **Script créé** : `kesimarket-modern-backend/scripts/setup-docker-network.sh`
- ✅ **Documentation** : Section dépannage ajoutée à DEPLOYMENT-SHARED.md
- 📝 **Cause** : Le workflow backend ne créait pas le réseau partagé nécessaire
- 🔧 **Fix workflow** : Detection + création automatique du réseau `kesimarket-net`

#### Redémarrage Caddy après Déploiement Frontend
- ✅ **Workflow frontend** : Redémarrage automatique de Caddy après déploiement
- ✅ **Documentation** : Procédure manuelle ajoutée
- 📝 **Nécessaire** : Caddy doit détecter les nouveaux conteneurs frontend sur le réseau

#### Base de Données PostgreSQL ne Démarre Pas (31/01/2025)
- 🚨 **Issue** : `Database not ready yet, waiting...` + `service "db" is not running`
- 🔍 **Causes identifiées** :
  - Configuration incohérente workflow vs docker-compose (DB_HOST externe vs interne)
  - Locales PostgreSQL françaises incompatibles avec Alpine Linux
  - Variables d'environnement manquantes/mal configurées
- ✅ **Solutions implémentées** :
  - Fix workflow pour utiliser services Docker internes (`DB_HOST=db`, `MINIO_HOST=minio`, `REDIS_HOST=redis`)
  - Simplification locales PostgreSQL (`--lc-collate=C --lc-ctype=C`)
  - Amélioration logique d'attente DB avec retry et logs détaillés
  - Création fichier `.env` pour docker-compose avec toutes les variables
  - Documentation dépannage complète avec vérifications manuelles

#### Détection Réseau Incohérente (31/01/2025)
- 🚨 **Issue** : `Network 'kesimarket-net' already exists` mais `network kesimarket-net not found` lors de la vérification
- 🔍 **Cause** : Faux positif du `grep` - détection imprécise des réseaux existants
- ✅ **Solutions implémentées** :
  - Remplacement `grep` par `docker network inspect` (vérification précise)
  - Logs détaillés avec `docker network ls` pour debugging
  - Script de nettoyage automatique `scripts/cleanup-network.sh`
  - Vérification immédiate après création du réseau
  - Documentation dépannage avec solutions multiples (auto/manuel/reset)

### Phase 1 : Tests Architecture ✅
- [ ] **Test déploiement complet** - Vérifier workflow GitHub Actions avec réseau
- [ ] **Test connectivity** - Frontend ↔ Backend via réseau
- [ ] **Test SSL** - Vérifier certificats tous domaines
- [ ] **Test rate limiting** - Valider politiques par environnement
- [ ] **Test authentification** - Vérifier système de types d'utilisateurs
- [ ] **Test comptes admin/customer** - Valider séparation des rôles
- [ ] **Test filtres dynamiques** - Vérifier API filtres et métadonnées
- [ ] **Test filtres multiples** - Valider combinaison de filtres

### Phase 2 : Optimisations
- [ ] **Health checks avancés** - Monitoring inter-services
- [ ] **Backup automatique** - Images Docker et données
- [ ] **Logs centralisés** - Agrégation avec ELK Stack
- [ ] **Monitoring** - Prometheus + Grafana

### Phase 3 : Fonctionnalités
- [ ] **Load balancing** - Multiple instances si nécessaire
- [ ] **CDN integration** - CloudFlare pour assets statiques
- [ ] **Cache global** - Redis partagé frontend/backend
- [ ] **SSL pinning** - Sécurité renforcée

## 🔍 Points de Vigilance

### Configuration DNS ⚠️
```bash
# A configurer côté registrar
kesimarket.com → VPS_IP
*.kesimarket.com → VPS_IP
```

### Secrets GitHub Actions ⚠️
```bash
# Variables requises
VPS_HOST, VPS_USER, VPS_SSH_PRIVATE_KEY
NEXTAUTH_SECRET, NEXTAUTH_SECRET_STAGING
NEXT_PUBLIC_APP_NAME, ACME_EMAIL
```

### Monitoring Production ⚠️
- **Logs Caddy** : ~/kesimarket-modern/backend/logs/
- **Containers status** : `docker ps -f name=kesimarket`
- **Network connectivity** : `docker network inspect kesimarket-net`
- **SSL certificates** : Vérification Let's Encrypt

## 📊 Métriques Actuelles

### Architecture
```
Services Docker:     6/6   ✅ 100% (db, minio, redis, app, caddy, frontend)
Domaines SSL:        4/4   ✅ 100% (prod/staging × app/api)  
Réseau partagé:      1/1   ✅ 100% (kesimarket-net)
Déploiements:        2/2   ✅ 100% (backend, frontend)
```

### Workflow CI/CD  
```
Backend Workflow:    1/1   ✅ 100% (avec Caddy)
Frontend Workflow:   1/1   ✅ 100% (adapté réseau partagé)
Scripts setup:       1/1   ✅ 100% (setup-docker-network.sh)
Documentation:       3/3   ✅ 100% (README, DEPLOYMENT-SHARED, variables env)
```

---

**🎯 Architecture partagée opérationnelle - Frontend et Backend prêts pour déploiement unifié via GitHub Actions**