'use client';

import { useState } from 'react';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/ui/logo';
import { useCartSync } from '@/lib/hooks/useCartSync';
import type { Product } from '@/lib/api/types';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  isAuthenticated: boolean;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
}

export function ProductCard({
  product,
  viewMode = 'grid',
  isAuthenticated,
  onToggleFavorite,
  isFavorite = false
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const { addItem, items } = useCartSync();
  
  // Fonctions utilitaires pour le panier
  const isItemInCart = (productId: string) => 
    items.some(item => item.id === productId);
  
  const getItemQuantity = (productId: string) => 
    items.find(item => item.id === productId)?.quantity || 0;

  const hasDiscount = product.salePrice && Number(product.salePrice) < Number(product.price);
  const discountPercentage = hasDiscount 
    ? Math.round((1 - Number(product.salePrice!) / Number(product.price)) * 100)
    : 0;

  const finalPrice = product.salePrice || product.price;
  const isOutOfStock = !product.inStock || product.stockQuantity === 0;

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const renderImage = () => {
    if (imageError || !product.files?.length) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <Logo variant="light" size="md" showText={false} />
        </div>
      );
    }

    return (
      <>
        {imageLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <Logo variant="light" size="md" showText={false} />
          </div>
        )}
        <img
          src={product.files[0]?.url || product.imageUrl}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </>
    );
  };

  const renderBadges = () => (
    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
      {hasDiscount && (
        <Badge variant="destructive" className="text-xs font-semibold">
          -{discountPercentage}%
        </Badge>
      )}
      {product.isFeatured && (
        <Badge variant="secondary" className="text-xs font-semibold bg-amber-100 text-amber-800 hover:bg-amber-200">
          <Star className="w-3 h-3 mr-1" />
          Vedette
        </Badge>
      )}
      {isOutOfStock && (
        <Badge variant="outline" className="text-xs font-semibold bg-gray-100 text-gray-600">
          Rupture
        </Badge>
      )}
    </div>
  );

  const renderActions = () => (
    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
      {onToggleFavorite && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-white/90 hover:bg-white"
          onClick={() => onToggleFavorite(product.id.toString())}
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </Button>
      )}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 bg-white/90 hover:bg-white"
      >
        <Eye className="w-4 h-4 text-gray-600" />
      </Button>
    </div>
  );

  if (viewMode === 'list') {
    return (
      <Card className="group hover:shadow-lg transition-all duration-200">
        <div className="flex gap-4 p-4">
          {/* Image */}
          <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-md bg-muted">
            {renderImage()}
            {renderBadges()}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {product.shortDescription || product.description}
              </p>
              
              {/* Prix */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">
                  {Number(finalPrice).toFixed(2)}€
                </span>
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through">
                    {Number(product.price).toFixed(2)}€
                  </span>
                )}
              </div>

              {/* Stock */}
              {product.stockQuantity && (
                <p className="text-xs text-muted-foreground mt-1">
                  {product.stockQuantity} en stock
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                {onToggleFavorite && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleFavorite(product.id.toString())}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                      }`}
                    />
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
              
              <Button
                onClick={() => addItem(product)}
                disabled={isOutOfStock}
                size="sm"
                variant={isItemInCart(product.id.toString()) ? "secondary" : "default"}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isItemInCart(product.id.toString()) 
                  ? `Ajouté (${getItemQuantity(product.id.toString())})`
                  : 'Ajouter'
                }
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid mode
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {renderImage()}
        {renderBadges()}
        {renderActions()}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
          {product.name}
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.shortDescription || product.description}
        </p>

        {/* Prix */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-foreground">
            {Number(finalPrice).toFixed(2)}€
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {Number(product.price).toFixed(2)}€
            </span>
          )}
        </div>

        {/* Stock */}
        {product.stockQuantity && (
          <p className="text-xs text-muted-foreground">
            {product.stockQuantity} en stock
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={() => addItem(product)}
          disabled={isOutOfStock}
          variant={isItemInCart(product.id.toString()) ? "secondary" : "default"}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isOutOfStock 
            ? 'Rupture de stock' 
            : isItemInCart(product.id.toString())
            ? `Ajouté (${getItemQuantity(product.id.toString())})`
            : 'Ajouter au panier'
          }
        </Button>
      </CardFooter>
    </Card>
  );
}
