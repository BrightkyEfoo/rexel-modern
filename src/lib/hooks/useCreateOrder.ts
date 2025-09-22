import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { nextAuthApi } from "@/lib/api/nextauth-client";
import { toast } from "@/hooks/use-toast";

// Types
export interface CreateOrderData {
  shippingAddressId?: string | null;
  pickupPointId?: string | null;
  billingAddressId: string;
  deliveryMethod: "delivery" | "pickup";
  paymentMethod: "credit_card" | "bank_transfer" | "check" | "store_payment";
  promoCode?: string;
  notes?: string;
  totals: {
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
  };
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productSku?: string;
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
  status: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

export interface CreateOrderResponse {
  data: Order;
}

// API function
const createOrderApi = async (
  orderData: CreateOrderData
): Promise<CreateOrderResponse> => {
  const response = await nextAuthApi.secured.post<CreateOrderResponse>(
    "/orders",
    orderData
  );
  return response.data;
};

// React Query hook
export function useCreateOrder() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: createOrderApi,
    onSuccess: (data) => {
      toast({
        title: "Commande créée avec succès",
        description: `Votre commande ${data.data.orderNumber} a été créée.`,
      });
      
      // Rediriger vers la page de commande
      router.push(`/commandes/${data.data.orderNumber}`);
    },
    onError: (error: any) => {
      toast({
        title: "Erreur lors de la création de la commande",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });
}
