'use client';

import React from 'react';
import { AddressSelector } from './address-selector';
import { AddressFormData } from './address-form';
import { Label } from './label';

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

interface BillingAddressSelectorProps {
  addresses: Address[];
  selectedBillingAddressId: string;
  selectedShippingAddressId: string;
  onBillingAddressSelect: (addressId: string) => void;
  onAddressAdd: (addressData: AddressFormData) => Promise<void>;
  useSameAsShipping: boolean;
  onUseSameAsShippingChange: (value: boolean) => void;
}

export function BillingAddressSelector({
  addresses,
  selectedBillingAddressId,
  selectedShippingAddressId,
  onBillingAddressSelect,
  onAddressAdd,
  useSameAsShipping,
  onUseSameAsShippingChange
}: BillingAddressSelectorProps) {
  
  const handleSameAddressChange = (checked: boolean) => {
    onUseSameAsShippingChange(checked);
    if (checked) {
      onBillingAddressSelect(selectedShippingAddressId);
    } else {
      onBillingAddressSelect('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Case à cocher pour utiliser la même adresse */}
      <div className="flex items-center space-x-2 p-4 border border-border rounded-lg bg-muted/20">
        <input
          type="checkbox"
          id="same-address"
          checked={useSameAsShipping}
          onChange={(e) => handleSameAddressChange(e.target.checked)}
          className="rounded border-border text-primary focus:ring-primary"
        />
        <Label htmlFor="same-address" className="text-sm font-normal cursor-pointer">
          Utiliser la même adresse que la livraison
        </Label>
      </div>

      {/* Sélecteur d'adresses de facturation (seulement si pas la même adresse) */}
      {!useSameAsShipping && (
        <AddressSelector
          addresses={addresses}
          selectedAddressId={selectedBillingAddressId}
          onAddressSelect={onBillingAddressSelect}
          onAddressAdd={onAddressAdd}
          type="billing"
          title="Adresse de facturation"
        />
      )}

      {/* Message informatif si même adresse */}
      {useSameAsShipping && selectedShippingAddressId && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-primary">
            ✓ L'adresse de facturation sera la même que l'adresse de livraison
          </p>
        </div>
      )}

      {/* Message d'alerte si même adresse mais pas d'adresse de livraison sélectionnée */}
      {useSameAsShipping && !selectedShippingAddressId && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-700">
            ⚠️ Veuillez d'abord sélectionner une adresse de livraison
          </p>
        </div>
      )}
    </div>
  );
}
