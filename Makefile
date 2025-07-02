# Rexel Modern Frontend - Production Makefile
# Simplified commands for Docker deployment

.PHONY: help build deploy start stop restart status logs backup update clean github-setup

# Variables
COMPOSE_FILE := docker-compose.prod.yml
ENV_FILE := .env.production
IMAGE_NAME := rexel-frontend-prod:latest

# Couleurs pour l'affichage
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Commande par défaut
help: ## Afficher l'aide
	@echo ""
	@echo "$(BLUE)🚀 Rexel Modern Frontend - Production Commands$(NC)"
	@echo ""
	@echo "$(YELLOW)🎯 RECOMMANDÉ: Utiliser GitHub Actions pour le déploiement$(NC)"
	@echo "   Push sur main → Déploiement automatique"
	@echo "   Manuel: GitHub > Actions > Deploy Frontend to Production"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

##@ GitHub Actions (Recommandé)
github-setup: ## Configurer les secrets GitHub pour le déploiement automatique
	@echo "$(BLUE)🔐 Configuration des secrets GitHub...$(NC)"
	./scripts/setup-github-secrets.sh
	@echo ""
	@echo "$(YELLOW)📋 Étapes suivantes:$(NC)"
	@echo "1. Configurer les secrets dans GitHub: Settings > Secrets and variables > Actions"
	@echo "2. Push sur main pour déclenchement automatique"
	@echo "3. Ou déploiement manuel depuis l'onglet Actions"

github-check: ## Vérifier la configuration GitHub Actions
	@echo "$(BLUE)🔍 Vérification GitHub Actions...$(NC)"
	@test -d .github/workflows && echo "$(GREEN)✅ Workflows GitHub configurés$(NC)" || echo "$(RED)❌ Workflows manquants$(NC)"
	@test -f .github/workflows/deploy-production.yml && echo "$(GREEN)✅ Workflow de déploiement trouvé$(NC)" || echo "$(RED)❌ Workflow de déploiement manquant$(NC)"
	@test -f .github/workflows/build-test.yml && echo "$(GREEN)✅ Workflow de test trouvé$(NC)" || echo "$(RED)❌ Workflow de test manquant$(NC)"

# Installation et configuration
setup: ## Configurer l'environnement de production
	@echo "$(BLUE)📦 Configuration de l'environnement...$(NC)"
	./docker-prod.sh setup
	@echo "$(GREEN)✅ Configuration terminée$(NC)"

secrets: ## Générer les secrets de production
	@echo "$(BLUE)🔐 Génération des secrets...$(NC)"
	@echo "NEXTAUTH_SECRET=$$(openssl rand -base64 32)"
	@echo ""
	@echo "$(YELLOW)💡 Pour la configuration complète, utilisez: make github-setup$(NC)"

# Construction et déploiement (Manuel)
build: ## Construire l'image Docker de production
	@echo "$(BLUE)🏗️  Construction de l'image...$(NC)"
	docker build -t $(IMAGE_NAME) .
	@echo "$(GREEN)✅ Image construite: $(IMAGE_NAME)$(NC)"

deploy: ## Déployer en production manuellement (GitHub Actions recommandé)
	@echo "$(YELLOW)⚠️  ATTENTION: Déploiement manuel$(NC)"
	@echo "$(YELLOW)📋 Recommandation: Utilisez GitHub Actions pour la production$(NC)"
	@echo "   make github-setup"
	@echo ""
	@read -p "Continuer avec le déploiement manuel? [y/N] " confirm && [[ $$confirm == [yY] ]] || exit 1
	@echo "$(BLUE)🚀 Déploiement en production...$(NC)"
	sudo ./docker-prod.sh deploy
	@echo "$(GREEN)✅ Déploiement terminé$(NC)"

# Gestion des services
start: ## Démarrer les services
	@echo "$(BLUE)▶️  Démarrage des services...$(NC)"
	docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) up -d
	@$(MAKE) status

