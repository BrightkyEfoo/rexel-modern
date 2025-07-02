# 🚀 Guide de Déploiement - Rexel Modern Frontend

Ce guide explique comment déployer l'application frontend Rexel Modern en production avec **GitHub Actions** (méthode recommandée) ou manuellement.

## 📋 Table des Matières

- [🎯 Méthode Recommandée : GitHub Actions](#-méthode-recommandée--github-actions)
- [🔧 Déploiement Manuel](#-déploiement-manuel)
- [⚙️ Configuration](#️-configuration)
- [🔍 Monitoring](#-monitoring)
- [🆘 Dépannage](#-dépannage)

---

## 🎯 Méthode Recommandée : GitHub Actions

### 🔄 Déploiement Automatique

Le déploiement se fait automatiquement via **GitHub Actions** à chaque push sur la branche `main`.

#### 🚀 Workflow de Déploiement

```mermaid
graph TD
    A[Push sur main] --> B[GitHub Actions]
    B --> C[Build Docker Image]
    C --> D[Transfer to VPS]
    D --> E[Deploy with Docker Compose]
    E --> F[Health Check]
    F --> G[✅ Déploiement terminé]
```

### 📋 Prérequis GitHub Actions

#### 1. Configuration des Secrets GitHub

Exécutez le script d'aide :

```bash
./scripts/setup-github-secrets.sh
```

#### 2. Secrets Minimaux Obligatoires

| Secret | Description | Exemple |
|--------|-------------|---------|
| `VPS_HOST` | IP ou domaine du serveur | `203.0.113.1` |
| `VPS_USER` | Utilisateur SSH | `ubuntu` |
| `VPS_SSH_PRIVATE_KEY` | Clé privée SSH | `-----BEGIN OPENSSH PRIVATE KEY-----` |
| `FRONTEND_DOMAIN` | Domaine du frontend | `app.votredomaine.com` |
| `NEXT_PUBLIC_API_URL` | URL API backend | `https://api.votredomaine.com` |
| `NEXTAUTH_URL` | URL authentification | `https://app.votredomaine.com` |
| `NEXTAUTH_SECRET` | Secret NextAuth | `openssl rand -base64 32` |
| `ACME_EMAIL` | Email pour SSL | `admin@votredomaine.com` |

> 📚 **Guide complet** : Voir [GITHUB-SETUP.md](./GITHUB-SETUP.md) pour la liste complète des secrets.

#### 3. Configuration SSH

```bash
# Générer une clé SSH pour GitHub Actions
ssh-keygen -t ed25519 -C "github-actions-frontend"

# Copier la clé publique sur le serveur
ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@votre-serveur

# Récupérer la clé privée pour GitHub Secrets
cat ~/.ssh/id_ed25519
```

### 🔄 Utilisation des Workflows

#### Déploiement Automatique

```bash
# Déclenche automatiquement le déploiement
git push origin main
```

#### Déploiement Manuel

1. Aller dans **Actions** sur GitHub
2. Sélectionner **Deploy Frontend to Production**
3. Cliquer **Run workflow**
4. Choisir les options :
   - Environment : `production`
   - Rebuild cache : `false` (sauf si problème)

#### Tests et Builds

```bash
# Déclenche automatiquement sur les PR
git checkout -b feature/nouvelle-fonctionnalité
git push origin feature/nouvelle-fonctionnalité
# → Ouvrir une Pull Request
```

---

## 🔧 Déploiement Manuel

### 📋 Prérequis

#### Infrastructure Serveur

- **OS** : Ubuntu 20.04+ ou Debian 11+
- **RAM** : 2GB minimum, 4GB recommandés
- **CPU** : 2 vCPU minimum
- **Stockage** : 20GB minimum, SSD recommandé
- **Docker** : Version 20.10+
- **Docker Compose** : Version 2.0+

#### Domaines et DNS

```bash
# Configuration DNS requise
app.votredomaine.com    A    203.0.113.1
www.votredomaine.com    A    203.0.113.1
```

### ⚙️ Configuration

#### 1. Préparer l'Environnement

```bash
# Sur le serveur
mkdir -p ~/rexel-modern/frontend
cd ~/rexel-modern/frontend

# Cloner le repository
git clone https://github.com/votre-username/rexel-modern.git .
```

#### 2. Configuration des Variables

```bash
# Copier le template
cp env.production.example .env.production

# Éditer les variables
nano .env.production
```

**Variables obligatoires** :

```bash
# Général
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Domaines
FRONTEND_DOMAIN=app.votredomaine.com
NEXT_PUBLIC_API_URL=https://api.votredomaine.com
NEXTAUTH_URL=https://app.votredomaine.com

# Sécurité
NEXTAUTH_SECRET=votre-secret-genere
ACME_EMAIL=admin@votredomaine.com

# Application
NEXT_PUBLIC_APP_NAME="Rexel Modern"
NEXT_PUBLIC_SITE_URL=https://app.votredomaine.com
```

#### 3. Génération des Secrets

```bash
# Générer un secret NextAuth
openssl rand -base64 32

# Générer une clé SSH (si nécessaire)
ssh-keygen -t ed25519 -C "rexel-frontend-deploy"
```

### 🚀 Déploiement

#### Méthode 1 : Script de Déploiement

```bash
# Donner les permissions
chmod +x docker-prod.sh

# Déployer
./docker-prod.sh deploy

# Vérifier le statut
./docker-prod.sh status

# Voir les logs
./docker-prod.sh logs
```

#### Méthode 2 : Makefile

```bash
# Déploiement complet
make deploy

# Commandes individuelles
make build          # Build l'image Docker
make start           # Démarrer les services
make stop            # Arrêter les services
make logs            # Voir les logs
make status          # Vérifier le statut
make backup          # Créer une sauvegarde
```

#### Méthode 3 : Docker Compose Direct

```bash
# Build et démarrage
docker compose -f docker-compose.prod.yml up -d --build

# Vérification
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs
```

---

## 🔍 Monitoring

### 📊 Vérifications de Santé

#### Health Check Automatique

```bash
# Test du endpoint de santé
curl https://app.votredomaine.com/api/health

# Réponse attendue
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

#### Monitoring des Conteneurs

```bash
# Statut des conteneurs
docker ps -f name=rexel-frontend

# Utilisation des ressources
docker stats rexel-frontend-prod

# Logs en temps réel
docker logs -f rexel-frontend-prod
```

### 📈 Métriques

#### Performance

```bash
# Test de charge basique
curl -o /dev/null -s -w "%{time_total}\n" https://app.votredomaine.com

# Test de compression
curl -H "Accept-Encoding: gzip" -I https://app.votredomaine.com
```

#### SSL/TLS

```bash
# Vérifier le certificat SSL
openssl s_client -connect app.votredomaine.com:443 -servername app.votredomaine.com

# Test SSL Labs (web)
# https://www.ssllabs.com/ssltest/analyze.html?d=app.votredomaine.com
```

---

## 🆘 Dépannage

### ❌ Problèmes Courants

#### 1. Erreur de Build Docker

```bash
# Logs détaillés du build
docker build --no-cache -t rexel-frontend-debug .

# Vérifier les dépendances
npm audit
npm ci
```

#### 2. Problèmes de Connexion API

```bash
# Tester la connectivité API
curl -I https://api.votredomaine.com/health

# Vérifier les variables d'environnement
docker exec rexel-frontend-prod env | grep NEXT_PUBLIC_API_URL
```

#### 3. Erreurs SSL/HTTPS

```bash
# Vérifier Caddy
docker logs rexel-frontend-caddy-prod

# Renouveler le certificat
docker exec rexel-frontend-caddy-prod caddy reload --config /etc/caddy/Caddyfile
```

#### 4. Problèmes de Performance

```bash
# Vérifier l'utilisation mémoire
docker stats --no-stream rexel-frontend-prod

# Redémarrer en cas de fuite mémoire
docker restart rexel-frontend-prod
```

### 🔄 Commandes de Récupération

#### Rollback Rapide

```bash
# Via GitHub Actions
# 1. Aller dans Actions > Deploy Frontend to Production
# 2. Sélectionner un déploiement précédent
# 3. Re-run jobs

# Ou manuellement
./docker-prod.sh rollback
```

#### Nettoyage d'Urgence

```bash
# Arrêter tous les services
docker compose -f docker-compose.prod.yml down

# Nettoyer les images
docker system prune -af

# Redéployer
./docker-prod.sh deploy
```

#### Logs de Debug

```bash
# Logs détaillés
docker compose -f docker-compose.prod.yml logs --tail=100 -f

# Logs par service
docker logs rexel-frontend-prod --tail=50
docker logs rexel-frontend-caddy-prod --tail=50
```

---

## 📚 Ressources Additionnelles

### 🔗 Documentation

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Caddy Documentation](https://caddyserver.com/docs/)
- [GitHub Actions](https://docs.github.com/en/actions)

### 🛠️ Outils Utiles

- [Docker Compose](https://docs.docker.com/compose/)
- [SSL Labs Test](https://www.ssllabs.com/ssltest/)
- [GTmetrix](https://gtmetrix.com/) - Test de performance
- [Uptime Robot](https://uptimerobot.com/) - Monitoring

### 📞 Support

- **Issues GitHub** : [Créer un issue](https://github.com/votre-repo/issues)
- **Documentation** : [Wiki du projet](https://github.com/votre-repo/wiki)
- **Email** : admin@votredomaine.com

---

## ✅ Checklist de Déploiement

### Avant le Déploiement

- [ ] DNS configuré et propagé
- [ ] Secrets GitHub configurés
- [ ] Clé SSH installée sur le serveur
- [ ] Variables d'environnement vérifiées
- [ ] API backend accessible
- [ ] Tests locaux passés

### Après le Déploiement

- [ ] Site accessible via HTTPS
- [ ] Health check répond
- [ ] API connectivity fonctionne
- [ ] Logs sans erreurs
- [ ] Performance acceptable
- [ ] SSL/TLS valide
- [ ] Monitoring configuré

---

**🎉 Félicitations ! Votre frontend Rexel Modern est maintenant déployé en production avec GitHub Actions !** 