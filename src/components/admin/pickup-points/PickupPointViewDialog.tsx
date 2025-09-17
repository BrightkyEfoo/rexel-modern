"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star, 
  Users, 
  User, 
  ExternalLink,
  Navigation
} from "lucide-react";
import type { PickupPoint } from "@/lib/types/pickup-points";

interface PickupPointViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pickupPoint?: PickupPoint | null;
}

export function PickupPointViewDialog({
  open,
  onOpenChange,
  pickupPoint,
}: PickupPointViewDialogProps) {
  if (!pickupPoint) return null;

  const handleOpenMaps = () => {
    if (pickupPoint.latitude && pickupPoint.longitude) {
      const url = `https://www.google.com/maps?q=${pickupPoint.latitude},${pickupPoint.longitude}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pickupPoint.address)}`;
      window.open(url, '_blank');
    }
  };

  const handleCall = () => {
    window.open(`tel:${pickupPoint.phone}`, '_self');
  };

  const handleEmail = () => {
    window.open(`mailto:${pickupPoint.email}`, '_self');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span>{pickupPoint.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Statut et badges */}
          <div className="flex items-center space-x-2">
            <Badge variant={pickupPoint.isActive ? "default" : "secondary"}>
              {pickupPoint.isActive ? "Actif" : "Inactif"}
            </Badge>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-medium">{pickupPoint.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({pickupPoint.reviewsCount} avis)</span>
            </div>
          </div>

          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Adresse et contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Informations de contact</h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{pickupPoint.address}</p>
                    <p className="text-sm text-gray-500">
                      {pickupPoint.city}
                      {pickupPoint.postalCode && `, ${pickupPoint.postalCode}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{pickupPoint.phone}</p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={handleCall}
                      className="h-auto p-0 text-primary"
                    >
                      Appeler
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{pickupPoint.email}</p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={handleEmail}
                      className="h-auto p-0 text-primary"
                    >
                      Envoyer un email
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <p className="font-medium text-gray-900">{pickupPoint.hours}</p>
                </div>
              </div>
            </div>

            {/* Responsable et services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Services et responsable</h3>
              
              {/* Services */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Services disponibles</p>
                <div className="flex flex-wrap gap-2">
                  {pickupPoint.services.map((service, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Responsable */}
              {pickupPoint.managerName && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Responsable</p>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{pickupPoint.managerName}</span>
                  </div>
                  {pickupPoint.managerPhone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{pickupPoint.managerPhone}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {pickupPoint.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{pickupPoint.description}</p>
            </div>
          )}

          {/* Coordonnées GPS */}
          {(pickupPoint.latitude && pickupPoint.longitude) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Coordonnées GPS</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Lat: {pickupPoint.latitude.toFixed(6)}, Lng: {pickupPoint.longitude.toFixed(6)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenMaps}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Voir sur la carte
                </Button>
              </div>
            </div>
          )}

          {/* Informations système */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Informations système</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Slug</p>
                <p className="font-medium">{pickupPoint.slug}</p>
              </div>
              <div>
                <p className="text-gray-500">Ordre d'affichage</p>
                <p className="font-medium">{pickupPoint.sortOrder}</p>
              </div>
              <div>
                <p className="text-gray-500">Créé le</p>
                <p className="font-medium">
                  {new Date(pickupPoint.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Modifié le</p>
                <p className="font-medium">
                  {new Date(pickupPoint.updatedAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 border-t pt-4">
            <Button
              variant="outline"
              onClick={handleOpenMaps}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Itinéraire
            </Button>
            <Button
              variant="outline"
              onClick={handleCall}
            >
              <Phone className="w-4 h-4 mr-2" />
              Appeler
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
