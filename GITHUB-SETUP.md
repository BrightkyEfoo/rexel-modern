# 🔐 Configuration GitHub Secrets - Rexel Modern Frontend

Ce guide explique comment configurer les secrets GitHub nécessaires pour le déploiement automatique du frontend.

## 📋 Secrets Requis

### 🌐 Configuration VPS

| Secret | Description | Exemple |
|--------|-------------|---------|
| `VPS_HOST` | Adresse IP ou domaine du serveur | `203.0.113.1` |
| `VPS_USER` | Utilisateur SSH | `root` ou `ubuntu` |
| `VPS_SSH_PRIVATE_KEY` | Clé privée SSH (format OpenSSH) | `-----BEGIN OPENSSH PRIVATE KEY-----` |

### 🏠 Domaines et URLs

| Secret | Description | Exemple |
|--------|-------------|---------|
| `FRONTEND_DOMAIN` | Domaine du frontend | `app.votredomaine.com` |
| `NEXT_PUBLIC_API_URL` | URL de l'API backend | `https://api.votredomaine.com` |
| `NEXTAUTH_URL` | URL d'authentification | `https://app.votredomaine.com` |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site | `https://app.votredomaine.com` |

### 🔒 Sécurité

| Secret | Description | Génération |
|--------|-------------|------------|
| `NEXTAUTH_SECRET` | Secret NextAuth | `openssl rand -base64 32` |
| `ACME_EMAIL` | Email pour certificats SSL | `admin@votredomaine.com` |

### 📱 Application

| Secret | Description | Exemple |
|--------|-------------|---------|
| `NEXT_PUBLIC_APP_NAME` | Nom de l'application | `"Rexel Modern"` |
| `NEXT_PUBLIC_APP_VERSION` | Version de l'app | `"1.0.0"` |
| `NEXT_PUBLIC_API_VERSION` | Version API | `"v1"` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Locale par défaut | `"fr"` |

### 📊 Analytics & Monitoring (Optionnel)

| Secret | Description |
|--------|-------------|
| `NEXT_PUBLIC_ANALYTICS_ID` | ID Google Analytics |
| `NEXT_PUBLIC_GTM_ID` | ID Google Tag Manager |
| `NEXT_PUBLIC_SENTRY_DSN` | DSN Sentry pour monitoring |

### 🎛️ Features Flags

| Secret | Description | Exemple |
|--------|-------------|---------|
| `NEXT_PUBLIC_ENABLE_FEATURES` | Features activées | `"auth,cart,favorites,search"` |
| `NEXT_PUBLIC_ENABLE_PWA` | Activer PWA | `"true"` |
| `NEXT_PUBLIC_ENABLE_OFFLINE` | Mode hors ligne | `"true"` |
| `NEXT_PUBLIC_ENABLE_DARK_MODE` | Mode sombre | `"true"` |

### 🌐 CDN & Assets (Optionnel)

| Secret | Description |
|--------|-------------|
| `NEXT_PUBLIC_CDN_URL` | URL du CDN |
| `NEXT_PUBLIC_ASSETS_URL` | URL des assets |

### 🔑 Authentication (Optionnel)

| Secret | Description |
|--------|-------------|
| `GITHUB_CLIENT_ID` | Client ID GitHub OAuth |
| `GITHUB_CLIENT_SECRET` | Client Secret GitHub OAuth |
| `GOOGLE_CLIENT_ID` | Client ID Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Client Secret Google OAuth |

### 💳 Payment (Optionnel)

| Secret | Description |
|--------|-------------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe |

### 📧 Email (Optionnel)

| Secret | Description |
|--------|-------------|
| `SMTP_HOST` | Serveur SMTP |
| `SMTP_PORT` | Port SMTP |
| `SMTP_USER` | Utilisateur SMTP |
| `SMTP_PASSWORD` | Mot de passe SMTP |
| `SMTP_FROM` | Email expéditeur |

### 🗃️ Cache (Optionnel)

