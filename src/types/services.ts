// Types de catégorie de service
export type ServiceCategory =
  | 'solutions-techniques'
  | 'rh-formation'
  | 'accompagnement-conseil'
  | 'energie-renouvelable';

// Interface pour une fonctionnalité de service
export interface ServiceFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  included: boolean;
}

// Interface pour un plan tarifaire
export interface ServicePricing {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

// Interface pour un témoignage
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

// Interface pour un élément de galerie
export interface ServiceGalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title: string;
  description?: string;
  alt?: string;
}

// Interface pour une FAQ
export interface ServiceFAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

// Interface pour un contact
export interface ServiceContact {
  name: string;
  title: string;
  phone: string;
  email: string;
  avatar?: string;
  specialties: string[];
}

// Interface pour la disponibilité
export interface ServiceAvailability {
  workingDays: string[];
  workingHours: string;
  emergencyAvailable: boolean;
  bookingRequired: boolean;
  leadTime: string;
}

// Interface principale pour un service
export interface Service {
  id: string | number;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: ServiceCategory;
  groupName?: string;
  groupOrder?: number;
  status: 'active' | 'inactive' | 'coming_soon';
  type: 'primary' | 'complementary';

  // Visuel
  icon?: string;
  color?: string;
  heroImage?: string;
  heroVideo?: string;

  // Contenu
  features: string[] | ServiceFeature[];
  benefits?: string[];

  // Tarification
  pricing?: string;
  pricingPlans?: ServicePricing[];

  // Galerie
  gallery?: ServiceGalleryItem[];

  // Témoignages
  testimonials?: ServiceTestimonial[];

  // FAQ
  faqs?: ServiceFAQ[];

  // Contact
  contacts?: ServiceContact[];

  // Couverture
  coverageAreas?: string[];

  // Disponibilité
  availability?: ServiceAvailability;

  // Certifications et garanties
  certifications?: string[];
  warranties?: string[];

  // SEO
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];

  // CTA
  href?: string;
  ctaText?: string;
  ctaLink?: string;
  showBookingForm?: boolean;
  showQuoteForm?: boolean;

  // Métadonnées
  popular?: boolean;
  isPromoted?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Interface pour un groupe de services
export interface ServiceGroup {
  slug: ServiceCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  services: Service[];
}

// Interface pour une demande de réservation
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

// Interface pour une demande de devis
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

// Constantes pour les 10 services KesiMarket
export const KESIMARKET_SERVICES = {
  // Groupe 1: Solutions Techniques
  EQUIP_PRET: 'equip-pret',
  PLANEX: 'planex',
  FIX_AND_GO: 'fix-and-go',
  EQUILOC: 'equiloc',
  // Groupe 2: Ressources Humaines & Formation
  PROTECHRH: 'protechrh',
  TALENT_FORM: 'talent-form',
  // Groupe 3: Accompagnement & Conseil
  PERFECO: 'perfeco',
  CONTRACTIS: 'contractis',
  SURVEYTECH: 'surveytech',
  // Groupe 4: Énergie Renouvelable
  SOLARTECH: 'solartech',
} as const;

export type KesiMarketServiceType = typeof KESIMARKET_SERVICES[keyof typeof KESIMARKET_SERVICES];

// Métadonnées des groupes de services
export const SERVICE_GROUPS: Record<ServiceCategory, { name: string; description: string; icon: string; color: string }> = {
  'solutions-techniques': {
    name: 'Solutions Techniques',
    description: 'Des solutions clé en main pour vos projets électriques',
    icon: 'settings',
    color: '#3B82F6'
  },
  'rh-formation': {
    name: 'Ressources Humaines & Formation',
    description: 'Développez vos compétences et trouvez les bons profils',
    icon: 'users',
    color: '#EC4899'
  },
  'accompagnement-conseil': {
    name: 'Accompagnement & Conseil',
    description: 'Un accompagnement expert pour vos projets',
    icon: 'handshake',
    color: '#14B8A6'
  },
  'energie-renouvelable': {
    name: 'Énergie Renouvelable',
    description: 'Passez à l\'énergie verte avec nos solutions solaires',
    icon: 'sun',
    color: '#FBBF24'
  }
};

// Liste ordonnée des catégories
export const SERVICE_CATEGORIES_ORDER: ServiceCategory[] = [
  'solutions-techniques',
  'rh-formation',
  'accompagnement-conseil',
  'energie-renouvelable'
];
