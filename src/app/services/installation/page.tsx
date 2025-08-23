import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Shield, 
  CheckCircle,
  Clock,
  Users,
  Wrench,
  Zap,
  Building,
  FileText,
  Phone,
  Star,
  Award,
  AlertTriangle,
  Home,
  Factory
} from 'lucide-react';
import Link from 'next/link';

export default function InstallationServicePage() {
  const installationTypes = [
    {
      name: 'Installation Résidentielle',
      description: 'Installation électrique complète pour habitations',
      icon: Home,
      features: ['Tableau électrique', 'Prises et éclairage', 'Mise aux normes', 'Domotique'],
      price: 'À partir de 50 000 FCFA',
      duration: '1-3 jours',
      warranty: '2 ans',
      popular: false
    },
    {
      name: 'Installation Industrielle', 
      description: 'Solutions électriques pour entreprises et industries',
      icon: Factory,
      features: ['Haute tension', 'Automatisation', 'Supervision', 'Maintenance incluse'],
      price: 'Sur devis',
      duration: '1-4 semaines',
      warranty: '3 ans',
      popular: true
    },
    {
      name: 'Installation Commerciale',
      description: 'Équipements électriques pour commerces et bureaux',
      icon: Building,
      features: ['Éclairage professionnel', 'Sécurité', 'Économies d\'énergie', 'Evolutif'],
      price: 'À partir de 150 000 FCFA',
      duration: '3-7 jours',
      warranty: '2 ans',
      popular: false
    }
  ];

  const certifications = [
    {
      name: 'Certification Électricien',
      description: 'Techniciens certifiés par l\'État du Cameroun',
      icon: Award
    },
    {
      name: 'Normes IEC',
      description: 'Conformité aux standards internationaux',
      icon: Shield
    },
    {
      name: 'Assurance Décennale',
      description: 'Garantie 10 ans sur les gros œuvres',
      icon: FileText
    },
    {
      name: 'Formation Continue',
      description: 'Mise à jour permanente des compétences',
      icon: Users
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Audit Technique',
      description: 'Visite sur site et analyse des besoins',
      duration: '1-2h',
      icon: CheckCircle
    },
    {
      step: '02', 
      title: 'Devis Détaillé',
      description: 'Proposition technique et financière',
      duration: '24-48h',
      icon: FileText
    },
    {
      step: '03',
      title: 'Planification',
      description: 'Organisation des travaux et approvisionnement',
      duration: '2-5 jours',
      icon: Clock
    },
    {
      step: '04',
      title: 'Installation',
      description: 'Réalisation par nos équipes certifiées',
      duration: 'Selon projet',
      icon: Settings
    },
    {
      step: '05',
      title: 'Tests & Mise en Service',
      description: 'Vérifications complètes et formation',
      duration: '2-4h',
      icon: Zap
    },
    {
      step: '06',
      title: 'Suivi & Maintenance',
      description: 'Accompagnement post-installation',
      duration: 'Permanent',
      icon: Shield
    }
  ];

  const testimonials = [
    {
      name: 'Société CAMEROUN BÂTIMENT',
      project: 'Centre commercial moderne - Douala',
      rating: 5,
      comment: 'Installation impeccable de l\'éclairage LED et du système de sécurité. Équipe très professionnelle et respectueuse des délais.',
      savings: '40% d\'économie d\'énergie'
    },
    {
      name: 'Villa Prestige - M. ATANGANA',
      project: 'Résidence privée - Yaoundé',
      rating: 5,
      comment: 'Domotique installée parfaitement. La maison est maintenant connectée et l\'installation respecte toutes les normes.',
      savings: 'Confort optimal'
    },
    {
      name: 'Usine AGRO-CAME',
      project: 'Installation industrielle - Garoua',
      rating: 5,
      comment: 'Projet complexe mené à bien dans les temps. L\'automatisation a considérablement amélioré notre productivité.',
      savings: '25% de gain de productivité'
    }
  ];

  const safetyMeasures = [
    'Équipement de protection individuelle obligatoire',
    'Respect des procédures de sécurité électrique',
    'Outils et instruments de mesure calibrés',
    'Intervention selon normes NF C 15-100',
    'Tests d\'isolement et de continuité',
    'Vérification par bureau de contrôle'
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
                  <Badge variant="secondary">Service Certifié</Badge>
                  <Badge variant="outline" className="border-primary-foreground text-primary-foreground">
                    <Award className="w-3 h-3 mr-1" />
                    Garantie 2-3 ans
                  </Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Installation Électrique Professionnelle
                </h1>
                <p className="text-xl text-primary-foreground/80 mb-8">
                  Installation complète de vos équipements électriques par nos techniciens 
                  certifiés, avec garantie et mise en conformité aux normes camerounaises.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="secondary" size="lg">
                    <FileText className="w-5 h-5 mr-2" />
                    Demander un devis
                  </Button>
                  <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    <Phone className="w-5 h-5 mr-2" />
                    Consultation gratuite
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="bg-primary-foreground/10 rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-primary-foreground/20 rounded-lg p-4">
                      <Users className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">50+</div>
                      <div className="text-sm text-primary-foreground/80">Techniciens</div>
                    </div>
                    <div className="bg-primary-foreground/20 rounded-lg p-4">
                      <Shield className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">3 ans</div>
                      <div className="text-sm text-primary-foreground/80">Garantie max</div>
                    </div>
                    <div className="bg-primary-foreground/20 rounded-lg p-4">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">1000+</div>
                      <div className="text-sm text-primary-foreground/80">Projets réalisés</div>
                    </div>
                    <div className="bg-primary-foreground/20 rounded-lg p-4">
                      <Star className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">4.9/5</div>
                      <div className="text-sm text-primary-foreground/80">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Types d'installation */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Nos Types d'Installation</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Des solutions adaptées à chaque type de projet, du résidentiel à l'industriel
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {installationTypes.map((type, index) => {
                const Icon = type.icon;
                return (
                  <Card key={index} className={`relative hover:shadow-xl transition-all duration-300 ${type.popular ? 'ring-2 ring-primary' : ''}`}>
                    {type.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge variant="default" className="bg-primary">
                          <Star className="w-3 h-3 mr-1" />
                          Plus demandé
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8" />
                      </div>
                      <CardTitle>{type.name}</CardTitle>
                      <CardDescription>{type.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-3">Inclus dans le service</h4>
                        <ul className="space-y-2">
                          {type.features.map((feature, i) => (
                            <li key={i} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-2 gap-4 text-center text-sm">
                        <div>
                          <div className="font-semibold text-primary">{type.duration}</div>
                          <div className="text-muted-foreground">Durée</div>
                        </div>
                        <div>
                          <div className="font-semibold text-primary">{type.warranty}</div>
                          <div className="text-muted-foreground">Garantie</div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xl font-bold text-primary mb-2">{type.price}</div>
                        <Button className="w-full" variant={type.popular ? "default" : "outline"}>
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

        {/* Processus d'installation */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Notre Processus d'Installation</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Une méthodologie éprouvée pour garantir la qualité et la sécurité de nos installations
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={index} className="relative overflow-hidden">
                    <div className="absolute top-4 right-4 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Durée: {step.duration}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Nos Certifications et Garanties</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Des installations conformes aux normes avec des techniciens qualifiés
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map((cert, index) => {
                const Icon = cert.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-lg">{cert.name}</CardTitle>
                      <CardDescription>{cert.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Mesures de sécurité */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-secondary mr-3" />
                  Sécurité et Conformité
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  La sécurité est notre priorité absolue lors de toutes nos interventions
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Mesures de Sécurité Appliquées</CardTitle>
                  <CardDescription>
                    Nous respectons rigoureusement toutes les normes de sécurité en vigueur
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {safetyMeasures.map((measure, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                        <span className="text-sm">{measure}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Témoignages clients */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Projets Réalisés</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez quelques-unes de nos réalisations et les retours de nos clients
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-1 mb-2">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription>{testimonial.project}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          Résultat: {testimonial.savings}
                        </span>
                      </div>
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
                <h2 className="text-3xl font-bold mb-4">Votre Projet d'Installation ?</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
                  Confiez-nous votre projet d'installation électrique. Nos experts vous accompagnent 
                  de la conception à la mise en service, avec garantie et service après-vente.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="secondary" size="lg">
                    <FileText className="w-5 h-5 mr-2" />
                    Demander un devis gratuit
                  </Button>
                  <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                    <Link href="/contact">
                      <Phone className="w-5 h-5 mr-2" />
                      Conseil personnalisé
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
