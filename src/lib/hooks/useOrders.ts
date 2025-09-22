import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { nextAuthApi } from "@/lib/api/nextauth-client";
import { toast } from "@/hooks/use-toast";

// Types
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productSku: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: {
    id: number;
    name: string;
    imageUrl?: string;
    files?: Array<{ url: string }>;
  };
}

export interface Order {
  id: number;
  orderNumber: string;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  paymentMethod: "credit_card" | "bank_transfer" | "check";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  deliveryMethod: "delivery" | "pickup";
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  promoCode?: string;
  notes?: string;
  createdAt: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
  };
  items: OrderItem[];
}

export interface OrdersResponse {
  data: Order[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
}

export interface OrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

// API functions
const ordersApi = {
  getOrders: async (params: OrdersParams = {}): Promise<OrdersResponse> => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.status && params.status !== "all")
      searchParams.append("status", params.status);
    if (params.search) searchParams.append("search", params.search);

    const url = `/admin/orders${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    const response = await nextAuthApi.secured.get<any>(url);
    return response.data.data as OrdersResponse;
  },

  getOrder: async (orderId: string): Promise<Order> => {
    const response = await nextAuthApi.secured.get<{ data: Order }>(
      `/orders/${orderId}`
    );
    return response.data.data;
  },

  updateOrderStatus: async (
    orderId: number,
    status: string
  ): Promise<{ data: Order }> => {
    const response = await nextAuthApi.secured.put<{ data: Order }>(
      `/admin/orders/${orderId}/status`,
      { status }
    );
    return response.data;
  },

  confirmOrder: async (orderId: number): Promise<{ data: Order }> => {
    const response = await nextAuthApi.secured.put<{ data: Order }>(
      `/admin/orders/${orderId}/confirm`
    );
    return response.data;
  },
};

// React Query hooks
export function useOrders(params: OrdersParams = {}) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => ordersApi.getOrders(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => ordersApi.getOrder(orderId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
      ordersApi.updateOrderStatus(orderId, status),
    onSuccess: (data, variables) => {
      // Update the orders list
      queryClient.setQueryData(
        ["orders"],
        (oldData: OrdersResponse | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((order) =>
              order.id === variables.orderId ? data.data : order
            ),
          };
        }
      );

      // Invalidate and refetch orders to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      toast({
        title: "Statut mis à jour",
        description: "Le statut de la commande a été modifié avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la mise à jour du statut",
        variant: "destructive",
      });
    },
  });
}

export function useConfirmOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) => ordersApi.confirmOrder(orderId),
    onSuccess: (data, orderId) => {
      // Update the orders list
      queryClient.setQueryData(
        ["orders"],
        (oldData: OrdersResponse | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((order) =>
              order.id === orderId ? data.data : order
            ),
          };
        }
      );

      // Invalidate and refetch orders to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      toast({
        title: "Commande confirmée",
        description: "La commande a été confirmée avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description:
          error.message || "Erreur lors de la confirmation de la commande",
        variant: "destructive",
      });
    },
  });
}
