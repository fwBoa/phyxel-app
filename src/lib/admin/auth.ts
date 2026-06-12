// Authentification admin — JWT signé (HS256) + cookie httpOnly
// Indépendant de Supabase Auth : un admin n'a pas de compte dans auth.users.

import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { createAdminClient } from '@/lib/supabase/admin'
import { signAdminJwt, verifyAdminJwt } from './jwt'
import { ADMIN_COOKIE, setAdminCookie, clearAdminCookie } from './session'

export type Admin = {
  id: string
  email: string
  full_name: string | null
}

const SELECT = 'id, email, full_name, password_hash, is_active'

/**
 * Lit le cookie admin_session, vérifie le JWT, retourne l'admin courant (sans le hash).
 * Retourne null si pas de cookie, JWT invalide, ou admin désactivé.
 */
export async function getCurrentAdmin(): Promise<Admin | null> {
  const store     = await cookies()
  const token     = store.get(ADMIN_COOKIE)?.value
  if (!token) return null

  const payload = await verifyAdminJwt(token)
  if (!payload) return null

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('admins')
    .select(SELECT)
    .eq('id', payload.sub)
    .eq('is_active', true)
    .maybeSingle()

  if (error || !data) return null

  return {
    id:        data.id,
    email:     data.email,
    full_name: data.full_name,
  }
}

/**
 * Variante qui redirige vers /admin/login si pas d'admin.
 * À utiliser dans toutes les pages/API server de la zone admin.
 */
export async function requireAdmin(returnTo: string = '/admin/espaces'): Promise<Admin> {
  const admin = await getCurrentAdmin()
  if (!admin) {
    const params = new URLSearchParams({ redirect: returnTo })
    redirect(`/admin/login?${params.toString()}`)
  }
  return admin
}

/**
 * Vérifie les identifiants et connecte l'admin (pose le cookie).
 * Retourne l'admin (sans hash) en cas de succès, null sinon.
 */
export async function loginAdmin(email: string, password: string): Promise<Admin | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('admins')
    .select(SELECT)
    .eq('email', email.toLowerCase().trim())
    .eq('is_active', true)
    .maybeSingle()

  if (error || !data) return null

  const ok = await bcrypt.compare(password, data.password_hash)
  if (!ok) return null

  // Met à jour last_login_at (best effort)
  await supabase
    .from('admins')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', data.id)

  const admin: Admin = {
    id:        data.id,
    email:     data.email,
    full_name: data.full_name,
  }

  const jwt = await signAdminJwt(admin)
  await setAdminCookie(jwt)

  return admin
}

/**
 * Déconnecte l'admin — supprime le cookie.
 */
export async function logoutAdmin(): Promise<void> {
  await clearAdminCookie()
}
