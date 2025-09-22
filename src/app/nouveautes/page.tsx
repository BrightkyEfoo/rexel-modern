"use client";
import {
  Sparkles,
  Star,
  ArrowRight,
  Calendar,
  Tag,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { SafeImage } from "@/components/ui/safe-image";
import { formatPrice } from "@/lib/utils/currency";
import { useNewProducts } from "@/lib/hooks/useNewProducts";

import { useState } from "react";

export default function NouveautesPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const { data, isLoading, error } = useNewProducts({
    limit: 30,
    categoryId: selectedCategoryId || undefined,
  });

  console.log("product data", data);

  // @ts-ignore
  const products = data?.products || [];

  // @ts-ignore
  const categories = data?.categories || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4">Nouveautés</h1>
              <p className="text-xl text-primary-foreground/80 mb-8">
                Découvrez nos dernières innovations et produits en
                avant-première
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {categories.slice(0, 10).map((category: any) => (
                  <Badge
                    key={category.id || "all"}
                    variant={
                      selectedCategoryId === category.id
                        ? "default"
                        : "secondary"
                    }
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-primary-foreground hover:text-primary transition-colors"
                    onClick={() => setSelectedCategoryId(category.id)}
                  >
                    {category.name} ({category.productsCount})
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Nouveautés Grid */}
        <div className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Chargement des nouveautés...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-red-500 mb-4">
                Erreur lors du chargement des produits
              </div>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Réessayer
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-muted-foreground mb-4">
                Aucun nouveau produit trouvé dans cette catégorie
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedCategoryId(null)}
              >
                Voir tous les produits
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader className="relative">
                    <div className="absolute top-4 left-4 z-10">
                      <Badge variant="destructive" className="text-xs">
                        Nouveau
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 z-10">
                      {product.categories.slice(0, 3).map((category: any) => (
                        <Badge
                          variant="outline"
                          className="text-xs"
                          key={category.id}
                        >
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      <SafeImage
                        src={product.images?.[0] || "/placeholder-product.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {product.name}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {product.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Prix */}
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(product.price / 100)}
                        </span>
                        {product.originalPrice &&
                          product.originalPrice > product.price && (
                            <>
                              <span className="text-muted-foreground line-through">
                                {formatPrice(product.originalPrice / 100)}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                -
                                {Math.round(
                                  ((product.originalPrice - product.price) /
                                    product.originalPrice) *
                                    100
                                )}
                                %
                              </Badge>
                            </>
                          )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {product.rating}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({product.reviewsCount} avis)
                        </span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Ajouté le{" "}
                          {new Date(product.createdAt).toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2 pt-2">
                        <Button className="flex-1" size="sm" asChild>
                          <Link href={`/produit/${product.slug}`}>
                            <Tag className="w-4 h-4 mr-2" />
                            Voir détails
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/produit/${product.slug}`}>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Restez informé des nouveautés
              </h2>
              <p className="text-muted-foreground mb-8">
                Recevez en avant-première nos nouvelles offres et produits
                exclusifs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-0"
                />
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  S'abonner
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Besoin de conseils ?</h2>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Nos experts sont là pour vous accompagner dans vos choix
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Découvrir plus
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Voir le catalogue
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
