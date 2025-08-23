'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { AddressForm, AddressFormData } from './address-form';

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

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddressId: string;
  onAddressSelect: (addressId: string) => void;
  onAddressAdd: (addressData: AddressFormData) => Promise<void>;
  type: 'shipping' | 'billing';
  title: string;
  isAddingAddress?: boolean;
}

export function AddressSelector({
  addresses,
  selectedAddressId,
  onAddressSelect,
  onAddressAdd,
  type,
  title,
  isAddingAddress = false
}: AddressSelectorProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddAddress = async (addressData: AddressFormData) => {
    setIsSubmitting(true);
    try {
      await onAddressAdd(addressData);
      setShowAddForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'adresse:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAddresses = addresses.filter(addr => addr.type === type);

  if (showAddForm) {
    return (
      <AddressForm
        onSubmit={handleAddAddress}
        onCancel={() => setShowAddForm(false)}
        type={type}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Liste des adresses existantes */}
        {filteredAddresses.map((address) => (
          <div
            key={address.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedAddressId === address.id
                ? "border-primary bg-primary/10"
                : "border-border hover:border-border/80"
            }`}
            onClick={() => onAddressSelect(address.id)}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                checked={selectedAddressId === address.id}
                onChange={() => onAddressSelect(address.id)}
                className="text-primary"
                readOnly
              />
              <div className="flex-1">
                <div className="font-semibold text-foreground">{address.name}</div>
                {address.company && (
                  <div className="text-sm text-muted-foreground">
                    {address.company}
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  {address.street}
                  <br />
                  {address.postalCode} {address.city}
                  <br />
                  {address.country}
                </div>
                {address.phone && (
                  <div className="text-sm text-muted-foreground mt-1">
                    📞 {address.phone}
                  </div>
                )}
                {address.isDefault && (
                  <Badge variant="secondary" className="mt-2">
                    Par défaut
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Bouton pour ajouter une nouvelle adresse */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setShowAddForm(true)}
          disabled={isAddingAddress}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une nouvelle adresse
        </Button>

        {/* Message si pas d'adresses */}
        {filteredAddresses.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-4">Aucune adresse de {type === 'shipping' ? 'livraison' : 'facturation'} enregistrée</p>
            <p className="text-sm">Cliquez sur "Ajouter une nouvelle adresse" pour commencer</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
