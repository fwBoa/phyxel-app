import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils/slugify'

export type SpaceWithPhotos = {
  id: string
  title: string
  slug: string
  type: string
  city: string
  district: string | null
  price_day: number
  area_sqm: number | null
  description: string | null
  is_available: boolean
  photos: { url: string; is_cover: boolean }[]
}

export async function getFeaturedSpaces(limit = 3): Promise<SpaceWithPhotos[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('spaces')
    .select(`
      id,
      title,
      type,
      city,
      district,
      price_day,
      area_sqm,
      description,
      is_available,
      space_photos (url, is_cover)
    `)
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []

  return data.map((space: any) => ({
    id: space.id,
    title: space.title,
    slug: slugify(space.title),
    type: space.type,
    city: space.city,
    district: space.district,
    price_day: space.price_day,
    area_sqm: space.area_sqm,
    description: space.description,
    is_available: space.is_available,
    photos: space.space_photos || [],
  }))
}

export type SpacesResult = {
  spaces: SpaceWithPhotos[]
  total: number
  page: number
  limit: number
}

export async function getAllSpaces(
  filters?: {
    city?: string
    type?: string
    minPrice?: number
    maxPrice?: number
    page?: number
    limit?: number
  }
): Promise<SpacesResult> {
  const supabase = await createClient()
  const page = Math.max(1, filters?.page || 1)
  const limit = Math.max(1, Math.min(50, filters?.limit || 12))
  const offset = (page - 1) * limit

  let query = supabase
    .from('spaces')
    .select(`
      id,
      title,
      type,
      city,
      district,
      price_day,
      area_sqm,
      description,
      is_available,
      space_photos (url, is_cover)
    `, { count: 'exact' })
    .eq('is_available', true)

  if (filters?.city) {
    query = query.eq('city', filters.city)
  }
  if (filters?.type) {
    query = query.eq('type', filters.type as 'showroom' | 'popup' | 'corner' | 'gallery' | 'boutique')
  }
  if (filters?.minPrice !== undefined) {
    query = query.gte('price_day', filters.minPrice)
  }
  if (filters?.maxPrice !== undefined) {
    query = query.lte('price_day', filters.maxPrice)
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error || !data) {
    return { spaces: [], total: 0, page, limit }
  }

  const spaces = data.map((space: any) => ({
    id: space.id,
    title: space.title,
    slug: slugify(space.title),
    type: space.type,
    city: space.city,
    district: space.district,
    price_day: space.price_day,
    area_sqm: space.area_sqm,
    description: space.description,
    is_available: space.is_available,
    photos: space.space_photos || [],
  }))

  return { spaces, total: count || 0, page, limit }
}

export async function getSpaceById(id: string): Promise<SpaceWithPhotos | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('spaces')
    .select(`
      id,
      title,
      type,
      city,
      district,
      address,
      price_day,
      area_sqm,
      description,
      is_available,
      host_id,
      space_photos (url, is_cover),
      profiles!spaces_host_id_fkey (full_name, brand_name)
    `)
    .eq('id', id)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    title: data.title,
    slug: slugify(data.title),
    type: data.type,
    city: data.city,
    district: data.district,
    price_day: data.price_day,
    area_sqm: data.area_sqm,
    description: data.description,
    is_available: data.is_available,
    photos: data.space_photos || [],
  }
}

export async function getSpaceCities(): Promise<string[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('spaces')
    .select('city')
    .eq('is_available', true)

  if (error || !data) return []

  const cities = [...new Set(data.map((s: any) => s.city))]
  return cities.sort()
}
