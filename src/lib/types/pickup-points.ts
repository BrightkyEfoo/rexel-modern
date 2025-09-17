export interface PickupPoint {
  id: number;
  name: string;
  slug: string;
  address: string;
  city: string;
  postalCode?: string;
  phone: string;
  email: string;
  hours: string;
  services: string[];
  latitude?: number;
  longitude?: number;
  rating: number;
  reviewsCount: number;
  isActive: boolean;
  description?: string;
  managerName?: string;
  managerPhone?: string;
  managerPhoto?: string;
  countryCode?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  
  // Computed properties
  distance?: string; // Will be calculated based on user location
}

export interface PickupPointsResponse {
  data: PickupPoint[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  message: string;
  status: number;
  timestamp: string;
}

export interface PickupPointFilters {
  search?: string;
  city?: string;
  isActive?: boolean;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface CreatePickupPointData {
  name: string;
  address: string;
  city: string;
  postalCode?: string;
  phone: string;
  email: string;
  hours: string;
  services: string[];
  latitude?: number;
  longitude?: number;
  description?: string;
  managerName?: string;
  managerPhone?: string;
  managerPhoto?: string;
  countryCode?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdatePickupPointData extends Partial<CreatePickupPointData> {
  id: number;
}

// Manager pour chaque pays
export interface CountryManager {
  id: number;
  countryCode: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  pickupPointId?: number; // Point de relais associé au manager
  createdAt: string;
  updatedAt: string;
}

export interface CountryManagerResponse {
  data: CountryManager;
}

export interface CountryPickupPointsResponse {
  manager: CountryManager;
  pickupPoints: PickupPoint[];
}

export interface PickupPointStats {
  total: number;
  active: number;
  cities: number;
  avgRating: number;
}
