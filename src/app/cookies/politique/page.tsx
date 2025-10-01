'use client';

import Link from 'next/link';
import { ArrowLeft, Cookie, Shield, Settings, BarChart3, Target, ExternalLink, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { COOKIE_CATEGORIES } from '@/lib/types/cookies';
import { appConfig } from '@/lib/config/app';

export default function CookiePolicyPage() {
  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'necessary': return <Shield className="w-5 h-5" />;
      case 'functional': return <Settings className="w-5 h-5" />;
      case 'analytics': return <BarChart3 className="w-5 h-5" />;
      case 'marketing': return <Target className="w-5 h-5" />;
      default: return <Cookie className="w-5 h-5" />;
    }
  };

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
            <h1 className="text-3xl font-bold">Politique des cookies</h1>
          </div>
          
          <p className="text-muted-foreground">
            Découvrez comment nous utilisons les cookies sur {appConfig.name} et comment vous pouvez contrôler leur utilisation.
          </p>
          
          <div className="flex items-center gap-4 mt-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Dernière mise à jour: 30 septembre 2025
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Version 1.0
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Actions rapides */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold mb-1">Gérer vos préférences</h3>
                <p className="text-sm text-muted-foreground">
                  Vous pouvez modifier vos préférences de cookies à tout moment.
                </p>
              </div>
              <Link href="/cookies/preferences">
                <Button className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Gérer les cookies
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Introduction */}
        <div className="prose prose-gray max-w-none mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Qu'est-ce qu'un cookie ?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, tablette ou mobile) 
                lorsque vous visitez un site web. Les cookies permettent au site de mémoriser vos actions et 
                préférences pendant une période donnée.
              </p>
              
              <p>
                Sur {appConfig.name}, nous utilisons différents types de cookies pour améliorer votre expérience, 
                analyser l'utilisation de notre site et vous proposer du contenu personnalisé.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Types de cookies */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold">Types de cookies que nous utilisons</h2>
          
          {COOKIE_CATEGORIES.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {getCategoryIcon(category.id)}
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {category.name}
                      {category.required && (
                        <Badge variant="secondary" className="text-xs">
                          Obligatoire
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-3">
                    {category.cookies.map((cookie, index) => (
                      <div key={index} className="p-4 bg-muted/30 rounded-lg">
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{cookie.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {cookie.type === 'first-party' ? 'Première partie' : 'Tierce partie'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            <strong>Objectif :</strong> {cookie.purpose}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <strong>Durée de conservation :</strong> {cookie.duration}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Base légale */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Base légale et conformité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Règlement Général sur la Protection des Données (RGPD)</h4>
              <p className="text-sm text-muted-foreground">
                Nous respectons le RGPD et vous demandons votre consentement explicite pour l'utilisation 
                de cookies non essentiels. Vous pouvez retirer votre consentement à tout moment.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Directive ePrivacy</h4>
              <p className="text-sm text-muted-foreground">
                Conformément à la directive ePrivacy, nous vous informons de l'utilisation des cookies 
                et vous permettons de contrôler leur utilisation.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Loi Informatique et Libertés</h4>
              <p className="text-sm text-muted-foreground">
                En tant qu'entreprise française, nous respectons la loi Informatique et Libertés 
                dans le traitement de vos données personnelles.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Gestion des cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Comment gérer vos cookies ?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Sur notre site</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Vous pouvez modifier vos préférences à tout moment en utilisant notre centre de préférences.
              </p>
              <Link href="/cookies/preferences">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Gérer mes préférences
                </Button>
              </Link>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Dans votre navigateur</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Vous pouvez également gérer les cookies directement dans les paramètres de votre navigateur :
              </p>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" />
                  <a 
                    href="https://support.google.com/chrome/answer/95647" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google Chrome
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" />
                  <a 
                    href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies-preferences" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Mozilla Firefox
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" />
                  <a 
                    href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Safari
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" />
                  <a 
                    href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Microsoft Edge
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services tiers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Services tiers et cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Google Analytics</h4>
              <p className="text-sm text-muted-foreground">
                Nous utilisons Google Analytics pour analyser l'utilisation de notre site. 
                Vous pouvez désactiver Google Analytics en installant le{' '}
                <a 
                  href="https://tools.google.com/dlpage/gaoptout" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  module complémentaire de désactivation
                </a>.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Réseaux sociaux</h4>
              <p className="text-sm text-muted-foreground">
                Les boutons de partage sur les réseaux sociaux peuvent déposer des cookies. 
                Consultez les politiques de confidentialité de ces services pour plus d'informations.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact et mise à jour */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contact et mises à jour</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Questions sur cette politique</h4>
              <p className="text-sm text-muted-foreground">
                Si vous avez des questions concernant notre utilisation des cookies, 
                vous pouvez nous contacter à{' '}
                <a href="mailto:privacy@kesimarket.com" className="text-primary hover:underline">
                  privacy@kesimarket.com
                </a>
                {' '}ou via notre{' '}
                <Link href="/contact" className="text-primary hover:underline">
                  page de contact
                </Link>.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Mises à jour de cette politique</h4>
              <p className="text-sm text-muted-foreground">
                Nous pouvons mettre à jour cette politique de cookies de temps en temps. 
                Les modifications importantes vous seront notifiées via une bannière sur le site 
                ou par email si vous avez un compte.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Historique des versions</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Version 1.0 (30 septembre 2025) - Première version</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liens utiles */}
        <Card>
          <CardHeader>
            <CardTitle>Liens utiles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Link href="/cookies/preferences" className="flex items-center gap-2 text-primary hover:underline">
                <Settings className="w-4 h-4" />
                Gérer mes préférences de cookies
              </Link>
              <Link href="/politique-confidentialite" className="flex items-center gap-2 text-primary hover:underline">
                <Shield className="w-4 h-4" />
                Politique de confidentialité
              </Link>
              <Link href="/mentions-legales" className="flex items-center gap-2 text-primary hover:underline">
                <ExternalLink className="w-4 h-4" />
                Mentions légales
              </Link>
              <Link href="/contact" className="flex items-center gap-2 text-primary hover:underline">
                <ExternalLink className="w-4 h-4" />
                Nous contacter
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
