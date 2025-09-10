"use client"

import { Search, AlertCircle, Package, Folder, Tag } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { FormattedSearchResult } from "@/lib/types/search"
import { SearchResultCard } from "./SearchResultCard"
import { SearchResultListItem } from "./SearchResultListItem"

interface SearchResultsProps {
  results: FormattedSearchResult[]
  isLoading: boolean
  error: any
  viewMode: 'grid' | 'list'
  query: string
}

export function SearchResults({ results, isLoading, error, viewMode, query }: SearchResultsProps) {
  // État de chargement
  if (isLoading) {
    return (
      <div className="space-y-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <SearchResultCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SearchResultListSkeleton key={i} />
            ))}
          </div>
        )}
      </div>
    )
  }

  // État d'erreur
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Une erreur s'est produite lors de la recherche. Veuillez réessayer.
        </AlertDescription>
      </Alert>
    )
  }

  // Aucun résultat
  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Nous n'avons trouvé aucun résultat pour "{query}". 
          Essayez avec d'autres mots-clés ou vérifiez l'orthographe.
        </p>
        
        <div className="space-y-4">
          <h4 className="font-medium">Suggestions :</h4>
          <ul className="text-sm text-muted-foreground space-y-1 max-w-sm mx-auto">
            <li>• Utilisez des mots-clés plus généraux</li>
            <li>• Vérifiez l'orthographe de vos mots-clés</li>
            <li>• Essayez des synonymes</li>
            <li>• Utilisez moins de mots-clés</li>
          </ul>
        </div>
      </div>
    )
  }

  // Affichage des résultats
  return (
    <div className="space-y-6">
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {results.map((result, index) => (
            <SearchResultCard
              key={`${result.type}-${result.id}-${index}`}
              result={result}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result, index) => (
            <SearchResultListItem
              key={`${result.type}-${result.id}-${index}`}
              result={result}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Composants de skeleton pour le chargement
function SearchResultCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="aspect-square bg-muted rounded-lg animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
        <div className="h-5 bg-muted rounded w-1/2 animate-pulse" />
      </div>
    </div>
  )
}

function SearchResultListSkeleton() {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-muted rounded-lg animate-pulse flex-shrink-0" />
        <div className="flex-grow space-y-2">
          <div className="h-5 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
