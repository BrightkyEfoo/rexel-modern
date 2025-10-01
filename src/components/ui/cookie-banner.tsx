'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, Settings, Cookie, Shield, BarChart3, Target } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { useCookieConsent } from '@/lib/hooks/useCookieConsent';
import { COOKIE_CATEGORIES } from '@/lib/types/cookies';
import { CookieConsentService } from '@/lib/services/cookie-consent';

interface CookieBannerProps {
  position?: 'bottom' | 'top';
  theme?: 'light' | 'dark';
  showCloseButton?: boolean;
}

export function CookieBanner({ 
  position = 'bottom', 
  theme = 'light',
  showCloseButton = true 
}: CookieBannerProps) {
  const { showBanner, acceptAll, rejectAll, hideBanner } = useCookieConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [customConsent, setCustomConsent] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  if (!showBanner) return null;

  const handleCustomSave = () => {
    CookieConsentService.saveConsent(customConsent);
  };

  const toggleCategory = (category: keyof typeof customConsent) => {
    if (category === 'necessary') return; // Les cookies nécessaires ne peuvent pas être désactivés
    
    setCustomConsent(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'necessary': return <Shield className="w-4 h-4" />;
      case 'functional': return <Settings className="w-4 h-4" />;
      case 'analytics': return <BarChart3 className="w-4 h-4" />;
      case 'marketing': return <Target className="w-4 h-4" />;
      default: return <Cookie className="w-4 h-4" />;
    }
  };

  const positionClasses = position === 'bottom' 
    ? 'bottom-0 left-0 w-screen' 
    : 'top-0 left-0 w-screen';

  const themeClasses = theme === 'dark'
    ? 'bg-gray-900 text-white border-gray-700'
    : 'bg-background text-gray-900 border-gray-200';

  return (
    <div
      className={`fixed ${positionClasses} z-50 p-4 shadow-2xl border-t ${themeClasses}`}
    >
      <div className="max-w-7xl mx-auto">
        <Card className={`${themeClasses} shadow-lg`}>
          <CardContent className="p-6 relative">
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={hideBanner}
                className="absolute top-2 right-2"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            {!showDetails ? (
              // Vue simplifiée
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Cookie className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Nous utilisons des cookies
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Nous utilisons des cookies pour améliorer votre expérience
                      sur notre site, analyser le trafic et personnaliser le
                      contenu. Vous pouvez choisir quels cookies accepter.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {COOKIE_CATEGORIES.length} catégories
                      </Badge>
                      <Link
                        href="/cookies/politique"
                        className="text-xs text-primary hover:underline"
                      >
                        En savoir plus
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetails(true)}
                    className="flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Personnaliser
                  </Button>
                  <Button variant="outline" size="sm" onClick={rejectAll}>
                    Rejeter tout
                  </Button>
                  <Button
                    size="sm"
                    onClick={acceptAll}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Accepter tout
                  </Button>
                </div>
              </div>
            ) : (
              // Vue détaillée
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Cookie className="w-6 h-6 text-primary" />
                    <h3 className="font-semibold text-lg">
                      Préférences des cookies
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid gap-4 mb-6">
                  {COOKIE_CATEGORIES.map((category) => {
                    const isEnabled =
                      customConsent[category.id as keyof typeof customConsent];

                    return (
                      <div
                        key={category.id}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          isEnabled
                            ? "border-primary bg-primary/5"
                            : "border-border bg-muted/30"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {getCategoryIcon(category.id)}
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{category.name}</h4>
                                {category.required && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Requis
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {category.description}
                              </p>
                              <details className="text-xs text-muted-foreground">
                                <summary className="cursor-pointer hover:text-foreground">
                                  Voir les cookies ({category.cookies.length})
                                </summary>
                                <div className="mt-2 space-y-1">
                                  {category.cookies.map((cookie, index) => (
                                    <div
                                      key={index}
                                      className="pl-2 border-l-2 border-muted"
                                    >
                                      <div className="font-medium">
                                        {cookie.name}
                                      </div>
                                      <div>{cookie.purpose}</div>
                                      <div className="text-muted-foreground">
                                        Durée: {cookie.duration} •{" "}
                                        {cookie.type === "first-party"
                                          ? "Première partie"
                                          : "Tierce partie"}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </details>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                toggleCategory(
                                  category.id as keyof typeof customConsent
                                )
                              }
                              disabled={category.required}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                                isEnabled ? "bg-primary" : "bg-gray-200"
                              } ${
                                category.required
                                  ? "opacity-50 cursor-not-allowed"
                                  : "cursor-pointer"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  isEnabled ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 justify-end">
                  <Button variant="outline" onClick={rejectAll}>
                    Rejeter tout
                  </Button>
                  <Button variant="outline" onClick={acceptAll}>
                    Accepter tout
                  </Button>
                  <Button
                    onClick={handleCustomSave}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Sauvegarder mes préférences
                  </Button>
                </div>

                <div className="mt-4 pt-4 border-t text-center">
                  <p className="text-xs text-muted-foreground">
                    Vous pouvez modifier vos préférences à tout moment dans{" "}
                    <Link
                      href="/cookies/preferences"
                      className="text-primary hover:underline"
                    >
                      les paramètres des cookies
                    </Link>{" "}
                    ou consulter notre{" "}
                    <Link
                      href="/cookies/politique"
                      className="text-primary hover:underline"
                    >
                      politique des cookies
                    </Link>
                    .
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
