"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Search,
  Eye,
  CheckCircle,
  Clock,
  Package,
  Truck,
  AlertCircle,
  XCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  useOrders,
  useUpdateOrderStatus,
  useConfirmOrder,
  type Order,
} from "@/lib/hooks/useOrders";
import { formatPrice } from "@/lib/utils/currency";

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

export function OrdersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [canLoad, setCanLoad] = useState<any>(null);

  // React Query hooks
  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useOrders({
    page: currentPage,
    limit: 20,
    status: statusFilter,
    search: searchTerm,
  });

  const updateOrderStatusMutation = useUpdateOrderStatus();
  const confirmOrderMutation = useConfirmOrder();

  // Helper functions
  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    await updateOrderStatusMutation.mutateAsync({ orderId, status: newStatus });
  };

  const handleConfirmOrder = async (orderId: number) => {
    await confirmOrderMutation.mutateAsync(orderId);
    setCanLoad(null);
  };

  // Extract data from query
  const orders = ordersData?.data || [];
  const totalPages = ordersData?.meta.lastPage || 1;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des commandes</h1>
          <p className="text-muted-foreground">
            Gérez et suivez toutes les commandes
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          disabled={isLoading}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Actualiser
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Une erreur est survenue"}
          </AlertDescription>
        </Alert>
      )}

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par numéro de commande, nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmée</SelectItem>
                <SelectItem value="processing">En traitement</SelectItem>
                <SelectItem value="shipped">Expédiée</SelectItem>
                <SelectItem value="delivered">Livrée</SelectItem>
                <SelectItem value="cancelled">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des commandes */}
      <Card>
        <CardHeader>
          <CardTitle>Commandes ({orders.length})</CardTitle>
          <CardDescription>
            Liste de toutes les commandes avec leurs statuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune commande trouvée</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Client</TableHead>
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
                        <TableCell className="font-mono">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {order.user.firstName} {order.user.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {order.user.email}
                            </div>
                            {order.user.company && (
                              <div className="text-sm text-muted-foreground">
                                {order.user.company}
                              </div>
                            )}
                          </div>
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
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>
                                    Commande {order.orderNumber}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Détails de la commande passée les{" "}
                                    {formatDate(order.createdAt)}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedOrder && (
                                  <OrderDetailsDialog
                                    order={selectedOrder}
                                    onUpdateStatus={handleUpdateStatus}
                                    onConfirm={handleConfirmOrder}
                                    updatingStatus={
                                      updateOrderStatusMutation.isPending
                                        ? selectedOrder.id
                                        : null
                                    }
                                  />
                                )}
                              </DialogContent>
                            </Dialog>

                            {order.status === "pending" && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setCanLoad(order.id);
                                  handleConfirmOrder(order.id);
                                }}
                                disabled={
                                  confirmOrderMutation.isPending &&
                                  canLoad === order.id
                                }
                              >
                                {confirmOrderMutation.isPending &&
                                canLoad === order.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </Button>
                  <span className="flex items-center px-4">
                    Page {currentPage} sur {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface OrderDetailsDialogProps {
  order: Order;
  onUpdateStatus: (orderId: number, status: string) => void;
  onConfirm: (orderId: number) => void;
  updatingStatus: number | null;
}

function OrderDetailsDialog({
  order,
  onUpdateStatus,
  onConfirm,
  updatingStatus,
}: OrderDetailsDialogProps) {
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
          <h3 className="font-semibold mb-4">Informations client</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Nom :</span> {order.user.firstName}{" "}
              {order.user.lastName}
            </p>
            <p>
              <span className="font-medium">Email :</span> {order.user.email}
            </p>
            {order.user.company && (
              <p>
                <span className="font-medium">Entreprise :</span>{" "}
                {order.user.company}
              </p>
            )}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Détails de la commande</h3>
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

      {/* Actions */}
      <div className="border-t pt-4">
        <div className="flex gap-4">
          {order.status === "pending" && (
            <Button
              onClick={() => onConfirm(order.id)}
              disabled={updatingStatus === order.id}
            >
              {updatingStatus === order.id ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Confirmer la commande
            </Button>
          )}

          <Select
            value={order.status}
            onValueChange={(value) => onUpdateStatus(order.id, value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="confirmed">Confirmée</SelectItem>
              <SelectItem value="processing">En traitement</SelectItem>
              <SelectItem value="shipped">Expédiée</SelectItem>
              <SelectItem value="delivered">Livrée</SelectItem>
              <SelectItem value="cancelled">Annulée</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
