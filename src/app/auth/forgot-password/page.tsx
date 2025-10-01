'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowRight, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormField } from '@/components/ui/form-field';
import { appConfig } from '@/lib/config/app';
import { Logo } from '@/components/ui/logo';
import { useToast } from '@/hooks/use-toast';
import { useForgotPassword } from '@/lib/hooks/useForgotPassword';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Adresse email invalide'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const forgotPasswordMutation = useForgotPassword();
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);
      setSubmittedEmail(data.email);
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
                <div className="text-xl font-bold text-primary">{appConfig.name}</div>
                <div className="text-xs text-muted-foreground">{appConfig.country}</div>
              </div>
            </Link>

            <h2 className="text-2xl font-bold text-center mb-2">Email envoyé</h2>
            <p className="text-muted-foreground text-center mb-6">
              Vérifiez votre boîte de réception
            </p>
          </div>

          {/* Success Message */}
          <div className="bg-card rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              
              <h3 className="text-lg font-semibold mb-4">Instructions envoyées</h3>
              
              <p className="text-muted-foreground mb-6">
                Si l'adresse email <strong>{submittedEmail}</strong> est associée à un compte KesiMarket, 
                vous recevrez un lien de réinitialisation dans quelques minutes.
              </p>

              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">Que faire ensuite ?</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 text-left">
                    <li>• Vérifiez votre boîte de réception</li>
                    <li>• Regardez dans vos spams si nécessaire</li>
                    <li>• Cliquez sur le lien dans l'email</li>
                    <li>• Le lien expire dans 30 minutes</li>
                  </ul>
                </div>

                <div className="flex flex-col space-y-3">
                  <Button
                    onClick={() => {
                      setIsSuccess(false);
                      setSubmittedEmail('');
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Envoyer à une autre adresse
                  </Button>
                  
                  <Link href="/auth/login">
                    <Button variant="ghost" className="w-full">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Retour à la connexion
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
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
              <div className="text-xl font-bold text-primary">{appConfig.name}</div>
              <div className="text-xs text-muted-foreground">{appConfig.country}</div>
            </div>
          </Link>

          <h2 className="text-2xl font-bold text-center mb-2">Mot de passe oublié</h2>
          <p className="text-muted-foreground text-center mb-6">
            Entrez votre adresse email pour recevoir un lien de réinitialisation
          </p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <FormField
              name="email"
              label="Adresse email"
              type="email"
              placeholder="votre.email@entreprise.com"
              register={register}
              error={errors.email}
              disabled={forgotPasswordMutation.isPending}
              required
              icon={Mail}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
              disabled={forgotPasswordMutation.isPending || !isValid}
            >
              {forgotPasswordMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Envoi en cours...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Envoyer le lien</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Retour à la connexion
            </Link>
          </div>
        </div>

        {/* Help */}
        <div className="bg-card rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Besoin d'aide ?</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Vous ne recevez pas l'email ?</p>
                <p className="text-xs text-muted-foreground">Vérifiez vos spams ou contactez le support</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Pas encore de compte ?</p>
                <Link href="/auth/register" className="text-xs text-primary hover:text-primary/80">
                  Créer un compte gratuitement
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
