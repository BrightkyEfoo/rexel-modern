/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import { OTPInput } from '@/components/ui/otp-input';
import { useToast } from '@/hooks/use-toast';
import { useResendOtp, useVerifyOtp } from '@/lib/auth/nextauth-hooks';
import { useAuthRedirect } from '@/lib/hooks/useAuthRedirect';
import { otpSchema, type OtpFormData } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, RefreshCw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

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

  const verifyOtpMutation = useVerifyOtp(redirectAfterAuth);

  const resendOtpMutation = useResendOtp();

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
    resendOtpMutation.mutate({
      userId: parseInt(userId),
    });
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
