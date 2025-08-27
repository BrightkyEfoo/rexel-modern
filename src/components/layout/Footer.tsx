import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Youtube,
  Linkedin,
  ArrowRight,
  Download,
  Smartphone,
  Shield,
  Award,
  Clock,
  Twitter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/ui/logo';
import { appConfig } from '@/lib/config/app';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/70 text-white">
      {/* Newsletter section */}
      <div className="bg-primary">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-primary-foreground mb-4">
              Restez informé de nos actualités
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Inscrivez-vous à notre newsletter pour recevoir nos dernières
              offres et actualités
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1"
              />
              <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">
                S'inscrire
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="text-secondary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and social */}
            <div className="space-y-6">
              <Logo
                variant="light"
                size="xxl"
                className="!w-44"
                showText={true}
              />
              <p className="">
                Votre partenaires de confiance pour tous vos besoins en matériel
                énergétique au Cameroun
              </p>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Facebook className="w-5 h-5 " />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Twitter className="w-5 h-5 " />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Linkedin className="w-5 h-5 " />
                </Link>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">
                Liens rapides
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/catalogue"
                    className=" hover:text-foreground hover:underline hover:underline-offset-2 transition-colors"
                  >
                    Catalogue
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nouveautes"
                    className=" hover:text-foreground hover:underline hover:underline-offset-2 transition-colors"
                  >
                    Nouveautés
                  </Link>
                </li>
                <li>
                  <Link
                    href="/points-relais"
                    className=" hover:text-foreground hover:underline hover:underline-offset-2 transition-colors"
                  >
                    Points de relais
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className=" hover:text-foreground hover:underline hover:underline-offset-2 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}

            <div>
              <h4 className="font-semibold text-foreground mb-4">Services</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/services/livraison"
                    className=" hover:text-foreground hover:underline hover:underline-offset-2 transition-colors"
                  >
                    Livraison
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/installation"
                    className=" hover:text-foreground hover:underline hover:underline-offset-2 transition-colors"
                  >
                    Installation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/formation"
                    className=" hover:text-foreground hover:underline hover:underline-offset-2 transition-colors"
                  >
                    Formation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/conseil"
                    className=" hover:text-foreground hover:underline hover:underline-offset-2 transition-colors"
                  >
                    Conseil
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2 ">
                  <Phone className="w-4 h-4" />
                  <span>{appConfig.contact.phone}</span>
                </li>
                <li className="flex items-center space-x-2 ">
                  <Mail className="w-4 h-4" />
                  <span>{appConfig.contact.email}</span>
                </li>
                <li className="flex items-center space-x-2 ">
                  <MapPin className="w-4 h-4" />
                  <span>{appConfig.contact.address}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="mt-12 pt-8 bg-primary">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-300">Certifié ISO 9001</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-300">Paiement sécurisé</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-300">Livraison J+1</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-700 rounded"></div>
            <div className="w-8 h-8 bg-gray-700 rounded"></div>
            <div className="w-8 h-8 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-primary">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm ">
              © {currentYear} KesiMarket. Tous droits réservés.
            </div>
            <div className="flex space-x-6">
              <Link
                href="/mentions-legales"
                className="text-sm  hover:text-foreground hover:underline hover:underline-offset-2 transition-colors"
              >
                Mentions légales
              </Link>
              <Link
                href="/politique-confidentialite"
                className="text-sm  hover:text-foreground hover:underline hover:underline-offset-2 transition-colors"
              >
                Politique de confidentialité
              </Link>
              <Link
                href="/cgv"
                className="text-sm  hover:text-foreground hover:underline hover:underline-offset-2 transition-colors"
              >
                CGV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
