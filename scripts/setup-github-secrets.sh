#!/bin/bash

# Script pour créer automatiquement les secrets GitHub à partir du fichier env.production.example
# Usage: ./scripts/setup-github-secrets.sh [production|staging|both]

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENV_FILE_PROD="env.production.example"
ENV_FILE_STAGING="env.staging.example"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}🚀 GitHub Secrets Setup pour Rexel Modern Frontend${NC}"
echo "=================================="

# Vérifier que gh CLI est installé
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) n'est pas installé${NC}"
    echo "Installation: https://cli.github.com/"
    exit 1
fi

# Vérifier que l'utilisateur est connecté
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ Vous n'êtes pas connecté à GitHub CLI${NC}"
    echo "Connectez-vous avec: gh auth login"
    exit 1
fi

# Vérifier que le fichier env.production.example existe
if [[ ! -f "$PROJECT_ROOT/$ENV_FILE_PROD" ]]; then
    echo -e "${RED}❌ Fichier $ENV_FILE_PROD non trouvé dans $PROJECT_ROOT${NC}"
    exit 1
fi

# Fonction pour vérifier si un environnement existe
check_environment_exists() {
    local env_name=$1
    
    # Note: gh CLI ne permet pas encore de lister les environnements via CLI
    # On essaie de créer un secret test pour vérifier
    if echo "test" | gh secret set "TEMP_TEST_SECRET" --env "$env_name" 2>/dev/null; then
        gh secret delete "TEMP_TEST_SECRET" --env "$env_name" 2>/dev/null
        return 0
    else
        return 1
    fi
}

# Fonction pour créer un secret
create_secret() {
    local env_name=$1
    local secret_name=$2
    local secret_value=$3
    
    if [[ -z "$secret_value" || "$secret_value" == "your-"* || "$secret_value" == "votre-"* ]]; then
        echo -e "${YELLOW}⚠️  Valeur vide/placeholder pour $secret_name, ignoré${NC}"
        return
    fi
    
    if [[ "$env_name" == "repository" ]]; then
        echo -n "📝 Création secret (repo): $secret_name... "
        if echo "$secret_value" | gh secret set "$secret_name" 2>/dev/null; then
            echo -e "${GREEN}✅${NC}"
        else
            echo -e "${RED}❌${NC}"
        fi
    else
        echo -n "📝 Création secret ($env_name): $secret_name... "
        if echo "$secret_value" | gh secret set "$secret_name" --env "$env_name" 2>/dev/null; then
            echo -e "${GREEN}✅${NC}"
        else
            echo -e "${RED}❌ (Vérifiez que l'environnement '$env_name' existe)${NC}"
        fi
    fi
}

# Fonction pour créer les environnements GitHub
create_github_environments() {
    echo -e "\n${BLUE}🌍 Création/Vérification des environnements GitHub${NC}"
    echo "=================================================="
    
    local environments=("production" "staging")
    
    for env in "${environments[@]}"; do
        echo -n "🔍 Vérification environnement '$env'... "
        
        if check_environment_exists "$env"; then
            echo -e "${GREEN}✅ Existe${NC}"
        else
            echo -e "${YELLOW}❌ N'existe pas${NC}"
            echo -e "${YELLOW}⚠️  IMPORTANT: Créez l'environnement '$env' manuellement sur GitHub:${NC}"
            echo "   1. Allez sur: https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/settings/environments"
            echo "   2. Cliquez 'New environment'"
            echo "   3. Nommez-le: $env"
            echo "   4. Configurez les protection rules si nécessaire"
            echo ""
        fi
    done
    
    echo ""
    read -p "Les environnements sont-ils créés ? Continuez ? (y/N): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        echo "Veuillez créer les environnements GitHub d'abord."
        exit 1
    fi
}

