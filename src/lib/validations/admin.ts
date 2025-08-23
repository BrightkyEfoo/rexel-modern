import { z } from 'zod';

/**
 * Validation pour la connexion admin
 */
export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide')
    .max(100, 'L\'email ne peut pas dépasser 100 caractères'),
  
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .max(100, 'Le mot de passe ne peut pas dépasser 100 caractères')
});

export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

/**
 * Validation pour les changements de mot de passe admin
 */
export const adminChangePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Le mot de passe actuel est requis'),
  
  newPassword: z
    .string()
    .min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères')
    .max(100, 'Le mot de passe ne peut pas dépasser 100 caractères'),
  
  confirmPassword: z
    .string()
    .min(1, 'La confirmation du mot de passe est requise')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
});

export type AdminChangePasswordFormData = z.infer<typeof adminChangePasswordSchema>;
