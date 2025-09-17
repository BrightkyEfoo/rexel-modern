"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  ArrowLeft,
  User,
  Building2,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useCountryPickupPointsWithManager } from "@/lib/hooks/usePickupPoints";
import { PickupPointCard } from "@/components/pickup-points/PickupPointCard";

// Mapping des codes pays vers les noms complets
const countryNames: Record<string, string> = {
  CM: "Cameroun",
  CF: "Centrafrique",
  TD: "Tchad",
  CG: "République du Congo",
  GQ: "Guinée équatoriale",
  GA: "Gabon",
};

// Vérifier si le code pays est valide
const isValidCountryCode = (code: string): boolean => {
  return Object.keys(countryNames).includes(code.toUpperCase());
};

export default function CountryPickupPointsPage() {
  const params = useParams();
  const countryCode = params?.countrycode as string;

  // Vérifier si le code pays est valide
  if (!countryCode || !isValidCountryCode(countryCode)) {
    notFound();
  }

  const upperCountryCode = countryCode.toUpperCase();
  const countryName = countryNames[upperCountryCode];

  const {
    data: countryData,
    isLoading,
    error,
  } = useCountryPickupPointsWithManager(upperCountryCode);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !countryData?.data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Erreur de chargement
            </h1>
            <p className="text-gray-600 mb-6">
              Impossible de charger les informations pour {countryName}.
            </p>
            <Button asChild>
              <Link href="/points-relais">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux points de relais
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { manager, pickupPoints } = countryData.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header avec retour */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-12 h-8 rounded-sm overflow-hidden border border-gray-200">
              <Image
                alt={countryName}
                src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${upperCountryCode}.svg`}
                fill
                className="object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{countryName}</h1>
          </div>
        </div>

        {/* Informations du manager */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Contact pays
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {manager.firstName} {manager.lastName}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <a
                      href={`tel:${manager.phone}`}
                      className="text-primary hover:underline"
                    >
                      {manager.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a
                      href={`mailto:${manager.email}`}
                      className="text-primary hover:underline"
                    >
                      {manager.email}
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center p-6 bg-primary/5 rounded-lg">
                  <Building2 className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Responsable des points de relais
                  </p>
                  <p className="text-sm text-gray-600">en {countryName}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Liste des points de relais */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Points de relais ({pickupPoints.length})
          </h2>

          {pickupPoints.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun point de relais
                </h3>
                <p className="text-gray-600">
                  Il n&apos;y a pas encore de points de relais disponibles en{" "}
                  {countryName}.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pickupPoints.map((point) => (
                <PickupPointCard 
                  key={point.id} 
                  point={point} 
                  showManagerPhoto={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
