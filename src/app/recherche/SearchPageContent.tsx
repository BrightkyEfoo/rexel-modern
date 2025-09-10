"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Grid, List, SortAsc, SortDesc, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSearchFilters } from "@/lib/hooks/useSearchFilters";
import {
  useProductSearch,
  useCategorySearch,
  useBrandSearch,
} from "@/lib/hooks/useSearch";
import { formatSearchHit } from "@/lib/utils/search";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchPagination } from "@/components/search/SearchPagination";

export function SearchPageContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Gestion des paramètres de recherche avec nuqs
  const {
    filters,
    searchParams,
    updateQuery,
    updatePage,
    updateSort,
    updateType,
    resetFiltersKeepQuery,
    setFilters,
  } = useSearchFilters();

  // Requêtes de recherche selon le type sélectionné
  const productSearchQuery = useProductSearch({
    ...searchParams,
    type: undefined, // Enlever le type pour l'API spécifique
  });

  const categorySearchQuery = useCategorySearch({
    ...searchParams,
    type: undefined,
  });

  const brandSearchQuery = useBrandSearch({
    ...searchParams,
    type: undefined,
  });

  // Sélectionner les résultats selon le type
  const currentResults = useMemo(() => {
    switch (filters.type) {
      case "products":
        return productSearchQuery;
      case "categories":
        return categorySearchQuery;
      case "brands":
        return brandSearchQuery;
      default:
        // Pour "all", on combine les résultats (on priorise les produits)
        return productSearchQuery;
    }
  }, [filters.type, productSearchQuery, categorySearchQuery, brandSearchQuery]);

  // Formater les résultats pour l'affichage
  const formattedResults = useMemo(() => {
    if (!currentResults.data?.hits) return [];

    return currentResults.data.hits.map((hit) =>
      formatSearchHit(hit, currentResults.data.collection)
    );
  }, [currentResults.data]);

  // Statistiques des résultats
  const totalResults = currentResults.data?.found || 0;
  const currentPage = filters.page;
  const totalPages = Math.ceil(totalResults / filters.per_page);

  // Gérer la recherche depuis la barre
  const handleSearch = (query: string) => {
    updateQuery(query);
  };

  // Gérer le changement de page
  const handlePageChange = (page: number) => {
    updatePage(page);
    // Scroll vers le haut
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Options de tri
  const sortOptions = [
    { value: "_score:desc", label: "Pertinence" },
    { value: "name:asc", label: "Nom (A-Z)" },
    { value: "name:desc", label: "Nom (Z-A)" },
    { value: "created_at:desc", label: "Plus récent" },
    { value: "created_at:asc", label: "Plus ancien" },
  ];

  // Ajouter les options de tri spécifiques aux produits
  if (filters.type === "products" || filters.type === "all") {
    sortOptions.push(
      { value: "price:asc", label: "Prix croissant" },
      { value: "price:desc", label: "Prix décroissant" }
    );
  }

  // Types de contenu
  const contentTypes = [
    { value: "all", label: "Tout" },
    { value: "products", label: "Produits" },
    { value: "categories", label: "Catégories" },
    { value: "brands", label: "Marques" },
  ];

  return (
    <div className="space-y-8">
      {/* En-tête avec barre de recherche */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          {filters.q ? `Recherche : "${filters.q}"` : "Recherche"}
        </h1>

        {/* <div className="max-w-2xl">
          <SearchBar 
            placeholder="Affiner votre recherche..."
            onSearch={handleSearch}
          /> */}
        {/* </div> */}

        {/* Statistiques et filtres actifs */}
        {filters.q && (
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-muted-foreground">
              {currentResults.isLoading
                ? "Recherche en cours..."
                : `${totalResults.toLocaleString()} résultat${
                    totalResults > 1 ? "s" : ""
                  } trouvé${totalResults > 1 ? "s" : ""}`}
            </p>

            {/* Badges des filtres actifs */}
            {(filters.brand_id ||
              filters.category_ids ||
              filters.min_price ||
              filters.max_price ||
              filters.is_featured ||
              filters.in_stock) && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Filtres :
                  </span>

                  {filters.brand_id && (
                    <Badge variant="secondary" className="gap-1">
                      Marque: {filters.brand_id}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setFilters({ brand_id: null })}
                      />
                    </Badge>
                  )}

                  {filters.category_ids && (
                    <Badge variant="secondary" className="gap-1">
                      Catégories
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setFilters({ category_ids: null })}
                      />
                    </Badge>
                  )}

                  {(filters.min_price || filters.max_price) && (
                    <Badge variant="secondary" className="gap-1">
                      Prix: {filters.min_price || 0}€ -{" "}
                      {filters.max_price || "∞"}€
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() =>
                          setFilters({ min_price: null, max_price: null })
                        }
                      />
                    </Badge>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFiltersKeepQuery}
                    className="h-6 px-2 text-xs"
                  >
                    Effacer tout
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Contenu principal */}
      {filters.q ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtres latéraux */}
          <div
            className={`lg:block ${showFilters ? "block" : "hidden"} space-y-6`}
          >
            <div className="flex items-center justify-between lg:hidden">
              <h3 className="font-semibold">Filtres</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <SearchFilters />
          </div>

          {/* Résultats */}
          <div className="lg:col-span-3 space-y-6">
            {/* Barre d'outils */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Type de contenu */}
                <Select value={filters.type} onValueChange={updateType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Bouton filtres mobile */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
              </div>

              <div className="flex items-center gap-4">
                {/* Tri */}
                <Select value={filters.sort} onValueChange={updateSort}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Mode d'affichage */}
                <div className="flex items-center rounded-lg border">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Résultats de recherche */}
            <SearchResults
              results={formattedResults}
              isLoading={currentResults.isLoading}
              error={currentResults.error}
              viewMode={viewMode}
              query={filters.q}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <SearchPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={totalResults}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      ) : (
        /* État initial sans recherche */
        <div className="text-center py-16">
          <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-2">
            Recherchez parmi nos produits
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Utilisez la barre de recherche ci-dessus pour trouver des produits,
            catégories ou marques.
          </p>

          {/* Suggestions de recherche populaires */}
          <div className="space-y-4">
            <h3 className="font-medium">Recherches populaires :</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "électronique",
                "ordinateur",
                "smartphone",
                "accessoires",
                "gaming",
              ].map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch(term)}
                  className="capitalize"
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
