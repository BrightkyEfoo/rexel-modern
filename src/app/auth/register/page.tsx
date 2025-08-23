'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, User, Building2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormField } from '@/components/ui/form-field';
import { FormCheckbox } from '@/components/ui/form-checkbox';
import { PhoneField } from '@/components/ui/phone-field';
import { useRegister, useAuth } from '@/lib/auth/nextauth-hooks';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';
import { appConfig } from '@/lib/config/app';
import { Logo } from '@/components/ui/logo';
import { useAuthRedirect } from '@/lib/hooks/useAuthRedirect';
import { useToast } from '@/hooks/use-toast';
import { preserveRedirectUrl } from '@/lib/utils/auth-redirect';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const registerMutation = useRegister();
  const { redirectAfterAuth } = useAuthRedirect();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const password = watch('password');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      redirectAfterAuth();
    }
  }, [isAuthenticated, redirectAfterAuth]);

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, acceptedTerms, ...registerData } = data;

    try {
      const response = await registerMutation.mutateAsync(registerData);
      
      // Inscription réussie - rediriger vers la page de connexion
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé. Veuillez vous connecter pour continuer.",
      });
      
      // Rediriger vers la page de connexion en préservant l'URL de redirection
      const loginPath = preserveRedirectUrl(searchParams, '/auth/login', {
        email: registerData.email
      });
      router.push(loginPath);
      
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'type' in error &&
        error.type === 'VERIFICATION_REQUIRED'
      ) {
        // Compte créé mais nécessite vérification - rediriger vers connexion
        const verificationError = error as {
          type: 'VERIFICATION_REQUIRED';
          userId: number;
          email: string;
        };
        
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé. Veuillez vous connecter pour continuer.",
        });
        
        // Rediriger vers la page de connexion
        const loginPath = preserveRedirectUrl(searchParams, '/auth/login', {
          email: verificationError.email
        });
        router.push(loginPath);
      } else {
        // Erreur d'inscription
        toast({
          title: "Erreur d'inscription",
          description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    }
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const strengthLabels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

    return {
      strength,
      label: strengthLabels[Math.min(strength, 4)],
      color: strengthColors[Math.min(strength, 4)]
    };
  };

  const passwordStrength = getPasswordStrength(password || '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <Logo variant="light" size="md" showText={false} />
            <div className="text-left">
              <div className="text-xl font-bold text-primary">{appConfig.name}</div>
              <div className="text-xs text-muted-foreground">{appConfig.country}</div>
            </div>
          </Link>

          <h2 className="text-2xl font-bold text-center mb-2">Créer un compte</h2>
          <p className="text-muted-foreground text-center mb-6">
            Rejoignez la communauté KesiMarket et profitez d'avantages exclusifs
          </p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Error Alert */}
            {registerMutation.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {registerMutation.error.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* First Name */}
              <FormField
                name="firstName"
                label="Prénom"
                type="text"
                placeholder="Jean"
                register={register}
                error={errors.firstName}
                disabled={registerMutation.isPending}
                required
                icon={User}
              />

              {/* Last Name */}
              <FormField
                name="lastName"
                label="Nom"
                type="text"
                placeholder="Dupont"
                register={register}
                error={errors.lastName}
                disabled={registerMutation.isPending}
                required
                icon={User}
              />
            </div>

            {/* Email */}
            <FormField
              name="email"
              label="Adresse email professionnelle"
              type="email"
              placeholder="jean.dupont@entreprise.com"
              register={register}
              error={errors.email}
              disabled={registerMutation.isPending}
              required
              icon={Mail}
            />

            {/* Company and Phone */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Company */}
              <FormField
                name="company"
                label="Entreprise"
                type="text"
                placeholder="Nom de votre entreprise"
                register={register}
                error={errors.company}
                disabled={registerMutation.isPending}
                icon={Building2}
              />

              {/* Phone */}
              <div>
                <PhoneField
                  label="Téléphone"
                  placeholder="+237 6XX XX XX XX ou 6XX XX XX XX"
                  error={errors.phone}
                  disabled={registerMutation.isPending}
                  showOperator={true}
                  showExamples={true}
                  helperText="Format camerounais uniquement"
                  {...register('phone')}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <FormField
                name="password"
                label="Mot de passe"
                type="password"
                placeholder="Créez un mot de passe sécurisé"
                register={register}
                error={errors.password}
                disabled={registerMutation.isPending}
                required
                icon={Lock}
                showPasswordToggle
                onTogglePassword={() => setShowPassword(!showPassword)}
                showPassword={showPassword}
              />

              {/* Password Strength */}
              {password && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{passwordStrength.label}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <FormField
              name="confirmPassword"
              label="Confirmer le mot de passe"
              type="password"
              placeholder="Confirmez votre mot de passe"
              register={register}
              error={errors.confirmPassword}
              disabled={registerMutation.isPending}
              required
              icon={Lock}
              showPasswordToggle
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              showPassword={showConfirmPassword}
            />

            {/* Terms and Conditions */}
            <FormCheckbox
              name="acceptedTerms"
              register={register}
              error={errors.acceptedTerms}
              disabled={registerMutation.isPending}
              label={
                <>
                  J'accepte les{' '}
                  <Link href="/conditions-utilisation" className="text-primary hover:text-primary/80 font-medium">
                    conditions d'utilisation
                  </Link>{' '}
                  et la{' '}
                  <Link href="/politique-confidentialite" className="text-primary hover:text-primary/80 font-medium">
                    politique de confidentialité
                  </Link>
                </>
              }
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
              disabled={registerMutation.isPending || !isValid}
            >
              {registerMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Création du compte...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Créer mon compte</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Déjà un compte ?{' '}
              <Link
                href={preserveRedirectUrl(searchParams, '/auth/login')}
                className="font-medium text-primary hover:text-primary/80"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-card rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Les avantages de votre compte KesiMarket</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Prix préférentiels</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Suivi de commandes</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Support prioritaire</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Offres exclusives</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
