'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Percent, Star, Zap, Flame, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePromotions } from '@/lib/query/hooks';

export function PromotionsSection() {
  const { data: promotions, isLoading, error } = usePromotions();

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-4" />
                <div className="h-6 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4 text-center">
          <div className="text-red-600 mb-4">Erreur lors du chargement des promotions</div>
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

  // Static promotions if API doesn't return data
  const currentPromotions = promotions?.data?.length ? promotions.data : [
    {
      id: '1',
      title: 'Confort été',
      description: 'Jusqu\'à -30% sur les solutions de climatisation et ventilation',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      link: '/promotions/confort-ete',
      validUntil: '2024-08-31',
      discount: '30%',
      category: 'Climatisation'
    },
    {
      id: '2',
      title: 'Éclairage LED',
      description: 'Offres exceptionnelles sur l\'éclairage LED professionnel',
      imageUrl: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=300&fit=crop',
      link: '/promotions/eclairage-led',
      validUntil: '2024-07-15',
      discount: '25%',
      category: 'Éclairage'
    },
    {
      id: '3',
      title: 'Smart Building',
      description: 'Découvrez les solutions connectées pour bâtiments intelligents',
      imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      link: '/promotions/smart-building',
      validUntil: '2024-09-30',
      discount: 'Nouveau',
      category: 'Innovation'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-red-200 rounded-full opacity-20 -translate-x-16 -translate-y-16" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-orange-200 rounded-full opacity-20 translate-x-20 translate-y-20" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="flex items-center space-x-2">
              <Flame className="w-6 h-6 text-red-500" />
              <Badge variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">
                En ce moment
              </Badge>
              <Flame className="w-6 h-6 text-red-500" />
            </div>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Offres exceptionnelles
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Profitez de nos promotions limitées sur une sélection de produits électriques
            de qualité professionnelle
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {currentPromotions.map((promotion, index) => (
            <div
              key={promotion.id}
              className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-red-300 ${
                index === 0 ? 'lg:col-span-2 lg:row-span-1' : ''
              }`}
            >
              {/* Promotion image */}
              <div className={`relative ${index === 0 ? 'h-64' : 'h-48'} overflow-hidden`}>
                <Image
                  src={promotion.imageUrl}
                  alt={promotion.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Discount badge */}
                <div className="absolute top-4 left-4">
                  <Badge
                    variant="destructive"
                    className="bg-red-500 text-white font-bold text-lg px-3 py-1"
                  >
                    {('discount' in promotion && promotion.discount === 'Nouveau') ? (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>Nouveau</span>
                      </div>
                    ) : ('discount' in promotion ? (
                      <div className="flex items-center space-x-1">
                        <Percent className="w-4 h-4" />
                        <span>-{promotion.discount}</span>
                      </div>
                    ) : null)}
                  </Badge>
                </div>

                {/* Category badge */}
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 text-gray-700">
                    {'category' in promotion ? promotion.category : ""}
                  </Badge>
                </div>

                {/* Countdown timer */}
                <div className="absolute bottom-4 right-4">
                  <div className="flex items-center space-x-1 bg-white/90 rounded-full px-3 py-1 text-xs text-gray-700">
                    <Clock className="w-3 h-3" />
                    <span>
                      Jusqu'au {new Date(promotion.validUntil).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                  {promotion.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {promotion.description}
                </p>

                {/* CTA Button */}
                <Button
                  variant="outline"
                  className="w-full group/btn border-red-200 text-red-600 hover:bg-red-600 hover:text-white font-semibold"
                  asChild
                >
                  <Link href={promotion.link}>
                    Découvrir l'offre
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>

              {/* Special effects for featured promotion */}
              {index === 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 pointer-events-none" />
              )}
            </div>
          ))}
        </div>

        {/* Additional quick offers */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Offres flash du moment
            </h3>
            <p className="text-gray-600">
              Profitez de ces offres exceptionnelles à durée limitée
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Livraison express</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Livraison en 24h sur plus de 10 000 références
              </p>
              <Badge variant="outline" className="border-primary/20 text-primary">
                Gratuite dès 150€
              </Badge>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                <Percent className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Prix dégressifs</h4>
              <p className="text-sm text-gray-600 mb-3">
                Plus vous commandez, plus vous économisez
              </p>
              <Badge variant="outline" className="border-green-200 text-green-700">
                Jusqu'à -20%
              </Badge>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Nouveau client</h4>
              <p className="text-sm text-gray-600 mb-3">
                20€ de réduction sur votre première commande
              </p>
              <Badge variant="outline" className="border-purple-200 text-purple-700">
                Code: BIENV202
              </Badge>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-red-500 text-white hover:bg-red-600 font-semibold"
            asChild
          >
            <Link href="/promotions">
              Voir toutes les promotions
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
