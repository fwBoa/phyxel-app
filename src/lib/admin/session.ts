// Helpers cookie pour la session admin (httpOnly, secure en prod).

import 'server-only'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'admin_session'

function getTtlSeconds(): number {
  const raw = process.env.ADMIN_SESSION_TTL_SECONDS
  const parsed = raw ? Number(raw) : NaN
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 8 * 60 * 60
}

export async function setAdminCookie(jwt: string): Promise<void> {
  const store = await cookies()
  store.set(ADMIN_COOKIE, jwt, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path:     '/',
    maxAge:   getTtlSeconds(),
  })
}

export async function clearAdminCookie(): Promise<void> {
  const store = await cookies()
  store.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path:     '/',
    maxAge:   0,
  })
}
