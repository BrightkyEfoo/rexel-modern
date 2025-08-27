'use client';

import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/lib/stores/cart-store';
import { useCartSync } from '@/lib/hooks/useCartSync';
import { Logo } from '@/components/ui/logo';
import { formatPrice } from '@/lib/utils/currency';
import Link from 'next/link';
import { useState } from 'react';

interface CartPreviewProps {
  isAuthenticated: boolean;
}

export function CartPreview({ isAuthenticated }: CartPreviewProps) {
  const { isOpen, setCartOpen } = useCartStore();
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    totalItems, 
    totalPrice 
  } = useCartSync();
  
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {totalItems > 99 ? '99+' : totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Panier ({totalItems} {totalItems > 1 ? 'articles' : 'article'})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col grow mt-6">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Votre panier est vide</h3>
              <p className="text-muted-foreground mb-4">
                Découvrez nos produits et ajoutez-les à votre panier
              </p>
              <Button onClick={() => setCartOpen(false)} asChild>
                <Link href="/">Découvrir nos produits</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="flex-1 overflow-y-auto space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border border-border rounded-lg bg-card">
                    {/* Image */}
                    <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      {imageErrors[item.id] || !item.product.imageUrl ? (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Logo variant="light" size="sm" showText={false} />
                        </div>
                      ) : (
                        <img
                          src={item.product.files?.[0]?.url || item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(item.id)}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm leading-tight mb-1 line-clamp-2 text-foreground">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        SKU: {item.product.sku}
                      </p>
                      
                      {/* Prix */}
                      <div className="flex items-center gap-2 mb-2">
                        {item.product.salePrice ? (
                          <>
                            <span className="font-semibold text-sm text-foreground">
                              {formatPrice(item.product.salePrice)}
                            </span>
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPrice(item.product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="font-semibold text-sm text-foreground">
                            {formatPrice(item.product.price)}
                          </span>
                        )}
                      </div>

                      {/* Quantité et actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm text-foreground font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Total */}
              <div className="space-y-3 bg-muted/50 p-4 rounded-lg border border-border">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-lg text-foreground">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button asChild className="w-full" size="lg">
                    <Link href="/panier" onClick={() => setCartOpen(false)}>
                      Voir le panier
                    </Link>
                  </Button>
                  
                  {isAuthenticated && (
                    <Button asChild variant="outline" className="w-full" size="lg">
                      <Link href="/commandes" onClick={() => setCartOpen(false)}>
                        Passer commande
                      </Link>
                    </Button>
                  )}
                  
                  {!isAuthenticated && (
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-2">
                        Connectez-vous pour passer commande
                      </p>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/auth/login" onClick={() => setCartOpen(false)}>
                          Se connecter
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
