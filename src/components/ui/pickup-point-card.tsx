"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Phone, Mail, Plus } from "lucide-react";
import { usePickupPoints } from "@/lib/hooks/usePickupPoints";
import type { PickupPoint } from "@/lib/types/pickup-points";

interface PickupPointCardProps {
  selectedPickupPointId?: string;
  onPickupPointSelect: (pickupPointId: string) => void;
  isLoading?: boolean;
}

export function PickupPointCard({
  selectedPickupPointId,
  onPickupPointSelect,
  isLoading = false,
}: PickupPointCardProps) {
  const { data: pickupPointsData, isLoading: pickupPointsLoading } = usePickupPoints();
  const pickupPoints = pickupPointsData?.data || [];

  if (pickupPointsLoading || isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Points de relais disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <p>Chargement des points de relais...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pickupPoints.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Points de relais disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              Aucun point de relais disponible pour le moment.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Points de relais disponibles
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-[500px] overflow-y-scroll">
        <div className="space-y-4">
          {pickupPoints.map((pickupPoint) => (
            <div
              key={pickupPoint.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedPickupPointId === pickupPoint.id.toString()
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => onPickupPointSelect(pickupPoint.id.toString())}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{pickupPoint.name}</h3>
                    {pickupPoint.isActive && (
                      <Badge variant="secondary" className="text-xs">
                        Actif
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>{pickupPoint.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{pickupPoint.city}</span>
                      {pickupPoint.postalCode && (
                        <span>{pickupPoint.postalCode}</span>
                      )}
                    </div>
                    
                    {pickupPoint.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        <span>{pickupPoint.phone}</span>
                      </div>
                    )}
                    
                    {pickupPoint.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        <span>{pickupPoint.email}</span>
                      </div>
                    )}
                    
                    {pickupPoint.hours && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>{pickupPoint.hours}</span>
                      </div>
                    )}
                  </div>
                  
                  {pickupPoint.services && pickupPoint.services.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {pickupPoint.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="ml-4">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      selectedPickupPointId === pickupPoint.id.toString()
                        ? "border-primary bg-primary"
                        : "border-border"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
