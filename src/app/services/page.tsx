import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Truck, 
  Settings, 
  GraduationCap, 
  Users, 
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Star,
  Shield,
  Zap,
  Wrench,
  Building,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
  const baseServices = [
    {
      id: 'livraison',
      name: 'Service de Livraison',
      description: 'Livraison rapide et sécurisée de vos équipements électriques partout au Cameroun',
      icon: Truck,
      features: ['Livraison 24-48h', 'Suivi en temps réel', 'Installation sur site', 'Zones étendues'],
      pricing: 'À partir de 5 000 FCFA',
      popular: false,
      color: 'bg-blue-500',
      href: '/services/livraison'
    },
    {
      id: 'installation',
      name: 'Installation Électrique',
      description: 'Installation professionnelle de vos équipements par nos techniciens certifiés',
      icon: Settings,
      features: ['Techniciens certifiés', 'Garantie 2 ans', 'Mise en conformité', 'Support 24/7'],
      pricing: 'À partir de 25 000 FCFA',
      popular: true,
      color: 'bg-green-500',
      href: '/services/installation'
    },
    {
      id: 'formation',
      name: 'Formation Technique',
      description: 'Formations spécialisées pour maîtriser vos équipements électriques',
      icon: GraduationCap,
      features: ['Formation certifiante', 'Modules pratiques', 'Support pédagogique', 'Suivi personnalisé'],
      pricing: 'À partir de 50 000 FCFA',
      popular: false,
      color: 'bg-purple-500',
      href: '/services/formation'
    },
    {
      id: 'conseil',
      name: 'Conseil & Expertise',
      description: 'Accompagnement expert pour vos projets électriques et énergétiques',
      icon: Users,
      features: ['Audit technique', 'Dimensionnement', 'Optimisation', 'Suivi de projet'],
      pricing: 'Sur devis',
      popular: false,
      color: 'bg-orange-500',
      href: '/services/conseil'
    }
  ];

  const additionalServices = [
    {
      name: 'Maintenance Préventive',
      description: 'Contrats de maintenance pour vos installations électriques',
      icon: Wrench,
      status: 'Disponible'
    },
    {
      name: 'Audit Énergétique',
      description: 'Analyse complète de votre consommation énergétique',
      icon: Zap,
      status: 'Bientôt disponible'
    },
    {
      name: 'Solutions Smart Building',
      description: 'Automatisation et domotique pour bâtiments intelligents',
      icon: Building,
      status: 'Nouveau'
    },
    {
      name: 'Éclairage LED',
      description: 'Migration vers des solutions d\'éclairage économiques',
      icon: Lightbulb,
      status: 'Populaire'
    }
  ];

  const stats = [
    { number: '500+', label: 'Projets réalisés', icon: CheckCircle },
    { number: '98%', label: 'Satisfaction client', icon: Star },
    { number: '24h', label: 'Intervention rapide', icon: Clock },
    { number: '10+', label: 'Villes couvertes', icon: MapPin }
  ];

  const certifications = [
    'Certification ISO 9001',
    'Agréments techniques Cameroun',
    'Partenaire officiel fabricants',
    'Assurance responsabilité civile'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Nos Services Professionnels
              </h1>
              <p className="text-xl text-primary-foreground/80 mb-8">
                Des solutions complètes pour tous vos besoins en matériel électrique et énergétique
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {certifications.map((cert, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    <Shield className="w-4 h-4 mr-2" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Services principaux */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Services Principaux</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez nos quatre services de base qui couvrent tous vos besoins en matériel électrique
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {baseServices.map((service) => {
                const Icon = service.icon;
                return (
                  <Card key={service.id} className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 group ${service.popular ? 'ring-2 ring-primary' : ''}`}>
                    {service.popular && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge variant="default" className="bg-primary">
                          <Star className="w-3 h-3 mr-1" />
                          Populaire
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="relative">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${service.color} text-white group-hover:scale-110 transition-transform`}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                            {service.name}
                          </CardTitle>
                          <CardDescription className="text-base">
                            {service.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">Caractéristiques clés</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {service.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Tarif</p>
                          <p className="font-semibold text-lg text-primary">{service.pricing}</p>
                        </div>
                        <Button asChild>
                          <Link href={service.href}>
                            <ArrowRight className="w-4 h-4 mr-2" />
                            En savoir plus
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Services additionnels */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Services Complémentaires</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Des services spécialisés pour répondre à vos besoins spécifiques
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge 
                        variant={service.status === 'Nouveau' ? 'default' : service.status === 'Populaire' ? 'secondary' : 'outline'}
                        className="mb-4"
                      >
                        {service.status}
                      </Badge>
                      <Button variant="outline" className="w-full" disabled={service.status === 'Bientôt disponible'}>
                        {service.status === 'Bientôt disponible' ? 'Bientôt disponible' : 'Demander un devis'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Processus de travail */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Notre Processus</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Une approche structurée pour garantir la qualité de nos interventions
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Analyse des besoins', description: 'Étude détaillée de votre projet et de vos contraintes' },
                { step: '02', title: 'Proposition technique', description: 'Élaboration d\'une solution adaptée avec devis détaillé' },
                { step: '03', title: 'Mise en œuvre', description: 'Réalisation par nos équipes certifiées selon planning convenu' },
                { step: '04', title: 'Suivi & maintenance', description: 'Accompagnement post-installation et service après-vente' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary/20 transform translate-x-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Zone de couverture */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Zones d'Intervention</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Nos services sont disponibles dans les principales villes du Cameroun
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { region: 'Littoral', cities: ['Douala', 'Edéa', 'Nkongsamba'], coverage: '100%' },
                { region: 'Centre', cities: ['Yaoundé', 'Mbalmayo', 'Obala'], coverage: '95%' },
                { region: 'Ouest', cities: ['Bafoussam', 'Dschang', 'Bangangté'], coverage: '85%' },
                { region: 'Nord', cities: ['Garoua', 'Maroua', 'Ngaoundéré'], coverage: '70%' },
                { region: 'Nord-Ouest', cities: ['Bamenda', 'Kumbo', 'Wum'], coverage: '65%' },
                { region: 'Autres régions', cities: ['Sur demande', 'Devis personnalisé'], coverage: '50%' }
              ].map((zone, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{zone.region}</CardTitle>
                      <Badge variant="secondary">{zone.coverage}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 mb-3">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Villes principales</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {zone.cities.map((city, i) => (
                        <li key={i}>• {city}</li>
                      ))}
                    </ul>
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
                <h2 className="text-3xl font-bold mb-4">Besoin d'un service personnalisé ?</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
                  Nos experts sont à votre disposition pour étudier votre projet et vous proposer 
                  la solution la mieux adaptée à vos besoins spécifiques.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="secondary" size="lg" asChild>
                    <Link href="/contact">
                      <Phone className="w-5 h-5 mr-2" />
                      Nous contacter
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Demander un devis
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
