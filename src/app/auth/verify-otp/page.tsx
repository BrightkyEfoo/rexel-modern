/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OTPInput } from '@/components/ui/otp-input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Logo } from '@/components/ui/logo';
import { useAuthRedirect } from '@/lib/hooks/useAuthRedirect';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, RefreshCw } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { otpSchema, type OtpFormData } from '@/lib/validations/auth';
import { apiClient } from '@/lib/api/client';

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { redirectAfterAuth } = useAuthRedirect();
  const { toast } = useToast();
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const userId = searchParams.get('userId');
  const email = searchParams.get('email');

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { isValid },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      userId: userId ? parseInt(userId) : 0,
      otp: '',
    },
  });

  const otp = watch('otp');

  // Mutation pour vérifier l'OTP
  const verifyOtpMutation = useMutation({
    mutationFn: async (data: OtpFormData) => {
      const response = await apiClient.post<{
        message: string;
        data: {
          user: any;
          token: string;
        };
      }>('/opened/auth/verify-otp', data);
      return response.data;
    },
    onSuccess: (data) => {
      // Sauvegarder le token
      localStorage.setItem('rexel_access_token', data.data.token);
      localStorage.setItem('rexel_user', JSON.stringify(data.data.user));
      
      // Vérification réussie - rediriger vers la page précédente
      toast({
        title: "Compte vérifié",
        description: "Votre compte a été vérifié avec succès. Bienvenue !",
      });
      
      // Rediriger vers la page sauvegardée ou l'accueil
      redirectAfterAuth();
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || 'Code de vérification invalide';
      setError(errorMessage);
      setValue('otp', '');
      
      toast({
        title: "Code invalide",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Mutation pour renvoyer l'OTP
  const resendOtpMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/opened/auth/resend-otp', {
        userId: parseInt(userId!),
      });
      return response.data;
    },
    onSuccess: () => {
      setCountdown(60); // 1 minute de cooldown
      setValue('otp', '');
      setError('');
      
      toast({
        title: "Code renvoyé",
        description: "Un nouveau code de vérification vous a été envoyé par email.",
      });
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || 'Erreur lors du renvoi du code';
      setError(errorMessage);
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!userId || !email) {
      router.push('/auth/login');
    }
  }, [userId, email, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmit = (data: OtpFormData) => {
    verifyOtpMutation.mutate(data);
  };

  const handleOtpComplete = (otpValue: string) => {
    setValue('otp', otpValue);
    if (otpValue.length === 6 && userId) {
      verifyOtpMutation.mutate({
        userId: parseInt(userId),
        otp: otpValue,
      });
    }
  };

  const handleResendOTP = () => {
    if (!userId || countdown > 0) return;
    resendOtpMutation.mutate();
  };

  if (!userId || !email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto mb-4">
                <Logo variant="light" size="lg" showText={false} />
              </div>
              <CardTitle className="text-2xl">Vérification de votre email</CardTitle>
              <CardDescription>
                Nous avons envoyé un code de vérification à<br />
                <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Entrez le code à 6 chiffres reçu par email
                  </p>
                  
                  <OTPInput
                    length={6}
                    value={otp}
                    onChange={(value) => setValue('otp', value)}
                    onComplete={handleOtpComplete}
                    disabled={verifyOtpMutation.isPending}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={!isValid || verifyOtpMutation.isPending}
                  className="w-full"
                  size="lg"
                >
                  {verifyOtpMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Vérifier le code
                </Button>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="text-center text-sm text-muted-foreground">
                  <Mail className="inline-block w-4 h-4 mr-1" />
                  Vous n'avez pas reçu le code ?
                </div>
                
                <Button
                  variant="outline"
                  onClick={handleResendOTP}
                  disabled={countdown > 0 || resendOtpMutation.isPending}
                  className="w-full"
                >
                  {resendOtpMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {!resendOtpMutation.isPending && <RefreshCw className="mr-2 h-4 w-4" />}
                  {countdown > 0
                    ? `Renvoyer dans ${countdown}s`
                    : 'Renvoyer le code'
                  }
                </Button>
              </div>

              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/auth/login')}
                  className="text-sm"
                >
                  ← Retour à la connexion
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
