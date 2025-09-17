"use client";

import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { useMemo, useCallback } from "react";
import type { CategoryFilters } from "@/lib/types/categories";

export function useCategoryManagementFilters() {
  const [filters, setFilters] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    per_page: parseAsInteger.withDefault(20),
    sort_by: parseAsString.withDefault("sortOrder"),
    sort_order: parseAsString.withDefault("asc"),
    search: parseAsString.withDefault(""),
    parent_id: parseAsInteger,
    is_active: parseAsString,
  }, {
    history: "push",
    shallow: true,
    clearOnDefault: true,
  });

  const categoryFilters: CategoryFilters = useMemo(() => ({
    page: filters.page,
    per_page: filters.per_page,
    sort_by: filters.sort_by,
    sort_order: filters.sort_order as 'asc' | 'desc',
    search: filters.search || undefined,
    parentId: filters.parent_id || undefined,
    isActive: filters.is_active === 'true' ? true : filters.is_active === 'false' ? false : undefined,
  }), [
    filters.page,
    filters.per_page, 
    filters.sort_by,
    filters.sort_order,
    filters.search,
    filters.parent_id,
    filters.is_active
  ]);

  const updateFilters = useCallback((newFilters: Partial<CategoryFilters>) => {
    const nuqsFilters: any = {};
    
    if (newFilters.page !== undefined) nuqsFilters.page = newFilters.page;
    if (newFilters.per_page !== undefined) nuqsFilters.per_page = newFilters.per_page;
    if (newFilters.sort_by !== undefined) nuqsFilters.sort_by = newFilters.sort_by;
    if (newFilters.sort_order !== undefined) nuqsFilters.sort_order = newFilters.sort_order;
    if (newFilters.search !== undefined) nuqsFilters.search = newFilters.search;
    if (newFilters.parentId !== undefined) nuqsFilters.parent_id = newFilters.parentId;
    if (newFilters.isActive !== undefined) nuqsFilters.is_active = newFilters.isActive?.toString();
    
    setFilters(nuqsFilters);
  }, [setFilters]);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      per_page: 20,
      sort_by: "sortOrder",
      sort_order: "asc",
      search: "",
      parent_id: null,
      is_active: null,
    });
  }, [setFilters]);

  const resetPagination = useCallback(() => {
    setFilters({ page: 1 });
  }, [setFilters]);

  return {
    categoryFilters,
    updateFilters,
    resetFilters,
    resetPagination,
  };
}