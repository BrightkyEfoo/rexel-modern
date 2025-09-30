"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth/nextauth-hooks";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Shield
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();
  const { data: userProfile, isLoading, error } = useUserProfile();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/auth/login";
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center space-x-2 text-sm mb-8">
            <Skeleton className="h-4 w-16" />
            <span>/</span>
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>

          {/* Profile Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="text-center">
                <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-destructive mb-2">
                  Erreur de chargement
                </h3>
                <p className="text-muted-foreground">
                  Impossible de charger les informations de votre profil.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case "customer":
        return "Client";
      case "admin":
        return "Administrateur";
      case "manager":
        return "Gestionnaire";
      default:
        return type;
    }
  };

  const getUserTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "admin":
        return "destructive";
      case "manager":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">
            Accueil
          </Link>
          <span>/</span>
          <span className="text-foreground">Mon Profil</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mon Profil
          </h1>
          <p className="text-muted-foreground">
            Consultez vos informations personnelles
          </p>
        </div>

        {/* Profile Information */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Full Name */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Nom complet
                </span>
                <span className="text-sm font-medium">
                  {userProfile?.fullName || 
                   `${userProfile?.firstName || ""} ${userProfile?.lastName || ""}`.trim() ||
                   "Non renseigné"}
                </span>
              </div>

              <Separator />

              {/* Email */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{userProfile?.email}</span>
                  {userProfile?.isVerified ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>

              <Separator />

              {/* Phone */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Téléphone
                </span>
                <span className="text-sm font-medium">
                  {userProfile?.phone || "Non renseigné"}
                </span>
              </div>

              <Separator />

              {/* Company */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Entreprise
                </span>
                <span className="text-sm font-medium">
                  {userProfile?.company || "Non renseigné"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Informations du compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User Type */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Type de compte
                </span>
                <Badge variant={getUserTypeBadgeVariant(userProfile?.type || "")}>
                  {getUserTypeLabel(userProfile?.type || "")}
                </Badge>
              </div>

              <Separator />

              {/* Email Verification Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Statut de vérification
                </span>
                <div className="flex items-center gap-2">
                  {userProfile?.isVerified ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">
                        Vérifié
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-red-600">
                        Non vérifié
                      </span>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Email Verified At */}
              {userProfile?.emailVerifiedAt && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Email vérifié le
                    </span>
                    <span className="text-sm font-medium">
                      {formatDate(userProfile.emailVerifiedAt)}
                    </span>
                  </div>
                  <Separator />
                </>
              )}

              {/* Account Created */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Compte créé le
                </span>
                <span className="text-sm font-medium">
                  {formatDate(userProfile?.createdAt || "")}
                </span>
              </div>

              <Separator />

              {/* Last Updated */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Dernière mise à jour
                </span>
                <span className="text-sm font-medium">
                  {formatDate(userProfile?.updatedAt || "")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                href="/commandes"
                className="flex items-center justify-center p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <span className="text-sm font-medium">Mes commandes</span>
              </Link>
              <Link
                href="/favoris"
                className="flex items-center justify-center p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <span className="text-sm font-medium">Mes favoris</span>
              </Link>
              <Link
                href="/panier"
                className="flex items-center justify-center p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <span className="text-sm font-medium">Mon panier</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
