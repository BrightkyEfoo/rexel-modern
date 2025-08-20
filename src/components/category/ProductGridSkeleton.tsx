import { ProductCardSkeleton } from './ProductCardSkeleton';

interface ProductGridSkeletonProps {
  viewMode?: 'grid' | 'list';
  count?: number;
}

export function ProductGridSkeleton({ viewMode = 'grid', count = 6 }: ProductGridSkeletonProps) {
  return (
    <div
      className={`grid gap-6 ${
        viewMode === 'grid'
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-1'
      }`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} viewMode={viewMode} />
      ))}
    </div>
  );
}
