import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { nextAuthApi } from "@/lib/api/nextauth-client";
import { toast } from "@/hooks/use-toast";

// Types
export interface CreateOrderIssueData {
  orderId: number;
  type: 'delivery_delay' | 'product_damage' | 'missing_items' | 'wrong_items' | 'billing_issue' | 'other';
  subject: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: string[];
}

export interface OrderIssue {
  id: number;
  issueNumber: string;
  type: string;
  priority: string;
  status: string;
  subject: string;
  description: string;
  attachments: string[];
  adminNotes: string | null;
  resolution: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  order: {
    id: number;
    orderNumber: string;
    status: string;
    totalAmount: number;
  };
}

export interface CancelOrderData {
  reason?: string;
}

// API functions
const orderIssuesApi = {
  reportIssue: async (data: CreateOrderIssueData): Promise<{ data: OrderIssue }> => {
    const response = await nextAuthApi.secured.post<{ data: OrderIssue }>('/orders/issues', data);
    return response.data;
  },

  getOrderIssues: async (orderNumber: string): Promise<{ data: OrderIssue[] }> => {
    const response = await nextAuthApi.secured.get<{ data: OrderIssue[] }>(`/orders/${orderNumber}/issues`);
    return response.data;
  },

  cancelOrder: async (orderNumber: string, data: CancelOrderData): Promise<{ data: any }> => {
    const response = await nextAuthApi.secured.put<{ data: any }>(`/orders/${orderNumber}/cancel`, data);
    return response.data;
  },
};

// React Query hooks
export function useReportIssue() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateOrderIssueData) => orderIssuesApi.reportIssue(data),
    onSuccess: (response) => {
      toast({
        title: "Problème signalé",
        description: `Votre signalement ${response.data.issueNumber} a été créé avec succès.`,
      });
      
      // Invalider les caches liés aux commandes
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-issues"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de signalement",
        description: error.message || "Impossible de créer le signalement",
        variant: "destructive",
      });
    },
  });
}

export function useOrderIssues(orderNumber: string) {
  return useQuery({
    queryKey: ["order-issues", orderNumber],
    queryFn: () => orderIssuesApi.getOrderIssues(orderNumber),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderNumber, data }: { orderNumber: string; data: CancelOrderData }) => 
      orderIssuesApi.cancelOrder(orderNumber, data),
    onSuccess: (response, variables) => {
      toast({
        title: "Commande annulée",
        description: `La commande ${response.data.orderNumber} a été annulée avec succès.`,
      });
      
      // Invalider le cache de la commande spécifique
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderNumber] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur d'annulation",
        description: error.message || "Impossible d'annuler la commande",
        variant: "destructive",
      });
    },
  });
}
