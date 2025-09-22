"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/ui/logo";
import { ArrowLeft, Check, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import Link from "next/link";
import { ConfirmationStepProps } from "../types";
import { formatPrice } from "../utils";
import { useCreateOrder, type Order } from "@/lib/hooks/useCreateOrder";

export function ConfirmationStep({
  cart,
  totals,
  user,
  selectedShippingAddress,
  selectedBillingAddress,
  selectedPickupPoint,
  paymentMethod,
  orderNotes,
  deliveryMethod,
  promoCode,
}: ConfirmationStepProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // React Query hook
  const createOrderMutation = useCreateOrder();

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  const createOrder = () => {
    if (createOrderMutation.isPending || createOrderMutation.isSuccess) return;

    createOrderMutation.mutate({
      shippingAddressId:
        deliveryMethod === "delivery" ? String(selectedShippingAddress) : null,
      pickupPointId: deliveryMethod === "pickup" ? selectedPickupPoint : null,
      billingAddressId: selectedBillingAddress,
      deliveryMethod: deliveryMethod as "delivery" | "pickup",
      paymentMethod: paymentMethod as "credit_card" | "bank_transfer" | "check",
      promoCode: promoCode || undefined,
      notes: orderNotes,
      totals: {
        subtotal: totals.subtotal,
        shipping: totals.shipping || 0,
        discount: totals.discount || 0,
        total: totals.total,
      },
    });
  };

  // Créer la commande automatiquement au montage du composant
  useEffect(() => {
    createOrder();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // État de chargement
  if (createOrderMutation.isPending) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Création de votre commande...
          </h2>
          <p className="text-muted-foreground">
            Veuillez patienter pendant que nous traitons votre commande.
          </p>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (createOrderMutation.isError) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Erreur lors de la commande
          </h2>
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {createOrderMutation.error?.message || "Une erreur est survenue"}
            </AlertDescription>
          </Alert>
          <Button
            onClick={createOrder}
            disabled={createOrderMutation.isPending}
          >
            {createOrderMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Création en cours...
              </>
            ) : (
              "Réessayer"
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Si la commande est créée avec succès, on sera redirigé automatiquement
  // Afficher un message de redirection en attendant
  if (createOrderMutation.isSuccess) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Commande créée avec succès !
          </h2>
          <p className="text-muted-foreground">
            Redirection vers votre commande en cours...
          </p>
        </div>
      </div>
    );
  }

  // Ne devrait jamais arriver, mais au cas où
  return null;
}
