"use client";

import Image from "next/image";
import {
  Package,
  Users,
  TrendingUp,
  Tag,
  Building2,
  DollarSign,
  MapPin,
  ArrowRight,
  Plus,
  FileEdit,
  Check,
  X,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProducts, useCategories, useBrands } from "@/lib/query/hooks";
import { usePickupPointStats } from "@/lib/hooks/usePickupPoints";
import { useQuery } from "@tanstack/react-query";
import { activitiesService } from "@/lib/api/activities";
import { formatPrice } from "@/lib/utils/currency";
import { SafeImage } from "@/components/ui/safe-image";
import { ProductActivityType } from "@/lib/types/product";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";

interface OverviewTabProps {
  onNavigateToActivities?: () => void;
}

export function OverviewTab({ onNavigateToActivities }: OverviewTabProps) {
  const { data: products } = useProducts({});
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const { data: pickupPointsStats } = usePickupPointStats();

  // Récupérer les activités récentes (5 dernières)
  const { data: activitiesData } = useQuery({
    queryKey: ["activities", "recent", 1, 5],
    queryFn: () =>
      activitiesService.getAll({
        page: 1,
        per_page: 5,
      }),
    refetchInterval: 30000, // Refetch toutes les 30 secondes
  });

  const recentActivities = activitiesData?.data || [];

  const statsData = {
    totalProducts: products?.data?.length || 0,
    totalCategories: categories?.data?.length || 0,
    totalBrands: brands?.data?.length || 0,
    totalPickupPoints: pickupPointsStats?.data?.total || 0,
  };

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

  const getActivityColor = (type: ProductActivityType) => {
    switch (type) {
      case ProductActivityType.CREATE:
        return "text-blue-600";
      case ProductActivityType.UPDATE:
        return "text-orange-600";
      case ProductActivityType.APPROVE:
        return "text-green-600";
      case ProductActivityType.REJECT:
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getActivityLabel = (type: ProductActivityType) => {
    switch (type) {
      case ProductActivityType.CREATE:
        return "Création";
      case ProductActivityType.UPDATE:
        return "Modification";
      case ProductActivityType.APPROVE:
        return "Approbation";
      case ProductActivityType.REJECT:
        return "Rejet";
      case ProductActivityType.SUBMIT:
        return "Soumission";
      default:
        return type;
    }
  };

  const getActivityDescription = (activity: any) => {
    const activityLabel = getActivityLabel(activity.activityType);
    const productName = activity.product?.name || "Produit inconnu";
    const userName = activity.user
      ? `${activity.user.firstName} ${activity.user.lastName}`
      : "Utilisateur";

    return `${userName} - ${activityLabel} de "${productName}"`;
  };

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Produits
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {statsData.totalProducts}
                </p>
                <p className="text-sm text-green-600">Catalogue actif</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Catégories
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {statsData.totalCategories}
                </p>
                <p className="text-sm text-blue-600">Classifications</p>
              </div>
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <Tag className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Marques
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {statsData.totalBrands}
                </p>
                <p className="text-sm text-purple-600">Partenaires actifs</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Points de relais
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {statsData.totalPickupPoints}
                </p>
                <p className="text-sm text-orange-600">Agences actives</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Popular Products */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Activité récente</CardTitle>
              {onNavigateToActivities && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNavigateToActivities}
                  className="text-primary hover:text-primary/80"
                >
                  Voir plus
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune activité récente
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={`mt-0.5 ${getActivityColor(
                        activity.activityType
                      )}`}
                    >
                      {getActivityIcon(activity.activityType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">
                        {getActivityLabel(activity.activityType)}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {getActivityDescription(activity)}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(activity.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produits populaires</CardTitle>
          </CardHeader>
          <CardContent>
            {!products?.data || products.data.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun produit disponible
              </div>
            ) : (
              <div className="space-y-4">
                {products.data.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-lg">
                      <SafeImage
                        src={
                          product.imageUrl ? product.imageUrl : "/placeholder.png"
                        }
                        alt={product.name}
                        width={40}
                        height={40}
                        className="object-contain w-full h-full p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {product.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {product.brand?.name || "Sans marque"}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-primary">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}