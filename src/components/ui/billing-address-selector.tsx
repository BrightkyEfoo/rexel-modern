'use client';

import React from 'react';
import { AddressSelector } from './address-selector';
import { AddressFormData } from './address-form';
import { Label } from './label';
import { Checkbox } from './checkbox';
import { Check, AlertTriangle } from 'lucide-react';

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
      <div className="flex items-center space-x-2">
        <Checkbox
          id="same-address"
          checked={useSameAsShipping}
          onCheckedChange={handleSameAddressChange}
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
        />
      )}

      {/* Message informatif si même adresse */}
      {useSameAsShipping && selectedShippingAddressId && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-primary flex items-center gap-2">
            <Check className="w-4 h-4" />
            L'adresse de facturation sera la même que l'adresse de livraison
          </p>
        </div>
      )}

      {/* Message d'alerte si même adresse mais pas d'adresse de livraison sélectionnée */}
      {useSameAsShipping && !selectedShippingAddressId && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Veuillez d'abord sélectionner une adresse de livraison
          </p>
        </div>
      )}
    </div>
  );
}
