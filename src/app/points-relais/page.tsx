'use client';

import { MapPin, Search, Loader2, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { usePickupPoints, useSearchPickupPoints, usePickupPointStats } from '@/lib/hooks/usePickupPoints';
import { PickupPointCard } from '@/components/pickup-points/PickupPointCard';
import { useState } from 'react';

export default function PointsRelaisPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Récupération des données
  const { data: pickupPointsResponse, isLoading, error } = usePickupPoints();
  const { data: searchResponse, isLoading: isSearchLoading } = useSearchPickupPoints(searchQuery);
  const { data: statsResponse } = usePickupPointStats();
  
  const pointsRelais = searchQuery ? (searchResponse?.data || []) : (pickupPointsResponse?.data || []);
  const stats = statsResponse?.data;
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      // La recherche se fait automatiquement via le hook useSearchPickupPoints
      setTimeout(() => setIsSearching(false), 500);
    }
  };
  

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Nos Points de Relais</h1>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Retrouvez nos points de relais partout au Cameroun pour un service de proximité et une expertise en matériel énergétique
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="relative flex-1 max-w-md">
                <Input
                  placeholder="Entrez votre code postal ou ville..."
                  className="pl-10 pr-4 py-3 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
              <Button 
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                onClick={handleSearch}
                disabled={isSearching || isSearchLoading}
              >
                {(isSearching || isSearchLoading) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Recherche...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Rechercher
                  </>
                )}
              </Button>
              {searchQuery && (
                <Button 
                  variant="outline"
                  className="border-primary-foreground text-primary hover:bg-primary-foreground/10"
                  onClick={() => setSearchQuery('')}
                >
                  Effacer
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {stats ? `${stats.active}+` : <Skeleton className="h-8 w-16 mx-auto" />}
              </div>
              <div className="text-muted-foreground">Points de relais</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {stats ? `${Number(stats.avgRating || 0).toFixed(1)}★` : <Skeleton className="h-8 w-16 mx-auto" />}
              </div>
              <div className="text-muted-foreground">Note moyenne</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {stats ? `${stats.cities}` : <Skeleton className="h-8 w-16 mx-auto" />}
              </div>
              <div className="text-muted-foreground">Villes couvertes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">7j/7</div>
              <div className="text-muted-foreground">Service disponible</div>
            </div>
          </div>
        </div>
      </div>

      {/* Points de relais list */}
      <div className="container mx-auto px-4 py-12">
        {/* Titre avec indicateur de recherche */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {searchQuery ? `Résultats pour "${searchQuery}"` : 'Nos Points de Relais'}
          </h2>
          <p className="text-gray-600">
            {searchQuery && pointsRelais.length > 0 && `${pointsRelais.length} point(s) trouvé(s)`}
          </p>
        </div>

        {/* Gestion des états de chargement et d'erreur */}
        {error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-red-600 mb-2">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
              <p className="text-red-600 mb-4">
                Impossible de charger les points de relais. Veuillez réessayer plus tard.
              </p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Réessayer
              </Button>
            </div>
          </div>
        ) : isLoading || (searchQuery && isSearchLoading) ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <div className="flex gap-2 mb-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-18" />
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : pointsRelais.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? 'Aucun résultat trouvé' : 'Aucun point de relais disponible'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? 'Essayez avec d\'autres termes de recherche ou une ville différente.'
                  : 'Nos points de relais seront bientôt disponibles.'}
              </p>
              {searchQuery && (
                <Button onClick={() => setSearchQuery('')} variant="outline">
                  Voir tous les points de relais
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pointsRelais.map((point) => (
              <PickupPointCard 
                key={point.id} 
                point={point} 
                showManagerPhoto={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Besoin d'aide ?</h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Notre équipe d'experts en matériel énergétique est là pour vous accompagner
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              <Phone className="w-5 h-5 mr-2" />
              Nous contacter
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary">
              <Mail className="w-5 h-5 mr-2" />
              Demander un devis
            </Button>
          </div>
        </div>
      </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
} 