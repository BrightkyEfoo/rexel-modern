'use client';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useServiceBySlug } from '@/lib/query/hooks';
import { SERVICE_GROUPS, type ServiceCategory } from '@/types/services';
import {
  ArrowLeft,
  ArrowRight,
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
  Send,
  Star,
  Users,
  Package,
  Wrench,
  Ruler,
  GraduationCap,
  Calculator,
  FileSearch,
  Video,
  Sun,
  Settings,
  Handshake,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

// Mapping des icônes par slug de service
const serviceIconMap: Record<string, LucideIcon> = {
  "equip-pret": Package,
  "planex": FileText,
  "fix-and-go": Wrench,
  "equiloc": Ruler,
  "protechrh": Users,
  "talent-form": GraduationCap,
  "perfeco": Calculator,
  "contractis": FileSearch,
  "surveytech": Video,
  "solartech": Sun,
};

// Mapping des icônes par catégorie
const categoryIconMap: Record<ServiceCategory, LucideIcon> = {
  "solutions-techniques": Settings,
  "rh-formation": Users,
  "accompagnement-conseil": Handshake,
  "energie-renouvelable": Sun,
};

// Types pour les données de service
interface PricingPlan {
  id?: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

interface Testimonial {
  id?: string;
  customerName: string;
  customerTitle?: string;
  customerCompany?: string;
  rating: number;
  comment: string;
  date?: string;
}

interface FAQ {
  id?: string;
  question: string;
  answer: string;
}

interface Contact {
  name: string;
  title: string;
  phone: string;
  email: string;
  specialties?: string[];
}

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: serviceData, isLoading, error } = useServiceBySlug(slug);
  const [activeTab, setActiveTab] = useState('overview');
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const service = serviceData?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <section className="bg-primary text-primary-foreground py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="h-8 bg-primary-foreground/20 rounded w-32 mb-4 animate-pulse" />
                <div className="h-12 bg-primary-foreground/20 rounded w-2/3 mb-6 animate-pulse" />
                <div className="h-6 bg-primary-foreground/20 rounded w-full mb-4 animate-pulse" />
                <div className="h-6 bg-primary-foreground/20 rounded w-3/4 animate-pulse" />
              </div>
            </div>
          </section>
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="bg-muted/20 rounded-xl p-6 animate-pulse">
                    <div className="h-12 bg-muted rounded mb-4" />
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Service non trouvé</h1>
              <p className="text-muted-foreground mb-8">
                Le service demandé n'existe pas ou n'est plus disponible.
              </p>
              <Button asChild>
                <Link href="/services">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux services
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const category = service.category as ServiceCategory;
  const group = SERVICE_GROUPS[category];
  const ServiceIcon = serviceIconMap[service.slug] || Settings;
  const CategoryIcon = categoryIconMap[category] || Settings;

  const features = Array.isArray(service.features) ? service.features : [];
  const faqs = Array.isArray(service.faqs) ? service.faqs : [];
  const testimonials = Array.isArray(service.testimonials) ? service.testimonials : [];
  const pricingPlans = Array.isArray(service.pricingPlans) ? service.pricingPlans : [];
  const contacts = Array.isArray(service.contacts) ? service.contacts : [];
  const coverageAreas = Array.isArray(service.coverageAreas) ? service.coverageAreas : [];
  const certifications = Array.isArray(service.certifications) ? service.certifications : [];
  const warranties = Array.isArray(service.warranties) ? service.warranties : [];
  const gallery = Array.isArray(service.gallery) ? service.gallery : [];

  // Déterminer quels onglets afficher selon les données disponibles
  const tabs = [
    { id: 'overview', label: 'Aperçu', show: true },
    { id: 'pricing', label: 'Tarifs', show: pricingPlans.length > 0 || service.pricing },
    { id: 'testimonials', label: 'Témoignages', show: testimonials.length > 0 },
    { id: 'faq', label: 'FAQ', show: faqs.length > 0 },
    { id: 'contact', label: 'Contact', show: true }
  ].filter(tab => tab.show);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section
          className="py-20 text-white"
          style={{ background: `linear-gradient(135deg, ${group.color} 0%, ${group.color}dd 100%)` }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Breadcrumb */}
              <div className="flex items-center space-x-2 mb-6 text-white/80">
                <Link href="/services" className="hover:text-white transition-colors">
                  Services
                </Link>
                <span>/</span>
                <Link href={`/services#${category}`} className="hover:text-white transition-colors">
                  {group.name}
                </Link>
                <span>/</span>
                <span className="text-white">{service.name}</span>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <Badge
                      variant="secondary"
                      className="text-sm"
                      style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    >
                      <CategoryIcon className="w-4 h-4 mr-2" />
                      {group.name}
                    </Badge>
                    {service.popular && (
                      <Badge
                        variant="outline"
                        className="border-white/50 text-white"
                      >
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        Populaire
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 mb-6">
                    <div
                      className="p-4 rounded-xl"
                      style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    >
                      <ServiceIcon className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold">
                      {service.name}
                    </h1>
                  </div>

                  <p className="text-xl text-white/90 mb-6">
                    {service.shortDescription}
                  </p>

                  <p className="text-white/80 mb-8 leading-relaxed">
                    {service.fullDescription}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => setActiveTab('contact')}
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      Demander un devis
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-white hover:text-gray-900"
                      asChild
                    >
                      <Link href="/contact">
                        <Phone className="w-5 h-5 mr-2" />
                        Nous contacter
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-4">
                    {coverageAreas.length > 0 && (
                      <div className="bg-white/20 rounded-xl p-4 text-center">
                        <MapPin className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-2xl font-bold">{coverageAreas.length}</div>
                        <div className="text-sm text-white/80">Zones couvertes</div>
                      </div>
                    )}
                    {certifications.length > 0 && (
                      <div className="bg-white/20 rounded-xl p-4 text-center">
                        <Award className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-2xl font-bold">{certifications.length}</div>
                        <div className="text-sm text-white/80">Certifications</div>
                      </div>
                    )}
                    {service.availability && (
                      <div className="bg-white/20 rounded-xl p-4 text-center">
                        <Clock className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-2xl font-bold">
                          {service.availability.emergencyAvailable ? '24/7' : service.availability.workingHours}
                        </div>
                        <div className="text-sm text-white/80">Disponibilité</div>
                      </div>
                    )}
                    {testimonials.length > 0 && (
                      <div className="bg-white/20 rounded-xl p-4 text-center">
                        <Users className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-2xl font-bold">{testimonials.length}+</div>
                        <div className="text-sm text-white/80">Clients satisfaits</div>
                      </div>
                    )}
                  </div>

                  {/* Certifications */}
                  {certifications.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-white/20">
                      <div className="text-sm text-white/80 mb-3">Certifications & garanties</div>
                      <div className="flex flex-wrap gap-2">
                        {certifications.map((cert: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-white/50 text-white text-xs"
                          >
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation tabs */}
        <section className="bg-white border-b sticky top-16 z-40">
          <div className="container mx-auto px-4">
            <div className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-gray-900'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                  style={{
                    borderBottomColor: activeTab === tab.id ? group.color : 'transparent',
                    color: activeTab === tab.id ? group.color : undefined
                  }}
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
              <div className="space-y-16">
                {/* Caractéristiques */}
                {features.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold mb-8">Ce que comprend ce service</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {features.map((feature: string | { title: string; description?: string; included?: boolean }, index: number) => {
                        const featureData = typeof feature === 'string'
                          ? { title: feature, description: '', included: true }
                          : feature;
                        return (
                          <Card
                            key={index}
                            className="border-t-4"
                            style={{ borderTopColor: group.color }}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start space-x-4">
                                <div
                                  className="p-2 rounded-lg flex-shrink-0"
                                  style={{ backgroundColor: `${group.color}20` }}
                                >
                                  <CheckCircle
                                    className="w-6 h-6"
                                    style={{ color: group.color }}
                                  />
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-1">{featureData.title}</h3>
                                  {featureData.description && (
                                    <p className="text-sm text-muted-foreground">
                                      {featureData.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Comment ça marche */}
                <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
                  <h2 className="text-3xl font-bold mb-8 text-center">Comment ça marche ?</h2>
                  <div className="grid md:grid-cols-4 gap-8">
                    {[
                      { step: "01", title: "Contact", description: "Décrivez votre besoin via notre formulaire ou par téléphone" },
                      { step: "02", title: "Étude", description: "Nos experts analysent votre demande et préparent une proposition" },
                      { step: "03", title: "Réalisation", description: "Mise en œuvre du service par notre équipe qualifiée" },
                      { step: "04", title: "Suivi", description: "Accompagnement continu et support après service" }
                    ].map((item, index) => (
                      <div key={index} className="text-center relative">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold"
                          style={{ backgroundColor: group.color }}
                        >
                          {item.step}
                        </div>
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Zones de couverture */}
                {coverageAreas.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold mb-8">Zones d'intervention</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {coverageAreas.map((area: string, index: number) => (
                        <Card key={index} className="text-center hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <MapPin
                              className="w-6 h-6 mx-auto mb-2"
                              style={{ color: group.color }}
                            />
                            <div className="font-medium text-sm">{area}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Garanties */}
                {warranties.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold mb-8">Nos garanties</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {warranties.map((warranty: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg"
                        >
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                          <span className="font-medium">{warranty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Onglet Tarifs */}
            {activeTab === 'pricing' && (
              <div>
                <h2 className="text-3xl font-bold mb-8 text-center">Nos Tarifs</h2>

                {pricingPlans.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {pricingPlans.map((plan: PricingPlan, index: number) => (
                      <Card
                        key={index}
                        className={`relative ${plan.isPopular ? 'ring-2' : ''}`}
                        style={{
                          borderTopColor: group.color,
                          borderTopWidth: '4px',
                          ...(plan.isPopular && { '--tw-ring-color': group.color } as React.CSSProperties)
                        }}
                      >
                        {plan.isPopular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge
                              className="text-white"
                              style={{ backgroundColor: group.color }}
                            >
                              <Star className="w-3 h-3 mr-1" />
                              Recommandé
                            </Badge>
                          </div>
                        )}
                        <CardHeader className="text-center pt-8">
                          <CardTitle>{plan.name}</CardTitle>
                          <CardDescription>{plan.description}</CardDescription>
                          <div
                            className="text-3xl font-bold mt-4"
                            style={{ color: group.color }}
                          >
                            {plan.price > 0
                              ? `${plan.price.toLocaleString('fr-FR')} ${plan.unit}`
                              : plan.unit
                            }
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <ul className="space-y-3">
                            {plan.features.map((feature: string, i: number) => (
                              <li key={i} className="flex items-start space-x-2">
                                <CheckCircle
                                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                                  style={{ color: group.color }}
                                />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <Button
                            className="w-full text-white"
                            style={{ backgroundColor: group.color }}
                            onClick={() => setActiveTab('contact')}
                          >
                            Choisir ce plan
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : service.pricing ? (
                  <div className="max-w-md mx-auto text-center">
                    <Card className="border-t-4" style={{ borderTopColor: group.color }}>
                      <CardContent className="p-8">
                        <div
                          className="text-3xl font-bold mb-4"
                          style={{ color: group.color }}
                        >
                          {service.pricing}
                        </div>
                        <p className="text-muted-foreground mb-6">
                          Contactez-nous pour obtenir un devis personnalisé adapté à vos besoins.
                        </p>
                        <Button
                          className="text-white"
                          style={{ backgroundColor: group.color }}
                          onClick={() => setActiveTab('contact')}
                        >
                          Demander un devis
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ) : null}
              </div>
            )}

            {/* Onglet Témoignages */}
            {activeTab === 'testimonials' && testimonials.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold mb-8 text-center">Ce que disent nos clients</h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {testimonials.map((testimonial: Testimonial, index: number) => (
                    <Card key={index} className="border-t-4" style={{ borderTopColor: group.color }}>
                      <CardHeader>
                        <div className="flex items-center space-x-1 mb-3">
                          {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <CardTitle className="text-lg">{testimonial.customerName}</CardTitle>
                        <CardDescription>
                          {testimonial.customerTitle}
                          {testimonial.customerCompany && ` - ${testimonial.customerCompany}`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground italic leading-relaxed">
                          "{testimonial.comment}"
                        </p>
                        {testimonial.date && (
                          <div className="text-sm text-muted-foreground mt-4">
                            {new Date(testimonial.date).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long'
                            })}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet FAQ */}
            {activeTab === 'faq' && faqs.length > 0 && (
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">Questions fréquentes</h2>
                <div className="space-y-4">
                  {faqs.map((faq: FAQ, index: number) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => toggleFAQ(faq.id || String(index))}
                      >
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg pr-4">{faq.question}</CardTitle>
                          {openFAQ === (faq.id || String(index)) ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                      </CardHeader>
                      {openFAQ === (faq.id || String(index)) && (
                        <CardContent className="pt-0 pb-6">
                          <Separator className="mb-4" />
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
                <h2 className="text-3xl font-bold mb-8 text-center">Contactez-nous</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Informations de contact */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Informations</h3>

                    {contacts.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-muted-foreground">Experts dédiés</h4>
                        {contacts.map((contact: Contact, index: number) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-4">
                                <div
                                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: `${group.color}20` }}
                                >
                                  <Users className="w-6 h-6" style={{ color: group.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold">{contact.name}</h4>
                                  <p className="text-sm text-muted-foreground mb-2">{contact.title}</p>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex items-center space-x-2">
                                      <Phone className="w-4 h-4 text-muted-foreground" />
                                      <span>{contact.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Mail className="w-4 h-4 text-muted-foreground" />
                                      <span className="truncate">{contact.email}</span>
                                    </div>
                                  </div>
                                  {contact.specialties && contact.specialties.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-3">
                                      {contact.specialties.map((specialty: string, i: number) => (
                                        <Badge key={i} variant="outline" className="text-xs">
                                          {specialty}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Disponibilité */}
                    {service.availability && (
                      <div>
                        <h4 className="font-semibold text-muted-foreground mb-3">Disponibilité</h4>
                        <Card>
                          <CardContent className="p-4 space-y-2">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">
                                {service.availability.workingDays?.join(', ')}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{service.availability.workingHours}</span>
                            </div>
                            {service.availability.emergencyAvailable && (
                              <Badge
                                className="text-white"
                                style={{ backgroundColor: group.color }}
                              >
                                Urgences 24/7 disponibles
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>

                  {/* Formulaire de contact */}
                  <div>
                    <h3 className="text-xl font-bold mb-6">Demande d'information</h3>
                    <Card className="border-t-4" style={{ borderTopColor: group.color }}>
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
                              placeholder={`Je souhaite en savoir plus sur ${service.name}...`}
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full text-white"
                            style={{ backgroundColor: group.color }}
                          >
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
        <section
          className="py-16 text-white"
          style={{ backgroundColor: group.color }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à démarrer avec {service.name} ?
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Contactez-nous dès maintenant pour discuter de vos besoins et obtenir un devis personnalisé.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setActiveTab('contact')}
              >
                <FileText className="w-5 h-5 mr-2" />
                Demander un devis
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-gray-900"
                asChild
              >
                <Link href="/services">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Voir tous les services
                </Link>
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
