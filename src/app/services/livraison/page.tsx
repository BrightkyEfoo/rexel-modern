import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Shield, 
  CheckCircle,
  Package,
  Route,
  Calendar,
  Phone,
  Mail,
  Calculator,
  ArrowRight,
  Star,
  Users,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function LivraisonServicePage() {
  const deliveryZones = [
    {
      zone: 'Zone 1 - Grandes villes',
      cities: ['Douala', 'Yaoundé', 'Garoua', 'Bamenda'],
      time: '24-48h',
      price: '5 000 FCFA',
      freeFrom: '100 000 FCFA',
      color: 'bg-green-500'
    },
    {
      zone: 'Zone 2 - Villes moyennes',
      cities: ['Bafoussam', 'Ngaoundéré', 'Maroua', 'Bertoua'],
      time: '3-5 jours',
      price: '8 000 FCFA',
      freeFrom: '150 000 FCFA',
      color: 'bg-blue-500'
    },
    {
      zone: 'Zone 3 - Autres localités',
      cities: ['Villes secondaires', 'Villages accessibles'],
      time: '5-10 jours',
      price: '12 000 FCFA',
      freeFrom: '200 000 FCFA',
      color: 'bg-orange-500'
    }
  ];

  const deliveryOptions = [
    {
      name: 'Livraison Standard',
      description: 'Livraison classique aux horaires d\'ouverture',
      features: ['Horaires 8h-17h', 'Suivi SMS', 'Emballage sécurisé', 'Assurance incluse'],
      price: 'Selon zone',
      icon: Truck,
      popular: false
    },
    {
      name: 'Livraison Express',
      description: 'Livraison prioritaire sous 24h (Douala/Yaoundé)',
      features: ['Livraison 24h', 'Suivi temps réel', 'SMS + Email', 'Support dédié'],
      price: '15 000 FCFA',
      icon: Zap,
      popular: true
    },
    {
      name: 'Livraison Pro',
      description: 'Service premium avec installation sur site',
      features: ['Installation incluse', 'Technicien qualifié', 'Mise en service', 'Formation utilisateur'],
      price: 'Sur devis',
      icon: Users,
      popular: false
    }
  ];

  const testimonials = [
    {
      name: 'Ibrahim SANOGO',
      company: 'Électricité Générale SARL',
      rating: 5,
      comment: 'Service de livraison très professionnel. Mes commandes arrivent toujours en parfait état et dans les délais annoncés.',
      city: 'Douala'
    },
    {
      name: 'Marie NGUYEN',
      company: 'Entreprise BATEX',
      rating: 5,
      comment: 'Excellente réactivité ! Commande passée le matin, livrée le lendemain sur mon chantier à Yaoundé.',
      city: 'Yaoundé'
    },
    {
      name: 'Paul BIYA Jr',
      company: 'Installations Modernes',
      rating: 4,
      comment: 'Très satisfait de la livraison express. L\'équipe de livraison est courtoise et professionnelle.',
      city: 'Bafoussam'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Livraison Sécurisée',
      description: 'Emballage professionnel et assurance complète pour tous vos équipements'
    },
    {
      icon: Route,
      title: 'Suivi en Temps Réel',
      description: 'Suivez votre commande étape par étape avec notre système de tracking'
    },
    {
      icon: Calendar,
      title: 'Livraison Programmée',
      description: 'Planifiez votre livraison selon vos disponibilités et contraintes'
    },
    {
      icon: Users,
      title: 'Équipe Spécialisée',
      description: 'Livreurs formés à la manipulation d\'équipements électriques sensibles'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Badge variant="secondary">Service Premium</Badge>
                  <Badge variant="outline" className="border-primary-foreground text-primary-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    4.8/5
                  </Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Service de Livraison
                </h1>
                <p className="text-xl text-primary-foreground/80 mb-8">
                  Recevez vos équipements électriques rapidement et en sécurité, 
                  partout au Cameroun avec notre service de livraison professionnel.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="secondary" size="lg">
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculer les frais
                  </Button>
                  <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Suivre une commande
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="bg-primary-foreground/10 rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-primary-foreground/20 rounded-lg p-4">
                      <Truck className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">24-48h</div>
                      <div className="text-sm text-primary-foreground/80">Livraison rapide</div>
                    </div>
                    <div className="bg-primary-foreground/20 rounded-lg p-4">
                      <MapPin className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">10+</div>
                      <div className="text-sm text-primary-foreground/80">Villes couvertes</div>
                    </div>
                    <div className="bg-primary-foreground/20 rounded-lg p-4">
                      <Shield className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">100%</div>
                      <div className="text-sm text-primary-foreground/80">Sécurisé</div>
                    </div>
                    <div className="bg-primary-foreground/20 rounded-lg p-4">
                      <Package className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">0%</div>
                      <div className="text-sm text-primary-foreground/80">Casse garantie</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Options de livraison */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Nos Options de Livraison</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choisissez l'option qui correspond le mieux à vos besoins et contraintes
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {deliveryOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <Card key={index} className={`relative ${option.popular ? 'ring-2 ring-primary' : ''}`}>
                    {option.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge variant="default" className="bg-primary">
                          <Star className="w-3 h-3 mr-1" />
                          Populaire
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8" />
                      </div>
                      <CardTitle>{option.name}</CardTitle>
                      <CardDescription>{option.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{option.price}</div>
                      </div>
                      <ul className="space-y-2">
                        {option.features.map((feature, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full" variant={option.popular ? "default" : "outline"}>
                        Choisir cette option
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Zones de livraison */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Zones et Tarifs de Livraison</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez nos zones de couverture et les délais de livraison associés
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {deliveryZones.map((zone, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${zone.color}`}></div>
                      <CardTitle className="text-lg">{zone.zone}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-primary" />
                        Villes couvertes
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {zone.cities.map((city, i) => (
                          <li key={i}>• {city}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="flex items-center justify-center text-primary mb-1">
                          <Clock className="w-4 h-4 mr-1" />
                        </div>
                        <div className="font-semibold">{zone.time}</div>
                        <div className="text-xs text-muted-foreground">Délai</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center text-primary mb-1">
                          <Truck className="w-4 h-4 mr-1" />
                        </div>
                        <div className="font-semibold">{zone.price}</div>
                        <div className="text-xs text-muted-foreground">Tarif</div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <div className="text-sm font-medium text-green-800">
                        Livraison gratuite dès {zone.freeFrom}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Caractéristiques du service */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Pourquoi Choisir Notre Service ?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Un service de livraison conçu spécialement pour les professionnels de l'électricité
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Calculateur de frais */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center space-x-2">
                    <Calculator className="w-6 h-6 text-primary" />
                    <span>Calculateur de Frais de Livraison</span>
                  </CardTitle>
                  <CardDescription>
                    Estimez le coût et le délai de livraison pour votre commande
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ville de livraison</Label>
                      <Input id="city" placeholder="Ex: Douala, Yaoundé..." />
                    </div>
                    <div>
                      <Label htmlFor="weight">Poids estimé (kg)</Label>
                      <Input id="weight" type="number" placeholder="Ex: 25" />
                    </div>
                    <div>
                      <Label htmlFor="value">Valeur de la commande (FCFA)</Label>
                      <Input id="value" type="number" placeholder="Ex: 150000" />
                    </div>
                    <div>
                      <Label htmlFor="urgency">Type de livraison</Label>
                      <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
                        <option value="standard">Standard</option>
                        <option value="express">Express</option>
                        <option value="pro">Pro avec installation</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button className="w-full" size="lg">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculer les frais
                  </Button>
                  
                  <div className="bg-primary/5 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Estimation</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-primary">8 000 F</div>
                        <div className="text-sm text-muted-foreground">Frais de livraison</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">3-5 j</div>
                        <div className="text-sm text-muted-foreground">Délai estimé</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Témoignages */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Ce Que Disent Nos Clients</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                La satisfaction de nos clients est notre priorité absolue
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center space-x-1 mb-2">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription>{testimonial.company}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground italic mb-3">"{testimonial.comment}"</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      {testimonial.city}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Prêt à Commander ?</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
                  Passez votre commande maintenant et bénéficiez de notre service de livraison professionnel
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="secondary" size="lg" asChild>
                    <Link href="/catalogue">
                      <Package className="w-5 h-5 mr-2" />
                      Parcourir le catalogue
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                    <Link href="/contact">
                      <Phone className="w-5 h-5 mr-2" />
                      Questions sur la livraison
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
