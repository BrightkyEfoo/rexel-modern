"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  useCreatePickupPoint,
  useUpdatePickupPoint,
} from "@/lib/hooks/usePickupPoints";
import type { PickupPoint } from "@/lib/types/pickup-points";
import { zodResolver } from "@hookform/resolvers/zod";
import { countries } from "countries-list";
import { Loader2, MapPin, Plus, Save, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Schéma de validation
const pickupPointSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(255, "Le nom est trop long"),
  address: z.string().min(1, "L'adresse est requise"),
  city: z
    .string()
    .min(1, "La ville est requise")
    .max(100, "La ville est trop longue"),
  postalCode: z.string().optional(),
  phone: z
    .string()
    .min(1, "Le téléphone est requis")
    .max(20, "Le téléphone est trop long"),
  email: z.string().email("Email invalide").max(255, "L'email est trop long"),
  hours: z.string().min(1, "Les horaires sont requis"),
  description: z.string().optional(),
  managerName: z.string().optional(),
  managerPhone: z.string().optional(),
  managerPhoto: z
    .string()
    .url("L'URL de la photo doit être valide")
    .optional()
    .or(z.literal("")),
  countryCode: z
    .string()
    .max(3, "Le code pays doit faire max 3 caractères")
    .optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isActive: z.boolean(),
  sortOrder: z.number().min(0, "L'ordre doit être positif"),
});

type PickupPointFormData = z.infer<typeof pickupPointSchema>;

interface PickupPointFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pickupPoint?: PickupPoint | null;
}

