"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { activitiesService } from "@/lib/api/activities";
import { ProductActivityType } from "@/lib/types/product";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Loader2,
  Package,
  User,
  Clock,
  FileEdit,
  Check,
  X,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/lib/auth/nextauth-hooks";

/**
 * Composant de gestion des activités
 * Admin : Voit toutes les activités de tous les managers
 * Manager : Voit seulement ses propres activités
 */
export function ActivitiesManagement() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>("all");
  const perPage = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: ["activities", page, activityTypeFilter],
    queryFn: () =>
      activitiesService.getAll({
        page,
        per_page: perPage,
        activity_type:
          activityTypeFilter === "all" ? undefined : activityTypeFilter,
      }),
    refetchInterval: 30000, // Refetch toutes les 30 secondes
  });

  const activities = data?.data || [];
  const meta = data?.meta;

  console.log("activities", activities, data);

  const getActivityIcon = (type: ProductActivityType) => {
    switch (type) {
      case ProductActivityType.CREATE:
        return <Plus className="w-4 h-4" />;
      case ProductActivityType.UPDATE:
        return <FileEdit className="w-4 h-4" />;
      case ProductActivityType.APPROVE:
        return <Check className="w-4 h-4" />;
      case ProductActivityType.REJECT:
        return <X className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityBadgeVariant = (type: ProductActivityType) => {
    switch (type) {
      case ProductActivityType.CREATE:
        return "default";
      case ProductActivityType.UPDATE:
        return "secondary";
      case ProductActivityType.APPROVE:
        return "default"; // Will use green via className
      case ProductActivityType.REJECT:
        return "destructive";
      default:
        return "outline";
    }
  };

  const getActivityBadgeClassName = (type: ProductActivityType) => {
    if (type === ProductActivityType.APPROVE) {
      return "bg-green-600 hover:bg-green-700";
    }
    return "";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activités</CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activités</CardTitle>
          <CardDescription>Erreur lors du chargement</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">
            Une erreur s'est produite lors du chargement des activités
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              {user?.type === "admin"
                ? "Toutes les activités"
                : "Mes activités"}
            </CardTitle>
            <CardDescription>
              {meta?.total || 0} activité{(meta?.total || 0) > 1 ? "s" : ""} au
              total
            </CardDescription>
          </div>
          <Select
            value={activityTypeFilter}
            onValueChange={setActivityTypeFilter}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrer par type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="create">Création</SelectItem>
              <SelectItem value="update">Modification</SelectItem>
              <SelectItem value="submit">Soumission</SelectItem>
              <SelectItem value="approve">Approbation</SelectItem>
              <SelectItem value="reject">Rejet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Aucune activité</p>
            <p className="text-sm text-muted-foreground">
              {activityTypeFilter !== "all"
                ? "Aucune activité de ce type"
                : "Aucune activité enregistrée"}
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[calc(100vh-350px)]">
              <div className="space-y-3 pr-4">
                {activities.map((activity) => (
                  <Card
                    key={activity.id}
                    className="hover:shadow-sm transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Image du produit */}
                        {activity.product.imageUrl && (
                          <div className="hidden md:block flex-shrink-0">
                            <img
                              src={activity.product.imageUrl}
                              alt={activity.product.name}
                              className="w-16 h-16 object-cover rounded border"
                            />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          {/* En-tête */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={getActivityBadgeVariant(
                                  activity.activityType
                                )}
                                className={getActivityBadgeClassName(
                                  activity.activityType
                                )}
                              >
                                {getActivityIcon(activity.activityType)}
                                <span className="ml-1">
                                  {activity.activityType}
                                </span>
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {format(
                                  new Date(activity.createdAt),
                                  "dd/MM/yyyy HH:mm",
                                  {
                                    locale: fr,
                                  }
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Produit */}
                          <div className="mb-2">
                            <div className="flex items-center gap-2 mb-1">
                              <Package className="w-4 h-4 text-muted-foreground" />
                              <span className="font-semibold text-sm">
                                {activity.product.name}
                              </span>
                            </div>
                            {activity.product.sku && (
                              <p className="text-xs text-muted-foreground ml-6">
                                SKU: {activity.product.sku}
                              </p>
                            )}
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground mb-2">
                            {activity.description}
                          </p>

                          {/* Utilisateur */}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="w-3 h-3" />
                            {activity.user ? (
                              <span>
                                {activity.user.firstName}{" "}
                                {activity.user.lastName} ({activity.user.type})
                              </span>
                            ): (
                              <span>
                                Utilisateur non trouvé
                              </span>
                            )}
                          </div>

                          {/* Changements de statut */}
                          {activity.oldStatus && activity.newStatus && (
                            <div className="mt-2 flex items-center gap-2 text-xs">
                              <Badge variant="outline" className="text-xs">
                                {activity.oldStatus}
                              </Badge>
                              <span>→</span>
                              <Badge variant="outline" className="text-xs">
                                {activity.newStatus}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Page {meta.current_page} sur {meta.last_page}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === meta.last_page}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
