"use client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { useCategories } from "@/lib/query/hooks";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Folder, 
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
  Package,
  Cog,
  Hammer,
  Gauge,
  Layers,
  Grid3X3,
  Box,
  Archive
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import type { Category } from "@/lib/api/types";
import { CategoryFilters } from "@/lib/types/categories";

// Tableau d'icônes diversifiées pour les catégories
const categoryIcons = [
  Zap, Cable, Lightbulb, Power, Wrench, Flame, Settings, Shield,
  Battery, Wifi, Home, Factory, Leaf, Network, Thermometer, Building,
  Router, Sun, Tv, Droplet, Package, Cog, Hammer, Gauge,
  Layers, Grid3X3, Box, Archive, Folder
];

// Couleurs pour les icônes
const iconColors = [
  "text-blue-500", "text-red-500", "text-orange-500", "text-gray-500",
  "text-yellow-500", "text-purple-500", "text-indigo-500", "text-green-500",
  "text-pink-500", "text-red-400", "text-cyan-500", "text-lime-500",
  "text-violet-500", "text-emerald-500", "text-amber-500", "text-slate-500",
  "text-teal-500", "text-rose-500", "text-sky-500", "text-fuchsia-500"
];

function CategoryCard({ category, index }: { category: Category; index: number }) {
  // Sélectionner une icône et couleur basée sur l'index pour diversifier
  const IconComponent = categoryIcons[index % categoryIcons.length];
  const iconColor = iconColors[index % iconColors.length];
  
  return (
    <Link
      href={`/categorie/${category.slug}`}
      className="block bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 p-4 h-full"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden mb-2">
          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className={`w-full h-full rounded-lg bg-white shadow-sm border flex items-center justify-center ${iconColor}`}>
              <IconComponent className="w-8 h-8" />
            </div>
          )}
        </div>
        <div className="font-semibold text-base text-foreground line-clamp-2 mb-1">
          {category.name}
        </div>
        <Badge variant="outline" className="text-xs mb-1">
          {category.slug}
        </Badge>
        <div className="text-xs text-muted-foreground">
          {typeof category.productCount === "number" &&
          category.productCount >= 0
            ? category.productCount
            : 0}{" "}
          produit{category.productCount && category.productCount > 1 ? "s" : ""}
        </div>
      </div>
    </Link>
  );
}

export default function CategoriesCatalogPage() {
  const [page, setPage] = useState(1);
  const per_page = 20;
  // Utilisation des filtres pages pour l'appel serveur
  const { data, isLoading, error } = useCategories({ page, per_page });
  const categories = data?.data || [];
  const meta = data?.meta || {
    total: categories.length,
    per_page,
    current_page: page,
    last_page: Math.ceil(categories.length / per_page),
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mt-8 mb-8 container">
        <Link href="/" className="hover:text-primary">
          Accueil
        </Link>
        <span>/</span>
        <span className="text-foreground">Catégories</span>
      </nav>
      <div className="container flex-1 mb-4">
        <h1 className="text-3xl font-bold mb-8">Toutes les catégories</h1>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: meta.per_page }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 shadow p-4 h-full flex flex-col items-center"
              >
                <Skeleton className="rounded-lg h-16 w-16 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-3 w-1/3 mb-1" />
                <Skeleton className="h-3 w-12 mb-1" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-destructive">
            Erreur lors du chargement des catégories
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center text-muted-foreground">
            Aucune catégorie trouvée
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
              {categories.map((category: Category, index: number) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </div>
            {/* Pagination shadcn */}
            {meta.last_page > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page > 1) setPage(page - 1);
                        }}
                        aria-disabled={page <= 1}
                        className={
                          page <= 1 ? "pointer-events-none opacity-60" : ""
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: meta.last_page }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={page === i + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(i + 1);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page < meta.last_page) setPage(page + 1);
                        }}
                        aria-disabled={page >= meta.last_page}
                        className={
                          page >= meta.last_page
                            ? "pointer-events-none opacity-60"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
