"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";
import { useSimilarProducts } from "@/lib/query/hooks";
import { useCartSync } from "@/lib/hooks/useCartSync";
import { formatPrice } from "@/lib/utils/currency";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

interface SimilarProductsCardProps {
  cartItems: any[];
  title?: string;
  maxProducts?: number;
}

export function SimilarProductsCard({ 
  cartItems, 
  title = "Vous pourriez aussi aimer",
  maxProducts = 2 
}: SimilarProductsCardProps) {
  const [randomCartProduct, setRandomCartProduct] = useState<any>(null);
  const { addItem, isLoading } = useCartSync();

  // Sélectionner un produit aléatoire du panier pour les recommandations
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const randomIndex = Math.floor(Math.random() * cartItems.length);
      setRandomCartProduct(cartItems[randomIndex]);
    }
  }, [cartItems]);

  // Récupérer les produits similaires
  const { data: similarProductsData } = useSimilarProducts(
    randomCartProduct?.product?.slug || ''
  );

  const similarProducts = similarProductsData?.data || [];

  const handleAddSimilarProduct = async (product: any) => {
    try {
      await addItem(product, 1);
      toast({
        title: "Produit ajouté au panier",
        description: `${product.name} a été ajouté au panier`,
      });
    } catch (error) {
      console.error("Error adding similar product:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit au panier",
        variant: "destructive",
      });
    }
  };

  // Ne pas afficher si pas de produits similaires
  if (similarProducts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {title}
          {randomCartProduct && (
            <span className="text-sm font-normal text-muted-foreground block mt-1">
              Similaires à {randomCartProduct.product.name}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {similarProducts.slice(0, maxProducts).map((product: any) => (
            <div
              key={product.id}
              className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              {/* Image du produit avec SafeImage */}
              <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                <SafeImage
                  src={product.files?.[0]?.url || product.imageUrl || ''}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  showLogoOnError={true}
                  logoClassName="w-4 h-4"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <Link 
                  href={`/produit/${product.slug}`}
                  className="font-medium text-sm text-foreground hover:text-primary line-clamp-2"
                >
                  {product.name}
                </Link>
                <div className="text-sm text-primary font-semibold mt-1">
                  {formatPrice(Number(product.salePrice || product.price))}
                </div>
              </div>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-shrink-0"
                onClick={() => handleAddSimilarProduct(product)}
                disabled={isLoading}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
