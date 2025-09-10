"use client"

import { forwardRef } from "react"
import Image from "next/image"
import { Search, Package, Folder, Tag, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SearchSuggestion } from "@/lib/types/search"
import { generateShortDescription } from "@/lib/utils/search"

interface SearchDropdownProps {
  suggestions: SearchSuggestion[]
  isLoading: boolean
  error: any
  query: string
  selectedIndex: number
  onSuggestionClick: (suggestion: SearchSuggestion) => void
  onViewAllResults: () => void
  onMouseEnterSuggestion: (index: number) => void
}

export const SearchDropdown = forwardRef<HTMLDivElement, SearchDropdownProps>(
  ({ 
    suggestions, 
    isLoading, 
    error, 
    query, 
    selectedIndex, 
    onSuggestionClick, 
    onViewAllResults,
    onMouseEnterSuggestion 
  }, ref) => {
    // Icônes par type de résultat
    const getIcon = (type: string) => {
      switch (type) {
        case 'product':
          return <Package className="w-4 h-4 text-blue-500" />
        case 'category':
          return <Folder className="w-4 h-4 text-green-500" />
        case 'brand':
          return <Tag className="w-4 h-4 text-purple-500" />
        default:
          return <Search className="w-4 h-4 text-muted-foreground" />
      }
    }

    // Labels par type
    const getTypeLabel = (type: string) => {
      switch (type) {
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

    return (
      <div
        ref={ref}
        className="absolute top-full left-0 right-0 z-50 mt-1 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-hidden"
      >
        {/* État de chargement */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Recherche en cours...</span>
          </div>
        )}

        {/* Erreur */}
        {error && !isLoading && (
          <div className="flex items-center justify-center py-8 text-destructive">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="text-sm">Erreur lors de la recherche</span>
          </div>
        )}

        {/* Aucun résultat */}
        {!isLoading && !error && suggestions.length === 0 && query.length >= 2 && (
          <div className="py-8 text-center text-muted-foreground">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun résultat pour "{query}"</p>
            <p className="text-xs mt-1">Essayez avec d'autres mots-clés</p>
          </div>
        )}

        {/* Liste des suggestions */}
        {!isLoading && !error && suggestions.length > 0 && (
          <div className="py-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.id}`}
                onClick={() => onSuggestionClick(suggestion)}
                onMouseEnter={() => onMouseEnterSuggestion(index)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors",
                  selectedIndex === index && "bg-muted"
                )}
              >
                {/* Icône du type */}
                <div className="flex-shrink-0">
                  {getIcon(suggestion.type)}
                </div>

                {/* Image du produit (si disponible) */}
                {suggestion.image_url && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={suggestion.image_url}
                      alt={suggestion.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Contenu */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground truncate">
                      {suggestion.name}
                    </span>
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {getTypeLabel(suggestion.type)}
                    </span>
                  </div>
                  
                  {/* Description courte */}
                  {generateShortDescription(suggestion) && (
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {generateShortDescription(suggestion)}
                    </p>
                  )}
                </div>

                {/* Flèche */}
                <div className="flex-shrink-0">
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>
            ))}

            {/* Bouton "Voir tous les résultats" */}
            <div className="border-t border-border mt-2">
              <button
                onClick={onViewAllResults}
                onMouseEnter={() => onMouseEnterSuggestion(suggestions.length)}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-4 py-3 text-primary hover:bg-muted transition-colors font-medium",
                  selectedIndex === suggestions.length && "bg-muted"
                )}
              >
                <Search className="w-4 h-4" />
                <span>Voir tous les résultats pour "{query}"</span>
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
)

SearchDropdown.displayName = "SearchDropdown"
