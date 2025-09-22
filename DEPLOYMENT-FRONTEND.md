# 🚀 KesiMarket Frontend - Déploiement en Production

Ce guide explique comment déployer le frontend KesiMarket en production en utilisant le script de déploiement automatisé.

## 📋 Prérequis

### Sur votre machine locale :
- Docker installé et fonctionnel
- Git
- Node.js et npm/yarn (pour les builds locaux)
- Accès SSH à votre serveur de production
- Clé SSH configurée pour l'accès au serveur

### Sur le serveur de production :
- Système Linux (Ubuntu/Debian recommandé)
- Accès SSH avec privilèges sudo
- Docker et Docker Compose installés (le script peut les installer automatiquement)
- Réseau partagé `kesimarket-net` (créé lors du déploiement backend)

## ⚙️ Configuration

### 1. Préparer la configuration de déploiement

```bash
# Copier le template de configuration
cp deploy-frontend.env.template deploy-frontend.env

# Éditer le fichier avec vos valeurs
nano deploy-frontend.env
```

### 2. Remplir les variables d'environnement

Ouvrez `deploy-frontend.env` et remplissez toutes les variables requises :

#### Configuration du serveur
```bash
VPS_HOST=votre.serveur.ip
VPS_USER=votre_utilisateur
VPS_SSH_KEY_PATH=/chemin/vers/votre/cle/ssh
VPS_SUDO_PASSWORD=votre_mot_de_passe_sudo
```

#### Configuration de l'application
```bash
ENVIRONMENT=production  # ou staging
NEXT_PUBLIC_APP_NAME=KesiMarket
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### Sécurité
```bash
NEXTAUTH_SECRET=secret_nextauth_32_caracteres
```

### 3. Générer les secrets de sécurité

```bash
# Générer un secret NextAuth
openssl rand -base64 32
```

## 🚀 Déploiement

### 1. Rendre le script exécutable

```bash
chmod +x deploy-frontend.sh
```

### 2. Lancer le déploiement

#### Déploiement en production
```bash
./deploy-frontend.sh
```

#### Déploiement en staging
```bash
./deploy-frontend.sh --environment staging
```

#### Options avancées
```bash
# Reconstruire le cache Next.js
./deploy-frontend.sh --rebuild-cache

# Ignorer le check de santé
./deploy-frontend.sh --skip-health

# Déploiement staging avec cache rebuild
./deploy-frontend.sh --environment staging --rebuild-cache

# Voir toutes les options
./deploy-frontend.sh --help
```

## 📊 Processus de déploiement

Le script effectue automatiquement les étapes suivantes :

1. **Test de connexion SSH** - Vérifie l'accès au serveur
2. **Préparation des répertoires** - Crée les dossiers nécessaires sur le VPS
3. **Configuration Docker** - Installe/configure Docker et le réseau partagé
4. **Création du fichier d'environnement** - Génère `.env.production` selon l'environnement
5. **Construction de l'image Docker** - Build l'image du frontend Next.js
6. **Transfert des fichiers** - Envoie l'image et les fichiers de config sur le VPS
7. **Déploiement du service** - Lance le conteneur frontend avec Docker Compose
8. **Vérification de santé** - Teste que le service fonctionne correctement
9. **Nettoyage** - Supprime les fichiers temporaires

## 🔍 Vérification du déploiement

### Vérifier les conteneurs Docker

```bash
ssh -i /chemin/vers/cle utilisateur@serveur
cd ~/kesimarket/frontend
docker ps -f name=kesimarket-frontend-
```

### Vérifier les logs

```bash
# Logs du frontend
docker compose -f docker-compose.prod.yml logs frontend

# Logs en temps réel
docker compose -f docker-compose.prod.yml logs -f frontend
```

### Tester l'application

```bash
# Test de santé (si disponible)
curl https://votre-domaine.com/api/health

