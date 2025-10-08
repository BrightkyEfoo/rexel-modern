"use client";

import { useState, useCallback } from "react";
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
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package,
  Building2,
  Tag,
  AlertTriangle,
  TagIcon,
} from "lucide-react";
import type { Product, ProductFilters } from "@/lib/types/products";
import { useProductsSecured } from "@/lib/hooks/useProducts";
import { ProductFormDialog } from "./ProductFormDialog";
import { ProductViewDialog } from "./ProductViewDialog";
import { ProductDeleteDialog } from "./ProductDeleteDialog";
import { formatPrice } from "@/lib/utils/currency";
import { ProductImage } from "@/components/ui/product-image";
import { ProductPagination } from "@/components/category/ProductPagination";
import { getCountryData } from "countries-list";
import Image from "next/image";
import { hasFlag } from "country-flag-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "@/lib/api/services";
import { useToast } from "@/hooks/use-toast";

interface ProductsTableProps {
  filters: ProductFilters;
  onFiltersChange: (filters: Partial<ProductFilters>) => void;
}

// Helper function pour obtenir la classe de bordure selon le statut
const getStatusBorderClass = (status?: string): string => {
  switch (status) {
    case "approved":
      return "border-l-4 border-l-green-600 hover:border-l-green-700";
    case "pending":
      // Ruban rayé jaune/noir pour les produits en attente (comme ruban de danger)
      return "relative border-l-[6px] border-l-transparent hover:shadow-lg transition-shadow";
    case "rejected":
      return "border-l-4 border-l-red-600 hover:border-l-red-700";
    case "draft":
      return "border-l-4 border-l-gray-400 hover:border-l-gray-500";
    default:
      return "border-l-4 border-l-gray-300 hover:border-l-gray-400";
  }
};

// Helper function pour obtenir le style inline des rayures pour pending
const getStatusBorderStyle = (
  status?: string
): React.CSSProperties | undefined => {
  if (status === "pending") {
    return {
      borderLeft: "6px solid transparent",
      borderImage:
        "repeating-linear-gradient(45deg, #fbbf24 0px, #fbbf24 10px, #000 10px, #000 20px) 1",
    };
  }
  return undefined;
};

