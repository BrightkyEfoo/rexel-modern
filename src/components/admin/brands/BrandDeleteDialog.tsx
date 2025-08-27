"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Trash2, AlertTriangle, Building2 } from "lucide-react";
import { useDeleteBrand, useBulkDeleteBrands } from "@/lib/hooks/useBrands";
import type { Brand } from "@/lib/types/brands";
import { useToast } from "@/hooks/use-toast";

interface BrandDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brands: Brand[];
  mode: "single" | "bulk";
}

export function BrandDeleteDialog({
  open,
  onOpenChange,
  brands,
  mode,
}: BrandDeleteDialogProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteBrand = useDeleteBrand();
  const bulkDeleteBrands = useBulkDeleteBrands();

  // Vérifier si des marques ont des produits
  const brandsWithProducts = brands.filter(
    brand => brand.productCount && brand.productCount > 0
  );

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (mode === "single" && brands.length === 1) {
        await deleteBrand.mutateAsync(brands[0].id);
        toast({
          title: "Marque supprimée",
          description: "La marque a été supprimée avec succès.",
        });
      } else if (mode === "bulk") {
        const brandIds = brands.map(b => b.id);
        await bulkDeleteBrands.mutateAsync(brandIds);
        toast({
          title: "Marques supprimées",
          description: `${brands.length} marque(s) ont été supprimées avec succès.`,
        });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getTitle = () => {
    if (mode === "single") {
      return "Supprimer la marque";
    }
    return `Supprimer ${brands.length} marques`;
  };

  const getDescription = () => {
    if (mode === "single") {
      return "Êtes-vous sûr de vouloir supprimer cette marque ? Cette action est irréversible.";
    }
    return `Êtes-vous sûr de vouloir supprimer ces ${brands.length} marques ? Cette action est irréversible.`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        {/* Avertissement pour les marques avec produits */}
        {brandsWithProducts.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Attention !</p>
                <p>
                  {brandsWithProducts.length === 1 
                    ? "Cette marque contient" 
                    : `${brandsWithProducts.length} marques contiennent`
                  } des produits qui seront également affectés.
                </p>
                <ul className="text-sm space-y-1">
                  {brandsWithProducts.map(brand => (
                    <li key={brand.id} className="flex items-center gap-2">
                      <Building2 className="h-3 w-3" />
                      <span>{brand.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {brand.productCount} produits
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Liste des marques à supprimer */}
        <div className="max-h-60 overflow-y-auto space-y-3">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {brand.logoUrl && (
                  <div className="w-8 h-8 bg-muted rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{brand.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {brand.slug}
                    </Badge>
                    {brand.productCount && brand.productCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {brand.productCount} produits
                      </Badge>
                    )}
                    {!brand.isActive && (
                      <Badge variant="destructive" className="text-xs">
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Trash2 className="h-4 w-4 text-destructive flex-shrink-0" />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
