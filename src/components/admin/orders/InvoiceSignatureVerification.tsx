"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  ShieldCheck,
  ShieldX,
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  Download,
} from "lucide-react";
import { useVerifySignature, useRegenerateInvoice } from "@/lib/hooks/useInvoice";

interface VerificationResult {
  orderNumber: string | null;
  isValid: boolean;
  verificationDate: string;
  message?: string;
  order?: {
    id: number;
    orderNumber: string;
    totalAmount: number;
    createdAt: string;
    status: string;
  };
}

export function InvoiceSignatureVerification() {
  const [orderNumber, setOrderNumber] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const verifySignatureMutation = useVerifySignature();
  const regenerateInvoiceMutation = useRegenerateInvoice();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      
      // Convertir en base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        setPdfBase64(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerify = () => {
    if (!pdfBase64) {
      return;
    }

    const data = {
      pdfData: pdfBase64,
      ...(orderNumber.trim() && { orderNumber: orderNumber.trim() }),
    };

    verifySignatureMutation.mutate(data, {
      onSuccess: (response) => {
        setVerificationResult(response.data);
      },
    });
  };

  const handleReset = () => {
    setOrderNumber("");
    setPdfFile(null);
    setPdfBase64("");
    setVerificationResult(null);
  };

  const handleRegenerateInvoice = () => {
    if (verificationResult?.orderNumber) {
      regenerateInvoiceMutation.mutate(verificationResult.orderNumber);
    }
  };

  const getStatusIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const getStatusBadge = (isValid: boolean) => {
    return (
      <Badge
        variant={isValid ? "default" : "destructive"}
        className={isValid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
      >
        {isValid ? "Valide" : "Invalide"}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Vérification de signature de facture
          </CardTitle>
          <CardDescription>
            Uploadez un fichier PDF de facture pour vérifier son authenticité. Le numéro de commande est optionnel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formulaire de vérification */}
          <div className="space-y-4">
            {/* Upload du fichier PDF */}
            <div>
              <Label htmlFor="pdfFile" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Fichier PDF de la facture *
              </Label>
              <div className="mt-2">
                <input
                  id="pdfFile"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("pdfFile")?.click()}
                  className="w-full justify-start"
                  size="lg"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {pdfFile ? pdfFile.name : "Sélectionner un fichier PDF"}
                </Button>
              </div>
              {pdfFile && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-sm text-blue-800">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">{pdfFile.name}</span>
                  <span className="text-blue-600">({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              )}
            </div>

            {/* Numéro de commande optionnel */}
            <div>
              <Label htmlFor="orderNumber" className="flex items-center gap-2">
                Numéro de commande <span className="text-gray-500 text-sm">(optionnel)</span>
              </Label>
              <Input
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="ORD-2024-001234"
                className="mt-2"
              />
              <p className="mt-1 text-sm text-gray-500">
                Si fourni, accélère la vérification. Sinon, le système recherchera automatiquement la commande correspondante.
              </p>
            </div>
          </div>

          {/* Info */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Comment ça marche ?</strong> Le système vérifie l'authenticité du fichier PDF en comparant
              sa signature numérique avec celle enregistrée lors de la génération de la facture.
            </AlertDescription>
          </Alert>

          {/* Boutons d'action */}
          <div className="flex gap-4">
            <Button
              onClick={handleVerify}
              disabled={!pdfFile || verifySignatureMutation.isPending}
              className="flex items-center gap-2"
              size="lg"
            >
              {verifySignatureMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              {verifySignatureMutation.isPending ? "Vérification en cours..." : "Vérifier la signature"}
            </Button>

            <Button variant="outline" onClick={handleReset} size="lg">
              <XCircle className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résultats de vérification */}
      {verificationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {verificationResult.isValid ? (
                <ShieldCheck className="w-5 h-5 text-green-600" />
              ) : (
                <ShieldX className="w-5 h-5 text-red-600" />
              )}
              Résultats de vérification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Statut global */}
            <div className={`p-6 border-2 rounded-lg ${
              verificationResult.isValid 
                ? "bg-green-50 border-green-300" 
                : "bg-red-50 border-red-300"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(verificationResult.isValid)}
                  <div>
                    <div className="text-lg font-bold">
                      Signature {verificationResult.isValid ? "authentique" : "non valide"}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Vérifiée le {new Date(verificationResult.verificationDate).toLocaleString("fr-FR")}
                    </div>
                  </div>
                </div>
                {getStatusBadge(verificationResult.isValid)}
              </div>
            </div>

            {/* Informations de la commande */}
            {verificationResult.order ? (
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Informations de la commande</h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Numéro de commande</div>
                    <div className="font-mono font-bold text-lg">{verificationResult.order.orderNumber}</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Montant total</div>
                    <div className="font-bold text-lg">
                      {(verificationResult.order.totalAmount / 100).toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "XAF",
                      })}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Statut</div>
                    <Badge variant="outline" className="mt-1">{verificationResult.order.status}</Badge>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Date de création</div>
                    <div className="font-semibold">
                      {new Date(verificationResult.order.createdAt).toLocaleDateString("fr-FR", {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                {/* Bouton de régénération */}
                {verificationResult.isValid && (
                  <div className="pt-4 border-t">
                    <Button
                      onClick={handleRegenerateInvoice}
                      disabled={regenerateInvoiceMutation.isPending}
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      {regenerateInvoiceMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Régénération en cours...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Régénérer la facture pour comparaison visuelle
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      Téléchargez une nouvelle copie de la facture pour la comparer visuellement avec l'originale
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Message si aucune commande trouvée */
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {verificationResult.message || "Aucune commande correspondante trouvée pour ce fichier PDF"}
                </AlertDescription>
              </Alert>
            )}

            {/* Message d'alerte si invalide */}
            {!verificationResult.isValid && verificationResult.order && (
              <Alert variant="destructive">
                <ShieldX className="h-4 w-4" />
                <AlertDescription>
                  <strong>Attention :</strong> Cette facture n'est pas authentique ou a été modifiée. 
                  La signature numérique ne correspond pas aux données de notre système.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
