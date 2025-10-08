"use client";

import { FilterContent } from "@/components/category/FilterContent";
import { ProductGrid } from "@/components/category/ProductGrid";
import { ProductPagination } from "@/components/category/ProductPagination";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useGlobalFilters } from "@/lib/query/hooks";
import { useFilters } from "@/lib/hooks/useFilters";
import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/lib/api/services";
import { AlertTriangle, Filter, Grid3X3, List, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type SortOption = "popularity" | "price" | "name" | "newest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popularity", label: "Popularité" },
  { value: "price", label: "Prix" },
  { value: "name", label: "Nom" },
  { value: "newest", label: "Plus récent" },
];

export default function DestockagePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Initialiser la fourchette de prix
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Utiliser le hook personnalisé pour gérer les filtres avec URL et debounce
  const { filters, updateFilters, clearFilters } = useFilters({
    priceRange,
    baseUrl: "/destockage",
  });

  // Récupérer les produits en destockage
  const { data: productsResponse, isLoading: productsLoading } = useQuery({
    queryKey: ["products", "clearance", filters],
    queryFn: () => productsService.getClearanceProducts(filters),
  });

  // Récupérer les filtres globaux pour le catalogue
  const { data: globalFiltersResponse } = useGlobalFilters();

  const products = productsResponse?.data || [];
  const meta = productsResponse?.meta;

  // Créer les données de catégorie pour les filtres (structure attendue par FilterContent)
  const categoryDataForFilters = useMemo(() => {
    if (!globalFiltersResponse?.data) return null;

    return {
      id: 0,
      name: "Destockage",
      slug: "destockage",
      description: "Produits en destockage",
      isActive: true,
      sortOrder: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subcategories: [],
      featuredProducts: [],
      filters: {
        brands:
          globalFiltersResponse.data.brands.map((brand) => ({
            id: brand.id,
            name: brand.name,
            slug: brand.name.toLowerCase().replace(/\s+/g, "-"),
            description: "",
            logoUrl: "",
            websiteUrl: "",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            productCount: brand.productCount,
          })) || [],
        priceRange: globalFiltersResponse.data.priceRange || {
          min: 0,
          max: 1000,
        },
        specifications: globalFiltersResponse.data.specifications || [],
      },
    };
  }, [globalFiltersResponse]);

  // Synchroniser la fourchette de prix avec les filtres globaux
  useEffect(() => {
    if (globalFiltersResponse?.data?.priceRange) {
      setPriceRange([
        globalFiltersResponse.data.priceRange.min,
        globalFiltersResponse.data.priceRange.max,
      ]);
    }
  }, [globalFiltersResponse]);

  // Handle price range changes avec debounce automatique
  const handlePriceRangeChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
    // Mettre à jour les filtres avec la nouvelle fourchette de prix
    updateFilters({ priceRange: { min: newRange[0], max: newRange[1] } });
  };

  const handleClearFilters = () => {
    clearFilters();
    setPriceRange([0, 1000]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Destockage</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* En-tête de page */}
      <div className="bg-gradient-to-r from-destructive/10 via-orange-500/10 to-yellow-500/10 border-b">
        <div className="container py-8">
          <div className="flex items-center gap-4 mb-2">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <h1 className="text-4xl font-bold tracking-tight">Destockage</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Profitez de nos offres exceptionnelles sur une sélection de produits
          </p>
          {meta && (
            <div className="mt-4">
              <Badge variant="destructive" className="text-base px-4 py-2">
                {meta.total} produit{meta.total > 1 ? "s" : ""} en destockage
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Filtres - Desktop */}
          <aside className="hidden lg:block space-y-6">
            <div className="sticky top-4">
              <div className="flex items-center justify-between mb-4">
                {filters.brands && filters.brands.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 px-2"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Réinitialiser
                  </Button>
                )}
              </div>

              {categoryDataForFilters && (
                <FilterContent
                  // @ts-ignore
                  categoryData={categoryDataForFilters}
                  filters={filters}
                  priceRange={priceRange}
                  onFilterChange={updateFilters}
                  onPriceChange={handlePriceRangeChange}
                  onClearFilters={handleClearFilters}
                />
              )}
            </div>
          </aside>

          {/* Contenu principal */}
          <div className="space-y-6">
            {/* Barre d'outils */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {/* Bouton filtres mobile */}
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtres
                      {filters.brands && filters.brands.length > 0 && (
                        <Badge className="ml-2" variant="secondary">
                          {filters.brands.length}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full sm:max-w-md">
                    <SheetHeader>
                      <SheetTitle>Filtres</SheetTitle>
                    </SheetHeader>
                    <div className="py-6">
                      {filters.brands && filters.brands.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            clearFilters();
                            setShowFilters(false);
                          }}
                          className="mb-4"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Réinitialiser
                        </Button>
                      )}

                      {categoryDataForFilters && (
                        <FilterContent
                          // @ts-ignore
                          categoryData={categoryDataForFilters}
                          filters={filters}
                          priceRange={priceRange}
                          onFilterChange={updateFilters}
                          onPriceChange={handlePriceRangeChange}
                          onClearFilters={handleClearFilters}
                        />
                      )}
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Compteur de résultats */}
                {meta && (
                  <span className="text-sm text-muted-foreground">
                    {meta.total} résultat{meta.total > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Sélecteur de tri */}
                <Select
                  value={filters.sortBy || "popularity"}
                  onValueChange={(value: string) =>
                    updateFilters({
                      sortBy: value as SortOption,
                      sortOrder: value === "price" ? "asc" : "desc",
                    })
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

                {/* Toggle de vue */}
                <div className="flex items-center gap-1 border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Liste des produits */}
            {productsLoading ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <Skeleton className="w-full aspect-square mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium mb-2">
                  Aucun produit en destockage
                </p>
                <p className="text-muted-foreground">
                  Aucun produit ne correspond à vos critères pour le moment.
                </p>
              </div>
            ) : (
              <>
                <ProductGrid
                  products={products}
                  viewMode={viewMode}
                  isLoading={productsLoading}
                />

                {/* Pagination */}
                {meta && meta.last_page > 1 && (
                  <ProductPagination
                    currentPage={meta.current_page}
                    totalPages={meta.last_page}
                    onPageChange={(page) => updateFilters({ page })}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
