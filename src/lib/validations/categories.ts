import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(255, "Le nom ne peut pas dépasser 255 caractères"),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  parentId: z.number().positive().optional(),
  sortOrder: z.number().min(0).optional(),
  // Gestion des images
  images: z.array(z.object({
    url: z.string().url("L'URL de l'image doit être valide"),
    alt: z.string().optional(),
    isMain: z.boolean().optional(),
  })).optional(),
});

export const updateCategorySchema = categorySchema.partial();

export type CategoryFormData = z.infer<typeof categorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;

export const bulkDeleteCategoriesSchema = z.object({
  categoryIds: z.array(z.string()).min(1, "Sélectionnez au moins une catégorie à supprimer").transform((val) => {
    return val.map(id => parseInt(id)).filter(id => !isNaN(id));
  }),
});

export type BulkDeleteCategoriesFormData = z.infer<typeof bulkDeleteCategoriesSchema>;
