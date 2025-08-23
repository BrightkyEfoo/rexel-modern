'use client';

import { forwardRef, useState } from 'react';
import { Phone, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCameroonPhone, getCameroonOperator, CAMEROON_PHONE_EXAMPLES } from '@/lib/utils/phone';

interface PhoneFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: { message?: string };
  helperText?: string;
  showOperator?: boolean;
  showExamples?: boolean;
  onValueChange?: (value: string) => void;
}

export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    showOperator = true, 
    showExamples = true,
    onValueChange,
    ...props 
  }, ref) => {
    const [value, setValue] = useState(props.value?.toString() || '');
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      
      // Permettre la saisie libre mais formater lors de la perte de focus
      setValue(newValue);
      onValueChange?.(newValue);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const formattedValue = formatCameroonPhone(value);
      setValue(formattedValue);
      onValueChange?.(formattedValue);
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const operator = showOperator && value ? getCameroonOperator(value) : null;

    return (
      <div className="space-y-2">
        {label && (
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              {label}
              {props.required && <span className="text-destructive ml-1">*</span>}
            </label>
            
            {showExamples && (
              <button 
                type="button" 
                className="text-muted-foreground hover:text-foreground"
                title={`Formats acceptés: ${CAMEROON_PHONE_EXAMPLES.slice(0, 3).join(', ')}`}
              >
                <Info className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <input
            ref={ref}
            type="tel"
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder="+237 6XX XX XX XX"
            {...props}
          />

          {operator && operator !== 'Inconnu' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {operator}
              </span>
            </div>
          )}
        </div>

        {helperText && !error && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}

        {error?.message && (
          <p className="text-xs text-destructive">{error.message}</p>
        )}

        {isFocused && showExamples && (
          <div className="text-xs text-muted-foreground">
            <p>Exemples : {CAMEROON_PHONE_EXAMPLES.slice(0, 2).join(', ')}</p>
          </div>
        )}
      </div>
    );
  }
);

PhoneField.displayName = 'PhoneField';
