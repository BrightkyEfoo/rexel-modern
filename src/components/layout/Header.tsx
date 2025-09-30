"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Logo } from "@/components/ui/logo";
import {
  Menu,
  Search,
  Heart,
  ShoppingCart,
  User,
  Grid,
  Sparkles,
  MapPin,
  Package,
  Phone,
  Mail,
  Settings,
  File,
  Building2,
} from "lucide-react";
import Image from "next/image";
import { useAuth, useLogout } from "@/lib/auth/nextauth-hooks";
import { useMainCategories } from "@/lib/query/hooks";
import { useFavoritesCount } from "@/lib/hooks/useFavorites";
import { appConfig } from "@/lib/config/app";
import { CartPreview } from "@/components/cart/CartPreview";
import { AuthLink } from "@/components/auth/AuthLink";
import { SearchBar } from "@/components/search/SearchBar";

interface HeaderProps {
  className?: string;
  withSearchBar?: boolean;
}

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
  >
    {children}
  </Link>
);

const MobileNavLink = ({
  href,
  children,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  onNavigate: () => void;
}) => (
  <Link
    href={href}
    onClick={onNavigate}
    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
  >
    {children}
  </Link>
);

// Pays de la zone CEMAC
const cemacCountries = [
  { code: "CM", name: "Cameroun" },
  { code: "CF", name: "Centrafrique" },
  { code: "TD", name: "Tchad" },
  { code: "CG", name: "République du Congo" },
  { code: "GQ", name: "Guinée équatoriale" },
  { code: "GA", name: "Gabon" },
];

