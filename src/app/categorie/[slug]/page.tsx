'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Filter,
  Grid3X3,
  List,
  ChevronDown,
  Star,
  Heart,
  ShoppingCart,
  SlidersHorizontal,
  X,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useCategoryBySlug, useProducts } from '@/lib/query/hooks';
import { useAddToCart } from '@/lib/query/hooks';
import { useAuthUser } from '@/lib/auth/auth-hooks';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { SearchFilters, CategoryDetail, Product, ApiResponse, PaginatedResponse } from '@/lib/api/types';
import { FilterContent } from '@/components/category/FilterContent';
import { ProductGrid } from '@/components/category/ProductGrid';

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
    categories: [categorySlug],
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
  const { data: productsResponse, isLoading: productsLoading } = useProducts(filters);
  const addToCartMutation = useAddToCart();

  // Update filters based on URL params
  useEffect(() => {
    const urlFilters: ExtendedSearchFilters = {
      categories: [categorySlug],
      sortBy: (searchParams.get('sort') as SortOption) || 'popularity',
      sortOrder: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
      page: Number(searchParams.get('page')) || 1,
      limit: 20
    };

    if (searchParams.get('brands')) {
      urlFilters.brands = searchParams.get('brands')?.split(',');
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
      categories: [categorySlug],
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

  const category = categoryResponse.data;

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
          <p className="text-gray-600 mb-4">
            {category.description}
          </p>
          <div className="text-sm text-gray-500">
            {category.productCount} produits disponibles
          </div>
        </div>

        {/* Subcategories */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Sous-catégories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {category.subcategories.map((subcat) => (
                <Link
                  key={subcat.id}
                  href={`/categorie/${subcat.slug}`}
                  className="p-4 border border-gray-200 rounded-lg hover:border-[#162e77] hover:bg-blue-50 transition-colors"
                >
                  <h3 className="font-medium text-gray-900">{subcat.name}</h3>
                  <p className="text-sm text-gray-500">{subcat.productCount} produits</p>
                </Link>
              ))}
            </div>
          </div>
        )}

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
            ) : productsResponse?.data ? (
              <ProductGrid
                products={productsResponse.data}
                viewMode={viewMode}
                onAddToCart={(productId) => addToCartMutation.mutate({ productId, quantity: 1 })}
                isAuthenticated={isAuthenticated}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Aucun produit trouvé</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