| Secret | Description |
|--------|-------------|
| `REDIS_URL` | URL Redis pour cache |

### 📄 SEO & Metadata

| Secret | Description | Exemple |
|--------|-------------|---------|
| `NEXT_PUBLIC_SITE_NAME` | Nom du site | `"Rexel Modern"` |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | Description | `"Plateforme e-commerce moderne"` |

## 🔧 Configuration dans GitHub

### 1. Accéder aux Secrets

1. Allez dans votre repository GitHub
2. Cliquez sur **Settings**
3. Dans la sidebar, cliquez sur **Secrets and variables** > **Actions**
4. Cliquez sur **New repository secret**

### 2. Ajouter les Secrets

Pour chaque secret de la liste :

1. Cliquez sur **New repository secret**
2. Saisissez le **Name** (ex: `VPS_HOST`)
3. Saisissez la **Secret** (la valeur)
4. Cliquez sur **Add secret**

### 3. Configuration VPS SSH

```bash
# Sur votre machine locale
ssh-keygen -t ed25519 -C "github-actions-frontend"

# Copier la clé publique sur le serveur
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@votre-serveur

# Tester la connexion
ssh -i ~/.ssh/id_ed25519 user@votre-serveur

# Copier la clé privée dans le secret VPS_SSH_PRIVATE_KEY
cat ~/.ssh/id_ed25519
```

## 🎯 Secrets Minimaux pour Commencer

Pour un déploiement basique, configurez au minimum :

```bash
# VPS (OBLIGATOIRE)
VPS_HOST=votre-ip-serveur
VPS_USER=ubuntu
VPS_SSH_PRIVATE_KEY=votre-cle-privee-ssh

# Domaines (OBLIGATOIRE)
FRONTEND_DOMAIN=app.votredomaine.com
NEXT_PUBLIC_API_URL=https://api.votredomaine.com
NEXTAUTH_URL=https://app.votredomaine.com

# Sécurité (OBLIGATOIRE)
NEXTAUTH_SECRET=$(openssl rand -base64 32)
ACME_EMAIL=admin@votredomaine.com

# Application (OBLIGATOIRE)
NEXT_PUBLIC_APP_NAME="Rexel Modern"
NEXT_PUBLIC_SITE_URL=https://app.votredomaine.com
```

## 🚀 Script de Génération des Secrets

```bash
#!/bin/bash
# generate-secrets.sh

echo "=== Génération des secrets pour GitHub ===="
echo ""

echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)"
echo ""

echo "# Copier ces valeurs dans GitHub Secrets:"
echo "# Repository > Settings > Secrets and variables > Actions"
echo ""

echo "Secrets générés avec succès !"
```

## ✅ Vérification

Une fois les secrets configurés :

1. **Push sur main** → Déclenche le déploiement automatique
2. **Pull Request** → Lance les tests et builds
3. **Workflow manual** → Depuis l'onglet Actions

### Commandes de Test

```bash
# Vérifier les secrets depuis le workflow
echo "Testing secrets availability..."
echo "VPS_HOST: ${VPS_HOST:0:10}..."
echo "FRONTEND_DOMAIN: ${FRONTEND_DOMAIN}"
echo "NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:0:10}..."
```

## 🔄 Mise à Jour des Secrets

Pour modifier un secret :

1. Allez dans **Settings** > **Secrets and variables** > **Actions**
2. Cliquez sur le secret à modifier
3. Cliquez sur **Update**
4. Saisissez la nouvelle valeur
5. Cliquez sur **Update secret**

## 🆘 Dépannage

### Erreur "Secret not found"

- Vérifiez que le nom du secret correspond exactement
- Les noms sont sensibles à la casse

### Erreur de connexion SSH

```bash
# Tester la clé SSH
ssh -i ~/.ssh/your-key user@server-ip
```

### Variables d'environnement manquantes

- Vérifiez que tous les secrets obligatoires sont configurés
- Regardez les logs du workflow pour identifier les variables manquantes

## 📚 Ressources

- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [SSH Key Management](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables) 