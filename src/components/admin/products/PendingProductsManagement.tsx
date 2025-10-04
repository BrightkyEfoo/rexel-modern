"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPendingProducts, bulkApproveProducts, bulkRejectProducts } from "@/lib/api/products-validation";
import { ProductValidationDetailDialog } from "./ProductValidationDetailDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, Loader2, Package, User, Eye, Check, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Product } from "@/lib/api/types";
import { formatPrice } from "@/lib/utils/currency";
import { useToast } from "@/hooks/use-toast";

/**
 * Composant de gestion des produits en attente de validation
 * Admin only - Affiche tous les produits soumis par les managers
 * Permet la validation groupée
 */
export function PendingProductsManagement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isBulkRejectDialogOpen, setIsBulkRejectDialogOpen] = useState(false);
  const [bulkRejectReason, setBulkRejectReason] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["pending-products"],
    queryFn: () => getPendingProducts(),
    refetchInterval: 30000, // Refetch toutes les 30 secondes
  });

  const pendingProducts = data?.data || [];
  const totalPending = data?.meta?.total || 0;

  // Mutation pour approuver en masse
  const bulkApproveMutation = useMutation({
    mutationFn: (params: { productIds: number[]; comment?: string }) =>
      bulkApproveProducts(params.productIds, params.comment),
    onSuccess: (data) => {
      toast({
        title: "Succès",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["pending-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      setSelectedProducts([]);
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'approbation groupée",
        variant: "destructive",
      });
    },
  });

  // Mutation pour rejeter en masse
  const bulkRejectMutation = useMutation({
    mutationFn: (params: { productIds: number[]; reason: string }) =>
      bulkRejectProducts(params.productIds, params.reason),
    onSuccess: (data) => {
      toast({
        title: "Succès",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["pending-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      setSelectedProducts([]);
      setIsBulkRejectDialogOpen(false);
      setBulkRejectReason("");
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors du rejet groupé",
        variant: "destructive",
      });
    },
  });

  const handleSelectProduct = (product: Product, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, product]);
    } else {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(pendingProducts);
    } else {
      setSelectedProducts([]);
    }
  };

  const handleBulkApprove = () => {
    if (selectedProducts.length === 0) return;
    bulkApproveMutation.mutate({
      productIds: selectedProducts.map((p) => p.id),
    });
  };

  const handleBulkReject = () => {
    if (selectedProducts.length === 0) return;
    setIsBulkRejectDialogOpen(true);
  };

  const handleConfirmBulkReject = () => {
    if (!bulkRejectReason.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez fournir une raison de rejet",
        variant: "destructive",
      });
      return;
    }
    bulkRejectMutation.mutate({
      productIds: selectedProducts.map((p) => p.id),
      reason: bulkRejectReason,
    });
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailDialogOpen(true);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["pending-products"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["activities"] });
  };

  const isAllSelected = pendingProducts.length > 0 && selectedProducts.length === pendingProducts.length;
  const isIndeterminate = selectedProducts.length > 0 && selectedProducts.length < pendingProducts.length;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Produits en attente de validation</CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Produits en attente de validation</CardTitle>
          <CardDescription>Erreur lors du chargement</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">
            Une erreur s'est produite lors du chargement des produits en attente
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Produits en attente de validation
              </CardTitle>
              <CardDescription>
                {totalPending} produit{totalPending > 1 ? "s" : ""} en attente
                de votre validation
              </CardDescription>
            </div>
            <Badge variant="default" className="text-lg px-4 py-2">
              {totalPending}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          {/* Actions groupées */}
          {selectedProducts.length > 0 && (
            <div className="mb-6 p-4 bg-muted rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedProducts.length} produit{selectedProducts.length > 1 ? "s" : ""} sélectionné{selectedProducts.length > 1 ? "s" : ""}
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleBulkApprove}
                  disabled={bulkApproveMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {bulkApproveMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Approuver la sélection
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleBulkReject}
                  disabled={bulkRejectMutation.isPending}
                >
                  <X className="w-4 h-4 mr-2" />
                  Rejeter la sélection
                </Button>
              </div>
            </div>
          )}

          {pendingProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">
                Aucun produit en attente
              </p>
              <p className="text-sm text-muted-foreground">
                Tous les produits ont été validés !
              </p>
            </div>
          ) : (
            <>
              {/* Sélection globale */}
              <div className="mb-4 flex items-center gap-2">
                <Checkbox
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) {
                      (el as any).indeterminate = isIndeterminate;
                    }
                  }}
                  onCheckedChange={handleSelectAll}
                />
                <Label className="text-sm font-medium cursor-pointer">
                  Tout sélectionner ({pendingProducts.length} produits)
                </Label>
              </div>

              <ScrollArea className="h-[calc(100vh-400px)]">
                <div className="space-y-4 pr-4">
                  {pendingProducts.map((product: Product) => (
                    <Card
                      key={product.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Checkbox de sélection */}
                          <Checkbox
                            checked={selectedProducts.some((p) => p.id === product.id)}
                            onCheckedChange={(checked) =>
                              handleSelectProduct(product, !!checked)
                            }
                            className="mt-1"
                          />

                          <div className="flex-1 space-y-3">
                            {/* En-tête du produit */}
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold mb-1">
                                  {product.name}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <User className="w-4 h-4" />
                                  <span>
                                    Soumis par {product.createdBy?.firstName}{" "}
                                    {product.createdBy?.lastName}
                                  </span>
                                </div>
                              </div>
                              <Badge variant="secondary" className="ml-4">
                                {product.status}
                              </Badge>
                            </div>

                            {/* Informations du produit */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-y">
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  SKU
                                </p>
                                <p className="text-sm font-medium">
                                  {product.sku || "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Prix
                                </p>
                                <p className="text-sm font-medium">
                                  {formatPrice(product.price)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Stock
                                </p>
                                <p className="text-sm font-medium">
                                  {product.stockQuantity} unités
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Soumis le
                                </p>
                                <p className="text-sm font-medium">
                                  {product.submittedAt &&
                                    format(
                                      new Date(product.submittedAt),
                                      "dd/MM/yyyy",
                                      {
                                        locale: fr,
                                      }
                                    )}
                                </p>
                              </div>
                            </div>

                            {/* Description */}
                            {product.shortDescription && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {product.shortDescription}
                              </p>
                            )}

                            {/* Action */}
                            <div className="flex items-center gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(product)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Voir les détails
                              </Button>
                            </div>
                          </div>

                          {/* Image du produit */}
                          {product.imageUrl && (
                            <div className="hidden md:block flex-shrink-0">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-32 h-32 object-cover rounded-lg border"
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog de rejet groupé */}
      <Dialog open={isBulkRejectDialogOpen} onOpenChange={setIsBulkRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter {selectedProducts.length} produit(s)</DialogTitle>
            <DialogDescription>
              Veuillez fournir une raison pour le rejet de ces produits.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="reason">Raison du rejet *</Label>
            <Textarea
              id="reason"
              value={bulkRejectReason}
              onChange={(e) => setBulkRejectReason(e.target.value)}
              placeholder="Ex: Prix trop élevé, description insuffisante..."
              rows={4}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBulkRejectDialogOpen(false)}
              disabled={bulkRejectMutation.isPending}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmBulkReject}
              disabled={bulkRejectMutation.isPending}
            >
              {bulkRejectMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Rejeter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ProductValidationDetailDialog
        product={selectedProduct}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}
