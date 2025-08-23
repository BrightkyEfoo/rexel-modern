/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth/nextauth-hooks";
import {
  useCart,
  useRemoveFromCart,
  useUpdateCartItem,
} from "@/lib/query/hooks";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  CreditCard,
  Heart,
  Minus,
  Package,
  Plus,
  Shield,
  ShoppingCart,
  Trash2,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Logo } from "@/components/ui/logo";
import { AddressSelector } from "@/components/ui/address-selector";
import { BillingAddressSelector } from "@/components/ui/billing-address-selector";
import { AddressFormData } from "@/components/ui/address-form";
import { useAddresses, useCreateAddress } from "@/lib/hooks/useAddresses";

type CheckoutStep = "cart" | "shipping" | "payment" | "confirmation";

export default function CartPage() {
  const { user, isAuthenticated } = useAuth();
  const { data: cart, isLoading, error } = useCart();
  const updateCartItemMutation = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("cart");
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [selectedShippingAddress, setSelectedShippingAddress] =
    useState<string>("");
  const [selectedBillingAddress, setSelectedBillingAddress] =
    useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [orderNotes, setOrderNotes] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<string>("standard");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  // Fonction utilitaire pour formater les prix
  const formatPrice = (price: number): string => {
    return price.toLocaleString('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2 
    });
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/auth/login";
    }
  }, [isAuthenticated]);

  // Set default addresses
  useEffect(() => {
    if (user?.addresses) {
      const defaultShipping = user.addresses.find(
        (addr) => addr.type === "shipping" && addr.isDefault
      );
      const defaultBilling = user.addresses.find(
        (addr) => addr.type === "billing" && addr.isDefault
      );

      if (defaultShipping) setSelectedShippingAddress(defaultShipping.id);
      if (defaultBilling) setSelectedBillingAddress(defaultBilling.id);
    }
  }, [user]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) return;

    try {
      await updateCartItemMutation.mutateAsync({
        itemId: Number(itemId),
        quantity: newQuantity,
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCartMutation.mutateAsync(Number(itemId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleApplyPromoCode = () => {
    // Mock promo code validation
    if (promoCode.toLowerCase() === "bienv202") {
      setPromoDiscount(20);
    } else if (promoCode.toLowerCase() === "fidele10") {
      setPromoDiscount(10);
    } else {
      setPromoDiscount(0);
    }
  };

  const calculateTotals = () => {
    if (!cart?.data) {
      return { subtotal: 0, shipping: 0, discount: 0, total: 0 };
    }

    // Calcul du sous-total à partir des items du panier
    const subtotal = cart.data.items?.reduce((sum, item) => {
      const itemPrice = Number(item.product?.price || item.price || 0);
      const quantity = Number(item.quantity || 0);
      return sum + (itemPrice * quantity);
    }, 0) || 0;

    // Frais de livraison selon la méthode choisie (seulement si une méthode est sélectionnée)
    let shipping = 0;
    if (deliveryMethod === "standard") {
      shipping = 8.50;
    } else if (deliveryMethod === "express") {
      shipping = 15.90;
    } else if (deliveryMethod === "pickup") {
      shipping = 0;
    }

    const discount = promoDiscount;
    
    // Le total inclut la livraison seulement si une méthode est sélectionnée
    const shippingToAdd = (deliveryMethod && deliveryMethod !== "") ? shipping : 0;
    const total = Math.max(0, subtotal + shippingToAdd - discount);

    return { subtotal, shipping, discount, total };
  };

  const totals = calculateTotals();

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-64" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded" />
                ))}
              </div>
              <div className="h-96 bg-muted rounded" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !cart?.data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erreur lors du chargement du panier.
            </AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    );
  }

  const cartData = cart.data;

  if (cartData.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Votre panier est vide
            </h2>
            <p className="text-muted-foreground mb-8">
              Découvrez nos produits et ajoutez-les à votre panier
            </p>
            <Button asChild>
              <Link href="/categories">Découvrir nos produits</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
          <span className="text-foreground">Panier</span>
        </nav>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { step: "cart", label: "Panier", icon: ShoppingCart },
              { step: "shipping", label: "Livraison", icon: Truck },
              { step: "payment", label: "Paiement", icon: CreditCard },
              { step: "confirmation", label: "Confirmation", icon: Check },
            ].map(({ step, label, icon: Icon }, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step === currentStep
                      ? "border-primary bg-primary text-white"
                      : index <
                        ["cart", "shipping", "payment", "confirmation"].indexOf(
                          currentStep
                        )
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    step === currentStep ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
                {index < 3 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cart Step */}
        {currentStep === "cart" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <h1 className="text-3xl font-bold text-foreground">
                Mon panier ({cartData.totalItems} articles)
              </h1>

              <div className="space-y-4">
                {cartData.items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-6">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                          {imageErrors[item.product.id.toString()] || !item.product.imageUrl ? (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <Logo variant="light" size="sm" showText={false} />
                            </div>
                          ) : (
                            <Image
                              src={item.product.files?.[0]?.url || item.product.imageUrl}
                              alt={item.product.name}
                              width={96}
                              height={96}
                              className="object-contain w-full h-full p-2"
                              onError={() => handleImageError(item.product.id.toString())}
                            />
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <Link
                                href={`/produit/${item.productId}`}
                                className="font-semibold text-foreground hover:text-primary"
                              >
                                {item.product.name}
                              </Link>
                              <div className="text-sm text-muted-foreground mt-1">
                                <Badge variant="secondary">
                                  {item.product.brand?.name}
                                </Badge>
                                <span className="ml-2">
                                  SKU: {item.product.sku}
                                </span>
                              </div>
                              {item.variant && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  Variante: {item.variant.name}
                                </div>
                              )}
                              <div className="flex items-center mt-2">
                                <div
                                  className={`w-2 h-2 rounded-full mr-2 ${
                                    item.product.availability === "in_stock"
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }`}
                                />
                                <span className="text-sm text-muted-foreground">
                                  {item.product.availability === "in_stock"
                                    ? "En stock"
                                    : "Rupture de stock"}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-foreground">
                                {item.totalPrice?.toLocaleString('fr-FR', { 
                                  style: 'currency', 
                                  currency: 'EUR',
                                  minimumFractionDigits: 2 
                                })}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {item.product?.price ? formatPrice(Number(item.product.price)) : formatPrice(Number(item.price || 0))} / unité
                              </div>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center border rounded-lg">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.id?.toString() || "",
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={
                                    item.quantity <= 1 ||
                                    updateCartItemMutation.isPending
                                  }
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="px-4 py-2 font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.id?.toString() || "",
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={updateCartItemMutation.isPending}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id?.toString() || "")}
                                disabled={removeFromCartMutation.isPending}
                                className="text-destructive hover:text-destructive/80"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="pt-6">
                <Button variant="outline" asChild>
                  <Link href="/categories">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Continuer mes achats
                  </Link>
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Récapitulatif de commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Promo Code */}
                  <div className="space-y-2">
                    <Label htmlFor="promo">Code promo</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="promo"
                        placeholder="BIENV202"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button onClick={handleApplyPromoCode} variant="outline">
                        Appliquer
                      </Button>
                    </div>
                    {promoDiscount > 0 && (
                      <div className="text-sm text-green-600">
                        Code appliqué : -{promoDiscount}€
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span>{formatPrice(totals.subtotal)}</span>
                    </div>
                    {deliveryMethod && deliveryMethod !== "" && (
                      <div className="flex justify-between">
                        <span>Livraison</span>
                        <span>{deliveryMethod === "pickup" ? "GRATUIT" : formatPrice(totals.shipping)}</span>
                      </div>
                    )}
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Remise</span>
                        <span>-{formatPrice(totals.discount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(totals.total)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
                    onClick={() => setCurrentStep("shipping")}
                  >
                    Passer la commande
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Paiement sécurisé</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span>Livraison rapide</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Package className="w-4 h-4 text-purple-600" />
                      <span>Retour gratuit</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span>Support 24/7</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Vous pourriez aussi aimer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Mock recommended products */}
                    {[
                      { name: "Interrupteur va-et-vient", price: 8.9 },
                      { name: "Boîte de dérivation", price: 3.5 },
                    ].map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 border rounded-lg"
                      >
                        <div className="w-12 h-12 bg-muted rounded" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {product.name}
                          </div>
                          <div className="text-sm text-primary font-semibold">
                            {formatPrice(Number(product.price))}
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Shipping Step */}
        {currentStep === "shipping" && (
          <ShippingStep
            user={user}
            selectedShippingAddress={selectedShippingAddress}
            setSelectedShippingAddress={setSelectedShippingAddress}
            selectedBillingAddress={selectedBillingAddress}
            setSelectedBillingAddress={setSelectedBillingAddress}
            deliveryMethod={deliveryMethod}
            setDeliveryMethod={setDeliveryMethod}
            onNext={() => setCurrentStep("payment")}
            onBack={() => setCurrentStep("cart")}
            totals={totals}
          />
        )}

        {/* Payment Step */}
        {currentStep === "payment" && (
          <PaymentStep
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            orderNotes={orderNotes}
            setOrderNotes={setOrderNotes}
            deliveryMethod={deliveryMethod}
            onNext={() => setCurrentStep("confirmation")}
            onBack={() => setCurrentStep("shipping")}
            totals={totals}
          />
        )}

        {/* Confirmation Step */}
        {currentStep === "confirmation" && (
          <ConfirmationStep
            cart={cartData}
            totals={totals}
            user={user}
            selectedShippingAddress={selectedShippingAddress}
            selectedBillingAddress={selectedBillingAddress}
            paymentMethod={paymentMethod}
            orderNotes={orderNotes}
            deliveryMethod={deliveryMethod}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

// Shipping Step Component
interface ShippingStepProps {
  user: any;
  selectedShippingAddress: string;
  setSelectedShippingAddress: (id: string) => void;
  selectedBillingAddress: string;
  setSelectedBillingAddress: (id: string) => void;
  deliveryMethod: string;
  setDeliveryMethod: (method: string) => void;
  onNext: () => void;
  onBack: () => void;
  totals: any;
}

function ShippingStep({
  user,
  selectedShippingAddress,
  setSelectedShippingAddress,
  selectedBillingAddress,
  setSelectedBillingAddress,
  deliveryMethod,
  setDeliveryMethod,
  onNext,
  onBack,
  totals,
}: ShippingStepProps) {
  const [useSameAsShipping, setUseSameAsShipping] = useState(false);
  
  // Hooks pour la gestion des adresses
  const { data: addresses = [], isLoading: addressesLoading } = useAddresses();
  const createAddressMutation = useCreateAddress();

  // Fonction utilitaire pour formater les prix
  const formatPrice = (price: number): string => {
    return price.toLocaleString('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2 
    });
  };

  // Gérer l'ajout d'une nouvelle adresse
  const handleAddAddress = async (addressData: AddressFormData, type: 'shipping' | 'billing') => {
    try {
      const newAddress = await createAddressMutation.mutateAsync({
        ...addressData,
        type
      });
      
      // Sélectionner automatiquement la nouvelle adresse
      if (type === 'shipping') {
        setSelectedShippingAddress(newAddress.id);
      } else {
        setSelectedBillingAddress(newAddress.id);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'adresse:', error);
    }
  };
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-3xl font-bold text-foreground">
          Informations de livraison
        </h2>

        {/* Shipping Address */}
        {addressesLoading ? (
          <div className="p-8 text-center">
            <p>Chargement des adresses...</p>
          </div>
        ) : (
          <AddressSelector
            addresses={addresses}
            selectedAddressId={selectedShippingAddress}
            onAddressSelect={setSelectedShippingAddress}
            onAddressAdd={(data) => handleAddAddress(data, 'shipping')}
            type="shipping"
            title="Adresse de livraison"
            isAddingAddress={createAddressMutation.isPending}
          />
        )}

        {/* Billing Address */}
        <BillingAddressSelector
          addresses={addresses}
          selectedBillingAddressId={selectedBillingAddress}
          selectedShippingAddressId={selectedShippingAddress}
          onBillingAddressSelect={setSelectedBillingAddress}
          onAddressAdd={(data) => handleAddAddress(data, 'billing')}
          useSameAsShipping={useSameAsShipping}
          onUseSameAsShippingChange={setUseSameAsShipping}
        />

        {/* Shipping Options */}
        <Card>
          <CardHeader>
            <CardTitle>Options de livraison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="shipping"
                    value="standard"
                    checked={deliveryMethod === "standard"}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="text-primary"
                  />
                  <div>
                    <div className="font-semibold">Livraison standard</div>
                    <div className="text-sm text-muted-foreground">
                      3-5 jours ouvrés
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatPrice(8.50)}</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="shipping"
                    value="express"
                    checked={deliveryMethod === "express"}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="text-primary"
                  />
                  <div>
                    <div className="font-semibold">Livraison express</div>
                    <div className="text-sm text-muted-foreground">24-48h</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatPrice(15.90)}</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-secondary/5">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="shipping"
                    value="pickup"
                    checked={deliveryMethod === "pickup"}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="text-primary"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <div className="font-semibold">Retrait en boutique</div>
                      <div className="text-sm text-muted-foreground">
                        Disponible sous 2h • Plus de 50 boutiques partenaires
                      </div>
                      <div className="text-xs text-secondary font-medium mt-1">
                        📍 Trouvez la boutique la plus proche
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600 text-lg">GRATUIT</div>
                  <div className="text-xs text-muted-foreground">Économisez la livraison</div>
                </div>
              </div>
            </div>

            {/* Liste des boutiques pour retrait */}
            {deliveryMethod === "pickup" && (
              <div className="mt-4 p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                <h4 className="font-semibold text-foreground mb-3">Choisissez votre boutique</h4>
                <div className="space-y-2">
                  {[
                    { name: "KesiMarket Paris Centre", address: "123 Rue de Rivoli, 75001 Paris", distance: "0.5 km" },
                    { name: "KesiMarket Paris Nord", address: "45 Avenue Jean Jaurès, 75019 Paris", distance: "2.1 km" },
                    { name: "KesiMarket Boulogne", address: "78 Route de la Reine, 92100 Boulogne", distance: "5.3 km" }
                  ].map((store, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-primary/5 cursor-pointer"
                    >
                      <div>
                        <div className="font-medium text-foreground">{store.name}</div>
                        <div className="text-sm text-muted-foreground">{store.address}</div>
                      </div>
                      <div className="text-sm text-secondary font-medium">{store.distance}</div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  Voir toutes les boutiques sur la carte
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au panier
          </Button>
          <Button
            onClick={onNext}
            disabled={!selectedShippingAddress || !selectedBillingAddress}
            className="bg-primary hover:bg-primary/90"
          >
            Continuer vers le paiement
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Récapitulatif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              {deliveryMethod && deliveryMethod !== "" && (
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>{deliveryMethod === "pickup" ? "GRATUIT" : formatPrice(totals.shipping)}</span>
                </div>
              )}

              {totals.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Remise</span>
                  <span>-{formatPrice(totals.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(totals.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Payment Step Component
interface PaymentStepProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
  deliveryMethod: string;
  onNext: () => void;
  onBack: () => void;
  totals: any;
}

function PaymentStep({
  paymentMethod,
  setPaymentMethod,
  orderNotes,
  setOrderNotes,
  deliveryMethod,
  onNext,
  onBack,
  totals,
}: PaymentStepProps) {
  // Fonction utilitaire pour formater les prix
  const formatPrice = (price: number): string => {
    return price.toLocaleString('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2 
    });
  };
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-3xl font-bold text-foreground">Paiement</h2>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Mode de paiement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === "credit_card"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-border/80"
                }`}
                onClick={() => setPaymentMethod("credit_card")}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={paymentMethod === "credit_card"}
                    onChange={() => setPaymentMethod("credit_card")}
                    className="text-primary"
                  />
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">Carte bancaire</div>
                    <div className="text-sm text-muted-foreground">
                      Visa, MasterCard, American Express
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === "bank_transfer"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-border/80"
                }`}
                onClick={() => setPaymentMethod("bank_transfer")}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={() => setPaymentMethod("bank_transfer")}
                    className="text-primary"
                  />
                  <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">
                      €
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">Virement bancaire</div>
                    <div className="text-sm text-muted-foreground">
                      Paiement à 30 jours
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === "check"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-border/80"
                }`}
                onClick={() => setPaymentMethod("check")}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={paymentMethod === "check"}
                    onChange={() => setPaymentMethod("check")}
                    className="text-primary"
                  />
                  <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Chèque</div>
                    <div className="text-sm text-muted-foreground">
                      À l'ordre de KesiMarket
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Card Form */}
        {paymentMethod === "credit_card" && (
          <Card>
            <CardHeader>
              <CardTitle>Informations de carte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="card-number">Numéro de carte</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="expiry">Date d'expiration</Label>
                  <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" className="mt-1" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="card-name">Nom sur la carte</Label>
                  <Input
                    id="card-name"
                    placeholder="Jean Dupont"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes de commande (optionnel)</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              placeholder="Instructions particulières, accès difficile, créneaux préférés..."
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="w-full p-3 border border-border rounded-lg resize-none h-24"
            />
          </CardContent>
        </Card>

        {/* Terms */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 text-primary"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                J'accepte les{" "}
                <Link
                  href="/conditions-generales"
                  className="text-primary hover:underline"
                >
                  conditions générales de vente
                </Link>{" "}
                et la{" "}
                <Link
                  href="/politique-confidentialite"
                  className="text-primary hover:underline"
                >
                  politique de confidentialité
                </Link>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la livraison
          </Button>
          <Button
            onClick={onNext}
            disabled={!paymentMethod}
            className="bg-primary hover:bg-primary/90"
          >
            Valider la commande
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Récapitulatif final</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              {deliveryMethod && deliveryMethod !== "" && (
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>{deliveryMethod === "pickup" ? "GRATUIT" : formatPrice(totals.shipping)}</span>
                </div>
              )}

              {totals.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Remise</span>
                  <span>-{formatPrice(totals.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(totals.total)}</span>
              </div>
            </div>

            {/* Security Info */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Paiement 100% sécurisé</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Package className="w-4 h-4 text-blue-600" />
                <span>Livraison assurée</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Confirmation Step Component
interface ConfirmationStepProps {
  cart: any;
  totals: any;
  user: any;
  selectedShippingAddress: string;
  selectedBillingAddress: string;
  paymentMethod: string;
  orderNotes: string;
  deliveryMethod: string;
}

function ConfirmationStep({
  cart,
  totals,
  user,
  selectedShippingAddress,
  selectedBillingAddress,
  paymentMethod,
  orderNotes,
  deliveryMethod,
}: ConfirmationStepProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  // Fonction utilitaire pour formater les prix
  const formatPrice = (price: number): string => {
    return price.toLocaleString('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2 
    });
  };

  const orderNumber = `REX-${new Date().getFullYear()}-${Math.random()
    .toString(36)
    .substr(2, 9)
    .toUpperCase()}`;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Commande confirmée !
        </h2>
        <p className="text-muted-foreground">
          Merci pour votre commande. Vous recevrez un email de confirmation sous
          peu.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Détails de la commande</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="font-semibold">Numéro de commande</div>
              <div className="text-primary font-mono">{orderNumber}</div>
            </div>
            <div>
              <div className="font-semibold">Date de commande</div>
              <div>
                {new Date().toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            <div>
              <div className="font-semibold">Mode de paiement</div>
              <div>
                {paymentMethod === "credit_card" && "Carte bancaire"}
                {paymentMethod === "bank_transfer" && "Virement bancaire"}
                {paymentMethod === "check" && "Chèque"}
              </div>
            </div>
            <div>
              <div className="font-semibold">Livraison prévue</div>
              <div>
                {new Date(
                  Date.now() + 3 * 24 * 60 * 60 * 1000
                ).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Récapitulatif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              {deliveryMethod && deliveryMethod !== "" && (
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>{deliveryMethod === "pickup" ? "GRATUIT" : formatPrice(totals.shipping)}</span>
                </div>
              )}

              {totals.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Remise</span>
                  <span>-{formatPrice(totals.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(totals.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Articles commandés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cart.items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 py-4 border-b border-border last:border-b-0"
              >
                <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                  {imageErrors[item.product.id.toString()] || !item.product.imageUrl ? (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Logo variant="light" size="sm" showText={false} />
                    </div>
                  ) : (
                    <Image
                      src={item.product.files?.[0]?.url || item.product.imageUrl}
                      alt={item.product.name}
                      width={64}
                      height={64}
                      className="object-contain w-full h-full p-1"
                      onError={() => handleImageError(item.product.id.toString())}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{item.product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Quantité: {item.quantity} • {item.product?.price ? formatPrice(Number(item.product.price)) : (item.price ? formatPrice(Number(item.price)) : '')} / unité
                  </div>
                </div>
                <div className="font-semibold">
                  {item.totalPrice ? formatPrice(item.totalPrice) : ''}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center space-x-4 mt-8">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
        </Button>
        <Button asChild>
          <Link href="/commandes">Voir mes commandes</Link>
        </Button>
      </div>
    </div>
  );
}
