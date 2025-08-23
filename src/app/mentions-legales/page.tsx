import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Building, Scale, Globe, Server, Shield, Mail, Phone } from 'lucide-react';
import { appConfig } from '@/lib/config/app';

export default function MentionsLegalesPage() {
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
                  <Scale className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Mentions Légales
              </h1>
              <p className="text-xl text-primary-foreground/80 mb-4">
                Informations légales obligatoires concernant notre site web
              </p>
              <p className="text-sm text-primary-foreground/60">
                Dernière mise à jour : {lastUpdated}
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            
            {/* Éditeur du site */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-6 h-6 text-primary" />
                  <span>Éditeur du site</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">Raison sociale</h3>
                    <p className="text-muted-foreground">KesiMarket Cameroun SARL</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">Forme juridique</h3>
                    <p className="text-muted-foreground">Société à Responsabilité Limitée (SARL)</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">Capital social</h3>
                    <p className="text-muted-foreground">500 000 000 FCFA</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">Numéro d'identification</h3>
                    <p className="text-muted-foreground">RC/DLA/2024/B/123456</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">Numéro de TVA</h3>
                    <p className="text-muted-foreground">M012345678901H</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">Code APE</h3>
                    <p className="text-muted-foreground">4669Z - Commerce de matériel électrique</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">Siège social</h3>
                  <p className="text-muted-foreground">{appConfig.contact.address}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">Téléphone</h3>
                    <p className="text-muted-foreground">{appConfig.contact.phone}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">Email</h3>
                    <p className="text-muted-foreground">{appConfig.contact.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Directeur de publication */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Directeur de publication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Directeur Général</h3>
                  <p className="text-muted-foreground">M. Jean-Claude MBARGA</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    En sa qualité de représentant légal de KesiMarket Cameroun SARL
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Hébergement */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="w-6 h-6 text-primary" />
                  <span>Hébergement du site</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">Hébergeur</h3>
                    <p className="text-muted-foreground">Vercel Inc.</p>
                    <p className="text-sm text-muted-foreground">440 N Baywood Dr, San Mateo, CA 94402, États-Unis</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">Contact hébergeur</h3>
                    <p className="text-muted-foreground">https://vercel.com/contact</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conception et développement */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-6 h-6 text-primary" />
                  <span>Conception et développement</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">Agence web</h3>
                  <p className="text-muted-foreground">WARAP Digital Solutions</p>
                  <p className="text-sm text-muted-foreground">Spécialisée dans le développement de solutions e-commerce</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">Technologies utilisées</h3>
                  <p className="text-muted-foreground">Next.js, React, TypeScript, Tailwind CSS</p>
                </div>
              </CardContent>
            </Card>

            {/* Propriété intellectuelle */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-6 h-6 text-primary" />
                  <span>Propriété intellectuelle</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  L'ensemble des éléments composant le site web (textes, images, vidéos, logos, graphismes, 
                  icônes, sons, logiciels, etc.) ainsi que le site lui-même, sont la propriété exclusive de 
                  KesiMarket Cameroun SARL ou de ses partenaires.
                </p>
                
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-foreground">Droits d'auteur</h3>
                  <p className="text-sm text-muted-foreground">
                    Toute reproduction, représentation, modification, publication, adaptation de tout ou partie 
                    des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf 
                    autorisation écrite préalable de KesiMarket Cameroun SARL.
                  </p>
                </div>
                
                <div className="bg-secondary/10 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-foreground">Marques et logos</h3>
                  <p className="text-sm text-muted-foreground">
                    Les marques "KesiMarket" et tous les logos présents sur le site sont des marques déposées. 
                    Toute utilisation non autorisée est strictement interdite.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Responsabilité */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Limitation de responsabilité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  KesiMarket Cameroun SARL s'efforce de fournir des informations aussi précises que possible sur le site. 
                  Cependant, elle ne pourra être tenue responsable des omissions, des inexactitudes et des carences 
                  dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui 
                  fournissent ces informations.
                </p>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Nous déclinons toute responsabilité concernant :</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Les interruptions du site pour des opérations de maintenance</li>
                    <li>Les dysfonctionnements techniques ponctuels</li>
                    <li>Les dommages directs ou indirects résultant de l'utilisation du site</li>
                    <li>L'utilisation non conforme aux conditions d'utilisation</li>
                    <li>Les liens hypertextes pointant vers des sites externes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Données personnelles */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Protection des données personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Conformément à la loi camerounaise relative à la protection des données à caractère personnel, 
                  vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.
                </p>
                
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold mb-2 text-foreground">Pour exercer vos droits</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{appConfig.contact.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{appConfig.contact.phone}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Pour plus d'informations, consultez notre 
                  <a href="/politique-confidentialite" className="text-primary hover:underline ml-1">
                    Politique de Confidentialité
                  </a>.
                </p>
              </CardContent>
            </Card>

            {/* Droit applicable */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Droit applicable et juridictions compétentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Les présentes mentions légales sont régies par le droit camerounais. Tout litige relatif à 
                  l'utilisation du site sera de la compétence exclusive des tribunaux de Douala, même en cas 
                  de pluralité de défendeurs ou d'appel en garantie.
                </p>
                
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-foreground">Résolution des litiges</h3>
                  <p className="text-sm text-muted-foreground">
                    Avant tout recours contentieux, nous vous encourageons à nous contacter pour résoudre 
                    amiablement tout différend qui pourrait survenir.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Pour toute question concernant ces mentions légales, vous pouvez nous contacter :
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{appConfig.contact.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Téléphone</p>
                        <p className="text-sm text-muted-foreground">{appConfig.contact.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-border rounded-lg">
                  <p className="font-medium mb-2">Adresse postale</p>
                  <p className="text-sm text-muted-foreground">{appConfig.contact.address}</p>
                </div>
                
                <div className="mt-4 p-4 bg-secondary/10 rounded-lg">
                  <p className="text-sm font-medium">Dernière mise à jour : {lastUpdated}</p>
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
