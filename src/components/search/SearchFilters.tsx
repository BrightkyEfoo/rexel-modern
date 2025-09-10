"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useSearchFilters } from "@/lib/hooks/useSearchFilters"
import { useBrands, useMainCategories } from "@/lib/query/hooks"

export function SearchFilters() {
  const {
    filters,
    updateBrand,
    updateCategories,
    updatePriceRange,
    updateFeatured,
    updateInStock,
    resetFiltersKeepQuery
  } = useSearchFilters()

  // États pour les sections collapsibles
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    price: true,
    features: true
  })

  // Données pour les filtres
  const { data: categoriesResponse } = useMainCategories()
  const { data: brandsResponse } = useBrands()

  const categories = categoriesResponse?.data || []
  const brands = brandsResponse?.data || []

  // État local pour les prix
  const [priceRange, setPriceRange] = useState([
    filters.min_price || 0,
    filters.max_price || 1000
  ])

  // Gérer l'ouverture/fermeture des sections
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Gérer le changement de prix
  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
  }

  // Appliquer le filtre de prix
  const applyPriceFilter = () => {
    updatePriceRange(priceRange[0], priceRange[1])
  }

  // Gérer la sélection de catégorie
  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    const currentIds = filters.category_ids ? filters.category_ids.split(',').map(id => parseInt(id)) : []
    
    let newIds: number[]
    if (checked) {
      newIds = [...currentIds, categoryId]
    } else {
      newIds = currentIds.filter(id => id !== categoryId)
    }

    updateCategories(newIds.length > 0 ? newIds.join(',') : null)
  }

  // Vérifier si une catégorie est sélectionnée
  const isCategorySelected = (categoryId: number) => {
    const currentIds = filters.category_ids ? filters.category_ids.split(',').map(id => parseInt(id)) : []
    return currentIds.includes(categoryId)
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filtres</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFiltersKeepQuery}
          className="text-xs h-8 px-2"
        >
          Effacer tout
        </Button>
      </div>

      {/* Catégories */}
      <Collapsible open={openSections.categories} onOpenChange={() => toggleSection('categories')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <span className="font-medium">Catégories</span>
            {openSections.categories ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          <div className="max-h-48 overflow-y-auto space-y-2">
            {categories.slice(0, 10).map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={isCategorySelected(category.id)}
                  onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="text-sm font-normal cursor-pointer flex-grow"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
          
          {categories.length > 10 && (
            <Button variant="ghost" size="sm" className="w-full text-xs">
              Voir plus de catégories
            </Button>
          )}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Marques */}
      <Collapsible open={openSections.brands} onOpenChange={() => toggleSection('brands')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <span className="font-medium">Marques</span>
            {openSections.brands ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          <div className="max-h-48 overflow-y-auto space-y-2">
            {brands.slice(0, 10).map((brand) => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand.id}`}
                  checked={filters.brand_id === brand.id}
                  onCheckedChange={(checked) => updateBrand(checked ? brand.id : null)}
                />
                <Label
                  htmlFor={`brand-${brand.id}`}
                  className="text-sm font-normal cursor-pointer flex-grow"
                >
                  {brand.name}
                </Label>
              </div>
            ))}
          </div>
          
          {brands.length > 10 && (
            <Button variant="ghost" size="sm" className="w-full text-xs">
              Voir plus de marques
            </Button>
          )}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Prix */}
      <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <span className="font-medium">Prix</span>
            {openSections.price ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-3">
          {/* Slider de prix */}
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={2000}
              min={0}
              step={10}
              className="w-full"
            />
          </div>

          {/* Affichage des valeurs */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{priceRange[0]}€</span>
            <span>{priceRange[1]}€</span>
          </div>

          {/* Champs de saisie manuelle */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-price" className="text-xs">Min</Label>
              <Input
                id="min-price"
                type="number"
                value={priceRange[0]}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0
                  setPriceRange([value, priceRange[1]])
                }}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="max-price" className="text-xs">Max</Label>
              <Input
                id="max-price"
                type="number"
                value={priceRange[1]}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1000
                  setPriceRange([priceRange[0], value])
                }}
                className="h-8 text-xs"
              />
            </div>
          </div>

          {/* Bouton appliquer */}
          <Button
            onClick={applyPriceFilter}
            size="sm"
            className="w-full h-8 text-xs"
          >
            Appliquer
          </Button>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Caractéristiques */}
      <Collapsible open={openSections.features} onOpenChange={() => toggleSection('features')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <span className="font-medium">Caractéristiques</span>
            {openSections.features ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          {/* Produits en vedette */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={filters.is_featured === true}
              onCheckedChange={(checked) => updateFeatured(checked ? true : null)}
            />
            <Label htmlFor="featured" className="text-sm font-normal cursor-pointer">
              Produits en vedette
            </Label>
          </div>

          {/* Produits en stock */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={filters.in_stock === true}
              onCheckedChange={(checked) => updateInStock(checked ? true : null)}
            />
            <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
              En stock uniquement
            </Label>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
