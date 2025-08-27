"use client";

import { useState } from "react";
import { ProductFilters } from "./ProductFilters";
import { ProductsTable } from "./ProductsTable";
import { ProductFormDialog } from "./ProductFormDialog";
import type { ProductFilters as ProductFiltersType } from "@/lib/types/products";
import { useProducts } from "@/lib/hooks/useProducts";

export function ProductsManagement() {
  const [filters, setFilters] = useState<ProductFiltersType>({
    page: 1,
    per_page: 20,
    sort_by: "created_at",
    sort_order: "desc",
  });

  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // API
  const { data: productsResponse } = useProducts(filters);

  const handleFiltersChange = (newFilters: ProductFiltersType) => {
    setFilters(newFilters);
  };

  const handleCreateProduct = () => {
    setShowCreateDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Filtres et recherche */}
      <ProductFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onCreateProduct={handleCreateProduct}
        resultsCount={productsResponse?.meta?.total}
      />

      {/* Table des produits */}
      <ProductsTable
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Dialogue de création */}
      <ProductFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        mode="create"
      />
    </div>
  );
}
