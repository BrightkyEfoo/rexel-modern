"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Package } from "lucide-react";
import {
  productSchema,
  type ProductFormData,
} from "@/lib/validations/products";
import { useCategories, useBrands } from "@/lib/query/hooks";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { UniqueInput } from "@/components/ui/unique-input";
import {
  validateProductSkuUnique,
  validateProductNameUnique,
} from "@/lib/api/validation";
import { countries } from "countries-list";
import { hasFlag } from "country-flag-icons";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DynamicKeyValueInput } from "@/components/ui/dynamic-key-value-input";

interface ImportConfig {
  enableImages: boolean;
  enableFiles: boolean;
}

interface ProductImportEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
  onSave: (data: any) => void;
  config?: ImportConfig;
}

export function ProductImportEditDialog({
  open,
  onOpenChange,
  product,
  onSave,
  config = { enableImages: true, enableFiles: true },
}: ProductImportEditDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API hooks pour les données de référence
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  // Form setup
  const form = useForm<any>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      longDescription: "",
      features: "",
      applications: "",
      sku: "",
      price: "",
      salePrice: "",
      stockQuantity: "",
      manageStock: true,
      inStock: true,
      isFeatured: false,
      isActive: true,
      brandId: "",
      fabricationCountryCode: "",
      categoryIds: [],
      images: [],
      files: [],
      weight: "",
      dimensions: { length: "", width: "", height: "" },
      warranty: "",
      certifications: [],
      additionalInfo: {
        sections: [],
      },
    },
  });

  // État pour savoir si le formulaire a été initialisé
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);

  // Reset l'état d'initialisation quand le dialog se ferme ou change de produit
  useEffect(() => {
    if (!open) {
      setIsFormInitialized(false);
      setCurrentProductId(null);
    } else if (product && product.id !== currentProductId) {
      // Nouveau produit, reset l'initialisation
      setIsFormInitialized(false);
      setCurrentProductId(product.id);
    }
  }, [open, product, currentProductId]);

  // Fonction pour initialiser le formulaire
  const initializeForm = useCallback(() => {
    if (!product) return;

    // Trouver la marque par nom si elle existe
    let brandId = undefined;
    if (product._importData?.brandName && brands?.data) {
      const brand = brands.data.find(
        (b) =>
          b.name.toLowerCase() === product._importData.brandName.toLowerCase()
      );
      brandId = brand?.id;
    }

    // Trouver les catégories par noms si elles existent
    let categoryIds: number[] = [];
    if (product._importData?.categoryNames && categories?.data) {
      const categoryNames = product._importData.categoryNames
        .split(",")
        .map((name: string) => name.trim());
      categoryIds = categories.data
        .filter((cat) =>
          categoryNames.some(
            (name: any) => cat.name.toLowerCase() === name.toLowerCase()
          )
        )
        .map((cat) => cat.id);
    }

    form.reset({
      name: product.name || "",
      description: product.description || "",
      shortDescription: product.shortDescription || "",
      longDescription: product.longDescription || "",
      features: product.features || "",
      applications: product.applications || "",
      sku: product.sku || "",
      price: product.price ? String(product.price) : "",
      salePrice: product.salePrice ? String(product.salePrice) : "",
      stockQuantity: product.stockQuantity ? String(product.stockQuantity) : "",
      manageStock: product.manageStock ?? true,
      inStock: product.inStock ?? true,
      isFeatured: product.isFeatured ?? false,
      isActive: product.isActive ?? true,
      brandId: brandId ? String(brandId) : "",
      fabricationCountryCode: product.fabricationCountryCode || "",
      categoryIds: categoryIds.map((id) => String(id)),
      images: [], // Les images seront gérées par URLs
      files: [], // Les fichiers seront gérés par URLs
      weight: product.weight ? String(product.weight) : "",
      dimensions: {
        length: product.dimensions?.length
          ? String(product.dimensions.length)
          : "",
        width: product.dimensions?.width
          ? String(product.dimensions.width)
          : "",
        height: product.dimensions?.height
          ? String(product.dimensions.height)
          : "",
      },
      warranty: product.warranty || "",
      certifications: product.certifications || [],
      additionalInfo: {
        sections: [],
      },
      // Garder les données d'import originales
      _importData: product._importData,
    });

    setIsFormInitialized(true);
  }, [product, brands?.data, categories?.data, form]);

  // Charger les données du produit dans le formulaire
  useEffect(() => {
    if (open && product && !isFormInitialized) {
      initializeForm();
    }
  }, [open, product, isFormInitialized, initializeForm]);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      // Appeler la fonction de sauvegarde personnalisée
      onSave(data);

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Liste des pays pour la sélection
  const countryOptions = Object.entries(countries).map(([code, country]) => ({
    code,
    name: country.name,
    hasFlag: hasFlag(code as any),
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Modifier le produit importé
            </DialogTitle>
            <DialogDescription>
              Modifiez les informations du produit avant l'importation finale.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log(errors);
            })}
            className="flex flex-col flex-1 min-h-0"
          >
            {/* Contenu défilable */}
            <div className="flex-1 overflow-y-auto px-1">
              <div className="space-y-6">
                {/* Informations de base */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informations générales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom du produit *</FormLabel>
                            <FormControl>
                              <UniqueInput
                                placeholder="Nom du produit"
                                validateUnique={validateProductNameUnique}
                                entityId={
                                  typeof product?.id === "string"
                                    ? undefined
                                    : product?.id
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SKU</FormLabel>
                            <FormControl>
                              <UniqueInput
                                placeholder="SKU du produit"
                                validateUnique={validateProductSkuUnique}
                                entityId={
                                  typeof product?.id === "string"
                                    ? undefined
                                    : product?.id
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Description du produit"
                              className="resize-none"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="shortDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description courte</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Description courte"
                                className="resize-none"
                                rows={2}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="longDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description détaillée</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Description détaillée"
                                className="resize-none"
                                rows={2}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Prix et stock */}
                <Card>
                  <CardHeader>
                    <CardTitle>Prix et stock</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prix de vente *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="salePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prix promotionnel</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="stockQuantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantité en stock *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex items-center space-x-6">
                      <FormField
                        control={form.control}
                        name="manageStock"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Gérer le stock</FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="inStock"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>En stock</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Marque et catégories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Classification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="brandId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Marque</FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(value || "")
                              }
                              value={field.value?.toString() || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner une marque" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {brands?.data?.map((brand) => (
                                  <SelectItem
                                    key={brand.id}
                                    value={brand.id.toString()}
                                  >
                                    {brand.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                            {product._importData?.brandName && (
                              <div className="text-sm text-muted-foreground">
                                Import: {product._importData.brandName}
                              </div>
                            )}
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fabricationCountryCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pays de fabrication</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner un pays" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countryOptions.map((country) => (
                                  <SelectItem
                                    key={country.code}
                                    value={country.code}
                                  >
                                    <div className="flex items-center gap-2">
                                      {country.hasFlag && (
                                        <Image
                                          src={`https://flagicons.lipis.dev/flags/4x3/${country.code.toLowerCase()}.svg`}
                                          alt={`${country.name} flag`}
                                          width={16}
                                          height={12}
                                          className="rounded-sm"
                                        />
                                      )}
                                      {country.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Affichage des catégories d'import */}
                    {product._importData?.categoryNames && (
                      <div>
                        <FormLabel>Catégories d'import</FormLabel>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {product._importData.categoryNames
                            .split(",")
                            .map((cat: string, idx: number) => (
                              <Badge key={idx} variant="outline">
                                {cat.trim()}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Statuts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Statuts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-6">
                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Actif</FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isFeatured"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Mis en avant</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Informations supplémentaires */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informations supplémentaires</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="features"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Caractéristiques</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Caractéristiques du produit"
                                className="resize-none"
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="applications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Applications</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Applications du produit"
                                className="resize-none"
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Poids (kg)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="warranty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Garantie</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: 2 ans" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Dimensions */}
                    <div>
                      <FormLabel>Dimensions (cm)</FormLabel>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        <FormField
                          control={form.control}
                          name="dimensions.length"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">
                                Longueur
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  placeholder="0.00"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="dimensions.width"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Largeur</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  placeholder="0.00"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="dimensions.height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Hauteur</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  placeholder="0.00"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* URLs d'import */}
                {((config.enableImages && product._importData?.imageUrls) ||
                  (config.enableFiles && product._importData?.fileUrls)) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Fichiers d'import</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {config.enableImages &&
                        product._importData?.imageUrls && (
                          <div>
                            <FormLabel>Images à télécharger</FormLabel>
                            <div className="mt-2 space-y-2">
                              {product._importData.imageUrls
                                .split(",")
                                .map((url: string, idx: number) => {
                                  const trimmedUrl = url.trim();
                                  return (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-3 p-2 border rounded-lg"
                                    >
                                      <div className="flex-shrink-0">
                                        <img
                                          src={trimmedUrl}
                                          alt={`Image ${idx + 1}`}
                                          className="w-16 h-16 object-cover rounded border"
                                          onError={(e) => {
                                            (
                                              e.target as HTMLImageElement
                                            ).style.display = "none";
                                            const fallback = (
                                              e.target as HTMLImageElement
                                            ).nextElementSibling as HTMLElement;
                                            if (fallback) {
                                              fallback.style.display = "flex";
                                            }
                                          }}
                                        />
                                        <div
                                          className="w-16 h-16 bg-gray-100 rounded border items-center justify-center"
                                          style={{ display: "none" }}
                                        >
                                          <Package className="w-6 h-6 text-gray-400" />
                                        </div>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-900">
                                          Image {idx + 1}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate">
                                          {trimmedUrl}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                              Ces images seront automatiquement téléchargées et
                              associées au produit lors de l'importation.
                            </div>
                          </div>
                        )}

                      {config.enableFiles && product._importData?.fileUrls && (
                        <div>
                          <FormLabel>Fichiers à télécharger</FormLabel>
                          <div className="mt-2 space-y-2">
                            {product._importData.fileUrls
                              .split(",")
                              .map((url: string, idx: number) => {
                                const trimmedUrl = url.trim();
                                const fileName =
                                  trimmedUrl.split("/").pop() ||
                                  `Fichier ${idx + 1}`;
                                const extension =
                                  fileName.split(".").pop()?.toLowerCase() ||
                                  "";

                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-3 p-2 border rounded-lg"
                                  >
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                                      <Package className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium text-gray-900">
                                        {fileName}
                                      </div>
                                      <div className="text-xs text-gray-500 truncate">
                                        {trimmedUrl}
                                      </div>
                                      {extension && (
                                        <div className="text-xs text-blue-600 uppercase">
                                          {extension}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            Ces fichiers seront automatiquement téléchargés et
                            associés au produit lors de l'importation.
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0 flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sauvegarder
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
