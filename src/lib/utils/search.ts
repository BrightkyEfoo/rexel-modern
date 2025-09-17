import type { 
  SearchHit, 
  SearchResult, 
  MultiSearchResult, 
  FormattedSearchResult,
  SearchSuggestion,
  ProductDocument,
  CategoryDocument,
  BrandDocument
} from '@/lib/types/search'

/**
 * Formate un hit de recherche en résultat utilisable
 */
export function formatSearchHit(hit: SearchHit, collection: string): FormattedSearchResult {
  const document = hit.document
  const score = hit.text_match

  switch (collection) {
    case 'products':
      const product = document as ProductDocument
      return {
        type: 'product',
        id: product.id,
        title: product.name,
        subtitle: product.brand_name,
        description: product.short_description || product.description,
        image_url: product.image_url,
        url: `/produit/${product.slug}`,
        score,
        highlights: hit.highlights?.map(h => ({
          field: h.field,
          snippet: h.snippet
        }))
      }

    case 'categories':
      const category = document as CategoryDocument
      return {
        type: 'category',
        id: category.id,
        title: category.name,
        subtitle: category.parent_name ? `Sous-catégorie de ${category.parent_name}` : 'Catégorie principale',
        description: category.description,
        image_url: undefined,
        url: `/categorie/${category.slug}`,
        score,
        highlights: hit.highlights?.map(h => ({
          field: h.field,
          snippet: h.snippet
        }))
      }

    case 'brands':
      const brand = document as BrandDocument
      return {
        type: 'brand',
        id: brand.id,
        title: brand.name,
        subtitle: `${brand.products_count} produit${brand.products_count > 1 ? 's' : ''}`,
        description: brand.description,
        image_url: undefined,
        url: `/marque/${brand.slug}`,
        score,
        highlights: hit.highlights?.map(h => ({
          field: h.field,
          snippet: h.snippet
        }))
      }

    default:
      return {
        type: 'product',
        id: document.id,
        title: document.name || 'Sans titre',
        subtitle: '',
        description: '',
        image_url: undefined,
        url: '#',
        score
      }
  }
}

/**
 * Formate les résultats d'une collection pour l'autocomplétion
 */
export function formatAutocompleteResults(searchResult: SearchResult): SearchSuggestion[] {
  return searchResult.hits.slice(0, 5).map(hit => {
    const document = hit.document
    const collection = searchResult.collection

    switch (collection) {
      case 'products':
        const product = document as ProductDocument
        return {
          type: 'product',
          id: product.id,
          name: product.name,
          slug: product.slug,
          image_url: product.image_url,
          description: product.short_description,
          extra: {
            price: product.price,
            brand_name: product.brand_name,
            category_names: product.category_names
          }
        }

      case 'categories':
        const category = document as CategoryDocument
        return {
          type: 'category',
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          extra: {
            products_count: category.products_count
          }
        }

      case 'brands':
        const brand = document as BrandDocument
        return {
          type: 'brand',
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          description: brand.description,
          extra: {
            products_count: brand.products_count
          }
        }

      default:
        return {
          type: 'product',
          id: document.id,
          name: document.name || 'Sans titre',
          slug: document.slug || ''
        }
    }
  })
}

/**
 * Combine et trie les suggestions d'autocomplétion de plusieurs collections
 */
export function combineAutocompleteResults(multiResult: MultiSearchResult): SearchSuggestion[] {
  const allSuggestions: SearchSuggestion[] = []

  // Traiter chaque collection
  multiResult.results.forEach(result => {
    const suggestions = formatAutocompleteResults(result)
    allSuggestions.push(...suggestions)
  })

  // Trier par pertinence et limiter à 5 résultats
  return allSuggestions
    .sort((a, b) => {
      // Priorité : produits > catégories > marques
      const typeOrder = { product: 0, category: 1, brand: 2 }
      const aOrder = typeOrder[a.type] || 3
      const bOrder = typeOrder[b.type] || 3
      
      if (aOrder !== bOrder) {
        return aOrder - bOrder
      }
      
      // Si même type, trier par nom
      return a.name.localeCompare(b.name)
    })
    .slice(0, 5)
}

/**
 * Génère l'URL pour un résultat de recherche
 */
export function getResultUrl(suggestion: SearchSuggestion): string {
  switch (suggestion.type) {
    case 'product':
      return `/produit/${suggestion.slug}`
    case 'category':
      return `/categorie/${suggestion.slug}`
    case 'brand':
      return `/marque/${suggestion.slug}`
    default:
      return '#'
  }
}

/**
 * Formate le prix d'un produit
 */
export function formatPrice(price: number, salePrice?: number): string {
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  })

  if (salePrice && salePrice < price) {
    return `${formatter.format(salePrice)} (au lieu de ${formatter.format(price)})`
  }

  return formatter.format(price)
}

/**
 * Extrait le texte en surbrillance d'un snippet HTML
 */
export function extractHighlightedText(snippet: string): string {
  // Remplace les balises de surbrillance par des marqueurs
  return snippet
    .replace(/<mark>/g, '**')
    .replace(/<\/mark>/g, '**')
    .replace(/<[^>]*>/g, '') // Supprime les autres balises HTML
}

/**
 * Génère une description courte pour l'autocomplétion
 */
export function generateShortDescription(suggestion: SearchSuggestion): string {
  switch (suggestion.type) {
    case 'product':
      const parts = []
      if (suggestion.extra?.brand_name) {
        parts.push(suggestion.extra.brand_name)
      }
      if (suggestion.extra?.price) {
        parts.push(formatPrice(suggestion.extra.price))
      }
      return parts.join(' • ')

    case 'category':
      return `${suggestion.extra?.products_count || 0} produit${(suggestion.extra?.products_count || 0) > 1 ? 's' : ''}`

    case 'brand':
      return `${suggestion.extra?.products_count || 0} produit${(suggestion.extra?.products_count || 0) > 1 ? 's' : ''}`

    default:
      return ''
  }
}

/**
 * Détermine l'icône à afficher pour un type de résultat
 */
export function getResultIcon(type: string): string {
  switch (type) {
    case 'product':
      return '📦'
    case 'category':
      return '📁'
    case 'brand':
      return '🏷️'
    default:
      return '🔍'
  }
}

/**
 * Génère des mots-clés de recherche suggérés
 */
export function generateSearchKeywords(query: string): string[] {
  const keywords: string[] = []
  
  // Ajouter des suggestions basées sur la requête
  if (query.length >= 3) {
    keywords.push(`${query} pas cher`)
    keywords.push(`${query} promo`)
    keywords.push(`${query} neuf`)
  }

  return keywords.slice(0, 3)
}

/**
 * Vérifie si une requête de recherche est valide
 */
export function isValidSearchQuery(query: string): boolean {
  return query.trim().length >= 2
}

/**
 * Nettoie une requête de recherche
 */
export function cleanSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/\s+/g, ' ') // Remplace les espaces multiples par un seul
    .substring(0, 100) // Limite à 100 caractères
}
