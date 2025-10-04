/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from "zod";

/**
 * Schéma pour valider un champ numérique depuis un input string
 * Les inputs HTML renvoient toujours des strings, donc on valide d'abord le string
 * puis on le transforme en number si valide
 */
export const numericStringSchema = (options: {
  min?: number;
  max?: number;
  positive?: boolean;
  integer?: boolean;
  required?: boolean;
  fieldName?: string;
} = {}) => {
  const {
    min,
    max,
    positive = false,
    integer = false,
    required = true,
    fieldName = "Ce champ"
  } = options;

  let schema = z.string();

  if (!required) {
    // @ts-expect-error should throw error
    schema = schema.optional();
  }

  return schema
    .refine((val) => {
      // Si optionnel et vide, c'est valide
      if (!required && (!val || val.trim() === "")) {
        return true;
      }
      
      // Si requis et vide, c'est invalide
      if (required && (!val || val.trim() === "")) {
        return false;
      }

      // Vérifier si c'est un nombre valide
      const num = parseFloat(val);
      return !isNaN(num) && isFinite(num);
    }, {
      message: required ? 
        `${fieldName} est requis et doit être un nombre valide` : 
        `${fieldName} doit être un nombre valide`
    })
    .refine((val) => {
      if (!required && (!val || val.trim() === "")) return true;
      
      const num = parseFloat(val);
      if (integer && !Number.isInteger(num)) {
        return false;
      }
      return true;
    }, {
      message: `${fieldName} doit être un nombre entier`
    })
    .refine((val) => {
      if (!required && (!val || val.trim() === "")) return true;
      
      const num = parseFloat(val);
      if (positive && num <= 0) {
        return false;
      }
      return true;
    }, {
      message: `${fieldName} doit être positif`
    })
    .refine((val) => {
      if (!required && (!val || val.trim() === "")) return true;
      
      const num = parseFloat(val);
      if (min !== undefined && num < min) {
        return false;
      }
      return true;
    }, {
      message: `${fieldName} doit être supérieur ou égal à ${min}`
    })
    .refine((val) => {
      if (!required && (!val || val.trim() === "")) return true;
      
      const num = parseFloat(val);
      if (max !== undefined && num > max) {
        return false;
      }
      return true;
    }, {
      message: `${fieldName} doit être inférieur ou égal à ${max}`
    })
    .transform((val) => {
      // Si optionnel et vide, retourner undefined
      if (!required && (!val || val.trim() === "")) {
        return undefined;
      }
      // Sinon, convertir en number
      return parseFloat(val);
    });
};

/**
 * Schémas prédéfinis pour les cas courants
 */
export const priceSchema = numericStringSchema({
  positive: true,
  min: 0,
  fieldName: "Le prix"
});

export const optionalPriceSchema = numericStringSchema({
  positive: true,
  min: 0,
  required: false,
  fieldName: "Le prix"
});

export const stockQuantitySchema = numericStringSchema({
  min: 0,
  integer: true,
  fieldName: "La quantité en stock"
});

export const idSchema = numericStringSchema({
  positive: true,
  integer: true,
  fieldName: "L'identifiant"
});

export const optionalIdSchema = numericStringSchema({
  positive: true,
  integer: true,
  required: false,
  fieldName: "L'identifiant"
});

/**
 * Utilitaire pour convertir une valeur number en string pour les inputs
 */
export const numberToString = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null) return "";
  return value.toString();
};

/**
 * Utilitaire pour convertir une string d'input en number
 */
export const stringToNumber = (value: string): number | undefined => {
  if (!value || value.trim() === "") return undefined;
  const num = parseFloat(value);
  return isNaN(num) || !isFinite(num) ? undefined : num;
};
