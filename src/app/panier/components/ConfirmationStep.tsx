"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/ui/logo";
import { ArrowLeft, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ConfirmationStepProps } from "../types";
import { formatPrice, generateOrderNumber } from "../utils";

export function ConfirmationStep({
  cart,
  totals,
  user,
  selectedShippingAddress,
  selectedBillingAddress,
  paymentMethod,
  orderNotes,
  deliveryMethod,
}: ConfirmationStepProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  const orderNumber = generateOrderNumber();

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
          Merci pour votre commande. Vous recevrez un email de confirmation sous
          peu.
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
              <div className="text-primary font-mono">{orderNumber}</div>
            </div>
            <div>
              <div className="font-semibold">Date de commande</div>
              <div>
                {new Date().toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
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
            <div>
              <div className="font-semibold">Livraison prévue</div>
              <div>
                {new Date(
                  Date.now() + 3 * 24 * 60 * 60 * 1000
                ).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
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
            {cart.items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 py-4 border-b border-border last:border-b-0"
              >
                <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                  {imageErrors[item.product.id.toString()] ||
                  !item.product.imageUrl ? (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Logo variant="light" size="sm" showText={false} />
                    </div>
                  ) : (
                    <Image
                      src={
                        item.product.files?.[0]?.url || item.product.imageUrl
                      }
                      alt={item.product.name}
                      width={64}
                      height={64}
                      className="object-contain w-full h-full p-1"
                      onError={() =>
                        handleImageError(item.product.id.toString())
                      }
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{item.product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Quantité: {item.quantity} •{" "}
                    {item.product?.price
                      ? formatPrice(Number(item.product.price))
                      : item.price
                      ? formatPrice(Number(item.price))
                      : ""}{" "}
                    / unité
                  </div>
                </div>
                <div className="font-semibold">
                  {item.totalPrice ? formatPrice(item.totalPrice) : ""}
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
