# 🚀 GitHub Actions - Guide de Démarrage Rapide

Configuration de déploiement automatique pour Rexel Modern Frontend via GitHub Actions.

## 🎯 Aperçu Rapide

GitHub Actions permet le déploiement automatique à chaque push sur `main`, avec des tests automatisés sur les Pull Requests.

### 🔄 Workflow Automatique

```mermaid
graph LR
    A[Push sur main] --> B[GitHub Actions]
    B --> C[Tests & Build]
    C --> D[Deploy sur VPS]
    D --> E[Health Check]
    E --> F[✅ Déploiement réussi]
    
    G[Pull Request] --> H[Tests & Build]
    H --> I[✅ Validation]
```

## 🚀 Configuration en 5 Minutes

### 1. Setup Initial

```bash
# Cloner et configurer
git clone https://github.com/votre-username/rexel-modern.git
cd rexel-modern

# Générer les secrets
./scripts/setup-github-secrets.sh
```

### 2. Configurer GitHub Secrets

Aller dans **GitHub Repository > Settings > Secrets and variables > Actions**

**Secrets obligatoires :**

```bash
# VPS Configuration
VPS_HOST=203.0.113.1
VPS_USER=ubuntu  
VPS_SSH_PRIVATE_KEY=-----BEGIN OPENSSH PRIVATE KEY-----...

# Domaines
FRONTEND_DOMAIN=app.votredomaine.com
NEXT_PUBLIC_API_URL=https://api.votredomaine.com
NEXTAUTH_URL=https://app.votredomaine.com

# Sécurité
NEXTAUTH_SECRET=votre-secret-genere
ACME_EMAIL=admin@votredomaine.com

# Application
NEXT_PUBLIC_APP_NAME=Rexel Modern
NEXT_PUBLIC_SITE_URL=https://app.votredomaine.com
```

### 3. Configurer SSH

```bash
# Générer clé SSH
ssh-keygen -t ed25519 -C "github-actions-frontend"

# Installer sur serveur  
ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@votre-serveur

# Copier clé privée pour GitHub Secret VPS_SSH_PRIVATE_KEY
cat ~/.ssh/id_ed25519
```

### 4. Premier Déploiement

```bash
# Push pour déclencher le déploiement
git add .
git commit -m "feat: initial deployment configuration"
git push origin main
```

## 📋 Workflows Disponibles

### 🔄 Déploiement Production (`deploy-production.yml`)

**Déclenché par :**
- Push sur `main` → Déploiement automatique
- Workflow manuel → Depuis l'onglet Actions

**Étapes :**
1. **Prepare Directory** - Création des dossiers VPS
2. **Docker Setup** - Vérification environnement Docker
3. **Checkout** - Récupération du code
4. **Build Docker** - Construction de l'image
5. **Transfer Image** - Transfert vers VPS
6. **Deploy** - Déploiement avec Docker Compose
7. **Health Check** - Vérifications finales
8. **Cleanup** - Nettoyage

### 🧪 Tests & Build (`build-test.yml`)

**Déclenché par :**
- Pull Requests → Tests automatiques
- Push sur `main` → Validation continue

**Étapes :**
1. **Tests** - Linting, TypeScript, tests unitaires
2. **Build** - Construction Next.js
3. **Docker Test** - Test de l'image Docker

## 🎛️ Utilisation

### Déploiement Automatique

```bash
# Développement normal
git checkout -b feature/nouvelle-fonctionnalite
git add .
git commit -m "feat: ajout nouvelle fonctionnalité"
git push origin feature/nouvelle-fonctionnalite

# Créer Pull Request → Tests automatiques

# Merger vers main → Déploiement automatique
git checkout main
git merge feature/nouvelle-fonctionnalite
git push origin main
```

### Déploiement Manuel

1. Aller sur **GitHub Repository**
2. Cliquer **Actions**
3. Sélectionner **Deploy Frontend to Production**
4. Cliquer **Run workflow**
5. Configurer options si nécessaire

### Options de Workflow Manuel

```yaml
Environment: production | staging
Rebuild Cache: true | false
```

## 🔍 Monitoring

### GitHub Actions

- **Logs** : Onglet Actions > Sélectionner workflow
- **Status** : Badge de statut dans README
- **Notifications** : Email automatique en cas d'échec

### Health Checks

```bash
# Vérification automatique dans le workflow
curl https://app.votredomaine.com/api/health

# Réponse attendue
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

## 🛠️ Commands Utiles

### Makefile Integration

```bash
# Setup GitHub Actions
make github-setup