export function Header({ className, withSearchBar = true }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const logoutMutation = useLogout();
  const { data: favoritesCount } = useFavoritesCount();
  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useMainCategories();

  // Extraire les catégories de la réponse API
  const categories = categoriesResponse?.data || [];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const authContent = isAuthenticated ? (
    <>
      <DropdownMenuItem asChild>
        <Link href="/profil">Mon profil</Link>
      </DropdownMenuItem>
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

  const renderCemacFlags = () => {
    return (
      <div className="flex items-center space-x-3">
        {cemacCountries.map((country) => (
          <Link
            key={country.code}
            href={`/points-relais/${country.code.toLowerCase()}`}
            className="relative w-8 h-6 overflow-hidden rounded-sm border border-gray-200 hover:scale-110 transition-transform duration-200 cursor-pointer"
            title={`Points de relais en ${country.name}`}
          >
            <Image
              alt={country.name}
              src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country.code}.svg`}
              fill
              className="object-cover"
            />
          </Link>
        ))}
      </div>
    );
  };

  return (
    <header
      className={cn(
        "bg-white border-b border-gray-200 sticky top-0 z-50",
        className
      )}
    >
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span className="text-xs sm:text-sm">
                  {appConfig.contact.phone}
                </span>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{appConfig.contact.email}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                href="/points-relais"
                className="hidden sm:flex items-center space-x-1 text-sm hover:text-primary-foreground/80"
              >
                <MapPin className="w-4 h-4" />
                <span>Points de relais</span>
              </Link>
              <Link
                href="/aide"
                className="text-xs sm:text-sm hover:text-primary-foreground/80"
              >
                Aide
              </Link>
              <Link
                href="/contact"
                className="text-xs sm:text-sm hover:text-primary-foreground/80"
              >
                Contact
              </Link>

              <Link
                href="/docs/format-csv-import"
                className="text-xs sm:text-sm hover:text-primary-foreground/80"
              >
                Documentation
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
                  <Logo variant="dark" size="sm" showText={false} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="flex flex-col w-full sm:w-[320px]"
              >
                <SheetHeader className="border-b pb-4">
                  <SheetTitle>
                    <Link href="/" onClick={closeMobileMenu}>
                      <Logo variant="dark" size="xxl" />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex-grow flex flex-col space-y-2 mt-6">
                  <MobileNavLink href="/catalogue" onNavigate={closeMobileMenu}>
                    <Grid className="w-5 h-5" />
                    <span>Catalogue</span>
                  </MobileNavLink>
                  <MobileNavLink href="/marque" onNavigate={closeMobileMenu}>
                    <Building2 className="w-5 h-5" />
                    <span>Marques</span>
                  </MobileNavLink>
                  <MobileNavLink
                    href="/nouveautes"
                    onNavigate={closeMobileMenu}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Nouveautés</span>
                  </MobileNavLink>
                  <MobileNavLink
                    href="/points-relais"
                    onNavigate={closeMobileMenu}
                  >
                    <MapPin className="w-5 h-5" />
                    <span>Points de relais</span>
                  </MobileNavLink>
                  <MobileNavLink href="/services" onNavigate={closeMobileMenu}>
                    <Settings className="w-5 h-5" />
                    <span>Services</span>
                  </MobileNavLink>
                  <MobileNavLink href="/contact" onNavigate={closeMobileMenu}>
                    <span>Contact</span>
                  </MobileNavLink>
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
                          <Link
                            href="/commandes"
                            onClick={closeMobileMenu}
                            className="text-sm text-primary hover:underline"
                          >
                            Voir mes commandes
                          </Link>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          handleLogout();
                          closeMobileMenu();
                        }}
                      >
                        Déconnexion
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        asChild
                        className="w-full"
                        onClick={closeMobileMenu}
                      >
                        <AuthLink href="/auth/login">Connexion</AuthLink>
                      </Button>
                      <Button
                        variant="outline"
                        asChild
                        className="w-full"
                        onClick={closeMobileMenu}
                      >
                        <AuthLink href="/auth/register">
                          Créer un compte
                        </AuthLink>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="hidden md:block">
              <Logo variant="dark" size="xxl" />
            </Link>

            {/* Search */}
            {withSearchBar && (
              <div className="flex-1 hidden md:block max-w-2xl mx-8">
                <SearchBar showButton={false} />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {withSearchBar && (
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
                    <div className="mt-4">
                      <SearchBar />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Link
                href="/nouveautes"
                className="hidden md:flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary"
              >
                <Sparkles className="w-4 h-4" />
                <span>Nouveautés</span>
              </Link>

              {isAuthenticated ? (
                // Utilisateur connecté - Afficher toutes les fonctionnalités
                <>
                  <Link href="/favoris" className="relative group">
                    <Heart className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    {(favoritesCount?.data?.count || 0) > 0 && (
                      <Badge
                        variant="default"
                        className="absolute -top-2 -right-2 w-5 h-5 justify-center p-0"
                      >
                        {(favoritesCount?.data?.count || 0) > 99
                          ? "99+"
                          : favoritesCount?.data?.count || 0}
                      </Badge>
                    )}
                  </Link>
                  <CartPreview isAuthenticated={isAuthenticated} />
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
                </>
              ) : (
                // Utilisateur non connecté - Afficher panier et boutons d'authentification
                <>
                  <CartPreview isAuthenticated={isAuthenticated} />
                  <Button asChild variant="outline" size="sm">
                    <AuthLink href="/auth/register">Inscription</AuthLink>
                  </Button>
                  <Button asChild size="sm">
                    <AuthLink href="/auth/login">Connexion</AuthLink>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="md:hidden py-2 flex justify-center w-full">
        {renderCemacFlags()}
      </div>
      <div className="bg-slate-50 border-b hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 flex-wrap">
            <nav className="flex items-center space-x-8">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary"
                  >
                    <Package className="w-4 h-4" />
                    <span>Produits</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-4">
                  <DropdownMenuLabel className="text-base font-semibold">
                    Catégories
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="grid grid-cols-1 gap-1 mt-2">
                    {categoriesLoading ? (
                      <div className="py-2 px-3 text-muted-foreground">
                        Chargement...
                      </div>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <DropdownMenuItem key={category.id} asChild>
                          <Link
                            href={`/categorie/${category.slug}`}
                            className="flex items-center py-2 px-3 rounded-md hover:bg-slate-100"
                          >
                            {category.name}
                          </Link>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="py-2 px-3 text-muted-foreground">
                        Aucune catégorie disponible
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="relative group">
                <Link href="/catalogue">
                  <span className="flex items-center space-x-1 text-sm font-medium text-muted-foreground cursor-pointer">
                    <Grid className="w-4 h-4" />
                    <span>Catalogue </span>
                  </span>
                </Link>
              </div>
              <div className="relative group">
                <span className="flex items-center space-x-1 text-sm font-medium text-muted-foreground cursor-not-allowed opacity-50">
                  <span>Destockage</span>
                  <Badge
                    variant="secondary"
                    className="ml-1 text-[8px] p-[0px] px-0.5"
                  >
                    Soon
                  </Badge>
                </span>
              </div>
              <Link href="/services" className="relative group">
                <span className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:cursor-pointer">
                  <Settings className="w-4 h-4" />
                  <span>Services</span>
                </span>
              </Link>

              <NavLink href="/contact">Contact</NavLink>
            </nav>

            {renderCemacFlags()}
          </div>
        </div>
      </div>
    </header>
  );
}
