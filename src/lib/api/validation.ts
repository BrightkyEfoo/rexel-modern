import { nextAuthApiClient } from './nextauth-client';

export interface UniqueValidationResponse {
  unique: boolean;
  message: string;
}

export interface UniqueValidationRequest {
  value: string;
  entityId?: number; // Pour exclure l'entité actuelle en mode édition
}

/**
 * Vérifie l'unicité d'un SKU produit
 */
export async function validateProductSkuUnique(sku: string, productId?: number): Promise<UniqueValidationResponse> {
  try {
    const response = await nextAuthApiClient.post<UniqueValidationResponse>('/secured/products/validate/sku', {
      sku: sku.trim(),
      productId
    });
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la validation du SKU');
  }
}

/**
 * Vérifie l'unicité d'un nom de produit
 */
export async function validateProductNameUnique(name: string, productId?: number): Promise<UniqueValidationResponse> {
  try {
    const response = await nextAuthApiClient.post<UniqueValidationResponse>('/secured/products/validate/name', {
      name: name.trim(),
      productId
    });
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la validation du nom');
  }
}

/**
 * Vérifie l'unicité d'un nom de catégorie
 */
export async function validateCategoryNameUnique(name: string, categoryId?: number): Promise<UniqueValidationResponse> {
  try {
    const response = await nextAuthApiClient.post<UniqueValidationResponse>('/secured/categories/validate/name', {
      name: name.trim(),
      categoryId
    });
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la validation du nom de catégorie');
  }
}

/**
 * Vérifie l'unicité d'un nom de marque
 */
export async function validateBrandNameUnique(name: string, brandId?: number): Promise<UniqueValidationResponse> {
  try {
    const response = await nextAuthApiClient.post<UniqueValidationResponse>('/secured/brands/validate/name', {
      name: name.trim(),
      brandId
    });
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la validation du nom de marque');
  }
}
