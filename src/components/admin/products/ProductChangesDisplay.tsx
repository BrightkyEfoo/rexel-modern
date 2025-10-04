"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ProductActivity } from "@/lib/types/product";
import { ProductActivityType } from "@/lib/types/product";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertCircle, ArrowRight } from "lucide-react";

interface ProductChangesDisplayProps {
  activities: ProductActivity[];
}

const formatValue = (value: any): string => {
  if (value === null || value === undefined) return "N/A";
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
};

const getFieldLabel = (fieldName: string): string => {
  const labels: Record<string, string> = {
    name: "Nom",
    description: "Description",
    shortDescription: "Description courte",
    price: "Prix",
    salePrice: "Prix soldé",
    stockQuantity: "Quantité en stock",
    sku: "SKU",
    isFeatured: "Produit vedette",
    isActive: "Actif",
    manageStock: "Gérer le stock",
    inStock: "En stock",
    brandId: "Marque",
    fabricationCountryCode: "Pays de fabrication",
    specifications: "Spécifications",
    additionalInfo: "Informations additionnelles",
    status: "Statut",
  };
  return labels[fieldName] || fieldName;
};

export function ProductChangesDisplay({
  activities,
}: ProductChangesDisplayProps) {
  // Debug: afficher toutes les activités
  console.log("🔍 [ProductChangesDisplay] Toutes les activités:", activities);

  // Trouver la dernière modification avant la soumission actuelle
  // Les activités sont triées par date décroissante, donc on prend la première avec des changements
  const updateActivities = activities.filter(
    (activity) =>
      activity.activityType === ProductActivityType.UPDATE &&
      activity.metadata?.changes
  );

  console.log(
    "🔍 [ProductChangesDisplay] Activités UPDATE trouvées:",
    updateActivities.length
  );
  if (updateActivities.length > 0) {
    console.log(
      "🔍 [ProductChangesDisplay] Première activité UPDATE:",
      updateActivities[0]
    );
  }

  const lastUpdateActivity =
    updateActivities.length > 0 ? updateActivities[0] : null;

  if (!lastUpdateActivity || !lastUpdateActivity.metadata?.changes) {
    // Vérifier s'il y a une création récente pour afficher un meilleur message
    const createActivity = activities.find(
      (activity) => activity.activityType === ProductActivityType.CREATE
    );

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Changements détectés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>
              {createActivity
                ? "Aucun changement détaillé disponible (création initiale)"
                : "Aucune modification détectée"}
            </span>
          </div>
          {/* Debug info */}
          <div className="mt-4 p-2 bg-muted rounded text-xs">
            <p className="font-semibold mb-1">Debug:</p>
            <p>Total activités: {activities.length}</p>
            <p>Activités UPDATE: {updateActivities.length}</p>
            <pre className="mt-2 overflow-x-auto">
              {JSON.stringify(
                activities.map((a) => ({
                  type: a.activityType,
                  hasMetadata: !!a.metadata,
                  hasChanges: !!a.metadata?.changes,
                })),
                null,
                2
              )}
            </pre>
          </div>
        </CardContent>
      </Card>
    );
  }

  const changes = lastUpdateActivity.metadata.changes as Record<string, any>;
  const changeEntries = Object.entries(changes).filter(
    ([key]) => key !== "status" // Ne pas afficher le changement de statut ici
  );

  if (changeEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Changements détectés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>Seul le statut a changé (resoumission)</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Changements détectés ({changeEntries.length})
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {format(
              new Date(lastUpdateActivity.createdAt),
              "dd/MM/yyyy à HH:mm",
              { locale: fr }
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {changeEntries.map(([fieldName, change]) => {
              const oldValue = change.old;
              const newValue = change.new;

              return (
                <div
                  key={fieldName}
                  className="border-l-2 border-primary/30 pl-4 pb-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm">
                      {getFieldLabel(fieldName)}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      Modifié
                    </Badge>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="flex-1 space-y-1">
                      <p className="text-xs text-muted-foreground uppercase font-medium">
                        Ancienne valeur
                      </p>
                      <div className="bg-destructive/10 text-destructive rounded p-2 font-mono text-xs break-words">
                        {formatValue(oldValue)}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground mt-6 flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <p className="text-xs text-muted-foreground uppercase font-medium">
                        Nouvelle valeur
                      </p>
                      <div className="bg-green-500/10 text-green-700 dark:text-green-400 rounded p-2 font-mono text-xs break-words">
                        {formatValue(newValue)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AlertCircle className="h-3 w-3" />
            {lastUpdateActivity.user && (
              <span>
                Modifié par {lastUpdateActivity.user.firstName}{" "}
                {lastUpdateActivity.user.lastName} (
                {lastUpdateActivity.user.type})
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
