'use client';

import { FilterContent } from '@/components/category/FilterContent';
import { ProductGrid } from '@/components/category/ProductGrid';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { SearchFilters } from '@/lib/api/types';
import { useAuthUser } from '@/lib/auth/auth-hooks';
import { useAddToCart, useCategoryBySlug, useProductsByCategorySlug } from '@/lib/query/hooks';
import {
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { CategoryDetail } from '@/lib/api/types';

type SortOption = 'popularity' | 'price' | 'name' | 'newest';
type AvailabilityOption = 'in_stock' | 'out_of_stock' | 'limited';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popularity', label: 'Popularité' },
  { value: 'price', label: 'Prix' },
  { value: 'name', label: 'Nom' },
  { value: 'newest', label: 'Plus récent' }
];

const AVAILABILITY_OPTIONS: { value: AvailabilityOption; label: string }[] = [
  { value: 'in_stock', label: 'En stock' },
  { value: 'limited', label: 'Stock limité' },
  { value: 'out_of_stock', label: 'Rupture de stock' }
];

interface ExtendedSearchFilters extends SearchFilters {
  availability?: AvailabilityOption[];
}

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const categorySlug = params.slug as string;
  const { user, isAuthenticated } = useAuthUser();

  const [filters, setFilters] = useState<ExtendedSearchFilters>({
    sortBy: 'popularity',
    sortOrder: 'desc',
    page: 1,
    limit: 20
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Get data
  const { data: categoryResponse, isLoading: categoryLoading } = useCategoryBySlug(categorySlug);
  const { data: productsResponse, isLoading: productsLoading } = useProductsByCategorySlug(categorySlug, filters);
  const addToCartMutation = useAddToCart();

  // Update filters based on URL params
  useEffect(() => {
    const urlFilters: ExtendedSearchFilters = {
      sortBy: (searchParams.get('sort') as SortOption) || 'popularity',
      sortOrder: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
      page: Number(searchParams.get('page')) || 1,
      limit: 20
    };

    if (searchParams.get('brands')) {
      urlFilters.brands = searchParams.get('brands')?.split(',').map(Number);
    }

    if (searchParams.get('minPrice') || searchParams.get('maxPrice')) {
      urlFilters.priceRange = {
        min: Number(searchParams.get('minPrice')) || 0,
        max: Number(searchParams.get('maxPrice')) || 1000
      };
    }

    setFilters(urlFilters);
  }, [categorySlug, searchParams]);

  const handleFilterChange = (newFilters: Partial<ExtendedSearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleAddToCart = async (productId: string) => {
    if (!isAuthenticated) {
      window.location.href = '/auth/login';
      return;
    }

    try {
      await addToCartMutation.mutateAsync({ productId, quantity: 1 });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const clearFilters = () => {
    setFilters({
      sortBy: 'popularity',
      sortOrder: 'desc',
      page: 1,
      limit: 20
    });
    setPriceRange([0, 1000]);
  };

  if (categoryLoading) {
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

  if (!categoryResponse?.data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Catégorie non trouvée</h1>
            <p className="text-gray-600 mb-8">La catégorie que vous recherchez n'existe pas ou a été supprimée.</p>
            <Link href="/" className="text-[#162e77] hover:underline">
              Retour à l'accueil
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const category = categoryResponse.data as CategoryDetail;
  const hasProducts = productsResponse?.data && productsResponse.data.length > 0;

  console.log("hasProducts", productsResponse);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-[#162e77]">Accueil</Link>
          <span>/</span>
          <span className="text-gray-900">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {category.name}
          </h1>
          <p className="text-gray-600 mb-6">
            {category.description}
          </p>
          
          {/* Sous-catégories directement après la description */}
          {category.subcategories && category.subcategories.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Explorez nos sous-catégories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {category.subcategories.map((subcat: CategoryDetail['subcategories'][number]) => (
                  <Link
                    key={subcat.id}
                    href={`/categorie/${subcat.slug}`}
                    className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:border-[#162e77] hover:shadow-lg transition-all duration-200 overflow-hidden"
                  >
                    {/* Icône de catégorie */}
                    <div className="w-12 h-12 bg-[#162e77] bg-opacity-10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-opacity-20 transition-colors">
                      <div className="w-6 h-6 bg-[#162e77] rounded opacity-80"></div>
                    </div>
                    
                    {/* Contenu */}
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#162e77] transition-colors">
                      {subcat.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 overflow-hidden text-ellipsis" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {subcat.description}
                    </p>
                    
                    {/* Badge produits */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">
                        {subcat.productCount} produits
                      </span>
                      <div className="w-5 h-5 text-[#162e77] opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Effet de hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#162e77] to-blue-600 opacity-0 group-hover:opacity-5 transition-opacity"></div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Compteur de produits seulement s'il y en a */}
          {hasProducts && (
            <div className="text-sm text-gray-500 mt-6">
              {category.productCount} produits disponibles
            </div>
          )}
        </div>

        {/* Section produits - affichée seulement s'il y a des produits */}
        {hasProducts && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-4">
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtres
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filtres</SheetTitle>
                    </SheetHeader>
                    <FilterContent
                      categoryData={category}
                      filters={filters}
                      priceRange={priceRange}
                      onFilterChange={handleFilterChange}
                      onPriceChange={setPriceRange}
                      onClearFilters={clearFilters}
                    />
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop Filters */}
              <div className="hidden lg:block">
                <FilterContent
                  categoryData={category}
                  filters={filters}
                  priceRange={priceRange}
                  onFilterChange={handleFilterChange}
                  onPriceChange={setPriceRange}
                  onClearFilters={clearFilters}
                />
              </div>
            </div>

            {/* Products Section */}
            <div className="lg:w-3/4">
              {/* Titre de section produits */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Produits disponibles</h2>
                <p className="text-gray-600">Découvrez notre sélection de produits dans cette catégorie</p>
              </div>

              {/* View Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                <Select
                  value={filters.sortBy}
                  onValueChange={(value: SortOption) => handleFilterChange({ sortBy: value })}
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

              {/* Products Grid */}
              {productsLoading ? (
                <div className="animate-pulse">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-64 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : (
                <ProductGrid
                  products={productsResponse.data}
                  viewMode={viewMode}
                  onAddToCart={(productId) => addToCartMutation.mutate({ productId, quantity: 1 })}
                  isAuthenticated={isAuthenticated}
                />
              )}
            </div>
          </div>
        )}


      </main>

      <Footer />
    </div>
  );
}
