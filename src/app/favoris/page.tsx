/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Trash2,
  ShoppingCart,
  ArrowRight,
  ArrowLeft,
  Grid3X3,
  List,
  Filter,
  Star,
  Package,
  Search,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFavorites, useRemoveFromFavorites, useAddToCart } from '@/lib/query/hooks';
import { useAuth } from '@/lib/auth/nextauth-hooks';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { Favorite } from '@/lib/api/types';

export default function FavoritesPage() {
  const { user, isAuthenticated } = useAuth();
  const { data: favorites, isLoading, error } = useFavorites();
  const removeFromFavoritesMutation = useRemoveFromFavorites();
  const addToCartMutation = useAddToCart();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'added_date'>('added_date');
  const [filterByAvailability, setFilterByAvailability] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/auth/login';
    }
  }, [isAuthenticated]);

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

  // Type guard for Favorite
  function isFavorite(obj: unknown): obj is Favorite {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'product' in obj &&
      typeof (obj as any).product === 'object' &&
      (obj as any).product !== null
    );
  }

  // Build a robust favorites array using the type guard (available everywhere in the component)
  let favoritesArray: Favorite[] = [];
  if (Array.isArray(favorites?.data)) {
    if (favorites.data.length > 0 && favorites.data.every((item: unknown) => typeof item === 'object' && item !== null && 'product' in item)) {
      favoritesArray = favorites.data as unknown as Favorite[];
    } else {
      favoritesArray = favorites.data.filter(isFavorite) as unknown as Favorite[];
    }
  }

  const handleAddAllToCart = async (): Promise<void> => {
    const availableItems = favoritesArray.filter((fav: Favorite) => fav.product.availability === 'in_stock');
    for (const item of availableItems) {
      try {
        await addToCartMutation.mutateAsync({
          productId: item.productId.toString(),
          quantity: 1
        });
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  };

  const filteredAndSortedFavorites: Favorite[] = favoritesArray
    .filter((favorite: Favorite) => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        if (!favorite.product.name.toLowerCase().includes(searchLower) &&
            !(favorite.product.brand?.name?.toLowerCase().includes(searchLower))) {
          return false;
        }
      }
      // Availability filter
      if (filterByAvailability !== 'all') {
        if (filterByAvailability === 'in_stock' && favorite.product.availability !== 'in_stock') {
          return false;
        }
        if (filterByAvailability === 'out_of_stock' && favorite.product.availability === 'in_stock') {
          return false;
        }
      }
      return true;
    })
    .sort((a: Favorite, b: Favorite) => {
      switch (sortBy) {
        case 'name':
          return a.product.name.localeCompare(b.product.name);
        case 'price':
          return Number(a.product.price) - Number(b.product.price);
        case 'added_date':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        default:
          return 0;
      }
    });

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-64" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64" />
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-[#162e77]">Accueil</Link>
          <span>/</span>
          <span className="text-gray-900">Mes favoris</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mes favoris
            </h1>
            <p className="text-gray-600">
              {favoritesArray.length} produit{favoritesArray.length !== 1 ? 's' : ''} dans votre liste
            </p>
          </div>

          {favoritesArray.length > 0 && (
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleAddAllToCart}
                disabled={addToCartMutation.isPending || favoritesArray.every((fav: Favorite) => fav.product.availability !== 'in_stock')}
                className="bg-[#162e77] hover:bg-[#1e40af]"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Tout ajouter au panier
              </Button>
            </div>
          )}
        </div>

        {favoritesArray.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Aucun favori pour le moment
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Découvrez nos produits et ajoutez-les à vos favoris en cliquant sur le cœur
            </p>
            <Button asChild>
              <Link href="/categories">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Découvrir nos produits
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Filters and Controls */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher dans mes favoris..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={(value: 'name' | 'price' | 'added_date') => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="added_date">Date d'ajout</SelectItem>
                    <SelectItem value="name">Nom</SelectItem>
                    <SelectItem value="price">Prix</SelectItem>
                  </SelectContent>
                </Select>

                {/* Filter by Availability */}
                <Select value={filterByAvailability} onValueChange={(value: 'all' | 'in_stock' | 'out_of_stock') => setFilterByAvailability(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Disponibilité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="in_stock">En stock</SelectItem>
                    <SelectItem value="out_of_stock">Rupture</SelectItem>
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
              <div className="mt-4 text-sm text-gray-600">
                {filteredAndSortedFavorites.length} résultat{filteredAndSortedFavorites.length !== 1 ? 's' : ''}
                {searchQuery && ` pour "${searchQuery}"`}
              </div>
            </div>

            {/* Favorites Grid/List */}
            {filteredAndSortedFavorites.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun résultat trouvé
                </h3>
                <p className="text-gray-600 mb-6">
                  Essayez de modifier vos filtres de recherche
                </p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setFilterByAvailability('all');
                }} variant="outline">
                  Effacer les filtres
                </Button>
              </div>
            ) : (
              <FavoritesGrid
                favorites={filteredAndSortedFavorites}
                viewMode={viewMode}
                onRemoveFromFavorites={handleRemoveFromFavorites}
                onAddToCart={handleAddToCart}
                removeFromFavoritesMutation={removeFromFavoritesMutation}
                addToCartMutation={addToCartMutation}
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
}

function FavoritesGrid({
  favorites,
  viewMode,
  onRemoveFromFavorites,
  onAddToCart,
  removeFromFavoritesMutation,
  addToCartMutation
}: FavoritesGridProps) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {favorites.map((favorite) => (
          <Card key={favorite.id}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                {/* Product Image */}
                <div className="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0">
                  <Image
                    src={favorite.product.imageUrl || '/placeholder.png'}
                    alt={favorite.product.name}
                    width={96}
                    height={96}
                    className="object-contain w-full h-full p-2"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link
                        href={`/produit/${favorite.productId}`}
                        className="font-semibold text-gray-900 hover:text-[#162e77]"
                      >
                        {favorite.product.name}
                      </Link>
                      <div className="text-sm text-gray-600 mt-1">
                        <Badge variant="secondary">{favorite.product.brand?.name}</Badge>
                      </div>
                      <div className="flex items-center mt-2">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            favorite.product.availability === 'in_stock'
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}
                        />
                        <span className="text-sm text-gray-600">
                          {favorite.product.availability === 'in_stock'
                            ? 'En stock'
                            : 'Rupture de stock'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Ajouté le {new Date(favorite.addedAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-[#162e77]">
                        {Number(favorite.product.price).toFixed(2)} €
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => onAddToCart(favorite.productId.toString())}
                        disabled={
                          favorite.product.availability !== 'in_stock' ||
                          addToCartMutation.isPending
                        }
                        className="bg-[#162e77] hover:bg-[#1e40af]"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Ajouter au panier
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFromFavorites(favorite.id)}
                      disabled={removeFromFavoritesMutation.isPending}
                      className="text-red-600 hover:text-red-700"
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
            <Link href={`/produit/${favorite.productId}`}>
              <div className="aspect-square bg-gray-50 p-4">
                <Image
                  src={favorite.product.imageUrl || '/placeholder.png'}
                  alt={favorite.product.name}
                  width={200}
                  height={200}
                  className="object-contain w-full h-full group-hover:scale-105 transition-transform"
                />
              </div>
            </Link>

            {/* Remove button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFromFavorites(favorite.id)}
              disabled={removeFromFavoritesMutation.isPending}
              className="absolute top-2 right-2 text-red-600 hover:text-red-700 hover:bg-white"
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
            <Link href={`/produit/${favorite.productId}`} className="hover:text-[#162e77]">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {favorite.product.name}
              </h3>
            </Link>

            <div className="flex items-center justify-between mb-3">
              <Badge variant="secondary" className="text-xs">
                {favorite.product.brand?.name}
              </Badge>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">4.5</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-bold text-[#162e77]">
                {Number(favorite.product.price).toFixed(2)} €
              </div>
              <div className="text-xs text-gray-500">
                Ajouté le {new Date(favorite.addedAt).toLocaleDateString('fr-FR')}
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => onAddToCart(favorite.productId.toString())}
              disabled={
                favorite.product.availability !== 'in_stock' ||
                addToCartMutation.isPending
              }
              className="w-full bg-[#162e77] hover:bg-[#1e40af] text-white"
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
