'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Download, Smartphone, Zap, ShoppingCart, Bell, Star, Award, CreditCard, Gift, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/ui/logo';
import { formatPrice } from '@/lib/utils/currency';

export function MobileAppSection() {
  return (
    <section className="py-16 bg-secondary/70 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/30 to-transparent rounded-full -translate-y-48 translate-x-48" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-primary/30 to-transparent rounded-full translate-y-40 -translate-x-40" />

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-primary-foreground" />
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Application mobile
                </Badge>
              </div>

              <h2 className="text-3xl font-bold mb-4">
                Emportez tout KesiMarket
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Accédez à votre compte, passez commande, suivez vos livraisons et consultez
                nos 2 millions de références directement depuis votre smartphone.
              </p>
            </div>

            {/* Key features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Commandes rapides</h3>
                  <p className="text-sm text-muted-foreground">Passez commande en quelques clics</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Suivez vos livraisons en temps réel</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Favoris</h3>
                  <p className="text-sm text-muted-foreground">Accédez à vos produits préférés</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Prix personnalisés</h3>
                  <p className="text-sm text-muted-foreground">Bénéficiez de vos tarifs négociés</p>
                </div>
              </div>
            </div>

            {/* App store buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90"
                asChild
              >
                <Link href="#">
                  <Download className="w-5 h-5 mr-2" />
                  Télécharger l'app
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                asChild
              >
                <Link href="#">En savoir plus</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto w-80 h-96">
              {/* Phone mockup */}
              <div className="absolute inset-0 bg-gradient-to-br from-foreground to-foreground/90 rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden relative">
                  {/* Screen content */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 p-4">
                    {/* Status bar */}
                    <div className="flex justify-between items-center text-primary-foreground text-xs mb-4">
                      <span>9:41</span>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-primary-foreground rounded-full"></div>
                        <div className="w-1 h-1 bg-primary-foreground rounded-full"></div>
                        <div className="w-1 h-1 bg-primary-foreground rounded-full"></div>
                      </div>
                    </div>

                    {/* App header */}
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Logo variant="light" size="md" showText={false} />
                      </div>
                      <h3 className="text-primary-foreground font-bold text-lg">KesiMarket</h3>
                      <p className="text-primary-foreground/80 text-sm">2M+ références</p>
                    </div>

                    {/* Quick actions */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-primary-foreground/10 backdrop-blur-lg rounded-xl p-4">
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center shrink-0">
                            <ShoppingCart className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div>
                            <div className="text-primary-foreground font-medium">Commander</div>
                            <div className="text-primary-foreground/60 text-xs">Produits</div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-primary-foreground/10 backdrop-blur-lg rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div>
                            <div className="text-primary-foreground font-medium">Payer</div>
                            <div className="text-primary-foreground/60 text-xs">Factures</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent orders */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-primary-foreground font-medium">Commandes récentes</h4>
                        <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/20">
                          Voir tout
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-primary-foreground/10 backdrop-blur-lg rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                                <Gift className="w-4 h-4 text-primary-foreground" />
                              </div>
                              <div>
                                <div className="text-primary-foreground text-sm font-medium">CMD-2024-001</div>
                                <div className="text-primary-foreground/60 text-xs">En cours de livraison</div>
                              </div>
                            </div>
                            <div className="text-primary-foreground text-sm font-medium">{formatPrice(1234)}</div>
                          </div>
                        </div>
                        <div className="bg-primary-foreground/10 backdrop-blur-lg rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                                <Box className="w-4 h-4 text-primary-foreground" />
                              </div>
                              <div>
                                <div className="text-primary-foreground text-sm font-medium">CMD-2024-002</div>
                                <div className="text-primary-foreground/60 text-xs">Livré</div>
                              </div>
                            </div>
                            <div className="text-primary-foreground text-sm font-medium">{formatPrice(567)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