# Fonction pour parser et créer les secrets
setup_secrets() {
    local env_name=$1
    local env_file=$2
    
    echo -e "\n${BLUE}📋 Configuration des secrets pour: $env_name${NC}"
    echo "----------------------------------------"
    
    # Variables repository (communes à tous les environnements)
    if [[ "$env_name" == "repository" ]]; then
        while IFS='=' read -r key value; do
            # Ignorer les commentaires et lignes vides
            [[ $key =~ ^#.*$ ]] && continue
            [[ -z $key ]] && continue
            
            # Nettoyer la valeur
            value=$(echo "$value" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | sed 's/^"//;s/"$//')
            
            case $key in
                # Variables VPS (critiques - repository level pour accès depuis tous les workflows)
                "VPS_HOST"|"VPS_USER"|"VPS_SSH_PRIVATE_KEY")
                    create_secret "$env_name" "$key" "$value"
                    ;;
                # Variables Docker Registry (si besoin)
                "DOCKER_REGISTRY"|"DOCKER_USERNAME"|"DOCKER_PASSWORD")
                    create_secret "$env_name" "$key" "$value"
                    ;;
                # Variables de notification (communes)
                "SLACK_WEBHOOK_URL"|"DISCORD_WEBHOOK_URL")
                    create_secret "$env_name" "$key" "$value"
                    ;;
            esac
        done < "$PROJECT_ROOT/$env_file"
        return
    fi
    
    # Variables spécifiques à l'environnement (staging/production)
    while IFS='=' read -r key value; do
        # Ignorer les commentaires et lignes vides
        [[ $key =~ ^#.*$ ]] && continue
        [[ -z $key ]] && continue
        
        # Nettoyer la valeur
        value=$(echo "$value" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | sed 's/^"//;s/"$//')
        
        case $key in
            # Variables d'environnement Next.js
            "NODE_ENV")
                if [[ "$env_name" == "production" ]]; then
                    create_secret "$env_name" "$key" "production"
                else
                    create_secret "$env_name" "$key" "staging"
                fi
                ;;
            "NEXT_TELEMETRY_DISABLED")
                create_secret "$env_name" "$key" "$value"
                ;;
            
            # Variables de domaines et URLs
            "FRONTEND_DOMAIN")
                create_secret "$env_name" "$key" "$value"
                ;;
            "NEXTAUTH_URL")
                create_secret "$env_name" "$key" "$value"
                ;;
            "NEXT_PUBLIC_API_URL")
                create_secret "$env_name" "$key" "$value"
                ;;
            "NEXT_PUBLIC_SITE_URL")
                create_secret "$env_name" "$key" "$value"
                ;;
            
            # Variables de sécurité
            "NEXTAUTH_SECRET")
                if [[ "$env_name" == "production" ]]; then
                    prod_secret="$(openssl rand -base64 32)"
                    create_secret "$env_name" "$key" "$prod_secret"
                else
                    staging_secret="$(openssl rand -base64 32)"
                    create_secret "$env_name" "$key" "$staging_secret"
                fi
                ;;
            "ACME_EMAIL")
                create_secret "$env_name" "$key" "$value"
                ;;
            
            # Variables publiques de l'application
            "NEXT_PUBLIC_APP_NAME")
                create_secret "$env_name" "$key" "$value"
                ;;
            "NEXT_PUBLIC_APP_VERSION"|"NEXT_PUBLIC_API_VERSION"|"NEXT_PUBLIC_DEFAULT_LOCALE")
                create_secret "$env_name" "$key" "$value"
                ;;
            
            # Variables SEO et metadata
            "NEXT_PUBLIC_SITE_NAME")
                create_secret "$env_name" "$key" "$value"
                ;;
            "NEXT_PUBLIC_SITE_DESCRIPTION")
                create_secret "$env_name" "$key" "$value"
                ;;
            
            # Variables d'analytics et monitoring (optionnelles)
            "NEXT_PUBLIC_ANALYTICS_ID"|"NEXT_PUBLIC_GTM_ID"|"NEXT_PUBLIC_SENTRY_DSN")
                create_secret "$env_name" "$key" "$value"
                ;;
            
            # Feature flags
            "NEXT_PUBLIC_ENABLE_FEATURES"|"NEXT_PUBLIC_ENABLE_PWA"|"NEXT_PUBLIC_ENABLE_OFFLINE"|"NEXT_PUBLIC_ENABLE_DARK_MODE")
                create_secret "$env_name" "$key" "$value"
                ;;
            
            # Variables d'authentification (optionnelles)
            "GITHUB_CLIENT_ID"|"GITHUB_CLIENT_SECRET"|"GOOGLE_CLIENT_ID"|"GOOGLE_CLIENT_SECRET")
                create_secret "$env_name" "$key" "$value"
                ;;
            
            # Variables de payment (optionnelles)
            "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"|"STRIPE_SECRET_KEY")
                create_secret "$env_name" "$key" "$value"
                ;;
            
            # Variables email (optionnelles)
            "SMTP_HOST"|"SMTP_PORT"|"SMTP_USER"|"SMTP_PASSWORD"|"SMTP_FROM")
                create_secret "$env_name" "$key" "$value"
                ;;
            
            # Variables CDN et assets (optionnelles)
            "NEXT_PUBLIC_CDN_URL"|"NEXT_PUBLIC_ASSETS_URL")
                create_secret "$env_name" "$key" "$value"
                ;;
            
            # Variables de cache (optionnelles)
            "REDIS_URL")
                create_secret "$env_name" "$key" "$value"
                ;;
        esac
    done < "$PROJECT_ROOT/$env_file"
}

