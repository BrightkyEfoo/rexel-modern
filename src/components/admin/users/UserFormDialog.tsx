"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { createUser, updateUser, type User } from "@/lib/api/users";
import { UserType } from "@/lib/types/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const userSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .optional(),
  type: z.nativeEnum(UserType),
  company: z.string().optional(),
  phone: z.string().optional(),
  isVerified: z.boolean().default(false),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserFormDialog({
  user,
  open,
  onOpenChange,
}: UserFormDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!user;

  const form = useForm<UserFormData>({
    // @ts-ignore
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      type: UserType.CUSTOMER,
      company: "",
      phone: "",
      isVerified: false,
    },
  });

  // Réinitialiser le formulaire quand l'utilisateur change
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email,
        password: "", // Ne pas pré-remplir le mot de passe
        type: user.type,
        company: user.company || "",
        phone: user.phone || "",
        isVerified: user.isVerified,
      });
    } else {
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        type: UserType.CUSTOMER,
        company: "",
        phone: "",
        isVerified: false,
      });
    }
  }, [user, form]);

  // Mutation pour créer
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast({
        title: "Utilisateur créé",
        description: "L'utilisateur a été créé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer l'utilisateur",
        variant: "destructive",
      });
    },
  });

  // Mutation pour modifier
  const updateMutation = useMutation({
    mutationFn: (data: { id: number; data: Partial<UserFormData> }) =>
      updateUser(data.id, data.data),
    onSuccess: () => {
      toast({
        title: "Utilisateur modifié",
        description: "L'utilisateur a été modifié avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier l'utilisateur",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UserFormData) => {
    if (isEditMode && user) {
      // En mode édition, ne pas envoyer le mot de passe s'il est vide
      const updateData: Partial<UserFormData> = { ...data };
      if (!data.password) {
        delete updateData.password;
      }
      updateMutation.mutate({ id: user.id, data: updateData });
    } else {
      // En mode création, le mot de passe est obligatoire
      if (!data.password) {
        form.setError("password", {
          message: "Le mot de passe est obligatoire",
        });
        return;
      }
      createMutation.mutate(data as any);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Modifier l'utilisateur" : "Créer un utilisateur"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Modifiez les informations de l'utilisateur"
              : "Créez un nouvel utilisateur avec ses informations"}
          </DialogDescription>
        </DialogHeader>

        {/* @ts-ignore */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                {...form.register("firstName")}
                placeholder="Jean"
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                {...form.register("lastName")}
                placeholder="Dupont"
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              placeholder="jean.dupont@example.com"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Mot de passe{" "}
              {isEditMode ? "(laisser vide pour ne pas modifier)" : "*"}
            </Label>
            <Input
              id="password"
              type="password"
              {...form.register("password")}
              placeholder="••••••••"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type d'utilisateur *</Label>
            <Select
              value={form.watch("type")}
              onValueChange={(value) =>
                form.setValue("type", value as UserType)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserType.ADMIN}>Administrateur</SelectItem>
                <SelectItem value={UserType.MANAGER}>Manager</SelectItem>
                <SelectItem value={UserType.CUSTOMER}>Client</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.type && (
              <p className="text-sm text-destructive">
                {form.formState.errors.type.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Entreprise</Label>
              <Input
                id="company"
                {...form.register("company")}
                placeholder="Nom de l'entreprise"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                {...form.register("phone")}
                placeholder="+33 6 12 34 56 78"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isVerified"
              checked={form.watch("isVerified")}
              onCheckedChange={(checked) =>
                form.setValue("isVerified", checked as boolean)
              }
            />
            <Label htmlFor="isVerified" className="cursor-pointer">
              Compte vérifié
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Modifier" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
