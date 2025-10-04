import { useMutation, useQuery } from "@tanstack/react-query";
import { nextAuthApi } from "@/lib/api/nextauth-client";
import { toast } from "@/hooks/use-toast";

// Types
export interface VerifySignatureData {
  pdfData: string; // Base64 encoded PDF data (obligatoire)
  orderNumber?: string; // Numéro de commande (optionnel)
}

export interface VerifySignatureResponse {
  data: {
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
  };
}

// API functions
const invoiceApi = {
  downloadInvoice: async (orderNumber: string): Promise<Blob> => {
    const response = await nextAuthApi.secured.get(
      `/orders/${orderNumber}/invoice`,
      {
        responseType: 'blob',
      }
    );
    return response.data as Blob;
  },

  verifySignature: async (data: VerifySignatureData): Promise<VerifySignatureResponse> => {
    const response = await nextAuthApi.secured.post<VerifySignatureResponse>(
      '/admin/orders/verify-signature',
      data
    );
    return response.data;
  },

  regenerateInvoice: async (orderNumber: string): Promise<Blob> => {
    const response = await nextAuthApi.secured.get(
      `/admin/orders/${orderNumber}/regenerate-invoice`,
      {
        responseType: 'blob',
      }
    );
    return response.data as Blob;
  },
};

// React Query hooks
export function useDownloadInvoice() {
  return useMutation({
    mutationFn: (orderNumber: string) => invoiceApi.downloadInvoice(orderNumber),
    onSuccess: (blob, orderNumber) => {
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `facture-${orderNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Facture téléchargée",
        description: `La facture ${orderNumber} a été téléchargée avec succès.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de téléchargement",
        description: error.message || "Impossible de télécharger la facture",
        variant: "destructive",
      });
    },
  });
}

export function useVerifySignature() {
  return useMutation({
    mutationFn: (data: VerifySignatureData) => invoiceApi.verifySignature(data),
    onSuccess: (response) => {
      const { isValid, orderNumber, message } = response.data;
      
      toast({
        title: isValid ? "Signature valide ✓" : "Signature invalide ✗",
        description: isValid 
          ? `La signature de la facture ${orderNumber} est authentique.`
          : message || `La signature n'est pas valide.`,
        variant: isValid ? "default" : "destructive",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de vérification",
        description: error.message || "Impossible de vérifier la signature",
        variant: "destructive",
      });
    },
  });
}

export function useRegenerateInvoice() {
  return useMutation({
    mutationFn: (orderNumber: string) => invoiceApi.regenerateInvoice(orderNumber),
    onSuccess: (blob, orderNumber) => {
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `facture-${orderNumber}-regeneree.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Facture régénérée",
        description: `La facture ${orderNumber} a été régénérée et téléchargée pour comparaison.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de régénération",
        description: error.message || "Impossible de régénérer la facture",
        variant: "destructive",
      });
    },
  });
}
