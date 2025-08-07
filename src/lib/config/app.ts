export const appConfig = {
  // Informations de base
  name: 'KesiMarket',
  fullName: 'KESI I MARKET',
  country: 'Cameroun',
  countryCode: 'CM',
  phoneCode: '+237',
  
  // Informations de contact
  contact: {
    phone: '+237 6 12 34 56 78',
    email: 'contact@kesimarket.cm',
    supportEmail: 'support@kesimarket.cm',
    address: '123 Avenue de l\'Indépendance, Douala, Cameroun',
  },
  
  // Réseaux sociaux
  social: {
    facebook: 'https://facebook.com/kesimarket',
    instagram: 'https://instagram.com/kesimarket',
    twitter: 'https://twitter.com/kesimarket',
    linkedin: 'https://linkedin.com/company/kesimarket',
  },
  
  // Métadonnées SEO
  seo: {
    title: 'KesiMarket | Distribution de matériel énergétique au Cameroun',
    description: 'Leader de la distribution professionnelle de produits et services pour le monde de l\'énergie au Cameroun. Une expérience d\'achat moderne et simplifiée.',
    keywords: 'matériel électrique, Cameroun, KesiMarket, distribution électrique, éclairage, câbles, appareillage, énergie',
  },
  
  // Couleurs de la marque
  colors: {
    primary: '#f2750a', // Orange KESI
    secondary: '#22c55e', // Vert lime KESI
    white: '#ffffff',
  },
  
  // Points de relais
  relayPoints: [
    {
      id: 1,
      name: 'Point Relais KesiMarket - Douala Centre',
      address: '123 Avenue de l\'Indépendance, Douala, Cameroun',
      phone: '+237 6 12 34 56 78',
      email: 'douala-centre@kesimarket.cm',
      hours: 'Lun-Ven: 8h-18h, Sam: 9h-17h',
      services: ['Retrait', 'Dépôt', 'Conseil'],
      distance: '0.5 km',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Point Relais KesiMarket - Yaoundé Central',
      address: '456 Boulevard de l\'Unité, Yaoundé, Cameroun',
      phone: '+237 6 78 90 12 34',
      email: 'yaounde-central@kesimarket.cm',
      hours: 'Lun-Ven: 8h30-18h30, Sam: 9h-17h30',
      services: ['Retrait', 'Dépôt', 'Installation'],
      distance: '1.2 km',
      rating: 4.6,
    },
    {
      id: 3,
      name: 'Point Relais KesiMarket - Bafoussam',
      address: '789 Rue du Marché, Bafoussam, Cameroun',
      phone: '+237 6 34 56 78 90',
      email: 'bafoussam@kesimarket.cm',
      hours: 'Lun-Ven: 8h-19h, Sam: 9h-18h',
      services: ['Retrait', 'Dépôt', 'Formation'],
      distance: '0.8 km',
      rating: 4.7,
    },
    {
      id: 4,
      name: 'Point Relais KesiMarket - Garoua',
      address: '321 Avenue du Nord, Garoua, Cameroun',
      phone: '+237 6 90 12 34 56',
      email: 'garoua@kesimarket.cm',
      hours: 'Lun-Ven: 8h-18h, Sam: 9h-17h',
      services: ['Retrait', 'Dépôt', 'Conseil'],
      distance: '1.5 km',
      rating: 4.9,
    },
  ],
  
  // Horaires d'ouverture
  businessHours: {
    monday: '8h-18h',
    tuesday: '8h-18h',
    wednesday: '8h-18h',
    thursday: '8h-18h',
    friday: '8h-18h',
    saturday: '9h-17h',
    sunday: 'Fermé',
  },
  
  // Services proposés
  services: [
    'Distribution de matériel électrique',
    'Éclairage professionnel',
    'Câbles et connexions',
    'Appareillage électrique',
    'Tableaux électriques',
    'Interrupteurs et prises',
    'Disjoncteurs et fusibles',
    'Matériel de sécurité',
    'Équipements industriels',
    'Solutions d\'énergie renouvelable',
    'Formation technique',
    'Service après-vente',
  ],
} as const;

export type AppConfig = typeof appConfig; 