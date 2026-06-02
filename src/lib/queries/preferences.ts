import { createClient } from '@/lib/supabase/server'
import type { BrandPreferenceRow } from '@/types/database'

export async function getBrandPreferences(userId: string): Promise<BrandPreferenceRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('brand_preferences')
    .select('*')
    .eq('profile_id', userId)
    .maybeSingle()

  if (error || !data) return null
  return data
}
