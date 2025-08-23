import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  RotateCcw, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Scale
} from 'lucide-react';
import { appConfig } from '@/lib/config/app';

export default function CGVPage() {
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
                  <FileText className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Conditions Générales de Vente
              </h1>
              <p className="text-xl text-primary-foreground/80 mb-4">
                Conditions applicables à tous vos achats sur notre site
              </p>
              <p className="text-sm text-primary-foreground/60">
                Dernière mise à jour : {lastUpdated}
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            
            {/* Préambule */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Scale className="w-6 h-6 text-primary" />
                  <span>Préambule</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Les présentes Conditions Générales de Vente (CGV) régissent exclusivement les relations 
                  contractuelles entre KesiMarket Cameroun SARL et ses clients dans le cadre de la vente de 
                  matériel énergétique et électrique via le site web.
                </p>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h3 className="font-semibold mb-2 text-foreground">Acceptation des conditions</h3>
                  <p className="text-sm text-muted-foreground">
                    Toute commande passée sur notre site implique l'acceptation pleine et entière des 
                    présentes CGV. Ces conditions prévalent sur toutes autres conditions figurant dans 
                    tout autre document, sauf dérogation expresse et écrite de notre part.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Article 1 - Produits */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                  <span>Article 1 - Produits et services</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">1.1 Gamme de produits</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    KesiMarket Cameroun propose la vente de matériel énergétique et électrique destiné aux 
                    professionnels et particuliers :
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Appareillage électrique et automatismes</li>
                    <li>Éclairage professionnel et domestique</li>
                    <li>Fils, câbles et accessoires de câblage</li>
                    <li>Outillage électrique et de mesure</li>
                    <li>Solutions énergétiques et renouvelables</li>
                    <li>Équipements de sécurité et protection</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">1.2 Disponibilité et caractéristiques</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Les produits sont proposés dans la limite des stocks disponibles. Les caractéristiques 
                    techniques, photos et descriptions sont données à titre indicatif et peuvent être 
                    modifiées sans préavis.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-sm">Produits certifiés</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Conformes aux normes camerounaises et internationales
                    </p>
                  </div>
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="font-medium text-sm">Garantie constructeur</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Selon les conditions de chaque fabricant
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Article 2 - Commandes */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Article 2 - Commandes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">2.1 Processus de commande</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Les commandes sont passées exclusivement sur notre site web selon le processus suivant :
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <span className="text-sm">Sélection des produits</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <span className="text-sm">Validation du panier</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <span className="text-sm">Informations de livraison</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">4</div>
                      <span className="text-sm">Paiement sécurisé</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">2.2 Confirmation de commande</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Une confirmation de commande est envoyée par email dans les plus brefs délais. 
                    Cette confirmation vaut acceptation de la commande et formation du contrat de vente.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Article 3 - Prix */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-6 h-6 text-primary" />
                  <span>Article 3 - Prix et paiement</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">3.1 Prix</h3>
                  <div className="space-y-3">
                    <p className="text-muted-foreground leading-relaxed">
                      Les prix sont indiqués en Francs CFA (FCFA) toutes taxes comprises (TTC), sauf 
                      mention contraire. Les prix peuvent être modifiés à tout moment mais sont garantis 
                      pour toute commande validée.
                    </p>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="p-3 border border-border rounded-lg text-center">
                        <Badge variant="secondary" className="mb-2">Particuliers</Badge>
                        <p className="text-sm text-muted-foreground">Prix TTC affichés</p>
                      </div>
                      <div className="p-3 border border-border rounded-lg text-center">
                        <Badge variant="secondary" className="mb-2">Professionnels</Badge>
                        <p className="text-sm text-muted-foreground">Prix HT sur demande</p>
                      </div>
                      <div className="p-3 border border-border rounded-lg text-center">
                        <Badge variant="secondary" className="mb-2">Gros volumes</Badge>
                        <p className="text-sm text-muted-foreground">Tarifs préférentiels</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">3.2 Modalités de paiement</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Les paiements s'effectuent selon les modes suivants :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-medium mb-2">Paiement en ligne</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Carte bancaire (Visa, Mastercard)</li>
                        <li>• Mobile Money (MTN, Orange)</li>
                        <li>• Virement bancaire instantané</li>
                      </ul>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-medium mb-2">Paiement professionnel</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Virement bancaire (48h)</li>
                        <li>• Chèque d'entreprise</li>
                        <li>• Facilités de paiement (sur dossier)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Article 4 - Livraison */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="w-6 h-6 text-primary" />
                  <span>Article 4 - Livraison</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">4.1 Zones de livraison</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Nous livrons sur l'ensemble du territoire camerounais :
                  </p>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <h4 className="font-medium mb-1 text-sm">Zone 1 - Grandes villes</h4>
                      <p className="text-xs text-muted-foreground">Douala, Yaoundé, Garoua, Bamenda</p>
                      <Badge variant="outline" className="mt-2 text-xs">24-48h</Badge>
                    </div>
                    <div className="p-3 bg-secondary/10 rounded-lg">
                      <h4 className="font-medium mb-1 text-sm">Zone 2 - Villes moyennes</h4>
                      <p className="text-xs text-muted-foreground">Bafoussam, Ngaoundéré, Maroua</p>
                      <Badge variant="outline" className="mt-2 text-xs">3-5 jours</Badge>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <h4 className="font-medium mb-1 text-sm">Zone 3 - Autres localités</h4>
                      <p className="text-xs text-muted-foreground">Villes secondaires et villages</p>
                      <Badge variant="outline" className="mt-2 text-xs">5-10 jours</Badge>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">4.2 Frais de livraison</h3>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Livraison standard</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Gratuite dès 100 000 FCFA</li>
                          <li>• 5 000 FCFA (Zone 1)</li>
                          <li>• 8 000 FCFA (Zone 2)</li>
                          <li>• 12 000 FCFA (Zone 3)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Livraison express</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• 24h (Douala/Yaoundé): 15 000 FCFA</li>
                          <li>• Sur rendez-vous disponible</li>
                          <li>• Installation sur devis</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">4.3 Modalités de livraison</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    La livraison s'effectue à l'adresse indiquée lors de la commande. Il est impératif 
                    qu'une personne soit présente pour réceptionner la commande. En cas d'absence, 
                    la livraison sera reportée.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Article 5 - Retours */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <RotateCcw className="w-6 h-6 text-primary" />
                  <span>Article 5 - Retours et garanties</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">5.1 Droit de rétractation</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Conformément à la législation camerounaise, vous disposez d'un délai de 14 jours 
                    francs à compter de la réception des produits pour exercer votre droit de rétractation.
                  </p>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-secondary" />
                      <span>Conditions de retour</span>
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Produits dans leur emballage d'origine</li>
                      <li>• État neuf, non utilisés</li>
                      <li>• Accessoires et documentation complets</li>
                      <li>• Facture d'achat obligatoire</li>
                    </ul>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">5.2 Garanties commerciales</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-medium mb-2">Garantie KesiMarket</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 30 jours satisfaction client</li>
                        <li>• Échange ou remboursement</li>
                        <li>• Support technique inclus</li>
                      </ul>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-medium mb-2">Garantie constructeur</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Selon conditions fabricant</li>
                        <li>• De 1 à 5 ans selon produits</li>
                        <li>• Réparation ou remplacement</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Article 6 - Responsabilité */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-6 h-6 text-primary" />
                  <span>Article 6 - Responsabilité et force majeure</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">6.1 Limitation de responsabilité</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    La responsabilité de KesiMarket Cameroun ne saurait être engagée en cas de dommages 
                    résultant d'une utilisation anormale ou non conforme des produits vendus.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">6.2 Force majeure</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    KesiMarket Cameroun ne pourra être tenue responsable de tout retard ou inexécution 
                    consécutif à la survenance d'un cas de force majeure habituellement reconnu 
                    par la jurisprudence camerounaise.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Article 7 - Droit applicable */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Article 7 - Droit applicable et litiges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">7.1 Droit applicable</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Les présentes CGV sont soumises au droit camerounais. Toute contestation sera 
                    soumise aux tribunaux compétents de Douala.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">7.2 Médiation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    En cas de litige, nous privilégions une résolution amiable. Le client peut 
                    également recourir à la médiation de la Chambre de Commerce du Cameroun.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact et modifications */}
            <Card>
              <CardHeader>
                <CardTitle>Contact et modifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">Service client</h3>
                  <div className="grid md:grid-cols-2 gap-4">
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
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg mt-4">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Horaires</p>
                      <p className="text-sm text-muted-foreground">Lundi au Vendredi : 8h - 18h | Samedi : 9h - 17h</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">Modifications des CGV</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    KesiMarket Cameroun se réserve le droit de modifier les présentes CGV à tout moment. 
                    Les modifications entrent en vigueur dès leur publication sur le site.
                  </p>
                  <div className="mt-4 p-4 bg-secondary/10 rounded-lg">
                    <p className="text-sm font-medium">Version actuelle : {lastUpdated}</p>
                  </div>
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
