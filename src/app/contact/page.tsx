'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSendContactMessage } from '@/lib/hooks/useContact';
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

const contactFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Le sujet doit contenir au moins 5 caractères").max(200),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères").max(2000),
  type: z.enum(['general', 'quote', 'support', 'complaint', 'other']).optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const sendMessageMutation = useSendContactMessage();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      type: 'general',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    sendMessageMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
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
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom complet *</FormLabel>
                              <FormControl>
                                <Input placeholder="Votre nom complet" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="votre@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Téléphone</FormLabel>
                              <FormControl>
                                <Input placeholder="+237 6 12 34 56 78" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type de demande</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez le type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="general">Demande générale</SelectItem>
                                  <SelectItem value="quote">Demande de devis</SelectItem>
                                  <SelectItem value="support">Support technique</SelectItem>
                                  <SelectItem value="complaint">Réclamation</SelectItem>
                                  <SelectItem value="other">Autre</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sujet *</FormLabel>
                            <FormControl>
                              <Input placeholder="Objet de votre message" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Décrivez votre demande ou question..."
                                rows={6}
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        disabled={sendMessageMutation.isPending}
                        className="w-full"
                      >
                        {sendMessageMutation.isPending ? (
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
                  </Form>
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