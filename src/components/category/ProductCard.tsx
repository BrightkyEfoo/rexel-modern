'use client';

import { useState } from 'react';
import { Heart, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/ui/logo';
import { ProductCardFooter } from '@/components/ui/product-card-footer';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { CountryFlag } from '@/components/ui/country-flag';
import { useCartSync } from '@/lib/hooks/useCartSync';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useProductFavoriteStatus } from '@/lib/hooks/useFavorites';
import { useAuth } from '@/lib/auth/nextauth-hooks';
import { formatPrice } from '@/lib/utils/currency';
import type { Product } from '@/lib/api/types';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export function ProductCard({
  product,
  viewMode = 'grid'
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  
  const { addItem, updateQuantity, removeItem, items, isLoading } = useCartSync();
  const { isAuthenticated } = useAuth();
  const favoriteState = useProductFavoriteStatus(product.id.toString());
  
  // Debouncer l'ajout au panier pour éviter les clics multiples
  const debouncedAddItem = useDebounce(addItem, 300);
  
  // Fonctions utilitaires pour le panier
  const isItemInCart = (productId: string) => 
    items.some(item => item.id === productId);

  // Gestionnaires d'événements
  const handleAddToCart = () => {
    debouncedAddItem(product, selectedQuantity);
  };

  const handleRemoveFromCart = () => {
    removeItem(product.id.toString());
    setSelectedQuantity(1); // Reset la quantité à 1 après suppression
  };

  const handleEdit = () => {
    // Modifier signifie mettre à jour la quantité dans le panier
    updateQuantity(product.id.toString(), selectedQuantity);
  };

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
          src={product.imageUrl}
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
        <Badge variant="destructive" className="text-xs font-semibold w-fit">
          -{discountPercentage}%
        </Badge>
      )}
      {product.isFeatured && (
        <Badge variant="secondary" className="w-fit text-xs font-semibold bg-amber-100 text-amber-800 hover:bg-amber-200">
          <Star className="w-3 h-3 mr-1" />
          Vedette
        </Badge>
      )}
      {isOutOfStock && (
        <Badge variant="outline" className="w-fit text-xs font-semibold bg-gray-100 text-gray-600">
          Rupture
        </Badge>
      )}
    </div>
  );

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion
      window.location.href = '/auth/login';
      return;
    }

    try {
      await favoriteState.toggle();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const renderActions = () => (
    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 bg-white/90 hover:bg-white"
        onClick={handleToggleFavorite}
        disabled={favoriteState.isLoading}
      >
        <Heart
          className={`w-4 h-4 ${
            favoriteState.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
          }`}
        />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 bg-white/90 hover:bg-white"
        asChild
      >
        <a href={`/produit/${product.slug}`}>
          <Eye className="w-4 h-4 text-gray-600" />
        </a>
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
              <Link href={`/produit/${product.slug}`} className="hover:text-primary hover:underline underline-offset-2 font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </Link>
              
              {/* Marque et pays de fabrication */}
              <div className="flex items-center gap-2 mt-1">
                {product.brand && (
                  <span className="text-xs font-medium text-muted-foreground">
                    {product.brand.name}
                  </span>
                )}
                {product.fabricationCountryCode && (
                  <CountryFlag 
                    countryCode={product.fabricationCountryCode} 
                    size="md"
                  />
                )}
              </div>
              
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {product.shortDescription || product.description}
              </p>
              
              {/* Prix */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">
                  {formatPrice(finalPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Stock */}
              {product.stockQuantity && (
                <p className="text-xs text-muted-foreground mt-1">
                  {product.stockQuantity} en stock
                </p>
              )}

              {/* Quantité */}
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Quantité:</span>
                  <QuantitySelector
                    quantity={selectedQuantity}
                    onQuantityChange={setSelectedQuantity}
                    max={product.stockQuantity || 99}
                    disabled={isOutOfStock}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleFavorite}
                  disabled={favoriteState.isLoading}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favoriteState.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                    }`}
                  />
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href={`/produit/${product.slug}`}>
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </a>
                </Button>
              </div>
              
              <div className="flex-1 max-w-xs ml-4">
                <ProductCardFooter
                  isInCart={isItemInCart(product.id.toString())}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                  onEdit={handleEdit}
                  isOutOfStock={isOutOfStock}
                  variant="list"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid mode
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden relative flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {renderImage()}
        {renderBadges()}
        {renderActions()}
      </div>

      {/* Content avec padding en bas pour le footer sticky */}
      <CardContent className="p-4 flex-1 pb-20">
        <Link href={`/produit/${product.slug}`} className="hover:text-primary hover:underline underline-offset-2 font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
          {product.name}
        </Link>
        
        {/* Marque et pays de fabrication */}
        <div className="flex items-center justify-between gap-2 mb-2">
          {product.brand && (
            <Badge variant="outline" className="w-fit text-xs font-semibold bg-gray-100 text-gray-600">
              {product.brand.name}
            </Badge>
          )}
          {product.fabricationCountryCode && (
            <CountryFlag 
              countryCode={product.fabricationCountryCode} 
              size="md"
            />
          )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.shortDescription || product.description}
        </p>

        {/* Prix */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-foreground">
            {formatPrice(finalPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Stock */}
        {product.stockQuantity && (
          <p className="text-xs text-muted-foreground mb-3">
            {product.stockQuantity} en stock
          </p>
        )}

        {/* Quantité */}
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Qté:</span>
            <QuantitySelector
              quantity={selectedQuantity}
              onQuantityChange={setSelectedQuantity}
              max={product.stockQuantity || 99}
              disabled={isOutOfStock}
              size="sm"
            />
          </div>
        </div>
      </CardContent>

      {/* Footer sticky en bas */}
      <ProductCardFooter
        isInCart={isItemInCart(product.id.toString())}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onEdit={handleEdit}
        isOutOfStock={isOutOfStock}
        variant="grid"
      />
    </Card>
  );
}
