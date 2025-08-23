"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/ui/logo";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Minus,
  Plus,
  Trash2,
  Shield,
  Truck,
  Package,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useUpdateCartItem,
  useRemoveFromCart,
} from "@/lib/query/hooks";
import { CartStepProps } from "../types";
import { formatPrice } from "../utils";

interface CartStepInternalProps extends CartStepProps {
  promoCode: string;
  setPromoCode: (code: string) => void;
  promoDiscount: number;
  onApplyPromoCode: () => void;
  deliveryMethod: string;
}

export function CartStep({
  cart,
  totals,
  onNext,
  promoCode,
  setPromoCode,
  promoDiscount,
  onApplyPromoCode,
  deliveryMethod,
}: CartStepInternalProps) {
  const updateCartItemMutation = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) return;

    try {
      await updateCartItemMutation.mutateAsync({
        itemId: Number(itemId),
        quantity: newQuantity,
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCartMutation.mutateAsync(Number(itemId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-bold text-foreground">
          Mon panier ({cart.totalItems} articles)
        </h1>

        <div className="space-y-4">
          {cart.items.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-6">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
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
                        width={96}
                        height={96}
                        className="object-contain w-full h-full p-2"
                        onError={() =>
                          handleImageError(item.product.id.toString())
                        }
                      />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          href={`/produit/${item.productId}`}
                          className="font-semibold text-foreground hover:text-primary"
                        >
                          {item.product.name}
                        </Link>
                        <div className="text-sm text-muted-foreground mt-1">
                          <Badge variant="secondary">
                            {item.product.brand?.name}
                          </Badge>
                          <span className="ml-2">SKU: {item.product.sku}</span>
                        </div>
                        {item.variant && (
                          <div className="text-sm text-muted-foreground mt-1">
                            Variante: {item.variant.name}
                          </div>
                        )}
                        <div className="flex items-center mt-2">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              item.product.availability === "in_stock"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                          <span className="text-sm text-muted-foreground">
                            {item.product.availability === "in_stock"
                              ? "En stock"
                              : "Rupture de stock"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-foreground">
                          {item.totalPrice?.toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                            minimumFractionDigits: 2,
                          })}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.product?.price
                            ? formatPrice(Number(item.product.price))
                            : formatPrice(Number(item.price || 0))}{" "}
                          / unité
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(
                                item.id?.toString() || "",
                                item.quantity - 1
                              )
                            }
                            disabled={
                              item.quantity <= 1 ||
                              updateCartItemMutation.isPending
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-4 py-2 font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(
                                item.id?.toString() || "",
                                item.quantity + 1
                              )
                            }
                            disabled={updateCartItemMutation.isPending}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleRemoveItem(item.id?.toString() || "")
                          }
                          disabled={removeFromCartMutation.isPending}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="pt-6">
          <Button variant="outline" asChild>
            <Link href="/categories">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continuer mes achats
            </Link>
          </Button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Récapitulatif de commande</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Promo Code */}
            <div className="space-y-2">
              <Label htmlFor="promo">Code promo</Label>
              <div className="flex space-x-2">
                <Input
                  id="promo"
                  placeholder="BIENV202"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button onClick={onApplyPromoCode} variant="outline">
                  Appliquer
                </Button>
              </div>
              {promoDiscount > 0 && (
                <div className="text-sm text-green-600">
                  Code appliqué : -{promoDiscount}€
                </div>
              )}
            </div>

            <Separator />

            {/* Totals */}
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

            {/* Checkout Button */}
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
              onClick={onNext}
            >
              Passer la commande
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Paiement sécurisé</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Livraison rapide</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Package className="w-4 h-4 text-purple-600" />
                <span>Retour gratuit</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-orange-600" />
                <span>Support 24/7</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Products */}
        <Card>
          <CardHeader>
            <CardTitle>Vous pourriez aussi aimer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mock recommended products */}
              {[
                { name: "Interrupteur va-et-vient", price: 8.9 },
                { name: "Boîte de dérivation", price: 3.5 },
              ].map((product, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 border rounded-lg"
                >
                  <div className="w-12 h-12 bg-muted rounded" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="text-sm text-primary font-semibold">
                      {formatPrice(Number(product.price))}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
