"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Building2,
  Plus,
  Search,
  Filter,
  X,
  Star,
  Globe,
  ExternalLink,
} from "lucide-react";
import type { Brand, BrandFilters } from "@/lib/types/brands";
import { useBrandsAdmin } from "@/lib/hooks/useBrands";
import { BrandFormDialog } from "./BrandFormDialog";
import { BrandViewDialog } from "./BrandViewDialog";
import { BrandDeleteDialog } from "./BrandDeleteDialog";

export function BrandsManagement() {
  // États des filtres
  const [filters, setFilters] = useState<BrandFilters>({
    page: 1,
    per_page: 20,
    sort_by: "name",
    sort_order: "asc",
  });

  const [searchInput, setSearchInput] = useState("");

  // États des dialogues
  const [selectedBrands, setSelectedBrands] = useState<Brand[]>([]);
  const [brandToView, setBrandToView] = useState<Brand>();
  const [brandToEdit, setBrandToEdit] = useState<Brand>();
  const [brandsToDelete, setBrandsToDelete] = useState<Brand[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // API
  const { data: brandsResponse, isLoading, error } = useBrandsAdmin(filters);

  const brands = brandsResponse?.data || [];
  const meta = brandsResponse?.meta;

  // Gestion de la recherche avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters(prev => ({
          ...prev,
          search: searchInput || undefined,
          page: 1,
        }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput, filters.search]);

  // Gestion de la sélection
  const isAllSelected = brands.length > 0 && selectedBrands.length === brands.length;
  const isIndeterminate = selectedBrands.length > 0 && selectedBrands.length < brands.length;

  const handleSelectAll = (checked: boolean) => {
    setSelectedBrands(checked ? brands : []);
  };

  const handleSelectBrand = (brand: Brand, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter(b => b.id !== brand.id));
    }
  };

  // Gestion des filtres
  const handleFilterChange = (key: keyof BrandFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
      page: 1,
    }));
  };

  // Gestion de la pagination
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Gestion du tri
  const handleSort = (column: string) => {
    const isCurrentColumn = filters.sort_by === column;
    const newOrder = isCurrentColumn && filters.sort_order === 'asc' ? 'desc' : 'asc';
    setFilters(prev => ({
      ...prev,
      sort_by: column,
      sort_order: newOrder,
    }));
  };

  const clearFilters = () => {
    setSearchInput("");
    setFilters({
      page: 1,
      per_page: 20,
      sort_by: "name",
      sort_order: "asc",
    });
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.isActive !== undefined ||
    filters.isFeatured !== undefined
  );

  const getStatusBadge = (brand: Brand) => {
    if (brand.isActive) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    }
    return <Badge variant="destructive">Inactive</Badge>;
  };

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Erreur lors du chargement des marques
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          {/* En-tête avec recherche et bouton de création */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher par nom..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle marque
            </Button>
          </div>

          {/* Filtres */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Statut */}
            <Select
              value={filters.isActive === true ? "active" : filters.isActive === false ? "inactive" : "all"}
              onValueChange={(value) => 
                handleFilterChange("isActive", value === "all" ? undefined : value === "active")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* Mise en avant */}
            <Select
              value={filters.isFeatured === true ? "featured" : filters.isFeatured === false ? "not_featured" : "all"}
              onValueChange={(value) => 
                handleFilterChange("isFeatured", value === "all" ? undefined : value === "featured")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Mise en avant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="featured">Mise en avant</SelectItem>
                <SelectItem value="not_featured">Standard</SelectItem>
              </SelectContent>
            </Select>

            {/* Tri */}
            <Select
              value={`${filters.sort_by || "name"}_${filters.sort_order || "asc"}`}
              onValueChange={(value) => {
                const [sort_by, sort_order] = value.split("_");
                setFilters(prev => ({
                  ...prev,
                  sort_by: sort_by as any,
                  sort_order: sort_order as "asc" | "desc",
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name_asc">Nom A-Z</SelectItem>
                <SelectItem value="name_desc">Nom Z-A</SelectItem>
                <SelectItem value="created_at_desc">Plus récent</SelectItem>
                <SelectItem value="created_at_asc">Plus ancien</SelectItem>
              </SelectContent>
            </Select>

            {/* Effacer les filtres */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Effacer
              </Button>
            )}
          </div>

          {/* Résumé */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  Filtres actifs
                </Badge>
              )}
            </div>
            
            {meta && (
              <div className="text-sm text-muted-foreground">
                {meta.total} marque{meta.total !== 1 ? "s" : ""} trouvée{meta.total !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions en lot */}
      {selectedBrands.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedBrands.length} marque(s) sélectionnée(s)
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBrandsToDelete(selectedBrands)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer la sélection
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) (el as any).indeterminate = isIndeterminate;
                  }}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('name')}
              >
                Marque
              </TableHead>
              <TableHead>Produits</TableHead>
              <TableHead>Site web</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('created_at')}
              >
                Créée le
              </TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Squelettes de chargement
              Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                  <TableCell><Skeleton className="h-12 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : brands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">Aucune marque trouvée</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedBrands.some(b => b.id === brand.id)}
                      onCheckedChange={(checked) => handleSelectBrand(brand, !!checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        {brand.logoUrl ? (
                          <img
                            src={brand.logoUrl}
                            alt={brand.name}
                            className="max-w-full max-h-full object-contain rounded-lg"
                          />
                        ) : (
                          <Building2 className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{brand.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {brand.slug}
                          </Badge>
                          {brand.isFeatured && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Vedette
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{brand.productCount || 0}</span>
                  </TableCell>
                  <TableCell>
                    {brand.websiteUrl ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-6 p-1"
                      >
                        <a 
                          href={brand.websiteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <Globe className="w-3 h-3" />
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(brand)}</TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(brand.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setBrandToView(brand)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Voir
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setBrandToEdit(brand)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setBrandsToDelete([brand])}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {meta.current_page} sur {meta.last_page} ({meta.total} marques)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.current_page - 1)}
              disabled={meta.current_page <= 1}
            >
              Précédent
            </Button>
            
            {/* Numéros de page */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, meta.last_page) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={page === meta.current_page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.current_page + 1)}
              disabled={meta.current_page >= meta.last_page}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}

      {/* Dialogues */}
      <BrandFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        mode="create"
      />

      <BrandFormDialog
        open={!!brandToEdit}
        onOpenChange={(open) => !open && setBrandToEdit(undefined)}
        brand={brandToEdit}
        mode="edit"
      />

      <BrandViewDialog
        open={!!brandToView}
        onOpenChange={(open) => !open && setBrandToView(undefined)}
        brand={brandToView}
      />

      <BrandDeleteDialog
        open={brandsToDelete.length > 0}
        onOpenChange={(open) => !open && setBrandsToDelete([])}
        brands={brandsToDelete}
        mode={brandsToDelete.length === 1 ? "single" : "bulk"}
      />
    </div>
  );
}
