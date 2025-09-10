"use client"

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchPaginationProps {
  currentPage: number
  totalPages: number
  totalResults: number
  onPageChange: (page: number) => void
}

export function SearchPagination({ currentPage, totalPages, totalResults, onPageChange }: SearchPaginationProps) {
  // Générer les numéros de page à afficher
  const generatePageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const delta = 2 // Nombre de pages à afficher de chaque côté de la page actuelle

    // Toujours afficher la première page
    pages.push(1)

    // Calculer le début et la fin de la plage autour de la page actuelle
    const start = Math.max(2, currentPage - delta)
    const end = Math.min(totalPages - 1, currentPage + delta)

    // Ajouter une ellipse si nécessaire avant la plage
    if (start > 2) {
      pages.push('ellipsis')
    }

    // Ajouter les pages dans la plage
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Ajouter une ellipse si nécessaire après la plage
    if (end < totalPages - 1) {
      pages.push('ellipsis')
    }

    // Toujours afficher la dernière page (si elle n'est pas déjà incluse)
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    // Supprimer les doublons
    return pages.filter((page, index) => {
      if (page === 'ellipsis') return true
      return pages.indexOf(page) === index
    })
  }

  const pageNumbers = generatePageNumbers()

  // Calculer les résultats affichés
  const resultsPerPage = 20 // Devrait correspondre à filters.per_page
  const startResult = (currentPage - 1) * resultsPerPage + 1
  const endResult = Math.min(currentPage * resultsPerPage, totalResults)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Informations sur les résultats */}
      <div className="text-sm text-muted-foreground">
        Affichage de {startResult.toLocaleString()} à {endResult.toLocaleString()} sur {totalResults.toLocaleString()} résultats
      </div>

      {/* Navigation */}
      <div className="flex items-center space-x-2">
        {/* Bouton Précédent */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Précédent</span>
        </Button>

        {/* Numéros de page */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, index) => (
            page === 'ellipsis' ? (
              <div key={`ellipsis-${index}`} className="px-2">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </div>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className={cn(
                  "min-w-[2.5rem] h-9",
                  currentPage === page && "pointer-events-none"
                )}
              >
                {page}
              </Button>
            )
          ))}
        </div>

        {/* Bouton Suivant */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1"
        >
          <span className="hidden sm:inline">Suivant</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
