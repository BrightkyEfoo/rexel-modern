'use client';

import { Building2, Package, Truck, Users } from 'lucide-react';
import { useDashboardStats } from '@/lib/query/hooks';

const statsData = [
  {
    icon: Package,
    value: '2M+',
    label: 'références en ligne',
    description: 'Trouvez tout ce dont vous avez besoin',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Building2,
    value: '460',
    label: 'agences proches de vous',
    description: 'Partout au Cameroun',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: Truck,
    value: '35K',
    label: 'références J+1',
    description: 'Livraison rapide garantie',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    icon: Users,
    value: '4000',
    label: 'experts à votre service',
    description: 'Conseils personnalisés',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
];

export function StatsSection() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-2xl p-6 shadow-sm border animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl mx-auto mb-4" />
                  <div className="h-8 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Use real data from API if available, otherwise fallback to static data
  const displayStats = stats?.data ? [
    {
      ...statsData[0],
      value: `${Math.floor(stats.data.totalProducts / 1000000)}M+`,
    },
    {
      ...statsData[1],
      value: stats.data.totalAgencies.toString(),
    },
    {
      ...statsData[2],
      value: `${Math.floor(stats.data.deliveryReferences / 1000)}K`,
    },
    {
      ...statsData[3],
      value: stats.data.expertCount.toString(),
    },
  ] : statsData;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">KesiMarket en chiffres</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Leader de la distribution professionnelle de produits et services pour le monde de l'énergie au Cameroun
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {displayStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-lg transition-shadow duration-300">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${stat.bgColor} ${stat.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                      {stat.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {stat.description}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
            <span>Identifiez-vous pour</span>
            <div className="flex items-center space-x-4 ml-2">
              <span className="bg-white px-3 py-1 rounded-full border">📦 Bénéficier de prix personnalisés</span>
              <span className="bg-white px-3 py-1 rounded-full border">🚚 Simplifier votre expérience d'achat</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
