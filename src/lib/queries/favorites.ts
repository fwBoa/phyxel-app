import { createClient } from '@/lib/supabase/server'
import type { SpaceWithPhotos } from '@/types/spaces'

export type FavoriteWithSpace = {
  id:         string
  created_at: string
  spaces:     SpaceWithPhotos
}

export async function getFavoritesByUser(userId: string): Promise<FavoriteWithSpace[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('favorites')
    .select('id, created_at, spaces(*, space_photos(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as unknown as FavoriteWithSpace[]
}

export async function isSpaceFavorited(userId: string, spaceId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('space_id', spaceId)
    .maybeSingle()
  return !!data
}
