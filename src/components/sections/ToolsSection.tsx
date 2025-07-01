'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingCart, Settings, Box, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTools } from '@/lib/query/hooks';

const toolIcons = {
  'Paniers simplifiés': ShoppingCart,
  'Configurateurs': Settings,
  'Showroom 3D': Box,
  'Reconnaissance tableau électrique': Zap,
};

export function ToolsSection() {
  const { data: tools, isLoading, error } = useTools();

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-16 bg-gray-200 rounded mb-4" />
                <div className="h-6 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded mb-4" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="text-red-600 mb-4">Erreur lors du chargement des outils</div>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:underline"
          >
            Réessayer
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-[#162e77]" />
            <Badge variant="secondary" className="bg-[#162e77]/10 text-[#162e77]">
              Outils innovants
            </Badge>
            <Sparkles className="w-6 h-6 text-[#162e77]" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Nos outils pour vous simplifier la vie
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez notre gamme d'outils numériques conçus pour optimiser votre productivité
            et simplifier vos achats professionnels
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tools?.data?.map((tool, index) => {
            const IconComponent = toolIcons[tool.name as keyof typeof toolIcons] || Settings;

            return (
              <div
                key={tool.id}
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-[#162e77]/20 overflow-hidden"
              >
                {/* Background gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#162e77]/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Tool icon */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#162e77]/10 to-blue-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {tool.imageUrl ? (
                      <Image
                        src={tool.imageUrl}
                        alt={`Icône ${tool.name}`}
                        width={32}
                        height={32}
                        className="object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <IconComponent className="w-8 h-8 text-[#162e77]" style={{ display: tool.imageUrl ? 'none' : 'block' }} />
                  </div>

                  {/* Special badge for innovative tools */}
                  {(tool.name.includes('3D') || tool.name.includes('reconnaissance')) && (
                    <div className="absolute -top-2 -right-2">
                      <Badge variant="destructive" className="text-xs bg-gradient-to-r from-orange-400 to-red-500 border-0">
                        Nouveau
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Tool content */}
                <div className="relative space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-[#162e77] transition-colors">
                    {tool.name}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {tool.description}
                  </p>

                  {/* Key features */}
                  <div className="space-y-2">
                    {tool.name === 'Paniers simplifiés' && (
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        <span>Commande rapide en une page</span>
                      </div>
                    )}
                    {tool.name === 'Configurateurs' && (
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        <span>Outils partenaires intégrés</span>
                      </div>
                    )}
                    {tool.name === 'Showroom 3D' && (
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                        <span>Réalité augmentée</span>
                      </div>
                    )}
                    {tool.name.includes('reconnaissance') && (
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                        <span>IA intégrée</span>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group/btn border-gray-200 text-gray-700 hover:border-[#162e77] hover:text-[#162e77] hover:bg-[#162e77]/5"
                    asChild
                  >
                    <Link href={tool.link}>
                      <span>Découvrir l'outil</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>

                {/* Hover indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-6 h-6 bg-[#162e77] text-white rounded-full flex items-center justify-center">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom section with additional info */}
        <div className="bg-white rounded-2xl p-8 border">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Une expérience d'achat révolutionnée
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nos outils digitaux transforment votre façon de travailler avec des technologies
              de pointe et une interface intuitive pensée pour les professionnels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Gain de temps</h4>
              <p className="text-sm text-gray-600">Réduisez vos délais de commande et de gestion</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Box className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Innovation</h4>
              <p className="text-sm text-gray-600">Technologies 3D et intelligence artificielle</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Settings className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Simplicité</h4>
              <p className="text-sm text-gray-600">Interface intuitive et processus optimisés</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button
              size="lg"
              className="bg-[#162e77] text-white hover:bg-[#1e40af]"
              asChild
            >
              <Link href="/outils">
                Découvrir tous nos outils
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
