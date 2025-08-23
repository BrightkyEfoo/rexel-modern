/**
 * Utilitaires pour les produits
 */

export interface ProductCategory {
  id: string;
  name: string;
}

export interface ProductWithCategories {
  categories?: ProductCategory[];
}

/**
 * Récupère la première catégorie d'un produit (pour la compatibilité)
 */
export function getProductPrimaryCategory(product: ProductWithCategories): ProductCategory | undefined {
  return product.categories?.[0];
}

/**
 * Récupère toutes les catégories d'un produit
 */
export function getProductCategories(product: ProductWithCategories): ProductCategory[] {
  return product.categories || [];
}

/**
 * Vérifie si un produit appartient à une catégorie
 */
export function isProductInCategory(product: ProductWithCategories, categoryId: string): boolean {
  return product.categories?.some(cat => cat.id === categoryId) || false;
}

/**
 * Formate les noms de catégories pour l'affichage
 */
export function formatProductCategories(product: ProductWithCategories, separator: string = ', '): string {
  return product.categories?.map(cat => cat.name).join(separator) || '';
}
