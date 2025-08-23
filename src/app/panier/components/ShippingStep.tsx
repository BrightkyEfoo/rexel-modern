"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ShippingAddressCard } from "@/components/ui/shipping-address-card";
import { BillingAddressCard } from "@/components/ui/billing-address-card";
import { AddressFormData } from "@/components/ui/address-form";
import { useAddresses, useCreateAddress } from "@/lib/hooks/useAddresses";
import { ShippingStepProps } from "../types";
import { formatPrice } from "../utils";

export function ShippingStep({
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
  const [needsBillingAddress, setNeedsBillingAddress] = useState(false);

  // Hooks pour la gestion des adresses
  const { data: addresses = [], isLoading: addressesLoading } = useAddresses();
  const createAddressMutation = useCreateAddress();

  // Gérer l'ajout d'une nouvelle adresse
  const handleAddAddress = async (
    addressData: AddressFormData,
    type: "shipping" | "billing"
  ) => {
    try {
      const newAddress = await createAddressMutation.mutateAsync({
        ...addressData,
        type,
      });

      // Sélectionner automatiquement la nouvelle adresse
      if (type === "shipping") {
        setSelectedShippingAddress(newAddress.id);
      } else {
        setSelectedBillingAddress(newAddress.id);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'adresse:", error);
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
          <ShippingAddressCard
            addresses={addresses}
            selectedAddressId={selectedShippingAddress}
            onAddressSelect={setSelectedShippingAddress}
            onAddressAdd={(data) => handleAddAddress(data, "shipping")}
            isAddingAddress={createAddressMutation.isPending}
            deliveryMethod={deliveryMethod}
            onDeliveryMethodChange={setDeliveryMethod}
          />
        )}

        {/* Billing Address */}
        <BillingAddressCard
          addresses={addresses}
          selectedBillingAddressId={selectedBillingAddress}
          selectedShippingAddressId={selectedShippingAddress}
          onBillingAddressSelect={setSelectedBillingAddress}
          onAddressAdd={(data) => handleAddAddress(data, "billing")}
          useSameAsShipping={useSameAsShipping}
          onUseSameAsShippingChange={setUseSameAsShipping}
          needsBillingAddress={needsBillingAddress}
          onNeedsBillingAddressChange={setNeedsBillingAddress}
          deliveryMethod={deliveryMethod}
        />

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au panier
          </Button>
          <Button
            onClick={onNext}
            disabled={
              (deliveryMethod === "delivery" && !selectedShippingAddress) ||
              (needsBillingAddress && !useSameAsShipping && !selectedBillingAddress)
            }
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
              {deliveryMethod && (
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>
                    {deliveryMethod === "pickup"
                      ? "GRATUIT"
                      : formatPrice(totals.shipping)}
                  </span>
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
