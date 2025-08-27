import { z } from "zod";
import { 
  priceSchema, 
  optionalPriceSchema, 
  stockQuantitySchema, 
  optionalIdSchema 
} from "./common";

export const productSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(255, "Le nom ne peut pas dépasser 255 caractères"),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  sku: z.string().optional(),
  price: priceSchema,
  salePrice: optionalPriceSchema,
  stockQuantity: stockQuantitySchema,
  manageStock: z.boolean().optional(),
  inStock: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  brandId: optionalIdSchema,
  fabricationCountryCode: z.string().optional(),
  // Relations many-to-many avec les catégories
  categoryIds: z.array(z.string()).optional().transform((val) => {
    // Convertir les strings en numbers pour les IDs de catégories
    return val?.map(id => parseInt(id)).filter(id => !isNaN(id));
  }),
  // Gestion des images
  images: z.array(z.object({
    url: z.string().url("URL d'image invalide"),
    alt: z.string().optional(),
    isMain: z.boolean().default(false),
  })).optional(),
});

export const updateProductSchema = productSchema.partial();

export type ProductFormData = z.infer<typeof productSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;

export const bulkDeleteSchema = z.object({
  productIds: z.array(z.number().positive()).min(1, "Sélectionnez au moins un produit à supprimer"),
});

export type BulkDeleteFormData = z.infer<typeof bulkDeleteSchema>;
