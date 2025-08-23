'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { 
  Search, 
  Phone, 
  Mail, 
  MessageSquare, 
  HelpCircle,
  ShoppingCart,
  Truck,
  CreditCard,
  Settings,
  Book,
  Video,
  Download,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  CheckCircle
} from 'lucide-react';
import { appConfig } from '@/lib/config/app';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface GuideItem {
  id: number;
  title: string;
  description: string;
  icon: any;
  category: string;
  link: string;
}

export default function AidePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: "Comment passer une commande sur votre site ?",
      answer: "Pour passer commande, parcourez notre catalogue, ajoutez les produits souhaités à votre panier, puis suivez les étapes de commande. Vous pouvez créer un compte pour accélérer vos prochaines commandes.",
      category: "commande"
    },
    {
      id: 2,
      question: "Quels sont les délais de livraison ?",
      answer: "Les délais de livraison varient selon votre localisation et le mode de livraison choisi. En général, comptez 2-3 jours ouvrés pour une livraison standard au Cameroun. Les commandes passées avant 14h sont expédiées le jour même.",
      category: "livraison"
    },
    {
      id: 3,
      question: "Comment suivre ma commande ?",
      answer: "Une fois votre commande expédiée, vous recevrez un email avec un numéro de suivi. Vous pouvez également consulter l'état de vos commandes dans votre espace client sur notre site.",
      category: "commande"
    },
    {
      id: 4,
      question: "Proposez-vous des formations sur vos produits ?",
      answer: "Oui, nous proposons des formations techniques sur nos produits énergétiques. Contactez notre équipe commerciale pour connaître le planning des formations disponibles dans votre région.",
      category: "formation"
    },
    {
      id: 5,
      question: "Comment retourner un produit ?",
      answer: "Vous disposez de 14 jours pour retourner un produit. Le produit doit être dans son emballage d'origine et non utilisé. Contactez notre service client pour obtenir un numéro de retour.",
      category: "retour"
    },
    {
      id: 6,
      question: "Acceptez-vous les paiements par virement bancaire ?",
      answer: "Oui, nous acceptons les virements bancaires, cartes de crédit, et paiements mobiles (Mobile Money). Pour les entreprises, nous proposons également des facilités de paiement.",
      category: "paiement"
    },
    {
      id: 7,
      question: "Avez-vous un service après-vente ?",
      answer: "Oui, notre service après-vente est disponible du lundi au vendredi de 8h à 18h. Nous proposons assistance technique, dépannage et maintenance pour tous nos produits.",
      category: "support"
    },
    {
      id: 8,
      question: "Comment obtenir un devis personnalisé ?",
      answer: "Vous pouvez demander un devis en ligne via notre formulaire de contact, par téléphone, ou en vous rendant dans l'un de nos points de relais. Précisez vos besoins pour un devis adapté.",
      category: "devis"
    }
  ];

  const guides: GuideItem[] = [
    {
      id: 1,
      title: "Guide d'installation électrique",
      description: "Apprenez les bases de l'installation électrique résidentielle et industrielle",
      icon: Settings,
      category: "technique",
      link: "/guides/installation-electrique"
    },
    {
      id: 2,
      title: "Choisir son matériel énergétique",
      description: "Guide pour sélectionner le bon équipement selon vos besoins",
      icon: HelpCircle,
      category: "conseil",
      link: "/guides/choisir-materiel"
    },
    {
      id: 3,
      title: "Tutoriel vidéo - Tableaux électriques",
      description: "Vidéos explicatives pour comprendre et installer vos tableaux",
      icon: Video,
      category: "video",
      link: "/guides/videos-tableaux"
    },
    {
      id: 4,
      title: "Catalogue produits 2024",
      description: "Téléchargez notre catalogue complet avec tous nos produits",
      icon: Download,
      category: "document",
      link: "/guides/catalogue-2024"
    },
    {
      id: 5,
      title: "Guide de commande en ligne",
      description: "Comment utiliser notre site pour passer commande facilement",
      icon: ShoppingCart,
      category: "utilisation",
      link: "/guides/commande-en-ligne"
    },
    {
      id: 6,
      title: "Documentation technique",
      description: "Fiches techniques et manuels de nos produits",
      icon: Book,
      category: "technique",
      link: "/guides/documentation"
    }
  ];

  const categories = [
    { id: 'all', name: 'Toutes', count: faqItems.length },
    { id: 'commande', name: 'Commandes', count: faqItems.filter(f => f.category === 'commande').length },
    { id: 'livraison', name: 'Livraison', count: faqItems.filter(f => f.category === 'livraison').length },
    { id: 'paiement', name: 'Paiement', count: faqItems.filter(f => f.category === 'paiement').length },
    { id: 'support', name: 'Support', count: faqItems.filter(f => f.category === 'support').length },
    { id: 'formation', name: 'Formation', count: faqItems.filter(f => f.category === 'formation').length }
  ];

  const supportMethods = [
    {
      icon: Phone,
      title: 'Téléphone',
      description: 'Support téléphonique immédiat',
      value: appConfig.contact.phone,
      hours: 'Lun-Ven 8h-18h',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Réponse sous 24h',
      value: appConfig.contact.email,
      hours: 'Support écrit',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      icon: MessageSquare,
      title: 'Chat en ligne',
      description: 'Assistance instantanée',
      value: 'Chat disponible',
      hours: 'Lun-Ven 9h-17h',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    }
  ];

  const filteredFAQs = faqItems.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Centre d'aide
              </h1>
              <p className="text-xl text-primary-foreground/80 mb-8">
                Trouvez rapidement les réponses à vos questions ou contactez notre équipe d'experts
              </p>
              
              {/* Barre de recherche */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans l'aide..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-base bg-background text-foreground"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* FAQ Section */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Questions fréquentes</h2>
                <p className="text-muted-foreground mb-6">
                  Consultez les questions les plus posées par nos clients
                </p>
                
                {/* Filtres de catégories */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="text-sm"
                    >
                      {category.name} ({category.count})
                    </Button>
                  ))}
                </div>
              </div>

              {/* FAQ Items */}
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <Card key={faq.id}>
                    <CardHeader
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleFAQ(faq.id)}
                    >
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{faq.question}</CardTitle>
                        {openFAQ === faq.id ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </CardHeader>
                    {openFAQ === faq.id && (
                      <CardContent className="pt-0">
                        <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>

              {filteredFAQs.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun résultat trouvé</h3>
                  <p className="text-muted-foreground">
                    Essayez de modifier votre recherche ou contactez notre support
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Contact rapide */}
              <div>
                <h3 className="text-xl font-bold mb-4">Besoin d'aide immédiate ?</h3>
                <div className="space-y-3">
                  {supportMethods.map((method, index) => {
                    const Icon = method.icon;
                    return (
                      <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${method.bgColor} ${method.color}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{method.title}</h4>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{method.hours}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Liens utiles */}
              <div>
                <h3 className="text-xl font-bold mb-4">Liens utiles</h3>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="/contact">
                      <Mail className="w-4 h-4 mr-2" />
                      Formulaire de contact
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="/points-relais">
                      <Settings className="w-4 h-4 mr-2" />
                      Nos points de relais
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="/commandes">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Mes commandes
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Guides et ressources */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Guides et ressources</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez nos guides techniques, tutoriels vidéo et documentation pour tirer le meilleur parti de nos produits
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => {
                const Icon = guide.icon;
                return (
                  <Card key={guide.id} className="hover:shadow-lg transition-all duration-300 group">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {guide.title}
                          </CardTitle>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <CardDescription className="mt-2">
                        {guide.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full" asChild>
                        <a href={guide.link}>
                          Consulter le guide
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Section d'état des services */}
          <div className="mt-16">
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <CardTitle>État des services</CardTitle>
                    <CardDescription>Tous nos services fonctionnent normalement</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Site web</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Système de commande</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Support client</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Vous ne trouvez pas ce que vous cherchez ?</h2>
                <p className="text-primary-foreground/80 mb-6">
                  Notre équipe d'experts est là pour vous aider avec toutes vos questions techniques et commerciales
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="secondary" size="lg" asChild>
                    <a href="/contact">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Contacter le support
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="border-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary" asChild>
                    <a href="tel:+237612345678">
                      <Phone className="w-5 h-5 mr-2" />
                      Appeler maintenant
                    </a>
                  </Button>
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
