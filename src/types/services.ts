export interface ServiceFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  included: boolean;
}

export interface ServicePricing {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface ServiceTestimonial {
  id: string;
  customerName: string;
  customerTitle?: string;
  customerCompany?: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface ServiceGalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title: string;
  description?: string;
  alt?: string;
}

export interface ServiceFAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface ServiceContact {
  name: string;
  title: string;
  phone: string;
  email: string;
  avatar?: string;
  specialties: string[];
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: 'base' | 'premium' | 'custom';
  status: 'active' | 'inactive' | 'coming_soon';
  
  // Contenu principal
  heroImage?: string;
  heroVideo?: string;
  features: ServiceFeature[];
  benefits: string[];
  
  // Tarification
  pricing: ServicePricing[];
  
  // Galerie
  gallery: ServiceGalleryItem[];
  
  // Témoignages
  testimonials: ServiceTestimonial[];
  
  // FAQ
  faqs: ServiceFAQ[];
  
  // Contact
  contacts: ServiceContact[];
  
  // Zones de couverture
  coverageAreas: string[];
  
  // Délais et disponibilité
  availability: {
    workingDays: string[];
    workingHours: string;
    emergencyAvailable: boolean;
    bookingRequired: boolean;
    leadTime: string;
  };
  
  // Certifications et garanties
  certifications: string[];
  warranties: string[];
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  
  // Métadonnées
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isPromoted: boolean;
  sortOrder: number;
  
  // Relations
  relatedServices: string[];
  requiredEquipment?: string[];
  
  // Call to action
  ctaText?: string;
  ctaLink?: string;
  showBookingForm: boolean;
  showQuoteForm: boolean;
}

export interface ServiceBooking {
  id: string;
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  estimatedPrice?: number;
  actualPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceQuote {
  id: string;
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany?: string;
  projectDescription: string;
  budget?: number;
  timeline?: string;
  attachments?: string[];
  status: 'pending' | 'in_review' | 'quoted' | 'accepted' | 'rejected';
  quotedPrice?: number;
  quotedDetails?: string;
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
}

// Services de base prédéfinis
export const BASE_SERVICES = {
  DELIVERY: 'livraison',
  INSTALLATION: 'installation', 
  TRAINING: 'formation',
  CONSULTING: 'conseil'
} as const;

export type BaseServiceType = typeof BASE_SERVICES[keyof typeof BASE_SERVICES];
