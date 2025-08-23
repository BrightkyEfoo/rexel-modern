'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AddressSelector } from './address-selector';
import { AddressFormData } from './address-form';
import { Store, Truck } from 'lucide-react';

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
  onDeliveryMethodChange
}: ShippingAddressCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Options de livraison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Choix du mode de livraison */}
        <RadioGroup
          value={deliveryMethod}
          onValueChange={onDeliveryMethodChange}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="delivery" id="delivery" />
            <div className="flex items-center space-x-2 flex-1">
              <Truck className="w-5 h-5 text-primary" />
              <Label htmlFor="delivery" className="font-medium cursor-pointer">
                Livraison à domicile
              </Label>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="pickup" id="pickup" />
            <div className="flex items-center space-x-2 flex-1">
              <Store className="w-5 h-5 text-primary" />
              <div>
                <Label htmlFor="pickup" className="font-medium cursor-pointer">
                  Retrait en boutique
                </Label>
                <p className="text-sm text-muted-foreground">Gratuit - Prêt en 2h</p>
              </div>
            </div>
          </div>
        </RadioGroup>

        {/* Sélecteur d'adresse (seulement si livraison à domicile) */}
        {deliveryMethod === 'delivery' && (
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Adresse de livraison</h3>
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

        {/* Message informatif pour le retrait en boutique */}
        {deliveryMethod === 'pickup' && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 text-primary">
              <Store className="w-4 h-4" />
              <span className="font-medium">Retrait en boutique sélectionné</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Votre commande sera préparée et vous recevrez un SMS dès qu'elle sera prête à être récupérée.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
