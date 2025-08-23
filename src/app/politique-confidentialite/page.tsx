import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Eye, Lock, Database, Mail, Phone } from 'lucide-react';
import { appConfig } from '@/lib/config/app';

export default function PolitiqueConfidentialitePage() {
  const lastUpdated = "15 janvier 2024";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Politique de Confidentialité
              </h1>
              <p className="text-xl text-primary-foreground/80 mb-4">
                Nous respectons votre vie privée et protégeons vos données personnelles
              </p>
              <p className="text-sm text-primary-foreground/60">
                Dernière mise à jour : {lastUpdated}
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-6 h-6 text-primary" />
                  <span>Introduction</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  KesiMarket Cameroun s'engage à protéger et respecter votre vie privée. Cette politique de confidentialité 
                  explique comment nous collectons, utilisons, stockons et protégeons vos informations personnelles 
                  lorsque vous utilisez notre site web et nos services.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  En utilisant notre site web, vous acceptez les pratiques décrites dans cette politique de confidentialité.
                </p>
              </CardContent>
            </Card>

            {/* Données collectées */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-6 h-6 text-primary" />
                  <span>Données que nous collectons</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Informations que vous nous fournissez</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Nom, prénom et informations de contact (email, téléphone, adresse)</li>
                    <li>Informations de facturation et de livraison</li>
                    <li>Historique des commandes et préférences d'achat</li>
                    <li>Communications avec notre service client</li>
                    <li>Informations d'entreprise pour les comptes professionnels</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Informations collectées automatiquement</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Adresse IP et données de géolocalisation</li>
                    <li>Type de navigateur et système d'exploitation</li>
                    <li>Pages visitées et temps passé sur le site</li>
                    <li>Données de navigation et préférences</li>
                    <li>Cookies et technologies similaires</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Utilisation des données */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="w-6 h-6 text-primary" />
                  <span>Comment nous utilisons vos données</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Nous utilisons vos informations personnelles pour :
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Traiter et gérer vos commandes</li>
                  <li>Vous fournir un service client de qualité</li>
                  <li>Améliorer notre site web et nos services</li>
                  <li>Vous envoyer des informations sur nos produits et promotions (avec votre consentement)</li>
                  <li>Respecter nos obligations légales et réglementaires</li>
                  <li>Prévenir la fraude et assurer la sécurité de nos services</li>
                  <li>Analyser l'utilisation de notre site pour l'optimiser</li>
                </ul>
              </CardContent>
            </Card>

            {/* Partage des données */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Partage de vos informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations avec :
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Nos partenaires de livraison pour l'expédition de vos commandes</li>
                  <li>Les prestataires de services de paiement pour traiter vos transactions</li>
                  <li>Nos sous-traitants techniques pour la maintenance du site</li>
                  <li>Les autorités légales si requis par la loi</li>
                  <li>En cas de fusion, acquisition ou vente d'actifs (avec notification préalable)</li>
                </ul>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Cookies et technologies similaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Notre site utilise des cookies pour améliorer votre expérience de navigation :
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-semibold mb-2">Cookies essentiels</h4>
                    <p className="text-sm text-muted-foreground">
                      Nécessaires au fonctionnement du site (panier, connexion)
                    </p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-semibold mb-2">Cookies analytiques</h4>
                    <p className="text-sm text-muted-foreground">
                      Pour comprendre l'utilisation du site et l'améliorer
                    </p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-semibold mb-2">Cookies marketing</h4>
                    <p className="text-sm text-muted-foreground">
                      Pour personnaliser les publicités (avec votre consentement)
                    </p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-semibold mb-2">Cookies fonctionnels</h4>
                    <p className="text-sm text-muted-foreground">
                      Pour mémoriser vos préférences et paramètres
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sécurité */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Sécurité de vos données</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées :
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Chiffrement SSL/TLS pour toutes les communications</li>
                  <li>Accès restreint aux données personnelles</li>
                  <li>Surveillance et protection contre les cyberattaques</li>
                  <li>Sauvegardes régulières et sécurisées</li>
                  <li>Formation de notre personnel à la protection des données</li>
                </ul>
              </CardContent>
            </Card>

            {/* Vos droits */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Vos droits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Conformément à la réglementation camerounaise et internationale, vous disposez des droits suivants :
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-semibold mb-2">Droit d'accès</h4>
                    <p className="text-sm text-muted-foreground">
                      Connaître les données que nous détenons sur vous
                    </p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-semibold mb-2">Droit de rectification</h4>
                    <p className="text-sm text-muted-foreground">
                      Corriger les données inexactes ou incomplètes
                    </p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-semibold mb-2">Droit d'effacement</h4>
                    <p className="text-sm text-muted-foreground">
                      Demander la suppression de vos données
                    </p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-semibold mb-2">Droit d'opposition</h4>
                    <p className="text-sm text-muted-foreground">
                      Vous opposer à certains traitements
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conservation des données */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Conservation des données</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Nous conservons vos données personnelles uniquement le temps nécessaire aux finalités pour lesquelles 
                  elles ont été collectées :
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Données de compte client : jusqu'à suppression du compte + 3 ans</li>
                  <li>Données de commande : 10 ans pour les obligations comptables</li>
                  <li>Données de navigation : 13 mois maximum</li>
                  <li>Données de prospection : 3 ans après le dernier contact</li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Contact et réclamations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Pour exercer vos droits ou pour toute question concernant cette politique de confidentialité, 
                  vous pouvez nous contacter :
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{appConfig.contact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Téléphone</p>
                      <p className="text-sm text-muted-foreground">{appConfig.contact.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border border-border rounded-lg mt-4">
                  <p className="font-medium mb-2">Adresse postale</p>
                  <p className="text-sm text-muted-foreground">
                    {appConfig.contact.address}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Modifications */}
            <Card>
              <CardHeader>
                <CardTitle>Modifications de cette politique</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
                  Les modifications seront publiées sur cette page avec une date de mise à jour. Nous vous 
                  encourageons à consulter régulièrement cette page pour rester informé de nos pratiques 
                  en matière de protection des données.
                </p>
                <div className="mt-4 p-4 bg-secondary/10 rounded-lg">
                  <p className="text-sm font-medium">
                    Dernière mise à jour : {lastUpdated}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
