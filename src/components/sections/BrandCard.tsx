import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Brand } from '@/lib/api/types';

interface BrandCardProps {
  brand: Brand;
}

export function BrandCard({ brand }: BrandCardProps) {
  return (
    <div className="group bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border hover:border-primary/20 flex flex-col justify-between">
      <Link href={`/marques/${brand.name.toLowerCase()}`} className="block">
        <div className="relative h-16 flex items-center justify-center mb-4">
          <Image
            src={brand.logoUrl || '/images/logo.png'}
            alt={`Logo ${brand.name}`}
            width={120}
            height={60}
            className="object-contain max-w-full max-h-full group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `data:image/svg+xml;base64,${btoa(`
                <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="120" height="60" rx="8" fill="hsl(var(--muted))"/>
                  <text x="60" y="35" text-anchor="middle" fill="hsl(var(--muted-foreground))" font-family="Arial, sans-serif" font-size="12">${brand.name}</text>
                </svg>
              `)}`;
            }}
          />
        </div>

        <div className="text-center">
          <h3 className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
            {brand.name}
          </h3>
          <p className="text-xs text-muted-foreground mb-2">
            {brand.productCount} produits
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {brand.description}
          </p>
        </div>

        {/* Hover indicator */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-3 flex items-center justify-center">
                          <span className="text-xs text-primary-dark font-medium flex items-center">
            Voir les produits
            <ArrowRight className="w-3 h-3 ml-1" />
          </span>
        </div>
      </Link>

      {/* External website link */}
      {brand.websiteUrl && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Link
            href={brand.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-primary-dark flex items-center justify-center group/link"
            onClick={(e) => e.stopPropagation()}
          >
            Site officiel
            <ExternalLink className="w-3 h-3 ml-1 group-hover/link:scale-110 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
} 