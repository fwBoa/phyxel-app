'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function mapAuthError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'Email ou mot de passe incorrect.'
  if (msg.includes('Email not confirmed')) return 'Veuillez confirmer votre email avant de vous connecter.'
  if (msg.includes('Invalid email')) return 'Adresse email invalide.'
  return 'Une erreur est survenue. Veuillez réessayer.'
}

export async function login(formData: FormData) {
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()

  if (!email || !password) {
    return redirect('/login?error=' + encodeURIComponent('Email et mot de passe requis.'))
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return redirect('/login?error=' + encodeURIComponent(mapAuthError(error.message)))
  }

  return redirect('/dashboard')
}
