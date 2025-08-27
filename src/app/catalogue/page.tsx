"use client";

import { FilterContent } from "@/components/category/FilterContent";
import { ProductGrid } from "@/components/category/ProductGrid";
import { ProductPagination } from "@/components/category/ProductPagination";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { SearchFilters } from "@/lib/api/types";
import { useAuth } from "@/lib/auth/nextauth-hooks";
import { useProducts } from "@/lib/query/hooks";
import { useCategoryFilters } from "@/lib/hooks/useCategoryFilters";
import { Filter, Grid3X3, List } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SortOption = "popularity" | "price" | "name" | "newest";
type AvailabilityOption = "in_stock" | "out_of_stock" | "limited";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popularity", label: "Popularité" },
  { value: "price", label: "Prix" },
  { value: "name", label: "Nom" },
  { value: "newest", label: "Plus récent" },
];

const AVAILABILITY_OPTIONS: { value: AvailabilityOption; label: string }[] = [
  { value: "in_stock", label: "En stock" },
  { value: "limited", label: "Stock limité" },
  { value: "out_of_stock", label: "Rupture de stock" },
];

export default function CataloguePage() {
  const { user, isAuthenticated } = useAuth();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Utiliser le hook personnalisé pour gérer les filtres avec URL et debounce
  const { filters, updateFilters, clearFilters } = useCategoryFilters({
    categorySlug: "", // Utiliser "catalogue" comme slug pour différencier
    priceRange,
    baseUrl: "/catalogue",
  });

  // Get data - utiliser useProducts pour récupérer tous les produits
  const { data: productsResponse, isLoading: productsLoading } = useProducts(filters);

  // Handle price range changes avec debounce automatique
  const handlePriceRangeChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
    // Le debounce est géré automatiquement dans useCategoryFilters
  };

  const hasProducts =
    productsResponse?.data && productsResponse.data.length > 0;

  const handleClearFilters = () => {
    clearFilters();
    setPriceRange([0, 1000]);
  };

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-primary-dark">
            Accueil
          </Link>
          <span>/</span>
          <span className="text-gray-900">Catalogue</span>
        </nav>

        {/* Catalogue Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Catalogue complet
          </h1>
          <p className="text-gray-600 mb-6">
            Découvrez notre gamme complète de produits électriques et solutions professionnelles
          </p>

          {/* Compteur de produits seulement s'il y en a */}
          {hasProducts && (
            <div className="text-sm text-gray-500 mt-6">
              {productsResponse?.meta?.total || 0} produits disponibles
            </div>
          )}
        </div>

        {/* Section produits - affichée seulement s'il y a des produits */}
        {hasProducts && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              {/* Mobile Filter Button - Sticky */}
              <div className="lg:hidden mb-4 sticky z-40 bg-background/95 backdrop-blur-sm pb-4" style={{ top: '180px' }}>
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full shadow-sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtres
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filtres</SheetTitle>
                    </SheetHeader>
                    <FilterContent
                      categoryData={null} // Pas de catégorie spécifique pour le catalogue
                      filters={filters}
                      priceRange={priceRange}
                      onFilterChange={updateFilters}
                      onPriceChange={handlePriceRangeChange}
                      onClearFilters={handleClearFilters}
                    />
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop Filters - Sticky */}
              <div className="hidden lg:block sticky max-h-[calc(100vh-180px)] overflow-y-auto" style={{ top: '180px' }}>
                <div className="bg-background/95 backdrop-blur-sm rounded-lg border border-border/50 p-4 shadow-sm">
                  <FilterContent
                    categoryData={null} // Pas de catégorie spécifique pour le catalogue
                    filters={filters}
                    priceRange={priceRange}
                    onFilterChange={updateFilters}
                    onPriceChange={handlePriceRangeChange}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="lg:w-3/4">
              {/* Titre de section produits */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Tous nos produits
                </h2>
                <p className="text-gray-600">
                  Explorez notre catalogue complet de solutions électriques
                </p>
              </div>

              {/* View Controls - Sticky */}
              <div className="sticky z-30 bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg p-4 mb-6 shadow-sm" style={{ top: '180px' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>

                  <Select
                    value={filters.sortBy}
                    onValueChange={(value: SortOption) =>
                      updateFilters({ sortBy: value })
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products Grid */}
              <ProductGrid
                products={productsResponse?.data || []}
                viewMode={viewMode}
                isLoading={productsLoading}
              />

              {/* Pagination */}
              {productsResponse?.meta && (
                <div className="mt-8">
                  <ProductPagination
                    currentPage={productsResponse.meta.current_page}
                    totalPages={productsResponse.meta.last_page}
                    onPageChange={(page) => updateFilters({ page })}
                    className="justify-center"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Message si aucun produit */}
        {!hasProducts && !productsLoading && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Aucun produit trouvé
            </h2>
            <p className="text-gray-600 mb-6">
              Aucun produit ne correspond à vos critères de recherche.
            </p>
            <Button onClick={handleClearFilters} variant="outline">
              Effacer les filtres
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
