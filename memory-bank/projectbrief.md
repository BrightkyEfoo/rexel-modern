# Project Brief - Rexel Modern

## Vue d'ensemble
Rexel Modern est une application e-commerce moderne développée avec Next.js et AdonisJS, destinée à remplacer l'ancien système avec une architecture clean et moderne.

## Objectifs principaux
1. **Frontend Next.js** : Interface utilisateur moderne et responsive
2. **Backend AdonisJS** : API REST robuste avec architecture clean
3. **Base de données PostgreSQL** : Stockage fiable et performant
4. **Stockage MinIO** : Gestion des fichiers et médias
5. **Authentification JWT** : Sécurité moderne côté client et serveur

## Fonctionnalités clés
- Catalogue de produits avec catégories et marques
- Gestion des utilisateurs et authentification
- Panier et commandes
- Upload et gestion des fichiers
- Administration complète
- Slugs automatiques pour SEO
- Architecture modulaire et extensible

## Contraintes techniques
- Architecture Clean (SOLID, DRY, POO)
- Pattern Repository pour l'accès aux données
- Services pour la logique métier
- Validation stricte des données
- Sécurité par préfixes d'URL (/secured vs /opened)

## Stack technique
- **Frontend** : Next.js 15, TypeScript, TailwindCSS, Shadcn/ui
- **Backend** : AdonisJS 6, TypeScript, Lucid ORM
- **Base de données** : PostgreSQL
- **Stockage** : MinIO (S3-compatible)
- **Authentification** : NextAuth.js + JWT
- **Requêtes** : React Query (TanStack)

## Critères de succès
- API RESTful complète et documentée
- Interface utilisateur moderne et responsive
- Performance optimale (chargement < 2s)
- Sécurité robuste
- Code maintenable et extensible
- Tests unitaires et d'intégration 