'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

const addressSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  company: z.string().optional(),
  street: z.string().min(1, 'L\'adresse est requise'),
  city: z.string().min(1, 'La ville est requise'),
  postalCode: z.string().min(1, 'Le code postal est requis'),
  country: z.string().min(1, 'Le pays est requis'),
  phone: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
  type: 'shipping' | 'billing';
  title?: string;
  initialData?: Partial<AddressFormData>;
  isSubmitting?: boolean;
}

export function AddressForm({
  onSubmit,
  onCancel,
  type,
  title,
  initialData,
  isSubmitting = false
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: '',
      company: '',
      street: '',
      city: '',
      postalCode: '',
      country: 'France',
      phone: '',
      isDefault: false,
      ...initialData
    }
  });

  const handleFormSubmit = async (data: AddressFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'adresse:', error);
    }
  };

  const displayTitle = title || `Nouvelle adresse de ${type === 'shipping' ? 'livraison' : 'facturation'}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{displayTitle}</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onCancel}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Nom complet */}
          <div>
            <Label htmlFor="name">Nom complet *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Jean Dupont"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Entreprise */}
          <div>
            <Label htmlFor="company">Entreprise (optionnel)</Label>
            <Input
              id="company"
              {...register('company')}
              placeholder="Mon Entreprise SARL"
            />
          </div>

          {/* Adresse */}
          <div>
            <Label htmlFor="street">Adresse *</Label>
            <Input
              id="street"
              {...register('street')}
              placeholder="123 Rue de la Paix"
              className={errors.street ? 'border-destructive' : ''}
            />
            {errors.street && (
              <p className="text-sm text-destructive mt-1">{errors.street.message}</p>
            )}
          </div>

          {/* Ville et Code postal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postalCode">Code postal *</Label>
              <Input
                id="postalCode"
                {...register('postalCode')}
                placeholder="75001"
                className={errors.postalCode ? 'border-destructive' : ''}
              />
              {errors.postalCode && (
                <p className="text-sm text-destructive mt-1">{errors.postalCode.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                {...register('city')}
                placeholder="Paris"
                className={errors.city ? 'border-destructive' : ''}
              />
              {errors.city && (
                <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
              )}
            </div>
          </div>

          {/* Pays */}
          <div>
            <Label htmlFor="country">Pays *</Label>
            <Input
              id="country"
              {...register('country')}
              placeholder="France"
              className={errors.country ? 'border-destructive' : ''}
            />
            {errors.country && (
              <p className="text-sm text-destructive mt-1">{errors.country.message}</p>
            )}
          </div>

          {/* Téléphone */}
          <div>
            <Label htmlFor="phone">Téléphone (optionnel)</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          {/* Adresse par défaut */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDefault"
              {...register('isDefault')}
              className="rounded border-border text-primary focus:ring-primary"
            />
            <Label htmlFor="isDefault" className="text-sm font-normal">
              Définir comme adresse par défaut
            </Label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder l\'adresse'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
