import { apiClient } from "./client";
import type { ProductActivity } from "../types/product";
import type { Product } from "./types";
import nextAuthApiClient from "./nextauth-client";

/**
 * Service API pour la validation des produits (Admin)
 * Gère l'approbation, le rejet et l'historique des produits
 */

export interface PendingProductsResponse {
  data: Product[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  message: string;
  status: number;
  timestamp: string;
}

export interface ApproveProductRequest {
  comment?: string;
}

export interface RejectProductRequest {
  reason: string;
}

export interface ProductActivitiesResponse {
  data: ProductActivity[];
  message: string;
}

/**
 * Récupère les produits en attente de validation (Admin only)
 */
export async function getPendingProducts(params?: {
  page?: number;
  per_page?: number;
  manager_id?: number;
}): Promise<PendingProductsResponse> {
  const response = await nextAuthApiClient.get<PendingProductsResponse>(
    "/secured/products/pending",
    {
      params,
    }
  );
  return response.data;
}

/**
 * Approuve un produit (Admin only)
 */
export async function approveProduct(
  productId: number,
  data?: ApproveProductRequest
): Promise<{ data: Product; message: string }> {
  const response = await apiClient.post<{ data: Product; message: string }>(
    `/secured/products/${productId}/approve`,
    data
  );
  return response.data;
}

/**
 * Rejette un produit (Admin only)
 */
export async function rejectProduct(
  productId: number,
  data: RejectProductRequest
): Promise<{ data: Product; message: string }> {
  const response = await nextAuthApiClient.post<{ data: Product; message: string }>(
    `/secured/products/${productId}/reject`,
    data
  );
  return response.data;
}

/**
 * Récupère l'historique d'activités d'un produit
 */
export async function getProductActivities(
  productId: number
): Promise<ProductActivitiesResponse> {
  const response = await nextAuthApiClient.get<ProductActivitiesResponse>(
    `/secured/products/${productId}/activities`
  );
  return response.data;
}

/**
 * Approuve plusieurs produits en même temps (Admin only)
 */
export async function bulkApproveProducts(
  productIds: number[],
  comment?: string
): Promise<{ data: { approved: Product[]; errors: any[] }; message: string }> {
  const response = await nextAuthApiClient.post<{ data: { approved: Product[]; errors: any[] }; message: string }>(
    `/secured/products/bulk-approve`,
    { productIds, comment }
  );
  return response.data;
}

/**
 * Rejette plusieurs produits en même temps (Admin only)
 */
export async function bulkRejectProducts(
  productIds: number[],
  reason: string
): Promise<{ data: { rejected: Product[]; errors: any[] }; message: string }> {
  const response = await nextAuthApiClient.post<{ data: { rejected: Product[]; errors: any[] }; message: string }>(
    `/secured/products/bulk-reject`,
    { productIds, reason }
  );
  return response.data;
}
