import { createServerClient } from '@/lib/supabase/server'

export async function getProfile(userId: string) {
  const supabase = await createServerClient()
  return supabase.from('profiles').select('*').eq('id', userId).single()
}

export async function getBookingsForUser(userId: string, role: 'brand' | 'host') {
  const supabase = await createServerClient()
  const field = role === 'brand' ? 'brand_id' : 'space_id'

  if (role === 'brand') {
    return supabase
      .from('bookings')
      .select('*, spaces(title, city, type)')
      .eq('brand_id', userId)
      .order('created_at', { ascending: false })
  }

  return supabase
    .from('bookings')
    .select('*, spaces!inner(title, city, type, host_id)')
    .eq('spaces.host_id', userId)
    .order('created_at', { ascending: false })
}
