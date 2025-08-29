"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Loader2, Tag } from "lucide-react";
import {
  categorySchema,
  type CategoryFormData,
} from "@/lib/validations/categories";
import {
  useCreateCategory,
  useUpdateCategory,
  useCategoriesAdmin,
} from "@/lib/hooks/useCategories";
import type { Category } from "@/lib/types/categories";
import { useToast } from "@/hooks/use-toast";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
  mode: "create" | "edit";
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  mode,
}: CategoryFormDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API hooks
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const { data: categoriesResponse } = useCategoriesAdmin({ per_page: 100 }); // Pour la liste des parents

  // Form setup
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      parentId: undefined,
      sortOrder: 0,
      images: [],
    },
  });

  // Reset form when dialog opens/closes or category changes
  useEffect(() => {
    if (open && category && mode === "edit") {
      const images =
        category.files?.map((file) => ({
          url: file.url,
          alt: file.name,
          isMain: file.isMain,
        })) || [];

      form.reset({
        name: category.name,
        description: category.description || "",
        isActive: category.isActive,
        parentId: category.parentId || undefined,
        sortOrder: category.sortOrder,
        images: images,
      });
    } else if (open && mode === "create") {
      form.reset({
        name: "",
        description: "",
        isActive: true,
        parentId: undefined,
        sortOrder: 0,
        images: [],
      });
    }
  }, [open, category, mode, form]);

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      // Validation des images : s'assurer qu'elles ont toutes des URLs valides (MinIO)
      if (data.images && data.images.length > 0) {
        const hasInvalidImages = data.images.some(
          (img) =>
            !img.url ||
            img.url.startsWith("blob:") ||
            img.url.startsWith("data:")
        );

        if (hasInvalidImages) {
          toast({
            title: "Erreur",
            description:
              "Veuillez attendre que toutes les images soient uploadées avant de soumettre.",
            variant: "destructive",
          });
          return;
        }
      }

      const submitData = {
        ...data,
        parentId: data.parentId || undefined,
      };

      if (mode === "create") {
        await createCategory.mutateAsync(submitData);
        toast({
          title: "Catégorie créée",
          description: "La catégorie a été créée avec succès.",
        });
      } else if (category) {
        await updateCategory.mutateAsync({ id: category.id, ...submitData });
        toast({
          title: "Catégorie modifiée",
          description: "La catégorie a été modifiée avec succès.",
        });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: `Erreur lors de ${
          mode === "create" ? "la création" : "la modification"
        } de la catégorie.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrer les catégories parentes (exclure la catégorie actuelle et ses descendants)
  const availableParents =
    categoriesResponse?.data?.filter((cat) => {
      if (mode === "edit" && category) {
        // Exclure la catégorie actuelle
        if (cat.id === category.id) return false;
        // TODO: Exclure les descendants (nécessiterait une vérification plus complexe)
      }
      return true;
    }) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-h-[90vh] overflow-scroll"
          >
            <DialogHeader className="sticky top-0 z-10 pb-4 border-b bg-background">
              <DialogTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                {mode === "create"
                  ? "Nouvelle catégorie"
                  : "Modifier la catégorie"}
              </DialogTitle>
              <DialogDescription>
                {mode === "create"
                  ? "Créez une nouvelle catégorie pour organiser vos produits."
                  : "Modifiez les informations de cette catégorie."}
              </DialogDescription>
            </DialogHeader>
            <div className=" overflow-y-scroll px-1 space-y-6 h-full max-h-[calc(100%-400px)]">
              {/* Informations générales */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informations générales</h3>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la catégorie *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de la catégorie" {...field} />
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
                          placeholder="Description de la catégorie"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Hiérarchie et organisation */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Organisation</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="parentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie parente</FormLabel>
                        <Select
                          value={field.value?.toString() || "none"}
                          onValueChange={(value) =>
                            field.onChange(
                              value === "none" ? undefined : Number(value)
                            )
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Aucune (catégorie racine)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">
                              Aucune (catégorie racine)
                            </SelectItem>
                            {availableParents.map((parent) => (
                              <SelectItem
                                key={parent.id}
                                value={parent.id.toString()}
                              >
                                {parent.name}
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
                    name="sortOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ordre de tri</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          value={field.value || []}
                          onChange={field.onChange}
                          maxImages={5}
                          label={"Images de la catégorie"}
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

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Catégorie active
                        </FormLabel>
                        <div className="text-sm text-muted-foreground">
                          La catégorie sera visible sur le site
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
            <DialogFooter className="sticky bottom-0 bg-background z-10 w-full">
              {/* Actions */}
              <div className="sticky bottom-0 bg-background z-10 pt-4 border-t flex justify-end space-x-2 w-full">
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
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
