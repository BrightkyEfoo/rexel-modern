"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OrdersManagement } from "./OrdersManagement";
import { InvoiceSignatureVerification } from "./InvoiceSignatureVerification";
import { OrderIssuesManagement } from "./OrderIssuesManagement";
import { Shield, ShoppingCart, AlertTriangle } from "lucide-react";

export function OrdersTab() {
  const [activeSubTab, setActiveSubTab] = useState<
    "orders" | "signatures" | "issues"
  >("orders");

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-4 px-6 py-4">
          <Button
            variant={activeSubTab === "orders" ? "default" : "outline"}
            onClick={() => setActiveSubTab("orders")}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Gestion des commandes
          </Button>
          <Button
            variant={activeSubTab === "signatures" ? "default" : "outline"}
            onClick={() => setActiveSubTab("signatures")}
            className="flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Vérification de signatures
          </Button>
          <Button
            variant={activeSubTab === "issues" ? "default" : "outline"}
            onClick={() => setActiveSubTab("issues")}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Signalements
          </Button>
        </div>
      </div>

      {/* Content */}
      {activeSubTab === "orders" && <OrdersManagement />}
      {activeSubTab === "signatures" && <InvoiceSignatureVerification />}
      {activeSubTab === "issues" && <OrderIssuesManagement />}
    </div>
  );
}
