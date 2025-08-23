import { nextAuthApi } from './nextauth-client';
import { AddressFormData } from '@/components/ui/address-form';

interface BackendApiResponse<T> {
  data: T;
  message?: string;
}

export interface Address {
  id: string;
  name: string;
  company?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
  type: 'shipping' | 'billing';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressData extends AddressFormData {
  type: 'shipping' | 'billing';
}

/**
 * Récupère toutes les adresses de l'utilisateur connecté
 */
export async function getUserAddresses(type?: 'shipping' | 'billing'): Promise<Address[]> {
  try {
    const params = type ? { type } : {};
    const response = await nextAuthApi.secured.get<BackendApiResponse<Address[]>>('/addresses', { params });
    return response.data.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des adresses:', error);
    throw error;
  }
}

/**
 * Crée une nouvelle adresse pour l'utilisateur connecté
 */
export async function createAddress(addressData: CreateAddressData): Promise<Address> {
  try {
    const response = await nextAuthApi.secured.post<BackendApiResponse<Address>>('/addresses', addressData);
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'adresse:', error);
    throw error;
  }
}

/**
 * Met à jour une adresse existante
 */
export async function updateAddress(addressId: string, addressData: Partial<CreateAddressData>): Promise<Address> {
  try {
    const response = await nextAuthApi.secured.put<BackendApiResponse<Address>>(`/addresses/${addressId}`, addressData);
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'adresse:', error);
    throw error;
  }
}

/**
 * Supprime une adresse
 */
export async function deleteAddress(addressId: string): Promise<void> {
  try {
    await nextAuthApi.secured.delete(`/addresses/${addressId}`);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'adresse:', error);
    throw error;
  }
}

/**
 * Définit une adresse comme adresse par défaut
 */
export async function setDefaultAddress(addressId: string, type: 'shipping' | 'billing'): Promise<Address> {
  try {
    const response = await nextAuthApi.secured.post<BackendApiResponse<Address>>(`/addresses/${addressId}/set-default`, { type });
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la définition de l\'adresse par défaut:', error);
    throw error;
  }
}
