/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  DollarSign,
  Download,
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  RotateCcw,
  Star,
  Truck,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
// import { useOrder } from '@/lib/query/hooks';
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/lib/auth/nextauth-hooks";
import { appConfig } from "@/lib/config/app";
import { useOrder } from "@/lib/hooks/useOrders";
import { formatPrice } from "@/lib/utils/currency";

export default function OrderDetailPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const { user, isAuthenticated } = useAuth();
  const { data: order, isLoading, error } = useOrder(orderNumber);

  const [activeTab, setActiveTab] = useState<
    "details" | "tracking" | "documents" | "support"
  >("details");

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
          description: "Votre commande est en attente de validation",
        };
      case "confirmed":
        return {
          label: "Confirmée",
          color: "bg-blue-100 text-blue-800",
          icon: CheckCircle,
          description: "Votre commande a été confirmée et va être préparée",
        };
      case "processing":
        return {
          label: "En préparation",
          color: "bg-purple-100 text-purple-800",
          icon: Package,
          description:
            "Votre commande est en cours de préparation dans nos entrepôts",
        };
      case "shipped":
        return {
          label: "Expédiée",
          color: "bg-indigo-100 text-indigo-800",
          icon: Truck,
          description: "Votre commande a été expédiée et est en route",
        };
      case "delivered":
        return {
          label: "Livrée",
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
          description: "Votre commande a été livrée avec succès",
        };
      case "cancelled":
        return {
          label: "Annulée",
          color: "bg-red-100 text-red-800",
          icon: X,
          description: "Votre commande a été annulée",
        };
      default:
        return {
          label: status,
          color: "bg-gray-100 text-gray-800",
          icon: Package,
          description: "Statut de la commande",
        };
    }
  };

  const getOrderTimeline = (order: any) => {
    const timeline = [
      {
        status: "pending",
        label: "Commande passée",
        date: order.createdAt,
        completed: true,
        description: "Votre commande a été enregistrée",
      },
      {
        status: "confirmed",
        label: "Commande confirmée",
        date: order.status === "pending" ? null : order.updatedAt,
        completed: ["confirmed", "processing", "shipped", "delivered"].includes(
          order.status
        ),
        description: "Votre commande a été validée",
      },
      {
        status: "processing",
        label: "Préparation",
        date: order.status === "processing" ? order.updatedAt : null,
        completed: ["processing", "shipped", "delivered"].includes(
          order.status
        ),
        description: "Préparation en cours dans nos entrepôts",
      },
      {
        status: "shipped",
        label: "Expédition",
        date: order.status === "shipped" ? order.updatedAt : null,
        completed: ["shipped", "delivered"].includes(order.status),
        description: "Votre colis est en route",
      },
      {
        status: "delivered",
        label: "Livraison",
        date:
          order.status === "delivered"
            ? order.updatedAt
            : order.estimatedDelivery,
        completed: order.status === "delivered",
        description:
          order.status === "delivered" ? "Colis livré" : "Livraison prévue",
      },
    ];

    if (order.status === "cancelled") {
      return [
        timeline[0],
        {
          status: "cancelled",
          label: "Commande annulée",
          date: order.updatedAt,
          completed: true,
          description: order.cancelReason || "Commande annulée",
        },
      ];
    }

    return timeline;
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-64" />
            <div className="h-96 bg-gray-200 rounded" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Commande non trouvée ou erreur lors du chargement.
            </AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    );
  }

  const orderData: any = order;
  const statusConfig = getStatusConfig(orderData.status);
  const StatusIcon = statusConfig.icon;
  const timeline = getOrderTimeline(orderData);

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
          <Link href="/commandes" className="hover:text-[#162e77]">
            Mes commandes
          </Link>
          <span>/</span>
          <span className="text-gray-900">{orderData.orderNumber}</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            {/* <Button variant="outline" size="sm" asChild>
              <Link href="/commandes">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux commandes
              </Link>
            </Button> */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Commande {orderData.orderNumber}
              </h1>
              <p className="text-gray-600">
                Passée le{" "}
                {new Date(orderData.createdAt).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge className={`${statusConfig.color} text-sm px-4 py-1`}>
              <StatusIcon className="w-4 h-4 mr-2" />
              {statusConfig.label}
            </Badge>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#162e77]">
                {formatPrice(orderData.totalAmount)}
              </div>
              <div className="text-sm text-gray-500">
                {orderData.items.length} article
                {orderData.items.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <Card className="mb-8 border-l-4 border-l-blue-500 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <StatusIcon className="w-6 h-6 text-blue-600" />
              <div>
                <div className="font-semibold text-blue-900">
                  {statusConfig.label}
                </div>
                <div className="text-blue-700">{statusConfig.description}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-8">
          <div className="flex items-center gap-8 px-6 py-4 flex-wrap">
            {[
              { id: "details", label: "Détails", icon: Package },
              { id: "tracking", label: "Suivi", icon: Truck },
              { id: "documents", label: "Documents", icon: FileText },
              { id: "support", label: "Support", icon: MessageCircle },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === id
                    ? "bg-[#162e77] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Details Tab */}
        {activeTab === "details" && (
          <div className="space-y-8">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Articles commandés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-lg">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="object-contain w-full h-full p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <Link
                          href={`/produit/${item.slug}`}
                          className="font-semibold text-gray-900 hover:text-[#162e77]"
                        >
                          {item.product.name}
                        </Link>
                        <div className="text-sm text-gray-600 mt-1">
                          <Badge variant="secondary">
                            {item.product.brandName}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Quantité: {item.quantity} • Prix unitaire:{" "}
                          {formatPrice(item.price)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#162e77]">
                          {formatPrice(item.totalPrice)}
                        </div>
                        {orderData.status === "delivered" && (
                          <Button variant="outline" size="sm" className="mt-2">
                            <Star className="w-4 h-4 mr-2" />
                            Évaluer
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                {/* Order Summary */}
                <div className="space-y-2 max-w-md ml-auto">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{formatPrice(orderData.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span>
                      {formatPrice(orderData.shippingAddress?.amount || "0")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>TVA</span>
                    <span>{formatPrice(orderData.taxAmount || "0")}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#162e77]">
                      {formatPrice(orderData.totalAmount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Addresses and Payment */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Shipping Address */}
              {orderData?.shippingAddress ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Adresse de livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="font-semibold">
                        {orderData.shippingAddress.name}
                      </div>
                      {orderData.shippingAddress.company && (
                        <div className="text-gray-600">
                          {orderData.shippingAddress.company}
                        </div>
                      )}
                      <div className="text-gray-600">
                        {orderData.shippingAddress.street}
                        <br />
                        {orderData.shippingAddress.postalCode}{" "}
                        {orderData.shippingAddress.city}
                        <br />
                        {orderData.shippingAddress.country}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {/* Payment Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Informations de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">Mode de paiement:</span>
                      <div className="font-semibold">
                        {orderData.paymentMethod === "credit_card" &&
                          "Carte bancaire"}
                        {orderData.paymentMethod === "bank_transfer" &&
                          "Virement bancaire"}
                        {orderData.paymentMethod === "check" && "Chèque"}
                      </div>
                    </div>
                    {orderData?.billingAddress ? (
                      <div>
                        <span className="text-gray-600">
                          Adresse de facturation:
                        </span>
                        <div className="text-sm mt-1">
                          <div>{orderData.billingAddress.name}</div>
                          {orderData.billingAddress.company && (
                            <div>{orderData.billingAddress.company}</div>
                          )}
                          <div>
                            {orderData.billingAddress.street}
                            <br />
                            {orderData.billingAddress.postalCode}{" "}
                            {orderData.billingAddress.city}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tracking Tab */}
        {activeTab === "tracking" && (
          <div className="space-y-8">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Suivi de commande</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {timeline.map((step, index) => (
                    <div
                      key={step.status}
                      className="flex items-start space-x-4"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          step.completed
                            ? "bg-green-100 border-green-500 text-green-600"
                            : "bg-gray-100 border-gray-300 text-gray-400"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`font-semibold ${
                            step.completed ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {step.label}
                        </div>
                        <div
                          className={`text-sm ${
                            step.completed ? "text-gray-600" : "text-gray-400"
                          }`}
                        >
                          {step.description}
                        </div>
                        {step.date && (
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(step.date).toLocaleDateString("fr-FR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        )}
                      </div>
                      {index < timeline.length - 1 && (
                        <div
                          className={`w-px h-8 ml-5 ${
                            step.completed ? "bg-green-300" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tracking Number */}
            {orderData.trackingNumber && (
              <Card>
                <CardHeader>
                  <CardTitle>Numéro de suivi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-mono text-lg font-semibold text-[#162e77]">
                        {orderData.trackingNumber}
                      </div>
                      <div className="text-sm text-gray-600">
                        Transporteur: La Poste Colissimo
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigator.clipboard?.writeText(
                            orderData.trackingNumber
                          )
                        }
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copier
                      </Button>
                      <Button size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Suivre le colis
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Estimated Delivery */}
            {orderData.estimatedDelivery &&
              orderData.status !== "delivered" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Livraison prévue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                      <Calendar className="w-6 h-6 text-blue-600" />
                      <div>
                        <div className="font-semibold text-blue-900">
                          {new Date(
                            orderData.estimatedDelivery
                          ).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-blue-700 text-sm">
                          Livraison prévue entre 9h et 18h
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Documents disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-6 h-6 text-blue-600" />
                      <div>
                        <div className="font-semibold">Facture</div>
                        <div className="text-sm text-gray-600">
                          {orderData.orderNumber}.pdf
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-6 h-6 text-green-600" />
                      <div>
                        <div className="font-semibold">Bon de livraison</div>
                        <div className="text-sm text-gray-600">
                          BL-{orderData.orderNumber}.pdf
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>

                  {orderData.status === "delivered" && (
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-6 h-6 text-purple-600" />
                        <div>
                          <div className="font-semibold">
                            Certificat de livraison
                          </div>
                          <div className="text-sm text-gray-600">
                            Preuve de livraison avec signature
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Support Tab */}
        {activeTab === "support" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Besoin d'aide ?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Contacter notre support</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <Phone className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Téléphone</div>
                          <div className="text-sm text-gray-600">
                            01 42 85 85 85
                          </div>
                          <div className="text-xs text-gray-500">
                            Lun-Ven 8h-18h
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <Mail className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium">Email</div>
                          <div className="text-sm text-gray-600">
                            {appConfig.contact.supportEmail}
                          </div>
                          <div className="text-xs text-gray-500">
                            Réponse sous 24h
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <MessageCircle className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="font-medium">Chat en ligne</div>
                          <div className="text-sm text-gray-600">
                            Support instantané
                          </div>
                          <div className="text-xs text-gray-500">
                            Lun-Ven 9h-17h
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Actions disponibles</h3>
                    <div className="space-y-2">
                      {orderData.status === "delivered" && (
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Retourner un article
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Signaler un problème
                      </Button>
                      {orderData.status === "pending" && (
                        <Button
                          variant="outline"
                          className="w-full justify-start text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Annuler la commande
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-200">
          <Button variant="outline" asChild>
            <Link href="/commandes">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux commandes
            </Link>
          </Button>

          <div className="flex space-x-4">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Télécharger la facture
            </Button>
            {orderData.status === "delivered" && (
              <Button>
                <Star className="w-4 h-4 mr-2" />
                Évaluer ma commande
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
