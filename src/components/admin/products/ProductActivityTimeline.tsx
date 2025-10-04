"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductActivities } from "@/lib/api/products-validation";
import { ProductActivityType } from "@/lib/types/product";
import {
  Clock,
  Plus,
  Edit,
  Send,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductActivityTimelineProps {
  productId: number;
}

/**
 * Timeline affichant l'historique des activités d'un produit
 * Affiche toutes les actions effectuées sur un produit (création, modification, validation, etc.)
 */
export function ProductActivityTimeline({
  productId,
}: ProductActivityTimelineProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["product-activities", productId],
    queryFn: () => getProductActivities(productId),
  });

  const getActivityIcon = (type: ProductActivityType) => {
    switch (type) {
      case ProductActivityType.CREATE:
        return <Plus className="w-4 h-4 text-blue-600" />;
      case ProductActivityType.UPDATE:
        return <Edit className="w-4 h-4 text-orange-600" />;
      case ProductActivityType.SUBMIT:
        return <Send className="w-4 h-4 text-purple-600" />;
      case ProductActivityType.APPROVE:
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case ProductActivityType.REJECT:
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: ProductActivityType) => {
    switch (type) {
      case ProductActivityType.CREATE:
        return "bg-blue-100 text-blue-800 border-blue-300";
      case ProductActivityType.UPDATE:
        return "bg-orange-100 text-orange-800 border-orange-300";
      case ProductActivityType.SUBMIT:
        return "bg-purple-100 text-purple-800 border-purple-300";
      case ProductActivityType.APPROVE:
        return "bg-green-100 text-green-800 border-green-300";
      case ProductActivityType.REJECT:
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getActivityLabel = (type: ProductActivityType) => {
    switch (type) {
      case ProductActivityType.CREATE:
        return "Création";
      case ProductActivityType.UPDATE:
        return "Modification";
      case ProductActivityType.SUBMIT:
        return "Soumission";
      case ProductActivityType.APPROVE:
        return "Approbation";
      case ProductActivityType.REJECT:
        return "Rejet";
      default:
        return "Activité";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Historique des activités
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Historique des activités
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">
            Erreur lors du chargement de l'historique
          </p>
        </CardContent>
      </Card>
    );
  }

  const activities = data?.data || [];

  const formatStatus = (status: string | null) => {
    if (!status || status === 'null') return 'N/A';
    const statusLabels: Record<string, string> = {
      draft: 'Brouillon',
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté',
    };
    return statusLabels[status] || status;
  };

  const getStatusBadgeVariant = (status: string | null) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Historique des activités
        </CardTitle>
        <CardDescription>
          Toutes les actions effectuées sur ce produit ({activities.length}{" "}
          activités)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="relative space-y-4">
            {/* Ligne verticale */}
            <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-border" />

            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className="relative flex gap-4 items-start"
              >
                {/* Icône */}
                <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-background border-2 border-border">
                  {getActivityIcon(activity.activityType)}
                </div>

                {/* Contenu */}
                <div className="flex-1 space-y-2 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`${getActivityColor(
                            activity.activityType
                          )} text-xs`}
                        >
                          {getActivityLabel(activity.activityType)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(
                            new Date(activity.createdAt),
                            "dd MMM yyyy à HH:mm",
                            {
                              locale: fr,
                            }
                          )}
                        </span>
                      </div>

                      <p className="text-sm font-medium">
                        {activity.description}
                      </p>

                      {activity.user && (
                        <p className="text-xs text-muted-foreground">
                          Par {activity.user.firstName} {activity.user.lastName}{" "}
                          ({activity.user.type})
                        </p>
                      )}

                      {/* Affichage de la transition de statut */}
                      {(activity.oldStatus || activity.newStatus) && (
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground">Statut:</span>
                          <Badge variant={getStatusBadgeVariant(activity.oldStatus) as any}>
                            {formatStatus(activity.oldStatus)}
                          </Badge>
                          <span className="text-muted-foreground">→</span>
                          <Badge variant={getStatusBadgeVariant(activity.newStatus) as any}>
                            {formatStatus(activity.newStatus)}
                          </Badge>
                        </div>
                      )}

                      {/* Métadonnées additionnelles */}
                      {activity.metadata &&
                        Object.keys(activity.metadata).length > 0 && (
                          <div className="mt-2 p-2 bg-muted rounded-md">
                            <details className="text-xs">
                              <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground">
                                Détails
                              </summary>
                              <pre className="mt-2 overflow-x-auto">
                                {JSON.stringify(activity.metadata, null, 2)}
                              </pre>
                            </details>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {activities.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucune activité pour ce produit
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
