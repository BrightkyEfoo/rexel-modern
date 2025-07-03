/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Box,
  Tag,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useProducts, useCategories, useBrands } from '@/lib/query/hooks';
import { useAuthUser } from '@/lib/auth/auth-hooks';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function AdminDashboardPage() {
  const { user, isAuthenticated, hasRole } = useAuthUser();
  const { data: products, isLoading: productsLoading } = useProducts({});
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: brands, isLoading: brandsLoading } = useBrands();
  // const { data: stats, isLoading: statsLoading } = useStats();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'brands' | 'orders'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Redirect if not authenticated or not admin
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     window.location.href = '/auth/login';
  //   } else if (!hasRole('admin')) {
  //     window.location.href = '/';
  //   }
  // }, [isAuthenticated, hasRole]);

  // if (!isAuthenticated || !hasRole('admin')) {
  //   return null; // Will redirect
  // }

  const isLoading = productsLoading || categoriesLoading || brandsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-64" />
            <div className="grid grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const stats:any = undefined

  const statsData = stats?.data || {
    totalProducts: products?.data?.length || 0,
    totalCategories: categories?.data?.length || 0,
    totalBrands: brands?.data?.length || 0,
    totalAgencies: 460
  };

  const filteredProducts = products?.data?.filter(product => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      if (!product.name.toLowerCase().includes(searchLower) &&
          !(product.brand?.name?.toLowerCase().includes(searchLower)) &&
          !(product.sku?.toLowerCase().includes(searchLower))) {
        return false;
      }
    }

    // Category filter
    if (filterCategory !== 'all') {
      const filterCategoryId = Number(filterCategory);
      if (product.categoryId !== filterCategoryId) {
        return false;
      }
    }

    // Status filter
    if (filterStatus !== 'all' && product.availability !== filterStatus) {
      return false;
    }

    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-[#162e77]">Accueil</Link>
          <span>/</span>
          <span className="text-gray-900">Administration</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard Administrateur
            </h1>
            <p className="text-gray-600">
              Bienvenue {user?.firstName}, gérez votre catalogue et vos commandes
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Button asChild>
              <Link href="/admin/produits/nouveau">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau produit
              </Link>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-8">
          <div className="flex items-center space-x-8 px-6 py-4 border-b border-gray-200">
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
                    ? 'bg-[#162e77] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
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
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Produits</p>
                      <p className="text-3xl font-bold text-gray-900">{statsData.totalProducts}</p>
                      <p className="text-sm text-green-600">+12% ce mois</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Catégories</p>
                      <p className="text-3xl font-bold text-gray-900">{statsData.totalCategories}</p>
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
                      <p className="text-sm font-medium text-gray-600">Marques</p>
                      <p className="text-3xl font-bold text-gray-900">{statsData.totalBrands}</p>
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
                      <p className="text-3xl font-bold text-gray-900">{statsData.totalAgencies}</p>
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
                        action: 'Nouveau produit ajouté',
                        item: 'Disjoncteur modulaire 20A',
                        time: 'Il y a 2 heures',
                        type: 'success'
                      },
                      {
                        action: 'Stock mis à jour',
                        item: 'Câble H07V-U 2.5mm²',
                        time: 'Il y a 4 heures',
                        type: 'info'
                      },
                      {
                        action: 'Produit en rupture',
                        item: 'Luminaire LED 48W',
                        time: 'Il y a 6 heures',
                        type: 'warning'
                      }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
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
                          <Image
                            src={product.imageUrl ? product.imageUrl : '/placeholder.png'}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="object-contain w-full h-full p-1"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{product.name}</div>
                          <div className="text-xs text-gray-600">{product.brand?.name}</div>
                        </div>
                        <div className="text-sm font-semibold text-[#162e77]">
                          {product.price.toFixed(2)} €
                        </div>
                      </div>
                    )) || []}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher un produit..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      {categories?.data?.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      )) || []}
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="in_stock">En stock</SelectItem>
                      <SelectItem value="out_of_stock">Rupture</SelectItem>
                      <SelectItem value="limited">Stock limité</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button asChild>
                    <Link href="/admin/produits/nouveau">
                      <Plus className="w-4 h-4 mr-2" />
                      Nouveau produit
                    </Link>
                  </Button>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
                </div>
              </CardContent>
            </Card>

            {/* Products Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Catégorie
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prix
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg mr-4">
                                <Image
                                  src={product.imageUrl ? product.imageUrl : '/placeholder.png'}
                                  alt={product.name}
                                  width={48}
                                  height={48}
                                  className="object-contain w-full h-full p-1"
                                />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500">{product.brand?.name} • {product.sku}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="secondary">{product.category?.name}</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.price.toFixed(2)} €
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              className={
                                product.availability === 'in_stock'
                                  ? 'bg-green-100 text-green-800'
                                  : product.availability === 'limited'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }
                            >
                              {product.availability === 'in_stock' && 'En stock'}
                              {product.availability === 'limited' && 'Stock limité'}
                              {product.availability === 'out_of_stock' && 'Rupture'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/produit/${product.id}`}>
                                  <Eye className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/produits/${product.id}/modifier`}>
                                  <Edit className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <CategoriesManagement categories={categories?.data || []} />
        )}

        {/* Brands Tab */}
        {activeTab === 'brands' && (
          <BrandsManagement brands={brands?.data || []} />
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <OrdersManagement />
        )}
      </main>

      <Footer />
    </div>
  );
}

// Categories Management Component
function CategoriesManagement({ categories }: { categories: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestion des catégories</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle catégorie
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg">
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    width={48}
                    height={48}
                    className="object-contain w-full h-full p-1"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.productCount} produits</p>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2 mt-4">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Brands Management Component
function BrandsManagement({ brands }: { brands: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestion des marques</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle marque
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <Card key={brand.id}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg">
                  <Image
                    src={brand.logoUrl}
                    alt={brand.name}
                    width={48}
                    height={48}
                    className="object-contain w-full h-full p-1"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{brand.name}</h3>
                  <p className="text-sm text-gray-600">{brand.productCount} produits</p>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2 mt-4">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Orders Management Component
function OrdersManagement() {
  // Mock orders data
  const orders = [
    {
      id: 'order-1',
      orderNumber: 'REX-2024-001234',
      customer: 'Jean Dupont',
      total: 234.50,
      status: 'delivered',
      date: '2024-06-01'
    },
    {
      id: 'order-2',
      orderNumber: 'REX-2024-001235',
      customer: 'Marie Martin',
      total: 156.10,
      status: 'processing',
      date: '2024-06-14'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestion des commandes</h2>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commande
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.total.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        className={
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {order.status === 'delivered' && 'Livrée'}
                        {order.status === 'processing' && 'En cours'}
                        {order.status === 'pending' && 'En attente'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
