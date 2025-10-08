"use client";

import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Cable,
  Lightbulb,
  Power,
  Wrench,
  Flame,
  Settings,
  Shield,
  Battery,
  Wifi,
  Home,
  Factory,
  Leaf,
  Network,
  Thermometer,
  Building,
  Router,
  Sun,
  Tv,
  Droplet,
} from "lucide-react";
import { useMainCategories } from "@/lib/query/hooks";

const categoryIcons = {
  "Fils et câbles": { icon: Cable, color: "text-blue-500" },
  "Distribution et gestion de l'énergie": {
    icon: Power,
    color: "text-red-500",
  },
  "Chauffage électrique climatisation ventilation": {
    icon: Thermometer,
    color: "text-orange-500",
  },
  "Produits industriels": { icon: Factory, color: "text-gray-500" },
  Éclairage: { icon: Lightbulb, color: "text-yellow-500" },
  "Appareillage et contrôle du bâtiment": {
    icon: Settings,
    color: "text-purple-500",
  },
  "Conduits et cheminements": { icon: Building, color: "text-indigo-500" },
  "Outillage, mesure et fixation": { icon: Wrench, color: "text-green-500" },
  "Sécurité et communication": { icon: Shield, color: "text-pink-500" },
  "Chauffage hydraulique et plomberie": { icon: Flame, color: "text-red-400" },
  "Réseau informatique": { icon: Router, color: "text-cyan-500" },
  "Production d'énergie - Photovoltaïque": {
    icon: Sun,
    color: "text-lime-500",
  },
  "Électroménager, multimédia et informatique": {
    icon: Tv,
    color: "text-violet-500",
  },
  Sanitaire: { icon: Droplet, color: "text-emerald-500" },
};

export function CategoriesGrid() {
  const { data: categories, isLoading, error } = useMainCategories(10);

  console.log("error", error);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(14)].map((_, index) => (
              <div key={index} className="group animate-pulse">
                <div className="bg-gray-200 rounded-2xl aspect-square" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return null;
  }

  return (
    <section className="py-12 bg-white sm:py-16 lg:py-20">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Explorer nos catégories
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Trouvez rapidement ce dont vous avez besoin parmi nos univers
            produits.
          </p>
        </div>

        <div className="grid grid-cols-1 min-[320px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12">
          {categories?.data?.map((category) => {
            const categoryConfig = categoryIcons[
              category.name as keyof typeof categoryIcons
            ] || { icon: Settings, color: "text-gray-500" };
            const IconComponent = categoryConfig.icon;

            return (
              <Link
                key={category.id}
                href={`/categorie/${category.slug}`}
                className="group block"
              >
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300 aspect-square flex flex-col items-center justify-center">
                  {/* Category Icon */}
                  <div className="relative w-16 h-16 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div
                      className={`w-full h-full rounded-xl bg-white shadow-sm border flex items-center justify-center ${categoryConfig.color}`}
                    >
                      <IconComponent className="w-8 h-8" />
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="text-center flex-1 flex flex-col justify-center">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 group-hover:text-primary-dark transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {category.productCount?.toLocaleString()} référence
                      {category.productCount && category.productCount > 1
                        ? "s"
                        : ""}
                    </p>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 h-6 bg-primary-dark text-white rounded-full flex items-center justify-center">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* View all categories */}
        <div className="text-center mt-12">
          <Link
            href="/categorie"
            className="inline-flex items-center space-x-2 text-primary-dark hover:text-primary-hover font-semibold text-lg group"
          >
            <span>Voir toutes nos catégories</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </section>
  );
}
