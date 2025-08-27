"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Tag, 
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Hash,
  Folder,
  FolderOpen,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import type { Category } from "@/lib/types/categories";

interface CategoryViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
}

export function CategoryViewDialog({
  open,
  onOpenChange,
  category,
}: CategoryViewDialogProps) {
  if (!category) return null;

  const getStatusBadge = () => {
    if (category.isActive) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    }
    return <Badge variant="destructive">Inactive</Badge>;
  };

  const getHierarchyBadge = () => {
    if (category.is_root) {
      return <Badge className="bg-blue-100 text-blue-800">Catégorie racine</Badge>;
    } else if (category.is_leaf) {
      return <Badge className="bg-purple-100 text-purple-800">Catégorie finale</Badge>;
    }
    return <Badge variant="outline">Catégorie intermédiaire</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Détails de la catégorie
          </DialogTitle>
          <DialogDescription>
            Consultez toutes les informations de cette catégorie.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* En-tête de la catégorie */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{category.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      {category.slug}
                    </Badge>
                    {getStatusBadge()}
                    {getHierarchyBadge()}
                  </div>
                </div>
                {category.imageUrl && (
                  <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </CardHeader>
            {category.description && (
              <CardContent>
                <p className="text-muted-foreground">{category.description}</p>
              </CardContent>
            )}
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hiérarchie */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  Hiérarchie
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ordre de tri</span>
                  <span className="font-medium">{category.sortOrder}</span>
                </div>
                
                {category.parent && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Catégorie parente</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <ArrowUp className="h-3 w-3" />
                      {category.parent.name}
                    </Badge>
                  </div>
                )}

                {!category.parent && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Niveau</span>
                    <Badge className="bg-blue-100 text-blue-800">Racine</Badge>
                  </div>
                )}

                {category.children && category.children.length > 0 && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Sous-catégories</span>
                      <span className="font-medium">{category.children.length}</span>
                    </div>
                    <div className="space-y-1">
                      {category.children.slice(0, 5).map((child) => (
                        <Badge key={child.id} variant="outline" className="flex items-center gap-1 w-fit">
                          <ArrowDown className="h-3 w-3" />
                          {child.name}
                        </Badge>
                      ))}
                      {category.children.length > 5 && (
                        <Badge variant="outline">
                          +{category.children.length - 5} autres
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nombre de produits</span>
                  <span className="font-medium">{category.productCount || 0}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Statut</span>
                  <div className="flex items-center gap-1">
                    {category.isActive ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {category.breadcrumb_slugs && category.breadcrumb_slugs.length > 0 && (
                  <div>
                    <div className="text-muted-foreground mb-2">Chemin complet</div>
                    <div className="text-sm font-mono bg-muted p-2 rounded">
                      /{category.breadcrumb_slugs.join('/')}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations système */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Informations système
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID</span>
                  <span className="font-mono text-sm">{category.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Slug</span>
                  <span className="font-mono text-sm">{category.slug}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Créée le</span>
                  <span className="text-sm">
                    {new Date(category.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Modifiée le</span>
                  <span className="text-sm">
                    {new Date(category.updatedAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Ancêtres */}
            {category.ancestors && category.ancestors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Hiérarchie complète
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.ancestors.map((ancestor, index) => (
                      <div key={ancestor.id} className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">
                          Niveau {index + 1}:
                        </span>
                        <Badge variant="outline">
                          {ancestor.name}
                        </Badge>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">
                        Niveau {category.ancestors.length + 1}:
                      </span>
                      <Badge className="bg-primary text-primary-foreground">
                        {category.name} (actuelle)
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
