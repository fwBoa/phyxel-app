export const SPACE_TYPES = [
  { value: 'showroom',  label: 'Showroom' },
  { value: 'popup',     label: 'Pop-up' },
  { value: 'corner',    label: 'Corner' },
  { value: 'gallery',   label: 'Galerie' },
  { value: 'boutique',  label: 'Boutique' },
] as const

export type SpaceType = (typeof SPACE_TYPES)[number]['value']

export const CITIES = [
  'Paris',
  'Lyon',
  'Marseille',
  'Bordeaux',
  'Lille',
  'Nantes',
  'Toulouse',
  'Strasbourg',
  'Nice',
  'Rennes',
  'Montpellier',
  'Grenoble',
] as const

export type City = (typeof CITIES)[number]

export const BOOKING_STATUSES = {
  pending:   'En attente',
  confirmed: 'Confirmée',
  cancelled: 'Annulée',
} as const

export type BookingStatus = keyof typeof BOOKING_STATUSES
