'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function mapAuthError(msg: string): string {
  if (msg.includes('already registered')) return 'Cet email est déjà utilisé.'
  if (msg.includes('Invalid email')) return 'Adresse email invalide.'
  if (msg.includes('password')) return 'Mot de passe trop faible. Minimum 6 caractères.'
  return 'Une erreur est survenue. Veuillez réessayer.'
}

export async function signup(formData: FormData) {
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()
  const full_name = formData.get('full_name')?.toString()
  const role = formData.get('role')?.toString() as 'brand' | 'host'

  if (!email || !password || !full_name || !role) {
    return redirect('/signup?error=' + encodeURIComponent('Tous les champs sont requis.'))
  }

  if (password.length < 6) {
    return redirect('/signup?error=' + encodeURIComponent('Le mot de passe doit faire au moins 6 caractères.'))
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, role },
    },
  })

  if (error) {
    return redirect('/signup?error=' + encodeURIComponent(mapAuthError(error.message)))
  }

  if (data.user) {
    await supabase.from('profiles').update({ full_name, role }).eq('id', data.user.id)
  }

  return redirect('/login?success=' + encodeURIComponent('Compte créé ! Vous pouvez vous connecter.'))
}
