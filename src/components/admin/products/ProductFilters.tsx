"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Plus, Upload } from "lucide-react";
import type { ProductFilters } from "@/lib/types/products";
import { useCategories, useBrands } from "@/lib/query/hooks";

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: Partial<ProductFilters>) => void;
  onResetFilters?: () => void;
  onCreateProduct: () => void;
  onImportProducts: () => void;
  resultsCount?: number;
}

export function ProductFilters({
  filters,
  onFiltersChange,
  onResetFilters,
  onCreateProduct,
  onImportProducts,
  resultsCount,
}: ProductFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  
  // API hooks
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  // Synchroniser l'input de recherche avec les filtres
  useEffect(() => {
    setSearchInput(filters.search || "");
  }, [filters.search]);

  // Gérer la recherche avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({
          search: searchInput || undefined,
          page: 1, // Reset à la première page lors de la recherche
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput, filters.search, onFiltersChange]);

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    onFiltersChange({
      [key]: value === "all" ? undefined : value,
      page: 1, // Reset à la première page lors du changement de filtre
    });
  };

  const clearFilters = () => {
    setSearchInput("");
    if (onResetFilters) {
      onResetFilters();
    } else {
      // Fallback si onResetFilters n'est pas fourni
      onFiltersChange({
        search: undefined,
        categoryId: undefined,
        brandId: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        inStock: undefined,
        isFeatured: undefined,
        isActive: undefined,
        page: 1,
      });
    }
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.categoryId ||
    filters.brandId ||
    filters.isFeatured !== undefined ||
    filters.isActive !== undefined ||
    filters.inStock !== undefined
  );

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categoryId) count++;
    if (filters.brandId) count++;
    if (filters.isFeatured !== undefined) count++;
    if (filters.isActive !== undefined) count++;
    if (filters.inStock !== undefined) count++;
    return count;
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* En-tête avec recherche et bouton de création */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher par nom, SKU ou marque..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <Button onClick={onCreateProduct}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau produit
            </Button>
            <Button onClick={onImportProducts} variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Importer
            </Button>
          </div>
        </div>

        {/* Filtres */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Catégorie */}
          <Select
            value={filters.categoryId?.toString() || "all"}
            onValueChange={(value) => handleFilterChange("categoryId", value === "all" ? undefined : parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories?.data?.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Marque */}
          <Select
            value={filters.brandId?.toString() || "all"}
            onValueChange={(value) => handleFilterChange("brandId", value === "all" ? undefined : parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Marque" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les marques</SelectItem>
              {brands?.data?.map((brand) => (
                <SelectItem key={brand.id} value={brand.id.toString()}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Statut */}
          <Select
            value={filters.isActive === true ? "active" : filters.isActive === false ? "inactive" : "all"}
            onValueChange={(value) => 
              handleFilterChange("isActive", value === "all" ? undefined : value === "active")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
            </SelectContent>
          </Select>

          {/* Disponibilité */}
          <Select
            value={filters.inStock === true ? "in_stock" : filters.inStock === false ? "out_of_stock" : "all"}
            onValueChange={(value) => 
              handleFilterChange("inStock", value === "all" ? undefined : value === "in_stock")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="in_stock">En stock</SelectItem>
              <SelectItem value="out_of_stock">Rupture</SelectItem>
            </SelectContent>
          </Select>

          {/* Produits vedettes */}
          <Select
            value={filters.isFeatured === true ? "featured" : filters.isFeatured === false ? "not_featured" : "all"}
            onValueChange={(value) => 
              handleFilterChange("isFeatured", value === "all" ? undefined : value === "featured")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Vedette" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="featured">Vedette</SelectItem>
              <SelectItem value="not_featured">Normal</SelectItem>
            </SelectContent>
          </Select>

          {/* Tri */}
          <Select
            value={`${filters.sort_by || "created_at"}_${filters.sort_order || "desc"}`}
            onValueChange={(value) => {
              const [sort_by, sort_order] = value.split("_");
              onFiltersChange({
                ...filters,
                sort_by: sort_by as any,
                sort_order: sort_order as "asc" | "desc",
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name_asc">Nom A-Z</SelectItem>
              <SelectItem value="name_desc">Nom Z-A</SelectItem>
              <SelectItem value="price_asc">Prix croissant</SelectItem>
              <SelectItem value="price_desc">Prix décroissant</SelectItem>
              <SelectItem value="created_at_desc">Plus récent</SelectItem>
              <SelectItem value="created_at_asc">Plus ancien</SelectItem>
              <SelectItem value="stockQuantity_desc">Stock décroissant</SelectItem>
              <SelectItem value="stockQuantity_asc">Stock croissant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Résumé des filtres actifs */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  {getActiveFiltersCount()} filtre(s) actif(s)
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-6 px-2"
                >
                  <X className="w-3 h-3 mr-1" />
                  Effacer
                </Button>
              </>
            )}
          </div>
          
          {resultsCount !== undefined && (
            <div className="text-sm text-muted-foreground">
              {resultsCount} résultat{resultsCount !== 1 ? "s" : ""} trouvé{resultsCount !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
