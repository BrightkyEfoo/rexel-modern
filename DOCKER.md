# 🐳 Docker Configuration - KesiMarket Modern Frontend

Documentation complète de la configuration Docker pour le frontend KesiMarket Modern.

## 📁 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Production Stack                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │    Caddy    │  │   Next.js App   │  │   Volumes       │ │
│  │   (Proxy)   │  │  (Frontend)     │  │  (Persistence)  │ │
│  │             │  │                 │  │                 │ │
│  │ Port 80/443 │  │   Port 3000     │  │ caddy_data      │ │
│  │             │  │                 │  │ caddy_config    │ │
│  └─────────────┘  └─────────────────┘  │ app_data        │ │
│                                         └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🏗️ Dockerfile Optimisé

### Multi-Stage Build

Notre Dockerfile utilise un build multi-étapes pour optimiser la taille et la sécurité :

```dockerfile
# Étapes de construction
FROM node:20-alpine AS base       # Image de base
FROM base AS deps                 # Installation des dépendances
FROM base AS production-deps      # Dépendances de production seulement
FROM base AS build               # Construction de l'application
FROM base AS runner              # Image finale de production
```

### Optimisations

1. **Taille réduite** : Image Alpine Linux (~5MB vs ~1GB Ubuntu)
2. **Sécurité** : Utilisateur non-root (nextjs:nodejs)
3. **Cache Docker** : Layers optimisés pour le cache
4. **Standalone output** : Bundle autonome Next.js

## 🐙 Docker Compose Production

### Services

#### Frontend App
```yaml
app:
  image: kesimarket-frontend-prod:latest
  container_name: kesimarket-frontend-prod
  restart: unless-stopped
  healthcheck:
    test: ['CMD', 'curl', '-f', 'http://localhost:3000/api/health']
    interval: 30s
    timeout: 10s
    retries: 3
```

#### Caddy Reverse Proxy
```yaml
caddy:
  image: caddy:2-alpine
  container_name: kesimarket-frontend-caddy-prod
  restart: unless-stopped
  ports:
    - '80:80'
    - '443:443'
```

### Volumes Persistants

```yaml
volumes:
  caddy_data:      # Données Caddy (certificats SSL)
  caddy_config:    # Configuration Caddy
  app_data:        # Données application
```

### Network

```yaml
networks:
  kesimarket-frontend-network:
    driver: bridge
```

## ⚙️ Configuration Caddy

### Features

1. **HTTPS Automatique** : Certificats Let's Encrypt
2. **Compression** : Gzip automatique
3. **Security Headers** : Headers de sécurité
4. **Health Checks** : Surveillance des services
5. **Load Balancing** : Prêt pour le scaling

### Exemple de Configuration

```caddy
yourdomain.com {
    # Security headers
    header {
        Strict-Transport-Security "max-age=31536000"
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
    }
    
    # Compression
    encode gzip
    
    # Reverse proxy vers Next.js
    reverse_proxy app:3000
}
```

## 🚀 Build et Déploiement

### Construction de l'Image

```bash
# Build local
docker build -t kesimarket-frontend-prod:latest .

# Build avec arguments
docker build \
  --build-arg NODE_IMAGE=node:20-alpine \
  -t kesimarket-frontend-prod:latest .

# Build pour production
./docker-prod.sh build
```

### Taille de l'Image

```bash
# Vérifier la taille de l'image
docker images kesimarket-frontend-prod

# Analyser les layers
docker history kesimarket-frontend-prod:latest
```

### Multi-Platform Build

```bash
# Build pour plusieurs architectures
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t kesimarket-frontend-prod:latest .
```

## 🔧 Variables d'Environnement

### Build Time Variables

```dockerfile
ARG NODE_IMAGE=node:20-alpine
ARG NEXT_TELEMETRY_DISABLED=1
```

### Runtime Variables

```env
# Application
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# Next.js
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_TELEMETRY_DISABLED=1

# Auth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_secret
```

## 📊 Monitoring et Health Checks

### Health Check Endpoint

```typescript
// src/app/api/health/route.ts
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    memory: process.memoryUsage()
  });
}
```

### Docker Health Check

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

### Caddy Health Check

```bash
# Test manuel
curl -f http://localhost/api/health

# Avec Docker Compose
docker-compose exec caddy wget --spider http://app:3000/api/health
```

## 🛠️ Debugging

### Logs

```bash
# Logs de l'application
docker-compose logs app

# Logs Caddy
docker-compose logs caddy

# Logs en temps réel
docker-compose logs -f
```

### Shell dans le Container

```bash
# Application container
docker exec -it kesimarket-frontend-prod sh

# Caddy container  
docker exec -it kesimarket-frontend-caddy-prod sh
```

### Debug Mode

```bash
# Démarrer en mode debug
docker-compose -f docker-compose.prod.yml up

# Override pour development
docker-compose \
  -f docker-compose.prod.yml \
  -f docker-compose.debug.yml up
```

## 🔒 Sécurité

### Image Scanning

```bash
# Scan de sécurité avec Docker Scout
docker scout cves kesimarket-frontend-prod:latest

# Scan avec Trivy
trivy image kesimarket-frontend-prod:latest
```

### Utilisateur Non-Root

```dockerfile
# Création utilisateur sécurisé
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Changement de propriétaire
COPY --chown=nextjs:nodejs /app/.next /app/

# Utilisation utilisateur non-root
USER nextjs
```

### Secrets Management

```bash
# Secrets avec Docker Swarm
echo "my_secret" | docker secret create nextauth_secret -

# Variables d'environnement sécurisées
docker run --env-file .env.production kesimarket-frontend-prod
```

## 📈 Performance

### Métriques

```bash
# Utilisation ressources
docker stats kesimarket-frontend-prod

# Taille image
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

### Optimisations

1. **Layer Caching** : Optimiser l'ordre des COPY
2. **Multi-stage** : Réduire la taille finale
3. **Dependencies** : Séparer dev/prod deps
4. **Static Assets** : Optimiser les assets statiques

### Benchmarking

```bash
# Test de charge avec Apache Bench
ab -n 1000 -c 10 http://localhost/

# Test avec curl
curl -w "@curl-format.txt" -o /dev/null -s http://localhost/
```

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: Build and Deploy Frontend
on:
  push:
    branches: [main]
    
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t kesimarket-frontend-prod:latest .
      - name: Run tests
        run: docker run --rm kesimarket-frontend-prod:latest npm test
```

### Automatisation

```bash
# Script de déploiement automatique
./docker-prod.sh deploy

# Avec monitoring
./docker-prod.sh monitor
```

## 📋 Checklist Production

### Pre-Deployment

- [ ] Variables d'environnement configurées
- [ ] DNS pointant vers le serveur
- [ ] Certificats SSL prêts
- [ ] Backup strategy définie
- [ ] Monitoring configuré

### Post-Deployment

- [ ] Health checks passent
- [ ] HTTPS fonctionne
- [ ] Performance acceptable
- [ ] Logs normaux
- [ ] Backup testé

### Maintenance

- [ ] Mises à jour de sécurité
- [ ] Rotation des logs
- [ ] Monitoring des ressources
- [ ] Tests de récupération 