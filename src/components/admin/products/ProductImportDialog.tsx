"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { productsService } from "@/lib/api/services";
import { useQueryClient } from "@tanstack/react-query";
import { numericStringSchema } from "@/lib/validations/common";
import { formatPrice } from "@/lib/utils/currency";
import {
  AlertCircle,
  Download,
  Edit,
  Eye,
  FileSpreadsheet,
  Package,
  Settings,
  Trash2,
  Upload,
} from "lucide-react";
import Papa from "papaparse";
import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { ProductImportEditDialog } from "./ProductImportEditDialog";
import {
  validateProductSkuUnique,
  validateProductNameUnique,
} from "@/lib/api/validation";

// Configuration d'importation
interface ImportConfig {
  enablePreview: boolean;
  enableEdit: boolean;
  enableDelete: boolean;
  enableImages: boolean;
  enableFiles: boolean;
}

// Structure d'un produit importé
interface ImportedProduct {
  id: string; // ID temporaire pour la gestion
  name: string;
  description?: string;
  shortDescription?: string;
  longDescription?: string;
  features?: string;
  applications?: string;
  sku?: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  manageStock?: boolean;
  inStock?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  brandName?: string;
  categoryNames?: string; // Séparés par des virgules
  imageUrls?: string; // URLs séparées par des virgules
  fileUrls?: string; // URLs de fichiers séparées par des virgules
  fabricationCountryCode?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  warranty?: string;
  certifications?: string[];
  // Validation
  isValid: boolean;
  errors: string[];
  // État d'édition
  isSelected: boolean;
}

// Schéma de fichier attendu (basé sur le vrai schéma de produit)
const FILE_SCHEMA = {
  required: ["name", "price", "stockQuantity"],
  optional: [
    "description",
    "shortDescription",
    "sku",
    "salePrice",
    "brandName",
    "categoryNames",
    "imageUrls",
    "fileUrls",
    "isFeatured",
    "isActive",
    "manageStock",
    "inStock",
    "fabricationCountryCode",
    "weight",
    "dimensions_length",
    "dimensions_width",
    "dimensions_height",
    "warranty",
    "certifications",
    "longDescription",
    "features",
    "applications",
  ],
};


interface ImportConfig {
  enablePreview: boolean;
  enableEdit: boolean;
  enableDelete: boolean;
  enableImages: boolean;
  enableFiles: boolean;
}

