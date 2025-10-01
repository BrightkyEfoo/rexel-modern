'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Cookie, Shield, Settings, BarChart3, Target, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCookieConsent } from '@/lib/hooks/useCookieConsent';
import { COOKIE_CATEGORIES, CookieConsent } from '@/lib/types/cookies';
import { CookieConsentService } from '@/lib/services/cookie-consent';
import { useToast } from '@/hooks/use-toast';

export default function CookiePreferencesPage() {
  const { consent, isLoading } = useCookieConsent();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Charger les préférences actuelles
  useEffect(() => {
    if (consent) {
      const newPreferences = {
        necessary: consent.necessary,
        functional: consent.functional,
        analytics: consent.analytics,
        marketing: consent.marketing,
      };
      setPreferences(newPreferences);
    }
  }, [consent]);

  // Détecter les changements
  useEffect(() => {
    if (consent) {
      const hasChanged = 
        preferences.functional !== consent.functional ||
        preferences.analytics !== consent.analytics ||
        preferences.marketing !== consent.marketing;
      setHasChanges(hasChanged);
    }
  }, [preferences, consent]);

  const handleToggle = (category: keyof typeof preferences) => {
    if (category === 'necessary') return; // Ne peut pas être désactivé
    
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSave = () => {
    CookieConsentService.saveConsent(preferences);
    setHasChanges(false);
    toast({
      title: "Préférences sauvegardées",
      description: "Vos préférences de cookies ont été mises à jour avec succès.",
    });
  };

  const handleReset = () => {
    if (consent) {
      setPreferences({
        necessary: consent.necessary,
        functional: consent.functional,
        analytics: consent.analytics,
        marketing: consent.marketing,
      });
      setHasChanges(false);
    }
  };

  const handleAcceptAll = () => {
    setPreferences({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleRejectAll = () => {
    setPreferences({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'necessary': return <Shield className="w-5 h-5" />;
      case 'functional': return <Settings className="w-5 h-5" />;
      case 'analytics': return <BarChart3 className="w-5 h-5" />;
      case 'marketing': return <Target className="w-5 h-5" />;
      default: return <Cookie className="w-5 h-5" />;
    }
  };

  const getActiveCount = () => {
    return Object.values(preferences).filter(Boolean).length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <Cookie className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Préférences des cookies</h1>
          </div>
          
          <p className="text-muted-foreground">
            Gérez vos préférences de cookies et contrôlez quelles données nous pouvons collecter.
          </p>
          
          <div className="flex items-center gap-4 mt-4">
            <Badge variant="secondary">
              {getActiveCount()}/{COOKIE_CATEGORIES.length} catégories actives
            </Badge>
            <Badge variant="outline">
              Dernière mise à jour: {consent?.timestamp ? new Date(consent.timestamp).toLocaleDateString('fr-FR') : 'Jamais'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Actions rapides */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={handleAcceptAll}
                className="flex items-center gap-2"
              >
                <Cookie className="w-4 h-4" />
                Accepter tout
              </Button>
              <Button
                variant="outline"
                onClick={handleRejectAll}
                className="flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Cookies essentiels uniquement
              </Button>
              {hasChanges && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Annuler les modifications
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Catégories de cookies */}
        <div className="space-y-6">
          {COOKIE_CATEGORIES.map((category) => {
            const isEnabled = preferences[category.id as keyof typeof preferences];
            
            return (
              <Card key={category.id} className={`transition-all ${isEnabled ? 'ring-2 ring-primary/20' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(category.id)}
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          {category.name}
                          {category.required && (
                            <Badge variant="secondary" className="text-xs">
                              Requis
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <button
                        onClick={() => handleToggle(category.id as keyof typeof preferences)}
                        disabled={category.required}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                          isEnabled 
                            ? 'bg-primary' 
                            : 'bg-gray-200'
                        } ${category.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-3">
                      <h4 className="font-medium text-sm">Cookies dans cette catégorie :</h4>
                      <div className="grid gap-3">
                        {category.cookies.map((cookie, index) => (
                          <div key={index} className="p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{cookie.name}</div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {cookie.purpose}
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                  <span>Durée: {cookie.duration}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {cookie.type === 'first-party' ? 'Première partie' : 'Tierce partie'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Actions de sauvegarde */}
        {hasChanges && (
          <Card className="mt-8 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Modifications non sauvegardées</h3>
                  <p className="text-sm text-muted-foreground">
                    Vous avez modifié vos préférences. N'oubliez pas de les sauvegarder.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleReset}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Sauvegarder
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informations supplémentaires */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Informations importantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Cookies nécessaires</h4>
                <p className="text-muted-foreground">
                  Ces cookies sont essentiels au fonctionnement du site et ne peuvent pas être désactivés. 
                  Ils incluent les cookies d'authentification et de sécurité.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Gestion des données</h4>
                <p className="text-muted-foreground">
                  Vos préférences sont stockées localement et respectées sur tous nos services. 
                  Vous pouvez les modifier à tout moment.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Questions ?</h4>
                <p className="text-muted-foreground">
                  Consultez notre{' '}
                  <Link href="/cookies/politique" className="text-primary hover:underline">
                    politique des cookies
                  </Link>
                  {' '}ou{' '}
                  <Link href="/contact" className="text-primary hover:underline">
                    contactez-nous
                  </Link>
                  {' '}pour plus d'informations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
