'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, MapPin, Settings, Heart, Phone, Mail, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { useAuthUser, useLogout } from '@/lib/auth/auth-hooks';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface HeaderProps {
  className?: string;
}

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-sm font-medium text-muted-foreground hover:text-primary">
    {children}
  </Link>
);

const MobileNavLink = ({ href, children, onNavigate }: { href: string; children: React.ReactNode; onNavigate: () => void }) => (
  <Link
    href={href}
    className="flex items-center space-x-3 py-2 text-lg font-medium text-foreground hover:text-primary"
    onClick={onNavigate}
  >
    {children}
  </Link>
);

export function Header({ className }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuthUser();
  const logoutMutation = useLogout();

  const categories = [
    'Fils et câbles',
    'Distribution d\'énergie',
    'Éclairage',
    'Appareillage',
    'Chauffage',
    'Outillage',
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const authContent = isAuthenticated ? (
    <>
      <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link href="/commandes">Mes commandes</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/favoris">Mes favoris</Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
        Déconnexion
      </DropdownMenuItem>
    </>
  ) : (
    <>
      <DropdownMenuItem asChild>
        <Link href="/auth/login">Connexion</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/auth/register">Créer un compte</Link>
      </DropdownMenuItem>
    </>
  );

  return (
    <header className={cn('bg-white border-b border-gray-200 sticky top-0 z-50', className)}>
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">01 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">contact@rexel.fr</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/aide" className="text-sm hover:text-primary-foreground/80">
                Aide
              </Link>
              <Link href="/contact" className="text-sm hover:text-primary-foreground/80">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col w-full sm:w-[320px]">
                <SheetHeader className="border-b pb-4">
                  <SheetTitle>
                    <Link href="/" className="flex items-center space-x-3" onClick={closeMobileMenu}>
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-xl">R</span>
                      </div>
                      <div className="text-xl font-bold text-primary">Rexel</div>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex-grow flex flex-col space-y-2 mt-6">
                  <MobileNavLink href="/catalogue" onNavigate={closeMobileMenu}>
                    <Grid className="w-5 h-5" />
                    <span>Catalogue</span>
                  </MobileNavLink>
                  <MobileNavLink href="/services" onNavigate={closeMobileMenu}>
                    <span>Services</span>
                  </MobileNavLink>
                  <MobileNavLink href="/contact" onNavigate={closeMobileMenu}>
                    <span>Contact</span>
                  </MobileNavLink>
                  {/* More links can be added here */}
                </nav>
                <div className="mt-auto pt-6 border-t">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                           <User className="w-6 h-6 text-muted-foreground" />
                         </div>
                         <div>
                           <p className="font-semibold">{user?.email}</p>
                           <Link href="/commandes" onClick={closeMobileMenu} className="text-sm text-primary hover:underline">Voir mes commandes</Link>
                         </div>
                       </div>
                       <Button variant="outline" className="w-full" onClick={() => { handleLogout(); closeMobileMenu(); }}>Déconnexion</Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button asChild className="w-full" onClick={closeMobileMenu}><Link href="/auth/login">Connexion</Link></Button>
                      <Button variant="outline" asChild className="w-full" onClick={closeMobileMenu}><Link href="/auth/register">Créer un compte</Link></Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="hidden md:flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">R</span>
              </div>
              <div className="text-xl font-bold text-primary">Rexel</div>
            </Link>

            {/* Search */}
            <div className="flex-1 hidden md:block max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  className="pl-10 pr-4 py-3 text-base border-2 border-border rounded-lg focus:border-primary focus:ring-0 w-full"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Search className="w-6 h-6" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-4">
                  <DialogHeader>
                    <DialogTitle>Rechercher</DialogTitle>
                  </DialogHeader>
                  <div className="relative mt-4">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Rechercher un produit..."
                      className="pl-10 pr-4 py-3 text-base border-2 border-border rounded-lg focus:border-primary focus:ring-0 w-full"
                    />
                  </div>
                </DialogContent>
              </Dialog>
              <Link href="/favoris" className="relative group">
                <Heart className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                <Badge variant="default" className="absolute -top-2 -right-2 w-5 h-5 justify-center p-0">3</Badge>
              </Link>
              <Link href="/panier" className="relative group">
                <ShoppingCart className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                <Badge variant="default" className="absolute -top-2 -right-2 w-5 h-5 justify-center p-0">2</Badge>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-6 h-6" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {authContent}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-background border-b hidden md:block">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-8 h-12">
            <NavLink href="/catalogue">
              <div className="flex items-center space-x-1">
              <Grid className="w-4 h-4" />
              <span>Catalogue</span>
              </div>
            </NavLink>
            <div className="relative group">
              <span className="flex items-center space-x-1 text-sm font-medium text-muted-foreground cursor-not-allowed opacity-50">
                <span>Promotions</span>
                <Badge variant="secondary" className="ml-1 text-[10px] p-0.5">Soon</Badge>
              </span>
            </div>
            <NavLink href="/services">Services</NavLink>
            <div className="relative group">
              <span className="flex items-center space-x-1 text-sm font-medium text-muted-foreground cursor-not-allowed opacity-50">
                <span>Solutions</span>
                <Badge variant="secondary" className="ml-1 text-[10px] p-0.5">Soon</Badge>
              </span>
            </div>
            <NavLink href="/contact">Contact</NavLink>
          </nav>
        </div>
      </div>

      {/* Promo banner */}
      {/* <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-2">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            <span className="font-semibold">Nouveau client ?</span> Entrez le code promo
            <span className="font-bold bg-white text-green-600 px-2 py-1 rounded mx-2">BIENV202</span>
            valable pour votre 1ère commande et bénéficiez de 20€ HT de réduction dès 200€ d'achat HT.
            <Link href="/code-promo" className="underline ml-2 hover:text-green-200">
              En savoir plus
            </Link>
          </p>
        </div>
      </div> */}
    </header>
  );
}
