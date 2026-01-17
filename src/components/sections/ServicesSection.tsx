"use client";

import Link from "next/link";
import {
  ArrowRight,
  Settings,
  Award,
  Clock,
  Shield,
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
  Handshake,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServices } from "@/lib/query/hooks";
import { ServiceCard } from "./ServiceCard";
import { SERVICE_GROUPS, SERVICE_CATEGORIES_ORDER, type ServiceCategory } from "@/types/services";

// Mapping des icônes par slug de service
const serviceIcons: Record<string, LucideIcon> = {
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

export function ServicesSection() {
  const { data: services, isLoading, error } = useServices();

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-6 animate-pulse"
              >
                <div className="h-16 bg-gray-200 rounded mb-4" />
                <div className="h-6 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded mb-4" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="text-red-600 mb-4">
            Erreur lors du chargement des services
          </div>
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

  // Prendre les 6 premiers services pour la homepage
  const displayedServices = services?.data?.slice(0, 6) || [];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Nos services et solutions
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            10 solutions professionnelles pour accompagner vos projets électriques,
            de la conception à la réalisation
          </p>
          {/* Category badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {SERVICE_CATEGORIES_ORDER.map((category) => {
              const group = SERVICE_GROUPS[category];
              const Icon = categoryIconMap[category];
              return (
                <Link
                  key={category}
                  href={`/services#${category}`}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors hover:opacity-80"
                  style={{ backgroundColor: `${group.color}20`, color: group.color }}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {group.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayedServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={{
                id: service.id,
                slug: service.slug,
                name: service.name,
                shortDescription: service.shortDescription,
                category: service.category as ServiceCategory,
                features: Array.isArray(service.features) ? service.features : [],
                pricing: service.pricing,
                popular: service.popular,
              }}
              size="default"
              serviceIcons={serviceIcons}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-primary-foreground">
            <h3 className="text-2xl font-bold mb-4">
              Découvrez tous les services KesiMarket
            </h3>
            <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              De l'installation électrique aux solutions solaires, en passant par
              la formation et le conseil, KesiMarket vous accompagne dans
              tous vos projets.
            </p>
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
              asChild
            >
              <Link href="/services">
                Voir tous les services
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Key benefits */}
        <div className="mt-16 pt-12 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">
                Expertise reconnue
              </h4>
              <p className="text-sm text-muted-foreground">
                Techniciens certifiés et équipe expérimentée
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">
                Réactivité 24h
              </h4>
              <p className="text-sm text-muted-foreground">
                Réponse garantie sous 24 heures
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">
                Qualité certifiée
              </h4>
              <p className="text-sm text-muted-foreground">
                Services conformes aux normes en vigueur
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">
                Accompagnement
              </h4>
              <p className="text-sm text-muted-foreground">
                Un suivi personnalisé de A à Z
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
