"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormField } from "@/components/ui/form-field";
import { appConfig } from "@/lib/config/app";
import { Logo } from "@/components/ui/logo";
import { useToast } from "@/hooks/use-toast";
import { useResetPassword } from "@/lib/hooks/useResetPassword";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string().min(8, "Veuillez confirmer votre mot de passe"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const resetPasswordMutation = useResetPassword();
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const password = watch("password");

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      toast({
        title: "Lien invalide",
        description: "Le lien de réinitialisation est invalide ou a expiré.",
        variant: "destructive",
      });
      router.push("/auth/forgot-password");
      return;
    }
    setToken(tokenParam);
  }, [searchParams, router, toast]);

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ["Très faible", "Faible", "Moyen", "Fort", "Très fort"];
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ];

    return {
      strength,
      label: labels[strength - 1] || "",
      color: colors[strength - 1] || "bg-gray-300",
    };
  };

  const passwordStrength = getPasswordStrength(password || "");

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    try {
      await resetPasswordMutation.mutateAsync({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      setIsSuccess(true);
    } catch (error) {
      // L'erreur est déjà gérée par la mutation
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted to-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-2 mb-8">
              <Logo variant="light" size="md" showText={false} />
              <div className="text-left">
                <div className="text-xl font-bold text-primary">
                  {appConfig.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {appConfig.country}
                </div>
              </div>
            </Link>

            <h2 className="text-2xl font-bold text-center mb-2">
              Mot de passe réinitialisé
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              Votre mot de passe a été mis à jour avec succès
            </p>
          </div>

          {/* Success Message */}
          <div className="bg-card rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>

              <h3 className="text-lg font-semibold mb-4">
                Réinitialisation réussie
              </h3>

              <p className="text-muted-foreground mb-6">
                Votre nouveau mot de passe a été enregistré. Vous pouvez
                maintenant vous connecter avec vos nouveaux identifiants.
              </p>

              <Link href="/auth/login">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Se connecter maintenant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted to-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-card rounded-2xl shadow-lg p-8 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Lien invalide</h3>
            <p className="text-muted-foreground mb-4">
              Le lien de réinitialisation est invalide ou a expiré.
            </p>
            <Link href="/auth/forgot-password">
              <Button variant="outline" className="w-full">
                Demander un nouveau lien
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <Logo variant="light" size="md" showText={false} />
            <div className="text-left">
              <div className="text-xl font-bold text-primary">
                {appConfig.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {appConfig.country}
              </div>
            </div>
          </Link>

          <h2 className="text-2xl font-bold text-center mb-2">
            Nouveau mot de passe
          </h2>
          <p className="text-muted-foreground text-center mb-6">
            Choisissez un mot de passe sécurisé pour votre compte
          </p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Password Field */}
            <div>
              <FormField
                name="password"
                label="Nouveau mot de passe"
                type={showPassword ? "text" : "password"}
                placeholder="Votre nouveau mot de passe"
                register={register}
                error={errors.password}
                disabled={resetPasswordMutation.isPending}
                required
                icon={Lock}
                showPasswordToggle
                onTogglePassword={() => setShowPassword(!showPassword)}
                showPassword={showPassword}
              />

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{
                          width: `${(passwordStrength.strength / 5) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <FormField
              name="confirmPassword"
              label="Confirmer le mot de passe"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmez votre nouveau mot de passe"
              register={register}
              error={errors.confirmPassword}
              disabled={resetPasswordMutation.isPending}
              required
              icon={Lock}
              showPasswordToggle
              onTogglePassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              showPassword={showConfirmPassword}
            />

            {/* Password Requirements */}
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium mb-2 text-sm">
                Exigences du mot de passe :
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li
                  className={
                    password && password.length >= 8 ? "text-green-600" : ""
                  }
                >
                  • Au moins 8 caractères
                </li>
                <li
                  className={
                    password && /[A-Z]/.test(password) ? "text-green-600" : ""
                  }
                >
                  • Une lettre majuscule
                </li>
                <li
                  className={
                    password && /[a-z]/.test(password) ? "text-green-600" : ""
                  }
                >
                  • Une lettre minuscule
                </li>
                <li
                  className={
                    password && /[0-9]/.test(password) ? "text-green-600" : ""
                  }
                >
                  • Un chiffre
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
              disabled={resetPasswordMutation.isPending || !isValid}
            >
              {resetPasswordMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Réinitialisation...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Réinitialiser le mot de passe</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-muted to-background flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
