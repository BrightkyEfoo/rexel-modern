"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, CreditCard, Check, Shield, Package } from "lucide-react";
import Link from "next/link";
import { PaymentStepProps } from "../types";
import { formatPrice, getCurrencySymbol } from "@/lib/utils/currency";

export function PaymentStep({
  paymentMethod,
  setPaymentMethod,
  orderNotes,
  setOrderNotes,
  deliveryMethod,
  onNext,
  onBack,
  totals,
}: PaymentStepProps) {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-3xl font-bold text-foreground">Paiement</h2>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Mode de paiement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === "credit_card"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-border/80"
                }`}
                onClick={() => setPaymentMethod("credit_card")}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={paymentMethod === "credit_card"}
                    onChange={() => setPaymentMethod("credit_card")}
                    className="text-primary"
                  />
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">Carte bancaire</div>
                    <div className="text-sm text-muted-foreground">
                      Visa, MasterCard, American Express
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === "bank_transfer"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-border/80"
                }`}
                onClick={() => setPaymentMethod("bank_transfer")}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={() => setPaymentMethod("bank_transfer")}
                    className="text-primary"
                  />
                  <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">{getCurrencySymbol()}</span>
                  </div>
                  <div>
                    <div className="font-semibold">Virement bancaire</div>
                    <div className="text-sm text-muted-foreground">
                      Paiement à 30 jours
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === "check"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-border/80"
                }`}
                onClick={() => setPaymentMethod("check")}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={paymentMethod === "check"}
                    onChange={() => setPaymentMethod("check")}
                    className="text-primary"
                  />
                  <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Chèque</div>
                    <div className="text-sm text-muted-foreground">
                      À l'ordre de KesiMarket
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Card Form */}
        {paymentMethod === "credit_card" && (
          <Card>
            <CardHeader>
              <CardTitle>Informations de carte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="card-number">Numéro de carte</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="expiry">Date d'expiration</Label>
                  <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" className="mt-1" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="card-name">Nom sur la carte</Label>
                  <Input
                    id="card-name"
                    placeholder="Jean Dupont"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes de commande (optionnel)</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              placeholder="Instructions particulières, accès difficile, créneaux préférés..."
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="w-full p-3 border border-border rounded-lg resize-none h-24"
            />
          </CardContent>
        </Card>

        {/* Terms */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 text-primary"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                J'accepte les{" "}
                <Link
                  href="/conditions-generales"
                  className="text-primary hover:underline"
                >
                  conditions générales de vente
                </Link>{" "}
                et la{" "}
                <Link
                  href="/politique-confidentialite"
                  className="text-primary hover:underline"
                >
                  politique de confidentialité
                </Link>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la livraison
          </Button>
          <Button
            onClick={onNext}
            disabled={!paymentMethod}
            className="bg-primary hover:bg-primary/90"
          >
            Valider la commande
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Récapitulatif final</CardTitle>
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

            {/* Security Info */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Paiement 100% sécurisé</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Package className="w-4 h-4 text-blue-600" />
                <span>Livraison assurée</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
