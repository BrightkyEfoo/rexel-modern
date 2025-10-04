"use client";

import { useState } from "react";
import { ProductFilters } from "./ProductFilters";
import { ProductsTable } from "./ProductsTable";
import { ProductFormDialog } from "./ProductFormDialog";
import { ProductImportDialog } from "./ProductImportDialog";
import { useProductsSecured } from "@/lib/hooks/useProducts";
import { useProductFilters } from "@/lib/hooks/useProductFilters";

export function ProductsManagement() {
  // Gestion des filtres avec nuqs (synchronisé avec l'URL)
  const { filters, updateFilters, resetSearchFilters } = useProductFilters();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  // API - utilise la route sécurisée qui inclut tous les produits (y compris pending)
  const { data: productsResponse } = useProductsSecured(filters);

  const handleCreateProduct = () => {
    setShowCreateDialog(true);
  };

  const handleImportProducts = () => {
    setShowImportDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Filtres et recherche */}
      <ProductFilters
        filters={filters}
        onFiltersChange={updateFilters}
        onResetFilters={resetSearchFilters}
        onCreateProduct={handleCreateProduct}
        onImportProducts={handleImportProducts}
        resultsCount={productsResponse?.meta?.total}
      />

      {/* Table des produits */}
      <ProductsTable
        filters={filters}
        onFiltersChange={updateFilters}
      />

      {/* Dialogue de création */}
      <ProductFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        mode="create"
      />

      {/* Dialogue d'importation */}
      <ProductImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
      />
    </div>
  );
}
