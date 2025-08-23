"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Check,
  Truck,
  Shield,
  Download,
  Plus,
  Minus,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Package,
  Clock,
  FileText,
  Camera,
  Info,
  Eye,
  Zap,
  Award,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/ui/logo';
import { useProduct, useAddToCart, useCart } from '@/lib/query/hooks';
import { useProductFavoriteStatus } from '@/lib/hooks/useFavorites';
import { useAuth } from '@/lib/auth/nextauth-hooks';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getProductPrimaryCategory } from '@/lib/utils/product';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { user, isAuthenticated } = useAuth();

  const { data: product, isLoading, error } = useProduct(productId);
  const addToCartMutation = useAddToCart();
  const { data: cart } = useCart();
  const favoriteState = useProductFavoriteStatus(productId);

  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'files' | 'compatibility'>('description');
  const [imageError, setImageError] = useState(false);

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
  const currentStock = typeof productData.inStock === 'number' ? productData.inStock : 100;
  const isInStock = currentStock > 0;
  const primaryCategory = getProductPrimaryCategory(productData as any);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = '/auth/login';
      return;
    }

    try {
      await addToCartMutation.mutateAsync({
        productId,
        quantity
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      window.location.href = '/auth/login';
      return;
    }

    try {
      await favoriteState.toggle();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= currentStock) {
      setQuantity(newQuantity);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const images = productData.files?.map(file => file.url) || (productData.imageUrl ? [productData.imageUrl] : []);

  const specifications = {
    'Référence': productData.sku,
    'Marque': productData.brand?.name || 'Non spécifiée',
    'Catégorie': primaryCategory?.name || 'Non spécifiée',
    'Disponibilité': isInStock ? 'En stock' : 'Rupture de stock',
    'Stock': `${currentStock} unités`,
    'Poids': '0.5 kg', // Mock data
    'Dimensions': '15 x 10 x 5 cm', // Mock data
    'Matériau': 'Plastique ABS', // Mock data
    'Certification': 'CE, RoHS', // Mock data
    'Garantie': '2 ans', // Mock data
    'Pays d\'origine': 'France' // Mock data
  };

  const features = [
    { icon: Zap, title: 'Installation facile', description: 'Montage simple en quelques minutes' },
    { icon: Shield, title: 'Garantie 2 ans', description: 'Protection complète contre les défauts' },
    { icon: Award, title: 'Qualité professionnelle', description: 'Conforme aux normes industrielles' },
    { icon: Package, title: 'Livraison express', description: 'Disponible en 24-48h' }
  ];

  const reviews = [
    {
      id: 1,
      userName: 'Jean Dupont',
      rating: 5,
      title: 'Excellent produit',
      comment: 'Très satisfait de cet achat. Qualité au rendez-vous et installation simple.',
      verified: true,
      createdAt: '2024-01-15',
      helpful: 12
    },
    {
      id: 2,
      userName: 'Marie Martin',
      rating: 4,
      title: 'Bon rapport qualité-prix',
      comment: 'Produit conforme à la description. Quelques détails à améliorer mais globalement satisfaisant.',
      verified: true,
      createdAt: '2024-01-10',
      helpful: 8
    }
  ];

  const relatedProducts = [
    { id: '1', name: 'Produit similaire 1', price: '12.50', imageUrl: '/placeholder.png' },
    { id: '2', name: 'Produit similaire 2', price: '18.90', imageUrl: '/placeholder.png' },
    { id: '3', name: 'Produit similaire 3', price: '25.00', imageUrl: '/placeholder.png' },
    { id: '4', name: 'Produit similaire 4', price: '31.20', imageUrl: '/placeholder.png' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Accueil</Link>
          <span>/</span>
          <Link href={`/categorie/${productData.categoryId}`} className="hover:text-primary">
            {primaryCategory?.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{productData.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative bg-muted rounded-2xl overflow-hidden aspect-square">
              {imageError || !images.length ? (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Logo variant="light" size="lg" showText={false} />
                </div>
              ) : (
                <Image
                  src={images[selectedImage] || '/placeholder.png'}
                  alt={productData.name}
                  fill
                  className="object-contain p-8"
                  onError={handleImageError}
                />
              )}

              {/* Image navigation */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                    disabled={selectedImage === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() => setSelectedImage(Math.min(images.length - 1, selectedImage + 1))}
                    disabled={selectedImage === images.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Image counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {selectedImage + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail images */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 bg-muted rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image || '/placeholder.png'}
                      alt={`${productData.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-contain p-2 w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                {productData.brand && (
                  <Badge variant="secondary">{productData.brand.name}</Badge>
                )}
                {isInStock ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <Check className="w-3 h-3 mr-1" />
                    En stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Rupture de stock</Badge>
                )}
                {productData.isFeatured && (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-700">
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
                        index < 4 ? 'text-yellow-400 fill-current' : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  4.5 (128 avis)
                </span>
                <Button variant="link" size="sm" className="h-auto p-0">
                  <Eye className="w-4 h-4 mr-1" />
                  Voir tous les avis
                </Button>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">
                {Number(currentPrice).toFixed(2)} € HT
              </div>
              <div className="text-lg text-muted-foreground">
                {(Number(currentPrice) * 1.2).toFixed(2)} € TTC
              </div>
              <p className="text-sm text-muted-foreground">
                Prix dégressifs disponibles selon quantité
              </p>
            </div>

            {/* Features highlights */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg">
                  <feature.icon className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">{feature.title}</div>
                    <div className="text-xs text-muted-foreground">{feature.description}</div>
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
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
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
                      favoriteState.isFavorite ? 'fill-red-500 text-red-500' : ''
                    }`} 
                  />
                </Button>
                <Button variant="outline" size="lg" className="h-12">
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
              <div>Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specs">Caractéristiques</TabsTrigger>
              <TabsTrigger value="reviews">Avis (128)</TabsTrigger>
              <TabsTrigger value="files">Documents</TabsTrigger>
              <TabsTrigger value="compatibility">Compatibilité</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {productData.description}
                    </p>
                    <h3 className="text-lg font-semibold mb-3">Caractéristiques principales</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Installation rapide et facile</li>
                      <li>Compatible avec tous les systèmes standards</li>
                      <li>Matériaux de haute qualité certifiés</li>
                      <li>Résistant à l'usure et aux intempéries</li>
                      <li>Conforme aux normes européennes en vigueur</li>
                    </ul>
                    
                    <h3 className="text-lg font-semibold mb-3 mt-6">Applications recommandées</h3>
                    <p className="text-muted-foreground">
                      Ce produit est particulièrement adapté pour les installations domestiques et professionnelles. 
                      Il convient parfaitement aux environnements exigeants et offre une fiabilité à long terme.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specs" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(specifications).map(([key, value], index) => (
                      <div key={index} className="flex justify-between py-2 border-b border-muted">
                        <span className="font-medium text-foreground">{key}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Reviews summary */}
                <Card>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="text-4xl font-bold">4.5</div>
                          <div>
                            <div className="flex items-center mb-1">
                              {[...Array(5)].map((_, index) => (
                                <Star
                                  key={index}
                                  className={`w-5 h-5 ${
                                    index < 4 ? 'text-yellow-400 fill-current' : 'text-muted'
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="text-sm text-muted-foreground">128 avis clients</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Button className="w-full">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Laisser un avis
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Individual reviews */}
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{review.userName}</span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              <Check className="w-3 h-3 mr-1" />
                              Achat vérifié
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={`w-4 h-4 ${
                                index < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-muted'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <h4 className="font-medium mb-2">{review.title}</h4>
                      <p className="text-muted-foreground mb-3">{review.comment}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{new Date(review.createdAt).toLocaleDateString('fr-FR')}</span>
                        <span>{review.helpful} personnes ont trouvé cet avis utile</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="files" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { name: 'Notice d\'installation', type: 'PDF', size: '2.3 MB' },
                      { name: 'Fiche technique', type: 'PDF', size: '1.8 MB' },
                      { name: 'Certificat de conformité', type: 'PDF', size: '0.9 MB' },
                      { name: 'Guide de dépannage', type: 'PDF', size: '1.2 MB' }
                    ].map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{file.name}</div>
                            <div className="text-sm text-muted-foreground">{file.type} • {file.size}</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compatibility" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Produits compatibles</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          'Série A - Modèles 2020-2024',
                          'Série B - Tous modèles',
                          'Série C - Modèles Pro uniquement',
                          'Accessoires universels'
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Non compatible avec</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          'Anciens modèles (avant 2018)',
                          'Série D - Version basique',
                          'Systèmes propriétaires'
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Produits similaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((related) => (
              <Card key={related.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
                    <Image
                      src={related.imageUrl}
                      alt={related.name}
                      width={200}
                      height={200}
                      className="object-contain w-full h-full p-4 group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-medium text-sm mb-2 line-clamp-2">{related.name}</h3>
                  <div className="text-lg font-bold text-primary">{related.price} €</div>
                  <Button size="sm" className="w-full mt-2">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}