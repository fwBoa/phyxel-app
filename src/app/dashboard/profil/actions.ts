'use server'

import { createClient } from '@/lib/supabase/server'

export async function getPreferences() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('brand_preferences')
    .select('*')
    .eq('profile_id', user.id)
    .maybeSingle()

  if (error || !data) return null
  return data
}
