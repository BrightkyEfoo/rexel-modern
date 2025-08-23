#!/bin/bash

# KesiMarket Modern Frontend - Production Docker Management Script
# Usage: ./docker-prod.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"
BACKUP_DIR="./backups"
LOGS_DIR="./logs"

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root for production operations
check_root() {
    if [[ $EUID -ne 0 ]] && [[ "$1" == "deploy" ]]; then
        log_error "This script must be run as root for production deployment"
        exit 1
    fi
}

# Verify environment file exists
check_env() {
    if [ ! -f "$ENV_FILE" ]; then
        log_error "Production environment file $ENV_FILE not found"
        log_info "Please create $ENV_FILE with production variables"
        log_info "Use: cp .env.production.example $ENV_FILE"
        exit 1
    fi
}

# Create necessary directories
setup_directories() {
    log_info "Setting up production directories..."
    
    # Create directories
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$LOGS_DIR"
    mkdir -p "./data"
    
    # Set proper permissions
    chmod 755 "$BACKUP_DIR"
    chmod 755 "$LOGS_DIR"
    chmod 755 "./data"
    
    log_success "Directories created and permissions set"
}

# Generate strong secrets
generate_secrets() {
    log_info "Generating production secrets..."
    
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    
    echo "# Generated secrets - Add to your $ENV_FILE"
    echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
    echo ""
    echo "# Production URLs (set your own)"
    echo "FRONTEND_DOMAIN=yourdomain.com"
    echo "NEXT_PUBLIC_API_URL=https://api.yourdomain.com"
    echo "NEXTAUTH_URL=https://yourdomain.com"
    echo "ACME_EMAIL=admin@yourdomain.com"
}

# Build production images
build_production() {
    log_info "Building production images..."
    
    # Build the frontend image
    docker build -t kesimarket-frontend-prod:latest .
    
    log_success "Production images built successfully"
}

# Deploy to production
deploy_production() {
    check_root "deploy"
    check_env
    setup_directories
    
    log_info "Deploying to production..."
    
    # Build production image
    build_production
    
    # Start services
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d
    
    # Wait for services to be ready
    log_info "Waiting for services to start..."
    sleep 30
    
    log_success "Production deployment completed!"
    show_status
}

# Stop production services
stop_production() {
    log_info "Stopping production services..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down
    log_success "Production services stopped"
}

# Restart production services
restart_production() {
    log_info "Restarting production services..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" restart
    log_success "Production services restarted"
}

# Show production status
show_status() {
    log_info "Production services status:"
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
    
    log_info "Service health:"
    echo "$(docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T app curl -s http://localhost:3000/api/health || echo 'Frontend: DOWN')"
}

# View production logs
show_logs() {
    service=${2:-""}
    if [ -n "$service" ]; then
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f "$service"
    else
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f
    fi
}

# Create application backup
backup_application() {
    check_env
    
    BACKUP_FILE="$BACKUP_DIR/frontend-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
    
    log_info "Creating application backup: $BACKUP_FILE"
    
    # Create backup of important data
    tar -czf "$BACKUP_FILE" \
        --exclude="node_modules" \
        --exclude=".next" \
        --exclude="backups" \
        --exclude="logs" \
        .
    
    log_success "Application backup created: $BACKUP_FILE"
    
    # Clean old backups (keep last 7 days)
    find "$BACKUP_DIR" -name "frontend-backup-*.tar.gz" -mtime +7 -delete
}

# Update production deployment
update_production() {
    check_env
    
    log_info "Updating production deployment..."
    
    # Create backup before update
    backup_application
    
    # Pull latest changes
    git pull origin main || log_warning "Could not pull latest changes"
    
    # Rebuild and restart
    build_production
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d
    
    log_success "Production updated successfully"
}

# Scale services
scale_services() {
    check_env
    
    if [ -z "$2" ]; then
        log_error "Please specify scaling: $0 scale app=2"
        exit 1
    fi
    
    log_info "Scaling services: $2"
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --scale $2
    
    log_success "Services scaled successfully"
}

# Clean up Docker resources
cleanup() {
    log_info "Cleaning up Docker resources..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    # Remove unused networks
    docker network prune -f
    
    log_success "Docker cleanup completed"
}

# Monitor services
monitor() {
    log_info "Monitoring production services..."
    
    while true; do
        clear
        echo "=== KesiMarket Frontend Production Monitor ==="
        echo "$(date)"
        echo ""
        
        # Show container status
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
        
        echo ""
        echo "=== Health Checks ==="
        
        # Check frontend health
        if curl -s http://localhost/api/health > /dev/null; then
            echo -e "${GREEN}✓${NC} Frontend: Healthy"
        else
            echo -e "${RED}✗${NC} Frontend: Unhealthy"
        fi
        
        echo ""
        echo "Press Ctrl+C to exit monitoring"
        sleep 10
    done
}

# Display help
show_help() {
    echo "KesiMarket Modern Frontend - Production Docker Management"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  setup       - Setup production directories and permissions"
    echo "  secrets     - Generate production secrets"
    echo "  build       - Build production images"
    echo "  deploy      - Deploy to production"
    echo "  start       - Start production services"
    echo "  stop        - Stop production services"
    echo "  restart     - Restart production services"
    echo "  status      - Show services status"
    echo "  logs        - Show logs (optional: service name)"
    echo "  backup      - Create application backup"
    echo "  update      - Update production deployment"
    echo "  scale       - Scale services (e.g., app=2)"
    echo "  cleanup     - Clean up Docker resources"
    echo "  monitor     - Monitor services in real-time"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy"
    echo "  $0 logs app"
    echo "  $0 scale app=3"
}

# Main script logic
case "$1" in
    setup)
        setup_directories
        ;;
    secrets)
        generate_secrets
        ;;
    build)
        build_production
        ;;
    deploy)
        deploy_production
        ;;
    start)
        check_env
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d
        show_status
        ;;
    stop)
        stop_production
        ;;
    restart)
        restart_production
        ;;
    status)
        check_env
        show_status
        ;;
    logs)
        check_env
        show_logs "$@"
        ;;
    backup)
        backup_application
        ;;
    update)
        update_production
        ;;
    scale)
        scale_services "$@"
        ;;
    cleanup)
        cleanup
        ;;
    monitor)
        check_env
        monitor
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        log_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac 