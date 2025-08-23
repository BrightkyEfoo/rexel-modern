import type { Product } from '@/lib/api/types';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './ProductGridSkeleton';

interface ProductGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
  isAuthenticated: boolean;
  isLoading?: boolean;
}

export function ProductGrid({
  products,
  viewMode,
  isAuthenticated,
  isLoading = false
}: ProductGridProps) {
  // Afficher les skeletons pendant le chargement
  if (isLoading) {
    return <ProductGridSkeleton viewMode={viewMode} count={6} />;
  }

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun produit trouvé</p>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-6 ${
        viewMode === 'grid'
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr'
          : 'grid-cols-1'
      }`}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  );
} 