stop: ## Arrêter les services
	@echo "$(BLUE)⏹️  Arrêt des services...$(NC)"
	docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) down
	@echo "$(GREEN)✅ Services arrêtés$(NC)"

restart: ## Redémarrer les services
	@echo "$(BLUE)🔄 Redémarrage des services...$(NC)"
	docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) restart
	@$(MAKE) status

# Monitoring et logs
status: ## Afficher le statut des services
	@echo "$(BLUE)📊 Statut des services:$(NC)"
	@docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) ps
	@echo ""
	@echo "$(BLUE)🩺 Health checks:$(NC)"
	@curl -s http://localhost:3000/api/health > /dev/null && echo "$(GREEN)✅ Frontend: Healthy$(NC)" || echo "$(RED)❌ Frontend: Unhealthy$(NC)"
	@curl -s https://localhost/api/health > /dev/null && echo "$(GREEN)✅ HTTPS: Working$(NC)" || echo "$(RED)❌ HTTPS: Not working$(NC)"

logs: ## Afficher les logs
	@echo "$(BLUE)📋 Logs des services:$(NC)"
	docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) logs --tail=100

logs-follow: ## Suivre les logs en temps réel
	@echo "$(BLUE)📋 Logs en temps réel (Ctrl+C pour arrêter):$(NC)"
	docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) logs -f

logs-app: ## Logs de l'application seulement
	@echo "$(BLUE)📋 Logs de l'application:$(NC)"
	docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) logs app --tail=100

logs-caddy: ## Logs de Caddy seulement
	@echo "$(BLUE)📋 Logs de Caddy:$(NC)"
	docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) logs caddy --tail=100

# Monitoring avancé
monitor: ## Surveillance en temps réel
	@echo "$(BLUE)👀 Démarrage du monitoring...$(NC)"
	./docker-prod.sh monitor

health: ## Vérifier la santé de l'application
	@echo "$(BLUE)🩺 Vérification de santé complète:$(NC)"
	@echo ""
	@echo "$(BLUE)🌐 Health Endpoint:$(NC)"
	@curl -s http://localhost:3000/api/health | jq '.' 2>/dev/null || curl -s http://localhost:3000/api/health || echo "$(RED)❌ Service local inaccessible$(NC)"
	@echo ""
	@echo "$(BLUE)🔒 HTTPS Check:$(NC)"
	@curl -s https://localhost/api/health | jq '.' 2>/dev/null || echo "$(RED)❌ HTTPS inaccessible$(NC)"
	@echo ""
	@echo "$(BLUE)📊 Container Health:$(NC)"
	@docker ps -f name=rexel-frontend --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Sauvegarde et mise à jour
backup: ## Créer une sauvegarde
	@echo "$(BLUE)💾 Création de la sauvegarde...$(NC)"
	./docker-prod.sh backup
	@echo "$(GREEN)✅ Sauvegarde créée$(NC)"

update: ## Mettre à jour le déploiement (GitHub Actions recommandé)
	@echo "$(YELLOW)⚠️  Mise à jour manuelle détectée$(NC)"
	@echo "$(YELLOW)📋 Recommandation: Push sur main pour déclenchement GitHub Actions$(NC)"
	@echo ""
	@read -p "Continuer avec la mise à jour manuelle? [y/N] " confirm && [[ $$confirm == [yY] ]] || exit 1
	@echo "$(BLUE)🔄 Mise à jour du déploiement...$(NC)"
	./docker-prod.sh update
	@echo "$(GREEN)✅ Mise à jour terminée$(NC)"

# Scaling
scale-up: ## Augmenter le nombre d'instances (scale=2)
	@echo "$(BLUE)📈 Scaling up to 2 instances...$(NC)"
	docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) up -d --scale app=2
	@$(MAKE) status

