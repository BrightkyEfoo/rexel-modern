/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

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
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useProduct } from '@/lib/query/hooks';
import { useAddToCart, useCart } from '@/lib/query/hooks';
import { useAuth } from '@/lib/auth/nextauth-hooks';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { user, isAuthenticated } = useAuth();

  const { data: product, isLoading, error } = useProduct(productId);
  const addToCartMutation = useAddToCart();
  const { data: cart } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'files'>('description');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 rounded-2xl h-96" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded" />
                <div className="h-6 bg-gray-200 rounded w-2/3" />
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded w-1/3" />
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
  const currentStock = typeof productData.inStock === 'number' ? productData.inStock : 0;
  const isInStock = currentStock > 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Redirect to login
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

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= currentStock) {
      setQuantity(newQuantity);
    }
  };

  const images = [productData.imageUrl];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-[#162e77]">Accueil</Link>
          <span>/</span>
          <Link href={`/categorie/${productData.categoryId}`} className="hover:text-[#162e77]">
            {productData.category?.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{productData.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-square">
              <Image
                src={images[selectedImage] || '/placeholder.png'}
                alt={productData.name}
                fill
                className="object-contain p-8"
              />

              {/* Image navigation */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() => setSelectedImage(Math.min(images.length - 1, selectedImage + 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail images */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-[#162e77]' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image || '/placeholder.png'}
                      alt={`${productData.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-contain p-2"
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
                <Badge variant="secondary">{productData.brand?.name}</Badge>
                {isInStock ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    En stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Rupture de stock</Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {productData.name}
              </h1>

              <p className="text-gray-600 mb-4">
                {productData.description}
              </p>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-5 h-5 ${
                        index < Math.floor(productData.averageRating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {productData.averageRating?.toFixed(1)} ({productData.reviewCount} avis)
                </span>
              </div>
            </div>

            {/* Variants */}
            {/* TODO: Bloc variantes commenté car productData.variants n'existe pas sur Product */}
            {/*
            {productData.variants && productData.variants.length > 1 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Variantes</h3>
                <div className="grid grid-cols-2 gap-2">
                  {productData.variants.map((variant: any) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        selectedVariant === variant.id || (!selectedVariant && variant === productData.variants?.[0])
                          ? 'border-[#162e77] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{variant.name}</div>
                      <div className="text-sm text-gray-600">{variant.price.toFixed(2)} €</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            */}

            {/* Price */}
            <div className="space-y-2">
              <div className="text-3xl font-bold text-[#162e77]">
                {Number(currentPrice).toFixed(2)} € HT
              </div>
              <div className="text-lg text-gray-600">
                {(Number(currentPrice) * 1.2).toFixed(2)} € TTC
              </div>
              <p className="text-sm text-gray-500">
                Prix dégressifs disponibles selon quantité
              </p>
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
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= currentStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-gray-500">
                  {currentStock} disponibles
                </span>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!isInStock || addToCartMutation.isPending}
                  className="flex-1 bg-[#162e77] hover:bg-[#1e40af] text-white font-semibold"
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
                <Button variant="outline" size="lg">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-green-600" />
                <span className="text-sm">Livraison J+1</span>
              </div>
              {/* TODO: Bloc warranty commenté car productData.warranty n'existe pas sur Product */}
              {/*
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm">Garantie {productData.warranty || ''}</span>
              </div>
              */}
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm">Stock sécurisé</span>
              </div>
            </div>

            {/* SKU and Certifications */}
            <div className="text-sm text-gray-600 space-y-1">
              <div>Référence: {productData.sku}</div>
              {/* TODO: Bloc certifications commenté car productData.certifications n'existe pas sur Product */}
              {/*
              {productData.certifications && (
                <div>
                  Certifications: {productData.certifications.join(', ')}
                </div>
              )}
              */}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specs', label: 'Caractéristiques' },
                { id: 'reviews', label: `Avis (${productData.reviewCount})` },
                { id: 'files', label: 'Documents' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-[#162e77] text-[#162e77]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                {/* TODO: Bloc longDescription/dimensions/weight commenté car propriétés absentes sur Product */}
                {/*
                <p className="text-gray-700 leading-relaxed">
                  {productData.longDescription || productData.description}
                </p>
                {productData.dimensions && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Dimensions</h3>
                    <p>
                      {productData.dimensions.length} × {productData.dimensions.width} × {productData.dimensions.height} mm
                      {productData.weight && ` • Poids: ${productData.weight} kg`}
                    </p>
                  </div>
                )}
                */}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* TODO: Bloc specifications commenté car productData.specifications n'existe pas sur Product */}
                {/*
                {productData.specifications && (
                  Object.entries(productData.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-900">{key}</span>
                      <span className="text-gray-600">{String(value)}</span>
                    </div>
                  ))
                )}
                */}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* TODO: Bloc reviews commenté car productData.reviews n'existe pas sur Product */}
                {/*
                {productData.reviews?.map((review: any) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{review.userName}</span>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs">
                            ✓ Achat vérifié
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
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <h4 className="font-medium mb-2">{review.title}</h4>
                    <p className="text-gray-700">{review.comment}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                ))}
                */}
              </div>
            )}

            {activeTab === 'files' && (
              <div className="space-y-4">
                {/* TODO: Bloc downloadableFiles commenté car productData.downloadableFiles n'existe pas sur Product */}
                {/*
                {productData.downloadableFiles?.map((file: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Download className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-gray-500 capitalize">{file.type}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Télécharger
                    </Button>
                  </div>
                ))}
                */}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {/* TODO: Bloc relatedProducts commenté car productData.relatedProducts n'existe pas sur Product */}
        {/*
        {productData.relatedProducts && productData.relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Produits similaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {productData.relatedProducts.slice(0, 4).map((related: any) => {
                const key = typeof related === 'string' ? related : related.id;
                return (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <div className="aspect-square bg-gray-50 rounded-lg mb-3" />
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
        */}
      </main>

      <Footer />
    </div>
  );
}
