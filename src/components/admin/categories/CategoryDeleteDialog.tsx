"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Trash2, AlertTriangle, FolderOpen } from "lucide-react";
import { useDeleteCategory, useBulkDeleteCategories } from "@/lib/hooks/useCategories";
import type { Category } from "@/lib/types/categories";
import { useToast } from "@/hooks/use-toast";

interface CategoryDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  mode: "single" | "bulk";
}

export function CategoryDeleteDialog({
  open,
  onOpenChange,
  categories,
  mode,
}: CategoryDeleteDialogProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteCategory = useDeleteCategory();
  const bulkDeleteCategories = useBulkDeleteCategories();

  // Vérifier si des catégories ont des produits ou des sous-catégories
  const categoriesWithContent = categories.filter(
    cat => (cat.productCount && cat.productCount > 0) || (cat.children && cat.children.length > 0)
  );

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (mode === "single" && categories.length === 1) {
        await deleteCategory.mutateAsync(categories[0].id);
        toast({
          title: "Catégorie supprimée",
          description: "La catégorie a été supprimée avec succès.",
        });
      } else if (mode === "bulk") {
        const categoryIds = categories.map(c => c.id);
        await bulkDeleteCategories.mutateAsync(categoryIds);
        toast({
          title: "Catégories supprimées",
          description: `${categories.length} catégorie(s) ont été supprimées avec succès.`,
        });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getTitle = () => {
    if (mode === "single") {
      return "Supprimer la catégorie";
    }
    return `Supprimer ${categories.length} catégories`;
  };

  const getDescription = () => {
    if (mode === "single") {
      return "Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.";
    }
    return `Êtes-vous sûr de vouloir supprimer ces ${categories.length} catégories ? Cette action est irréversible.`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        {/* Avertissement pour les catégories avec contenu */}
        {categoriesWithContent.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Attention !</p>
                <p>
                  {categoriesWithContent.length === 1 
                    ? "Cette catégorie contient" 
                    : `${categoriesWithContent.length} catégories contiennent`
                  } des produits ou des sous-catégories qui seront également affectés.
                </p>
                <ul className="text-sm space-y-1">
                  {categoriesWithContent.map(cat => (
                    <li key={cat.id} className="flex items-center gap-2">
                      <FolderOpen className="h-3 w-3" />
                      <span>{cat.name}</span>
                      <div className="flex gap-1">
                        {cat.productCount && cat.productCount > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {cat.productCount} produits
                          </Badge>
                        )}
                        {cat.children && cat.children.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {cat.children.length} sous-catégories
                          </Badge>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Liste des catégories à supprimer */}
        <div className="max-h-60 overflow-y-auto space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{category.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {category.slug}
                  </Badge>
                  {category.productCount && category.productCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {category.productCount} produits
                    </Badge>
                  )}
                  {!category.isActive && (
                    <Badge variant="destructive" className="text-xs">
                      Inactive
                    </Badge>
                  )}
                </div>
              </div>
              <Trash2 className="h-4 w-4 text-destructive flex-shrink-0" />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
