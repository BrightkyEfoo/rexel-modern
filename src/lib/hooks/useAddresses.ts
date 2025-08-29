'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getUserAddresses, 
  createAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress,
  type Address,
  type CreateAddressData 
} from '@/lib/api/addresses';
// import { toast } from 'sonner';

/**
 * Hook pour récupérer les adresses de l'utilisateur
 */
export function useAddresses() {
  return useQuery({
    queryKey: ['user-addresses'],
    queryFn: () => getUserAddresses(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour créer une nouvelle adresse
 */
export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAddress,
    onSuccess: (newAddress) => {
      // Invalider tous les caches d'adresses
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
    },
    onError: (error: any) => {
      console.error('Erreur lors de la création de l\'adresse:', error);
      console.error(error?.response?.data?.message || 'Erreur lors de l\'ajout de l\'adresse');
    },
  });
}

/**
 * Hook pour mettre à jour une adresse
 */
export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAddressData> }) => 
      updateAddress(id, data),
    onSuccess: (updatedAddress) => {
      // Invalider tous les caches d'adresses
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
    },
    onError: (error: any) => {
      console.error('Erreur lors de la mise à jour de l\'adresse:', error);
      console.error(error?.response?.data?.message || 'Erreur lors de la mise à jour de l\'adresse');
    },
  });
}

/**
 * Hook pour supprimer une adresse
 */
export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: (_, deletedId) => {
      // Invalider tous les caches d'adresses
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
    },
    onError: (error: any) => {
      console.error('Erreur lors de la suppression de l\'adresse:', error);
      console.error(error?.response?.data?.message || 'Erreur lors de la suppression de l\'adresse');
    },
  });
}

/**
 * Hook pour définir une adresse par défaut
 */
export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, type }: { id: string; type: 'shipping' | 'billing' }) => 
      setDefaultAddress(id, type),
    onSuccess: (updatedAddress, { type }) => {
      // Invalider tous les caches d'adresses
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
    },
    onError: (error: any) => {
      console.error('Erreur lors de la définition de l\'adresse par défaut:', error);
      console.error(error?.response?.data?.message || 'Erreur lors de la mise à jour de l\'adresse');
    },
  });
}

/**
 * Hook pour les adresses filtrées par type (optimisé côté serveur)
 */
export function useAddressesByType(type: 'shipping' | 'billing') {
  return useQuery({
    queryKey: ['user-addresses', type],
    queryFn: () => getUserAddresses(type),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
