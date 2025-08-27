"use client";

import { useState, useEffect } from "react";
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
import { ImageUpload } from "@/components/ui/image-upload";
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
import { numberToString } from "@/lib/validations/common";
import { useCreateProduct, useUpdateProduct } from "@/lib/hooks/useProducts";
import { useCategories, useBrands } from "@/lib/query/hooks";
import type { Product } from "@/lib/types/products";
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

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  mode: "create" | "edit";
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  mode,
}: ProductFormDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API hooks
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  // Form setup
  const form = useForm<any>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      sku: "",
      price: 0,
      salePrice: 0,
      stockQuantity: 0,
      manageStock: true,
      inStock: true,
      isFeatured: false,
      isActive: true,
      brandId: undefined,
      fabricationCountryCode: undefined,
      categoryIds: [],
      images: [],
    },
  });

  // Reset form when dialog opens/closes or product changes
  useEffect(() => {
    if (open && product && mode === "edit") {
      const productImages =
        product.files?.map((file, index) => ({
          url: file.url,
          alt: file.name,
          isMain: index === 0, // Premier fichier par défaut
        })) || [];

      form.reset({
        name: product.name,
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        sku: product.sku || "",
        fabricationCountryCode: product.fabricationCountryCode || "",
        price: numberToString(product.price),
        salePrice: numberToString(product.salePrice),
        stockQuantity: numberToString(product.stockQuantity),
        manageStock: product.manageStock,
        inStock: product.inStock,
        isFeatured: product.isFeatured,
        isActive: product.isActive,
        brandId: numberToString(product.brandId),
        categoryIds: product.categories?.map((cat) => cat.id.toString()) || [],
        images: productImages,
      });
    } else if (open && mode === "create") {
      form.reset({
        name: "",
        description: "",
        shortDescription: "",
        sku: "",
        price: "0",
        salePrice: "",
        stockQuantity: "0",
        manageStock: true,
        inStock: true,
        isFeatured: false,
        isActive: true,
        brandId: "",
        categoryIds: [],
        images: [],
      });
    }
  }, [open, product, mode, form]);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      // Vérifier si toutes les images ont des URLs valides (pas des URLs blob)
      const finalImages = data.images || [];

      const hasInvalidImages = finalImages.some(
        (image) => image.url.startsWith("blob:") || image.url === ""
      );

      if (hasInvalidImages) {
        toast({
          title: "Images manquantes",
          description:
            "Toutes les images doivent être uploadées avant de soumettre le produit.",
          variant: "destructive",
        });
        return;
      }

      const productData = {
        ...data,
        images: finalImages,
        price: data.price ? Number(data.price) : 0,
        salePrice: data.salePrice ? Number(data.salePrice) : 0,
        stockQuantity: data.stockQuantity ? Number(data.stockQuantity) : 0,
      };

      if (mode === "create") {
        await createProduct.mutateAsync(productData as any);
        toast({
          title: "Produit créé",
          description: "Le produit a été créé avec succès.",
        });
      } else if (product) {
        await updateProduct.mutateAsync({ id: product.id, ...productData });
        toast({
          title: "Produit modifié",
          description: "Le produit a été modifié avec succès.",
        });
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Erreur",
        description: `Erreur lors de ${
          mode === "create" ? "la création" : "la modification"
        } du produit.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        {/* En-tête fixe */}
        <div className="flex-shrink-0 p-6 border-b">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {mode === "create" ? "Nouveau produit" : "Modifier le produit"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Créez un nouveau produit avec ses informations détaillées."
                : "Modifiez les informations de ce produit."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 min-h-0"
          >
            {/* Contenu défilable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Informations générales */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informations générales</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du produit *</FormLabel>
                        <FormControl>
                          <UniqueInput
                            value={field.value}
                            onChange={field.onChange}
                            validateUnique={(name) =>
                              validateProductNameUnique(name, product?.id)
                            }
                            placeholder="Nom du produit"
                            required
                            minLength={2}
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
                            value={field.value || ""}
                            onChange={field.onChange}
                            validateUnique={(sku) =>
                              validateProductSkuUnique(sku, product?.id)
                            }
                            placeholder="Référence produit"
                            required={false}
                            minLength={1}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description courte</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description courte du produit"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description détaillée</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description détaillée du produit"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Prix et stock */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Prix et stock</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="100"
                            placeholder="0.00"
                            {...field}
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
                        <FormLabel>Prix de vente</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="100"
                            placeholder="0.00"
                            {...field}
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
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Classification */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Classification</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="brandId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marque</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
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
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fabricationCountryCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code du pays de fabrication</FormLabel>

                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un pays" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(countries).map(
                                ([code, country]) => {
                                  const doesItHaveFlag = hasFlag(code);

                                  return (
                                    <SelectItem key={code} value={code}>
                                      <div className="flex items-center gap-2">
                                        {doesItHaveFlag && (
                                          <div className="relative w-4 h-4">
                                            <Image
                                              alt={country.name}
                                              src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`}
                                              fill
                                            />
                                          </div>
                                        )}
                                        <span>{country.name}</span>
                                      </div>
                                    </SelectItem>
                                  );
                                }
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="categoryIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégories</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {field.value?.map((categoryId: string) => {
                          const category = categories?.data?.find(
                            (c) => c.id.toString() === categoryId
                          );
                          return category ? (
                            <Badge
                              key={categoryId}
                              className="flex items-center gap-1"
                            >
                              {category.name}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => {
                                  const newValue =
                                    field.value?.filter(
                                      (id: string) => id !== categoryId
                                    ) || [];
                                  field.onChange(newValue);
                                }}
                              >
                                ×
                              </Button>
                            </Badge>
                          ) : null;
                        })}
                        <Select
                          value="add"
                          onValueChange={(value) => {
                            if (value && value !== "add") {
                              const currentValues = field.value || [];
                              if (!currentValues.includes(value)) {
                                field.onChange([...currentValues, value]);
                              }
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Ajouter une catégorie" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="add" className="hidden">
                              Ajouter
                            </SelectItem>
                            {categories?.data
                              ?.filter(
                                (category) =>
                                  !field.value?.includes(category.id.toString())
                              )
                              .map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id.toString()}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Gestion des images */}
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <ImageUpload
                      value={field.value || []}
                      onChange={field.onChange}
                      maxImages={5}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Options</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="manageStock"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Gérer le stock
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Activer la gestion automatique du stock
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="inStock"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">En stock</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Produit actuellement disponible
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Produit mis en avant
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Afficher dans les produits vedettes
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Produit actif
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Produit visible sur le site
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Pied de page fixe */}
            <div className="flex-shrink-0 p-6 border-t bg-background">
              <div className="flex justify-end space-x-2">
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
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {mode === "create" ? "Créer" : "Modifier"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
