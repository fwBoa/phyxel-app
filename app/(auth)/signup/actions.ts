'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string
  const role = formData.get('role') as 'brand' | 'host'

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        role,
      },
    },
  })

  if (error) {
    return redirect('/signup?error=' + encodeURIComponent(error.message))
  }

  // The trigger handle_new_user will create the profile row automatically.
  // But we need to update it with the full_name and role since trigger only gets raw_user_meta_data.
  if (data.user) {
    await supabase.from('profiles').update({ full_name, role }).eq('id', data.user.id)
  }

  return redirect('/login?success=' + encodeURIComponent('Compte créé ! Vous pouvez vous connecter.'))
}
