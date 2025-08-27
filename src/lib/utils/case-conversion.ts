/**
 * Utilitaires pour convertir entre camelCase et snake_case
 * Nécessaire car le backend utilise snake_case et le frontend camelCase
 */

/**
 * Convertit une string camelCase en snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Convertit une string snake_case en camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * Convertit récursivement les clés d'un objet de camelCase en snake_case
 */
export function objectCamelToSnake<T = any>(obj: any): T {
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => objectCamelToSnake(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = camelToSnake(key);
      result[snakeKey] = objectCamelToSnake(value);
    }
    return result;
  }
  
  return obj;
}

/**
 * Convertit récursivement les clés d'un objet de snake_case en camelCase
 */
export function objectSnakeToCamel<T = any>(obj: any): T {
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => objectSnakeToCamel(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = snakeToCamel(key);
      result[camelKey] = objectSnakeToCamel(value);
    }
    return result;
  }
  
  return obj;
}

/**
 * Convertit les paramètres de filtres frontend (camelCase) en paramètres backend (snake_case)
 */
export function convertFiltersToSnakeCase(filters: Record<string, any>): Record<string, any> {
  const converted: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      const snakeKey = camelToSnake(key);
      converted[snakeKey] = value;
    }
  }
  
  return converted;
}

/**
 * Mappings spécifiques pour les filtres de produits
 */
export const PRODUCT_FILTER_MAPPINGS = {
  // Frontend -> Backend
  categoryId: 'category_id',
  brandId: 'brand_id',
  sortBy: 'sort_by',
  sortOrder: 'sort_order',
  priceMin: 'price_min',
  priceMax: 'price_max',
  inStock: 'in_stock',
  isFeatured: 'is_featured',
  isActive: 'is_active',
  // Pagination
  perPage: 'per_page',
} as const;

/**
 * Mappings spécifiques pour les filtres de catégories
 */
export const CATEGORY_FILTER_MAPPINGS = {
  parentId: 'parent_id',
  sortBy: 'sort_by',
  sortOrder: 'sort_order',
  isActive: 'is_active',
  perPage: 'per_page',
} as const;

/**
 * Mappings spécifiques pour les filtres de marques
 */
export const BRAND_FILTER_MAPPINGS = {
  sortBy: 'sort_by',
  sortOrder: 'sort_order',
  isActive: 'is_active',
  isFeatured: 'is_featured',
  perPage: 'per_page',
} as const;

/**
 * Convertit les filtres de produits
 */
export function convertProductFilters(filters: Record<string, any>): Record<string, any> {
  const converted: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      const backendKey = PRODUCT_FILTER_MAPPINGS[key as keyof typeof PRODUCT_FILTER_MAPPINGS] || camelToSnake(key);
      converted[backendKey] = value;
    }
  }
  
  return converted;
}

/**
 * Convertit les filtres de catégories
 */
export function convertCategoryFilters(filters: Record<string, any>): Record<string, any> {
  const converted: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      const backendKey = CATEGORY_FILTER_MAPPINGS[key as keyof typeof CATEGORY_FILTER_MAPPINGS] || camelToSnake(key);
      converted[backendKey] = value;
    }
  }
  
  return converted;
}

/**
 * Convertit les filtres de marques
 */
export function convertBrandFilters(filters: Record<string, any>): Record<string, any> {
  const converted: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      const backendKey = BRAND_FILTER_MAPPINGS[key as keyof typeof BRAND_FILTER_MAPPINGS] || camelToSnake(key);
      converted[backendKey] = value;
    }
  }
  
  return converted;
}