scale-down: ## Revenir à une instance
	@echo "$(BLUE)📉 Scaling down to 1 instance...$(NC)"
	docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) up -d --scale app=1
	@$(MAKE) status

# Maintenance
clean: ## Nettoyer les ressources Docker
	@echo "$(BLUE)🧹 Nettoyage des ressources Docker...$(NC)"
	docker system prune -f
	docker volume prune -f
	docker network prune -f
	@echo "$(GREEN)✅ Nettoyage terminé$(NC)"

clean-all: ## Nettoyage complet (images, volumes, networks)
	@echo "$(RED)⚠️  Nettoyage complet - Ceci supprimera tout!$(NC)"
	@read -p "Êtes-vous sûr? [y/N] " confirm && [[ $$confirm == [yY] ]] || exit 1
	docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) down -v --rmi all
	docker system prune -a -f
	@echo "$(GREEN)✅ Nettoyage complet terminé$(NC)"

# Debug et développement
shell-app: ## Shell dans le conteneur de l'application
	@echo "$(BLUE)🐚 Shell dans le conteneur app...$(NC)"
	docker exec -it rexel-frontend-prod sh

shell-caddy: ## Shell dans le conteneur Caddy
	@echo "$(BLUE)🐚 Shell dans le conteneur Caddy...$(NC)"
	docker exec -it rexel-frontend-caddy-prod sh

debug: ## Démarrer en mode debug (sans daemon)
	@echo "$(BLUE)🐛 Mode debug (Ctrl+C pour arrêter)...$(NC)"
	docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) up

# Tests
test-build: ## Tester la construction de l'image
	@echo "$(BLUE)🧪 Test de construction...$(NC)"
	docker build --no-cache -t test-$(IMAGE_NAME) .
	docker rmi test-$(IMAGE_NAME)
	@echo "$(GREEN)✅ Test de construction réussi$(NC)"

test-health: ## Tester les health checks
	@echo "$(BLUE)🧪 Test des health checks...$(NC)"
	@for i in $$(seq 1 5); do \
		echo "Tentative $$i/5..."; \
		if curl -s http://localhost:3000/api/health > /dev/null; then \
			echo "$(GREEN)✅ Health check OK$(NC)"; \
			break; \
		else \
			echo "$(YELLOW)⏳ En attente...$(NC)"; \
			sleep 10; \
		fi; \
	done

test-github: ## Tester les workflows GitHub localement (nécessite act)
	@echo "$(BLUE)🧪 Test GitHub workflow local...$(NC)"
	@command -v act >/dev/null 2>&1 || { echo "$(RED)❌ 'act' non installé. Installation: https://github.com/nektos/act$(NC)"; exit 1; }
	act -W .github/workflows/build-test.yml

# Informations
info: ## Afficher les informations du système
	@echo "$(BLUE)📋 Rexel Modern Frontend - Informations$(NC)"
	@echo "=============================================="
	@echo ""
	@echo "$(BLUE)🏗️  Configuration:$(NC)"
	@echo "   Compose File: $(COMPOSE_FILE)"
	@echo "   Environment: $(ENV_FILE)"
	@echo "   Image: $(IMAGE_NAME)"
	@echo ""
	@echo "$(BLUE)🔧 Versions:$(NC)"
	@echo "   Docker: $$(docker --version)"
	@echo "   Docker Compose: $$(docker-compose --version)"
	@echo ""
	@echo "$(BLUE)📊 État actuel:$(NC)"
	@echo "   Image size: $$(docker images $(IMAGE_NAME) --format 'table {{.Size}}' 2>/dev/null | tail -n +2 || echo 'N/A')"
	@echo "   Containers: $$(docker ps --filter 'name=rexel-frontend' -q | wc -l) running"
	@echo ""
	@echo "$(BLUE)🚀 Méthodes de déploiement:$(NC)"
	@echo "   $(GREEN)Recommandé:$(NC) GitHub Actions (automatique)"
	@echo "   $(YELLOW)Manuel:$(NC) make deploy"
	@echo ""
	@echo "$(BLUE)🔗 URLs:$(NC)"
	@echo "   Frontend: https://localhost"
	@echo "   Health: http://localhost:3000/api/health"
	@echo "   Caddy Admin: https://localhost:2020"

