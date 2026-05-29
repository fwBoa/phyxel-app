import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/users'
import type { BookingWithSpace } from '@/types/spaces'

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getProfile(id: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function getBookingsByUser(userId: string): Promise<BookingWithSpace[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*, spaces(*, space_photos(*))')
    .eq('brand_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as BookingWithSpace[]
}
