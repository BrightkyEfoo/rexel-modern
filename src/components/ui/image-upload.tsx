"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { validateFile, MINIO_CONFIG } from "@/lib/config/minio";
import { useToast } from "@/hooks/use-toast";
import {
  uploadImagesWithProgress,
  validateImageFile,
  createPreviewUrl,
  revokePreviewUrl,
  type UploadedImage,
} from "@/lib/api/upload";

interface ImageUploadProps {
  value?: Array<{
    url: string;
    alt?: string;
    isMain?: boolean;
  }>;
  onChange: (
    images: Array<{
      url: string;
      alt?: string;
      isMain?: boolean;
    }>
  ) => void;
  maxImages?: number;
  className?: string;
  label?: string;
  maxSizeInMB?: number;
  
}

interface ImageWithPreview {
  url: string;
  alt?: string;
  isMain?: boolean;
  isUploaded?: boolean;
  file?: File;
  previewUrl?: string;
  label?: string;
  maxSizeInMB?: number;
  maxImages?: number;
}

export function ImageUpload({
  value = [],
  onChange,
  maxImages = 5,
  className,
  label = "Images du produit",
  maxSizeInMB = 5,
}: ImageUploadProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Vérifier le nombre maximum d'images
    if (value.length + files.length > maxImages) {
      toast({
        title: "Trop d'images",
        description: `Vous ne pouvez ajouter que ${maxImages} images maximum.`,
        variant: "destructive",
      });
      return;
    }

    // Valider tous les fichiers avant de commencer l'upload
    const validFiles: File[] = [];
    for (const file of files) {
      const validation = validateImageFile(file, maxSizeInMB);
      if (!validation.valid) {
        toast({
          title: "Fichier invalide",
          description: `${file.name}: ${validation.error}`,
          variant: "destructive",
        });
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload les fichiers vers le serveur
      const uploadedImages = await uploadImagesWithProgress(
        validFiles,
        (progress) => setUploadProgress(progress)
      );

      // Convertir en format attendu par le composant
      const newImages = uploadedImages.map((uploaded, index) => ({
        url: uploaded.url,
        alt: validFiles[index].name.split(".")[0], // Nom sans extension
        isMain: value.length === 0 && index === 0, // Premier fichier = image principale
      }));

      // Ajouter les nouvelles images
      onChange([...value, ...newImages]);

      toast({
        title: "Images uploadées",
        description: `${newImages.length} image(s) uploadée(s) avec succès.`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Erreur d'upload",
        description:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de l'upload des images.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Reset l'input file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    const imageToRemove = value[index];
    const newImages = value.filter((_, i) => i !== index);

    // Si on supprime l'image principale et qu'il reste des images, définir la première comme principale
    if (imageToRemove.isMain && newImages.length > 0) {
      newImages[0].isMain = true;
    }

    onChange(newImages);
  };

  const setMainImage = (index: number) => {
    const newImages = value.map((img, i) => ({
      ...img,
      isMain: i === index,
    }));
    onChange(newImages);
  };

  const updateAlt = (index: number, alt: string) => {
    const newImages = value.map((img, i) =>
      i === index ? { ...img, alt } : img
    );
    onChange(newImages);
  };

  return (
    <div className={className}>
      {/* Zone d'upload */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>{label}</Label>
          <Badge variant="outline">
            {value.length} / {maxImages}
          </Badge>
        </div>

        {/* Bouton d'upload */}
        <div
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <div className="space-y-2">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Upload en cours...
              </p>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Cliquez pour ajouter des images ou glissez-les ici
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, WebP jusqu'à {MINIO_CONFIG.maxFileSize / 1024 / 1024}
                MB
              </p>
            </div>
          )}
        </div>

        <Input
          ref={fileInputRef}
          type="file"
          multiple
          accept={MINIO_CONFIG.acceptedImageTypes.join(",")}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading || value.length >= maxImages}
        />
      </div>

      {/* Liste des images */}
      {value.length > 0 && (
        <div className="space-y-3 mt-6">
          <Label>Images ajoutées</Label>
          {value.map((image, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 border rounded-lg"
            >
              {/* Aperçu de l'image */}
              <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                {image.url ? (
                  <img
                    src={image.url}
                    alt={image.alt || `Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                )}
              </div>

              {/* Alt text */}
              <div className="flex-1">
                <Input
                  placeholder="Description de l'image"
                  value={image.alt || ""}
                  onChange={(e) => updateAlt(index, e.target.value)}
                  className="text-sm"
                />
              </div>

              {/* Boutons d'action */}
              {maxImages > 1 && <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={image.isMain ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMainImage(index)}
                >
                  {image.isMain ? "Principal" : "Définir principal"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeImage(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              }
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