# Commandes rapides pour développement local
dev-up: ## Démarrer en mode développement
	@echo "$(BLUE)🔧 Mode développement...$(NC)"
	docker-compose -f $(COMPOSE_FILE) -f docker-compose.override.yml up -d

dev-down: ## Arrêter le mode développement
	@echo "$(BLUE)🔧 Arrêt mode développement...$(NC)"
	docker-compose -f $(COMPOSE_FILE) -f docker-compose.override.yml down

# Vérifications pré-déploiement
check: ## Vérifications pré-déploiement complètes
	@echo "$(BLUE)✅ Vérifications pré-déploiement:$(NC)"
	@echo ""
	@echo "$(BLUE)🔧 Environnement local:$(NC)"
	@echo -n "   Docker installé: "
	@command -v docker >/dev/null 2>&1 && echo "$(GREEN)✅$(NC)" || echo "$(RED)❌$(NC)"
	@echo -n "   Docker Compose installé: "
	@command -v docker-compose >/dev/null 2>&1 && echo "$(GREEN)✅$(NC)" || echo "$(RED)❌$(NC)"
	@echo -n "   Fichier d'environnement: "
	@test -f $(ENV_FILE) && echo "$(GREEN)✅$(NC)" || echo "$(RED)❌ $(ENV_FILE) manquant$(NC)"
	@echo -n "   Script de déploiement: "
	@test -x ./docker-prod.sh && echo "$(GREEN)✅$(NC)" || echo "$(RED)❌ Non exécutable$(NC)"
	@echo ""
	@echo "$(BLUE)🚀 GitHub Actions:$(NC)"
	@test -d .github/workflows && echo "   Workflows: $(GREEN)✅ Configurés$(NC)" || echo "   Workflows: $(RED)❌ Manquants$(NC)"
	@test -f GITHUB-SETUP.md && echo "   Documentation: $(GREEN)✅ Disponible$(NC)" || echo "   Documentation: $(RED)❌ Manquante$(NC)"
	@echo ""
	@echo "$(BLUE)📋 Recommandations:$(NC)"
	@echo "   1. Configurez GitHub Actions: make github-setup"
	@echo "   2. Testez localement: make build && make start"
	@echo "   3. Déployez via push sur main branch"

troubleshoot: ## Afficher les informations de dépannage
	@echo "$(BLUE)🔧 Informations de dépannage$(NC)"
	@echo "==============================="
	@echo ""
	@echo "$(BLUE)📊 État des services:$(NC)"
	@$(MAKE) status
	@echo ""
	@echo "$(BLUE)📝 Erreurs récentes:$(NC)"
	@docker-compose -f $(COMPOSE_FILE) logs --tail=20 2>/dev/null | grep -i error || echo "   Aucune erreur récente trouvée"
	@echo ""
	@echo "$(BLUE)💾 Espace disque:$(NC)"
	@df -h . | head -2
	@echo ""
	@echo "$(BLUE)🔍 Problèmes courants:$(NC)"
	@echo "   • Conflits de ports: sudo netstat -tulpn | grep -E '(80|443|3000)'"
	@echo "   • Problèmes DNS: nslookup votre-domaine.com"
	@echo "   • SSL: curl -I https://localhost"
	@echo "   • Variables env: make check"
	@echo ""
	@echo "$(BLUE)📚 Ressources:$(NC)"
	@echo "   • Documentation: DEPLOYMENT.md"
	@echo "   • Setup GitHub: GITHUB-SETUP.md"
	@echo "   • Configuration: $(ENV_FILE)" 