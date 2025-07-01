/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  RotateCcw,
  Search,
  Filter,
  Calendar,
  DollarSign,
  MapPin,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// import { useOrders } from '@/lib/query/hooks';
import { useAuthUser } from "@/lib/auth/auth-hooks";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuthUser();
  // const { data: orders, isLoading, error } = useOrders();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/auth/login";
    }
  }, [isAuthenticated]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "En attente",
          color: "bg-yellow-100 text-yellow-800",
          icon: Clock,
        };
      case "confirmed":
        return {
          label: "Confirmée",
          color: "bg-blue-100 text-blue-800",
          icon: CheckCircle,
        };
      case "processing":
        return {
          label: "En préparation",
          color: "bg-purple-100 text-purple-800",
          icon: Package,
        };
      case "shipped":
        return {
          label: "Expédiée",
          color: "bg-indigo-100 text-indigo-800",
          icon: Truck,
        };
      case "delivered":
        return {
          label: "Livrée",
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
        };
      case "cancelled":
        return {
          label: "Annulée",
          color: "bg-red-100 text-red-800",
          icon: AlertCircle,
        };
      default:
        return {
          label: status,
          color: "bg-gray-100 text-gray-800",
          icon: Package,
        };
    }
  };

  const orders: any = undefined;

  const filteredOrders =
    orders?.data?.filter((order: any) => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        if (
          !order.orderNumber.toLowerCase().includes(searchLower) &&
          !order.items.some((item: any) =>
            item.product.name.toLowerCase().includes(searchLower)
          )
        ) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== "all" && order.status !== statusFilter) {
        return false;
      }

      // Date filter
      if (dateFilter !== "all") {
        const orderDate = new Date(order.createdAt);
        const now = new Date();
        const diffDays = Math.floor(
          (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        switch (dateFilter) {
          case "7days":
            if (diffDays > 7) return false;
            break;
          case "30days":
            if (diffDays > 30) return false;
            break;
          case "90days":
            if (diffDays > 90) return false;
            break;
          case "1year":
            if (diffDays > 365) return false;
            break;
        }
      }

      return true;
    }) || [];

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (false) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-64" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (false) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erreur lors du chargement des commandes.
            </AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    );
  }

  const ordersData = orders?.data || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-[#162e77]">
            Accueil
          </Link>
          <span>/</span>
          <span className="text-gray-900">Mes commandes</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mes commandes
            </h1>
            <p className="text-gray-600">
              {ordersData.length} commande{ordersData.length !== 1 ? "s" : ""}{" "}
              dans votre historique
            </p>
          </div>
        </div>

        {ordersData.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Aucune commande pour le moment
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Découvrez nos produits et passez votre première commande
            </p>
            <Button asChild>
              <Link href="/categories">Découvrir nos produits</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Filters */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher une commande..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="confirmed">Confirmée</SelectItem>
                      <SelectItem value="processing">En préparation</SelectItem>
                      <SelectItem value="shipped">Expédiée</SelectItem>
                      <SelectItem value="delivered">Livrée</SelectItem>
                      <SelectItem value="cancelled">Annulée</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Date Filter */}
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les dates</SelectItem>
                      <SelectItem value="7days">7 derniers jours</SelectItem>
                      <SelectItem value="30days">30 derniers jours</SelectItem>
                      <SelectItem value="90days">3 derniers mois</SelectItem>
                      <SelectItem value="1year">Cette année</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Export */}
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  {filteredOrders.length} commande
                  {filteredOrders.length !== 1 ? "s" : ""} trouvée
                  {filteredOrders.length !== 1 ? "s" : ""}
                </div>
              </CardContent>
            </Card>

            {/* Orders List */}
            <div className="space-y-6">
              {filteredOrders.map((order: any) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <Card key={order.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      {/* Order Header */}
                      <div className="p-6 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                Commande {order.orderNumber}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Passée le{" "}
                                {new Date(order.createdAt).toLocaleDateString(
                                  "fr-FR",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge className={statusConfig.color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                            <div className="text-right">
                              <div className="text-lg font-bold text-[#162e77]">
                                {order.totalPrice.toFixed(2)} €
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.items.length} article
                                {order.items.length !== 1 ? "s" : ""}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="p-6">
                        {/* Items */}
                        <div className="space-y-4 mb-6">
                          {order.items.slice(0, 3).map((item: any) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-4"
                            >
                              <div className="w-16 h-16 bg-gray-100 rounded-lg">
                                <Image
                                  src={item.product.imageUrl}
                                  alt={item.product.name}
                                  width={64}
                                  height={64}
                                  className="object-contain w-full h-full p-1"
                                />
                              </div>
                              <div className="flex-1">
                                <Link
                                  href={`/produit/${item.productId}`}
                                  className="font-medium text-gray-900 hover:text-[#162e77]"
                                >
                                  {item.product.name}
                                </Link>
                                <div className="text-sm text-gray-600">
                                  Quantité: {item.quantity} •{" "}
                                  {item.price.toFixed(2)} € / unité
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-gray-900">
                                  {item.totalPrice.toFixed(2)} €
                                </div>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="text-sm text-gray-500 text-center py-2">
                              +{order.items.length - 3} autre
                              {order.items.length - 3 !== 1 ? "s" : ""} article
                              {order.items.length - 3 !== 1 ? "s" : ""}
                            </div>
                          )}
                        </div>

                        <Separator className="mb-6" />

                        {/* Order Summary */}
                        <div className="grid md:grid-cols-3 gap-6">
                          {/* Delivery Info */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              Livraison
                            </h4>
                            <div className="text-sm text-gray-600">
                              <div>{order.shippingAddress.name}</div>
                              {order.shippingAddress.company && (
                                <div>{order.shippingAddress.company}</div>
                              )}
                              <div>{order.shippingAddress.street}</div>
                              <div>
                                {order.shippingAddress.postalCode}{" "}
                                {order.shippingAddress.city}
                              </div>
                            </div>
                            {order.estimatedDelivery && (
                              <div className="text-sm text-blue-600 mt-2">
                                Livraison prévue:{" "}
                                {new Date(
                                  order.estimatedDelivery
                                ).toLocaleDateString("fr-FR")}
                              </div>
                            )}
                          </div>

                          {/* Payment Info */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                              <DollarSign className="w-4 h-4 mr-2" />
                              Paiement
                            </h4>
                            <div className="text-sm text-gray-600">
                              <div>
                                Mode:{" "}
                                {order.paymentMethod === "credit_card"
                                  ? "Carte bancaire"
                                  : order.paymentMethod === "bank_transfer"
                                  ? "Virement bancaire"
                                  : order.paymentMethod === "check"
                                  ? "Chèque"
                                  : order.paymentMethod}
                              </div>
                              <div>
                                Sous-total: {order.subtotal.toFixed(2)} €
                              </div>
                              <div>
                                Livraison: {order.shippingAmount.toFixed(2)} €
                              </div>
                              <div>TVA: {order.taxAmount.toFixed(2)} €</div>
                              <div className="font-semibold mt-1">
                                Total: {order.totalPrice.toFixed(2)} €
                              </div>
                            </div>
                          </div>

                          {/* Tracking */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                              <Truck className="w-4 h-4 mr-2" />
                              Suivi
                            </h4>
                            {order.trackingNumber ? (
                              <div className="text-sm text-gray-600">
                                <div>N° de suivi:</div>
                                <div className="font-mono text-blue-600">
                                  {order.trackingNumber}
                                </div>
                                <Button
                                  variant="link"
                                  className="p-0 h-auto text-xs mt-1"
                                >
                                  Suivre le colis
                                </Button>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500">
                                Suivi disponible après expédition
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Voir détails
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Facture
                            </Button>
                            {order.status === "delivered" && (
                              <Button variant="outline" size="sm">
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Retourner
                              </Button>
                            )}
                          </div>

                          {order.status === "delivered" && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">
                                Évaluer cette commande:
                              </span>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <button
                                    key={i}
                                    className="text-gray-300 hover:text-yellow-400 transition-colors"
                                  >
                                    <Star className="w-4 h-4" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Order Summary Stats */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Statistiques de commandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {
                        ordersData.filter((o: any) => o.status === "delivered")
                          .length
                      }
                    </div>
                    <div className="text-sm text-gray-600">Livrées</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {
                        ordersData.filter((o: any) =>
                          ["processing", "shipped"].includes(o.status)
                        ).length
                      }
                    </div>
                    <div className="text-sm text-gray-600">En cours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {ordersData
                        .reduce((sum: any, order: any) => sum + order.totalPrice, 0)
                        .toFixed(0)}{" "}
                      €
                    </div>
                    <div className="text-sm text-gray-600">Total dépensé</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {ordersData.reduce(
                        (sum: any, order: any) => sum + order.items.length,
                        0
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Articles achetés
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
