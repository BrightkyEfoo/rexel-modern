"use client"

import Link from "next/link"
import Image from "next/image"
import { Package, Folder, Tag, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { FormattedSearchResult } from "@/lib/types/search"

interface SearchResultListItemProps {
  result: FormattedSearchResult
}

export function SearchResultListItem({ result }: SearchResultListItemProps) {
  // Icône selon le type
  const getTypeIcon = () => {
    switch (result.type) {
      case 'product':
        return <Package className="w-5 h-5 text-blue-500" />
      case 'category':
        return <Folder className="w-5 h-5 text-green-500" />
      case 'brand':
        return <Tag className="w-5 h-5 text-purple-500" />
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
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Image */}
            <div className="w-20 h-20 relative bg-muted rounded-lg overflow-hidden flex-shrink-0">
              {result.image_url ? (
                <Image
                  src={result.image_url}
                  alt={result.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="80px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {getTypeIcon() || <Package className="w-6 h-6 text-muted-foreground" />}
                </div>
              )}
            </div>

            {/* Contenu */}
            <div className="flex-grow min-w-0 space-y-2">
              {/* En-tête avec titre et badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-grow">
                  <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                    {result.title}
                  </h3>
                  {result.subtitle && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {result.subtitle}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={getTypeBadgeVariant() as any} className="text-xs">
                    {getTypeLabel()}
                  </Badge>
                  
                  {/* Score de pertinence (visible en hover pour debug) */}
                  {process.env.NODE_ENV === 'development' && (
                    <Badge variant="secondary" className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {Math.round(result.score * 100)}%
                    </Badge>
                  )}
                </div>
              </div>

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

            {/* Flèche */}
            <div className="flex items-center flex-shrink-0">
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
