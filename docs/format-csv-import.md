# Format Excel/CSV pour l'Import de Produits

## Template Excel Recommandé

Pour faciliter l'import de vos produits, nous recommandons d'utiliser le template Excel officiel qui contient déjà tous les champs correctement formatés.

**📥 [Télécharger le template Excel](../public/exemple_produits.xlsx)**

Ce template contient des exemples de produits avec toutes les colonnes et le bon formatage.

### Avantages du Format Excel
- ✅ **Formatage automatique** : Pas de problèmes d'encodage ou de séparateurs
- ✅ **Validation intégrée** : Excel détecte les erreurs de format
- ✅ **Interface familière** : Plus facile à utiliser que les éditeurs de texte
- ✅ **Formules** : Possibilité d'utiliser des formules pour calculer les prix
- ✅ **Aperçu visuel** : Voir immédiatement le contenu formaté

## Structure des Colonnes

Voici les colonnes supportées dans votre fichier Excel/CSV :

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

## Formats Supportés

### Excel (Recommandé)
- **XLSX** : Format Excel moderne (recommandé)
- **XLS** : Format Excel classique

### CSV (Alternative)
- **CSV** : Fichier texte avec séparateurs virgules

## Exemple de Structure

Le template Excel contient des exemples complets, mais voici un aperçu de la structure :

```csv
name,description,price,brandName,categoryNames,imageUrls,fileUrls
"Câble H07V-K 2.5mm² Bleu","Câble électrique souple",12.50,"Samsung","Électronique,Câbles","https://example.com/cable.jpg","https://example.com/datasheet.pdf"
```

## Notes Importantes

1. **Template Excel** : Utilisez le template officiel pour éviter les erreurs de formatage
2. **Séparateurs** : Utilisez des virgules pour séparer les valeurs multiples (catégories, images, fichiers, etc.)
3. **URLs** : Les images et fichiers doivent être des URLs accessibles publiquement
4. **Booléens** : Utilisez `true` ou `false` pour les valeurs booléennes
5. **Nombres** : Utilisez le point comme séparateur décimal (ex: 29.99)
6. **Encodage** : Assurez-vous que votre fichier est encodé en UTF-8
7. **Guillemets** : Utilisez des guillemets pour les valeurs contenant des virgules (automatique dans Excel)

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
