#!/bin/bash

# =============================================================================
# KesiMarket Frontend Production Deployment Script
# =============================================================================
# This script automates the deployment of the KesiMarket frontend to production
# It replicates the GitHub Actions workflow for local deployment
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/deploy-frontend.env"

# Default values
DOCKER_IMAGE_NAME="kesimarket-frontend-prod"
VPS_DEPLOY_PATH="~/kesimarket/frontend"
CONTAINER_NAME="kesimarket-frontend-prod"
CONTAINER_PORT="3000"
NETWORK_NAME="kesimarket-net"

# Function to load configuration
load_config() {
    if [[ ! -f "$CONFIG_FILE" ]]; then
        log_error "Configuration file not found: $CONFIG_FILE"
        log_info "Please create the deploy-frontend.env file with your server configuration."
        log_info "Use deploy-frontend.env.template as a reference."
        exit 1
    fi
    
    source "$CONFIG_FILE"
    
    # Validate required variables
    local required_vars=("VPS_HOST" "VPS_USER" "VPS_SSH_KEY_PATH" "VPS_SUDO_PASSWORD" "ENVIRONMENT")
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            log_error "Required variable $var is not set in $CONFIG_FILE"
            exit 1
        fi
    done
}

# Function to test SSH connection
test_ssh_connection() {
    log_info "Testing SSH connection to $VPS_HOST..."
    
    EXPANDED_SSH_KEY_PATH=$(echo "$VPS_SSH_KEY_PATH" | sed "s|^~|$HOME|")
    if ssh -i "$EXPANDED_SSH_KEY_PATH" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" "echo 'SSH connection successful'" >/dev/null 2>&1; then
        log_success "SSH connection test passed"
    else
        log_error "SSH connection failed. Please check your VPS credentials."
        exit 1
    fi
}

# Function to prepare VPS directories
prepare_vps_directories() {
    log_info "Preparing VPS directories..."
    
    EXPANDED_SSH_KEY_PATH=$(echo "$VPS_SSH_KEY_PATH" | sed "s|^~|$HOME|")
    ssh -i "$EXPANDED_SSH_KEY_PATH" "$VPS_USER@$VPS_HOST" << 'EOF'
        # Use the home directory path on the server
        DEPLOY_PATH="$HOME/kesimarket/frontend"
        echo "Creating directories in: $DEPLOY_PATH"
        
        mkdir -p "$DEPLOY_PATH"
        mkdir -p "$DEPLOY_PATH/backups"
        mkdir -p "$DEPLOY_PATH/images"
        mkdir -p "$DEPLOY_PATH/data"
        chmod 755 "$DEPLOY_PATH/data"
        
        echo "✅ Directories created successfully"
EOF
    
    log_success "VPS directories prepared"
}

# Function to setup Docker and network
setup_docker_network() {
    log_info "Setting up Docker environment and network..."
    
    EXPANDED_SSH_KEY_PATH=$(echo "$VPS_SSH_KEY_PATH" | sed "s|^~|$HOME|")
    
    # Quick Docker check first
    log_info "Quick Docker status check..."
    if ssh -i "$EXPANDED_SSH_KEY_PATH" "$VPS_USER@$VPS_HOST" -o ConnectTimeout=10 "docker --version && docker ps" >/dev/null 2>&1; then
        log_success "Docker is already working"
    else
        log_info "Docker needs setup, installing..."
        ssh -i "$EXPANDED_SSH_KEY_PATH" "$VPS_USER@$VPS_HOST" -o ConnectTimeout=60 << EOF
            # Install Docker if not present
            if ! command -v docker &> /dev/null; then
                echo "Installing Docker..."
                curl -fsSL https://get.docker.com -o get-docker.sh
                echo '$VPS_SUDO_PASSWORD' | sudo -S sh get-docker.sh
                rm get-docker.sh
            fi
            
            # Start Docker service
            echo '$VPS_SUDO_PASSWORD' | sudo -S systemctl start docker
            echo '$VPS_SUDO_PASSWORD' | sudo -S systemctl enable docker
            echo '$VPS_SUDO_PASSWORD' | sudo -S usermod -aG docker \$USER
            
            # Install Docker Compose
            if ! command -v docker-compose &> /dev/null; then
                echo '$VPS_SUDO_PASSWORD' | sudo -S curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose
                echo '$VPS_SUDO_PASSWORD' | sudo -S chmod +x /usr/local/bin/docker-compose
            fi
            
            echo "Docker setup completed"
EOF
    fi
    
    # Setup shared network
    log_info "Setting up shared Docker network..."
    ssh -i "$EXPANDED_SSH_KEY_PATH" "$VPS_USER@$VPS_HOST" << EOF
        # Test Docker access and set USE_SUDO
        USE_SUDO=""
        if ! docker ps &> /dev/null; then
            if echo '$VPS_SUDO_PASSWORD' | sudo -S docker ps &> /dev/null; then
                USE_SUDO="echo '$VPS_SUDO_PASSWORD' | sudo -S "
            fi
        fi
        
        if ! \${USE_SUDO}docker network ls | grep -q $NETWORK_NAME; then
            echo "🔧 Creating network '$NETWORK_NAME'..."
            \${USE_SUDO}docker network create $NETWORK_NAME --driver bridge
            echo "✅ Network created"
        else
            echo "✅ Network already exists"
        fi
EOF
    
    log_success "Docker environment and network setup completed"
}

