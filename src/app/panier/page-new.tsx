/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth/nextauth-hooks";
import { useCart } from "@/lib/query/hooks";
import { useAddresses } from "@/lib/hooks/useAddresses";
import { ArrowRight, Check, CreditCard, ShoppingCart, Truck, AlertCircle } from "lucide-react";
import Link from "next/link";

// Import des composants séparés
import { CartStep } from "./components/CartStep";
import { ShippingStep } from "./components/ShippingStep";
import { PaymentStep } from "./components/PaymentStep";
import { ConfirmationStep } from "./components/ConfirmationStep";

// Import des types et utilitaires
import { CheckoutStep } from "./types";
import { calculateTotals } from "./utils";

export default function CartPage() {
  const { user, isAuthenticated } = useAuth();
  const { data: cart, isLoading, error } = useCart();
  const { data: addresses = [] } = useAddresses();

  // États principaux
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("cart");
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<string>("");
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [orderNotes, setOrderNotes] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<string>("delivery");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/auth/login";
    }
  }, [isAuthenticated]);

  // Set default addresses
  useEffect(() => {
    if (addresses.length > 0) {
      const defaultShipping = addresses.find(
        (addr) => addr.type === "shipping" && addr.isDefault
      );
      const defaultBilling = addresses.find(
        (addr) => addr.type === "billing" && addr.isDefault
      );

      if (defaultShipping) setSelectedShippingAddress(defaultShipping.id);
      if (defaultBilling) setSelectedBillingAddress(defaultBilling.id);
    }
  }, [addresses]);

  // Gestion du code promo
  const handleApplyPromoCode = () => {
    if (promoCode.toLowerCase() === "bienv202") {
      setPromoDiscount(20);
    } else if (promoCode.toLowerCase() === "fidele10") {
      setPromoDiscount(10);
    } else {
      setPromoDiscount(0);
    }
  };

  // Calcul des totaux
  const totals = calculateTotals(cart, deliveryMethod, promoDiscount);

  // Loading state
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

  // Error state
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

  // Empty cart state
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
            <Link href="/categories">
              <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90">
                Découvrir nos produits
              </button>
            </Link>
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
                    step === currentStep
                      ? "text-primary"
                      : "text-muted-foreground"
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

        {/* Steps Content */}
        {currentStep === "cart" && (
          <CartStep
            cart={cartData}
            totals={totals}
            onNext={() => setCurrentStep("shipping")}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            promoDiscount={promoDiscount}
            onApplyPromoCode={handleApplyPromoCode}
            deliveryMethod={deliveryMethod}
          />
        )}

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
