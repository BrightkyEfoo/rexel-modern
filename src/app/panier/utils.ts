import { CartTotals } from './types';

/**
 * Fonction utilitaire pour formater les prix en français
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });
};

/**
 * Calcule les totaux du panier en fonction des items et des options
 */
export const calculateTotals = (
  cart: any,
  deliveryMethod: string,
  promoDiscount: number = 0
): CartTotals => {
  if (!cart?.data) {
    return { subtotal: 0, shipping: 0, discount: 0, total: 0 };
  }

  // Calcul du sous-total à partir des items du panier
  const subtotal =
    cart.data.items?.reduce((sum: number, item: any) => {
      const itemPrice = Number(item.product?.price || item.price || 0);
      const quantity = Number(item.quantity || 0);
      return sum + itemPrice * quantity;
    }, 0) || 0;

  // Frais de livraison selon la méthode choisie
  let shipping = 0;
  if (deliveryMethod === "standard") {
    shipping = 8.5;
  } else if (deliveryMethod === "express") {
    shipping = 15.9;
  } else if (deliveryMethod === "pickup") {
    shipping = 0;
  } else if (deliveryMethod === "delivery") {
    shipping = 8.5; // Par défaut livraison standard
  }

  const discount = promoDiscount;

  // Le total inclut la livraison seulement si une méthode est sélectionnée
  const shippingToAdd = deliveryMethod ? shipping : 0;
  const total = Math.max(0, subtotal + shippingToAdd - discount);

  return { subtotal, shipping, discount, total };
};

/**
 * Génère un numéro de commande unique
 */
export const generateOrderNumber = (): string => {
  return `REX-${new Date().getFullYear()}-${Math.random()
    .toString(36)
    .substr(2, 9)
    .toUpperCase()}`;
};
