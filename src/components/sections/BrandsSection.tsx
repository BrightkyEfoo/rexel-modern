'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useFeaturedBrands } from '@/lib/query/hooks';
import { BrandCard } from './BrandCard';

export function BrandsSection() {
  const { data: brands, isLoading, error } = useFeaturedBrands();

  console.log('error', error)

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="text-red-600 mb-4">Erreur lors du chargement des marques</div>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:underline"
          >
            Réessayer
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Nos marques partenaires
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre sélection de marques leaders mondiales pour tous vos projets électriques
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {brands?.data?.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>

        {/* View all brands */}
        <div className="text-center">
          <Link
            href="/marques"
            className="inline-flex items-center space-x-2 text-primary-dark hover:text-primary-hover font-semibold text-lg group"
          >
            <span>Voir tous nos partenaires</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 pt-12 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Marques partenaires</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">70+</div>
              <div className="text-sm text-muted-foreground">Années d'expérience</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">99%</div>
              <div className="text-sm text-muted-foreground">Disponibilité produits</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
