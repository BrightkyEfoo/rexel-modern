'use client';

import { useState } from 'react';
import { Minus, Plus, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuantityControlsProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onEdit?: () => void;
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function QuantityControls({
  quantity,
  onQuantityChange,
  onEdit,
  className,
  disabled = false,
  min = 1,
  max = 99,
  size = 'md'
}: QuantityControlsProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDecrease = async () => {
    if (quantity > min && !disabled) {
      setIsUpdating(true);
      const newQuantity = quantity - 1;
      onQuantityChange(newQuantity);
      setTimeout(() => setIsUpdating(false), 200);
    }
  };

  const handleIncrease = async () => {
    if (quantity < max && !disabled) {
      setIsUpdating(true);
      const newQuantity = quantity + 1;
      onQuantityChange(newQuantity);
      setTimeout(() => setIsUpdating(false), 200);
    }
  };

  const sizeClasses = {
    sm: {
      button: 'h-7 w-7',
      text: 'text-sm',
      container: 'gap-1'
    },
    md: {
      button: 'h-8 w-8',
      text: 'text-sm',
      container: 'gap-2'
    },
    lg: {
      button: 'h-10 w-10',
      text: 'text-base',
      container: 'gap-3'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={cn("flex items-center justify-between w-full", currentSize.container, className)}>
      {/* Contrôle de quantité */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className={cn(currentSize.button, "rounded-md", {
            "opacity-50 cursor-not-allowed": quantity <= min || disabled
          })}
          onClick={handleDecrease}
          disabled={quantity <= min || disabled || isUpdating}
        >
          <Minus className="w-3 h-3" />
        </Button>

        <div className={cn(
          "min-w-[2rem] text-center font-medium transition-all duration-200 select-none",
          currentSize.text,
          {
            "scale-110 text-primary animate-pulse": isUpdating
          }
        )}>
          {quantity}
        </div>

        <Button
          variant="outline"
          size="icon"
          className={cn(currentSize.button, "rounded-md", {
            "opacity-50 cursor-not-allowed": quantity >= max || disabled
          })}
          onClick={handleIncrease}
          disabled={quantity >= max || disabled || isUpdating}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      {/* Bouton Modifier */}
      {onEdit && (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={onEdit}
          disabled={disabled}
        >
          <Edit3 className="w-4 h-4 mr-1" />
          Modifier
        </Button>
      )}
    </div>
  );
}

interface AddToCartButtonProps {
  onAdd: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function AddToCartButton({ 
  onAdd, 
  disabled = false, 
  className,
  children = "Ajouter au panier"
}: AddToCartButtonProps) {
  return (
    <Button
      className={cn("w-full", className)}
      onClick={onAdd}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}
