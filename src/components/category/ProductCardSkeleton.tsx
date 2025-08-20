import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductCardSkeletonProps {
  viewMode?: 'grid' | 'list';
}

export function ProductCardSkeleton({ viewMode = 'grid' }: ProductCardSkeletonProps) {
  if (viewMode === 'list') {
    return (
      <Card className="animate-pulse">
        <div className="flex gap-4 p-4">
          {/* Image skeleton */}
          <Skeleton className="w-32 h-32 flex-shrink-0 rounded-md" />

          {/* Content skeleton */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              {/* Title */}
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-1" />
              
              {/* Description */}
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3 mb-3" />
              
              {/* Price */}
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>

              {/* Stock */}
              <Skeleton className="h-3 w-24" />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid mode
  return (
    <Card className="animate-pulse overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square">
        <Skeleton className="w-full h-full" />
      </div>

      <CardContent className="p-4">
        {/* Title */}
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-2/3 mb-3" />
        
        {/* Description */}
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-3" />

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Stock */}
        <Skeleton className="h-3 w-24" />
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {/* Button */}
        <Skeleton className="h-10 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}
