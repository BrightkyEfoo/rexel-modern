import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/api/types';

interface ProductGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
  onAddToCart: (productId: string) => void;
  isAuthenticated: boolean;
}

export function ProductGrid({
  products,
  viewMode,
  onAddToCart,
  isAuthenticated
}: ProductGridProps) {
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
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-1'
      }`}
    >
      {products.map((product) => (
        <div
          key={product.id}
          className={`group relative overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
            viewMode === 'list' ? 'flex gap-4 p-4' : 'flex flex-col'
          }`}
        >
          <div className={`${viewMode === 'list' ? 'w-48' : 'w-full'} overflow-hidden bg-primary/80 h-48`}>
            <img
              src={product.imageUrl}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 ${
                viewMode === 'list' ? 'h-32' : ''
              }`}
            />
          </div>

          <div className={`flex flex-col flex-1 ${viewMode === 'list' ? 'py-2' : 'p-4'}`}>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
              {product.badge && (
                <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                  {product.badge}
                </span>
              )}
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
            </div>

            <div className="mt-auto pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-semibold text-gray-900">
                    {product.price.toFixed(2)}€
                  </span>
                  {product.originalPrice && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      {product.originalPrice.toFixed(2)}€
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => onAddToCart(product.id)}
                  disabled={!isAuthenticated}
                  className="bg-gray-900 hover:bg-gray-800"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 