"use client";

import { MapPin, Clock, Phone, Mail, Navigation, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PickupPoint } from "@/lib/types/pickup-points";

interface PickupPointCardProps {
  point: PickupPoint;
  showManagerPhoto?: boolean;
  className?: string;
}

export function PickupPointCard({ 
  point, 
  showManagerPhoto = true,
  className = "" 
}: PickupPointCardProps) {
  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, '_self');
  };

  const handleGetDirections = (address: string, latitude?: number, longitude?: number) => {
    if (latitude && longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
      window.open(url, '_blank');
    }
  };

  const getManagerInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{point.name}</CardTitle>
            <div className="flex items-center space-x-2 text-muted-foreground mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{point.address}</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground mb-2">
              <span className="text-sm font-medium">{point.city}</span>
              {point.postalCode && (
                <span className="text-sm">({point.postalCode})</span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{point.hours}</span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant={point.isActive ? "default" : "secondary"} className="text-xs">
              {point.isActive ? "Ouvert" : "Fermé"}
            </Badge>
            {point.rating > 0 && (
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium">{Number(point.rating || 0).toFixed(1)}</span>
                <span className="text-yellow-400">★</span>
                <span className="text-xs text-gray-500">({point.reviewsCount || 0})</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {point.description && (
            <p className="text-sm text-gray-600">{point.description}</p>
          )}
          
          {point.services && point.services.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Services disponibles</h4>
              <div className="flex flex-wrap gap-2">
                {point.services.map((service, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Informations du responsable */}
          {point.managerName && showManagerPhoto && (
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-semibold mb-2 text-sm">Responsable local</h4>
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={point.managerPhoto} 
                    alt={point.managerName}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {getManagerInitials(point.managerName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm">{point.managerName}</p>
                  {point.managerPhone && (
                    <p className="text-xs text-gray-500">{point.managerPhone}</p>
                  )}
                </div>
                {point.managerPhone && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCall(point.managerPhone!)}
                    className="text-xs px-2 py-1 h-auto"
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Appeler
                  </Button>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4" />
                <span>{point.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4" />
                <span className="truncate max-w-40">{point.email}</span>
              </div>
              {point.managerName && !showManagerPhoto && (
                <div className="text-xs text-gray-500">
                  Responsable: {point.managerName}
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCall(point.phone)}
              >
                <Phone className="w-4 h-4 mr-2" />
                Appeler
              </Button>
              <Button 
                size="sm"
                onClick={() => handleGetDirections(point.address, point.latitude, point.longitude)}
              >
                <Navigation className="w-4 h-4 mr-2" />
                Itinéraire
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
