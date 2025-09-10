"use client";

import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { useMemo, useCallback } from "react";
import type { BrandFilters } from "@/lib/types/brands";

export function useBrandFilters() {
  const [filters, setFilters] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    per_page: parseAsInteger.withDefault(20),
    sort_by: parseAsString.withDefault("name"),
    sort_order: parseAsString.withDefault("asc"),
    search: parseAsString.withDefault(""),
    is_active: parseAsString,
    is_featured: parseAsString,
  }, {
    history: "push",
    shallow: true,
    clearOnDefault: true,
  });

  const brandFilters: BrandFilters = useMemo(() => ({
    page: filters.page,
    per_page: filters.per_page,
    sort_by: filters.sort_by,
    sort_order: filters.sort_order as 'asc' | 'desc',
    search: filters.search || undefined,
    isActive: filters.is_active === 'true' ? true : filters.is_active === 'false' ? false : undefined,
    isFeatured: filters.is_featured === 'true' ? true : filters.is_featured === 'false' ? false : undefined,
  }), [
    filters.page,
    filters.per_page, 
    filters.sort_by,
    filters.sort_order,
    filters.search,
    filters.is_active,
    filters.is_featured
  ]);

  const updateFilters = useCallback((newFilters: Partial<BrandFilters>) => {
    const nuqsFilters: any = {};
    
    if (newFilters.page !== undefined) nuqsFilters.page = newFilters.page;
    if (newFilters.per_page !== undefined) nuqsFilters.per_page = newFilters.per_page;
    if (newFilters.sort_by !== undefined) nuqsFilters.sort_by = newFilters.sort_by;
    if (newFilters.sort_order !== undefined) nuqsFilters.sort_order = newFilters.sort_order;
    if (newFilters.search !== undefined) nuqsFilters.search = newFilters.search;
    if (newFilters.isActive !== undefined) nuqsFilters.is_active = newFilters.isActive?.toString();
    if (newFilters.isFeatured !== undefined) nuqsFilters.is_featured = newFilters.isFeatured?.toString();
    
    setFilters(nuqsFilters);
  }, [setFilters]);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      per_page: 20,
      sort_by: "name",
      sort_order: "asc",
      search: "",
      is_active: null,
      is_featured: null,
    });
  }, [setFilters]);

  const resetPagination = useCallback(() => {
    setFilters({ page: 1 });
  }, [setFilters]);

  return {
    brandFilters,
    updateFilters,
    resetFilters,
    resetPagination,
  };
}