# Function to create environment file
create_env_file() {
    log_info "Creating environment file for $ENVIRONMENT..."
    
    if [[ "$ENVIRONMENT" == "staging" ]]; then
        cat > .env.production << EOF
# ===== ENVIRONMENT =====
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# ===== APPLICATION =====
NEXT_PUBLIC_APP_NAME="$NEXT_PUBLIC_APP_NAME (Staging)"
NEXT_PUBLIC_APP_VERSION="$NEXT_PUBLIC_APP_VERSION-staging"

# ===== STAGING DOMAINS & URLs =====
NEXT_PUBLIC_API_URL=https://staging-api.kesimarket.com
NEXTAUTH_URL=https://staging.kesimarket.com
NEXT_PUBLIC_SITE_URL=https://staging.kesimarket.com

# ===== SECURITY =====
NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# ===== SSL/TLS =====
ACME_EMAIL=$ACME_EMAIL

# ===== API CONFIGURATION =====
NEXT_PUBLIC_API_VERSION=$NEXT_PUBLIC_API_VERSION

# ===== SEARCH CONFIGURATION =====
NEXT_PUBLIC_TYPESENSE_HOST=$NEXT_PUBLIC_TYPESENSE_HOST
NEXT_PUBLIC_TYPESENSE_PORT=8108
NEXT_PUBLIC_TYPESENSE_PROTOCOL=http
NEXT_PUBLIC_TYPESENSE_API_KEY=$NEXT_PUBLIC_TYPESENSE_API_KEY

# ===== FEATURES FLAGS =====
NEXT_PUBLIC_ENABLE_FEATURES=$NEXT_PUBLIC_ENABLE_FEATURES

# ===== CDN & ASSETS =====
NEXT_PUBLIC_CDN_URL=https://staging-cdn.kesimarket.com
NEXT_PUBLIC_ASSETS_URL=https://staging-assets.kesimarket.com

# ===== FEATURE FLAGS =====
NEXT_PUBLIC_ENABLE_PWA=$NEXT_PUBLIC_ENABLE_PWA
NEXT_PUBLIC_ENABLE_OFFLINE=$NEXT_PUBLIC_ENABLE_OFFLINE
NEXT_PUBLIC_ENABLE_DARK_MODE=$NEXT_PUBLIC_ENABLE_DARK_MODE

# ===== SEO & METADATA =====
NEXT_PUBLIC_SITE_NAME="$NEXT_PUBLIC_SITE_NAME (Staging)"
NEXT_PUBLIC_SITE_DESCRIPTION="$NEXT_PUBLIC_SITE_DESCRIPTION"
NEXT_PUBLIC_DEFAULT_LOCALE=$NEXT_PUBLIC_DEFAULT_LOCALE

# ===== STAGING SPECIFIC =====
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_SHOW_STAGING_BANNER=true
EOF
    else
        cat > .env.production << EOF
# ===== ENVIRONMENT =====
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# ===== APPLICATION =====
NEXT_PUBLIC_APP_NAME="$NEXT_PUBLIC_APP_NAME"
NEXT_PUBLIC_APP_VERSION="$NEXT_PUBLIC_APP_VERSION"

# ===== PRODUCTION DOMAINS & URLs =====
NEXT_PUBLIC_API_URL=https://api.kesimarket.com
NEXTAUTH_URL=https://kesimarket.com
NEXT_PUBLIC_SITE_URL=https://kesimarket.com

# ===== SECURITY =====
NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# ===== SSL/TLS =====
ACME_EMAIL=$ACME_EMAIL

# ===== API CONFIGURATION =====
NEXT_PUBLIC_API_VERSION=$NEXT_PUBLIC_API_VERSION

# ===== SEARCH CONFIGURATION =====
NEXT_PUBLIC_TYPESENSE_HOST=$NEXT_PUBLIC_TYPESENSE_HOST
NEXT_PUBLIC_TYPESENSE_PORT=8108
NEXT_PUBLIC_TYPESENSE_PROTOCOL=http
NEXT_PUBLIC_TYPESENSE_API_KEY=$NEXT_PUBLIC_TYPESENSE_API_KEY

# ===== ANALYTICS & MONITORING =====
NEXT_PUBLIC_ANALYTICS_ID=$NEXT_PUBLIC_ANALYTICS_ID
NEXT_PUBLIC_GTM_ID=$NEXT_PUBLIC_GTM_ID
NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN

# ===== FEATURES FLAGS =====
NEXT_PUBLIC_ENABLE_FEATURES=$NEXT_PUBLIC_ENABLE_FEATURES

# ===== CDN & ASSETS =====
NEXT_PUBLIC_CDN_URL=https://cdn.kesimarket.com
NEXT_PUBLIC_ASSETS_URL=https://assets.kesimarket.com

# ===== SOCIAL AUTH (Optional) =====
GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET
GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET

# ===== PAYMENT (Optional) =====
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY

# ===== EMAIL (Optional) =====
SMTP_HOST=$SMTP_HOST
SMTP_PORT=$SMTP_PORT
SMTP_USER=$SMTP_USER
SMTP_PASSWORD=$SMTP_PASSWORD
SMTP_FROM=$SMTP_FROM

# ===== REDIS (Optional for caching) =====
REDIS_URL=$REDIS_URL

# ===== FEATURE FLAGS =====
NEXT_PUBLIC_ENABLE_PWA=$NEXT_PUBLIC_ENABLE_PWA
NEXT_PUBLIC_ENABLE_OFFLINE=$NEXT_PUBLIC_ENABLE_OFFLINE
NEXT_PUBLIC_ENABLE_DARK_MODE=$NEXT_PUBLIC_ENABLE_DARK_MODE

# ===== SEO & METADATA =====
NEXT_PUBLIC_SITE_NAME="$NEXT_PUBLIC_SITE_NAME"
NEXT_PUBLIC_SITE_DESCRIPTION="$NEXT_PUBLIC_SITE_DESCRIPTION"
NEXT_PUBLIC_DEFAULT_LOCALE=$NEXT_PUBLIC_DEFAULT_LOCALE
EOF
    fi
    
    log_success "Environment file created for $ENVIRONMENT"
}

