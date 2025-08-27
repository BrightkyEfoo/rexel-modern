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
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { useDeleteProduct, useBulkDeleteProducts } from "@/lib/hooks/useProducts";
import type { Product } from "@/lib/types/products";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils/currency";

interface ProductDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  mode: "single" | "bulk";
  onDeleteSuccess?: () => void;
}

export function ProductDeleteDialog({
  open,
  onOpenChange,
  products,
  mode,
  onDeleteSuccess,
}: ProductDeleteDialogProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteProduct = useDeleteProduct();
  const bulkDeleteProducts = useBulkDeleteProducts();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (mode === "single" && products.length === 1) {
        await deleteProduct.mutateAsync(products[0].id);
        toast({
          title: "Produit supprimé",
          description: "Le produit a été supprimé avec succès.",
        });
      } else if (mode === "bulk") {
        const productIds = products.map(p => p.id);
        await bulkDeleteProducts.mutateAsync(productIds);
        toast({
          title: "Produits supprimés",
          description: `${products.length} produit(s) ont été supprimés avec succès.`,
        });
      }
      onDeleteSuccess?.(); // Appeler le callback de succès
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
      return "Supprimer le produit";
    }
    return `Supprimer ${products.length} produits`;
  };

  const getDescription = () => {
    if (mode === "single") {
      return "Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.";
    }
    return `Êtes-vous sûr de vouloir supprimer ces ${products.length} produits ? Cette action est irréversible.`;
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

        {/* Liste des produits à supprimer */}
        <div className="max-h-60 overflow-y-auto space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{product.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  {product.sku && (
                    <Badge variant="outline" className="text-xs">
                      {product.sku}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatPrice(product.price)}
                  </span>
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
