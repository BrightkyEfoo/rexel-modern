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
  MapPin,
  Plus,
  Search,
  Filter,
  X,
  Phone,
  Mail,
  Clock,
  Star,
  Users,
} from "lucide-react";
import type {
  PickupPoint,
  PickupPointFilters,
} from "@/lib/types/pickup-points";
import { usePickupPointsAdmin } from "@/lib/hooks/usePickupPoints";
import { PickupPointDeleteDialog } from "./PickupPointDeleteDialog";
import { PickupPointViewDialog } from "./PickupPointViewDialog";
import { PickupPointFormDialog } from "./PickupPointFormDialog";

export function PickupPointsManagement() {
  // États des filtres
  const [filters, setFilters] = useState<PickupPointFilters>({
    page: 1,
    per_page: 20,
    sort_by: "sortOrder",
    sort_order: "asc",
  });

  const [searchInput, setSearchInput] = useState("");

  // États des dialogues
  const [selectedPickupPoints, setSelectedPickupPoints] = useState<
    PickupPoint[]
  >([]);
  const [pickupPointToView, setPickupPointToView] = useState<PickupPoint>();
  const [pickupPointToEdit, setPickupPointToEdit] = useState<PickupPoint>();
  const [pickupPointsToDelete, setPickupPointsToDelete] = useState<
    PickupPoint[]
  >([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // API
  const {
    data: pickupPointsResponse,
    isLoading,
    error,
  } = usePickupPointsAdmin(filters);

  const pickupPoints = pickupPointsResponse?.data || [];

  console.log('pickupPoints', pickupPoints)

  const meta = pickupPointsResponse?.meta;

  // Gestion de la recherche avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters((prev) => ({
          ...prev,
          search: searchInput || undefined,
          page: 1,
        }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput, filters.search]);

  // Gestion de la sélection
  const isAllSelected =
    pickupPoints.length > 0 &&
    selectedPickupPoints.length === pickupPoints.length;
  const isIndeterminate =
    selectedPickupPoints.length > 0 &&
    selectedPickupPoints.length < pickupPoints.length;

  const handleSelectAll = (checked: boolean) => {
    setSelectedPickupPoints(checked ? pickupPoints : []);
  };

  const handleSelectPickupPoint = (
    pickupPoint: PickupPoint,
    checked: boolean
  ) => {
    if (checked) {
      setSelectedPickupPoints([...selectedPickupPoints, pickupPoint]);
    } else {
      setSelectedPickupPoints(
        selectedPickupPoints.filter((p) => p.id !== pickupPoint.id)
      );
    }
  };

  // Gestion des filtres
  const handleFilterChange = (key: keyof PickupPointFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
      page: 1,
    }));
  };

  // Gestion de la pagination
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Gestion du tri
  const handleSort = (column: string) => {
    const isCurrentColumn = filters.sort_by === column;
    const newOrder =
      isCurrentColumn && filters.sort_order === "asc" ? "desc" : "asc";
    setFilters((prev) => ({
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
    filters.city ||
    filters.isActive !== undefined
  );

  const getStatusBadge = (pickupPoint: PickupPoint) => {
    if (pickupPoint.isActive) {
      return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
    }
    return <Badge variant="secondary">Inactif</Badge>;
  };

  const getRatingDisplay = (rating: number, reviewsCount: number) => {
    return (
      <div className="flex items-center space-x-1">
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
        <span className="text-xs text-gray-500">({reviewsCount})</span>
      </div>
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Erreur lors du chargement des points de relais
          </p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Points de Relais
          </h2>
          <p className="text-gray-600 mt-1">
            Gérez vos points de relais et leurs informations
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Point de Relais
        </Button>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par nom, ville, adresse..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
              >
                <X className="w-4 h-4 mr-2" />
                Effacer
              </Button>
            </div>

            {/* Filtres */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Statut */}
              <Select
                value={
                  filters.isActive === true
                    ? "active"
                    : filters.isActive === false
                    ? "inactive"
                    : "all"
                }
                onValueChange={(value) =>
                  handleFilterChange(
                    "isActive",
                    value === "all" ? undefined : value === "active"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>

              {/* Tri */}
              <Select
                value={`${filters.sort_by || "sortOrder"}_${
                  filters.sort_order || "asc"
                }`}
                onValueChange={(value) => {
                  const [sort_by, sort_order] = value.split("_");
                  setFilters((prev) => ({
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
                  <SelectItem value="sortOrder_desc">
                    Ordre décroissant
                  </SelectItem>
                  <SelectItem value="name_asc">Nom A-Z</SelectItem>
                  <SelectItem value="name_desc">Nom Z-A</SelectItem>
                  <SelectItem value="city_asc">Ville A-Z</SelectItem>
                  <SelectItem value="city_desc">Ville Z-A</SelectItem>
                  <SelectItem value="rating_desc">Note décroissante</SelectItem>
                  <SelectItem value="rating_asc">Note croissante</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions de groupe */}
      {selectedPickupPoints.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedPickupPoints.length} point(s) de relais sélectionné(s)
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPickupPointsToDelete(selectedPickupPoints)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tableau */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      {...(isIndeterminate
                        ? { "data-indeterminate": true }
                        : {})}
                    />
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("name")}
                      className="h-auto p-0 font-semibold"
                    >
                      Nom
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("city")}
                      className="h-auto p-0 font-semibold"
                    >
                      Ville
                    </Button>
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("rating")}
                      className="h-auto p-0 font-semibold"
                    >
                      Note
                    </Button>
                  </TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Skeleton loading
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : pickupPoints.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-3">
                        <MapPin className="w-12 h-12 text-gray-400" />
                        <div>
                          <p className="text-lg font-medium text-gray-900">
                            Aucun point de relais trouvé
                          </p>
                          <p className="text-gray-500">
                            {hasActiveFilters
                              ? "Essayez de modifier vos filtres de recherche."
                              : "Commencez par créer votre premier point de relais."}
                          </p>
                        </div>
                        {!hasActiveFilters && (
                          <Button onClick={() => setShowCreateDialog(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Créer un point de relais
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  pickupPoints.map((pickupPoint) => (
                    <TableRow key={pickupPoint.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedPickupPoints.some(
                            (p) => p.id === pickupPoint.id
                          )}
                          onCheckedChange={(checked) =>
                            handleSelectPickupPoint(
                              pickupPoint,
                              checked as boolean
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{pickupPoint.name}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {pickupPoint.address}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{pickupPoint.city}</span>
                        {pickupPoint.postalCode && (
                          <span className="text-sm text-gray-500 ml-1">
                            ({pickupPoint.postalCode})
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="w-3 h-3" />
                            <span>{pickupPoint.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-32">
                              {pickupPoint.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRatingDisplay(
                          pickupPoint.rating,
                          pickupPoint.reviewsCount
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(pickupPoint)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setPickupPointToView(pickupPoint)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setPickupPointToEdit(pickupPoint)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                setPickupPointsToDelete([pickupPoint])
                              }
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
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
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-500">
                Affichage de {(meta.current_page - 1) * meta.per_page + 1} à{" "}
                {Math.min(meta.current_page * meta.per_page, meta.total)} sur{" "}
                {meta.total} résultats
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(meta.current_page - 1)}
                  disabled={meta.current_page <= 1}
                >
                  Précédent
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from(
                    { length: Math.min(5, meta.last_page) },
                    (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={
                            page === meta.current_page ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-8"
                        >
                          {page}
                        </Button>
                      );
                    }
                  )}
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
        </CardContent>
      </Card>

      {/* Dialogues */}
      <PickupPointFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        pickupPoint={null}
      />

      <PickupPointFormDialog
        open={!!pickupPointToEdit}
        onOpenChange={() => setPickupPointToEdit(undefined)}
        pickupPoint={pickupPointToEdit}
      />

      <PickupPointViewDialog
        open={!!pickupPointToView}
        onOpenChange={() => setPickupPointToView(undefined)}
        pickupPoint={pickupPointToView}
      />

      <PickupPointDeleteDialog
        open={pickupPointsToDelete.length > 0}
        onOpenChange={() => setPickupPointsToDelete([])}
        pickupPoints={pickupPointsToDelete}
        onDeleted={() => {
          setPickupPointsToDelete([]);
          setSelectedPickupPoints([]);
        }}
      />
    </div>
  );
}
