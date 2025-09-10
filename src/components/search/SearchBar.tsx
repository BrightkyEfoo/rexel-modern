"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAutocomplete } from "@/lib/hooks/useSearch"
import { combineAutocompleteResults, getResultUrl, generateShortDescription, isValidSearchQuery, cleanSearchQuery } from "@/lib/utils/search"
import { SearchDropdown } from "./SearchDropdown"

interface SearchBarProps {
  placeholder?: string
  className?: string
  showButton?: boolean
  onSearch?: (query: string) => void
}

export function SearchBar({ 
  placeholder = "Rechercher un produit, une marque, une catégorie...", 
  className = "",
  showButton = true,
  onSearch 
}: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Recherche d'autocomplétion avec debounce
  const { data: autocompleteData, isLoading, error } = useAutocomplete(query)

  // Combine les résultats de toutes les collections
  const suggestions = autocompleteData ? combineAutocompleteResults(autocompleteData) : []

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Gérer les touches du clavier
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault()
          setSelectedIndex(prev => 
            prev < suggestions.length ? prev + 1 : prev
          )
          break
        case "ArrowUp":
          event.preventDefault()
          setSelectedIndex(prev => prev > -1 ? prev - 1 : -1)
          break
        case "Enter":
          event.preventDefault()
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            // Naviguer vers le résultat sélectionné
            const suggestion = suggestions[selectedIndex]
            const url = getResultUrl(suggestion)
            router.push(url)
            setIsOpen(false)
            inputRef.current?.blur()
          } else if (selectedIndex === suggestions.length) {
            // "Voir tous les résultats"
            handleSearch()
          } else {
            // Recherche normale
            handleSearch()
          }
          break
        case "Escape":
          setIsOpen(false)
          inputRef.current?.blur()
          break
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, selectedIndex, suggestions, query, router])

  // Gérer le changement de texte
  const handleInputChange = (value: string) => {
    const cleanedQuery = cleanSearchQuery(value)
    setQuery(cleanedQuery)
    setSelectedIndex(-1)
    
    if (isValidSearchQuery(cleanedQuery)) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  // Gérer la soumission du formulaire
  const handleSearch = () => {
    const cleanedQuery = cleanSearchQuery(query)
    
    if (!isValidSearchQuery(cleanedQuery)) {
      return
    }

    // Fermer le dropdown
    setIsOpen(false)
    inputRef.current?.blur()

    // Appeler le callback personnalisé ou naviguer vers la page de recherche
    if (onSearch) {
      onSearch(cleanedQuery)
    } else {
      router.push(`/recherche?q=${encodeURIComponent(cleanedQuery)}`)
    }
  }

  // Gérer le clic sur une suggestion
  const handleSuggestionClick = (suggestion: any) => {
    const url = getResultUrl(suggestion)
    router.push(url)
    setIsOpen(false)
    setQuery("")
  }

  // Gérer le clic sur "Voir tous les résultats"
  const handleViewAllResults = () => {
    handleSearch()
  }

  // Effacer la recherche
  const handleClear = () => {
    setQuery("")
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div className={`relative w-full max-w-2xl ${className}`}>
      <form 
        onSubmit={(e) => {
          e.preventDefault()
          handleSearch()
        }}
        className="relative flex items-center"
      >
        {/* Icône de recherche */}
        <div className="absolute left-3 z-10">
          <Search className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* Champ de saisie */}
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (isValidSearchQuery(query)) {
              setIsOpen(true)
            }
          }}
          placeholder={placeholder}
          className="pl-10 pr-20 h-12 text-base border-2 border-border focus:border-primary transition-colors"
          autoComplete="off"
          spellCheck="false"
        />

        {/* Bouton effacer */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 z-10 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}

        {/* Bouton de recherche */}
        {showButton && (
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 h-10 px-4"
            disabled={!isValidSearchQuery(query)}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        )}
      </form>

      {/* Dropdown d'autocomplétion */}
      {isOpen && (
        <SearchDropdown
          ref={dropdownRef}
          suggestions={suggestions}
          isLoading={isLoading}
          error={error}
          query={query}
          selectedIndex={selectedIndex}
          onSuggestionClick={handleSuggestionClick}
          onViewAllResults={handleViewAllResults}
          onMouseEnterSuggestion={setSelectedIndex}
        />
      )}
    </div>
  )
}
