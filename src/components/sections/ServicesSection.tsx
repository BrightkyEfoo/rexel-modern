"use client";

import Link from "next/link";
import { ArrowRight, Leaf, Settings, Award, Truck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServices } from "@/lib/query/hooks";
import { ServiceCard } from "./ServiceCard";

const serviceIcons = {
  Open: Leaf,
  Freshmile: Zap,
  Esabora: Settings,
  Safir: Award,
  "R+": Truck,
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
            {[...Array(5)].map((_, index) => (
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

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Nos services et solutions
          </h2>
          <p className="text-muted-foreground mb-8">
            Découvrez tous les services et solutions KesiMarket pour vos projets énergétiques
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services?.data?.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              size={index === 0 ? "large" : "default"}
              serviceIcons={serviceIcons}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-primary-foreground">
            <h3 className="text-2xl font-bold mb-4">
              Découvrez tous les services et solutions KesiMarket
            </h3>
            <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              De la gestion énergétique aux solutions d'éclairage, en passant par
              la conformité réglementaire, KesiMarket vous accompagne dans
              tous vos projets énergétiques.
            </p>
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
              asChild
            >
              <Link href="/services">
                Tout voir
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Key benefits */}
        <div className="mt-16 pt-12 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">
                Éco-responsable
              </h4>
              <p className="text-sm text-muted-foreground">
                Solutions durables et conformes aux réglementations
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Settings className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Tout-en-un</h4>
              <p className="text-sm text-muted-foreground">
                Écosystème complet pour tous vos besoins
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Expertise</h4>
              <p className="text-sm text-muted-foreground">
                70 ans d'expérience à votre service
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Innovation</h4>
              <p className="text-sm text-muted-foreground">
                Technologies de pointe et solutions connectées
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
