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
  Tag,
  Plus,
  Search,
  Filter,
  X,
  Folder,
  FolderOpen,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { Category, CategoryFilters } from "@/lib/types/categories";
import { useCategoriesAdmin } from "@/lib/hooks/useCategories";
import { CategoryFormDialog } from "./CategoryFormDialog";
import { CategoryViewDialog } from "./CategoryViewDialog";
import { CategoryDeleteDialog } from "./CategoryDeleteDialog";

export function CategoriesManagement() {
  // États des filtres
  const [filters, setFilters] = useState<CategoryFilters>({
    page: 1,
    per_page: 20,
    sort_by: "sortOrder",
    sort_order: "asc",
  });

  const [searchInput, setSearchInput] = useState("");

  // États des dialogues
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [categoryToView, setCategoryToView] = useState<Category>();
  const [categoryToEdit, setCategoryToEdit] = useState<Category>();
  const [categoriesToDelete, setCategoriesToDelete] = useState<Category[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // API
  const { data: categoriesResponse, isLoading, error } = useCategoriesAdmin(filters);

  const categories = categoriesResponse?.data || [];
  const meta = categoriesResponse?.meta;

  // Gestion de la recherche avec debounce
  React.useEffect(() => {
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
  const isAllSelected = categories.length > 0 && selectedCategories.length === categories.length;
  const isIndeterminate = selectedCategories.length > 0 && selectedCategories.length < categories.length;

  const handleSelectAll = (checked: boolean) => {
    setSelectedCategories(checked ? categories : []);
  };

  const handleSelectCategory = (category: Category, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c.id !== category.id));
    }
  };

  // Gestion des filtres
  const handleFilterChange = (key: keyof CategoryFilters, value: any) => {
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
      sort_by: "sortOrder",
      sort_order: "asc",
    });
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.parentId ||
    filters.isActive !== undefined
  );

  const getStatusBadge = (category: Category) => {
    if (category.isActive) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    }
    return <Badge variant="destructive">Inactive</Badge>;
  };

  const getHierarchyIcon = (category: Category) => {
    if (category.is_root) {
      return <Folder className="w-4 h-4 text-blue-600" />;
    } else if (category.is_leaf) {
      return <FolderOpen className="w-4 h-4 text-purple-600" />;
    }
    return <Folder className="w-4 h-4 text-muted-foreground" />;
  };

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Erreur lors du chargement des catégories
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
              Nouvelle catégorie
            </Button>
          </div>

          {/* Filtres */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Catégorie parente */}
            <Select
              value={filters.parentId?.toString() || "all"}
              onValueChange={(value) => handleFilterChange("parentId", value === "all" ? undefined : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Catégorie parente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="root">Catégories racines</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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

            {/* Tri */}
            <Select
              value={`${filters.sort_by || "sortOrder"}_${filters.sort_order || "asc"}`}
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
                <SelectItem value="sortOrder_asc">Ordre croissant</SelectItem>
                <SelectItem value="sortOrder_desc">Ordre décroissant</SelectItem>
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
                {meta.total} catégorie{meta.total !== 1 ? "s" : ""} trouvée{meta.total !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions en lot */}
      {selectedCategories.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedCategories.length} catégorie(s) sélectionnée(s)
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCategoriesToDelete(selectedCategories)}
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
                Catégorie
              </TableHead>
              <TableHead>Hiérarchie</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('sortOrder')}
              >
                Ordre
              </TableHead>
              <TableHead>Produits</TableHead>
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
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Tag className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">Aucune catégorie trouvée</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedCategories.some(c => c.id === category.id)}
                      onCheckedChange={(checked) => handleSelectCategory(category, !!checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        {category.imageUrl ? (
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          getHierarchyIcon(category)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{category.name}</div>
                        <div className="text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {category.slug}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {category.parent ? (
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <ArrowUp className="w-3 h-3" />
                          {category.parent.name}
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-800">Racine</Badge>
                      )}
                      {category.children && category.children.length > 0 && (
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <ArrowDown className="w-3 h-3" />
                          {category.children.length} sous-catégories
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{category.sortOrder}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{category.productCount || 0}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(category)}</TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(category.createdAt).toLocaleDateString('fr-FR')}
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
                        <DropdownMenuItem onClick={() => setCategoryToView(category)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Voir
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCategoryToEdit(category)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setCategoriesToDelete([category])}
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
            Page {meta.current_page} sur {meta.last_page} ({meta.total} catégories)
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
      <CategoryFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        mode="create"
      />

      <CategoryFormDialog
        open={!!categoryToEdit}
        onOpenChange={(open) => !open && setCategoryToEdit(undefined)}
        category={categoryToEdit}
        mode="edit"
      />

      <CategoryViewDialog
        open={!!categoryToView}
        onOpenChange={(open) => !open && setCategoryToView(undefined)}
        category={categoryToView}
      />

      <CategoryDeleteDialog
        open={categoriesToDelete.length > 0}
        onOpenChange={(open) => !open && setCategoriesToDelete([])}
        categories={categoriesToDelete}
        mode={categoriesToDelete.length === 1 ? "single" : "bulk"}
      />
    </div>
  );
}
