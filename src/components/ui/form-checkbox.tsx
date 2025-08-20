'use client';

import * as React from 'react';
import { UseFormRegister, FieldError, Path, FieldValues } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface FormCheckboxProps<T extends FieldValues> {
  name: Path<T>;
  label: React.ReactNode;
  register: UseFormRegister<T>;
  error?: FieldError;
  disabled?: boolean;
  className?: string;
}

export function FormCheckbox<T extends FieldValues>({
  name,
  label,
  register,
  error,
  disabled = false,
  className,
}: FormCheckboxProps<T>) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-start space-x-3">
        <input
          id={name}
          type="checkbox"
          {...register(name)}
          className={cn(
            'h-4 w-4 text-primary focus:ring-primary border-border rounded mt-1',
            error && 'border-destructive'
          )}
          disabled={disabled}
        />
        <label htmlFor={name} className="text-sm text-foreground">
          {label}
        </label>
      </div>
      {error && (
        <p className="text-sm text-destructive">{error.message}</p>
      )}
    </div>
  );
}
