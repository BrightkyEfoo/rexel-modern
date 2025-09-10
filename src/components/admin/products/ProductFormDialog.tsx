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
import { FileUpload } from "@/components/ui/file-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Package, Plus, X } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DynamicKeyValueInput } from "@/components/ui/dynamic-key-value-input";

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
      longDescription: "",
      features: "",
      applications: "",
      sku: "",
      price: 0,
      salePrice: "",
      stockQuantity: 0,
      manageStock: true,
      inStock: true,
      isFeatured: false,
      isActive: true,
      brandId: undefined,
      fabricationCountryCode: undefined,
      categoryIds: [],
      images: [],
      files: [],
      downloadableFiles: [],
      specifications: undefined,
      // additionalInfo: undefined,
      weight: "",
      dimensions: {
        length: "",
        width: "",
        height: "",
      },
      warranty: "",
      certifications: [],
      deliveryOptions: [],
      pickupOptions: [],
    },
  });

  // Reset form when dialog opens/closes or product changes
  useEffect(() => {
    if (open && product && mode === "edit") {
      // Séparer les images et les fichiers
      const productImages =
        product.files
          ?.filter((file) => file.mimeType?.startsWith("image/"))
          .map((file, index) => ({
            url: file.url,
            alt:
              (file as any).originalName || (file as any).filename || file.name,
            isMain: index === 0, // Premier fichier par défaut
          })) || [];

      const productFiles =
        product.files
          ?.filter((file) => !file.mimeType?.startsWith("image/"))
          .map((file) => ({
            url: file.url,
            filename: (file as any).filename || file.name,
            originalName:
              (file as any).originalName || (file as any).filename || file.name,
            size: file.size,
            mimeType: file.mimeType,
          })) || [];

      form.reset({
        name: product.name,
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        longDescription: (product as any).longDescription || "",
        features: (product as any).features || "",
        applications: (product as any).applications || "",
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
        files: productFiles,
        downloadableFiles: (product as any).downloadableFiles || [],
        specifications: (product as any).specifications || {},
        // additionalInfo: (product as any).additionalInfo || {},
        weight: (product as any).weight?.toString() || "",
        dimensions: {
          length: (product as any).dimensions?.length?.toString() || "",
          width: (product as any).dimensions?.width?.toString() || "",
          height: (product as any).dimensions?.height?.toString() || "",
        },
        warranty: (product as any).warranty || "",
        certifications: (product as any).certifications || [],
        deliveryOptions: (product as any).deliveryOptions || [],
        pickupOptions: (product as any).pickupOptions || [],
      });
    } else if (open && mode === "create") {
      form.reset({
        name: "",
        description: "",
        shortDescription: "",
        longDescription: "",
        features: "",
        applications: "",
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
        files: [],
        downloadableFiles: [],
        specifications: {},
        // additionalInfo: {},
        weight: "",
        dimensions: {
          length: "",
          width: "",
          height: "",
        },
        warranty: "",
        certifications: [],
        deliveryOptions: [],
        pickupOptions: [],
      });
    }
  }, [open, product, mode, form]);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      // Vérifier si toutes les images ont des URLs valides (pas des URLs blob)
      const finalImages = data.images || [];
      const finalFiles = data.files || [];

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
        files: finalFiles,
        price: data.price ? Number(data.price) : 0,
        salePrice: data.salePrice ? Number(data.salePrice) : undefined,
        stockQuantity: data.stockQuantity ? Number(data.stockQuantity) : 0,
        weight: (data as any).weight ? Number((data as any).weight) : undefined,
        dimensions: {
          length: (data as any).dimensions?.length
            ? Number((data as any).dimensions.length)
            : undefined,
          width: (data as any).dimensions?.width
            ? Number((data as any).dimensions.width)
            : undefined,
          height: (data as any).dimensions?.height
            ? Number((data as any).dimensions.height)
            : undefined,
        },
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

  // Fonction pour ajouter une certification
  const addCertification = () => {
    const currentCerts = form.getValues("certifications") || [];
    form.setValue("certifications", [...currentCerts, ""]);
  };

  // Fonction pour supprimer une certification
  const removeCertification = (index: number) => {
    const currentCerts = form.getValues("certifications") || [];
    form.setValue(
      "certifications",
      currentCerts.filter((_: any, i: number) => i !== index)
    );
  };

  // Fonction pour ajouter une option de livraison
  const addDeliveryOption = () => {
    const currentOptions = form.getValues("deliveryOptions") || [];
    form.setValue("deliveryOptions", [
      ...currentOptions,
      { name: "", price: "", description: "" },
    ]);
  };

  // Fonction pour supprimer une option de livraison
  const removeDeliveryOption = (index: number) => {
    const currentOptions = form.getValues("deliveryOptions") || [];
    form.setValue(
      "deliveryOptions",
      currentOptions.filter((_: any, i: number) => i !== index)
    );
  };

  // Fonction pour ajouter une option de retrait
  const addPickupOption = () => {
    const currentOptions = form.getValues("pickupOptions") || [];
    form.setValue("pickupOptions", [
      ...currentOptions,
      { name: "", address: "", description: "" },
    ]);
  };

  // Fonction pour supprimer une option de retrait
  const removePickupOption = (index: number) => {
    const currentOptions = form.getValues("pickupOptions") || [];
    form.setValue(
      "pickupOptions",
      currentOptions.filter((_: any, i: number) => i !== index)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
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
            onSubmit={form.handleSubmit(onSubmit, (err) => {
              console.log("err", err);
            })}
            className="flex flex-col flex-1 min-h-0"
          >
            {/* Contenu défilable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Informations générales */}
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

                  <FormField
                    control={form.control}
                    name="longDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description longue</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Description longue et détaillée du produit"
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="features"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Caractéristiques</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Liste des caractéristiques principales du produit"
                            className="min-h-[100px]"
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
                            placeholder="Applications et utilisations du produit"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                          <FormLabel>Prix promotionnel</FormLabel>
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
                </CardContent>
              </Card>

              {/* Classification */}
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
                                    !field.value?.includes(
                                      category.id.toString()
                                    )
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
                </CardContent>
              </Card>

              {/* Spécifications techniques */}
              <Card>
                <CardHeader>
                  <CardTitle>Spécifications techniques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="specifications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spécifications</FormLabel>
                        <DynamicKeyValueInput
                          value={field.value || {}}
                          onChange={field.onChange}
                          keyPlaceholder="Nom de la spécification"
                          valuePlaceholder="Valeur"
                          useTextarea={false}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Informations supplémentaires */}
              {/* <Card>
                <CardHeader>
                  <CardTitle>Informations supplémentaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Informations additionnelles</FormLabel>
                        <DynamicKeyValueInput
                          value={field.value || {}}
                          onChange={field.onChange}
                          keyPlaceholder="Titre de l'information"
                          valuePlaceholder="Contenu"
                          useTextarea={true}
                          valueRows={2}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card> */}

              {/* Caractéristiques physiques */}
              <Card>
                <CardHeader>
                  <CardTitle>Caractéristiques physiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  <div className="space-y-2">
                    <FormLabel>Dimensions (cm)</FormLabel>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="dimensions.length"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Longueur</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="0.0"
                                {...field}
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
                            <FormLabel>Largeur</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="0.0"
                                {...field}
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
                            <FormLabel>Hauteur</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="0.0"
                                {...field}
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

              {/* Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="certifications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certifications et normes</FormLabel>
                        <div className="space-y-3">
                          {(field.value || []).map(
                            (cert: string, index: number) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  placeholder="Nom de la certification"
                                  value={cert}
                                  onChange={(e) => {
                                    const newCerts = [...(field.value || [])];
                                    newCerts[index] = e.target.value;
                                    field.onChange(newCerts);
                                  }}
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeCertification(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addCertification}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter une certification
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Options de livraison */}
              <Card>
                <CardHeader>
                  <CardTitle>Options de livraison</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="deliveryOptions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Options de livraison</FormLabel>
                        <div className="space-y-4">
                          {(field.value || []).map(
                            (option: any, index: number) => (
                              <div
                                key={index}
                                className="border rounded-lg p-4 space-y-3"
                              >
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">
                                    Option {index + 1}
                                  </h4>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeDeliveryOption(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <Input
                                    placeholder="Nom de l'option"
                                    value={option.name || ""}
                                    onChange={(e) => {
                                      const newOptions = [
                                        ...(field.value || []),
                                      ];
                                      newOptions[index] = {
                                        ...option,
                                        name: e.target.value,
                                      };
                                      field.onChange(newOptions);
                                    }}
                                  />
                                  <Input
                                    placeholder="Prix"
                                    value={option.price || ""}
                                    onChange={(e) => {
                                      const newOptions = [
                                        ...(field.value || []),
                                      ];
                                      newOptions[index] = {
                                        ...option,
                                        price: e.target.value,
                                      };
                                      field.onChange(newOptions);
                                    }}
                                  />
                                </div>
                                <Textarea
                                  placeholder="Description de l'option de livraison"
                                  value={option.description || ""}
                                  onChange={(e) => {
                                    const newOptions = [...(field.value || [])];
                                    newOptions[index] = {
                                      ...option,
                                      description: e.target.value,
                                    };
                                    field.onChange(newOptions);
                                  }}
                                  rows={2}
                                />
                              </div>
                            )
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addDeliveryOption}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter une option de livraison
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Options de retrait */}
              <Card>
                <CardHeader>
                  <CardTitle>Options de retrait</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="pickupOptions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Points de retrait</FormLabel>
                        <div className="space-y-4">
                          {(field.value || []).map(
                            (option: any, index: number) => (
                              <div
                                key={index}
                                className="border rounded-lg p-4 space-y-3"
                              >
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">
                                    Point de retrait {index + 1}
                                  </h4>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removePickupOption(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <Input
                                    placeholder="Nom du point de retrait"
                                    value={option.name || ""}
                                    onChange={(e) => {
                                      const newOptions = [
                                        ...(field.value || []),
                                      ];
                                      newOptions[index] = {
                                        ...option,
                                        name: e.target.value,
                                      };
                                      field.onChange(newOptions);
                                    }}
                                  />
                                  <Input
                                    placeholder="Adresse"
                                    value={option.address || ""}
                                    onChange={(e) => {
                                      const newOptions = [
                                        ...(field.value || []),
                                      ];
                                      newOptions[index] = {
                                        ...option,
                                        address: e.target.value,
                                      };
                                      field.onChange(newOptions);
                                    }}
                                  />
                                </div>
                                <Textarea
                                  placeholder="Description du point de retrait"
                                  value={option.description || ""}
                                  onChange={(e) => {
                                    const newOptions = [...(field.value || [])];
                                    newOptions[index] = {
                                      ...option,
                                      description: e.target.value,
                                    };
                                    field.onChange(newOptions);
                                  }}
                                  rows={2}
                                />
                              </div>
                            )
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addPickupOption}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter un point de retrait
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Gestion des images */}
              <Card>
                <CardHeader>
                  <CardTitle>Images du produit</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>

              {/* Gestion des fichiers */}
              <Card>
                <CardHeader>
                  <CardTitle>Documents et fichiers</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="files"
                    render={({ field }) => (
                      <FormItem>
                        <FileUpload
                          onFilesUploaded={(files) => {
                            const currentFiles = field.value || [];
                            field.onChange([...currentFiles, ...files]);
                          }}
                          uploadedFiles={field.value || []}
                          onFileRemove={(fileToRemove: any) => {
                            const currentFiles = field.value || [];
                            field.onChange(
                              currentFiles.filter(
                                (file: any) => file.url !== fileToRemove.url
                              )
                            );
                          }}
                          maxFiles={10}
                          acceptedTypes={[
                            "pdf",
                            "doc",
                            "docx",
                            "xls",
                            "xlsx",
                            "txt",
                            "zip",
                            "rar",
                          ]}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Options</CardTitle>
                </CardHeader>
                <CardContent>
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
                            <FormLabel className="text-base">
                              En stock
                            </FormLabel>
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
                </CardContent>
              </Card>
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
