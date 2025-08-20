import type { Product } from '@/lib/api/types';

export interface CartItem {
  id: number;
  cartId: number;
  product: Product;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: number | null;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface CreateCartItemRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
