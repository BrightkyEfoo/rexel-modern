'use client';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { BrandsManagement } from '@/components/admin/brands';
import { CategoriesManagement } from '@/components/admin/categories';
import { OrdersTab } from '@/components/admin/orders';
import { OverviewTab } from '@/components/admin/overview';
import { ProductsManagement } from '@/components/admin/products';
import { Footer } from '@/components/layout/Footer';
import { useRequireAdminAuth } from '@/lib/hooks/useAdminAccess';
import {
  BarChart3,
  Building2,
  Package,
  ShoppingCart,
  Tag
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';


export default function AdminDashboardPage() {
  const { isAuthenticated: isAdminAuthenticated, isLoading: adminAuthLoading, adminUser } = useRequireAdminAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'brands' | 'orders'>('overview');

  // Protection par l'authentification admin
  if (adminAuthLoading || !isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Accueil</Link>
          <span>/</span>
          <span className="text-foreground">Administration</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Dashboard Administrateur
            </h1>
            <p className="text-muted-foreground">
              Bienvenue {adminUser?.name || adminUser?.email}, gérez votre catalogue et vos commandes
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Actions rapides peuvent être ajoutées ici */}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-card rounded-lg border mb-8">
          <div className="flex items-center gap-8 px-6 py-4 flex-wrap">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
              { id: 'products', label: 'Produits', icon: Package },
              { id: 'categories', label: 'Catégories', icon: Tag },
              { id: 'brands', label: 'Marques', icon: Building2 },
              { id: 'orders', label: 'Commandes', icon: ShoppingCart }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && <OverviewTab />}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <ProductsManagement />
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <CategoriesManagement />
        )}

        {/* Brands Tab */}
        {activeTab === 'brands' && (
          <BrandsManagement />
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && <OrdersTab />}
      </main>

      <Footer />
    </div>
  );
}


