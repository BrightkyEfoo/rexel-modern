"use client"

import Link from "next/link"
import Image from "next/image"
import { Package, Folder, Tag, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { FormattedSearchResult } from "@/lib/types/search"
import { cn } from "@/lib/utils"

interface SearchResultCardProps {
  result: FormattedSearchResult
}

export function SearchResultCard({ result }: SearchResultCardProps) {
  // Icône selon le type
  const getTypeIcon = () => {
    switch (result.type) {
      case 'product':
        return <Package className="w-4 h-4 text-blue-500" />
      case 'category':
        return <Folder className="w-4 h-4 text-green-500" />
      case 'brand':
        return <Tag className="w-4 h-4 text-purple-500" />
      default:
        return null
    }
  }

  // Label du type
  const getTypeLabel = () => {
    switch (result.type) {
      case 'product':
        return 'Produit'
      case 'category':
        return 'Catégorie'
      case 'brand':
        return 'Marque'
      default:
        return ''
    }
  }

  // Couleur du badge selon le type
  const getTypeBadgeVariant = () => {
    switch (result.type) {
      case 'product':
        return 'default'
      case 'category':
        return 'secondary'
      case 'brand':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <Link href={result.url}>
        <CardContent className="p-4 space-y-3">
          {/* Image */}
          <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
            {result.image_url ? (
              <Image
                src={result.image_url}
                alt={result.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {getTypeIcon() || <Package className="w-8 h-8 text-muted-foreground" />}
              </div>
            )}

            {/* Badge du type */}
            <div className="absolute top-2 left-2">
              <Badge variant={getTypeBadgeVariant() as any} className="text-xs">
                {getTypeLabel()}
              </Badge>
            </div>

            {/* Score de pertinence (visible en hover pour debug) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Badge variant="secondary" className="text-xs">
                  {Math.round(result.score * 100)}%
                </Badge>
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className="space-y-2">
            {/* Titre */}
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {result.title}
            </h3>

            {/* Sous-titre */}
            {result.subtitle && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {result.subtitle}
              </p>
            )}

            {/* Description */}
            {result.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {result.description}
              </p>
            )}

            {/* Highlights (extraits de recherche) */}
            {result.highlights && result.highlights.length > 0 && (
              <div className="space-y-1">
                {result.highlights.slice(0, 2).map((highlight, index) => (
                  <p key={index} className="text-xs text-muted-foreground">
                    <span className="font-medium capitalize">{highlight.field}:</span>{' '}
                    <span 
                      dangerouslySetInnerHTML={{ 
                        __html: highlight.snippet.replace(/\*\*(.*?)\*\*/g, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>') 
                      }} 
                    />
                  </p>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
