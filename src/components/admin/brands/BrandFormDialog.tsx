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
import { Loader2, Building2 } from "lucide-react";
import { brandSchema, type BrandFormData } from "@/lib/validations/brands";
import { useCreateBrand, useUpdateBrand } from "@/lib/hooks/useBrands";
import type { Brand } from "@/lib/types/brands";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";

interface BrandFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand?: Brand;
  mode: "create" | "edit";
}

export function BrandFormDialog({
  open,
  onOpenChange,
  brand,
  mode,
}: BrandFormDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API hooks
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();

  // Form setup
  const form = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      description: "",
      logoUrl: "",
      website: "",
      isActive: true,
      isFeatured: false,
      images: [],
    },
  });

  // Reset form when dialog opens/closes or brand changes
  useEffect(() => {
    if (open && brand && mode === "edit") {
      form.reset({
        name: brand.name,
        description: brand.description || "",
        logoUrl: brand.logoUrl || "",
        website: brand.websiteUrl || "",
        isActive: brand.isActive,
        isFeatured: brand.isFeatured,
        images:
          brand.files?.map((file) => ({
            url: file.url,
            alt: file.filename,
            isMain: file.isMain,
          })) || [],
      });
    } else if (open && mode === "create") {
      form.reset({
        name: "",
        description: "",
        logoUrl: "",
        website: "",
        isActive: true,
        isFeatured: false,
        images: [],
      });
    }
  }, [open, brand, mode, form]);

  const onSubmit = async (data: BrandFormData) => {
    setIsSubmitting(true);
    try {
      // Vérifier que toutes les images ont des URLs valides (pas de blob:)
      if (data.images && data.images.length > 0) {
        const hasInvalidImages = data.images.some(
          (image) =>
            image.url.startsWith("blob:") || image.url.startsWith("data:")
        );
        if (hasInvalidImages) {
          toast({
            title: "Erreur",
            description:
              "Veuillez attendre que toutes les images soient uploadées avant de soumettre le formulaire.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      const submitData = {
        ...data,
        logoUrl: data.logoUrl || undefined,
        imageUrl: data.logoUrl || undefined,
        websiteUrl: data.website || undefined,
        description: data.description || undefined,
      };

      if (mode === "create") {
        await createBrand.mutateAsync(submitData);
        toast({
          title: "Marque créée",
          description: "La marque a été créée avec succès.",
        });
      } else if (brand) {
        await updateBrand.mutateAsync({ id: brand.id, ...submitData });
        toast({
          title: "Marque modifiée",
          description: "La marque a été modifiée avec succès.",
        });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: `Erreur lors de ${
          mode === "create" ? "la création" : "la modification"
        } de la marque.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col p-0 max-w-2xl max-h-[90vh]">
        <div className="flex-shrink-0 p-6 border-b">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {mode === "create" ? "Nouvelle marque" : "Modifier la marque"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Créez une nouvelle marque pour organiser vos produits."
                : "Modifiez les informations de cette marque."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {/* Informations générales */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informations générales</h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la marque *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de la marque" {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description de la marque"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Liens et médias */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Liens et médias</h3>

              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <>
                        <ImageUpload
                          value={field.value ? [{ url: field.value }] : []}
                          onChange={(images) => {
                            field.onChange(images[0]?.url);
                          }}
                          maxSizeInMB={5}
                          maxImages={1}
                          label="Logo de la marque"
                        />
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site web</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://exemple.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Options</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Marque active
                        </FormLabel>
                        <div className="text-sm text-muted-foreground">
                          La marque sera visible sur le site
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
                          Marque mise en avant
                        </FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Afficher dans les marques vedettes
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
          </form>
        </Form>

        <div className="flex-shrink-0 p-6 border-t">
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={form.handleSubmit(onSubmit)}
            >
              {isSubmitting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {mode === "create" ? "Créer" : "Modifier"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
