"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Trash2,
  ShoppingCart,
  ArrowLeft,
  Grid3X3,
  List,
  Search,
  AlertCircle,
  Package,
  Star,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import { useFavorites, useRemoveFromFavorites, useFavoritesCount } from '@/lib/hooks/useFavorites';
import { useAddToCart } from '@/lib/query/hooks';
import { useAuth } from '@/lib/auth/nextauth-hooks';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { formatPrice } from '@/lib/utils/currency';
import type { Favorite } from '@/lib/api/favorites';

export default function FavoritesPage() {
  const { user, isAuthenticated } = useAuth();
  const { data: favoritesData, isLoading, error } = useFavorites();
  const { data: countData } = useFavoritesCount();
  const removeFromFavoritesMutation = useRemoveFromFavorites();
  const addToCartMutation = useAddToCart();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'product_name'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/auth/login';
    }
  }, [isAuthenticated]);

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  const handleRemoveFromFavorites = async (favoriteId: string) => {
    try {
      await removeFromFavoritesMutation.mutateAsync(favoriteId);
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCartMutation.mutateAsync({ productId, quantity: 1 });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleAddAllToCart = async () => {
    if (!favoritesData?.data) return;
    
    const availableItems = favoritesData.data.filter(
      (fav: Favorite) => fav.product.availability === 'in_stock'
    );
    
    for (const item of availableItems) {
      try {
        await addToCartMutation.mutateAsync({
          productId: item.productId,
          quantity: 1
        });
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-64" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-muted rounded-lg h-64" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erreur lors du chargement des favoris.
            </AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    );
  }

  const favorites = favoritesData?.data || [];
  const totalCount = countData?.data?.count || favorites.length;

  // Filtrage et tri local
  const filteredFavorites = favorites
    .filter((favorite: Favorite) => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      return (
        favorite.product.name.toLowerCase().includes(searchLower) ||
        favorite.product.brand?.name?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a: Favorite, b: Favorite) => {
      switch (sortBy) {
        case 'product_name':
          return sortOrder === 'asc' 
            ? a.product.name.localeCompare(b.product.name)
            : b.product.name.localeCompare(a.product.name);
        case 'created_at':
          return sortOrder === 'asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/profil" className="hover:text-primary">Accueil</Link>
          <span>/</span>
          <span className="text-foreground">Mes favoris</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Mes favoris
            </h1>
            <p className="text-muted-foreground">
              {totalCount} produit{totalCount !== 1 ? 's' : ''} dans votre liste
            </p>
          </div>

          {favorites.length > 0 && (
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleAddAllToCart}
                disabled={
                  addToCartMutation.isPending || 
                  favorites.every((fav: Favorite) => fav.product.availability !== 'in_stock')
                }
                className="bg-primary hover:bg-primary/90"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Tout ajouter au panier
              </Button>
            </div>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Aucun favori pour le moment
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Découvrez nos produits et ajoutez-les à vos favoris en cliquant sur le cœur
            </p>
            <Button asChild>
              <Link href="/catalogue">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Découvrir nos produits
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Filters and Controls */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Rechercher dans mes favoris..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Sort By */}
                  <Select value={sortBy} onValueChange={(value: 'created_at' | 'product_name') => setSortBy(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">Date d'ajout</SelectItem>
                      <SelectItem value="product_name">Nom du produit</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Sort Order */}
                  <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ordre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Décroissant</SelectItem>
                      <SelectItem value="asc">Croissant</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Mode */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Results count */}
                <div className="mt-4 text-sm text-muted-foreground">
                  {filteredFavorites.length} résultat{filteredFavorites.length !== 1 ? 's' : ''}
                  {searchQuery && ` pour "${searchQuery}"`}
                </div>
              </CardContent>
            </Card>

            {/* Favorites Grid/List */}
            {filteredFavorites.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Aucun résultat trouvé
                </h3>
                <p className="text-muted-foreground mb-6">
                  Essayez de modifier vos filtres de recherche
                </p>
                <Button onClick={() => setSearchQuery('')} variant="outline">
                  Effacer les filtres
                </Button>
              </div>
            ) : (
              <FavoritesGrid
                favorites={filteredFavorites}
                viewMode={viewMode}
                onRemoveFromFavorites={handleRemoveFromFavorites}
                onAddToCart={handleAddToCart}
                removeFromFavoritesMutation={removeFromFavoritesMutation}
                addToCartMutation={addToCartMutation}
                imageErrors={imageErrors}
                onImageError={handleImageError}
              />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Favorites Grid Component
interface FavoritesGridProps {
  favorites: Favorite[];
  viewMode: 'grid' | 'list';
  onRemoveFromFavorites: (favoriteId: string) => void;
  onAddToCart: (productId: string) => void;
  removeFromFavoritesMutation: { isPending: boolean };
  addToCartMutation: { isPending: boolean };
  imageErrors: Record<string, boolean>;
  onImageError: (productId: string) => void;
}

function FavoritesGrid({
  favorites,
  viewMode,
  onRemoveFromFavorites,
  onAddToCart,
  removeFromFavoritesMutation,
  addToCartMutation,
  imageErrors,
  onImageError
}: FavoritesGridProps) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {favorites.map((favorite) => (
          <Card key={favorite.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                {/* Product Image */}
                <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                  {imageErrors[favorite.product.id] || !favorite.product.imageUrl ? (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Logo variant="light" size="sm" showText={false} />
                    </div>
                  ) : (
                    <Image
                      src={favorite.product.files?.[0]?.url || favorite.product.imageUrl}
                      alt={favorite.product.name}
                      width={96}
                      height={96}
                      className="object-contain w-full h-full p-2"
                      onError={() => onImageError(favorite.product.id)}
                    />
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link
                        href={`/produit/${favorite.product.slug}`}
                        className="font-semibold text-foreground hover:text-primary"
                      >
                        {favorite.product.name}
                      </Link>
                      <div className="text-sm text-muted-foreground mt-1">
                        {favorite.product.brand && (
                          <Badge variant="secondary">{favorite.product.brand.name}</Badge>
                        )}
                      </div>
                      <div className="flex items-center mt-2">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            favorite.product.availability === 'in_stock'
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}
                        />
                        <span className="text-sm text-muted-foreground">
                          {favorite.product.availability === 'in_stock'
                            ? 'En stock'
                            : 'Rupture de stock'}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Ajouté le {new Date(favorite.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">
                        {formatPrice(favorite.product.price)}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mt-4">
                    <Button
                      size="sm"
                      onClick={() => onAddToCart(favorite.productId)}
                      disabled={
                        favorite.product.availability !== 'in_stock' ||
                        addToCartMutation.isPending
                      }
                      className="bg-primary hover:bg-primary/90"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Ajouter au panier
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFromFavorites(favorite.id)}
                      disabled={removeFromFavoritesMutation.isPending}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Retirer
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {favorites.map((favorite) => (
        <Card key={favorite.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <Link href={`/produit/${favorite.product.slug}`}>
              <div className="aspect-square bg-muted p-4">
                {imageErrors[favorite.product.id] || !favorite.product.imageUrl ? (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Logo variant="light" size="md" showText={false} />
                  </div>
                ) : (
                  <Image
                    src={favorite.product.files?.[0]?.url || favorite.product.imageUrl}
                    alt={favorite.product.name}
                    width={200}
                    height={200}
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform"
                    onError={() => onImageError(favorite.product.id)}
                  />
                )}
              </div>
            </Link>

            {/* Remove button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFromFavorites(favorite.id)}
              disabled={removeFromFavoritesMutation.isPending}
              className="absolute top-2 right-2 text-destructive hover:text-destructive/80 hover:bg-white"
            >
              <Heart className="w-4 h-4 fill-current" />
            </Button>

            {/* Availability indicator */}
            <div className="absolute top-2 left-2">
              {favorite.product.availability === 'in_stock' ? (
                <Badge className="bg-green-100 text-green-800">En stock</Badge>
              ) : (
                <Badge variant="destructive">Rupture</Badge>
              )}
            </div>
          </div>

          <CardContent className="p-4">
            <Link href={`/produit/${favorite.product.slug}`} className="hover:text-primary">
              <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                {favorite.product.name}
              </h3>
            </Link>

            <div className="flex items-center justify-between mb-3">
              {favorite.product.brand && (
                <Badge variant="secondary" className="text-xs">
                  {favorite.product.brand.name}
                </Badge>
              )}
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-muted-foreground ml-1">4.5</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-bold text-primary">
                {formatPrice(favorite.product.price)}
              </div>
              <div className="text-xs text-muted-foreground">
                Ajouté le {new Date(favorite.createdAt).toLocaleDateString('fr-FR')}
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => onAddToCart(favorite.productId)}
              disabled={
                favorite.product.availability !== 'in_stock' ||
                addToCartMutation.isPending
              }
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Ajouter au panier
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}