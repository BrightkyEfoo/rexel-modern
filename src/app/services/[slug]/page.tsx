'use client';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { Textarea } from '@/components/ui/textarea';
import { Service } from '@/types/services';
import {
  Award,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Mail,
  MapPin,
  Phone,
  PlayCircle,
  Send,
  Star,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Service temporaire pour démonstration (en production, viendrait de l'API)
const mockService: Service = {
  id: 'maintenance-preventive',
  slug: 'maintenance-preventive',
  name: 'Maintenance Préventive',
  shortDescription: 'Contrats de maintenance pour vos installations électriques',
  fullDescription: 'Notre service de maintenance préventive vous garantit le bon fonctionnement et la longévité de vos installations électriques. Grâce à des interventions programmées et un suivi personnalisé, prévenez les pannes et optimisez les performances de vos équipements.',
  category: 'premium',
  status: 'active',
  
  heroImage: '/images/services/maintenance-hero.jpg',
  heroVideo: '/videos/services/maintenance-intro.mp4',
  
  features: [
    {
      id: '1',
      title: 'Inspections régulières',
      description: 'Contrôles techniques programmés selon vos besoins',
      icon: 'CheckCircle',
      included: true
    },
    {
      id: '2', 
      title: 'Rapport détaillé',
      description: 'Documentation complète après chaque intervention',
      icon: 'FileText',
      included: true
    },
    {
      id: '3',
      title: 'Intervention d\'urgence',
      description: 'Service 24/7 pour les situations critiques',
      icon: 'Phone',
      included: true
    },
    {
      id: '4',
      title: 'Pièces de rechange',
      description: 'Stock de pièces détachées garanties',
      icon: 'Award',
      included: false
    }
  ],
  
  benefits: [
    'Réduction des coûts de réparation',
    'Prolongation de la durée de vie des équipements',
    'Conformité aux normes de sécurité',
    'Disponibilité optimale des installations',
    'Planification budgétaire prévisible'
  ],
  
  pricing: [
    {
      id: 'basic',
      name: 'Contrat Basique',
      price: 150000,
      unit: 'FCFA/an',
      description: 'Maintenance préventive standard',
      features: ['2 visites/an', 'Rapport technique', 'Support téléphonique'],
      isPopular: false
    },
    {
      id: 'premium',
      name: 'Contrat Premium',
      price: 300000,
      unit: 'FCFA/an', 
      description: 'Maintenance complète avec urgences',
      features: ['4 visites/an', 'Intervention 24/7', 'Pièces incluses', 'Formation équipe'],
      isPopular: true
    },
    {
      id: 'enterprise',
      name: 'Contrat Entreprise',
      price: 0,
      unit: 'Sur devis',
      description: 'Solution sur mesure pour grandes installations',
      features: ['Visites illimitées', 'Technicien dédié', 'SLA garanti', 'Reporting avancé'],
      isPopular: false
    }
  ],
  
  gallery: [
    {
      id: '1',
      type: 'image',
      url: '/images/services/maintenance-1.jpg',
      title: 'Inspection tableau électrique',
      description: 'Contrôle des connexions et sécurités'
    },
    {
      id: '2',
      type: 'video',
      url: '/videos/services/maintenance-process.mp4',
      thumbnail: '/images/services/maintenance-video-thumb.jpg',
      title: 'Processus de maintenance',
      description: 'Découvrez notre méthodologie d\'intervention'
    }
  ],
  
  testimonials: [
    {
      id: '1',
      customerName: 'Société BATIMEX',
      customerTitle: 'Directeur Technique',
      customerCompany: 'BATIMEX SARL',
      rating: 5,
      comment: 'Excellent service de maintenance. Depuis la signature du contrat, nous n\'avons eu aucune panne majeure. L\'équipe est très professionnelle.',
      date: '2024-01-15',
      avatar: '/images/avatars/customer-1.jpg'
    },
    {
      id: '2',
      customerName: 'Hôtel Akwa Palace',
      customerTitle: 'Responsable Maintenance',
      rating: 5,
      comment: 'Service impeccable ! Les interventions sont toujours planifiées et l\'équipe respecte nos contraintes d\'exploitation.',
      date: '2024-01-10'
    }
  ],
  
  faqs: [
    {
      id: '1',
      question: 'Quelle est la fréquence des interventions ?',
      answer: 'La fréquence dépend du contrat choisi : 2 fois par an pour le contrat basique, 4 fois par an pour le premium, et selon vos besoins pour l\'entreprise.',
      category: 'contrat'
    },
    {
      id: '2',
      question: 'Que comprend une visite de maintenance ?',
      answer: 'Chaque visite inclut : inspection visuelle, tests électriques, vérification des protections, nettoyage des équipements, et rapport détaillé.',
      category: 'technique'
    },
    {
      id: '3',
      question: 'Comment sont gérées les urgences ?',
      answer: 'Pour les contrats Premium et Entreprise, nous intervenons 24/7. Un numéro d\'urgence est mis à votre disposition.',
      category: 'urgence'
    }
  ],
  
  contacts: [
    {
      name: 'Jean MBARGA',
      title: 'Responsable Maintenance',
      phone: '+237 6 12 34 56 78',
      email: 'j.mbarga@kesimarket.cm',
      avatar: '/images/team/jean-mbarga.jpg',
      specialties: ['Maintenance industrielle', 'Automatismes', 'Haute tension']
    }
  ],
  
  coverageAreas: ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua'],
  
  availability: {
    workingDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
    workingHours: '8h - 17h',
    emergencyAvailable: true,
    bookingRequired: true,
    leadTime: '48h pour planification'
  },
  
  certifications: ['ISO 9001', 'Qualification électricité', 'Assurance RC'],
  warranties: ['Garantie intervention 30 jours', 'Assurance décennale'],
  
  seoTitle: 'Maintenance Préventive - KesiMarket Cameroun',
  seoDescription: 'Service de maintenance préventive pour installations électriques au Cameroun',
  seoKeywords: ['maintenance', 'électrique', 'préventive', 'cameroun'],
  
  createdAt: '2024-01-01',
  updatedAt: '2024-01-15',
  createdBy: 'admin',
  isPromoted: true,
  sortOrder: 1,
  
  relatedServices: ['installation', 'formation'],
  requiredEquipment: ['Multimètre', 'Oscilloscope', 'Caméra thermique'],
  
  ctaText: 'Demander un contrat de maintenance',
  ctaLink: '/contact',
  showBookingForm: true,
  showQuoteForm: true
};

export default function DynamicServicePage() {
  const params = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    // En production, ceci ferait un appel API pour récupérer le service
    // GET /api/services/[slug]
    const fetchService = async () => {
      setLoading(true);
      
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Pour la démo, on utilise le service mock
      if (params.slug === 'maintenance-preventive') {
        setService(mockService);
      } else {
        setService(null);
      }
      
      setLoading(false);
    };

    fetchService();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chargement du service...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Service non trouvé</h1>
            <p className="text-muted-foreground mb-8">Le service demandé n'existe pas ou n'est plus disponible.</p>
            <Button asChild>
              <Link href="/services">Retour aux services</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

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
                  <Badge variant="secondary" className="capitalize">{service.category}</Badge>
                  {service.isPromoted && (
                    <Badge variant="outline" className="border-primary-foreground text-primary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Recommandé
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {service.name}
                </h1>
                <p className="text-xl text-primary-foreground/80 mb-8">
                  {service.fullDescription}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {service.showQuoteForm && (
                    <Button variant="secondary" size="lg">
                      <FileText className="w-5 h-5 mr-2" />
                      {service.ctaText || 'Demander un devis'}
                    </Button>
                  )}
                  {service.showBookingForm && (
                    <Button variant="outline" size="lg" className="border-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary">
                      <Calendar className="w-5 h-5 mr-2" />
                      Prendre RDV
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Statistiques du service */}
              <div className="relative">
                <div className="bg-primary-foreground/10 rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-primary-foreground/20 rounded-lg p-4">
                      <Users className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{service.testimonials.length}+</div>
                      <div className="text-sm text-primary-foreground/80">Clients satisfaits</div>
                    </div>
                    <div className="bg-primary-foreground/20 rounded-lg p-4">
                      <MapPin className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{service.coverageAreas.length}</div>
                      <div className="text-sm text-primary-foreground/80">Villes couvertes</div>
                    </div>
                    <div className="bg-primary-foreground/20 rounded-lg p-4">
                      <Award className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{service.certifications.length}</div>
                      <div className="text-sm text-primary-foreground/80">Certifications</div>
                    </div>
                    <div className="bg-primary-foreground/20 rounded-lg p-4">
                      <Clock className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{service.availability.emergencyAvailable ? '24/7' : '8-17h'}</div>
                      <div className="text-sm text-primary-foreground/80">Disponibilité</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation tabs */}
        <section className="bg-white border-b sticky top-16 z-40">
          <div className="container mx-auto px-4">
            <div className="flex space-x-8 overflow-x-auto">
              {[
                { id: 'overview', label: 'Aperçu' },
                { id: 'pricing', label: 'Tarifs' },
                { id: 'gallery', label: 'Galerie' },
                { id: 'testimonials', label: 'Témoignages' },
                { id: 'faq', label: 'FAQ' },
                { id: 'contact', label: 'Contact' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Onglet Aperçu */}
            {activeTab === 'overview' && (
              <div className="space-y-12">
                {/* Caractéristiques */}
                <div>
                  <h2 className="text-3xl font-bold mb-8">Caractéristiques du Service</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {service.features.map((feature) => (
                      <Card key={feature.id} className={`${!feature.included ? 'opacity-60' : ''}`}>
                        <CardContent className="p-6 text-center">
                          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-6 h-6" />
                          </div>
                          <h3 className="font-semibold mb-2">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                          {!feature.included && (
                            <Badge variant="outline" className="mt-2">Option</Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Avantages */}
                <div>
                  <h2 className="text-3xl font-bold mb-8">Avantages</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {service.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Zones de couverture */}
                <div>
                  <h2 className="text-3xl font-bold mb-8">Zones d'Intervention</h2>
                  <div className="grid md:grid-cols-4 gap-4">
                    {service.coverageAreas.map((area, index) => (
                      <Card key={index}>
                        <CardContent className="p-4 text-center">
                          <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
                          <div className="font-medium">{area}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Tarifs */}
            {activeTab === 'pricing' && (
              <div>
                <h2 className="text-3xl font-bold mb-8 text-center">Nos Tarifs</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {service.pricing.map((plan) => (
                    <Card key={plan.id} className={`relative ${plan.isPopular ? 'ring-2 ring-primary' : ''}`}>
                      {plan.isPopular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge variant="default" className="bg-primary">
                            <Star className="w-3 h-3 mr-1" />
                            Populaire
                          </Badge>
                        </div>
                      )}
                      <CardHeader className="text-center">
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="text-3xl font-bold text-primary">
                          {plan.price > 0 ? `${plan.price.toLocaleString()} ${plan.unit}` : plan.unit}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button className="w-full" variant={plan.isPopular ? "default" : "outline"}>
                          Choisir ce plan
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet Galerie */}
            {activeTab === 'gallery' && (
              <div>
                <h2 className="text-3xl font-bold mb-8 text-center">Galerie</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {service.gallery.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="aspect-video bg-muted relative">
                        {item.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <PlayCircle className="w-12 h-12 text-primary" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
                          <h3 className="font-semibold">{item.title}</h3>
                          {item.description && (
                            <p className="text-sm text-white/80">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet Témoignages */}
            {activeTab === 'testimonials' && (
              <div>
                <h2 className="text-3xl font-bold mb-8 text-center">Témoignages Clients</h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {service.testimonials.map((testimonial) => (
                    <Card key={testimonial.id}>
                      <CardHeader>
                        <div className="flex items-center space-x-1 mb-2">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <CardTitle className="text-lg">{testimonial.customerName}</CardTitle>
                        <CardDescription>
                          {testimonial.customerTitle}
                          {testimonial.customerCompany && ` - ${testimonial.customerCompany}`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
                        <div className="text-sm text-muted-foreground mt-3">
                          {new Date(testimonial.date).toLocaleDateString('fr-FR')}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet FAQ */}
            {activeTab === 'faq' && (
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">Questions Fréquentes</h2>
                <div className="space-y-4">
                  {service.faqs.map((faq) => (
                    <Card key={faq.id}>
                      <CardHeader
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => toggleFAQ(faq.id)}
                      >
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{faq.question}</CardTitle>
                          {openFAQ === faq.id ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </CardHeader>
                      {openFAQ === faq.id && (
                        <CardContent className="pt-0">
                          <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet Contact */}
            {activeTab === 'contact' && (
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">Nous Contacter</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Experts dédiés */}
                  <div>
                    <h3 className="text-xl font-bold mb-6">Experts Dédiés</h3>
                    <div className="space-y-4">
                      {service.contacts.map((contact, index) => (
                        <Card key={index}>
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <Users className="w-6 h-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold">{contact.name}</h4>
                                <p className="text-sm text-muted-foreground mb-2">{contact.title}</p>
                                <div className="space-y-1 text-sm">
                                  <div className="flex items-center space-x-2">
                                    <Phone className="w-3 h-3" />
                                    <span>{contact.phone}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Mail className="w-3 h-3" />
                                    <span>{contact.email}</span>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {contact.specialties.map((specialty, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {specialty}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Formulaire de contact */}
                  <div>
                    <h3 className="text-xl font-bold mb-6">Demande d'Information</h3>
                    <Card>
                      <CardContent className="p-6">
                        <form className="space-y-4">
                          <div>
                            <Label htmlFor="name">Nom complet *</Label>
                            <Input
                              id="name"
                              value={bookingForm.name}
                              onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                              placeholder="Votre nom complet"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={bookingForm.email}
                              onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                              placeholder="votre@email.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Téléphone</Label>
                            <Input
                              id="phone"
                              value={bookingForm.phone}
                              onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                              placeholder="+237 6 12 34 56 78"
                            />
                          </div>
                          <div>
                            <Label htmlFor="message">Message *</Label>
                            <Textarea
                              id="message"
                              rows={4}
                              value={bookingForm.message}
                              onChange={(e) => setBookingForm({...bookingForm, message: e.target.value})}
                              placeholder="Décrivez votre besoin..."
                            />
                          </div>
                          <Button className="w-full">
                            <Send className="w-4 h-4 mr-2" />
                            Envoyer la demande
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Intéressé par ce Service ?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Contactez-nous dès maintenant pour discuter de vos besoins et obtenir un devis personnalisé
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                <FileText className="w-5 h-5 mr-2" />
                Demander un devis
              </Button>
              <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Phone className="w-5 h-5 mr-2" />
                Nous appeler
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
