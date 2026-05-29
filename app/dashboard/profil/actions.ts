'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié.' }
  }

  const full_name = formData.get('full_name') as string
  const brand_name = formData.get('brand_name') as string
  const website = formData.get('website') as string
  const bio = formData.get('bio') as string

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: full_name || null,
      brand_name: brand_name || null,
      website: website || null,
      bio: bio || null,
    })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/profil')

  return { success: 'Profil mis à jour avec succès.' }
}
