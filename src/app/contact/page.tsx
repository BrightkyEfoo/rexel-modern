'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  Star,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { appConfig } from '@/lib/config/app';
import { ScrollToTop } from '@/components/ui/scroll-to-top';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler l'envoi du formulaire
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      
      // Réinitialiser le statut après 3 secondes
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }, 2000);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Téléphone',
      value: appConfig.contact.phone,
      description: 'Appelez-nous directement',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Mail,
      title: 'Email',
      value: appConfig.contact.email,
      description: 'Envoyez-nous un message',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      icon: MapPin,
      title: 'Adresse',
      value: appConfig.contact.address,
      description: 'Venez nous rendre visite',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Clock,
      title: 'Horaires',
      value: 'Lun-Ven: 8h-18h, Sam: 9h-17h',
      description: 'Nos heures d\'ouverture',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
  ];

  const socialLinks = [
    { icon: Facebook, name: 'Facebook', url: appConfig.social.facebook, color: 'text-primary' },
    { icon: Instagram, name: 'Instagram', url: appConfig.social.instagram, color: 'text-secondary' },
    { icon: Twitter, name: 'Twitter', url: appConfig.social.twitter, color: 'text-primary' },
    { icon: Linkedin, name: 'LinkedIn', url: appConfig.social.linkedin, color: 'text-secondary' },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Contactez-nous
              </h1>
              <p className="text-xl text-primary-foreground/80 mb-8">
                Notre équipe d'experts en matériel énergétique est là pour vous aider et répondre à toutes vos questions
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="text-sm">
                  <Phone className="w-4 h-4 mr-2" />
                  Support 24/7
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Réponse rapide
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <Star className="w-4 h-4 mr-2" />
                  Service premium
                </Badge>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Formulaire de contact */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Envoyez-nous un message</CardTitle>
                  <CardDescription>
                    Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Votre nom complet"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+237 6 12 34 56 78"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject">Sujet *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          placeholder="Objet de votre message"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none bg-background"
                        placeholder="Décrivez votre demande ou question..."
                      />
                    </div>
                    
                    {submitStatus === 'success' && (
                      <div className="flex items-center space-x-2 text-green-700 bg-green-50 p-3 rounded-md border border-green-200">
                        <CheckCircle className="w-5 h-5" />
                        <span>Message envoyé avec succès ! Nous vous répondrons bientôt.</span>
                      </div>
                    )}
                    
                    {submitStatus === 'error' && (
                      <div className="flex items-center space-x-2 text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
                        <AlertCircle className="w-5 h-5" />
                        <span>Une erreur s'est produite. Veuillez réessayer.</span>
                      </div>
                    )}
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Envoyer le message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Informations de contact */}
            <div className="space-y-8">
              {/* Méthodes de contact */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Nos coordonnées</h2>
                <div className="grid gap-4">
                  {contactMethods.map((method, index) => {
                    const Icon = method.icon;
                    return (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-lg ${method.bgColor} ${method.color}`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{method.title}</h3>
                              <p className="text-foreground font-medium">{method.value}</p>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Réseaux sociaux */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Suivez-nous</h2>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                      >
                        <Icon className={`w-6 h-6 ${social.color}`} />
                        <span className="font-medium">{social.name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Horaires d'ouverture */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Horaires d'ouverture</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {Object.entries(appConfig.businessHours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between items-center">
                          <span className="font-medium capitalize">
                            {day === 'monday' && 'Lundi'}
                            {day === 'tuesday' && 'Mardi'}
                            {day === 'wednesday' && 'Mercredi'}
                            {day === 'thursday' && 'Jeudi'}
                            {day === 'friday' && 'Vendredi'}
                            {day === 'saturday' && 'Samedi'}
                            {day === 'sunday' && 'Dimanche'}
                          </span>
                          <span className="text-muted-foreground">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Besoin d'aide urgente ?</h2>
                <p className="text-primary-foreground/80 mb-6">
                  Notre équipe d'experts en matériel énergétique est disponible pour vous aider rapidement
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="secondary" size="lg" className="font-semibold">
                    <Phone className="w-5 h-5 mr-2" />
                    Appeler maintenant
                  </Button>
                  <Button variant="outline" size="lg" className="border-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Chat en ligne
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
} 