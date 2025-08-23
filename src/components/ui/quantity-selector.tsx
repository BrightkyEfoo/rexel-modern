'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  /** Quantité actuelle sélectionnée */
  quantity: number;
  /** Fonction appelée lors du changement de quantité */
  onQuantityChange: (quantity: number) => void;
  /** Quantité minimum (défaut: 1) */
  min?: number;
  /** Quantité maximum (défaut: 99) */
  max?: number;
  /** Si le composant est désactivé */
  disabled?: boolean;
  /** Taille du composant */
  size?: 'sm' | 'md' | 'lg';
  /** Classes CSS additionnelles */
  className?: string;
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  disabled = false,
  size = 'md',
  className
}: QuantitySelectorProps) {
  const [isChanging, setIsChanging] = useState(false);

  const handleDecrease = () => {
    if (quantity > min && !disabled) {
      setIsChanging(true);
      onQuantityChange(quantity - 1);
      setTimeout(() => setIsChanging(false), 150);
    }
  };

  const handleIncrease = () => {
    if (quantity < max && !disabled) {
      setIsChanging(true);
      onQuantityChange(quantity + 1);
      setTimeout(() => setIsChanging(false), 150);
    }
  };

  const sizeClasses = {
    sm: {
      button: 'h-6 w-6 text-xs',
      input: 'h-6 w-10 text-xs',
      gap: 'gap-1'
    },
    md: {
      button: 'h-8 w-8 text-sm',
      input: 'h-8 w-12 text-sm',
      gap: 'gap-2'
    },
    lg: {
      button: 'h-10 w-10 text-base',
      input: 'h-10 w-14 text-base',
      gap: 'gap-3'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={cn("flex items-center", currentSize.gap, className)}>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          currentSize.button,
          "rounded-md shrink-0",
          {
            "opacity-50 cursor-not-allowed": quantity <= min || disabled
          }
        )}
        onClick={handleDecrease}
        disabled={quantity <= min || disabled}
      >
        <Minus className="w-3 h-3" />
      </Button>

      <div className={cn(
        "text-center font-medium border border-input rounded-md bg-background flex items-center justify-center transition-all duration-150",
        currentSize.input,
        {
          "scale-105 border-primary": isChanging,
          "opacity-50": disabled
        }
      )}>
        {quantity}
      </div>

      <Button
        variant="outline"
        size="icon"
        className={cn(
          currentSize.button,
          "rounded-md shrink-0",
          {
            "opacity-50 cursor-not-allowed": quantity >= max || disabled
          }
        )}
        onClick={handleIncrease}
        disabled={quantity >= max || disabled}
      >
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  );
}