export function PickupPointFormDialog({
  open,
  onOpenChange,
  pickupPoint,
}: PickupPointFormDialogProps) {
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState("");

  const isEditing = !!pickupPoint;
  const createPickupPoint = useCreatePickupPoint();
  const updatePickupPoint = useUpdatePickupPoint();

  const form = useForm<PickupPointFormData>({
    resolver: zodResolver(pickupPointSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      postalCode: "",
      phone: "",
      email: "",
      hours: "Lun-Ven: 8h-18h, Sam: 9h-17h",
      description: "",
      managerName: "",
      managerPhone: "",
      managerPhoto: "",
      countryCode: "",
      latitude: undefined,
      longitude: undefined,
      isActive: true,
      sortOrder: 0,
    },
  });

  // Réinitialiser le formulaire quand le dialogue s'ouvre/ferme ou quand le point de relais change
  useEffect(() => {
    if (open) {
      if (isEditing && pickupPoint) {
        form.reset({
          name: pickupPoint.name,
          address: pickupPoint.address,
          city: pickupPoint.city,
          postalCode: pickupPoint.postalCode || "",
          phone: pickupPoint.phone,
          email: pickupPoint.email,
          hours: pickupPoint.hours,
          description: pickupPoint.description || "",
          managerName: pickupPoint.managerName || "",
          managerPhone: pickupPoint.managerPhone || "",
          managerPhoto: pickupPoint.managerPhoto || "",
          countryCode: pickupPoint.countryCode || "",
          latitude: pickupPoint.latitude || undefined,
          longitude: pickupPoint.longitude || undefined,
          isActive: pickupPoint.isActive,
          sortOrder: pickupPoint.sortOrder,
        });
        setServices(pickupPoint.services || []);
      } else {
        form.reset({
          name: "",
          address: "",
          city: "",
          postalCode: "",
          phone: "",
          email: "",
          hours: "Lun-Ven: 8h-18h, Sam: 9h-17h",
          description: "",
          managerName: "",
          managerPhone: "",
          managerPhoto: "",
          countryCode: "",
          latitude: undefined,
          longitude: undefined,
          isActive: true,
          sortOrder: 0,
        });
        setServices(["Retrait", "Dépôt", "Conseil"]);
      }
    }
  }, [open, isEditing, pickupPoint, form]);

  const handleAddService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices([...services, newService.trim()]);
      setNewService("");
    }
  };

  const handleRemoveService = (serviceToRemove: string) => {
    setServices(services.filter((service) => service !== serviceToRemove));
  };

  const handleSubmit = async (data: PickupPointFormData) => {
    if (services.length === 0) {
      toast({
        title: "Au moins un service est requis",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log({ data });

      const submitData = {
        ...data,
        services,
        postalCode: data.postalCode || undefined,
        description: data.description || undefined,
        managerName: data.managerName || undefined,
        managerPhone: data.managerPhone || undefined,
        managerPhoto: data.managerPhoto || undefined,
        countryCode: data.countryCode?.toUpperCase() || undefined,
        latitude: data.latitude || undefined,
        longitude: data.longitude || undefined,
      };

      console.log({ submitData });

      if (isEditing && pickupPoint) {
        await updatePickupPoint.mutateAsync({
          id: pickupPoint.id,
          ...submitData,
        });
        toast({
          title: "Point de relais modifié avec succès",
          variant: "default",
        });
      } else {
        await createPickupPoint.mutateAsync(submitData);
        toast({
          title: "Point de relais créé avec succès",
          variant: "default",
        });
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: isEditing
          ? "Erreur lors de la modification du point de relais"
          : "Erreur lors de la création du point de relais",
        variant: "destructive",
      });
    }
  };

  const isLoading = createPickupPoint.isPending || updatePickupPoint.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span>
              {isEditing
                ? "Modifier le point de relais"
                : "Nouveau point de relais"}
            </span>
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifiez les informations du point de relais."
              : "Créez un nouveau point de relais avec toutes les informations nécessaires."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit, (errors) => {
              console.log(errors);
            })}
            className="space-y-6"
          >
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Informations générales
              </h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du point de relais *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Point Relais KesiMarket - Ville"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse complète *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="123 Avenue de l'Indépendance..."
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
                name="countryCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un pays" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(countries).map(([code, country]) => (
                          <SelectItem key={`select-item-${code}`} value={code}>
                            <div className="flex items-center gap-2">
                              <Image
                                src={`https://catamphetamine.gitlab.io/country-flag-icons/3x2/${code}.svg`}
                                alt={country.name}
                                width={16}
                                height={16}
                              />
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville *</FormLabel>
                      <FormControl>
                        <Input placeholder="Douala" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code postal</FormLabel>
                      <FormControl>
                        <Input placeholder="00237" {...field} />
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
                        placeholder="Description du point de relais..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Contact et horaires
              </h3>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone *</FormLabel>
                    <FormControl>
                      <Input placeholder="+237 6 12 34 56 78" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="contact@kesimarket.cm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horaires d'ouverture *</FormLabel>
                    <FormControl>
                      <Input placeholder="Lun-Ven: 8h-18h, Sam: 9h-17h" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="managerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du responsable</FormLabel>
                    <FormControl>
                      <Input placeholder="Jean-Baptiste Mballa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="managerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone du responsable</FormLabel>
                    <FormControl>
                      <Input placeholder="+237 6 98 76 54 32" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="managerPhoto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo du responsable (URL)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/photo.jpg"
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 
              <div>
                <Label htmlFor="countryCode">Code pays (ISO 2 lettres)</Label>
                <Input
                  id="countryCode"
                  {...form.register("countryCode")}
                  placeholder="CM, GA, CG, etc."
                  maxLength={2}
                  style={{ textTransform: "uppercase" }}
                />
                {form.formState.errors.countryCode && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.countryCode.message}
                  </p>
                )}
              </div> */}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Services disponibles
            </h3>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {services.map((service, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {service}
                    <button
                      type="button"
                      onClick={() => handleRemoveService(service)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex space-x-2">
                <Input
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="Nouveau service..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddService();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddService}
                  disabled={!newService.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Coordonnées GPS */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Coordonnées GPS (optionnel)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="4.0511"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="9.7679"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Paramètres */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Paramètres
            </h3>
            <div className="grid grid-cols-2 gap-6">
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
                    <FormLabel>Point de relais actif</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordre d'affichage</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditing ? "Modification..." : "Création..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? "Modifier" : "Créer"}
                </>
              )}
            </Button>
          </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
