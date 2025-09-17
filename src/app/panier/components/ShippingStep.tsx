"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ShippingAddressCard } from "@/components/ui/shipping-address-card";
import { BillingAddressCard } from "@/components/ui/billing-address-card";
import { PickupPointCard } from "@/components/ui/pickup-point-card";
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
  selectedPickupPoint,
  setSelectedPickupPoint,
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

        {/* Delivery Method Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Mode de livraison</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={deliveryMethod === "delivery" ? "default" : "outline"}
              onClick={() => {
                setDeliveryMethod("delivery");
                setSelectedPickupPoint("");
              }}
              className="h-16"
            >
              <div className="text-center">
                <div className="font-semibold">Livraison à domicile</div>
                <div className="text-sm text-muted-foreground">
                  {formatPrice(totals.shipping)}
                </div>
              </div>
            </Button>
            <Button
              variant={deliveryMethod === "pickup" ? "default" : "outline"}
              onClick={() => {
                setDeliveryMethod("pickup");
                setSelectedShippingAddress("");
              }}
              className="h-16"
            >
              <div className="text-center">
                <div className="font-semibold">Retrait en boutique</div>
                <div className="text-sm text-green-600 font-semibold">GRATUIT</div>
              </div>
            </Button>
          </div>
        </div>


        {/* Shipping Address - Only show for delivery */}
        {deliveryMethod === "delivery" && (
          <>
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
          </>
        )}

        {/* Pickup Points - Only show for pickup */}
        {deliveryMethod === "pickup" && (
          <PickupPointCard
            selectedPickupPointId={selectedPickupPoint}
            onPickupPointSelect={setSelectedPickupPoint}
            isLoading={createAddressMutation.isPending}
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
              (deliveryMethod === "pickup" && !selectedPickupPoint) ||
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
