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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { productsService } from "@/lib/api/services";
import {
  numericStringSchema
} from "@/lib/validations/common";
import {
  AlertCircle,
  Download,
  Edit,
  Eye,
  FileSpreadsheet,
  Package,
  Settings,
  Trash2,
  Upload
} from "lucide-react";
import Papa from "papaparse";
import { useRef, useState } from "react";
import * as XLSX from 'xlsx';
import { ProductImportEditDialog } from "./ProductImportEditDialog";

// Configuration d'importation
interface ImportConfig {
  enablePreview: boolean;
  enableEdit: boolean;
  enableDelete: boolean;
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

// Schéma CSV attendu (basé sur le vrai schéma de produit)
const CSV_SCHEMA = {
  required: ['name', 'price', 'stockQuantity'],
  optional: [
    'description',
    'shortDescription', 
    'sku',
    'salePrice',
    'brandName',
    'categoryNames',
    'imageUrls',
    'fileUrls',
    'isFeatured',
    'isActive',
    'manageStock',
    'inStock',
    'fabricationCountryCode',
    'weight',
    'dimensions_length',
    'dimensions_width', 
    'dimensions_height',
    'warranty',
    'certifications',
    'longDescription',
    'features',
    'applications'
  ],
};

// Exemple de CSV pour téléchargement (complet avec tous les champs)
const CSV_EXAMPLE = `name,description,shortDescription,longDescription,features,applications,sku,price,salePrice,stockQuantity,manageStock,inStock,isFeatured,isActive,brandName,categoryNames,imageUrls,fileUrls,fabricationCountryCode,weight,dimensions_length,dimensions_width,dimensions_height,warranty,certifications
"Smartphone Galaxy Pro","Smartphone haut de gamme avec écran OLED 6.7 pouces","Smartphone premium","Smartphone haut de gamme avec écran OLED 6.7 pouces, processeur octa-core et triple caméra 108MP. Idéal pour la photographie professionnelle.","Écran OLED 6.7 pouces|Processeur octa-core|Triple caméra 108MP|Batterie 5000mAh","Photographie professionnelle|Gaming|Usage quotidien","SMART001",899.99,799.99,25,true,true,true,true,"Samsung","Électronique,Smartphones","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500,https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500","https://example.com/manual.pdf,https://example.com/warranty.pdf","KR",180,158.2,75.8,8.9,"2 ans","CE,FCC"
"Casque Audio Bluetooth","Casque sans fil avec réduction de bruit active","Casque Bluetooth premium","Casque sans fil haute qualité avec réduction de bruit active, autonomie 30h et son haute fidélité. Parfait pour les audiophiles.","Réduction de bruit active|Autonomie 30h|Son haute fidélité|Bluetooth 5.0","Musique|Appels|Voyage","AUDIO001",249.99,199.99,50,true,true,false,true,"Sony","Électronique,Audio","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500","https://example.com/user-guide.pdf","JP",290,,,,"1 an","CE"`;

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
  
  // État principal
  const [config, setConfig] = useState<ImportConfig>({
    enablePreview: true,
    enableEdit: true,
    enableDelete: true,
    enableImages: true,
    enableFiles: true,
  });
  
