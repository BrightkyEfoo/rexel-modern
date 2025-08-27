"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/lib/hooks/useDebounce";

export interface UniqueValidationResponse {
  unique: boolean;
  message: string;
}

export interface UniqueInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidation?: (isValid: boolean, message?: string) => void;
  validateUnique: (
    value: string,
    entityId?: number
  ) => Promise<UniqueValidationResponse>;
  entityId?: number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  minLength?: number;
  debounceMs?: number;
}

export function UniqueInput({
  value,
  onChange,
  onValidation,
  validateUnique,
  entityId,
  placeholder,
  className,
  disabled = false,
  required = false,
  minLength = 1,
  debounceMs = 800, // Augmenté à 800ms pour réduire les appels
}: UniqueInputProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [validationState, setValidationState] = useState<
    "idle" | "valid" | "invalid"
  >("idle");
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [lastValidatedValue, setLastValidatedValue] = useState<string>(""); // Pour éviter les validations répétées

  // Debounce la valeur pour éviter trop de requêtes
  const debouncedValue = useDebounce(value, debounceMs);

  const validate = useCallback(
    async (inputValue: string) => {
      const trimmedValue = inputValue.trim();

      // Éviter de valider la même valeur plusieurs fois
      if (trimmedValue === lastValidatedValue) {
        return;
      }

      // Si vide et non requis, considérer comme valide
      if (!trimmedValue && !required) {
        setValidationState("idle");
        setValidationMessage("");
        setLastValidatedValue(trimmedValue);
        onValidation?.(true);
        return;
      }

      // Si trop court, ne pas valider côté serveur
      if (trimmedValue.length < minLength) {
        setValidationState("idle");
        setValidationMessage("");
        setLastValidatedValue(""); // Reset pour permettre la revalidation
        onValidation?.(false, `Minimum ${minLength} caractères requis`);
        return;
      }

      setIsValidating(true);
      setValidationState("idle");

      try {
        const result = await validateUnique(trimmedValue, entityId);
        setLastValidatedValue(trimmedValue); // Marquer comme validé

        if (result.unique) {
          setValidationState("valid");
          setValidationMessage(result.message);
          onValidation?.(true, result.message);
        } else {
          setValidationState("invalid");
          setValidationMessage(result.message);
          onValidation?.(false, result.message);
        }
      } catch (error) {
        setValidationState("invalid");
        const errorMessage = "Erreur lors de la validation";
        setValidationMessage(errorMessage);
        onValidation?.(false, errorMessage);
      } finally {
        setIsValidating(false);
      }
    },
    [
      validateUnique,
      entityId,
      required,
      minLength,
      onValidation,
      lastValidatedValue,
    ]
  );

  // Valider seulement quand la valeur debouncée change et est différente de la dernière validée
  useEffect(() => {
    if (
      debouncedValue !== undefined &&
      debouncedValue.trim() !== lastValidatedValue
    ) {
      validate(debouncedValue);
    }
  }, [debouncedValue, validate, lastValidatedValue]);

  // Reset l'état quand l'entityId change (passage création -> édition)
  useEffect(() => {
    setValidationState("idle");
    setValidationMessage("");
    setLastValidatedValue("");
  }, [entityId]);

  const getIconAndColor = () => {
    if (isValidating) {
      return {
        icon: (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        ),
        inputClass: "pr-10",
      };
    }

    switch (validationState) {
      case "valid":
        return {
          icon: <Check className="w-4 h-4 text-green-600" />,
          inputClass: "pr-10 border-green-500 focus:border-green-500",
        };
      case "invalid":
        return {
          icon: <X className="w-4 h-4 text-red-600" />,
          inputClass: "pr-10 border-red-500 focus:border-red-500",
        };
      default:
        return {
          icon: null,
          inputClass: "pr-4",
        };
    }
  };

  const { icon, inputClass } = getIconAndColor();

  return (
    <div className="">
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(inputClass, className)}
          disabled={disabled}
        />
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {icon}
          </div>
        )}
      </div>

      {validationMessage && (
        <p
          className={cn(
            "text-xs mt-1",
            validationState === "valid" ? "text-green-600" : "text-red-600"
          )}
        >
          {validationMessage}
        </p>
      )}
    </div>
  );
}

/**
 * Hook pour utiliser l'input unique avec gestion d'état simplifiée
 */
export function useUniqueInput(
  initialValue: string = "",
  validateUnique: (
    value: string,
    entityId?: number
  ) => Promise<UniqueValidationResponse>,
  entityId?: number
) {
  const [value, setValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState<string>("");

  const handleValidation = useCallback((valid: boolean, message?: string) => {
    setIsValid(valid);
    setValidationMessage(message || "");
  }, []);

  return {
    value,
    setValue,
    isValid,
    validationMessage,
    handleValidation,
    inputProps: {
      value,
      onChange: setValue,
      onValidation: handleValidation,
      validateUnique,
      entityId,
    },
  };
}
