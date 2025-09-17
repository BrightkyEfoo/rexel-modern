"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, ArrowLeft, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ConfirmationStepProps } from "../types";
import { formatPrice } from "../utils";

export function ConfirmationStep({
  mutation,
  totals,
  paymentMethod,
  deliveryMethod,
}: ConfirmationStepProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  // État de chargement
  if (mutation.isPending) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Création de votre commande...
          </h2>
          <p className="text-muted-foreground">
            Veuillez patienter pendant que nous traitons votre commande.
          </p>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (mutation.isError) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Erreur lors de la commande
          </h2>
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {mutation.error?.message || "Une erreur est survenue"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // État de succès
  if (!mutation.isSuccess || !mutation.data) {
    return null;
  }

  const order = mutation.data.data;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Commande confirmée !
        </h2>
        <p className="text-muted-foreground">
          Merci pour votre commande. Elle sera traitée par notre équipe dans les
          plus brefs délais.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Détails de la commande</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="font-semibold">Numéro de commande</div>
              <div className="text-primary font-mono">{order.orderNumber}</div>
            </div>
            <div>
              <div className="font-semibold">Date de commande</div>
              <div>
                {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            <div>
              <div className="font-semibold">Statut</div>
              <div className="capitalize">
                {order.status === "pending" && "En attente de validation"}
                {order.status === "confirmed" && "Confirmée"}
                {order.status === "processing" && "En traitement"}
                {order.status === "shipped" && "Expédiée"}
                {order.status === "delivered" && "Livrée"}
                {order.status === "cancelled" && "Annulée"}
              </div>
            </div>
            <div>
              <div className="font-semibold">Mode de paiement</div>
              <div>
                {paymentMethod === "credit_card" && "Carte bancaire"}
                {paymentMethod === "bank_transfer" && "Virement bancaire"}
                {paymentMethod === "check" && "Chèque"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Récapitulatif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              {deliveryMethod && (
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>
                    {deliveryMethod === "pickup"
                      ? "GRATUIT"
                      : formatPrice(totals.shipping)}
                  </span>
                </div>
              )}

              {totals.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Remise</span>
                  <span>-{formatPrice(totals.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(totals.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Articles commandés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 py-4 border-b border-border last:border-b-0"
              >
                <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                  {imageErrors[item.productId?.toString()] ||
                  !item.product?.imageUrl ? (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Logo variant="light" size="sm" showText={false} />
                    </div>
                  ) : (
                    <Image
                      src={
                        item.product.files?.[0]?.url || item.product.imageUrl
                      }
                      alt={item.productName}
                      width={64}
                      height={64}
                      className="object-contain w-full h-full p-1"
                      onError={() =>
                        handleImageError(item.productId?.toString())
                      }
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{item.productName}</div>
                  <div className="text-sm text-muted-foreground">
                    Quantité: {item.quantity} •{" "}
                    {formatPrice(Number(item.unitPrice))} / unité
                  </div>
                </div>
                <div className="font-semibold">
                  {formatPrice(Number(item.totalPrice))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center space-x-4 mt-8">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
        </Button>
        <Button asChild>
          <Link href="/commandes">Voir mes commandes</Link>
        </Button>
      </div>
    </div>
  );
}
