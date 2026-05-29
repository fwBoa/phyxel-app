import { createClient } from '@/lib/supabase/server'
import type { SpaceFilters, SpaceWithPhotos } from '@/types/spaces'

export async function getFeaturedSpaces(): Promise<SpaceWithPhotos[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('spaces')
    .select('*, space_photos(*)')
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .limit(3)
  if (error) throw error
  return (data ?? []) as SpaceWithPhotos[]
}

export async function getSpaces(filters?: SpaceFilters): Promise<SpaceWithPhotos[]> {
  const supabase = await createClient()
  let query = supabase.from('spaces').select('*, space_photos(*)')

  if (filters?.city)     query = query.eq('city', filters.city)
  if (filters?.type)     query = query.eq('type', filters.type)
  if (filters?.minPrice) query = query.gte('price_day', filters.minPrice)
  if (filters?.maxPrice) query = query.lte('price_day', filters.maxPrice)

  query = query.eq('is_available', true).order('created_at', { ascending: false })

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as SpaceWithPhotos[]
}

export async function getSpaceById(id: string): Promise<SpaceWithPhotos | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('spaces')
    .select('*, space_photos(*)')
    .eq('id', id)
    .single()
  if (error) return null
  return data as SpaceWithPhotos
}
