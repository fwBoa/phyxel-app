import type { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']

export type BookingWithSpace = Booking & {
  spaces: {
    title: string
    city:  string
    type:  string
  }
}
