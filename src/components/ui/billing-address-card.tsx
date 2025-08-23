'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { BillingAddressSelector } from './billing-address-selector';
import { AddressFormData } from './address-form';
import { FileText } from 'lucide-react';

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
  type: 'shipping' | 'billing';
}

interface BillingAddressCardProps {
  addresses: Address[];
  selectedBillingAddressId: string;
  selectedShippingAddressId: string;
  onBillingAddressSelect: (addressId: string) => void;
  onAddressAdd: (addressData: AddressFormData) => Promise<void>;
  useSameAsShipping: boolean;
  onUseSameAsShippingChange: (value: boolean) => void;
  needsBillingAddress: boolean;
  onNeedsBillingAddressChange: (value: boolean) => void;
  deliveryMethod: string;
}

export function BillingAddressCard({
  addresses,
  selectedBillingAddressId,
  selectedShippingAddressId,
  onBillingAddressSelect,
  onAddressAdd,
  useSameAsShipping,
  onUseSameAsShippingChange,
  needsBillingAddress,
  onNeedsBillingAddressChange,
  deliveryMethod
}: BillingAddressCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Adresse de facturation</CardTitle>
        <p className="text-sm text-muted-foreground">Optionnel - Requis uniquement pour les factures</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Option pour ajouter une adresse de facturation */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="needs-billing"
            checked={needsBillingAddress}
            onCheckedChange={onNeedsBillingAddressChange}
          />
          <Label htmlFor="needs-billing" className="text-sm font-normal cursor-pointer flex items-center gap-2">
            <FileText className="w-4 h-4" />
            J'ai besoin d'une facture avec une adresse différente
          </Label>
        </div>

        {/* Sélecteur d'adresse de facturation (seulement si nécessaire) */}
        {needsBillingAddress && (
          <BillingAddressSelector
            addresses={addresses}
            selectedBillingAddressId={selectedBillingAddressId}
            selectedShippingAddressId={selectedShippingAddressId}
            onBillingAddressSelect={onBillingAddressSelect}
            onAddressAdd={onAddressAdd}
            useSameAsShipping={useSameAsShipping}
            onUseSameAsShippingChange={onUseSameAsShippingChange}
          />
        )}

        {/* Message informatif si pas d'adresse de facturation */}
        {!needsBillingAddress && (
          <div className="p-4 bg-muted/20 border border-border rounded-lg">
            <p className="text-sm text-muted-foreground">
              {deliveryMethod === 'pickup' 
                ? "Aucune adresse de facturation requise pour le retrait en boutique"
                : "L'adresse de livraison sera utilisée pour la facturation"
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
