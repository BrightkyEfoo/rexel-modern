'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  className,
}: OTPInputProps) {
  const [focusedIndex, setFocusedIndex] = React.useState<number>(0);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const digits = value.split('').slice(0, length);
  while (digits.length < length) {
    digits.push('');
  }

  const handleChange = (index: number, newValue: string) => {
    // Ne garder que les chiffres
    const sanitizedValue = newValue.replace(/\D/g, '');
    
    if (sanitizedValue.length > 1) {
      // Si on colle plusieurs chiffres
      const newDigits = [...digits];
      const pastedDigits = sanitizedValue.split('').slice(0, length - index);
      
      pastedDigits.forEach((digit, i) => {
        if (index + i < length) {
          newDigits[index + i] = digit;
        }
      });
      
      const newValue = newDigits.join('');
      onChange(newValue);
      
      // Focus sur le prochain input libre ou le dernier
      const nextIndex = Math.min(index + pastedDigits.length, length - 1);
      setFocusedIndex(nextIndex);
      inputRefs.current[nextIndex]?.focus();
      
      if (newValue.length === length) {
        onComplete?.(newValue);
      }
    } else {
      // Un seul chiffre
      const newDigits = [...digits];
      newDigits[index] = sanitizedValue;
      const newValue = newDigits.join('');
      onChange(newValue);
      
      if (sanitizedValue && index < length - 1) {
        // Passer au suivant
        setFocusedIndex(index + 1);
        inputRefs.current[index + 1]?.focus();
      }
      
      if (newValue.length === length) {
        onComplete?.(newValue);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Si backspace sur un input vide, aller au précédent
      setFocusedIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setFocusedIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      setFocusedIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    if (pastedData) {
      const newValue = pastedData.slice(0, length);
      onChange(newValue);
      
      if (newValue.length === length) {
        onComplete?.(newValue);
        inputRefs.current[length - 1]?.focus();
      } else {
        inputRefs.current[newValue.length]?.focus();
      }
    }
  };

  return (
    <div className={cn('flex gap-2 justify-center', className)}>
      {digits.map((digit, index) => (
        <Input
          key={index}
          ref={(el: HTMLInputElement | null) => {
            if (el) {
              inputRefs.current[index] = el;
            }
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            'w-12 h-12 text-center text-lg font-mono font-bold',
            'border-2 rounded-lg',
            focusedIndex === index && 'border-primary ring-2 ring-primary/20',
            digit && 'border-primary bg-primary/5',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}
