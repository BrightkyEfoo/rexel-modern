"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductActivities } from "@/lib/api/products-validation";
import type { Product } from "@/lib/api/types";
import { ProductChangesDisplay } from "./ProductChangesDisplay";
import { ProductApprovalDialog } from "./ProductApprovalDialog";
import { ProductFormDialog } from "./ProductFormDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  X,
  Edit,
  Loader2,
  Package,
  History,
  FileEdit,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatPrice } from "@/lib/utils/currency";

interface ProductValidationDetailDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ProductValidationDetailDialog({
  product,
  open,
  onOpenChange,
  onSuccess,
}: ProductValidationDetailDialogProps) {
  const queryClient = useQueryClient();
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [approvalMode, setApprovalMode] = useState<"approve" | "reject">(
    "approve"
  );

  // Charger l'historique des activités
  const { data: activitiesResponse, isLoading: activitiesLoading } = useQuery({
    queryKey: ["productActivities", product?.id],
    queryFn: () => getProductActivities(product!.id),
    enabled: !!product && open,
  });

  const activities = activitiesResponse?.data || [];

  console.log("🔍 [ProductValidationDetailDialog] Activités:", activities);

  const handleApprove = () => {
    setApprovalMode("approve");
    setIsApprovalDialogOpen(true);
  };

  const handleReject = () => {
    setApprovalMode("reject");
    setIsRejectDialogOpen(true);
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleValidationSuccess = () => {
    onSuccess();
    onOpenChange(false);
  };

  const handleEditSuccess = () => {
    // Invalider les queries des activités et des pending products
    queryClient.invalidateQueries({ queryKey: ["productActivities"] });
    queryClient.invalidateQueries({ queryKey: ["pending-products"] });
    
    // Fermer toutes les dialogues
    setIsEditDialogOpen(false);
    onOpenChange(false);
    
    // Notifier le parent pour rafraîchir les données
    onSuccess();
  };

  if (!product) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-2xl mb-2">
                  {product.name}
                </DialogTitle>
                <DialogDescription>
                  Soumis par {product.createdBy?.firstName}{" "}
                  {product.createdBy?.lastName} le{" "}
                  {product.submittedAt &&
                    format(
                      new Date(product.submittedAt),
                      "dd MMMM yyyy à HH:mm",
                      {
                        locale: fr,
                      }
                    )}
                </DialogDescription>
              </div>
              <Badge
                variant={product.status === "pending" ? "default" : "secondary"}
                className="ml-4"
              >
                {product.status}
              </Badge>
            </div>
          </DialogHeader>

          <Separator className="my-4" />

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">
                <Package className="h-4 w-4 mr-2" />
                Détails
              </TabsTrigger>
              <TabsTrigger value="changes">
                <FileEdit className="h-4 w-4 mr-2" />
                Changements
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-2" />
                Historique
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    SKU
                  </h4>
                  <p className="text-sm">{product.sku || "N/A"}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                      Prix
                    </h4>
                    <p className="font-bold text-lg">
                    {formatPrice(product.price)}
                    {product.salePrice && (
                      <span className="ml-2 text-sm text-muted-foreground line-through">
                        {formatPrice(product.salePrice)}
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Stock
                  </h4>
                  <p className="text-sm">{product.stockQuantity} unités</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Marque
                  </h4>
                  <p className="text-sm">{product.brand?.name || "N/A"}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                  Description
                </h4>
                <p className="text-sm whitespace-pre-wrap">
                  {product.description || "Aucune description"}
                </p>
              </div>

              {product.shortDescription && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                    Description courte
                  </h4>
                  <p className="text-sm">{product.shortDescription}</p>
                </div>
              )}

              {product.categories && product.categories.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                    Catégories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((category) => (
                      <Badge key={category.id} variant="outline">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {product.imageUrl && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                    Image
                  </h4>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full max-w-md rounded-lg border"
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="changes" className="mt-4">
              {activitiesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <ProductChangesDisplay activities={activities} />
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              {activitiesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {activities.length > 0 ? (
                    activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="border-l-2 border-primary/30 pl-4 py-2"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="text-xs">
                            {activity.activityType}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(
                              new Date(activity.createdAt),
                              "dd/MM/yyyy HH:mm",
                              {
                                locale: fr,
                              }
                            )}
                          </span>
                        </div>
                          <p className="text-sm">{activity.description}</p>
                          {activity.user && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Par {activity.user.firstName} {activity.user.lastName}{" "}
                              ({activity.user.type})
                            </p>
                          )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucun historique disponible
                    </p>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <Separator className="my-4" />

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier avant validation
            </Button>
            <div className="flex gap-2">
              <Button variant="destructive" onClick={handleReject}>
                <X className="h-4 w-4 mr-2" />
                Rejeter
              </Button>
              <Button
                variant="default"
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Approuver
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogs de validation */}
      <ProductApprovalDialog
        product={product}
        open={isApprovalDialogOpen}
        onOpenChange={setIsApprovalDialogOpen}
        mode="approve"
        onSuccess={handleValidationSuccess}
      />

      <ProductApprovalDialog
        product={product}
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        mode="reject"
        onSuccess={handleValidationSuccess}
      />

      {/* Dialog d'édition */}
      <ProductFormDialog
        product={product}
        mode="edit"
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
