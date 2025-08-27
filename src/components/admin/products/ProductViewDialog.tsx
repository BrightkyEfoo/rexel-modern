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
import { Separator } from "@/components/ui/separator";
import { 
  Package, 
  Tag, 
  DollarSign, 
  Building2, 
  Calendar,
  CheckCircle,
  XCircle,
  Star,
  Eye,
  Hash
} from "lucide-react";
import type { Product } from "@/lib/types/products";
import { formatPrice } from "@/lib/utils/currency";

interface ProductViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
}

export function ProductViewDialog({
  open,
  onOpenChange,
  product,
}: ProductViewDialogProps) {
  if (!product) return null;

  const getAvailabilityBadge = () => {
    if (product.inStock) {
      return <Badge className="bg-green-100 text-green-800">En stock</Badge>;
    }
    return <Badge variant="destructive">Rupture de stock</Badge>;
  };

  const getStatusBadge = () => {
    if (product.isActive) {
      return <Badge className="bg-blue-100 text-blue-800">Actif</Badge>;
    }
    return <Badge variant="secondary">Inactif</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Détails du produit
          </DialogTitle>
          <DialogDescription>
            Consultez toutes les informations de ce produit.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* En-tête du produit */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{product.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {product.sku && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        {product.sku}
                      </Badge>
                    )}
                    {getAvailabilityBadge()}
                    {getStatusBadge()}
                    {product.isFeatured && (
                      <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Mis en avant
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </div>
                  {product.salePrice && (
                    <div className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.salePrice)}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            {(product.shortDescription || product.description) && (
              <CardContent>
                {product.shortDescription && (
                  <p className="text-muted-foreground mb-2">
                    {product.shortDescription}
                  </p>
                )}
                {product.description && (
                  <div>
                    <Separator className="my-3" />
                    <p className="text-sm">{product.description}</p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations de stock */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Stock et disponibilité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantité en stock</span>
                  <span className="font-medium">{product.stockQuantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gestion du stock</span>
                  <div className="flex items-center gap-1">
                    {product.manageStock ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">
                      {product.manageStock ? "Activée" : "Désactivée"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Disponibilité</span>
                  <div className="flex items-center gap-1">
                    {product.inStock ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">
                      {product.inStock ? "En stock" : "Rupture"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prix et tarification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Tarification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prix de base</span>
                  <span className="font-medium">{formatPrice(product.price)}</span>
                </div>
                {product.salePrice && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prix de vente</span>
                    <span className="font-medium text-green-600">
                      {formatPrice(product.salePrice)}
                    </span>
                  </div>
                )}
                {product.salePrice && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Économie</span>
                    <span className="font-medium text-green-600">
                      -{formatPrice(product.price - product.salePrice)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Classification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Classification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.categories && product.categories.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Catégories</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {product.categories.map((category) => (
                        <Badge key={category.id} variant="outline">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {product.brand && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Marque</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {product.brand.name}
                    </Badge>
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
                  <span className="font-mono text-sm">{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Slug</span>
                  <span className="font-mono text-sm">{product.slug}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Créé le</span>
                  <span className="text-sm">
                    {new Date(product.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Modifié le</span>
                  <span className="text-sm">
                    {new Date(product.updatedAt).toLocaleDateString('fr-FR', {
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
          </div>

          {/* Spécifications techniques */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Spécifications techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
