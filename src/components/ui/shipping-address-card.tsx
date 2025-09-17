"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AddressSelector } from "./address-selector";
import { AddressFormData } from "./address-form";
import { Store, Truck } from "lucide-react";

interface Address {
  id: string;
  name: string;
  company?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
  type: "shipping" | "billing";
}

interface ShippingAddressCardProps {
  addresses: Address[];
  selectedAddressId: string;
  onAddressSelect: (addressId: string) => void;
  onAddressAdd: (addressData: AddressFormData) => Promise<void>;
  isAddingAddress?: boolean;
  deliveryMethod: string;
  onDeliveryMethodChange: (method: string) => void;
}

export function ShippingAddressCard({
  addresses,
  selectedAddressId,
  onAddressSelect,
  onAddressAdd,
  isAddingAddress = false,
  deliveryMethod,
  onDeliveryMethodChange,
}: ShippingAddressCardProps) {
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        {/* Sélecteur d'adresse (seulement si livraison à domicile) */}
        {deliveryMethod === "delivery" && (
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">
              Adresse de livraison
            </h3>
            <AddressSelector
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onAddressSelect={onAddressSelect}
              onAddressAdd={onAddressAdd}
              type="shipping"
              isAddingAddress={isAddingAddress}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
