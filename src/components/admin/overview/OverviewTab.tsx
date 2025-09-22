"use client";

import Image from "next/image";
import {
  Package,
  Users,
  TrendingUp,
  Tag,
  Building2,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts, useCategories, useBrands } from "@/lib/query/hooks";
import { formatPrice } from "@/lib/utils/currency";
import { SafeImage } from "@/components/ui/safe-image";

export function OverviewTab() {
  const { data: products } = useProducts({});
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const statsData = {
    totalProducts: products?.data?.length || 0,
    totalCategories: categories?.data?.length || 0,
    totalBrands: brands?.data?.length || 0,
    totalAgencies: 460,
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
                <p className="text-sm text-green-600">+12% ce mois</p>
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
                <p className="text-sm text-blue-600">+2 nouvelles</p>
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
                <p className="text-sm font-medium text-gray-600">Agences</p>
                <p className="text-3xl font-bold text-gray-900">
                  {statsData.totalAgencies}
                </p>
                <p className="text-sm text-orange-600">Points de vente</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "Nouveau produit ajouté",
                  item: "Disjoncteur modulaire 20A",
                  time: "Il y a 2 heures",
                  type: "success",
                },
                {
                  action: "Stock mis à jour",
                  item: "Câble H07V-U 2.5mm²",
                  time: "Il y a 4 heures",
                  type: "info",
                },
                {
                  action: "Produit en rupture",
                  item: "Luminaire LED 48W",
                  time: "Il y a 6 heures",
                  type: "warning",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "success"
                        ? "bg-green-500"
                        : activity.type === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{activity.action}</div>
                    <div className="text-xs text-gray-600">{activity.item}</div>
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produits populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products?.data?.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg">
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
                  <div className="flex-1">
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {product.brand?.name}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-primary">
                    {formatPrice(product.price)}
                  </div>
                </div>
              )) || []}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
