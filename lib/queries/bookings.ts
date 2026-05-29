import { createClient } from '@/lib/supabase/server'

export type BookingWithSpace = {
  id: string
  start_date: string
  end_date: string
  status: 'pending' | 'confirmed' | 'cancelled'
  total_price: number | null
  created_at: string
  space: {
    id: string
    title: string
    city: string
    district: string | null
    price_day: number
  } | null
}

export async function getMyBookings(): Promise<BookingWithSpace[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      start_date,
      end_date,
      status,
      total_price,
      created_at,
      spaces!bookings_space_id_fkey (
        id,
        title,
        city,
        district,
        price_day
      )
    `)
    .eq('brand_id', user.id)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data.map((b: any) => ({
    id: b.id,
    start_date: b.start_date,
    end_date: b.end_date,
    status: b.status,
    total_price: b.total_price,
    created_at: b.created_at,
    space: b.spaces,
  }))
}

export async function getHostBookings(): Promise<BookingWithSpace[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  // Get all spaces owned by this host
  const { data: spaces } = await supabase
    .from('spaces')
    .select('id')
    .eq('host_id', user.id)

  if (!spaces || spaces.length === 0) return []

  const spaceIds = spaces.map((s) => s.id)

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      start_date,
      end_date,
      status,
      total_price,
      created_at,
      brand_id,
      spaces!bookings_space_id_fkey (
        id,
        title,
        city,
        district,
        price_day
      )
    `)
    .in('space_id', spaceIds)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data.map((b: any) => ({
    id: b.id,
    start_date: b.start_date,
    end_date: b.end_date,
    status: b.status,
    total_price: b.total_price,
    created_at: b.created_at,
    space: b.spaces,
  }))
}
