'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { loginAdmin } from '@/lib/admin/auth'
import { signAdminJwt } from '@/lib/admin/jwt'
import { setAdminCookie } from '@/lib/admin/session'

const Schema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(255),
  redirect: z.string().optional(),
})

export async function loginAdminAction(formData: FormData) {
  const parsed = Schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    redirect: formData.get('redirect') ?? undefined,
  })
  if (!parsed.success) {
    return { error: 'Email ou mot de passe invalide.' }
  }

  const { email, password } = parsed.data
  const admin = await loginAdmin(email, password)
  if (!admin) {
    return { error: 'Identifiants incorrects.' }
  }

  const token = await signAdminJwt(admin)
  await setAdminCookie(token)

  const dest =
    parsed.data.redirect && parsed.data.redirect.startsWith('/') && !parsed.data.redirect.startsWith('//')
      ? parsed.data.redirect
      : '/admin/espaces'

  redirect(dest)
}