# Vérifier configuration
make github-check  

# Commandes manuelles (si nécessaire)
make deploy        # Déploiement manuel
make status        # État des services
make logs          # Voir les logs
make health        # Health check
```

### Debug Local

```bash
# Tester le build Docker localement
make test-build

# Tester les workflows localement (nécessite act)
make test-github
```

## 🔧 Configuration Avancée

### Variables d'Environnement Optionnelles

```bash
# Analytics & Monitoring
NEXT_PUBLIC_ANALYTICS_ID=GA-XXXX
NEXT_PUBLIC_SENTRY_DSN=https://...

# Features Flags
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_DARK_MODE=true

# Authentication
GITHUB_CLIENT_ID=your-github-client-id
GOOGLE_CLIENT_ID=your-google-client-id

# Payment
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Environments GitHub

1. **Settings > Environments**
2. Créer **production** environment
3. Configurer **protection rules** :
   - Require reviewers
   - Restrict to protected branches
   - Wait timer

## 🚨 Dépannage

### Échec de Déploiement

```bash
# 1. Vérifier les logs GitHub Actions
# GitHub > Actions > Workflow échoué > Cliquer sur l'étape

# 2. Vérifier SSH
ssh -i ~/.ssh/id_ed25519 ubuntu@votre-serveur

# 3. Vérifier secrets GitHub  
# Settings > Secrets and variables > Actions

# 4. Test santé manuel
curl https://app.votredomaine.com/api/health
```

### Problèmes Courants

| Problème | Solution |
|----------|----------|
| **SSH Connection Failed** | Vérifier clé SSH et accès serveur |
| **Docker Build Failed** | Vérifier Dockerfile et dépendances |
| **Health Check Failed** | Vérifier endpoint `/api/health` |
| **DNS Issues** | Vérifier configuration domaine |
| **SSL Certificate** | Vérifier email ACME et domaine |

### Rollback Rapide

```bash
# Via GitHub Actions
# 1. Actions > Deploy Frontend to Production  
# 2. Sélectionner déploiement précédent réussi
# 3. Re-run jobs

# Ou rollback manuel
ssh ubuntu@votre-serveur
cd ~/rexel-modern/frontend
./docker-prod.sh rollback
```

## 📊 Best Practices

### Commits & Branches

```bash
# Convention de nommage
feature/user-authentication
fix/login-redirect-bug
hotfix/crash-on-startup
docs/deployment-guide

# Messages de commit conventionnels
feat(auth): add GitHub OAuth login
fix(api): prevent crash on empty payload
docs(readme): add deployment instructions
```

### Environment Management

- **Development** : Développement local
- **Staging** : Tests d'intégration
- **Production** : Application live

### Security

- ✅ Jamais de secrets dans le code
- ✅ Utiliser GitHub Secrets uniquement
- ✅ Clés SSH dédiées au déploiement
- ✅ Variables `NEXT_PUBLIC_*` pour le client
- ✅ Renouvellement régulier des secrets

## 📚 Ressources

### Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guide complet de déploiement
- **[GITHUB-SETUP.md](./GITHUB-SETUP.md)** - Configuration détaillée des secrets
- **[DOCKER.md](./DOCKER.md)** - Documentation technique Docker

### Liens Utiles

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)
- [Caddy Server](https://caddyserver.com/docs/)

### Support

- **GitHub Issues** : [Créer un issue](https://github.com/votre-repo/issues)
- **Discussions** : [GitHub Discussions](https://github.com/votre-repo/discussions)

---

## ✅ Checklist de Déploiement

### Configuration Initiale

- [ ] Repository cloné et configuré
- [ ] Secrets GitHub configurés
- [ ] Clé SSH installée sur serveur
- [ ] DNS pointant vers serveur
- [ ] Variables d'environnement vérifiées

### Premier Déploiement  

- [ ] Push sur main effectué
- [ ] Workflow GitHub Actions réussi
- [ ] Site accessible via HTTPS
- [ ] Health check opérationnel
- [ ] Logs sans erreurs

### Production Ready

- [ ] Monitoring configuré
- [ ] Sauvegardes planifiées
- [ ] SSL/TLS fonctionnel
- [ ] Performance optimale
- [ ] Équipe formée aux procédures

---

**🎉 Votre frontend Rexel Modern est maintenant configuré pour un déploiement automatique professionnel avec GitHub Actions !** 