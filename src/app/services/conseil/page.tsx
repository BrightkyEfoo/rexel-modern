import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import {
  BarChart,
  CheckCircle,
  FileText,
  Lightbulb,
  Phone,
  Star,
  Users
} from 'lucide-react';

export default function ConseilServicePage() {
  const services = [
    {
      name: 'Audit Énergétique',
      description: 'Analyse complète de votre consommation énergétique',
      icon: BarChart,
      features: ['Diagnostic complet', 'Recommandations', 'Plan d\'optimisation', 'Suivi ROI'],
      price: 'À partir de 100 000 FCFA',
      duration: '2-5 jours',
      popular: true
    },
    {
      name: 'Conception Électrique',
      description: 'Études techniques pour vos projets électriques',
      icon: Lightbulb,
      features: ['Plans électriques', 'Calculs de charge', 'Choix matériels', 'Conformité normes'],
      price: 'Sur devis',
      duration: '1-3 semaines',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Conseil & Expertise Technique
              </h1>
              <p className="text-xl text-primary-foreground/80 mb-8">
                Bénéficiez de l'expertise de nos ingénieurs pour optimiser vos projets 
                électriques et énergétiques avec des solutions sur mesure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg">
                  <FileText className="w-5 h-5 mr-2" />
                  Demander une étude
                </Button>
                <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Phone className="w-5 h-5 mr-2" />
                  Consultation gratuite
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services de conseil */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Nos Services de Conseil</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Expertise technique et accompagnement personnalisé pour tous vos projets
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Card key={index} className={`relative ${service.popular ? 'ring-2 ring-primary' : ''}`}>
                    {service.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge variant="default" className="bg-primary">
                          <Star className="w-3 h-3 mr-1" />
                          Demandé
                        </Badge>
                      </div>
                    )}
                    <CardHeader>
                      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                        <Icon className="w-8 h-8" />
                      </div>
                      <CardTitle>{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="text-center">
                        <div className="text-xl font-bold text-primary mb-2">{service.price}</div>
                        <div className="text-sm text-muted-foreground mb-4">Délai: {service.duration}</div>
                        <Button className="w-full" variant={service.popular ? "default" : "outline"}>
                          Demander un devis
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Votre Projet Mérite une Expertise</h2>
                <p className="text-primary-foreground/80 mb-6">
                  Contactez nos experts pour une analyse personnalisée de vos besoins
                </p>
                <Button variant="secondary" size="lg">
                  <Users className="w-5 h-5 mr-2" />
                  Consultation d'expert
                </Button>
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
