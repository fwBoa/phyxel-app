// Types du wizard d'onboarding — 5 étapes

export interface OnboardingData {
  // Step 1 — Infos marque
  sector: string
  productTypes: string[]
  mainCity: string
  companySize: string
  approxBudget: string

  // Step 2 — Objectifs physiques
  physicalObjectives: string[]

  // Step 3 — Besoins du lieu
  targetCity: string
  desiredDuration: string
  spaceTypes: string[]
  desiredArea: string
  neededServices: string[]

  // Step 4 — Préférences
  maxBudget: string
  preferredDistricts: string[]
  desiredAmbiance: string[]
  idealDates: string
}

export const ONBOARDING_STEPS = [
  { id: 1, label: 'Infos marque' },
  { id: 2, label: 'Objectifs physiques' },
  { id: 3, label: 'Besoins du lieu' },
  { id: 4, label: 'Préférences' },
  { id: 5, label: 'Résumé' },
] as const

export type StepId = (typeof ONBOARDING_STEPS)[number]['id']

// Valeurs par défaut
export const EMPTY_ONBOARDING_DATA: OnboardingData = {
  sector: '',
  productTypes: [],
  mainCity: '',
  companySize: '',
  approxBudget: '',

  physicalObjectives: [],

  targetCity: '',
  desiredDuration: '',
  spaceTypes: [],
  desiredArea: '',
  neededServices: [],

  maxBudget: '',
  preferredDistricts: [],
  desiredAmbiance: [],
  idealDates: '',
}

// Options des champs multi-select / select

export const SECTOR_OPTIONS = [
  'Mode',
  'Cosmétiques & Beauté',
  'Tech & Électronique',
  'Food & Boissons',
  'Maison & Déco',
  'Sport & Outdoor',
  'Jouets & Enfants',
  'Livres & Papeterie',
  'Autre',
]

export const COMPANY_SIZE_OPTIONS = [
  '1-5 employés',
  '6-20 employés',
  '21-50 employés',
  '51-200 employés',
  '200+ employés',
]

export const APPROX_BUDGET_OPTIONS = [
  '< 5 000 €',
  '5 000 € — 15 000 €',
  '15 000 € — 50 000 €',
  '50 000 € — 150 000 €',
  '150 000 € +',
]

export const PHYSICAL_OBJECTIVES_OPTIONS = [
  'Tester les produits',
  'Rassurer les clients',
  'Créer un événement',
  'Lancer une collection',
  'Vendre en physique',
  'Rencontrer sa communauté',
]

export const DURATION_OPTIONS = [
  '1 jour',
  '1 week-end',
  '1 semaine',
  '2-4 semaines',
  '1-3 mois',
  '3+ mois',
]

export const SPACE_TYPE_OPTIONS = [
  'Pop-up store',
  'Showroom',
  'Corner',
  'Boutique éphémère',
  'Événementiel',
]

export const AREA_OPTIONS = [
  '< 20 m²',
  '20-50 m²',
  '50-100 m²',
  '100-200 m²',
  '200 m² +',
]

export const SERVICES_OPTIONS = [
  'Mobilier',
  'Éclairage',
  'Caisses / POS',
  'Wi-Fi',
  'Fitting room',
  'Stockage',
  'Accès handicapé',
  'Cuisine / Bar',
]

export const MAX_BUDGET_OPTIONS = [
  '< 2 000 €',
  '2 000 € — 5 000 €',
  '5 000 € — 10 000 €',
  '10 000 € — 30 000 €',
  '30 000 € +',
]

export const DISTRICT_OPTIONS = [
  'Marais',
  'Saint-Germain',
  'Montmartre',
  'Champs-Élysées',
  'Opéra / Grands Boulevards',
  'Bastille',
  'Canal Saint-Martin',
  'République',
  'Bourse / Sentier',
  'Nation',
]

export const AMBIANCE_OPTIONS = [
  'Premium',
  'Industriel',
  'Minimaliste',
  'Cosy',
  'Artistique',
  'Naturel',
  'Tech',
]
