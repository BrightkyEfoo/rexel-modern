export type AdditionalInfoSectionType = 'list' | 'text' | 'table' | 'steps' | 'warnings' | 'tips'

export interface AdditionalInfoItem {
  text: string
  icon?: string
  color?: 'success' | 'warning' | 'error' | 'info' | 'default'
}

export interface AdditionalInfoSection {
  type: AdditionalInfoSectionType
  title: string
  subtitle?: string
  items?: AdditionalInfoItem[]
  content?: string
  iconList?: string[]
  order: number
}

export interface ProductAdditionalInfo {
  title: string
  subtitle?: string
  sections: AdditionalInfoSection[]
}

// Exemples de structures prédéfinies
export const ADDITIONAL_INFO_TEMPLATES = {
  compatibility: {
    title: 'Compatibilité',
    subtitle: 'Informations sur la compatibilité du produit',
    sections: [
      {
        type: 'list' as const,
        title: 'Produits compatibles',
        subtitle: 'Ce produit est compatible avec les éléments suivants',
        items: [
          { text: 'Série A - Modèles 2020-2024', color: 'success' },
          { text: 'Série B - Tous modèles', color: 'success' },
          { text: 'Série C - Modèles Pro uniquement', color: 'success' },
          { text: 'Accessoires universels', color: 'success' }
        ],
        order: 1
      },
      {
        type: 'list' as const,
        title: 'Non compatible avec',
        subtitle: 'Ce produit n\'est pas compatible avec les éléments suivants',
        items: [
          { text: 'Anciens modèles (avant 2018)', color: 'error' },
          { text: 'Série D - Version basique', color: 'error' },
          { text: 'Systèmes propriétaires', color: 'error' }
        ],
        order: 2
      }
    ]
  },
  dosage: {
    title: 'Instructions de dosage',
    subtitle: 'Guide d\'utilisation et de dosage',
    sections: [
      {
        type: 'steps' as const,
        title: 'Étapes de préparation',
        items: [
          { text: 'Nettoyer la surface avant application', icon: 'clean' },
          { text: 'Appliquer une couche uniforme', icon: 'apply' },
          { text: 'Laisser sécher 24 heures', icon: 'time' },
          { text: 'Vérifier l\'adhérence', icon: 'check' }
        ],
        order: 1
      },
      {
        type: 'text' as const,
        title: 'Précautions d\'usage',
        content: 'Utiliser dans un endroit bien ventilé. Porter des gants de protection. Tenir hors de portée des enfants.',
        order: 2
      }
    ]
  },
  maintenance: {
    title: 'Entretien et maintenance',
    subtitle: 'Conseils pour maintenir le produit en bon état',
    sections: [
      {
        type: 'list' as const,
        title: 'Entretien régulier',
        items: [
          { text: 'Nettoyer avec un chiffon humide', color: 'info' },
          { text: 'Éviter les produits abrasifs', color: 'warning' },
          { text: 'Vérifier les fixations mensuellement', color: 'info' }
        ],
        order: 1
      },
      {
        type: 'warnings' as const,
        title: 'Points d\'attention',
        items: [
          { text: 'Ne pas exposer à des températures extrêmes', color: 'warning' },
          { text: 'Éviter l\'exposition directe au soleil', color: 'warning' }
        ],
        order: 2
      }
    ]
  }
} as const

export type TemplateKey = keyof typeof ADDITIONAL_INFO_TEMPLATES
