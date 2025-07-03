# 🔐 Configuration GitHub Secrets - Rexel Modern Frontend

Ce guide explique comment configurer les secrets GitHub nécessaires pour le déploiement automatique du frontend avec **GitHub CLI** (automatique) ou manuellement.

## 🚀 Méthode Recommandée : Configuration Automatique

### 📋 Prérequis

1. **GitHub CLI** installé et configuré :
```bash
# Installation sur macOS
brew install gh

# Installation sur Ubuntu/Debian
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Authentification
gh auth login
```

2. **Être dans le repository Git** du projet

### 🔄 Configuration Automatique

Le script lit automatiquement les variables depuis `env.production.example` et les configure dans GitHub :

```bash
# Configuration complète (production + staging + repository)
./scripts/setup-github-secrets.sh

# Options spécifiques
./scripts/setup-github-secrets.sh production  # Production uniquement
./scripts/setup-github-secrets.sh staging     # Staging uniquement  
./scripts/setup-github-secrets.sh repository  # Secrets communs uniquement
```

### 🔧 Étapes Automatiques

1. **Vérification des prérequis** - GitHub CLI et authentification
2. **Lecture du fichier** `env.production.example` 
3. **Création/vérification des environnements** GitHub (production, staging)
4. **Génération automatique** des secrets sécurisés (NEXTAUTH_SECRET, etc.)
5. **Adaptation pour chaque environnement** (URLs staging/production)
6. **Création des secrets** dans GitHub via API

### 📊 Variables Configurées Automatiquement

#### 🌐 Variables VPS (Repository level)
```bash
VPS_HOST                    # IP ou domaine du serveur
VPS_USER                    # Utilisateur SSH (ubuntu)
VPS_SSH_PRIVATE_KEY         # Clé privée SSH complète
```

#### 🏠 Variables de Domaines (Environment specific)
```bash
FRONTEND_DOMAIN             # app.votredomaine.com → staging.votredomaine.com
NEXTAUTH_URL                # URLs d'authentification
NEXT_PUBLIC_API_URL         # URLs de l'API backend
NEXT_PUBLIC_SITE_URL        # URLs du site
```

#### 🔒 Variables de Sécurité (Auto-générées)
```bash
NEXTAUTH_SECRET             # Généré automatiquement (32 chars)
ACME_EMAIL                  # Email pour certificats SSL
```

#### 📱 Variables d'Application
```bash
NEXT_PUBLIC_APP_NAME        # "Rexel Modern" → "Rexel Modern Staging"
NEXT_PUBLIC_APP_VERSION     # Version de l'application
NEXT_PUBLIC_API_VERSION     # Version de l'API
NEXT_PUBLIC_DEFAULT_LOCALE  # Langue par défaut
```

#### 🎛️ Variables Optionnelles
```bash
# Analytics & Monitoring
NEXT_PUBLIC_ANALYTICS_ID
NEXT_PUBLIC_GTM_ID
NEXT_PUBLIC_SENTRY_DSN

# Feature Flags
NEXT_PUBLIC_ENABLE_FEATURES
NEXT_PUBLIC_ENABLE_PWA
NEXT_PUBLIC_ENABLE_DARK_MODE

# Authentication
GITHUB_CLIENT_ID
GOOGLE_CLIENT_ID

# Payment
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# Email, CDN, Cache...
```

## ⚙️ Configuration Manuelle (Alternative)

Si vous préférez configurer manuellement ou si GitHub CLI n'est pas disponible :

### 1. Aller dans GitHub

1. **Repository** > **Settings**
2. **Secrets and variables** > **Actions**
3. **New repository secret**

### 2. Secrets Obligatoires (Repository level)

| Secret | Description | Exemple |
|--------|-------------|---------|
| `VPS_HOST` | IP ou domaine du serveur | `203.0.113.1` |
| `VPS_USER` | Utilisateur SSH | `ubuntu` |
| `VPS_SSH_PRIVATE_KEY` | Clé privée SSH | `-----BEGIN OPENSSH PRIVATE KEY-----` |

### 3. Secrets d'Environment (production/staging)

Créer les environments **production** et **staging** :
1. **Settings** > **Environments** > **New environment**
2. Nommer : `production` ou `staging`
3. Configurer les protection rules si nécessaire

| Secret | Production | Staging |
|--------|------------|---------|
| `FRONTEND_DOMAIN` | `app.votredomaine.com` | `staging.votredomaine.com` |
| `NEXTAUTH_URL` | `https://app.votredomaine.com` | `https://staging.votredomaine.com` |
| `NEXT_PUBLIC_API_URL` | `https://api.votredomaine.com` | `https://staging-api.votredomaine.com` |
| `NEXTAUTH_SECRET` | `$(openssl rand -base64 32)` | `$(openssl rand -base64 32)` |
| `ACME_EMAIL` | `admin@votredomaine.com` | `admin@votredomaine.com` |

