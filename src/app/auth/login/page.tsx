'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormField } from '@/components/ui/form-field';
import { useLogin, useAuthUser } from '@/lib/auth/auth-hooks';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { appConfig } from '@/lib/config/app';
import { Logo } from '@/components/ui/logo';
import { useAuthRedirect } from '@/lib/hooks/useAuthRedirect';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthUser();
  const loginMutation = useLogin();
  const { redirectAfterAuth } = useAuthRedirect();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      redirectAfterAuth();
    }
  }, [isAuthenticated, redirectAfterAuth]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      
      // Connexion réussie - rediriger vers la page précédente
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté à votre compte.",
      });
      
      redirectAfterAuth();
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'type' in error &&
        error.type === 'VERIFICATION_REQUIRED'
      ) {
        // Compte non vérifié - rediriger vers OTP (pas de redirection vers previous URL)
        const verificationError = error as {
          type: 'VERIFICATION_REQUIRED';
          userId: number;
          email: string;
        };
        
        toast({
          title: "Vérification requise",
          description: "Votre compte doit être vérifié. Un code vous a été envoyé par email.",
          variant: "default",
        });
        
        const params = new URLSearchParams({
          userId: verificationError.userId.toString(),
          email: verificationError.email,
        });
        router.push(`/auth/verify-otp?${params.toString()}`);
      } else {
        // Erreur de connexion
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <Logo variant="light" size="md" showText={false} />
            <div className="text-left">
              <div className="text-xl font-bold text-primary">{appConfig.name}</div>
              <div className="text-xs text-muted-foreground">{appConfig.country}</div>
            </div>
          </Link>

          <h2 className="text-2xl font-bold text-center mb-2">Connexion</h2>
          <p className="text-muted-foreground text-center mb-6">
            Accédez à votre compte KesiMarket
          </p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Error Alert */}
            {loginMutation.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {loginMutation.error.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Email Field */}
            <FormField
              name="email"
              label="Adresse email"
              type="email"
              placeholder="votre.email@entreprise.com"
              register={register}
              error={errors.email}
              disabled={loginMutation.isPending}
              required
              icon={Mail}
            />

            {/* Password Field */}
            <FormField
              name="password"
              label="Mot de passe"
              type="password"
              placeholder="Votre mot de passe"
              register={register}
              error={errors.password}
              disabled={loginMutation.isPending}
              required
              icon={Lock}
              showPasswordToggle
              onTogglePassword={() => setShowPassword(!showPassword)}
              showPassword={showPassword}
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-foreground">
                  Se souvenir de moi
                </label>
              </div>

              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
              disabled={loginMutation.isPending || !isValid}
            >
              {loginMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connexion...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Se connecter</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{' '}
              <Link
                href="/auth/register"
                className="font-medium text-primary hover:text-primary/80"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-card rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Pourquoi créer un compte KesiMarket ?</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Prix personnalisés et remises exclusives</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Suivi de commandes en temps réel</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Historique d'achats et favoris</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Support client dédié</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
