// Configuration Minio pour le frontend
export const MINIO_CONFIG = {
  // URL publique du bucket
  publicBucketUrl: process.env.NEXT_PUBLIC_MINIO_BUCKET_URL || 'http://localhost:9000/rexel-public',
  
  // Taille maximale des fichiers (5MB)
  maxFileSize: 5 * 1024 * 1024, // 5MB en bytes
  
  // Types de fichiers acceptés
  acceptedImageTypes: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif'
  ],
  
  // Extensions acceptées
  acceptedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
};

/**
 * Valide si un fichier respecte les contraintes
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Vérifier la taille
  if (file.size > MINIO_CONFIG.maxFileSize) {
    return {
      valid: false,
      error: `Le fichier est trop volumineux. Taille maximale: ${MINIO_CONFIG.maxFileSize / 1024 / 1024}MB`
    };
  }
  
  // Vérifier le type
  if (!MINIO_CONFIG.acceptedImageTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Type de fichier non accepté. Types acceptés: ${MINIO_CONFIG.acceptedImageTypes.join(', ')}`
    };
  }
  
  return { valid: true };
}

/**
 * Génère une URL complète pour un chemin de fichier
 */
export function getFileUrl(path: string): string {
  if (path.startsWith('http')) {
    return path; // URL déjà complète
  }
  return `${MINIO_CONFIG.publicBucketUrl}/${path}`;
}
