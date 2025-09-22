"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";
import { useVerifySignature } from "@/lib/hooks/useInvoice";

interface VerificationResult {
  orderNumber: string;
  isValidStored: boolean;
  isValidContent: boolean;
  isValid: boolean;
  verificationDate: string;
  order: {
    id: number;
    orderNumber: string;
    totalAmount: number;
    createdAt: string;
    status: string;
  };
}

export function InvoiceSignatureVerification() {
  const [orderNumber, setOrderNumber] = useState("");
  const [signature, setSignature] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const verifySignatureMutation = useVerifySignature();

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
    if (!orderNumber.trim() || !signature.trim()) {
      return;
    }

    const data = {
      orderNumber: orderNumber.trim(),
      signature: signature.trim(),
      ...(pdfBase64 && { pdfData: pdfBase64 }),
    };

    verifySignatureMutation.mutate(data, {
      onSuccess: (response) => {
        setVerificationResult(response.data);
      },
    });
  };

  const handleReset = () => {
    setOrderNumber("");
    setSignature("");
    setPdfFile(null);
    setPdfBase64("");
    setVerificationResult(null);
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
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formulaire de vérification */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="orderNumber">Numéro de commande *</Label>
                <Input
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="ORD-2024-001234"
                />
              </div>

              <div>
                <Label htmlFor="signature">Signature numérique *</Label>
                <Textarea
                  id="signature"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Collez ici la signature numérique..."
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="pdfFile">Fichier PDF (optionnel)</Label>
                <div className="mt-1">
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
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {pdfFile ? pdfFile.name : "Sélectionner un fichier PDF"}
                  </Button>
                </div>
                {pdfFile && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>{pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                )}
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Le fichier PDF est optionnel. Si fourni, la vérification sera plus complète
                  en validant à la fois la signature stockée et le contenu du fichier.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-4">
            <Button
              onClick={handleVerify}
              disabled={!orderNumber.trim() || !signature.trim() || verifySignatureMutation.isPending}
              className="flex items-center gap-2"
            >
              {verifySignatureMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              {verifySignatureMutation.isPending ? "Vérification..." : "Vérifier la signature"}
            </Button>

            <Button variant="outline" onClick={handleReset}>
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
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(verificationResult.isValid)}
                <div>
                  <div className="font-semibold">
                    Signature {verificationResult.isValid ? "authentique" : "non valide"}
                  </div>
                  <div className="text-sm text-gray-600">
                    Vérifiée le {new Date(verificationResult.verificationDate).toLocaleString("fr-FR")}
                  </div>
                </div>
              </div>
              {getStatusBadge(verificationResult.isValid)}
            </div>

            {/* Détails de vérification */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Vérifications effectuées</h4>
                
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="text-sm">Signature stockée en base</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(verificationResult.isValidStored)}
                    {getStatusBadge(verificationResult.isValidStored)}
                  </div>
                </div>

                {pdfBase64 && (
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="text-sm">Contenu du fichier PDF</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(verificationResult.isValidContent)}
                      {getStatusBadge(verificationResult.isValidContent)}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Informations de la commande</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Numéro :</span>
                    <span className="font-mono">{verificationResult.order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID :</span>
                    <span>{verificationResult.order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant :</span>
                    <span className="font-semibold">
                      {(verificationResult.order.totalAmount / 100).toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "XAF",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut :</span>
                    <Badge variant="outline">{verificationResult.order.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date :</span>
                    <span>
                      {new Date(verificationResult.order.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message d'alerte si invalide */}
            {!verificationResult.isValid && (
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
