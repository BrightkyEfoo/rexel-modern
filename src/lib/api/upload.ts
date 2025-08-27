import { nextAuthApiClient } from './nextauth-client';

export interface UploadedImage {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}



/**
 * Upload une seule image vers le serveur
 */
export async function uploadSingleImage(file: File): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await nextAuthApiClient.post<{ url: string; filename: string }>('/secured/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return {
    url: response.data.url,
    filename: response.data.filename,
    size: file.size,
    mimeType: file.type,
  };
}

/**
 * Upload plusieurs images vers le serveur
 */
export async function uploadMultipleImages(files: File[]): Promise<UploadedImage[]> {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('images', file);
  });

  const response = await nextAuthApiClient.post<{ uploaded: UploadedImage[] }>('/secured/upload/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.uploaded;
}

/**
 * Supprime une image du serveur
 */
export async function deleteImage(filename: string): Promise<void> {
  await nextAuthApiClient.delete('/secured/upload/image', {
    data: { filename }
  });
}

/**
 * Upload progressive avec callback de progression
 */
export async function uploadImagesWithProgress(
  files: File[],
  onProgress?: (progress: number) => void
): Promise<UploadedImage[]> {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('images', file);
  });

  try {
    const response = await nextAuthApiClient.post<{ uploaded: UploadedImage[] }>(
      '/secured/upload/images',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: any) => {
          if (progressEvent.total && onProgress) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            onProgress(Math.round(progress));
          }
        },
      }
    );

    return response.data.uploaded;
  } catch (error: any) {
    console.error('Erreur upload:', error);
    throw new Error(error.response?.data?.message || 'Erreur lors de l\'upload');
  }
}

/**
 * Valide un fichier avant upload
 */
export function validateImageFile(file: File, maxSizeInMB: number = 5): { valid: boolean; error?: string } {
  // Vérifier la taille (5MB max)
  const maxSize = maxSizeInMB * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Le fichier est trop volumineux. Taille maximale: 5MB`
    };
  }
  
  // Vérifier le type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Type de fichier non supporté. Types acceptés: ${allowedTypes.join(', ')}`
    };
  }
  
  return { valid: true };
}

/**
 * Convertit un fichier en URL temporaire pour prévisualisation
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Libère une URL temporaire
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}
