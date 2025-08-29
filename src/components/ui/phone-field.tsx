"use client";

import { forwardRef } from "react";
import { Phone, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCameroonPhone, getCameroonOperator } from "@/lib/utils/phone";
import { Input } from "./input";

interface PhoneFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: { message?: string };
  helperText?: string;
  showOperator?: boolean;
  showExamples?: boolean;
}

export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      showOperator = true,
      showExamples = true,
      value,
      onChange,
      onBlur,
      ...props
    },
    ref
  ) => {
    const operator =
      showOperator && value ? getCameroonOperator(value.toString()) : null;

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Formater le numéro lors de la perte de focus
      if (value && onChange) {
        const formattedValue = formatCameroonPhone(value.toString());
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: formattedValue,
          },
        } as React.FocusEvent<HTMLInputElement>;
        onChange(syntheticEvent as any);
      }
      onBlur?.(e);
    };

    return (
      <div className="space-y-2">
        {label && (
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              {label}
              {props.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </label>
          </div>
        )}

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-4 w-4 text-muted-foreground" />
          </div>

          <Input
            ref={ref}
            type="tel"
            className={cn(
              "pl-10 pr-10",
              error && "border-destructive focus:border-destructive",
              className
            )}
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            placeholder="6 12 34 56 78"
            {...props}
          />

          {operator && operator !== "Inconnu" && (
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
      </div>
    );
  }
);

PhoneField.displayName = "PhoneField";
