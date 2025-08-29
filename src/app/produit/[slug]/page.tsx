"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductFiles } from "@/components/ui/product-files";
import { ProductImageCarousel } from "@/components/ui/product-image-carousel";
import { ProductReviews } from "@/components/ui/product-reviews";
import { SafeImage } from "@/components/ui/safe-image";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/nextauth-hooks";
import { useProductFavoriteStatus } from "@/lib/hooks/useFavorites";
import { useProductReviewStats } from "@/lib/hooks/useReviews";
import {
  useAddToCart,
  useCart,
  useProduct,
  useSimilarProducts,
} from "@/lib/query/hooks";
import { formatPrice } from "@/lib/utils/currency";
import { getProductPrimaryCategory } from "@/lib/utils/product";
import {
  AlertCircle,
  Award,
  Check,
  Eye,
  Heart,
  Link2Icon,
  LinkIcon,
  Minus,
  Package,
  Plus,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const productSlug = params.slug as string;
  const { user, isAuthenticated } = useAuth();

  const { data: product, isLoading, error } = useProduct(productSlug);
  const productId = product?.data?.id;
  const addToCartMutation = useAddToCart();
  const { data: cart } = useCart();
  const favoriteState = useProductFavoriteStatus(productId?.toString());
  const { data: similarProducts, isLoading: similarProductsLoading } =
    useSimilarProducts(productSlug);
  const { data: reviewStats } = useProductReviewStats(productId?.toString() || '');
  const { toast } = useToast();

  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "specs" | "reviews" | "files" | "other"
  >("description");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-muted rounded-2xl h-96" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded" />
                <div className="h-6 bg-muted rounded w-2/3" />
                <div className="h-12 bg-muted rounded" />
                <div className="h-10 bg-muted rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Produit non trouvé ou erreur lors du chargement.
            </AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    );
  }

  const productData = product.data;
  const currentPrice = productData.price;
  const currentStock =
    typeof productData.inStock === "number" ? productData.inStock : 100;
  const isInStock = currentStock > 0;
  const primaryCategory = getProductPrimaryCategory(productData as any);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = "/auth/login";
      return;
    }

    if (!productId) {
      return;
    }

    try {
      await addToCartMutation.mutateAsync({
        productId: productId.toString(),
        quantity,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      window.location.href = "/auth/login";
      return;
    }

    try {
      await favoriteState.toggle();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= currentStock) {
      setQuantity(newQuantity);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: productData.name,
      text: productData.description,
      url: window.location.href,
    };

    try {
      // Essayer d'utiliser l'API Web Share native
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
        toast({
          title: "Partagé avec succès",
          description: "Le produit a été partagé via le menu natif",
        });
      } else {
        // Fallback: copier le lien dans le presse-papiers
        await navigator.clipboard.writeText(window.location.href);

        toast({
          title: "Lien copié !",
          description: "Le lien du produit a été copié dans le presse-papiers",
        });
      }
    } catch (error) {
      console.error("Erreur lors du partage:", error);

      // Fallback final: copier le lien manuellement
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Lien copié !",
          description: "Le lien du produit a été copié dans le presse-papiers",
        });
      } catch (clipboardError) {
        console.error("Erreur lors de la copie:", clipboardError);
        toast({
          title: "Erreur de partage",
          description:
            "Impossible de partager automatiquement. Veuillez copier manuellement le lien.",
          variant: "destructive",
        });
      }
    }
  };

  // Utiliser les spécifications du backend ou des valeurs par défaut
  const specifications = {
    Référence: productData.sku || "Non spécifiée",
    Marque: productData.brand?.name || "Non spécifiée",
    Catégorie: primaryCategory?.name || "Non spécifiée",
    Disponibilité: isInStock ? "En stock" : "Rupture de stock",
    Stock: `${currentStock} unités`,
    ...((productData as any).specifications || {}),
  };

  const features = [
    {
      icon: Zap,
      title: "Installation facile",
      description: "Montage simple en quelques minutes",
    },
    {
      icon: Shield,
      title: "Garantie 2 ans",
      description: "Protection complète contre les défauts",
    },
    {
      icon: Award,
      title: "Qualité professionnelle",
      description: "Conforme aux normes industrielles",
    },
    {
      icon: Package,
      title: "Livraison express",
      description: "Disponible en 24-48h",
    },
  ];



  // Utiliser les produits similaires de l'API ou un tableau vide si pas de données
  const relatedProducts = similarProducts?.data || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">
            Accueil
          </Link>
          <span>/</span>
          <Link
            href={`/categorie/${productData.categoryId}`}
            className="hover:text-primary"
          >
            {primaryCategory?.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{productData.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <ProductImageCarousel
            images={
              productData.files
                ?.filter((file) => file.mimeType?.startsWith("image/"))
                .map((file) => file.url) || []
            }
            productName={productData.name}
          />

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                {productData.brand && (
                  <Badge variant="secondary">{productData.brand.name}</Badge>
                )}
                {isInStock ? (
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    En stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Rupture de stock</Badge>
                )}
                {productData.isFeatured && (
                  <Badge
                    variant="outline"
                    className="border-yellow-500 text-yellow-700"
                  >
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Vedette
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-2">
                {productData.name}
              </h1>

              <p className="text-muted-foreground mb-4">
                {productData.description}
              </p>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-5 h-5 ${
                        index < Math.round(reviewStats?.data?.averageRating || 0)
                          ? "text-yellow-400 fill-current"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {reviewStats?.data?.averageRating?.toFixed(1) || '0.0'} ({reviewStats?.data?.total || 0} avis)
                </span>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="h-auto p-0"
                  onClick={() => setActiveTab("reviews")}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Voir tous les avis
                </Button>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">
                {formatPrice(currentPrice)} HT
              </div>
              <div className="text-lg text-muted-foreground">
                {formatPrice(Number(currentPrice) * 1.2)} TTC
              </div>
              <p className="text-sm text-muted-foreground">
                Prix dégressifs disponibles selon quantité
              </p>
            </div>

            {/* Features highlights */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg"
                >
                  <feature.icon className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">{feature.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {feature.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= currentStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {currentStock} disponibles
                </span>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!isInStock || addToCartMutation.isPending}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold h-12"
                >
                  {addToCartMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Ajout...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="w-5 h-5" />
                      <span>Ajouter au panier</span>
                    </div>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12"
                  onClick={handleToggleFavorite}
                  disabled={favoriteState.isLoading}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favoriteState.isFavorite
                        ? "fill-red-500 text-red-500"
                        : ""
                    }`}
                  />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-green-600" />
                <span className="text-sm">Livraison J+1</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm">Garantie 2 ans</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm">Stock sécurisé</span>
              </div>
            </div>

            {/* SKU and additional info */}
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Référence: {productData.sku}</div>
              <div>
                Dernière mise à jour: {new Date().toLocaleDateString("fr-FR")}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as any)}
            className="w-full"
          >
            <TabsList className="grid w-full sm:grid-cols-5 grid-cols-2 h-fit">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specs">Caractéristiques</TabsTrigger>
              <TabsTrigger value="reviews">
                Avis ({reviewStats?.data?.total || 0})
              </TabsTrigger>
              <TabsTrigger value="files">Documents</TabsTrigger>
              <TabsTrigger value="other">Autres</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {productData.description}
                    </p>
                    {(() => {
                      const longDescription = (productData as any)
                        .longDescription;
                      const features = (productData as any).features;
                      const applications = (productData as any).applications;

                      return (
                        <>
                          {features && features.length > 0 && (
                            <>
                              <h3 className="text-lg font-semibold mb-3">
                                Caractéristiques principales
                              </h3>
                              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                {features.map(
                                  (feature: string, index: number) => (
                                    <li key={index}>{feature}</li>
                                  )
                                )}
                              </ul>
                            </>
                          )}

                          {applications && (
                            <>
                              <h3 className="text-lg font-semibold mb-3 mt-6">
                                Applications recommandées
                              </h3>
                              <p className="text-muted-foreground">
                                {applications}
                              </p>
                            </>
                          )}

                          {longDescription && (
                            <div className="mt-6">
                              <div
                                className="text-muted-foreground"
                                dangerouslySetInnerHTML={{
                                  __html: longDescription,
                                }}
                              />
                            </div>
                          )}

                          {!features && !applications && !longDescription && (
                            <>
                              <h3 className="text-lg font-semibold mb-3">
                                Caractéristiques principales
                              </h3>
                              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li>Installation rapide et facile</li>
                                <li>
                                  Compatible avec tous les systèmes standards
                                </li>
                                <li>Matériaux de haute qualité certifiés</li>
                                <li>Résistant à l'usure et aux intempéries</li>
                                <li>
                                  Conforme aux normes européennes en vigueur
                                </li>
                              </ul>

                              <h3 className="text-lg font-semibold mb-3 mt-6">
                                Applications recommandées
                              </h3>
                              <p className="text-muted-foreground">
                                Ce produit est particulièrement adapté pour les
                                installations domestiques et professionnelles.
                                Il convient parfaitement aux environnements
                                exigeants et offre une fiabilité à long terme.
                              </p>
                            </>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specs" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(specifications).map(
                      ([key, value], index) => (
                        <div
                          key={index}
                          className="flex justify-between py-2 border-b border-muted"
                        >
                          <span className="font-medium text-foreground">
                            {key}
                          </span>
                          <span className="text-muted-foreground">
                            {String(value)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ProductReviews
                productId={productId?.toString() || ""}
              />
            </TabsContent>

            <TabsContent value="files" className="mt-6">
              <ProductFiles files={productData.files || []} />
            </TabsContent>

            <TabsContent value="other" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {(() => {
                      const additionalInfo = (productData as any)
                        .additionalInfo;
                      if (
                        additionalInfo &&
                        Object.keys(additionalInfo).length > 0
                      ) {
                        return Object.entries(additionalInfo).map(
                          ([key, value]) => (
                            <div key={key}>
                              <h3 className="text-lg font-semibold mb-3">
                                {key}
                              </h3>
                              {Array.isArray(value) ? (
                                <div className="grid md:grid-cols-2 gap-4">
                                  {value.map((item: any, index: number) => (
                                    <div
                                      key={index}
                                      className="flex items-center space-x-2"
                                    >
                                      <Check className="w-4 h-4 text-green-600" />
                                      <span className="text-sm">
                                        {String(item)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-muted-foreground">
                                  {String(value)}
                                </p>
                              )}
                            </div>
                          )
                        );
                      } else {
                        return (
                          <>
                            <div>
                              <h3 className="text-lg font-semibold mb-3">
                                Produits compatibles
                              </h3>
                              <div className="grid md:grid-cols-2 gap-4">
                                {[
                                  "Série A - Modèles 2020-2024",
                                  "Série B - Tous modèles",
                                  "Série C - Modèles Pro uniquement",
                                  "Accessoires universels",
                                ].map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2"
                                  >
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span className="text-sm">{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator />

                            <div>
                              <h3 className="text-lg font-semibold mb-3">
                                Non compatible avec
                              </h3>
                              <div className="grid md:grid-cols-2 gap-4">
                                {[
                                  "Anciens modèles (avant 2018)",
                                  "Série D - Version basique",
                                  "Systèmes propriétaires",
                                ].map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2"
                                  >
                                    <AlertCircle className="w-4 h-4 text-red-600" />
                                    <span className="text-sm">{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        );
                      }
                    })()}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Produits similaires</h2>
          {similarProductsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted rounded-lg mb-3" />
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-6 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
              {relatedProducts.map((related) => (
                <Link key={related.id} href={`/produit/${related.slug}`}>
                  <Card className="group hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardContent className="p-4 flex flex-col justify-between h-full">
                      <div>
                      <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
                        <SafeImage
                          src={related.imageUrl || "/placeholder.png"}
                          alt={related.name}
                          width={200}
                          height={200}
                          className="object-contain w-full h-full p-4 group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="font-medium text-sm mb-2 line-clamp-2">
                        {related.name}
                      </h3>
                      <div className="text-lg font-bold text-primary">
                        {formatPrice(related.price)}
                      </div>
                      </div>
                      <Button size="sm" className="w-full mt-2">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Voir le produit
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucun produit similaire trouvé
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
