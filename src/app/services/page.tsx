"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Star,
  Shield,
  Zap,
  Package,
  FileText,
  Wrench,
  Ruler,
  Users,
  GraduationCap,
  Calculator,
  FileSearch,
  Video,
  Sun,
  Settings,
  Handshake,
  Award,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useServices } from "@/lib/query/hooks";
import { SERVICE_GROUPS, SERVICE_CATEGORIES_ORDER, type ServiceCategory } from "@/types/services";

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

// Type pour un service de l'API
interface ServiceData {
  id: string | number;
  slug: string;
  name: string;
  shortDescription: string;
  category: string;
  features: string[] | { title: string; description?: string }[];
  pricing?: string;
  popular?: boolean;
}

export default function ServicesPage() {
  const { data: servicesData, isLoading, error } = useServices();

  const stats = [
    { number: "10", label: "Services disponibles", icon: CheckCircle },
    { number: "98%", label: "Satisfaction client", icon: Star },
    { number: "24h", label: "Réponse garantie", icon: Clock },
    { number: "Cameroun", label: "Couverture nationale", icon: MapPin },
  ];

  // Grouper les services par catégorie
  const groupedServices = servicesData?.data?.reduce((acc: Record<ServiceCategory, ServiceData[]>, service: ServiceData) => {
    const category = service.category as ServiceCategory;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<ServiceCategory, ServiceData[]>);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <section className="bg-primary text-primary-foreground py-20">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-4xl mx-auto">
                <div className="h-16 w-16 bg-primary-foreground/20 rounded-full mx-auto mb-6 animate-pulse" />
                <div className="h-12 bg-primary-foreground/20 rounded w-2/3 mx-auto mb-6 animate-pulse" />
                <div className="h-6 bg-primary-foreground/20 rounded w-1/2 mx-auto animate-pulse" />
              </div>
            </div>
          </section>
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-muted/20 rounded-2xl p-6 animate-pulse">
                    <div className="h-12 bg-muted rounded mb-4" />
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded mb-4" />
                    <div className="h-10 bg-muted rounded" />
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

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="text-red-600 mb-4">
              Erreur lors du chargement des services
            </div>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <Zap className="w-10 h-10" />
                </div>
              </div>
              <Badge variant="secondary" className="mb-4">
                KesiMarket Services
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Nos Services Professionnels
              </h1>
              <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                10 solutions complètes pour accompagner vos projets électriques,
                de la conception à la réalisation
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {SERVICE_CATEGORIES_ORDER.map((category) => {
                  const group = SERVICE_GROUPS[category];
                  const Icon = categoryIconMap[category];
                  return (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="text-sm px-4 py-2"
                      style={{ backgroundColor: `${group.color}20`, color: group.color }}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {group.name}
                    </Badge>
                  );
                })}
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
                    <div className="text-3xl font-bold text-primary mb-2">
                      {stat.number}
                    </div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Services groupés par catégorie */}
        {SERVICE_CATEGORIES_ORDER.map((category, categoryIndex) => {
          const group = SERVICE_GROUPS[category];
          const services = groupedServices?.[category] || [];
          const CategoryIcon = categoryIconMap[category];
          const isEven = categoryIndex % 2 === 0;

          if (services.length === 0) return null;

          return (
            <section
              key={category}
              className={`py-16 ${isEven ? 'bg-background' : 'bg-muted/20'}`}
              id={category}
            >
              <div className="container mx-auto px-4">
                {/* En-tête du groupe */}
                <div className="text-center mb-12">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${group.color}20` }}
                  >
                    <CategoryIcon
                      className="w-8 h-8"
                      style={{ color: group.color }}
                    />
                  </div>
                  <h2 className="text-3xl font-bold mb-4" style={{ color: group.color }}>
                    {group.name}
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {group.description}
                  </p>
                </div>

                {/* Grille des services */}
                <div className={`grid gap-8 ${
                  services.length === 1
                    ? 'md:grid-cols-1 max-w-2xl mx-auto'
                    : services.length === 2
                    ? 'md:grid-cols-2'
                    : services.length === 3
                    ? 'md:grid-cols-3'
                    : 'md:grid-cols-2 lg:grid-cols-4'
                }`}>
                  {services.map((service: ServiceData) => {
                    const ServiceIcon = serviceIconMap[service.slug] || Settings;
                    const features = Array.isArray(service.features)
                      ? service.features.slice(0, 4)
                      : [];

                    return (
                      <Link
                        key={service.id}
                        href={`/services/${service.slug}`}
                        className="block"
                      >
                        <Card
                          className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group border-t-4 h-full cursor-pointer"
                          style={{ borderTopColor: group.color }}
                        >
                        {service.popular && (
                          <div className="absolute top-4 right-4 z-10">
                            <Badge
                              className="text-white"
                              style={{ backgroundColor: group.color }}
                            >
                              <Star className="w-3 h-3 mr-1" />
                              Populaire
                            </Badge>
                          </div>
                        )}

                        <CardHeader>
                          <div className="flex items-start space-x-4">
                            <div
                              className="p-3 rounded-lg group-hover:scale-110 transition-transform"
                              style={{ backgroundColor: `${group.color}20` }}
                            >
                              <ServiceIcon
                                className="w-8 h-8"
                                style={{ color: group.color }}
                              />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                                {service.name}
                              </CardTitle>
                              <CardDescription className="text-sm line-clamp-2">
                                {service.shortDescription}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {features.length > 0 && (
                            <div className="space-y-2">
                              {features.map((feature, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2"
                                >
                                  <CheckCircle
                                    className="w-4 h-4 flex-shrink-0"
                                    style={{ color: group.color }}
                                  />
                                  <span className="text-sm text-muted-foreground line-clamp-1">
                                    {typeof feature === 'string' ? feature : feature.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          <Separator />

                          <div className="flex items-center justify-between">
                            {service.pricing && (
                              <div>
                                <p className="text-xs text-muted-foreground">Tarif</p>
                                <p className="font-semibold text-sm" style={{ color: group.color }}>
                                  {service.pricing}
                                </p>
                              </div>
                            )}
                            <div
                              className="ml-auto flex items-center text-sm font-medium group-hover:translate-x-1 transition-transform"
                              style={{ color: group.color }}
                            >
                              Découvrir
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}

        {/* Processus de travail */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Comment ça marche ?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Un processus simple et efficace pour tous nos services
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Contactez-nous",
                  description: "Décrivez votre projet et vos besoins spécifiques",
                },
                {
                  step: "02",
                  title: "Étude personnalisée",
                  description: "Nos experts analysent votre demande et proposent une solution",
                },
                {
                  step: "03",
                  title: "Mise en œuvre",
                  description: "Réalisation du service par nos équipes qualifiées",
                },
                {
                  step: "04",
                  title: "Suivi & Support",
                  description: "Accompagnement continu et service après-vente",
                },
              ].map((item, index) => (
                <div key={index} className="text-center relative">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Avantages */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Pourquoi choisir KesiMarket ?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Des avantages exclusifs pour nos clients professionnels
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Expertise reconnue",
                  description: "Des techniciens certifiés et une équipe de conseil expérimentée",
                  color: "#3B82F6",
                },
                {
                  icon: Clock,
                  title: "Réactivité garantie",
                  description: "Réponse sous 24h et intervention rapide sur tout le territoire",
                  color: "#10B981",
                },
                {
                  icon: Award,
                  title: "Qualité certifiée",
                  description: "Des services conformes aux normes et certifications en vigueur",
                  color: "#F59E0B",
                },
              ].map((advantage, index) => {
                const Icon = advantage.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardContent className="pt-8">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: `${advantage.color}20` }}
                      >
                        <Icon className="w-8 h-8" style={{ color: advantage.color }} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{advantage.title}</h3>
                      <p className="text-muted-foreground">{advantage.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
              <CardContent className="p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-4">
                  Besoin d'un accompagnement personnalisé ?
                </h2>
                <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                  Nos experts sont à votre disposition pour étudier votre projet
                  et vous proposer la solution la mieux adaptée à vos besoins.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="secondary" size="lg" asChild>
                    <Link href="/contact">
                      <Phone className="w-5 h-5 mr-2" />
                      Nous contacter
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                    asChild
                  >
                    <Link href="/contact">
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Demander un devis
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
