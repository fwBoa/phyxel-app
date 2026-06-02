'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin/auth'

export async function deleteSpaceAction(spaceId: string) {
  await requireAdmin()

  const supabase = createAdminClient()
  const { error } = await supabase.from('spaces').delete().eq('id', spaceId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/espaces')
}
