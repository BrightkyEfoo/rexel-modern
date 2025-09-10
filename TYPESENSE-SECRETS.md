# Variables d'environnement Typesense pour GitHub Actions - Frontend

## Secrets frontend à ajouter dans GitHub

Pour que le déploiement frontend fonctionne avec Typesense, ajoutez ces secrets dans GitHub :

### `NEXT_PUBLIC_TYPESENSE_HOST`
**Description**: Hostname public de Typesense  
**Valeur**: `your-domain.com` ou `api.kesimarket.com`  
**Utilisation**: Connexion du frontend à Typesense via l'internet public  

### `NEXT_PUBLIC_TYPESENSE_PORT`
**Description**: Port public de Typesense  
**Valeur**: `8108` (ou `443` si derrière un reverse proxy HTTPS)  
**Utilisation**: Port de connexion pour les requêtes frontend  

### `NEXT_PUBLIC_TYPESENSE_PROTOCOL`
**Description**: Protocole de connexion  
**Valeur**: `https` (production) ou `http` (développement)  
**Utilisation**: Définit le protocole de connexion  

### `NEXT_PUBLIC_TYPESENSE_API_KEY`
**Description**: Clé API publique Typesense (lecture seule)  
**Valeur**: Même valeur que `TYPESENSE_API_KEY` du backend  
**Utilisation**: Authentification des requêtes de recherche depuis le frontend  

## Configuration pour la production

```bash
# Production
NEXT_PUBLIC_TYPESENSE_HOST=api.kesimarket.com
NEXT_PUBLIC_TYPESENSE_PORT=8108
NEXT_PUBLIC_TYPESENSE_PROTOCOL=https
NEXT_PUBLIC_TYPESENSE_API_KEY=xyz123abc456def789
```

## Configuration pour le staging

```bash
# Staging
NEXT_PUBLIC_TYPESENSE_HOST=staging-api.kesimarket.com
NEXT_PUBLIC_TYPESENSE_PORT=8108
NEXT_PUBLIC_TYPESENSE_PROTOCOL=https
NEXT_PUBLIC_TYPESENSE_API_KEY=xyz123abc456def789
```

## Notes de sécurité

⚠️ **Important**: La clé API Typesense sera visible côté client. Assurez-vous que :
1. Typesense est configuré pour n'autoriser que les opérations de lecture avec cette clé
2. Les règles CORS sont correctement configurées
3. L'accès est limité aux domaines autorisés

## Reverse Proxy

En production, il est recommandé de configurer un reverse proxy (nginx) pour :
- Exposer Typesense via HTTPS
- Gérer les certificats SSL
- Implémenter des règles de sécurité supplémentaires
