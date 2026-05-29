import type {
  SpaceRow, SpaceInsertRow, SpaceUpdateRow,
  SpacePhotoRow, SpacePhotoInsertRow,
  BookingRow, BookingInsertRow, BookingUpdateRow,
  ProfileRow,
} from './database'
import type { SpaceType, City, BookingStatus } from '@/constants/spaces'

export type Space        = SpaceRow
export type SpaceInsert  = SpaceInsertRow
export type SpaceUpdate  = SpaceUpdateRow

export type SpacePhoto        = SpacePhotoRow
export type SpacePhotoInsert  = SpacePhotoInsertRow

export type Booking       = BookingRow
export type BookingInsert = BookingInsertRow
export type BookingUpdate = BookingUpdateRow

export type SpaceWithPhotos = Space & {
  space_photos: SpacePhoto[]
}

export type SpaceWithDetails = SpaceWithPhotos & {
  profiles: ProfileRow
}

export type BookingWithSpace = Booking & {
  spaces: SpaceWithPhotos
}

export type SpaceFilters = {
  city?:      City
  type?:      SpaceType
  startDate?: string
  endDate?:   string
  minPrice?:  number
  maxPrice?:  number
}

export type { SpaceType, City, BookingStatus }