export function ProductsTable({
  filters,
  onFiltersChange,
}: ProductsTableProps) {
  // États des dialogues
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [productToView, setProductToView] = useState<Product>();
  const [productToEdit, setProductToEdit] = useState<Product>();
  const [productsToDelete, setProductsToDelete] = useState<Product[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // API
  const {
    data: productsResponse,
    isLoading,
    error,
  } = useProductsSecured(filters);

  const products = productsResponse?.data || [];
  const meta = productsResponse?.meta;

  // Query client pour invalider le cache
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Mutation pour marquer en destockage
  const bulkClearanceMutation = useMutation({
    mutationFn: ({ isOnClearance }: { isOnClearance: boolean }) =>
      productsService.bulkSetClearance(
        selectedProducts.map((p) => p.id),
        isOnClearance
      ),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setSelectedProducts([]);
      toast({
        title: "Succès",
        description: variables.isOnClearance
          ? `${data.data.updated.length} produit(s) marqué(s) en destockage`
          : `${data.data.updated.length} produit(s) retiré(s) du destockage`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description:
          error.message ||
          "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      });
    },
  });

  // Gestion de la sélection
  const isAllSelected =
    products.length > 0 && selectedProducts.length === products.length;
  const isIndeterminate =
    selectedProducts.length > 0 && selectedProducts.length < products.length;

  const handleSelectAll = (checked: boolean) => {
    setSelectedProducts(checked ? products : []);
  };

  const handleSelectProduct = (product: Product, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, product]);
    } else {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    }
  };

  // Gestion de la suppression réussie
  const handleDeleteSuccess = () => {
    setSelectedProducts([]); // Vider la sélection après suppression
  };

  // Gestion de la pagination
  const handlePageChange = useCallback(
    (page: number) => {
      console.log("🔢 handlePageChange called with page:", page);
      console.log("📍 Current page:", filters.page);

      // Éviter les changements inutiles si on est déjà sur la bonne page
      if (filters.page === page) {
        console.log("⚠️ Same page, skipping update");
        return;
      }

      console.log("✅ Calling onFiltersChange with page:", page);
      onFiltersChange({ page });
    },
    [filters.page, onFiltersChange]
  );

  // Gestion du tri
  const handleSort = (column: string) => {
    const isCurrentColumn = filters.sort_by === column;
    const newOrder =
      isCurrentColumn && filters.sort_order === "asc" ? "desc" : "asc";
    onFiltersChange({
      sort_by: column,
      sort_order: newOrder,
    });
  };

  const getAvailabilityBadge = (product: Product) => {
    if (product.inStock) {
      return <Badge className="bg-green-100 text-green-800">En stock</Badge>;
    }
    return <Badge variant="destructive">Rupture</Badge>;
  };

  const getStatusBadge = (product: Product) => {
    if (product.isActive) {
      return <Badge className="bg-blue-100 text-blue-800">Actif</Badge>;
    }
    return <Badge variant="secondary">Inactif</Badge>;
  };

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Erreur lors du chargement des produits
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Actions en lot */}
        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg flex-wrap">
            <span className="text-sm font-medium">
              {selectedProducts.length} produit(s) sélectionné(s)
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => bulkClearanceMutation.mutate({ isOnClearance: true })}
              disabled={bulkClearanceMutation.isPending}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Marquer en destockage
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => bulkClearanceMutation.mutate({ isOnClearance: false })}
              disabled={bulkClearanceMutation.isPending}
            >
              <TagIcon className="w-4 h-4 mr-2" />
              Retirer du destockage
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProductsToDelete(selectedProducts)}
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
                      if (el) {
                        (el as any).indeterminate = isIndeterminate;
                      }
                    }}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("name")}
                >
                  Produit
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("price")}
                >
                  Prix
                </TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Marque</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("created_at")}
                >
                  Créé le
                </TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Squelettes de chargement
                Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-16 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8" />
                    </TableCell>
                  </TableRow>
                ))
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Aucun produit trouvé
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => {
                  const country = product.fabricationCountryCode
                    ? getCountryData(product.fabricationCountryCode as any)
                    : null;
                  const hasFlagIcon = hasFlag(
                    product.fabricationCountryCode || ""
                  );
                  return (
                    <TableRow
                      key={product.id}
                      className={getStatusBorderClass(product.status)}
                      style={getStatusBorderStyle(product.status)}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.some(
                            (p) => p.id === product.id
                          )}
                          onCheckedChange={(checked) =>
                            handleSelectProduct(product, !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <ProductImage
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-12 h-12"
                            useLogo={true}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">
                              {product.name}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              {product.sku && (
                                <Badge variant="outline" className="text-xs">
                                  {product.sku}
                                </Badge>
                              )}
                              {product.isFeatured && (
                                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                  Vedette
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {formatPrice(product.price)}
                          </div>
                          {product.salePrice &&
                            Number(product.salePrice) > 0 && (
                              <div className="text-sm text-green-600">
                                {formatPrice(product.salePrice)}
                              </div>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {product.stockQuantity}
                          </div>
                          {getAvailabilityBadge(product)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(product)}</TableCell>
                      <TableCell>
                        {product.categories && product.categories.length > 0 ? (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1 w-fit"
                          >
                            <Tag className="w-3 h-3" />
                            {product.categories[0].name}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 items-center">
                          <div className="relative w-4 h-4">
                            {country && hasFlagIcon ? (
                              <Image
                                alt={country.name}
                                src={`https://catamphetamine.gitlab.io/country-flag-icons/3x2/${product.fabricationCountryCode}.svg`}
                                fill
                              />
                            ) : null}
                          </div>
                          {product.brand ? (
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1 w-fit"
                            >
                              <Building2 className="w-3 h-3" />
                              {product.brand.name}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              -
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {new Date(product.createdAt).toLocaleDateString(
                            "fr-FR"
                          )}
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
                            <DropdownMenuItem
                              onClick={() => setProductToView(product)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setProductToEdit(product)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setProductsToDelete([product])}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination avec composant réutilisable */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {meta.current_page} sur {meta.last_page} ({meta.total}{" "}
              produits)
            </div>
            <ProductPagination
              currentPage={meta.current_page}
              totalPages={meta.last_page}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Dialogues */}
      <ProductFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        mode="create"
      />

      <ProductFormDialog
        open={!!productToEdit}
        onOpenChange={(open) => !open && setProductToEdit(undefined)}
        // @ts-ignore
        product={productToEdit}
        mode="edit"
      />

      <ProductViewDialog
        open={!!productToView}
        onOpenChange={(open) => !open && setProductToView(undefined)}
        product={productToView}
      />

      <ProductDeleteDialog
        open={productsToDelete.length > 0}
        onOpenChange={(open) => !open && setProductsToDelete([])}
        products={productsToDelete}
        mode={productsToDelete.length === 1 ? "single" : "bulk"}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </>
  );
}
