import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { CategoryFilters } from '@/lib/types/categories';

export function useCategoryManagementFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Construire les filtres à partir des paramètres d'URL
  const categoryFilters = useMemo((): CategoryFilters => {
    return {
      search: searchParams.get('search') || '',
      sort_by: searchParams.get('sort_by') || 'sortOrder',
      sort_order: (searchParams.get('sort_order') as 'asc' | 'desc') || 'asc',
      page: Number(searchParams.get('page')) || 1,
      per_page: Number(searchParams.get('per_page')) || 10,
      isActive: searchParams.get('isActive') === 'true' ? true : searchParams.get('isActive') === 'false' ? false : undefined,
      parentId: searchParams.get('parentId') ? Number(searchParams.get('parentId')) : undefined,
    };
  }, [searchParams]);

  // Fonction pour mettre à jour les filtres dans l'URL
  const updateFilters = useCallback((newFilters: Partial<CategoryFilters>) => {
    const params = new URLSearchParams(searchParams);
    
    // Réinitialiser à la page 1 quand on change les filtres (sauf pagination)
    if (!newFilters.page && Object.keys(newFilters).some(key => key !== 'page')) {
      params.set('page', '1');
    }

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    // Naviguer vers la nouvelle URL avec les filtres
    const newUrl = `/admin/categories?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [router, searchParams]);

  // Fonction pour réinitialiser la pagination
  const resetPagination = useCallback(() => {
    updateFilters({ page: 1 });
  }, [updateFilters]);

  // Fonction pour réinitialiser tous les filtres
  const clearFilters = useCallback(() => {
    router.replace('/admin/categories', { scroll: false });
  }, [router]);

  return {
    categoryFilters,
    updateFilters,
    resetPagination,
    clearFilters,
  };
}