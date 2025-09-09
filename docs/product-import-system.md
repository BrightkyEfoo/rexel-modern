# Système d'Importation de Produits

## Vue d'ensemble

Le système d'importation de produits permet aux administrateurs d'importer des produits en masse via des fichiers CSV ou Excel, avec téléchargement automatique des images depuis des URLs.

## Fonctionnalités

### 🔧 Configuration Flexible
- **Prévisualisation** : Activer/désactiver la prévisualisation avant import
- **Édition** : Permettre la modification des produits avant validation
- **Suppression** : Permettre la désélection de produits avant import

### 📁 Formats Supportés
- **CSV** : Format principal avec séparateur virgule
- **Excel** : Support prévu (nécessite SheetJS)
- **Collage direct** : Zone de texte pour coller du contenu CSV

### 🔍 Validation Avancée
- Vérification du schéma CSV (colonnes requises/optionnelles)
- Validation des types de données (prix, quantités, booléens)
- Détection des doublons (par SKU et nom)
- Messages d'erreur contextuels par ligne

### 🖼️ Gestion Automatique des Images
- Téléchargement depuis URLs (max 10 par produit)
- Validation des formats (jpg, jpeg, png, gif, webp)
- Vérification de la taille (max 10MB)
- Sauvegarde automatique dans MinIO
- Gestion des erreurs de téléchargement

### 🏷️ Création Automatique
- **Marques** : Création automatique si inexistante
- **Catégories** : Création automatique avec support multi-catégories
- **Slugs** : Génération automatique unique pour tous les éléments

## Structure CSV

### Colonnes Requises
- `name` : Nom du produit (1-255 caractères)
- `price` : Prix en euros (nombre positif)
- `stockQuantity` : Quantité en stock (nombre entier ≥ 0)

### Colonnes Optionnelles
- `description` : Description complète
- `shortDescription` : Description courte (max 500 caractères)
- `sku` : Référence produit (max 100 caractères)
- `salePrice` : Prix de vente (nombre positif)
- `brandName` : Nom de la marque (max 100 caractères)
- `categoryNames` : Noms des catégories séparés par virgules
- `imageUrls` : URLs des images séparées par virgules (max 10)
- `isFeatured` : Produit vedette (true/false)
- `isActive` : Produit actif (true/false, défaut: true)

### Exemple CSV
```csv
name,description,shortDescription,sku,price,salePrice,stockQuantity,brandName,categoryNames,imageUrls,isFeatured,isActive
"Smartphone Galaxy Pro","Smartphone haut de gamme avec écran OLED","Smartphone premium","SMART001",899.99,799.99,25,"Samsung","Électronique,Smartphones","https://example.com/image1.jpg,https://example.com/image2.jpg",true,true
```

## Utilisation

### 1. Accès à l'Interface
- Aller dans **Dashboard Admin > Produits**
- Cliquer sur le bouton **"Importer"** à côté de "Nouveau produit"

### 2. Configuration
- **Prévisualisation** : Recommandé pour vérifier les données avant import
- **Édition** : Permet de modifier les produits dans la prévisualisation
- **Suppression** : Permet de désélectionner des produits avant validation

### 3. Import des Données

#### Option A : Upload de Fichier
1. Cliquer sur la zone de drop ou sélectionner un fichier
2. Formats acceptés : `.csv`, `.xlsx`, `.xls`
3. Le fichier sera automatiquement analysé

#### Option B : Collage CSV
1. Aller dans l'onglet "Coller du contenu CSV"
2. Coller le contenu CSV dans la zone de texte
3. Cliquer sur "Traiter le CSV"

### 4. Prévisualisation (si activée)
- Vérifier la liste des produits détectés
- Consulter les erreurs de validation (icônes rouge/vert)
- Sélectionner/désélectionner les produits à importer
- Voir les statistiques : Total, Valides, Invalides, Sélectionnés

### 5. Validation Finale
- Cliquer sur **"Importer X produits"**
- Suivre la progression dans la barre de chargement
- Consulter les résultats et notifications

## Messages de Résultats

### Types de Messages
- **Succès** : `X produits importés avec succès !`
- **Erreurs** : `Import terminé avec des erreurs: X succès, Y échecs`
- **Warnings** : Messages d'avertissement (ex: images partiellement traitées)

### Gestion des Erreurs Communes
- **Produit existant** : Détecté par SKU ou nom identique
- **Champ requis manquant** : Nom, prix ou stock non fourni
- **Format invalide** : Prix ou stock non numérique
- **Image inaccessible** : URL invalide ou serveur inaccessible
- **Image trop volumineuse** : Taille > 10MB

## Limites et Contraintes

### Limites Techniques
- **1000 produits maximum** par importation
- **10 images maximum** par produit
- **10MB maximum** par image
- **30 secondes timeout** par image
- **500 caractères maximum** pour shortDescription

### Formats d'Images Supportés
- JPG/JPEG
- PNG
- GIF
- WebP

### Sécurité
- Authentification admin requise
- Validation stricte des URLs d'images
- Vérification des types MIME
- Timeout automatique pour éviter les blocages

## API Endpoints

### Import en Masse
```http
POST /api/v1/secured/products/import
Authorization: Bearer <token>
Content-Type: application/json

{
  "products": [
    {
      "name": "Produit Test",
      "price": 29.99,
      "stockQuantity": 100,
      "brandName": "Marque Test",
      "categoryNames": "Catégorie 1,Catégorie 2",
      "imageUrls": "https://example.com/image.jpg"
    }
  ]
}
```

### Exemple de Structure
```http
GET /api/v1/secured/products/import/example
Authorization: Bearer <token>
```

## Dépannage

### Problèmes Courants

#### "Colonnes requises manquantes"
- Vérifier que `name`, `price` et `stockQuantity` sont présents
- Vérifier l'orthographe exacte des en-têtes de colonnes

#### "Image non téléchargée"
- Vérifier que l'URL est accessible publiquement
- Vérifier le format de l'image (jpg, png, gif, webp)
- Vérifier la taille de l'image (< 10MB)

#### "Produit déjà existant"
- Un produit avec le même SKU ou nom existe déjà
- Modifier le SKU ou le nom pour éviter les doublons

#### "Timeout lors du téléchargement"
- L'URL de l'image met trop de temps à répondre (> 30s)
- Vérifier la vitesse du serveur hébergeant l'image

### Logs et Debugging
- Les erreurs détaillées sont affichées dans les notifications
- Consulter les logs serveur pour les erreurs techniques
- Utiliser le mode prévisualisation pour identifier les problèmes

## Bonnes Pratiques

### Préparation des Données
1. **Tester avec un petit échantillon** (5-10 produits) avant l'import complet
2. **Vérifier les URLs d'images** en les testant manuellement
3. **Utiliser des SKUs uniques** pour éviter les doublons
4. **Préparer les noms de marques/catégories** de manière cohérente

### Performance
1. **Limiter à 100-200 produits** par batch pour de meilleures performances
2. **Utiliser des images optimisées** (< 1MB recommandé)
3. **Éviter les heures de pointe** pour les gros imports

### Sécurité
1. **Vérifier les sources d'images** (domaines de confiance)
2. **Tester en environnement de développement** avant la production
3. **Faire des sauvegardes** avant les gros imports

## Support Excel (À venir)

Le support des fichiers Excel (.xlsx, .xls) nécessite l'installation de SheetJS :

```bash
npm install xlsx
```

Une fois installé, les fichiers Excel seront automatiquement convertis en CSV pour le traitement.