# Function to build Docker image
build_docker_image() {
    log_info "Building Docker image..."
    
    # Generate image tag
    SHORT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "local")
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    IMAGE_TAG="${DOCKER_IMAGE_NAME}:${SHORT_SHA}-${TIMESTAMP}"
    
    log_info "Building image with tag: $IMAGE_TAG"
    
    # Build Docker image for AMD64 platform (VPS compatibility)
    docker build --platform linux/amd64 -t "$IMAGE_TAG" .
    docker tag "$IMAGE_TAG" "$DOCKER_IMAGE_NAME:latest"
    
    # Save Docker image to tar
    docker save "$IMAGE_TAG" > kesimarket-frontend-prod.tar
    
    log_success "Docker image built and saved: $(ls -lh kesimarket-frontend-prod.tar | awk '{print $5}')"
}

# Function to transfer files to VPS
transfer_files() {
    log_info "Transferring files to VPS..."
    
    # Get the expanded paths
    EXPANDED_SSH_KEY_PATH=$(echo "$VPS_SSH_KEY_PATH" | sed "s|^~|$HOME|")
    # Get the remote home directory and build the path
    REMOTE_DEPLOY_PATH=$(ssh -i "$EXPANDED_SSH_KEY_PATH" "$VPS_USER@$VPS_HOST" "echo \$HOME/kesimarket/frontend")
    
    # Transfer Docker image, compose file, and env file
    scp -i "$EXPANDED_SSH_KEY_PATH" \
        kesimarket-frontend-prod.tar \
        docker-compose.prod.yml \
        .env.production \
        "$VPS_USER@$VPS_HOST:$REMOTE_DEPLOY_PATH/"
    
    # Organize files on VPS
    EXPANDED_SSH_KEY_PATH=$(echo "$VPS_SSH_KEY_PATH" | sed "s|^~|$HOME|")
    ssh -i "$EXPANDED_SSH_KEY_PATH" "$VPS_USER@$VPS_HOST" << EOF
        DEPLOY_PATH="\$HOME/kesimarket/frontend"
        cd "\$DEPLOY_PATH"
        
        # Create images directory if it doesn't exist
        mkdir -p images
        
        # Backup previous image if exists
        if [ -f images/kesimarket-frontend-prod-current.tar ]; then
            mv images/kesimarket-frontend-prod-current.tar backups/kesimarket-frontend-prod-backup-\$(date +%Y%m%d-%H%M%S).tar
        fi
        
        # Move new image to images directory
        mv kesimarket-frontend-prod.tar images/kesimarket-frontend-prod-current.tar
        
        echo "✅ Files organized and ready for deployment"
EOF
    
    log_success "Files transferred to VPS"
}