# Fonction principale
main() {
    local target_env=${1:-"both"}
    
    echo -e "🎯 Mode: $target_env"
    echo -e "📁 Fichier env: $PROJECT_ROOT/$ENV_FILE_PROD"
    echo ""
    
    # Vérifier le repository
    repo_info=$(gh repo view --json nameWithOwner 2>/dev/null || echo "")
    if [[ -z "$repo_info" ]]; then
        echo -e "${RED}❌ Pas de repository GitHub détecté dans ce dossier${NC}"
        echo "Exécutez ce script depuis la racine de votre repository GitHub"
        exit 1
    fi
    
    repo_name=$(echo "$repo_info" | grep -o '"nameWithOwner":"[^"]*"' | cut -d'"' -f4)
    echo -e "📦 Repository: ${GREEN}$repo_name${NC}"
    
    # Créer/vérifier les environnements GitHub
    if [[ "$target_env" != "repository" ]]; then
        create_github_environments
    fi
    
    # Demander confirmation
    echo ""
    echo -e "${YELLOW}⚠️  Ce script va créer/mettre à jour les secrets GitHub${NC}"
    echo "Les valeurs existantes seront écrasées !"
    echo ""
    echo "Variables qui seront configurées :"
    echo "• Next.js: NODE_ENV, NEXTAUTH_SECRET, NEXT_PUBLIC_*"
    echo "• Domaines: FRONTEND_DOMAIN, NEXTAUTH_URL, NEXT_PUBLIC_API_URL"
    echo "• Sécurité: ACME_EMAIL, secrets d'authentification"
    echo "• Application: nom, version, features flags"
    echo "• Services: Analytics, Payment, Email, CDN, Cache"
    echo ""
    read -p "Continuer ? (y/N): " confirm
    
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        echo "Annulé."
        exit 0
    fi
    
    # Configurer les secrets selon le mode
    case $target_env in
        "production")
            setup_secrets "repository" "$ENV_FILE_PROD"
            setup_secrets "production" "$ENV_FILE_PROD"
            ;;
        "staging")
            setup_secrets "repository" "$ENV_FILE_STAGING"
            setup_secrets "staging" "$ENV_FILE_STAGING"
            ;;
        "both")
            setup_secrets "repository" "$ENV_FILE_PROD"
            setup_secrets "production" "$ENV_FILE_PROD"
            setup_secrets "staging" "$ENV_FILE_STAGING"
            ;;
        "repository")
            setup_secrets "repository" "$ENV_FILE_PROD"
            ;;
        *)
            echo -e "${RED}❌ Mode invalide: $target_env${NC}"
            echo "Usage: $0 [production|staging|both|repository]"
            exit 1
            ;;
    esac
    
    echo ""
    echo -e "${GREEN}🎉 Configuration des secrets terminée !${NC}"
    echo ""
    echo "📋 Prochaines étapes:"
    echo "1. Vérifiez les secrets sur GitHub:"
    echo "   - Repository: Settings → Secrets and variables → Actions"
    echo "   - Environments: Settings → Environments → [env] → Secrets"
    echo "2. Ajustez les URLs de production/staging si nécessaire"
    echo "3. Configurez vos services externes (Analytics, Payment, etc.)"
    echo "4. Testez un déploiement avec GitHub Actions"
    echo ""
    echo -e "${BLUE}💡 Tips:${NC}"
    echo "- 'gh secret list' pour les secrets repository"
    echo "- 'gh secret list --env staging' pour les secrets staging"
    echo "- 'gh secret list --env production' pour les secrets production"
    echo ""
    echo -e "${YELLOW}⚠️  Important:${NC}"
    echo "• Les secrets NEXTAUTH_SECRET ont été générés automatiquement"
    echo "• Sauvegardez les valeurs générées pour vos services"
    echo "• Configurez vos domaines de production/staging"
    echo "• Ajustez les variables placeholder dans $ENV_FILE_PROD et $ENV_FILE_STAGING si nécessaire"
}

# Aide
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    echo "Usage: $0 [production|staging|both|repository]"
    echo ""
    echo "Script de configuration des secrets GitHub pour Rexel Modern Frontend"
    echo "Configure automatiquement les variables d'environnement pour:"
    echo "• Next.js (NEXTAUTH_SECRET, NEXT_PUBLIC_*, NODE_ENV)"
    echo "• Domaines (FRONTEND_DOMAIN, NEXTAUTH_URL, API_URL)"
    echo "• Sécurité (ACME_EMAIL, authentification)"
    echo "• Services externes (Analytics, Payment, Email, CDN)"
    echo ""
    echo "Options:"
    echo "  production  - Créer les secrets pour la production uniquement"
    echo "  staging     - Créer les secrets pour le staging uniquement"  
    echo "  both        - Créer les secrets pour production ET staging (défaut)"
    echo "  repository  - Créer uniquement les secrets communs (repository level)"
    echo ""
    echo "Exemples:"
    echo "  $0                    # Setup complet (repository + production + staging)"
    echo "  $0 staging            # Repository + staging uniquement"
    echo "  $0 production         # Repository + production uniquement"
    echo "  $0 repository         # Secrets communs uniquement"
    echo ""
    echo "Le script lit les variables depuis: $ENV_FILE_PROD et $ENV_FILE_STAGING"
    exit 0
fi

# Exécuter le script
main "$@"