# Test de la page d'accueil
curl -I https://votre-domaine.com
```

## 🌐 URLs et Environnements

### Production
- **Frontend** : https://kesimarket.com
- **API** : https://api.kesimarket.com
- **CDN** : https://cdn.kesimarket.com
- **Assets** : https://assets.kesimarket.com

### Staging
- **Frontend** : https://staging.kesimarket.com
- **API** : https://staging-api.kesimarket.com
- **CDN** : https://staging-cdn.kesimarket.com
- **Assets** : https://staging-assets.kesimarket.com

## 🛠️ Gestion des services

### Arrêter le frontend

```bash
ssh -i /chemin/vers/cle utilisateur@serveur
cd ~/kesimarket/frontend
docker compose -f docker-compose.prod.yml down
```

### Redémarrer le frontend

```bash
docker compose -f docker-compose.prod.yml up -d frontend
```

### Voir les métriques

```bash
# Utilisation des ressources
docker stats kesimarket-frontend-prod

# Logs de performance
docker compose -f docker-compose.prod.yml logs frontend | grep -E "ready|build|error"
```

## 🔧 Dépannage

### Problèmes courants

#### 1. Erreur de réseau Docker
```bash
# Vérifiez que le réseau partagé existe
docker network ls | grep kesimarket-net

# Recréez le réseau si nécessaire
docker network create kesimarket-net --driver bridge
```

#### 2. Problème de build Next.js
```bash
# Vérifiez les variables d'environnement
cat .env.production

# Nettoyez le cache Next.js
./deploy-frontend.sh --rebuild-cache
```

#### 3. Erreur de connexion à l'API
```bash
# Vérifiez que le backend est déployé
docker ps -f name=kesimarket-backend-

# Testez la connectivité réseau
docker exec kesimarket-frontend-prod ping kesimarket-backend-prod
```

#### 4. Problème de certificats SSL
```bash
# Vérifiez la configuration du reverse proxy
# (géré par le déploiement backend)
curl -I https://votre-domaine.com
```

### Commandes utiles

```bash
# Voir l'utilisation des ressources
docker stats --no-stream

# Nettoyer les images inutilisées
docker system prune -f

# Redéployer rapidement (sans rebuild)
./deploy-frontend.sh --skip-health

# Voir l'espace disque
df -h

# Logs détaillés du déploiement
./deploy-frontend.sh 2>&1 | tee deployment.log
```

## 🔄 Mise à jour

Pour mettre à jour le frontend :

1. **Pousser vos changements** sur Git
2. **Relancer le script** de déploiement
3. Le script créera automatiquement une **sauvegarde** de l'ancienne version

```bash
git push origin main
./deploy-frontend.sh
```

## 📦 Structure des répertoires

```
~/kesimarket/frontend/
├── backups/                    # Sauvegardes des anciennes images
├── images/                     # Images Docker actuelles
├── data/                       # Données persistantes de l'application
├── docker-compose.prod.yml     # Configuration Docker Compose
└── .env.production            # Variables d'environnement
```

## 🔗 Intégration avec le backend

Le frontend communique avec le backend via :

1. **Réseau Docker partagé** : `kesimarket-net`
2. **URL interne** : `http://kesimarket-backend-prod:3333`
3. **URL externe** : `https://api.kesimarket.com` (via reverse proxy)

Assurez-vous que le backend est déployé **avant** le frontend pour garantir la connectivité.

## 🛡️ Sécurité

### Recommandations importantes :

1. **Ne jamais commiter `deploy-frontend.env`** - Ajoutez-le à `.gitignore`
2. **Utilisez des secrets forts** pour NextAuth et autres services
3. **Configurez HTTPS** en production
4. **Surveillez les logs** pour détecter les activités suspectes
5. **Mettez à jour régulièrement** les dépendances

### Variables sensibles à protéger :
- `NEXTAUTH_SECRET`
- Clés API (Google, GitHub, Stripe, etc.)
- Clés de services tiers
- Mots de passe SMTP

## 📞 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les logs** des conteneurs
2. **Consultez cette documentation**
3. **Testez la connectivité** réseau et SSH
4. **Vérifiez la configuration** des variables d'environnement
5. **Assurez-vous** que le backend est opérationnel

---

**Note importante** : Ce script remplace complètement le workflow GitHub Actions pour le frontend. Déployez d'abord le backend, puis le frontend pour une configuration complète.

## 🔗 Liens utiles

- [Documentation Next.js](https://nextjs.org/docs)
- [Docker Compose](https://docs.docker.com/compose/)
- [NextAuth.js](https://next-auth.js.org/)
- [Guide du backend](../rexel-modern-backend/DEPLOYMENT.md)
