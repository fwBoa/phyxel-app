'use server'

import { redirect } from 'next/navigation'
import { loginAdmin } from '@/lib/admin/auth'
import { signAdminJwt } from '@/lib/admin/jwt'
import { setAdminCookie } from '@/lib/admin/session'

export async function loginAdminAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const redirectTo = String(formData.get('redirect') ?? '')

  if (!email.includes('@') || !password) {
    return { error: 'Email ou mot de passe invalide.' }
  }

  const admin = await loginAdmin(email, password)
  if (!admin) {
    return { error: 'Identifiants incorrects.' }
  }

  const token = await signAdminJwt(admin)
  await setAdminCookie(token)

  const dest =
    redirectTo.startsWith('/') && !redirectTo.startsWith('//')
      ? redirectTo
      : '/admin/espaces'

  redirect(dest)
}
