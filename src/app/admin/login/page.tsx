"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Logo } from '@/components/ui/logo';
import { Shield, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useLogin, useAuth } from '@/lib/auth/nextauth-hooks';
import { adminLoginSchema, type AdminLoginFormData } from '@/lib/validations/admin';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  
  // Hooks NextAuth
  const { user, isAuthenticated, hasRole } = useAuth();
  const loginMutation = useLogin();
  
  // React Hook Form avec validation Zod
  const form = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Vérifier si l'utilisateur est déjà connecté et admin
  useEffect(() => {
    console.log('🔍 Effect - isAuthenticated:', isAuthenticated, 'hasRole admin:', hasRole('admin'), 'user:', user);
    if (isAuthenticated && hasRole('admin')) {
      console.log('✅ Redirecting to admin dashboard');
      router.push('/admin');
    }
  }, [isAuthenticated, hasRole, router, user]);

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      const result = await loginMutation.mutateAsync(data);
      console.log('🔍 Login result:', result);
      
      // Après un login réussi, vérifier les permissions et rediriger
      if (result?.ok) {
        // Attendre un petit délai pour que NextAuth mette à jour la session
        setTimeout(() => {
          console.log('🔍 Current user after delay:', user);
          console.log('🔍 Is authenticated after delay:', isAuthenticated);
          console.log('🔍 User type after delay:', user?.type);
          console.log('🔍 Has admin role after delay:', hasRole('admin'));
          
          if (isAuthenticated && hasRole('admin')) {
            console.log('✅ Admin authenticated, redirecting to /admin');
            router.push('/admin');
          } else if (isAuthenticated && !hasRole('admin')) {
            console.log('🔍 User authenticated but not admin - type:', user?.type);
            form.setError('root', {
              message: 'Vous n\'avez pas les permissions administrateur'
            });
          }
        }, 1000);
      }
      
    } catch (error) {
      console.log('🔍 Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="md" showText={false} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Administration
          </h1>
          <p className="text-muted-foreground">
            Connexion au panel d'administration
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Authentification Administrateur</CardTitle>
            <CardDescription>
              Veuillez vous connecter avec vos identifiants administrateur
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {(loginMutation.error || form.formState.errors.root) && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {form.formState.errors.root?.message || 
                       loginMutation.error?.message || 
                       'Erreur lors de la connexion'}
                    </AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email administrateur"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mot de passe admin"
                            autoComplete="current-password"
                            className="pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connexion...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Se connecter</span>
                    </div>
                  )}
                </Button>
              </form>
            </Form>

            {/* Informations importantes */}
            <div className="mt-6 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground text-center mb-2">
                <strong>Accès réservé aux administrateurs</strong>
              </p>
              <p className="text-xs text-muted-foreground text-center">
                Seuls les comptes avec des permissions administrateur<br />
                peuvent accéder à cette interface
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Retour au site - sans suggestion de création de compte */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Retour au site
          </Button>
        </div>
      </div>
    </div>
  );
}
