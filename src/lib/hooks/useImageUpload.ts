"use client";

import { useState } from "react";
import { uploadImagesWithProgress, type UploadedImage } from "@/lib/api/upload";
import { useToast } from "@/hooks/use-toast";

export interface ImageData {
  url: string;
  alt?: string;
  isMain?: boolean;
}

export interface UseImageUploadReturn {
  uploadImages: (files: File[]) => Promise<ImageData[]>;
  isUploading: boolean;
  uploadProgress: number;
  uploadedImages: ImageData[];
  setUploadedImages: (images: ImageData[]) => void;
  addImages: (images: ImageData[]) => void;
  removeImage: (index: number) => void;
  setMainImage: (index: number) => void;
}

/**
 * Hook pour gérer l'upload d'images avec état local
 */
export function useImageUpload(initialImages: ImageData[] = []): UseImageUploadReturn {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<ImageData[]>(initialImages);

  const uploadImages = async (files: File[]): Promise<ImageData[]> => {
    if (files.length === 0) return [];

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload vers le serveur
      const uploadedFiles = await uploadImagesWithProgress(
        files,
        (progress) => setUploadProgress(progress)
      );

      // Convertir en format ImageData
      const newImages: ImageData[] = uploadedFiles.map((uploaded, index) => ({
        url: uploaded.url,
        alt: files[index].name.split('.')[0], // Nom sans extension
        isMain: uploadedImages.length === 0 && index === 0, // Premier si aucune image
      }));

      // Ajouter aux images existantes
      const allImages = [...uploadedImages, ...newImages];
      setUploadedImages(allImages);

      toast({
        title: "Images uploadées",
        description: `${newImages.length} image(s) uploadée(s) avec succès.`,
      });

      return newImages;

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erreur d'upload",
        description: error instanceof Error ? error.message : "Erreur lors de l'upload des images.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const addImages = (images: ImageData[]) => {
    setUploadedImages([...uploadedImages, ...images]);
  };

  const removeImage = (index: number) => {
    const imageToRemove = uploadedImages[index];
    const newImages = uploadedImages.filter((_, i) => i !== index);
    
    // Si on supprime l'image principale et qu'il reste des images, définir la première comme principale
    if (imageToRemove.isMain && newImages.length > 0) {
      newImages[0].isMain = true;
    }
    
    setUploadedImages(newImages);
  };

  const setMainImage = (index: number) => {
    const newImages = uploadedImages.map((img, i) => ({
      ...img,
      isMain: i === index,
    }));
    setUploadedImages(newImages);
  };

  return {
    uploadImages,
    isUploading,
    uploadProgress,
    uploadedImages,
    setUploadedImages,
    addImages,
    removeImage,
    setMainImage,
  };
}

/**
 * Hook simplifié pour upload synchrone (attend que tous les fichiers soient uploadés)
 */
export function useImageUploadSync() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadAndWait = async (files: File[]): Promise<ImageData[]> => {
    if (files.length === 0) return [];

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedFiles = await uploadImagesWithProgress(
        files,
        (progress) => setUploadProgress(progress)
      );

      const images: ImageData[] = uploadedFiles.map((uploaded, index) => ({
        url: uploaded.url,
        alt: files[index].name.split('.')[0],
        isMain: index === 0,
      }));

      return images;

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erreur d'upload",
        description: error instanceof Error ? error.message : "Erreur lors de l'upload des images.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadAndWait,
    isUploading,
    uploadProgress,
  };
}