# Function to deploy frontend service
deploy_frontend() {
    log_info "Deploying frontend service..."
    
    EXPANDED_SSH_KEY_PATH=$(echo "$VPS_SSH_KEY_PATH" | sed "s|^~|$HOME|")
    ssh -i "$EXPANDED_SSH_KEY_PATH" "$VPS_USER@$VPS_HOST" << EOF
        DEPLOY_PATH="\$HOME/kesimarket/frontend"
        cd "\$DEPLOY_PATH"
        
        # Detect if sudo is needed for Docker commands
        USE_SUDO=""
        if ! docker ps &> /dev/null; then
            if echo '$VPS_SUDO_PASSWORD' | sudo -S docker ps &> /dev/null; then
                echo "⚠️  Using sudo for Docker commands"
                USE_SUDO="echo '$VPS_SUDO_PASSWORD' | sudo -S "
            else
                echo "❌ Docker not accessible even with sudo"
                exit 1
            fi
        else
            echo "✅ Docker accessible without sudo"
        fi

        # Verify shared network exists
        if ! \${USE_SUDO}docker network ls | grep -q $NETWORK_NAME; then
            echo "❌ Shared network '$NETWORK_NAME' not found!"
            echo "Creating network as fallback..."
            \${USE_SUDO}docker network create $NETWORK_NAME
        else
            echo "✅ Shared network '$NETWORK_NAME' exists"
        fi

        # Load the new Docker image
        \${USE_SUDO}docker load < images/kesimarket-frontend-prod-current.tar

        # Tag the loaded image as latest for docker-compose
        IMAGE_NAME=\$(\${USE_SUDO}docker images --format "table {{.Repository}}:{{.Tag}}" | grep kesimarket-frontend-prod | grep -v latest | head -n 1)
        \${USE_SUDO}docker tag \$IMAGE_NAME kesimarket-frontend-prod:latest

        # Stop existing frontend service
        echo 'Stopping existing frontend service...'
        \${USE_SUDO}docker compose -f docker-compose.prod.yml down || echo 'No existing services to stop'

        # Start frontend application
        echo 'Starting frontend application...'
        \${USE_SUDO}docker compose -f docker-compose.prod.yml up -d frontend

        # Wait for service to start
        echo 'Waiting for service to start...'
        sleep 10

        # Check if frontend container is running
        frontend_running=\$(\${USE_SUDO}docker ps -q -f name=$CONTAINER_NAME)

        if [ ! -z "\$frontend_running" ]; then
            echo '✅ Frontend container is running!'
            \${USE_SUDO}docker ps -f name=$CONTAINER_NAME --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"
        else
            echo '❌ Frontend container failed to start!'
            \${USE_SUDO}docker compose -f docker-compose.prod.yml logs frontend
            exit 1
        fi

        echo 'Frontend deployment completed - service is running!'
EOF
    
    log_success "Frontend service deployed successfully"
}

