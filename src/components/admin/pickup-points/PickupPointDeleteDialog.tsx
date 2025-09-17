"use client";

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
import { AlertTriangle, MapPin } from "lucide-react";
import { useState } from "react";
import {
  useDeletePickupPoint,
  useBulkDeletePickupPoints,
} from "@/lib/hooks/usePickupPoints";
import type { PickupPoint } from "@/lib/types/pickup-points";
import { toast } from "@/hooks/use-toast";

interface PickupPointDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pickupPoints: PickupPoint[];
  onDeleted: () => void;
}

export function PickupPointDeleteDialog({
  open,
  onOpenChange,
  pickupPoints,
  onDeleted,
}: PickupPointDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deletePickupPoint = useDeletePickupPoint();
  const bulkDeletePickupPoints = useBulkDeletePickupPoints();

  const isSingleDelete = pickupPoints.length === 1;
  const pickupPoint = isSingleDelete ? pickupPoints[0] : null;

  const handleDelete = async () => {
    if (pickupPoints.length === 0) return;

    setIsDeleting(true);
    try {
      if (isSingleDelete && pickupPoint) {
        await deletePickupPoint.mutateAsync(pickupPoint.id);
        toast({
          title: `Le point de relais "${pickupPoint.name}" a été supprimé avec succès.`,
          variant: "default",
        });
      } else {
        const ids = pickupPoints.map((p) => p.id);
        await bulkDeletePickupPoints.mutateAsync(ids);
        toast({
          title: `${pickupPoints.length} points de relais ont été supprimés avec succès.`,
          variant: "default",
        });
      }

      onDeleted();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: isSingleDelete
          ? "Erreur lors de la suppression du point de relais."
          : "Erreur lors de la suppression des points de relais.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (pickupPoints.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>
              {isSingleDelete
                ? "Supprimer le point de relais"
                : `Supprimer ${pickupPoints.length} points de relais`}
            </span>
          </DialogTitle>
          <DialogDescription>
            {isSingleDelete
              ? "Cette action est irréversible. Le point de relais sera définitivement supprimé."
              : "Cette action est irréversible. Tous les points de relais sélectionnés seront définitivement supprimés."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isSingleDelete && pickupPoint ? (
            // Affichage pour un seul point de relais
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {pickupPoint.name}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {pickupPoint.address}
                  </p>
                  <p className="text-sm text-gray-500">{pickupPoint.city}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge
                      variant={pickupPoint.isActive ? "default" : "secondary"}
                    >
                      {pickupPoint.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Affichage pour plusieurs points de relais
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Points de relais à supprimer :
              </p>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {pickupPoints.map((point) => (
                  <div
                    key={point.id}
                    className="flex items-center space-x-3 p-2 bg-gray-50 rounded"
                  >
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {point.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {point.city}
                      </p>
                    </div>
                    <Badge
                      variant={point.isActive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {point.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Attention !</p>
                <p>
                  {isSingleDelete
                    ? "Toutes les données associées à ce point de relais seront perdues."
                    : "Toutes les données associées à ces points de relais seront perdues."}
                </p>
              </div>
            </div>
          </div>
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
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Suppression...
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 mr-2" />
                {isSingleDelete
                  ? "Supprimer"
                  : `Supprimer (${pickupPoints.length})`}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
