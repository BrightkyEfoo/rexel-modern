"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle, X } from "lucide-react";
import { useCancelOrder, type CancelOrderData } from "@/lib/hooks/useOrderIssues";

const cancelOrderSchema = z.object({
  reason: z.string().optional(),
});

type CancelOrderFormData = z.infer<typeof cancelOrderSchema>;

interface CancelOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
  orderTotal: number;
}

export function CancelOrderModal({ 
  open, 
  onOpenChange, 
  orderNumber,
  orderTotal
}: CancelOrderModalProps) {
  const cancelOrderMutation = useCancelOrder();

  const form = useForm<CancelOrderFormData>({
    resolver: zodResolver(cancelOrderSchema),
    defaultValues: {
      reason: '',
    },
  });

  const onSubmit = async (data: CancelOrderFormData) => {
    const cancelData: CancelOrderData = {
      reason: data.reason || undefined,
    };

    cancelOrderMutation.mutate(
      { orderNumber, data: cancelData },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      }
    );
  };

  const handleClose = () => {
    if (!cancelOrderMutation.isPending) {
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <X className="w-5 h-5 text-red-500" />
            Annuler la commande {orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Attention :</strong> Cette action est irréversible. 
              Une fois annulée, votre commande ne pourra plus être traitée.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Détails de la commande</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Numéro :</span>
                <span className="font-mono">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Montant :</span>
                <span className="font-semibold">
                  {(orderTotal).toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'XAF'
                  })}
                </span>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raison de l'annulation (optionnel)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Vous pouvez nous expliquer pourquoi vous souhaitez annuler cette commande..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={cancelOrderMutation.isPending}
                >
                  Garder la commande
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={cancelOrderMutation.isPending}
                  className="min-w-[120px]"
                >
                  {cancelOrderMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Annulation...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Annuler la commande
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