# Function to perform health check
health_check() {
    if [[ "${SKIP_HEALTH:-false}" == "true" ]]; then
        log_info "Skipping health check"
        return 0
    fi
    
    log_info "Performing health check..."
    
    EXPANDED_SSH_KEY_PATH=$(echo "$VPS_SSH_KEY_PATH" | sed "s|^~|$HOME|")
    ssh -i "$EXPANDED_SSH_KEY_PATH" "$VPS_USER@$VPS_HOST" << EOF
        DEPLOY_PATH="\$HOME/kesimarket/frontend"
        cd "\$DEPLOY_PATH"
        
        USE_SUDO=""
        if ! docker ps &> /dev/null; then
            if echo '$VPS_SUDO_PASSWORD' | sudo -S docker ps &> /dev/null; then
                USE_SUDO="echo '$VPS_SUDO_PASSWORD' | sudo -S "
            fi
        fi

        echo "=== FRONTEND HEALTH CHECK ==="

        # Check container status
        echo "📋 Container Status:"
        \${USE_SUDO}docker ps -f name=$CONTAINER_NAME --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"

        # Check if frontend is responding
        echo -e "\\n🌐 Frontend Status:"
        frontend_running=\$(\${USE_SUDO}docker ps -q -f name=$CONTAINER_NAME)

        if [ ! -z "\$frontend_running" ]; then
            echo "✅ Frontend container is running"
            
            # Test if the port is accessible
            if \${USE_SUDO}docker exec \$frontend_running curl -f http://localhost:$CONTAINER_PORT/api/health 2>/dev/null; then
                echo "✅ Frontend health endpoint responding"
            else
                echo "⚠️  Frontend health endpoint not responding (this may be normal)"
            fi
        else
            echo "❌ Frontend container not running"
        fi

        echo -e "\\n=== HEALTH CHECK COMPLETE ==="
EOF
    
    log_success "Health check completed"
}

# Function to cleanup
cleanup() {
    log_info "Cleaning up..."
    
    # Remove local files
    rm -f kesimarket-frontend-prod.tar .env.production
    
    # Cleanup on VPS
    EXPANDED_SSH_KEY_PATH=$(echo "$VPS_SSH_KEY_PATH" | sed "s|^~|$HOME|")
    ssh -i "$EXPANDED_SSH_KEY_PATH" "$VPS_USER@$VPS_HOST" << EOF
        USE_SUDO=""
        if ! docker ps &> /dev/null; then
            if echo '$VPS_SUDO_PASSWORD' | sudo -S docker ps &> /dev/null; then
                USE_SUDO="echo '$VPS_SUDO_PASSWORD' | sudo -S "
            fi
        fi

        # Remove dangling images
        \${USE_SUDO}docker image prune -f

        # Keep only the 3 most recent backup images
        DEPLOY_PATH="\$HOME/kesimarket/frontend"
        cd "\$DEPLOY_PATH/backups"
        ls -t kesimarket-frontend-prod-backup-*.tar 2>/dev/null | tail -n +4 | xargs -r rm -f

        echo "✅ Cleanup completed"
EOF
    
    log_success "Cleanup completed"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --environment ENV    Environment: production|staging (default: from config)"
    echo "  --rebuild-cache      Rebuild Next.js cache during build"
    echo "  --skip-health        Skip health check"
    echo "  --help               Show this help message"
    echo ""
    echo "Environment variables (set in deploy-frontend.env):"
    echo "  ENVIRONMENT          Deployment environment: production|staging"
    echo "  REBUILD_CACHE        Set to 'true' to rebuild cache (default: false)"
    echo "  SKIP_HEALTH          Set to 'true' to skip health check (default: false)"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --rebuild-cache)
            REBUILD_CACHE="true"
            shift
            ;;
        --skip-health)
            SKIP_HEALTH="true"
            shift
            ;;
        --help)
            show_usage
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Main deployment function
main() {
    echo "========================================================"
    echo "🚀 KesiMarket Frontend Production Deployment"
    echo "========================================================"
    echo ""
    
    # Load configuration
    load_config
    
    # Test SSH connection
    test_ssh_connection
    
    # Run deployment steps
    prepare_vps_directories
    setup_docker_network
    create_env_file
    build_docker_image
    transfer_files
    deploy_frontend
    
    if [[ "${SKIP_HEALTH:-false}" != "true" ]]; then
        health_check
    fi
    
    cleanup
    
    echo ""
    echo "========================================================"
    log_success "🎉 Frontend deployment completed successfully!"
    echo "========================================================"
    echo ""
    echo "📋 Deployment Summary:"
    echo "   • Environment: ${ENVIRONMENT:-production}"
    echo "   • Container: $CONTAINER_NAME"
    echo "   • Port: $CONTAINER_PORT"
    echo "   • Network: $NETWORK_NAME (shared)"
    echo ""
    if [[ "$ENVIRONMENT" == "staging" ]]; then
        echo "🌐 Staging URLs:"
        echo "   • Frontend: https://staging.kesimarket.com"
        echo "   • API: https://staging-api.kesimarket.com"
    else
        echo "🌐 Production URLs:"
        echo "   • Frontend: https://kesimarket.com"
        echo "   • API: https://api.kesimarket.com"
    fi
    echo ""
    echo "ℹ️  Note: Reverse proxy managed by backend deployment"
    echo ""
}

# Run main function
main "$@"
