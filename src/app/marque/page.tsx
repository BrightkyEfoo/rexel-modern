"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useBrands } from "@/lib/query/hooks";
import type { Brand } from "@/lib/types/brands";
import { Building2, ExternalLink, Search, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const { data: brandsResponse, isLoading, error } = useBrands();

  const brands = brandsResponse?.data || [];

  // Filtrer les marques selon la recherche et le filtre featured
  const filteredBrands = useMemo(() => {
    let filtered = brands;

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (brand) =>
          brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          brand.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par marques mises en avant
    if (showFeaturedOnly) {
      filtered = filtered.filter((brand) => brand.isFeatured);
    }

    return filtered;
  }, [brands, searchTerm, showFeaturedOnly]);

  // Séparer les marques featured et normales pour l'affichage
  const featuredBrands = filteredBrands.filter((brand) => brand.isFeatured);
  const regularBrands = filteredBrands.filter((brand) => !brand.isFeatured);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Erreur de chargement
            </h1>
            <p className="text-gray-600 mb-8">
              Une erreur est survenue lors du chargement des marques.
            </p>
            <Link href="/" className="text-primary-dark hover:underline">
              Retour à l'accueil
            </Link>
          </div>
        </main>
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
          <Link href="/" className="hover:text-primary-dark">
            Accueil
          </Link>
          <span>/</span>
          <span className="text-gray-900">Marques</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Nos Marques Partenaires
          </h1>
          <p className="text-gray-600 mb-6">
            Découvrez toutes nos marques partenaires et explorez leurs produits
            de qualité.
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Rechercher une marque..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={showFeaturedOnly ? "default" : "outline"}
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className="shrink-0"
            >
              <Star className="w-4 h-4 mr-2" />
              Marques vedettes
            </Button>
          </div>

          {/* Stats */}
          <div className="text-sm text-gray-500">
            {filteredBrands.length} marque{filteredBrands.length > 1 ? "s" : ""}{" "}
            trouvée{filteredBrands.length > 1 ? "s" : ""}
            {featuredBrands.length > 0 && (
              <span>
                {" "}
                • {featuredBrands.length} marque
                {featuredBrands.length > 1 ? "s" : ""} vedette
                {featuredBrands.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Featured Brands Section */}
        {featuredBrands.length > 0 && !showFeaturedOnly && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Star className="w-6 h-6 text-yellow-500 mr-2" />
              Marques Vedettes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredBrands.map((brand) => (
                // @ts-ignore
                <BrandCard key={brand.id} brand={brand} featured />
              ))}
            </div>
          </div>
        )}

        {/* Regular Brands Section */}
        {regularBrands.length > 0 && !showFeaturedOnly && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Toutes nos Marques
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {regularBrands.map((brand) => (
                // @ts-ignore
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          </div>
        )}

        {/* Featured Only Section */}
        {showFeaturedOnly && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredBrands.map((brand) => (
                // @ts-ignore
                <BrandCard key={brand.id} brand={brand} featured />
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {filteredBrands.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune marque trouvée
            </h3>
            <p className="text-gray-600 mb-4">
              Essayez de modifier vos critères de recherche ou de navigation.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setShowFeaturedOnly(false);
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

interface BrandCardProps {
  brand: Brand;
  featured?: boolean;
}

function BrandCard({ brand, featured = false }: BrandCardProps) {
  return (
    <Link href={`/marque/${brand.slug}`}>
      <Card
        className={`group hover:shadow-lg transition-all duration-200 overflow-hidden h-full ${
          featured
            ? "ring-2 ring-yellow-200 bg-gradient-to-br from-yellow-50 to-white"
            : ""
        }`}
      >
        <CardContent className="p-6 h-full flex flex-col relative">
          {/* Header with logo */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {brand.imageUrl ? (
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={brand.imageUrl}
                    alt={`Logo ${brand.name}`}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-primary-dark bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-primary-dark opacity-80" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-dark transition-colors truncate">
                  {brand.name}
                </h3>
                {featured && (
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-xs text-yellow-600 font-medium">
                      Vedette
                    </span>
                  </div>
                )}
              </div>
            </div>

            {brand.websiteUrl && (
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-dark transition-colors flex-shrink-0" />
            )}
          </div>

          {/* Description */}
          {brand.description && (
            <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">
              {brand.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <span className="text-xs font-medium text-gray-500">
              {brand.productCount || 0} produit
              {(brand.productCount || 0) > 1 ? "s" : ""}
            </span>

            <div className="flex items-center space-x-2">
              {!brand.isActive && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  Indisponible
                </span>
              )}
              <div className="w-5 h-5 text-primary-dark opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  className="w-full h-full"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Hover effect */}
          <div
            className={`absolute inset-0 bg-gradient-to-r from-primary-dark to-blue-600 opacity-0 group-hover:opacity-5 transition-opacity ${
              featured ? "from-yellow-400 to-yellow-600" : ""
            }`}
          ></div>
        </CardContent>
      </Card>
    </Link>
  );
}
