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
  // Gestion des fichiers
  files: z.array(z.object({
    url: z.string().url("URL de fichier invalide"),
    filename: z.string(),
    originalName: z.string(),
    size: z.number().positive(),
    mimeType: z.string(),
  })).optional(),
  // Informations additionnelles
  additionalInfo: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    sections: z.array(z.object({
      type: z.enum(['list', 'text', 'table', 'steps', 'warnings', 'tips']),
      title: z.string().optional(),
      subtitle: z.string().optional(),
      items: z.array(z.object({
        text: z.string(),
        icon: z.string().optional(),
        color: z.enum(['success', 'warning', 'error', 'info', 'default']).optional(),
      })).optional(),
      content: z.string().optional(),
      iconList: z.array(z.string()).optional(),
      order: z.number().optional(),
    })),
  }).optional(),
});

export const updateProductSchema = productSchema.partial();

export type ProductFormData = z.infer<typeof productSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;

export const bulkDeleteSchema = z.object({
  productIds: z.array(z.number().positive()).min(1, "Sélectionnez au moins un produit à supprimer"),
});

export type BulkDeleteFormData = z.infer<typeof bulkDeleteSchema>;
