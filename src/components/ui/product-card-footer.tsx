'use client';

import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardFooterProps {
  /** Si le produit est dans le panier */
  isInCart: boolean;
  /** Fonction pour ajouter au panier */
  onAddToCart: () => void;
  /** Fonction pour retirer du panier */
  onRemoveFromCart: () => void;
  /** Fonction pour ouvrir la page de modification/détail */
  onEdit?: () => void;
  /** Si le produit est en rupture de stock */
  isOutOfStock?: boolean;
  /** Classes CSS additionnelles */
  className?: string;
  /** Mode d'affichage */
  variant?: 'grid' | 'list';
}

export function ProductCardFooter({
  isInCart,
  onAddToCart,
  onRemoveFromCart,
  onEdit,
  isOutOfStock = false,
  className,
  variant = 'grid'
}: ProductCardFooterProps) {
  const isGridMode = variant === 'grid';

  return (
    <div 
      className={cn(
        "bg-background border-t backdrop-blur-sm h-14 flex items-center",
        {
          // Style pour le mode grid - sticky en bas avec ombre
          "absolute bottom-0 left-0 right-0 shadow-lg px-3": isGridMode,
          // Style pour le mode list - normal
          "relative px-4": !isGridMode
        },
        className
      )}
    >
      {isOutOfStock ? (
        <div className="w-full text-center">
          <span className="text-sm text-muted-foreground font-medium">
            Rupture de stock
          </span>
        </div>
      ) : isInCart ? (
        <div className="w-full flex gap-2">
          <button
            onClick={onRemoveFromCart}
            className="flex-1 px-3 py-2 text-sm font-medium text-destructive border border-destructive rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            Retirer
          </button>
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 px-3 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Modifier
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={onAddToCart}
          className="w-full px-3 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Ajouter
        </button>
      )}
    </div>
  );
}
