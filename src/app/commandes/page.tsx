"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  CheckCircle,
  Clock,
  Package,
  Truck,
  XCircle,
  Loader2,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "@/lib/auth/nextauth-hooks";
import Link from "next/link";
import { formatPrice } from "../panier/utils";

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productSku: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: number;
  orderNumber: string;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  paymentMethod: "credit_card" | "bank_transfer" | "check";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  deliveryMethod: "delivery" | "pickup";
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  promoCode?: string;
  notes?: string;
  createdAt: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  items: OrderItem[];
}

const statusConfig = {
  pending: {
    label: "En attente",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmée",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
  },
  processing: {
    label: "En traitement",
    color: "bg-purple-100 text-purple-800",
    icon: Package,
  },
  shipped: {
    label: "Expédiée",
    color: "bg-green-100 text-green-800",
    icon: Truck,
  },
  delivered: {
    label: "Livrée",
    color: "bg-green-200 text-green-900",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Annulée",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
};

export default function OrdersPage() {
  const { session, isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/auth/login";
    }
  }, [isAuthenticated, isLoading]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!session?.accessToken) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/secured/orders/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des commandes");
      }

      const data = await response.json();
      setOrders(data.data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && session?.accessToken) {
      fetchOrders();
    }
  }, [isAuthenticated, session]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">
            Accueil
          </Link>
          <span>/</span>
          <span className="text-foreground">Mes commandes</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Mes commandes
            </h1>
            <p className="text-muted-foreground">
              Suivez l'état de vos commandes et consultez votre historique
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune commande</h3>
              <p className="text-muted-foreground mb-6">
                Vous n'avez pas encore passé de commande.
              </p>
              <Button asChild>
                <Link href="/catalogue">Découvrir nos produits</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Vos commandes ({orders.length})</CardTitle>
              <CardDescription>
                Historique de toutes vos commandes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => {
                    const StatusIcon = statusConfig[order.status].icon;
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono hover:underline underline-offset-2">
                          <Link href={`commandes/${order.orderNumber}`}>
                            {order.orderNumber}
                          </Link>
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <Badge className={statusConfig[order.status].color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[order.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(order.totalAmount)}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Voir
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  Commande {order.orderNumber}
                                </DialogTitle>
                                <DialogDescription>
                                  Détails de la commande passée le{" "}
                                  {formatDate(order.createdAt)}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedOrder && (
                                <OrderDetailsModal order={selectedOrder} />
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}

function OrderDetailsModal({ order }: { order: Order }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Informations générales */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-4">Informations de commande</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Numéro :</span> {order.orderNumber}
            </p>
            <p>
              <span className="font-medium">Date :</span>{" "}
              {formatDate(order.createdAt)}
            </p>
            <p>
              <span className="font-medium">Statut :</span>{" "}
              <Badge className={statusConfig[order.status].color}>
                {statusConfig[order.status].label}
              </Badge>
            </p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Détails de livraison</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Paiement :</span>{" "}
              {order.paymentMethod === "credit_card" && "Carte bancaire"}
              {order.paymentMethod === "bank_transfer" && "Virement bancaire"}
              {order.paymentMethod === "check" && "Chèque"}
            </p>
            <p>
              <span className="font-medium">Livraison :</span>{" "}
              {order.deliveryMethod === "delivery" ? "À domicile" : "Retrait"}
            </p>
            {order.confirmedAt && (
              <p>
                <span className="font-medium">Confirmée le :</span>{" "}
                {formatDate(order.confirmedAt)}
              </p>
            )}
            {order.shippedAt && (
              <p>
                <span className="font-medium">Expédiée le :</span>{" "}
                {formatDate(order.shippedAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Articles */}
      <div>
        <h3 className="font-semibold mb-4">Articles commandés</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Prix unitaire</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.productName}</div>
                    {item.productSku && (
                      <div className="text-sm text-muted-foreground">
                        SKU: {item.productSku}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatPrice(item.unitPrice)}</TableCell>
                <TableCell className="font-medium">
                  {formatPrice(item.totalPrice)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Récapitulatif financier */}
      <div className="border-t pt-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Sous-total :</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.shippingCost > 0 && (
            <div className="flex justify-between">
              <span>Frais de livraison :</span>
              <span>{formatPrice(order.shippingCost)}</span>
            </div>
          )}
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Remise :</span>
              <span>-{formatPrice(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total :</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div>
          <h3 className="font-semibold mb-2">Notes</h3>
          <p className="text-sm bg-muted p-3 rounded">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
