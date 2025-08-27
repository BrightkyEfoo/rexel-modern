import { Sparkles, Star, ArrowRight, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { formatPrice } from '@/lib/utils/currency';

export default function NouveautesPage() {
  const nouveautes = [
    {
      id: 1,
      name: 'Interrupteur intelligent WiFi',
      description: 'Contrôlez votre éclairage depuis votre smartphone avec notre nouvelle gamme d\'interrupteurs connectés.',
      price: 89.99,
      oldPrice: 129.99,
      image: '/images/product-1.jpg',
      category: 'Appareillage',
      date: '2024-01-15',
      isNew: true,
      rating: 4.8,
      reviews: 24,
    },
    {
      id: 2,
      name: 'Câble solaire haute performance',
      description: 'Câble photovoltaïque nouvelle génération avec isolation renforcée et résistance aux UV.',
      price: 2.45,
      oldPrice: 3.20,
      image: '/images/product-2.jpg',
      category: 'Fils et câbles',
      date: '2024-01-10',
      isNew: true,
      rating: 4.6,
      reviews: 18,
    },
    {
      id: 3,
      name: 'LED RGB contrôlable',
      description: 'Ruban LED RGB avec contrôleur Bluetooth pour une ambiance personnalisée.',
      price: 45.99,
      oldPrice: 59.99,
      image: '/images/product-3.jpg',
      category: 'Éclairage',
      date: '2024-01-08',
      isNew: true,
      rating: 4.9,
      reviews: 31,
    },
    {
      id: 4,
      name: 'Panneau électrique modulaire',
      description: 'Tableau électrique nouvelle génération avec protection intégrée et design moderne.',
      price: 189.99,
      oldPrice: 249.99,
      image: '/images/product-4.jpg',
      category: 'Distribution d\'énergie',
      date: '2024-01-05',
      isNew: true,
      rating: 4.7,
      reviews: 12,
    },
    {
      id: 5,
      name: 'Radiateur électrique intelligent',
      description: 'Radiateur connecté avec programmation intelligente et détection de présence.',
      price: 299.99,
      oldPrice: 399.99,
      image: '/images/product-5.jpg',
      category: 'Chauffage',
      date: '2024-01-03',
      isNew: true,
      rating: 4.5,
      reviews: 8,
    },
    {
      id: 6,
      name: 'Outil multifonction électrique',
      description: 'Kit d\'outils professionnels avec testeur de tension et détecteur de câbles.',
      price: 79.99,
      oldPrice: 99.99,
      image: '/images/product-6.jpg',
      category: 'Outillage',
      date: '2024-01-01',
      isNew: true,
      rating: 4.4,
      reviews: 15,
    },
  ];

  const categories = [
    { name: 'Tous', count: 6 },
    { name: 'Appareillage', count: 1 },
    { name: 'Fils et câbles', count: 1 },
    { name: 'Éclairage', count: 1 },
    { name: 'Distribution d\'énergie', count: 1 },
    { name: 'Chauffage', count: 1 },
    { name: 'Outillage', count: 1 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Nouveautés</h1>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Découvrez nos dernières innovations et produits en avant-première
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <Badge
                  key={category.name}
                  variant="secondary"
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-primary-foreground hover:text-primary"
                >
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nouveautés Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nouveautes.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="relative">
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="destructive" className="text-xs">
                    Nouveau
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 z-10">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                </div>
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-gray-400 text-sm">Image produit</div>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {product.name}
                </CardTitle>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {product.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Prix */}
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-muted-foreground line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                    </Badge>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviews} avis)
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Ajouté le {new Date(product.date).toLocaleDateString('fr-FR')}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button className="flex-1" size="sm">
                      <Tag className="w-4 h-4 mr-2" />
                      Voir détails
                    </Button>
                    <Button variant="outline" size="sm">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Restez informé des nouveautés</h2>
            <p className="text-muted-foreground mb-8">
              Recevez en avant-première nos nouvelles offres et produits exclusifs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-0"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                S'abonner
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Besoin de conseils ?</h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Nos experts sont là pour vous accompagner dans vos choix
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Découvrir plus
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary">
              <ArrowRight className="w-5 h-5 mr-2" />
              Voir le catalogue
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