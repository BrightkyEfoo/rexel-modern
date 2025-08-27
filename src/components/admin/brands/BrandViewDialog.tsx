"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Hash,
  Globe,
  Star,
  ExternalLink
} from "lucide-react";
import type { Brand } from "@/lib/types/brands";

interface BrandViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand?: Brand;
}

export function BrandViewDialog({
  open,
  onOpenChange,
  brand,
}: BrandViewDialogProps) {
  if (!brand) return null;

  const getStatusBadge = () => {
    if (brand.isActive) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    }
    return <Badge variant="destructive">Inactive</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Détails de la marque
          </DialogTitle>
          <DialogDescription>
            Consultez toutes les informations de cette marque.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* En-tête de la marque */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{brand.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      {brand.slug}
                    </Badge>
                    {getStatusBadge()}
                    {brand.isFeatured && (
                      <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Mise en avant
                      </Badge>
                    )}
                  </div>
                </div>
                {brand.logoUrl && (
                  <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </CardHeader>
            {brand.description && (
              <CardContent>
                <p className="text-muted-foreground">{brand.description}</p>
              </CardContent>
            )}
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations de la marque */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Informations de la marque
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Statut</span>
                  <div className="flex items-center gap-1">
                    {brand.isActive ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">
                      {brand.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mise en avant</span>
                  <div className="flex items-center gap-1">
                    {brand.isFeatured ? (
                      <Star className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-sm">
                      {brand.isFeatured ? "Oui" : "Non"}
                    </span>
                  </div>
                </div>

                {brand.websiteUrl && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Site web</span>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex items-center gap-1"
                    >
                      <a 
                        href={brand.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <Globe className="h-3 w-3" />
                        Visiter
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nombre de produits</span>
                  <span className="font-medium">{brand.productCount || 0}</span>
                </div>
                
                {brand.logoUrl && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Logo</span>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Configuré</span>
                    </div>
                  </div>
                )}

                {!brand.logoUrl && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Logo</span>
                    <div className="flex items-center gap-1">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Manquant</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations système */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Informations système
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID</span>
                  <span className="font-mono text-sm">{brand.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Slug</span>
                  <span className="font-mono text-sm">{brand.slug}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Créée le</span>
                  <span className="text-sm">
                    {new Date(brand.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Modifiée le</span>
                  <span className="text-sm">
                    {new Date(brand.updatedAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Logo en grand */}
            {brand.logoUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Logo de la marque</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <div className="w-48 h-32 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a 
                        href={brand.logoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        Voir en grand
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
