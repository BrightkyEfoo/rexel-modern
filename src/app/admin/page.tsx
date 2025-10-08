'use client';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { BrandsManagement } from '@/components/admin/brands';
import { CategoriesManagement } from '@/components/admin/categories';
import { OrdersTab } from '@/components/admin/orders';
import { OverviewTab } from '@/components/admin/overview';
import { PickupPointsManagement } from '@/components/admin/pickup-points/PickupPointsManagement';
import { ProductsManagement } from '@/components/admin/products';
import { PendingProductsManagement } from '@/components/admin/products/PendingProductsManagement';
import { UsersManagement } from '@/components/admin/users';
import { ActivitiesManagement } from '@/components/admin/activities';
import { Footer } from '@/components/layout/Footer';
import { useRequireAdminAuth } from '@/lib/hooks/useAdminAccess';
import { useAdminTabs } from '@/lib/hooks/useAdminTabs';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import {
  BarChart3,
  Building2,
  MapPin,
  Package,
  ShoppingCart,
  Tag,
  ClipboardCheck,
  Users,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';


export default function AdminDashboardPage() {
  const { isAuthenticated: isAdminAuthenticated, isLoading: adminAuthLoading, adminUser, isAdmin, isManager } = useRequireAdminAuth();
  const { activeTab, changeTab } = useAdminTabs();
  
  // Ref pour tracker le tab précédent et déclencher la réinitialisation
  const previousTabRef = useRef(activeTab);

  // Effet pour réinitialiser les filtres et la pagination lors du changement de tab
  useEffect(() => {
    if (previousTabRef.current !== activeTab) {
      // Réinitialiser les query parameters des autres composants
      // Cela va déclencher la réinitialisation des filtres dans les composants enfants
      const url = new URL(window.location.href);
      
      // Garder seulement le paramètre tab
      const searchParams = new URLSearchParams();
      if (activeTab !== 'overview') {
        searchParams.set('tab', activeTab);
      }
      
      // Remplacer l'URL sans les autres paramètres
      const newUrl = `${url.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);
      
      previousTabRef.current = activeTab;
    }
  }, [activeTab]);

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
    <NuqsAdapter>
      <div className="min-h-screen bg-background">
        <AdminHeader />

        <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <button onClick={() => changeTab('overview')} className="hover:text-primary">Accueil</button>
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
              { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3, roles: ['admin', 'manager'] },
              { id: 'activities', label: 'Activités', icon: Activity, roles: ['admin', 'manager'] },
              { id: 'validations', label: 'Validations', icon: ClipboardCheck, roles: ['admin'] },
              { id: 'products', label: 'Produits', icon: Package, roles: ['admin', 'manager'] },
              { id: 'categories', label: 'Catégories', icon: Tag, roles: ['admin', 'manager'] },
              { id: 'brands', label: 'Marques', icon: Building2, roles: ['admin', 'manager'] },
              { id: 'pickup-points', label: 'Points de Relais', icon: MapPin, roles: ['admin', 'manager'] },
              { id: 'orders', label: 'Commandes', icon: ShoppingCart, roles: ['admin', 'manager'] },
              { id: 'users', label: 'Utilisateurs', icon: Users, roles: ['admin'] }
            ]
            .filter(({ roles }) => {
              // Filtrer les tabs selon le rôle
              if (isAdmin) return true;
              if (isManager) return roles.includes('manager');
              return false;
            })
            .map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => changeTab(id as any)}
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
        {activeTab === 'overview' && (
          <OverviewTab 
            onNavigateToActivities={() => changeTab('activities')}
            onNavigateToProducts={() => changeTab('products')}
            onNavigateToCategories={() => changeTab('categories')}
            onNavigateToBrands={() => changeTab('brands')}
            onNavigateToPickupPoints={() => changeTab('pickup-points')}
          />
        )}

        {/* Activities Tab - Admin & Manager */}
        {activeTab === 'activities' && (
          <ActivitiesManagement />
        )}

        {/* Validations Tab - Admin only */}
        {activeTab === 'validations' && isAdmin && (
          <PendingProductsManagement />
        )}

        {/* Products Tab - Admin & Manager */}
        {activeTab === 'products' && (
          <ProductsManagement />
        )}

        {/* Categories Tab - Admin & Manager */}
        {activeTab === 'categories' && (
          <CategoriesManagement />
        )}

        {/* Brands Tab - Admin & Manager */}
        {activeTab === 'brands' && (
          <BrandsManagement />
        )}

        {/* Pickup Points Tab - Admin & Manager */}
        {activeTab === 'pickup-points' && (
          <PickupPointsManagement />
        )}

        {/* Orders Tab - Admin & Manager */}
        {activeTab === 'orders' && <OrdersTab />}

        {/* Users Tab - Admin only */}
        {activeTab === 'users' && isAdmin && (
          <UsersManagement />
        )}
      </main>

        <Footer />
      </div>
    </NuqsAdapter>
  );
}