  const [csvData, setCsvData] = useState<string>("");
  const [importedProducts, setImportedProducts] = useState<ImportedProduct[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("upload");
  const [editingProduct, setEditingProduct] = useState<ImportedProduct | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Générer un ID temporaire unique
  const generateTempId = () => `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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
      salePrice: importedProduct.salePrice || 0,
      stockQuantity: importedProduct.stockQuantity,
      manageStock: importedProduct.manageStock ?? true,
      inStock: importedProduct.inStock ?? true,
      isFeatured: importedProduct.isFeatured ?? false,
      isActive: importedProduct.isActive ?? true,
      brandId: undefined, // Sera géré par le formulaire
      fabricationCountryCode: importedProduct.fabricationCountryCode || "",
      weight: importedProduct.weight || 0,
      dimensions: importedProduct.dimensions || { length: 0, width: 0, height: 0 },
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
      }
    };
  };

  // Schémas de validation spécifiques à l'import (avec les labels exacts du formulaire)
  const priceImportSchema = numericStringSchema({
    positive: true,
    min: 0,
    required: true,
    fieldName: "Prix de vente" // Label exact du formulaire (sans "Le")
  });

  const salePriceSchema = numericStringSchema({
    positive: true,
    min: 0,
    required: false,
    fieldName: "Prix promotionnel" // Label exact du formulaire
  });

  const stockImportSchema = numericStringSchema({
    min: 0,
    integer: true,
    required: true,
    fieldName: "Quantité en stock" // Label exact du formulaire (sans "La")
  });

  const weightSchema = numericStringSchema({
    positive: true,
    min: 0,
    required: false,
    fieldName: "Le poids"
  });

  const dimensionSchema = numericStringSchema({
    positive: true,
    min: 0,
    required: false,
    fieldName: "La dimension"
  });

  // Champs requis pour considérer un produit comme valide (configurable)
  // Pour ajouter un nouveau champ requis, ajoutez-le ici avec son label d'erreur
  // Exemple: price: "Le prix", description: "La description"
  const REQUIRED_FIELDS = {
    name: "Le nom",
    sku: "Le SKU"
  };

  // Vérifier si tous les champs requis sont présents
  const hasRequiredFields = (product: any): boolean => {
    return Object.keys(REQUIRED_FIELDS).every(field => {
      const value = product[field];
      return value !== null && value !== undefined && String(value).trim() !== '';
    });
  };

  // Valider un produit importé selon le vrai schéma (identique au formulaire de création)
  const validateProduct = (product: any, index: number, config: ImportConfig): ImportedProduct => {
    const errors: string[] = [];
    const linePrefix = `Ligne ${index + 2}: `;
    
    // Validation des champs requis pour le badge "Valide"
    Object.entries(REQUIRED_FIELDS).forEach(([field, label]) => {
      const value = product[field];
      if (!value || String(value).trim() === '') {
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
    }
    
    // Validation du prix (utilise priceImportSchema avec le bon label)
    try {
      const priceValue = product.price;
      const priceString = (priceValue === null || priceValue === undefined) ? "" : String(priceValue);
      priceImportSchema.parse(priceString);
    } catch (error: any) {
      if (error.errors) {
        errors.push(`${linePrefix}${error.errors[0]?.message || "Prix de vente invalide"}`);
      } else {
        errors.push(`${linePrefix}Prix de vente doit être un nombre positif`);
      }
    }
    
    // Validation de la quantité en stock (utilise stockImportSchema avec le bon label)
    try {
      const stockValue = product.stockQuantity;
      const stockString = (stockValue === null || stockValue === undefined) ? "" : String(stockValue);
      stockImportSchema.parse(stockString);
    } catch (error: any) {
      if (error.errors) {
        errors.push(`${linePrefix}${error.errors[0]?.message || "Quantité en stock invalide"}`);
      } else {
        errors.push(`${linePrefix}Quantité en stock doit être un nombre entier >= 0`);
      }
    }
    
    // Validation du prix promotionnel (utilise salePriceSchema avec le bon label)
    if (product.salePrice !== null && product.salePrice !== undefined && String(product.salePrice).trim()) {
      try {
        const salePriceString = String(product.salePrice);
        salePriceSchema.parse(salePriceString);
      } catch (error: any) {
        if (error.errors) {
          errors.push(`${linePrefix}${error.errors[0]?.message || "Prix promotionnel invalide"}`);
        }
      }
    }

    // Validation du poids (utilise weightSchema)
    if (product.weight !== null && product.weight !== undefined && String(product.weight).trim()) {
      try {
        const weightString = String(product.weight);
        weightSchema.parse(weightString);
      } catch (error: any) {
        if (error.errors) {
          errors.push(`${linePrefix}${error.errors[0]?.message || "Poids invalide"}`);
        }
      }
    }

    // Validation des dimensions (utilise dimensionSchema)
    if (product.dimensions_length !== null && product.dimensions_length !== undefined && String(product.dimensions_length).trim()) {
      try {
        const lengthString = String(product.dimensions_length);
        dimensionSchema.parse(lengthString);
      } catch (error: any) {
        if (error.errors) {
          errors.push(`${linePrefix}Longueur: ${error.errors[0]?.message || "Longueur invalide"}`);
        }
      }
    }
    if (product.dimensions_width !== null && product.dimensions_width !== undefined && String(product.dimensions_width).trim()) {
      try {
        const widthString = String(product.dimensions_width);
        dimensionSchema.parse(widthString);
      } catch (error: any) {
        if (error.errors) {
          errors.push(`${linePrefix}Largeur: ${error.errors[0]?.message || "Largeur invalide"}`);
        }
      }
    }
    if (product.dimensions_height !== null && product.dimensions_height !== undefined && String(product.dimensions_height).trim()) {
      try {
        const heightString = String(product.dimensions_height);
        dimensionSchema.parse(heightString);
      } catch (error: any) {
        if (error.errors) {
          errors.push(`${linePrefix}Hauteur: ${error.errors[0]?.message || "Hauteur invalide"}`);
        }
      }
    }

    // Validation des URLs d'images
    if (product.imageUrls?.trim()) {
      const imageUrls = product.imageUrls.split(',').map((url: string) => url.trim()).filter(Boolean);
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
      const fileUrls = product.fileUrls.split(',').map((url: string) => url.trim()).filter(Boolean);
      for (const url of fileUrls) {
        try {
          new URL(url);
        } catch {
          errors.push(`Ligne ${index + 2}: URL de fichier invalide: ${url}`);
        }
      }
    }
    
    // Conversion des booléens
    const isFeatured = product.isFeatured === 'true' || product.isFeatured === true;
    const isActive = product.isActive !== 'false' && product.isActive !== false;
    const manageStock = product.manageStock !== 'false' && product.manageStock !== false;
    const inStock = product.inStock !== 'false' && product.inStock !== false;
    
    return {
      id: generateTempId(),
      name: product.name?.trim() || '',
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
        length: product.dimensions_length ? parseFloat(product.dimensions_length) : undefined,
        width: product.dimensions_width ? parseFloat(product.dimensions_width) : undefined,
        height: product.dimensions_height ? parseFloat(product.dimensions_height) : undefined,
      },
      warranty: product.warranty?.trim(),
      certifications: product.certifications?.trim() ? product.certifications.split(',').map((c: string) => c.trim()) : [],
      isValid: errors.length === 0 && hasRequiredFields(product),
      errors,
      isSelected: true,
    };
  };

  // Parser le CSV
  const parseCSV = (csvText: string): Promise<ImportedProduct[]> => {
    return new Promise<ImportedProduct[]>((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
        complete: (results) => {
          if (results.errors.length > 0) {
            setValidationErrors(results.errors.map(err => err.message));
            resolve([]);
            return;
          }

          // Vérifier le schéma
          const headers = Object.keys(results.data[0] || {});
          const missingRequired = CSV_SCHEMA.required.filter(field => !headers.includes(field));
          
          if (missingRequired.length > 0) {
            setValidationErrors([
              `Colonnes requises manquantes: ${missingRequired.join(', ')}`,
              `Colonnes trouvées: ${headers.join(', ')}`,
              `Colonnes requises: ${CSV_SCHEMA.required.join(', ')}`,
              `Colonnes optionnelles: ${CSV_SCHEMA.optional.join(', ')}`
            ]);
            resolve([]);
            return;
          }

          // Valider et transformer les données
          const products = results.data.map((row, index) => validateProduct(row, index, config));
          
          // Collecter toutes les erreurs de validation
          const allErrors = (products || []).flatMap(p => p.errors || []);
          setValidationErrors(allErrors);
          
          resolve(products);
        },
      });
    });
  };

  // Gérer l'upload de fichier
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    const allowedTypes = ['.csv', '.xlsx', '.xls'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
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
      let csvText = '';
      
      if (fileExtension === '.csv') {
        csvText = await file.text();
      } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
        // Lecture des fichiers Excel avec XLSX
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
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
          // Import direct
          await handleImport(products.filter(p => p.isValid));
        }
      }
      
    } catch (error) {
      console.error('Erreur lors du parsing:', error);
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
          // Import direct
          await handleImport(products.filter(p => p.isValid));
        }
      }
      
    } catch (error) {
      console.error('Erreur lors du parsing:', error);
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

  // Gérer l'importation finale
  const handleImport = async (productsToImport: ImportedProduct[]) => {
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // Préparer les données pour l'API
      const apiProducts = productsToImport.map(product => ({
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
      
      console.log('Response reçue:', response);

      if (response.data) {
        const { successful, failed, results } = response.data;
        
        // Afficher les résultats
        if (failed > 0) {
        const errors = (results || [])
          .filter((r: any) => !r.success)
          .flatMap((r: any) => r.errors || [])
          .slice(0, 5); // Limiter à 5 erreurs
          
          toast({
            title: "Import terminé avec des erreurs",
            description: `${successful} succès, ${failed} échecs. ${
              errors.length > 0 ? `Erreurs: ${errors.join(', ')}` : ''
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
        const warnings = (results || []).flatMap((r: any) => r.warnings || []).filter(Boolean);
        if (warnings.length > 0) {
          warnings.slice(0, 3).forEach((warning: any) => {
            toast({
              title: "Avertissement",
              description: warning,
              variant: "destructive",
            });
          });
        }
      }
      
      onOpenChange(false);
      resetDialog();
      
    } catch (error: any) {
      console.error('Erreur lors de l\'import:', error);
      toast({
        title: "Erreur d'importation",
        description: error.message || 'Erreur inconnue',
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Télécharger l'exemple CSV
  const downloadCSVExample = () => {
    const blob = new Blob([CSV_EXAMPLE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exemple_produits.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Gérer la sélection de produits
  const toggleProductSelection = (productId: string) => {
    if (!config.enableDelete) return;
    
    setImportedProducts(products =>
      products.map(p =>
        p.id === productId ? { ...p, isSelected: !p.isSelected } : p
      )
    );
  };

  // Sélectionner tous les produits valides
  const selectAllValidProducts = () => {
    setImportedProducts(products =>
      products.map(p => ({ ...p, isSelected: p.isValid }))
    );
  };

  // Désélectionner tous les produits
  const deselectAllProducts = () => {
    setImportedProducts(products => 
      products.map(p => ({ ...p, isSelected: false }))
    );
  };

  // Gérer l'édition d'un produit
  const handleEditProduct = (product: ImportedProduct) => {
    setEditingProduct(product);
    setShowEditDialog(true);
  };

  // Gérer la sauvegarde après édition
  const handleEditSave = (updatedProductData: any) => {
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
      brandName: updatedProductData._importData?.brandName || editingProduct.brandName,
      categoryNames: updatedProductData._importData?.categoryNames || editingProduct.categoryNames,
      imageUrls: updatedProductData._importData?.imageUrls || editingProduct.imageUrls,
      fileUrls: updatedProductData._importData?.fileUrls || editingProduct.fileUrls,
    };

    // Revalider le produit
    const validatedProduct = validateProduct(updatedImportedProduct, 0, config);

    // Mettre à jour la liste
    setImportedProducts(products => 
      products.map(p => 
        p.id === editingProduct.id ? { ...validatedProduct, id: editingProduct.id } : p
      )
    );

    // Fermer le dialogue
    setShowEditDialog(false);
    setEditingProduct(null);
  };

  // Statistiques
  const stats = {
    total: importedProducts.length,
    valid: importedProducts.filter(p => p.isValid).length,
    invalid: importedProducts.filter(p => !p.isValid).length,
    selected: importedProducts.filter(p => p.isSelected).length,
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
              Importez des produits en masse depuis un fichier CSV ou Excel, ou en collant du contenu CSV.
            </DialogDescription>
          </DialogHeader>

        {/* Configuration */}
        {/* Configuration d'importation - Visible seulement en développement */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configuration d'importation (Dev) {process.env.NODE_ENV}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="preview"
                  checked={config.enablePreview}
                  onCheckedChange={(checked) =>
                    setConfig(prev => ({ ...prev, enablePreview: checked }))
                  }
                />
                <Label htmlFor="preview">Activer la prévisualisation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit"
                  checked={config.enableEdit}
                  onCheckedChange={(checked) =>
                    setConfig(prev => ({ ...prev, enableEdit: checked }))
                  }
                  disabled={!config.enablePreview}
                />
                <Label htmlFor="edit">Permettre la modification</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="delete"
                  checked={config.enableDelete}
                  onCheckedChange={(checked) =>
                    setConfig(prev => ({ ...prev, enableDelete: checked }))
                  }
                  disabled={!config.enablePreview}
                />
                <Label htmlFor="delete">Permettre la suppression</Label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Barre de progression */}
        {isProcessing && (
          <div className="mb-4">
            <Progress value={processingProgress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Traitement en cours... {Math.round(processingProgress)}%
            </p>
          </div>
        )}

        {/* Erreurs de validation */}
        {validationErrors.length > 0 && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-2">Erreurs de validation :</div>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className={`grid w-full ${config.enablePreview ? 'grid-cols-2' : 'grid-cols-1'}`}>
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
                      Fichier CSV/Excel
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-lg font-medium">Cliquez pour sélectionner un fichier</p>
                      <p className="text-sm text-muted-foreground">
                        Formats supportés: CSV, XLS, XLSX
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
                      onClick={downloadCSVExample}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger l'exemple CSV
                    </Button>
                  </CardContent>
                </Card>

                {/* Zone de texte pour coller */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Coller du contenu CSV</CardTitle>
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
              {process.env.NODE_ENV === 'development' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Configuration d'importation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enablePreview"
                          checked={config.enablePreview}
                          onCheckedChange={(checked) =>
                            setConfig(prev => ({ ...prev, enablePreview: !!checked }))
                          }
                        />
                        <Label htmlFor="enablePreview">Activer la prévisualisation</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enableEdit"
                          checked={config.enableEdit}
                          onCheckedChange={(checked) =>
                            setConfig(prev => ({ ...prev, enableEdit: !!checked }))
                          }
                        />
                        <Label htmlFor="enableEdit">Activer l'édition</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enableDelete"
                          checked={config.enableDelete}
                          onCheckedChange={(checked) =>
                            setConfig(prev => ({ ...prev, enableDelete: !!checked }))
                          }
                        />
                        <Label htmlFor="enableDelete">Activer la suppression</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enableImages"
                          checked={config.enableImages}
                          onCheckedChange={(checked) =>
                            setConfig(prev => ({ ...prev, enableImages: !!checked }))
                          }
                        />
                        <Label htmlFor="enableImages">Traiter les images</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enableFiles"
                          checked={config.enableFiles}
                          onCheckedChange={(checked) =>
                            setConfig(prev => ({ ...prev, enableFiles: !!checked }))
                          }
                        />
                        <Label htmlFor="enableFiles">Traiter les fichiers</Label>
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
                      Consultez la documentation pour le format CSV requis
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('/docs/format-csv-import.md', '_blank')}
                    >
                      📖 Voir le format CSV
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
                      <Badge variant="default">Valides: {stats.valid}</Badge>
                      <Badge variant="destructive">Invalides: {stats.invalid}</Badge>
                      <Badge variant="secondary">Sélectionnés: {stats.selected}</Badge>
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
                            setImportedProducts(products => products.filter(p => !p.isSelected));
                          }}
                          disabled={stats.selected === 0}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer sélectionnés ({stats.selected})
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Table des produits */}
                  <div className="flex-1 border rounded-lg">
                    <div className="overflow-auto max-h-96">
                      <Table>
                        <TableHeader className="sticky top-0 bg-background">
                          <TableRow>
                            {config.enableDelete && (
                              <TableHead className="w-12">
                                <Checkbox
                                  checked={importedProducts.length > 0 && importedProducts.every(p => p.isSelected)}
                                  ref={(el) => {
                                    if (el) {
                                      (el as any).indeterminate = stats.selected > 0 && stats.selected < importedProducts.length;
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
                            <TableHead className="w-16">Image</TableHead>
                            <TableHead>Produit</TableHead>
                            <TableHead>Prix</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Marque</TableHead>
                            <TableHead>Catégories</TableHead>
                            <TableHead>Validation</TableHead>
                            {config.enableEdit && <TableHead className="w-12">Actions</TableHead>}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {importedProducts.map((product) => (
                            <TableRow
                              key={product.id}
                              className={`${
                                !product.isValid ? 'bg-destructive/5' : 
                                product.isSelected ? 'bg-primary/5' : ''
                              }`}
                            >
                              {config.enableDelete && (
                                <TableCell>
                                  <Checkbox
                                    checked={product.isSelected}
                                    onCheckedChange={() => toggleProductSelection(product.id)}
                                    disabled={!product.isValid}
                                  />
                                </TableCell>
                              )}
                              <TableCell>
                                <div className="w-12 h-12 rounded border overflow-hidden bg-gray-50 flex items-center justify-center">
                                  {product.imageUrls && product.imageUrls.trim() ? (
                                    <img 
                                      src={product.imageUrls.split(',')[0].trim()}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                      }}
                                    />
                                  ) : null}
                                  <div className={`w-full h-full flex items-center justify-center ${product.imageUrls ? 'hidden' : ''}`}>
                                    <Package className="w-4 h-4 text-gray-400" />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium">{product.name}</span>
                                  {product.sku && (
                                    <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
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
                                  <span className="font-medium">{product.price}€</span>
                                  {product.salePrice && (
                                    <span className="text-sm text-green-600">
                                      Promo: {product.salePrice}€
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span>{product.stockQuantity}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {product.inStock ? 'En stock' : 'Rupture'}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  {product.isFeatured && (
                                    <Badge variant="secondary" className="w-fit text-xs">
                                      Mis en avant
                                    </Badge>
                                  )}
                                  <Badge 
                                    variant={product.isActive ? "default" : "outline"} 
                                    className="w-fit text-xs"
                                  >
                                    {product.isActive ? 'Actif' : 'Inactif'}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                {product.brandName && (
                                  <Badge variant="outline" className="text-xs">
                                    {product.brandName}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {product.categoryNames && (
                                  <div className="flex flex-wrap gap-1 max-w-xs">
                                    {product.categoryNames.split(',').slice(0, 2).map((cat, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {cat.trim()}
                                      </Badge>
                                    ))}
                                    {product.categoryNames.split(',').length > 2 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{product.categoryNames.split(',').length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                {product.errors.length > 0 ? (
                                  <div className="max-w-xs">
                                    <Badge variant="destructive" className="text-xs mb-1">
                                      {product.errors.length} erreur(s)
                                    </Badge>
                                    <div className="text-xs text-destructive space-y-1">
                                      {product.errors.slice(0, 2).map((error, idx) => (
                                        <div key={idx} className="flex items-start gap-1">
                                          <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                                          <span className="line-clamp-2">{error}</span>
                                        </div>
                                      ))}
                                      {product.errors.length > 2 && (
                                        <div className="text-xs">... et {product.errors.length - 2} autres</div>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <Badge variant="default" className="text-green-700 bg-green-50 text-xs">
                                    Valide
                                  </Badge>
                                )}
                              </TableCell>
                              {config.enableEdit && (
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditProduct(product)}
                                    disabled={!product.isValid}
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
                    <Button
                      variant="outline"
                      onClick={resetDialog}
                    >
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
                        onClick={() => handleImport(importedProducts.filter(p => p.isSelected && p.isValid))}
                        disabled={stats.selected === 0 || isProcessing}
                      >
                        Importer {stats.selected} produit{stats.selected !== 1 ? 's' : ''}
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
      />
    )}
    </>
  );
}
