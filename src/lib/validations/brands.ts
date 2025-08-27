import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(255, "Le nom ne peut pas dépasser 255 caractères"),
  description: z.string().optional(),
  logoUrl: z.string().optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string().optional(),
    isMain: z.boolean().optional(),
  })).optional(),
});

export const updateBrandSchema = brandSchema.partial();

export type BrandFormData = z.infer<typeof brandSchema>;
export type UpdateBrandFormData = z.infer<typeof updateBrandSchema>;

export const bulkDeleteBrandsSchema = z.object({
  brandIds: z.array(z.string()).min(1, "Sélectionnez au moins une marque à supprimer").transform((val) => {
    return val.map(id => parseInt(id)).filter(id => !isNaN(id));
  }),
});

export type BulkDeleteBrandsFormData = z.infer<typeof bulkDeleteBrandsSchema>;
