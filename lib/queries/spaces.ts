import { createServerClient } from '@/lib/supabase/server'

export async function getFeaturedSpaces() {
  const supabase = await createServerClient()
  return supabase
    .from('spaces')
    .select('*, space_photos(*)')
    .eq('is_available', true)
    .limit(3)
}

export async function getSpaces(filters?: {
  city?: string
  type?: string
  maxPrice?: number
}) {
  const supabase = await createServerClient()
  let query = supabase
    .from('spaces')
    .select('*, space_photos(*)')
    .eq('is_available', true)

  if (filters?.city) query = query.eq('city', filters.city)
  if (filters?.type) query = query.eq('type', filters.type)
  if (filters?.maxPrice) query = query.lte('price_day', filters.maxPrice)

  return query.order('created_at', { ascending: false })
}

export async function getSpaceById(id: string) {
  const supabase = await createServerClient()
  return supabase
    .from('spaces')
    .select('*, space_photos(*)')
    .eq('id', id)
    .single()
}
