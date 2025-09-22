"use client";

import { FilterContent } from "@/components/category/FilterContent";
import { ProductGrid } from "@/components/category/ProductGrid";
import { ProductPagination } from "@/components/category/ProductPagination";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  useBrandBySlug,
  useProductsByBrandSlug,
} from "@/lib/query/hooks";
import { useBrandPageFilters } from "@/lib/hooks/useBrandPageFilters";
import { Filter, Grid3X3, List, Building2, ExternalLink, Star, Globe } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Brand } from "@/lib/types/brands";
import Image from "next/image";

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

export default function BrandPage() {
  const params = useParams();
  const brandSlug = params.slug as string;
  const { user, isAuthenticated } = useAuth();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Utiliser le hook personnalisé pour gérer les filtres avec URL et debounce
  const { filters, updateFilters, clearFilters } = useBrandPageFilters({
    brandSlug,
    priceRange,
  });

  // Get data
  const { data: brandResponse, isLoading: brandLoading } = useBrandBySlug(brandSlug);
  const { data: productsResponse, isLoading: productsLoading } = useProductsByBrandSlug(brandSlug, filters);

  // Initialize price range when brand data is loaded
  useEffect(() => {
    // Pour l'instant, on utilise une fourchette de prix par défaut
    // Dans le futur, on pourrait récupérer la fourchette de prix depuis l'API
    setPriceRange([0, 1000]);
  }, [brandResponse]);

  // Handle price range changes avec debounce automatique
  const handlePriceRangeChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
    // Le debounce est géré automatiquement dans useBrandPageFilters
  };

  const hasProducts = productsResponse?.data && productsResponse.data.length > 0;

  const handleClearFilters = () => {
    clearFilters();
    setPriceRange([0, 1000]);
  };

  if (brandLoading) {
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

  if (!brandResponse?.data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Marque non trouvée
            </h1>
            <p className="text-gray-600 mb-8">
              La marque que vous recherchez n'existe pas ou a été supprimée.
            </p>
            <Link href="/marque" className="text-primary-dark hover:underline">
              Voir toutes les marques
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const brand = brandResponse.data as Brand;

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
          <Link href="/marque" className="hover:text-primary-dark">
            Marques
          </Link>
          <span>/</span>
          <span className="text-gray-900">{brand.name}</span>
        </nav>

        {/* Brand Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 mb-8">
            {/* Brand Logo */}
            <div className="flex-shrink-0 mb-6 lg:mb-0">
              {brand.imageUrl ? (
                <div className="w-32 h-32 bg-white rounded-xl border-2 border-gray-200 overflow-hidden p-4">
                  <Image
                    src={brand.imageUrl}
                    alt={`Logo ${brand.name}`}
                    width={128}
                    height={128}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 bg-primary-dark bg-opacity-10 rounded-xl flex items-center justify-center">
                  <Building2 className="w-16 h-16 text-primary-dark opacity-80" />
                </div>
              )}
            </div>

            {/* Brand Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {brand.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {brand.isFeatured && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Marque vedette
                      </Badge>
                    )}
                    {brand.isActive ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {brand.websiteUrl && (
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={brand.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Site web
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Description */}
              {brand.description && (
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {brand.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  <span className="font-medium">{brand.productCount || 0}</span>
                  <span className="ml-1">produit{(brand.productCount || 0) > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section produits - affichée seulement s'il y a des produits */}
        {hasProducts && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              {/* Mobile Filter Button - Sticky */}
              <div
                className="lg:hidden mb-4 sticky z-40 bg-background/95 backdrop-blur-sm pb-4"
                style={{ top: "180px" }}
              >
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
                      // Créer un objet mock pour les filtres de marque
                      categoryData={{
                        id: 0,
                        name: brand.name,
                        slug: brand.slug,
                        description: brand.description || '',
                        isActive: brand.isActive,
                        sortOrder: 0,
                        createdAt: brand.createdAt,
                        updatedAt: brand.updatedAt,
                        productCount: brand.productCount || 0,
                        filters: {
                          priceRange: { min: 0, max: 1000 },
                          // @ts-ignore
                          categories: [],
                          brands: []
                        }
                      }}
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
              <div
                className="hidden lg:block sticky max-h-[calc(100vh-180px)] overflow-y-auto"
                style={{ top: "180px" }}
              >
                <div className="bg-background/95 backdrop-blur-sm rounded-lg border border-border/50 p-4 shadow-sm">
                  <FilterContent
                    categoryData={{
                      id: 0,
                      name: brand.name,
                      slug: brand.slug,
                      description: brand.description || '',
                      isActive: brand.isActive,
                      sortOrder: 0,
                      createdAt: brand.createdAt,
                      updatedAt: brand.updatedAt,
                      productCount: brand.productCount || 0,
                      filters: {
                        priceRange: { min: 0, max: 1000 },
                        // @ts-ignore
                        categories: [],
                        brands: []
                      }
                    }}
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
                  Produits de {brand.name}
                </h2>
                <p className="text-gray-600">
                  Découvrez tous les produits de cette marque
                </p>
              </div>

              {/* View Controls - Sticky */}
              <div
                className="sticky z-30 bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg p-4 mb-6 shadow-sm"
                style={{ top: "180px" }}
              >
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

        {/* No products message */}
        {!hasProducts && !productsLoading && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun produit disponible
            </h3>
            <p className="text-gray-600 mb-4">
              Cette marque n'a pas encore de produits dans notre catalogue.
            </p>
            <Link href="/marque">
              <Button variant="outline">
                Voir toutes les marques
              </Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
