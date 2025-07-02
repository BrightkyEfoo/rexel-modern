#!/bin/bash

# Rexel Modern Frontend - GitHub Secrets Setup
# This script helps generate and display secrets for GitHub Actions

set -e

echo "🚀 Rexel Modern Frontend - GitHub Secrets Setup"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to generate random string
generate_secret() {
    openssl rand -base64 32
}

# Function to print colored output
print_colored() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

print_colored $BLUE "Génération des secrets pour GitHub Actions..."
echo ""

# Generate secrets
NEXTAUTH_SECRET=$(generate_secret)

print_colored $GREEN "✅ Secrets générés avec succès !"
echo ""

print_colored $YELLOW "📋 SECRETS À CONFIGURER DANS GITHUB"
print_colored $YELLOW "===================================="
echo ""

print_colored $BLUE "🌐 Configuration VPS (OBLIGATOIRE)"
echo "VPS_HOST=votre-ip-ou-domaine-serveur"
echo "VPS_USER=ubuntu"
echo "VPS_SSH_PRIVATE_KEY=votre-cle-privee-ssh-complete"
echo ""

print_colored $BLUE "🏠 Domaines et URLs (OBLIGATOIRE)"
echo "FRONTEND_DOMAIN=app.votredomaine.com"
echo "NEXT_PUBLIC_API_URL=https://api.votredomaine.com"
echo "NEXTAUTH_URL=https://app.votredomaine.com"
echo "NEXT_PUBLIC_SITE_URL=https://app.votredomaine.com"
echo ""

print_colored $BLUE "🔒 Sécurité (OBLIGATOIRE)"
echo "NEXTAUTH_SECRET=${NEXTAUTH_SECRET}"
echo "ACME_EMAIL=admin@votredomaine.com"
echo ""

print_colored $BLUE "📱 Application (OBLIGATOIRE)"
echo "NEXT_PUBLIC_APP_NAME=Rexel Modern"
echo "NEXT_PUBLIC_APP_VERSION=1.0.0"
echo "NEXT_PUBLIC_API_VERSION=v1"
echo "NEXT_PUBLIC_DEFAULT_LOCALE=fr"
echo ""

print_colored $BLUE "📄 SEO & Metadata (OBLIGATOIRE)"
echo "NEXT_PUBLIC_SITE_NAME=Rexel Modern"
echo "NEXT_PUBLIC_SITE_DESCRIPTION=Plateforme e-commerce moderne pour matériel électrique"
echo ""

print_colored $YELLOW "📊 Analytics & Monitoring (OPTIONNEL)"
echo "NEXT_PUBLIC_ANALYTICS_ID=votre-google-analytics-id"
echo "NEXT_PUBLIC_GTM_ID=votre-google-tag-manager-id"
echo "NEXT_PUBLIC_SENTRY_DSN=votre-sentry-dsn"
echo ""

print_colored $YELLOW "🎛️ Feature Flags (OPTIONNEL)"
echo "NEXT_PUBLIC_ENABLE_FEATURES=auth,cart,favorites,search"
echo "NEXT_PUBLIC_ENABLE_PWA=true"
echo "NEXT_PUBLIC_ENABLE_OFFLINE=true"
echo "NEXT_PUBLIC_ENABLE_DARK_MODE=true"
echo ""

print_colored $YELLOW "🔑 Authentication (OPTIONNEL)"
echo "GITHUB_CLIENT_ID=votre-github-client-id"
echo "GITHUB_CLIENT_SECRET=votre-github-client-secret"
echo "GOOGLE_CLIENT_ID=votre-google-client-id"
echo "GOOGLE_CLIENT_SECRET=votre-google-client-secret"
echo ""

print_colored $YELLOW "💳 Payment (OPTIONNEL)"
echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=votre-stripe-publishable-key"
echo "STRIPE_SECRET_KEY=votre-stripe-secret-key"
echo ""

print_colored $YELLOW "📧 Email (OPTIONNEL)"
echo "SMTP_HOST=votre-smtp-host"
echo "SMTP_PORT=587"
echo "SMTP_USER=votre-smtp-user"
echo "SMTP_PASSWORD=votre-smtp-password"
echo "SMTP_FROM=noreply@votredomaine.com"
echo ""

print_colored $YELLOW "🌐 CDN & Assets (OPTIONNEL)"
echo "NEXT_PUBLIC_CDN_URL=https://cdn.votredomaine.com"
echo "NEXT_PUBLIC_ASSETS_URL=https://assets.votredomaine.com"
echo ""

print_colored $YELLOW "🗃️ Cache (OPTIONNEL)"
echo "REDIS_URL=redis://votre-redis-url:6379"
echo ""

print_colored $GREEN "📝 INSTRUCTIONS DE CONFIGURATION"
print_colored $GREEN "=================================="
echo ""
print_colored $BLUE "1. Aller dans votre repository GitHub"
print_colored $BLUE "2. Cliquer sur 'Settings'"
print_colored $BLUE "3. Dans la sidebar : 'Secrets and variables' > 'Actions'"
print_colored $BLUE "4. Cliquer sur 'New repository secret'"
print_colored $BLUE "5. Ajouter chaque secret ci-dessus"
echo ""

print_colored $GREEN "🔑 GÉNÉRATION DE LA CLÉ SSH"
print_colored $GREEN "============================"
echo ""
print_colored $BLUE "Pour générer une nouvelle clé SSH :"
echo "ssh-keygen -t ed25519 -C 'github-actions-frontend'"
echo ""
print_colored $BLUE "Pour copier la clé sur le serveur :"
echo "ssh-copy-id -i ~/.ssh/id_ed25519.pub user@votre-serveur"
echo ""
print_colored $BLUE "Pour récupérer la clé privée (à mettre dans VPS_SSH_PRIVATE_KEY) :"
echo "cat ~/.ssh/id_ed25519"
echo ""

print_colored $GREEN "✅ VÉRIFICATION DU DÉPLOIEMENT"
print_colored $GREEN "==============================="
echo ""
print_colored $BLUE "Une fois les secrets configurés :"
print_colored $BLUE "• Push sur main → Déploiement automatique"
print_colored $BLUE "• Pull Request → Tests et builds"
print_colored $BLUE "• Workflow manuel → Depuis l'onglet Actions"
echo ""

print_colored $GREEN "🔗 LIENS UTILES"
print_colored $GREEN "================"
echo ""
echo "📚 Documentation GitHub Secrets :"
echo "   https://docs.github.com/en/actions/security-guides/encrypted-secrets"
echo ""
echo "🔑 Documentation SSH :"
echo "   https://docs.github.com/en/authentication/connecting-to-github-with-ssh"
echo ""
echo "⚡ Documentation Next.js Environment Variables :"
echo "   https://nextjs.org/docs/basic-features/environment-variables"
echo ""

print_colored $YELLOW "⚠️  SÉCURITÉ"
print_colored $YELLOW "============="
echo ""
print_colored $RED "• Ne jamais committer de secrets dans le code"
print_colored $RED "• Utiliser uniquement les GitHub Secrets"
print_colored $RED "• Garder les clés SSH privées en sécurité"
print_colored $RED "• Régénérer les secrets si compromis"
echo ""

print_colored $GREEN "🎉 Configuration terminée ! Bonne chance pour le déploiement !"