## 🔑 Configuration SSH

### Générer une Clé SSH Dédiée

```bash
# Générer clé SSH pour GitHub Actions
ssh-keygen -t ed25519 -C "github-actions-frontend" -f ~/.ssh/github_actions_rexel_frontend

# Copier la clé publique sur le serveur
ssh-copy-id -i ~/.ssh/github_actions_rexel_frontend.pub ubuntu@votre-serveur

# Récupérer la clé privée pour GitHub Secret
cat ~/.ssh/github_actions_rexel_frontend
```

### Configuration Serveur

```bash
# Sur le serveur, vérifier que la clé est ajoutée
cat ~/.ssh/authorized_keys

# Tester la connexion depuis votre machine
ssh -i ~/.ssh/github_actions_rexel_frontend ubuntu@votre-serveur
```

## 🔍 Validation et Tests

### Vérifier les Secrets GitHub

```bash
# Lister les secrets repository
gh secret list

# Lister les secrets d'environment
gh secret list --env production
gh secret list --env staging
```

### Tester le Déploiement

```bash
# Premier test : Push sur main
git add .
git commit -m "test: trigger deployment"
git push origin main

# Surveiller dans GitHub > Actions
```

### Debugging

```bash
# Voir les logs du workflow
gh run list
gh run view <run-id>

# Tester SSH manuellement
ssh -i ~/.ssh/github_actions_rexel_frontend ubuntu@votre-serveur
```

## 📋 Customisation du Script

### Modifier les Variables

Éditez `env.production.example` pour ajouter/modifier les variables :

```bash
# Ajouter une nouvelle variable
NEXT_PUBLIC_CUSTOM_FEATURE=true

# Le script la détectera automatiquement
```

### Adapter pour Votre Infrastructure

```bash
# Modifier le script pour vos besoins spécifiques
# scripts/setup-github-secrets.sh

# Ajouter de nouveaux cas dans la fonction setup_secrets()
case $key in
    "VOTRE_NOUVELLE_VARIABLE")
        create_secret "$env_name" "$key" "$value"
        ;;
esac
```

## 🚨 Dépannage

### GitHub CLI non connecté

```bash
# Réauthentification
gh auth logout
gh auth login

# Vérifier les permissions
gh auth status
```

### Environnements non trouvés

```bash
# Créer manuellement sur GitHub
# Settings > Environments > New environment

# Ou ignorer et utiliser repository level uniquement
./scripts/setup-github-secrets.sh repository
```

### Variables non détectées

```bash
# Vérifier le format dans env.production.example
# Format requis : KEY=value (sans espaces autour du =)

# Débugger le script
bash -x ./scripts/setup-github-secrets.sh
```

### Permissions insuffisantes

```bash
# Vérifier les permissions du repository
gh api repos/:owner/:repo --jq .permissions

# Le script nécessite des droits admin sur le repo
```

## 🔒 Sécurité

### Best Practices

- ✅ **Clés SSH dédiées** pour chaque projet
- ✅ **Rotation régulière** des secrets
- ✅ **Principe du moindre privilège** pour les accès
- ✅ **Sauvegarde sécurisée** des clés générées
- ✅ **Monitoring** des accès aux secrets

### Audit des Secrets

```bash
# Vérifier l'utilisation des secrets
gh api repos/:owner/:repo/actions/secrets

# Logs d'audit des actions
gh api repos/:owner/:repo/actions/runs
```

## 📚 Ressources

### Documentation Officielle

- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub CLI](https://cli.github.com/manual/)
- [GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments)

### Scripts et Outils

- **Script principal** : `scripts/setup-github-secrets.sh`
- **Configuration** : `env.production.example`
- **Makefile** : `make github-setup`

---

## ✅ Checklist de Configuration

### Configuration Automatique

- [ ] GitHub CLI installé et configuré
- [ ] Repository cloné et dans le bon dossier
- [ ] Variables adaptées dans `env.production.example`
- [ ] Script exécuté : `./scripts/setup-github-secrets.sh`
- [ ] Secrets vérifiés sur GitHub
- [ ] Clé SSH installée sur le serveur

### Configuration Manuelle

- [ ] Environments créés (production, staging)
- [ ] Secrets repository configurés (VPS_*)
- [ ] Secrets environment configurés (domaines, etc.)
- [ ] Clé SSH générée et installée
- [ ] Tests de connexion SSH réussis

### Validation

- [ ] `gh secret list` affiche tous les secrets
- [ ] Workflow de test déclenché et réussi
- [ ] Connexion SSH depuis GitHub Actions OK
- [ ] Déploiement automatique fonctionnel

---

**🎉 Votre configuration GitHub Actions est maintenant complète et automatisée !** 