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
import { useAuthUser } from "@/lib/auth/auth-hooks";
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
import { useEffect, useState } from "react";

type CheckoutStep = "cart" | "shipping" | "payment" | "confirmation";

export default function CartPage() {
  const { user, isAuthenticated } = useAuthUser();
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
    if (!cart?.data)
      return { subtotal: 0, shipping: 0, tax: 0, discount: 0, total: 0 };

    const subtotal = cart.data.subtotal || 0;
    const shipping = cart.data.shippingAmount || 0;
    const tax = cart.data.taxAmount || 0;
    const discount = promoDiscount;
    const total = Math.max(0, subtotal + shipping + tax - discount);

    return { subtotal, shipping, tax, discount, total };
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
            <div className="h-8 bg-gray-200 rounded w-64" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded" />
                ))}
              </div>
              <div className="h-96 bg-gray-200 rounded" />
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
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Votre panier est vide
            </h2>
            <p className="text-gray-600 mb-8">
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
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-[#162e77]">
            Accueil
          </Link>
          <span>/</span>
          <span className="text-gray-900">Panier</span>
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
                      ? "border-[#162e77] bg-[#162e77] text-white"
                      : index <
                        ["cart", "shipping", "payment", "confirmation"].indexOf(
                          currentStep
                        )
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    step === currentStep ? "text-[#162e77]" : "text-gray-500"
                  }`}
                >
                  {label}
                </span>
                {index < 3 && (
                  <ArrowRight className="w-4 h-4 text-gray-400 mx-4" />
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
              <h1 className="text-3xl font-bold text-gray-900">
                Mon panier ({cartData.totalItems} articles)
              </h1>

              <div className="space-y-4">
                {cartData.items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-6">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0">
                          <Image
                            src={item.product.imageUrl || "/placeholder.png"}
                            alt={item.product.name}
                            width={96}
                            height={96}
                            className="object-contain w-full h-full p-2"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <Link
                                href={`/produit/${item.productId}`}
                                className="font-semibold text-gray-900 hover:text-[#162e77]"
                              >
                                {item.product.name}
                              </Link>
                              <div className="text-sm text-gray-600 mt-1">
                                <Badge variant="secondary">
                                  {item.product.brand?.name}
                                </Badge>
                                <span className="ml-2">
                                  SKU: {item.product.sku}
                                </span>
                              </div>
                              {item.variant && (
                                <div className="text-sm text-gray-600 mt-1">
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
                                <span className="text-sm text-gray-600">
                                  {item.product.availability === "in_stock"
                                    ? "En stock"
                                    : "Rupture de stock"}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-[#162e77]">
                                {item.totalPrice.toFixed(2)} €
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.price.toFixed(2)} € / unité
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
                                className="text-red-600 hover:text-red-700"
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
                      <span>{totals.subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Livraison</span>
                      <span>{totals.shipping.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TVA</span>
                      <span>{totals.tax.toFixed(2)} €</span>
                    </div>
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Remise</span>
                        <span>-{totals.discount.toFixed(2)} €</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{totals.total.toFixed(2)} €</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    className="w-full bg-[#162e77] hover:bg-[#1e40af] text-white font-semibold"
                    onClick={() => setCurrentStep("shipping")}
                  >
                    Passer la commande
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Paiement sécurisé</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span>Livraison rapide</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Package className="w-4 h-4 text-purple-600" />
                      <span>Retour gratuit</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
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
                        <div className="w-12 h-12 bg-gray-100 rounded" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {product.name}
                          </div>
                          <div className="text-sm text-[#162e77] font-semibold">
                            {Number(product.price).toFixed(2)} €
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
  onNext,
  onBack,
  totals,
}: ShippingStepProps) {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">
          Informations de livraison
        </h2>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle>Adresse de livraison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user?.addresses
              ?.filter((addr: any) => addr.type === "shipping")
              .map((address: any) => (
                <div
                  key={address.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedShippingAddress === address.id
                      ? "border-[#162e77] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedShippingAddress(address.id)}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={selectedShippingAddress === address.id}
                      onChange={() => setSelectedShippingAddress(address.id)}
                      className="text-[#162e77]"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{address.name}</div>
                      {address.company && (
                        <div className="text-sm text-gray-600">
                          {address.company}
                        </div>
                      )}
                      <div className="text-sm text-gray-600">
                        {address.street}
                        <br />
                        {address.postalCode} {address.city}
                        <br />
                        {address.country}
                      </div>
                      {address.isDefault && (
                        <Badge variant="secondary" className="mt-2">
                          Par défaut
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une nouvelle adresse
            </Button>
          </CardContent>
        </Card>

        {/* Billing Address */}
        <Card>
          <CardHeader>
            <CardTitle>Adresse de facturation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg">
              <input
                type="checkbox"
                id="same-address"
                checked={selectedBillingAddress === selectedShippingAddress}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedBillingAddress(selectedShippingAddress);
                  } else {
                    setSelectedBillingAddress("");
                  }
                }}
                className="text-[#162e77]"
              />
              <label htmlFor="same-address" className="text-sm">
                Utiliser la même adresse que la livraison
              </label>
            </div>

            {selectedBillingAddress !== selectedShippingAddress && (
              <>
                {user?.addresses
                  ?.filter((addr: any) => addr.type === "billing")
                  .map((address: any) => (
                    <div
                      key={address.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedBillingAddress === address.id
                          ? "border-[#162e77] bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedBillingAddress(address.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          checked={selectedBillingAddress === address.id}
                          onChange={() => setSelectedBillingAddress(address.id)}
                          className="text-[#162e77]"
                        />
                        <div className="flex-1">
                          <div className="font-semibold">{address.name}</div>
                          {address.company && (
                            <div className="text-sm text-gray-600">
                              {address.company}
                            </div>
                          )}
                          <div className="text-sm text-gray-600">
                            {address.street}
                            <br />
                            {address.postalCode} {address.city}
                            <br />
                            {address.country}
                          </div>
                          {address.isDefault && (
                            <Badge variant="secondary" className="mt-2">
                              Par défaut
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </CardContent>
        </Card>

        {/* Shipping Options */}
        <Card>
          <CardHeader>
            <CardTitle>Options de livraison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="shipping"
                    defaultChecked
                    className="text-[#162e77]"
                  />
                  <div>
                    <div className="font-semibold">Livraison standard</div>
                    <div className="text-sm text-gray-600">
                      3-5 jours ouvrés
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">8,50 €</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="shipping"
                    className="text-[#162e77]"
                  />
                  <div>
                    <div className="font-semibold">Livraison express</div>
                    <div className="text-sm text-gray-600">24-48h</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">15,90 €</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="shipping"
                    className="text-[#162e77]"
                  />
                  <div>
                    <div className="font-semibold">Retrait en agence</div>
                    <div className="text-sm text-gray-600">
                      Disponible sous 2h
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">Gratuit</div>
                </div>
              </div>
            </div>
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
            className="bg-[#162e77] hover:bg-[#1e40af]"
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
                <span>{totals.subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span>{totals.shipping.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>TVA</span>
                <span>{totals.tax.toFixed(2)} €</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Remise</span>
                  <span>-{totals.discount.toFixed(2)} €</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{totals.total.toFixed(2)} €</span>
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
  onNext: () => void;
  onBack: () => void;
  totals: any;
}

function PaymentStep({
  paymentMethod,
  setPaymentMethod,
  orderNotes,
  setOrderNotes,
  onNext,
  onBack,
  totals,
}: PaymentStepProps) {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Paiement</h2>

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
                    ? "border-[#162e77] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setPaymentMethod("credit_card")}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={paymentMethod === "credit_card"}
                    onChange={() => setPaymentMethod("credit_card")}
                    className="text-[#162e77]"
                  />
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-semibold">Carte bancaire</div>
                    <div className="text-sm text-gray-600">
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
                    ? "border-[#162e77] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setPaymentMethod("check")}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={paymentMethod === "check"}
                    onChange={() => setPaymentMethod("check")}
                    className="text-[#162e77]"
                  />
                  <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Chèque</div>
                    <div className="text-sm text-gray-600">
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
              className="w-full p-3 border border-gray-200 rounded-lg resize-none h-24"
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
                className="mt-1 text-[#162e77]"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                J'accepte les{" "}
                <Link
                  href="/conditions-generales"
                  className="text-[#162e77] hover:underline"
                >
                  conditions générales de vente
                </Link>{" "}
                et la{" "}
                <Link
                  href="/politique-confidentialite"
                  className="text-[#162e77] hover:underline"
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
            className="bg-[#162e77] hover:bg-[#1e40af]"
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
                <span>{totals.subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span>{totals.shipping.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>TVA</span>
                <span>{totals.tax.toFixed(2)} €</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Remise</span>
                  <span>-{totals.discount.toFixed(2)} €</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{totals.total.toFixed(2)} €</span>
              </div>
            </div>

            {/* Security Info */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Paiement 100% sécurisé</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
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
}

function ConfirmationStep({
  cart,
  totals,
  user,
  selectedShippingAddress,
  selectedBillingAddress,
  paymentMethod,
  orderNotes,
}: ConfirmationStepProps) {
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
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Commande confirmée !
        </h2>
        <p className="text-gray-600">
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
              <div className="text-[#162e77] font-mono">{orderNumber}</div>
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
                <span>{totals.subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span>{totals.shipping.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>TVA</span>
                <span>{totals.tax.toFixed(2)} €</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Remise</span>
                  <span>-{totals.discount.toFixed(2)} €</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{totals.total.toFixed(2)} €</span>
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
                className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-lg">
                  <Image
                    src={item.product.imageUrl || "/placeholder.png"}
                    alt={item.product.name}
                    width={64}
                    height={64}
                    className="object-contain w-full h-full p-1"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{item.product.name}</div>
                  <div className="text-sm text-gray-600">
                    Quantité: {item.quantity} • {item.price.toFixed(2)} € /
                    unité
                  </div>
                </div>
                <div className="font-semibold">
                  {item.totalPrice.toFixed(2)} €
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
