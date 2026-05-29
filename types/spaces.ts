import type { Database } from './database'

export type Space = Database['public']['Tables']['spaces']['Row']
export type SpacePhoto = Database['public']['Tables']['space_photos']['Row']

export type SpaceWithPhotos = Space & {
  space_photos: SpacePhoto[]
}

export type SpaceCardData = {
  id:          string
  title:       string
  type:        string
  city:        string
  district:    string | null
  priceDay:    number | null
  areaSqm:     number | null
  matchScore:  number
  isAvailable: boolean
  coverUrl:    string
}