interface ProductImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductImportDialog({
  open,
  onOpenChange,
}: ProductImportDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // État principal
  const [config, setConfig] = useState<ImportConfig>({
    enablePreview: true,
    enableEdit: true,
    enableDelete: true,
    enableImages: true,
    enableFiles: true,
  });

  const [csvData, setCsvData] = useState<string>("");
  const [importedProducts, setImportedProducts] = useState<ImportedProduct[]>(
    []
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("upload");
  const [editingProduct, setEditingProduct] = useState<ImportedProduct | null>(
    null
  );
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [importId, setImportId] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<
    "processing" | "completed" | "failed" | null
  >(null);
  const [currentProduct, setCurrentProduct] = useState<string | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mettre à jour les erreurs globales quand les produits changent
  useEffect(() => {
    const allErrors = importedProducts.flatMap((p) => p.errors || []);
    setValidationErrors(allErrors);
  }, [importedProducts]);

  // Générer un ID temporaire unique
  const generateTempId = () =>
    `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Convertir un ImportedProduct en Product pour le formulaire d'édition
  const convertToProduct = (importedProduct: ImportedProduct): Partial<any> => {
    return {
      id: importedProduct.id,
      name: importedProduct.name,
      description: importedProduct.description || "",
      shortDescription: importedProduct.shortDescription || "",
      longDescription: importedProduct.longDescription || "",
      features: importedProduct.features || "",
      applications: importedProduct.applications || "",
      sku: importedProduct.sku || "",
      price: importedProduct.price,
      salePrice: importedProduct.salePrice || undefined,
      stockQuantity: importedProduct.stockQuantity,
      manageStock: importedProduct.manageStock ?? true,
      inStock: importedProduct.inStock ?? true,
      isFeatured: importedProduct.isFeatured ?? false,
      isActive: importedProduct.isActive ?? true,
      brandId: undefined, // Sera géré par le formulaire
      fabricationCountryCode: importedProduct.fabricationCountryCode || "",
      weight: importedProduct.weight || 0,
      dimensions: importedProduct.dimensions || {
        length: 0,
        width: 0,
        height: 0,
      },
      warranty: importedProduct.warranty || "",
      certifications: importedProduct.certifications || [],
      categoryIds: [], // Sera géré par le formulaire
      images: [], // Les images seront gérées séparément
      files: [], // Les fichiers seront gérés séparément
      // Champs temporaires pour l'import
      _importData: {
        brandName: importedProduct.brandName,
        categoryNames: importedProduct.categoryNames,
        imageUrls: importedProduct.imageUrls,
        fileUrls: importedProduct.fileUrls,
      },
    };
  };

  // Schémas de validation spécifiques à l'import (avec les labels exacts du formulaire)
  const priceImportSchema = numericStringSchema({
    positive: true,
    min: 0,
    required: true,
    fieldName: "Prix de vente", // Label exact du formulaire (sans "Le")
  });

  const salePriceSchema = numericStringSchema({
    positive: true,
    min: 0,
    required: false,
    fieldName: "Prix promotionnel", // Label exact du formulaire
  });

  const stockImportSchema = numericStringSchema({
    min: 0,
    integer: true,
    required: true,
    fieldName: "Quantité en stock", // Label exact du formulaire (sans "La")
  });

  const weightSchema = numericStringSchema({
    positive: true,
    min: 0,
    required: false,
    fieldName: "Le poids",
  });

  const dimensionSchema = numericStringSchema({
    positive: true,
    min: 0,
    required: false,
    fieldName: "La dimension",
  });

  // Champs requis pour considérer un produit comme valide (configurable)
  // Pour ajouter un nouveau champ requis, ajoutez-le ici avec son label d'erreur
  // Exemple: price: "Le prix", description: "La description"
  const REQUIRED_FIELDS = {
    name: "Le nom",
    sku: "Le SKU",
  };

  // Vérifier si tous les champs requis sont présents
  const hasRequiredFields = (product: any): boolean => {
    return Object.keys(REQUIRED_FIELDS).every((field) => {
      const value = product[field];
      return (
        value !== null && value !== undefined && String(value).trim() !== ""
      );
    });
  };

  // Valider un produit importé selon le vrai schéma (identique au formulaire de création)
  const validateProduct = async (
    product: any,
    index: number,
    config: ImportConfig
  ): Promise<ImportedProduct> => {
    const errors: string[] = [];
    const linePrefix = `Ligne ${index + 2}: `;

    // Validation des champs requis pour le badge "Valide"
    Object.entries(REQUIRED_FIELDS).forEach(([field, label]) => {
      const value = product[field];
      if (!value || String(value).trim() === "") {
        errors.push(`${linePrefix}${label} est requis pour valider le produit`);
      }
    });

    // Validation du nom (identique au formulaire)
    if (!product.name?.trim()) {
      errors.push(`${linePrefix}Le nom est requis`);
    } else if (product.name.trim().length < 2) {
      errors.push(`${linePrefix}Le nom doit contenir au moins 2 caractères`);
    } else if (product.name.trim().length > 255) {
      errors.push(`${linePrefix}Le nom ne peut pas dépasser 255 caractères`);
    } else {
      // Validation d'unicité du nom
      try {
        const nameValidation = await validateProductNameUnique(
          product.name.trim()
        );
        if (!nameValidation.unique) {
          errors.push(
            `${linePrefix}Le nom "${product.name.trim()}" existe déjà`
          );
        }
      } catch (error) {
        errors.push(
          `${linePrefix}Erreur lors de la validation d'unicité du nom`
        );
      }
    }

    // Validation du SKU avec unicité
    if (product.sku?.trim()) {
      try {
        const skuValidation = await validateProductSkuUnique(
          product.sku.trim()
        );
        if (!skuValidation.unique) {
          errors.push(
            `${linePrefix}Le SKU "${product.sku.trim()}" existe déjà`
          );
        }
      } catch (error) {
        errors.push(
          `${linePrefix}Erreur lors de la validation d'unicité du SKU`
        );
      }
    }

    // Validation du prix (utilise priceImportSchema avec le bon label)
    try {
      const priceValue = product.price;
      const priceString =
        priceValue === null || priceValue === undefined
          ? ""
          : String(priceValue);
      priceImportSchema.parse(priceString);
    } catch (error: any) {
      if (error.errors) {
        errors.push(
          `${linePrefix}${error.errors[0]?.message || "Prix de vente invalide"}`
        );
      } else {
        errors.push(`${linePrefix}Prix de vente doit être un nombre positif`);
      }
    }

    // Validation de la quantité en stock (utilise stockImportSchema avec le bon label)
    try {
      const stockValue = product.stockQuantity;
      const stockString =
        stockValue === null || stockValue === undefined
          ? ""
          : String(stockValue);
      stockImportSchema.parse(stockString);
    } catch (error: any) {
      if (error.errors) {
        errors.push(
          `${linePrefix}${
            error.errors[0]?.message || "Quantité en stock invalide"
          }`
        );
      } else {
        errors.push(
          `${linePrefix}Quantité en stock doit être un nombre entier >= 0`
        );
      }
    }

    // Validation du prix promotionnel (utilise salePriceSchema avec le bon label)
    if (
      product.salePrice !== null &&
      product.salePrice !== undefined &&
      String(product.salePrice).trim()
    ) {
      try {
        const salePriceString = String(product.salePrice);
        salePriceSchema.parse(salePriceString);
      } catch (error: any) {
        if (error.errors) {
          errors.push(
            `${linePrefix}${
              error.errors[0]?.message || "Prix promotionnel invalide"
            }`
          );
        }
      }
    }

    // Validation du poids (utilise weightSchema)
    if (
      product.weight !== null &&
      product.weight !== undefined &&
      String(product.weight).trim()
    ) {
      try {
        const weightString = String(product.weight);
        weightSchema.parse(weightString);
      } catch (error: any) {
        if (error.errors) {
          errors.push(
            `${linePrefix}${error.errors[0]?.message || "Poids invalide"}`
          );
        }
      }
    }

    // Validation des dimensions (utilise dimensionSchema)
    if (
      product.dimensions_length !== null &&
      product.dimensions_length !== undefined &&
      String(product.dimensions_length).trim()
    ) {
      try {
        const lengthString = String(product.dimensions_length);
        dimensionSchema.parse(lengthString);
      } catch (error: any) {
        if (error.errors) {
          errors.push(
            `${linePrefix}Longueur: ${
              error.errors[0]?.message || "Longueur invalide"
            }`
          );
        }
      }
    }
    if (
      product.dimensions_width !== null &&
      product.dimensions_width !== undefined &&
      String(product.dimensions_width).trim()
    ) {
      try {
        const widthString = String(product.dimensions_width);
        dimensionSchema.parse(widthString);
      } catch (error: any) {
        if (error.errors) {
          errors.push(
            `${linePrefix}Largeur: ${
              error.errors[0]?.message || "Largeur invalide"
            }`
          );
        }
      }
    }
    if (
      product.dimensions_height !== null &&
      product.dimensions_height !== undefined &&
      String(product.dimensions_height).trim()
    ) {
      try {
        const heightString = String(product.dimensions_height);
        dimensionSchema.parse(heightString);
      } catch (error: any) {
        if (error.errors) {
          errors.push(
            `${linePrefix}Hauteur: ${
              error.errors[0]?.message || "Hauteur invalide"
            }`
          );
        }
      }
    }

    // Validation des URLs d'images
    if (product.imageUrls?.trim()) {
      const imageUrls = product.imageUrls
        .split(",")
        .map((url: string) => url.trim())
        .filter(Boolean);
      for (const url of imageUrls) {
        try {
          new URL(url);
        } catch {
          errors.push(`Ligne ${index + 2}: URL d'image invalide: ${url}`);
        }
      }
    }

    // Validation des URLs de fichiers
    if (product.fileUrls?.trim()) {
      const fileUrls = product.fileUrls
        .split(",")
        .map((url: string) => url.trim())
        .filter(Boolean);
      for (const url of fileUrls) {
        try {
          new URL(url);
        } catch {
          errors.push(`Ligne ${index + 2}: URL de fichier invalide: ${url}`);
        }
      }
    }

    // Conversion des booléens
    const isFeatured =
      product.isFeatured === "true" || product.isFeatured === true;
    const isActive = product.isActive !== "false" && product.isActive !== false;
    const manageStock =
      product.manageStock !== "false" && product.manageStock !== false;
    const inStock = product.inStock !== "false" && product.inStock !== false;

    return {
      id: generateTempId(),
      name: product.name?.trim() || "",
      description: product.description?.trim(),
      shortDescription: product.shortDescription?.trim(),
      longDescription: product.longDescription?.trim(),
      features: product.features?.trim(),
      applications: product.applications?.trim(),
      sku: product.sku?.trim(),
      price: parseFloat(product.price) || 0,
      salePrice: product.salePrice ? parseFloat(product.salePrice) : undefined,
      stockQuantity: parseInt(product.stockQuantity) || 0,
      manageStock,
      inStock,
      isFeatured,
      isActive,
      brandName: product.brandName?.trim(),
      categoryNames: product.categoryNames?.trim(),
      imageUrls: config.enableImages ? product.imageUrls?.trim() : undefined,
      fileUrls: config.enableFiles ? product.fileUrls?.trim() : undefined,
      fabricationCountryCode: product.fabricationCountryCode?.trim(),
      weight: product.weight ? parseFloat(product.weight) : undefined,
      dimensions: {
        length: product.dimensions_length
          ? parseFloat(product.dimensions_length)
          : undefined,
        width: product.dimensions_width
          ? parseFloat(product.dimensions_width)
          : undefined,
        height: product.dimensions_height
          ? parseFloat(product.dimensions_height)
          : undefined,
      },
      warranty: product.warranty?.trim(),
      certifications: product.certifications?.trim()
        ? product.certifications.split(",").map((c: string) => c.trim())
        : [],
      isValid: errors.length === 0 && hasRequiredFields(product),
      errors,
      isSelected: true,
    };
  };

  // Parser le CSV
  const parseCSV = (csvText: string): Promise<ImportedProduct[]> => {
    return new Promise<ImportedProduct[]>(async (resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
        complete: async (results) => {
          if (results.errors.length > 0) {
            setValidationErrors(results.errors.map((err) => err.message));
            resolve([]);
            return;
          }

          // Vérifier le schéma
          const headers = Object.keys(results.data[0] || {});
          const missingRequired = FILE_SCHEMA.required.filter(
            (field) => !headers.includes(field)
          );

          if (missingRequired.length > 0) {
            setValidationErrors([
              `Colonnes requises manquantes: ${missingRequired.join(", ")}`,
              `Colonnes trouvées: ${headers.join(", ")}`,
              `Colonnes requises: ${FILE_SCHEMA.required.join(", ")}`,
              `Colonnes optionnelles: ${FILE_SCHEMA.optional.join(", ")}`,
            ]);
            resolve([]);
            return;
          }

          // Valider et transformer les données de manière asynchrone
          const products = await Promise.all(
            results.data.map((row, index) =>
              validateProduct(row, index, config)
            )
          );

          // Collecter toutes les erreurs de validation
          const allErrors = (products || []).flatMap((p) => p.errors || []);
          setValidationErrors(allErrors);

          resolve(products);
        },
      });
    });
  };

  // Gérer l'upload de fichier
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    const allowedTypes = [".csv", ".xlsx", ".xls"];
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));

    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Type de fichier non supporté",
        description: "Utilisez CSV, XLS ou XLSX.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(20);

    try {
      let csvText = "";

      if (fileExtension === ".csv") {
        csvText = await file.text();
      } else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
        // Lecture des fichiers Excel avec XLSX
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        // Prendre la première feuille
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          toast({
            title: "Fichier Excel vide",
            description: "Le fichier Excel ne contient aucune feuille.",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }

        const worksheet = workbook.Sheets[sheetName];

        // Convertir en CSV pour réutiliser la logique existante
        csvText = XLSX.utils.sheet_to_csv(worksheet);

        if (!csvText.trim()) {
          toast({
            title: "Feuille Excel vide",
            description: "La première feuille du fichier Excel est vide.",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }
      } else {
        toast({
          title: "Type de fichier non supporté",
          description: "Seuls les fichiers CSV, XLS et XLSX sont supportés.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      setProcessingProgress(50);
      setCsvData(csvText);

      const products = await parseCSV(csvText);
      setProcessingProgress(80);

      setImportedProducts(products);
      setProcessingProgress(100);

      if (products.length > 0) {
        if (config.enablePreview) {
          setActiveTab("preview");
        } else {
          // Import direct avec progression
          await handleImportWithProgress(products.filter((p) => p.isValid));
        }
      }
    } catch (error) {
      console.error("Erreur lors du parsing:", error);
      toast({
        title: "Erreur de lecture",
        description: "Impossible de lire le fichier.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  // Gérer le collage de CSV
  const handleCSVPaste = async () => {
    if (!csvData.trim()) {
      toast({
        title: "Contenu manquant",
        description: "Veuillez coller du contenu CSV.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(30);

    try {
      const products = await parseCSV(csvData);
      setProcessingProgress(80);

      setImportedProducts(products);
      setProcessingProgress(100);

      if (products.length > 0) {
        if (config.enablePreview) {
          setActiveTab("preview");
        } else {
          // Import direct avec progression
          await handleImportWithProgress(products.filter((p) => p.isValid));
        }
      }
    } catch (error) {
      console.error("Erreur lors du parsing:", error);
      toast({
        title: "Erreur de parsing",
        description: "Impossible d'analyser le contenu CSV.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  // Gérer l'importation avec progression
  const handleImportWithProgress = async (
    productsToImport: ImportedProduct[]
  ) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setImportStatus("processing");

    try {
      // Préparer les données pour l'API
      const apiProducts = productsToImport.map((product) => ({
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        longDescription: product.longDescription,
        features: product.features,
        applications: product.applications,
        sku: product.sku,
        price: product.price,
        salePrice: product.salePrice,
        stockQuantity: product.stockQuantity,
        manageStock: product.manageStock,
        inStock: product.inStock,
        isFeatured: product.isFeatured,
        isActive: product.isActive,
        brandName: product.brandName,
        categoryNames: product.categoryNames,
        imageUrls: config.enableImages ? product.imageUrls : undefined,
        fileUrls: config.enableFiles ? product.fileUrls : undefined,
        fabricationCountryCode: product.fabricationCountryCode,
        weight: product.weight,
        dimensions: product.dimensions,
        warranty: product.warranty,
        certifications: product.certifications,
      }));

      setProcessingProgress(10);

      // Démarrer l'import avec progression
      const startResponse = await productsService.startBulkImport(apiProducts);

      console.log("🔍 Start Response:", startResponse);
      console.log("🔍 Start Response Data:", startResponse.data);

      if (!startResponse.data) {
        throw new Error("Impossible de démarrer l'import");
      }

      const { importId: newImportId, total } = startResponse.data;
      console.log("🔍 Extracted importId:", newImportId);
      console.log("🔍 Extracted total:", total);

      if (!newImportId) {
        throw new Error("ImportId non reçu du serveur");
      }
      setImportId(newImportId);
      setProcessingProgress(20);

      // Polling pour suivre la progression
      const pollInterval = setInterval(async () => {
        try {
          const progressResponse = await productsService.getImportProgress(
            newImportId
          );

          if (progressResponse.data) {
            const progress = progressResponse.data;
            console.log("🔍 Progress data received:", progress);
            console.log("🔍 Backend percentage:", progress.percentage);
            console.log(
              "🔍 Progress processed/total:",
              progress.processed,
              "/",
              progress.total
            );

            // Utiliser le pourcentage calculé par le backend, avec fallback local
            let percentage = progress.percentage;
            if (
              percentage === 0 &&
              progress.processed > 0 &&
              progress.total > 0
            ) {
              percentage = Math.round(
                (progress.processed / progress.total) * 100
              );
              console.log("🔍 Frontend fallback percentage:", percentage);
            }

             // Mapper le pourcentage backend (0-100%) sur 20-95% (75% de l'espace total)
             // 0% backend → 20% frontend
             // 100% backend → 95% frontend 
             // Formule: 20 + (percentage * 0.75)
             const mappedPercentage = 20 + (percentage * 0.75);
             
             console.log("🔍 Final percentage used:", percentage);
             console.log("🔍 Mapped percentage (20-95%):", mappedPercentage);
             setProcessingProgress(Math.min(95, mappedPercentage || 20));

            // S'assurer que isProcessing reste true pendant le traitement
            if (progress.status === "processing") {
              setIsProcessing(true);
            }

            // Mettre à jour le produit en cours de traitement
            if (progress.currentProduct && progress.status === "processing") {
              setCurrentProduct(progress.currentProduct);
              console.log("🔍 Current product:", progress.currentProduct);
            }

            // Mettre à jour le statut
             if (progress.status === "completed") {
               clearInterval(pollInterval);
               setProcessingProgress(100); // 100% à la fin
               setImportStatus("completed");
               setCurrentProduct(null);

              // Afficher les résultats
              const { successful, failed, results } = progress;

              if (failed > 0) {
                const errors = results
                  .filter((r: any) => !r.success)
                  .flatMap((r: any) => r.errors || [])
                  .slice(0, 5);

                toast({
                  title: "Import terminé avec des erreurs",
                  description: `${successful} succès, ${failed} échecs. ${
                    errors.length > 0 ? `Erreurs: ${errors.join(", ")}` : ""
                  }`,
                  variant: "destructive",
                });
              } else {
                toast({
                  title: "Importation réussie",
                  description: `${successful} produits importés avec succès !`,
                });
              }

              // Invalider les requêtes de produits pour forcer le rafraîchissement
              await queryClient.invalidateQueries({
                queryKey: ["products"],
                refetchType: "active",
              });

              // Nettoyer les états après succès
              setIsProcessing(false);
              setProcessingProgress(0);

              onOpenChange(false);
              resetDialog();
            } else if (progress.status === "failed") {
              clearInterval(pollInterval);
              setImportStatus("failed");
              setIsProcessing(false);
              setProcessingProgress(0);
              throw new Error("Import échoué");
            }
          }
        } catch (error) {
          clearInterval(pollInterval);
          setImportStatus("failed");
          setIsProcessing(false);
          setProcessingProgress(0);
          throw error;
        }
      }, 1000); // Polling toutes les secondes

      // Timeout de sécurité (10 minutes)
      setTimeout(() => {
        clearInterval(pollInterval);
        if (importStatus === "processing") {
          setImportStatus("failed");
          setIsProcessing(false);
          setProcessingProgress(0);
          toast({
            title: "Timeout d'importation",
            description:
              "L'import prend trop de temps. Vérifiez les résultats manuellement.",
            variant: "destructive",
          });
        }
      }, 10 * 60 * 1000);
    } catch (error: any) {
      console.error("Erreur lors de l'import avec progression:", error);
      setImportStatus("failed");
      setIsProcessing(false);
      setProcessingProgress(0);
      toast({
        title: "Erreur d'importation",
        description: error.message || "Erreur inconnue",
        variant: "destructive",
      });
    }
  };

  // Gérer l'importation finale (ancienne méthode, conservée pour compatibilité)
  const handleImport = async (productsToImport: ImportedProduct[]) => {
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // Préparer les données pour l'API
      const apiProducts = productsToImport.map((product) => ({
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        longDescription: product.longDescription,
        features: product.features,
        applications: product.applications,
        sku: product.sku,
        price: product.price,
        salePrice: product.salePrice,
        stockQuantity: product.stockQuantity,
        manageStock: product.manageStock,
        inStock: product.inStock,
        isFeatured: product.isFeatured,
        isActive: product.isActive,
        brandName: product.brandName,
        categoryNames: product.categoryNames,
        imageUrls: config.enableImages ? product.imageUrls : undefined,
        fileUrls: config.enableFiles ? product.fileUrls : undefined,
        fabricationCountryCode: product.fabricationCountryCode,
        weight: product.weight,
        dimensions: product.dimensions,
        warranty: product.warranty,
        certifications: product.certifications,
      }));

      setProcessingProgress(20);

      // Appel API pour import en masse
      const response = await productsService.bulkImportProducts(apiProducts);

      setProcessingProgress(100);

      console.log("Response reçue:", response);

      if (response.data) {
        const { successful, failed, results } = (response.data as any)
          .data as typeof response.data;

        // Afficher les résultats
        if (failed > 0) {
          const errors = (results || [])
            .filter((r: any) => !r.success)
            .flatMap((r: any) => r.errors || [])
            .slice(0, 5); // Limiter à 5 erreurs

          toast({
            title: "Import terminé avec des erreurs",
            description: `${successful} succès, ${failed} échecs. ${
              errors.length > 0 ? `Erreurs: ${errors.join(", ")}` : ""
            }`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Importation réussie",
            description: `${successful} produits importés avec succès !`,
          });
        }

        // Afficher les warnings s'il y en a
        const warnings = (results || [])
          .flatMap((r: any) => r.warnings || [])
          .filter(Boolean);
        if (warnings.length > 0) {
          warnings.slice(0, 3).forEach((warning: any) => {
            toast({
              title: "Avertissement",
              description: warning,
              variant: "destructive",
            });
          });
        }

        // Invalider les requêtes de produits pour forcer le rafraîchissement
        await queryClient.invalidateQueries({
          queryKey: ["products"],
          refetchType: "active",
        });
      }

      onOpenChange(false);
      resetDialog();
    } catch (error: any) {
      console.error("Erreur lors de l'import:", error);
      toast({
        title: "Erreur d'importation",
        description: error.message || "Erreur inconnue",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  // Reset du dialogue
  const resetDialog = () => {
    setCsvData("");
    setImportedProducts([]);
    setValidationErrors([]);
    setActiveTab("upload");
    setProcessingProgress(0);
    setIsProcessing(false);
    setImportId(null);
    setImportStatus(null);
    setCurrentProduct(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Télécharger l'exemple Excel
  const downloadExcelExample = () => {
    const a = document.createElement("a");
    a.href = "/exemple_produits.xlsx";
    a.download = "exemple_produits.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Gérer la sélection de produits
  const toggleProductSelection = (productId: string) => {
    if (!config.enableDelete) return;

    setImportedProducts((products) =>
      products.map((p) =>
        p.id === productId ? { ...p, isSelected: !p.isSelected } : p
      )
    );
  };

  // Sélectionner tous les produits valides
  const selectAllValidProducts = () => {
    setImportedProducts((products) =>
      products.map((p) => ({ ...p, isSelected: p.isValid }))
    );
  };

  // Désélectionner tous les produits
  const deselectAllProducts = () => {
    setImportedProducts((products) =>
      products.map((p) => ({ ...p, isSelected: false }))
    );
  };

  // Gérer l'édition d'un produit
  const handleEditProduct = (product: ImportedProduct) => {
    setEditingProduct(product);
    setShowEditDialog(true);
  };

  // Gérer la sauvegarde après édition
  const handleEditSave = async (updatedProductData: any) => {
    if (!editingProduct) return;

    // Convertir les données du formulaire vers ImportedProduct
    const updatedImportedProduct: ImportedProduct = {
      ...editingProduct,
      name: updatedProductData.name,
      description: updatedProductData.description,
      shortDescription: updatedProductData.shortDescription,
      longDescription: updatedProductData.longDescription,
      features: updatedProductData.features,
      applications: updatedProductData.applications,
      sku: updatedProductData.sku,
      price: updatedProductData.price,
      salePrice: updatedProductData.salePrice || undefined,
      stockQuantity: updatedProductData.stockQuantity,
      manageStock: updatedProductData.manageStock,
      inStock: updatedProductData.inStock,
      isFeatured: updatedProductData.isFeatured,
      isActive: updatedProductData.isActive,
      fabricationCountryCode: updatedProductData.fabricationCountryCode,
      weight: updatedProductData.weight,
      dimensions: updatedProductData.dimensions,
      warranty: updatedProductData.warranty,
      certifications: updatedProductData.certifications,
      // Garder les données d'import originales si pas modifiées
      brandName:
        updatedProductData._importData?.brandName || editingProduct.brandName,
      categoryNames:
        updatedProductData._importData?.categoryNames ||
        editingProduct.categoryNames,
      imageUrls:
        updatedProductData._importData?.imageUrls || editingProduct.imageUrls,
      fileUrls:
        updatedProductData._importData?.fileUrls || editingProduct.fileUrls,
    };

    // Revalider le produit
    const validatedProduct = await validateProduct(
      updatedImportedProduct,
      0,
      config
    );

    // Mettre à jour la liste
    setImportedProducts((products) =>
      products.map((p) =>
        p.id === editingProduct.id
          ? { ...validatedProduct, id: editingProduct.id }
          : p
      )
    );

    // Fermer le dialogue
    setShowEditDialog(false);
    setEditingProduct(null);
  };

  // Statistiques
  const stats = {
    total: importedProducts.length,
    valid: importedProducts.filter((p) => p.isValid).length,
    invalid: importedProducts.filter((p) => !p.isValid).length,
    selected: importedProducts.filter((p) => p.isSelected).length,
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Importation de produits
            </DialogTitle>
            <DialogDescription>
              Importez des produits en masse depuis un fichier Excel ou CSV, ou
              en collant du contenu CSV.
            </DialogDescription>
          </DialogHeader>

          {/* Barre de progression */}
          {(isProcessing || importStatus === "processing") && (
            <div className="mb-4">
              <Progress value={processingProgress} className="w-full" />
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {importStatus === "processing" && importId
                      ? `Traitement en cours... ${Math.round(
                          processingProgress
                        )}%`
                      : `Préparation... ${Math.round(processingProgress)}%`}
                  </p>
                  {importStatus === "processing" && (
                    <p className="text-xs text-muted-foreground">
                      ID: {importId?.slice(-8)}
                    </p>
                  )}
                </div>
                {currentProduct && importStatus === "processing" && (
                  <p className="text-xs text-muted-foreground truncate">
                    {currentProduct}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="h-full flex flex-col"
            >
              <TabsList
                className={`grid w-full ${
                  config.enablePreview ? "grid-cols-2" : "grid-cols-1"
                }`}
              >
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Import
                </TabsTrigger>
                {config.enablePreview && (
                  <TabsTrigger
                    value="preview"
                    className="flex items-center gap-2"
                    disabled={importedProducts.length === 0}
                  >
                    <Eye className="w-4 h-4" />
                    Prévisualisation ({stats.total})
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="upload" className="flex-1 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Upload de fichier */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5" />
                        Fichier Excel/CSV
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div
                        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">
                          Cliquez pour sélectionner un fichier
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Formats supportés: XLSX, XLS, CSV
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={downloadExcelExample}
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger le template Excel
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Zone de texte pour coller */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Coller du contenu CSV
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="Collez votre contenu CSV ici..."
                        value={csvData}
                        onChange={(e) => setCsvData(e.target.value)}
                        className="min-h-[200px] font-mono text-sm"
                      />
                      <Button
                        onClick={handleCSVPaste}
                        disabled={!csvData.trim() || isProcessing}
                        className="w-full"
                      >
                        Traiter le CSV
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Configuration (visible seulement en développement) */}
                {process.env.NODE_ENV === "development" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Configuration d'importation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="enablePreview"
                            checked={config.enablePreview}
                            onCheckedChange={(checked) =>
                              setConfig((prev) => ({
                                ...prev,
                                enablePreview: checked,
                              }))
                            }
                          />
                          <Label htmlFor="enablePreview">
                            Activer la prévisualisation
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="enableEdit"
                            checked={config.enableEdit}
                            onCheckedChange={(checked) =>
                              setConfig((prev) => ({
                                ...prev,
                                enableEdit: checked,
                              }))
                            }
                            disabled={!config.enablePreview}
                          />
                          <Label htmlFor="enableEdit">
                            Permettre la modification
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="enableDelete"
                            checked={config.enableDelete}
                            onCheckedChange={(checked) =>
                              setConfig((prev) => ({
                                ...prev,
                                enableDelete: checked,
                              }))
                            }
                            disabled={!config.enablePreview}
                          />
                          <Label htmlFor="enableDelete">
                            Permettre la suppression
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="enableImages"
                            checked={config.enableImages}
                            onCheckedChange={(checked) =>
                              setConfig((prev) => ({
                                ...prev,
                                enableImages: checked,
                              }))
                            }
                          />
                          <Label htmlFor="enableImages">
                            Traiter les images
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="enableFiles"
                            checked={config.enableFiles}
                            onCheckedChange={(checked) =>
                              setConfig((prev) => ({
                                ...prev,
                                enableFiles: checked,
                              }))
                            }
                          />
                          <Label htmlFor="enableFiles">
                            Traiter les fichiers
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Lien vers la documentation */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-3">
                        Consultez la documentation pour le format Excel/CSV requis
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open("/docs/format-csv-import", "_blank")
                        }
                      >
                        Voir la documentation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {config.enablePreview && (
                <TabsContent value="preview" className="flex-1 flex flex-col">
                  {importedProducts.length > 0 && (
                    <div className="space-y-4 flex-1 flex flex-col">
                      {/* Statistiques et actions */}
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex gap-4">
                          <Badge variant="outline">Total: {stats.total}</Badge>
                          <Badge variant="default">
                            Valides: {stats.valid}
                          </Badge>
                          <Badge variant="destructive">
                            Invalides: {stats.invalid}
                          </Badge>
                          <Badge variant="secondary">
                            Sélectionnés: {stats.selected}
                          </Badge>
                        </div>

                        {config.enableDelete && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={selectAllValidProducts}
                            >
                              Sélectionner tous les valides
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={deselectAllProducts}
                            >
                              Désélectionner tout
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setImportedProducts((products) =>
                                  products.filter((p) => !p.isSelected)
                                );
                              }}
                              disabled={stats.selected === 0}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer sélectionnés ({stats.selected})
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Section des erreurs de validation */}
                      {validationErrors.length > 0 && (
                        <Card className="border-destructive/20 bg-destructive/5">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-destructive flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              Erreurs de validation ({validationErrors.length})
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="max-h-[200px] overflow-y-scroll space-y-2 pr-2">
                              {validationErrors.map((error, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-2 text-sm p-2 bg-background/50 rounded border"
                                >
                                  <AlertCircle className="w-3 h-3 mt-0.5 shrink-0 text-destructive" />
                                  <span className="text-destructive/90">
                                    {error}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Table des produits */}
                      <div className="flex-1 border rounded-lg">
                        <div className="overflow-auto max-h-96">
                          <Table>
                            <TableHeader className="sticky top-0 bg-background">
                              <TableRow>
                                {config.enableDelete && (
                                  <TableHead className="w-12">
                                    <Checkbox
                                      checked={
                                        importedProducts.length > 0 &&
                                        importedProducts.every(
                                          (p) => p.isSelected
                                        )
                                      }
                                      ref={(el) => {
                                        if (el) {
                                          (el as any).indeterminate =
                                            stats.selected > 0 &&
                                            stats.selected <
                                              importedProducts.length;
                                        }
                                      }}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          selectAllValidProducts();
                                        } else {
                                          deselectAllProducts();
                                        }
                                      }}
                                    />
                                  </TableHead>
                                )}
                                {config.enableImages && (
                                  <TableHead className="w-16">Image</TableHead>
                                )}
                                <TableHead>Produit</TableHead>
                                <TableHead>Prix</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Marque</TableHead>
                                <TableHead>Catégories</TableHead>
                                <TableHead>Validation</TableHead>
                                {config.enableEdit && (
                                  <TableHead className="w-12">
                                    Actions
                                  </TableHead>
                                )}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {importedProducts.map((product) => (
                                <TableRow
                                  key={product.id}
                                  className={`${
                                    !product.isValid
                                      ? "bg-destructive/5"
                                      : product.isSelected
                                      ? "bg-primary/5"
                                      : ""
                                  }`}
                                >
                                  {config.enableDelete && (
                                    <TableCell>
                                      <Checkbox
                                        checked={product.isSelected}
                                        onCheckedChange={() =>
                                          toggleProductSelection(product.id)
                                        }
                                        disabled={!product.isValid}
                                      />
                                    </TableCell>
                                  )}
                                  {config.enableImages && (
                                    <TableCell>
                                      <div className="w-12 h-12 rounded border overflow-hidden bg-gray-50 flex items-center justify-center">
                                        {product.imageUrls &&
                                        product.imageUrls.trim() ? (
                                          <img
                                            src={product.imageUrls
                                              .split(",")[0]
                                              .trim()}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              (
                                                e.target as HTMLImageElement
                                              ).style.display = "none";
                                              (
                                                e.target as HTMLImageElement
                                              ).nextElementSibling?.classList.remove(
                                                "hidden"
                                              );
                                            }}
                                          />
                                        ) : null}
                                        <div
                                          className={`w-full h-full flex items-center justify-center ${
                                            product.imageUrls ? "hidden" : ""
                                          }`}
                                        >
                                          <Package className="w-4 h-4 text-gray-400" />
                                        </div>
                                      </div>
                                    </TableCell>
                                  )}
                                  <TableCell>
                                    <div className="flex flex-col">
                                      <span className="font-medium">
                                        {product.name}
                                      </span>
                                      {product.sku && (
                                        <span className="text-sm text-muted-foreground">
                                          SKU: {product.sku}
                                        </span>
                                      )}
                                      {product.description && (
                                        <span className="text-xs text-muted-foreground line-clamp-2 max-w-xs">
                                          {product.description}
                                        </span>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-col">
                                      <span className="font-medium">
                                        {formatPrice(product.price)}
                                      </span>
                                      {product.salePrice && (
                                        <span className="text-sm text-green-600">
                                          Promo:{" "}
                                          {formatPrice(product.salePrice)}
                                        </span>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-col">
                                      <span>{product.stockQuantity}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {product.inStock
                                          ? "En stock"
                                          : "Rupture"}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-col gap-1">
                                      {product.isFeatured && (
                                        <Badge
                                          variant="secondary"
                                          className="w-fit text-xs"
                                        >
                                          Mis en avant
                                        </Badge>
                                      )}
                                      <Badge
                                        variant={
                                          product.isActive
                                            ? "default"
                                            : "outline"
                                        }
                                        className="w-fit text-xs"
                                      >
                                        {product.isActive ? "Actif" : "Inactif"}
                                      </Badge>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {product.brandName && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {product.brandName}
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {product.categoryNames && (
                                      <div className="flex flex-wrap gap-1 max-w-xs">
                                        {product.categoryNames
                                          .split(",")
                                          .slice(0, 2)
                                          .map((cat, idx) => (
                                            <Badge
                                              key={idx}
                                              variant="secondary"
                                              className="text-xs"
                                            >
                                              {cat.trim()}
                                            </Badge>
                                          ))}
                                        {product.categoryNames.split(",")
                                          .length > 2 && (
                                          <Badge
                                            variant="secondary"
                                            className="text-xs"
                                          >
                                            +
                                            {product.categoryNames.split(",")
                                              .length - 2}
                                          </Badge>
                                        )}
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {product.errors.length > 0 ? (
                                      <div className="max-w-xs">
                                        <Badge
                                          variant="destructive"
                                          className="text-xs mb-1"
                                        >
                                          {product.errors.length} erreur(s)
                                        </Badge>
                                        <div className="text-xs text-destructive space-y-1">
                                          {product.errors
                                            .slice(0, 2)
                                            .map((error, idx) => (
                                              <div
                                                key={idx}
                                                className="flex items-start gap-1"
                                              >
                                                <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                                                <span className="line-clamp-2">
                                                  {error}
                                                </span>
                                              </div>
                                            ))}
                                          {product.errors.length > 2 && (
                                            <div className="text-xs">
                                              ... et {product.errors.length - 2}{" "}
                                              autres
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <Badge
                                        variant="default"
                                        className="text-green-700 bg-green-50 text-xs"
                                      >
                                        Valide
                                      </Badge>
                                    )}
                                  </TableCell>
                                  {config.enableEdit && (
                                    <TableCell>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleEditProduct(product)
                                        }
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                    </TableCell>
                                  )}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      {/* Actions finales */}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <Button variant="outline" onClick={resetDialog}>
                          Recommencer
                        </Button>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                          >
                            Annuler
                          </Button>
                          <Button
                            onClick={() =>
                              handleImportWithProgress(
                                importedProducts.filter(
                                  (p) => p.isSelected && p.isValid
                                )
                              )
                            }
                            disabled={stats.selected === 0 || isProcessing}
                          >
                            Importer {stats.selected} produit
                            {stats.selected !== 1 ? "s" : ""}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              )}
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogue d'édition avec le vrai formulaire de produit */}
      {editingProduct && (
        <ProductImportEditDialog
          open={showEditDialog}
          onOpenChange={(open: boolean) => {
            setShowEditDialog(open);
            if (!open) {
              setEditingProduct(null);
            }
          }}
          product={convertToProduct(editingProduct)}
          onSave={handleEditSave}
          config={{
            enableImages: config.enableImages,
            enableFiles: config.enableFiles,
          }}
        />
      )}
    </>
  );
}
