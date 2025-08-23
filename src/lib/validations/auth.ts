import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, "Le prénom est requis")
    .min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z
    .string()
    .min(1, "Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
    ),
  confirmPassword: z
    .string()
    .min(1, "Veuillez confirmer le mot de passe"),
  company: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (phone) => {
        if (!phone) return true;
        const cleanPhone = phone.replace(/\s/g, '');
        
        // Format international : +237 6XX XX XX XX
        const internationalPattern = /^\+237[67]\d{8}$/;
        
        // Format national : 6XX XX XX XX (commençant par 6 ou 7)
        const nationalPattern = /^[67]\d{8}$/;
        
        return internationalPattern.test(cleanPhone) || nationalPattern.test(cleanPhone);
      },
      "Format de téléphone camerounais invalide (ex: +237 6XX XX XX XX ou 6XX XX XX XX)"
    ),
  acceptedTerms: z
    .boolean()
    .refine(val => val === true, "Vous devez accepter les conditions d'utilisation"),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  }
);

export const otpSchema = z.object({
  userId: z.number().positive("ID utilisateur invalide"),
  otp: z
    .string()
    .min(6, "Le code doit contenir 6 chiffres")
    .max(6, "Le code doit contenir 6 chiffres")
    .regex(/^\d{6}$/, "Le code doit contenir uniquement des chiffres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
