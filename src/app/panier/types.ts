export type CheckoutStep = "cart" | "shipping" | "payment" | "confirmation";

export interface CartTotals {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface CartStepProps {
  cart: any;
  totals: CartTotals;
  onNext: () => void;
}

export interface ShippingStepProps {
  user: any;
  selectedShippingAddress: string;
  setSelectedShippingAddress: (id: string) => void;
  selectedBillingAddress: string;
  setSelectedBillingAddress: (id: string) => void;
  selectedPickupPoint: string;
  setSelectedPickupPoint: (id: string) => void;
  deliveryMethod: string;
  setDeliveryMethod: (method: string) => void;
  onNext: () => void;
  onBack: () => void;
  totals: CartTotals;
}

export interface PaymentStepProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
  deliveryMethod: string;
  onNext: () => void;
  onBack: () => void;
  totals: CartTotals;
}

export interface ConfirmationStepProps {
  cart: any;
  totals: CartTotals;
  user: any;
  selectedShippingAddress: string;
  selectedBillingAddress: string;
  selectedPickupPoint: string;
  paymentMethod: string;
  orderNotes: string;
  deliveryMethod: string;
  promoCode: string;
}
