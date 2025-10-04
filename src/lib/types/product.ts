/**
 * Statut de validation d'un produit
 */
export enum ProductStatus {
  /** Brouillon - Produit en cours de création */
  DRAFT = 'draft',
  
  /** En attente - Produit soumis pour validation */
  PENDING = 'pending',
  
  /** Approuvé - Produit validé par un admin */
  APPROVED = 'approved',
  
  /** Rejeté - Produit refusé par un admin */
  REJECTED = 'rejected',
}

/**
 * Type d'activité sur un produit
 */
export enum ProductActivityType {
  /** Création du produit */
  CREATE = 'create',
  
  /** Modification du produit */
  UPDATE = 'update',
  
  /** Soumission pour validation */
  SUBMIT = 'submit',
  
  /** Approbation par admin */
  APPROVE = 'approve',
  
  /** Rejet par admin */
  REJECT = 'reject',
}

/**
 * Activité sur un produit
 */
export interface ProductActivity {
  id: number
  productId: number
  activityType: ProductActivityType
  userId: number
  oldStatus: ProductStatus | null
  newStatus: ProductStatus | null
  description: string | null
  metadata: Record<string, any> | null
  createdAt: string
  user?: {
    id: number
    firstName: string
    lastName: string
    email: string
    type: string
  }
}

