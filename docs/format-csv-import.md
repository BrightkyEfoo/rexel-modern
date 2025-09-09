# Format CSV pour l'Import de Produits

## Structure des Colonnes

Voici les colonnes supportées dans votre fichier CSV/Excel :

### Informations de Base (Obligatoires)
- **name** : Nom du produit
- **description** : Description courte du produit
- **price** : Prix de vente (format numérique)

### Informations Optionnelles
- **longDescription** : Description détaillée
- **features** : Caractéristiques (séparées par des virgules)
- **applications** : Applications (séparées par des virgules)
- **sku** : Code SKU unique
- **salePrice** : Prix promotionnel
- **stockQuantity** : Quantité en stock
- **manageStock** : Gestion du stock (true/false)
- **inStock** : En stock (true/false)
- **isFeatured** : Produit vedette (true/false)
- **isActive** : Produit actif (true/false)
- **fabricationCountryCode** : Code pays de fabrication
- **weight** : Poids en kg
- **warranty** : Garantie

### Classification
- **brandName** : Nom de la marque
- **categoryNames** : Noms des catégories (séparées par des virgules)
- **certifications** : Certifications (séparées par des virgules)

### Dimensions
- **dimensions_length** : Longueur
- **dimensions_width** : Largeur
- **dimensions_height** : Hauteur

### Fichiers Multimédias (Optionnels)
- **imageUrls** : URLs des images (séparées par des virgules)
- **fileUrls** : URLs des fichiers (séparées par des virgules)

## Exemple de Structure CSV

```csv
name,description,price,brandName,categoryNames,imageUrls,fileUrls
"Produit Test","Description du produit",29.99,"Ma Marque","Catégorie 1,Catégorie 2","https://example.com/image1.jpg,https://example.com/image2.jpg","https://example.com/doc.pdf"
```

## Notes Importantes

1. **Séparateurs** : Utilisez des virgules pour séparer les valeurs multiples (catégories, images, fichiers, etc.)
2. **URLs** : Les images et fichiers doivent être des URLs accessibles publiquement
3. **Booléens** : Utilisez `true` ou `false` pour les valeurs booléennes
4. **Nombres** : Utilisez le point comme séparateur décimal (ex: 29.99)
5. **Encodage** : Assurez-vous que votre fichier est encodé en UTF-8
6. **Guillemets** : Utilisez des guillemets pour les valeurs contenant des virgules

## Téléchargement Automatique

Le système téléchargera automatiquement :
- Les images depuis les URLs fournies dans `imageUrls`
- Les fichiers depuis les URLs fournies dans `fileUrls`
- Stockage sécurisé dans MinIO

## Validation

Chaque produit sera validé selon les mêmes règles que le formulaire de création :
- Nom unique
- SKU unique (si fourni)
- Prix valide
- Catégories existantes
- URLs d'images/fichiers accessibles
